<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class garantia extends Model
{
    use HasFactory;

    protected $fillable = [
        // Campos que realmente existen en la tabla (según la migración)
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

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    // Relación con producto local
    public function producto() { 
        return $this->hasOne('App\Models\inventario',"id","id_producto"); 
    }

    // Relación con pedido (para casos de salida de dinero)
    public function pedido() { 
        return $this->hasOne('App\Models\pedidos',"id","id_pedido"); 
    }
}
