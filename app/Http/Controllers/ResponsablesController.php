<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Response;

class ResponsablesController extends Controller
{
    /**
     * Buscar responsables existentes en arabitocentral
     */
    public function searchResponsables(Request $req)
    {
        try {
            $tipo = $req->tipo;
            $termino = $req->termino;
            $limit = $req->limit ?? 10;

            // Validar parámetros
            if (!$termino || strlen($termino) < 2) {
                return response()->json([
                    'status' => 200,
                    'data' => [],
                    'message' => 'Término de búsqueda muy corto'
                ]);
            }

            // Comunicarse con central usando sendCentral
            $sendCentral = new \App\Http\Controllers\sendCentral();
            $response = $sendCentral->searchResponsablesCentral([
                'tipo' => $tipo,
                'termino' => $termino,
                'limit' => $limit
            ]);

            // Verificar si la respuesta es exitosa
            if ($response && isset($response['success']) && $response['success'] === true) {
                return response()->json([
                    'status' => 200,
                    'data' => $response['data'] ?? [],
                    'message' => 'Búsqueda exitosa',
                    'total' => count($response['data'] ?? [])
                ]);
            } else {
                // Mostrar el error específico devuelto por central
                $errorMessage = 'Error en la búsqueda de responsables';
                
                if (isset($response['error'])) {
                    $errorMessage = $response['error'];
                } elseif (isset($response['message'])) {
                    $errorMessage = $response['message'];
                } elseif (isset($response['mensaje'])) {
                    $errorMessage = $response['mensaje'];
                }

                // Log del error para debugging
                \Log::error('Error al buscar responsables - Response: ' . json_encode($response));

                return response()->json([
                    'status' => 500,
                    'data' => [],
                    'message' => $errorMessage
                ]);
            }

        } catch (\Exception $e) {
            // Log del error para debugging
            \Log::error('Excepción al buscar responsables: ' . $e->getMessage());
            
            return response()->json([
                'status' => 500,
                'data' => [],
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Guardar nuevo responsable
     * Envía el responsable a arabitocentral para almacenamiento
     */
    public function saveResponsable(Request $req)
    {
        try {
            $datos = [
                'tipo' => $req->tipo,
                'nombre' => $req->nombre,
                'apellido' => $req->apellido,
                'cedula' => $req->cedula,
                'telefono' => $req->telefono ?? '',
                'correo' => $req->correo ?? '',
                'direccion' => $req->direccion ?? ''
            ];

            // Validar campos obligatorios
            if (!$datos['nombre'] || !$datos['apellido'] || !$datos['cedula']) {
                return response()->json([
                    'status' => 400,
                    'data' => null,
                    'message' => 'Faltan campos obligatorios: nombre, apellido y cédula'
                ]);
            }

            // Comunicarse con central usando sendCentral
            $sendCentral = new \App\Http\Controllers\sendCentral();
            $response = $sendCentral->saveResponsableCentral($datos);
            

            // Verificar si la respuesta es exitosa
            if ($response && isset($response['success']) && $response['success'] === true) {
                return response()->json([
                    'status' => 200,
                    'data' => $response['data'],
                    'message' => 'Responsable guardado exitosamente en central'
                ]);
            } else {
                // Mostrar el error específico devuelto por central
                $errorMessage = 'Error al guardar responsable en central';
                
                if (isset($response['error'])) {
                    $errorMessage = $response['error'];
                } elseif (isset($response['message'])) {
                    $errorMessage = $response['message'];
                } elseif (isset($response['mensaje'])) {
                    $errorMessage = $response['mensaje'];
                }

                // Log del error para debugging
                \Log::error('Error al guardar responsable - Response: ' . json_encode($response));
                
                return response()->json([
                    'status' => 500,
                    'data' => null,
                    'message' => $errorMessage
                ]);
            }

        } catch (\Exception $e) {
            // Log del error para debugging
            \Log::error('Excepción al guardar responsable: ' . $e->getMessage());
            
            return response()->json([
                'status' => 500,
                'data' => null,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Obtener responsable por ID
     */
    public function getResponsableById(Request $req)
    {
        try {
            $id = $req->id;
            
            if (!$id) {
                return response()->json([
                    'status' => 400,
                    'data' => null,
                    'message' => 'ID de responsable requerido'
                ]);
            }

            // Comunicarse con central usando sendCentral
            $sendCentral = new \App\Http\Controllers\sendCentral();
            $response = $sendCentral->getResponsableCentral($id);

            // Verificar si la respuesta es exitosa
            if ($response && isset($response['success']) && $response['success'] === true) {
                return response()->json([
                    'status' => 200,
                    'data' => $response['data'],
                    'message' => 'Responsable encontrado'
                ]);
            } else {
                // Mostrar el error específico devuelto por central
                $errorMessage = 'Responsable no encontrado';
                
                if (isset($response['error'])) {
                    $errorMessage = $response['error'];
                } elseif (isset($response['message'])) {
                    $errorMessage = $response['message'];
                } elseif (isset($response['mensaje'])) {
                    $errorMessage = $response['mensaje'];
                }

                // Log del error para debugging
                \Log::error('Error al obtener responsable por ID - Response: ' . json_encode($response));

                return response()->json([
                    'status' => 404,
                    'data' => null,
                    'message' => $errorMessage
                ]);
            }

        } catch (\Exception $e) {
            // Log del error para debugging
            \Log::error('Excepción al obtener responsable por ID: ' . $e->getMessage());
            
            return response()->json([
                'status' => 500,
                'data' => null,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Obtener responsables por tipo
     */
    public function getResponsablesByTipo(Request $req)
    {
        try {
            $tipo = $req->tipo;
            
            if (!$tipo) {
                return response()->json([
                    'status' => 400,
                    'data' => [],
                    'message' => 'Tipo de responsable requerido'
                ]);
            }

            // Comunicarse con central usando sendCentral
            $sendCentral = new \App\Http\Controllers\sendCentral();
            $response = $sendCentral->getResponsablesTipoCentral($tipo);

            // Verificar si la respuesta es exitosa
            if ($response && isset($response['success']) && $response['success'] === true) {
                return response()->json([
                    'status' => 200,
                    'data' => $response['data'] ?? [],
                    'message' => 'Responsables encontrados',
                    'total' => count($response['data'] ?? [])
                ]);
            } else {
                // Mostrar el error específico devuelto por central
                $errorMessage = 'No se encontraron responsables de este tipo';
                
                if (isset($response['error'])) {
                    $errorMessage = $response['error'];
                } elseif (isset($response['message'])) {
                    $errorMessage = $response['message'];
                } elseif (isset($response['mensaje'])) {
                    $errorMessage = $response['mensaje'];
                }

                // Log del error para debugging
                \Log::error('Error al obtener responsables por tipo - Response: ' . json_encode($response));

                return response()->json([
                    'status' => 500,
                    'data' => [],
                    'message' => $errorMessage
                ]);
            }

        } catch (\Exception $e) {
            // Log del error para debugging
            \Log::error('Excepción al obtener responsables por tipo: ' . $e->getMessage());
            
            return response()->json([
                'status' => 500,
                'data' => [],
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ]);
        }
    }
} 