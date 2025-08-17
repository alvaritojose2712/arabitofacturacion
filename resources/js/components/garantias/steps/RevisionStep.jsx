import React from 'react';

const RevisionStep = ({ formData, loading, onSubmit, errors, casoUso, carritoData }) => {
    const casosUso = [
        { id: 1, titulo: 'Garantía - Producto por Producto', descripcion: 'Producto dañado → Producto bueno' },
        { id: 2, titulo: 'Garantía - Producto por Dinero', descripcion: 'Producto dañado → Dinero' },
        { id: 3, titulo: 'Devolución - Producto por Producto', descripcion: 'Producto bueno → Producto bueno' },
        { id: 4, titulo: 'Devolución - Producto por Dinero', descripcion: 'Producto bueno → Dinero' },
        { id: 5, titulo: 'Producto Dañado Interno', descripcion: 'Producto dañado → Dar de baja' }
    ];

    const casoActual = casosUso.find(c => c.id === formData.caso_uso) || casoUso;
    const requiereCliente = formData.caso_uso !== 5;
    
    // Calcular monto total de devolución desde la diferencia de pago del carrito dinámico
    const montoTotalDevolucion = Math.abs(carritoData?.resumen?.diferencia_pago || 0);
    
    // Detección de devolución de dinero basada en si hay diferencia de pago
    const tieneDevolucionDinero = montoTotalDevolucion > 0.01;
    const tieneMetodosPago = formData.metodos_devolucion && formData.metodos_devolucion.length > 0;

    const renderPersonInfo = (person, label) => {
        if (!person?.nombre || !person?.cedula) {
            return (
                <div className="d-flex align-items-center text-muted">
                    <i className="fa fa-times-circle me-2"></i>
                    <span>Sin información</span>
                </div>
            );
        }

        return (
            <div>
                <div className="d-flex align-items-center text-success mb-1">
                    <i className="fa fa-check-circle me-2"></i>
                    <strong>{person.nombre} {person.apellido}</strong>
                </div>
                <div className="small text-muted">
                    <div>CI: {person.cedula}</div>
                    {person.telefono && <div>Tel: {person.telefono}</div>}
                    {person.correo && <div>Email: {person.correo}</div>}
                    {person.direccion && <div>Dir: {person.direccion}</div>}
                </div>
            </div>
        );
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <div className="revision-step">
            <div className="mb-4">
                <h4 className="text-primary mb-3">
                    <i className="fa fa-check-square me-2"></i>
                    Revisión Final
                </h4>
                <p className="text-muted">
                    Revisa cuidadosamente todos los datos antes de enviar la solicitud de garantía.
                </p>
            </div>

            {/* Alerta de devolución de dinero */}
            {tieneDevolucionDinero && (
                <div className="alert alert-warning border-warning mb-4" style={{ 
                    borderWidth: '3px', 
                    backgroundColor: '#fff3cd',
                    boxShadow: '0 4px 8px rgba(255,193,7,0.3)'
                }}>
                    <div className="d-flex align-items-center">
                        <div className="me-3">
                            <i className="fa fa-exclamation-triangle fa-3x text-sinapsis"></i>
                        </div>
                        <div className="flex-grow-1">
                            <h5 className="alert-heading mb-2 text-sinapsis">
                                <i className="fa fa-money-bill-wave me-2"></i>
                                ¡ATENCIÓN! DEVOLUCIÓN DE DINERO
                            </h5>
                            <div className="mb-2">
                                <strong>Diferencia de pago a procesar: </strong>
                                <span className="badge bg-danger fs-6 px-3 py-2">
                                    <i className="fa fa-dollar-sign me-1"></i>
                                    ${montoTotalDevolucion.toFixed(2)} USD
                                </span>
                                {carritoData?.resumen?.balance_tipo && (
                                    <div className="mt-1 small">
                                        <i className="fa fa-info-circle me-1"></i>
                                        {carritoData.resumen.balance_tipo === 'favor_cliente' 
                                            ? 'Cliente debe recibir reembolso' 
                                            : 'Cliente debe pagar diferencia'
                                        }
                                    </div>
                                )}
                            </div>
                            <div className="small">
                                <i className="fa fa-info-circle me-1"></i>
                                <strong>IMPORTANTE:</strong> Esta solicitud será <strong>enviada para aprobación en central</strong>. NO ENTREGAR DINERO hasta recibir confirmación de aprobación.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Errores si los hay */}
            {hasErrors && (
                <div className="alert alert-danger">
                    <h6 className="alert-heading">
                        <i className="fa fa-exclamation-triangle me-2"></i>
                        Hay errores que debes corregir
                    </h6>
                    <ul className="mb-0">
                        {Object.entries(errors).map(([key, value]) => (
                            <li key={key}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Información del Caso */}
            <div className="card mb-4">
                <div className="card-header">
                    <h6 className="mb-0">
                        <i className="fa fa-clipboard-list me-2"></i>
                        Información del Caso
                        {tieneDevolucionDinero && (
                            <span className="badge bg-sinapsis ms-2">
                                <i className="fa fa-money-bill-wave me-1"></i>
                                Devolución de Dinero
                            </span>
                        )}
                    </h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <strong>Caso de Uso:</strong>
                            <div className="text-success mb-2">
                                <i className="fa fa-check-circle me-2"></i>
                                {casoActual?.titulo}
                                {tieneDevolucionDinero && (
                                    <span className="badge bg-sinapsis ms-2">💰 Dinero</span>
                                )}
                            </div>
                            <div className="small text-muted mb-3">
                                {casoActual?.descripcion}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <strong>Tipo de Solicitud:</strong>
                            <div className="mb-2">
                                <span className={`badge ${formData.tipo_solicitud === 'GARANTIA' ? 'bg-sinapsis' : 'bg-info'}`}>
                                    {formData.tipo_solicitud}
                                </span>
                            </div>
                        </div>
                    </div>

                    {requiereCliente && (
                        <div className="row">
                            <div className="col-md-6">
                                <strong>Número de Factura:</strong>
                                <div className="mb-2">{formData.factura_venta_id || 'No especificado'}</div>
                            </div>
                            <div className="col-md-6">
                                <strong>Días desde compra:</strong>
                                <div className="mb-2">{formData.dias_transcurridos_compra || 'No especificado'}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Información de Responsables */}
            <div className="card mb-4">
                <div className="card-header">
                    <h6 className="mb-0">
                        <i className="fa fa-users me-2"></i>
                        Responsables
                    </h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        {requiereCliente && (
                            <div className="col-md-6 mb-3">
                                <strong>Cliente:</strong>
                                {renderPersonInfo(formData.cliente, 'Cliente')}
                            </div>
                        )}
                        <div className="col-md-6 mb-3">
                            <strong>Cajero:</strong>
                            {renderPersonInfo(formData.cajero, 'Cajero')}
                        </div>
                        <div className="col-md-6 mb-3">
                            <strong>Supervisor:</strong>
                            {renderPersonInfo(formData.supervisor, 'Supervisor')}
                        </div>
                        <div className="col-md-6 mb-3">
                            <strong>DICI:</strong>
                            {renderPersonInfo(formData.dici, 'DICI')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Información de Productos */}
            <div className="card mb-4">
                <div className="card-header">
                    <h6 className="mb-0">
                        <i className="fa fa-box me-2"></i>
                        Productos ({formData.productos_carrito?.length || 0})
                    </h6>
                </div>
                <div className="card-body">
                    {formData.productos_carrito && formData.productos_carrito.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unit.</th>
                                        {casoActual?.campos_requeridos?.includes('cantidad_salida') && (
                                            <th>Cant. Salida</th>
                                        )}
                                        {casoActual?.campos_requeridos?.includes('monto_devolucion') && (
                                            <th>Monto Devolución</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.productos_carrito.map((producto, index) => (
                                        <tr key={index}>
                                            <td>
                                                <strong>{producto.descripcion}</strong>
                                                <br />
                                                <small className="text-muted">ID: {producto.id}</small>
                                            </td>
                                            <td>{producto.cantidad}</td>
                                            <td>${(producto.precio || 0).toFixed(2)}</td>
                                            {casoActual?.campos_requeridos?.includes('cantidad_salida') && (
                                                <td>{producto.cantidad_salida || 0}</td>
                                            )}
                                            {casoActual?.campos_requeridos?.includes('monto_devolucion') && (
                                                <td className="text-danger">
                                                    <strong>${(producto.monto_devolucion_unitario || 0).toFixed(2)}</strong>
                                                    <br />
                                                    <small>Total: ${((producto.monto_devolucion_unitario || 0) * producto.cantidad).toFixed(2)}</small>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                                {tieneDevolucionDinero && (
                                    <tfoot>
                                        <tr className="table-warning">
                                            <td colSpan="4" className="text-end">
                                                <strong>DIFERENCIA A PROCESAR: ${montoTotalDevolucion.toFixed(2)} USD</strong>
                                                {carritoData?.resumen?.balance_tipo && (
                                                    <div className="small">
                                                        ({carritoData.resumen.balance_tipo === 'favor_cliente' 
                                                            ? 'Reembolso al cliente' 
                                                            : 'Pago del cliente'
                                                        })
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-muted py-3">
                            <i className="fa fa-exclamation-triangle fa-2x mb-2"></i>
                            <p>No hay productos seleccionados</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Métodos de Pago */}
            {tieneMetodosPago && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h6 className="mb-0">
                            <i className="fa fa-credit-card me-2"></i>
                            Métodos de Pago - Diferencia ({formData.metodos_devolucion.length})
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Método</th>
                                        <th>Monto</th>
                                        <th>Moneda</th>
                                        <th>Detalles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.metodos_devolucion.map((metodo, index) => (
                                        <tr key={index}>
                                            <td>
                                                <span className="badge bg-secondary">
                                                    {metodo.tipo.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="text-success">
                                                <strong>{metodo.monto.toFixed(2)}</strong>
                                            </td>
                                            <td>{metodo.moneda}</td>
                                            <td>
                                                {metodo.tipo === 'transferencia' && (
                                                    <div className="small">
                                                        <div><strong>Banco:</strong> {metodo.banco}</div>
                                                        <div><strong>Ref:</strong> {metodo.referencia}</div>
                                                        {metodo.telefono && <div><strong>Tel:</strong> {metodo.telefono}</div>}
                                                    </div>
                                                )}
                                                {(metodo.tipo === 'debito' || metodo.tipo === 'biopago') && metodo.cuenta && (
                                                    <div className="small">
                                                        <strong>Cuenta:</strong> {metodo.cuenta}
                                                    </div>
                                                )}
                                                {metodo.tipo === 'efectivo' && (
                                                    <span className="text-muted small">Efectivo</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Motivos */}
            {(formData.motivo || formData.motivo_devolucion || formData.detalles_adicionales) && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h6 className="mb-0">
                            <i className="fa fa-comment me-2"></i>
                            Motivos y Observaciones
                        </h6>
                    </div>
                    <div className="card-body">
                        {formData.motivo && (
                            <div className="mb-3">
                                <strong>Motivo:</strong>
                                <div className="mt-1">{formData.motivo}</div>
                            </div>
                        )}
                        {formData.motivo_devolucion && (
                            <div className="mb-3">
                                <strong>Motivo de devolución:</strong>
                                <div className="mt-1">{formData.motivo_devolucion}</div>
                            </div>
                        )}
                        {formData.detalles_adicionales && (
                            <div className="mb-3">
                                <strong>Detalles adicionales:</strong>
                                <div className="mt-1">{formData.detalles_adicionales}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Botón de envío */}
            <div className="text-center">
                <button
                    onClick={onSubmit}
                    disabled={loading || hasErrors}
                    className={`btn btn-lg px-5 ${
                        loading || hasErrors
                            ? 'btn-secondary'
                            : tieneDevolucionDinero 
                                ? 'btn-warning' 
                                : 'btn-success'
                    }`}
                >
                    {loading ? (
                        <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            Enviando...
                        </>
                    ) : (
                        <>
                            <i className={`fa ${tieneDevolucionDinero ? 'fa-paper-plane' : 'fa-check'} me-2`}></i>
                            {tieneDevolucionDinero ? 'Enviar para Aprobación' : 'Crear Garantía'}
                        </>
                    )}
                </button>
                
                {tieneDevolucionDinero && (
                    <div className="mt-2 small text-sinapsis">
                        <i className="fa fa-info-circle me-1"></i>
                        Esta solicitud será enviada a central para aprobación
                    </div>
                )}
            </div>

            {/* Error general */}
            {errors.submit && (
                <div className="alert alert-danger mt-3">
                    <i className="fa fa-exclamation-triangle me-2"></i>
                    {errors.submit}
                </div>
            )}
        </div>
    );
};

export default RevisionStep; 