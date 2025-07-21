<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\UserSession;

class ClearAllSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sessions:clear-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all active sessions';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('🧹 Limpiando todas las sesiones...');
        
        $count = UserSession::where('is_active', true)->update(['is_active' => false]);
        
        if ($count > 0) {
            $this->info("✅ {$count} sesiones fueron desactivadas");
        } else {
            $this->info("✅ No hay sesiones activas para limpiar");
        }
        
        // Mostrar estadísticas finales
        $totalSessions = UserSession::count();
        $activeSessions = UserSession::where('is_active', true)->count();
        
        $this->line('');
        $this->info("📊 Estadísticas finales:");
        $this->line("   Total de sesiones en BD: {$totalSessions}");
        $this->line("   Sesiones activas: {$activeSessions}");
        
        return 0;
    }
} 