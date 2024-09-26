export default function Garantias({
    garantiasData,
    getGarantias,
    setqgarantia,
    qgarantia,
    garantiaorderCampo,
    setgarantiaorderCampo,
    garantiaorder,
    setgarantiaorder,
    garantiaEstado,
    setgarantiaEstado,
    setSalidaGarantias,
}){
    return <>
        <div className="container">
            <form className="input-group" onSubmit={event=>{
                event.preventDefault();
                getGarantias()
            }}>
               {/*  <select className="form-control" value={garantiaEstado} onChange={event=>setgarantiaEstado(event.target.value)}>
                    <option value="pendiente">PENDIENTE</option>
                    <option value="resuelta">RESUELTA</option>
                </select> */}
                <input type="text" placeholder="Buscar PRODUCTO..." className="form-control" value={qgarantia} onChange={event=>setqgarantia(event.target.value)} />
                <select className="form-control" value={garantiaorderCampo} onChange={event=>setgarantiaorderCampo(event.target.value)}>
                    <option value="sumpendiente">SUM PENDIENTE</option>
                    <option value="sumresuelta">SUM RESUELTA</option>
                </select>

                <select className="form-control" value={garantiaorder} onChange={event=>setgarantiaorder(event.target.value)}>
                    <option value="desc">DESC</option>
                    <option value="asc">ASC</option>
                </select>

                

                <button className="btn btn-success"><i className="fa fa-search"></i></button>
            </form>
            <table className="table">
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>BARRAS</td>
                        <td>ALTERNO</td>
                        <td>PRODUCTO</td>
                        <td>PENDIENTE</td>
                        <td>RESUELTA</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {garantiasData.map(e=>
                        <tr key={e.id}>
                            <th>{e.id_producto}</th>
                            <td>{e.producto.codigo_barras}</td>
                            <td>{e.producto.codigo_alterno}</td>
                            <td>{e.producto.descripcion}</td>
                            <td className="text-sinapsis">{e.sumpendiente}</td>
                            <td className="text-success">{e.sumresuelta}</td>
                            <td>
                                <button className="btn btn-sinapsis" onClick={()=>setSalidaGarantias(e.id_producto)}><i className="fa fa-paper-plane"></i></button> 
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </>
}