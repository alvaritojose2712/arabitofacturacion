<?php

namespace App\Http\Controllers;

use App\Models\items_factura;
use App\Models\inventario;
use Illuminate\Http\Request;
use Response;

class ItemsFacturaController extends Controller
{
    public function delItemFact(Request $req)
    {
        try {
            $id_producto = $req->id_producto;
            $id_factura = $req->id_factura;

            $items_factura = items_factura::where("id_factura",$id_factura)->where("id_producto",$id_producto)->first();
            if ($items_factura) {

                $inv = inventario::find($id_producto);
                $ctseter = $inv->cantidad - ($items_factura->cantidad);
    
                $descontar = (new InventarioController)->descontarInventario(
                    $id_producto,
                    $ctseter, 
    
                    $inv->cantidad, 
                    null, 
                    "delItemFact#".$id_factura
                );
    
                if ($descontar) {
                    $items_factura->delete();
                    return Response::json(["msj"=>"Éxito al eliminar","estado"=>true]);
                }
            }


            
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
            
        }
    }
}
