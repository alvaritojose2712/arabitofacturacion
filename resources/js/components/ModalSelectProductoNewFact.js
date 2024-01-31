export default function ModalSelectProductoNewFact({
    setView,
    Invnum,
    setInvnum,
    InvorderColumn,
    setInvorderColumn,
    InvorderBy,
    setInvorderBy,
    qBuscarInventario,
    setQBuscarInventario,
    productosInventario,
    inputBuscarInventario,
    changeInventario,
    categorias,
    proveedoresList,
    guardarNuevoProductoLote,
    addProductoFactInventario,
}){
    const type = type => {
        return !type || type === "delete" ? true : false
    }
    return (
        <div>
            <div className="text-center m-3">
                <i className="fa fa-times fs-2 text-danger" onClick={()=>setView("SelectFacturasInventario")}></i>
            </div>
            <div className="d-flex flex-fill">
                <div className="flex-fill">                    
                    <input type="text" ref={inputBuscarInventario} className="form-control" placeholder="Buscar...(esc)" onChange={e => setQBuscarInventario(e.target.value)} value={qBuscarInventario} />
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
                        <button className="btn btn-outline-success" onClick={() => changeInventario(null, null, null, "add")}>Nuevo (f2) <i className="fa fa-plus"></i></button>
                        <button className="btn btn-success text-light" onClick={guardarNuevoProductoLote}>Guardar (f1)</button>

                    </div>
                </div>
            </div>

            <table className="table">
                <tbody>
                    {productosInventario.length?productosInventario.map((e,i)=>
                        <tr key={i} className="pointer" onClick={()=>addProductoFactInventario(e.id)}>
                            {type(e.type)?
                             <>
                                    <td className="cell1">{e.codigo_proveedor}</td>
                                    <td className="cell1">{e.codigo_barras}</td>
                                    <td className="cell05">{e.unidad}</td>
                                    <td className="cell2">{e.descripcion}</td>
                                    <td className="cell15">{e.categoria?e.categoria.descripcion:null} <br /> {e.proveedor?e.proveedor.descripcion:null}</td>
                                    <td className="cell05">{e.iva}</td>
                             </>
                            :<>
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
                                    <td className="cell15">
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

                                    </td>
                            </>}
                        </tr>
                    ):null}
                </tbody>
            </table>
                
        </div>
    )
}