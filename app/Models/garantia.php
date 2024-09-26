<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class garantia extends Model
{
    use HasFactory;
     protected $fillable = [
        "cantidad",
        "id_producto",
        "id_pedido",
        "motivo",

        "cantidad_salida",
        "motivo_salida",
        "ci_cajero",
        "ci_autorizo",
        "dias_desdecompra",
        "ci_cliente",
        "telefono_cliente",
        "nombre_cliente",
        "nombre_cajero",
        "nombre_autorizo",
        "trajo_factura",
        "motivonotrajofact",
        "numfactoriginal",
        "numfactgarantia",
    ];


    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function producto() { 
        return $this->hasOne('App\Models\inventario',"id","id_producto"); 
    }
}
