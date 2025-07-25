<?php

namespace App\Http\Controllers;

use App\Models\inventarios_novedades;
use App\Models\pago_pedidos;
use App\Models\pedidos;
use App\Models\inventario;
use App\Models\items_pedidos;
use App\Models\factura;
use App\Models\items_factura;
use App\Models\fallas;
use App\Models\proveedores;
use App\Models\sucursal;
use App\Models\categorias;
use App\Models\clientes;
use App\Models\cierres;
use App\Models\garantia;


use App\Models\movimientos;
use App\Models\items_movimiento;

use App\Models\usuarios;
use App\Models\depositos;
use App\Models\marcas;
use App\Models\vinculosucursales;
use DB;
use Response;
use Storage;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class InventarioController extends Controller
{

    function enInventario()  {
        //true LIBRE
        
        return false;
        //false NORMAL, SIN PERMISO
    }

    public function guardarDeSucursalEnCentral(Request $req)
    {
        $producto = $req->producto;
        try{
            $id = $this->guardarProducto([
                "codigo_proveedor" => $producto["codigo_proveedor"],
                "codigo_barras" => $producto["codigo_barras"],
                "id_proveedor" => $producto["id_proveedor"],
                "id_categoria" => $producto["id_categoria"],
                "id_marca" => $producto["id_marca"],
                "unidad" => $producto["unidad"],
                "descripcion" => $producto["descripcion"],
                "iva" => $producto["iva"],
                "precio_base" => $producto["precio_base"],
                "precio" => $producto["precio"],
                "cantidad" => $producto["cantidad"],
                "bulto" => $producto["bulto"],
                "precio1" => $producto["precio1"],
                "precio2" => $producto["precio2"],
                "precio3" => $producto["precio3"],
                "stockmin" => $producto["stockmin"],
                "stockmax" => $producto["stockmax"],
    
                "id_deposito" => "",
                "porcentaje_ganancia" => 0,
                
                "id_factura" => null,
                "origen"=>"localCopyCentral",
    
                "id" => null,
            ]);
            return Response::json(["msj"=>"Éxito","estado"=>true,"id"=>$id]);   
        } catch (\Exception $e) {

            $id_producto = inventario::where("codigo_barras", $producto["codigo_barras"])->first();
            $id = null;
            if ($id_producto) {
                $id = $id_producto->id;
            }
            return Response::json(["msj"=>"Err: ".$e->getMessage(),"estado"=>false, "id" => $id]);
        } 
    }
    public function saveChangeInvInSucurFromCentral(Request $req)
    {
        $inv = $req->inventarioModifiedCentralImport;
        $count = 0;
        $ids_true = [];
        $id_sucursal = null;
        foreach ($inv as $i => $e) {
            $obj = inventario::find($e["id_pro_sucursal_fixed"]);
            if ($obj) {
                $obj->id = $e["id_pro_sucursal"];
                $obj->codigo_barras = $e["codigo_barras"];
                $obj->codigo_proveedor = $e["codigo_proveedor"];
                $obj->id_proveedor = $e["id_proveedor"];
                $obj->id_categoria = $e["id_categoria"];
                $obj->id_marca = $e["id_marca"];
                $obj->unidad = $e["unidad"];
                $obj->id_deposito = $e["id_deposito"];
                $obj->descripcion = $e["descripcion"];
                $obj->iva = $e["iva"];
                $obj->porcentaje_ganancia = $e["porcentaje_ganancia"];
                $obj->precio_base = $e["precio_base"];
                $obj->precio = $e["precio"];
                /*  $obj->cantidad = $e["cantidad"];*/

                if ($obj->save()) {
                    $count++;
                    array_push($ids_true,$e["id"]);
                }

                $id_sucursal = $e["id_sucursal"];
            }
        }
        $changeEstatus = (new sendcentral)->changeEstatusProductoProceced($ids_true,$id_sucursal);
        return ["estado"=>true,"msj"=>"Éxito. $count productos modificados. "];
    }
    public function setCtxBulto(Request $req)
    {

        try {
            $id = $req->id;
            $bulto = $req->bulto;
            if ($id) {
                inventario::find($id)->update(["bulto"=>$bulto]);
                // code...
            }
            return Response::json(["msj"=>"Éxito. Bulto ".$bulto,"estado"=>true]);
            
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
            
        }
    }
    public function setStockMin(Request $req)
    {

        try {
            $id = $req->id;
            $min = $req->min;
            if ($id) {
                inventario::find($id)->update(["stockmin"=>$min]);
            }
            return Response::json(["msj"=>"Éxito. StockMin ".$min,"estado"=>true]);
            
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
            
        }
    }
    
    public function setPrecioAlterno(Request $req)
    {
        
        try {
            $id = $req->id;
            $type = $req->type;
            $precio = $req->precio;

            $arr = ["precio1"=>$precio];

            switch ($type) {
                case 'p1':
                    // code...
                        $arr = ["precio1"=>$precio];
                    break;
                case 'p2':
                        $arr = ["precio2"=>$precio];
                    break;
                case 'p3':
                        $arr = ["precio3"=>$precio];
                    break;                
            }
            if ($id) {
                inventario::find($id)->update($arr);
                // code...
            }

            return Response::json(["msj"=>"Éxito. Precio ".$precio,"estado"=>true]);
            
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
            
        }
    }
    function getEstaInventario(Request $req) {
        $data = [
            "fechaQEstaInve" => $req->fechaQEstaInve,
            "fechaFromEstaInve" => $req->fechaFromEstaInve,
            "fechaToEstaInve" => $req->fechaToEstaInve,
            "orderByEstaInv" => $req->orderByEstaInv,
            "orderByColumEstaInv" => $req->orderByColumEstaInv,
            "categoriaEstaInve" => $req->categoriaEstaInve,
        ];
        return $this->getEstadisticasFun($data);

    }

    function verde() {
        return inventario::where("push",0)->update(["push"=>1]);
    }
    public function getEstadisticasFun($data)
    {
        $fechaQEstaInve = $data["fechaQEstaInve"];
        $fecha1pedido = $data["fechaFromEstaInve"];
        $fecha2pedido = $data["fechaToEstaInve"];
        $orderByEstaInv = $data["orderByEstaInv"];
        $orderByColumEstaInv = $data["orderByColumEstaInv"];
        $categoriaEstaInve = $data["categoriaEstaInve"];
        
        $tipoestadopedido = 1;

        return inventario::with([
            "proveedor",
            "categoria",
            "marca",
            "deposito",
        ])
            ->whereIn("id", function ($q) use ($fecha1pedido, $fecha2pedido, $tipoestadopedido) {
                $q->from("items_pedidos")
                ->whereIn("id_pedido", function ($q) use ($fecha1pedido, $fecha2pedido, $tipoestadopedido) {
                    $q->from("pedidos")
                    ->when($fecha1pedido != "", function ($q) use ($fecha1pedido, $fecha2pedido) {
                        $q->whereBetween("created_at", ["$fecha1pedido 00:00:00", "$fecha2pedido 23:59:59"]);
                    })
                    ->whereIn("id",pago_pedidos::where("tipo","<>",4)->select("id_pedido"))
                    
                    ->select("id");
                })
            ->select("id_producto");

        })
        ->when (!empty($categoriaEstaInve) , function ($query) use($categoriaEstaInve){
            return $query->where('id_categoria',$categoriaEstaInve);
        })
        ->where(function($q) use ($fechaQEstaInve)
        {
            $q->orWhere("descripcion","LIKE","%$fechaQEstaInve%")
            ->orWhere("codigo_proveedor","LIKE","%$fechaQEstaInve%");
            
        })
        ->selectRaw("*,@cantidadtotal := (SELECT sum(cantidad) FROM items_pedidos WHERE id_producto=inventarios.id ".( $fecha1pedido==""?"":("AND created_at BETWEEN '$fecha1pedido 00:00:00' AND '$fecha2pedido 23:59:59'") ).") as cantidadtotal,(@cantidadtotal*inventarios.precio) as totalventa")
        ->orderByRaw(" $orderByColumEstaInv"." ".$orderByEstaInv)
        ->get();
        // ->map(function($q)use ($fecha1pedido,$fecha2pedido){
        //     $items = items_pedidos::whereBetween("created_at",["$fecha1pedido 00:00:00","$fecha2pedido 23:59:59"])
        //     ->where("id_producto",$q->id)->sum("cantidad");

        //     $q->cantidadtotal = $items
        //     // $q->items = $items->get();

        //     return $q;
        // })->sortBy("cantidadtotal");



    }

    public function hacer_pedido($id,$id_pedido,$cantidad,$type,$typeafter=null,$usuario=null,$devolucionTipo=0,$arrgarantia=null)
    {   
        try {
           
            $cantidad = !$cantidad?1:$cantidad;

            if ($devolucionTipo==2 || $devolucionTipo == 1) {
                $cantidad = $cantidad * -1;
            }

            if ($cantidad < 0) {
                throw new \Exception("La cantidad no puede ser negativa", 1);
            }
            $old_ct = 0;
            if ($type=="ins") {
                if ($id_pedido=="nuevo") {
                    //Crea Pedido

                    $pro = inventario::find($id);
                    $loquehabra = $pro->cantidad - $cantidad;
                    
                    if ($loquehabra<0) {
                        throw new \Exception("No hay disponible la cantidad solicitada", 1);
                        
                    }
                    
                    $new_pedido = new pedidos;
                    $new_pedido->estado = 0;
                    $new_pedido->id_cliente = 1;
                    $new_pedido->id_vendedor = $usuario;
                    $new_pedido->save();
                    $id_pedido = $new_pedido->id;
                }

                if ($id_pedido=="ultimo") {
                    $idlast = pedidos::where("id_vendedor",session("id_usuario"))->where("estado",0)->orderBy("id","desc")->first();

                    if ($idlast) {
                        $id_pedido = $idlast->id;
                    }
                }

                $checkItemsPedidoCondicionGarantiaCero = (new PedidosController)->checkItemsPedidoCondicionGarantiaCero($id_pedido);
                if ($checkItemsPedidoCondicionGarantiaCero!==true) {
                    throw new \Exception("Error: El pedido tiene garantias, no puede agregar productos", 1);
                }
                
                // Verificar si el producto ya existe en el pedido
                $existingProduct = items_pedidos::where("id_producto", $id)
                    ->where("id_pedido", $id_pedido)
                    ->first();

                if ($existingProduct) {
                    return ["msj" => "El producto ya existe en el pedido", "estado" => "ok"];
                }
                
                $producto = inventario::select(["cantidad","precio"])->find($id);
                $precio = $producto->precio;

                
                if ($precio > 20 && (floor($cantidad) != $cantidad)) {
                    throw new \Exception("Para productos con precio mayor a 25, la cantidad debe ser un número entero ".$cantidad." | ".$precio, 1);
                }
                
                $setcantidad = $cantidad;
                $setprecio = $precio;
                
                $checkIfExits = items_pedidos::select(["cantidad","condicion"])
                ->where("id_producto",$id)
                ->where("id_pedido",$id_pedido)
                ->first();
                
                (new PedidosController)->checkPedidoAuth($id_pedido);
                $checkPedidoPago = (new PedidosController)->checkPedidoPago($id_pedido);
                if ($checkPedidoPago!==true) {
                    return $checkPedidoPago;
                }
                
                if ($checkIfExits) {
                    
                    if ($checkIfExits["condicion"]==1 || $devolucionTipo==1) {
                        return ["msj" => "Error: Producto ya agregado, elimine y vuelva a intentar " . $checkIfExits->id_producto . " || Cant. " . $cantidad, "estado" => "ok"];
                    }
                    $old_ct = $checkIfExits["cantidad"];

                    if ($cantidad=="1000000") { //codigo para sumar de uno en uno
                        $setcantidad = 1 + $old_ct; //Sumar cantidad a lo que ya existe en carrito
                    }else{
                        $setcantidad = $cantidad;
                    }

                    $setprecio = $setcantidad*$precio;
                }else{
                    if ($cantidad=="1000000") { //codigo para sumar de uno en uno
                        $setcantidad = 1; //Sumar cantidad a lo que ya existe en carrito
                    }

                    $setprecio = $setcantidad*$precio;
                }

                $ctquehabia = $producto->cantidad + $old_ct;
                
                $ctSeter = ($ctquehabia - $setcantidad);

                if ($devolucionTipo==1) {
                    
                    garantia::updateOrCreate(
                        [
                            "id_producto" => $id,
                            "id_pedido" => $id_pedido
                        ],
                        [
                            "cantidad" => ($cantidad*-1),

                            "motivo" => isset($arrgarantia["motivo"])?$arrgarantia["motivo"]:null,
                            "cantidad_salida" => isset($arrgarantia["cantidad_salida"])?$arrgarantia["cantidad_salida"]:null,
                            "motivo_salida" => isset($arrgarantia["motivo_salida"])?$arrgarantia["motivo_salida"]:null,
                            "ci_cajero" => isset($arrgarantia["ci_cajero"])?$arrgarantia["ci_cajero"]:null,
                            "ci_autorizo" => isset($arrgarantia["ci_autorizo"])?$arrgarantia["ci_autorizo"]:null,
                            "dias_desdecompra" => isset($arrgarantia["dias_desdecompra"])?$arrgarantia["dias_desdecompra"]:null,
                            "ci_cliente" => isset($arrgarantia["ci_cliente"])?$arrgarantia["ci_cliente"]:null,
                            "telefono_cliente" => isset($arrgarantia["telefono_cliente"])?$arrgarantia["telefono_cliente"]:null,
                            "nombre_cliente" => isset($arrgarantia["nombre_cliente"])?$arrgarantia["nombre_cliente"]:null,
                            "nombre_cajero" => isset($arrgarantia["nombre_cajero"])?$arrgarantia["nombre_cajero"]:null,
                            "nombre_autorizo" => isset($arrgarantia["nombre_autorizo"])?$arrgarantia["nombre_autorizo"]:null,
                            "trajo_factura" => isset($arrgarantia["trajo_factura"])?$arrgarantia["trajo_factura"]:null,
                            "motivonotrajofact" => isset($arrgarantia["motivonotrajofact"])?$arrgarantia["motivonotrajofact"]:null,
                            "numfactoriginal" => isset($arrgarantia["numfactoriginal"])?$arrgarantia["numfactoriginal"]:null,
                            "numfactgarantia" => $id_pedido,

                            

                        ]
                    );
                }else{
                    $this->descontarInventario($id,$ctSeter, $ctquehabia, $id_pedido, "VENTA");
                    $this->checkFalla($id,$ctSeter);
                }
                items_pedidos::updateOrCreate([
                    "id_producto"=>$id,
                    "id_pedido"=>$id_pedido,
                ],[
                    "id_producto" => $id,
                    "id_pedido" => $id_pedido,
                    "cantidad" => $setcantidad,
                    "monto" => $setprecio,
                    "condicion" => $devolucionTipo,
                ]);

                return ["msj"=>"Agregado al pedido #".$id_pedido." || Cant. ".$cantidad,"estado"=>"ok","num_pedido"=>$id_pedido,"type"=>$typeafter];

            }else if($type=="upd"){


                $checkIfExits = items_pedidos::select(["id_producto","cantidad","condicion","id_pedido"])->find($id);
                $condicion = $checkIfExits->condicion;
                if ($condicion==1 || $devolucionTipo==1) {
                    return ["msj" => "Error: Producto ya agregado, elimine y vuelva a intentar " . $checkIfExits->id_producto . " || Cant. " . $cantidad, "estado" => "ok"];
                }

                $checkItemsPedidoCondicionGarantiaCero = (new PedidosController)->checkItemsPedidoCondicionGarantiaCero($checkIfExits->id_pedido);
                if ($checkItemsPedidoCondicionGarantiaCero!==true) {
                    throw new \Exception("Error: El pedido tiene garantias, no puede actualizar el item", 1);
                }
                
                (new PedidosController)->checkPedidoAuth($id,"item");
                $checkPedidoPago = (new PedidosController)->checkPedidoPago($id,"item");
                if ($checkPedidoPago!==true) {
                    return $checkPedidoPago;
                }
                $producto = inventario::select(["precio","cantidad"])->find($checkIfExits->id_producto);
                $precio = $producto->precio;

                if ($precio > 20 && (floor($cantidad) != $cantidad)) {
                    throw new \Exception("Para productos con precio mayor a 25, la cantidad debe ser un número entero ".$cantidad." | ".$precio, 1);
                }

                $old_ct = $checkIfExits->cantidad;
                $setprecio = $cantidad*$precio;
                $ctSeter = (($producto->cantidad + $old_ct) - $cantidad);
                
                $this->descontarInventario($checkIfExits->id_producto,$ctSeter, ($producto->cantidad), items_pedidos::find($id)->id_pedido??null, "ACT.VENTA");
                $this->checkFalla($checkIfExits->id_producto,$ctSeter);
                
                items_pedidos::updateOrCreate(["id"=>$id],[
                    "cantidad" => $cantidad,
                    "monto" => $setprecio,
                    "condicion" => $devolucionTipo
                ]);
                return ["msj"=>"Actualizado Prod #".$checkIfExits->id_producto." || Cant. ".$cantidad,"estado"=>"ok"];


            }else if($type=="del"){
                
                (new PedidosController)->checkPedidoAuth($id,"item");
                $checkPedidoPago = (new PedidosController)->checkPedidoPago($id,"item");


                if ($checkPedidoPago!==true) {
                    return $checkPedidoPago;
                }
            
                $item = items_pedidos::find($id);
                $old_ct = $item->cantidad;
                $id_producto = $item->id_producto;
                $pedido_id = $item->id_pedido;
                $condicion = $item->condicion;

                $checkItemsPedidoCondicionGarantiaCero = (new PedidosController)->checkItemsPedidoCondicionGarantiaCero($pedido_id);
                if ($checkItemsPedidoCondicionGarantiaCero!==true) {
                    throw new \Exception("Error: El pedido tiene garantias, no puede eliminar el item", 1);
                }



            
                $producto = inventario::select(["cantidad"])->find($id_producto);
                    
                if($item->delete()){
                    
                    $ctSeter = $producto->cantidad + ($old_ct);


                    if ($condicion!=1) {
                        //Si no es garantia
                        $this->descontarInventario($id_producto,$ctSeter, $producto->cantidad, $pedido_id, "ELI.VENTA");
                        $this->checkFalla($id_producto,$ctSeter);
                    }else{
                        //Si es garantia
                        garantia::where("id_pedido", $pedido_id)->delete();
                    }
                    
                    return ["msj"=>"Item Eliminado","estado"=>true];

                }
            }
            
        } catch (\Exception $e) {

            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
            
        }

    }
    public function descontarInventario($id_producto,$cantidad, $ct1,$id_pedido,$origen)
    {
        $inv = inventario::find($id_producto);
        if (!$inv) {
            return false;
        }

        if ($cantidad<0) {
            throw new \Exception("No hay disponible la cantidad solicitada", 1);
        }
        $pendingTransfers = (new TransferenciasInventarioController)->sumPendingTransfers($id_producto);
        if($cantidad<$pendingTransfers){
            throw new \Exception("No puede descontar la cantidad solicitada. Esta bloqueada por transferencias pendientes", 1);
        }
        $inv->cantidad = $cantidad;
        if($inv->save()){
            (new MovimientosInventariounitarioController)->setNewCtMov([
                "id_producto" => $id_producto,
                "cantidadafter" => $cantidad,
                "ct1" => $ct1,
                "id_pedido" => $id_pedido,
                "origen" => $origen." #".$id_pedido,
            ]);
            return true;
        };

        
    }
    public function getProductosSerial(Request $req)
    {
        try {
            $ids = $req->ids_productos;
            $count = $req->count;
            $uniques = array_unique($ids);

            if (count($uniques)!==count($ids)) {
                throw new \Exception("¡Productos duplicados!", 1);
            }
            if ($count!=count($uniques)) {
                throw new \Exception("¡Faltan/Sobran productos! ".$count." | ".count($uniques), 1);
            } 
            $where = inventario::whereIn("id",$ids)->get();
            if ($where->count()!=count($uniques)) {
                throw new \Exception("¡Algunos productos no estan registrados!", 1);
            }
            return Response::json(["msj"=>$where,"estado"=>true]);   
            
        } catch (\Exception $e) {

            return Response::json(["msj"=>"Error. ".$e->getMessage(),"estado"=>false]);
            
        }
    }
    public function checkPedidosCentral(Request $req)
    {   
        $ped_id = $req->pedido;
        $pathcentral = $req->pathcentral;
        $id_sucursal = $ped_id["id_origen"];
        
        DB::beginTransaction();
        try {

            
            $full_vinculos_sugeridos = [];
            foreach ($ped_id["items"] as $i => $item) {

                if ($item["vinculo_real"]) {
                    if (!in_array($item["vinculo_real"], $full_vinculos_sugeridos)) {
                        array_push($full_vinculos_sugeridos, $item["vinculo_real"]);
                    }else{
                        throw new \Exception("#".($i+1)." -> ERROR VINCULO SUGERIDO DUPLICADO =  ".$item["producto"]["codigo_barras"], 1);
                    }
                }

                if (!isset($item["aprobado"])) {
                    throw new \Exception("¡Falta verificar productos!", 1);
                }
                if (!isset($item["barras_real"]) && !$item["producto"]["codigo_barras"]) {
                    throw new \Exception("¡Falta Codigo de Barras!", 1);
                }
                $vinculo_quetengo = inventario::where("codigo_barras",$item["producto"]["codigo_barras"])->first();
                $vinculo_quetengo_alterno = inventario::where("codigo_proveedor",$item["producto"]["codigo_proveedor"])->first();
                
                $vinculo_real = inventario::find($item["vinculo_real"]);
                if ($vinculo_real) {
                    if ($vinculo_quetengo) {
                        if ($item["vinculo_real"] != $vinculo_quetengo->id) {
                            throw new \Exception("#".($i+1)." -> ERROR VINCULO SUGERIDO =  ".$item["producto"]["codigo_barras"], 1);
                        }
                    }
                    /* if ($vinculo_quetengo_alterno) {
                        if ($item["vinculo_real"] != $vinculo_quetengo_alterno->id) {
                            throw new \Exception("#".($i+1)." -> ERROR VINCULO SUGERIDO ALTERNO =  ".$item["producto"]["codigo_proveedor"], 1);
                        }
                    } */
                }


                $idinsucursal_vinculo = inventario::find($item["idinsucursal_vinculo"]);
                if ($idinsucursal_vinculo) {
                    if ($vinculo_quetengo) {
                        if ($item["idinsucursal_vinculo"] != $vinculo_quetengo->id) {
                            if (!$vinculo_real) {
                                return ["msj"=>"#".($i+1)." -> ERROR VINCULO CENTRAL, SUGIERA UN VINCULO NUEVO =  ".$item["producto"]["codigo_barras"],"estado"=>false,"id_item"=>$item["id"]];
                            }
                        }
                    }
                }

                
                
                if (!$item["idinsucursal_vinculo"]&&!$item["vinculo_real"]) {
                    $checkbarras = inventario::where("codigo_barras",$item["producto"]["codigo_barras"])->first();
                    if ($checkbarras) {
                        throw new \Exception("#".($i+1)." -> FALTA VINCULAR =  ".$checkbarras->codigo_barras, 1);
                    }
                }
            }
            
            //ENVIAR LAS 5 SUGERENCIAs A CENTRAL 
            $chekedPedidoByCentral = (new sendCentral)->sendItemsPedidosChecked($ped_id["items"]);
            if (isset($chekedPedidoByCentral["estado"])) {
                if ($chekedPedidoByCentral["estado"]===false) {
                    return $chekedPedidoByCentral["msj"]; //ESTADO 3
                }else if($chekedPedidoByCentral["estado"]===true){
                    //YA REVISADO...Procede ESTADO 4
                }
            }else{
                return $chekedPedidoByCentral;
            }
            
            //IMPORTAR AL SISTEMA YA CHECKEADO POR CENTRAL 4
            $id_pedido = $ped_id["id"];
            $checkIfExitsFact = factura::where("id_pedido_central",$id_pedido)->first();
            if($checkIfExitsFact){
                throw new \Exception("¡Factura ya existe!", 1);
            } 
            $ids_to_csv = [];
            $getPedido = (new sendCentral)->getPedidoCentralImport($id_pedido);
            if (isset($getPedido["estado"])) {
                if ($getPedido["estado"]===true) {
                    if (isset($getPedido["pedido"])) {
                        $pedido = $getPedido["pedido"];

                        $tareaspendientescentralArr = [
                            "id_pedido" => null,
                            "ids" => [],
                        ];
                        $tareaspendientescentralArr["id_pedido"] = $pedido["id"];
                        $origen = $pedido["origen"]["codigo"];

                    
                        $fact = new factura;
                        
                        $fact->id_pedido_central = $id_pedido;
                        $fact->id_proveedor = $pedido["id_proveedor"]?$pedido["id_proveedor"]:1;
                        $fact->monto = $pedido["monto"];
                        $fact->numnota = $pedido["numfact"];
                        $fact->fechavencimiento = $pedido["fechavencimiento"];
                        $fact->fechaemision = $pedido["fechaemision"];
                        $fact->fecharecepcion = $pedido["fecharecepcion"];

                        $fact->numfact = $pedido["numfact"]?$pedido["numfact"]:$id_pedido;
                        $fact->descripcion = "ENVIA $origen $pedido[created_at]";
                        $fact->estatus = 1;
                        $fact->subtotal = 0;
                        $fact->descuento = 0;
                        $fact->monto_exento = 0;
                        $fact->monto_gravable = 0;
                        $fact->iva = 0;

                        $fact->nota = "";
                        $fact->id_usuario = session("id_usuario");

                        if ($fact->save()) {
                            $id_factura = $fact->id;

                            $num = 0;
                            foreach ($pedido["items"] as $i => $item) {
                                $producto_vinculado = inventario::find($item["id_producto"]);
                                
                                $match_ct = 0;
                                $id_producto = null;
                                if ($producto_vinculado) {
                                    $match_ct = $producto_vinculado->cantidad;
                                    $id_producto = $producto_vinculado->id;
                                }

                                $id_productoincentral = $item["id_producto"];
                                
                                $ctNew = $item["cantidad"];
                                
                                $arr_insert = [];
                                $arr_insert["activo"] = 1;
                                $arr_insert["cantidad"] = $match_ct + $ctNew;
                                $arr_insert["id"] = $id_producto;
                                $arr_insert["id_factura"] = $id_factura;
                                
                                $arr_insert["id_cxp"] = $id_pedido;
                                $arr_insert["numfactcxp"] = $pedido["numfact"];

                                $arr_insert["origen"] = $origen;
                                
                                $arr_insert["codigo_proveedor"] = @$item["producto"]["codigo_proveedor"];
                                $arr_insert["codigo_barras"] = @$item["producto"]["codigo_barras"];
                                $arr_insert["id_proveedor"] = @$item["producto"]["id_proveedor"];
                                $arr_insert["id_categoria"] = @$item["producto"]["id_categoria"];
                                $arr_insert["id_marca"] = @$item["producto"]["id_marca"];
                                $arr_insert["unidad"] = @$item["producto"]["unidad"];
                                $arr_insert["id_deposito"] = @$item["producto"]["id_deposito"];
                                $arr_insert["descripcion"] = @$item["producto"]["descripcion"];
                                $arr_insert["iva"] = @$item["producto"]["iva"];
                                $arr_insert["porcentaje_ganancia"] = @$item["producto"]["porcentaje_ganancia"];

                                if (floatval($ctNew)!=0) {
                                    $arr_insert["precio_base"] = @$item["base"]? @$item["base"]: $item["producto"]["precio_base"];
                                    $arr_insert["precio"] = @$item["venta"]? @$item["venta"]: $item["producto"]["precio"];
                                }
                                
                                $arr_insert["precio1"] = @$item["producto"]["precio1"];
                                $arr_insert["precio2"] = @$item["producto"]["precio2"];
                                $arr_insert["precio3"] = @$item["producto"]["precio3"];
                                $arr_insert["stockmin"] = @$item["producto"]["stockmin"];
                                $arr_insert["stockmax"] = @$item["producto"]["stockmax"];
                                $arr_insert["push"] = 1;


                                $arr_insert["id_productoincentral"] = $id_productoincentral;
                                $insertOrUpdateInv = $this->guardarProducto($arr_insert);
                                

                                if (is_numeric($insertOrUpdateInv)) {

                                    array_push($tareaspendientescentralArr["ids"],[
                                        "id_productoincentral" => $id_productoincentral,
                                        "id_productosucursal" => $insertOrUpdateInv
                                    ]);

                                    items_factura::updateOrCreate([
                                        "id_factura" => $id_factura,
                                        "id_producto" => $insertOrUpdateInv,
                                    ],[
                                        "cantidad" => $ctNew,
                                        "tipo" => "actualizacion",
                                    ]);

                                    $ids_to_csv[] = $insertOrUpdateInv;
                                    $num++;
                                }else{
                                    return $insertOrUpdateInv;
                                }
                            }
                          /*   $tareaspendientescentral = new tareaspendientescentral;
                            $tareaspendientescentral->ids = $tareaspendientescentralArr;
                            $tareaspendientescentral->estado = 0; */
                            /* if ($tareaspendientescentral->save()) { */
                               // $t = tareaspendientescentral::find($tareaspendientescentral->id);
                            $tareaSend = (new sendCentral)->sendTareasPendientesCentral($tareaspendientescentralArr);
                            if (isset($tareaSend["estado"])) {
                                if ($tareaSend["estado"]===false) {
                                    return $tareaSend;
                                }else if($tareaSend["estado"]===true){
                                    //return ["estado"=>true,"msj"=>"Éxito al Importar PEDIDO!"];
                                    $this->setCsvInventario($ids_to_csv);

                                    \DB::statement("UPDATE `inventarios` SET iva=1");
                                    \DB::statement("UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE 'MACHETE%'");
                                    \DB::statement("UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE 'PEINILLA%'");
                                    \DB::statement("UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE 'MOTOBOMBA%'");
                                    \DB::statement("UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE 'ELECTROBOMBA%'");
                                    \DB::statement("UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE 'DESMALEZADORA%'");
                                    \DB::statement("UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE 'MOTOSIERRA%'");
                                    \DB::statement("UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE 'CUCHILLA%'");
                                    \DB::statement("UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE 'FUMIGADORA%'");
                                    \DB::statement("UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE 'MANGUERA%'");

                                    DB::commit();
                                    return Response::json(["msj"=>"¡Éxito ".$num." productos procesados!","estado"=>true]);
                                } 
                            }else{
                                return $tareaSend;
                            } 

                           /*  } */

                        }

                    }
                }
            }
            //END IMPORTAR AL SISTEMA


            return $getPedido;

            
        } catch (\Exception $e) {
            DB::rollback();
            
            return Response::json(["msj"=>"Error:   ".$e->getMessage(),"estado"=>false]);
        }
    }

    function setCsvInventario($ids) {
        /* $datos = inventario::whereIn("id",$ids)->get()->toArray();


        $archivo = "exportarProductosLote_".time()."_fecha_".date('Y-m-d_H-i-s').".csv";
        $ruta = "export_inventario/".$archivo;

        $handle = fopen(storage_path("app/$ruta"), 'w');

        foreach ($datos as $linea) {
            fputcsv($handle, $linea);
        }

        fclose($handle); */
    }

    function showcsvInventario() {
        $archivos = Storage::files('export_inventario');
        return response()->json($archivos);
    }

    public function reporteFalla(Request $req)
    {
        $id_proveedor = $req->id;

        $sucursal = sucursal::all()->first();
        $proveedor = proveedores::find($id_proveedor);

        if ($proveedor&&$id_proveedor) {
            $fallas = fallas::With("producto")->whereIn("id_producto",function($q) use ($id_proveedor)
            {
                $q->from("inventarios")->where("id_proveedor",$id_proveedor)->select("id");
            })->get();

            return view("reportes.fallas",[
                "fallas"=>$fallas, 
                "sucursal"=>$sucursal,
                "proveedor"=>$proveedor,
            ]);
        }


    }
    public function getUniqueProductoById(Request $req)
    {
        return inventario::find($req->id);
    }
    public function getInventarioFun($req)
    {
        // Get currency rates once
        $mon = (new PedidosController)->get_moneda();
        $cop = $mon["cop"];
        $bs = $mon["bs"];

        // Extract and validate request parameters
        $exacto = isset($req["exacto"]) ? $req["exacto"] : false;
        $q = $req["qProductosMain"] ?? "";
        $num = $req["num"] ?? 10;
        $itemCero = $req["itemCero"] ?? false;
        $orderColumn = $req["orderColumn"] ?? "id";
        $orderBy = $req["orderBy"] ?? "desc";
        $view = $req["view"] ?? null;
        $id_factura = $req["id_factura"] ?? null;


        // Base query with eager loading
        $query = inventario::with([
            "proveedor:id,descripcion",
            "categoria:id,descripcion",
            "marca:id,descripcion",
            "deposito:id,descripcion"
        ])
        ->where("activo", 1)
        ->selectRaw("*, @bs := (inventarios.precio*$bs) as bs, @cop := (inventarios.precio*$cop) as cop");
        // Handle advanced search
        if (isset($req["busquedaAvanazadaInv"]) && $req["busquedaAvanazadaInv"]) {
            $busqAvanzInputs = $req["busqAvanzInputs"];
            $query->where(function($e) use($busqAvanzInputs) {
                foreach ($busqAvanzInputs as $field => $value) {
                    if (!empty($value)) {
                        $e->where($field, "LIKE", $value . "%");
                    }
                }
            });
        } else {
            // Handle regular search
            if (!empty($q)) {
                $query->where(function($e) use($q, $exacto) {
                    if ($exacto === "id_only") {
                        $e->where("id", $q);
                    } else if ($exacto === "si") {
                        $e->where("codigo_barras", $q)
                          ->orWhere("codigo_proveedor", $q);
                    } else {
                        $e->where("descripcion", "LIKE", "%$q%")
                          ->orWhere("codigo_proveedor", "LIKE", "%$q%")
                          ->orWhere("codigo_barras", "LIKE", "%$q%");
                    }
                });
            }

            // Handle item zero filter
            if (!$itemCero) {
                $query->where("cantidad", ">", 0);
            }
        }

        // Handle factura view filter
        if ($view === "SelectFacturasInventario" && $id_factura) {
            $query->whereIn("id", function($q) use ($id_factura) {
                $q->from("items_factura")
                  ->where("id_factura", $id_factura)
                  ->select("id_producto");
            });
        }

        // Apply ordering and limit
        $query->orderBy($orderColumn, $orderBy)
              ->limit($num);

        if($view=="inventario"){
            return $query->get()->map(function($item){
                $item->ppr = 0;
                $item->garantia = garantia::where("id_producto",$item->id)->sum("cantidad");
                $item->pendiente_enviar = (new TransferenciasInventarioController)->sumPendingTransfers($item->id);
                return $item;
            });
        }else{

            return $query->get();
        }

    }
    public function index(Request $req)
    {
        $req = [
            "exacto"=> $req->exacto,
            "qProductosMain"=> $req->qProductosMain,
            "num"=> $req->num,
            "itemCero"=> $req->itemCero,
            "orderColumn"=> $req->orderColumn,
            "orderBy"=> $req->orderBy,
            "busquedaAvanazadaInv"=> $req->busquedaAvanazadaInv,
            "busqAvanzInputs"=> $req->busqAvanzInputs,
            "view" => $req->view,
            "id_factura" => $req->id_factura,
        ];

        return $this->getInventarioFun($req);
        
    }
    public function changeIdVinculacionCentral(Request $req)
    {
        try {

            $inv = vinculosucursales::updateOrCreate([
                "idinsucursal" => $req->idincentral,
                "id_sucursal" => $req->pedioscentral["id_origen"],
            ],[
                "idinsucursal" => $req->idincentral,
                "id_sucursal" => $req->pedioscentral["id_origen"],
                "id_producto" => $req->idinsucursal
            ]);
            
            if ($inv) {
                
                $pedido = $req->pedioscentral;
    
                foreach ($pedido["items"] as $keyitem => $item) {
                    ///id central ID VINCULACION

                    $checkifvinculado = vinculosucursales::where("id_sucursal",$pedido["id_origen"])
                    ->where("idinsucursal", $item["producto"]["idinsucursal"])->first();
                    $showvinculacion = null;
                    if ($checkifvinculado) {
                        $showvinculacion = inventario::find($checkifvinculado->id_producto);
                    }

                    $pedido["items"][$keyitem]["match"] = $showvinculacion;
                }
                return Response::json([
                    "msj"=>"Éxito", 
                    "estado"=>true,
                    "pedido"=>$pedido,
                ]);
                
            }
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error ".$e->getMessage(), "estado"=>false]);
        }
    }
    public function setCarrito(Request $req)
    {
        $type = $req->type;
        $cantidad = $req->cantidad;
        $numero_factura = $req->numero_factura;
        $devolucionTipo = isset($req->devolucionTipo)?$req->devolucionTipo:0;

        $arrgarantia = [
            "motivo" => $req->devolucionMotivo,
            "cantidad_salida" => $req->devolucion_cantidad_salida,
            "motivo_salida" => $req->devolucion_motivo_salida,
            "ci_cajero" => $req->devolucion_ci_cajero,
            "ci_autorizo" => $req->devolucion_ci_autorizo,
            "dias_desdecompra" => $req->devolucion_dias_desdecompra,
            "ci_cliente" => $req->devolucion_ci_cliente,
            "telefono_cliente" => $req->devolucion_telefono_cliente,
            "nombre_cliente" => $req->devolucion_nombre_cliente,
            "nombre_cajero" => $req->devolucion_nombre_cajero,
            "nombre_autorizo" => $req->devolucion_nombre_autorizo,
            "trajo_factura" => $req->devolucion_trajo_factura,
            "motivonotrajofact" => $req->devolucion_motivonotrajofact,
            "numfactoriginal" => $req->devolucion_numfactoriginal,
            "numfactgarantia" => $req->devolucion_numfactgarantia,

        ];
        
        if (isset($numero_factura)) {
            $id = $numero_factura;

            $id_producto = $req->id;
            $cantidad = $cantidad==""?1:$cantidad;

            $usuario = session()->has("id_usuario")? session("id_usuario"): $req->usuario;
            $iscentral = session("iscentral");
            

            if (!$usuario) {
                return Response::json(["msj"=>"Debe iniciar Sesion", "estado"=>false,"num_pedido"=>0,"type"=>""]);
            }
            $today = (new PedidosController)->today();
            $fechaultimocierre = (new CierresController)->getLastCierre();
            if ($fechaultimocierre && $iscentral==0) {
                if($fechaultimocierre->fecha == $today){
                    return Response::json(["msj"=>"¡Imposible hacer pedidos! Cierre procesado", "estado"=>false,"num_pedido"=>0,"type"=>""]);
                }
            }
            
            $id_return = $id=="nuevo"?"nuevo":$id;
            
            return  $this->hacer_pedido($id_producto,$id_return,$cantidad,"ins",$type,$usuario,$devolucionTipo,$arrgarantia);
        }
        
    }
    public function setMovimientoNotCliente($id_pro,$des,$ct,$precio,$cat)
    {   
        $mov = new movimientos;
        $mov->id_usuario = session("id_usuario");
            
            if ($mov->save()) {
               $items_mov = new items_movimiento;
               $items_mov->descripcion = $des;
               $items_mov->id_producto = $id_pro;

               $items_mov->cantidad = $ct;
               $items_mov->precio = $precio;
               $items_mov->tipo = 2;
               $items_mov->categoria = $cat;
               $items_mov->id_movimiento = $mov->id;
               $items_mov->save();
            }
    }
    public function delProductoFun($id,$origen="local")
    {
        try {
            if ($this->enInventario()) {
                $i = inventario::find($id);
                $i->activo = 0;
                $i->save();
                return true;
            }else{
                throw new \Exception("No tienes permiso ", 1);
            }
            
            $usuario = session("usuario");
            if ($usuario=="ao" || $usuario=="admin") {
                $i = inventario::find($id);
               /*  $id_usuario = session("id_usuario");
                (new MovimientosInventarioController)->newMovimientosInventario([
                    "antes" => $i,
                    "despues" => null,
                    "id_usuario" => $id_usuario,
                    "id_producto" => $id,
                    "origen" => $origen,
                ]);
    
                if ($i->delete()) {
                    return true;   
                } */
            }else{
                throw new \Exception("SIN PERMISO A DELETE ", 1);

            }
        } catch (\Exception $e) {
            throw new \Exception("Error al eliminar. ".$e->getMessage(), 1);
            
        }
    }
    public function delProducto(Request $req)
    {
        $id = $req->id;
        try {
            $this->delProductoFun($id);
            return Response::json(["msj"=>"Éxito al eliminar","estado"=>true]);   
        } catch (\Exception $e) {
            return Response::json(["msj"=>$e->getMessage(),"estado"=>false]);
            
        }  
    }
    function addProductoFactInventario(Request $req) {
        $id_producto = $req->id_producto;
        $id_factura = $req->id_factura;
        $items = items_factura::updateOrCreate([
            "id_factura" => $id_factura,
            "id_producto" => $id_producto,
        ],[
            "cantidad" => 0,
            "tipo" => "ASIGNAR",
            
        ]);
        
        if ($items) {
            return [
                "estado" => true,
                "msj" => "Éxito al asignar"
            ];
        }
        
    }
    
    public function guardarNuevoProductoLote(Request $req)
    {
      try {

            $motivo = $req->motivo;
            foreach ($req->lotes as $key => $ee) {
                if (isset($ee["type"])) {
                    if ($ee["type"]==="update"||$ee["type"]==="new") {
                       // $checkInventariado = inventario::find($ee["id"]);
                        $type = "novedad";
                       /*  if ($checkInventariado) {
                            if (!$checkInventariado->push) {
                                $type = "noinventariado";
                            }
                        }  */

                        if ($this->enInventario()) {
                            $this->guardarProducto([
                                "id_factura" => $req->id_factura,
                                "cantidad" => !$ee["cantidad"]?0:$ee["cantidad"],
                                "precio3" => isset($ee["precio3"])?$ee["precio3"]:0,
                                "precio" => !$ee["precio"]?0:$ee["precio"],
                                "precio_base" => !$ee["precio_base"]?0:$ee["precio_base"],
                                /* "codigo_barras" => $ee["codigo_barras"],
                                "codigo_proveedor" => $ee["codigo_proveedor"],
                                "descripcion" => $ee["descripcion"], */
                                "id" => $ee["id"],
                                "id_categoria" => $ee["id_categoria"],
                                "id_marca" => $ee["id_marca"],
                                "id_proveedor" => $ee["id_proveedor"],
                                "iva" => $ee["iva"],
                                "unidad" => $ee["unidad"],
                                "push" => isset($ee["push"])? $ee["push"]: null,
                                "id_deposito" => "",
                                "porcentaje_ganancia" => 0,
                                "origen"=>"local",
                            ]);
                            return Response::json(["msj"=>"Modo Inventario","estado"=>true]);   

                        }

                        if($type=="novedad"){
                            return $this->guardarProductoNovedad([
                                "id" => $ee["id"],
                                //"codigo_barras" => $ee["codigo_barras"],
                                //"codigo_proveedor" => $ee["codigo_proveedor"],
                                //"descripcion" => $ee["descripcion"],
                                "precio" => !$ee["precio"]?0:$ee["precio"],
                                "precio_base" => !$ee["precio_base"]?0:$ee["precio_base"],
                                "cantidad" => !$ee["cantidad"]?0:$ee["cantidad"],
                            ]);
                        }
                        /* else if ($type=="noinventariado") {  
                            $this->guardarProducto([
                                "id_factura" => $req->id_factura,
                                "cantidad" => !$ee["cantidad"]?0:$ee["cantidad"],
                                "precio3" => isset($ee["precio3"])?$ee["precio3"]:0,
                                "precio" => !$ee["precio"]?0:$ee["precio"],
                                "precio_base" => !$ee["precio_base"]?0:$ee["precio_base"],
                                "codigo_barras" => $ee["codigo_barras"],
                                "codigo_proveedor" => $ee["codigo_proveedor"],
                                "descripcion" => $ee["descripcion"],
                                "id" => $ee["id"],
                                "id_categoria" => $ee["id_categoria"],
                                "id_marca" => $ee["id_marca"],
                                "id_proveedor" => $ee["id_proveedor"],
                                "iva" => $ee["iva"],
                                "unidad" => $ee["unidad"],
                                "push" => isset($ee["push"])? $ee["push"]: null,
                                "id_deposito" => "",
                                "porcentaje_ganancia" => 0,
                                "origen"=>"local",
                            ]);
                        } */
                        /*else{
                            return Response::json(["msj"=>"Error: Producto no se puede Modificar ".$ee["codigo_barras"],"estado"=>false]);   

                        } */
                    }else if ($ee["type"]==="delete") {

                        $this->delProductoFun($ee["id"]);
                    }
                }   
            }

            return Response::json(["msj"=>"Éxito","estado"=>true]);   
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Err: ".$e,"estado"=>false]);
        }  
    }

    public function guardarNuevoProductoLoteFact(Request $req)
    {
      try {
        $sumTotFact = 0;
        $totFact = 0;
        $id_factura = $req->id_factura;
        $fa = factura::with(["items"=>function($q){
            $q->with(["producto"]);
        }])
        ->where("id",$id_factura)
        ->get();
        
        $fa->map(function($q) use (&$sumTotFact,&$totFact){
            $sub = $q->items->map(function($q){   
                $q->basefact = $q->producto->precio3*$q->cantidad;
                return $q;
            });
            $sumTotFact += $sub->sum("basefact");
            $totFact = $q->monto;
            return $q;
        });

            foreach ($req->items as $i => $itemfact) {
                $ee = $itemfact["producto"];
                if (isset($ee["type"])) {
                    if ($ee["type"]==="update"||$ee["type"]==="new") {
                        $beforeCtFact = items_factura::where("id_producto",$ee["id"])->where("id_factura",$itemfact["id_factura"])->first()->cantidad;
                        $beforePriceFact = inventario::find($ee["id"])->precio3;
                        $sumTotFact += ((($ee["cantidadfact"]-$beforeCtFact)*$ee["precio3"]) + ($ee["cantidadfact"]*($ee["precio3"]-$beforePriceFact)) );
                    }
                }   
            }

            foreach ($req->items as $i => $itemfact) {
                $ee = $itemfact["producto"];
                if (isset($ee["type"])) {
                    if ($ee["type"]==="update"||$ee["type"]==="new") {
                        $beforeCt = inventario::find($ee["id"])->cantidad;
                        $beforeCtFact = items_factura::where("id_producto",$ee["id"])->where("id_factura",$itemfact["id_factura"])->first()->cantidad;
                        $insertCT = $ee["cantidadfact"]-$beforeCtFact;

                        $this->guardarProducto([
                                "id" => $ee["id"],
                                "id_factura" => $itemfact["id_factura"],
                                "cantidad" => $insertCT+$beforeCt,
                                "precio3" => !$ee["precio3"]?0:$ee["precio3"],
                                "precio" => !$ee["precio"]?0:$ee["precio"],
                                "precio_base" => !$ee["precio_base"]?0:$ee["precio_base"],
                                "origen"=>"local",
                        ]);

                    }else if ($ee["type"]==="delete") {
                        $this->delProductoFun($ee["id"]);
                    }
                }   
            }
            return Response::json(["msj"=>"Éxito. SUM:$sumTotFact / FACT:$totFact","estado"=>true]);   
            

        } catch (\Exception $e) {
            return Response::json(["msj"=>"Err: ".$e,"estado"=>false]);
        }  
    }
    public function getSyncProductosCentralSucursal(Request $req)
    {
        $datasucursal = $req->obj; 
        foreach ($datasucursal as $k => $v) {
            $datacentral =  inventario::where("codigo_barras", "LIKE", $v["codigo_barras"]."%")->get()->first();
            if ($datacentral) {
                $datasucursal[$k]["type"] = "update";
                $datasucursal[$k]["estatus"] = 1;
                $datasucursal[$k]["codigo_barras"] = $datacentral["codigo_barras"];
                $datasucursal[$k]["codigo_proveedor"] = $datacentral["codigo_proveedor"];
                $datasucursal[$k]["id_proveedor"] = $datacentral["id_proveedor"];
                $datasucursal[$k]["id_categoria"] = $datacentral["id_categoria"];
                $datasucursal[$k]["id_marca"] = $datacentral["id_marca"];
                $datasucursal[$k]["unidad"] = $datacentral["unidad"];
                $datasucursal[$k]["id_deposito"] = $datacentral["id_deposito"];
                $datasucursal[$k]["descripcion"] = $datacentral["descripcion"];
                $datasucursal[$k]["iva"] = $datacentral["iva"];
                $datasucursal[$k]["porcentaje_ganancia"] = $datacentral["porcentaje_ganancia"];
                $datasucursal[$k]["precio_base"] = $datacentral["precio_base"];
                $datasucursal[$k]["precio"] = $datacentral["precio"];
                $datasucursal[$k]["precio1"] = $datacentral["precio1"];
                $datasucursal[$k]["precio2"] = $datacentral["precio2"];
                $datasucursal[$k]["precio3"] = $datacentral["precio3"];
                $datasucursal[$k]["bulto"] = $datacentral["bulto"];
                $datasucursal[$k]["stockmin"] = $datacentral["stockmin"];
                $datasucursal[$k]["stockmax"] = $datacentral["stockmax"];
                $datasucursal[$k]["id_vinculacion"] = $datacentral["id"];;
            }
        }
        return $datasucursal;
        
    }
    public function guardarNuevoProducto(Request $req)
    {   
      


         
    }
    function saveReplaceProducto(Request $req) {
        try {
            $replaceProducto = $req->replaceProducto;
            $este = $replaceProducto["este"];
            $poreste = $replaceProducto["poreste"];
    
            $productoeste = inventario::find($este);
            $ct = $productoeste->cantidad;
            $id_vinculacion = $productoeste->id_vinculacion;
    
            $productoporeste = inventario::find($poreste);
            $productoporeste->cantidad = $productoporeste->cantidad + ($ct);
            $productoeste->cantidad = 0;
            if ($id_vinculacion) {
                $productoeste->id_vinculacion = NULL;
                $productoporeste->id_vinculacion = $id_vinculacion;
            }
            
            $productoeste->save();
            $productoporeste->save();
    
            items_pedidos::where("id_producto",$este)->update(["id_producto" => $poreste]);

            return Response::json(["estado" => true, "msj" => "Éxito"]);
        } catch (\Exception $e) {
            return Response::json(["estado" => false, "msj" => "Error: ".$e->getMessage()]);
        }
    }
    public function guardarProducto($arrproducto){
        $codigo_origen = (new sendCentral)->getOrigen();


        DB::beginTransaction();
        try {
            // Check for pending transfers with positive quantities
           (new TransferenciasInventarioController)->checkPendingTransfers($arrproducto["id"]);
           
            $id_cxp = @$arrproducto["id_cxp"];
            $numfactcxp = @$arrproducto["numfactcxp"]?@$arrproducto["numfactcxp"]:$id_cxp;

            $id_factura = @$arrproducto["id_factura"];
            $ctInsert = @$arrproducto["cantidad"];
            $ctbeforeedit = @$arrproducto["ctbeforeedit"];
            $req_inpInvbarras = @$arrproducto["codigo_barras"];
            $req_inpInvalterno = @$arrproducto["codigo_proveedor"];
            $req_inpInvunidad = @$arrproducto["unidad"];
            $req_inpInvcategoria = @$arrproducto["id_categoria"];
            $req_inpInvdescripcion = @$arrproducto["descripcion"];
            $req_inpInvbase = @$arrproducto["precio_base"];
            $req_inpInvventa = @$arrproducto["precio"];
            $req_inpInviva = @$arrproducto["iva"];
            $req_inpInvid_proveedor = @$arrproducto["id_proveedor"];
            $req_inpInvid_marca = @$arrproducto["id_marca"];
            $req_inpInvid_deposito = @$arrproducto["id_deposito"];
            $req_inpInvporcentaje_ganancia = @$arrproducto["porcentaje_ganancia"];
            $push = @$arrproducto["push"]; 
            $precio1 = @$arrproducto["precio1"]; 
            $precio2 = @$arrproducto["precio2"]; 
            $precio3 = @$arrproducto["precio3"]; 
            $stockmin = @$arrproducto["stockmin"]; 
            $stockmax = @$arrproducto["stockmax"]; 
            $id_vinculacion = @$arrproducto["id_vinculacion"]; 
            
            $req_id = $arrproducto["id"];
            $origen = $arrproducto["origen"];
            $id_usuario = session("id_usuario");

            $beforecantidad = 0;
            $ctNew = 0;
            $tipo = "";
            
            $before = null;
            if (!$req_id) {
                $ctNew = $ctInsert;
                $tipo = "Nuevo";
            }else{
                $before = $req_id==="id_vinculacion"? inventario::where("id_vinculacion", $id_vinculacion)->first(): inventario::find($req_id);
                if ($before) {
                    $beforecantidad = $before->cantidad;
                    $ctNew = $ctInsert - $beforecantidad;
                    $tipo = "actualizacion";
                }else{
                    $tipo = "Nuevo";
                }
            }


            $arr_produc = [];
            
            if($origen=="EDICION CENTRAL"){
                if($ctInsert!==null){
                    $arr_produc["cantidad"] =  $ctbeforeedit ? ($ctInsert - $ctbeforeedit) + $beforecantidad : $ctInsert;
                    
                }
            }else{
                if($ctInsert!==null){$arr_produc["cantidad"] = $ctInsert;}
            }


            if($req_inpInvbarras){$arr_produc["codigo_barras"] = $req_inpInvbarras;}
            if($req_inpInvdescripcion){$arr_produc["descripcion"] = $req_inpInvdescripcion;}
            if($req_inpInvalterno){$arr_produc["codigo_proveedor"] = $req_inpInvalterno;}
            if($req_inpInvunidad){$arr_produc["unidad"] = $req_inpInvunidad;}
            if($req_inpInvcategoria){$arr_produc["id_categoria"] = $req_inpInvcategoria;}
            if($req_inpInviva){$arr_produc["iva"] = $req_inpInviva;}
            if($req_inpInvid_proveedor){$arr_produc["id_proveedor"] = $req_inpInvid_proveedor;}
            if($req_inpInvid_marca){$arr_produc["id_marca"] = $req_inpInvid_marca;}
            if($req_inpInvid_deposito){$arr_produc["id_deposito"] = $req_inpInvid_deposito;}
            if($req_inpInvporcentaje_ganancia){$arr_produc["porcentaje_ganancia"] = $req_inpInvporcentaje_ganancia;}
            if($req_inpInvbase!==null){$arr_produc["precio_base"] = $req_inpInvbase;}
            if($req_inpInvventa!==null){$arr_produc["precio"] = $req_inpInvventa;}
            if($precio1!==null){$arr_produc["precio1"] = $precio1;}
            if($precio2!==null){$arr_produc["precio2"] = $precio2;}
            if($precio3!==null){$arr_produc["precio3"] = $precio3;}
            if($stockmin){$arr_produc["stockmin"] = $stockmin;}
            if($stockmax){$arr_produc["stockmax"] = $stockmax;}
            if($id_vinculacion){$arr_produc["id_vinculacion"] = $id_vinculacion;}
            if($push!==null){$arr_produc["push"] = $push;}
            
            
            // Asegurar que precio_base nunca sea igual o mayor que precio
            if (isset($arr_produc["precio_base"]) && isset($arr_produc["precio"])) {
                if ($arr_produc["precio_base"] >= $arr_produc["precio"]) {
                    throw new \Exception("El precio base no puede ser igual o mayor que el precio de venta.", 1);
                }
            }

            if (!$this->enInventario()) {
                $ifexist = inventario::find($req_id);
                if ($ifexist){
                    if ($origen=="local") {
                        if ($ifexist->push==1) {
    
                            if ($this->permisosucursal()) {//TEMPORAL MIENTRAS TRANSFERIMOS A TODAS
                                throw new \Exception("¡Producto Inventariado! No se puede modificar.", 1);
                            }//TEMPORAL MIENTRAS TRANSFERIMOS A TODAS
                            
                            if ($ifexist->cantidad > $ctInsert) {
                                throw new \Exception("No puede Reducir CANTIDADES.", 1);
                            }
                        }
                    } 
                }else{
                    if ($origen=="local") {
                        
                        if ($this->permisosucursal()) {//TEMPORAL MIENTRAS TRANSFERIMOS A TODAS
                            throw new \Exception("No se puede CREAR NUEVO.", 1);
                        }//TEMPORAL MIENTRAS TRANSFERIMOS A TODAS
                    } 
                }
            }



            if (!$req_id) {
                if (!$req_inpInvalterno) {
                    throw new \Exception("Error: Falta Alterno.", 1);
                }
                $checkpro = inventario::where("codigo_proveedor",$req_inpInvalterno)->first();
                if ($checkpro) {
                    throw new \Exception("Error: Alterno ya existe. ".$req_inpInvalterno, 1);
                }

                // Validar si el código de barras ya existe
                if ($req_inpInvbarras) {
                    $checkbarras = inventario::where("codigo_barras", $req_inpInvbarras)->first();
                    if ($checkbarras) {
                        throw new \Exception("Error: Código de barras ya existe. ".$req_inpInvbarras, 1);
                    }
                }

                if (isset($arrproducto["id_productoincentral"])) {
                    if ($arrproducto["id_productoincentral"]) {
                        $req_id = $arrproducto["id_productoincentral"];
                       
                    }
                }

            }

            $insertOrUpdateInv = inventario::updateOrCreate(
                ($req_id==="id_vinculacion")? ["id_vinculacion" => $id_vinculacion]: ["id" => $req_id],
                $arr_produc
            );


            $this->checkFalla($insertOrUpdateInv->id,$ctInsert);
            $this->insertItemFact($id_factura,$insertOrUpdateInv,$ctInsert,$beforecantidad,$ctNew,$tipo);
            if ($insertOrUpdateInv) {
                //Registrar moviento de producto

                (new MovimientosInventarioController)->newMovimientosInventario([
                    "antes" => $before,
                    "despues" => json_encode($arrproducto),
                    "id_usuario" => $id_usuario,
                    "id_producto" => $insertOrUpdateInv->id,
                    "origen" => $origen,
                ]);
                

                (new MovimientosInventariounitarioController)->setNewCtMov([
                    "id_producto" => $insertOrUpdateInv->id,
                    "cantidadafter" => $insertOrUpdateInv->cantidad,
                    "ct1" => isset($before["cantidad"])?$before["cantidad"]:0,
                    "origen" => "$origen #$id_cxp F-$numfactcxp",
                ]);
                
                DB::commit();
                return $insertOrUpdateInv->id;   
            }
        } catch (\Exception $e) {

            DB::rollback();
            return ["estado"=>false,"msj"=>$e->getMessage()];
        }
    }

    function permisosucursal() {
        $codigo_origen = (new sendCentral)->getOrigen();
        if ($codigo_origen=="achaguas") {
            return true;
        }
        return false;
    }

    function guardarProductoNovedad($arrproducto) {
        try {
            $id_usuario = session("id_usuario");

            $u = usuarios::find($id_usuario);
            if ($u) {
                $responsable = $u->usuario;
                $arrproducto["responsable"] = $responsable;
                $arrproducto["estado"] = 0;
                $arrproducto["idinsucursal"] = $arrproducto["id"];
                
                // Verificar si es una tarea de inventario cíclico
                if (isset($arrproducto['tipo_tarea']) && $arrproducto['tipo_tarea'] === 'inventario_ciclico') {
                    // Para inventario cíclico, no necesitamos buscar el producto en inventario local
                    // ya que los datos vienen del sistema central
                    return (new sendCentral)->sendNovedadCentral($arrproducto);
                } else {
                    // Comportamiento original para compatibilidad
                /* $insertOrUpdateInv = inventarios_novedades::updateOrCreate(["id_producto" => $id],$arr_produc); */
                    return (new sendCentral)->sendNovedadCentral($arrproducto);
                }
            }

        } catch (\Illuminate\Database\QueryException $e) {
            $errorCode = $e->errorInfo[1];
            if($errorCode == 1062){
                throw new \Exception("Codigo Duplicado. ".$req_inpInvbarras, 1);
            }else{
                throw new \Exception("Error: ".$e->getMessage(), 1);

            }
        }
    }
    function openTransferenciaPedido(Request $req) {
        $sucursal = sucursal::all()->first();
        $cop = (new PedidosController)->get_moneda()["cop"];
        $bs = (new PedidosController)->get_moneda()["bs"];
        $factor = 1;

        $pedidos = [
            (new PedidosController)->getPedidoFun($req->id, "todos", $cop, $bs, $factor)
        ];
        return view("reportes.transferenciapedido", [
            "sucursal" => $sucursal,
            "pedidos" => $pedidos,
            "bs" => $bs,
            "id" => $req->id
        ]);
    }
    public function insertItemFact($id_factura,$insertOrUpdateInv,$ctInsert,$beforecantidad,$ctNew,$tipo)
    {
        $find_factura = factura::find($id_factura);

        if($insertOrUpdateInv && $find_factura){

            $id_pro = $insertOrUpdateInv->id;
            $check_fact = items_factura::where("id_factura",$id_factura)->where("id_producto",$id_pro)->first();

            if ($check_fact) {
                $ctNew = $ctInsert - ($beforecantidad - $check_fact->cantidad);
            }


            if ($ctNew==0) {
                items_factura::where("id_factura",$id_factura)->where("id_producto",$id_pro)->delete();
            }else{
                items_factura::updateOrCreate([
                    "id_factura" => $id_factura,
                    "id_producto" => $id_pro,
                ],[
                    "cantidad" => $ctNew,
                    "tipo" => $tipo,

                ]);

            }

        }
    }

    public function getFallas(Request $req)
    {


        $qFallas = $req->qFallas;
        $orderCatFallas = $req->orderCatFallas;
        $orderSubCatFallas = $req->orderSubCatFallas;
        $ascdescFallas = $req->ascdescFallas;
       
        // $query_frecuencia = items_pedidos::with("producto")->select(['id_producto'])
        //     ->selectRaw('COUNT(id_producto) as en_pedidos, SUM(cantidad) as cantidad')
        //     ->groupBy(['id_producto']);

        // if ($orderSubCatFallas=="todos") {
        //     // $query_frecuencia->having('cantidad', '>', )
        // }else if ($orderSubCatFallas=="alta") {
        //     $query_frecuencia->having('cantidad', '>', )
        // }else if ($orderSubCatFallas=="media") {
        //     $query_frecuencia->having('cantidad', '>', )
        // }else if ($orderSubCatFallas=="baja") {
        //     $query_frecuencia->having('cantidad', '>', )
        // }

        // return $query_frecuencia->get();
        if ($orderCatFallas=="categoria") {
            
            return fallas::with(["producto"=>function($q){
                $q->with(["proveedor","categoria"]);
            }])->get()->groupBy("producto.categoria.descripcion");

        }else if ($orderCatFallas=="proveedor") {
            return fallas::with(["producto"=>function($q){
                $q->with(["proveedor","categoria"]);
            }])->get()->groupBy("producto.proveedor.descripcion");

        }
    }
    public function setFalla(Request $req)
    {   
        try {
            fallas::updateOrCreate(["id_producto"=>$req->id_producto],["id_producto"=>$req->id_producto]);
            
            return Response::json(["msj"=>"Falla enviada con Éxito","estado"=>true]);   
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
            
        } 
    }
    public function delFalla(Request $req)
    {   
        try {
            fallas::find($req->id)->delete();
            
            return Response::json(["msj"=>"Falla Eliminada","estado"=>true]);   
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
            
        } 
    }
    public function checkFalla($id,$ct)
    {   
        if ($id) {
            $stockmin = 0;
            $stockminquery = inventario::find($id)->first(["id","stockmin"]);
            if ($stockminquery) {
                $stockmin = $stockminquery->stockmin?$stockminquery->stockmin:0; 
            }
            if ($ct>=$stockmin) {

                $f = fallas::where("id_producto",$id)->first();
                if ($f) {
                    $f->delete();
                }
            }else if($ct<$stockmin){
    
                fallas::updateOrCreate(["id_producto"=>$id],["id_producto"=>$id]);
            }
        }
    }

    public function reporteInventario(Request $req)
    {
        $costo = 0;
        $venta = 0;

        $descripcion = $req->descripcion;
        $precio_base = $req->precio_base;
        $precio = $req->precio;
        $cantidad = $req->cantidad;
        $proveedor = $req->proveedor;
        $categoria = $req->categoria;
        $marca = $req->marca;

        $codigo_proveedor = $req->codigo_proveedor;
        $codigo_barras = $req->codigo_barras;

        $data= inventario::with("proveedor","categoria")->where(function($q) use ($codigo_proveedor,$codigo_barras,$descripcion,$precio_base,$precio,$cantidad,$proveedor,$categoria,$marca)
        {

            if($descripcion){$q->where("descripcion","LIKE","%".$descripcion."%");}
            if($codigo_proveedor){$q->where("codigo_proveedor","LIKE",$codigo_proveedor."%");}
            if($codigo_barras){$q->where("codigo_barras","LIKE",$codigo_barras."%");}

            if($precio_base){$q->where("precio_base",$precio_base);}
            if($precio){$q->where("precio",$precio);}
            if($cantidad){$q->where("cantidad",$cantidad);}
            if($proveedor){$q->where("id_proveedor",$proveedor);}
            if($categoria){$q->where("id_categoria",$categoria);}
            if($marca){$q->where("id_marca",$marca);}
        })
        ->orderBy("descripcion","asc")
        ->get()
        ->map(function($q) use (&$costo,&$venta)
        {
            $c = $q->cantidad*$q->precio_base;
            $v = $q->cantidad*$q->precio;

            $q->t_costo = number_format($c,"2"); 
            $q->t_venta = number_format($v,"2");
            
            $costo += $c;
            $venta += $v;

            return  $q;
        });
        $sucursal = sucursal::all()->first();
        $proveedores = proveedores::all();
        $categorias = categorias::all();
        
        
        return view("reportes.inventario",[
            "data"=>$data,
            "sucursal"=>$sucursal,
            "categorias"=>$categorias,
            "proveedores"=>$proveedores,

            "descripcion"=>$descripcion,
            "precio_base"=>$precio_base,
            "precio"=>$precio,
            "cantidad"=>$cantidad,
            "proveedor"=>$proveedor,
            "categoria"=>$categoria,
            "marca"=>$marca,

            "count" => count($data),
            "costo" => number_format($costo,"2"),
            "venta" => number_format($venta,"2"),

            "view_codigo_proveedor" => $req->view_codigo_proveedor==="off"?false:true,
            "view_codigo_barras" => $req->view_codigo_barras==="off"?false:true,
            "view_descripcion" => $req->view_descripcion==="off"?false:true,
            "view_proveedor" => $req->view_proveedor==="off"?false:true,
            "view_categoria" => $req->view_categoria==="off"?false:true,
            "view_id_marca" => $req->view_id_marca==="off"?false:true,
            "view_cantidad" => $req->view_cantidad==="off"?false:true,
            "view_precio_base" => $req->view_precio_base==="off"?false:true,
            "view_t_costo" => $req->view_t_costo==="off"?false:true,
            "view_precio" => $req->view_precio==="off"?false:true,
            "view_t_venta" => $req->view_t_venta==="off"?false:true,
           

        ]);
    }

    function getPorcentajeInventario(){
        $si = inventario::where("push",1)->count();
        $no = inventario::where("push",0)->count();
        $total = inventario::count();

        $porcen = round(($si / $total)*100,3);

        return [
            "VERDE" => $si,
            "ROJO" => $no,
            "TOTAL" => $total,
            "porcentaje" => $porcen
        ];

    }

    function cleanInventario(){
        try {
            $not = inventario::whereNotIn("id",items_pedidos::select("id_producto")->distinct()->whereNotNull("id_producto"))->where("cantidad",0)->delete();
            if ($not) {
                return "LISTO!";
            }else{
                return "NADA QUE HACER!";

            }
        } catch (\Exception $e) {
            return $e->getMessage();
        }


    }

    // ================ FUNCIONES PARA VALIDACIÓN DE FACTURAS ================
    
    /**
     * Validar si una factura existe en el sistema
     * Busca en la tabla pedidos por ID
     */
    public function validateFactura(Request $req)
    {
        try {
            $numfact = $req->numfact;
            
            // Validar parámetro
            if (!$numfact) {
                return response()->json([
                    'status' => 400,
                    'exists' => false,
                    'message' => 'Número de factura requerido'
                ]);
            }

            // Buscar en la tabla pedidos con relaciones - Agregamos items.producto para obtener productos
            $pedido = pedidos::with(['pagos', 'cliente', 'items.producto'])->where('id', $numfact)->first();

            if ($pedido) {
                // Preparar información del cliente como string
                $clienteInfo = '';
                if ($pedido->cliente) {
                    $clienteInfo = trim($pedido->cliente->nombre . ' ' . ($pedido->cliente->identificacion ? '(' . $pedido->cliente->identificacion . ')' : ''));
                }

                // Obtener métodos de pago del cliente
                $metodosPago = [];
                foreach ($pedido->pagos as $pago) {
                    $metodosPago[] = [
                        'tipo' => $pago->tipo,
                        'monto' => floatval($pago->monto),
                        'cuenta' => $pago->cuenta,
                        'descripcion' => $this->getDescripcionMetodoPago($pago->tipo),
                        'icono' => $this->getIconoMetodoPago($pago->tipo),
                        'descripcion_completa' => $this->getIconoMetodoPago($pago->tipo) . ' ' . $this->getDescripcionMetodoPago($pago->tipo)
                    ];
                }

                // Obtener productos que se llevó el cliente
                $productos = [];
                foreach ($pedido->items as $item) {
                    if ($item->producto) {
                        $productos[] = [
                            'id' => $item->producto->id,
                            'descripcion' => $item->producto->descripcion,
                            'codigo_barras' => $item->producto->codigo_barras ?? '',
                            'codigo_proveedor' => $item->producto->codigo_proveedor ?? '',
                            'cantidad' => intval($item->cantidad),
                            'precio_unitario' => floatval($item->monto),
                            'subtotal' => floatval($item->monto * $item->cantidad),
                            'categoria' => $item->producto->categoria ?? '',
                            'marca' => $item->producto->marca ?? ''
                        ];
                    }
                }

                // Calcular días transcurridos desde la compra automáticamente
                $diasTranscurridos = 0;
                if ($pedido->created_at) {
                    $fechaCompra = $pedido->created_at;
                    $fechaActual = now();
                    $diasTranscurridos = $fechaActual->diffInDays($fechaCompra);
                }

                return response()->json([
                    'status' => 200,
                    'exists' => true,
                    'message' => 'Factura encontrada',
                    'pedido' => [
                        'id' => $pedido->id,
                        'numfact' => $pedido->id,
                        'created_at' => $pedido->created_at ? $pedido->created_at->format('Y-m-d H:i:s') : '',
                        'monto_total' => $pedido->pagos()->sum('monto') ?? 0,
                        'cliente' => $clienteInfo,
                        'cliente_id' => $pedido->cliente ? $pedido->cliente->id : null,
                        'cliente_nombre' => $pedido->cliente ? $pedido->cliente->nombre : '',
                        'cliente_identificacion' => $pedido->cliente ? $pedido->cliente->identificacion : '',
                        'estado' => $pedido->estado ?? 0,
                        'estado_text' => $pedido->estado == 1 ? 'Completado' : 'Pendiente',
                        'dias_transcurridos_compra' => $diasTranscurridos
                    ],
                    'metodos_pago' => $metodosPago,
                    'productos_facturados' => $productos
                ]);
            } else {
                return response()->json([
                    'status' => 200,
                    'exists' => false,
                    'message' => 'Factura no encontrada en el sistema'
                ]);
            }

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'exists' => false,
                'message' => 'Error al validar factura: ' . $e->getMessage()
            ]);
        }
    }

    // ================ FUNCIONES PARA BÚSQUEDA DE PRODUCTOS EN INVENTARIO ================
    
    /**
     * Búsqueda de productos en inventario por múltiples campos
     * Soporta búsqueda por: descripción, código de barras, código de proveedor
     */
    public function searchProductosInventario(Request $req)
    {
        try {
            $term = $req->term;
            $field = $req->field ?? 'descripcion';
            $sucursal_id = $req->sucursal_id ?? null;
            $limit = $req->limit ?? 20;

            // Validar que el término de búsqueda no esté vacío
            if (!$term || strlen($term) < 2) {
                return response()->json([
                    'status' => 200,
                    'data' => [],
                    'message' => 'Término de búsqueda muy corto'
                ]);
            }

            // Construir la consulta base
            $query = inventario::with(['proveedor', 'categoria', 'marca']);
               // ->where('cantidad', '>', 0); // Solo productos con stock

            // Aplicar filtro por sucursal si se especifica
           /*  if ($sucursal_id) {
                $query->where('id_sucursal', $sucursal_id);
            } */

            // Aplicar búsqueda según el campo especificado
            // Buscar por los tres campos: descripcion, codigo_barras y codigo_proveedor
            $query->where(function($q) use ($term) {
                $q->where('descripcion', 'LIKE', '%' . $term . '%')
                  ->orWhere('codigo_barras', 'LIKE', '%' . $term . '%')
                  ->orWhere('codigo_proveedor', 'LIKE', '%' . $term . '%');
            });

            // Obtener los resultados
            $productos = $query->orderBy('descripcion', 'asc')
                ->limit($limit)
                ->get()
                ->map(function ($producto) {
                    return [
                        'id' => $producto->id,
                        'descripcion' => $producto->descripcion,
                        'codigo_barras' => $producto->codigo_barras,
                        'codigo_proveedor' => $producto->codigo_proveedor,
                        'precio' => $producto->precio,
                        'precio_base' => $producto->precio_base,
                        'precio1' => $producto->precio1,
                        'precio2' => $producto->precio2,
                        'precio3' => $producto->precio3,
                        'stock' => $producto->cantidad,
                        'categoria' => $producto->categoria ? $producto->categoria->descripcion : '',
                        'proveedor' => $producto->proveedor ? $producto->proveedor->descripcion : '',
                        'marca' => $producto->marca ? $producto->marca->descripcion : '',
                        'iva' => $producto->iva,
                        'bulto' => $producto->bulto,
                        'unidad' => $producto->unidad,
                        'stockmin' => $producto->stockmin,
                        'stockmax' => $producto->stockmax
                    ];
                });

            return response()->json([
                'status' => 200,
                'data' => $productos,
                'message' => 'Búsqueda exitosa',
                'total' => $productos->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'data' => [],
                'message' => 'Error en la búsqueda: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Obtener un producto específico por ID
     */
    public function getProductoById(Request $req)
    {
        try {
            $id = $req->id;
            
            if (!$id) {
                return response()->json([
                    'status' => 400,
                    'data' => null,
                    'message' => 'ID de producto requerido'
                ]);
            }

            $producto = inventario::with(['proveedor', 'categoria', 'marca'])
                ->find($id);

            if (!$producto) {
                return response()->json([
                    'status' => 404,
                    'data' => null,
                    'message' => 'Producto no encontrado'
                ]);
            }

            $data = [
                'id' => $producto->id,
                'descripcion' => $producto->descripcion,
                'codigo_barras' => $producto->codigo_barras,
                'codigo_proveedor' => $producto->codigo_proveedor,
                'precio' => $producto->precio,
                'precio_base' => $producto->precio_base,
                'precio1' => $producto->precio1,
                'precio2' => $producto->precio2,
                'precio3' => $producto->precio3,
                'stock' => $producto->cantidad,
                'categoria' => $producto->categoria ? $producto->categoria->descripcion : '',
                'proveedor' => $producto->proveedor ? $producto->proveedor->descripcion : '',
                'marca' => $producto->marca ? $producto->marca->descripcion : '',
                'iva' => $producto->iva,
                'bulto' => $producto->bulto,
                'unidad' => $producto->unidad,
                'stockmin' => $producto->stockmin,
                'stockmax' => $producto->stockmax
            ];

            return response()->json([
                'status' => 200,
                'data' => $data,
                'message' => 'Producto encontrado'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'data' => null,
                'message' => 'Error al obtener producto: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Helper method para obtener descripción de métodos de pago
     * Basado en la migración create_pago_pedidos_table.php
     */
    private function getDescripcionMetodoPago($tipo)
    {
        $descripciones = [
            '1' => 'Transferencia Bancaria',
            '2' => 'Tarjeta de Débito',
            '3' => 'Efectivo',
            '4' => 'Crédito',
            '5' => 'Otros Métodos',
            '6' => 'Vuelto'
        ];
        
        // Convertir a string si es numérico para mantener compatibilidad
        $tipoString = (string) $tipo;
        
        return $descripciones[$tipoString] ?? "Método de pago #{$tipo}";
    }

    /**
     * Helper method para obtener icono de método de pago
     */
    private function getIconoMetodoPago($tipo)
    {
        $iconos = [
            '1' => '🏦', // Transferencia
            '2' => '💳', // Débito
            '3' => '💵', // Efectivo
            '4' => '🏷️', // Crédito
            '5' => '💰', // Otros
            '6' => '↩️'  // Vuelto
        ];
        
        $tipoString = (string) $tipo;
        return $iconos[$tipoString] ?? '💳';
    }
            
}
