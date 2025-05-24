<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Response;

class login
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {

        if (session('tipo_usuario') == 7) {
            switch ($request->route()->uri) {
                case 'guardarNuevoProductoLote':
                    return $next($request);
                break;
                case 'getmovientoinventariounitario':
                    return $next($request);
                break;
                case 'sincInventario':
                    return $next($request);
                break;
                case 'reqpedidos':
                    return $next($request);
                break;
                case 'runTareaCentral':
                    return $next($request);
                break;
                case 'getTareasCentral':
                    return $next($request);
                break;
                case 'checkPedidosCentral':
                    return $next($request);
                break;
                case 'reqMipedidos':
                    return $next($request);
                break;
                case 'getSucursales':
                    return $next($request);
                break;
                case 'settransferenciaDici':
                    return $next($request);
                break;
            }
        }
        $se = session('tipo_usuario');

        if ($se == 1 || 
        $se == 2 ||
        $se == 3 ||
        $se == 4) {
            return $next($request);
        }else{
            return Response::json(["msj"=>"Error: Sin permisos. Debe volver a iniciar sesión","estado"=>false]);

        }
    }
}
