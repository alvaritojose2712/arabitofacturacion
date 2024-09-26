<?php

namespace App\Http\Controllers;

use App\Models\garantia;
use App\Models\inventario;
use Illuminate\Http\Request;
use Response;

class GarantiaController extends Controller
{
    function getGarantias(Request $req) {
        $qgarantia = $req->qgarantia;
        $garantiaorderCampo = $req->garantiaorderCampo;
        $garantiaorder = $req->garantiaorder;
        $garantiaEstado = $req->garantiaEstado;

        $data = garantia::when($qgarantia,function($q) use ($qgarantia){
            $q->whereIn("id_producto",inventario::where(function($q) use ($qgarantia){
                $q->orWhere("descripcion","LIKE","%$qgarantia%")
                ->orWhere("codigo_proveedor","LIKE","%$qgarantia%")
                ->orWhere("codigo_barras","LIKE","%$qgarantia%");
            })->select("id"));
        })
        ->get()
        ->groupBy(["id_producto"]); 
        
        $arr = [];
        foreach ($data as $id_producto => $e) {
            $g = garantia::where("id_producto",$id_producto);
             
            $sumpendiente = $g->sum("cantidad");
            $sumresuelta = $g->where("cantidad","<",0)->sum("cantidad");
            
            
           /*  $diaspendiente = $g->where("cantidad",">",0)->avg("dias");
            $diasresuelta = $g->where("cantidad","<",0)->avg("dias"); */
            array_push($arr,[
                "id_producto" =>$id_producto,
                "producto" =>inventario::find($id_producto),
                "sumpendiente" => $sumpendiente,
                "sumresuelta" => $sumresuelta,
                /* "diaspendiente" => $diaspendiente,
                "diasresuelta" => $diasresuelta, */
            ]);
        }

        array_multisort(array_column($arr, $garantiaorderCampo), $garantiaorder=="desc"? SORT_DESC: SORT_ASC, $arr);


        return $arr;
        
    }
    function setSalidaGarantias(Request $req) {

        try {
            $id = $req->id;
            $cantidad = floatval($req->cantidad);
            $motivo = $req->motivo;
    
            $pedido_garantia = garantia::where("id_producto",$id)->orderBy("id","desc")->first();
            $id_pedido = $pedido_garantia?$pedido_garantia->id_pedido:null;
            garantia::updateOrCreate([
                "id" => null
            ],[
                "id_producto" => $id,
                "id_pedido" => $id_pedido,
                "cantidad" => ($cantidad*-1),
                "motivo" => $motivo,
                "numfactgarantia" => $id_pedido,
            ]);
            return ["estado"=>true,"msj"=>"Éxito al SACAR GARANTIA"];
        } catch (\Exception $e) {
            return ["estado"=>false,"msj"=>"ERROR: ".$e->getMessage()];
        }
    }
}
