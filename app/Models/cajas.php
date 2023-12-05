<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;


class cajas extends Model
{
    use HasFactory;
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
    protected $fillable = [
        "concepto",
        "categoria",
        
        "montodolar",
        "montopeso",
        "montobs",
        
        "dolarbalance",
        "pesobalance",
        "bsbalance",

        "tipo",
        "fecha"
    ];

    public function cat() { 
        return $this->hasOne(\App\Models\catcajas::class,"indice","categoria"); 
    }
}
