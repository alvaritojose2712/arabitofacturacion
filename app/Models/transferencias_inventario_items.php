<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class transferencias_inventario_items extends Model
{
    use HasFactory;
    protected $fillable = ['id_transferencia', 'id_producto', 'cantidad', 'cantidad_original_stock_inventario'];

    public function transferencia()
    {
        return $this->belongsTo(transferencias_inventario::class, 'id_transferencia');
    }
}
