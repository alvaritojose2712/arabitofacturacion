<?php

namespace App\Http\Controllers;

use App\Models\pagos_referencias;
use App\Models\retenciones;
use App\Models\pedidos;
use App\Models\items_pedidos;
use App\Models\pago_pedidos;
use App\Models\clientes;
use App\Models\sucursal;
use App\Models\catcajas;



use Illuminate\Http\Request;

use App\Http\Controllers\PedidosController;
use Response;

class PagoPedidosController extends Controller
{   
    public function setconfigcredito(Request $req)
    {
        try {

            $fechainiciocredito = $req->fechainiciocredito;
            $fechavencecredito = $req->fechavencecredito;
            $formatopagocredito = $req->formatopagocredito;
            $id_pedido = $req->id_pedido;

            $ped = pedidos::find($id_pedido);
            if ($ped->id_cliente==1) {
                return Response::json(["msj"=>"Error: En caso de crédito, debe registrar los datos del cliente","estado"=>false]);
            }

            $ped->fecha_inicio = $fechainiciocredito;
            $ped->fecha_vence = $fechavencecredito;
            $ped->formato_pago = $formatopagocredito;

            $ped->save();
            
            return Response::json(["msj"=>"Configuracion de crédito registrada con éxito","estado"=>true]);

            
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);

            
        }

    }
    public function entregarVuelto(Request $req)
    {
        try {
            $id_pedido = $req->id_pedido;
            $monto = floatval($req->monto);

            $mov = new movimientos_caja;

            if ($monto) {

                $total_acumulado = movimientos_caja::where("id_pedido",$id_pedido)
                ->sum("monto");

                $pendiente = pago_pedidos::where("tipo",6)->where("id_pedido",$id_pedido)
                ->sum("monto");

                if (($total_acumulado+$monto)<=$pendiente) {
                    $mov->id_pedido = $id_pedido;
                    $mov->categoria = 1;
                    $mov->descripcion = "VUELTO ENTREGADO Ped.".$id_pedido;
                    $mov->tipo = 1;
                    $mov->monto = $monto;
                    $mov->id_vendedor = session('id_usuario');


                    if ($mov->save()) {
                        return Response::json(["msj"=>"Éxito a entregar","estado"=>true]);
                    }
                }else{
                    $pen = $pendiente-$total_acumulado;

                    throw new \Exception("¡Solo quedan ".$pen." por entregar!", 1);
                }

            }else{
                throw new \Exception("¡Monto en cero!", 1);
                
            }

            
        } catch (\Exception $e) {
            
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
        }

        
    }
    function setPagoPedidoTrans(Request $req) {
        $id = $req->id;
        pago_pedidos::where("id_pedido",$id)->delete();
        pago_pedidos::updateOrCreate(["id_pedido"=>$id,"tipo"=>4],["cuenta"=>1,"monto"=>0.00001]);
        $pedido = pedidos::find($id);

        if ($pedido->estado==0) {
            $pedido->estado = 1;
            $pedido->save();
        }

        return ["estado"=>true, "msj" => "Guardado como transferencia de inventario"];
        
    }
    public function setPagoPedido(Request $req)
    {   
        $ped = (new PedidosController)->getPedido($req);

        $total_real = $ped->clean_total;
        $total_ins = floatval($req->debito)+floatval($req->efectivo)+floatval($req->transferencia)+floatval($req->biopago)+floatval($req->credito);

        //Excepciones
        if (session("tipo_usuario")==1 && !$req->credito) {
            return Response::json(["msj"=>"Error: Administrador no puede Facturar!","estado"=>false]);
        }
        
        if ($total_ins < 0) {
            $isPermiso = (new TareaslocalController)->checkIsResolveTarea([
                "id_pedido" => $req->id,
                "tipo" => "devolucion",
            ]);
            if ((new UsuariosController)->isAdmin()) {
                // Avanza
            }elseif($isPermiso["permiso"]){
                if ($isPermiso["valoraprobado"]==round($total_ins,0)) {
                    // Avanza
                }else{
                    return Response::json(["msj"=>"Error: Valor no aprobado","estado"=>false]);
                }
            }else{
                $nuevatarea = (new TareaslocalController)->createTareaLocal([
                    "id_pedido" =>  $req->id,
                    "valoraprobado" => round($total_ins,0),
                    "tipo" => "devolucion",
                    "descripcion" => "Solicitud de Devolucion: ".round($total_ins,0)." $",
                ]);
                if ($nuevatarea) {
                    return Response::json(["id_tarea"=>$nuevatarea->id,"msj"=>"Debe esperar aprobacion del Administrador","estado"=>false]);
                }
            }
        }

        if ($req->credito!=0) {
            $isPermiso = (new TareaslocalController)->checkIsResolveTarea([
                "id_pedido" => $req->id,
                "tipo" => "credito",
            ]);
            if ((new UsuariosController)->isAdmin()) {
                // Avanza
            }elseif($isPermiso["permiso"]){
                if ($isPermiso["valoraprobado"]==round($req->credito,0)) {
                    // Avanza
                }else{
                    return Response::json(["msj"=>"Error: Valor no aprobado","estado"=>false]);
                }
            }else{
                $nuevatarea = (new TareaslocalController)->createTareaLocal([
                    "id_pedido" =>  $req->id,
                    "valoraprobado" => round($req->credito,0),
                    "tipo" => "credito",
                    "descripcion" => "Solicitud de Crédito: ".round($req->credito,0)." $",
                ]);
                if ($nuevatarea) {
                    return Response::json(["id_tarea"=>$nuevatarea->id,"msj"=>"Debe esperar aprobacion del Administrador","estado"=>false]);
                }
            }
        }
        if ($req->credito!=0&&$ped->id_cliente==1) {
            return Response::json(["msj"=>"Error: En caso de crédito, debe registrar los datos del cliente","estado"=>false]);
        }
        if ($req->vuelto!=0&&$ped->id_cliente==1) {
            return Response::json(["msj"=>"Error: En caso de vuelto, debe registrar los datos del cliente","estado"=>false]);
        }
        $res = $total_real-$total_ins;
        if ($res > -0.2 && $res < 0.2) {
               // 1 Transferencia
               // 2 Debito 
               // 3 Efectivo 
               // 4 Credito  
               // 5 Biopago
               // 6 vuelto
            try {
                (new PedidosController)->checkPedidoAuth($req->id);
                $checkPedidoPago = (new PedidosController)->checkPedidoPago($req->id);
                if ($checkPedidoPago!==true) {
                    return $checkPedidoPago;
                }
                if ($req->transferencia) {
                    $monto_tra = $req->transferencia;
                    $montodolares = 0;
                    $bs = (new PedidosController)->get_moneda()["bs"];
                    pagos_referencias::where("id_pedido",$req->id)->get()->map(function($q) use (&$montodolares, $bs) {
                        if (
                            $q->banco=="ZELLE"||
                            $q->banco=="BINANCE"||
                            $q->banco=="AirTM"
                        ) {
                            $montodolares += $q->monto;
                        }else{
                            $montodolares += ($q->monto/$bs);
                        }
                    });
                    $diff = $monto_tra - $montodolares;
                    if ($diff < -0.1 || $diff > 0.1) {
                        throw new \Exception("Monto de Transferencia no coincide con referencias cargadas", 1);
                    }
                }else{
                    $check_ref = pagos_referencias::where("id_pedido",$req->id)->first();
                    if ($check_ref) {
                        throw new \Exception("Tiene Referencia Cargada y no es Transferencia!", 1);
                    }
                }


                $cuenta = 1;
                $checkIfAbono = items_pedidos::where("id_producto",NULL)->where("id_pedido",$req->id)->get()->count();
                if ($checkIfAbono && !$req->credito) {
                    //Es Abono
                    $cuenta = 0;
                }else{
                    //No es abono
                }
                pago_pedidos::where("id_pedido",$req->id)->delete();
                if($req->transferencia) {

                    $refs = pagos_referencias::where("id_pedido",$req->id)->get();
                    $retenciones = retenciones::where("id_pedido",$req->id)->get();
                    
                    $dataTransfe = [
                        "refs" => $refs,
                        "retenciones" => $retenciones,
                    ];
                    $transfResult = (new sendCentral)->createTranferenciaAprobacion($dataTransfe);
                    if (isset($transfResult["estado"])) {
                        if ($transfResult["estado"]==true && $transfResult["msj"]=="APROBADO") {
                            pago_pedidos::updateOrCreate(["id_pedido"=>$req->id,"tipo"=>1],["cuenta"=>$cuenta,"monto"=>floatval($req->transferencia)]);
                        }else{
                            return $transfResult;
                        }
                    }else{
                        return $transfResult;
                    }

                }
                if($req->debito) {
                    pago_pedidos::updateOrCreate(["id_pedido"=>$req->id,"tipo"=>2],["cuenta"=>$cuenta,"monto"=>floatval($req->debito)]);

                    if (!$req->efectivo && !$req->transferencia) {
                        (new tickera)->sendReciboFiscalFun($req->id);
                    }
                
                }
                if($req->efectivo) {pago_pedidos::updateOrCreate(["id_pedido"=>$req->id,"tipo"=>3],["cuenta"=>$cuenta,"monto"=>floatval($req->efectivo)]);}
                if($req->credito) {
                    $pedido = pedidos::with("cliente")->find($req->id);
                    if ($pedido->cliente) {
                        
                        $id_cliente = $pedido->cliente["id"];

                        $dataCredito = [
                            "cliente" => $pedido->cliente,
                            "idinsucursal" => $req->id,
                            "saldo" => floatval($req->credito),
                            "deuda" => $this->getDeudaFun(false,$id_cliente),
                            "fecha_ultimopago" => $this->getDeudaFechaPago($id_cliente)
                        ];

                        $creditoResult = (new sendCentral)->createCreditoAprobacion($dataCredito);
    
                        if ($creditoResult === "APROBADO") {
                            pago_pedidos::updateOrCreate(["id_pedido"=>$req->id,"tipo"=>4],["cuenta"=>$cuenta,"monto"=>floatval($req->credito)]);
                        }else{
                            return $creditoResult;
                        }
                    }else{
                        return Response::json(["msj"=>"Error: Sin Cliente","estado"=>false]);
                    }

                }
                if($req->biopago) {pago_pedidos::updateOrCreate(["id_pedido"=>$req->id,"tipo"=>5],["cuenta"=>$cuenta,"monto"=>floatval($req->biopago)]);}
                if($req->vuelto) {pago_pedidos::updateOrCreate(["id_pedido"=>$req->id,"tipo"=>6],["cuenta"=>$cuenta,"monto"=>floatval($req->vuelto)]);}

                $pedido = pedidos::find($req->id);

                if ($pedido->estado==0) {
                    $pedido->estado = 1;
                    $pedido->save();
                }

                return Response::json(["msj"=>"Éxito","estado"=>true]);
            } catch (\Exception $e) {
                
                return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
            }

        }else{
            return Response::json(["msj"=>"Error. Montos no coinciden. Real: ".round($total_real,3)." | Ins: ".round($total_ins,3),"estado"=>false]);
            
        }
    }

    function setGastoOperativo(Request $req) {
        $id = $req->id;

        $itemsGasto = items_pedidos::where("id_pedido",$id);
        $monto_gasto = $itemsGasto->sum("monto");

        pago_pedidos::where("id_pedido",$id)->delete();
        pago_pedidos::updateOrCreate(["id_pedido"=>$id,"tipo"=>3],["cuenta"=>1,"monto"=>$monto_gasto]);
        $pedido = pedidos::find($id);
        if ($pedido->estado==0) {
            $pedido->estado = 1;
            $pedido->save();

            $itemsCount_gasto = $itemsGasto->count();

            $gastoCat = catcajas::where("nombre","LIKE","%REPARACIONES Y MANTENIMIENTO DE SUCURSAL%")->where("tipo",0)->first();
            if ($gastoCat) {
                $cajas = (new CajasController)->setCajaFun([
                    "id" => null,
                    "concepto" => "GASTO CON MERCANCIA DE SUCURSAL PED.".$id,
                    "categoria" => $gastoCat->id,
                    "montodolar" => $monto_gasto*-1,
                    "montopeso" => 0,
                    "montobs" => 0,
                    "montoeuro" => 0,
                    "tipo" => 0,
                    "estatus" => 1,
                ]);
    
                if ($cajas) {
                    return [
                        "msj" => "Éxito al registrar Gasto",
                        "estado" => true,
                    ];
                }
            }else{
                return [
                    "msj" => "ERROR, no se encontro categoría de gasto",
                    "estado" => false,
                ];
            }
        }
    }

    function getDeudaFechaPago($id_cliente) {
        $getfecha = pedidos::with(["pagos"=>function($q){
            $q->orderBy("tipo","desc");
        }])
        ->where(function($q){
            $q->whereIn("id",pago_pedidos::orWhere(function($q){
                $q->where("cuenta",0); //Abono
            })->where("monto","<>",0)->select("id_pedido"));

        })
        ->where("id_cliente",$id_cliente)
        ->orderBy("created_at","desc")
        ->first();

        if ($getfecha) {
            return $getfecha->created_at;
        }
        return "";

    }

    public function getDeudaFun($onlyVueltos,$id_cliente)
    {
        $pedidos = pedidos::with(["pagos"=>function($q) use ($onlyVueltos){
            if ($onlyVueltos) {
                $q->where("tipo",6)->where("monto","<>",0);
            }
            $q->orderBy("tipo","desc");
        }])
        ->where(function($q) use ($onlyVueltos){
            if ($onlyVueltos) {
                $q->whereIn("id",pago_pedidos::where("tipo",6)->where("monto","<>",0)->select("id_pedido"));
            }else{
                $q->whereIn("id",pago_pedidos::orWhere(function($q){
                    $q->orWhere("tipo",4); //Credito
                    $q->orWhere("cuenta",0); //Abono
                })->where("monto","<>",0)->select("id_pedido"));

            }
        })
        ->where("id_cliente",$id_cliente)
        ->orderBy("created_at","desc")
        ->get()
        ->map(function($q){
            
            $q->saldoDebe = $q->pagos->where("tipo",4)->sum("monto");
            $q->saldoAbono = $q->pagos->where("cuenta",0)->sum("monto");

            $q->entregado = [];

            return $q;
        });
        $pedido_total[0] = $pedidos->sum("saldoAbono");
        $pedido_total[1] = $pedidos->sum("saldoDebe");

        // $diferencia = 0;

        // if ($pedido_total[1] && $pedido_total[0]) {
        // $diferencia = ;
        // }
        $d = $pedido_total[0] - $pedido_total[1];

        $check = true;

        if ($d<0) {
            $check = false;
        }
        $pedido_total["diferencia"] = number_format($d,2);
        $pedido_total["diferencia_clean"] = $d;
        $pedido_total["check"] = $check;
        return [
            "pedido" => $pedidos,
            "pedido_total" => $pedido_total,
        ]; 
    }
    public function getDeudor(Request $req)
    {
        $onlyVueltos = $req->onlyVueltos;
        $id_cliente = $req->id;

        return $this->getDeudaFun($onlyVueltos,$id_cliente);
        

    }

    public function checkDeuda(Request $req)
    {
        $id_cliente = $req->id_cliente;
        return $this->getDeudaFun(false,$id_cliente);

    }
    public function verCreditos(Request $req)
    {
        $sucursal = sucursal::all()->first();
        $today = (new PedidosController)->today();


        $qDeudores = $req->qDeudores;
        $orderbycolumdeudores = $req->orderbycolumdeudores;
        $orderbyorderdeudores = $req->orderbyorderdeudores;

        $data = $this->getDeudoresFun($qDeudores,$orderbycolumdeudores,$orderbyorderdeudores,$today,200);
        
        return view("reportes.creditos",["data" => $data,"sucursal" => $sucursal,"today"=>$today]);
    }
    public function getDeudores(Request $req)
    {   
        $today = (new PedidosController)->today();
        $busqueda = $req->qDeudores;
        $view = $req->view;

        $orderbycolumdeudores = $req->orderbycolumdeudores;
        $orderbyorderdeudores = $req->orderbyorderdeudores;
        $limitdeudores = $req->limitdeudores;


        if ($view==="vueltos") {
            return clientes::with(["pedidos"=>function($q){
                $q->with(["pagos"]);
                $q->orderBy("created_at","desc");
            }])
            ->where("id","<>",1)->where(function($q) use ($busqueda){
                $q->orWhere("identificacion","LIKE","%".$busqueda."%")
                ->orWhere("nombre","LIKE","%".$busqueda."%");
            })

            ->limit($limitdeudores)
            ->get()
            ->map(function($q) use ($view,$today) {

                $q->totalVuelto = 0; 
                $q->saldo = 0;
                if ($view==="vueltos") {
                    // code...
                    $q->totalVuelto = $q->pedidos->map(function($q){

                        $check_vuelto_entregado = 0;
                        $sum_entregado = 0;
                        if ($check_vuelto_entregado) {
                            
                            $sum_entregado = $check_vuelto_entregado;
                        }

                        return $q->pagos->where("tipo",6)->sum("monto")-$sum_entregado;
                    })->sum();
                }
                return $q;
            });
        }else{
            return $this->getDeudoresFun($busqueda,$orderbycolumdeudores,$orderbyorderdeudores,$today,$limitdeudores);
        }


    }
    public function getDeudoresFun($busqueda,$orderbycolumdeudores,$orderbyorderdeudores,$today,$limitdeudores)
    {   
        return clientes::with(["pedidos"=>function($q){
                // $q->with(["pagos"]);
                $q->orderBy("created_at","desc");
            }])
            ->selectRaw("*,@credito := (SELECT COALESCE(sum(monto),0) FROM pago_pedidos WHERE id_pedido IN (SELECT id FROM pedidos WHERE id_cliente=clientes.id) AND tipo=4) as credito, @abono := (SELECT COALESCE(sum(monto),0) FROM pago_pedidos WHERE id_pedido IN (SELECT id FROM pedidos WHERE id_cliente=clientes.id) AND cuenta=0) as abono, (@abono-@credito) as saldo, @vence := (SELECT fecha_vence FROM pedidos WHERE id_cliente=clientes.id AND fecha_vence > $today ORDER BY pedidos.fecha_vence ASC LIMIT 1) as vence , (COALESCE(DATEDIFF(@vence,'$today 00:00:00'),0)) as dias")
            // ->where("saldo","<",0)
            ->where("id","<>",1)->where(function($q) use ($busqueda){
                $q->orWhere("identificacion","LIKE","%".$busqueda."%")
                ->orWhere("nombre","LIKE","%".$busqueda."%");
            })
            // ->having("saldo","<",0)
            ->orderBy($orderbycolumdeudores,$orderbyorderdeudores)
            ->limit($limitdeudores)
            ->get();
    }

    public function setPagoCredito(Request $req)
    {
        try {
            $monto_pago_deudor = $req->monto_pago_deudor;
    
            if (session()->has("id_usuario")) {
    
                if ($monto_pago_deudor<0) {
                    $isPermiso = (new TareaslocalController)->checkIsResolveTarea([
                        "id_pedido" => null,
                        "tipo" => "devolucionPago",
                    ]);
                    
                    if ((new UsuariosController)->isAdmin()) {
                    }elseif($isPermiso["permiso"]){
                    }else{
                        $nuevatarea = (new TareaslocalController)->createTareaLocal([
                            "id_pedido" => null,
                            "tipo" => "devolucionPago",
                            "valoraprobado" => $monto_pago_deudor,
                            "descripcion" => "Devolver dinero $ ".$monto_pago_deudor,
                        ]);
                        if ($nuevatarea) {
                            return Response::json(["id_tarea"=>$nuevatarea->id,"msj"=>"Debe esperar aprobacion del Administrador","estado"=>false]);
                        }
                    }
                }
                $id_cliente = $req->id_cliente;
                $pedido = new pedidos;
    
                $pedido->estado = 0;
                $pedido->id_cliente = $id_cliente;
                $pedido->id_vendedor = session("id_usuario");
    
                if ($pedido->save()) {
                    $tipo_pago_deudor = $req->tipo_pago_deudor;
                    $monto_pago_deudor = $req->monto_pago_deudor;
    
                    $tipo = $monto_pago_deudor<0?"DEVOLUCION":"PAGO";
    
                    $cliente = clientes::find($id_cliente);
    
                    $producto_pago_desc = $tipo." ".$cliente->nombre;
                    
    
                    $items_pedidos = new items_pedidos;
                    $items_pedidos->id_producto = null;
                    $items_pedidos->abono = $producto_pago_desc;
                    $items_pedidos->id_pedido = $pedido->id;
                    $items_pedidos->cantidad = 1;
                    $items_pedidos->descuento = 0;
                    $items_pedidos->monto = $monto_pago_deudor;
                    $items_pedidos->save();
                    
                    $pago_pedidos = new pago_pedidos;
                    $pago_pedidos->tipo = $tipo_pago_deudor;
                    $pago_pedidos->monto = $monto_pago_deudor;
                    $pago_pedidos->id_pedido = $pedido->id;
                    $pago_pedidos->cuenta = 0;
                    $pago_pedidos->save();
    
                    return Response::json(["msj"=>"Pago registrado con éxito","estado"=>true,"id_pedido"=>$pedido->id]);
                    
    
                }
            }
        } catch (\Exception $e) {
            return Response::json(["msj"=>$e->getMessage(),"estado"=>false]);

        }
    }
}
