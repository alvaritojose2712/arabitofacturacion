<?php

namespace App\Http\Controllers;

use App\Models\pagos_referencias;
use App\Models\pedidos;
use Illuminate\Http\Request;
use Response;

class PagosReferenciasController extends Controller
{

    public function sendRefToMerchant(Request $req)
    {
        $id_ref = $req->id_ref;
        $ref = pagos_referencias::find($id_ref);

        if (!$ref) {
            return Response::json(["estado" => false, "msj" => "Referencia no encontrada"]);
        }

        try {
            $client = new \GuzzleHttp\Client();
            $montoFormatted = number_format($ref->monto, 2, '', '');
            
            $response = $client->post('http://localhost:8085/vpos/metodo', [
                'json' => [
                    'accion' => "tarjeta",
                    'montoTransaccion' => $montoFormatted,
                    'cedula' => $ref->cedula,
                ]
            ]);

            if ($response->getStatusCode() == 200) {
                // Obtener la respuesta del servicio externo
                $responseBody = json_decode($response->getBody()->getContents(), true);
                
                // La respuesta real está dentro del campo "response"
                $responseData = $responseBody['response'] ?? $responseBody;
                
                // Log para debug
                \Log::info("DEBUG - Validación referencia:", [
                    'responseBody_completo' => $responseBody,
                    'responseData_extraido' => $responseData,
                    'codRespuesta' => $responseData['codRespuesta'] ?? 'NO_EXISTE',
                    'numeroReferencia' => $responseData['numeroReferencia'] ?? 'NO_EXISTE'
                ]);
                
                // Determinar el estado basado en codRespuesta
                $estatus = 'pendiente';
                $mensaje = $responseData['mensajeRespuesta'] ?? 'Sin mensaje de respuesta';

                if (isset($responseData['codRespuesta'])) {
                    if ($responseData['codRespuesta'] === '00') {
                        $estatus = 'aprobada';
                        
                        // Guardar la numeroReferencia en el campo descripcion
                        if (isset($responseData['numeroReferencia'])) {
                            $ref->descripcion = $responseData['numeroReferencia'];
                        }
                        
                        // Actualizar información del banco si está disponible
                        if (isset($responseData['nombreAutorizador'])) {
                            $ref->banco = $responseData['nombreAutorizador'];
                        }
                        
                    } elseif ($responseData['codRespuesta'] === 'VE') {
                        $estatus = 'rechazada';
                    } elseif ($responseData['codRespuesta'] === 'VP') {
                        $estatus = 'pendiente';
                    } else {
                        $estatus = 'error';
                    }
                } else {
                    // Si no hay codRespuesta, tratar como error
                    $estatus = 'error';
                    $mensaje = 'Respuesta inválida del servidor de pagos';
                }

                // Actualizar la referencia con la respuesta completa y el estado
                $ref->response = json_encode($responseBody);
                $ref->estatus = $estatus;
                $ref->save();
                
                // Log para confirmar qué se guardó
                \Log::info("DEBUG - Referencia guardada:", [
                    'id_referencia' => $ref->id,
                    'estatus_guardado' => $ref->estatus,
                    'descripcion_guardada' => $ref->descripcion,
                    'banco_guardado' => $ref->banco
                ]);
                
                return Response::json([
                    "estado" => true,
                    "msj" => $mensaje,
                    "estatus" => $estatus
                ]);
            } else {
                return Response::json(["estado" => false, "msj" => "Error: " . $response->getBody()]);
            }
        } catch (\Exception $e) {
            return Response::json(["estado" => false, "msj" => "Error: " . $e->getMessage()]);
        }
    }
    public function addRefPago(Request $req)
    {
         try {
            $check = true;
            (new PedidosController)->checkPedidoAuth($req->id_pedido);
            
            
            if (isset($req->check)) {
                if ($req->check==false) {
                    $check = false;
                }
            }
            if ($check) {
                $checkPedidoPago = (new PedidosController)->checkPedidoPago($req->id_pedido);
                if ($checkPedidoPago!==true) {
                    return $checkPedidoPago;
                }
            }
            
            $check_exist = pagos_referencias::where("descripcion",$req->descripcion)->where("banco",$req->banco)->first();

          /*   if ($check_exist) {
                return Response::json(["msj"=>"Error: Ya existe Referencia en Banco. ".$req->descripcion." ".$req->banco." PEDIDO ".$req->id_pedido,"estado"=>false]);

            } */
            if (floatval($req->monto) == 0) {
                return Response::json(["msj" => "Error: El monto no puede ser cero", "estado" => false]);
            }
            // Validar que el monto sea un número con hasta dos decimales (formato xxx.xx)
            // Permitir también montos negativos con hasta dos decimales
            if (!preg_match('/^-?\d+(\.\d{1,2})?$/', $req->monto)) {
                return Response::json([
                    "msj" => "Error: El monto debe ser un número (positivo o negativo) con hasta dos decimales (ejemplo: 123.45 o -123.45)",
                    "estado" => false
                ]);
            }
            $item = new pagos_referencias;
          
            $item->tipo = $req->tipo;
            $item->monto = $req->monto;
            $item->id_pedido = $req->id_pedido;
            $item->cedula = $req->cedula;
            $item->telefono = $req->telefono;
            $item->descripcion = $req->descripcion ?? null;
            $item->banco = $req->banco ?? null;
            $item->estatus = 'pendiente'; // Estado inicial
            $item->save();

            return Response::json(["msj"=>"¡Éxito!","estado"=>true]);
            
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
        }
    }
    public function delRefPago(Request $req)
    {
         try {
            $id = $req->id;
            $pagos_referencias = pagos_referencias::find($id);

            (new PedidosController)->checkPedidoAuth($pagos_referencias->id_pedido);
            $checkPedidoPago = (new PedidosController)->checkPedidoPago($pagos_referencias->id_pedido);
            if ($checkPedidoPago!==true) {
                return $checkPedidoPago;
            }

            if ($pagos_referencias) {
                
                $pagos_referencias->delete();
                return Response::json(["msj"=>"Éxito al eliminar","estado"=>true]);
            }


            
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
            
        }
    }


    function getReferenciasElec(Request $req) {
        $fecha1pedido = $req->fecha1pedido;
        $fecha2pedido = $req->fecha2pedido;

        $id_vendedor =  session("id_usuario");
        $tipo_usuario =  session("tipo_usuario");


        
        $gets = pagos_referencias::when(($tipo_usuario!=1),function($q) use($id_vendedor) {
            $q->whereIn("id_pedido",function ($q) use ($id_vendedor) {
                $q->from("pedidos")->where("id_vendedor",$id_vendedor)->select("id");
            });
        })->whereBetween("created_at", ["$fecha1pedido 00:00:00", "$fecha2pedido 23:59:59"]);

        $arr = [
            "refs" => $gets->get()->map(function($q){
                $ped = pedidos::with("vendedor")->where("id",$q->id_pedido)->first();
                $q->vendedorUser = $ped->vendedor->usuario;
                return $q;
            }),
            "total" => $gets->sum("monto")
        ];
        return $arr;
    }
}
