import { useHotkeys } from "react-hotkeys-hook";

export default function InventarioForzado({
    setporcenganancia,
    productosInventario,
    qBuscarInventario,
    setQBuscarInventario,
    type,

    changeInventario,
    printTickedPrecio,

    Invnum,
    setInvnum,
    InvorderColumn,
    setInvorderColumn,
    InvorderBy,
    setInvorderBy,
    inputBuscarInventario, 
    guardarNuevoProductoLote,

    proveedoresList,
    number,
    refsInpInvList,
    categorias,
    
    setSameGanancia,
    setSameCat,
    setSamePro,
    sameCatValue,
    sameProValue,
    busquedaAvanazadaInv,
    setbusquedaAvanazadaInv,

    busqAvanzInputsFun,
    busqAvanzInputs,
    buscarInvAvanz,

    setCtxBulto,
    setStockMin,
    setPrecioAlterno,
    reporteInventario,
    exportPendientes,

    openmodalhistoricoproducto,

    showmodalhistoricoproducto,
    setshowmodalhistoricoproducto,
    fecha1modalhistoricoproducto,
    setfecha1modalhistoricoproducto,
    fecha2modalhistoricoproducto,
    setfecha2modalhistoricoproducto,
    usuariomodalhistoricoproducto,
    setusuariomodalhistoricoproducto,
    usuariosData,

    datamodalhistoricoproducto,
    setdatamodalhistoricoproducto,
    getmovientoinventariounitario,
    user,

    selectRepleceProducto,
    replaceProducto,
    setreplaceProducto,
    saveReplaceProducto,
    getPorcentajeInventario,
    cleanInventario,

    openBarcodeScan,
    
}){
    useHotkeys(
        "esc",
        () => {
            inputBuscarInventario.current.value = "";
            inputBuscarInventario.current.focus();
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
            filter: false,
        },
        []
    );
    const getPorGanacia = (precio,base) => {
        try{
            let por = 0

            precio = parseFloat(precio)
            base = parseFloat(base)

            let dif = precio-base

            por = ((dif*100)/base).toFixed(2)
            if (por) {
                return (dif<0?"":"+")+por+"%"

            }else{
                return ""

            }
        }catch(err){
            return ""
        }
    } 
    return (
        <div className="inventario-forzado">
            {showmodalhistoricoproducto&&<>
                <div className="modal-wrapper">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Historial de Producto</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={()=>setshowmodalhistoricoproducto(false)}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="search-filters mb-3">
                                <div className="row g-3">
                                    <div className="col-12 col-md-4">
                                        <select
                                            className="form-select"
                                            value={usuariomodalhistoricoproducto}
                                            onChange={e => setusuariomodalhistoricoproducto(e.target.value)}
                                        >
                                            <option value="">Seleccione Usuario</option>
                                            {usuariosData ? usuariosData.length ? usuariosData.map(e => (
                                                <option value={e.id} key={e.id}>{e.usuario}</option>
                                            )):null:null}
                                        </select>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <input 
                                            type="date" 
                                            className="form-control"
                                            value={fecha1modalhistoricoproducto}
                                            onChange={e => setfecha1modalhistoricoproducto(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <input 
                                            type="date" 
                                            className="form-control"
                                            value={fecha2modalhistoricoproducto}
                                            onChange={e => setfecha2modalhistoricoproducto(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="text-end mt-3">
                                    <button 
                                        className="btn btn-primary w-100 w-md-auto"
                                        onClick={() => getmovientoinventariounitario()}
                                    >
                                        <i className="fas fa-search me-2"></i>
                                        Buscar
                                    </button>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Usuario</th>
                                            <th>Producto</th>
                                            <th>Origen</th>
                                            <th>Cantidad</th>
                                            <th>Ct. Después</th>
                                            <th>Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datamodalhistoricoproducto.map(e => (
                                            <tr key={e.id}>
                                                <td>{e.usuario?.usuario || '-'}</td>
                                                <td>{e.id_producto}</td>
                                                <td>{e.origen}</td>
                                                <td className={e.cantidad < 0 ? 'text-danger' : 'text-success'}>
                                                    {e.cantidad > 0 ? '+' : ''}{e.cantidad}
                                                </td>
                                                <td>{e.cantidadafter}</td>
                                                <td>{e.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="overlay"></div>
                </div>
            </>}

           {/*  {replaceProducto?
                <div className="m-2">
                    {replaceProducto.este?
                        <>
                            <button className="btn btn-outline-danger w-100 w-md-auto mb-2 mb-md-0" onClick={()=>setreplaceProducto({poreste: null, este: null})}>{replaceProducto.este}</button>
                            <span className="fw-bold ms-1 me-1 d-none d-md-inline">{">"}</span>
                        </> 
                    :null}

                    {replaceProducto.poreste?
                        <>
                            <button className="btn btn-outline-success w-100 w-md-auto mb-2 mb-md-0" onClick={()=>setreplaceProducto({...replaceProducto, poreste: null})}> {replaceProducto.poreste}</button>
                            <button className="btn btn-outline-success btn-sm ms-2 w-100 w-md-auto" onClick={saveReplaceProducto}><i className="fa fa-paper-plane"></i></button>
                        </> 
                    :null}
                </div>
            :null} */}

            <div className="toolbar mb-4 sticky-top bg-white py-3 shadow-sm">
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <div className="search-box">
                            {busquedaAvanazadaInv ? (
                                <div className="advanced-search">
                                    <div className="row g-2">
                                        <div className="col-12 col-md-4">
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="fas fa-barcode"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={e => busqAvanzInputsFun(e, "codigo_barras")}
                                                    value={busqAvanzInputs["codigo_barras"]}
                                                    placeholder="Código de barras"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="fas fa-hashtag"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={e => busqAvanzInputsFun(e, "codigo_proveedor")}
                                                    value={busqAvanzInputs["codigo_proveedor"]}
                                                    placeholder="Código proveedor"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <select
                                                className="form-select"
                                                onChange={e => busqAvanzInputsFun(e, "id_proveedor")}
                                                value={busqAvanzInputs["id_proveedor"]}
                                            >
                                                <option value="">Seleccione Proveedor</option>
                                                {proveedoresList.map(e => (
                                                    <option value={e.id} key={e.id}>{e.descripcion}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text">
                                        <i className="fas fa-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        ref={inputBuscarInventario}
                                        className="form-control"
                                        placeholder="Buscar... (ESC para limpiar)"
                                        onChange={e => setQBuscarInventario(e.target.value)}
                                        value={qBuscarInventario}
                                    />
                                    <span className="input-group-text" onClick={() => openBarcodeScan("qBuscarInventario")}>
                                        <i className="fas fa-barcode"></i>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="d-flex flex-column flex-md-row gap-2 justify-content-end">
                            <div className="btn-group w-100 w-md-auto mb-2 mb-md-0">
                                <select
                                    className="form-select"
                                    value={Invnum}
                                    onChange={e => setInvnum(e.target.value)}
                                >
                                    <option value="25">25 registros</option>
                                    <option value="50">50 registros</option>
                                    <option value="100">100 registros</option>
                                    <option value="500">500 registros</option>
                                    <option value="2000">2000 registros</option>
                                    <option value="10000">10000 registros</option>
                                </select>
                                <select
                                    className="form-select"
                                    value={InvorderBy}
                                    onChange={e => setInvorderBy(e.target.value)}
                                >
                                    <option value="asc">Ascendente</option>
                                    <option value="desc">Descendente</option>
                                </select>
                            </div>
                            <div className="btn-group w-100 w-md-auto">
                                <button className="btn btn-primary w-100 w-md-auto mb-2 mb-md-0" onClick={getPorcentajeInventario}>
                                    <i className="fas fa-percentage me-2"></i>
                                    % Inventariado
                                </button>
                                <button className="btn btn-info w-100 w-md-auto mb-2 mb-md-0" onClick={reporteInventario}>
                                    <i className="fas fa-file-alt me-2"></i>
                                    Reporte
                                </button>
                                {user.iscentral && (
                                    <button 
                                        className="btn btn-primary w-100 w-md-auto mb-2 mb-md-0"
                                        onClick={() => changeInventario(null, null, null, "add")}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Nuevo (F2)
                                    </button>
                                )}
                                {busquedaAvanazadaInv && (
                                    <button 
                                        className="btn btn-primary w-100 w-md-auto mb-2 mb-md-0"
                                        onClick={buscarInvAvanz}
                                    >
                                        <i className="fas fa-search me-2"></i>
                                        Buscar
                                    </button>
                                )}
                                {user.iscentral && (
                                    <button 
                                        className="btn btn-success w-100 w-md-auto"
                                        onClick={guardarNuevoProductoLote}
                                    >
                                        <i className="fas fa-save me-2"></i>
                                        Guardar (F1)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <a href="#" onClick={() => setbusquedaAvanazadaInv(!busquedaAvanazadaInv)} className="d-block mb-3">Búsqueda {busquedaAvanazadaInv ? "sencilla" :"avanazada"}</a>
             */}
            {/* Mobile Sort Controls */}
            <div className="mb-3">
                <div className="d-flex flex-wrap gap-2">
                    <div className="d-flex align-items-center">
                        <span className="badge bg-sinapsis me-2">
                            <i className="fas fa-shield-alt"></i>
                        </span>
                        <small>Garantía</small>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="badge bg-info me-2">
                            <i className="fas fa-clock"></i>
                        </span>
                        <small>Pendiente por Retirar</small>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="badge bg-secondary me-2">
                            <i className="fas fa-paper-plane"></i>
                        </span>
                        <small>Pendiente por Enviar</small>
                    </div>
                </div>
            </div>
            <div className="d-md-none mb-3">
                <div className="row g-2">
                    <div className="col-6">
                        <select
                            className="form-select"
                            value={InvorderColumn}
                            onChange={e => setInvorderColumn(e.target.value)}
                        >
                            <option value="id">ID</option>
                            <option value="codigo_proveedor">Código Alterno</option>
                            <option value="codigo_barras">Código Barras</option>
                            <option value="unidad">Unidad</option>
                            <option value="descripcion">Descripción</option>
                            <option value="cantidad">Cantidad</option>
                            <option value="precio_base">Precio Base</option>
                            <option value="precio">Precio Venta</option>
                        </select>
                    </div>
                    <div className="col-6">
                        <select
                            className="form-select"
                            value={InvorderBy}
                            onChange={e => setInvorderBy(e.target.value)}
                        >
                            <option value="asc">Ascendente</option>
                            <option value="desc">Descendente</option>
                        </select>
                    </div>
                </div>
            </div>

            <form ref={refsInpInvList} onSubmit={e=>e.preventDefault()}>
                {/* Desktop Table View */}
                <div className="table-responsive d-none d-md-block">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th onClick={() => setInvorderColumn("id")}>
                                    ID
                                </th>
                                <th onClick={() => setInvorderColumn("codigo_proveedor")}>
                                    CÓDIGO ALTERNO
                                </th>
                                <th onClick={() => setInvorderColumn("codigo_barras")}>
                                    CÓDIGO BARRAS
                                </th>
                                <th onClick={() => setInvorderColumn("unidad")}>
                                    UNIDAD
                                </th>
                                <th onClick={() => setInvorderColumn("descripcion")}>
                                    DESCRIPCIÓN
                                </th>
                                <th>
                                    <div className="d-flex align-items-center">
                                        <span onClick={() => setInvorderColumn("cantidad")}>CANTIDAD</span>
                                        <span className="mx-2">/</span>
                                        <span onClick={() => setInvorderColumn("push")}>INVENTARIO</span>
                                    </div>
                                </th>
                                <th onClick={() => setInvorderColumn("precio_base")}>
                                    PRECIO BASE
                                </th>
                                <th>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span onClick={() => setInvorderColumn("precio")}>PRECIO VENTA</span>
                                        <button 
                                            className="btn btn-sm btn-outline-success"
                                            onClick={setSameGanancia}
                                        >
                                            <i className="fas fa-percentage me-1"></i>
                                            % General
                                        </button>
                                    </div>
                                </th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosInventario.map((e, i) => (
                                <tr 
                                    key={i}
                                    className={`${e.push ? 'table-success' : 'table-danger'} align-middle`}
                                    onDoubleClick={() => {
                                        if (!e.push) {
                                            changeInventario(null, i, e.id, "update");
                                        }
                                    }}
                                >
                                    <td>
                                        <span 
                                            className="text-primary cursor-pointer"
                                            onClick={() => selectRepleceProducto(e.id)}
                                        >
                                            {e.id}
                                        </span>
                                    </td>
                                    {type(e.type) ? (
                                        <>
                                            <td>{e.codigo_proveedor}</td>
                                            <td>{e.codigo_barras}</td>
                                            <td>{e.unidad}</td>
                                            <td>{e.descripcion}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span>{e.cantidad}</span>
                                                    <span className="badge bg-sinapsis ms-2" title="Garantía">
                                                        <i className="fas fa-shield-alt"></i> {e.garantia || 0}
                                                    </span>
                                                    <span className="badge bg-info ms-1" title="Pendiente por Retirar">
                                                        <i className="fas fa-clock"></i> {e.ppr || 0}
                                                    </span>
                                                    <span className="badge bg-secondary ms-1" title="Pendiente por Enviar">
                                                        <i className="fas fa-paper-plane"></i> {e.pendiente_enviar || 0}
                                                    </span>
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => openmodalhistoricoproducto(e.id)}
                                                    >
                                                        <i className="fas fa-history"></i>
                                                    </button>
                                                </div>
                                            </td>
                                            <td>{e.precio_base}</td>
                                            <td>
                                                <div className="d-flex flex-column">
                                                    <span className="fw-bold">{e.precio}</span>
                                                    <small className="text-success">
                                                        {getPorGanacia(e.precio || 0, e.precio_base || 0)}
                                                    </small>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={e.codigo_proveedor || ""}
                                                    onChange={e => changeInventario(e.target.value, i, e.id, "changeInput", "codigo_proveedor")}
                                                    placeholder="Código proveedor..."
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    required
                                                    className={`form-control form-control-sm ${!e.codigo_barras ? 'is-invalid' : ''}`}
                                                    value={e.codigo_barras || ""}
                                                    onChange={e => changeInventario(e.target.value, i, e.id, "changeInput", "codigo_barras")}
                                                    placeholder="Código barras..."
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    className={`form-control form-control-sm ${!e.unidad ? 'is-invalid' : ''}`}
                                                    value={e.unidad || ""}
                                                    onChange={e => changeInventario(e.target.value, i, e.id, "changeInput", "unidad")}
                                                >
                                                    <option value="">Seleccione...</option>
                                                    <option value="UND">UND</option>
                                                    <option value="PAR">PAR</option>
                                                    <option value="JUEGO">JUEGO</option>
                                                    <option value="PQT">PQT</option>
                                                    <option value="MTR">MTR</option>
                                                    <option value="KG">KG</option>
                                                    <option value="GRS">GRS</option>
                                                    <option value="LTR">LTR</option>
                                                    <option value="ML">ML</option>
                                                </select>
                                            </td>
                                            <td>
                                                <textarea
                                                    className={`form-control form-control-sm ${!e.descripcion ? 'is-invalid' : ''}`}
                                                    value={e.descripcion || ""}
                                                    onChange={e => changeInventario(e.target.value.replace("\n", ""), i, e.id, "changeInput", "descripcion")}
                                                    placeholder="Descripción..."
                                                    rows="2"
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column gap-2">
                                                    <input
                                                        type="text"
                                                        required
                                                        className={`form-control form-control-sm ${!e.cantidad ? 'is-invalid' : ''}`}
                                                        value={e.cantidad || ""}
                                                        onChange={e => changeInventario(number(e.target.value), i, e.id, "changeInput", "cantidad")}
                                                        placeholder="Cantidad..."
                                                    />
                                                    <button
                                                        className={`btn btn-sm ${e.push ? 'btn-success' : 'btn-secondary'}`}
                                                        onClick={e => changeInventario(e.push ? 0 : 1, i, e.id, "changeInput", "push")}
                                                    >
                                                        {e.push ? 'Inventariado' : 'No inventariado'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    required
                                                    className={`form-control form-control-sm ${!e.precio_base ? 'is-invalid' : ''}`}
                                                    value={e.precio_base || ""}
                                                    onChange={e => changeInventario(number(e.target.value), i, e.id, "changeInput", "precio_base")}
                                                    placeholder="Precio base..."
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="input-group input-group-sm">
                                                        <input
                                                            type="text"
                                                            required
                                                            className={`form-control ${!e.precio ? 'is-invalid' : ''}`}
                                                            value={e.precio || ""}
                                                            onChange={e => changeInventario(number(e.target.value), i, e.id, "changeInput", "precio")}
                                                            placeholder="Precio venta..."
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => setporcenganancia("list", e.precio_base, (precio) => {
                                                                changeInventario(precio, i, e.id, "changeInput", "precio");
                                                            })}
                                                        >
                                                            <i className="fas fa-percentage"></i>
                                                        </button>
                                                    </div>
                                                    <small className="text-success">
                                                        {getPorGanacia(e.precio || 0, e.precio_base || 0)}
                                                    </small>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                    <td>
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => changeInventario(null, i, e.id, "update")}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => changeInventario(null, i, e.id, "delete")}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                            <span className="btn-sm btn btn-warning" onClick={() => printTickedPrecio(e.id)}><i className="fa fa-print"></i></span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="d-md-none">
                    {productosInventario.map((e, i) => (
                        <div 
                            key={i}
                            className={`card mb-3 ${e.push ? 'border-success' : 'border-danger'} ${!type(e.type) ? 'edit-mode' : ''}`}
                            onDoubleClick={() => {
                                if (!e.push) {
                                    changeInventario(null, i, e.id, "update");
                                }
                            }}
                        >
                            <div className={`card-header d-flex justify-content-between align-items-center ${!type(e.type) ? 'bg-primary bg-opacity-10' : ''}`}>
                                <span 
                                    className="text-primary cursor-pointer"
                                    onClick={() => selectRepleceProducto(e.id)}
                                >
                                    {e.id}
                                </span>
                                <div className="d-flex gap-1">
                                    <span className="btn-sm btn btn-warning" onClick={() => printTickedPrecio(e.id)}>
                                        <i className="fa fa-print"></i>
                                    </span>
                                    <button 
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => openmodalhistoricoproducto(e.id)}
                                    >
                                        <i className="fas fa-history"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => changeInventario(null, i, e.id, "delete")}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => changeInventario(null, i, e.id, "update")}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                </div>
                            </div>
                            <div className={`card-body ${!type(e.type) ? 'bg-light border-top border-primary border-opacity-25' : ''}`}>
                                {type(e.type) ? (
                                    <>
                                        <div className="row g-2 mb-2">
                                            <div className="col-6">
                                                <small className="text-muted">Código Alterno</small>
                                                <div>{e.codigo_proveedor}</div>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Código Barras</small>
                                                <div>{e.codigo_barras}</div>
                                            </div>
                                        </div>
                                        <div className="row g-2 mb-2">
                                            <div className="col-6">
                                                <small className="text-muted">Unidad</small>
                                                <div>{e.unidad}</div>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Cantidad</small>
                                                <div className="fw-bold fs-5 text-primary">
                                                    {e.cantidad}  
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <span className="badge bg-sinapsis badge-sm" title="Garantía">
                                                        <i className="fas fa-shield-alt fa-xs"></i> {e.garantia || 0}
                                                    </span>
                                                    <span className="badge bg-info badge-sm" title="Pendiente por Retirar">
                                                        <i className="fas fa-clock fa-xs"></i> {e.ppr || 0}
                                                    </span>
                                                    <span className="badge bg-secondary badge-sm" title="Pendiente por Enviar">
                                                        <i className="fas fa-paper-plane fa-xs"></i> {e.pendiente_enviar || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <small className="text-muted">Descripción</small>
                                            <div>{e.descripcion}</div>
                                        </div>
                                        <div className="row g-2">
                                            <div className="col-6">
                                                <small className="text-muted">Precio Base</small>
                                                <div>{e.precio_base}</div>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Precio Venta</small>
                                                <div>
                                                    <span className="fw-bold">{e.precio}</span>
                                                    <small className="text-success d-block">
                                                        {getPorGanacia(e.precio || 0, e.precio_base || 0)}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="top-0 end-0 mt-2 me-2 d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => changeInventario(null, i, e.id, "update")}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>

                                            <button
                                                className="btn btn-sm btn-sinapsis"
                                                onDoubleClick={() => {
                                                    let valor = prompt("Ingrese La cantidad Util");
                                                    if (valor !== null) {
                                                        let newvalor = parseFloat(e.cantidad) + parseFloat(valor)
                                                        changeInventario(newvalor, i, e.id, "changeInput", "cantidad")
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-box-open"></i>
                                            </button>


                                        </div>
                                        <div className="row g-2 mb-2">
                                            <div className="col-6">
                                                <small className="text-muted">Código Alterno</small>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={e.codigo_proveedor || ""}
                                                    onChange={e => changeInventario(e.target.value, i, e.id, "changeInput", "codigo_proveedor")}
                                                    placeholder="Código proveedor..."
                                                />
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Código Barras</small>
                                                <input
                                                    type="text"
                                                    required
                                                    className={`form-control form-control-sm ${!e.codigo_barras ? 'is-invalid' : ''}`}
                                                    value={e.codigo_barras || ""}
                                                    onChange={e => changeInventario(e.target.value, i, e.id, "changeInput", "codigo_barras")}
                                                    placeholder="Código barras..."
                                                />
                                            </div>
                                        </div>
                                        <div className="row g-2 mb-2">
                                            <div className="col-6">
                                                <small className="text-muted">Unidad</small>
                                                <select
                                                    className={`form-control form-control-sm ${!e.unidad ? 'is-invalid' : ''}`}
                                                    value={e.unidad || ""}
                                                    onChange={e => changeInventario(e.target.value, i, e.id, "changeInput", "unidad")}
                                                >
                                                    <option value="">Seleccione...</option>
                                                    <option value="UND">UND</option>
                                                    <option value="PAR">PAR</option>
                                                    <option value="JUEGO">JUEGO</option>
                                                    <option value="PQT">PQT</option>
                                                    <option value="MTR">MTR</option>
                                                    <option value="KG">KG</option>
                                                    <option value="GRS">GRS</option>
                                                    <option value="LTR">LTR</option>
                                                    <option value="ML">ML</option>
                                                </select>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Cantidad</small>
                                                <input
                                                    type="text"
                                                    required
                                                    className={`form-control form-control-sm fw-bold fs-5 ${!e.cantidad ? 'is-invalid' : ''}`}
                                                    value={e.cantidad || ""}
                                                    onChange={e => changeInventario(number(e.target.value), i, e.id, "changeInput", "cantidad")}
                                                    placeholder="Cantidad..."
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <small className="text-muted">Descripción</small>
                                            <textarea
                                                className={`form-control form-control-sm ${!e.descripcion ? 'is-invalid' : ''}`}
                                                value={e.descripcion || ""}
                                                onChange={e => changeInventario(e.target.value.replace("\n", ""), i, e.id, "changeInput", "descripcion")}
                                                placeholder="Descripción..."
                                                rows="2"
                                            />
                                        </div>
                                        <div className="row g-2 mb-2">
                                            <div className="col-6">
                                                <small className="text-muted">Precio Base</small>
                                                <input
                                                    type="text"
                                                    required
                                                    className={`form-control form-control-sm ${!e.precio_base ? 'is-invalid' : ''}`}
                                                    value={e.precio_base || ""}
                                                    onChange={e => changeInventario(number(e.target.value), i, e.id, "changeInput", "precio_base")}
                                                    placeholder="Precio base..."
                                                />
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted">Precio Venta</small>
                                                <div className="input-group input-group-sm">
                                                    <input
                                                        type="text"
                                                        required
                                                        className={`form-control ${!e.precio ? 'is-invalid' : ''}`}
                                                        value={e.precio || ""}
                                                        onChange={e => changeInventario(number(e.target.value), i, e.id, "changeInput", "precio")}
                                                        placeholder="Precio venta..."
                                                    />
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setporcenganancia("list", e.precio_base, (precio) => {
                                                            changeInventario(precio, i, e.id, "changeInput", "precio");
                                                        })}
                                                    >
                                                        <i className="fas fa-percentage"></i>
                                                    </button>
                                                </div>
                                                <small className="text-success">
                                                    {getPorGanacia(e.precio || 0, e.precio_base || 0)}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <button
                                                className={`btn btn-sm w-100 ${e.push ? 'btn-success' : 'btn-secondary'}`}
                                                onClick={e => changeInventario(e.push ? 0 : 1, i, e.id, "changeInput", "push")}
                                            >
                                                {e.push ? 'Inventariado' : 'No inventariado'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </div>    
    )
}