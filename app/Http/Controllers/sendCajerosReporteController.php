<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Response;
use App\Models\sucursal;
use App\Models\pedidos; 

class sendCajerosReporteController extends Controller
{
    public function sendCajerosEstadisticas(Request $request)
    {
        try {
            $sucursal = sucursal::first();
            if (!$sucursal) {
                return Response::json([
                    "msj" => "Error: No se encontró la sucursal",
                    "estado" => false
                ]);
            }

            // Validar y procesar el parámetro de mes-año
            $periodo = $request->get('periodo');
            if (!$periodo || !preg_match('/^\d{2}-\d{4}$/', $periodo)) {
                return Response::json([
                    "msj" => "Error: El formato del período debe ser MM-YYYY (ejemplo: 01-2025)",
                    "estado" => false
                ]);
            }

            list($mes, $año) = explode('-', $periodo);
            
            // Construir la fecha de inicio y fin del mes
            $fecha_inicio = \Carbon\Carbon::createFromDate($año, $mes, 1)->startOfMonth();
            $fecha_fin = $fecha_inicio->copy()->endOfMonth();

            // Obtener estadísticas de ventas por usuario
            $estadisticas = pedidos::with(['vendedor', 'pagos', 'items'])
                ->where('estado', 1) // Solo pedidos procesados
                ->whereBetween('created_at', [$fecha_inicio, $fecha_fin])
                ->get()
                ->groupBy('id_vendedor')
                ->map(function ($pedidos) {
                    $usuario = $pedidos->first()->vendedor;
                    $total_ventas = $pedidos->sum(function($pedido) {
                        return $pedido->items->sum('monto');
                    });
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
                            'monto' => $pedido->items->sum('monto'),
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
                'nombre_sucursal' => $sucursal->codigo,
                'fecha_envio' => now(),
                'periodo' => $periodo,
                'estadisticas' => $estadisticas
            ];

            // Enviar a central
            $response = Http::post((new sendCentral)->path() . "/receive-cajeros-estadisticas", $data);

            if ($response->successful()) {
                return Response::json([
                    "msj" => "Estadísticas enviadas exitosamente para el período " . $periodo,
                    "estado" => true
                ]);
            } else {
                return $response->body();
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
