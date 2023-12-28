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

    public function responsable() { 
        return $this->hasOne('App\Models\catcajas',"id","responsable"); 
    }

    public function asignar() { 
        return $this->hasOne('App\Models\catcajas',"id","asignar"); 
    }
    protected $fillable = [
        "concepto",
        "categoria",
        
        "dolarbalance",
        "montodolar",
        "montopeso",
        "pesobalance",
        "montobs",
        "bsbalance",

        "montoeuro",
        "eurobalance",

        "tipo",
        "fecha",
        "estatus",
    ];

    public function cat() { 
        return $this->hasOne(\App\Models\catcajas::class,"indice","categoria"); 
    }
}
