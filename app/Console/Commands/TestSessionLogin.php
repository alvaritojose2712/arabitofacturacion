<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SessionManager;
use App\Models\usuarios;
use Illuminate\Http\Request;

class TestSessionLogin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sessions:test-login {usuario} {clave}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test login with unique sessions';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $usuario = $this->argument('usuario');
        $clave = $this->argument('clave');
        
        $this->info("🧪 Probando login con sesiones únicas...");
        $this->line("Usuario: {$usuario}");
        $this->line('');
        
        // Buscar usuario
        $user = usuarios::where('usuario', $usuario)->first();
        
        if (!$user) {
            $this->error("❌ Usuario '{$usuario}' no encontrado");
            return 1;
        }
        
        $this->line("✅ Usuario encontrado: {$user->nombre}");
        $this->line("Tipo de usuario: {$user->tipo_usuario}");
        $this->line('');
        
        // Simular request
        $request = new Request();
        $request->merge([
            'usuario' => $usuario,
            'clave' => $clave
        ]);
        
        // Crear sesión
        try {
            $sessionManager = app(SessionManager::class);
            $sessionData = $sessionManager->createSession($user, $request);
            
            $this->info("✅ Sesión creada exitosamente!");
            $this->line("Session Token: {$sessionData['session_token']}");
            $this->line("IP Address: {$request->ip()}");
            $this->line('');
            
            // Verificar que se creó en la base de datos
            $this->info("📊 Verificando sesión en base de datos...");
            $stats = $sessionManager->getSessionStats();
            $this->line("Sesiones activas: {$stats['total_active']}");
            $this->line("Usuarios con múltiples sesiones: {$stats['users_with_multiple_sessions']}");
            
            // Mostrar sesiones del usuario
            $userSessions = $sessionManager->getUserActiveSessions($user->id);
            $this->line("Sesiones del usuario: " . count($userSessions));
            
            foreach ($userSessions as $session) {
                $this->line("   🟢 {$session['session_id']} - {$session['ip_address']}");
            }
            
        } catch (\Exception $e) {
            $this->error("❌ Error al crear sesión: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
} 