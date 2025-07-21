import React, { useState, useEffect } from 'react';

const GarantiaConfig = ({ config, onSave, db }) => {
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState({
        connected: false,
        central_url: '',
        last_check: null,
        error: null
    });
    const [statistics, setStatistics] = useState({
        total: 0,
        pendientes: 0,
        aprobadas: 0,
        rechazadas: 0,
        finalizadas: 0
    });
    const [testResult, setTestResult] = useState(null);

    useEffect(() => {
        checkConnection();
        loadStatistics();
    }, []);

    const checkConnection = async () => {
        setLoading(true);
        try {
            const response = await db.checkGarantiaConnection();
            
            if (response.status === 200) {
                setConnectionStatus({
                    connected: response.data.connected || false,
                    central_url: response.data.central_url || '',
                    last_check: new Date().toLocaleString(),
                    error: null
                });
            }
        } catch (error) {
            console.error('Error al verificar conexión:', error);
            setConnectionStatus({
                connected: false,
                central_url: '',
                last_check: new Date().toLocaleString(),
                error: 'Error de conexión'
            });
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const response = await db.getGarantiaStats();
            
            if (response.status === 200 && response.data.success) {
                setStatistics(response.data.estadisticas || {
                    total: 0,
                    pendientes: 0,
                    aprobadas: 0,
                    rechazadas: 0,
                    finalizadas: 0
                });
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const testConnection = async () => {
        setLoading(true);
        setTestResult(null);
        
        try {
            // Test de conexión básica
            const connectionResponse = await db.checkGarantiaConnection();
            
            if (connectionResponse.status === 200 && connectionResponse.data.connected) {
                // Test de sincronización
                const syncResponse = await db.syncGarantias();
                
                if (syncResponse.status === 200 && syncResponse.data.success) {
                    setTestResult({
                        success: true,
                        message: 'Conexión exitosa. Sincronización funcionando correctamente.',
                        details: {
                            garantias_sincronizadas: syncResponse.data.garantias?.length || 0,
                            pendientes_central: syncResponse.data.pendientes_central?.length || 0
                        }
                    });
                } else {
                    setTestResult({
                        success: false,
                        message: 'Conexión establecida pero falló la sincronización',
                        details: { error: syncResponse.data.error || 'Error desconocido' }
                    });
                }
            } else {
                setTestResult({
                    success: false,
                    message: 'No se pudo establecer conexión con arabitocentral',
                    details: { error: connectionResponse.data.error || 'Servidor no disponible' }
                });
            }
        } catch (error) {
            setTestResult({
                success: false,
                message: 'Error durante la prueba de conexión',
                details: { error: error.message }
            });
        } finally {
            setLoading(false);
            // Actualizar estado de conexión después del test
            checkConnection();
        }
    };

    const forceSync = async () => {
        setLoading(true);
        try {
            const response = await db.syncGarantias();
            
            if (response.status === 200 && response.data.success) {
                alert('Sincronización forzada completada exitosamente');
                loadStatistics();
            } else {
                alert('Error en sincronización: ' + (response.data.error || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error en sincronización forzada:', error);
            alert('Error de conexión durante sincronización');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="garantia-config">
            <div className="row">
                {/* Panel de Estado de Conexión */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="fa fa-link me-2"></i>
                                Estado de Conexión
                            </h5>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={checkConnection}
                                disabled={loading}
                            >
                                <i className="fa fa-refresh me-1"></i>
                                Verificar
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <strong>Estado:</strong>
                                <span className={`badge ms-2 ${connectionStatus.connected ? 'bg-success' : 'bg-danger'}`}>
                                    {connectionStatus.connected ? 'Conectado' : 'Desconectado'}
                                </span>
                            </div>

                            <div className="mb-3">
                                <strong>URL Central:</strong>
                                <div className="text-muted small">
                                    {connectionStatus.central_url || 'No configurada'}
                                </div>
                            </div>

                            <div className="mb-3">
                                <strong>Última verificación:</strong>
                                <div className="text-muted small">
                                    {connectionStatus.last_check || 'Nunca'}
                                </div>
                            </div>

                            {connectionStatus.error && (
                                <div className="alert alert-danger py-2">
                                    <small>{connectionStatus.error}</small>
                                </div>
                            )}

                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={testConnection}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Probando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-flask me-2"></i>
                                            Probar Conexión
                                        </>
                                    )}
                                </button>

                                <button
                                    className="btn btn-info"
                                    onClick={forceSync}
                                    disabled={loading || !connectionStatus.connected}
                                >
                                    <i className="fa fa-sync me-2"></i>
                                    Sincronización Forzada
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Resultado del Test */}
                    {testResult && (
                        <div className="card mt-3">
                            <div className="card-header">
                                <h6 className="mb-0">
                                    <i className="fa fa-test-tube me-2"></i>
                                    Resultado del Test
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className={`alert ${testResult.success ? 'alert-success' : 'alert-danger'} py-2`}>
                                    <div className="d-flex align-items-center">
                                        <i className={`fa ${testResult.success ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                                        <strong>{testResult.message}</strong>
                                    </div>
                                </div>

                                {testResult.details && (
                                    <div className="mt-2">
                                        <small className="text-muted">Detalles:</small>
                                        <ul className="list-unstyled small">
                                            {Object.entries(testResult.details).map(([key, value]) => (
                                                <li key={key}>
                                                    <strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Panel de Estadísticas */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="fa fa-chart-bar me-2"></i>
                                Estadísticas
                            </h5>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={loadStatistics}
                                disabled={loading}
                            >
                                <i className="fa fa-refresh me-1"></i>
                                Actualizar
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-6 mb-3">
                                    <div className="border rounded p-3">
                                        <div className="h4 text-primary mb-0">{statistics.total}</div>
                                        <small className="text-muted">Total</small>
                                    </div>
                                </div>
                                <div className="col-6 mb-3">
                                    <div className="border rounded p-3">
                                        <div className="h4 text-sinapsis mb-0">{statistics.pendientes}</div>
                                        <small className="text-muted">Pendientes</small>
                                    </div>
                                </div>
                                <div className="col-6 mb-3">
                                    <div className="border rounded p-3">
                                        <div className="h4 text-success mb-0">{statistics.aprobadas}</div>
                                        <small className="text-muted">Aprobadas</small>
                                    </div>
                                </div>
                                <div className="col-6 mb-3">
                                    <div className="border rounded p-3">
                                        <div className="h4 text-secondary mb-0">{statistics.finalizadas}</div>
                                        <small className="text-muted">Finalizadas</small>
                                    </div>
                                </div>
                            </div>

                            {statistics.rechazadas > 0 && (
                                <div className="mt-2 text-center">
                                    <div className="border rounded p-2 bg-light">
                                        <div className="h6 text-danger mb-0">{statistics.rechazadas}</div>
                                        <small className="text-muted">Rechazadas</small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel de Información del Sistema */}
                    <div className="card mt-3">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <i className="fa fa-info-circle me-2"></i>
                                Información del Sistema
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12">
                                    <small className="text-muted">Sucursal:</small>
                                    <div>{config.nombre || 'No configurada'}</div>
                                </div>
                            </div>

                            <hr className="my-3" />

                            <h6>Funcionalidades Disponibles:</h6>
                            <ul className="list-unstyled small">
                                <li>
                                    <i className="fa fa-check text-success me-2"></i>
                                    Creación de solicitudes de garantía
                                </li>
                                <li>
                                    <i className="fa fa-check text-success me-2"></i>
                                    Sincronización automática con central
                                </li>
                                <li>
                                    <i className="fa fa-check text-success me-2"></i>
                                    Ejecución local de garantías aprobadas
                                </li>
                                <li>
                                    <i className="fa fa-check text-success me-2"></i>
                                    5 casos de uso de garantía/devolución
                                </li>
                                <li>
                                    <i className="fa fa-check text-success me-2"></i>
                                    Gestión de inventario automática
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel de Ayuda */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <i className="fa fa-question-circle me-2"></i>
                                Ayuda y Solución de Problemas
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6>Problemas Comunes:</h6>
                                    <ul className="small">
                                        <li><strong>Conexión fallida:</strong> Verificar conectividad a internet</li>
                                        <li><strong>Sincronización lenta:</strong> Usar sincronización forzada</li>
                                        <li><strong>Garantías no aparecen:</strong> Verificar estado de conexión</li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <h6>Estados de Garantía:</h6>
                                    <ul className="small">
                                        <li><span className="badge bg-warning text-dark">PENDIENTE</span> - Esperando aprobación</li>
                                        <li><span className="badge bg-success">APROBADA</span> - Lista para ejecutar</li>
                                        <li><span className="badge bg-danger">RECHAZADA</span> - No aprobada</li>
                                        <li><span className="badge bg-secondary">FINALIZADA</span> - Ejecutada completamente</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GarantiaConfig; 