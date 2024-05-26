<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class retenciones extends Model
{
    use HasFactory;
    protected $fillable = [
        "id_pedido",
        "monto",
        "descripcion",
        "num",
    ];
}
