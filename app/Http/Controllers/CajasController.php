<?php

namespace App\Http\Controllers;

use App\Models\cajas;
use App\Models\catcajas;
use Illuminate\Http\Request;

use Response;
use DB;

class CajasController extends Controller
{
    function getBalance($tipo,$moneda){
        $b = cajas::where("tipo", $tipo)->where("estatus",1)->orderBy("id", "desc")->first([$moneda]);
        if ($b) {
            return $b[$moneda];
        }
        return 0;
    }

    function ajustarbalancecajas($tipo) {
        $today = (new PedidosController)->today();

        if ($tipo==1) {
            $inicial = cajas::where("concepto","INGRESO DESDE CIERRE")->where("tipo",$tipo)->where("fecha","<>",$today)->orderBy("id","desc")->first();
        }else{
            $inicial = cajas::where("tipo",$tipo)->orderBy("id","asc")->first();
            if ($inicial->count()==1) {
                $inicial = null;
            }
        }
        //print_r($inicial);
        
        $inicial_dolarbalance = $inicial? $inicial->dolarbalance: 0;
        $inicial_bsbalance = $inicial? $inicial->bsbalance: 0;
        $inicial_pesobalance = $inicial? $inicial->pesobalance: 0;
        $inicial_eurobalance = $inicial? $inicial->eurobalance: 0;
        $ajustarlist = cajas::where("id",">",$inicial? $inicial->id: 0)->where("tipo",$tipo)->where("estatus",1)->orderBy("id","asc")->get();
        
        $summontodolar = $inicial_dolarbalance;
        $summontobs = $inicial_bsbalance;
        $summontopeso = $inicial_pesobalance;
        $summontoeuro = $inicial_eurobalance;


        foreach ($ajustarlist as $i => $e) {
            $ajustar = cajas::find($e->id);
            
            $summontodolar += $e->montodolar;
            $summontobs += $e->montobs;
            $summontopeso += $e->montopeso;
            $summontoeuro += $e->montoeuro;

            if ($e->montodolar) {
                $ajustar->dolarbalance = $summontodolar;
            }
            if ($e->montobs) {
                $ajustar->bsbalance = $summontobs;
            }
            if ($e->montopeso) {
                $ajustar->pesobalance = $summontopeso;
            }
            if ($e->montoeuro) {
                $ajustar->eurobalance = $summontoeuro;
            }
            $ajustar->save();
        }
        return $inicial;

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
        
        DB::beginTransaction();
        try {
            $today = (new PedidosController)->today();
            $check = cajas::where("tipo",1)->where("fecha",$today)->orderBy("id","desc")->first();
            $cat_ingreso_desde_cierre= 26;

            if ($arr["tipo"]==0) {
                $checkStatus = cajas::where("tipo",$arr["tipo"])->orderBy("id","desc")->first();
                if ($checkStatus) {
                    if ($arr["estatus"]==1 && $checkStatus->estatus==0 && $arr["id"]==null) {
                        return "Error: Hay pendientes.";
                    }
                }
            }

            if ($arr["categoria"] == $cat_ingreso_desde_cierre) {

                if ($check) {
                    if ($check->categoria == $cat_ingreso_desde_cierre){
                        cajas::where("fecha",$today)
                        ->where("tipo",$arr["tipo"])
                        ->where("categoria",$arr["categoria"])
                        ->delete();
                    }
                }
                //Viene del cierre
            }else{
                if ($check) {
                    if ($check->categoria == $cat_ingreso_desde_cierre){
                        return "Error: Cierre Guardado";
                    }
                }
            }

            $montodolar = isset($arr["montodolar"])?$arr["montodolar"]:0;
            $montopeso = isset($arr["montopeso"])?$arr["montopeso"]:0;
            $montobs = isset($arr["montobs"])?$arr["montobs"]:0;
            $montoeuro = isset($arr["montoeuro"])?$arr["montoeuro"]:0;

            $id_sucursal_destino = isset($arr["id_sucursal_destino"])?$arr["id_sucursal_destino"]:null;
            $ifforcentral = isset($arr["ifforcentral"])?$arr["ifforcentral"]:false;
            
            $check_dolarbalance =  $this->getBalance($arr["tipo"], "dolarbalance");
            $check_pesobalance =  $this->getBalance($arr["tipo"], "pesobalance");
            $check_bsbalance =  $this->getBalance($arr["tipo"], "bsbalance");
            $check_eurobalance =  $this->getBalance($arr["tipo"], "eurobalance");
            
            if (@$arr["montodolar"]<0) {
                if (abs($arr["montodolar"])>$check_dolarbalance) {
                    return "Fondos insuficientes DOLAR";
                }
            }
            if (@$arr["montopeso"]<0) {
                if (abs($arr["montopeso"])>$check_pesobalance) {
                    return "Fondos insuficientes PESO";
                }
            }
            if (@$arr["montobs"]<0) {
                if (abs($arr["montobs"])>$check_bsbalance) {
                    return "Fondos insuficientes BS";
                }
            }
            if (@$arr["montoeuro"]<0) {
                if (abs($arr["montoeuro"])>$check_eurobalance) {
                    return "Fondos insuficientes EURO";
                }
            }

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
        
                    "estatus" => 0,

                ] ;

                if ($ifforcentral && $id_sucursal_destino) {
                    if (!$id_sucursal_destino) {
                        return "Seleccione un DESTINO";
                    }
                    $arr_insert["id_sucursal_destino"] = $id_sucursal_destino;
                }
            
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
                    
                    "dolarbalance" => 0,
                    "pesobalance" => 0,
                    "bsbalance" => 0,
                    "eurobalance" => 0,
                    "estatus" => 1
                ] ; 
            }
            $arrbusqueda = [];
            if (isset($arr["idincentralrecepcion"])) {
                $arrbusqueda = ["idincentralrecepcion"=>$arr["idincentralrecepcion"]];
            }else{
                $arrbusqueda = ["id"=>$arr["id"]];
            }
            $cc =  cajas::updateOrCreate($arrbusqueda,$arr_insert);
            if ($cc) {
                $this->ajustarbalancecajas($arr["tipo"]);

                if ($arr["estatus"]==0) {
                    $arr_insert["idinsucursal"] = $cc->id;

                    $arr_insert["dolarbalance"] = 0;
                    $arr_insert["pesobalance"] = 0;
                    $arr_insert["bsbalance"] = 0;
                    $arr_insert["eurobalance"] = 0;

                    try {
                        $res = (new sendCentral)->setPermisoCajas($arr_insert, $cc->id);
                        if ($res["estado"]===true) {
                            DB::commit();
                            return $res["msj"];
                        }else{
                              
                            return Response::json(["estado"=>false,"msj"=>"No se envió a central. Siga intentando..."]);
                        }
                    } catch (\Exception $e) {
                          
                        return Response::json(["estado"=>false,"msj"=>"No se envió a central. Siga intentando..."]);
                    }

                }else{
                    DB::commit();
                    return "Éxito";
                }

            }
            
        } catch (\Exception $e) {
            DB::rollBack();
            return ["estado"=>false,"msj"=>"Error: ".$e->getMessage()];
        }


    }
    function checkDelMovCajaFun($caja) {
        if ($caja->idincentralrecepcion) {
            $m = (new sendCentral)->checkDelMovCajaCentral($caja->idincentralrecepcion);
            if ($m===true) {
                return true;
            }else{
                return $m;
            }
           
        }else{
            return true;
        } 
    }
    function checkDelMovCaja($type,$val) {
        switch ($type) {
            case 'estatus':
                $c = cajas::where("estatus",$val)->get();
                foreach ($c as $i => $caja) {
                    if($caja->id_sucursal_destino || $caja->id_sucursal_emisora || $caja->idincentralrecepcion){
                        return $this->checkDelMovCajaFun($caja);
                    }
                }


                break;
            case 'id':
                $c = cajas::find($val);
                if($c->id_sucursal_destino || $c->id_sucursal_emisora || $c->idincentralrecepcion){
                    return $this->checkDelMovCajaFun($c);
                }
                break;
            
        }
        return true;
    }
    function reversarMovPendientes() {
        $check = $this->checkDelMovCaja("estatus",0); 
        if ($check===true) {
            cajas::where("estatus",0)->delete();
        }else{
            return $check;
        }
    }

    public function setControlEfec(Request $req) {
        $cat_efectivo_adicional= [27,1,28,46,43];
        
        try {
            $controlefecSelectGeneral = $req->controlefecSelectGeneral;
            $concepto = $req->concepto;
            $categoria = $req->categoria;
            
            $sendCentralData = $req->sendCentralData;
            $transferirpedidoa = $req->transferirpedidoa;
            
            $montodolar = 0;
            $montopeso = 0;
            $montobs = 0;
            $montoeuro = 0;
            
            $cat_trans_trabajador = 43;
            if ($sendCentralData) {
                if ($categoria!=$cat_trans_trabajador) {
                    return Response::json(["msj"=>"Error: Solo puede transferir TRANSFERENCIA TRABAJADOR","estado"=>false]);
                }
            }

            
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
                "estatus" => 0,
                "id_sucursal_destino" => $transferirpedidoa,
                "ifforcentral" => $sendCentralData
            ]);
           
    
            if ($cajas) {
                return Response::json(["msj"=>$cajas,"estado"=>true]);
            }
        } catch (\Exception $e) {
            return Response::json(["msj"=>$e->getMessage(), "estado"=>false]);
        }
    }
    function delCajaFun($id) {
        $check_notingreso = cajas::find($id);
        $check_last = cajas::orderBy("id","desc")->where("tipo",$check_notingreso->tipo)->first("id");
        if ($check_last->id == $id) {
            
            $check = (new sendCentral)->checkDelMovCaja($id);
            if ($check) {
                if (isset($check["estado"])) {
                    if ($check["estado"]===true && $check["id"]===$id) {
                        if (cajas::find($id)->delete()) {
                            $delref = cajas::where("concepto","LIKE", "%REF:$id%");
                            if ($delref) {
                                $delref->delete();
                            }
                            return "Eliminado con Éxito $id";
                        }
                    }
                }
            }
            
            if ($check_notingreso->categoria != 1 && $check_notingreso->categoria != 2) {
                $check = $this->checkDelMovCaja("id",$id); 
                if ($check===true) {
                    cajas::find($id)->delete();
                }else{
                    return ($check);
                }
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
