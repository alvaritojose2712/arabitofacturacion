import Modalmovil from "./modalmovil";
export default function Panelcentrodeacopio({
    modalmovilRef,
    idselectproductoinsucursalforvicular,
    guardarDeSucursalEnCentral,
    getSucursales,
    sucursalesCentral,
    setselectSucursalCentral,
    selectSucursalCentral,

    getInventarioSucursalFromCentral,
    setInventarioSucursalFromCentral,
    inventarioSucursalFromCentral,

    categorias,
    proveedoresList,
    changeInventarioFromSucursalCentral,
    setCambiosInventarioSucursal,
    number,

    subviewpanelcentroacopio,
    setsubviewpanelcentroacopio,

    fallaspanelcentroacopio,
    estadisticaspanelcentroacopio,
    gastospanelcentroacopio,
    cierrespanelcentroacopio,
    diadeventapanelcentroacopio,
    tasaventapanelcentroacopio,
    setchangetasasucursal,

    parametrosConsultaFromsucursalToCentral,
    setparametrosConsultaFromsucursalToCentral,
    onchangeparametrosConsultaFromsucursalToCentral,
    getTareasCentral,
    tareasCentral,
    openVincularSucursalwithCentral,

    modalmovilx,
    modalmovily,
    modalmovilshow,
    setmodalmovilshow,
    getProductos,
    productos,
    linkproductocentralsucursal,
    inputbuscarcentralforvincular,
    puedoconsultarproductosinsucursalfromcentral,

    uniqueproductofastshowbyid,
    getUniqueProductoById,
    showdatafastproductobyid,
    setshowdatafastproductobyid,
    estadisticasinventarioSucursalFromCentral,
    autovincularSucursalCentral,

    datainventarioSucursalFromCentralcopy,
    setdatainventarioSucursalFromCentralcopy,

}) {
    const type = (type) => {
        return !type || type === "delete" ? true : false;
    };
    return (
        <div className="container-fluid">
            {modalmovilshow ? (
                <Modalmovil
                    modalmovilRef={modalmovilRef}
                    x={modalmovilx}
                    y={modalmovily}
                    setmodalmovilshow={setmodalmovilshow}
                    modalmovilshow={modalmovilshow}
                    getProductos={getProductos}
                    productos={productos}
                    linkproductocentralsucursal={linkproductocentralsucursal}
                    inputbuscarcentralforvincular={
                        inputbuscarcentralforvincular
                    }
                />
            ) : null}

            {showdatafastproductobyid ? (
                <div
                    className="modalmovil-sm"
                    style={{ top: modalmovily + 15, left: modalmovilx }}
                    onMouseLeave={() => setshowdatafastproductobyid(false)}
                    onClick={() => setshowdatafastproductobyid(false)}
                >
                    <h5>Producto de Centro de acopio</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>C. Alterno</th>
                                <th>C. Barras</th>
                                <th>Unidad</th>
                                <th>Descripción</th>
                                <th>Base</th>
                                <th>Venta</th>
                                <th>Categoría/Proveedor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="pointer align-middle">
                                <td>
                                    {uniqueproductofastshowbyid.id
                                        ? uniqueproductofastshowbyid.id
                                        : null}
                                </td>
                                <td>
                                    {uniqueproductofastshowbyid.codigo_proveedor
                                        ? uniqueproductofastshowbyid.codigo_proveedor
                                        : null}
                                </td>
                                <td>
                                    {uniqueproductofastshowbyid.codigo_barras
                                        ? uniqueproductofastshowbyid.codigo_barras
                                        : null}
                                </td>
                                <td>
                                    {uniqueproductofastshowbyid.unidad
                                        ? uniqueproductofastshowbyid.unidad
                                        : null}
                                </td>
                                <td>
                                    {uniqueproductofastshowbyid.descripcion
                                        ? uniqueproductofastshowbyid.descripcion
                                        : null}
                                </td>
                                <td>
                                    {uniqueproductofastshowbyid.precio_base
                                        ? uniqueproductofastshowbyid.precio_base
                                        : null}
                                </td>
                                <td className="text-success">
                                    {uniqueproductofastshowbyid.precio
                                        ? uniqueproductofastshowbyid.precio
                                        : null}
                                </td>
                                <td>
                                    {uniqueproductofastshowbyid.id_categoria
                                        ? uniqueproductofastshowbyid.id_categoria
                                        : null}
                                    /
                                    {uniqueproductofastshowbyid.id_proveedor
                                        ? uniqueproductofastshowbyid.id_proveedor
                                        : null}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : null}
            <div className="row">
                <div className="col-1">
                    <h6>
                        Cola de tareas{" "}
                        <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => getTareasCentral([0, 1])}
                        >
                            {" "}
                            <i className="fa fa-search"></i>{" "}
                        </button>
                    </h6>

                    <table className="table">
                        <tbody>
                            {tareasCentral.length ? (
                                tareasCentral.map((e, i) =>
                                    e ? (
                                        
                                            <tr key={e.id}
                                            className={
                                                (e.estado == 1
                                                    ? "bg-success-light"
                                                    : "bg-light") +
                                                " text-secondary" +
                                                " card mt-2 pointer"
                                            }>
                                                <td>{e.id}</td>
                                                <td>{e.sucursal.codigo}</td>
                                                <td>{e.created_at}</td>
                                                <td>
                                                    {e.tipo==1?"MODIFICAR":null}
                                                    {e.tipo==2?"ELIMINAR DUPLICADOS":null}
                                                </td>
                                                <td>
                                                    {e.antesproducto?
                                                        <table className="table">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <b>CB:</b> {e.prodantesproducto.codigo_barras} <br />
                                                                        <b>CA:</b> {e.prodantesproducto.codigo_alterno}
                                                                    </td>
                                                                    <td>{e.prodantesproducto.descripcion}</td>
                                                                    <td>{e.prodantesproducto.cantidad}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    :null}


                                                    {e.id_producto_verde?e.id_producto_verde:null}
                                                </td>
                                                <td>
                                                    {e.id_producto_rojo?e.id_producto_rojo:null} 

                                                    {e.cambiarproducto?
                                                        <table className="table">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <b>CB:</b> {e.prodcambiarproducto.codigo_barras} <br />
                                                                        <b>CA:</b> {e.prodcambiarproducto.codigo_alterno}
                                                                    </td>
                                                                    <td>{e.prodcambiarproducto.descripcion}</td>
                                                                    <td>{e.prodcambiarproducto.cantidad}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    :null}
                                                </td>
                                                <td>
                                                    <button className={("btn btn-"+(qTareaPendienteEstado==0?"sinapsis":"success"))}>
                                                        {qTareaPendienteEstado==0?
                                                            <i className="fa fa-clock-o"></i>
                                                            :
                                                            <i className="fa fa-check"></i>
                                                        }
                                                    </button>
                                                </td>
                                            </tr>
                                    ) : null
                                )
                            ) : null}
                        </tbody>
                    </table>

                </div>
                <div className="col-2">
                    <button
                        className="btn btn-outline-success w-100 mb-1"
                        onClick={getSucursales}
                    >
                        Buscar Sucursales
                    </button>

                    <ul className="list-group">
                        {sucursalesCentral
                            ? sucursalesCentral.length
                                ? sucursalesCentral.map((e) => (
                                    <li
                                        onClick={() =>
                                            setselectSucursalCentral(e.codigo)
                                        }
                                        className={
                                            (e.codigo == selectSucursalCentral
                                                ? "active"
                                                : null) +
                                            " list-group-item pointer"
                                        }
                                        key={e.id}
                                    >
                                        {e.codigo} - {e.nombre}
                                    </li>
                                ))
                                : null
                            : null}
                    </ul>
                </div>

                <div className="col">
                    {selectSucursalCentral !== null ? (
                        <>
                            <div className="btn-group">
                                <button
                                    className="btn btn-outline-success mb-1"
                                    onClick={() =>
                                        setsubviewpanelcentroacopio(
                                            "inventarioSucursalFromCentral"
                                        )
                                    }
                                >
                                    Inventario
                                </button>
                                <button
                                    className="btn btn-outline-success mb-1"
                                    onClick={() =>
                                        setsubviewpanelcentroacopio(
                                            "fallaspanelcentroacopio"
                                        )
                                    }
                                >
                                    Fallas
                                </button>
                                <button
                                    className="btn btn-outline-success mb-1"
                                    onClick={() =>
                                        setsubviewpanelcentroacopio(
                                            "estadisticaspanelcentroacopio"
                                        )
                                    }
                                >
                                    Estadísticas
                                </button>
                                <button
                                    className="btn btn-outline-success mb-1"
                                    onClick={() =>
                                        setsubviewpanelcentroacopio(
                                            "gastospanelcentroacopio"
                                        )
                                    }
                                >
                                    Gastos
                                </button>
                                <button
                                    className="btn btn-outline-success mb-1"
                                    onClick={() =>
                                        setsubviewpanelcentroacopio(
                                            "cierrespanelcentroacopio"
                                        )
                                    }
                                >
                                    Cierres
                                </button>

                                <button
                                    className="btn btn-outline-success mb-1"
                                    onClick={() =>
                                        setsubviewpanelcentroacopio(
                                            "diadeventapanelcentroacopio"
                                        )
                                    }
                                >
                                    Día de Venta
                                </button>
                                <button
                                    className="btn btn-outline-success mb-1"
                                    onClick={() =>
                                        setsubviewpanelcentroacopio(
                                            "tasaventapanelcentroacopio"
                                        )
                                    }
                                >
                                    Tasa de Venta
                                </button>
                            </div>

                            {subviewpanelcentroacopio ==
                                "inventarioSucursalFromCentral" ? (
                                <>
                                    <h1>Inventario</h1>
                                    <div className="input-group mb-3">
                                        {puedoconsultarproductosinsucursalfromcentral() ? (
                                            <>
                                                <button
                                                    className="btn btn-outline-success"
                                                    onClick={() =>
                                                        setInventarioSucursalFromCentral(
                                                            "inventarioSucursalFromCentral"
                                                        )
                                                    }
                                                >
                                                    Recibir
                                                </button>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Buscar..."
                                                    name="qinventario"
                                                    value={
                                                        parametrosConsultaFromsucursalToCentral.qinventario
                                                            ? parametrosConsultaFromsucursalToCentral.qinventario
                                                            : ""
                                                    }
                                                    onChange={
                                                        onchangeparametrosConsultaFromsucursalToCentral
                                                    }
                                                />
                                                <select
                                                    className="form-control"
                                                    name="numinventario"
                                                    value={
                                                        parametrosConsultaFromsucursalToCentral.numinventario
                                                            ? parametrosConsultaFromsucursalToCentral.numinventario
                                                            : ""
                                                    }
                                                    onChange={
                                                        onchangeparametrosConsultaFromsucursalToCentral
                                                    }
                                                >
                                                    <option value="25">
                                                        25
                                                    </option>
                                                    <option value="50">
                                                        50
                                                    </option>
                                                    <option value="100">
                                                        100
                                                    </option>
                                                    <option value="500">
                                                        500
                                                    </option>
                                                </select>
                                                <select
                                                    className="form-control"
                                                    name="novinculados"
                                                    value={
                                                        parametrosConsultaFromsucursalToCentral.novinculados
                                                            ? parametrosConsultaFromsucursalToCentral.novinculados
                                                            : ""
                                                    }
                                                    onChange={
                                                        onchangeparametrosConsultaFromsucursalToCentral
                                                    }
                                                >
                                                    <option value="todos">
                                                        Todos
                                                    </option>
                                                    <option value="novinculados">
                                                        No vinculados
                                                    </option>
                                                    <option value="sivinculados">
                                                        vinculados
                                                    </option>
                                                    <option value="pedido">
                                                        Pedido
                                                    </option>
                                                </select>

                                                <button
                                                    className="btn btn-outline-success"
                                                    onClick={() =>
                                                        getInventarioSucursalFromCentral(
                                                            "inventarioSucursalFromCentral"
                                                        )
                                                    }
                                                >
                                                    Consultar
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="btn bg-danger-light"
                                                onClick={() =>
                                                    getInventarioSucursalFromCentral(
                                                        "inventarioSucursalFromCentralmodify"
                                                    )
                                                }
                                            >
                                                Guardar/Editar Cambios
                                            </button>
                                        )}
                                    </div>
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className="row">
                                            <div className="col">
                                                Productos vinculados con central{" "}
                                                {estadisticasinventarioSucursalFromCentral ?
                                                    <>
                                                        <span className="h5">
                                                            {estadisticasinventarioSucursalFromCentral.vinculados
                                                                ? estadisticasinventarioSucursalFromCentral.vinculados
                                                                : null}
                                                        </span>{" "}
                                                        /{" "}
                                                        <span className="h5">
                                                            {estadisticasinventarioSucursalFromCentral.items_inventario
                                                                ? estadisticasinventarioSucursalFromCentral.items_inventario
                                                                : null}
                                                        </span>{" "}
                                                        consultados{" "}
                                                        <span className="h5">
                                                            {estadisticasinventarioSucursalFromCentral.items_inventario_recuperados
                                                                ? estadisticasinventarioSucursalFromCentral.items_inventario_recuperados
                                                                : null}
                                                        </span>
                                                    </>
                                                    : null}
                                            </div>
                                            <div className="col">
                                                <div className="btn-group">
                                                    <button className="btn bg-secondary-light ">
                                                        Consultado
                                                    </button>
                                                    <button className="btn bg-danger-light ">
                                                        Preparado
                                                    </button>
                                                    <button className="btn bg-warning-light ">
                                                        Cargado
                                                    </button>
                                                    <button className="btn bg-success-light ">
                                                        Procesado
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="cell05 pointer">
                                                        <span>
                                                            ID VINCULACIÓN
                                                        </span>
                                                        <br />
                                                        <span>CENTRAL</span> <button className="btn btn-sm btn-success" onClick={() => autovincularSucursalCentral()}>Auto vincular(codigoBarras)</button>
                                                    </th>
                                                    <th className="cell1 pointer">
                                                        <span>C. Alterno</span>
                                                    </th>
                                                    <th className="cell1 pointer">
                                                        <span>C. Barras</span>
                                                    </th>
                                                    <th className="cell05 pointer">
                                                        <span>Unidad</span>
                                                    </th>
                                                    <th className="cell2 pointer">
                                                        <span>Descripción</span>
                                                    </th>
                                                    <th className="cell05 pointer">
                                                        <span>Ct.</span>
                                                    </th>
                                                    <th className="cell1 pointer">
                                                        <span>Base</span>
                                                    </th>
                                                    <th className="cell15 pointer">
                                                        <span>Venta </span>
                                                    </th>
                                                    <th className="cell15 pointer">
                                                        <span>Categoría</span>

                                                        <br />
                                                        <span>Preveedor</span>
                                                    </th>
                                                    <th className="cell05 pointer">
                                                        <span>IVA</span>
                                                    </th>
                                                    <th className="cell1">
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() =>
                                                                changeInventarioFromSucursalCentral(
                                                                    null,
                                                                    null,
                                                                    null,
                                                                    "add"
                                                                )
                                                            }
                                                        >
                                                            <i className="fa fa-plus"></i>
                                                        </button>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    inventarioSucursalFromCentral ?
                                                        inventarioSucursalFromCentral.length ? (
                                                            inventarioSucursalFromCentral.map(
                                                                (e, i) => (
                                                                    <tr
                                                                        key={i}
                                                                        className={
                                                                            (e.estatus ==
                                                                                0
                                                                                ? "bg-secondary-light"
                                                                                : e.estatus ==
                                                                                    1
                                                                                    ? "bg-danger-light"
                                                                                    : e.estatus ==
                                                                                        2
                                                                                        ? "bg-warning-light"
                                                                                        : e.estatus ==
                                                                                            3
                                                                                            ? "bg-success-light"
                                                                                            : "") +
                                                                            " pointer"
                                                                        }
                                                                        onDoubleClick={() =>
                                                                            changeInventarioFromSucursalCentral(
                                                                                null,
                                                                                i,
                                                                                e.id,
                                                                                "update"
                                                                            )
                                                                        }
                                                                    >
                                                                        {type(
                                                                            e.type
                                                                        ) ? (
                                                                            <>
                                                                                <td className="cell05">
                                                                                    {!e.id_vinculacion ? (
                                                                                        <>
                                                                                            <button
                                                                                                className={(idselectproductoinsucursalforvicular.index==i?"btn-warning":"btn-outline-danger")+(" btn fs-10px")}
                                                                                                
                                                                                                onClick={(
                                                                                                    event
                                                                                                    ) =>
                                                                                                    openVincularSucursalwithCentral(
                                                                                                        event,
                                                                                                        {
                                                                                                            id: e.id ? e.id: null , index: i,
                                                                                                        }
                                                                                                        )
                                                                                                    }
                                                                                                    >
                                                                                                No
                                                                                                vinculado
                                                                                            </button>
                                                                                            <button className="btn btn-outline-success btn-sm fs-10px" onClick={()=>guardarDeSucursalEnCentral(i, e.id ? e.id: null)}><i className="fa fa-save"></i></button>
                                                                                        </>
                                                                                    ) : (
                                                                                        <button
                                                                                            className="btn btn-outline-success"
                                                                                            onClick={(
                                                                                                event
                                                                                            ) =>
                                                                                                openVincularSucursalwithCentral(
                                                                                                    event,
                                                                                                    {
                                                                                                        id: e.id
                                                                                                            ? e.id
                                                                                                            : null,
                                                                                                        index: i,
                                                                                                    }
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            #
                                                                                            {
                                                                                                e.id_vinculacion
                                                                                            }
                                                                                        </button>
                                                                                    )}
                                                                                </td>
                                                                                <td className="cell1">
                                                                                    #
                                                                                    {
                                                                                        e.id
                                                                                    }
                                                                                    /
                                                                                    {
                                                                                        e.codigo_proveedor
                                                                                    }
                                                                                </td>
                                                                                <td className="cell1">
                                                                                    {
                                                                                        e.codigo_barras
                                                                                    }
                                                                                </td>
                                                                                <td className="cell05">
                                                                                    {
                                                                                        e.unidad
                                                                                    }
                                                                                </td>
                                                                                <td className="cell2">
                                                                                    {
                                                                                        e.descripcion
                                                                                    }
                                                                                </td>
                                                                                <th className="cell05">
                                                                                    {
                                                                                        e.cantidad
                                                                                    }
                                                                                </th>
                                                                                <td className="cell1">
                                                                                    {
                                                                                        e.precio_base
                                                                                    }
                                                                                </td>
                                                                                <td className="cell15 text-success">
                                                                                    {
                                                                                        e.precio
                                                                                    }
                                                                                </td>
                                                                                <td className="cell15">
                                                                                    {
                                                                                        e.id_categoria
                                                                                    }{" "}
                                                                                    <br />{" "}
                                                                                    {
                                                                                        e.id_proveedor
                                                                                    }
                                                                                </td>
                                                                                <td className="cell05">
                                                                                    {
                                                                                        e.iva
                                                                                    }
                                                                                </td>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <td className="cell1">
                                                                                    {!e.id_vinculacion ? (
                                                                                        <>
                                                                                            <button
                                                                                                className="btn btn-outline-danger"
                                                                                                onClick={(
                                                                                                    event
                                                                                                    ) =>
                                                                                                    openVincularSucursalwithCentral(
                                                                                                        event,
                                                                                                        {
                                                                                                            id: e.id
                                                                                                            ? e.id
                                                                                                            : null,
                                                                                                            index: i,
                                                                                                        }
                                                                                                        )
                                                                                                    }
                                                                                                    >
                                                                                                No
                                                                                                vinculado
                                                                                            </button>

                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <button
                                                                                                className="btn btn-outline-success"
                                                                                                onClick={(
                                                                                                    event
                                                                                                ) =>
                                                                                                    openVincularSucursalwithCentral(
                                                                                                        event,
                                                                                                        {
                                                                                                            id: e.id
                                                                                                                ? e.id
                                                                                                                : null,
                                                                                                            index: i,
                                                                                                        }
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                #
                                                                                                {
                                                                                                    e.id_vinculacion
                                                                                                }
                                                                                            </button>
                                                                                            <i
                                                                                                className="fa fa-eye text-success pointer m-3"
                                                                                                onClick={(
                                                                                                    event
                                                                                                ) =>
                                                                                                    getUniqueProductoById(
                                                                                                        event,
                                                                                                        e.id_vinculacion
                                                                                                    )
                                                                                                }
                                                                                            ></i>
                                                                                        </>
                                                                                    )}
                                                                                </td>
                                                                                <td className="cell1">
                                                                                    {
                                                                                        datainventarioSucursalFromCentralcopy[i]?
                                                                                        <span className="text-muted text-decoration-line-through">{datainventarioSucursalFromCentralcopy[i].codigo_proveedor}</span>
                                                                                        :null
                                                                                    }<br />
                                                                                    
                                                                                    <input
                                                                                        type="text"
                                                                                        disabled={type(
                                                                                            e.type
                                                                                        )}
                                                                                        className="form-control form-control-sm"
                                                                                        value={
                                                                                            !e.codigo_proveedor
                                                                                                ? ""
                                                                                                : e.codigo_proveedor
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                e.id,
                                                                                                "changeInput",
                                                                                                "codigo_proveedor"
                                                                                            )
                                                                                        }
                                                                                        placeholder="codigo_proveedor..."
                                                                                    />
                                                                                </td>
                                                                                <td className="cell1">
                                                                                    {
                                                                                        datainventarioSucursalFromCentralcopy[i]?
                                                                                        <span className="text-muted text-decoration-line-through">{datainventarioSucursalFromCentralcopy[i].codigo_barras}</span>
                                                                                        :null
                                                                                    }<br />
                                                                                    <input
                                                                                        type="text"
                                                                                        required={
                                                                                            true
                                                                                        }
                                                                                        disabled={type(
                                                                                            e.type
                                                                                        )}
                                                                                        className={
                                                                                            "form-control form-control-sm " +
                                                                                            (!e.codigo_barras
                                                                                                ? "invalid"
                                                                                                : null)
                                                                                        }
                                                                                        value={
                                                                                            !e.codigo_barras
                                                                                                ? ""
                                                                                                : e.codigo_barras
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                e.id,
                                                                                                "changeInput",
                                                                                                "codigo_barras"
                                                                                            )
                                                                                        }
                                                                                        placeholder="codigo_barras..."
                                                                                    />
                                                                                </td>
                                                                                <td className="cell05">
                                                                                    {
                                                                                        datainventarioSucursalFromCentralcopy[i]?
                                                                                        <span className="text-muted text-decoration-line-through">{datainventarioSucursalFromCentralcopy[i].unidad}</span>
                                                                                        :null
                                                                                    }<br />
                                                                                    <select
                                                                                        disabled={type(
                                                                                            e.type
                                                                                        )}
                                                                                        className={
                                                                                            "form-control form-control-sm " +
                                                                                            (!e.unidad
                                                                                                ? "invalid"
                                                                                                : null)
                                                                                        }
                                                                                        value={
                                                                                            !e.unidad
                                                                                                ? ""
                                                                                                : e.unidad
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                e.id,
                                                                                                "changeInput",
                                                                                                "unidad"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <option value="">
                                                                                            --Select--
                                                                                        </option>
                                                                                        <option value="UND">
                                                                                            UND
                                                                                        </option>
                                                                                        <option value="PAR">
                                                                                            PAR
                                                                                        </option>
                                                                                        <option value="JUEGO">
                                                                                            JUEGO
                                                                                        </option>
                                                                                        <option value="PQT">
                                                                                            PQT
                                                                                        </option>
                                                                                        <option value="MTR">
                                                                                            MTR
                                                                                        </option>
                                                                                        <option value="KG">
                                                                                            KG
                                                                                        </option>
                                                                                        <option value="GRS">
                                                                                            GRS
                                                                                        </option>
                                                                                        <option value="LTR">
                                                                                            LTR
                                                                                        </option>
                                                                                        <option value="ML">
                                                                                            ML
                                                                                        </option>
                                                                                    </select>
                                                                                </td>
                                                                                <td className="cell2">
                                                                                    {
                                                                                        datainventarioSucursalFromCentralcopy[i]?
                                                                                        <span className="text-muted text-decoration-line-through">{datainventarioSucursalFromCentralcopy[i].descripcion}</span>
                                                                                        :null
                                                                                    }<br />
                                                                                    <textarea
                                                                                        type="text"
                                                                                        required={
                                                                                            true
                                                                                        }
                                                                                        disabled={type(
                                                                                            e.type
                                                                                        )}
                                                                                        className={
                                                                                            "form-control form-control-sm " +
                                                                                            (!e.descripcion
                                                                                                ? "invalid"
                                                                                                : null)
                                                                                        }
                                                                                        value={
                                                                                            !e.descripcion
                                                                                                ? ""
                                                                                                : e.descripcion
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                e.target.value.replace(
                                                                                                    "\n",
                                                                                                    ""
                                                                                                ),
                                                                                                i,
                                                                                                e.id,
                                                                                                "changeInput",
                                                                                                "descripcion"
                                                                                            )
                                                                                        }
                                                                                        placeholder="descripcion..."
                                                                                    ></textarea>
                                                                                </td>
                                                                                <td className="cell05">
                                                                                    {
                                                                                        datainventarioSucursalFromCentralcopy[i]?
                                                                                        <span className="text-muted text-decoration-line-through">{datainventarioSucursalFromCentralcopy[i].cantidad}</span>
                                                                                        :null
                                                                                    }<br />
                                                                                    <input
                                                                                        type="text"
                                                                                        required={
                                                                                            true
                                                                                        }
                                                                                        disabled={type(
                                                                                            e.type
                                                                                        )}
                                                                                        className={
                                                                                            "form-control form-control-sm " +
                                                                                            (!e.cantidad
                                                                                                ? "invalid"
                                                                                                : null)
                                                                                        }
                                                                                        value={
                                                                                            !e.cantidad
                                                                                                ? ""
                                                                                                : e.cantidad
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                number(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                ),
                                                                                                i,
                                                                                                e.id,
                                                                                                "changeInput",
                                                                                                "cantidad"
                                                                                            )
                                                                                        }
                                                                                        placeholder="cantidad..."
                                                                                    />
                                                                                </td>
                                                                                <td className="cell1">
                                                                                    {
                                                                                        datainventarioSucursalFromCentralcopy[i]?
                                                                                        <span className="text-muted text-decoration-line-through">{datainventarioSucursalFromCentralcopy[i].precio_base}</span>
                                                                                        :null
                                                                                    }<br />
                                                                                    <input
                                                                                        type="text"
                                                                                        disabled={type(
                                                                                            e.type
                                                                                        )}
                                                                                        className={
                                                                                            "form-control form-control-sm " +
                                                                                            (!e.precio_base
                                                                                                ? "invalid"
                                                                                                : null)
                                                                                        }
                                                                                        value={
                                                                                            !e.precio_base
                                                                                                ? ""
                                                                                                : e.precio_base
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                number(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                ),
                                                                                                i,
                                                                                                e.id,
                                                                                                "changeInput",
                                                                                                "precio_base"
                                                                                            )
                                                                                        }
                                                                                        placeholder="Base..."
                                                                                    />
                                                                                </td>
                                                                                <td className="cell15">
                                                                                    {
                                                                                        datainventarioSucursalFromCentralcopy[i]?
                                                                                        <span className="text-muted text-decoration-line-through">{datainventarioSucursalFromCentralcopy[i].precio}</span>
                                                                                        :null
                                                                                    }<br />
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="text"
                                                                                            required={
                                                                                                true
                                                                                            }
                                                                                            disabled={type(
                                                                                                e.type
                                                                                            )}
                                                                                            className={
                                                                                                "form-control form-control-sm " +
                                                                                                (!e.precio
                                                                                                    ? "invalid"
                                                                                                    : null)
                                                                                            }
                                                                                            value={
                                                                                                !e.precio
                                                                                                    ? ""
                                                                                                    : e.precio
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                changeInventarioFromSucursalCentral(
                                                                                                    number(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value
                                                                                                    ),
                                                                                                    i,
                                                                                                    e.id,
                                                                                                    "changeInput",
                                                                                                    "precio"
                                                                                                )
                                                                                            }
                                                                                            placeholder="Venta..."
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                                <td className="cell15">
                                                                                    {
                                                                                        datainventarioSucursalFromCentralcopy[i]?
                                                                                        <span className="text-muted text-decoration-line-through">{datainventarioSucursalFromCentralcopy[i].id_categoria}</span>
                                                                                        :null
                                                                                    } /

                                                                                    {
                                                                                        datainventarioSucursalFromCentralcopy[i]?
                                                                                        <span className="text-muted text-decoration-line-through">{datainventarioSucursalFromCentralcopy[i].id_proveedor}</span>
                                                                                        :null
                                                                                    }<br />
                                                                                    <select
                                                                                        required={
                                                                                            true
                                                                                        }
                                                                                        disabled={type(
                                                                                            e.type
                                                                                        )}
                                                                                        className={
                                                                                            "form-control form-control-sm " +
                                                                                            (!e.id_categoria
                                                                                                ? "invalid"
                                                                                                : null)
                                                                                        }
                                                                                        value={
                                                                                            !e.id_categoria
                                                                                                ? ""
                                                                                                : e.id_categoria
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                e.id,
                                                                                                "changeInput",
                                                                                                "id_categoria"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <option value="">
                                                                                            --Select--
                                                                                        </option>
                                                                                        {categorias.map(
                                                                                            (
                                                                                                e
                                                                                            ) => (
                                                                                                <option
                                                                                                    value={
                                                                                                        e.id
                                                                                                    }
                                                                                                    key={
                                                                                                        e.id
                                                                                                    }
                                                                                                > 
                                                                                                    {
                                                                                                        e.id
                                                                                                    }-
                                                                                                    {
                                                                                                        e.descripcion
                                                                                                    }
                                                                                                </option>
                                                                                            )
                                                                                        )}
                                                                                    </select>
                                                                                    <br />
                                                                                    <select
                                                                                        required={
                                                                                            true
                                                                                        }
                                                                                        disabled={type(
                                                                                            e.type
                                                                                        )}
                                                                                        className={
                                                                                            "form-control form-control-sm " +
                                                                                            (!e.id_proveedor
                                                                                                ? "invalid"
                                                                                                : null)
                                                                                        }
                                                                                        value={
                                                                                            !e.id_proveedor
                                                                                                ? ""
                                                                                                : e.id_proveedor
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                                i,
                                                                                                e.id,
                                                                                                "changeInput",
                                                                                                "id_proveedor"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <option value="">
                                                                                            --Select--
                                                                                        </option>
                                                                                        {proveedoresList.map(
                                                                                            (
                                                                                                e
                                                                                            ) => (
                                                                                                <option
                                                                                                    value={
                                                                                                        e.id
                                                                                                    }
                                                                                                    key={
                                                                                                        e.id
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        e.id
                                                                                                    }-
                                                                                                    {
                                                                                                        e.descripcion
                                                                                                    }
                                                                                                </option>
                                                                                            )
                                                                                        )}
                                                                                    </select>
                                                                                </td>
                                                                                <td className="cell05">
                                                                                    {
                                                                                        datainventarioSucursalFromCentralcopy[i]?
                                                                                        <span className="text-muted text-decoration-line-through">{datainventarioSucursalFromCentralcopy[i].iva}</span>
                                                                                        :null
                                                                                    }<br />
                                                                                    <input
                                                                                        type="text"
                                                                                        disabled={type(
                                                                                            e.type
                                                                                        )}
                                                                                        className="form-control form-control-sm"
                                                                                        value={
                                                                                            !e.iva
                                                                                                ? ""
                                                                                                : e.iva
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                number(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                    2
                                                                                                ),
                                                                                                i,
                                                                                                e.id,
                                                                                                "changeInput",
                                                                                                "iva"
                                                                                            )
                                                                                        }
                                                                                        placeholder="iva..."
                                                                                    />
                                                                                </td>
                                                                            </>
                                                                        )}
                                                                        <td className="cell1">
                                                                            <div className="d-flex justify-content-between">
                                                                                {!e.type ? (
                                                                                    <>
                                                                                        <span
                                                                                            className="btn-sm btn btn-danger"
                                                                                            onClick={() =>
                                                                                                changeInventarioFromSucursalCentral(
                                                                                                    null,
                                                                                                    i,
                                                                                                    e.id,
                                                                                                    "delMode"
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <i className="fa fa-trash"></i>
                                                                                        </span>
                                                                                        <span
                                                                                            className="btn-sm btn btn-warning"
                                                                                            onClick={() =>
                                                                                                changeInventarioFromSucursalCentral(
                                                                                                    null,
                                                                                                    i,
                                                                                                    e.id,
                                                                                                    "update"
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <i className="fa fa-pencil"></i>
                                                                                        </span>
                                                                                    </>
                                                                                ) : null}
                                                                                {e.type ===
                                                                                    "new" ? (
                                                                                    <span
                                                                                        className="btn-sm btn btn-danger"
                                                                                        onClick={() =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                null,
                                                                                                i,
                                                                                                e.id,
                                                                                                "delNew"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <i className="fa fa-times"></i>
                                                                                    </span>
                                                                                ) : null}
                                                                                {e.type ===
                                                                                    "update" ? (
                                                                                    <span
                                                                                        className="btn-sm btn btn-warning"
                                                                                        onClick={() =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                null,
                                                                                                i,
                                                                                                e.id,
                                                                                                "delModeUpdateDelete"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <i className="fa fa-times"></i>
                                                                                    </span>
                                                                                ) : null}
                                                                                {e.type ===
                                                                                    "delete" ? (
                                                                                    <span
                                                                                        className="btn-sm btn btn-danger"
                                                                                        onClick={() =>
                                                                                            changeInventarioFromSucursalCentral(
                                                                                                null,
                                                                                                i,
                                                                                                e.id,
                                                                                                "delModeUpdateDelete"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <i className="fa fa-arrow-left"></i>
                                                                                    </span>
                                                                                ) : null}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={7}>
                                                                    Sin resultados
                                                                </td>
                                                            </tr>
                                                        )
                                                        : null
                                                }
                                            </tbody>
                                        </table>

                                    </form>
                                </>
                            ) : null}
                            {subviewpanelcentroacopio ==
                                "cierrespanelcentroacopio" ? (
                                <>
                                    <h1>
                                        Cierres{" "}
                                        <button
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() =>
                                                getInventarioSucursalFromCentral(
                                                    "cierrespanelcentroacopio"
                                                )
                                            }
                                        >
                                            Actualizar
                                        </button>
                                    </h1>
                                </>
                            ) : null}
                            {subviewpanelcentroacopio ==
                                "gastospanelcentroacopio" ? (
                                <>
                                    <h1>
                                        Gastos{" "}
                                        <button
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() =>
                                                getInventarioSucursalFromCentral(
                                                    "gastospanelcentroacopio"
                                                )
                                            }
                                        >
                                            Actualizar
                                        </button>
                                    </h1>
                                </>
                            ) : null}
                            {subviewpanelcentroacopio ==
                                "estadisticaspanelcentroacopio" ? (
                                <>
                                    <h1>
                                        Estadísticas{" "}
                                        <button
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() =>
                                                getInventarioSucursalFromCentral(
                                                    "estadisticaspanelcentroacopio"
                                                )
                                            }
                                        >
                                            Actualizar
                                        </button>
                                    </h1>
                                </>
                            ) : null}
                            {subviewpanelcentroacopio ==
                                "fallaspanelcentroacopio" ? (
                                <>
                                    <h1>
                                        Fallas{" "}
                                        <button
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() =>
                                                getInventarioSucursalFromCentral(
                                                    "fallaspanelcentroacopio"
                                                )
                                            }
                                        >
                                            Actualizar
                                        </button>
                                    </h1>
                                </>
                            ) : null}

                            {subviewpanelcentroacopio ==
                                "diadeventapanelcentroacopio" ? (
                                <>
                                    <h1>
                                        Día de Venta{" "}
                                        <button
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() =>
                                                getInventarioSucursalFromCentral(
                                                    "diadeventapanelcentroacopio"
                                                )
                                            }
                                        >
                                            Actualizar
                                        </button>
                                    </h1>
                                </>
                            ) : null}
                            {subviewpanelcentroacopio ==
                                "tasaventapanelcentroacopio" ? (
                                <>
                                    <h1>
                                        Tasas de Venta{" "}
                                        <button
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() =>
                                                getInventarioSucursalFromCentral(
                                                    "tasaventapanelcentroacopio"
                                                )
                                            }
                                        >
                                            Actualizar
                                        </button>
                                    </h1>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tipo</th>
                                                <th>Valor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasaventapanelcentroacopio.length
                                                ? tasaventapanelcentroacopio.map(
                                                    (e) => (
                                                        <tr
                                                            key={e.id}
                                                            className="pointer"
                                                            onClick={
                                                                setchangetasasucursal
                                                            }
                                                            data-type={e.tipo}
                                                        >
                                                            <th>{e.id}</th>
                                                            <th>
                                                                {e.tipo == 1
                                                                    ? "Bolivares"
                                                                    : "Pesos Colombianos"}
                                                            </th>
                                                            <th>{e.valor}</th>
                                                        </tr>
                                                    )
                                                )
                                                : null}
                                        </tbody>
                                    </table>
                                </>
                            ) : null}
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
