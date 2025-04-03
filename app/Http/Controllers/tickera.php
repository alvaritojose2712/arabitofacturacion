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

class tickera extends Controller
{
    public function imprimir(Request $req)
    {
        try {
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
                
                $connector = new WindowsPrintConnector($arr_printers[$printer]);
                //smb://computer/printer
                $printer = new Printer($connector);
                $printer->setEmphasis(true);
                
                $pedido = (new PedidosController)->getPedido($req,floatval($dolar));
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
                                return Response::json(["msj"=>"Error: Valor no aprobado","estado"=>false]);
                            }
                        }else{
                            $nuevatarea = (new TareaslocalController)->createTareaLocal([
                                "id_pedido" =>  $req->id,
                                "valoraprobado" => 1,
                                "tipo" => "tickera",
                                "descripcion" => "Solicitud de Reimpresion COPIA",
                            ]);
                            if ($nuevatarea) {
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
                        $printer->text($sucursal->sucursal);
                        $printer -> text("\n");
                        $printer->text((!$pedido->ticked?"ORIGINAL: ":"COPIA: ")."ORDEN DE DESPACHO");
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
        
        
                           $printer->text(addSpaces("P/U. ",6).$item['pu']);
                           $printer->text("\n");
                           
                           $printer->setEmphasis(true);
                           $printer->text(addSpaces("Ct. ",6).$item['cantidad']);
                           $printer->setEmphasis(false);
                           $printer->text("\n");
        
                           $printer->text(addSpaces("Tot. ",6).$item['totalprecio']);
                           $printer->text("\n");
        
        
        
                            $printer->feed();
                        }
                        $printer->setEmphasis(true);
        
                        $printer->text("Desc: ".$pedido->total_des);
                        $printer->text("\n");
                        $printer->text("Sub-Total: ". number_format($pedido->clean_total,2) );
                        $printer->text("\n");
                        $printer->text("Total: ".$pedido->total);
                        $printer->text("\n");
                        $printer->text("\n");
                        $printer->setJustification(Printer::JUSTIFY_CENTER);
                        
                        $printer->text("Creado: ".$pedido->created_at);
                        $printer->text("\n");
                        $printer->text("Por: ".session("usuario"));
                        //////////////////////
    
                    
    
                        
    
                        ///////////////
                        $printer->text("\n");
                        $printer->text("*ESTE RECIBO ES SOLO PARA");
                        $printer->text("\n");
                        $printer->text("VERIFICAR; EXIJA FACTURA FISCAL*");
                        $printer->text("\n");
                        $printer->text("\n");
    
    
                        
                        $printer->text("\n");
    
                        $updateprint = pedidos::find($pedido->id);
                        $updateprint->ticked = 1;
                        $updateprint->save();
    
                    }
                }
    
                $printer->cut();
                $printer->pulse();
                $printer->close();
                return Response::json([
                    "msj"=>"Imprimiendo...",
                    "estado"=>true,
                    "printerpulse()" => $printer->pulse(),
                    "printerclose()" => $printer->close(),
                ]);
            

        } catch (\Exception $e) {
            return $e->getMessage();
            
        }
    }

    function reportefiscal(Request $req) {
        $type = $req->type;

        if ($type=="x") {
            $cmd = "I0X";
        }else if($type=="z"){
            $cmd = "I0Z";
        }

        $sentencia = "C:/IntTFHKA/IntTFHKA.exe SendCmd(".$cmd;

        shell_exec($sentencia);

        $rep = ""; 
        $repuesta = file('C:/IntTFHKA/Retorno.txt');
        $lineas = count($repuesta);
        for($i=0; $i < $lineas; $i++)
        {
            $rep = $repuesta[$i];
        } 
        return $rep;
    }

    function sendReciboFiscal(Request $req) {
        $id = $req->pedido;

        return $this->sendReciboFiscalFun($id);
        
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
                    array_push($factura,("i03".$direccion."\n"));
                    array_push($factura,("i04".$telefono."\n"));
                }else{
                   /*  return Response::json([
                        "msj"=>"Error: Debe personalizar la factura",
                        "estado"=>false,
                    ]); */
                }

    
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
    
                    $precioFull = $val->producto->iva!=0?($val->producto->precio)/1.16:$val->producto->precio;
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
                    if (floatval($val->descuento)) {
                        array_push($factura, number_format($val->descuento, 2, '', '')."\n");
                    }
                }
                array_push($factura,"101");
    
                $file = "C:/IntTFHKA/Factura.txt";	
                $fp = fopen($file, "w+");
                $write = fputs($fp, "");
                            
                foreach($factura as $campo => $cmd)
                {
                    $write = fputs($fp, $cmd);
                }
                        
                fclose($fp); 
                $sentencia = "C:/IntTFHKA/IntTFHKA.exe SendFileCmd(".$file;
    
                shell_exec($sentencia);
    
                $rep = ""; 
                $repuesta = file('C:/IntTFHKA/Retorno.txt');
                $lineas = count($repuesta);
                for($i=0; $i < $lineas; $i++){
                    $rep = $repuesta[$i];
                } 
                
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
    

    
}
