<?php

namespace App\Http\Controllers;

use App\Models\movimientos_caja;
use App\Models\gastos;
use Illuminate\Http\Request;
use Response;

class MovimientosCajaController extends Controller
{
    public function getMovimientosCaja(Request $req)
    {
        $today = $req->fecha;
        $mov = movimientos_caja::where("created_at","LIKE",$today."%")->orderBy("created_at","desc")->get();
        return $mov;
    }
    public function setMovimientoCaja(Request $req)
    {   

        try {
            (new PedidosController)->checkPedidoAuth(null,$req->fecha);

            $date = new \DateTime($req->fecha);
            $fecha = $date->getTimestamp();

            $mov = new movimientos_caja();

            $mov->descripcion = $req->descripcion;
            $mov->tipo = $req->tipo;
            $mov->categoria = $req->categoria;
            $mov->created_at = $fecha;
            $mov->monto = floatval($req->monto);
            $mov->id_vendedor = session("id_usuario");
            $mov->save();
            if ($mov->save()) {
                 if ($req->categoria==2 || $req->categoria==3) {
                    $gastos = new gastos;
                    $gastos->descripcion = $req->descripcion;
                    $gastos->categoria = $req->categoria;
                    $gastos->monto = floatval($req->monto);
                    $gastos->fecha = $req->fecha;
                    $gastos->id_mov_caja = $mov->id;
                    $gastos->save();
                } 
            }



            return Response::json(["msj"=>"¡Éxito al registrar movimiento!","estado"=>true]);
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
            
        }

    }

   public function delMovCaja(Request $req)
   {
        $mov = movimientos_caja::find($req->id);
        if ($mov) {
            try {
                $fecha_str = strtotime($mov->created_at);
                $fecha = date("Y-m-d",$fecha_str);
                (new PedidosController)->checkPedidoAuth(null,$fecha);
                $data = $mov;
                $cat = $data->categoria;

                switch ($data->categoria) {
                    case '1': 

                    $cat = "Vueltos";
                    break;
                    case '2': 

                    $cat = "Nomina";
                    break;
                    case '3': 

                    $cat = "Funcionamiento";
                    break;
                    case '4': 

                    $cat = "Pago a proveedores";
                    break;
                    case '5': 

                    $cat = "Otros";
                    break;
                    case '6': 

                    $cat = "Devolucion";
                    break;
                }
                (new InventarioController)->setMovimientoNotCliente(null,"","",$data->monto,"Eliminacion de Movimiento de caja");

                if ($mov->delete()) {
                    gastos::where("id_mov_caja",$req->id)->delete();
                }
                
                return Response::json(["msj"=>"¡Éxito al eliminar movimiento!","estado"=>true]);

                
            } catch (\Exception $e) {
                return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
                
            }
            // code...
        }

   }

}
