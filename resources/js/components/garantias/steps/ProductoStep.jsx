import React, { useState, useEffect } from 'react';

const ProductoStep = ({ formData, updateFormData, errors, db }) => {
    const [productos, setProductos] = useState([]);
    const [carritoProductos, setCarritoProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState('descripcion'); // 'descripcion', 'codigo_barras', 'codigo_proveedor'
    const [totales, setTotales] = useState({
        subtotal: 0,
        cantidad_total: 0,
        monto_devolucion_total: 0
    });

    useEffect(() => {
        // Cargar productos del carrito desde formData si existen
        if (formData.productos_carrito && formData.productos_carrito.length > 0) {
            setCarritoProductos(formData.productos_carrito);
        }
    }, []);

    useEffect(() => {
        // Calcular totales cuando cambie el carrito
        calcularTotales();
        // Actualizar formData con los productos del carrito
        updateFormData('productos_carrito', carritoProductos);
    }, [carritoProductos]);

    // Verificar si el caso actual permite devolución de dinero
    const permiteDevolucionDinero = () => {
        // Solo casos 2 y 4 permiten devolución de dinero
        return formData.caso_uso === 2 || formData.caso_uso === 4;
    };

    const calcularTotales = () => {
        const subtotal = carritoProductos.reduce((sum, item) => {
            return sum + (item.precio * item.cantidad);
        }, 0);

        const cantidad_total = carritoProductos.reduce((sum, item) => {
            return sum + item.cantidad;
        }, 0);

        const monto_devolucion_total = carritoProductos.reduce((sum, item) => {
            return sum + (item.monto_devolucion_unitario * item.cantidad);
        }, 0);

        setTotales({
            subtotal,
            cantidad_total,
            monto_devolucion_total
        });

        // Actualizar formData con los totales
        updateFormData('cantidad_total', cantidad_total);
        updateFormData('monto_devolucion_dinero', monto_devolucion_total);
    };

    const searchProductos = async (term, type = 'descripcion') => {
        if (!term || term.length < 2) {
            setProductos([]);
            return;
        }

        setLoading(true);
        try {
            // Simular la búsqueda en múltiples campos del modelo inventario
            const searchParams = {
                term,
                field: type,
                sucursal_id: formData.sucursal_id || null
            };

            const response = await db.searchProductosInventario(searchParams);
            
            // Axios devuelve la respuesta en response.data
            const apiResponse = response.data;
            
            if (apiResponse.status === 200 && apiResponse.data) {
                // Filtrar productos que ya están en el carrito
                const productosDisponibles = apiResponse.data.filter(producto => 
                    !carritoProductos.some(item => item.id === producto.id)
                );
                setProductos(productosDisponibles);
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setProductos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        searchProductos(value, searchType);
    };

    const handleSearchTypeChange = (e) => {
        const type = e.target.value;
        setSearchType(type);
        if (searchTerm.length >= 2) {
            searchProductos(searchTerm, type);
        }
    };

    const agregarProductoAlCarrito = (producto) => {
        const precioOriginal = parseFloat(producto.precio) || 0;
        
        const nuevoItem = {
            id: producto.id,
            descripcion: producto.descripcion,
            codigo_barras: producto.codigo_barras || '',
            codigo_proveedor: producto.codigo_proveedor || '',
            precio: precioOriginal,
            precio_original: precioOriginal, // Guardar precio original para validaciones
            stock_disponible: parseInt(producto.stock) || 0,
            cantidad: 1,
            cantidad_salida: casoActual?.campos_requeridos.includes('cantidad_salida') ? 1 : 0,
            monto_devolucion_unitario: casoActual?.campos_requeridos.includes('monto_devolucion') ? precioOriginal : 0,
            categoria: producto.categoria || '',
            proveedor: producto.proveedor || ''
        };

        setCarritoProductos([...carritoProductos, nuevoItem]);
        setSearchTerm('');
        setProductos([]);
    };

    const actualizarCantidadProducto = (productoId, campo, valor) => {
        const valorNumerico = parseFloat(valor) || 0;
        
        setCarritoProductos(carritoProductos.map(item => {
            if (item.id === productoId) {
                // Validar restricciones de devolución de dinero
                if (campo === 'monto_devolucion_unitario' && !permiteDevolucionDinero()) {
                    // No permitir cambios en monto de devolución si el caso no lo permite
                    return item;
                }
                
                if (campo === 'monto_devolucion_unitario' && permiteDevolucionDinero()) {
                    // En casos de devolución de dinero, no permitir montos mayores al precio original
                    const montoMaximo = item.precio_original;
                    const montoFinal = Math.min(valorNumerico, montoMaximo);
                    
                    return {
                        ...item,
                        [campo]: montoFinal
                    };
                }
                
                return {
                    ...item,
                    [campo]: valorNumerico
                };
            }
            return item;
        }));
    };

    const eliminarProductoDelCarrito = (productoId) => {
        setCarritoProductos(carritoProductos.filter(item => item.id !== productoId));
    };

    const casosUso = [
        { id: 1, campos_requeridos: ['producto', 'cantidad_salida'], tipo: 'producto_por_producto' },
        { id: 2, campos_requeridos: ['producto', 'monto_devolucion'], tipo: 'producto_por_dinero' },
        { id: 3, campos_requeridos: ['producto', 'cantidad_salida'], tipo: 'producto_por_producto' },
        { id: 4, campos_requeridos: ['producto', 'monto_devolucion'], tipo: 'producto_por_dinero' },
        { id: 5, campos_requeridos: ['producto'], tipo: 'dar_de_baja' }
    ];

    const casoActual = casosUso.find(c => c.id === formData.caso_uso);

    const getTituloSegunCaso = () => {
        switch (formData.caso_uso) {
            case 1: return 'Productos Dañados que Entran';
            case 2: return 'Productos Dañados que Entran';
            case 3: return 'Productos Buenos que Entran';
            case 4: return 'Productos Buenos que Entran';
            case 5: return 'Productos Dañados para Dar de Baja';
            default: return 'Productos';
        }
    };

    const getDescripcionSegunCaso = () => {
        switch (formData.caso_uso) {
            case 1: return 'Agregue los productos dañados que trae el cliente y especifique las cantidades de productos buenos que se le entregarán';
            case 2: return 'Agregue los productos dañados que trae el cliente y especifique los montos a devolver (máximo el precio original)';
            case 3: return 'Agregue los productos buenos que devuelve el cliente y especifique los productos buenos que se le entregarán';
            case 4: return 'Agregue los productos buenos que devuelve el cliente y especifique los montos a devolver (máximo el precio original)';
            case 5: return 'Agregue los productos dañados encontrados internamente para dar de baja';
            default: return 'Agregue los productos relacionados con la garantía';
        }
    };

    return (
        <div className="producto-step">
            <div className="mb-4">
                <h4 className="text-primary mb-3">
                    <i className="fa fa-shopping-cart me-2"></i>
                    {getTituloSegunCaso()}
                </h4>
                <p className="text-muted">
                    {getDescripcionSegunCaso()}
                </p>
                
                {/* Alerta de restricciones para casos sin devolución de dinero */}
                {!permiteDevolucionDinero() && (
                    <div className="alert alert-info border-info mt-3" style={{ borderWidth: '2px' }}>
                        <div className="d-flex align-items-center">
                            <div className="me-3">
                                <i className="fa fa-info-circle fa-lg text-info"></i>
                            </div>
                            <div>
                                <strong>Restricción de Devolución:</strong> En este caso de uso <strong>NO se permite devolución de dinero</strong>. Solo se pueden manejar diferencias a favor de la empresa.
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Alerta de restricciones para casos con devolución de dinero */}
                {permiteDevolucionDinero() && (
                    <div className="alert alert-warning border-warning mt-3" style={{ borderWidth: '2px' }}>
                        <div className="d-flex align-items-center">
                            <div className="me-3">
                                <i className="fa fa-exclamation-triangle fa-lg text-warning"></i>
                            </div>
                            <div>
                                <strong>Restricción de Devolución:</strong> En este caso de uso se permite devolución de dinero, pero <strong>máximo hasta el precio original</strong> del producto. No se permiten diferencias a favor del cliente.
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Buscador de Productos */}
            <div className="card mb-4">
                <div className="card-header">
                    <h6 className="mb-0">
                        <i className="fa fa-search me-2"></i>
                        Buscar y Agregar Productos
                    </h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <label className="form-label">Buscar por:</label>
                            <select 
                                className="form-select"
                                value={searchType}
                                onChange={handleSearchTypeChange}
                            >
                                <option value="descripcion">Descripción</option>
                                <option value="codigo_barras">Código de Barras</option>
                                <option value="codigo_proveedor">Código Proveedor</option>
                            </select>
                        </div>
                        <div className="col-md-9">
                            <label className="form-label">
                                Buscar Producto <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.productos_carrito ? 'is-invalid' : ''}`}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder={`Escriba ${searchType === 'descripcion' ? 'el nombre' : searchType === 'codigo_barras' ? 'el código de barras' : 'el código del proveedor'} del producto...`}
                            />
                            {errors.productos_carrito && (
                                <div className="invalid-feedback">{errors.productos_carrito}</div>
                            )}
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center py-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Buscando...</span>
                            </div>
                        </div>
                    )}

                    {productos.length > 0 && (
                        <div className="mt-3">
                            <h6>Resultados de búsqueda:</h6>
                            <div className="list-group">
                                {productos.map((producto) => (
                                    <button
                                        key={producto.id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => agregarProductoAlCarrito(producto)}
                                    >
                                        <div className="d-flex w-100 justify-content-between">
                                            <div>
                                                <h6 className="mb-1">{producto.descripcion}</h6>
                                                <p className="mb-1 text-muted">
                                                    {producto.codigo_barras && <span>CB: {producto.codigo_barras} | </span>}
                                                    {producto.codigo_proveedor && <span>CP: {producto.codigo_proveedor} | </span>}
                                                    Categoría: {producto.categoria || 'Sin categoría'}
                                                </p>
                                                <small>
                                                    Precio: ${producto.precio || 'N/A'} | 
                                                    Stock: {producto.stock || 'N/A'}
                                                </small>
                                            </div>
                                            <div className="text-end">
                                                <i className="fa fa-plus-circle text-success fa-2x"></i>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchTerm.length >= 2 && productos.length === 0 && !loading && (
                        <div className="alert alert-info mt-3">
                            <i className="fa fa-info-circle me-2"></i>
                            No se encontraron productos que coincidan con "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>

            {/* Carrito de Productos */}
            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                        <i className="fa fa-shopping-cart me-2"></i>
                        Carrito de Productos
                        <span className="badge bg-primary ms-2">{carritoProductos.length}</span>
                    </h6>
                    {carritoProductos.length > 0 && (
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                                if (confirm('¿Está seguro de vaciar el carrito?')) {
                                    setCarritoProductos([]);
                                }
                            }}
                        >
                            <i className="fa fa-trash me-1"></i>
                            Vaciar Carrito
                        </button>
                    )}
                </div>
                <div className="card-body">
                    {carritoProductos.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <i className="fa fa-shopping-cart fa-3x mb-3"></i>
                            <h6>El carrito está vacío</h6>
                            <p>Busque y agregue productos usando el buscador de arriba</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio Unit.</th>
                                        <th>Cant. Entra</th>
                                        {casoActual?.campos_requeridos.includes('cantidad_salida') && <th>Cant. Sale</th>}
                                        {casoActual?.campos_requeridos.includes('monto_devolucion') && <th>Monto Dev. (Máx: Precio Orig.)</th>}
                                        <th>Subtotal</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carritoProductos.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div>
                                                    <strong>{item.descripcion}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        {item.codigo_barras && `CB: ${item.codigo_barras} | `}
                                                        {item.codigo_proveedor && `CP: ${item.codigo_proveedor} | `}
                                                        Stock: {item.stock_disponible}
                                                    </small>
                                                </div>
                                            </td>
                                            <td>
                                                <strong>${item.precio.toFixed(2)}</strong>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    style={{ width: '80px' }}
                                                    value={item.cantidad}
                                                    min="1"
                                                    max={item.stock_disponible}
                                                    onChange={(e) => actualizarCantidadProducto(item.id, 'cantidad', e.target.value)}
                                                />
                                            </td>
                                            {casoActual?.campos_requeridos.includes('cantidad_salida') && (
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        style={{ width: '80px' }}
                                                        value={item.cantidad_salida}
                                                        min="0"
                                                        onChange={(e) => actualizarCantidadProducto(item.id, 'cantidad_salida', e.target.value)}
                                                    />
                                                </td>
                                            )}
                                            {casoActual?.campos_requeridos.includes('monto_devolucion') && (
                                                <td>
                                                    <div className="input-group input-group-sm">
                                                        <span className="input-group-text">$</span>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            style={{ width: '100px' }}
                                                            value={item.monto_devolucion_unitario}
                                                            min="0"
                                                            max={item.precio_original}
                                                            step="0.01"
                                                            onChange={(e) => actualizarCantidadProducto(item.id, 'monto_devolucion_unitario', e.target.value)}
                                                        />
                                                    </div>
                                                    <small className="text-muted">
                                                        Máx: ${item.precio_original.toFixed(2)}
                                                    </small>
                                                </td>
                                            )}
                                            <td>
                                                <strong className="text-success">
                                                    ${(item.precio * item.cantidad).toFixed(2)}
                                                </strong>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => eliminarProductoDelCarrito(item.id)}
                                                    title="Eliminar del carrito"
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Resumen de Totales */}
            {carritoProductos.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h6 className="mb-0">
                            <i className="fa fa-calculator me-2"></i>
                            Resumen de Totales
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 col-6">
                                <div className="text-center p-3 border rounded">
                                    <h4 className="text-primary mb-1">{totales.cantidad_total}</h4>
                                    <small className="text-muted">Productos Total</small>
                                </div>
                            </div>
                            <div className="col-md-3 col-6">
                                <div className="text-center p-3 border rounded">
                                    <h4 className="text-info mb-1">${totales.subtotal.toFixed(2)}</h4>
                                    <small className="text-muted">Subtotal</small>
                                </div>
                            </div>
                            {casoActual?.campos_requeridos.includes('monto_devolucion') && (
                                <div className="col-md-3 col-6">
                                    <div className="text-center p-3 border rounded bg-warning bg-opacity-25">
                                        <h4 className="text-danger mb-1 fw-bold">${totales.monto_devolucion_total.toFixed(2)}</h4>
                                        <small className="text-danger fw-bold">🔥 DEVOLUCIÓN DINERO</small>
                                        <br />
                                        <small className="text-muted">Máx: ${totales.subtotal.toFixed(2)}</small>
                                    </div>
                                </div>
                            )}
                            {casoActual?.campos_requeridos.includes('cantidad_salida') && (
                                <div className="col-md-3 col-6">
                                    <div className="text-center p-3 border rounded">
                                        <h4 className="text-sinapsis mb-1">
                                            {carritoProductos.reduce((sum, item) => sum + item.cantidad_salida, 0)}
                                        </h4>
                                        <small className="text-muted">Productos Salen</small>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* ALERTA PROMINENTE PARA DEVOLUCIÓN DE DINERO */}
                        {casoActual?.campos_requeridos.includes('monto_devolucion') && totales.monto_devolucion_total > 0 && (
                            <div className="alert alert-warning border-warning mt-4" style={{ 
                                borderWidth: '2px', 
                                backgroundColor: '#fff3cd',
                                boxShadow: '0 2px 4px rgba(255,193,7,0.2)'
                            }}>
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fa fa-exclamation-triangle fa-2x text-sinapsis"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="alert-heading mb-2 text-sinapsis">
                                            <i className="fa fa-money-bill-wave me-2"></i>
                                            ¡ATENCIÓN! SE DEVOLVERÁ DINERO
                                        </h6>
                                        <div className="mb-2">
                                            <strong>Monto total a devolver: </strong>
                                            <span className="badge bg-danger fs-6 px-3 py-2">
                                                <i className="fa fa-dollar-sign me-1"></i>
                                                ${totales.monto_devolucion_total.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="small">
                                            <i className="fa fa-info-circle me-1"></i>
                                            <strong>IMPORTANTE:</strong> Esta devolución requerirá aprobación de central antes de entregar el dinero. El monto máximo por producto es su precio original.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Información adicional */}
            {carritoProductos.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <h6 className="mb-0">
                            <i className="fa fa-sticky-note me-2"></i>
                            Información Adicional
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Motivo {formData.caso_uso <= 2 ? 'de la Garantía' : 'de la Devolución'}
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={formData.motivo || ''}
                                        onChange={(e) => updateFormData('motivo', e.target.value)}
                                        placeholder="Describa el motivo de la garantía o devolución..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <div className="mb-3">
                                    <label className="form-label">Detalles Adicionales</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={formData.detalles_adicionales || ''}
                                        onChange={(e) => updateFormData('detalles_adicionales', e.target.value)}
                                        placeholder="Cualquier información adicional relevante..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Resumen del Flujo */}
            {carritoProductos.length > 0 && (
                <div className="alert alert-info mt-4">
                    <h6 className="alert-heading">
                        <i className="fa fa-info-circle me-2"></i>
                        Resumen del Flujo
                    </h6>
                    <div className="mb-2">
                        <strong>Productos en carrito:</strong> {carritoProductos.length}
                    </div>
                    <div className="mb-2">
                        <strong>Cantidad total que entra:</strong> {totales.cantidad_total}
                    </div>
                    {casoActual?.campos_requeridos.includes('cantidad_salida') && (
                        <div className="mb-2">
                            <strong>Cantidad total que sale:</strong> {carritoProductos.reduce((sum, item) => sum + item.cantidad_salida, 0)}
                        </div>
                    )}
                    {casoActual?.campos_requeridos.includes('monto_devolucion') && (
                        <div className="mb-2">
                            <strong>Monto total a devolver:</strong> ${totales.monto_devolucion_total.toFixed(2)}
                        </div>
                    )}
                    <hr className="my-2" />
                    <div className="text-muted">
                        <strong>Flujo:</strong> {
                            formData.caso_uso === 1 ? 'Productos dañados → Productos buenos' :
                            formData.caso_uso === 2 ? 'Productos dañados → Dinero' :
                            formData.caso_uso === 3 ? 'Productos buenos → Productos buenos' :
                            formData.caso_uso === 4 ? 'Productos buenos → Dinero' :
                            formData.caso_uso === 5 ? 'Productos dañados → Dar de baja' : 'N/A'
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductoStep; 