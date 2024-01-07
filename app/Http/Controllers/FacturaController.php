<?php

namespace App\Http\Controllers;

use App\Models\factura;
use App\Models\proveedores;
use App\Models\sucursal;
use Illuminate\Http\Request;
use Response;
class FacturaController extends Controller
{      
    public function verFactura(Request $req)
    {
        $id = $req->id;
        $factura = factura::with(["proveedor","items"=>function($q){
            $q->with("producto");
        }])
        ->find($id);

        $factura->items->map(function($q)
        {   
            $q->subtotal = number_format($q->producto->precio*$q->cantidad,2);
            return $q;
        });
        $factura->monto = number_format($factura->monto,2);

        $sucursal = sucursal::all()->first();

        return view("reportes.factura",["factura"=>$factura,"sucursal"=>$sucursal]);
    }
    public function getFacturas(Request $req)
    {
        $factqBuscar = $req->factqBuscar;
        $factqBuscarDate = $req->factqBuscarDate;
        $factOrderBy = $req->factOrderBy;
        $factOrderDescAsc = $req->factOrderDescAsc;

        $fa = [];
        if ($factqBuscarDate=="") {
            $fa = factura::with(["proveedor","items"=>function($q){
                $q->with("producto");
            }])
            ->where("descripcion","LIKE","$factqBuscar%")
            ->orWhere("numfact","LIKE","$factqBuscar%")
                ->orderBy($factOrderBy,$factOrderDescAsc)
                ->limit(20)
                ->get();
        }else{
            $fa = factura::with(["proveedor","items"=>function($q){
                $q->with("producto");
            }])->where("descripcion","LIKE","$factqBuscar%")->where("created_at","LIKE","$factqBuscarDate%")
                ->orderBy($factOrderBy,$factOrderDescAsc)
                ->limit(20)
                ->get();
        }

        return $fa->map(function($q){
            $sub = $q->items->map(function($q)
            {   
                $base = $q->producto->precio_base*$q->cantidad;
                $venta = $q->producto->precio*$q->cantidad;
                // $q->subtotal = number_format($venta,2);
                // $q->subtotal_base = number_format($base,2);

                $q->subtotal_clean = $venta;
                $q->subtotal_base_clean = $base;
                return $q;
            });
            
            $venta = $sub->sum("subtotal_clean");
            $base = $sub->sum("subtotal_base_clean");

            // $q->summonto = number_format($venta,2); 
            $q->summonto_clean = $venta; 


            // $q->summonto_base = number_format($base,2); 
            $q->summonto_base_clean = $base; 
            return $q;
        });
    }
    public function saveMontoFactura(Request $req)
    {
        $fact = factura::find($req->id);
        $fact->monto = $req->monto;
        $fact->save();
    }
    public function setFactura(Request $req)
    {
        try {
            $id = $req->id;
            $factInpid_proveedor = $req->factInpid_proveedor;
            $factInpnumfact = $req->factInpnumfact;
            $factInpdescripcion = $req->factInpdescripcion;
            $factInpmonto = $req->factInpmonto;
            $factInpfechavencimiento = $req->factInpfechavencimiento;
            
            $id_usuario = session("id_usuario");



            foreach ($req->allProveedoresCentral as $key => $provcentral) {
                if ($provcentral["id"] == $factInpid_proveedor) {
                        $id_proveedor = proveedores::updateOrCreate([
                            "rif" => $provcentral["rif"]
                        ],[
                            "descripcion" => $provcentral["descripcion"],
                            "rif" => $provcentral["rif"],
                            "direccion" => $provcentral["direccion"],
                            "telefono" => $provcentral["telefono"],
                        ]);  
                        
                        if ($id_proveedor) {
                            factura::updateOrCreate(
                                ["id" => $id],
                                [
                                    "id_proveedor" => $id_proveedor->id,
                                    "numfact" => $factInpnumfact,
                                    "descripcion" => $factInpdescripcion,
                                    "monto" => $factInpmonto,
                                    "fechavencimiento" => $factInpfechavencimiento,
                                    
                                    "numnota" => $req->factInpnumnota,
                                    "subtotal" => $req->factInpsubtotal,
                                    "descuento" => $req->factInpdescuento,
                                    "monto_gravable" => $req->factInpmonto_gravable,
                                    "monto_exento" => $req->factInpmonto_exento,
                                    "iva" => $req->factInpiva,
                                    "fechaemision" => $req->factInpfechaemision,
                                    "fecharecepcion" => $req->factInpfecharecepcion,
                                    "nota" => $req->factInpnota,
                                    "id_usuario" => $id_usuario,
                                    "estatus" => 0,
                                ]
                
                            );
                            return Response::json(["msj"=>"Éxito","estado"=>true]);
                        }
                    break;
                }
            }



            
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
        }
      
    }

    public function delFactura(Request $req)
    {
        try {
            $id = $req->id;
            factura::find($id)->delete();
            return Response::json(["msj"=>"Éxito al eliminar","estado"=>true]);

            
        } catch (\Exception $e) {
            return Response::json(["msj"=>"Error: ".$e->getMessage(),"estado"=>false]);
            
        }
    }

    
    

}
