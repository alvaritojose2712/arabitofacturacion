import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GarantiaInventario = ({ sucursalConfig }) => {
    const [inventarios, setInventarios] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMovimientosModal, setShowMovimientosModal] = useState(false);
    const [movimientosProductoId, setMovimientosProductoId] = useState(null);
    const [movimientosProductoDesc, setMovimientosProductoDesc] = useState('');
    const [movimientosData, setMovimientosData] = useState([]);
    const [loadingMovimientos, setLoadingMovimientos] = useState(false);

    // Estados para filtros
    const [inventarioFilters, setInventarioFilters] = useState({
        producto_nombre: '',
        proveedor_id: '',
        tipo_inventario: '',
        limit: 50
    });

    // Estados para estadísticas
    const [estadisticasInventario, setEstadisticasInventario] = useState({
        total: 0,
        por_tipo: {
            DAÑADO: 0,
            RECUPERADO: 0,
            TRANSFERIDO_AL_PROVEEDOR: 0,
            DEVOLUCION: 0
        },
        valor_total_base: {
            DAÑADO: 0,
            RECUPERADO: 0,
            TRANSFERIDO_AL_PROVEEDOR: 0,
            DEVOLUCION: 0
        },
        valor_total_venta: {
            DAÑADO: 0,
            RECUPERADO: 0,
            TRANSFERIDO_AL_PROVEEDOR: 0,
            DEVOLUCION: 0
        }
    });

    const [resumenProveedores, setResumenProveedores] = useState([]);



    useEffect(() => {
        loadInventarios();
        loadSucursales();
        loadProveedores();
    }, []);

    useEffect(() => {
        loadInventarios();
    }, [inventarioFilters]);

    const loadInventarios = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/garantias/inventarios', {
                params: inventarioFilters
            });
            
            const data = response.data;
            if (data.success) {
                setInventarios(data.data.data || []);
                setEstadisticasInventario(data.estadisticas || {});
                setResumenProveedores(data.resumen_proveedores || []);
            } else {
                console.warn('Error al cargar inventarios:', data.message);
                setInventarios([]);
            }
        } catch (error) {
            console.error('Error al cargar inventarios:', error);
            setInventarios([]);
            alert('Error al cargar inventarios de garantía');
        } finally {
            setLoading(false);
        }
    };

    const loadSucursales = async () => {
        try {
            const response = await axios.get('/api/garantias/sucursales');
            const data = response.data;
            if (data.success) {
                setSucursales(data.data || []);
            }
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
            setSucursales([]);
        }
    };

    const loadProveedores = async () => {
        try {
            const response = await axios.get('/api/garantias/proveedores');
            const data = response.data;
            if (data.success) {
                setProveedores(data.data || []);
            }
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
            setProveedores([]);
        }
    };

    const handleInventarioFilterChange = (field, value) => {
        setInventarioFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearInventarioFilters = () => {
        setInventarioFilters({
            producto_nombre: '',
            proveedor_id: '',
            tipo_inventario: '',
            limit: 50
        });
    };



    const handleVerMovimientos = async (inventario) => {
        setMovimientosProductoId(inventario.producto?.id);
        setMovimientosProductoDesc(inventario.producto?.descripcion || '');
        setShowMovimientosModal(true);
        setLoadingMovimientos(true);

        try {
            const response = await axios.get('/api/garantias/movimientos', {
                params: {
                    producto_id: inventario.producto?.id
                }
            });
            if (response.data.success) {
                // Extraer el array de datos de la respuesta paginada
                const movimientosArray = response.data.data?.data || [];
                setMovimientosData(movimientosArray);
            } else {
                setMovimientosData([]);
                alert('Error al cargar movimientos: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error al cargar movimientos:', error);
            setMovimientosData([]);
            alert('Error al cargar movimientos');
        } finally {
            setLoadingMovimientos(false);
        }
    };

    const getTipoInventarioColor = (tipo) => {
        switch (tipo) {
            case 'DAÑADO':
                return 'bg-danger text-white';
            case 'RECUPERADO':
                return 'bg-success text-white';
            case 'TRANSFERIDO_AL_PROVEEDOR':
                return 'bg-info text-white';
            case 'DEVOLUCION':
                return 'bg-warning text-dark';
            case 'ENVIADO_PROVEEDOR':
                return 'bg-info text-white';
            default:
                return 'bg-secondary text-white';
        }
    };

    const getTipoInventarioLabel = (tipo) => {
        switch (tipo) {
            case 'DAÑADO':
                return 'Dañado';
            case 'RECUPERADO':
                return 'Recuperado';
            case 'TRANSFERIDO_AL_PROVEEDOR':
                return 'Transferido al Proveedor';
            case 'DEVOLUCION':
                return 'Devolución';
            case 'ENVIADO_PROVEEDOR':
                return 'Enviado a Proveedor';
            default:
                return tipo;
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

    const inventariosArray = Array.isArray(inventarios) ? inventarios : [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="w-full px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                                <i className="fa fa-warehouse mr-2 text-blue-600"></i>
                                Inventario de Garantías
                            </h1>
                            <p className="mt-1 text-xs text-gray-600">
                                Gestión de inventarios por sucursal
                            </p>
                        </div>
                        <button 
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={loadInventarios}
                            disabled={loading}
                        >
                            <i className="fa fa-refresh mr-1"></i>
                            <span className="hidden sm:inline">Actualizar</span>
                            <span className="sm:hidden">Ref</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-3 py-3">
                {/* Estadísticas de Inventarios */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                        <div className="text-lg md:text-xl font-bold text-blue-600">{estadisticasInventario.total}</div>
                        <div className="text-xs text-gray-600">Total</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                        <div className="text-lg md:text-xl font-bold text-green-600">{estadisticasInventario.por_tipo.RECUPERADO}</div>
                        <div className="text-xs text-gray-600">Recuperados</div>
                    </div>
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-2 text-center">
                        <div className="text-lg md:text-xl font-bold text-cyan-600">{estadisticasInventario.por_tipo.TRANSFERIDO_AL_PROVEEDOR}</div>
                        <div className="text-xs text-gray-600">Enviados</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                        <div className="text-lg md:text-xl font-bold text-red-600">{estadisticasInventario.por_tipo.DAÑADO}</div>
                        <div className="text-xs text-gray-600">Dañados</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
                        <div className="text-lg md:text-xl font-bold text-yellow-600">{estadisticasInventario.por_tipo.DEVOLUCION}</div>
                        <div className="text-xs text-gray-600">Devoluciones</div>
                    </div>
                </div>

                {/* Filtros de Inventarios */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                    <div className="flex items-center bg-gray-50 rounded-lg border">
                        <span className="px-2 text-xs text-gray-600 bg-gray-100 rounded-l-lg py-1.5">Producto:</span>
                            <input 
                                type="text" 
                            className="flex-1 px-2 py-1.5 text-xs border-0 bg-transparent focus:outline-none" 
                            placeholder="Buscar..." 
                                value={inventarioFilters.producto_nombre} 
                                onChange={(e) => handleInventarioFilterChange('producto_nombre', e.target.value)}
                            />
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg border">
                        <span className="px-2 text-xs text-gray-600 bg-gray-100 rounded-l-lg py-1.5">Proveedor:</span>
                            <select 
                            className="flex-1 px-2 py-1.5 text-xs border-0 bg-transparent focus:outline-none" 
                                value={inventarioFilters.proveedor_id} 
                                onChange={(e) => handleInventarioFilterChange('proveedor_id', e.target.value)}
                            >
                            <option value="">Todos</option>
                                {proveedores.map(proveedor => (
                                    <option key={proveedor.id} value={proveedor.id}>
                                        {proveedor.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    <div className="flex items-center bg-gray-50 rounded-lg border">
                        <span className="px-2 text-xs text-gray-600 bg-gray-100 rounded-l-lg py-1.5">Tipo:</span>
                            <select 
                            className="flex-1 px-2 py-1.5 text-xs border-0 bg-transparent focus:outline-none" 
                                value={inventarioFilters.tipo_inventario} 
                                onChange={(e) => handleInventarioFilterChange('tipo_inventario', e.target.value)}
                            >
                            <option value="">Todos</option>
                                <option value="RECUPERADO">Recuperado</option>
                            <option value="TRANSFERIDO_AL_PROVEEDOR">Enviado</option>
                                <option value="DAÑADO">Dañado</option>
                                <option value="DEVOLUCION">Devolución</option>
                            </select>
                    </div>
                        <button 
                        className="px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50" 
                            onClick={clearInventarioFilters}
                            disabled={inventarioFilters.producto_nombre === '' && inventarioFilters.proveedor_id === '' && inventarioFilters.tipo_inventario === ''}
                        >
                        Limpiar
                        </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-3">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <div className="text-xs text-gray-600 mt-1">Cargando...</div>
                    </div>
                )}

                {/* Lista de Inventarios */}
                {!loading && (
                    <div className="bg-white rounded-lg border">
                        <div className="px-3 py-2 border-b bg-gray-50">
                            <h6 className="text-sm font-medium text-gray-700 mb-0">
                                Inventarios de Garantía 
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{inventariosArray.length}</span>
                            </h6>
                        </div>
                        <div className="p-0">
                            {inventariosArray.length === 0 ? (
                                <div className="text-center py-6 text-gray-500">
                                    <i className="fa fa-inbox text-2xl mb-2"></i>
                                    <div className="text-xs">No hay inventarios de garantía</div>
                                </div>
                            ) : (
                                <>
                                    {/* Vista Desktop - Tabla */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead className="bg-gray-50">
                                            <tr>
                                                    <th className="px-2 py-2 text-left font-medium text-gray-700">ID</th>
                                                    <th className="px-2 py-2 text-left font-medium text-gray-700">Suc</th>
                                                    <th className="px-2 py-2 text-left font-medium text-gray-700">Código</th>
                                                    <th className="px-2 py-2 text-left font-medium text-gray-700">Producto</th>
                                                    <th className="px-2 py-2 text-left font-medium text-gray-700">Prov</th>
                                                    <th className="px-2 py-2 text-left font-medium text-gray-700">Tipo</th>
                                                    <th className="px-2 py-2 text-left font-medium text-gray-700">Cant</th>
                                                    <th className="px-2 py-2 text-left font-medium text-gray-700">Base</th>
                                                    <th className="px-2 py-2 text-left font-medium text-gray-700">Venta</th>
                                                    <th className="px-2 py-2 text-left font-medium text-gray-700">Acciones</th>
                                            </tr>
                                        </thead>
                                            <tbody className="divide-y divide-gray-100">
                                            {inventariosArray.map((inventario) => (
                                                    <tr key={inventario.id} className="hover:bg-gray-50">
                                                        <td className="px-2 py-2 text-gray-900">#{inventario.id}</td>
                                                        <td className="px-2 py-2">
                                                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                                            {inventario.sucursal?.codigo || 'N/A'}
                                                        </span>
                                                    </td>
                                                        <td className="px-2 py-2">
                                                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-mono">
                                                            {inventario.producto?.codigo_barras || 'N/A'}
                                                        </span>
                                                    </td>
                                                        <td className="px-2 py-2 text-gray-900 truncate max-w-24" title={inventario.producto?.descripcion || 'N/A'}>
                                                            {inventario.producto?.descripcion || 'N/A'}
                                                        </td>
                                                        <td className="px-2 py-2 text-gray-600 text-xs truncate max-w-20">
                                                            {inventario.producto?.proveedor?.descripcion || 'N/A'}
                                                    </td>
                                                        <td className="px-2 py-2">
                                                            <span className={`px-1.5 py-0.5 text-xs rounded ${getTipoInventarioColor(inventario.tipo_inventario)}`}>
                                                            {getTipoInventarioLabel(inventario.tipo_inventario)}
                                                        </span>
                                                    </td>
                                                        <td className="px-2 py-2 text-gray-900">{inventario.cantidad}</td>
                                                        <td className="px-2 py-2 text-green-600 font-medium">
                                                            ${inventario.valor_total_formateado_base || '0.00'}
                                                    </td>
                                                        <td className="px-2 py-2 text-blue-600 font-medium">
                                                            ${inventario.valor_total_formateado_venta || '0.00'}
                                                    </td>
                                                        <td className="px-2 py-2">
                                                            <button
                                                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                                title="Ver movimientos"
                                                                onClick={() => handleVerMovimientos(inventario)}
                                                            >
                                                                <i className="fa fa-history mr-1"></i> Mov
                                                            </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                    {/* Vista Móvil - Tarjetas */}
                                    <div className="md:hidden space-y-3">
                                        {inventariosArray.map((inventario) => (
                                            <div key={inventario.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                                                {/* Header de la tarjeta */}
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-gray-500">#{inventario.id}</span>
                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            {inventario.sucursal?.codigo || 'N/A'}
                                                        </span>
                                                        <span className={`px-2 py-0.5 text-xs rounded-full ${getTipoInventarioColor(inventario.tipo_inventario)}`}>
                                                            {getTipoInventarioLabel(inventario.tipo_inventario)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                                                        title="Ver movimientos"
                                                        onClick={() => handleVerMovimientos(inventario)}
                                                    >
                                                        <i className="fa fa-history"></i>
                                                    </button>
                                                </div>

                                                {/* Información del producto */}
                                                <div className="mb-2">
                                                    <div className="text-sm font-medium text-gray-900 mb-1">
                                                        {inventario.producto?.descripcion || 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-600 mb-1">
                                                        {inventario.producto?.proveedor?.descripcion || 'N/A'}
                                                    </div>
                                                    <div className="text-xs">
                                                        <span className="text-gray-500">Código:</span>
                                                        <span className="ml-1 font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                                                            {inventario.producto?.codigo_barras || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Detalles financieros */}
                                                <div className="grid grid-cols-3 gap-2 text-xs">
                                                    <div className="text-center">
                                                        <div className="text-gray-500">Cantidad</div>
                                                        <div className="font-medium text-gray-900">{inventario.cantidad}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-gray-500">Base</div>
                                                        <div className="font-medium text-green-600">
                                                            ${inventario.valor_total_formateado_base || '0.00'}
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-gray-500">Venta</div>
                                                        <div className="font-medium text-blue-600">
                                                            ${inventario.valor_total_formateado_venta || '0.00'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Resumen por Proveedores */}
                {!loading && resumenProveedores.length > 0 && (
                    <div className="bg-white rounded-lg border mt-3">
                        <div className="px-3 py-2 border-b bg-gray-50">
                            <h6 className="text-sm font-medium text-gray-700 mb-0">
                                <i className="fa fa-chart-pie mr-1"></i>
                                Resumen por Proveedores
                            </h6>
                        </div>
                        <>
                            {/* Vista Desktop - Tabla */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-2 py-2 text-left font-medium text-gray-700">Proveedor</th>
                                            <th className="px-2 py-2 text-left font-medium text-gray-700">RIF</th>
                                            <th className="px-2 py-2 text-left font-medium text-gray-700">Items</th>
                                            <th className="px-2 py-2 text-left font-medium text-gray-700">Cant</th>
                                            <th className="px-2 py-2 text-left font-medium text-gray-700">Base</th>
                                            <th className="px-2 py-2 text-left font-medium text-gray-700">Venta</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {resumenProveedores.map((proveedor) => (
                                            <tr key={proveedor.id} className="hover:bg-gray-50">
                                                <td className="px-2 py-2 font-medium text-gray-900">
                                                    {proveedor.proveedor_nombre}
                                                </td>
                                                <td className="px-2 py-2 text-gray-600">
                                                    {proveedor.proveedor_rif}
                                                </td>
                                                <td className="px-2 py-2">
                                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                                        {proveedor.total_items}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                                        {proveedor.total_cantidad}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 text-green-600 font-medium">
                                                    ${formatNumber(proveedor.valor_total_base, 2)}
                                                </td>
                                                <td className="px-2 py-2 text-blue-600 font-medium">
                                                    ${formatNumber(proveedor.valor_total_venta, 2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Vista Móvil - Tarjetas */}
                            <div className="md:hidden space-y-3">
                                {resumenProveedores.map((proveedor) => (
                                    <div key={proveedor.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                                        {/* Header de la tarjeta */}
                                        <div className="mb-2">
                                            <div className="text-sm font-medium text-gray-900 mb-1">
                                                {proveedor.proveedor_nombre}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                RIF: {proveedor.proveedor_rif}
                                            </div>
                                        </div>

                                        {/* Estadísticas */}
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div className="text-center">
                                                <div className="text-gray-500 mb-1">Items</div>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                    {proveedor.total_items}
                                                </span>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-gray-500 mb-1">Cantidad</div>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                                    {proveedor.total_cantidad}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Valores */}
                                        <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                                            <div className="text-center">
                                                <div className="text-gray-500 mb-1">Valor Base</div>
                                                <div className="font-medium text-green-600">
                                                    ${formatNumber(proveedor.valor_total_base, 2)}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-gray-500 mb-1">Valor Venta</div>
                                                <div className="font-medium text-blue-600">
                                                    ${formatNumber(proveedor.valor_total_venta, 2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        </>
                    </div>
                )}
            </div>



            {/* Modal de Movimientos - Responsive */}
            {showMovimientosModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* Header del Modal */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                                    <i className="fa fa-history mr-2 text-blue-600"></i>
                                    Movimientos de Garantía
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">{movimientosProductoDesc}</p>
                            </div>
                            <button 
                                onClick={() => setShowMovimientosModal(false)} 
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Contenido del Modal */}
                        <div className="p-4 overflow-y-auto flex-1">
                            {loadingMovimientos ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <div className="text-sm text-gray-600 mt-2">Cargando movimientos...</div>
                                    </div>
                                </div>
                            ) : movimientosData.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-4">
                                        <i className="fa fa-inbox text-4xl"></i>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay movimientos</h3>
                                    <p className="text-sm text-gray-600">No se encontraron movimientos para este producto</p>
                                </div>
                            ) : (
                                <>
                                    {/* Vista Desktop - Tabla */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Fecha</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tipo</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Sucursal Origen</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Sucursal Destino</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Cantidad</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Motivo</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Usuario</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {movimientosData.map((movimiento, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            {formatDate(movimiento.created_at)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoInventarioColor(movimiento.tipo_movimiento)}`}>
                                                                {getTipoInventarioLabel(movimiento.tipo_movimiento)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            {movimiento.sucursal_origen?.nombre || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            {movimiento.sucursal_destino?.nombre || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                                            {movimiento.cantidad}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title={movimiento.motivo}>
                                                            {movimiento.motivo || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">
                                                            {movimiento.usuario_nombre || 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Vista Móvil - Cards */}
                                    <div className="md:hidden space-y-3">
                                        {movimientosData.map((movimiento, index) => (
                                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                <div className="space-y-3">
                                                    {/* Header de la card */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoInventarioColor(movimiento.tipo_movimiento)}`}>
                                                                {getTipoInventarioLabel(movimiento.tipo_movimiento)}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {formatDate(movimiento.created_at)}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            Cant: {movimiento.cantidad}
                                                        </span>
                                                    </div>

                                                    {/* Información de sucursales */}
                                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                                        <div>
                                                            <span className="text-gray-500">Origen:</span>
                                                            <div className="font-medium text-gray-900">
                                                                {movimiento.sucursal_origen?.nombre || 'N/A'}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Destino:</span>
                                                            <div className="font-medium text-gray-900">
                                                                {movimiento.sucursal_destino?.nombre || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Motivo y usuario */}
                                                    <div className="space-y-2 text-xs">
                                                        <div>
                                                            <span className="text-gray-500">Motivo:</span>
                                                            <div className="text-gray-900 mt-1">
                                                                {movimiento.motivo || 'N/A'}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Usuario:</span>
                                                            <div className="font-medium text-gray-900">
                                                                {movimiento.usuario_nombre || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer del Modal */}
                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setShowMovimientosModal(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GarantiaInventario; 