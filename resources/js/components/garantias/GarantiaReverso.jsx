import React, { useState, useEffect } from 'react';
import db from '../../database/database';

const GarantiaReverso = () => {
    const [numeroSolicitud, setNumeroSolicitud] = useState('');
    const [solicitud, setSolicitud] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [motivo, setMotivo] = useState('');
    const [detalles, setDetalles] = useState('');

    const buscarSolicitud = async () => {
        if (!numeroSolicitud.trim()) {
            setError('Debe ingresar un número de solicitud');
            return;
        }

        setLoading(true);
        setError('');
        setSolicitud(null);

        try {
            const response = await db.buscarSolicitudGarantia({ numero: numeroSolicitud });
            
            if (response.status === 200 && response.data.success) {
                setSolicitud(response.data.solicitud);
                setSuccess('Solicitud encontrada. Puede proceder con la solicitud de reverso.');
            } else {
                setError(response.data.message || 'No se encontró la solicitud');
            }
        } catch (error) {
            console.error('Error buscando solicitud:', error);
            setError(error.response?.data?.message || 'Error al buscar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    const solicitarReverso = async () => {
        if (!solicitud) {
            setError('Debe buscar una solicitud primero');
            return;
        }

        if (!motivo.trim()) {
            setError('Debe especificar un motivo para el reverso');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await db.solicitarReversoGarantia({
                solicitud_id: solicitud.id,
                motivo: motivo,
                detalles: detalles,
                datos_originales: {
                    solicitud: solicitud,
                    fecha_solicitud: new Date().toISOString()
                }
            });

            if (response.status === 200 && response.data.success) {
                setSuccess('Solicitud de reverso enviada exitosamente. Esperando aprobación de central.');
                setSolicitud(null);
                setNumeroSolicitud('');
                setMotivo('');
                setDetalles('');
            } else {
                setError(response.data.message || 'Error al solicitar el reverso');
            }
        } catch (error) {
            console.error('Error solicitando reverso:', error);
            setError('Error al solicitar el reverso');
        } finally {
            setLoading(false);
        }
    };

    const limpiarFormulario = () => {
        setNumeroSolicitud('');
        setSolicitud(null);
        setMotivo('');
        setDetalles('');
        setError('');
        setSuccess('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
                    <div className="px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <i className="fa fa-undo mr-3 text-red-600"></i>
                            Reverso de Garantías
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Solicite la reversión de una garantía ejecutada. El proceso requiere aprobación de central.
                        </p>
                    </div>
                </div>

                {/* Formulario de búsqueda */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            <i className="fa fa-search mr-2 text-blue-600"></i>
                            Buscar Solicitud de Garantía
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de Solicitud
                                </label>
                                <input
                                    type="text"
                                    value={numeroSolicitud}
                                    onChange={(e) => setNumeroSolicitud(e.target.value)}
                                    placeholder="Ingrese el número de solicitud"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={buscarSolicitud}
                                    disabled={loading || !numeroSolicitud.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <i className="fa fa-spinner fa-spin mr-2"></i>
                                    ) : (
                                        <i className="fa fa-search mr-2"></i>
                                    )}
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información de la solicitud encontrada */}
                {solicitud && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                            <h2 className="text-lg font-semibold text-green-900">
                                <i className="fa fa-check-circle mr-2"></i>
                                Solicitud Encontrada
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Información General</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-xs text-gray-500">ID:</span>
                                            <div className="font-mono text-sm">{solicitud.id}</div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">Tipo:</span>
                                            <div className="text-sm">{solicitud.tipo_solicitud}</div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">Estatus:</span>
                                            <div className="text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    solicitud.estatus === 'FINALIZADA' ? 'bg-green-100 text-green-800' :
                                                    solicitud.estatus === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {solicitud.estatus}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">Fecha Solicitud:</span>
                                            <div className="text-sm">{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Detalles de Productos</h3>
                                    <div className="space-y-2">
                                        {solicitud.productos_data && (
                                            <div>
                                                <span className="text-xs text-gray-500">Productos:</span>
                                                <div className="text-sm">
                                                    {JSON.parse(solicitud.productos_data).length} producto(s)
                                                </div>
                                            </div>
                                        )}
                                        {solicitud.monto_total_devolucion && (
                                            <div>
                                                <span className="text-xs text-gray-500">Monto Total:</span>
                                                <div className="text-sm font-semibold">${solicitud.monto_total_devolucion}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Formulario de solicitud de reverso */}
                {solicitud && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                            <h2 className="text-lg font-semibold text-red-900">
                                <i className="fa fa-exclamation-triangle mr-2"></i>
                                Solicitar Reverso
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Motivo del Reverso <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="">Seleccione un motivo</option>
                                        <option value="ERROR_EN_EJECUCION">Error en la ejecución</option>
                                        <option value="PRODUCTO_INCORRECTO">Producto incorrecto entregado</option>
                                        <option value="CLIENTE_ARREPENTIDO">Cliente se arrepintió</option>
                                        <option value="PROBLEMA_TECNICO">Problema técnico</option>
                                        <option value="OTRO">Otro motivo</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Detalles Adicionales
                                    </label>
                                    <textarea
                                        value={detalles}
                                        onChange={(e) => setDetalles(e.target.value)}
                                        rows={4}
                                        placeholder="Describa los detalles del reverso..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                    <div className="flex">
                                        <i className="fa fa-info-circle text-yellow-500 mr-2 mt-1"></i>
                                        <div className="text-sm text-yellow-700">
                                            <p className="font-medium">Importante:</p>
                                            <ul className="mt-1 list-disc list-inside">
                                                <li>El reverso requiere aprobación de central</li>
                                                <li>Se eliminarán todos los registros relacionados (pedidos, pagos, inventario)</li>
                                                <li>Los productos se devolverán al inventario original</li>
                                                <li>Esta acción no se puede deshacer una vez aprobada</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={solicitarReverso}
                                        disabled={loading || !motivo.trim()}
                                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <i className="fa fa-spinner fa-spin mr-2"></i>
                                        ) : (
                                            <i className="fa fa-undo mr-2"></i>
                                        )}
                                        Solicitar Reverso
                                    </button>
                                    <button
                                        onClick={limpiarFormulario}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        <i className="fa fa-times mr-2"></i>
                                        Limpiar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mensajes de estado */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <i className="fa fa-exclamation-circle text-red-500 mr-2 mt-1"></i>
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <i className="fa fa-check-circle text-green-500 mr-2 mt-1"></i>
                            <div className="text-sm text-green-700">{success}</div>
                        </div>
                    </div>
                )}

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                        <i className="fa fa-info-circle text-blue-500 mr-2 mt-1"></i>
                        <div className="text-sm text-blue-700">
                            <p className="font-medium">Proceso de Reverso:</p>
                            <ol className="mt-1 list-decimal list-inside space-y-1">
                                <li>Busque la solicitud de garantía por número</li>
                                <li>Complete el formulario de solicitud de reverso</li>
                                <li>La solicitud se envía a central para aprobación</li>
                                <li>Una vez aprobada, se ejecuta automáticamente el reverso</li>
                                <li>Se eliminan pedidos, pagos y se restaura inventario</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GarantiaReverso; 