<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Response;

class sendCajerosReporteController extends Controller
{
    public function sendCajerosEstadisticas()
    {
        try {
            $sucursal = sucursal::first();
            if (!$sucursal) {
                return Response::json([
                    "msj" => "Error: No se encontró la sucursal",
                    "estado" => false
                ]);
            }

            // Obtener estadísticas de ventas por usuario
            $estadisticas = pedidos::with(['vendedor', 'pagos'])
                ->where('estado', 1) // Solo pedidos procesados
                ->get()
                ->groupBy('id_vendedor')
                ->map(function ($pedidos) {
                    $usuario = $pedidos->first()->vendedor;
                    $total_ventas = $pedidos->sum('clean_total');
                    $cantidad_pedidos = $pedidos->count();
                    
                    // Análisis de horas de mayor actividad
                    $horas_actividad = $pedidos->groupBy(function($pedido) {
                        return $pedido->created_at->format('H');
                    })->map(function($grupo) {
                        return $grupo->count();
                    })->sortDesc();

                    // Análisis de días de mayor actividad
                    $dias_actividad = $pedidos->groupBy(function($pedido) {
                        return $pedido->created_at->format('Y-m-d');
                    })->map(function($grupo) {
                        return $grupo->count();
                    })->sortDesc();

                    // Detalle de pedidos
                    $detalle_pedidos = $pedidos->map(function($pedido) {
                        return [
                            'id' => $pedido->id,
                            'fecha' => $pedido->created_at,
                            'monto' => $pedido->clean_total,
                            'metodo_pago' => $pedido->pagos->map(function($pago) {
                                return [
                                    'tipo' => $pago->tipo,
                                    'monto' => $pago->monto
                                ];
                            })
                        ];
                    });

                    return [
                        'id_usuario' => $usuario->id,
                        'nombre_usuario' => $usuario->nombre,
                        'total_ventas' => $total_ventas,
                        'cantidad_pedidos' => $cantidad_pedidos,
                        'horas_actividad' => $horas_actividad,
                        'dias_actividad' => $dias_actividad,
                        'detalle_pedidos' => $detalle_pedidos
                    ];
                });

            // Preparar datos para enviar
            $data = [
                'id_sucursal' => $sucursal->id,
                'nombre_sucursal' => $sucursal->nombre,
                'fecha_envio' => now(),
                'estadisticas' => $estadisticas
            ];

            // Enviar a central
            $response = Http::post((new sendCentral)->path() . "/api/receive-cajeros-estadisticas", $data);

            if ($response->successful()) {
                return Response::json([
                    "msj" => "Estadísticas enviadas exitosamente",
                    "estado" => true
                ]);
            } else {
                throw new \Exception("Error al enviar estadísticas: " . $response->body());
            }

        } catch (\Exception $e) {
            return Response::json([
                "msj" => "Error: " . $e->getMessage(),
                "estado" => false
            ]);
        }
    }
}
