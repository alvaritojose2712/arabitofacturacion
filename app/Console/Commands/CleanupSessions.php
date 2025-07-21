<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SessionManager;

class CleanupSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sessions:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up expired user sessions';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('🧹 Limpiando sesiones expiradas...');
        
        $sessionManager = app(SessionManager::class);
        $cleanedCount = $sessionManager->cleanupExpiredSessions();
        
        if ($cleanedCount > 0) {
            $this->info("✅ {$cleanedCount} sesiones expiradas fueron limpiadas");
        } else {
            $this->info("✅ No hay sesiones expiradas para limpiar");
        }
        
        // Mostrar estadísticas actuales
        $stats = $sessionManager->getSessionStats();
        $this->info("\n📊 Estadísticas de sesiones:");
        $this->line("   Sesiones activas: {$stats['total_active']}");
        $this->line("   Sesiones expiradas: {$stats['total_expired']}");
        $this->line("   Usuarios con múltiples sesiones: {$stats['users_with_multiple_sessions']}");
        
        return 0;
    }
} 