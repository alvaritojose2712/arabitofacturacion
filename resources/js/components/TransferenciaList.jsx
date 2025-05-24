import React, { useState, useEffect } from 'react';
import { getTransferencias, updateTransferenciaStatus } from './transferenciaService';
import { getSucursales } from './sucursalService';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns'; // npm install date-fns

const TransferenciaList = ({ onEditTransfer }) => { // onEditTransfer puede ser para ver detalles o cambiar estado
    const [transferencias, setTransferencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        estatus: '',
        sucursal_destino_id: '',
        fecha_desde: '',
        fecha_hasta: '',
        page: 1
    });
    const [pagination, setPagination] = useState({});
    const [sucursales, setSucursales] = useState([]);
    const [statusOptions] = useState(['PENDIENTE', 'EN REVISION', 'REVISADO', 'PROCESADO']);


    const fetchAllTransferencias = async (page = 1) => {
        setLoading(true);
        setError('');
        try {
            const currentFilters = { ...filters, page };
            const response = await getTransferencias(currentFilters);
            setTransferencias(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page,
            });
        } catch (err) {
            console.error("Error fetching transferencias:", err);
            setError('No se pudieron cargar las transferencias.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTransferencias(filters.page);
    }, [filters]); // Re-fetch when filters change

     useEffect(() => {
        const loadSucursales = async () => {
            try {
                const response = await getSucursales();
                setSucursales(response.data);
            } catch (error) {
                console.error("Error cargando sucursales para filtro:", error);
            }
        };
        loadSucursales();
    }, []);


    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.lastPage) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleStatusChange = async (transferenciaId, nuevoEstatus) => {
        if (!window.confirm(`¿Está seguro de cambiar el estado a ${nuevoEstatus}?`)) return;
        try {
            await updateTransferenciaStatus(transferenciaId, nuevoEstatus);
            // Optimistic update or re-fetch
            fetchAllTransferencias(filters.page);
             alert(`Transferencia actualizada a ${nuevoEstatus}`);
        } catch (error) {
            console.error("Error actualizando estado:", error.response?.data || error.message);
            alert(`Error: ${error.response?.data?.message || 'No se pudo actualizar el estado.'}`);
        }
    };


    if (loading && transferencias.length === 0) return <p>Cargando transferencias...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-semibold mb-6">Listado de Transferencias</h2>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded shadow">
                <div>
                    <label htmlFor="estatus_filter" className="block text-sm font-medium text-gray-700">Estado:</label>
                    <select name="estatus" id="estatus_filter" value={filters.estatus} onChange={handleFilterChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm">
                        <option value="">Todos</option>
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="sucursal_destino_filter" className="block text-sm font-medium text-gray-700">Suc. Destino:</label>
                    <select name="sucursal_destino_id" id="sucursal_destino_filter" value={filters.sucursal_destino_id} onChange={handleFilterChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm">
                        <option value="">Todas</option>
                        {sucursales.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="fecha_desde_filter" className="block text-sm font-medium text-gray-700">Desde:</label>
                    <input type="date" name="fecha_desde" id="fecha_desde_filter" value={filters.fecha_desde} onChange={handleFilterChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="fecha_hasta_filter" className="block text-sm font-medium text-gray-700">Hasta:</label>
                    <input type="date" name="fecha_hasta" id="fecha_hasta_filter" value={filters.fecha_hasta} onChange={handleFilterChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" />
                </div>
            </div>

            {loading && <p>Actualizando lista...</p>}

            {transferencias.length === 0 && !loading ? (
                <p>No se encontraron transferencias con los filtros aplicados.</p>
            ) : (
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transferencias.map(t => (
                            <tr key={t.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{t.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{format(new Date(t.fecha_transferencia), 'dd/MM/yyyy HH:mm')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{t.sucursal_origen?.nombre || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{t.sucursal_destino?.nombre || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{t.detalles?.length || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <StatusBadge estatus={t.estatus} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                   {/* Simple select para cambiar estado, podrías hacerlo un modal o más complejo */}
                                   <select
                                        value={t.estatus}
                                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                        className="p-1 border-gray-300 rounded-md text-xs"
                                        disabled={t.estatus === 'PROCESADO'} // No permitir cambiar si ya está PROCESADO
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status} disabled={status === 'PENDIENTE' && t.estatus !== 'PENDIENTE'}> {/* Evitar volver a pendiente si ya avanzó*/}
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                    {/* <button onClick={() => onEditTransfer(t.id)} className="text-indigo-600 hover:text-indigo-900 ml-2">Ver</button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
            {/* Paginación */}
            {pagination.lastPage > 1 && (
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                        Mostrando {((pagination.currentPage - 1) * pagination.perPage) + 1} - {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} de {pagination.total} transferencias
                    </span>
                    <div>
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="px-3 py-1">Página {pagination.currentPage} de {pagination.lastPage}</span>
                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.lastPage}
                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransferenciaList;