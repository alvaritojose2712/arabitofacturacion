<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use DateTimeInterface;

class factura extends Model
{
    use HasFactory;
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function proveedor() { 
        return $this->hasOne(\App\Models\proveedores::class,"id","id_proveedor"); 
    }
    public function items() { 
        return $this->hasMany('App\Models\items_factura',"id_factura","id"); 
    }
   
    protected $fillable = [
        "id",
        "id_proveedor",
        "numfact",
        "numnota",
        "descripcion",
        "subtotal",
        "descuento",
        "monto_exento",
        "monto_gravable",
        "iva",
        "monto",
        "fechaemision",
        "fechavencimiento",
        "fecharecepcion",
        "estatus",
        "nota",
        "id_usuario",
    ];
}
