<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Http\Request;
use App\Http\Middleware\AuthenticateUser;

class TestMiddleware extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:middleware {userType} {accessType} {route?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the unified middleware with different user types and access types';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $userType = (int) $this->argument('userType');
        $accessType = $this->argument('accessType');
        $route = $this->argument('route') ?? 'test-route';

        $this->info("Testing middleware with:");
        $this->line("User Type: {$userType}");
        $this->line("Access Type: {$accessType}");
        $this->line("Route: {$route}");

        // Simular sesión
        session(['tipo_usuario' => $userType]);

        // Crear request mock
        $request = Request::create('/test', 'GET');
        $request->setRouteResolver(function () use ($route) {
            return (object) ['uri' => $route];
        });

        // Crear middleware
        $middleware = new AuthenticateUser();

        // Probar middleware
        try {
            $response = $middleware->handle($request, function ($request) {
                return response()->json(['success' => true, 'message' => 'Access granted']);
            }, $accessType);

            if ($response->getStatusCode() === 200) {
                $this->info("✅ Access GRANTED for user type {$userType} to {$accessType}");
            } else {
                $this->error("❌ Access DENIED for user type {$userType} to {$accessType}");
                $this->line("Response: " . $response->getContent());
            }
        } catch (\Exception $e) {
            $this->error("❌ Error testing middleware: " . $e->getMessage());
        }

        // Limpiar sesión
        session()->forget('tipo_usuario');

        return 0;
    }
} 