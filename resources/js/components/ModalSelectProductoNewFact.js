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
}){
    return (
        <div>
            <div className="text-center m-3">
                <i className="fa fa-times fs-2" onClick={()=>setView("SelectFacturasInventario")}></i>
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

                    </div>
                </div>
            </div>

            <table className="table">
                <tbody>
                    {productosInventario.length?productosInventario.map((e,i)=>
                        <tr key={e.id}>
                            <td className="cell1">{e.codigo_proveedor}</td>
                            <td className="cell1">{e.codigo_barras}</td>
                            <td className="cell05">{e.unidad}</td>
                            <td className="cell2">{e.descripcion}</td>
                            <td className="cell15">{e.categoria.descripcion} <br /> {e.proveedor.descripcion}</td>
                            <td className="cell05">{e.iva}</td>
                        </tr>
                    ):null}
                </tbody>
            </table>
                
        </div>
    )
}