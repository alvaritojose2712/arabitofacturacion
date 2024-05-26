<?php

namespace App\Http\Controllers;

use App\Models\pedidos;
use App\Models\retenciones;
use App\Http\Requests\StoreretencionesRequest;
use App\Http\Requests\UpdateretencionesRequest;
use Illuminate\Http\Request;
use Response;

class RetencionesController extends Controller
{
    function addRetencionesPago(Request $req) {
        $id_pedido = $req->id_pedido;
        $monto = $req->monto;
        $descripcion = $req->descripcion;
        $num = $req->num;

        $p = pedidos::find($id_pedido);
        if ($p) {
            if ($p->id_cliente!=1) {
                $r = retenciones::updateOrCreate(["id"=>null],[
                    "id_pedido" => $id_pedido,
                    "monto" => $monto,
                    "descripcion" => $descripcion,
                    "num" => $num,
                ]);
                if ($r) {
                    return Response::json(["estado"=>true,"msj"=>"Retención Agregada: #".$id_pedido]);
                }
            }else{
                return Response::json(["estado"=>false,"msj"=>"Error: Debe personalizar Factura."]);

            }
        }
    }
    function delRetencionPago(Request $req) {
        $id = $req->id;
        $r = retenciones::find($id);

        if ($r) {
            $p = pedidos::find($r->id_pedido);
            if (!$p->estado) {
                $r->delete();
                return Response::json(["estado"=>true,"msj"=>"Retención eliminada"]);
            }else{
                return Response::json(["estado"=>false,"msj"=>"Error: Pedido Procesado"]);
            }
        }
    }
}
