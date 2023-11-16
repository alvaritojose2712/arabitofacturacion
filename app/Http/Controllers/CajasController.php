<?php

namespace App\Http\Controllers;

use App\Models\cajas;
use Illuminate\Http\Request;

use Response;

class CajasController extends Controller
{
    function getBalance($tipo){
        return cajas::where("tipo",$tipo)->orderBy("id","desc")->first(["balance"])->balance;
    }
    public function getControlEfec(Request $req) {
        $controlefecQ = $req->controlefecQ;
        $controlefecQDesde = $req->controlefecQDesde;
        $controlefecQHasta = $req->controlefecQHasta;
        $controlefecQCategoria = $req->controlefecQCategoria;

        $controlefecSelectGeneral = $req->controlefecSelectGeneral;

        $data = cajas::where("tipo",$controlefecSelectGeneral)
        ->when($controlefecQ,function($q) use ($controlefecQ){
            $q->orWhere("concepto",$controlefecQ);
            $q->orWhere("monto",$controlefecQ);
        })
        ->when($controlefecQCategoria,function($q) use ($controlefecQCategoria) {
            $q->where("categoria",$controlefecQCategoria);
        })
        ->whereBetween("created_at",[$controlefecQDesde." 00:00:00",$controlefecQHasta." 23:59:59"])
        ->orderBy("id","desc")
        ->get();

        return Response::json([
            "data" => $data,
        ]);
    }
    public function setControlEfec(Request $req) {

        try {
            $controlefecSelectGeneral = $req->controlefecSelectGeneral;
            $controlefecSelectUnitario = $req->controlefecSelectUnitario;
    
            $balance = $this->getBalance($controlefecSelectGeneral);

            $concepto = $req->concepto;
            $categoria = $req->categoria;
            $monto = $req->monto*-1;
            $balance = $balance+($monto);
    
            $cajas = cajas::updateOrCreate([
                "id" => $controlefecSelectUnitario
            ],[
                "concepto" => $concepto,
                "categoria" => $categoria,
                "monto" => $monto,
                "balance" => $balance,
                "tipo" => $controlefecSelectGeneral,
            ]);
    
            if ($cajas) {
                return Response::json(["msj"=>"Éxito","estado"=>true]);
            }
        } catch (\Exception $e) {
            return Response::json(["msj"=>$e->getMessage(), "estado"=>false]);
        }
    }
}
