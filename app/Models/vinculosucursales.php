<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class vinculosucursales extends Model
{
    protected $fillable = [
        "idinsucursal",
        "id_sucursal",
        "id_producto",
    ];
    use HasFactory;
}
