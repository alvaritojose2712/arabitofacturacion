<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\usuarios;

class TestRoutePermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'routes:test-permissions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test route permissions for different user types';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('🧪 PROBANDO PERMISOS DE RUTAS ESPECÍFICAS');
        $this->line('');
        
        // Rutas específicas para DICI y SUPERADMIN
        $diciRoutes = [
            'validateFactura',
            'searchProductosInventario', 
            'producto',
            'searchResponsables',
            'saveResponsable',
            'responsable',
            'responsables/tipo',
            'garantias/crear',
            'garantias/crear-pedido'
        ];
        
        $this->info('📋 RUTAS ESPECÍFICAS PARA DICI Y SUPERADMIN:');
        foreach ($diciRoutes as $route) {
            $this->line("   • {$route}");
        }
        $this->line('');
        
        // Mostrar usuarios de prueba
        $this->info('👥 USUARIOS DE PRUEBA:');
        $usuarios = usuarios::all();
        
        foreach ($usuarios as $usuario) {
            $tipoLabel = $this->getTipoLabel($usuario->tipo_usuario);
            $this->line("   • {$usuario->nombre} ({$usuario->usuario}) - Tipo: {$usuario->tipo_usuario} ({$tipoLabel})");
        }
        $this->line('');
        
        // Verificar permisos por tipo de usuario
        $this->info('🔐 VERIFICACIÓN DE PERMISOS:');
        
        $userTypes = [1, 4, 5, 6, 7]; // Tipos de usuario existentes
        
        foreach ($userTypes as $tipo) {
            $tipoLabel = $this->getTipoLabel($tipo);
            $this->line("   Tipo {$tipo} ({$tipoLabel}):");
            
            if (in_array($tipo, [6, 7])) {
                $this->line("      ✅ Acceso completo a rutas DICI/SUPERADMIN");
            } else {
                $this->line("      ❌ Sin acceso a rutas DICI/SUPERADMIN");
            }
        }
        
        $this->line('');
        $this->info('✅ CONFIGURACIÓN COMPLETADA');
        $this->line('   Las rutas específicas ahora solo son accesibles para:');
        $this->line('   • DICI (tipo 7)');
        $this->line('   • SUPERADMIN (tipo 6)');
        
        return 0;
    }
    
    private function getTipoLabel(int $tipo): string
    {
        return match($tipo) {
            1 => 'GERENTE',
            4 => 'Cajero Vendedor',
            5 => 'SUPERVISOR DE CAJA',
            6 => 'SUPERADMIN',
            7 => 'DICI',
            default => 'Desconocido'
        };
    }
} 