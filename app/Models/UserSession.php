<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'session_id',
        'ip_address',
        'user_agent',
        'last_activity',
        'is_active',
        'legacy_session_data'
    ];

    protected $casts = [
        'last_activity' => 'datetime',
        'is_active' => 'boolean',
        'legacy_session_data' => 'array'
    ];

    /**
     * Relación con el usuario
     */
    public function usuario()
    {
        return $this->belongsTo(usuarios::class, 'usuario_id');
    }

    /**
     * Scope para sesiones activas
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope para sesiones recientes (últimas 8 horas)
     */
    public function scopeRecent($query)
    {
        return $query->where('last_activity', '>', now()->subHours(8));
    }

    /**
     * Verificar si la sesión está expirada
     */
    public function isExpired(): bool
    {
        return $this->last_activity < now()->subHours(8);
    }

    /**
     * Actualizar última actividad
     */
    public function updateActivity(): void
    {
        $this->update(['last_activity' => now()]);
    }

    /**
     * Invalidar sesión
     */
    public function invalidate(): void
    {
        $this->update(['is_active' => false]);
    }
}
