import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import db from '../database/database';

// ###################################################################################
// #                            INICIO: MOCK DATA Y SERVICIOS                        #
// ###################################################################################

const ID_SUCURSAL_ACTUAL_ORIGEN_PLACEHOLDER = 1;
let nextTransferenciaId = 4;
let nextDetalleId = 200; // Incremented to avoid collision with new item IDs

// --- Estado Mapping ---
const ESTADO_NUMERICO_A_STRING = {
    1: 'PENDIENTE',
    2: 'PROCESADO',
    3: 'EN REVISION',
    4: 'REVISADO',

   
};



const ESTADO_STRING_A_NUMERICO = {
    'PENDIENTE': 1,
    'EN REVISION': 3,
    'REVISADO': 4,
    'PROCESADO': 2,
};
const OPCIONES_ESTATUS_STRING = Object.values(ESTADO_NUMERICO_A_STRING);


const mockSucursalesData = [
    { id: 1, nombre_sucursal: 'Sucursal Principal (Automática)', direccion_sucursal: 'Calle Falsa 123' },
    { id: 2, nombre_sucursal: 'Sucursal Norte', direccion_sucursal: 'Av. Norte 456' },
    { id: 3, nombre_sucursal: 'Sucursal Centro', direccion_sucursal: 'Plaza Central 789' },
    { id: 4, nombre_sucursal: 'Almacén General', direccion_sucursal: 'Bodega 001' },
];

// Inventario sigue igual, pero lo usaremos para buscar y popular los 'items' de transferencia
const mockInventarioData = [
    { id: 101, sucursal_id: 1, codigo_barras: '7501001', codigo_proveedor: 'PROV001', descripcion: 'Laptop Gamer Pro X', cantidad: 15, precio: 1200.00, precio_base: 1000.00 },
    { id: 102, sucursal_id: 1, codigo_barras: '7501002', codigo_proveedor: 'PROV002', descripcion: 'Monitor Curvo 32"', cantidad: 25, precio: 450.00, precio_base: 380.00 },
    { id: 103, sucursal_id: 1, codigo_barras: '7501003', codigo_proveedor: 'PROV001', descripcion: 'Teclado Mecánico RGB', cantidad: 50, precio: 80.00, precio_base: 60.00 },
    { id: 104, sucursal_id: 1, codigo_barras: '7501004', codigo_proveedor: 'PROV003', descripcion: 'Mouse Inalámbrico Ergo', cantidad: 30, precio: 40.00, precio_base: 30.00 },
    { id: 105, sucursal_id: 1, codigo_barras: '7501005', codigo_proveedor: 'PROV002', descripcion: 'Webcam HD 1080p', cantidad: 0, precio: 60.00, precio_base: 45.00 },
    { id: 106, sucursal_id: 1, codigo_barras: 'SCANTEST001', codigo_proveedor: 'SCAN01', descripcion: 'Producto Escáner Rápido', cantidad: 100, precio: 10.00, precio_base: 5.00 },
];

// Adaptado a la nueva estructura JSON
let mockTransferenciasData = [
    {
        id: 1,
        id_cxp: null,
        idinsucursal: 1001, // ID de la transferencia en la sucursal (simulado)
        estado: ESTADO_STRING_A_NUMERICO['PROCESADO'], // 3
        id_origen: 1,
        id_destino: 2,
        created_at: new Date(2024, 4, 10, 10, 30).toISOString(),
        updated_at: new Date(2024, 4, 10, 11, 0).toISOString(),
        base: 1060.00, // Suma de bases de items
        venta: 1280.00, // Suma de ventas de items
        items: [
            {
                id: 10, // ID del item de transferencia
                id_producto: 101, // ID del producto global (asumiendo)
                id_pedido: 1, // ID de la transferencia a la que pertenece
                cantidad: "2.00",
                basef: "1000.00", // Precio base formateado (string)
                base: "1000.00",   // Precio base (string)
                venta: "1200.00",  // Precio venta (string)
                descuento: "0.00",
                monto: "2400.00", // cantidad * venta
                ct_real: 2,
                barras_real: '7501001',
                alterno_real: 'PROV001',
                descripcion_real: 'Laptop Gamer Pro X',
                vinculo_real: 101, // ID del inventario_sucursal
                created_at: new Date(2024, 4, 10, 10, 30).toISOString(),
                updated_at: new Date(2024, 4, 10, 10, 30).toISOString(),
                id_producto_insucursal: 101, // ID del registro en inventario_sucursal
                // producto_insucursal: mockInventarioData.find(p => p.id === 101), // Podríamos popularlo
                // ...otros campos de item...
                modificable: false,
            },
            {
                id: 11,
                id_producto: 103,
                id_pedido: 1,
                cantidad: "5.00",
                basef: "60.00",
                base: "60.00",
                venta: "80.00",
                descuento: "0.00",
                monto: "400.00",
                ct_real: 5,
                barras_real: '7501003',
                alterno_real: 'PROV001',
                descripcion_real: 'Teclado Mecánico RGB',
                vinculo_real: 103,
                created_at: new Date(2024, 4, 10, 10, 30).toISOString(),
                updated_at: new Date(2024, 4, 10, 10, 30).toISOString(),
                id_producto_insucursal: 103,
                modificable: false,
            }
        ],
        origen: mockSucursalesData.find(s => s.id === 1),
        destino: mockSucursalesData.find(s => s.id === 2),
        // sucursal: mockSucursalesData.find(s => s.id === 1), // Sucursal que registra la transferencia
    },
    {
        id: 2,
        id_cxp: null,
        idinsucursal: 1002,
        estado: ESTADO_STRING_A_NUMERICO['EN REVISION'], // 1
        id_origen: 1,
        id_destino: 3,
        created_at: new Date(2024, 4, 15, 14, 0).toISOString(),
        updated_at: new Date(2024, 4, 15, 14, 5).toISOString(),
        base: 3800.00,
        venta: 4500.00,
        items: [
            {
                id: 12,
                id_producto: 102,
                id_pedido: 2,
                cantidad: "10.00",
                base: "380.00",
                venta: "450.00",
                descuento: "0.00",
                monto: "4500.00",
                ct_real: 10,
                barras_real: '7501002',
                alterno_real: 'PROV002',
                descripcion_real: 'Monitor Curvo 32"',
                vinculo_real: 102,
                created_at: new Date(2024, 4, 15, 14, 0).toISOString(),
                updated_at: new Date(2024, 4, 15, 14, 0).toISOString(),
                id_producto_insucursal: 102,
                modificable: false,
            }
        ],
        origen: mockSucursalesData.find(s => s.id === 1),
        destino: mockSucursalesData.find(s => s.id === 3),
    },
    {
        id: 3,
        id_cxp: null,
        idinsucursal: 1003,
        estado: ESTADO_STRING_A_NUMERICO['PENDIENTE'], // 0
        id_origen: 1,
        id_destino: 4,
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(), // Hace 5 horas
        updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        base: 300.00,
        venta: 400.00,
        items: [
            {
                id: 13,
                id_producto: 104,
                id_pedido: 3,
                cantidad: "10.00",
                base: "30.00",
                venta: "40.00",
                descuento: "0.00",
                monto: "400.00",
                ct_real: 10,
                barras_real: '7501004',
                alterno_real: 'PROV003',
                descripcion_real: 'Mouse Inalámbrico Ergo',
                vinculo_real: 104,
                created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
                updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
                id_producto_insucursal: 104,
                modificable: true, // Pendiente es modificable
            }
        ],
        origen: mockSucursalesData.find(s => s.id === 1),
        destino: mockSucursalesData.find(s => s.id === 4),
    },
];

// --- Mock API Service Functions --- (Obtener sucursales y buscar productos no cambian mucho)
const obtenerSucursalesMock = (excluirId = null) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = excluirId
                ? mockSucursalesData.filter(s => s.id !== excluirId)
                : [...mockSucursalesData];
            resolve({ data });
        }, 100);
    });
};

const buscarProductosInventarioMock = (termino, sucursalIdOrigen = null) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!termino || termino.trim() === '') { resolve({ data: [] }); return; }
            const terminoLower = termino.toLowerCase();
            const resultados = mockInventarioData.filter(p =>
                (sucursalIdOrigen ? p.sucursal_id === sucursalIdOrigen : true) &&
                p.cantidad > 0 &&
                (p.descripcion.toLowerCase().includes(terminoLower) ||
                 p.codigo_barras.toLowerCase().includes(terminoLower) ||
                 (p.codigo_proveedor && p.codigo_proveedor.toLowerCase().includes(terminoLower)))
            ).slice(0, 15);
            resolve({ data: resultados });
        }, 200);
    });
};

const obtenerTransferenciasMock = (filtros = {}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let transferenciasFiltradas = mockTransferenciasData.map(t => ({
                ...t,
                // Asegurarse que origen y destino estén poblados si no lo están ya
                origen: t.origen || mockSucursalesData.find(s => s.id === t.id_origen),
                destino: t.destino || mockSucursalesData.find(s => s.id === t.id_destino),
            }));


            if (filtros.estatus_string) { // Filtrar por string de estado
                const estadoNum = ESTADO_STRING_A_NUMERICO[filtros.estatus_string];
                if (estadoNum !== undefined) {
                    transferenciasFiltradas = transferenciasFiltradas.filter(t => t.estado === estadoNum);
                }
            }
            if (filtros.id_destino) { // Cambiado de sucursal_destino_id
                transferenciasFiltradas = transferenciasFiltradas.filter(t => t.id_destino === parseInt(filtros.id_destino));
            }
            if (filtros.id_origen) { // Nuevo filtro
                transferenciasFiltradas = transferenciasFiltradas.filter(t => t.id_origen === parseInt(filtros.id_origen));
            }
            if (filtros.fecha_desde) {
                transferenciasFiltradas = transferenciasFiltradas.filter(t => new Date(t.created_at) >= new Date(filtros.fecha_desde));
            }
            if (filtros.fecha_hasta) {
                const fechaHasta = new Date(filtros.fecha_hasta);
                fechaHasta.setHours(23, 59, 59, 999);
                transferenciasFiltradas = transferenciasFiltradas.filter(t => new Date(t.created_at) <= fechaHasta);
            }

            transferenciasFiltradas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            const porPagina = filtros.por_pagina || 10;
            const pagina = filtros.page || 1;
            const total = transferenciasFiltradas.length;
            const inicio = (pagina - 1) * porPagina;
            const fin = inicio + porPagina;
            const dataPaginada = transferenciasFiltradas.slice(inicio, fin);

            resolve({
                data: {
                    data: dataPaginada,
                    current_page: pagina,
                    last_page: Math.ceil(total / porPagina),
                    total: total,
                    per_page: porPagina,
                    from: total > 0 ? inicio + 1 : 0,
                    to: fin > total ? total : fin,
                }
            });
        }, 300);
    });
};

const crearOActualizarTransferenciaMock = (datosTransferencia, esEdicion = false) => {
   
};

// El cambio de estado ya no se hace desde UI, así que esta función mock no se usará externamente.
// const actualizarEstadoTransferenciaMock = (id, nuevoEstadoNum) => { ... }


// ###################################################################################
// #                            FIN: MOCK DATA Y SERVICIOS                           #
// ###################################################################################


// ###################################################################################
// #                            INICIO: COMPONENTES REACT                            #
// ###################################################################################

const StatusBadge = ({ estadoNum }) => {
    const estatusString = ESTADO_NUMERICO_A_STRING[estadoNum] || 'DESCONOCIDO';
    const statusColors = {
        'PENDIENTE': 'bg-red-500 text-white',
        'EN REVISION': 'bg-yellow-400 text-black',
        'REVISADO': 'bg-sky-500 text-white',
        'PROCESADO': 'bg-green-500 text-white',
        'DESCONOCIDO': 'bg-gray-400 text-black',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full leading-tight ${statusColors[estatusString]}`}>
            {estatusString}
        </span>
    );
};

const ProductSearchInput = ({ onProductSelect, sucursalIdOrigen, placeholder = "Buscar producto..." }) => {
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [resultados, setResultados] = useState([]);
    const [estaCargando, setEstaCargando] = useState(false);
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [mostrarModalCantidad, setMostrarModalCantidad] = useState(false);
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState('');
    const inputRef = useRef(null);
    const cantidadInputRef = useRef(null);
    const debounceTimeoutRef = useRef(null);

    const realizarBusqueda = useCallback(async (termino) => {
        if (!termino || termino.trim() === '') { setResultados([]); setMostrarResultados(false); return; }
        setEstaCargando(true);
        try {
            const response = await db.getinventario({
                vendedor: null,
                num:25,
                itemCero: false,
                qProductosMain: termino,
                orderColumn:"descripcion",
                orderBy:"asc",
            });
            console.log(response.data)
            setResultados(response.data || []);
            setMostrarResultados(true);
        } catch (error) { console.error("Error buscando productos (mock):", error); setResultados([]); }
        finally { setEstaCargando(false); }
    }, [sucursalIdOrigen]);

    useEffect(() => {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        if (terminoBusqueda.trim() !== '') {
            debounceTimeoutRef.current = setTimeout(() => realizarBusqueda(terminoBusqueda), 300);
        } else { setResultados([]); setMostrarResultados(false); }
        return () => clearTimeout(debounceTimeoutRef.current);
    }, [terminoBusqueda, realizarBusqueda]);

    const handleSelectProduct = (producto) => {
        setProductoSeleccionado(producto);
        setCantidadSeleccionada('');
        setMostrarModalCantidad(true);
        setMostrarResultados(false);
    };

    const handleConfirmarCantidad = () => {
        // Si está vacío, establecer a 1
        const cantidadFinal = cantidadSeleccionada.trim() === '' ? '1.00' : cantidadSeleccionada;
        const cantidadNum = parseFloat(cantidadFinal);
        const stockOriginalNum = parseFloat(productoSeleccionado.cantidad);

        if (cantidadNum > stockOriginalNum) {
            alert(`La cantidad seleccionada (${cantidadFinal}) excede el stock disponible (${stockOriginalNum}).`);
            return;
        }

        onProductSelect({
            ...productoSeleccionado,
            cantidadInicial: cantidadFinal
        });
        
        setTerminoBusqueda('');
        setProductoSeleccionado(null);
        setCantidadSeleccionada('');
        setMostrarModalCantidad(false);
        inputRef.current?.focus();
    };

    const handleCantidadChange = (e) => {
        const valor = e.target.value;
        if (valor === '' || /^\d*\.?\d{0,2}$/.test(valor)) {
            setCantidadSeleccionada(valor);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConfirmarCantidad();
        }
    };

    useEffect(() => { 
        inputRef.current?.focus();
        if (mostrarModalCantidad) {
            // Pequeño delay para asegurar que el modal esté renderizado
            setTimeout(() => {
                cantidadInputRef.current?.focus();
            }, 100);
        }
    }, [mostrarModalCantidad]);

    return (
        <div className="relative w-full">
            <input 
                ref={inputRef} 
                type="text" 
                className="form-input w-full p-2 border border-gray-300 rounded-md shadow-sm" 
                placeholder={placeholder} 
                value={terminoBusqueda} 
                onChange={(e) => setTerminoBusqueda(e.target.value)} 
                onFocus={() => terminoBusqueda && resultados.length > 0 && setMostrarResultados(true)} 
                onBlur={() => setTimeout(() => setMostrarResultados(false), 150)} 
            />
            
            {estaCargando && <div className="absolute mt-1 w-full p-2 text-sm text-gray-500 bg-white border rounded shadow-lg">Buscando...</div>}
            
            {mostrarResultados && (
                <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-72 overflow-y-auto">
                    {resultados.length > 0 ? (
                        resultados.map(producto => (
                            <li key={producto.id} className="px-3 py-2 hover:bg-indigo-50 cursor-pointer" onMouseDown={() => handleSelectProduct(producto)}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{producto.descripcion}</div>
                                        <div className="text-sm text-gray-600"><b>{producto.codigo_barras}</b> | {producto.codigo_proveedor}</div>
                                        <div className="text-sm text-gray-600">Stock: {producto.cantidad}</div>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (!estaCargando && terminoBusqueda && <li className="px-3 py-2 text-gray-500">No se encontraron productos.</li>)}
                </ul>
            )}

            {/* Modal de Cantidad */}
            {mostrarModalCantidad && productoSeleccionado && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-2 border shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                Seleccionar Cantidad
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Producto:</p>
                                    <p className="font-medium">{productoSeleccionado.descripcion}</p>
                                    <p className="text-sm text-gray-500">Stock disponible: {productoSeleccionado.cantidad}</p>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
                                        Cantidad
                                    </label>
                                    <input
                                        ref={cantidadInputRef}
                                        type="number"
                                        id="cantidad"
                                        step="0.01"
                                        min="0.01"
                                        max={productoSeleccionado.cantidad}
                                        value={cantidadSeleccionada}
                                        onChange={handleCantidadChange}
                                        onKeyDown={handleKeyDown}
                                        className="form-input w-full p-4 text-2xl text-center border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 px-4 py-3">
                                <button
                                    onClick={() => {
                                        setMostrarModalCantidad(false);
                                        setProductoSeleccionado(null);
                                        setCantidadSeleccionada('');
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmarCantidad}
                                    className="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SelectedProductItem = ({ item, onRemove, onQuantityChange, isEditable, index, totalItems }) => {
    const handleCantidadChange = (e) => {
        const valor = e.target.value;
        // Permitir valores vacíos temporalmente para mejor UX
        if (valor === '') {
            onQuantityChange(item.id_producto_insucursal, '');
            return;
        }
        
        // Validar que sea un número válido con hasta 2 decimales
        if (/^\d*\.?\d{0,2}$/.test(valor)) {
            onQuantityChange(item.id_producto_insucursal, valor);
        }
    };

    return (
        <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border-b border-gray-200 space-y-2 sm:space-y-0 relative">
            {/* Índice en la esquina */}
            <div className="absolute top-2 right-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                {index + 1}/{totalItems}
            </div>
            
            <div className="flex-grow">
                <p className="font-semibold text-gray-800">{item.descripcion_real}</p>
                <p className="text-sm text-gray-500">
                    <b>{item.barras_real}</b> | {item.alterno_real}
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="text" 
                    inputMode="decimal"
                    value={item.cantidad}
                    onChange={handleCantidadChange}
                    onBlur={(e) => {
                        // Al perder el foco, asegurar un valor válido
                        const valor = e.target.value;
                        if (valor === '' || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
                            onQuantityChange(item.id_producto_insucursal, '1.00');
                        } else {
                            // Formatear a 2 decimales
                            onQuantityChange(item.id_producto_insucursal, parseFloat(valor).toFixed(2));
                        }
                    }}
                    readOnly={!isEditable}
                    className={`form-input w-24 p-2 border border-gray-300 rounded-md text-center ${!isEditable ? 'bg-gray-100' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
                    aria-label={`Cantidad para ${item.descripcion_real}`}
                />
                {isEditable && (
                    <button 
                        onClick={() => onRemove(item.id_producto_insucursal)} 
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-md text-sm transition"
                    >
                        Eliminar
                    </button>
                )}
            </div>
        </li>
    );
};

const TransferenciaForm = ({ onSave, onCancel, sucursalActualId, transferenciaToEdit = null, sucursales, cargarTransferencias }) => {
    const esEdicion = !!transferenciaToEdit;
    const idSucursalOrigen = sucursalActualId || ID_SUCURSAL_ACTUAL_ORIGEN_PLACEHOLDER;

    const [idSucursalDestinoSeleccionada, setIdSucursalDestinoSeleccionada] = useState(transferenciaToEdit?.id_destino || '');
    const [itemsTransferencia, setItemsTransferencia] = useState([]);
    const [error, setError] = useState('');
    const [estaCargando, setEstaCargando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const [observaciones, setObservaciones] = useState(transferenciaToEdit?.observaciones || '');
    const [mostrarObservaciones, setMostrarObservaciones] = useState(false);

    useEffect(() => {
        if (transferenciaToEdit && transferenciaToEdit.items) {
            // Mapear items de la transferencia a editar, obteniendo stock original del inventario
            const itemsMapeados = transferenciaToEdit.items.map(itemAPI => {
                // Buscar el producto en el inventario usando el id_producto_insucursal
                const productoInventario = mockInventarioData.find(pInv => pInv.id === itemAPI.id_producto_insucursal);
                
                // Crear un objeto con la estructura correcta para el formulario
                return {
                    id: itemAPI.id, // ID del item de transferencia
                    id_producto: itemAPI.producto.id, // ID del producto global
                    id_pedido: transferenciaToEdit.id, // ID de la transferencia
                    id_producto_insucursal: itemAPI.producto.id, // ID del producto en inventario
                    cantidad: String(itemAPI.cantidad), // Convertir a string para consistencia
                    base: String(itemAPI.producto.precio_base), // Precio base del producto
                    venta: String(itemAPI.producto.precio), // Precio venta del producto
                    descuento: String(itemAPI.descuento || "0.00"),
                    monto: String((parseFloat(itemAPI.cantidad) * parseFloat(itemAPI.producto.precio)).toFixed(2)),
                    ct_real: parseFloat(itemAPI.cantidad),
                    barras_real: itemAPI.producto.codigo_barras,
                    alterno_real: itemAPI.producto.codigo_proveedor,
                    descripcion_real: itemAPI.producto.descripcion,
                    vinculo_real: itemAPI.id_producto_insucursal,
                    created_at: itemAPI.created_at,
                    updated_at: itemAPI.updated_at,
                    cantidad_original_stock_inventario: itemAPI?.cantidad || 0,
                    modificable: true, // Permitir edición en el formulario,
                    
                };
            });
            
            console.log('Items mapeados para edición:', itemsMapeados);
            setItemsTransferencia(itemsMapeados);
            setObservaciones(transferenciaToEdit.observaciones || '');
        }
    }, [transferenciaToEdit]);

    const handleAddProduct = (productoDeInventario) => {
        // productoDeInventario es un objeto de mockInventarioData con cantidadInicial
        if (itemsTransferencia.find(item => item.id_producto_insucursal === productoDeInventario.id)) {
            alert("Este producto ya ha sido agregado."); return;
        }
        // Crear un nuevo item con la estructura del JSON de la API
        const nuevoItem = {
            id: nextDetalleId++, // ID del item de transferencia (temporal para el mock)
            id_producto: productoDeInventario.id, // ID del producto "global"
            id_pedido: transferenciaToEdit?.id || null, // ID de la transferencia
            cantidad: productoDeInventario.cantidadInicial || "1.00", // Usar la cantidad seleccionada
            base: String(productoDeInventario.precio_base),
            venta: String(productoDeInventario.precio),
            descuento: "0.00",
            monto: String((parseFloat(productoDeInventario.cantidadInicial || "1.00") * parseFloat(productoDeInventario.precio)).toFixed(2)), // Calcular monto con la cantidad seleccionada
            ct_real: parseFloat(productoDeInventario.cantidadInicial || "1.00"),
            barras_real: productoDeInventario.codigo_barras,
            alterno_real: productoDeInventario.codigo_proveedor,
            descripcion_real: productoDeInventario.descripcion,
            vinculo_real: productoDeInventario.id, // ID del inventario_sucursal
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            id_producto_insucursal: productoDeInventario.id, // Clave para identificar el producto del inventario
            cantidad_original_stock_inventario: productoDeInventario.cantidad, // Stock del inventario al momento de agregar
            modificable: true,
        };
        setItemsTransferencia(prev => [...prev, nuevoItem]);
    };

    const handleRemoveProduct = (idProductoInsucursal) => {
        setItemsTransferencia(prev => prev.filter(item => item.id_producto_insucursal !== idProductoInsucursal));
    };

    const handleQuantityChange = (idProductoInsucursal, nuevaCantidadStr) => {
        setItemsTransferencia(prevItems =>
            prevItems.map(item => {
                if (item.id_producto_insucursal === idProductoInsucursal) {
                    // Si está vacío, mantener el valor actual
                    if (nuevaCantidadStr === '') {
                        return item;
                    }

                    const nuevaCantidadNum = parseFloat(nuevaCantidadStr);
                    const stockOriginalNum = parseFloat(item.cantidad_original_stock_inventario);
                    
                    // Validar la cantidad
                    if (isNaN(nuevaCantidadNum) || nuevaCantidadNum <= 0) {
                        return item;
                    }


                    // Calcular el nuevo monto
                    const ventaNum = parseFloat(item.venta);
                    const nuevoMonto = (nuevaCantidadNum * ventaNum).toFixed(2);

                    return {
                        ...item,
                        cantidad: nuevaCantidadStr, // Mantener el string original
                        monto: String(nuevoMonto),
                        ct_real: nuevaCantidadNum
                    };
                }
                return item;
            })
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        setMensajeExito('');
        
        if (!idSucursalDestinoSeleccionada) { 
            setError('Debe seleccionar una sucursal de destino.'); 
            return; 
        }
        if (itemsTransferencia.length === 0) { 
            setError('Debe agregar al menos un producto.'); 
            return; 
        }

        let validSubmission = true;
        itemsTransferencia.forEach(item => {
            const cant = parseFloat(item.cantidad);
            const stockOrig = parseFloat(item.cantidad_original_stock_inventario);
            if (isNaN(cant) || cant <= 0) {
                setError(`Cantidad inválida para ${item.descripcion_real}.`);
                validSubmission = false;
            }
           /*  if (cant > stockOrig) {
                setError(`Cantidad para ${item.descripcion_real} (${cant}) excede el stock original del inventario (${stockOrig}).`);
                validSubmission = false;
            } */
        });
        if (!validSubmission) return;

        const datosTransferencia = {
            id_origen: idSucursalOrigen,
            id_destino: parseInt(idSucursalDestinoSeleccionada),
            observaciones: observaciones.trim(),
            items: itemsTransferencia.map(item => ({
                id: esEdicion ? item.id : undefined,
                id_producto_insucursal: item.id_producto_insucursal,
                cantidad: item.cantidad,
                base: item.base,
                venta: item.venta,
                descripcion_real: item.descripcion_real,
                barras_real: item.barras_real,
            })),
        };

        // Agregar el ID si es edición
        if (esEdicion) {
            datosTransferencia.id = transferenciaToEdit.id;
            datosTransferencia.actualizando = true; // Indicador de que es una actualización
        } else {
            datosTransferencia.actualizando = false; // Indicador de que es una creación
        }

        setEstaCargando(true);
        try {
            const res = await db.settransferenciaDici(datosTransferencia);
            
            if (res.data.estado) {
                setMensajeExito(`Transferencia ${esEdicion ? 'actualizada' : 'creada'} exitosamente.`);
                await cargarTransferencias(); // Recargar la lista
                
                if (!esEdicion) {
                    // Resetear el formulario solo si es creación
                    setIdSucursalDestinoSeleccionada('');
                    setItemsTransferencia([]);
                    setObservaciones('');
                }
                
                // Notificar al componente padre
                onSave(res.data);
                
                // Limpiar mensaje de éxito después de 5 segundos
                setTimeout(() => setMensajeExito(''), 5000);
            } else {
                throw new Error(res.data.mensaje || 'Error al procesar la transferencia');
            }
        } catch (err) {
            setError(err.message || `Error al ${esEdicion ? 'actualizar' : 'crear'} transferencia.`);
        } finally {
            setEstaCargando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-1 md:p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{esEdicion ? `Editando Transferencia (Mock) #${transferenciaToEdit.id}` : 'Crear Nueva Transferencia (Mock)'}</h2>
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"><p>{error}</p></div>}
            {mensajeExito && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"><p>{mensajeExito}</p></div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="id_destino" className="block text-sm font-medium text-gray-700">Sucursal Destino:</label>
                    <select id="id_destino" value={idSucursalDestinoSeleccionada} onChange={(e) => setIdSucursalDestinoSeleccionada(e.target.value)} required className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm">
                        <option value="">-- Seleccione Destino --</option>
                        {sucursales.map(s => <option key={s.id} value={s.id}>{s.codigo}</option>)}
                    </select>
                </div>
               
            </div>

            

            {/* Contenedor con posición relativa para el área de búsqueda y lista */}
            <div className="relative">
                {/* Área de búsqueda fija */}
                <div className="sticky top-0 z-10 bg-white pb-4 border-b border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buscar y Agregar Productos:</label>
                    <ProductSearchInput onProductSelect={handleAddProduct} sucursalIdOrigen={idSucursalOrigen} />
                </div>

                {/* Lista de productos con scroll */}
                {itemsTransferencia.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            Productos en Transferencia ({itemsTransferencia.length} items):
                        </h3>
                        <ul className="border rounded-md divide-y max-h-[calc(100vh-400px)] overflow-y-auto">
                            {itemsTransferencia.map((item, index) => (
                                <SelectedProductItem 
                                    key={item.id_producto_insucursal} 
                                    item={item} 
                                    onRemove={handleRemoveProduct} 
                                    onQuantityChange={handleQuantityChange} 
                                    isEditable={true}
                                    index={index}
                                    totalItems={itemsTransferencia.length}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </div>


            <div>
                <button
                    type="button"
                    onClick={() => setMostrarObservaciones(!mostrarObservaciones)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <i className={`fas fa-comment-alt mr-2 ${mostrarObservaciones ? 'text-indigo-600' : 'text-gray-400'}`}></i>
                    {mostrarObservaciones ? 'Ocultar Observaciones' : 'Agregar Observaciones'}
                </button>
            </div>
            {/* Textarea de Observaciones Colapsable */}
            {mostrarObservaciones && (
                <div className="mt-4 transition-all duration-200 ease-in-out">
                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones
                    </label>
                    <textarea
                        id="observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        rows="3"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Ingrese observaciones adicionales sobre la transferencia..."
                    />
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button type="button" onClick={onCancel} disabled={estaCargando} className="w-full sm:w-auto px-6 py-2.5 border rounded-md shadow-sm text-sm bg-white hover:bg-gray-50 transition">Cancelar</button>
                <button type="submit" disabled={estaCargando || itemsTransferencia.length === 0} className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border-transparent rounded-md shadow-sm text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition">
                    {estaCargando ? 'Guardando...' : (esEdicion ? 'Actualizar Transferencia' : 'Crear Transferencia')}
                </button>
            </div>
        </form>
    );
};

const TransferenciaDetailView = ({ transferencia, onBack, sucursales }) => {
    if (!transferencia) return <p>Cargando detalles...</p>;

    const origen = transferencia.origen || mockSucursalesData.find(s => s.id === transferencia.id_origen);
    const destino = transferencia.destino || mockSucursalesData.find(s => s.id === transferencia.id_destino);

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Detalle de Transferencia #{transferencia.id}</h2>
                <button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md transition">&larr; Volver al Listado</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 border rounded-md bg-gray-50">
                <div><p className="text-sm text-gray-500">ID Transferencia:</p> <p className="font-medium">{transferencia.idinsucursal || transferencia.id}</p></div>
                <div><p className="text-sm text-gray-500">Estado:</p> <StatusBadge estadoNum={transferencia.estado} /></div>
                <div><p className="text-sm text-gray-500">Fecha Creación:</p> <p className="font-medium">{format(new Date(transferencia.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}</p></div>
                <div><p className="text-sm text-gray-500">Última Actualización:</p> <p className="font-medium">{format(new Date(transferencia.updated_at), 'dd/MM/yyyy HH:mm', { locale: es })}</p></div>
                <div><p className="text-sm text-gray-500">Sucursal Origen:</p> <p className="font-medium">{origen?.nombre_sucursal || `ID: ${transferencia.id_origen}`}</p></div>
                <div><p className="text-sm text-gray-500">Sucursal Destino:</p> <p className="font-medium">{destino?.nombre_sucursal || `ID: ${transferencia.id_destino}`}</p></div>
                {transferencia.observaciones && (
                    <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Observaciones:</p>
                        <p className="font-medium whitespace-pre-wrap">{transferencia.observaciones}</p>
                    </div>
                )}
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mb-3">Items Transferidos:</h3>
            {transferencia.items && transferencia.items.length > 0 ? (
                <ul className="border rounded-md divide-y max-h-[50vh] overflow-y-auto">
                    {transferencia.items.map((item, index) => (
                        <SelectedProductItem key={item.id || index} item={item} onRemove={()=>{}} onQuantityChange={()=>{}} isEditable={false} />
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No hay items en esta transferencia.</p>
            )}

            <div className="mt-6 pt-4 border-t text-right">
                <p className="text-sm text-gray-500">Total Base: <span className="font-medium">${parseFloat(transferencia.base || 0).toFixed(2)}</span></p>
                <p className="text-sm text-gray-500">Total Venta: <span className="font-medium">${parseFloat(transferencia.venta || 0).toFixed(2)}</span></p>
            </div>
        </div>
    );
};


const TransferenciaList = ({ 
    sucursalActualId, 
    onRequireRefresh, 
    onEdit, 
    onViewDetails, 
    sucursales, 
    cargarTransferencias,
    // Props de estado recibidas
    transferencias,
    setTransferencias,
    estaCargando,
    setEstaCargando,
    error,
    setError,
    filtros,
    setFiltros,
    filtrosActivos,
    setFiltrosActivos,
    paginacion,
    setPaginacion,
    mostrarFiltros,
    setMostrarFiltros
}) => {
    // Eliminamos el useEffect de carga de datos ya que ahora está en el componente padre

    const handleFilterChange = (e) => {
        setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSearch = () => {
        setFiltrosActivos({...filtros});
        cargarTransferencias();
    };

    if (estaCargando && transferencias.length === 0) return <div className="text-center p-10">Cargando...</div>;
    if (error) return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4"><p>{error}</p></div>;

    return (
        <div className="rounded-lg">
            {/* Header con botón de filtros */}
            <div className="px-4 py-3 border-b border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Transferencias</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <i className={`fas fa-filter mr-2 ${mostrarFiltros ? 'text-indigo-600' : 'text-gray-400'}`}></i>
                            Filtros
                        </button>
                        <button
                            onClick={handleSearch}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <i className="fas fa-search mr-2"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtros colapsables */}
            <div className={`border-b border-gray-200 transition-all duration-200 ${mostrarFiltros ? 'block' : 'hidden'}`}>
                <div className="px-4 py-3 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div>
                            <label htmlFor="estatus_string_filter" className="block text-xs font-medium text-gray-700">ID</label>
                            <input
                                name="q"
                                id="q_filter"
                                placeholder="Buscar por ID"
                                value={filtros.q}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full pl-3 pr-8 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="estatus_string_filter" className="block text-xs font-medium text-gray-700">Estado</label>
                            <select
                                name="estatus_string"
                                id="estatus_string_filter"
                                value={filtros.estatus_string}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full pl-3 pr-8 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            >
                                <option value="">Todos</option>
                                <option value="0">Pendiente</option>
                                <option value="1">Procesado</option>
                                <option value="2">Extraído</option>
                                <option value="3">En Revision</option>
                                <option value="4">Revisado</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="id_destino_filter" className="block text-xs font-medium text-gray-700">Destino</label>
                            <select
                                name="id_destino"
                                id="id_destino_filter"
                                value={filtros.id_destino}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full pl-3 pr-8 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            >
                                <option value="">Todas</option>
                                {sucursales.map(s => <option key={s.id} value={s.id}>{s.codigo}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="limit_filter" className="block text-xs font-medium text-gray-700">Resultados</label>
                            <select
                                name="limit"
                                id="limit_filter"
                                value={filtros.limit}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full pl-3 pr-8 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        {/* <div>
                            <label htmlFor="fecha_desde_filter" className="block text-xs font-medium text-gray-700">Desde</label>
                            <input
                                type="date"
                                name="fecha_desde"
                                id="fecha_desde_filter"
                                value={filtros.fecha_desde}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full pl-3 pr-8 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="fecha_hasta_filter" className="block text-xs font-medium text-gray-700">Hasta</label>
                            <input
                                type="date"
                                name="fecha_hasta"
                                id="fecha_hasta_filter"
                                value={filtros.fecha_hasta}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full pl-3 pr-8 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            />
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Lista de Transferencias en Tarjetas */}
            <div className="p-0">
                {estaCargando && transferencias.length === 0 ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <span className="ml-3 text-gray-600">Cargando transferencias...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <i className="fas fa-exclamation-circle text-red-500"></i>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                ) : transferencias.length === 0 ? (
                    <div className="text-center py-12">
                        <i className="fas fa-box-open text-gray-400 text-4xl mb-3"></i>
                        <p className="text-gray-500">No se encontraron transferencias</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {transferencias.map(t => (
                            <div key={t.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                {/* Header de la tarjeta */}
                                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-900">#{t.id}</span>
                                            <StatusBadge estadoNum={t.estado} />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onViewDetails(t)}
                                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                                                title="Ver detalles"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            {t.estado === ESTADO_STRING_A_NUMERICO['PENDIENTE'] && (
                                                <button
                                                    onClick={() => onEdit(t)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                    title="Editar"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido de la tarjeta */}
                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <i className="far fa-clock w-5"></i>
                                            <span className="ml-2">{format(new Date(t.created_at), 'dd/MM/yy HH:mm', { locale: es })}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-500">
                                            <i className="fas fa-warehouse w-5"></i>
                                            <span className="ml-2">{t.origen?.nombre_sucursal || `ID: ${t.id_origen}`}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-500">
                                            <i className="fas fa-truck w-5"></i>
                                            <span className="ml-2">{t.destino?.nombre_sucursal || `ID: ${t.id_destino}`}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-500">
                                            <i className="fas fa-boxes w-5"></i>
                                            <span className="ml-2">{t.items?.length || 0} productos</span>
                                        </div>

                                        <div className="pt-2 border-t border-gray-100">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Total Base:</span>
                                                <span className="font-medium text-gray-900">${parseFloat(t.base || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm mt-1">
                                                <span className="text-gray-500">Total Venta:</span>
                                                <span className="font-medium text-gray-900">${parseFloat(t.venta || 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Paginación */}
            {paginacion.last_page > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">{paginacion.from || 0}</span> a <span className="font-medium">{paginacion.to || 0}</span> de <span className="font-medium">{paginacion.total || 0}</span> resultados
                        </div>
                        <div className="flex space-x-1">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={paginacion.current_page === 1 || estaCargando}
                                className="relative inline-flex items-center px-2 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                <i className="fas fa-angle-double-left"></i>
                            </button>
                            <button
                                onClick={() => handlePageChange(paginacion.current_page - 1)}
                                disabled={paginacion.current_page === 1 || estaCargando}
                                className="relative inline-flex items-center px-2 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                <i className="fas fa-angle-left"></i>
                            </button>
                            <span className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white">
                                Página {paginacion.current_page} de {paginacion.last_page}
                            </span>
                            <button
                                onClick={() => handlePageChange(paginacion.current_page + 1)}
                                disabled={paginacion.current_page === paginacion.last_page || estaCargando}
                                className="relative inline-flex items-center px-2 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                <i className="fas fa-angle-right"></i>
                            </button>
                            <button
                                onClick={() => handlePageChange(paginacion.last_page)}
                                disabled={paginacion.current_page === paginacion.last_page || estaCargando}
                                className="relative inline-flex items-center px-2 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                <i className="fas fa-angle-double-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TransferenciasModule = ({ sucursalActualId }) => {
    const [vistaActual, setVistaActual] = useState('list'); // 'list', 'form', 'detail'
    const [transferenciaSeleccionada, setTransferenciaSeleccionada] = useState(null);
    const [refreshListKey, setRefreshListKey] = useState(0);
    const [sucursales, setSucursales] = useState([]);
    
    // Estados movidos desde TransferenciaList
    const [transferencias, setTransferencias] = useState([]);
    const [estaCargando, setEstaCargando] = useState(true);
    const [error, setError] = useState('');
    const [filtros, setFiltros] = useState({ q: '', estatus_string: '', id_destino: '', limit: 10 });
    const [filtrosActivos, setFiltrosActivos] = useState({ q: '', estatus_string: '', id_destino: '', limit: 10 });
    const [paginacion, setPaginacion] = useState({});
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const cargarTransferencias = useCallback(async (filtros) => {
        try {
            const response = await db.reqMipedidos(filtros);
            return {
                transferencias: response.data.data || [],
                paginacion: response.data
            };
        } catch (err) {
            throw new Error('Error al cargar transferencias');
        }
    }, []);

    // useEffect movido desde TransferenciaList
    useEffect(() => { 
        const fetchData = async () => {
            setEstaCargando(true);
            setError('');
            try {
                const { transferencias: nuevasTransferencias, paginacion: nuevaPaginacion } = await cargarTransferencias(filtrosActivos);
                setTransferencias(nuevasTransferencias);
                setPaginacion(nuevaPaginacion);
            } catch (err) {
                setError('No se pudieron cargar las transferencias.');
                setTransferencias([]);
            } finally {
                setEstaCargando(false);
            }
        };
        fetchData();
    }, [cargarTransferencias, filtrosActivos, refreshListKey]);

    useEffect(() => {
        const cargarSucursales = async () => {
            try { 
                const res = await db.getSucursales();
                if (res.data.msj) setSucursales(res.data.msj);
            }
            catch (error) { console.error("Error cargando sucursales:", error); }
        };
        cargarSucursales();
    }, []);

    const handleSaveTransfer = (transferenciaGuardada) => {
        console.log("Transferencia guardada:", transferenciaGuardada);
        setVistaActual('list');
        setTransferenciaSeleccionada(null);
        setRefreshListKey(prevKey => prevKey + 1);
    };

    const handleCancelForm = () => {
        setVistaActual('list');
        setTransferenciaSeleccionada(null);
    };

    const handleGoToCreate = () => {
        setTransferenciaSeleccionada(null);
        setVistaActual('form');
    };

    const handleEditTransfer = (transferencia) => {
        setTransferenciaSeleccionada(transferencia);
        setVistaActual('form');
    };

    const handleViewDetails = (transferencia) => {
        setTransferenciaSeleccionada(transferencia);
        setVistaActual('detail');
    };

    const idOrigenReal = sucursalActualId || ID_SUCURSAL_ACTUAL_ORIGEN_PLACEHOLDER;

    return (
        <div className="mx-auto px-2 py-4 sm:px-4 md:px-6">
            <header className="mb-6 pb-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Transferencias</h3>
                    {vistaActual === 'list' && (<button onClick={handleGoToCreate} className="mt-3 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition">+ Nueva Transferencia</button>)}
                    {(vistaActual === 'form' || vistaActual === 'detail') && (<button onClick={handleCancelForm} className="mt-3 sm:mt-0 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition">&larr; Volver al Listado</button>)}
                </div>
            </header>
            <main>
                {vistaActual === 'list' && (
                    <TransferenciaList 
                        sucursalActualId={idOrigenReal} 
                        onRequireRefresh={refreshListKey} 
                        onEdit={handleEditTransfer} 
                        onViewDetails={handleViewDetails}
                        sucursales={sucursales}
                        cargarTransferencias={cargarTransferencias}
                        // Props de estado movidas
                        transferencias={transferencias}
                        setTransferencias={setTransferencias}
                        estaCargando={estaCargando}
                        setEstaCargando={setEstaCargando}
                        error={error}
                        setError={setError}
                        filtros={filtros}
                        setFiltros={setFiltros}
                        filtrosActivos={filtrosActivos}
                        setFiltrosActivos={setFiltrosActivos}
                        paginacion={paginacion}
                        setPaginacion={setPaginacion}
                        mostrarFiltros={mostrarFiltros}
                        setMostrarFiltros={setMostrarFiltros}
                    />
                )}
                {vistaActual === 'form' && (
                    <TransferenciaForm 
                        onSave={handleSaveTransfer} 
                        onCancel={handleCancelForm} 
                        sucursalActualId={idOrigenReal} 
                        transferenciaToEdit={transferenciaSeleccionada}
                        sucursales={sucursales}
                        cargarTransferencias={cargarTransferencias}
                    />
                )}
                {vistaActual === 'detail' && (
                    <TransferenciaDetailView 
                        transferencia={transferenciaSeleccionada} 
                        onBack={handleCancelForm}
                        sucursales={sucursales}
                    />
                )}
            </main>
        </div>
    );
};

export default TransferenciasModule;

// ###################################################################################
// #                            FIN: COMPONENTES REACT                               #
// ###################################################################################

