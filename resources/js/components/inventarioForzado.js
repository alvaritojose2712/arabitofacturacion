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
        <div className="container-fluid">

            {showmodalhistoricoproducto&&<>
                <section className="modal-custom"> 
                    <div className="text-danger" onClick={()=>setshowmodalhistoricoproducto(false)}><span className="closeModal">&#10006;</span></div>
                    <div className="modal-content-sm">
                        <div className="input-group">
                            <select
                                className={("form-control form-control-sm ")}
                                value={usuariomodalhistoricoproducto}
                                onChange={e => setusuariomodalhistoricoproducto((e.target.value))}
                            >
                                <option value="">--Seleccione Usuario--</option>
                                {usuariosData.map(e => <option value={e.id} key={e.id}>{e.usuario}</option>)}
                                
                            </select>
                            <input type="date" className="form-control" value={fecha1modalhistoricoproducto} onChange={e=>setfecha1modalhistoricoproducto(e.target.value)}/>
                            <input type="date" className="form-control" value={fecha2modalhistoricoproducto} onChange={e=>setfecha2modalhistoricoproducto(e.target.value)}/>

                            <button className="btn btn-success" onClick={()=>getmovientoinventariounitario()}><i className="fa fa-search"></i></button>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Producto</th>
                                    <th>Origen</th>
                                    <th>Cantidad</th>
                                    <th>Ct. LuegoDeActualizar</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datamodalhistoricoproducto.length?datamodalhistoricoproducto.map(e=>
                                    <tr key={e.id}>
                                        <td>{e.usuario?e.usuario.usuario:null}</td>
                                        <td>{e.id_producto}</td>
                                        <td>{e.origen}</td>
                                        <th className={("h5 ")+(e.cantidad<0?"text-danger":"text-success")}>{e.cantidad>0?"+":null} {e.cantidad}</th>
                                        <th>{e.cantidadafter}</th>
                                        <th>{e.created_at}</th>
                                    </tr>    
                                ):null}
                            </tbody>
                        </table>
                    </div>
                </section>
                <div className="overlay"></div>
            </>}

                {replaceProducto?
                    <div className="m-2">
                        {replaceProducto.este?
                            <>
                                <button className="btn btn-outline-danger" onClick={()=>setreplaceProducto({poreste: null, este: null})}>{replaceProducto.este}</button>
                                <span className="fw-bold ms-1 me-1">></span>
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
            <div className="d-flex">
                <div className="d-flex flex-fill">
                    <div className="flex-fill">                    
                        {busquedaAvanazadaInv?<>
                            <div className="input-group">
                                <span className="input-group-text cell1">
                                    codigo_barras
                                </span>
                                <input type="text" className="form-control cell1" onChange={e => busqAvanzInputsFun(e, "codigo_barras")} value={busqAvanzInputs["codigo_barras"]} placeholder="codigo_barras" />
                                <span className="input-group-text cell1">
                                    codigo_proveedor
                                </span>
                                <input type="text" className="form-control cell1" onChange={e => busqAvanzInputsFun(e, "codigo_proveedor")} value={busqAvanzInputs["codigo_proveedor"]} placeholder="codigo_proveedor" />

                                <span className="input-group-text cell1">
                                    id_proveedor
                                </span>
                                
                                <select
                                className="form-control cell1"
                                onChange={e => busqAvanzInputsFun(e, "id_proveedor")} value={busqAvanzInputs["id_proveedor"]}
                                >
                                    <option value="">--Select--</option>
                                    {proveedoresList.map(e => <option value={e.id} key={e.id}>{e.descripcion}</option>)}
                                    
                                </select>

                                <span className="input-group-text cell1">
                                    id_categoria
                                </span>
                                
                                <select
                                className="form-control cell1"
                                onChange={e => busqAvanzInputsFun(e, "id_categoria")} value={busqAvanzInputs["id_categoria"]} 
                                >
                                    <option value="">--Select--</option>
                                    {categorias.map(e => <option value={e.id} key={e.id}>{e.descripcion}</option>)}

                                </select>

                                <span className="input-group-text cell1">
                                    unidad
                                </span>
                                <input type="text" className="form-control cell1" onChange={e => busqAvanzInputsFun(e, "unidad")} value={busqAvanzInputs["unidad"]} placeholder="unidad" />
                                
                            </div>
                            <div className="input-group">
                                <span className="input-group-text cell1">
                                    descripcion
                                </span>
                                <input type="text" className="form-control cell1" onChange={e => busqAvanzInputsFun(e, "descripcion")} value={busqAvanzInputs["descripcion"]} placeholder="descripcion" />
                                <span className="input-group-text cell1">
                                    iva
                                </span>
                                <input type="text" className="form-control cell1" onChange={e => busqAvanzInputsFun(e, "iva")} value={busqAvanzInputs["iva"]} placeholder="iva" />
                                <span className="input-group-text cell1">
                                    precio_base
                                </span>
                                <input type="text" className="form-control cell1" onChange={e => busqAvanzInputsFun(e, "precio_base")} value={busqAvanzInputs["precio_base"]} placeholder="precio_base" />
                                <span className="input-group-text cell1">
                                    precio
                                </span>
                                <input type="text" className="form-control cell1" onChange={e => busqAvanzInputsFun(e, "precio")} value={busqAvanzInputs["precio"]} placeholder="precio" />
                                <span className="input-group-text cell1">
                                    cantidad
                                </span>
                                <input type="text" className="form-control cell1" onChange={e => busqAvanzInputsFun(e, "cantidad")} value={busqAvanzInputs["cantidad"]} placeholder="cantidad" />

                               
                            </div>
                        </>:null}
                        {busquedaAvanazadaInv?null:
                            <input type="text" ref={inputBuscarInventario} className="form-control" placeholder="Buscar...(esc)" onChange={e => setQBuscarInventario(e.target.value)} value={qBuscarInventario} />
                        }
                    </div>
                    <div className="flex-fill">
                        
                        <div className="input-group">
                            <select value={Invnum} onChange={e => setInvnum(e.target.value)} className="form-control">
                                <option value="25">Num.25</option>
                                <option value="50">Num.50</option>
                                <option value="100">Num.100</option>
                                <option value="500">Num.500</option>
                                <option value="2000">Num.2000</option>
                                <option value="10000">Num.100000</option>
                            </select>
                            <select value={InvorderBy} onChange={e => setInvorderBy(e.target.value)} className="form-control">
                                <option value="asc">Orden Asc</option>
                                <option value="desc">Orden Desc</option>
                            </select>
                            
                            
                            

                            <button className="btn btn-warning ms-2" onClick={getPorcentajeInventario}>% INVENTARIADO <i className="fa fa-print"></i></button>
                            <button className="btn btn-warning ms-2" onClick={cleanInventario}>LIMPIAR <i className="fa fa-trash"></i></button>

                            <button className="btn btn-warning ms-2" onClick={reporteInventario}>Reporte General <i className="fa fa-print"></i></button>
                            {user.iscentral?
                                <button className="btn btn-outline-success" onClick={() => changeInventario(null, null, null, "add")}>Nuevo (f2) <i className="fa fa-plus"></i></button>
                            :null}
                            
                            {busquedaAvanazadaInv?
                                <button className="btn btn-success" onClick={buscarInvAvanz}><i className="fa fa-search"></i></button>
                            :null}
                            {user.iscentral?
                                <button className="btn btn-success text-light" onClick={guardarNuevoProductoLote}>Guardar (f1)</button>
                            :null}

                        </div>
                    </div>
                </div>
                
            </div>
            <a href="#" onClick={() => setbusquedaAvanazadaInv(!busquedaAvanazadaInv)}>Búsqueda {busquedaAvanazadaInv ? "sencilla" :"avanazada"}</a>
            
            <form ref={refsInpInvList} onSubmit={e=>e.preventDefault()}>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="cell05 pointer"><span onClick={() => setInvorderColumn("id")}>ID VINCULACION / ID</span></th>
                            <th className="cell1 pointer"><span onClick={() => setInvorderColumn("codigo_proveedor")}>C. Alterno</span></th>
                            <th className="cell1 pointer"><span onClick={() => setInvorderColumn("codigo_barras")}>C. Barras</span></th>
                            <th className="cell05 pointer"><span onClick={() => setInvorderColumn("unidad")}>Unidad</span></th>
                            <th className="cell2 pointer"><span onClick={() => setInvorderColumn("descripcion")}>Descripción</span></th>
                            <th className="cell05 pointer"><span onClick={() => setInvorderColumn("cantidad")}>Ct.</span>/ <span onClick={() => setInvorderColumn("push")}>Inventario</span></th>
                            <th className="cell1 pointer"><span onClick={() => setInvorderColumn("precio_base")}>Base</span></th>
                            <th className="cell15 pointer">
                                <span onClick={() => setInvorderColumn("precio")}>Venta </span>
                                <span className="btn btn-outline-success mr-1 btn-sm" onClick={setSameGanancia}>% general <i className="fa fa-coin"></i></span>
                            </th>
                            {/* <th className="cell15 pointer" >
                                <span onClick={() => setInvorderColumn("id_categoria")}>
                                    Categoría
                                </span>
                                <br />
                                    <select
                                        className=""
                                        value={sameCatValue}
                                        onChange={e=>setSameCat(e.target.value)}
                                    >
                                        <option value="">--Select--</option>
                                        {categorias.map(e => <option value={e.id} key={e.id}>{e.descripcion}</option>)}
                                        
                                    </select> 
                                <br/>
                                <span onClick={() => setInvorderColumn("id_proveedor")}>
                                    Proveedor
                                </span>
                                <br />
                                    <select
                                        className=""
                                        value={sameProValue}
                                        onChange={e => setSamePro(e.target.value)}
                                    >
                                        <option value="">--Select--</option>
                                        {proveedoresList.map(e => <option value={e.id} key={e.id}>{e.descripcion}</option>)}

                                    </select> 
                            </th>
                            <th className="cell05 pointer"><span onClick={() => setInvorderColumn("iva")}>IVA</span></th> */}
                            <th className="cell1"></th>

                        </tr>
                    </thead>
                    <tbody>
                        {productosInventario.length?productosInventario.map((e,i)=>
                            <tr key={i} className={("pointer ")+(e.push?"bg-success-super-light":"bg-danger-super-light")} onDoubleClick={() => {if(!e.push){changeInventario(null, i, e.id, "update")}}}>
                                <td className="cell05">
                                <span className="pointer" onClick={()=>selectRepleceProducto(e.id)}> <b>{e.id_vinculacion}</b> / {e.id}</span>
                                </td>
                                {type(e.type)?
                                <>
                                    <td className="cell1">{e.codigo_proveedor}</td>
                                    <td className="cell1">{e.codigo_barras}</td>
                                    <td className="cell05">{e.unidad}</td>
                                    <td className="cell2">{e.descripcion}</td>
                                    <th className="cell05">{e.cantidad} <i className="fa fa-eye text-success pointer" onClick={()=>openmodalhistoricoproducto(e.id)}></i>
                                        {/* <div className="btn-group-vertical">
                                            <span className="btn btn-outline-success btn-sm" 
                                            data-id={e.id} 
                                            onClick={setStockMin}>stockMin.{e.stockmin}</span>

                                            <span className="btn btn-outline-success btn-sm" 
                                            data-id={e.id} 
                                            onClick={setCtxBulto}>CtxPaquete.{e.bulto}</span>
                                        </div> */}
                                    </th>
                                    <td className="cell1">{e.precio_base}</td>
                                    <td className="cell15 text-success">
                                    {e.precio}<br/>
                                    <span className="text-success">
                                        {getPorGanacia(!e.precio?0:e.precio,!e.precio_base?0:e.precio_base)}
                                    </span>
                                       {/*  <br/>
                                        <div className="btn-group w-100">
                                            <span className="btn btn-outline-success btn-sm" 
                                            data-id={e.id} 
                                            data-type="p1" 
                                            onClick={setPrecioAlterno}>P1.<br/>{e.precio1}</span>

                                            <span className="btn btn-outline-success btn-sm" 
                                            data-id={e.id} 
                                            data-type="p2" 
                                            onClick={setPrecioAlterno}>P2.<br/>{e.precio2}</span>

                                            

                                        </div> */}
                                    </td>
                                    {/* <td className="cell15">{e.categoria?e.categoria.descripcion:null} <br /> {e.proveedor?e.proveedor.descripcion:null}</td>
                                    <td className="cell05">{e.iva}</td> */}
                                </>

                                :
                                <>
                                    <td className="cell1">
                                        <input type="text"
                                            disabled={type(e.type)} className="form-control form-control-sm"
                                            value={!e.codigo_proveedor?"":e.codigo_proveedor}
                                            onChange={e => changeInventario((e.target.value), i, e.id, "changeInput", "codigo_proveedor")}
                                            placeholder="codigo_proveedor..." />

                                    </td>
                                    <td className="cell1">
                                        <input type="text"
                                            required={true}
                                            disabled={type(e.type)} className={("form-control form-control-sm ")+(!e.codigo_barras?"invalid":null)}
                                            value={!e.codigo_barras?"":e.codigo_barras}
                                            onChange={e => changeInventario((e.target.value), i, e.id, "changeInput", "codigo_barras")}
                                            placeholder="codigo_barras..." />

                                    </td>
                                    <td className="cell05">
                                        <select
                                            disabled={type(e.type)}
                                            className={("form-control form-control-sm ")+(!e.unidad?"invalid":null)}
                                            value={!e.unidad?"":e.unidad}
                                            onChange={e => changeInventario((e.target.value), i, e.id, "changeInput", "unidad")}
                                        >
                                            <option value="">--Select--</option>
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
                                    <td className="cell2">
                                        <textarea type="text"
                                            required={true}
                                            disabled={type(e.type)} className={("form-control form-control-sm ")+(!e.descripcion?"invalid":null)}
                                            value={!e.descripcion?"":e.descripcion}
                                            onChange={e => changeInventario((e.target.value.replace("\n","")), i, e.id, "changeInput", "descripcion")}
                                            placeholder="descripcion..."></textarea>

                                    </td>
                                    <td className="cell05">
                                        <input type="text"
                                            required={true}
                                            disabled={type(e.type)} className={("form-control form-control-sm ")+(!e.cantidad?"invalid":null)}
                                            value={!e.cantidad?"":e.cantidad}
                                            onChange={e => changeInventario(number(e.target.value), i, e.id, "changeInput", "cantidad")}
                                            placeholder="cantidad..." />

                                            {e.push==1?
                                                <button className="btn btn-success" onClick={e => changeInventario(0, i, e.id, "changeInput", "push")}>Inventariado</button>
                                                :
                                                <button className="btn btn-secondary" onClick={e => changeInventario(1, i, e.id, "changeInput", "push")}>No inventariado</button>
                                            }

                                    </td>
                                    <td className="cell1">
                                        <input type="text"
                                            required={true}
                                            disabled={type(e.type)} className={("form-control form-control-sm ")+(!e.precio_base?"invalid":null)}
                                            value={!e.precio_base?"":e.precio_base}
                                            onChange={e => changeInventario(number(e.target.value), i, e.id, "changeInput", "precio_base")}
                                            placeholder="Base..." />



                                    </td>
                                    <td className="cell15">
                                        <div className="input-group">
                                            <input type="text"
                                                required={true}
                                                disabled={type(e.type)} className={("form-control form-control-sm ")+(!e.precio?"invalid":null)}
                                                value={!e.precio?"":e.precio}
                                                onChange={e => changeInventario(number(e.target.value), i, e.id, "changeInput", "precio")}
                                                placeholder="Venta..." />
                                            <span className="btn btn-sm" onClick={()=>setporcenganancia("list",e.precio_base,(precio)=>{
                                                    changeInventario(precio, i, e.id, "changeInput", "precio")
                                                })}>%</span>
                                        </div>
                                        <span className="text-success">
                                            {getPorGanacia(!e.precio?0:e.precio,!e.precio_base?0:e.precio_base)}
                                        </span>


                                    </td>
                                   {/*  <td className="cell15">
                                        <select
                                            required={true}
                                            disabled={type(e.type)} 
                                            className={("form-control form-control-sm ")+(!e.id_categoria?"invalid":null)}
                                            value={!e.id_categoria?"":e.id_categoria}
                                            onChange={e => changeInventario((e.target.value), i, e.id, "changeInput", "id_categoria")}
                                        >
                                            <option value="">--Select--</option>
                                            {categorias.map(e => <option value={e.id} key={e.id}>{e.descripcion}</option>)}
                                            
                                        </select>
                                        <br/>
                                        <select
                                            required={true}
                                            disabled={type(e.type)}
                                            className={("form-control form-control-sm ")+(!e.id_proveedor?"invalid":null)}
                                            value={!e.id_proveedor?"":e.id_proveedor}
                                            onChange={e => changeInventario((e.target.value), i, e.id, "changeInput", "id_proveedor")}
                                        >
                                            <option value="">--Select--</option>
                                            {proveedoresList.map(e => <option value={e.id} key={e.id}>{e.descripcion}</option>)}

                                        </select>
                                    </td>
                                    <td className="cell05">
                                        <input type="text"
                                            disabled={type(e.type)} className="form-control form-control-sm"
                                            value={!e.iva?"":e.iva}
                                            onChange={e => changeInventario(number(e.target.value,2), i, e.id, "changeInput", "iva")}
                                            placeholder="iva..." />

                                    </td> */}
                                </>
                                }
                                    <td className="cell1">
                                        <div className='d-flex justify-content-between'>

                                        {!e.push?
                                        <>
                                            {!e.type ?
                                                <>
                                                    <span className="btn-sm btn btn-danger" onClick={() => changeInventario(null, i, e.id, "delMode")}><i className="fa fa-trash"></i></span>
                                                    <span className="btn-sm btn btn-warning" onClick={() => changeInventario(null, i, e.id, "update")}><i className="fa fa-pencil"></i></span>
                                                </>
                                                : null}
                                            {e.type === "new" ?
                                                <span className="btn-sm btn btn-danger" onClick={() => changeInventario(null, i, e.id, "delNew")}><i className="fa fa-times"></i></span>
                                                : null}
                                            {e.type === "update" ?
                                                <span className="btn-sm btn btn-warning" onClick={() => changeInventario(null, i, e.id, "delModeUpdateDelete")}><i className="fa fa-times"></i></span>
                                                : null}
                                            {e.type === "delete" ?
                                                <span className="btn-sm btn btn-danger" onClick={() => changeInventario(null, i, e.id, "delModeUpdateDelete")}><i className="fa fa-arrow-left"></i></span>
                                                : null}
                                        </>
                                        :null}

                                            <span className="btn-sm btn btn-warning" onClick={() => printTickedPrecio(e.id)}><i className="fa fa-print"></i></span>

                                        </div>
                                    </td>
                                
                            </tr>
                        ):<tr>
                            <td colSpan={7}>Sin resultados</td>
                        </tr>}
                    </tbody>
                </table>
            </form>
        </div>    
    )
}