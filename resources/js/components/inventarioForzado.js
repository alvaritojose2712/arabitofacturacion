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
                                    <div className="col-md-4">
                                        <select
                                            className="form-select"
                                            value={usuariomodalhistoricoproducto}
                                            onChange={e => setusuariomodalhistoricoproducto(e.target.value)}
                                        >
                                            <option value="">Seleccione Usuario</option>
                                            {usuariosData.map(e => (
                                                <option value={e.id} key={e.id}>{e.usuario}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <input 
                                            type="date" 
                                            className="form-control"
                                            value={fecha1modalhistoricoproducto}
                                            onChange={e => setfecha1modalhistoricoproducto(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4">
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
                                        className="btn btn-primary"
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

                {replaceProducto?
                    <div className="m-2">
                        {replaceProducto.este?
                            <>
                                <button className="btn btn-outline-danger" onClick={()=>setreplaceProducto({poreste: null, este: null})}>{replaceProducto.este}</button>
                                <span className="fw-bold ms-1 me-1">{">"}</span>
                            </> 
                        :null}

                        {replaceProducto.poreste?
                            <>
                                <button className="btn btn-outline-success" onClick={()=>setreplaceProducto({...replaceProducto, poreste: null})}> {replaceProducto.poreste}</button>
                                <button className="btn btn-outline-success btn-sm ms-2" onClick={saveReplaceProducto}><i className="fa fa-paper-plane"></i></button>

                            </> 
                        :null}
                        
                    </div>
                
                :null}
            <div className="toolbar mb-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="search-box">
                            {busquedaAvanazadaInv ? (
                                <div className="advanced-search">
                                    <div className="row g-2">
                                        <div className="col-md-4">
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
                                        <div className="col-md-4">
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
                                        <div className="col-md-4">
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
                                <div className="input-group">
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
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex gap-2 justify-content-end">
                            <div className="btn-group">
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
                            <div className="btn-group">
                                <button className="btn btn-primary" onClick={getPorcentajeInventario}>
                                    <i className="fas fa-percentage me-2"></i>
                                    % Inventariado
                                </button>
                                <button className="btn btn-danger" onClick={cleanInventario}>
                                    <i className="fas fa-trash me-2"></i>
                                    Limpiar
                                </button>
                                <button className="btn btn-info" onClick={reporteInventario}>
                                    <i className="fas fa-file-alt me-2"></i>
                                    Reporte
                                </button>
                                <button className="btn btn-success" onClick={exportPendientes}>
                                    <i className="fas fa-file-export me-2"></i>
                                    Exportar
                                </button>
                                {user.iscentral && (
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => changeInventario(null, null, null, "add")}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Nuevo (F2)
                                    </button>
                                )}
                                {busquedaAvanazadaInv && (
                                    <button 
                                        className="btn btn-primary"
                                        onClick={buscarInvAvanz}
                                    >
                                        <i className="fas fa-search me-2"></i>
                                        Buscar
                                    </button>
                                )}
                                {user.iscentral && (
                                    <button 
                                        className="btn btn-success"
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
            <a href="#" onClick={() => setbusquedaAvanazadaInv(!busquedaAvanazadaInv)}>Búsqueda {busquedaAvanazadaInv ? "sencilla" :"avanazada"}</a>
            
            <form ref={refsInpInvList} onSubmit={e=>e.preventDefault()}>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th onClick={() => setInvorderColumn("id")}>
                                    ID / VINCULACIÓN
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
                                            <strong>{e.id_vinculacion}</strong> / {e.id}
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
            </form>
        </div>    
    )
}