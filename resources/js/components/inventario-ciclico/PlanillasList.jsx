import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrearPlanillaModal from './CrearPlanillaModal';

const PlanillasList = ({ onPlanillaSelect, sucursalConfig, user }) => {
    const [planillas, setPlanillas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [filters, setFilters] = useState({
        fecha_inicio: '',
        fecha_fin: '',
        estatus: '',
        producto_nombre: '',
        limit: 25
    });

    useEffect(() => {
        loadPlanillas();
    }, [filters]);

    const loadPlanillas = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/inventario-ciclico/planillas', {
                params: filters
            });
            
            if (response.data.success) {
                setPlanillas(response.data.data.data || []);
            } else {
                console.warn('Error al cargar planillas:', response.data.message);
                setPlanillas([]);
            }
        } catch (error) {
            console.error('Error al cargar planillas:', error);
            setPlanillas([]);
            alert('Error al cargar planillas de inventario');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            fecha_inicio: '',
            fecha_fin: '',
            estatus: '',
            producto_nombre: '',
            limit: 25
        });
    };

    const getEstatusColor = (estatus) => {
        switch (estatus) {
            case 'Abierta':
                return 'bg-green-100 text-green-800';
            case 'Cerrada':
                return 'bg-blue-100 text-blue-800';
            case 'Cancelada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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

    const handlePlanillaCreated = (newPlanilla) => {
        setShowCrearModal(false);
        loadPlanillas();
        // Opcional: ir directamente al detalle de la nueva planilla
        onPlanillaSelect(newPlanilla);
    };

    return (
        <div className="space-y-6">
            {/* Header con botón crear */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                    Planillas de Inventario
                </h2>
                <button
                    onClick={() => setShowCrearModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    <i className="fa fa-plus mr-2"></i>
                    Nueva Planilla
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    <i className="fa fa-filter mr-2"></i>
                    Filtros
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Fecha inicio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha Inicio
                        </label>
                        <input
                            type="date"
                            value={filters.fecha_inicio}
                            onChange={(e) => handleFilterChange('fecha_inicio', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Fecha fin */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha Fin
                        </label>
                        <input
                            type="date"
                            value={filters.fecha_fin}
                            onChange={(e) => handleFilterChange('fecha_fin', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Estatus */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estatus
                        </label>
                        <select
                            value={filters.estatus}
                            onChange={(e) => handleFilterChange('estatus', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="Abierta">Abierta</option>
                            <option value="Cerrada">Cerrada</option>
                            <option value="Cancelada">Cancelada</option>
                        </select>
                    </div>

                    {/* Producto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Producto
                        </label>
                        <input
                            type="text"
                            placeholder="Buscar por producto..."
                            value={filters.producto_nombre}
                            onChange={(e) => handleFilterChange('producto_nombre', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Límite y botones */}
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-4">
                        
                        <select
                            value={filters.limit}
                            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    
                    <button
                        onClick={clearFilters}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                        <i className="fa fa-times mr-1"></i>
                        Limpiar Filtros
                    </button>
                </div>
            </div>

            {/* Tabla de planillas */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : planillas.length === 0 ? (
                    <div className="text-center py-12">
                        <i className="fa fa-clipboard-list text-4xl text-gray-400 mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No hay planillas
                        </h3>
                        <p className="text-gray-500">
                            {filters.fecha_inicio || filters.fecha_fin || filters.estatus || filters.producto_nombre
                                ? 'No se encontraron planillas con los filtros aplicados.'
                                : 'Crea tu primera planilla de inventario para comenzar.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Creación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sucursal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estatus
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Productos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {planillas.map((planilla) => (
                                    <tr 
                                        key={planilla.id} 
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => onPlanillaSelect(planilla)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{planilla.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(planilla.fecha_creacion)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {planilla.usuarioCreador?.usuario || `ID: ${planilla.id_usuario_creador}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {planilla.sucursal?.codigo} - {planilla.sucursal?.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstatusColor(planilla.estatus)}`}>
                                                {planilla.estatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {planilla.tareas?.length || 0} productos
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <i className="fa fa-chevron-right text-gray-400"></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal para crear planilla */}
            {showCrearModal && (
                <CrearPlanillaModal
                    onClose={() => setShowCrearModal(false)}
                    onPlanillaCreated={handlePlanillaCreated}
                    sucursalConfig={sucursalConfig}
                    user={user}
                />
            )}
        </div>
    );
};

export default PlanillasList; 