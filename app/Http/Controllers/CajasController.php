<?php

namespace App\Http\Controllers;

use App\Models\cajas;
use App\Models\catcajas;
use Illuminate\Http\Request;

use Response;

class CajasController extends Controller
{
    function getBalance($tipo,$moneda){
        $b = cajas::where("tipo", $tipo)->orderBy("id", "desc")->first([$moneda]);
        if ($b) {
            return $b[$moneda];
        }
        return 0;
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

    function setCajaFun($arr) {

        $today = (new PedidosController)->today();

        $check = cajas::where("tipo",$arr["tipo"])->where("fecha",$today)->orderBy("id","desc")->first();
        
        if ($arr["categoria"]==1 || $arr["categoria"]==2) {

            if ($check) {
                if (($check->categoria==1 || $check->categoria==2)){
                    cajas::where("fecha",$today)
                    ->where("tipo",$arr["tipo"])
                    ->where("categoria",$arr["categoria"])
                    ->delete();
                }
            }

            
            //Viene del cierre
            $searcharr = ["id"=>null];
        }else{

            if ($check) {
                if (($check->categoria==1 || $check->categoria==2)){
                    return "Error: Cierre Guardado";
                }
            }
            
            $searcharr = ["id"=>null];
            
        }

        $montodolar = isset($arr["montodolar"])?$arr["montodolar"]:0;
        $montopeso = isset($arr["montopeso"])?$arr["montopeso"]:0;
        $montobs = isset($arr["montobs"])?$arr["montobs"]:0;
        $montoeuro = isset($arr["montoeuro"])?$arr["montoeuro"]:0;
        
        $dolarbalance =  $this->getBalance($arr["tipo"], "dolarbalance")+$montodolar;
        $pesobalance =  $this->getBalance($arr["tipo"], "pesobalance")+$montopeso;
        $bsbalance =  $this->getBalance($arr["tipo"], "bsbalance")+$montobs;
        $eurobalance =  $this->getBalance($arr["tipo"], "eurobalance")+$montoeuro;

        //echo $montodolar."<br>";


        $arr_insert = [

            "responsable" => $arr["responsable"],
            "asignar" => $arr["asignar"],

            "concepto" => $arr["concepto"],
            "categoria" => $arr["categoria"],
            "tipo" => $arr["tipo"],
            "fecha" => $today,

            "montodolar" => $montodolar,
            "montopeso" => $montopeso,
            "dolarbalance" => $dolarbalance,
            "pesobalance" => $pesobalance,
            "montobs" => $montobs,
            "bsbalance" => $bsbalance,

            "montoeuro" => $montoeuro,
            "eurobalance" => $eurobalance,
        ] ; 
        
        $cc =  cajas::updateOrCreate($searcharr,$arr_insert);

        if ($cc) {
            return "Éxito";
        }
    }
    public function setControlEfec(Request $req) {
        $cat_adic= catcajas::where("nombre","LIKE","%EFECTIVO ADICIONAL%")->get("indice")->map(function($q){return $q->indice;})->toArray();

        
        try {
            $controlefecSelectGeneral = $req->controlefecSelectGeneral;
            $controlefecSelectUnitario = $req->controlefecSelectUnitario;
            $concepto = $req->concepto;
            $categoria = $req->categoria;

            $controlefecResponsable = $req->controlefecResponsable;
            $controlefecAsignar = $req->controlefecAsignar;
            
            $montodolar = 0;
            $montopeso = 0;
            $montobs = 0;
            $montoeuro = 0;

            $factor = (in_array($categoria, $cat_adic))? 1: -1;
            switch ($req->controlefecNewMontoMoneda) {
                case 'dolar':
                    $montodolar = $req->monto*$factor;
                break;

                case 'peso':
                    $montopeso = $req->monto*$factor;
                break;

                case 'bs':
                    $montobs = $req->monto*$factor;
                break;

                case 'euro':
                    $montoeuro = $req->monto*$factor;
                break;
            }


    
            $cajas = $this->setCajaFun([
                "id" => $controlefecSelectUnitario,
                "concepto" => $concepto,
                "categoria" => $categoria,
                "montodolar" => $montodolar,
                "montopeso" => $montopeso,
                "montobs" => $montobs,
                "montoeuro" => $montoeuro,
                "tipo" => $controlefecSelectGeneral,
                "responsable" => $controlefecResponsable,
                "asignar" => $controlefecAsignar,
            ]);
    
            if ($cajas) {
                return Response::json(["msj"=>$cajas,"estado"=>true]);
            }
        } catch (\Exception $e) {
            return Response::json(["msj"=>$e->getMessage(), "estado"=>false]);
        }
    }
    function delCajaFun($id) {
        $check_last = cajas::orderBy("id","desc")->first("id");
        if ($check_last->id == $id) {
            
            $check_notingreso = cajas::find($id);
            if ($check_notingreso->categoria != 1 && $check_notingreso->categoria != 2) {
                cajas::find($id)->delete();
                echo "Exito";
            }else{
                return "Es un ingreso";
            }
        }else{
            return "No es el ultimo";
        }
    }

    function delCaja(Request $req) {
        return $this->delCajaFun($req->id);
    }
}
