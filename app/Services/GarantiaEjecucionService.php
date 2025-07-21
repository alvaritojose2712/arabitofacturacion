<?php

namespace App\Services;

use App\Models\SolicitudGarantia;
use App\Models\inventario;
use App\Models\pedidos;
use App\Models\items_pedidos;
use App\Models\pago_pedidos;
use App\Models\movimientosInventariounitario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class GarantiaEjecucionService
{
    /**
     * Ejecuta una solicitud de garantía aprobada
     * 
     * @param SolicitudGarantia $solicitud
     * @return array
     */
    public function ejecutarSolicitud(SolicitudGarantia $solicitud)
    {
        if ($solicitud->estatus !== SolicitudGarantia::STATUS_APROBADA) {
            throw new Exception('La solicitud debe estar aprobada para ejecutarse');
        }

        DB::beginTransaction();
        
        try {
            $resultado = [];

            // 1. Procesar según el caso de uso
            switch ($solicitud->caso_uso) {
                case SolicitudGarantia::CASO_USO_GARANTIA_SIMPLE:
                    $resultado = $this->ejecutarGarantiaSimple($solicitud);
                    break;
                    
                case SolicitudGarantia::CASO_USO_GARANTIA_CON_DIFERENCIA:
                    $resultado = $this->ejecutarGarantiaConDiferencia($solicitud);
                    break;
                    
                case SolicitudGarantia::CASO_USO_DEVOLUCION_DINERO:
                    $resultado = $this->ejecutarDevolucionDinero($solicitud);
                    break;
                    
                case SolicitudGarantia::CASO_USO_CAMBIO_MODELO:
                    $resultado = $this->ejecutarCambioModelo($solicitud);
                    break;
                    
                case SolicitudGarantia::CASO_USO_MIXTO:
                    $resultado = $this->ejecutarCasoMixto($solicitud);
                    break;
                    
                default:
                    throw new Exception('Caso de uso no implementado: ' . $solicitud->caso_uso);
            }

            // 2. Marcar como finalizada
            $solicitud->estatus = SolicitudGarantia::STATUS_FINALIZADA;
            $solicitud->save();

            // 3. Registrar en log
            Log::info('Solicitud de garantía ejecutada en sucursal', [
                'solicitud_id' => $solicitud->id,
                'caso_uso' => $solicitud->caso_uso,
                'resultado' => $resultado
            ]);

            DB::commit();
            
            return [
                'success' => true,
                'mensaje' => 'Solicitud ejecutada exitosamente',
                'resultado' => $resultado,
                'solicitud_id' => $solicitud->id
            ];

        } catch (Exception $e) {
            DB::rollback();
            
            Log::error('Error ejecutando solicitud de garantía en sucursal', [
                'solicitud_id' => $solicitud->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }

    /**
     * Ejecuta una garantía simple (cambio 1:1)
     */
    private function ejecutarGarantiaSimple(SolicitudGarantia $solicitud)
    {
        $garantiaData = $solicitud->garantia_data;
        $entradas = $garantiaData['entradas'] ?? [];
        $salidas = $garantiaData['salidas'] ?? [];

        $movimientos = [];
        $pedidos = [];

        // Crear pedido para la garantía
        $pedido = $this->crearPedidoGarantia($solicitud, 'Garantía Simple');

        // Procesar entradas (productos que entran - generalmente productos dañados)
        foreach ($entradas as $entrada) {
            if ($entrada['tipo'] === 'PRODUCTO') {
                // Aumentar inventario del producto que entra
                $movimiento = $this->procesarMovimientoInventario(
                    $entrada['producto_id'],
                    $entrada['cantidad'],
                    'ENTRADA',
                    'GARANTIA_PRODUCTO_DEVUELTO',
                    "Garantía Simple ID: {$solicitud->id} - Producto devuelto por cliente"
                );
                $movimientos[] = $movimiento;

                // Crear item del pedido (cantidad positiva para entrada)
                $this->crearItemPedido($pedido->id, $entrada['producto_id'], $entrada['cantidad'], $entrada['precio_unitario'], 1);
            }
        }

        // Procesar salidas (productos que salen - generalmente productos buenos)
        foreach ($salidas as $salida) {
            if ($salida['tipo'] === 'PRODUCTO') {
                // Disminuir inventario del producto que sale
                $movimiento = $this->procesarMovimientoInventario(
                    $salida['producto_id'],
                    $salida['cantidad'],
                    'SALIDA',
                    'GARANTIA_PRODUCTO_NUEVO',
                    "Garantía Simple ID: {$solicitud->id} - Producto nuevo entregado"
                );
                $movimientos[] = $movimiento;

                // Crear item del pedido (cantidad negativa para salida)
                $this->crearItemPedido($pedido->id, $salida['producto_id'], -$salida['cantidad'], $salida['precio_unitario'], 1);
            }
        }

        $pedidos[] = $pedido->id;

        return [
            'tipo' => 'GARANTIA_SIMPLE',
            'movimientos_inventario' => $movimientos,
            'pedidos_creados' => $pedidos,
        ];
    }

    /**
     * Ejecuta una garantía con diferencia de precio
     */
    private function ejecutarGarantiaConDiferencia(SolicitudGarantia $solicitud)
    {
        $garantiaData = $solicitud->garantia_data;
        $entradas = $garantiaData['entradas'] ?? [];
        $salidas = $garantiaData['salidas'] ?? [];

        $movimientos = [];
        $pedidos = [];

        // Crear pedido para la garantía
        $pedido = $this->crearPedidoGarantia($solicitud, 'Garantía con Diferencia');

        // Procesar entradas
        foreach ($entradas as $entrada) {
            if ($entrada['tipo'] === 'PRODUCTO') {
                $movimiento = $this->procesarMovimientoInventario(
                    $entrada['producto_id'],
                    $entrada['cantidad'],
                    'ENTRADA',
                    'GARANTIA_PRODUCTO_DEVUELTO',
                    "Garantía con diferencia ID: {$solicitud->id} - Producto devuelto"
                );
                $movimientos[] = $movimiento;

                $this->crearItemPedido($pedido->id, $entrada['producto_id'], $entrada['cantidad'], $entrada['precio_unitario'], 1);
            }
        }

        // Procesar salidas
        foreach ($salidas as $salida) {
            if ($salida['tipo'] === 'PRODUCTO') {
                $movimiento = $this->procesarMovimientoInventario(
                    $salida['producto_id'],
                    $salida['cantidad'],
                    'SALIDA',
                    'GARANTIA_PRODUCTO_NUEVO',
                    "Garantía con diferencia ID: {$solicitud->id} - Producto nuevo entregado"
                );
                $movimientos[] = $movimiento;

                $this->crearItemPedido($pedido->id, $salida['producto_id'], -$salida['cantidad'], $salida['precio_unitario'], 1);
            } elseif ($salida['tipo'] === 'DINERO') {
                // Crear pago negativo (devolución)
                $this->crearPagoPedido($pedido->id, $salida['monto_usd'], $salida['metodo']);
            }
        }

        $pedidos[] = $pedido->id;

        return [
            'tipo' => 'GARANTIA_CON_DIFERENCIA',
            'movimientos_inventario' => $movimientos,
            'pedidos_creados' => $pedidos,
        ];
    }

    /**
     * Ejecuta una devolución de dinero
     */
    private function ejecutarDevolucionDinero(SolicitudGarantia $solicitud)
    {
        $garantiaData = $solicitud->garantia_data;
        $entradas = $garantiaData['entradas'] ?? [];
        $salidas = $garantiaData['salidas'] ?? [];

        $movimientos = [];
        $pedidos = [];

        // Crear pedido para la devolución
        $pedido = $this->crearPedidoGarantia($solicitud, 'Devolución de Dinero');

        // Procesar entradas (productos que entran)
        foreach ($entradas as $entrada) {
            if ($entrada['tipo'] === 'PRODUCTO') {
                $movimiento = $this->procesarMovimientoInventario(
                    $entrada['producto_id'],
                    $entrada['cantidad'],
                    'ENTRADA',
                    'DEVOLUCION_PRODUCTO',
                    "Devolución de dinero ID: {$solicitud->id} - Producto devuelto"
                );
                $movimientos[] = $movimiento;

                $this->crearItemPedido($pedido->id, $entrada['producto_id'], $entrada['cantidad'], $entrada['precio_unitario'], 2);
            }
        }

        // Procesar salidas (dinero que sale)
        foreach ($salidas as $salida) {
            if ($salida['tipo'] === 'DINERO') {
                $this->crearPagoPedido($pedido->id, $salida['monto_usd'], $salida['metodo']);
            }
        }

        $pedidos[] = $pedido->id;

        return [
            'tipo' => 'DEVOLUCION_DINERO',
            'movimientos_inventario' => $movimientos,
            'pedidos_creados' => $pedidos,
        ];
    }

    /**
     * Ejecuta un cambio de modelo
     */
    private function ejecutarCambioModelo(SolicitudGarantia $solicitud)
    {
        return $this->ejecutarGarantiaConDiferencia($solicitud);
    }

    /**
     * Ejecuta un caso mixto
     */
    private function ejecutarCasoMixto(SolicitudGarantia $solicitud)
    {
        return $this->ejecutarGarantiaConDiferencia($solicitud);
    }

    /**
     * Procesa un movimiento de inventario
     */
    private function procesarMovimientoInventario($productoId, $cantidad, $tipoMovimiento, $motivo, $descripcion)
    {
        $producto = inventario::find($productoId);
        
        if (!$producto) {
            throw new Exception("Producto con ID {$productoId} no encontrado");
        }

        if ($tipoMovimiento === 'SALIDA') {
            // Validar que hay suficiente inventario
            if ($producto->cantidad < $cantidad) {
                throw new Exception("No hay suficiente inventario disponible para el producto {$producto->descripcion}. Disponible: {$producto->cantidad}, Requerido: {$cantidad}");
            }
            
            // Disminuir inventario
            $producto->cantidad -= $cantidad;
            $cantidadMovimiento = -$cantidad;
        } else {
            // Aumentar inventario
            $producto->cantidad += $cantidad;
            $cantidadMovimiento = $cantidad;
        }

        $producto->save();

        // Crear movimiento de inventario
        $movimiento = movimientosInventariounitario::create([
            'id_inventario' => $producto->id,
            'cantidad' => $cantidadMovimiento,
            'motivo' => $descripcion,
            'fecha' => now(),
            'tipo' => $motivo
        ]);

        return [
            'movimiento_id' => $movimiento->id,
            'producto_id' => $producto->id,
            'producto_descripcion' => $producto->descripcion,
            'cantidad_movimiento' => $cantidadMovimiento,
            'cantidad_anterior' => $producto->cantidad - $cantidadMovimiento,
            'cantidad_actual' => $producto->cantidad,
            'tipo' => $tipoMovimiento,
            'motivo' => $motivo
        ];
    }

    /**
     * Crea un pedido para la garantía
     */
    private function crearPedidoGarantia(SolicitudGarantia $solicitud, $descripcion)
    {
        $pedido = new pedidos();
        $pedido->estado = 1; // Procesado
        $pedido->id_cliente = 1; // Cliente por defecto
        $pedido->id_vendedor = $solicitud->usuario_solicitud ?? 1;
        //$pedido->observaciones = $descripcion . ' - Solicitud ID: ' . $solicitud->id;
        $pedido->created_at = now();
        $pedido->updated_at = now();
        $pedido->save();

        return $pedido;
    }

    /**
     * Crea un item del pedido
     */
    private function crearItemPedido($pedidoId, $productoId, $cantidad, $precioUnitario, $condicion)
    {
        return items_pedidos::create([
            'id_producto' => $productoId,
            'id_pedido' => $pedidoId,
            'cantidad' => $cantidad,
            'monto' => abs($cantidad) * $precioUnitario,
            'condicion' => $condicion,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    /**
     * Crea un pago del pedido (devolución)
     */
    private function crearPagoPedido($pedidoId, $monto, $metodo)
    {
        $tipoPago = $this->convertirTipoPago($metodo);
        
        return pago_pedidos::create([
            'id_pedido' => $pedidoId,
            'tipo' => $tipoPago,
            'cuenta' => 1,
            'monto' => -abs($monto), // Negativo para devolución
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    /**
     * Convierte el tipo de método de pago
     */
    private function convertirTipoPago($metodo)
    {
        switch (strtoupper($metodo)) {
            case 'EFECTIVO':
                return 1;
            case 'TRANSFERENCIA':
                return 2;
            case 'TARJETA':
                return 3;
            case 'PAGO_MOVIL':
                return 4;
            case 'DIVISA':
                return 5;
            default:
                return 1; // Efectivo por defecto
        }
    }

    /**
     * Valida si una solicitud puede ejecutarse
     */
    public function validarEjecucion(SolicitudGarantia $solicitud)
    {
        $errores = [];

        // Validar estado
        if ($solicitud->estatus !== SolicitudGarantia::STATUS_APROBADA) {
            $errores[] = 'La solicitud debe estar aprobada';
        }

        // Validar datos de garantía
        if (empty($solicitud->garantia_data)) {
            $errores[] = 'No hay datos de garantía';
        } else {
            $garantiaData = $solicitud->garantia_data;
            
            // Validar salidas de productos
            $salidas = $garantiaData['salidas'] ?? [];
            foreach ($salidas as $salida) {
                if ($salida['tipo'] === 'PRODUCTO') {
                    $inventarioDisponible = $this->verificarInventarioDisponible($salida['producto_id'], $salida['cantidad']);
                    if (!$inventarioDisponible['disponible']) {
                        $errores[] = $inventarioDisponible['error'];
                    }
                }
            }
        }

        return [
            'puede_ejecutarse' => empty($errores),
            'errores' => $errores
        ];
    }

    /**
     * Verifica si hay inventario disponible
     */
    private function verificarInventarioDisponible($productoId, $cantidadRequerida)
    {
        $producto = inventario::find($productoId);
        
        if (!$producto) {
            return [
                'disponible' => false,
                'error' => "Producto con ID {$productoId} no encontrado"
            ];
        }

        if ($producto->cantidad < $cantidadRequerida) {
            return [
                'disponible' => false,
                'error' => "Inventario insuficiente para {$producto->descripcion}. Disponible: {$producto->cantidad}, Requerido: {$cantidadRequerida}"
            ];
        }

        return [
            'disponible' => true,
            'producto' => $producto
        ];
    }

    /**
     * Genera un ticket de garantía
     */
    public function generarTicket(SolicitudGarantia $solicitud)
    {
        if ($solicitud->estatus !== SolicitudGarantia::STATUS_FINALIZADA) {
            throw new Exception('La solicitud debe estar finalizada para generar ticket');
        }

        // Generar contenido del ticket
        $ticket = [
            'solicitud_id' => $solicitud->id,
            'fecha' => now()->format('d/m/Y H:i:s'),
            'tipo' => $solicitud->tipo_solicitud,
            'caso_uso' => SolicitudGarantia::getDescripcionCasoUso($solicitud->caso_uso),
            'factura_original' => $solicitud->factura_venta_id,
            'monto_total' => $solicitud->monto_total_devolucion,
            'metodos_devolucion' => $solicitud->metodos_devolucion,
            'productos' => $solicitud->productos_data,
            'observaciones' => $solicitud->detalles_adicionales
        ];

        Log::info('Ticket de garantía generado', [
            'solicitud_id' => $solicitud->id,
            'ticket' => $ticket
        ]);

        return $ticket;
    }
} 