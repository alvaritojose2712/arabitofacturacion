<?php

namespace App\Http\Controllers;

use App\Models\cajas;
use App\Models\catcajas;
use App\Models\pagos_referencias;
use Illuminate\Http\Request;
use App\Models\movimientos_caja;
use App\Models\sucursal;
use App\Models\moneda;
use App\Models\factura;

use App\Models\categorias;
use App\Models\proveedores;
use App\Models\pedidos;
use App\Models\items_pedidos;
use App\Models\tareas;

use App\Models\cierres;
use App\Models\inventario;

use App\Models\clientes;
use App\Models\fallas;
use App\Models\garantia;
use App\Models\vinculosucursales;

use Illuminate\Support\Facades\Mail;

use App\Mail\enviarCierre;

use Illuminate\Support\Facades\Cache;

use Http;
use Response;

ini_set('max_execution_time', 300);
class sendCentral extends Controller
{

    public function path()
    {
        //return "http://127.0.0.1:8001";
        return "https://phplaravel-1009655-3565285.cloudwaysapps.com";
    }

    public function sends()
    {
        return [
            /**/   "omarelhenaoui@hotmail.com",           
            "yeisersalah2@gmail.com",           
            "amerelhenaoui@outlook.com",           
            "yesers982@hotmail.com",  
            "alvaroospino79@gmail.com"
        ];
    }
    public function setSocketUrlDB()
    {
        return "127.0.0.1";
    }

    function getCatCajas()
    {
        try {
            $response = Http::get($this->path() . "/getCatCajas");
            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                if ($response->json()) {

                    $data = $response->json();
                    //return $data;

                    if (count($data)) {
                        catcajas::truncate();
                        foreach ($data as $key => $e) {
                            $catcajas = new catcajas;

                            $catcajas->indice = $e["indice"];
                            $catcajas->nombre = $e["nombre"];
                            $catcajas->tipo = $e["tipo"];
                            $catcajas->catgeneral = $e["catgeneral"];
                            $catcajas->save();
                        }
                    }

                } else {
                    return $response;
                }
            } else {
                return $response->body();
            }
        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }
    }

    public function recibedSocketEvent(Request $req)
    {
        if (is_string($req->event)) {
            $evento = json_decode($req->event, 2);
            if ($evento["eventotipo"] === "autoResolveAllTarea") {
                return $this->autoResolveAllTarea();
            }
        }
        return null;
    }
    public function getOrigen()
    {
        return sucursal::all()->first()->codigo;
    }


    public function getSucursales()
    {
        try {
            $response = Http::get($this->path() . "/getSucursales");
            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                if ($response->json()) {

                    return Response::json([
                        "msj" => $response->json(),
                        "estado" => true,
                    ]);

                } else {
                    return Response::json([
                        "msj" => $response,
                        "estado" => false,
                    ]);
                }
            } else {
                return Response::json([
                    "msj" => $response->body(),
                    "estado" => false,
                ]);
            }
        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }
    }
    public function getInventarioSucursalFromCentral(Request $req)
    {

        try {

            $type = $req->type;
            $codigo_origen = $this->getOrigen();
            $codigo_destino = $req->codigo_destino;

            switch ($type) {
                case 'inventarioSucursalFromCentral':
                    $parametros = $req->parametros; //Solicitud

                    $ids = [];
                    if ($req->pedidonum) {
                        $ids = inventario::whereIn("id", items_pedidos::where("id_pedido", $req->pedidonum)->select("id_producto"))->select("codigo_barras")->get()->map(function ($q) {
                            return $q->codigo_barras;
                        });
                    }
                    $parametros = array_merge([
                        "ids" => $ids,
                    ], $parametros);

                    $response = Http::post(
                        $this->path() . "/getInventarioSucursalFromCentral",
                        array_merge([
                            "type" => $type,
                            "codigo_origen" => $codigo_origen,
                            "codigo_destino" => $codigo_destino,
                        ], $parametros)
                    );

                    break;
                case 'inventarioSucursalFromCentralmodify':
                    $response = Http::post(
                        $this->path() . "/getInventarioSucursalFromCentral",
                        [
                            "type" => $type,
                            "id_tarea" => $req->id_tarea,
                            "productos" => $req->productos,

                            "codigo_origen" => $codigo_origen,
                            "codigo_destino" => $codigo_destino,
                        ]
                    );
                    break;
                case 'estadisticaspanelcentroacopio':
                    return [];
                    break;
                case 'gastospanelcentroacopio':
                    return [];
                    break;
                case 'cierrespanelcentroacopio':
                    return [];
                    break;
                case 'diadeventapanelcentroacopio':
                    return [];
                    break;
                case 'tasaventapanelcentroacopio':
                    break;


            }

            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                if ($response->json()) {

                    return Response::json([
                        "msj" => $response->json(),
                        "estado" => true,
                    ]);

                } else {
                    return Response::json([
                        "msj" => $response->body(),
                        "estado" => true,
                    ]);
                }
            } else {
                return Response::json([
                    "msj" => $response->body(),
                    "estado" => false,
                ]);
            }

        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }
    }
    public function setInventarioSucursalFromCentral(Request $req)
    {
        try {
            $codigo_origen = $this->getOrigen();
            $codigo_destino = $req->codigo_destino; //Sucursal seleccionada para ver. Desde Centro de acopio
            $type = $req->type;

            $response = Http::post($this->path() . "/setInventarioSucursalFromCentral", [
                "codigo_origen" => $codigo_origen,
                "codigo_destino" => $codigo_destino,
                "type" => $type,
            ]);

            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                if ($response->json()) {

                    return Response::json([
                        "msj" => $response->json(),
                        "estado" => true,
                    ]);

                } else {
                    return Response::json([
                        "msj" => $response->body(),
                        "estado" => false,
                    ]);
                }
            } else {
                return Response::json([
                    "msj" => $response->body(),
                    "estado" => false,
                ]);
            }

        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }

    }
    public function getTareasCentralFun($estado)
    {
        try {
            $codigo_origen = $this->getOrigen();
            $response = Http::get($this->path() . "/getTareasCentral", [
                "codigo_origen" => $codigo_origen,
                "estado" => $estado
            ]);
            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                if ($response->json()) {
                    $data = $response->json();
                    foreach ($data as $kdata => $vdata) {
                        if ($vdata["estado"] != 0) {
                            if (isset($vdata["respuesta"])) {
                                $decoderes = json_decode($vdata["respuesta"], 2);
                                if ($decoderes) {
                                    foreach ($decoderes as $kdecoderes => $vdecoderes) {
                                        $decoderes[$kdecoderes]["original"] = inventario::find($vdecoderes["id"]);
                                    }
                                }
                                $data[$kdata]["respuesta"] = $decoderes;
                            }
                        }
                    }
                    return ([
                        "msj" => $data,
                        "estado" => true,
                    ]);

                } else {
                    return ([
                        "msj" => $response->body(),
                        "estado" => false,
                    ]);
                }
            } else {
                return ([
                    "msj" => $response->body(),
                    "estado" => false,
                ]);
            }

        } catch (\Exception $e) {
            return (["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }
    }
    public function autoResolveAllTarea()
    {
        $tareas = $this->getTareasCentralFun([0]);
        $estados = [];
        if ($tareas["estado"]) {
            foreach ($tareas["msj"] as $tarea) {
                $runtarea = $this->runTareaCentralFun($tarea);
                array_push($estados, $runtarea);
            }
        }
        return $estados;
    }
    public function runTareaCentralFun($tarea)
    {
        $id_tarea = $tarea["id"];
        $respuesta = $tarea["respuesta"];
        $estado = $tarea["estado"];

        $codigo_destino = $tarea["destino"]["codigo"];
        $solicitud = json_decode($tarea["solicitud"], 2);

        $accion = $tarea["accion"];

        switch ($accion) {
            case 'inventarioSucursalFromCentral':
                if ($estado == 0) {
                    $q = $solicitud["qinventario"];
                    $novinculados = $solicitud["novinculados"];
                    $ids = $solicitud["ids"] ? $solicitud["ids"] : "";


                    if ($ids) {
                        $respuesta = inventario::where(function ($q) use ($ids) {
                            for ($i = 0; $i < count($ids); $i++) {
                                $q->orwhere('codigo_barras', 'like', $ids[$i] . '%');
                            }
                        })
                            ->orderBy("descripcion", "asc")
                            ->get()->map(function ($q) {
                                $q->estatus = 0;
                                return $q;
                            });
                    } else {
                        $respuesta = inventario::where(function ($e) use ($q) {
                            $e->orWhere("descripcion", "LIKE", "%$q%")
                                ->orWhere("codigo_proveedor", "LIKE", "%$q%")
                                ->orWhere("codigo_barras", "LIKE", "%$q%");
                        })
                            ->when($novinculados === "novinculados", function ($q) {
                                $q->whereNull("id_vinculacion");
                            })
                            ->when($novinculados === "sivinculados", function ($q) {
                                $q->whereNotNull("id_vinculacion");
                            })

                            ->limit($solicitud["numinventario"])
                            ->orderBy("descripcion", "asc")
                            ->get()->map(function ($q) {
                                $q->estatus = 0;
                                return $q;
                            });
                    }

                    $estadoset = 1;
                } else if ($estado == 2) {
                    $estadoset = 3;
                    $respuesta = is_string($respuesta) ? json_decode($respuesta, 2) : $respuesta;
                    foreach ($respuesta as $key => $ee) {
                        try {
                            $check = false;
                            if (isset($ee["type"])) {
                                if ($ee["type"] === "update" || $ee["type"] === "new") {
                                    (new InventarioController)->guardarProducto([
                                        "id_factura" => null,
                                        "cantidad" => $ee["cantidad"],
                                        "id" => $ee["id"],
                                        "codigo_barras" => $ee["codigo_barras"],
                                        "codigo_proveedor" => $ee["codigo_proveedor"],
                                        "unidad" => $ee["unidad"],
                                        "id_categoria" => $ee["id_categoria"],
                                        "descripcion" => $ee["descripcion"],
                                        "precio_base" => $ee["precio_base"],
                                        "precio" => $ee["precio"],
                                        "iva" => $ee["iva"],
                                        "id_proveedor" => $ee["id_proveedor"],
                                        "id_marca" => $ee["id_marca"],
                                        "id_deposito" => /*inpInvid_deposito*/"",
                                        "porcentaje_ganancia" => 0,
                                        "origen" => "central",

                                        "precio1" => $ee["precio1"],
                                        "precio2" => $ee["precio2"],
                                        "precio3" => $ee["precio3"],
                                        "stockmin" => $ee["stockmin"],
                                        "stockmax" => $ee["stockmax"],
                                        "id_vinculacion" => $ee["id_vinculacion"],
                                    ]);
                                } else if ($ee["type"] === "delete") {
                                    $check = (new InventarioController)->delProductoFun($ee["id"], "central");
                                }
                            }
                            $respuesta[$key]["estatus"] = 3;
                        } catch (\Exception $e) {
                            //return (["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
                        }
                    }

                }
                break;
        }

        $respuesta = [
            "respuesta" => $respuesta,
            "estadisticas" => [
                "vinculados" => inventario::whereNotNull("id_vinculacion")->count(),
                "items_inventario" => inventario::count(),
                "items_inventario_recuperados" => count($respuesta),
            ],
        ];

        $response = Http::post(
            $this->path() . "/resolveTareaCentral",
            [
                "id_tarea" => $id_tarea,
                "estado" => $estadoset,
                "respuesta" => $respuesta,
            ]
        );
        if ($response->ok()) {
            //Retorna respuesta solo si es Array
            if ($response->json()) {
                return ([
                    "msj" => $response->json(),
                    "estado" => true,
                ]);
            } else {
                return ([
                    "msj" => $response->body(),
                    "estado" => true,
                ]);
            }
        } else {
            return ([
                "msj" => $response->body(),
                "estado" => false,
            ]);
        }
    }
    public function getTareasCentral(Request $req)
    {
        return Response::json($this->getTareasCentralFun($req->estado));
    }
    public function runTareaCentral(Request $req)
    {
        return Response::json($this->runTareaCentralFun($req["tarea"]));
    }
    public function setPedidoInCentralFromMaster($id, $id_sucursal, $type = "add")
    {
        try {
            $codigo_origen = $this->getOrigen();
            $response = Http::post(
                $this->path() . "/setPedidoInCentralFromMasters", [
                    "codigo_origen" => $codigo_origen,
                    "id_sucursal" => $id_sucursal,
                    "type" => $type,
                    "pedidos" => $this->pedidosExportadosFun($id),
                ]
            );

            if ($response->ok()) {
                $resretur = $response->json();
                
                if ($resretur["estado"]) {
                    $p = pedidos::find($id);
                    if ($type=="delete") {
                        $p->export = 0;
                    }else if($type=="add"){
                        $p->export = 1;
                    }
                    $p->save();
                }
                return $resretur;
            }

        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }
    }
    public function pedidosExportadosFun($id)
    {
        return pedidos::with([
            "cliente",
            "items" => function ($q) {
                $q->with([
                    "producto" => function ($q) {
                        $q->with(["proveedor", "categoria"]);
                    }
                ]);
            }
        ])
            ->where("id", $id)
            ->orderBy("id", "desc")
            ->get()
            ->map(function ($q) {
                $q->base = $q->items->map(function ($q) {
                    return $q->producto->precio_base * $q->cantidad;
                })->sum();
                $q->venta = $q->items->sum("monto");
                return $q;

            });
    }
    public function reqpedidos(Request $req)
    {
        try {
            $codigo_origen = $this->getOrigen();


            $response = Http::post($this->path() . '/respedidos', [
                "codigo_origen" => $codigo_origen,
            ]);

            if ($response->ok()) {
                $res = $response->json();
                if ($res["pedido"]) {


                    $pedidos = $res["pedido"];
                    foreach ($pedidos as $pedidokey => $pedido) {
                        foreach ($pedido["items"] as $keyitem => $item) {
                            ///id central ID VINCULACION
                            $checkifvinculado = vinculosucursales::where("id_sucursal", $pedido["id_origen"])
                                ->where("idinsucursal", $item["producto"]["idinsucursal"])->first();
                            $showvinculacion = null;
                            if ($checkifvinculado) {
                                $showvinculacion = inventario::find($checkifvinculado->id_producto);
                            }


                            $pedidos[$pedidokey]["items"][$keyitem]["match"] = $showvinculacion;
                            $pedidos[$pedidokey]["items"][$keyitem]["modificable"] = $showvinculacion ? false : true;
                        }
                        //$pedidos[$pedidokey];
                    }

                    return $pedidos;
                } else {
                    return "Not [pedido] " . var_dump($res);
                }
            } else {
                return "Error: " . $response->body();

            }

        } catch (\Exception $e) {
            return Response::json(["estado" => false, "msj" => "Error de sucursal: " . $e->getMessage()]);
        }
    }

    

    
    function sendComovamos()
    {

        $today = (new PedidosController)->today();
        $cop = (new PedidosController)->get_moneda()["cop"];
        $bs = (new PedidosController)->get_moneda()["bs"];

        $codigo_origen = $this->getOrigen();

        $comovamos = (new PedidosController)->cerrarFun($today, 0, 0, 0, [], true, (true), false);
        if ($today) {
            if (isset($comovamos["total"])) {
                $comovamos["total"] = floatval($comovamos["total"]);
            }
            if (isset($comovamos["5"])) {
                $comovamos["5"] = floatval($comovamos["5"]);
            }
            if (isset($comovamos["3"])) {
                $comovamos["3"] = floatval($comovamos["3"]);
            }
            if (isset($comovamos["2"])) {
                $comovamos["2"] = floatval($comovamos["2"]);
            }

            if (isset($comovamos["1"])) {
                $comovamos["1"] = floatval($comovamos["1"]);
            }
        }

        try {
            $response = Http::post($this->path() . "/setComovamos", [
                "codigo_origen" => $codigo_origen,
                "comovamos" => $comovamos,
                "fecha" => $today,
                "bs" => $bs,
                "cop" => $cop,

            ]);

            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                if ($response->json()) {
                    return Response::json([
                        "msj" => $response->json(),
                        "estado" => true,
                        "json" => true
                    ]);
                } else {
                    return Response::json([
                        "msj" => $response->body(),
                        "estado" => true,
                    ]);
                }
            } else {
                return Response::json([
                    "msj" => $response,
                    "estado" => false,
                ]);
            }
        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }

    }

    /////////////////////////////////

    function sendFacturaCentral(Request $req) {
        return $this->sendFacturaCentralFun($req->id);
    }

    

    function getAllProveedores() {
        try {
            $response = Http::post(
                $this->path() . "/getAllProveedores", []
            );
            if ($response->ok()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }
    }
    function sendFacturaCentralFun($id) {
        $factura = factura::with("proveedor")->where("id",$id)->get()->first();

        $codigo_origen = $this->getOrigen();
        $filename = public_path('facturas\\') . $factura->descripcion;
        $image = fopen($filename, 'r');

        //return $filename;
        $response = Http::attach('imagen', $image)
        ->post(
            $this->path() . "/sendFacturaCentral", [
                "codigo_origen" => $codigo_origen,
                "factura" => $factura,
            ]
        );

        if ($response->ok()) {
            if($response->json()){
                $res = $response->json();

                if (isset($res["idinsucursal"])) {
                    $f = factura::find($res["idinsucursal"])->update(["estatus"=>1]);

                    if ($f) {
                        return [
                            "msj" => $res["msj"],
                            "estatus" => true
                        ];
                    }
                }
            }
        }
        
    }
    function sendGarantias($lastid)
    {
        return garantia::with(["producto"])->where("id",">",$lastid)->get();
    }
    function sendFallas($lastid)
    {
        return fallas::with(["producto" => function ($q) {$q->select(["id", "stockmin","stockmax", "cantidad"]);}])
        ->where("id",">",$lastid)->get();
    }
    function sendInventario($all = false)
    {
        $today = (new PedidosController)->today();
        return inventario::where("updated_at","LIKE",$today."%")->get();
    }

    function retpago($tipo) {
        switch ($tipo) {
            case "1": 
                return "Transferencia"; 
            break;
            case "2": 
                return "Debito"; 
            break; 
            case "3": 
                return "Efectivo"; 
            break; 
            case "4": 
                return "Credito"; 
            break;  
            case "5": 
                return "BioPago"; 
            break;
            case "6": 
                return "vuelto"; 
            break;
        }
    }
    public function sendCierres($lastfecha)
    {
        $cierres = cierres::where("fecha",">",$lastfecha)->where("tipo_cierre",1)->get();
        $data = [];
        if ($cierres) {

            foreach ($cierres as $key => $cierre) {
                $today = $cierre->fecha;
                $c = cierres::where("tipo_cierre", 0)->where("fecha", $today)->get();

                $pagos_referencias_dia = pagos_referencias::where("created_at", "LIKE" , $today."%")->get();
                $lotes = [];

                foreach ($pagos_referencias_dia as $ref) {
                    array_push($lotes, [

                        "monto" => $ref["monto"],
                        "lote" => $ref["descripcion"],
                        "banco" => $ref["banco"],
                        "fecha" => $today,
                        "id_usuario" => $ref["id"],
                        "tipo" => $this->retpago($ref["tipo"])
                    ]);
                }
                foreach ($c as $key => $e) {
                    if ($e->puntolote1montobs && $e->puntolote1) {
                        array_push($lotes, [
                            "monto" => $e->puntolote1montobs,
                            "lote" => $e->puntolote1,
                            "banco" => $e->puntolote1banco,
                            "fecha" => $today,
                            "id_usuario" => $e->id_usuario,
                            "tipo" => "PUNTO 1"
                        ]);
                    }
                    if ($e->puntolote2montobs && $e->puntolote2) {
                        array_push($lotes, [
                            "monto" => $e->puntolote2montobs,
                            "lote" => $e->puntolote2,
                            "banco" => $e->puntolote2banco,
                            "fecha" => $today,
                            "id_usuario" => $e->id_usuario,
                            "tipo" => "PUNTO 2"
    
    
                        ]);
                    }
                    if ($e->biopagoserial && $e->biopagoserialmontobs) {
                        array_push($lotes, [
                            "monto" => $e->biopagoserialmontobs,
                            "lote" => $e->biopagoserial,
                            "banco" => "0102",
                            "fecha" => $today,
                            "id_usuario" => $e->id_usuario,
                            "tipo" => "BIOPAGO 1"
    
                        ]);
                    }
                }
                 
                
                array_push($data,[
                    "cierre" => $cierre,
                    "lotes" => $lotes,
                ]);
            }

            return $data;
        }
    }

    function verificarMovPenControlEfec() {
        $codigo_origen = $this->getOrigen();
        $response = Http::post(
            $this->path() . "/verificarMovPenControlEfec",
            [
                "codigo_origen" => $codigo_origen,
            ]
        );
        if ($response->ok()) {
            //Retorna respuesta solo si es Array
            $data = $response->json();

            if (count($data)) {
                $cajasget = cajas::where("estatus",0)->orderBy("id","asc")->get();
                foreach ($data as $i => $mov) {
                    foreach ($cajasget as $ii => $ee) {
                        if ($ee->id==$mov["idinsucursal"]) {
                            (new CajasController)->setCajaFun([
                                "id" => $mov["idinsucursal"],
                                "concepto" => $mov["concepto"],
                                "categoria" => $mov["categoria"],
                                "montodolar" => $mov["montodolar"],
                                "montopeso" => $mov["montopeso"],
                                "montobs" => $mov["montobs"],
                                "montoeuro" => $mov["montoeuro"],
                                "tipo" => $mov["tipo"],
                                "estatus" => $mov["estatus"],
                            ]);
                        }
                    }
                }

                cajas::where("estatus",0)->delete();

            }
        }else{
            return $response;
        }
    }
    function setPermisoCajas($data) {
        $codigo_origen = $this->getOrigen();
        $response = Http::post(
            $this->path() . "/setPermisoCajas",
            [
                "codigo_origen" => $codigo_origen,
                "data" => $data,  
            ]
        );

        if ($response->ok()) {
            //Retorna respuesta solo si es Array
            return $response->body();
        }else{
            return $response;
        }
    }

    function createCreditoAprobacion($data) {
        $codigo_origen = $this->getOrigen();
        $response = Http::post(
            $this->path() . "/createCreditoAprobacion",
            [
                "codigo_origen" => $codigo_origen,
                "data" => $data, 
            ]
        );

        if ($response->ok()) {
            //Retorna respuesta solo si es Array
            return $response->body();
        }else{
            return $response;
        }
    }
    function sendEfec($lastid)
    {
        return cajas::with("cat")->where("id",">",$lastid)->get();
    }

    function sendCreditos() {
        $today = (new PedidosController)->today();
        return clientes::selectRaw("*,(SELECT created_at FROM pago_pedidos WHERE id_pedido IN (SELECT id FROM pedidos WHERE id_cliente=clientes.id) AND tipo=4 AND created_at IS NOT NULL ORDER BY id desc LIMIT 1) as creacion , @credito := (SELECT COALESCE(sum(monto),0) FROM pago_pedidos WHERE id_pedido IN (SELECT id FROM pedidos WHERE id_cliente=clientes.id) AND tipo=4) as credito, @abono := (SELECT COALESCE(sum(monto),0) FROM pago_pedidos WHERE id_pedido IN (SELECT id FROM pedidos WHERE id_cliente=clientes.id) AND cuenta=0) as abono, (@abono-@credito) as saldo, @vence := (SELECT fecha_vence FROM pedidos WHERE id_cliente=clientes.id AND fecha_vence > $today ORDER BY pedidos.fecha_vence ASC LIMIT 1) as vence , (COALESCE(DATEDIFF(@vence,'$today 00:00:00'),0)) as dias")
        // ->where("saldo","<",0)
        ->having("saldo","<",0)
        ->orderBy("saldo","asc")
        ->get();
    }

    function sendAllTest() {
        $codigo_origen = $this->getOrigen();
            
        $getLast = Http::get($this->path() . "/getLast", [
            "codigo_origen" => $codigo_origen,
        ]);

        if ($getLast->ok()) {
            $getLast = $getLast->json();
            if ($getLast==null) {
                
                $date_last_cierres = "2000-01-01";
                $id_last_garantias = 0;
                $id_last_fallas = 0;
                $id_last_efec = 0;
            }else{
                $date_last_cierres = $getLast["date_last_cierres"]?$getLast["date_last_cierres"]:"2000-01-01";
                $id_last_garantias = $getLast["id_last_garantias"]?$getLast["id_last_garantias"]:0;
                $id_last_fallas = $getLast["id_last_fallas"]?$getLast["id_last_fallas"]:0;
                $id_last_efec = $getLast["id_last_efec"]?$getLast["id_last_efec"]:0;
            }

            $data = [
                "sendInventarioCt" => $this->sendInventario(),
                "sendGarantias" => $this->sendGarantias($id_last_garantias),
                "sendFallas" => $this->sendFallas($id_last_fallas),
                "setCierreFromSucursalToCentral" => $this->sendCierres($date_last_cierres),
                "setEfecFromSucursalToCentral" => $this->sendEfec($id_last_efec),
                "sendCreditos" => $this->sendCreditos(),
                "codigo_origen" => $codigo_origen,
            ];

            //return $this->sendCreditos();

           
            //return $this->sendEfec($id_last_efec);


            $setAll = Http::post($this->path() . "/setAll", $data);

            if (!$setAll->json()) {
                return $setAll;
            }

            if ($setAll->ok()) {
                
                
                return $setAll->json();
                
            }else{
                return "ERROR: ".$setAll;
            }
        }
    }

    function sendAll($correo) {

        try {
            $codigo_origen = $this->getOrigen();
            
            $getLast = Http::get($this->path() . "/getLast", [
                "codigo_origen" => $codigo_origen,
            ]);

            if ($getLast->ok()) {
                $getLast = $getLast->json();
                if (!$getLast) {
                    
                    $date_last_cierres = "2000-01-01";
                    $id_last_garantias = 0;
                    $id_last_fallas = 0;
                    $id_last_efec = 0;
                }else{
                    $id_last_garantias = $getLast["id_last_garantias"];
                    $id_last_fallas = $getLast["id_last_fallas"];
                    $date_last_cierres = $getLast["date_last_cierres"];
                    $id_last_efec = $getLast["id_last_efec"];
                }

                $data = [
                    "sendInventarioCt" => $this->sendInventario(),
                    "sendGarantias" => $this->sendGarantias($id_last_garantias),
                    "sendFallas" => $this->sendFallas($id_last_fallas),
                    "setCierreFromSucursalToCentral" => $this->sendCierres($date_last_cierres),
                    "setEfecFromSucursalToCentral" => $this->sendEfec($id_last_efec),
                    "sendCreditos" => $this->sendCreditos(),
                    "codigo_origen" => $codigo_origen,
                ];

                //return $this->sendEfec($id_last_efec);


                $setAll = Http::post($this->path() . "/setAll", $data);

                if (!$setAll->json()) {
                    return $setAll;
                }

                if ($setAll->ok()) {
                    
                    $arr_send = $correo[0];
                    $from1 = $correo[1];
                    $from = $correo[2];
                    $subject = $correo[3];
            
                    Mail::to($this->sends())->send(new enviarCierre($arr_send, $from1, $from, $subject));
            
                    \Artisan::call('database:backup'); //Hacer respaldo Local
                    \Artisan::call('backup:run'); //Enviar Respaldo al correo
                    return $setAll->json();
                    
                }else{
                    return "ERROR: ".$setAll;
                }
            }

        } catch (\Exception $e) {
            return $e->getMessage();
        }

        
        
    }



    ////////////////////

    function getNomina()
    {
        try {
            $codigo_origen = $this->getOrigen();

            $response = Http::post($this->path() . "/getNomina", [
                "codigo_origen" => $codigo_origen,
            ]);

            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                return $response->json();
            }
        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }
    }

    function sendEstadisticas()
    {
        $data = [
            "fechaQEstaInve" => "",
            "fechaFromEstaInve" => "",
            "fechaToEstaInve" => "",
            "orderByEstaInv" => "DESC",
            "orderByColumEstaInv" => "cantidadtotal",
            "categoriaEstaInve" => "",
        ];
        $codigo_origen = $this->getOrigen();


        try {
            $response = Http::post($this->path() . "/setEstadisticas", [
                "codigo_origen" => $codigo_origen,
                "estadisticas" => (new InventarioController)->getEstadisticasFun($data),


            ]);

            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                if ($response->json()) {
                    return Response::json([
                        "msj" => $response->json(),
                        "estado" => true,
                        "json" => true
                    ]);
                } else {
                    return Response::json([
                        "msj" => $response->body(),
                        "estado" => true,
                    ]);
                }
            } else {
                return Response::json([
                    "msj" => $response,
                    "estado" => false,
                ]);
            }
        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }
    }











    ////////////////////////////////////////////////77


    public function getDataEspecifica($type, $url)
    {
        $sucursal = $this->getOrigen();
        $arr = [];
        switch ($type) {
            case 'inventarioSucursalFromCentral':

                $arr = [
                    //"categorias" => categorias::all(),
                    //"proveedores" => proveedores::all(),
                    "inventario" => inventario::all(),
                ];

                break;
            case 'fallaspanelcentroacopio':
                $arr = ["fallas" => fallas::all()];

                break;
            case 'estadisticaspanelcentroacopio':
                $arr = [];
                break;
            case 'gastospanelcentroacopio':
                $arr = [];
                break;
            case 'cierrespanelcentroacopio':
                $arr = [];
                break;
            case 'diadeventapanelcentroacopio':
                $arr = (new PedidosController)->getDiaVentaFun((new PedidosController)->today());
                break;
        }
        $arr["sucursal"] = $sucursal;


        $response = Http::post($this->path() . "/" . $url, $arr);

        if ($response->ok()) {
            $res = $response->json();
            return $res;
        } else {
            return "Error: " . $response->body();
        }
        return $arr;
    }
    public function setInventarioFromSucursal()
    {
        return $this->getDataEspecifica("inventarioSucursalFromCentral", "setInventarioFromSucursal");
    }

    public function setNuevaTareaCentral(Request $req)
    {
        $type = $req->type;
        $response = Http::post($this->path() . "/setNuevaTareaCentral", ["type" => $type]);

        if ($response->ok()) {
            $res = $response->json();
            return $res;
        } else {
            return "Error: " . $response->body();

        }
    }
    public function index()
    {
        return view("central.index");
    }
    // public function update($new_version)
    // {}
    //     $runproduction = "npm run production";        
    //     // $phpArtisan = "php artisan key:generate && php artisan view:cache && php artisan route:cache && php artisan config:cache";

    //     $pull = shell_exec("cd C:\sinapsisfacturacion && git stash && git pull https://github.com/alvaritojose2712/sinapsisfacturacion.git && composer install --optimize-autoloader --no-dev");

    //     if (!str_contains($pull, "Already up to date")) {
    //         echo "Éxito al Pull. Building...";
    //         exec("cd C:\sinapsisfacturacion && ".$runproduction." && ".$phpArtisan,$output, $retval);

    //         if (!$retval) {
    //             echo "Éxito al Build. Actualizado...";

    //             sucursal::update(["app_version",$new_version]);
    //         }
    //     }else{
    //         echo "Pull al día. No requiere actualizar <br>";
    //         echo "<pre>$pull</pre>";

    //     }
    // }


    //req

    public function getip()
    {
        return getHostByName(getHostName());
    }
    public function getmastermachine()
    {
        return ["192.168.0.103:8001", "192.168.0.102:8001", "127.0.0.1:8001"];
    }
    public function changeExportStatus($pathcentral, $id)
    {
        $response = Http::post($this->path() . "/changeExtraidoEstadoPed", ["id" => $id]);
    }
    public function setnewtasainsucursal(Request $req)
    {
        $tipo = $req->tipo;
        $valor = $req->valor;
        $id_sucursal = $req->id_sucursal;



        $response = Http::post($this->path() . "/setnewtasainsucursal", [
            "tipo" => $tipo,
            "valor" => $valor,
            "id_sucursal" => $id_sucursal,
        ]);
        if ($response->ok()) {
            if ($response->json()) {
                return $response->json();
            } else {
                return $response;
            }
        } else {
            return "Error: " . $response->body();
        }
    }
    public function changeEstatusProductoProceced($ids, $id_sucursal)
    {
        $response = Http::post($this->path() . "/changeEstatusProductoProceced", [
            "ids" => $ids,
            "id_sucursal" => $id_sucursal,
        ]);

        if ($response->ok()) {
            if ($response->json()) {

                if ($response->json()) {
                    return $response->json();
                } else {
                    return $response;
                }
            } else {
                return $response;
            }
        } else {

            return "Error de Local Centro de Acopio: " . $response->body();
        }
    }
    public function setCambiosInventarioSucursal(Request $req)
    {
        $response = Http::post($this->path() . "/setCambiosInventarioSucursal", [
            "productos" => $req->productos,
            "sucursal" => $req->sucursal,
        ]);

        if ($response->ok()) {
            if ($response->json()) {
                return $response->json();
            } else {
                return $response;
            }
        } else {

            return "Error de Local Centro de Acopio: " . $response->body();
        }
    }

    public function getInventarioFromSucursal(Request $req)
    {
        $sucursal = $this->getOrigen();
        $response = Http::post($this->path() . "/getInventarioFromSucursal", [
            "sucursal" => $sucursal,
        ]);

        if ($response->ok()) {
            $res = $response->json();
            if ($res) {
                if (isset($res["estado"])) {
                    return $res;
                } else {
                    $arr_convert = [];
                    foreach ($res as $key => $e) {
                        $find = inventario::with(["categoria", "proveedor"])->where("id", $e["id_pro_sucursal_fixed"])->first();
                        if ($find) {
                            $find["type"] = "original";
                            array_push($arr_convert, $find);

                        }
                        $e["type"] = "replace";
                        array_push($arr_convert, $e);
                    }
                    return $arr_convert;
                }
            } else {
                return $response;
            }
        } else {

            return "Error de Local Centro de Acopio: " . $response->body();
        }

    }
    //res

    /* public function respedidos(Request $req)
    {
        

        if ($ped) {
            return Response::json([
                "msj"=>"Tenemos algo :D",
                "pedido"=>$ped,
                "estado"=>true
            ]);
        }else{
            return Response::json([
                "msj"=>"No hay pedidos pendientes :(",
                "estado"=>false
            ]);
        }
    } */
    public function resinventario(Request $req)
    {
        //return "exportinventario";
        return [
            "inventario" => inventario::all(),
            "categorias" => categorias::all(),
            "proveedores" => proveedores::all(),
        ];
    }




    public function updateApp()
    {
        try {

            $sucursal = $this->getOrigen();
            $actually_version = $sucursal["app_version"];

            $getVersion = Http::get($this->path . "/getVersionRemote");

            if ($getVersion->ok()) {

                $server_version = $getVersion->json();
                if ($actually_version != $server_version) {
                    $this->update($server_version);
                } else if ($actually_version == $server_version) {
                    return "Sistema al día :)";
                } else {
                    return "Upps.. :(" . "V-Actual=" . $actually_version . " V-Remote" . $server_version;

                }
                ;
            }
        } catch (\Exception $e) {
            return "Error: " . $e->getMessage();
        }

    }


    public function getInventarioCentral()
    {
        try {
            $sucursal = $this->getOrigen();
            $response = Http::post($this->path . '/getInventario', [
                "sucursal_code" => $sucursal->codigo,

            ]);
        } catch (\Exception $e) {
            return Response::json(["estado" => false, "msj" => "Error de sucursal: " . $e->getMessage()]);

        }

    }


    public function setFacturasCentral()
    {
        try {
            $sucursal = $this->getOrigen();
            $facturas = factura::with([
                "proveedor",
                "items" => function ($q) {
                    $q->with("producto");
                }
            ])
                ->where("push", 0)->get();


            if (!$facturas->count()) {
                return Response::json(["msj" => "Nada que enviar", "estado" => false]);
            }


            $response = Http::post($this->path . '/setConfirmFacturas', [
                "sucursal_code" => $sucursal->codigo,
                "facturas" => $facturas
            ]);

            //ids_ok => id de movimiento 

            if ($response->ok()) {
                $res = $response->json();
                if (isset($res["estado"])) {
                    if ($res["estado"]) {
                        factura::where("push", 0)->update(["push" => 1]);
                        return $res["msj"];
                    }

                } else {

                    return $response;
                }
            } else {
                return $response->body();
            }
        } catch (\Exception $e) {
            return Response::json(["estado" => false, "msj" => "Error de sucursal: " . $e->getMessage()]);

        }
    }
    public function setCentralData()
    {
        try {
            $sucursal = $this->getOrigen();
            $fallas = fallas::all();

            if (!$fallas->count()) {
                return Response::json(["msj" => "Nada que enviar", "estado" => false]);
            }


            $response = Http::post($this->path . '/setFalla', [
                "sucursal_code" => $sucursal->codigo,
                "fallas" => $fallas
            ]);

            //ids_ok => id de productos 

            if ($response->ok()) {
                $res = $response->json();
                // code...

                if ($res["estado"]) {

                    return $res["msj"];
                }
            } else {

                return $response;
            }
        } catch (\Exception $e) {
            return Response::json(["estado" => false, "msj" => "Error de sucursal: " . $e->getMessage()]);

        }


    }

    public function setVentas()
    {
        try {
            $PedidosController = new PedidosController;
            $sucursal = $this->getOrigen();
            $fecha = $PedidosController->today();
            $bs = $PedidosController->get_moneda()["bs"];

            $cierre_fun = $PedidosController->cerrarFun($fecha, 0, 0, 0);

            // 1 Transferencia
            // 2 Debito 
            // 3 Efectivo 
            // 4 Credito  
            // 5 Otros
            // 6 vuelto

            $ventas = [
                "debito" => $cierre_fun[2],
                "efectivo" => $cierre_fun[3],
                "transferencia" => $cierre_fun[1],
                "biopago" => $cierre_fun[5],
                "tasa" => $bs,
                "fecha" => $cierre_fun["fecha"],
                "num_ventas" => $cierre_fun["numventas"],
            ];


            $response = Http::post($this->path . '/setVentas', [
                "sucursal_code" => $sucursal->codigo,
                "ventas" => $ventas
            ]);

            //ids_ok => id de movimiento 

            if ($response->ok()) {
                $res = $response->json();
                if ($res["estado"]) {
                    return $res["msj"];
                }
            } else {
                return $response->body();
            }
        } catch (\Exception $e) {
            return Response::json(["estado" => false, "msj" => "Error de sucursal: " . $e->getMessage()]);

        }

    }
    public function updatetasasfromCentral()
    {
        try {
            $sucursal = $this->getOrigen();

            $response = Http::post($this->path() . '/getMonedaSucursal', ["codigo" => $sucursal->codigo]);

            if ($response->ok()) {
                $res = $response->json();
                foreach ($res as $key => $e) {
                    moneda::updateOrCreate(["tipo" => $e["tipo"]], [
                        "tipo" => $e["tipo"],
                        "valor" => $e["valor"]
                    ]);
                }

                Cache::forget('bs');
                Cache::forget('cop');

            } else {
                return "Error: " . $response->body();

            }

        } catch (\Exception $e) {
            return Response::json(["estado" => false, "msj" => "Error de sucursal: " . $e->getMessage()]);
        }
    }

}