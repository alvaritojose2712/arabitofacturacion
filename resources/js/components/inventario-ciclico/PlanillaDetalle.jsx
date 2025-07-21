import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BuscarProductoModal from './BuscarProductoModal';

const PlanillaDetalle = ({ planilla, onBack, sucursalConfig }) => {
    const [planillaData, setPlanillaData] = useState(planilla);
    const [loading, setLoading] = useState(false);
    const [showBuscarModal, setShowBuscarModal] = useState(false);
    const [editingDetalle, setEditingDetalle] = useState(null);
    const [editForm, setEditForm] = useState({ cantidad_fisica: '', observaciones: '' });

    useEffect(() => {
        loadPlanillaDetalle();
    }, [planilla.id]);

    const loadPlanillaDetalle = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/inventario-ciclico/planillas/${planilla.id}`);
            if (response.data.success) {
                setPlanillaData(response.data.data);
            }
        } catch (error) {
            console.error('Error al cargar detalle de planilla:', error);
            alert('Error al cargar los detalles de la planilla');
        } finally {
            setLoading(false);
        }
    };

    const handleProductoAdded = (producto) => {
        setShowBuscarModal(false);
        loadPlanillaDetalle();
    };

    const handleEditDetalle = (detalle) => {
        setEditingDetalle(detalle);
        setEditForm({
            cantidad_fisica: detalle.cantidad_fisica.toString(),
            observaciones: detalle.observaciones || ''
        });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(
                `/api/inventario-ciclico/planillas/${planilla.id}/productos/${editingDetalle.id}`,
                {
                    cantidad_fisica: parseInt(editForm.cantidad_fisica),
                    observaciones: editForm.observaciones
                }
            );

            if (response.data.success) {
                setEditingDetalle(null);
                setEditForm({ cantidad_fisica: '', observaciones: '' });
                loadPlanillaDetalle();
            }
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
            alert('Error al actualizar la cantidad');
        }
    };

    const handleCancelEdit = () => {
        setEditingDetalle(null);
        setEditForm({ cantidad_fisica: '', observaciones: '' });
    };

    const handleCerrarPlanilla = async () => {
        if (!confirm('¿Está seguro de que desea cerrar esta planilla? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const response = await axios.post(`/api/inventario-ciclico/planillas/${planilla.id}/cerrar`);
            if (response.data.success) {
                alert('Planilla cerrada exitosamente');
                loadPlanillaDetalle();
            }
        } catch (error) {
            console.error('Error al cerrar planilla:', error);
            alert(error.response?.data?.message || 'Error al cerrar la planilla');
        }
    };

    const handleRefrescarTareas = async () => {
        try {
            const response = await axios.post(`/api/inventario-ciclico/planillas/${planilla.id}/refrescar-tareas`);
            if (response.data.success) {
                loadPlanillaDetalle();
            }
        } catch (error) {
            console.error('Error al refrescar tareas:', error);
        }
    };

    const handleGenerarReporte = async (tipo) => {
        try {
            const url = `/api/inventario-ciclico/planillas/${planilla.id}/reporte-${tipo}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `Planilla_Inventario_${planilla.id}_${new Date().toISOString().split('T')[0]}.${tipo}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(a);
            } else {
                console.error(`Error al generar reporte ${tipo.toUpperCase()}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getEstatusTareaColor = (estatus) => {
        switch (estatus) {
            case 'Confirmado':
                return 'bg-green-100 text-green-800';
            case 'Pendiente Aprobación':
                return 'bg-yellow-100 text-yellow-800';
            case 'Aprobada':
                return 'bg-blue-100 text-blue-800';
            case 'Rechazada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatNumber = (value, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-VE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const canClose = planillaData?.estatus == 'Abierta' && 
        planillaData?.tareas?.every(d => d.estado == 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Planilla #{planillaData?.id}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Creada el {formatDate(planillaData?.fecha_creacion)} por {planillaData?.usuarioCreador?.usuario}
                    </p>
                    {planillaData?.notas_generales && (
                        <p className="text-sm text-gray-600 mt-2">
                            <strong>Notas:</strong> {planillaData.notas_generales}
                        </p>
                    )}
                </div>
                
                <div className="flex space-x-3">
                    <button
                        onClick={handleRefrescarTareas}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <i className="fa fa-refresh mr-2"></i>
                        Refrescar
                    </button>
                    
                    {planillaData?.estatus == 'Abierta' && (
                        <button
                            onClick={() => setShowBuscarModal(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                        >
                            <i className="fa fa-plus mr-2"></i>
                            Agregar Producto
                        </button>
                    )}
                    
                    {canClose && (
                        <button
                            onClick={handleCerrarPlanilla}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                        >
                            <i className="fa fa-check mr-2"></i>
                            Cerrar Planilla
                        </button>
                    )}
                    
                    {planillaData?.estatus == 'Cerrada' && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleGenerarReporte('pdf')}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                            >
                                <i className="fa fa-file-pdf-o mr-2"></i>
                                Reporte PDF
                            </button>
                            <button
                                onClick={() => handleGenerarReporte('excel')}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                            >
                                <i className="fa fa-file-excel-o mr-2"></i>
                                Reporte Excel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Estatus de la planilla */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getEstatusTareaColor(planillaData?.estatus)}`}>
                            {planillaData?.estatus}
                        </span>
                        <span className="text-sm text-gray-600">
                            {planillaData?.tareas?.length || 0} productos
                        </span>
                    </div>
                    
                    {planillaData?.estatus == 'Cerrada' && (
                        <div className="text-sm text-gray-600">
                            Cerrada el {formatDate(planillaData?.fecha_cierre)}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : planillaData?.tareas?.length == 0 ? (
                    <div className="text-center py-12">
                        <i className="fa fa-box text-4xl text-gray-400 mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No hay productos en esta planilla
                        </h3>
                        <p className="text-gray-500">
                            Agrega productos para comenzar el conteo de inventario.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto / Códigos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cant. Sistema
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cant. Física
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Diferencia
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Valor Diferencia
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID Tarea
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Envío
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aprobación Central
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Aprobación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {planillaData?.tareas?.map((detalle) => (
                                    <tr key={detalle.id}>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {detalle.producto?.descripcion}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    <span className="font-medium">Barras:</span> {detalle.producto?.codigo_barras || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    <span className="font-medium">Proveedor:</span> {detalle.producto?.codigo_proveedor || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {detalle.cantidad_sistema}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingDetalle?.id == detalle.id ? (
                                                <input
                                                    type="number"
                                                    value={editForm.cantidad_fisica}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, cantidad_fisica: e.target.value }))}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                    min="0"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-900">
                                                    {detalle.cantidad_fisica}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${
                                                detalle.diferencia_cantidad > 0 ? 'text-green-600' : 
                                                detalle.diferencia_cantidad < 0 ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                                {detalle.diferencia_cantidad > 0 ? '+' : ''}{detalle.diferencia_cantidad}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${formatNumber(detalle.diferencia_valor)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {detalle.id || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {detalle.created_at ? (
                                                <div>
                                                    <div>{new Date(detalle.created_at).toLocaleDateString('es-VE')}</div>
                                                    <div className="text-xs text-gray-400">
                                                        {new Date(detalle.created_at).toLocaleTimeString('es-VE', {hour: '2-digit', minute: '2-digit'})}
                                                    </div>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                detalle.permiso == 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {detalle.permiso == 1 ? 'Aprobado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {detalle.fecha_aprobacion ? (
                                                <div>
                                                    <div>{new Date(detalle.fecha_aprobacion).toLocaleDateString('es-VE')}</div>
                                                    <div className="text-xs text-gray-400">
                                                        {new Date(detalle.fecha_aprobacion).toLocaleTimeString('es-VE', {hour: '2-digit', minute: '2-digit'})}
                                                    </div>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                detalle.estado == 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {detalle.estado == 1 ? 'Ejecutado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {editingDetalle?.id == detalle.id ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        <i className="fa fa-check"></i>
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <i className="fa fa-times"></i>
                                                    </button>
                                                </div>
                                            ) : planillaData?.estatus == 'Abierta' ? (
                                                <button
                                                    onClick={() => handleEditDetalle(detalle)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <i className="fa fa-edit"></i>
                                                </button>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal para buscar productos */}
            {showBuscarModal && (
                <BuscarProductoModal
                    onClose={() => setShowBuscarModal(false)}
                    onProductoSelected={handleProductoAdded}
                    planillaId={planilla.id}
                    sucursalConfig={sucursalConfig}
                />
            )}
        </div>
    );
};

export default PlanillaDetalle; 