export default function InventarioNovedades({
    inpInvbarras,
    setinpInvbarras,
    inpInvalterno,
    setinpInvalterno,
    inpInvdescripcion,
    setinpInvdescripcion,
    inpInvcantidad,
    setinpInvcantidad,
    inpInvunidad,
    setinpInvunidad,
    inpInvbase,
    setinpInvbase,
    inpInvventa,
    setinpInvventa,
    inpInvcategoria,
    setinpInvcategoria,
    inpInviva,
    setinpInviva,
    inpInvid_proveedor,
    setinpInvid_proveedor,

    guardarNuevoProducto,
    categorias,
    proveedoresList,
    number,
}){
    return(
        <div className="container">
            <form onSubmit={event=>{guardarNuevoProducto();event.preventDefault()}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="cell1 pointer"><span >C. Alterno</span></th>
                            <th className="cell1 pointer"><span >C. Barras</span></th>
                            <th className="cell05 pointer"><span >Unidad</span></th>
                            <th className="cell2 pointer"><span >Descripción</span></th>
                            <th className="cell05 pointer"><span >Ct.</span>/ <span >Inventario</span></th>
                            <th className="cell1 pointer"><span >Base</span></th>
                            <th className="cell15 pointer">Venta</th>
                            <th className="cell15 pointer" >
                                <span>Categoría</span>
                                <br/>
                                <span>Proveedor</span>
                            </th>
                            <th className="cell05 pointer"><span >IVA</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="cell1">
                                <input type="text"
                                    className="form-control form-control-sm"
                                    value={inpInvalterno}
                                    onChange={e => setinpInvalterno(e.target.value)}
                                    placeholder="codigo_proveedor..." />

                            </td>
                            <td className="cell1">
                                <input type="text"
                                    className={("form-control form-control-sm ")}
                                    value={inpInvbarras}
                                    onChange={e => setinpInvbarras(e.target.value)}
                                    placeholder="codigo_barras..." />

                            </td>
                            <td className="cell05">
                                <select
                                    className={("form-control form-control-sm ")}
                                    value={inpInvunidad}
                                    onChange={e => setinpInvunidad(e.target.value)}
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
                                    className={("form-control form-control-sm ")}
                                    value={inpInvdescripcion}
                                    onChange={e => setinpInvdescripcion(e.target.value)}
                                    placeholder="descripcion..."></textarea>

                            </td>
                            <td className="cell05">
                                <input type="text"
                                    className={("form-control form-control-sm ")}
                                    value={inpInvcantidad}
                                    onChange={e => setinpInvcantidad(number(e.target.value))}
                                    placeholder="cantidad..." />
                            </td>
                            <td className="cell1">
                                <input type="text"
                                    className={("form-control form-control-sm ")}
                                    value={inpInvbase}
                                    onChange={e => setinpInvbase(number(e.target.value))}
                                    placeholder="Base..." />
                            </td>
                            <td className="cell15">
                                <div className="input-group">
                                    <input type="text"
                                        className={("form-control form-control-sm ")}
                                        value={inpInvventa}
                                        onChange={e => setinpInvventa(number(e.target.value))}
                                        placeholder="Venta..." />
                                    
                                </div>
                            </td>
                            <td className="cell15">
                                <select
                                    className={("form-control form-control-sm ")}
                                    value={inpInvcategoria}
                                    onChange={e => setinpInvcategoria(e.target.value)}
                                >
                                    <option value="">--Select--</option>
                                    {categorias.map(e => <option value={e.id} key={e.id}>{e.descripcion}</option>)}
                                    
                                </select>
                                <br/>
                                <select
                                    className={("form-control form-control-sm ")}
                                    value={inpInvid_proveedor}
                                    onChange={e => setinpInvid_proveedor(e.target.value)}
                                >
                                    <option value="">--Select--</option>
                                    {proveedoresList.map(e => <option value={e.id} key={e.id}>{e.descripcion}</option>)}
                                </select>
                            </td>
                            <td className="cell05">
                                <input type="text"
                                    className="form-control form-control-sm"
                                    value={inpInviva}
                                    onChange={e => setinpInviva(number(e.target.value,2))}
                                    placeholder="iva..." />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="text-center m-3">
                    <button className="btn btn-success">Reportar Novedad</button>
                </div>
            </form>
        </div>
    )
}