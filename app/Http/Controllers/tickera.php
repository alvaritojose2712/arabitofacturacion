<?php

namespace App\Http\Controllers;

use App\Models\sucursal;
use App\Models\pedidos;
use App\Models\garantia;


use Illuminate\Http\Request;
use Mike42\Escpos;
use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;

use Response;
use Http;

class tickera extends Controller
{
    public function resetPrintingState(Request $request)
    {
        try {
            $id = $request->id;
            $pedido = pedidos::find($id);
            if ($pedido) {
                $pedido->is_printing = false;
                $pedido->save();
                return Response::json([
                    "msj" => "Estado de impresión reseteado",
                    "estado" => true
                ]);
            }
            return Response::json([
                "msj" => "Pedido no encontrado",
                "estado" => false
            ]);
        } catch (\Exception $e) {
            return Response::json([
                "msj" => "Error: " . $e->getMessage(),
                "estado" => false
            ]);
        }
    }

    /**
     * Obtener cajas/impresoras disponibles
     * GET /api/get-cajas-disponibles
     */
    public function getCajasDisponibles(Request $request)
    {
        try {
            $sucursal = sucursal::all()->first();
            
            if (!$sucursal || !$sucursal->tickera) {
                return Response::json([
                    'success' => false,
                    'message' => 'No hay configuración de impresoras disponible'
                ], 404);
            }

            $arr_printers = explode(";", $sucursal->tickera);
            $cajas = [];

            foreach ($arr_printers as $index => $printer) {
                $cajas[] = [
                    'id' => $index + 1,
                    'nombre' => 'Caja ' . ($index + 1),
                    'impresora' => trim($printer),
                    'descripcion' => 'Impresora: ' . trim($printer)
                ];
            }

            return Response::json([
                'success' => true,
                'cajas' => $cajas,
                'total' => count($cajas)
            ]);

        } catch (\Exception $e) {
            \Log::error('Error obteniendo cajas disponibles', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Response::json([
                'success' => false,
                'message' => 'Error al obtener cajas disponibles: ' . $e->getMessage()
            ], 500);
        }
    }

    public function imprimir(Request $req)
    {
        try {
            \DB::beginTransaction();

            

            function addSpaces($string = '', $valid_string_length = 0) {
                if (strlen($string) < $valid_string_length) {
                    $spaces = $valid_string_length - strlen($string);
                    for ($index1 = 1; $index1 <= $spaces; $index1++) {
                        $string = $string . ' ';
                    }
                }
                return $string;
            }
            
            $get_moneda = (new PedidosController)->get_moneda();
            $moneda_req = $req->moneda;
            //$
            //bs
            //cop
            if ($moneda_req=="$") {
                $dolar = 1;
            }else if($moneda_req=="bs"){
                $dolar = $get_moneda["bs"];
            }else if($moneda_req=="cop"){
                $dolar = $get_moneda["cop"];
            }else{
                $dolar = $get_moneda["bs"];
            }

            $sucursal = sucursal::all()->first();

           
          

                $arr_printers = explode(";", $sucursal->tickera);
                $printer = 1;
                
                if ($req->printer) {
                    $printer = $req->printer-1;
                }

                if(count($arr_printers)==1){
                    $connector = new WindowsPrintConnector($arr_printers[0]);
                }else{
                    $connector = new WindowsPrintConnector($arr_printers[$printer]);
                }
                
                //smb://computer/printer
                $printer = new Printer($connector);
                $printer->setEmphasis(true);
                
                $pedido = (new PedidosController)->getPedido($req,floatval($dolar));

                if (!isset($pedido->items) || empty($pedido->items)) {
                    throw new \Exception("¡El pedido no tiene items, no se puede imprimir!", 1);
                }

                if (isset($pedido->created_at)) {
                    $pedido_date = \Carbon\Carbon::parse($pedido->created_at)->toDateString();
                    $today_date = \Carbon\Carbon::now()->toDateString();
                    if ($pedido_date !== $today_date) {
                        throw new \Exception("¡El pedido no es de hoy, no se puede imprimir!", 1);
                    }
                }

                // Verificar si algún item del pedido tiene 'condicion' diferente de 0
                if (isset($pedido->items)) {
                    foreach ($pedido->items as $item) {
                        if (isset($item['condicion']) && $item['condicion'] != 0) {
                            throw new \Exception("¡No se puede imprimir porque algún item tiene condición diferente de 0!", 1);
                        }
                    }
                }



                if (isset($pedido["estado"])) {
                    if ($pedido["estado"]==2) {
                        throw new \Exception("¡No puede imprimir un anulado!", 1);
                    }
                }
    
                if (isset($pedido["cliente"])) {
                    $nombres = $pedido["cliente"]["nombre"];
                    $identificacion = $pedido["cliente"]["identificacion"];
                }
                if (isset($req->nombres)) {
                    $nombres = $req->nombres;
                }
                if (isset($req->identificacion)) {
                    $identificacion = $req->identificacion;
                }
    
                if ($req->id==="presupuesto") {
                    
                    $printer -> setTextSize(1,1);
        
                    $printer->setEmphasis(true);
                    $printer->text("PRESUPUESTO");
                    $printer->setEmphasis(false);
    
                    $printer -> text("\n");
                    $printer -> text("\n");
        
                    if ($nombres!="") {
                        $printer->setJustification(Printer::JUSTIFY_LEFT);
                        $printer -> text("Nombre y Apellido: ".$nombres);
                        $printer -> text("\n");
                        $printer -> text("ID: ".$identificacion);
                        $printer -> text("\n");
                        $printer->setJustification(Printer::JUSTIFY_LEFT);
    
                    }
                    $totalpresupuesto = 0;
                    foreach ($req->presupuestocarrito as $key => $e) {
    
                        $printer->text($e['descripcion']);
                        $printer->text("\n");
                        $printer->text($e['id']);
                        $printer->text("\n");
    
                        $printer->text(addSpaces("P/U. ",6).moneda($e['precio']*$dolar));
                        $printer->text("\n");
                        
                        $printer->setEmphasis(true);
                        $printer->text(addSpaces("Ct. ",6).$e['cantidad']);
                        $printer->setEmphasis(false);
                        $printer->text("\n");
    
                        $printer->text(addSpaces("SubTotal. ",6).moneda($e['subtotal']*$dolar));
                        $printer->text("\n");
                        $printer->feed();
    
                        $totalpresupuesto += $e['subtotal'];
                    }
    
                    $printer->text("Total: ".moneda($totalpresupuesto*$dolar));
                    $printer->text("\n");
                    $printer->text("\n");
                    $printer->text("\n");
    
                }else{

                    // Obtener el pedido y bloquearlo para actualización
                    $pedidoBlock = pedidos::where('id', $req->id)->lockForUpdate()->first();
                    
                    if (!$pedidoBlock) {
                        throw new \Exception("Pedido no encontrado", 1);
                    }

                    // Verificar si el pedidoBlock ya está siendo impreso
                    if ($pedidoBlock->is_printing) {
                        // Si ha pasado más de 2 minutos desde la última actualización, asumimos que hubo un error
                        $lastUpdate = strtotime($pedidoBlock->updated_at);
                        $now = time();
                        if (($now - $lastUpdate) > 120) { // 120 segundos = 2 minutos
                            $pedidoBlock->is_printing = false;
                            $pedidoBlock->save();
                        } else {
                            throw new \Exception("El pedido está siendo impreso en este momento", 1);
                        }
                    }

                    // Marcar el pedidoBlock como en proceso de impresión
                    $pedidoBlock->is_printing = true;
                    $pedidoBlock->save();
    
                    if (!(new PedidosController)->checksipedidoprocesado($req->id)) {
                        throw new \Exception("¡Debe procesar el pedido para imprimir!", 1);
                    }
                    $fecha_creada = date("Y-m-d",strtotime($pedido->created_at));
                    $today = (new PedidosController)->today();
    
                    if ($fecha_creada != $today || ($fecha_creada == $today && $pedido->ticked)) {
                        $isPermiso = (new TareaslocalController)->checkIsResolveTarea([
                            "id_pedido" => $req->id,
                            "tipo" => "tickera",
                        ]);
                        if ((new UsuariosController)->isAdmin()) {
                            // Avanza
                        }elseif($isPermiso["permiso"]){
                            if ($isPermiso["valoraprobado"]==1) {
                                // Avanza
                            }else{
                                throw new \Exception("Error: Valor no aprobado");
                            }
                        }else{
                            $nuevatarea = (new TareaslocalController)->createTareaLocal([
                                "id_pedido" =>  $req->id,
                                "valoraprobado" => 1,
                                "tipo" => "tickera",
                                "descripcion" => "Solicitud de Reimpresion COPIA",
                            ]);
                            if ($nuevatarea) {
                                \DB::commit();
                                return Response::json(["id_tarea"=>$nuevatarea->id,"msj"=>"Debe esperar aprobacion del Administrador","estado"=>false]);
                            }
                        }
                    }
                    
    
    
    
                    if ($nombres=="precio" && $identificacion=="precio") {
                        if($pedido->items){
        
                            foreach ($pedido->items as $val) {
        
                                if (!$val->producto) {
                                    $items[] = [
                                        'descripcion' => $val->abono,
                                        'codigo_barras' => 0,
                                        'pu' => $val->monto,
                                        'cantidad' => $val->cantidad,
                                        'totalprecio' => $val->total,
                                       
                                    ];
                                }else{
        
                                    $items[] = [
                                        'descripcion' => $val->producto->descripcion,
                                        'codigo_barras' => $val->producto->codigo_barras,
                                        'pu' => $val->producto->precio,
                                        'cantidad' => $val->cantidad,
                                        'totalprecio' => $val->total,
                                       
                                    ];
                                }
                            }
                        }
                        $printer->setJustification(Printer::JUSTIFY_CENTER);
                       
                        foreach ($items as $item) {
        
                            $printer->setEmphasis(true);
                            $printer->text("\n");
                            $printer->text($item['codigo_barras']);
                            $printer->setEmphasis(false);
                            $printer->text("\n");
                            $printer->text($item['descripcion']);
                            $printer->text("\n");
        
                            $printer->setEmphasis(true);
        
                            $printer->text($item['pu']);
                            $printer->setEmphasis(false);
                            
                            $printer->text("\n");
        
                            $printer->feed();
                        }
    
                    }else{
        
                        
    
    
    
                        ////TICKET DE GARANTIA
                        
                        foreach ($pedido->items as $val) {
        
                            if (!$val->producto) {
                               
                            }else{
    
                                if ($val->condicion==1) {
                                    $printer -> text("-------------------------------");
    
                                    $printer -> text("\n");
                                    $ga = garantia::where("id_pedido",$val->id_pedido)->where("id_producto",$val->id_producto)->first();
                                    
                                    $printer->setEmphasis(true);
                                    $printer->setJustification(Printer::JUSTIFY_CENTER);
                                    $printer->text("TICKED DE GARANTIA");
                                    $printer->setEmphasis(false);
                                    $printer -> text("\n");
                                    $printer->setJustification(Printer::JUSTIFY_LEFT);
                                    $printer -> text("#FACTURA ORIGINAL: ".$ga->numfactoriginal);
                                    $printer -> text("\n");
                                    $printer -> text("#TICKET DE GARANTIA: ".$ga->id_pedido);
                                    $printer -> text("\n");
                                    $printer -> text("CLIENTE: ".$ga->nombre_cliente." (".$ga->ci_cliente.")" );
                                    $printer -> text("\n");
                                    $printer -> text("TELÉFONO CLIENTE: ".$ga->telefono_cliente );
                                    $printer -> text("\n");
                                    $printer -> text("AUTORIZÓ: ".$ga->nombre_autorizo." (".$ga->ci_autorizo.")" );
                                    $printer -> text("\n");
                                    $printer -> text("CAJERO: ".$ga->nombre_cajero." (".$ga->ci_cajero.")" );
                                    $printer -> text("\n");
                                    $printer -> text("\n");
    
    
                                    $printer->text("PRODUCTO");
                                    $printer->text("\n");
                                    $printer->text($val["producto"]['descripcion']);
                                    $printer->text("\n");
                                    $printer->text($val["producto"]['codigo_barras']);
                                    $printer->text("\n");
                    
                    
                                    $printer->text(addSpaces("P/U. ",6).$val["producto"]['pu']);
                                    $printer->text("\n");
                                    
                                    $printer->setEmphasis(true);
                                    $printer->text(addSpaces("Ct. ",6).$val['cantidad']);
                                    $printer->setEmphasis(false);
                                    $printer->text("\n");
                                    $printer->text("\n");
                                    $printer->text("MOTIVO: ".$ga->motivo);
                                    $printer->text("\n");
                                    $printer->text("DIAS DESDE COMPRA: ".$ga->dias_desdecompra);
                                    $printer -> text("\n");
                                    
                                    $printer->setEmphasis(true);
                                    $printer->setJustification(Printer::JUSTIFY_CENTER);
                                    $printer->text("FECHA DE CREACIÓN");
                                    $printer -> text("\n");
                                    $printer->text(date("Y-m-d H:i:s"));
                                    $printer->setEmphasis(false);
    
                                    $printer -> text("\n");
                                    $printer -> text("-------------------------------");
                                    $printer -> text("\n");
                                    $printer -> text("\n");
                                }
                            }
                        }
                        ////NOTA DE GARANTIA
    
    
    
                       
    
                       $printer->setJustification(Printer::JUSTIFY_CENTER);
        
                        // $tux = EscposImage::load(resource_path() . "/images/logo-small.jpg", false);
                        // $printer -> bitImage($tux);
                        // $printer->setEmphasis(true);
        
                        // $printer->text("\n");
                        $printer->setJustification(Printer::JUSTIFY_CENTER);
                        
                        $printer -> text("\n");
                        $printer -> text($sucursal->nombre_registro);
                        $printer -> text("\n");
                        $printer -> text($sucursal->rif);
                        $printer -> text("\n");
                        $printer -> text($sucursal->telefono1." | ".$sucursal->telefono2);
                        $printer -> text("\n");
        
                        $printer -> setTextSize(1,1);
        
                        $printer->setEmphasis(true);
                       
                        $printer -> text("\n");
                        if (!$pedido->ticked) {
                            $printer->setTextSize(2,2);
                            $printer->setEmphasis(true);
                            $printer->text("ORIGINAL");
                        } else {
                            $printer->setTextSize(1,1);
                            $printer->setEmphasis(true); 
                            $printer->text("COPIA " . $pedido->ticked);
                        }
                        $printer->setEmphasis(false);
                        $printer->setTextSize(1,1);
                        $printer -> text("\n");
                        $printer->text("ORDEN DE DESPACHO");
                        $printer -> text("\n");
                        $printer->text($sucursal->sucursal);
                        $printer -> text("\n");
                        $printer -> text("#".$pedido->id);
                        $printer->setEmphasis(false);
        
                        $printer -> text("\n");
        
                        if ($nombres!="") {
                            $printer->setJustification(Printer::JUSTIFY_LEFT);
                            $printer -> text("Nombre y Apellido: ".$nombres);
                            $printer -> text("\n");
                            $printer -> text("ID: ".$identificacion);
                            $printer -> text("\n");
                            $printer->setJustification(Printer::JUSTIFY_LEFT);
        
                            // $printer -> text("Teléfono: ".$tel);
                            // $printer -> text("\n");
                            // $printer->setJustification(Printer::JUSTIFY_LEFT);
        
                            // $printer -> text("Direccion: ".$dir);
                            // $printer -> text("\n");
                            // $printer->setJustification(Printer::JUSTIFY_LEFT);
        
        
                        }
        
                        $printer->feed();
                        $printer->setPrintLeftMargin(0);
                        $printer->setJustification(Printer::JUSTIFY_LEFT);
                        $printer->setEmphasis(true);
                        $printer->setEmphasis(false);
                        $items = [];
                        $monto_total = 0;
        
                        if($pedido->items){
        
                            foreach ($pedido->items as $val) {
        
                                if (!$val->producto) {
                                    $items[] = [
                                        'descripcion' => $val->abono,
                                        'codigo_barras' => 0,
                                        'pu' => $val->monto,
                                        'cantidad' => $val->cantidad,
                                        'totalprecio' => $val->total,
                                       
                                    ];
                                }else{
        
                                    $items[] = [
                                        'descripcion' => $val->producto->descripcion,
                                        'codigo_barras' => $val->producto->codigo_barras,
                                        'pu' => ($val->descuento<0)?number_format($val->producto->precio-$val->des_unitario,3):$val->producto->precio,
                                        'cantidad' => $val->cantidad,
                                        'totalprecio' => $val->total,
                                    ];
                                }
                            }
                        }
                       
                        foreach ($items as $item) {
        
                            //Current item ROW 1
                           $printer->text($item['descripcion']);
                           $printer->text("\n");
                           $printer->text($item['codigo_barras']);
                           $printer->text("\n");
        
        
                           // Configurar ancho de columnas para ticket de 58mm
                           $printer->setTextSize(1, 1);
                           $printer->text("P/U:".$item['pu']."  Tot:".$item['totalprecio']);
                           $printer->text("\n");
                           
                           // Imprimir Ct pequeño y cantidad grande
                           $printer->setTextSize(1, 1);
                           $printer->text("Ct:");
                           $printer->setTextSize(2, 1);
                           // Formatear cantidad: si tiene decimales, mostrar 2 decimales; si no, solo entero
                           $cantidad = $item['cantidad'];
                           if (is_numeric($cantidad) && floor($cantidad) != $cantidad) {
                               $printer->text(number_format($cantidad, 2));
                           } else {
                               $printer->text((int)$cantidad);
                           }
                           $printer->text("\n");
                           $printer->setTextSize(1, 1);

        
        
        
                            $printer->feed();
                        }


                        // Método de pago
                        if (isset($pedido->pagos) && !empty($pedido->pagos)) {
                            
                            $printer->setEmphasis(true);
                            $printer->text("Método de Pago: ");
                            $printer->setEmphasis(false);
                            $printer->text("\n");
                            foreach ($pedido->pagos as $pago) { 
                                $printer->text((new tickera)->getTipoPagoDescripcion($pago->tipo).": ".moneda($pago->monto));
                                $printer->text("\n");
                            }
                        }
                        $printer->text("\n");
                        $printer->setEmphasis(true);
                        
        
                        $printer->text("Desc: ".$pedido->total_des);
                        $printer->text("\n");
                        $printer->text("Sub-Total: ". number_format($pedido->clean_total,2) );
                        $printer->text("\n");
                        $printer->text("Total: ".$pedido->total);
                        $printer->text("\n");
                        
                        
                        $printer->text("\n");
                        
                        $printer->text("\n");
                        $printer->setJustification(Printer::JUSTIFY_CENTER);
                        
                        $printer->text("Creado: ".$pedido->created_at);
                        $printer->text("\n");
                        $printer->text("Por: ".session("usuario") ?? $pedido->vendedor->usuario);
                        //////////////////////
    
     /* 
                        $printer->text("\n");
                        $printer->setJustification(Printer::JUSTIFY_CENTER);
                        $printer->setBarcodeHeight(50);
                        $printer->setBarcodeWidth(4); // Increased width for 58mm paper
                       try {
                            $printer->barcode($pedido->id, Printer::BARCODE_CODE39);
                        } catch(\Exception $e) {
                            $printer->text($pedido->id);
                        } */
                        
    
                        ///////////////
                        $printer->text("\n");
                        $printer->text("*ESTE RECIBO ES SOLO PARA");
                        $printer->text("\n");
                        $printer->text("VERIFICAR; EXIJA FACTURA FISCAL*");
                        $printer->text("\n");

                        $printer->text("\n");
    
    
                        
                        $printer->text("\n");
    
                        $updateprint = pedidos::find($pedido->id);
                        $updateprint->ticked = !$updateprint->ticked ? 1 : $updateprint->ticked + 1;
                        $updateprint->is_printing = false; // Marcar como no imprimiendo
                        $updateprint->save();
    
                    }
                }
    
                $printer->cut();
                $printer->pulse();
                $printer->close();

                \DB::commit();

                return Response::json([
                    "msj"=>"Imprimiendo...",
                    "estado"=>true,
                    "printerpulse()" => $printer->pulse(),
                    "printerclose()" => $printer->close(),
                ]);
            

        } catch (\Exception $e) {
            // En caso de error, asegurarse de marcar el pedido como no imprimiendo
            $pedidoBlock = pedidos::where('id', $req->id)->lockForUpdate()->first();

            if (isset($pedidoBlock)) {
                $pedidoBlock->is_printing = false;
                $pedidoBlock->save();
            }
            \DB::rollback();
            return Response::json([
                "msj" => "Error: " . $e->getMessage(),
                "estado" => false
            ]);
        }
    }
    function sendFiscalTerminal($parametros,$type,$file,$caja_force=null) {
        $codigo_origen = (new sendCentral)->getOrigen();
        $caja = $caja_force!==null?$caja_force:session("usuario");
        
        //$path = "C:/IntTFHKA/IntTFHKA.exe";
        $parametros = [
            'parametros' => $parametros,
            'type' => $type,
            'file' => $file,
        ];
        $response = null;
        $ipReal = null;


        if ($caja_force) {
            $ipReal = gethostbyname($caja_force);
        }
        if($codigo_origen=="carora"){
            //if ($caja=="caja1"||$caja=="caja2") {
                $nombre_equipo = "caja3";
                $ipReal = gethostbyname($nombre_equipo);
                $response = Http::timeout(3)->post("http://$ipReal:3000/fiscal", $parametros);
            //}
        }
        if($codigo_origen=="elsombrero"){
            //if ($caja=="caja1"||$caja=="caja2") {
                $nombre_equipo = "caja1";
                $ipReal = gethostbyname($nombre_equipo);
                $response = Http::timeout(3)->post("http://$ipReal:3000/fiscal", $parametros);
            //}
        }
        if($codigo_origen=="sansebastian"){
                //if ($caja=="caja1"||$caja=="caja2") {
                $nombre_equipo = "caja2";
                $ipReal = gethostbyname($nombre_equipo);
                $response = Http::timeout(3)->post("http://$ipReal:3000/fiscal", $parametros);
                \Log::info('Respuesta de Fiscal Terminal', [
                    'response' => $response->body()
                ]);
                \Log::info('Respuesta de Fiscal Terminal', $parametros);
            //}
        }
        if($codigo_origen=="turen"){
            if ($caja=="caja3"||$caja=="caja4") {
                $nombre_equipo = "caja3";
                $ipReal = gethostbyname($nombre_equipo);
            }
            if ($caja=="caja1"||$caja=="caja2") {
                $nombre_equipo = "caja2";
                $ipReal = gethostbyname($nombre_equipo);
            }
            $response = Http::timeout(3)->post("http://$ipReal:3000/fiscal", $parametros);
        }
        if($codigo_origen=="anaco"){
            if ($caja=="caja3"||$caja=="caja4") {
                $nombre_equipo = "caja3";
                $ipReal = gethostbyname($nombre_equipo);
            }
            if ($caja=="caja1"||$caja=="caja2") {
                $nombre_equipo = "caja2";
                //$nombre_equipo = "ospino";
                $ipReal = gethostbyname($nombre_equipo);
            }
            
            $response = Http::timeout(3)->post("http://$ipReal:3000/fiscal", $parametros);
            \Log::info('Respuesta de Fiscal Terminal', [
                'response' => $response->body()
            ]);
        }
        
        //shell_exec("C:/IntTFHKA/IntTFHKA.exe ".$parametros);
       
        /* $ipCliente = request()->ip();
        $ipReal = request()->header('X-Forwarded-For') ?? $ipCliente; */


        

        if ($response!==null) {
            if ($response->successful()) {
                return response()->json(['status' => 'ok '.$ipReal]);
            } else {
                return response()->json(['status' => 'error', 'message' => 'No se pudo contactar al cliente'], 500);
            }
        }


    }

    function reportefiscal(Request $req) {
        $type = $req->type;
        $numReporteZ = $req->numReporteZ;
        $caja = $req->caja;

        if (!$numReporteZ) {
            if ($type=="x") {
                $cmd = "I0X";
            }else if($type=="z"){
                $cmd = "I0Z";
            }
        }else{
            $cmd = "I3A".str_pad($numReporteZ, 6, '0', STR_PAD_LEFT).str_pad($numReporteZ, 6, '0', STR_PAD_LEFT);
        }

        $sentencia = $cmd;

        $this->sendFiscalTerminal($sentencia,"reportefiscal","",$caja);

        $rep = ""; 
        /* $repuesta = file('C:/IntTFHKA/Retorno.txt');
        $lineas = count($repuesta);
        for($i=0; $i < $lineas; $i++)
        {
            $rep = $repuesta[$i];
        }  */
        return $rep;
    }

    function sendReciboFiscal(Request $req) {
        $id = $req->pedido;

        return $this->sendReciboFiscalFun($id);
        
    }

    function sendNotaCredito(Request $req) {
        $id = $req->pedido;
        $numfact = $req->numfact;
        $serial = $req->serial;

        if (!(new PedidosController)->checksipedidoprocesado($id)) {
            throw new \Exception("¡Debe procesar el pedido para imprimir!", 1);
        }
        $get_moneda = (new PedidosController)->get_moneda();
        $cop = $get_moneda["cop"];
        $bs = $get_moneda["bs"];
        $pedido = (new PedidosController)->getPedidoFun($id, "todos", $cop, $bs, $bs);

        $devolucion = true;
        if ($pedido->fiscal) {
    
           
            
    
    
                /*  $factura = array(
                0 => "!000000100000001000Harina\n",
                1 => "!000000150000001500Jamon\n",
                2 => '"000000205000003000Patilla\n',
                3 => "#000005000000001000Caja de Whisky\n",
                4 => "101"); */
    
                $factura = [];
                $nombre = $pedido->cliente->nombre;
                $identificacion = $pedido->cliente->identificacion;
                $direccion = $pedido->cliente->direccion;
                $telefono = $pedido->cliente->telefono;
                $fecha = date("d-m-Y", strtotime(substr($pedido->created_at,0,10)));

                
                	

              
                    array_push($factura,("iS*".$nombre."\n"));
                    array_push($factura,("iR*".$identificacion."\n"));
                    array_push($factura,("i03Direccion: ".$direccion."\n"));
                    array_push($factura,("i04Telefono: ".$telefono."\n"));
                    
                    
                    
                    
                    /*  iF*00000000001
                    iD*14-07-2015
                    iI*ZPA2000343
                    ACOMENTARIO NOTA DE CREDITO */
                    
               
                array_push($factura,("iF*". str_pad($numfact, 11, '0', STR_PAD_LEFT) ."\n"));
                array_push($factura,("iD*".$fecha."\n"));
                array_push($factura,("iI*".$serial."\n"));
                array_push($factura,"i05Caja: ".($pedido->vendedor->usuario)." - ".$id."\n" );



    
                //iS*Dany Mendez
                //iR*14.547.292
                //i03Direccion: Ppal de la Urbina
                //i04Telefono: (0212) 555-55-55
    
                foreach ($pedido->items as $val) {
    
                    $items[] = [
                        'descripcion' => str_replace("\\"," ",$val->producto->descripcion),
                        'codigo_barras' => $val->producto->codigo_barras,
                        'pu' => $val->producto->precio,
                        'cantidad' => $val->cantidad,
                        'totalprecio' => $val->total,
                    
                    ];
    
                    $precioFull = $val->producto->iva!=0?($val->producto->precio/1.16):$val->producto->precio;
                    if ($val->descuento) {
                        $precioFull = $precioFull * (1 - ($val->descuento/100));
                    }
                    if ($devolucion) {
                        //Es devolucion
                        $exentogravable = floatval($val->producto->iva)?"d1":"d0";
                        
                    }else{
                        $exentogravable = floatval($val->producto->iva)?"!":" ";
                    }
                    // 000000100 000001000
                    
                    $precio = str_pad(number_format($precioFull, 2, '', ''), 10, '0', STR_PAD_LEFT);
                    $ct = str_pad(number_format($val->cantidad, 3, '', ''), 8, '0', STR_PAD_LEFT);
                    $desc = $val->producto->descripcion;
                    
                    
                    array_push($factura,$exentogravable.$precio."$ct".$desc."\n");
                    /* if (floatval($val->descuento)) {
                        array_push($factura, number_format($val->descuento, 2, '', '')."\n");
                    } */
                }
                array_push($factura,"101");
                
                if ($devolucion) {
                    $file = "C:/IntTFHKA/CREDITO.txt";	
                }else{
                    $file = "C:/IntTFHKA/Factura.txt";	
                }
               
    
                $this->sendFiscalTerminal(json_encode($factura),"notacredito",$file);
    
                $rep = ""; 
                /* $repuesta = file('C:/IntTFHKA/Retorno.txt');
                $lineas = count($repuesta);
                for($i=0; $i < $lineas; $i++){
                    $rep = $repuesta[$i];
                }  */
                
                $updateprint = pedidos::find($id);
                $updateprint->fiscal = 1;
                $updateprint->save();
                
                return Response::json([
                    "msj"=>"Imprimiendo Nota de Crédito...".$rep,
                    "estado"=>true,
                ]);
        } 
    }

    function sendReciboFiscalFun($id) {
        if (!(new PedidosController)->checksipedidoprocesado($id)) {
            throw new \Exception("¡Debe procesar el pedido para imprimir!", 1);
        }
        $get_moneda = (new PedidosController)->get_moneda();
        $cop = $get_moneda["cop"];
        $bs = $get_moneda["bs"];
        $pedido = (new PedidosController)->getPedidoFun($id, "todos", $cop, $bs, $bs);

        $devolucion = false;
        if (!$pedido->fiscal) {
    
           
            
    
    
                /*  $factura = array(
                0 => "!000000100000001000Harina\n",
                1 => "!000000150000001500Jamon\n",
                2 => '"000000205000003000Patilla\n',
                3 => "#000005000000001000Caja de Whisky\n",
                4 => "101"); */
    
                $factura = [];
                $nombre = $pedido->cliente->nombre;
                $identificacion = $pedido->cliente->identificacion;
                $direccion = $pedido->cliente->direccion;
                $telefono = $pedido->cliente->telefono;

                if ($nombre!="CF") {
                    array_push($factura,("iS*".$nombre."\n"));
                    array_push($factura,("iR*".$identificacion."\n"));
                    array_push($factura,("i03Direccion: ".$direccion."\n"));
                    array_push($factura,("i04Telefono: ".$telefono."\n"));
                }else{
                   /*  return Response::json([
                        "msj"=>"Error: Debe personalizar la factura",
                        "estado"=>false,
                    ]); */
                }
                array_push($factura,"i05Caja: ".($pedido->vendedor->usuario)." - ".$id."\n" );



    
                //iS*Dany Mendez
                //iR*14.547.292
                //i03Direccion: Ppal de la Urbina
                //i04Telefono: (0212) 555-55-55
    
                foreach ($pedido->items as $val) {
    
                    $items[] = [
                        'descripcion' => str_replace("\\"," ",$val->producto->descripcion),
                        'codigo_barras' => $val->producto->codigo_barras,
                        'pu' => $val->producto->precio,
                        'cantidad' => $val->cantidad,
                        'totalprecio' => $val->total,
                    
                    ];
    
                    $precioFull = $val->producto->iva!=0?($val->producto->precio/1.16):$val->producto->precio;
                    if ($val->descuento) {
                        $precioFull = $precioFull * (1 - ($val->descuento/100));
                    }
                    if ($devolucion) {
                        //Es devolucion
                        $exentogravable = floatval($val->producto->iva)?"d1":"d0";
                        
                    }else{
                        $exentogravable = floatval($val->producto->iva)?"!":" ";
                    }
                    // 000000100 000001000
                    
                    $precio = str_pad(number_format($precioFull, 2, '', ''), 10, '0', STR_PAD_LEFT);
                    $ct = str_pad(number_format($val->cantidad, 3, '', ''), 8, '0', STR_PAD_LEFT);
                    $desc = $val->producto->descripcion;
                    
                    
                    array_push($factura,$exentogravable.$precio."$ct".$desc."\n");
                  /*   if (floatval($val->descuento)) {
                        array_push($factura, number_format($val->descuento, 2, '', '')."\n");
                    } */
                }
                array_push($factura,"101");
    
                $file = "C:/IntTFHKA/Factura.txt";	
                
    
                $this->sendFiscalTerminal(json_encode($factura),"factura",$file);
    
                $rep = ""; 
               /*  $repuesta = file('C:/IntTFHKA/Retorno.txt');
                $lineas = count($repuesta);
                for($i=0; $i < $lineas; $i++){
                    $rep = $repuesta[$i];
                }  */
                
                $updateprint = pedidos::find($id);
                $updateprint->fiscal = 1;
                $updateprint->save();
                
                return Response::json([
                    "msj"=>"Imprimiendo Factura Fiscal...".$rep,
                    "estado"=>true,
                ]);
        }else{
            return Response::json([
                "msj"=> "Error: Ya se ha impreso Factura Fiscal",
                "estado"=>false,
            ]);
        }
    }
    
    /**
     * Imprimir ticket de garantía
     * POST /api/imprimir-ticket-garantia
     */
    public function imprimirTicketGarantia(Request $request)
    {
        try {
            \DB::beginTransaction();

            // Validar datos requeridos
            $validator = \Validator::make($request->all(), [
                'solicitud_id' => 'required|integer',
                'printer' => 'nullable|integer'
            ]);

            if ($validator->fails()) {
                return Response::json([
                    'success' => false,
                    'message' => 'Datos inválidos: ' . $validator->errors()->first()
                ], 422);
            }

            $solicitudId = $request->solicitud_id;
            $printerIndex = $request->printer ?? 1;

            // Obtener datos de la solicitud desde central
            $sendCentral = new \App\Http\Controllers\sendCentral();
            $consultaResult = $sendCentral->getGarantiaFromCentral($solicitudId);

            if (!$consultaResult['success']) {
                return Response::json([
                    'success' => false,
                    'message' => 'Error al consultar solicitud: ' . $consultaResult['message']
                ], 404);
            }

            $solicitud = $consultaResult['data'];

            // Verificar que la solicitud esté finalizada
            if ($solicitud['estatus'] !== 'FINALIZADA') {
                return Response::json([
                    'success' => false,
                    'message' => 'Solo se pueden imprimir tickets de solicitudes finalizadas'
                ], 422);
            }

            // Verificar que el pedido de insucursal esté procesado (estado 1)
            if (!empty($solicitud['id_pedido_insucursal'])) {
                $pedidoInsucursal = \App\Models\pedidos::find($solicitud['id_pedido_insucursal']);
                if (!$pedidoInsucursal || $pedidoInsucursal->estado != 1) {
                    return Response::json([
                        'success' => false,
                        'message' => 'Solo se pueden imprimir tickets cuando el pedido esté procesado (estado 1)'
                    ], 422);
                }
            }

            // Obtener número de impresión y tipo
            $numeroImpresion = \App\Models\GarantiaTicketImpresion::getNextPrintNumber($solicitudId);
            $tipoImpresion = \App\Models\GarantiaTicketImpresion::getTipoImpresion($numeroImpresion);

            // Obtener datos de pago si existe id_pedido_insucursal
            $datosPago = [];
            if (!empty($solicitud['id_pedido_insucursal'])) {
                $datosPago = $this->obtenerDatosPago($solicitud['id_pedido_insucursal']);
            }

            // Obtener detalles de la factura original
            $datosFacturaOriginal = [];
            \Log::info('Verificando factura_venta_id', [
                'factura_venta_id' => $solicitud['factura_venta_id'] ?? 'NO EXISTE',
                'solicitud_keys' => array_keys($solicitud)
            ]);
            
            if (!empty($solicitud['factura_venta_id'])) {
                $datosFacturaOriginal = $this->obtenerDatosFacturaOriginal($solicitud['factura_venta_id']);
                \Log::info('Resultado obtención factura', [
                    'datos_obtenidos' => !empty($datosFacturaOriginal),
                    'cantidad_productos' => count($datosFacturaOriginal['productos'] ?? [])
                ]);
            } else {
                \Log::warning('No se encontró factura_venta_id en la solicitud');
            }

            // Configurar impresora
            $sucursal = \App\Models\sucursal::all()->first();
            $arr_printers = explode(";", $sucursal->tickera);
            
            if (count($arr_printers) == 1) {
                $connector = new WindowsPrintConnector($arr_printers[0]);
            } else {
                $printerIndex = min($printerIndex - 1, count($arr_printers) - 1);
                $connector = new WindowsPrintConnector($arr_printers[$printerIndex]);
            }

            $printer = new Printer($connector);
            // Imprimir ticket
            $this->imprimirTicketGarantia58mm($printer, $solicitud, $datosPago, $datosFacturaOriginal, $tipoImpresion, $numeroImpresion, $sucursal);

            // Registrar impresión en base de datos
            \App\Models\GarantiaTicketImpresion::create([
                'solicitud_garantia_id' => $solicitudId,
                'usuario_id' => session('id_usuario'),
                'tipo_impresion' => $tipoImpresion,
                'numero_impresion' => $numeroImpresion,
                'datos_impresion' => [
                    'solicitud' => $solicitud,
                    'datos_pago' => $datosPago,
                    'sucursal' => [
                        'nombre_registro' => $sucursal->nombre_registro,
                        'rif' => $sucursal->rif,
                        'telefono1' => $sucursal->telefono1,
                        'telefono2' => $sucursal->telefono2,
                        'sucursal' => $sucursal->sucursal
                    ],
                    'usuario_impresion' => [
                        'id' => session('id_usuario'),
                        'nombre' => session('nombre_usuario'),
                        'ip' => $request->ip()
                    ]
                ],
                'fecha_impresion' => now(),
                'ip_impresion' => $request->ip(),
                'observaciones' => 'Ticket impreso desde GarantiaList - Solicitud Finalizada'
            ]);

            \DB::commit();

            return Response::json([
                'success' => true,
                'message' => 'Ticket de garantía impreso exitosamente',
                'tipo_impresion' => $tipoImpresion,
                'numero_impresion' => $numeroImpresion
            ]);

        } catch (\Exception $e) {
            \DB::rollback();
            
            \Log::error('Error imprimiendo ticket de garantía', [
                'solicitud_id' => $request->solicitud_id ?? 'N/A',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Response::json([
                'success' => false,
                'message' => 'Error al imprimir ticket: ' . $e->getMessage(). " - ".$e->getLine()
            ], 500);
        }
    }

    /**
     * Imprimir ticket de garantía en formato 58mm
     */
    private function imprimirTicketGarantia58mm($printer, $solicitud, $datosPago, $datosFacturaOriginal, $tipoImpresion, $numeroImpresion, $sucursal)
    {
        // Función helper para formatear texto en 58mm
        function formatText58mm($text, $maxLength = 32) {
            if (strlen($text) <= $maxLength) {
                return $text;
            }
            return substr($text, 0, $maxLength - 3) . '...';
        }

        // Función helper para formatear montos compactos
        function formatMonto($monto) {
            if ($monto >= 1000000) {
                return number_format($monto / 1000000, 1) . 'M';
            } elseif ($monto >= 1000) {
                return number_format($monto / 1000, 1) . 'K';
            } else {
                return number_format($monto, 0);
            }
        }

        // Función helper para formatear fechas compactas
        function formatFecha($fecha) {
            return date('d/m/Y H:i', strtotime($fecha));
        }
        // Configurar formato para 58mm
        $printer->setTextSize(1, 1);
        $printer->setJustification(Printer::JUSTIFY_CENTER);

        // Membrete de la empresa (igual que en función imprimir)
        $printer->text("\n");
        $printer->text($sucursal->nombre_registro);
        $printer->text("\n");
        $printer->text($sucursal->rif);
        $printer->text("\n");
        $printer->text($sucursal->telefono1 . " | " . $sucursal->telefono2);
        $printer->text("\n");

        $printer->setTextSize(1, 1);
        $printer->setEmphasis(true);

        // Encabezado con tipo de impresión
        $printer->text("\n");
        if ($tipoImpresion === 'ORIGINAL') {
            $printer->setTextSize(2, 2);
            $printer->setEmphasis(true);
            $printer->text("ORIGINAL");
        } else {
            $printer->setTextSize(1, 1);
            $printer->setEmphasis(true);
            $printer->text("COPIA " . ($numeroImpresion - 1));
        }
        $printer->setEmphasis(false);
        $printer->setTextSize(1, 1);
        $printer->text("\n");
        $printer->text("TICKET DE GARANTÍA");
        $printer->text("\n");
        
        // Información de sucursal más prominente
        $printer->setEmphasis(true);
        $printer->text("SUCURSAL: " . $sucursal->sucursal);
        $printer->setEmphasis(false);
        $printer->text("\n");
        $printer->text("Solicitud #" . $solicitud['id']);
        $printer->text("\n");
        if (!empty($solicitud['id_pedido_insucursal'])) {
            $printer->text("Pedido #" . $solicitud['id_pedido_insucursal']);
            $printer->text("\n");
        }

        // Información del cliente (formato similar a función imprimir)
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text("Nombre y Apellido: " . $solicitud['cliente']['nombre'] . " " . $solicitud['cliente']['apellido']);
        $printer->text("\n");
        $printer->text("ID: " . $solicitud['cliente']['cedula']);
        $printer->text("\n");
        $printer->text("Teléfono: " . ($solicitud['garantia_data']['cliente']['telefono'] ?? 'N/A'));
        $printer->text("\n");
        $printer->text("Dirección: " . ($solicitud['garantia_data']['cliente']['direccion'] ?? 'N/A'));
        $printer->text("\n");
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text("\n");

        // Información de la factura original
        if (!empty($datosFacturaOriginal)) {
            $printer->setEmphasis(true);
            $printer->text("FACTURA ORIGINAL VALIDADA:");
            $printer->setEmphasis(false);
            $printer->text("\n");
            $printer->text("Factura #" . $datosFacturaOriginal['numero_factura']);
            $printer->text("\n");
            $printer->text("Fecha: " . formatFecha($datosFacturaOriginal['fecha_factura']));
            $printer->text("\n");
            $printer->text("Total: $" . formatMonto($datosFacturaOriginal['total_factura']));
            $printer->text("\n");
            
            // Productos de la factura original (mostrar todos)
            if (!empty($datosFacturaOriginal['productos'])) {
                $printer->text("Productos originales:");
                $printer->text("\n");
                foreach ($datosFacturaOriginal['productos'] as $producto) {
                    $printer->text("• " . formatText58mm($producto['descripcion'], 20));
                    $printer->text("\n");
                    $printer->text("  x" . $producto['cantidad'] . " $" . formatMonto($producto['precio_unitario']) . " = $" . formatMonto($producto['subtotal']));
                    $printer->text("\n");
                }
            }

            // Datos de pago de la factura original
            if (!empty($datosFacturaOriginal['pagos'])) {
                $printer->text("Pagos originales:");
                $printer->text("\n");
                foreach ($datosFacturaOriginal['pagos'] as $pago) {
                    $printer->text("• " . $pago['tipo_descripcion'] . " $" . formatMonto($pago['monto']) . " " . $pago['moneda']);
                    if (!empty($pago['referencia'])) {
                        $printer->text(" (Ref:" . formatText58mm($pago['referencia'], 8) . ")");
                    }
                    $printer->text("\n");
                }
            }
            $printer->text("═══════════════════════════\n");
        }

        // Métodos de pago de la devolución (se mostrarán en la sección de totales)

        // Caso de uso y sucursal
        $printer->setEmphasis(true);
        $printer->text("CASO DE USO: " . $this->getCasoUsoDescription($solicitud['caso_uso']));
        $printer->setEmphasis(false);
        $printer->text("\n");
        $printer->text("Sucursal: " . $sucursal->sucursal);
        $printer->text("\n");
        $printer->text("\n");

        // Información de responsables
        $printer->setEmphasis(true);
        $printer->text("RESPONSABLES:");
        $printer->setEmphasis(false);
        $printer->text("\n");
        $printer->text("Cajero: " . $solicitud['cajero']['nombre'] . " " . $solicitud['cajero']['apellido']);
        $printer->text("\n");
        $printer->text("(" . $solicitud['cajero']['cedula'] . ")");
        $printer->text("\n");
        $printer->text("GERENTE: " . $solicitud['supervisor']['nombre'] . " " . $solicitud['supervisor']['apellido']);
        $printer->text("\n");
        $printer->text("(" . $solicitud['supervisor']['cedula'] . ")");
        $printer->text("\n");
        $printer->text("DICI: " . $solicitud['dici']['nombre'] . " " . $solicitud['dici']['apellido']);
        $printer->text("\n");
        $printer->text("(" . $solicitud['dici']['cedula'] . ")");
        $printer->text("\n");
       /*  if (isset($solicitud['gerente'])) {
            $printer->text("Gerente: " . $solicitud['gerente']['nombre'] . " " . $solicitud['gerente']['apellido']);
            $printer->text("\n");
            $printer->text("(" . $solicitud['gerente']['cedula'] . ")");
            $printer->text("\n");
        } */
        $printer->text("═══════════════════════════\n");

        // Motivo y detalles
        $printer->setEmphasis(true);
        $printer->text("MOTIVO Y DETALLES:");
        $printer->setEmphasis(false);
        $printer->text("\n");
        $printer->text("Motivo: " . $solicitud['motivo_devolucion']);
        $printer->text("\n");
        if (!empty($solicitud['detalles_adicionales'])) {
            $printer->text("Detalles: " . $solicitud['detalles_adicionales']);
            $printer->text("\n");
        }
        $printer->text("Días desde compra: " . $solicitud['dias_transcurridos_compra']);
        $printer->text("\n");
        $printer->text("Trajo factura: " . ($solicitud['trajo_factura'] ? 'SÍ' : 'NO'));
        $printer->text("\n");
        $printer->text("═══════════════════════════\n");

        // Productos (formato similar a función imprimir)
        $printer->feed();
        $printer->setPrintLeftMargin(0);
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        
        $productosData = json_decode($solicitud['productos_data'], true);
        $productosConDatos = $solicitud['productos_con_datos'] ?? [];

        // Separar productos entrantes y salientes
        $productosEntrantes = array_filter($productosData, function($p) { return $p['tipo'] === 'entrada'; });
        $productosSalientes = array_filter($productosData, function($p) { return $p['tipo'] === 'salida'; });

        // Productos ENTRANTES (que devuelve el cliente)
        if (!empty($productosEntrantes)) {
            $printer->setEmphasis(true);
            $printer->text("PRODUCTOS ENTRANTES");
            $printer->text("\n");
            $printer->text("(DEVUELTOS):");
            $printer->setEmphasis(false);
            $printer->text("\n");
            $printer->text("═══════════════════════════");
            $printer->text("\n");

            foreach ($productosEntrantes as $index => $producto) {
                $productoDetalle = null;
                foreach ($productosConDatos as $prodDetalle) {
                    if ($prodDetalle['id_producto'] == $producto['id_producto']) {
                        $productoDetalle = $prodDetalle;
                        break;
                    }
                }

                if ($productoDetalle && isset($productoDetalle['producto'])) {
                    // Descripción del producto
                    $printer->text($productoDetalle['producto']['descripcion']);
                    $printer->text("\n");
                    
                    // Código de barras
                    $printer->text($productoDetalle['producto']['codigo_barras']);
                    $printer->text("\n");

                    // Precio unitario y total
                    $printer->setTextSize(1, 1);
                    $precio = $productoDetalle['producto']['precio'];
                    $total = $precio * $producto['cantidad'];
                    $printer->text("P/U:" . number_format($precio, 2) . "  Tot:" . number_format($total, 2));
                    $printer->text("\n");

                    // Cantidad
                    $printer->setTextSize(1, 1);
                    $printer->text("Ct:");
                    $printer->setTextSize(2, 1);
                    $printer->text($producto['cantidad']);
                    $printer->text("\n");
                    $printer->setTextSize(1, 1);

                    // Estado (DAÑADO/BUENO)
                    $printer->setEmphasis(true);
                    $printer->text("ESTADO: " . $producto['estado']);
                    $printer->setEmphasis(false);
                    $printer->text("\n");

                    $printer->feed();
                }
            }
        }

        // Productos SALIENTES (que recibe el cliente)
        if (!empty($productosSalientes)) {
            $printer->setEmphasis(true);
            $printer->text("PRODUCTOS SALIENTES");
            $printer->text("\n");
            $printer->text("(ENTREGADOS):");
            $printer->setEmphasis(false);
            $printer->text("\n");
            $printer->text("═══════════════════════════");
            $printer->text("\n");

            foreach ($productosSalientes as $index => $producto) {
                $productoDetalle = null;
                foreach ($productosConDatos as $prodDetalle) {
                    if ($prodDetalle['id_producto'] == $producto['id_producto']) {
                        $productoDetalle = $prodDetalle;
                        break;
                    }
                }

                if ($productoDetalle && isset($productoDetalle['producto'])) {
                    // Descripción del producto
                    $printer->text($productoDetalle['producto']['descripcion']);
                    $printer->text("\n");
                    
                    // Código de barras
                    $printer->text($productoDetalle['producto']['codigo_barras']);
                    $printer->text("\n");

                    // Precio unitario y total
                    $printer->setTextSize(1, 1);
                    $precio = $productoDetalle['producto']['precio'];
                    $total = $precio * $producto['cantidad'];
                    $printer->text("P/U:" . number_format($precio, 2) . "  Tot:" . number_format($total, 2));
                    $printer->text("\n");

                    // Cantidad
                    $printer->setTextSize(1, 1);
                    $printer->text("Ct:");
                    $printer->setTextSize(2, 1);
                    $printer->text($producto['cantidad']);
                    $printer->text("\n");
                    $printer->setTextSize(1, 1);

                    // Estado (DAÑADO/BUENO)
                    $printer->setEmphasis(true);
                    $printer->text("ESTADO: " . $producto['estado']);
                    $printer->setEmphasis(false);
                    $printer->text("\n");

                    $printer->feed();
                }
            }
        }

        // Métodos de pago (ya se muestran arriba en la sección específica)

        // Datos de pago adicionales si existen
        

        // Totales y resumen
        $printer->text("═══════════════════════════\n");
        $printer->setEmphasis(true);
        $printer->text("RESUMEN Y TOTALES:");
        $printer->setEmphasis(false);
        $printer->text("\n");
        
        // Calcular totales
        $totalEntrantes = 0;
        $totalSalientes = 0;
        $cantidadEntrantes = 0;
        $cantidadSalientes = 0;

        foreach ($productosEntrantes as $producto) {
            $productoDetalle = null;
            foreach ($productosConDatos as $prodDetalle) {
                if ($prodDetalle['id_producto'] == $producto['id_producto']) {
                    $productoDetalle = $prodDetalle;
                    break;
                }
            }
            if ($productoDetalle && isset($productoDetalle['producto'])) {
                $totalEntrantes += $productoDetalle['producto']['precio'] * $producto['cantidad'];
                $cantidadEntrantes += $producto['cantidad'];
            }
        }

        foreach ($productosSalientes as $producto) {
            $productoDetalle = null;
            foreach ($productosConDatos as $prodDetalle) {
                if ($prodDetalle['id_producto'] == $producto['id_producto']) {
                    $productoDetalle = $prodDetalle;
                    break;
                }
            }
            if ($productoDetalle && isset($productoDetalle['producto'])) {
                $totalSalientes += $productoDetalle['producto']['precio'] * $producto['cantidad'];
                $cantidadSalientes += $producto['cantidad'];
            }
        }

        $printer->text("Entrantes:" . $cantidadEntrantes . " $" . formatMonto($totalEntrantes));
        $printer->text("\n");
        $printer->text("Salientes:" . $cantidadSalientes . " $" . formatMonto($totalSalientes));
        $printer->text("\n");
        
        // Calcular diferencia
        $diferencia = $totalSalientes - $totalEntrantes;
        if ($diferencia < 0) {
            /* $printer->setEmphasis(true);
            $printer->text("DIFERENCIA A FAVOR CLIENTE");
            $printer->setEmphasis(false);
            $printer->text("\n"); */
            $printer->setEmphasis(true);
            $printer->text("¡SE DEBE DEVOLVER AL CLIENTE!");
            $printer->setEmphasis(false);
            $printer->text("\n");
            $printer->text("$" . formatMonto($diferencia));
            $printer->text("\n");
            
        } elseif ($diferencia > 0) {
            /* $printer->setEmphasis(true);
            $printer->text("DIFERENCIA A FAVOR EMPRESA");
            $printer->setEmphasis(false);
            $printer->text("\n"); */
            $printer->setEmphasis(true);
            $printer->text("CLIENTE DEBE PAGAR DIFERENCIA");
            $printer->setEmphasis(false);
            $printer->text("\n");
            $printer->text("$" . formatMonto(abs($diferencia)));
            $printer->text("\n");
           
        } else {
            $printer->setEmphasis(true);
            $printer->text("SIN DIFERENCIA");
            $printer->setEmphasis(false);
            $printer->text("\n");
            $printer->text("NO HAY DEVOLUCIÓN NI PAGO");
            $printer->text("\n");
        }
        
        if (!empty($datosPago)) {
            $printer->text("═══════════════════════════\n");
            $printer->setEmphasis(true);
            $printer->text("INFORMACIÓN DE PAGO\n");
            $printer->setEmphasis(false);
            $printer->text("Pedido:" . $solicitud['id_pedido_insucursal'] . "\n");
            foreach ($datosPago as $pago) {
                $printer->text(formatText58mm($this->getTipoPagoDescripcion($pago['tipo']), 15) . " $" . formatMonto($pago['monto']));
                $printer->text("\n");
            }
        }
        
        $printer->text("Total Prod:" . count($productosData));
        $printer->text("\n");

        $printer->text("\n");
        $printer->setJustification(Printer::JUSTIFY_CENTER);

        // Fechas y usuario
        $printer->setEmphasis(true);
        $printer->text("FECHAS:");
        $printer->setEmphasis(false);
        $printer->text("\n");
        $printer->text("Creada:" . formatFecha($solicitud['fecha_solicitud']));
        $printer->text("\n");
        if ($solicitud['fecha_aprobacion']) {
            $printer->text("Aprobada:" . formatFecha($solicitud['fecha_aprobacion']));
            $printer->text("\n");
        }
        if ($solicitud['fecha_ejecucion']) {
            $printer->text("Finalizada:" . formatFecha($solicitud['fecha_ejecucion']));
            $printer->text("\n");
        }
        $printer->text("Impreso:" . formatFecha(now()));
        $printer->text("\n");
        $printer->text("Por:" . formatText58mm(session('nombre_usuario') ?? 'Sistema', 20));
        $printer->text("\n");

        // Pie del ticket
        $printer->text("\n");
        $printer->text("*ESTE TICKET ES UN COMPROBANTE");
        $printer->text("\n");
        $printer->text("OFICIAL DE GARANTÍA/DEVOLUCIÓN*");
        $printer->text("\n");

        $printer->text("\n");
        $printer->text("\n");
        $printer->text("\n");

        $printer->cut();
        $printer->pulse();
        $printer->close();
    }

    /**
     * Obtener datos de pago por id_pedido_insucursal
     */
    private function obtenerDatosPago($pedidoId)
    {
        try {
            $pagos = \App\Models\pago_pedidos::where('id_pedido', $pedidoId)->get();
            return $pagos->toArray();
        } catch (\Exception $e) {
            \Log::warning('Error obteniendo datos de pago', [
                'pedido_id' => $pedidoId,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Obtener datos de la factura original
     */
    private function obtenerDatosFacturaOriginal($facturaId)
    {
        try {
            \Log::info('Obteniendo datos de factura original', ['factura_id' => $facturaId]);

            // Buscar en base de datos local primero
            $factura = \App\Models\pedidos::with('cliente')->where('id', $facturaId)->first();
            
            /* if (!$factura) {
                \Log::warning('Factura no encontrada en BD local', ['factura_id' => $facturaId]);
                return [];
            }

            \Log::info('Factura encontrada', [
                'factura_id' => $factura->id,
                'numero_factura' => $factura->numero_factura,
                'total' => $factura->total,
                'fecha' => $factura->created_at
            ]); */

            // Obtener productos de la factura
            $productos = \App\Models\items_pedidos::where('id_pedido', $factura->id)
                ->with('producto')
                ->get();

            \Log::info('Productos encontrados', ['cantidad' => $productos->count()]);

            $productosFactura = [];
            foreach ($productos as $item) {
                $productosFactura[] = [
                    'descripcion' => $item->producto->descripcion ?? 'Producto no encontrado',
                    'codigo_barras' => $item->producto->codigo_barras ?? 'N/A',
                    'cantidad' => $item->cantidad,
                    'precio_unitario' => $item->precio_unitario,
                    'subtotal' => $item->monto
                ];
            }

            // Obtener datos de pago del cliente
            $pagosCliente = \App\Models\pago_pedidos::where('id_pedido', $factura->id)->get();
            $pagosFactura = [];
            foreach ($pagosCliente as $pago) {
                $pagosFactura[] = [
                    'tipo' => $pago->tipo,
                    'tipo_descripcion' => $this->getTipoPagoDescripcion($pago->tipo),
                    'monto' => $pago->monto,
                    'moneda' => $pago->moneda ?? 'USD',
                    'referencia' => $pago->referencia ?? ''
                ];
            }

            $resultado = [
                'numero_factura' => $factura->numero_factura ?? $factura->id,
                'fecha_factura' => $factura->created_at,
                'total_factura' => $factura->total,
                'productos' => $productosFactura,
                'pagos' => $pagosFactura
            ];

            // Intentar obtener datos del cliente si existe la relación
            if (isset($factura->cliente)) {
                $resultado['cliente'] = [
                    'nombre' => $factura->cliente->nombre ?? 'N/A',
                    'apellido' => $factura->cliente->apellido ?? 'N/A',
                    'cedula' => $factura->cliente->cedula ?? 'N/A'
                ];
            }

            \Log::info('Datos de factura procesados exitosamente', [
                'factura_id' => $facturaId,
                'productos_count' => count($productosFactura)
            ]);

            return $resultado;

        } catch (\Exception $e) {
            \Log::error('Error obteniendo datos de factura original', [
                'factura_id' => $facturaId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return [];
        }
    }

    /**
     * Obtener descripción del tipo de pago
     */
    private function getTipoPagoDescripcion($tipo)
    {
        $tipos = [
            1 => 'TRANSFERENCIA',
            2 => 'DÉBITO',
            3 => 'EFECTIVO',
            4 => 'CRÉDITO',
            5 => 'BIOPAGO',
            6 => 'VUELTO'
        ];

        return $tipos[$tipo] ?? 'DESCONOCIDO';
    }

    /**
     * Obtener descripción del caso de uso
     */
    private function getCasoUsoDescription($casoUso)
    {
        $casos = [
            1 => 'Producto por producto',
            2 => 'Producto por dinero',
            3 => 'Dinero por producto',
            4 => 'Dinero por dinero',
            5 => 'Transferencia entre sucursales'
        ];
        return $casos[$casoUso] ?? "Caso de uso $casoUso";
    }
    

    
}
