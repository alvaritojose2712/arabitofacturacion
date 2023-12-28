<?php

namespace App\Http\Controllers;

use App\Models\cajas;
use App\Models\catcajas;
use Illuminate\Http\Request;

use Response;

class CajasController extends Controller
{
    function getBalance($tipo,$moneda){
        $b = cajas::where("tipo", $tipo)->where("estatus",1)->orderBy("id", "desc")->first([$moneda]);
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

        $cat_ingreso_desde_cierre= catcajas::where("nombre","LIKE","%INGRESO DESDE CIERRE%")->get("indice")->map(function($q){return $q->indice;})->toArray();

        if (in_array($arr["categoria"], $cat_ingreso_desde_cierre)) {

            if ($check) {
                if (in_array($check->categoria, $cat_ingreso_desde_cierre)){
                    cajas::where("fecha",$today)
                    ->where("tipo",$arr["tipo"])
                    ->where("categoria",$arr["categoria"])
                    ->delete();
                }
            }
            //Viene del cierre
        }else{
            if ($check) {
                if (in_array($check->categoria, $cat_ingreso_desde_cierre)){
                    return "Error: Cierre Guardado";
                }
            }
        }

        $montodolar = isset($arr["montodolar"])?$arr["montodolar"]:0;
        $montopeso = isset($arr["montopeso"])?$arr["montopeso"]:0;
        $montobs = isset($arr["montobs"])?$arr["montobs"]:0;
        $montoeuro = isset($arr["montoeuro"])?$arr["montoeuro"]:0;
        
        $dolarbalance =  $this->getBalance($arr["tipo"], "dolarbalance")+$montodolar;
        $pesobalance =  $this->getBalance($arr["tipo"], "pesobalance")+$montopeso;
        $bsbalance =  $this->getBalance($arr["tipo"], "bsbalance")+$montobs;
        $eurobalance =  $this->getBalance($arr["tipo"], "eurobalance")+$montoeuro;


        if ($arr["estatus"]==0) {
            $arr_insert = [
                "concepto" => $arr["concepto"],
                "categoria" => $arr["categoria"],
                "tipo" => $arr["tipo"],
                "fecha" => $today,
    
                "montodolar" => $montodolar,
                "montopeso" => $montopeso,
                "montobs" => $montobs,
                "montoeuro" => $montoeuro,
                "dolarbalance" => 0,
                "pesobalance" => 0,
                "bsbalance" => 0,
                "eurobalance" => 0,
    
                "estatus" => 0
            ] ;
           
        }else{

            $arr_insert = [
                "concepto" => $arr["concepto"],
                "categoria" => $arr["categoria"],
                "tipo" => $arr["tipo"],
                "fecha" => $today,
    
                "montodolar" => $montodolar,
                "montopeso" => $montopeso,
                "montobs" => $montobs,
                "montoeuro" => $montoeuro,
                
                "dolarbalance" => $dolarbalance,
                "pesobalance" => $pesobalance,
                "bsbalance" => $bsbalance,
                "eurobalance" => $eurobalance,
                "estatus" => 1
            ] ; 
        }

        $cc =  cajas::updateOrCreate(["id"=>$arr["id"]],$arr_insert);
        if ($cc) {

            if ($arr["estatus"]==0) {
                $arr_insert["idinsucursal"] = $cc->id;

                $arr_insert["dolarbalance"] = $dolarbalance;
                $arr_insert["pesobalance"] = $pesobalance;
                $arr_insert["bsbalance"] = $bsbalance;
                $arr_insert["eurobalance"] = $eurobalance;

                return (new sendCentral)->setPermisoCajas($arr_insert);

            }else{
                return "Éxito";
            }
        }
    }
    public function setControlEfec(Request $req) {
        $cat_efectivo_adicional= catcajas::where("nombre","LIKE","%EFECTIVO ADICIONAL%")->get("indice")->map(function($q){return $q->indice;})->toArray();
        
        $cat_tras_fuerte= catcajas::where("nombre","LIKE","%CAJA FUERTE: TRASPASO A CAJA CHICA%")->get("indice")->map(function($q){return $q->indice;})->toArray();
        $cat_tras_chica= catcajas::where("nombre","LIKE","%CAJA CHICA: TRASPASO A CAJA FUERTE%")->get("indice")->map(function($q){return $q->indice;})->toArray();
        

        try {
            $controlefecSelectGeneral = $req->controlefecSelectGeneral;
            $concepto = $req->concepto;
            $categoria = $req->categoria;

            $montodolar = 0;
            $montopeso = 0;
            $montobs = 0;
            $montoeuro = 0;

            
            $factor = -1;
            if (in_array($categoria, $cat_efectivo_adicional)) {$factor = 1;}

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
                "id" => null,
                "concepto" => $concepto,
                "categoria" => $categoria,
                "montodolar" => $montodolar,
                "montopeso" => $montopeso,
                "montobs" => $montobs,
                "montoeuro" => $montoeuro,
                "tipo" => $controlefecSelectGeneral,
                "estatus" => $controlefecSelectGeneral==0? 1: 0
            ]);

            if (in_array($categoria, $cat_tras_fuerte)) {
                $adicional= catcajas::where("nombre","LIKE","%EFECTIVO ADICIONAL%")->where("tipo",0)->first();
                $cajas = $this->setCajaFun([
                    "id" => null,
                    "concepto" => $concepto,
                    "categoria" => $adicional->indice,
                    "montodolar" => $montodolar*-1,
                    "montopeso" => $montopeso*-1,
                    "montobs" => $montobs*-1,
                    "montoeuro" => $montoeuro*-1,
                    "tipo" => 0,
                    "estatus" => 0,
                ]);
            }

            if (in_array($categoria, $cat_tras_chica)) {
                $adicional= catcajas::where("nombre","LIKE","%EFECTIVO ADICIONAL%")->where("tipo",1)->first();
                $cajas = $this->setCajaFun([
                    "id" => null,
                    "concepto" => $concepto,
                    "categoria" => $adicional->indice,
                    "montodolar" => $montodolar*-1,
                    "montopeso" => $montopeso*-1,
                    "montobs" => $montobs*-1,
                    "montoeuro" => $montoeuro*-1,
                    "tipo" => 1,
                    "estatus" => 0,
                ]);
            }
    
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
