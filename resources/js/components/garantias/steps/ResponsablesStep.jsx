import React, { useState, useEffect } from 'react';

const ResponsablesStep = ({ formData, updateNestedFormData, errors, db }) => {
    const [activeTab, setActiveTab] = useState('cliente');
    const [modoCreacion, setModoCreacion] = useState({}); // true = crear nuevo, false = seleccionar existente
    const [responsablesExistentes, setResponsablesExistentes] = useState({});
    const [busquedaTerminos, setBusquedaTerminos] = useState({});
    const [cargandoBusqueda, setCargandoBusqueda] = useState({});
    const [guardandoResponsable, setGuardandoResponsable] = useState({});
    
    const requiereCliente = formData.caso_uso !== 5;

    const tabs = [
        { id: 'cliente', label: 'Cliente', icon: 'fa-user', disabled: !requiereCliente },
        { id: 'cajero', label: 'Cajero', icon: 'fa-cash-register', disabled: false },
        { id: 'supervisor', label: 'Supervisor', icon: 'fa-user-shield', disabled: false },
        { id: 'dici', label: 'DICI', icon: 'fa-user-cog', disabled: false }
    ];

    // Inicializar modos de creación
    useEffect(() => {
        const modos = {};
        tabs.forEach(tab => {
            if (!tab.disabled) {
                modos[tab.id] = true; // Por defecto, crear nuevo
            }
        });
        setModoCreacion(modos);
    }, []);

    // Buscar responsables existentes
    const buscarResponsables = async (tipo, termino) => {
        if (!termino || termino.length < 2) {
            setResponsablesExistentes(prev => ({
                ...prev,
                [tipo]: []
            }));
            return;
        }

        setCargandoBusqueda(prev => ({ ...prev, [tipo]: true }));
        
        try {
            const response = await db.searchResponsables({
                tipo,
                termino,
                limit: 10
            });

            // Axios devuelve la respuesta en response.data
            const apiResponse = response.data;

            if (apiResponse.status === 200) {
                setResponsablesExistentes(prev => ({
                    ...prev,
                    [tipo]: apiResponse.data || []
                }));
            } else {
                setResponsablesExistentes(prev => ({
                    ...prev,
                    [tipo]: []
                }));
            }
        } catch (error) {
            setResponsablesExistentes(prev => ({
                ...prev,
                [tipo]: []
            }));
        } finally {
            setCargandoBusqueda(prev => ({ ...prev, [tipo]: false }));
        }
    };

    // Manejar cambio en término de búsqueda (sin buscar automáticamente)
    const handleBusquedaChange = (tipo, termino) => {
        setBusquedaTerminos(prev => ({
            ...prev,
            [tipo]: termino
        }));
    };

    // Manejar presionar Enter para buscar
    const handleKeyPress = (e, tipo) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscarResponsables(tipo, busquedaTerminos[tipo]);
        }
    };

    // Ejecutar búsqueda manualmente
    const ejecutarBusqueda = (tipo) => {
        buscarResponsables(tipo, busquedaTerminos[tipo]);
    };

    // Seleccionar responsable existente
    const seleccionarResponsable = (tipo, responsable) => {
        updateNestedFormData(tipo, 'id', responsable.id);
        updateNestedFormData(tipo, 'nombre', responsable.nombre);
        updateNestedFormData(tipo, 'apellido', responsable.apellido);
        updateNestedFormData(tipo, 'cedula', responsable.cedula);
        updateNestedFormData(tipo, 'telefono', responsable.telefono || '');
        updateNestedFormData(tipo, 'correo', responsable.correo || '');
        updateNestedFormData(tipo, 'direccion', responsable.direccion || '');
        updateNestedFormData(tipo, 'tipo', responsable.tipo);
        
        setBusquedaTerminos(prev => ({
            ...prev,
            [tipo]: ''
        }));
        setResponsablesExistentes(prev => ({
            ...prev,
            [tipo]: []
        }));
    };

    // Guardar nuevo responsable
    const guardarNuevoResponsable = async (tipo) => {
        const datosResponsable = formData[tipo];
        
        if (!datosResponsable.nombre || !datosResponsable.apellido || !datosResponsable.cedula) {
            alert('Por favor complete los campos obligatorios (nombre, apellido y cédula)');
            return;
        }

        setGuardandoResponsable(prev => ({ ...prev, [tipo]: true }));

        try {
            const response = await db.saveResponsable({
                tipo,
                nombre: datosResponsable.nombre,
                apellido: datosResponsable.apellido,
                cedula: datosResponsable.cedula,
                telefono: datosResponsable.telefono || '',
                correo: datosResponsable.correo || '',
                direccion: datosResponsable.direccion || ''
            });

            // Axios devuelve la respuesta en response.data
            const apiResponse = response.data;

            if (apiResponse.status === 200) {
                updateNestedFormData(tipo, 'id', apiResponse.data.id);
                alert('Responsable guardado exitosamente');
            } else {
                alert('Error al guardar responsable: ' + apiResponse.message);
            }
        } catch (error) {
            alert('Error al guardar responsable');
        } finally {
            setGuardandoResponsable(prev => ({ ...prev, [tipo]: false }));
        }
    };

    // Cambiar modo de creación
    const toggleModoCreacion = (tipo) => {
        setModoCreacion(prev => ({
            ...prev,
            [tipo]: !prev[tipo]
        }));
        
        // Limpiar datos cuando cambie el modo
        ['id', 'nombre', 'apellido', 'cedula', 'telefono', 'correo', 'direccion'].forEach(field => {
            updateNestedFormData(tipo, field, '');
        });
        
        setBusquedaTerminos(prev => ({
            ...prev,
            [tipo]: ''
        }));
        setResponsablesExistentes(prev => ({
            ...prev,
            [tipo]: []
        }));
    };

    const renderModoSelector = (tipo) => {
        return (
            <div className="mb-3">
                <div className="btn-group w-100" role="group">
                    <button
                        type="button"
                        className={`btn ${modoCreacion[tipo] ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => modoCreacion[tipo] || toggleModoCreacion(tipo)}
                    >
                        <i className="fa fa-plus me-2"></i>
                        Crear Nuevo
                    </button>
                    <button
                        type="button"
                        className={`btn ${!modoCreacion[tipo] ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => !modoCreacion[tipo] || toggleModoCreacion(tipo)}
                    >
                        <i className="fa fa-search me-2"></i>
                        Seleccionar Existente
                    </button>
                </div>
            </div>
        );
    };

    const renderBuscadorResponsables = (tipo) => {
        return (
            <div className="mb-4">
                <label className="form-label">
                    Buscar {tabs.find(t => t.id === tipo)?.label}
                </label>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={busquedaTerminos[tipo] || ''}
                        onChange={(e) => handleBusquedaChange(tipo, e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, tipo)}
                        placeholder="Buscar por nombre, apellido o cédula... (Presiona Enter)"
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => ejecutarBusqueda(tipo)}
                        disabled={cargandoBusqueda[tipo] || !busquedaTerminos[tipo] || busquedaTerminos[tipo].length < 2}
                    >
                        {cargandoBusqueda[tipo] ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Buscando...</span>
                            </div>
                        ) : (
                            <i className="fa fa-search"></i>
                        )}
                    </button>
                </div>
                
                {responsablesExistentes[tipo] && responsablesExistentes[tipo].length > 0 && (
                    <div className="mt-2">
                        <small className="text-muted">Resultados encontrados ({responsablesExistentes[tipo].length}):</small>
                        <div className="list-group mt-1">
                            {responsablesExistentes[tipo].map((responsable, index) => (
                                <button
                                    key={responsable.id || index}
                                    type="button"
                                    className="list-group-item list-group-item-action"
                                    onClick={() => seleccionarResponsable(tipo, responsable)}
                                >
                                    <div className="d-flex w-100 justify-content-between">
                                        <div>
                                            <h6 className="mb-1">{responsable.nombre} {responsable.apellido}</h6>
                                            <p className="mb-1 text-muted">CI: {responsable.cedula}</p>
                                            {responsable.telefono && (
                                                <small>Tel: {responsable.telefono}</small>
                                            )}
                                        </div>
                                        <small className="text-muted">{responsable.tipo}</small>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {busquedaTerminos[tipo] && busquedaTerminos[tipo].length >= 2 && 
                 responsablesExistentes[tipo] && responsablesExistentes[tipo].length === 0 && 
                 !cargandoBusqueda[tipo] && (
                    <div className="alert alert-info mt-2">
                        <i className="fa fa-info-circle me-2"></i>
                        No se encontraron responsables con "{busquedaTerminos[tipo]}"
                    </div>
                )}
            </div>
        );
    };

    const renderPersonForm = (personType, personData, title, description) => {
        const getFieldError = (field) => {
            return errors[`${personType}_${field}`];
        };

        const esSeleccionado = personData.id && !modoCreacion[personType];

        return (
            <div className="person-form">
                <div className="mb-4">
                    <h5 className="text-primary mb-2">{title}</h5>
                    <p className="text-muted small">{description}</p>
                </div>

                {renderModoSelector(personType)}

                {!modoCreacion[personType] && renderBuscadorResponsables(personType)}

                {/* Formulario de datos */}
                <div className={`${esSeleccionado ? 'border rounded p-3 bg-light' : ''}`}>
                    {esSeleccionado && (
                        <div className="mb-3">
                            <span className="badge bg-success">
                                <i className="fa fa-check me-1"></i>
                                Responsable Seleccionado
                            </span>
                        </div>
                    )}

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">
                                    Nombre <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${getFieldError('nombre') ? 'is-invalid' : ''}`}
                                    value={personData.nombre || ''}
                                    onChange={(e) => updateNestedFormData(personType, 'nombre', e.target.value)}
                                    placeholder="Ingrese el nombre"
                                    readOnly={esSeleccionado}
                                />
                                {getFieldError('nombre') && (
                                    <div className="invalid-feedback">{getFieldError('nombre')}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">
                                    Apellido <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${getFieldError('apellido') ? 'is-invalid' : ''}`}
                                    value={personData.apellido || ''}
                                    onChange={(e) => updateNestedFormData(personType, 'apellido', e.target.value)}
                                    placeholder="Ingrese el apellido"
                                    readOnly={esSeleccionado}
                                />
                                {getFieldError('apellido') && (
                                    <div className="invalid-feedback">{getFieldError('apellido')}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">
                                    Cédula <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${getFieldError('cedula') ? 'is-invalid' : ''}`}
                                    value={personData.cedula || ''}
                                    onChange={(e) => updateNestedFormData(personType, 'cedula', e.target.value)}
                                    placeholder="Ej: 12345678"
                                    readOnly={esSeleccionado}
                                />
                                {getFieldError('cedula') && (
                                    <div className="invalid-feedback">{getFieldError('cedula')}</div>
                                )}
                            </div>
                        </div>
                        {personType === 'cliente' && (
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={personData.telefono || ''}
                                        onChange={(e) => updateNestedFormData(personType, 'telefono', e.target.value)}
                                        placeholder="Ej: 04241234567"
                                        readOnly={esSeleccionado}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {personType === 'cliente' && (
                        <>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={personData.correo || ''}
                                            onChange={(e) => updateNestedFormData(personType, 'correo', e.target.value)}
                                            placeholder="ejemplo@correo.com"
                                            readOnly={esSeleccionado}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Dirección</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={personData.direccion || ''}
                                            onChange={(e) => updateNestedFormData(personType, 'direccion', e.target.value)}
                                            placeholder="Dirección completa"
                                            readOnly={esSeleccionado}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Botones de acción */}
                    <div className="d-flex justify-content-between mt-3">
                        <div>
                            {esSeleccionado && (
                                <button
                                    type="button"
                                    className="btn btn-outline-sinapsis"
                                    onClick={() => toggleModoCreacion(personType)}
                                >
                                    <i className="fa fa-edit me-2"></i>
                                    Cambiar Selección
                                </button>
                            )}
                        </div>
                        <div>
                            {modoCreacion[personType] && personData.nombre && personData.apellido && personData.cedula && (
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => guardarNuevoResponsable(personType)}
                                    disabled={guardandoResponsable[personType]}
                                >
                                    {guardandoResponsable[personType] ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Guardando...</span>
                                            </div>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-save me-2"></i>
                                            Guardar Responsable
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getPersonSummary = (personType, personData) => {
        if (!personData.nombre || !personData.cedula) {
            return <span className="text-muted">Sin completar</span>;
        }
        
        const esSeleccionado = personData.id && !modoCreacion[personType];
        
        return (
            <div className="d-flex align-items-center">
                <i className={`fa ${esSeleccionado ? 'fa-database' : 'fa-check-circle'} text-success me-2`}></i>
                <span>{personData.nombre} {personData.apellido} - {personData.cedula}</span>
                {esSeleccionado && <small className="text-muted ms-2">(Guardado)</small>}
            </div>
        );
    };

    return (
        <div className="responsables-step">
            <div className="mb-4">
                <h4 className="text-primary mb-3">
                    <i className="fa fa-users me-2"></i>
                    Información de Responsables
                </h4>
                <p className="text-muted">
                    Seleccione responsables existentes o registre nuevos. La información se guarda en el sistema central para uso futuro.
                </p>
            </div>

            {/* Advertencia para caso 5 */}
            {!requiereCliente && (
                <div className="alert alert-warning mb-4">
                    <i className="fa fa-info-circle me-2"></i>
                    <strong>Producto dañado interno:</strong> No se requiere información del cliente para este caso.
                </div>
            )}

            {/* Tabs Navigation */}
            <div className="row">
                <div className="col-md-3">
                    <div className="nav flex-column nav-pills" role="tablist">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`nav-link text-start ${activeTab === tab.id ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`}
                                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                                type="button"
                                disabled={tab.disabled}
                            >
                                <i className={`fa ${tab.icon} me-2`}></i>
                                {tab.label}
                                <div className="mt-1">
                                    {tab.disabled ? (
                                        <small className="text-muted">No requerido</small>
                                    ) : (
                                        <small>
                                            {getPersonSummary(tab.id, formData[tab.id])}
                                        </small>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="card">
                        <div className="card-body">
                            {activeTab === 'cliente' && requiereCliente && (
                                renderPersonForm(
                                    'cliente',
                                    formData.cliente,
                                    'Datos del Cliente',
                                    'Persona que solicita la garantía o devolución'
                                )
                            )}

                            {activeTab === 'cliente' && !requiereCliente && (
                                <div className="text-center text-muted py-5">
                                    <i className="fa fa-ban fa-3x mb-3"></i>
                                    <h6>No se requiere información del cliente</h6>
                                    <p>Para el caso de producto dañado interno no hay cliente involucrado</p>
                                </div>
                            )}

                            {activeTab === 'cajero' && (
                                renderPersonForm(
                                    'cajero',
                                    formData.cajero,
                                    'Datos del Cajero',
                                    'Persona que atiende la solicitud en caja'
                                )
                            )}

                            {activeTab === 'supervisor' && (
                                renderPersonForm(
                                    'supervisor',
                                    formData.supervisor,
                                    'Datos del Supervisor',
                                    'Supervisor que autoriza la garantía o devolución'
                                )
                            )}

                            {activeTab === 'dici' && (
                                renderPersonForm(
                                    'dici',
                                    formData.dici,
                                    'Datos del DICI',
                                    'Persona del departamento de inventario y control interno'
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Resumen de responsables */}
            <div className="card mt-4">
                <div className="card-header">
                    <h6 className="mb-0">
                        <i className="fa fa-list me-2"></i>
                        Resumen de Responsables
                    </h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        {tabs.map((tab) => (
                            <div key={tab.id} className="col-md-6 mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className={`fa ${tab.icon} text-muted`}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <strong>{tab.label}:</strong>
                                        <div className="small">
                                            {tab.disabled ? (
                                                <span className="text-muted">No requerido</span>
                                            ) : (
                                                getPersonSummary(tab.id, formData[tab.id])
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Errores generales */}
            {Object.keys(errors).some(key => key.includes('_')) && (
                <div className="alert alert-danger mt-3">
                    <i className="fa fa-exclamation-triangle me-2"></i>
                    <strong>Hay errores en los datos:</strong>
                    <ul className="mb-0 mt-2">
                        {Object.entries(errors).filter(([key]) => key.includes('_')).map(([key, value]) => (
                            <li key={key}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ResponsablesStep; 