<?php

namespace App\Http\Controllers;

use App\Models\moneda;
use Illuminate\Http\Request;
use Response;
use Session;

use Illuminate\Support\Facades\Cache;
class MonedaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getMoneda(Request $req)
    {
        $mon = (new PedidosController)->get_moneda();
        return Response::json(["dolar"=>$mon["bs"],"peso"=>$mon["cop"]]);
    }
    public function setMoneda(Request $req)
    {
        moneda::updateOrCreate(["tipo"=>$req->tipo], [
            "tipo"=>$req->tipo,
            "valor"=>$req->valor
        ]);

        // Clear all related caches
        Cache::forget('bs');
        Cache::forget('cop');
        Cache::forget('moneda_rates_' . md5($req->valor));
        
        return Response::json(["msj" => "Moneda actualizada exitosamente", "estado" => true]);
    }

    
    
    
}
