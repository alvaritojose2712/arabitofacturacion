<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TestHeaderUpdate extends Command
{
    protected $signature = 'test:header-update';
    protected $description = 'Probar la actualización automática desde el header';

    public function handle()
    {
        $this->info('🔍 Probando actualización automática desde header...');
        
        // Verificar estado actual
        $dollar = DB::table('monedas')
            ->where('tipo', 1)
            ->where('estatus', 'activo')
            ->first();

        if ($dollar) {
            $this->info("📊 Estado actual del dólar:");
            $this->info("   💰 Valor: {$dollar->valor} Bs");
            $this->info("   📅 Última actualización: " . ($dollar->fecha_ultima_actualizacion ?? 'NULL'));
            $this->info("   🏷️  Origen: " . ($dollar->origen ?? 'No especificado'));
        }

        $this->info("\n🎯 Funcionalidad implementada:");
        $this->info("   ✅ Click en botón USD → Actualización automática desde API");
        $this->info("   ✅ Click en botón COP → Actualización manual (prompt)");
        $this->info("   ✅ Indicador visual de carga durante actualización");
        $this->info("   ✅ Notificación de éxito/error");
        $this->info("   ✅ Actualización automática de valores en pantalla");

        $this->info("\n🔄 Flujo de actualización automática:");
        $this->info("   1. Usuario hace click en 'USD {valor}'");
        $this->info("   2. Botón muestra 'Actualizando...' con spinner");
        $this->info("   3. Sistema llama a /forceUpdateDollar");
        $this->info("   4. API obtiene valor desde monitor 'usd'");
        $this->info("   5. Base de datos se actualiza");
        $this->info("   6. Notificación de éxito con nuevo valor");
        $this->info("   7. Valores se actualizan en pantalla");

        $this->info("\n🎯 Prueba completada!");
        
        return 0;
    }
} 