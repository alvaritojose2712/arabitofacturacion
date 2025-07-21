<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use Response;
use Session;

class MonedasController extends Controller
{
    /**
     * Obtener todas las monedas
     */
    public function getMonedas()
    {
        try {
            $monedas = DB::table('monedas')
                ->orderBy('tipo')
                ->get();

            return Response::json([
                "estado" => true,
                "monedas" => $monedas
            ]);
        } catch (\Exception $e) {
            return Response::json([
                "estado" => false,
                "msj" => "Error al obtener monedas: " . $e->getMessage()
            ]);
        }
    }

    /**
     * Obtener valor actual del dólar
     */
    public function getDollarRate()
    {
        try {
            $dollar = DB::table('monedas')
                ->where('tipo', 1) // Dólar
                ->where('estatus', 'activo')
                ->first();

            if (!$dollar) {
                return Response::json([
                    "estado" => false,
                    "msj" => "No se encontró información del dólar"
                ]);
            }

            return Response::json([
                "estado" => true,
                "dollar" => $dollar
            ]);
        } catch (\Exception $e) {
            return Response::json([
                "estado" => false,
                "msj" => "Error al obtener valor del dólar: " . $e->getMessage()
            ]);
        }
    }

    /**
     * Actualizar valor del dólar desde API
     */
    public function updateDollarRate()
    {
        try {
            // Verificar si es necesario actualizar (máximo cada 30 minutos)
            // Solo para rutas protegidas, no para actualización forzada desde login
            $lastUpdate = DB::table('monedas')
                ->where('tipo', 1) // Dólar
                ->whereNotNull('fecha_ultima_actualizacion')
                ->orderBy('fecha_ultima_actualizacion', 'desc')
                ->first();

            // Solo verificar límite si no es una actualización forzada desde login
            if (request()->is('forceUpdateDollar')) {
                // Para actualización forzada, no hay límite de tiempo
            } else {
                // Si no hay fecha de actualización, permitir actualizar
                if ($lastUpdate && Carbon::parse($lastUpdate->fecha_ultima_actualizacion)->diffInMinutes(now()) < 30) {
                    return Response::json([
                        "estado" => false,
                        "msj" => "La última actualización fue hace menos de 30 minutos"
                    ]);
                }
            }

            // Obtener datos de la API
            $response = Http::timeout(30)->get('https://pydolarve.org/api/v1/dollar?page=bcv');
            
            if (!$response->successful()) {
                throw new \Exception('Error al conectar con la API: ' . $response->status());
            }

            $data = $response->json();
            
            // Verificar estructura de la respuesta
            if (!isset($data['monitors'])) {
                throw new \Exception('Formato de respuesta inesperado de la API');
            }

            // Buscar específicamente el monitor "usd"
            $usdRate = null;
            if (isset($data['monitors']['usd'])) {
                $usdRate = $data['monitors']['usd'];
            }

            if (!$usdRate || !isset($usdRate['price'])) {
                throw new \Exception('No se pudo obtener el valor del dólar desde el monitor USD');
            }

            $dollarValue = (float) $usdRate['price'];
            $lastUpdate = $usdRate['last_update'] ?? $data['datetime']['date'] ?? now()->toDateString();
            $source = 'USD Monitor - API pydolarvenezuela';

            // Actualizar en la base de datos
            $updated = DB::table('monedas')
                ->where('tipo', 1) // Dólar
                ->update([
                    'valor' => $dollarValue,
                    'fecha_ultima_actualizacion' => now(),
                    'origen' => $source,
                    'notas' => "Actualizado automáticamente. Última actualización: {$lastUpdate}. Datetime: {$data['datetime']['date']} {$data['datetime']['time']}",
                    'estatus' => 'activo'
                ]);

            if ($updated) {
                // Clear all related caches
                Cache::forget('bs');
                Cache::forget('cop');
                Cache::forget('moneda_rates_' . md5($dollarValue));
                
                // Log de la actualización
                Log::info('Dollar rate updated via web', [
                    'value' => $dollarValue,
                    'source' => $source,
                    'last_update' => $lastUpdate,
                    'datetime' => $data['datetime'] ?? null
                ]);

                return Response::json([
                    "estado" => true,
                    "msj" => "Valor del dólar actualizado exitosamente",
                    "valor" => $dollarValue,
                    "fecha_actualizacion" => now()->toDateTimeString(),
                    "origen" => $source
                ]);
            } else {
                // Si no hay registros, crear uno nuevo
                DB::table('monedas')->insert([
                    'tipo' => 1, // Dólar
                    'valor' => $dollarValue,
                    'fecha_ultima_actualizacion' => now(),
                    'origen' => $source,
                    'notas' => "Creado automáticamente. Última actualización: {$lastUpdate}. Datetime: {$data['datetime']['date']} {$data['datetime']['time']}",
                    'estatus' => 'activo',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // Clear all related caches
                Cache::forget('bs');
                Cache::forget('cop');
                Cache::forget('moneda_rates_' . md5($dollarValue));

                return Response::json([
                    "estado" => true,
                    "msj" => "Registro de dólar creado exitosamente",
                    "valor" => $dollarValue,
                    "fecha_actualizacion" => now()->toDateTimeString(),
                    "origen" => $source
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Dollar rate update failed via web', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Response::json([
                "estado" => false,
                "msj" => "Error al actualizar el valor del dólar: " . $e->getMessage()
            ]);
        }
    }

    /**
     * Actualizar moneda manualmente
     */
    public function updateMoneda(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|integer',
                'valor' => 'required|numeric|min:0',
                'origen' => 'nullable|string|max:100',
                'notas' => 'nullable|string',
                'estatus' => 'nullable|in:activo,inactivo'
            ]);

            $updated = DB::table('monedas')
                ->where('id', $request->id)
                ->update([
                    'valor' => $request->valor,
                    'fecha_ultima_actualizacion' => now(),
                    'origen' => $request->origen,
                    'notas' => $request->notas,
                    'estatus' => $request->estatus ?? 'activo',
                    'updated_at' => now()
                ]);

            if ($updated) {
                // Clear all related caches
                Cache::forget('bs');
                Cache::forget('cop');
                Cache::forget('moneda_rates_' . md5($request->valor));
                
                return Response::json([
                    "estado" => true,
                    "msj" => "Moneda actualizada exitosamente"
                ]);
            } else {
                return Response::json([
                    "estado" => false,
                    "msj" => "No se pudo actualizar la moneda"
                ]);
            }

        } catch (\Exception $e) {
            return Response::json([
                "estado" => false,
                "msj" => "Error al actualizar moneda: " . $e->getMessage()
            ]);
        }
    }

    /**
     * Obtener monedas (compatibilidad con MonedaController)
     */
    public function getMoneda(Request $req)
    {
        $mon = (new PedidosController)->get_moneda();
        return Response::json(["dolar"=>$mon["bs"],"peso"=>$mon["cop"]]);
    }

    /**
     * Establecer moneda (compatibilidad con MonedaController)
     */
    public function setMoneda(Request $req)
    {
        // Verificar que sea admin (tipo_usuario 1) o superadmin (tipo_usuario 0)
        if(session("tipo_usuario") == 1 || session("tipo_usuario") == 0){
            // Si es actualización manual desde login, agregar fecha de actualización
            $updateData = [
                "tipo" => $req->tipo,
                "valor" => $req->valor
            ];
            
            // Si viene del login, agregar fecha de actualización
            if ($req->has('from_login') && $req->from_login) {
                $updateData["fecha_ultima_actualizacion"] = now();
                $updateData["origen"] = "Manual";
                $updateData["notas"] = "Actualización manual desde login";
            }
            
            // Usar el modelo moneda
            $moneda = new \App\Models\moneda();
            $moneda->updateOrCreate(["tipo" => $req->tipo], $updateData);
            
            // Clear all related caches
            Cache::forget('bs');
            Cache::forget('cop');
            Cache::forget('moneda_rates_' . md5($req->valor));
            
            return Response::json(["msj" => "Moneda actualizada exitosamente", "estado" => true]);
        }
        return Response::json(["msj" => "No tienes permisos para realizar esta acción", "estado" => false]);
    }
}
