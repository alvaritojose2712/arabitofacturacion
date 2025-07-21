<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\sendCentral;

class InventarioGarantiasController extends Controller
{
    protected $sendCentral;

    public function __construct()
    {
        $this->sendCentral = new sendCentral();
    }

    /**
     * Obtener inventario de garantías desde central
     */
    public function getInventarioGarantiasCentral(Request $request)
    {
        try {
            $data = [
                'tipo_inventario' => $request->tipo_inventario,
                'producto_search' => $request->producto_search,
                'page' => $request->page ?? 1,
                'per_page' => $request->per_page ?? 50
            ];

            $response = $this->sendCentral->getInventarioGarantiasCentral($data);
            
            return response()->json($response);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Buscar productos en inventario de garantías
     */
    public function searchInventarioGarantias(Request $request)
    {
        try {
            $request->validate([
                'search_term' => 'required|string|min:2',
                'search_type' => 'nullable|in:codigo_barras,descripcion,codigo_proveedor',
                'tipo_inventario' => 'nullable|string'
            ]);

            $data = [
                'search_term' => $request->search_term,
                'search_type' => $request->search_type ?? 'codigo_barras',
                'tipo_inventario' => $request->tipo_inventario
            ];

            $response = $this->sendCentral->searchInventarioGarantias($data);
            
            return response()->json($response);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Transferir producto de garantía entre sucursales
     */
    public function transferirProductoGarantiaSucursal(Request $request)
    {
        try {
            $request->validate([
                'producto_id' => 'required|integer',
                'sucursal_destino' => 'required|string',
                'cantidad' => 'required|integer|min:1',
                'tipo_inventario' => 'required|string',
                'motivo' => 'nullable|string',
                'solicitado_por' => 'nullable|string'
            ]);

            $data = [
                'producto_id' => $request->producto_id,
                'sucursal_destino' => $request->sucursal_destino,
                'cantidad' => $request->cantidad,
                'tipo_inventario' => $request->tipo_inventario,
                'motivo' => $request->motivo ?? 'Transferencia entre sucursales',
                'solicitado_por' => $request->solicitado_por
            ];

            $response = $this->sendCentral->transferirProductoGarantiaSucursal($data);
            
            return response()->json($response);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Transferir producto de garantía a venta normal (solo desde central)
     */
    public function transferirGarantiaVentaNormal(Request $request)
    {
        try {
            $request->validate([
                'producto_id' => 'required|integer',
                'sucursal_destino' => 'required|string',
                'cantidad' => 'required|integer|min:1',
                'tipo_inventario' => 'required|string',
                'autorizado_por' => 'nullable|string',
                'observaciones' => 'nullable|string'
            ]);

            $data = [
                'producto_id' => $request->producto_id,
                'sucursal_destino' => $request->sucursal_destino,
                'cantidad' => $request->cantidad,
                'tipo_inventario' => $request->tipo_inventario,
                'autorizado_por' => $request->autorizado_por,
                'observaciones' => $request->observaciones
            ];

            $response = $this->sendCentral->transferirGarantiaVentaNormal($data);
            
            return response()->json($response);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener tipos de inventario de garantía disponibles
     */
    public function getTiposInventarioGarantia()
    {
        try {
            $response = $this->sendCentral->getTiposInventarioGarantia();
            
            return response()->json($response);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de inventario de garantías
     */
    public function getEstadisticasInventarioGarantias(Request $request)
    {
        try {
            $data = [
                'fecha_desde' => $request->fecha_desde,
                'fecha_hasta' => $request->fecha_hasta
            ];

            $response = $this->sendCentral->getEstadisticasInventarioGarantias($data);
            
            return response()->json($response);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 