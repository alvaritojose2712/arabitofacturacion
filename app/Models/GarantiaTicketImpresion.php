<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GarantiaTicketImpresion extends Model
{
    use HasFactory;

    protected $table = 'garantia_ticket_impresiones';

    protected $fillable = [
        'solicitud_garantia_id',
        'usuario_id',
        'tipo_impresion',
        'numero_impresion',
        'datos_impresion',
        'fecha_impresion',
        'ip_impresion',
        'observaciones'
    ];

    protected $casts = [
        'datos_impresion' => 'array',
        'fecha_impresion' => 'datetime'
    ];

    // Relación con solicitud de garantía
    public function solicitudGarantia()
    {
        return $this->belongsTo(SolicitudGarantia::class, 'solicitud_garantia_id');
    }

    // Relación con usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // Scope para obtener impresiones de una solicitud
    public function scopeBySolicitud($query, $solicitudId)
    {
        return $query->where('solicitud_garantia_id', $solicitudId);
    }

    // Scope para obtener originales
    public function scopeOriginales($query)
    {
        return $query->where('tipo_impresion', 'ORIGINAL');
    }

    // Scope para obtener copias
    public function scopeCopias($query)
    {
        return $query->where('tipo_impresion', 'COPIA');
    }

    // Método para obtener el próximo número de impresión
    public static function getNextPrintNumber($solicitudId)
    {
        $lastPrint = self::where('solicitud_garantia_id', $solicitudId)
            ->orderBy('numero_impresion', 'desc')
            ->first();

        return $lastPrint ? $lastPrint->numero_impresion + 1 : 1;
    }

    // Método para determinar si es original o copia
    public static function getTipoImpresion($numeroImpresion)
    {
        return $numeroImpresion == 1 ? 'ORIGINAL' : 'COPIA';
    }
} 