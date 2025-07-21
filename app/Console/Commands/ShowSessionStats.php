<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SessionManager;
use App\Models\UserSession;
use App\Models\usuarios;

class ShowSessionStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sessions:stats {--user= : Show sessions for specific user ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Show detailed session statistics';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $sessionManager = app(SessionManager::class);
        $stats = $sessionManager->getSessionStats();
        
        $this->info('📊 ESTADÍSTICAS DE SESIONES');
        $this->line('');
        
        $this->info('📈 Resumen General:');
        $this->line("   Sesiones activas: {$stats['total_active']}");
        $this->line("   Sesiones expiradas: {$stats['total_expired']}");
        $this->line("   Usuarios con múltiples sesiones: {$stats['users_with_multiple_sessions']}");
        $this->line('');
        
        // Mostrar sesiones por usuario si se especifica
        if ($userId = $this->option('user')) {
            $this->showUserSessions($userId);
        } else {
            $this->showAllActiveSessions();
        }
        
        return 0;
    }
    
    private function showUserSessions(int $userId): void
    {
        $usuario = usuarios::find($userId);
        if (!$usuario) {
            $this->error("❌ Usuario con ID {$userId} no encontrado");
            return;
        }
        
        $this->info("👤 Sesiones del usuario: {$usuario->nombre} ({$usuario->usuario})");
        $this->line('');
        
        $sessions = UserSession::where('usuario_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
            
        if ($sessions->isEmpty()) {
            $this->line("   No hay sesiones registradas para este usuario");
            return;
        }
        
        foreach ($sessions as $session) {
            $status = $session->is_active ? '🟢 Activa' : '🔴 Inactiva';
            $this->line("   {$status} - {$session->session_id}");
            $this->line("      IP: {$session->ip_address}");
            $this->line("      Creada: {$session->created_at}");
            $this->line("      Última actividad: {$session->last_activity}");
            $this->line('');
        }
    }
    
    private function showAllActiveSessions(): void
    {
        $this->info('👥 Sesiones Activas por Usuario:');
        $this->line('');
        
        $activeSessions = UserSession::active()
            ->recent()
            ->with('usuario')
            ->get()
            ->groupBy('usuario_id');
            
        if ($activeSessions->isEmpty()) {
            $this->line("   No hay sesiones activas");
            return;
        }
        
        foreach ($activeSessions as $userId => $sessions) {
            $usuario = $sessions->first()->usuario;
            $sessionCount = $sessions->count();
            
            $this->line("   {$usuario->nombre} ({$usuario->usuario}) - {$sessionCount} sesión(es)");
            
            foreach ($sessions as $session) {
                $this->line("      🟢 {$session->session_id} - {$session->ip_address}");
            }
            $this->line('');
        }
    }
} 