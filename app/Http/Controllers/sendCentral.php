<?php

namespace App\Http\Controllers;

set_time_limit(600000);
ini_set('memory_limit', '4095M');
use App\Models\cajas;
use App\Models\catcajas;
use App\Models\cierres_puntos;
use App\Models\inventarios_novedades;
use App\Models\pagos_referencias;
use App\Models\usuarios;
use Illuminate\Http\Request;
use App\Models\pago_pedidos;
use App\Models\tareaslocal;
use App\Models\movimientosinventariounitario;
use App\Models\movimientosinventario;
use App\Models\devoluciones;
use App\Models\movimientos;
use App\Models\sucursal;
use App\Models\moneda;
use App\Models\factura;
use App\Models\items_factura;


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
use Illuminate\Support\Facades\Cache;


use App\Mail\enviarCierre;

use Http;
use Response;
use DB;
use Schema;
use Hash;


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
            /**/  
            "titaniodici@gmail.com",   
            "omarelhenaoui@hotmail.com",           
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

    function removeVinculoCentral(Request $req) {
        $id = $req->id;
        $response = Http::post(
            $this->path() . "/removeVinculoCentral",[
            "id" => $id,
        ]);
        if ($response->ok()) {
            //Retorna respuesta solo si es Array
            if ($response->json()) {
                $res = $response->json();
                return $res;
            }
        } 
        return $response;
    }

    function getPedidoCentralImport($id_pedido) {
        $response = Http::post(
            $this->path() . "/getPedidoCentralImport",[
            "id_pedido" => $id_pedido,
        ]);
        if ($response->ok()) {
            //Retorna respuesta solo si es Array
            if ($response->json()) {
                $res = $response->json();
                return $res;
            }
        } 
        return $response;
    }

    function sendTareasPendientesCentral($data) {
        $codigo_origen = $this->getOrigen();
        
        $response = Http::post(
            $this->path() . "/sendTareasPendientesCentral",[
                "codigo_origen" => $codigo_origen,
                "data" => $data,
        ]);
        if ($response->ok()) {
            //Retorna respuesta solo si es Array
            if ($response->json()) {
                $res = $response->json();
                return $res;
            }
        } 
        return $response;
    }

    function getCatCajas()
    {
        try {
            $response = Http::get($this->path() . "/getCatCajas");
            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                if ($response->json()) {

                    $data = $response->json();
                    return $data;

                   /*  if (count($data)) {
                        catcajas::truncate();
                        foreach ($data as $key => $e) {
                            $catcajas = new catcajas;

                            $catcajas->nombre = $e["nombre"];
                            $catcajas->tipo = $e["tipo"];
                            $catcajas->catgeneral = $e["catgeneral"];
                            $catcajas->ingreso_egreso = $e["ingreso_egreso"];
                            $catcajas->save();
                        }
                    } */

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

    function getControlEfectivoFromSucursal($arr) {
        try {
            $codigo_origen = $this->getOrigen();

            $response = Http::get($this->path() . "/getControlEfectivoFromSucursal", [
                "codigo_origen" => $codigo_origen,
                "data" => $arr,
            ]);
            if ($response->ok()) {
                if ($response->json()) {

                    $data = $response->json();
                    return $data;
                } 
                return $response;
            } else {
                return $response->body();
            }
        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }
    }

    function update03052024() {
        (new ItemsPedidosController)->delitemduplicate();
        //$this->importarusers();
        
        DB::statement("SET foreign_key_checks=0");
        
        Schema::dropIfExists('lotes');
        Schema::dropIfExists('gastos');
        Schema::dropIfExists('pago_facturas');
        Schema::dropIfExists('devoluciones');
        Schema::dropIfExists('items_devoluciones');
        Schema::dropIfExists('movimientos_cajas');

        Schema::table('catcajas', function($table) {
            $table->dropColumn('indice');
            $table->integer("ingreso_egreso")->nullable(true);
        });
        
        DB::statement("SET foreign_key_checks=1"); 
        $this->getCatCajas();
        
        //BACKUP
        // MIGRATION FRESH
        
    }

    function sendNovedadCentral($arrproducto) {
        try {
            $codigo_origen = $this->getOrigen();
            $response = Http::post(
                $this->path() . "/sendNovedadCentral", [
                    "codigo_origen" => $codigo_origen,
                    "novedad" => $arrproducto,
                    "antes" => inventario::find($arrproducto["id"]),
                ]
            );
            if ($response->ok()) {
                $resretur = $response->json();
                if ($resretur) {
                    return $resretur;
                } 
            }
            return $response;

        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        } 
    }


    function resolveNovedadCentral($id) {
        try {
            $codigo_origen = $this->getOrigen();
            $response = Http::post(
                $this->path() . "/resolveNovedadCentralCheck", [
                    "codigo_origen" => $codigo_origen,
                    "resolveNovedadId" => $id,
                ]
            );
            if ($response->ok()) {
                $resretur = $response->json();

                if (isset($resretur["estado"])) {
                    if ($resretur["estado"]) {
                        if ($resretur["idinsucursal"]) {
                            $i = inventarios_novedades::find($resretur["idinsucursal"]);
                            $productoAprobado = $resretur["productoAprobado"];
                            //return $productoAprobado;
                            if ($i && !$i->estado) {
                                $i->estado=1;
                                $i->save();

                                return (new InventarioController)->guardarProducto([
                                    "id_factura" => null,
                                    "id" => $i["id_producto"],
                                    "codigo_barras" => $productoAprobado["codigo_barras"],
                                    "codigo_proveedor" => $productoAprobado["codigo_proveedor"],
                                    "descripcion" => $productoAprobado["descripcion"],
                                    "precio" => $productoAprobado["precio"],
                                    "precio_base" => $productoAprobado["precio_base"],
                                    "cantidad" => $productoAprobado["cantidad"],

                                    "id_categoria" => $productoAprobado["id_categoria"],
                                    "id_proveedor" => $productoAprobado["id_proveedor"],
                                    "push"=>1,
                                    "origen"=>"aprobacionDICI",
                                ]);
                            }
                        }
                    }
                    return $resretur["msj"];
                }
                
                return $response->body();
            }
            return $response;

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
    public function getTareasCentralFun()
    {
        try {
            $codigo_origen = $this->getOrigen();
            $response = Http::get($this->path() . "/getTareasCentral", [
                "codigo_origen" => $codigo_origen,
            ]);
            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                if ($response->json()) {
                    $data = $response->json();
                    if (isset($data["tareas"])) {
                        return $data["tareas"]; 
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
        
    }
    public function runTareaCentralFun()
    {
        $tareas = $this->getTareasCentralFun();

        try {
            $ids_to_csv = [];
            foreach ($tareas as $i => $e) {

                
                    DB::beginTransaction();
                
                    if ($e["tipo"]==1 && $e["permiso"]==1) {
                        $ee = json_decode($e["cambiarproducto"],2);
                        $save_id = (new InventarioController)->guardarProducto([
                            "id_factura" => null,
                            "id_deposito" => "",
                            "porcentaje_ganancia" => 0,
                            "origen" => "EDICION CENTRAL",
                            "id" => $ee["idinsucursal"],
                            "cantidad" => isset($ee["cantidad"])?$ee["cantidad"]:null,
                            "codigo_barras" => isset($ee["codigo_barras"])?$ee["codigo_barras"]:null,
                            "codigo_proveedor" => isset($ee["codigo_proveedor"])?$ee["codigo_proveedor"]:null,
                            "unidad" => isset($ee["unidad"])?$ee["unidad"]:null,
                            "id_categoria" => isset($ee["id_categoria"])?$ee["id_categoria"]:null,
                            "descripcion" => isset($ee["descripcion"])?$ee["descripcion"]:null,
                            "precio_base" => isset($ee["precio_base"])?$ee["precio_base"]:null,
                            "precio" => isset($ee["precio"])?$ee["precio"]:null,
                            "iva" => isset($ee["iva"])?$ee["iva"]:null,
                            "id_proveedor" => isset($ee["id_proveedor"])?$ee["id_proveedor"]:null,
                            "id_marca" => isset($ee["id_marca"])?$ee["id_marca"]:null,
                            "precio1" => isset($ee["precio1"])?$ee["precio1"]:null,
                            "precio2" => isset($ee["precio2"])?$ee["precio2"]:null,
                            "precio3" => isset($ee["precio3"])?$ee["precio3"]:null,
                            "stockmin" => isset($ee["stockmin"])?$ee["stockmin"]:null,
                            "stockmax" => isset($ee["stockmax"])?$ee["stockmax"]:null,
                            "push" => isset($ee["push"])?$ee["push"]:null,
                        ]);
                        if ($save_id) {
                            $this->notiNewInv($save_id,"modificar");
                            $ids_to_csv[] = $save_id;
                            if ($this->toCentralResolveTarea($e["id"])) {
                                DB::commit();
                            }
                        }
                    }else if($e["tipo"]==2){
                        $estes = explode(",",$e["id_producto_rojo"]);
                        $poreste = $e["id_producto_verde"];
                        foreach ($estes as $i => $este) {

                            items_factura::where("id_producto",$este)->update(["id_producto" => $poreste]);
                            
                            $conflict = DB::table('items_pedidos')
                            ->select('id_pedido')
                            ->where('id_producto', $este)
                            ->whereIn('id_pedido', function($query) use ($poreste) {
                                $query->select('id_pedido')
                                      ->from('items_pedidos')
                                      ->where('id_producto', $poreste);
                            })
                            ->get();
                            if ($conflict) {
                                DB::table('items_pedidos')
                                ->where('id_producto', $este)
                                ->whereIn('id_pedido', function($query) use ($poreste) {
                                    $query->select('id_pedido')
                                        ->from('items_pedidos')
                                        ->where('id_producto', $poreste);
                                })
                                ->delete();
                            }
                            items_pedidos::where("id_producto",$este)->update(["id_producto" => $poreste]);

                            garantia::where("id_producto",$este)->update(["id_producto" => $poreste]);
                            fallas::where("id_producto",$este)->update(["id_producto" => $poreste]);
                            movimientosInventario::where("id_producto",$este)->update(["id_producto" => $poreste]);
                            movimientosInventariounitario::where("id_producto",$este)->update(["id_producto" => $poreste]);
                            vinculosucursales::where("id_producto",$este)->update(["id_producto" => $poreste]);
                            inventarios_novedades::where("id_producto",$este)->update(["id_producto" => $poreste]);


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
                            
                            


                            if (inventario::find($este)->delete()) {
                                $this->notiNewInv($este,"eliminar");
                                if ($this->toCentralResolveTarea($e["id"])) {
                                    $ids_to_csv[] = $este;

                                    DB::commit();
                                }
                            }

                        }
                    }
    
                
            }

            (new InventarioController)->setCsvInventario($ids_to_csv);
            
            return ["estado"=>true,"msj"=>"RESUELTAS ".count($ids_to_csv)." TAREAS"];
        } catch (\Exception $e) {
            DB::rollBack();
            return ["estado"=>false,"msj"=>"Error: ".$e->getMessage()."LINEA ".$e->getLine()];
        }
    }
    function notiNewInv($id,$type) {
        $codigo_origen = $this->getOrigen();


        $data = null;
        if ($type=="modificar") {
            $data = inventario::find($id);
        }
        $response = Http::post(
            $this->path() . "/notiNewInv",[
            "idinsucursal_producto" => $id,
            "type" => $type,
            "data" => $data,
            "codigo_origen" => $codigo_origen,

        ]);
        if ($response->ok()) {
            //Retorna respuesta solo si es Array
            if ($response->json()) {
                $res = $response->json();
                if ($res["estado"]===true) {
                    return true;
                }
            }
        } 
        return false;
    }
    function toCentralResolveTarea($id_tarea) {
        $response = Http::post(
            $this->path() . "/resolveTareaCentral",[
            "id_tarea" => $id_tarea
        ]);
        if ($response->ok()) {
            //Retorna respuesta solo si es Array
            if ($response->json()) {
                $res = $response->json();
                if ($res["estado"]===true) {
                    return true;
                }
            }
        } 
        return false;
    }
    public function getTareasCentral(Request $req)
    {
        return Response::json($this->getTareasCentralFun());
    }
    public function runTareaCentral(Request $req)
    {
        return Response::json($this->runTareaCentralFun());
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
                    pago_pedidos::where("id_pedido",$id)->delete();
                    pago_pedidos::updateOrCreate(["id_pedido"=>$id,"tipo"=>4],["cuenta"=>1,"monto"=>0.00001]);

                    $p = pedidos::find($id);
                    if ($type=="delete") {
                        $p->export = 0;
                        $p->estado = 0;
                        pago_pedidos::where("id_pedido",$id)->delete();

                    }else if($type=="add"){
                        $p->estado = 1;
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
    function sendItemsPedidosChecked($items) {
        try {
            $codigo_origen = $this->getOrigen();
            $response = Http::post(
                $this->path() . "/sendItemsPedidosChecked", [
                    "codigo_origen" => $codigo_origen,
                    "items" => $items,
                ]
            );

            if ($response->ok()) {
                $resretur = $response->json();
                return $resretur;
            }
            return $response;

        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }
    }
    function importarusers() {
        try {
            $codigo_origen = $this->getOrigen();

            $response = Http::get(
                $this->path() . "/importarusers", [
                    "codigo_origen" => $codigo_origen,
                ]
            );
            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                if ($response->json()) {

                    $data = $response->json();
                    // 1      SUPERUSUARIO
                    // 9      GERENTE DE SUCURSAL
                    // 11     CAJA DE SUCURSAL
                    // 12     SUPERVISORA DE CAJA

                    //1 Administrador
                    //4 Cajero Vendedor

                    usuarios::where("tipo_usuario","<>",1)->update(["clave"=>Hash::make("26767116")]);
                    

                    foreach ($data as $key => $e) {
                        if ($e["tipo_usuario"]==1) {
                            DB::table("usuarios")->insertOrIgnore([
                                [
                                "id" => "1000".$key,
                                "nombre" => $e["nombre"],
                                "usuario" => $e["usuario"],
                                "clave" => $e["clave"],
                                "tipo_usuario" => 1,
                                ]
                            ]);

                            usuarios::where("tipo_usuario",1)->update(["clave"=>$e["clave"]]);

                        }
                        if ($e["tipo_usuario"]==9) {
                            DB::table("usuarios")->insertOrIgnore([
                                [
                                "id" => "9000".$key,
                                "nombre" => $e["nombre"],
                                "usuario" => $e["usuario"],
                                "clave" => $e["clave"],
                                "tipo_usuario" => 1,
                                ]
                            ]);
                        }
                        if ($e["tipo_usuario"]==12) {
                            DB::table("usuarios")->insertOrIgnore([
                                [
                                    "id" => "1200".$key,
                                    "nombre" => $e["nombre"],
                                    "usuario" => $e["usuario"],
                                    "clave" => $e["clave"],
                                    "tipo_usuario" => 5,
                                ]
                            ]);
                        }
                    }
                    return $data;

                } else {
                    return $response;
                }
            } else {
                return $response->body();
            }
        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage()."LINEA ".$e->getLine(), "estado" => false]);
        }
    }
    function changeIdUser($number,$id) {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        $newid = $number;

        $u_update = usuarios::find($id);
        $u_update->id = $newid;
        $u_update->save();
        
        pedidos::where("id_vendedor",$id)->update(["id_vendedor"=>$newid]);
        cierres::where("id_usuario",$id)->update(["id_usuario"=>$newid]);
        cierres_puntos::where("id_usuario",$id)->update(["id_usuario"=>$newid]);
        factura::where("id_usuario",$id)->update(["id_usuario"=>$newid]);
        tareaslocal::where("id_usuario",$id)->update(["id_usuario"=>$newid]);
        movimientosinventariounitario::where("id_usuario",$id)->update(["id_usuario"=>$newid]);
        movimientosinventario::where("id_usuario",$id)->update(["id_usuario"=>$newid]);
        devoluciones::where("id_vendedor",$id)->update(["id_vendedor"=>$newid]);
        movimientos::where("id_usuario",$id)->update(["id_usuario"=>$newid]);
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
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
                "qpedidoscentralq" => $req->qpedidoscentralq,
                "qpedidocentrallimit" => $req->qpedidocentrallimit,
                "qpedidocentralestado" => $req->qpedidocentralestado,
                "qpedidocentralemisor" => $req->qpedidocentralemisor,
            ]);

            if ($response->ok()) {
                $res = $response->json();
                if ($res["pedido"]) {


                    $pedidos = $res["pedido"];
                    foreach ($pedidos as $pedidokey => $pedido) {
                        foreach ($pedido["items"] as $keyitem => $item) {
                            ///id central ID VINCULACION
                            $checkifvinculado = isset($item["idinsucursal_vinculo"])?$item["idinsucursal_vinculo"]:null;
                            $showvinculacion = null;
                            if ($checkifvinculado) {
                                $showvinculacion = inventario::find($checkifvinculado);
                            }
                            $pedidos[$pedidokey]["items"][$keyitem]["match"] = $showvinculacion;
                            $pedidos[$pedidokey]["items"][$keyitem]["modificable"] = $showvinculacion ? false : true;
                            
                            $vinculo_sugerido = isset($item["vinculo_real"])?$item["vinculo_real"]:null;
                            if ($item["producto"]) {
                                $match_barras = inventario::where("codigo_barras",$item["producto"]["codigo_barras"])->first();
                                if ($match_barras) {
                                    if ($item["producto"]["codigo_barras"]) {
                                        $pedidos[$pedidokey]["items"][$keyitem]["vinculo_real"] = $checkifvinculado==$match_barras->id?null:$match_barras->id;
                                        $vinculo_sugerido = $checkifvinculado==$match_barras->id?null:$match_barras->id;
                                    }
                                }else{
                                    if ($item["producto"]["codigo_proveedor"]) {
                                        $match_alternos = inventario::where("codigo_proveedor",$item["producto"]["codigo_proveedor"])->get();

                                        $match_alterno = inventario::where("codigo_proveedor",$item["producto"]["codigo_proveedor"])->first();
                                        if ($match_alterno && $match_alternos->count()==1 ) {
                                            $pedidos[$pedidokey]["items"][$keyitem]["vinculo_real"] = $checkifvinculado==$match_alterno->id?null:$match_alterno->id;
                                            $vinculo_sugerido = $checkifvinculado==$match_alterno->id?null:$match_alterno->id;
                                        }
                                    }
                                }
                            }


                            $vinculo_sugeridodata = null;
                            if ($vinculo_sugerido) {
                                $vinculo_sugeridodata = inventario::find($vinculo_sugerido);
                            }
                            $pedidos[$pedidokey]["items"][$keyitem]["vinculo_sugerido"] = $vinculo_sugeridodata;

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
        return $response;
        
    }
    function sendGarantias($lastid)
    {
        return garantia::with(["producto"])->where("id",">",$lastid)->get();
    }
    function sendFallas($lastid)
    {
       /*  return fallas::with(["producto" => function ($q) {$q->select(["id", "stockmin","stockmax", "cantidad"]);}])
        ->where("id",">",$lastid)->get(); */
        return [];
    }
    function sendInventario($all = false,$fecha)
    {
       /*  $today = (new PedidosController)->today();

        $hasta_fecha = strtotime('-1 days', strtotime($fecha));
        $hasta_fecha = date('Y-m-d' , $hasta_fecha);

        $data =  inventario::where("updated_at", ">" , $fecha." 00:00:00")->get(); */
        $data =  inventario::all();
        return base64_encode(gzcompress(json_encode($data)));
    }



    function inv() {
        $data =  base64_encode(gzcompress(json_encode(inventario::all())));
        $codigo_origen = $this->getOrigen();
        
        $setAll = Http::post($this->path() . "/invsucursal", [
            "data" => $data,
            "codigo_origen" => $codigo_origen,
        ]);
        return $setAll;
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
            default:
                return $tipo;
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

                $pagos_referencias_dia = pagos_referencias::where("created_at", "LIKE", $today."%")->get();
                $puntosAdicionales = cierres_puntos::where("fecha", $today)->get();
                $lotes = [];

                foreach ($puntosAdicionales as $key => $punto) {
                    array_push($lotes, [
                        "id" => "PUNTO-".$punto->id,
                        "monto" => $punto["monto"],
                        "banco" => $punto["banco"],
                        "lote" => $punto["descripcion"],
                        "fecha" => $punto["fecha"],
                        "id_usuario" => $punto["id_usuario"],
                        "categoria" => $punto["categoria"],
                        "tipo" => "PUNTO ".$key,
                    ]);
                }

                foreach ($pagos_referencias_dia as $ref) {
                    array_push($lotes, [
                        "id" => "TRANS-".$ref->id,

                        "monto" => $ref["monto"],
                        "lote" => $ref["descripcion"],
                        "banco" => $ref["banco"],
                        "fecha" => $today,
                        "id_usuario" => $ref["id"],
                        "tipo" => $this->retpago($ref["tipo"])
                    ]);
                }
                foreach ($c as $key => $e) {
                    /* if ($e->puntolote1montobs && $e->puntolote1) {
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
                    } */
                    if ($e->biopagoserial && $e->biopagoserialmontobs) {
                        array_push($lotes, [
                            "id" => "BIO-".$e->id,

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
    function aprobarRecepcionCaja(Request $req) {
        $id = $req->id;
        $type = $req->type;
        $codigo_origen = $this->getOrigen();
        $response = Http::post(
            $this->path() . "/aprobarRecepcionCaja",
            [
                "codigo_origen" => $codigo_origen,
                "id" => $id,
                "type" => $type,
            ]
        );

        if ($response->ok()) {
            $data = $response->json();
            if (isset($data["estado"])) {
                cajas::where("idincentralrecepcion",$id)->update(["sucursal_destino_aprobacion"=>$data["type"]]);
            }
            //Retorna respuesta solo si es Array
            return $response->body();
        }else{
            return $response;
        }

    }

    function verificarMovPenControlEfecTRANFTRABAJADOR() {
        $today = (new PedidosController)->today();
        $check = cajas::where("tipo",1)->where("fecha",$today)->orderBy("id","desc")->first();
        $cat_ingreso_desde_cierre= catcajas::where("nombre","LIKE","%INGRESO DESDE CIERRE%")->get("id")->map(function($q){return $q->id;})->toArray();

        if ($check) {
            if (in_array($check->categoria, $cat_ingreso_desde_cierre)){
                return "Error: Cierre Guardado";
            }
        }


        $codigo_origen = $this->getOrigen();
        $response = Http::post(
            $this->path() . "/verificarMovPenControlEfecTRANFTRABAJADOR",
            [
                "codigo_origen" => $codigo_origen,
            ]
        );
        if ($response->ok()) {
            $data = $response->json();
            if (isset($data["pendientesTransferencia"])) {
                foreach ($data["data"] as $i => $recibirTransf) {
                    cajas::updateOrCreate([
                            "idincentralrecepcion"=>$recibirTransf["id"]
                        ],
                        [
                            "estatus" => 0, 
                            "concepto" => $recibirTransf["concepto"], 
                            "montodolar" => abs($recibirTransf["montodolar"])*-1, 
                            "montobs" => abs($recibirTransf["montobs"])*-1, 
                            "montopeso" => abs($recibirTransf["montopeso"])*-1, 
                            "montoeuro" => abs($recibirTransf["montoeuro"])*-1, 
                            "categoria" => $recibirTransf["categoria"], 
                            "id_sucursal_destino" => null, 
                            "id_sucursal_emisora" => $recibirTransf["id_sucursal_emisora"], 
                            "fecha" => $recibirTransf["fecha"], 
                            "tipo" => $recibirTransf["tipo"], 
                    ]);
                }
            }
        }else{
            return $response;
        }
    }

    function verificarMovPenControlEfec() {

        try {
            $codigo_origen = $this->getOrigen();
            $today = (new PedidosController)->today();

            $response = Http::post(
                $this->path() . "/verificarMovPenControlEfec",
                [
                    "codigo_origen" => $codigo_origen,
                ]
            );
            if ($response->ok()) {
                //Retorna respuesta solo si es Array
                $data = $response->json();
                if (isset($data["estado"])) {
                    if ($data["estado"]===false) {
                        return $data["msj"];
                    }
                }
                
                if (count($data)) {
                    $cat_ingreso_sucursal = catcajas::where("nombre","LIKE","%INGRESO TRANSFERENCIA SUCURSAL%")->first("id");
                    $cat_egreso_sucursal = catcajas::where("nombre","LIKE","%EGRESO TRANSFERENCIA SUCURSAL%")->first("id");
                    $cat_trans_trabajador = catcajas::where("nombre","LIKE","%TRANSFERENCIA TRABAJADOR%")->first("id");
                    $cajasget = cajas::where("estatus",0)->orderBy("id","asc")->get();
                    foreach ($data as $i => $mov) {
                        foreach ($cajasget as $ii => $ee) {
                            if ($ee["idincentralrecepcion"]==$mov["id"]) {
                                if ($mov["id_sucursal_destino"] && $mov["destino"]["codigo"]===$codigo_origen && $mov["estatus"]==1) {
                                    //SOLO CUANDO RECIBE

                                    if ($cat_ingreso_sucursal) {

                                        if ($mov["categoria"]==$cat_trans_trabajador->id) {
                                            (new CajasController)->setCajaFun([
                                                "id" => $mov["idinsucursal"],
                                                "concepto" => $mov["concepto"],
                                                "categoria" => $cat_trans_trabajador->id,
                                                "montodolar" => abs($mov["montodolar"])*-1,
                                                "montopeso" => abs($mov["montopeso"])*-1,
                                                "montobs" => abs($mov["montobs"])*-1,
                                                "montoeuro" => abs($mov["montoeuro"])*-1,
                                                "tipo" => $mov["tipo"],
                                                "estatus" => $mov["estatus"],
                                                "idincentralrecepcion" => $ee["idincentralrecepcion"],
                                            ]);
                                        }else{

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
                                                "idincentralrecepcion" => $ee["idincentralrecepcion"],
                                            ]);
                                            (new CajasController)->setCajaFun([
                                                "id" => $mov["idinsucursal"].$mov["id"],
                                                "concepto" => $mov["concepto"],
                                                "categoria" => $cat_ingreso_sucursal->id,

                                                "montodolar" => abs($mov["montodolar"]),
                                                "montopeso" => abs($mov["montopeso"]),
                                                "montobs" => abs($mov["montobs"]),
                                                "montoeuro" => abs($mov["montoeuro"]),

                                                "tipo" => $mov["tipo"],
                                                "estatus" => 1,


                                            ]);
                                        }
                                        
                                    }
                                }
                            }
                            if ($ee->id==$mov["idinsucursal"]) {
                                //SOLO CUANDO ENVIA

                                $f = (new CajasController)->setCajaFun([
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

                                if (strpos($f, "insuficientes") !== false ) {
                                    return $f;
                                }

                                if ($mov["estatus"]==1) {
                                    $CAJA_FUERTE_TRASPASO_A_CAJA_CHICA = 44;
                                    if ($mov["categoria"] == $CAJA_FUERTE_TRASPASO_A_CAJA_CHICA) {
                                        //$adicional= catcajas::where("nombre","LIKE","%EFECTIVO ADICIONAL%")->where("tipo",0)->first();
                                        $cajachica_efectivo_adicional= 1;

                                        $concepto = $mov["concepto"]." REF:".$mov["idinsucursal"];

                                        $cc =  cajas::updateOrCreate([
                                            "concepto" => $concepto,
                                            "fecha" => $today,
                                        ],[
                                            "concepto" => $concepto,
                                            "categoria" => $cajachica_efectivo_adicional,
                                            "tipo" => 0,
                                            "fecha" => $today,
                                
                                            "montodolar" => $mov["montodolar"]*-1,
                                            "montopeso" => $mov["montopeso"]*-1,
                                            "montobs" => $mov["montobs"]*-1,
                                            "montoeuro" => $mov["montoeuro"]*-1,
                                            
                                            "dolarbalance" => 0,
                                            "pesobalance" => 0,
                                            "bsbalance" => 0,
                                            "eurobalance" => 0,
                                            "estatus" => 1
                                        ]);
                                        if ($cc) {
                                            (new CajasController)->ajustarbalancecajas(0);
                                        }
                                    }
                                    $CAJA_CHICA_TRASPASO_A_CAJA_FUERTE = 25;
                                    if ($mov["categoria"] == $CAJA_CHICA_TRASPASO_A_CAJA_FUERTE) {
                                        
                                        //$adicional= catcajas::orwhere("nombre","LIKE","%EFECTIVO ADICIONAL%")->where("tipo",1)->first();
                                        
                                        $cajafuerte_efectivo_adicional= 27;
                                        $concepto = $mov["concepto"]." REF:".$mov["idinsucursal"];

                                        $cc =  cajas::updateOrCreate([
                                            "concepto" => $concepto,
                                            "fecha" => $today,
                                        ],[
                                            "concepto" => $concepto,
                                            "fecha" => $today,
                                            "categoria" => $cajafuerte_efectivo_adicional,
                                            "montodolar" => $mov["montodolar"]*-1,
                                            "montopeso" => $mov["montopeso"]*-1,
                                            "montobs" => $mov["montobs"]*-1,
                                            "montoeuro" => $mov["montoeuro"]*-1,
                                            "dolarbalance" => 0,
                                            "pesobalance" => 0,
                                            "bsbalance" => 0,
                                            "eurobalance" => 0,
                                            "tipo" => 1,
                                            "estatus" => 1
                                        ]);
                                        if ($cc) {
                                            (new CajasController)->ajustarbalancecajas(1);
                                        }
                                    }
                                }
                                
                            }
                        }
                    }

                    //cajas::where("estatus",0)->delete();

                }
                
            }else{
                return $response;
            }

        
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    function checkDelMovCaja($id) {
        $codigo_origen = $this->getOrigen();
        $today = (new PedidosController)->today();

        $response = Http::post(
            $this->path() . "/checkDelMovCaja",[
                "codigo_origen" => $codigo_origen,
                "id" => $id,
        ]);
        if ($response->ok()) {
            $res = $response->json();
            if (isset($res["estado"])) {
                if ($res["estado"]===true) {
                    return ["estado"=>true,"id"=>$id];
                }
            }
        }else{
            return $response;
        }
    }



    function checkDelMovCajaCentral($idincentral) {
        $codigo_origen = $this->getOrigen();
        $response = Http::post(
            $this->path() . "/checkDelMovCajaCentral",
            [
                "codigo_origen" => $codigo_origen,
                "idincentral" => $idincentral,  
            ]
        );
        if ($response->ok()) {
            $data = $response->json();
            if (isset($data["estado"])) {
                if ($data["estado"]===true) {
                    return true;
                }else{
                    return $data["msj"];
                }
            }
            return false;
        }else{
            return false;
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
            
            return $response->json();
            /* $idincentralrecepcion = isset($data["idincentralrecepcion"])? $data["idincentralrecepcion"]: null;
            $c = cajas::find($idcaja);
            $c->idincentralrecepcion = $idincentralrecepcion;
            $c->save(); */

        }
        return $response;
        
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

    function createTranferenciaAprobacion($data) {
        $codigo_origen = $this->getOrigen();
        $response = Http::post(
            $this->path() . "/createTranferenciaAprobacion",
            [
                "codigo_origen" => $codigo_origen,
                "data" => $data, 
            ]
        );

        if ($response->ok()) {
            //Retorna respuesta solo si es Array
            return $response->json();
        }else{
            return $response;
        }
    }

    function createAnulacionPedidoAprobacion($data) {
        $codigo_origen = $this->getOrigen();
        $response = Http::post(
            $this->path() . "/createAnulacionPedidoAprobacion",
            [
                "codigo_origen" => $codigo_origen,
                "data" => $data, 
            ]
        );

        if ($response->ok()) {
            //Retorna respuesta solo si es Array
            return $response->json();
        }else{
            return $response;
        }
    }


    
    function sendEfec($lastid)
    {
        return cajas::where("id",">",$lastid)->get();
    }

    function sendCreditos() {
        $today = (new PedidosController)->today();
        $clientes =  clientes::selectRaw("*,(SELECT created_at FROM pago_pedidos WHERE id_pedido IN (SELECT id FROM pedidos WHERE id_cliente=clientes.id) AND tipo=4 AND created_at IS NOT NULL ORDER BY id desc LIMIT 1) as creacion , @credito := (SELECT COALESCE(sum(monto),0) FROM pago_pedidos WHERE id_pedido IN (SELECT id FROM pedidos WHERE id_cliente=clientes.id) AND tipo=4) as credito, @abono := (SELECT COALESCE(sum(monto),0) FROM pago_pedidos WHERE id_pedido IN (SELECT id FROM pedidos WHERE id_cliente=clientes.id) AND cuenta=0) as abono, (@abono-@credito) as saldo, @vence := (SELECT fecha_vence FROM pedidos WHERE id_cliente=clientes.id AND fecha_vence > $today ORDER BY pedidos.fecha_vence ASC LIMIT 1) as vence , (COALESCE(DATEDIFF(@vence,'$today 00:00:00'),0)) as dias")
        // ->where("saldo","<",0)
        ->having("saldo","<",0)
        ->orderBy("saldo","asc")
        ->get();

        return base64_encode(gzcompress(json_encode($clientes)));


    }

    function sendAllLotes() {
        ini_set('memory_limit', '4095M');

        $i = items_pedidos::whereNotNull("id_producto")->whereIn("id_pedido",pedidos::whereIn("id",pago_pedidos::where("tipo","<>",4)->select("id_pedido"))->select("id"))
        ->orderBy("id","desc")
        ->get(["id","id_pedido","cantidad","id_producto","created_at"]); 

        //$movs = movimientosInventariounitario::all();
        $inventariofull = inventario::all();
        $vinculos = [];

        $id_last_movs = movimientosInventariounitario::orderBy("id","desc")->first();
        $id_last_items = items_pedidos::orderBy("id","desc")->first();

        $data =  base64_encode(gzcompress(json_encode([
            "movs" => [],
            "vinculos" => $vinculos,
            "items" => $i,
            "inventariofull" => $inventariofull,
            "id_last_movs" => $id_last_movs->id,
            "id_last_items" => $id_last_items->id,

        ])));
        $codigo_origen = $this->getOrigen();

        $res = Http::post($this->path() . "/sendAllLotes", [
            "data"=>$data,
            "codigo_origen" => $codigo_origen,
        ]);


        if ($res->ok()) {
            return $res;
        }
        return $res;

    }


    function sendestadisticasVenta($id_last) {
        
        ini_set('memory_limit', '4095M');

        $i = items_pedidos::where("id",">",$id_last)->whereNotNull("id_producto")->whereIn("id_pedido",pedidos::whereIn("id",pago_pedidos::where("tipo","<>",4)->select("id_pedido"))->select("id"))
        ->orderBy("id","desc")
        ->get(["id","id_pedido","cantidad","id_producto","created_at"]); 
        return base64_encode(gzcompress(strval($i)));
    }

    function sendmovsinv($id_last) {
       
        $i = movimientosinventariounitario::where("id",">",$id_last)
        ->orderBy("id","desc")
        ->get();  
        //return [];
        return base64_encode(gzcompress(strval($i)));
    }
    function sendAllMovs()  {
        ini_set('memory_limit', '4095M');

        try {
            $codigo_origen = $this->getOrigen();
                
            $getLast = Http::get($this->path() . "/getLast", [
                "codigo_origen" => $codigo_origen,
            ]);
    
            if ($getLast->ok()) {
                $getLast = $getLast->json();
                if ($getLast==null) {
                    $id_last_movs = 0;
                }else{
                    $id_last_movs = $getLast["id_last_movs"]?$getLast["id_last_movs"]:0;
                }
                $data = [
                    "movsinventario" => $this->sendmovsinv($id_last_movs),
                    "codigo_origen" => $codigo_origen,
                ];
                $setAll = Http::post($this->path() . "/sendAllMovs", $data);
                //return $setAll;
                
                if (!$setAll->json()) {
                    return $setAll;
                }
                if ($setAll->ok()) {
                    return $setAll->json();
                }else{
                    return "ERROR: ".$setAll;
                }
                return $setAll;
                
            }
            return $getLast;
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    
    }
    

    function sendAllTest() {
        ini_set('memory_limit', '4095M');

        try {
            $codigo_origen = $this->getOrigen();
                
            $getLast = Http::get($this->path() . "/getLast", [
                "codigo_origen" => $codigo_origen,
            ]);
    
            if ($getLast->ok()) {
                $getLast = $getLast->json();
                if ($getLast==null) {
                    
                    $date_last_cierres = "2024-01-01";
                    $id_last_garantias = 0;
                    $id_last_fallas = 0;
                    $id_last_efec = 0;
                    $id_last_estadisticas = 0;
                    $id_last_movs = 0;
                }else{
                    $date_last_cierres = $getLast["date_last_cierres"]?$getLast["date_last_cierres"]:"2024-01-01";
                    $id_last_garantias = $getLast["id_last_garantias"]?$getLast["id_last_garantias"]:0;
                    $id_last_fallas = $getLast["id_last_fallas"]?$getLast["id_last_fallas"]:0;
                    $id_last_efec = $getLast["id_last_efec"]?$getLast["id_last_efec"]:0;
                    $id_last_estadisticas = $getLast["id_last_estadisticas"]?$getLast["id_last_estadisticas"]:0;
                    $id_last_movs = $getLast["id_last_movs"]?$getLast["id_last_movs"]:0;
                }
    
                $data = [

                    "numitemspedidos" => items_pedidos::whereNotNull("id_producto")->whereIn("id_pedido",pedidos::whereIn("id",pago_pedidos::where("tipo","<>",4)->select("id_pedido"))->select("id"))->get()->count(),
                    "sendInventarioCt" => $this->sendInventario(false,$date_last_cierres),
                    "sendGarantias" => $this->sendGarantias($id_last_garantias),
                    "sendFallas" => $this->sendFallas($id_last_fallas),
                    "setCierreFromSucursalToCentral" => $this->sendCierres($date_last_cierres),
                    "setEfecFromSucursalToCentral" => $this->sendEfec($id_last_efec),
                    "sendCreditos" => /* [],// */$this->sendCreditos(),
                    "sendestadisticasVenta" => /* [],// */$this->sendestadisticasVenta($id_last_estadisticas),
                    "movsinventario" => [],
                    "codigo_origen" => $codigo_origen,
                ];
                
                $setAll = Http::post($this->path() . "/setAll", $data);
                //return $setAll;
                
                if (!$setAll->json()) {
                    return $setAll;
                }
                
                if ($setAll->ok()) {
                    $this->sendAllMovs();
                    return $setAll->json();
                }else{
                    return "ERROR: ".$setAll;
                }
                return $setAll;
                
            }
            return $getLast;
        } catch (\Exception $e) {
            return $e->getMessage();
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
                    $id_last_estadisticas = 0;
                    $id_last_movs = 0;
                }else{
                    $id_last_garantias = $getLast["id_last_garantias"];
                    $id_last_fallas = $getLast["id_last_fallas"];
                    $date_last_cierres = $getLast["date_last_cierres"];
                    $id_last_efec = $getLast["id_last_efec"];
                    $id_last_estadisticas = $getLast["id_last_estadisticas"];
                    $id_last_movs = $getLast["id_last_movs"]?$getLast["id_last_movs"]:0;
                }

                $data = [
                    "numitemspedidos" => items_pedidos::whereNotNull("id_producto")->whereIn("id_pedido",pedidos::whereIn("id",pago_pedidos::where("tipo","<>",4)->select("id_pedido"))->select("id"))->get()->count(),
                    "sendInventarioCt" => $this->sendInventario(false,$date_last_cierres),
                    "sendGarantias" => $this->sendGarantias($id_last_garantias),
                    "sendFallas" => $this->sendFallas($id_last_fallas),
                    "setCierreFromSucursalToCentral" => $this->sendCierres($date_last_cierres),
                    "setEfecFromSucursalToCentral" => $this->sendEfec($id_last_efec),
                    "sendCreditos" => $this->sendCreditos(),
                    "sendestadisticasVenta" => $this->sendestadisticasVenta($id_last_estadisticas),
                    "movsinventario" => [],
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
                    $this->sendAllMovs();
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
            return $response;
        } catch (\Exception $e) {
            return Response::json(["msj" => "Error: " . $e->getMessage(), "estado" => false]);
        }
    }

    function getAlquileres()
    {
        try {
            $codigo_origen = $this->getOrigen();

            $response = Http::post($this->path() . "/getAlquileresSucursal", [
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