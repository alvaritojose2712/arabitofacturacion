<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class SolicitudGarantia extends Model
{
    use HasFactory;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    // Constantes para tipos de solicitud
    const TIPO_GARANTIA = 'GARANTIA';
    const TIPO_DEVOLUCION = 'DEVOLUCION';

    // Constantes para estatus
    const STATUS_PENDIENTE = 'PENDIENTE';
    const STATUS_APROBADA = 'APROBADA';
    const STATUS_RECHAZADA = 'RECHAZADA';
    const STATUS_FINALIZADA = 'FINALIZADA';

    // Casos de uso del sistema
    const CASO_USO_GARANTIA_SIMPLE = 1;
    const CASO_USO_GARANTIA_CON_DIFERENCIA = 2;
    const CASO_USO_DEVOLUCION_DINERO = 3;
    const CASO_USO_CAMBIO_MODELO = 4;
    const CASO_USO_MIXTO = 5;

    protected $fillable = [
        'sucursal_id',
        'factura_venta_id',
        'foto_factura_url',
        'tipo_solicitud',
        'motivo_devolucion',
        'dias_transcurridos_compra',
        'trajo_factura',
        'motivo_no_factura',
        'detalles_adicionales',
        'estatus',
        'cliente_id',
        'cajero_id',
        'supervisor_id',
        'dici_id',
        'gerente_id',
        'monto_devolucion_dinero',
        'caso_uso',
        'productos_data',
        'garantia_data',
        'metodos_devolucion',
        'transferencias_validadas',
        'monto_total_devolucion',
        'fecha_solicitud',
        'usuario_solicitud',
        'requiere_aprobacion',
        'incluye_metodos_pago',
        'inventario_afectado',
        'motivo_reversion',
        'detalles_reversion',
        'fecha_reversion',
        'usuario_reversion',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'productos_data' => 'array',
        'garantia_data' => 'array',
        'metodos_devolucion' => 'array',
        'transferencias_validadas' => 'array',
        'inventario_afectado' => 'array',
        'trajo_factura' => 'boolean',
        'requiere_aprobacion' => 'boolean',
        'incluye_metodos_pago' => 'boolean',
        'monto_devolucion_dinero' => 'decimal:2',
        'monto_total_devolucion' => 'decimal:2',
        'fecha_solicitud' => 'datetime',
        'fecha_reversion' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relaciones con otros modelos locales
    public function sucursal() { 
        return $this->belongsTo(\App\Models\sucursal::class, 'sucursal_id', 'id'); 
    }

    /**
     * Obtener descripción del caso de uso
     */
    public static function getDescripcionCasoUso($casoUso)
    {
        switch ($casoUso) {
            case self::CASO_USO_GARANTIA_SIMPLE:
                return 'Garantía Simple - Producto por Producto';
            case self::CASO_USO_GARANTIA_CON_DIFERENCIA:
                return 'Garantía con Diferencia - Producto + Dinero';
            case self::CASO_USO_DEVOLUCION_DINERO:
                return 'Devolución Total - Solo Dinero';
            case self::CASO_USO_CAMBIO_MODELO:
                return 'Cambio de Modelo - Producto por Producto Diferente';
            case self::CASO_USO_MIXTO:
                return 'Caso Mixto - Múltiples Productos/Pagos';
            default:
                return 'Caso de Uso No Definido';
        }
    }

    /**
     * Obtener el atributo puede_ejecutarse
     */
    public function getPuedeEjecutarseAttribute()
    {
        return $this->estatus === self::STATUS_APROBADA;
    }

    /**
     * Obtener el atributo es_pendiente
     */
    public function getEsPendienteAttribute()
    {
        return $this->estatus === self::STATUS_PENDIENTE;
    }

    /**
     * Marcar como finalizada
     */
    public function finalizar()
    {
        $this->estatus = self::STATUS_FINALIZADA;
        $this->save();
    }

    /**
     * Aprobar solicitud
     */
    public function aprobar($gerenteId = null)
    {
        $this->estatus = self::STATUS_APROBADA;
        if ($gerenteId) {
            $this->gerente_id = $gerenteId;
        }
        $this->save();
    }

    /**
     * Rechazar solicitud
     */
    public function rechazar($gerenteId = null)
    {
        $this->estatus = self::STATUS_RECHAZADA;
        if ($gerenteId) {
            $this->gerente_id = $gerenteId;
        }
        $this->save();
    }
} 