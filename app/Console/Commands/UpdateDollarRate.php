<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class UpdateDollarRate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dollar:update {--force : Forzar actualización sin verificar última actualización}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualizar el valor del dólar desde la API de pydolarvenezuela';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('🔄 Iniciando actualización del valor del dólar...');

        try {
            // Verificar si es necesario actualizar (máximo cada 30 minutos)
            if (!$this->option('force')) {
                $lastUpdate = DB::table('monedas')
                    ->where('tipo', 1) // Dólar
                    ->whereNotNull('fecha_ultima_actualizacion')
                    ->orderBy('fecha_ultima_actualizacion', 'desc')
                    ->first();

                if ($lastUpdate && Carbon::parse($lastUpdate->fecha_ultima_actualizacion)->diffInMinutes(now()) < 30) {
                    $this->warn('⚠️  La última actualización fue hace menos de 30 minutos. Use --force para forzar la actualización.');
        return 0;
                }
            }

            // Obtener datos de la API
            $this->info('📡 Consultando API de pydolarvenezuela...');
            
            $response = Http::timeout(30)->get('https://pydolarvenezuela-api.vercel.app/api/v1/dollar');
            
            if (!$response->successful()) {
                throw new \Exception('Error al conectar con la API: ' . $response->status());
            }

            $data = $response->json();
            
            if (!isset($data['monitors'])) {
                throw new \Exception('Formato de respuesta inesperado de la API');
            }

            // Obtener el valor del BCV (Banco Central de Venezuela)
            $bcvRate = null;
            foreach ($data['monitors'] as $monitor) {
                if (isset($monitor['bcv'])) {
                    $bcvRate = $monitor['bcv'];
                    break;
                }
            }

            if (!$bcvRate || !isset($bcvRate['price'])) {
                throw new \Exception('No se pudo obtener el valor del BCV');
            }

            $dollarValue = (float) $bcvRate['price'];
            $lastUpdate = $bcvRate['last_update'] ?? now()->toDateTimeString();

            $this->info("💱 Valor del dólar BCV: {$dollarValue} Bs");

            // Actualizar en la base de datos
            $updated = DB::table('monedas')
                ->where('tipo', 1) // Dólar
                ->update([
                    'valor' => $dollarValue,
                    'fecha_ultima_actualizacion' => now(),
                    'origen' => 'BCV - API pydolarvenezuela',
                    'notas' => "Actualizado automáticamente desde BCV. Última actualización BCV: {$lastUpdate}",
                    'estatus' => 'activo'
                ]);

            if ($updated) {
                $this->info('✅ Valor del dólar actualizado exitosamente');
                
                // Log de la actualización
                Log::info('Dollar rate updated', [
                    'value' => $dollarValue,
                    'source' => 'BCV - API pydolarvenezuela',
                    'last_bcv_update' => $lastUpdate
                ]);
                
                return 0;
            } else {
                // Si no hay registros, crear uno nuevo
                DB::table('monedas')->insert([
                    'tipo' => 1, // Dólar
                    'valor' => $dollarValue,
                    'fecha_ultima_actualizacion' => now(),
                    'origen' => 'BCV - API pydolarvenezuela',
                    'notas' => "Creado automáticamente desde BCV. Última actualización BCV: {$lastUpdate}",
                    'estatus' => 'activo',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                $this->info('✅ Registro de dólar creado exitosamente');
                return 0;
            }

        } catch (\Exception $e) {
            $this->error('❌ Error al actualizar el valor del dólar: ' . $e->getMessage());
            
            Log::error('Dollar rate update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return 1;
        }
    }
}
