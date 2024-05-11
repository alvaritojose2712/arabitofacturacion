<?php

namespace App\Http\Controllers;

use App\Models\tareaslocal;
use Illuminate\Http\Request;
use Response;


class TareaslocalController extends Controller
{
    public function createTareaLocal($arr)
    {
        $id_usuario = session("id_usuario");
        return tareaslocal::updateOrCreate([
            "id_usuario"=> $id_usuario,
            "id_pedido"=> $arr["id_pedido"],
            "tipo"=> $arr["tipo"],
        ],[
            "valoraprobado" => $arr["valoraprobado"],
            "estado" => 0,
            "descripcion"=> $arr["descripcion"],
            "created_at"=> date("Y-m-d H:i:s"),
        ]);
    }

    public function getTareasLocal(Request $req)
    {
        $fecha = $req->fecha;
        return tareaslocal::with("usuario")
        ->when($fecha,function($q) use ($fecha){
            $q->where("created_at","LIKE",$fecha."%");
        })
        ->orderBy("estado","asc")
        ->orderBy("created_at","desc")->get();
    }
    
    public function checkIsResolveTarea($arr)
    {
        $id_usuario = session("id_usuario");

        $t = tareaslocal::where("id_usuario",$id_usuario)
        ->where("id_pedido",$arr["id_pedido"])
        ->where("tipo",$arr["tipo"])
        ->first();
        $permiso = false;
        $valoraprobado = 0;
        if ($t) {
            if($t->estado){
                $permiso = true;
                $valoraprobado = $t->valoraprobado;
                tareaslocal::find($t->id)->delete();
            };
        }
        

        return [
            "permiso" => $permiso, 
            "valoraprobado" => $valoraprobado, 
        ];
    }

    public function resolverTareaLocal(Request $req)
    {

        if ($req->tipo=="aprobar") {
            $obj = tareaslocal::find($req->id);
            $obj->estado = 1;
            $obj->save();
        }else{
            $obj = tareaslocal::find($req->id);
            $obj->delete();

        }
    }

    public function getPermisoCierre(Request $req)
    {
        $id_usuario = session("id_usuario");

        $t = tareaslocal::where("id_usuario",$id_usuario)
        ->whereNull("id_pedido")
        ->where("tipo","cierre")
        ->first();

        if ($t) {
            if ($t->estado) {
                tareaslocal::find($t->id)->delete();
                return Response::json(["msj"=>"APROBADO","estado"=>true]);
            }
            return Response::json(["id_tarea"=>$t->id, "msj"=>"RECHAZADO","estado"=>false]);
        }else{
            $nuevatarea = $this->createTareaLocal([
                "id_pedido" =>  null,
                "valoraprobado" => 0,
                "tipo" => "cierre",
                "descripcion" => "Cerrar caja",
            ]);
            if ($nuevatarea) {
                return Response::json(["id_tarea"=>$nuevatarea->id,"msj"=>"Debe esperar aprobacion del Administrador","estado"=>false]);
            }
        }
    }
}
