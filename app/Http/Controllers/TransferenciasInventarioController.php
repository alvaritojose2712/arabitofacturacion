<?php

namespace App\Http\Controllers;

use App\Models\transferencias_inventario;
use App\Models\transferencias_inventario_items;
use App\Http\Requests\Storetransferencias_inventarioRequest;
use App\Http\Requests\Updatetransferencias_inventarioRequest;

class TransferenciasInventarioController extends Controller
{
    function checkPendingTransfers($id_producto) {
        /* if($id_producto){
            $pendingTransfers = transferencias_inventario::where('estado', 1) //PENDIENTE
            ->whereIn("id",transferencias_inventario_items::where("id_producto",$id_producto)->where("cantidad",">",0)->select("id_transferencia"))
            ->exists();

            if ($pendingTransfers) {
                throw new \Exception("No se puede modificar el inventario mientras existan transferencias pendientes");
            }
        } */
    }

    function sumPendingTransfers($id_producto) {
      /*   if($id_producto){
            $pendingTransfers = transferencias_inventario_items::where("id_producto",$id_producto)
            ->where("cantidad",">",0)
            ->whereIn("id_transferencia",transferencias_inventario::where('estado', 1)->select("id"))
            ->sum("cantidad");
            return $pendingTransfers;
        } */
        return 0;
    }
}
