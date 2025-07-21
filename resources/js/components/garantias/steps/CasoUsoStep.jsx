import React, { useState, useEffect } from 'react';

const CasoUsoStep = ({ formData, updateFormData, errors, db }) => {
    const [selectedCaso, setSelectedCaso] = useState(formData.caso_uso);
    const [validandoFactura, setValidandoFactura] = useState(false);
    const [facturaValidada, setFacturaValidada] = useState(null);
    const [datosPedido, setDatosPedido] = useState(null);

    const casosUso = [
        {
            id: 1,
            tipo: 'GARANTIA',
            titulo: 'Garantía - Producto por Producto',
            descripcion: 'El cliente trae un producto dañado y se le entrega un producto bueno',
            icono: '🔄',
            color: 'border-primary',
            flujo: 'Entra: Producto dañado → Sale: Producto bueno',
            requiere_cliente: true
        },
        {
            id: 2,
            tipo: 'GARANTIA',
            titulo: 'Garantía - Producto por Dinero',
            descripcion: 'El cliente trae un producto dañado y se le devuelve el dinero',
            icono: '💰',
            color: 'border-success',
            flujo: 'Entra: Producto dañado → Sale: Dinero',
            requiere_cliente: true
        },
        {
            id: 3,
            tipo: 'DEVOLUCION',
            titulo: 'Devolución - Producto por Producto',
            descripcion: 'El cliente devuelve un producto bueno y se le entrega otro producto',
            icono: '↔️',
            color: 'border-info',
            flujo: 'Entra: Producto bueno → Sale: Producto bueno',
            requiere_cliente: true
        },
        {
            id: 4,
            tipo: 'DEVOLUCION',
            titulo: 'Devolución - Producto por Dinero',
            descripcion: 'El cliente devuelve un producto bueno y se le devuelve el dinero',
            icono: '💵',
            color: 'border-warning',
            flujo: 'Entra: Producto bueno → Sale: Dinero',
            requiere_cliente: true
        },
        {
            id: 5,
            tipo: 'GARANTIA',
            titulo: 'Producto Dañado Interno',
            descripcion: 'Producto dañado encontrado internamente (sin cliente)',
            icono: '🔧',
            color: 'border-danger',
            flujo: 'Producto dañado → Dar de baja',
            requiere_cliente: false
        }
    ];

    const handleCasoSelect = (casoId) => {
        setSelectedCaso(casoId);
        const caso = casosUso.find(c => c.id === casoId);
        updateFormData('caso_uso', casoId);
        updateFormData('tipo_solicitud', caso.tipo);
        
        // Si es caso 5 (interno), no requiere factura
        if (casoId === 5) {
            updateFormData('factura_venta_id', '');
            setFacturaValidada(null);
            setDatosPedido(null);
        }
    };

    // Validar factura cuando cambie el número
    useEffect(() => {
        if (formData.factura_venta_id && selectedCaso !== 5) {
            validarFactura(formData.factura_venta_id);
        } else {
            setFacturaValidada(null);
            setDatosPedido(null);
        }
    }, [formData.factura_venta_id, selectedCaso]);

    const validarFactura = async (numfact) => {
        if (!numfact || numfact.length < 1) {
            setFacturaValidada(null);
            setDatosPedido(null);
            updateFormData('dias_transcurridos_compra', '');
            return;
        }

        setValidandoFactura(true);
        try {
            const response = await db.validateFactura({ numfact });
            
            if (response.status === 200) {
                const data = response.data;
                setFacturaValidada(data.exists);
                setDatosPedido(data.exists ? data.pedido : null);
                
                // Actualizar automáticamente los días transcurridos desde el backend
                if (data.exists && data.pedido && data.pedido.dias_transcurridos_compra !== undefined) {
                    updateFormData('dias_transcurridos_compra', data.pedido.dias_transcurridos_compra);
                } else {
                    updateFormData('dias_transcurridos_compra', '');
                }
            } else {
                setFacturaValidada(false);
                setDatosPedido(null);
                updateFormData('dias_transcurridos_compra', '');
            }
        } catch (error) {
            console.error('Error validando factura:', error);
            setFacturaValidada(false);
            setDatosPedido(null);
            updateFormData('dias_transcurridos_compra', '');
        } finally {
            setValidandoFactura(false);
        }
    };

    const handleFacturaChange = (numfact) => {
        updateFormData('factura_venta_id', numfact);
    };

    return (
        <div className="caso-uso-step">
            <div className="mb-4">
                <h4 className="text-primary mb-3">
                    <i className="fa fa-clipboard-list me-2"></i>
                    Selecciona el Caso de Uso
                </h4>
                <p className="text-muted">
                    Elige el tipo de garantía o devolución que corresponde a esta situación:
                </p>
                <div className="alert alert-info">
                    <i className="fa fa-info-circle me-2"></i>
                    <strong>Importante:</strong> Es obligatorio presentar la factura original para todas las garantías y devoluciones (excepto para productos dañados internos).
                </div>
            </div>

            {/* Selección de Caso de Uso */}
            <div className="row">
                {casosUso.map((caso) => (
                    <div key={caso.id} className="col-md-6 mb-3">
                        <div 
                            className={`card h-100 cursor-pointer ${selectedCaso === caso.id ? 'border-primary bg-light' : caso.color}`}
                            onClick={() => handleCasoSelect(caso.id)}
                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <div className="card-body">
                                <div className="d-flex align-items-start">
                                    <div className="me-3" style={{ fontSize: '2rem' }}>
                                        {caso.icono}
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="card-title mb-2">
                                            {caso.titulo}
                                            {selectedCaso === caso.id && (
                                                <i className="fa fa-check-circle text-success ms-2"></i>
                                            )}
                                        </h6>
                                        <p className="card-text small text-muted mb-2">
                                            {caso.descripcion}
                                        </p>
                                        <div className="small">
                                            <strong>Flujo:</strong> {caso.flujo}
                                        </div>
                                        {!caso.requiere_cliente && (
                                            <div className="small text-danger mt-1">
                                                <i className="fa fa-exclamation-triangle me-1"></i>
                                                No requiere datos del cliente ni factura
                                            </div>
                                        )}
                                        {caso.requiere_cliente && (
                                            <div className="small text-sinapsis mt-1">
                                                <i className="fa fa-file-invoice me-1"></i>
                                                Requiere factura original
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {errors.caso_uso && (
                <div className="alert alert-danger py-2 mb-3">
                    <i className="fa fa-exclamation-triangle me-2"></i>
                    {errors.caso_uso}
                </div>
            )}

            {/* Información de Factura (solo si no es caso 5) */}
            {selectedCaso && selectedCaso !== 5 && (
                <div className="card mt-4">
                    <div className="card-header bg-warning text-dark">
                        <h6 className="mb-0">
                            <i className="fa fa-file-invoice me-2"></i>
                            Información de la Factura
                            <span className="badge bg-danger ms-2">OBLIGATORIO</span>
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Número de Factura <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.factura_venta_id ? 'is-invalid' : 
                                                facturaValidada === true ? 'is-valid' : 
                                                facturaValidada === false ? 'is-invalid' : ''}`}
                                            value={formData.factura_venta_id || ''}
                                            onChange={(e) => handleFacturaChange(e.target.value)}
                                            placeholder="Ej: 12345"
                                        />
                                        <span className="input-group-text">
                                            {validandoFactura ? (
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Validando...</span>
                                                </div>
                                            ) : facturaValidada === true ? (
                                                <i className="fa fa-check text-success"></i>
                                            ) : facturaValidada === false ? (
                                                <i className="fa fa-times text-danger"></i>
                                            ) : (
                                                <i className="fa fa-search text-muted"></i>
                                            )}
                                        </span>
                                    </div>
                                    
                                    {/* Feedback de validación */}
                                    {facturaValidada === true && datosPedido && (
                                        <div className="valid-feedback d-block">
                                            <i className="fa fa-check-circle me-1"></i>
                                            Factura encontrada - Fecha: {new Date(datosPedido.created_at).toLocaleDateString()} 
                                            {datosPedido.cliente && ` - Cliente: ${datosPedido.cliente}`}
                                        </div>
                                    )}
                                    
                                    {facturaValidada === false && formData.factura_venta_id && (
                                        <div className="invalid-feedback d-block">
                                            <i className="fa fa-exclamation-triangle me-1"></i>
                                            Esta factura no existe en el sistema. Verifique el número.
                                        </div>
                                    )}
                                    
                                    {errors.factura_venta_id && (
                                        <div className="invalid-feedback d-block">
                                            {errors.factura_venta_id}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Días desde la compra</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={formData.dias_transcurridos_compra !== '' && formData.dias_transcurridos_compra !== undefined ? 
                                                `${formData.dias_transcurridos_compra} días` : 
                                                'Valide la factura primero'
                                            }
                                            readOnly
                                        />
                                        <span className="input-group-text">
                                            <i className="fa fa-calendar-alt text-primary"></i>
                                        </span>
                                    </div>
                                    <div className="form-text">
                                        <i className="fa fa-info-circle me-1"></i>
                                        Se calcula automáticamente desde la fecha de la factura
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Información del pedido si está validado */}
                        {facturaValidada && datosPedido && (
                            <div className="alert alert-success mt-3">
                                <h6 className="alert-heading">
                                    <i className="fa fa-info-circle me-2"></i>
                                    Información de la Factura
                                </h6>
                                <div className="row">
                                    <div className="col-md-2">
                                        <strong>Número:</strong> {datosPedido.numfact}
                                    </div>
                                    <div className="col-md-3">
                                        <strong>Fecha:</strong> {new Date(datosPedido.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="col-md-2">
                                        <strong>Monto:</strong> ${parseFloat(datosPedido.monto_total || 0).toFixed(2)}
                                    </div>
                                    <div className="col-md-2">
                                        <strong>Estado:</strong> 
                                        <span className={`badge ms-1 ${datosPedido.estado === 'CERRADO' ? 'bg-success' : 'bg-warning'}`}>
                                            {datosPedido.estado || 'PENDIENTE'}
                                        </span>
                                    </div>
                                    <div className="col-md-3">
                                        <strong>Días transcurridos:</strong> 
                                        <span className="badge bg-primary ms-1">
                                            {datosPedido.dias_transcurridos_compra || 0} días
                                        </span>
                                    </div>
                                </div>
                                {datosPedido.cliente && (
                                    <div className="mt-2">
                                        <strong>Cliente:</strong> {datosPedido.cliente}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Información adicional del caso seleccionado */}
            {selectedCaso && (
                <div className="alert alert-info mt-4">
                    <div className="d-flex align-items-start">
                        <i className="fa fa-info-circle me-2 mt-1"></i>
                        <div>
                            <strong>Caso seleccionado:</strong> {casosUso.find(c => c.id === selectedCaso)?.titulo}
                            <br />
                            <small className="text-muted">
                                {casosUso.find(c => c.id === selectedCaso)?.descripcion}
                            </small>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CasoUsoStep; 