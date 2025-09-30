<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Response;

class AuthenticateUser
{
    /**
     * Matriz única con todas las rutas permitidas para DICI (tipo_usuario = 7)
     * 
     * Esta matriz centraliza todas las rutas que puede acceder el usuario DICI
     * tanto en middleware 'login' como en middleware 'admin'.
     * 
     * Para agregar una nueva ruta para DICI, simplemente agregarla a esta matriz.
     */
    private const DICI_ALLOWED_ROUTES = [
        // Tareas y sincronización
        'resolverTareaLocal',
        'getTareasLocal',
        'runTareaCentral',
        'getTareasCentral',
        'checkPedidosCentral',
        'sincInventario',
        
        // Inventario y productos
        'guardarNuevoProductoLote',
        'getmovientoinventariounitario',
        'searchProductosInventario',
        'producto',
        
        // Pedidos y transferencias
        'reqpedidos',
        'reqMipedidos',
        'settransferenciaDici',
        
        // Sucursales
        'getSucursales',
        
        // Facturas
        'validateFactura',
        
        // Responsables
        'searchResponsables',
        'saveResponsable',
        'responsable',
        'responsables/tipo',
        
        // Garantías
        'garantias/crear',
        'garantias/crear-pedido',

        // Inventario Cíclico
        'inventario-ciclico/planillas',
        'inventario-ciclico/planillas/crear',
        'inventario-ciclico/planillas/{id}',
        'inventario-ciclico/planillas/{id}/productos',
        'inventario-ciclico/planillas/{planillaId}/productos/{detalleId}',
        'getUsuarios'
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $accessType
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $accessType = null)
    {
        // Intentar validar sesión por token primero
        $sessionId = $request->header('X-Session-Token') ?? 
                    $request->cookie('session_token');
        
        $sessionData = null;
        if ($sessionId) {
            $sessionData = app(\App\Services\SessionManager::class)->validateSession($sessionId);
        }
        //dd($sessionData,$sessionId);
        
        // Fallback a sesión legacy si no hay token válido
        if (!$sessionData && session('tipo_usuario')) {
            $userType = session('tipo_usuario');
            $sessionData = [
                'legacy_data' => [
                    'tipo_usuario' => $userType,
                    'id_usuario' => session('id_usuario'),
                    'usuario' => session('usuario'),
                    'nombre' => session('nombre_usuario'),
                    'nivel' => session('nivel'),
                    'role' => session('role'),
                    'iscentral' => session('iscentral', false)
                ]
            ];
        }
        
        
        // Si no hay sesión válida, denegar acceso
        if (!$sessionData) {
            // Si es una petición AJAX, devolver JSON
            if ($request->expectsJson() || $request->is('api/*')) {
                /* return Response::json([
                    "msj" => "Error: Sin sesión activa. Debe volver a iniciar sesión",
                    "estado" => false
                ]); */
            }
            
            // Si es una petición web, redirigir al login
            return redirect('/login')->with('error', 'Sesión expirada. Debe volver a iniciar sesión.');
        }
        
        $userType = $sessionData['legacy_data']['tipo_usuario'];
        
        // Verificar acceso según el tipo requerido
        if ($accessType && !$this->hasAccess($userType, $accessType, $request)) {
            return Response::json([
                "msj" => "Error: Sin permisos para acceder a {$accessType}",
                "estado" => false
            ]);
        }
        
        return $next($request);
    }
    
    /**
     * Verificar si el usuario tiene acceso según su tipo y el acceso requerido
     */
    private function hasAccess(int $userType, string $accessType, Request $request): bool
    {
        return match($accessType) {
            'login' => $this->hasLoginAccess($userType, $request),
            'admin' => $this->hasAdminAccess($userType, $request),
            'caja' => $this->hasCajaAccess($userType),
            'vendedor' => $this->hasVendedorAccess($userType),
            'api' => $this->hasApiAccess($userType, $request),
            default => false
        };
    }
    
    /**
     * Acceso para middleware 'login' - Tipos 1, 4, 6, 7 + tipo 7 con rutas específicas
     * 1 = GERENTE
     * 4 = CAJERO_VENDEDOR
     * 5 = SUPERVISOR DE CAJA (solo inventario y tickets)
     * 6 = SUPERADMIN
     * 7 = DICI
     */
    private function hasLoginAccess(int $userType, Request $request): bool
    {
        // Tipos básicos que siempre tienen acceso
        if (in_array($userType, [1, 4, 6])) {
            return true;
        }
        
        // Tipo 5 (SUPERVISOR DE CAJA) solo tiene acceso a inventario y tickets
        if ($userType == 5) {
            $allowedRoutes = [
                'getinventario', // Consultar inventario
                'imprimirTicked', // Aprobar impresiones de tickets
                'resetPrintingState', // Resetear estado de impresión
            ];
            
            return in_array($request->route()->uri, $allowedRoutes);
        }
        
        // Tipo 7 (DICI) solo tiene acceso a rutas específicas
        if ($userType == 7) {
            return in_array($request->route()->uri, self::DICI_ALLOWED_ROUTES);
        }
        
        return false;
    }
    
    /**
     * Acceso para middleware 'admin' - Tipos 1, 6 + tipo 7 con rutas específicas
     * 1 = GERENTE
     * 6 = SUPERADMIN
     * 7 = DICI (solo rutas específicas)
     */
    private function hasAdminAccess(int $userType, Request $request): bool
    {
        // GERENTE y SuperAdmin siempre tienen acceso
        if (in_array($userType, [1, 6])) {
            return true;
        }
        
        // Tipo 7 (DICI) solo tiene acceso a rutas específicas
        if ($userType == 7) {
            return in_array($request->route()->uri, self::DICI_ALLOWED_ROUTES);
        }
        
        return false;
    }
    
    /**
     * Acceso para middleware 'caja' - Tipos 1, 4, 6
     * 1 = GERENTE
     * 4 = CAJERO_VENDEDOR
     * 6 = SUPERADMIN
     */
    private function hasCajaAccess(int $userType): bool
    {
        return in_array($userType, [1, 4, 6]);
    }
    
    /**
     * Acceso para middleware 'vendedor' - Tipos 1, 4, 6
     * 1 = GERENTE
     * 4 = CAJERO_VENDEDOR
     * 6 = SUPERADMIN
     */
    private function hasVendedorAccess(int $userType): bool
    {
        return in_array($userType, [1, 4, 6]);
    }
    
    /**
     * Acceso para rutas API - Solo DICI (tipo 7)
     * 7 = DICI
     */
    private function hasApiAccess(int $userType, Request $request): bool
    {
        if ($userType == 6) {
            return true;
        }
        // Solo DICI puede acceder a las rutas API
        return $userType == 7;
    }
} 