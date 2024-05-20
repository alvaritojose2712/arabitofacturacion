<?php

namespace App\Http\Controllers;

use App\Models\inventarios_novedades;

use Illuminate\Http\Request;
use Response;

class InventariosNovedadesController extends Controller
{
    function getInventarioNovedades(Request $req) {
        return inventarios_novedades::with("producto")
        ->orderBy("updated_at","desc")
        ->get();
    }
    function resolveInventarioNovedades(Request $req) {
        $id = $req->id;
        return (new sendCentral)->resolveNovedadCentral($id);
    }
    function sendInventarioNovedades(Request $req) {
        $id = $req->id;
        return (new sendCentral)->sendNovedadCentral($id);
    }
    function delInventarioNovedades(Request $req) {
        $id = $req->id;
        return inventarios_novedades::find($id)->delete();
    }
}
