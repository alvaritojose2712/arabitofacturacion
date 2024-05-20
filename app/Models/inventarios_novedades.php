<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class inventarios_novedades extends Model
{
    use HasFactory;


    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function producto() { 
        return $this->hasOne('App\Models\inventario',"id","id_producto"); 
    }

    protected $fillable = [
        "id_producto",
        "codigo_barras",
        "codigo_proveedor",
        "descripcion",
        "precio_base",
        "precio",
        "cantidad",
        "responsable",
        "motivo",
        "estado",
        "id_proveedor",
        "id_categoria",
    ];
}
