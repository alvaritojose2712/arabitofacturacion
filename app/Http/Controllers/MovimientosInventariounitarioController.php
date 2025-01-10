<?php

namespace App\Http\Controllers;

use App\Models\movimientosInventariounitario;
use Illuminate\Http\Request;


class MovimientosInventariounitarioController extends Controller
{
    public function getmovientoinventariounitario(Request $req)
    {
        

        $id_producto = $req->id;
        $fecha1modalhistoricoproducto = $req->fecha1modalhistoricoproducto?$req->fecha1modalhistoricoproducto:date("Y-m-d");
        $fecha2modalhistoricoproducto = $req->fecha2modalhistoricoproducto?$req->fecha2modalhistoricoproducto:date("Y-m-d");
        $usuariomodalhistoricoproducto = $req->usuariomodalhistoricoproducto;

        return movimientosInventariounitario::with(["usuario"=>function($q){
            $q->select(["usuario","id"]);
        }])
        ->where("id_producto",$id_producto)
        ->whereBetween("created_at",["$fecha1modalhistoricoproducto 00:00:01","$fecha2modalhistoricoproducto 23:59:59"])
        ->when(!empty($usuariomodalhistoricoproducto),function($q) use ($usuariomodalhistoricoproducto){
            $q->where("id_usuario", $usuariomodalhistoricoproducto);
        })
        ->orderBy("created_at","desc")
        ->orderBy("id","desc")
        ->get();
    }

    public function setNewCtMov($arr)
    {
        
        $id_pedido = isset($arr["id_pedido"])?$arr["id_pedido"]:null;
        $id_producto = $arr["id_producto"];
        $cantidadafter = $arr["cantidadafter"];
        $origen = $arr["origen"];
        //ct1 cantidad antes
        //ct2 cantidad despues
        $resta = $arr["cantidadafter"]-$arr["ct1"];
        $cantidad = $resta;
        
        if ($cantidad!=0) {
            $id_usuario = session("id_usuario");
               
            $mov = new movimientosInventariounitario;
            
            $mov->id_producto = $id_producto;
            $mov->cantidad = $cantidad;
            $mov->cantidadafter = $cantidadafter;
            $mov->origen = $origen;
            $mov->id_usuario = $id_usuario;
            $mov->id_pedido = $id_pedido;

            $mov->save();
            
        }
        
        

        
    }
}
