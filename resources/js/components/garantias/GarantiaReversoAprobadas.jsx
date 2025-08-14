import React, { useState, useEffect } from 'react';
import db from '../../database/database';

const GarantiaReversoAprobadas = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [ejecutando, setEjecutando] = useState(null);

    const buscarSolicitudesAprobadas = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/garantia-reverso/listar-solicitudes-aprobadas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();

            if (data.success) {
                setSolicitudes(data.data || []);
                if (data.data && data.data.length > 0) {
                    setSuccess(`Se encontraron ${data.data.length} solicitudes de reverso aprobadas`);
                } else {
                    setSuccess('No hay solicitudes de reverso aprobadas pendientes de ejecución');
                }
            } else {
                setError(data.message || 'Error al obtener las solicitudes de reverso');
            }
        } catch (error) {
            console.error('Error buscando solicitudes:', error);
            setError('Error al buscar las solicitudes de reverso');
        } finally {
            setLoading(false);
        }
    };

    const ejecutarReverso = async (solicitudId) => {
        setEjecutando(solicitudId);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/garantia-reverso/ejecutar-reverso-completo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ 
                    solicitud_reverso_id: solicitudId
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Reverso ejecutado exitosamente');
                // Remover la solicitud de la lista
                setSolicitudes(prev => prev.filter(s => s.id !== solicitudId));
            } else {
                setError(data.message || 'Error al ejecutar el reverso');
            }
        } catch (error) {
            console.error('Error ejecutando reverso:', error);
            setError('Error al ejecutar el reverso');
        } finally {
            setEjecutando(null);
        }
    };

    const limpiarMensajes = () => {
        setError('');
        setSuccess('');
    };

    const formatearFecha = (fecha) => {
        try {
            return new Date(fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return fecha;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
                    <div className="px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <i className="fa fa-check-circle mr-3 text-green-600"></i>
                            Solicitudes de Reverso Aprobadas
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Ejecute las solicitudes de reverso que han sido aprobadas por central.
                        </p>
                    </div>
                </div>

                {/* Botón de búsqueda */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            <i className="fa fa-search mr-2 text-blue-600"></i>
                            Buscar Solicitudes Aprobadas
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-center">
                            <button
                                onClick={buscarSolicitudesAprobadas}
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
                            >
                                {loading ? (
                                    <i className="fa fa-spinner fa-spin mr-2"></i>
                                ) : (
                                    <i className="fa fa-search mr-2"></i>
                                )}
                                Buscar Solicitudes Aprobadas
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 text-center mt-3">
                            El sistema obtendrá automáticamente las solicitudes de reverso aprobadas para esta sucursal
                        </p>
                    </div>
                </div>

                {/* Lista de solicitudes */}
                {solicitudes.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                            <h2 className="text-lg font-semibold text-green-900">
                                <i className="fa fa-list mr-2"></i>
                                Solicitudes de Reverso Aprobadas ({solicitudes.length})
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Solicitud Garantía
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Motivo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha Solicitud
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha Aprobación
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {solicitudes.map((solicitud) => (
                                        <tr key={solicitud.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{solicitud.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                #{solicitud.solicitud_garantia_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="max-w-xs">
                                                    <div className="font-medium">{solicitud.motivo_solicitud}</div>
                                                    {solicitud.detalles && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {solicitud.detalles}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatearFecha(solicitud.fecha_solicitud)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatearFecha(solicitud.fecha_aprobacion)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => ejecutarReverso(solicitud.id)}
                                                    disabled={ejecutando === solicitud.id}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {ejecutando === solicitud.id ? (
                                                        <i className="fa fa-spinner fa-spin mr-2"></i>
                                                    ) : (
                                                        <i className="fa fa-play mr-2"></i>
                                                    )}
                                                    {ejecutando === solicitud.id ? 'Ejecutando...' : 'Ejecutar Reverso'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Mensajes de estado */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex justify-between items-start">
                            <div className="flex">
                                <i className="fa fa-exclamation-circle text-red-500 mr-2 mt-1"></i>
                                <div className="text-sm text-red-700">{error}</div>
                            </div>
                            <button
                                onClick={limpiarMensajes}
                                className="text-red-400 hover:text-red-600"
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                        <div className="flex justify-between items-start">
                            <div className="flex">
                                <i className="fa fa-check-circle text-green-500 mr-2 mt-1"></i>
                                <div className="text-sm text-green-700">{success}</div>
                            </div>
                            <button
                                onClick={limpiarMensajes}
                                className="text-green-400 hover:text-green-600"
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                    </div>
                )}

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                        <i className="fa fa-info-circle text-blue-500 mr-2 mt-1"></i>
                        <div className="text-sm text-blue-700">
                            <p className="font-medium">Proceso de Ejecución de Reversos:</p>
                            <ol className="mt-1 list-decimal list-inside space-y-1">
                                <li>Las solicitudes de reverso se aprueban en arabitocentral</li>
                                <li>Use el botón "Buscar Solicitudes Aprobadas" para obtener la lista actualizada</li>
                                <li>Haga click en "Ejecutar Reverso" para cada solicitud aprobada</li>
                                <li>El sistema ejecutará automáticamente el reverso completo</li>
                                <li>Se eliminarán pedidos, pagos y se restaurará el inventario</li>
                                <li>La solicitud se marcará como ejecutada en central</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GarantiaReversoAprobadas; 