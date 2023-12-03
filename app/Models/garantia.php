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
    ];


    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function producto() { 
        return $this->hasOne('App\Models\inventario',"id","id_producto"); 
    }
}
