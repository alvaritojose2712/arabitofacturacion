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
        <div className="container py-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <form className="row g-3 align-items-center mb-4" onSubmit={event=>{
                        event.preventDefault();
                        getGarantias()
                    }}>
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="fa fa-search"></i>
                                </span>
                                <input 
                                    type="text" 
                                    placeholder="Buscar PRODUCTO..." 
                                    className="form-control" 
                                    value={qgarantia} 
                                    onChange={event=>setqgarantia(event.target.value)} 
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select" 
                                value={garantiaorderCampo} 
                                onChange={event=>setgarantiaorderCampo(event.target.value)}
                            >
                                <option value="sumpendiente">SUM PENDIENTE</option>
                                <option value="sumresuelta">SUM RESUELTA</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select 
                                className="form-select" 
                                value={garantiaorder} 
                                onChange={event=>setgarantiaorder(event.target.value)}
                            >
                                <option value="desc">DESC</option>
                                <option value="asc">ASC</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-success w-100">
                                <i className="fa fa-search me-2"></i> Buscar
                            </button>
                        </div>
                    </form>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>BARRAS</th>
                                    <th>ALTERNO</th>
                                    <th>PRODUCTO</th>
                                    <th className="text-center">PENDIENTE</th>
                                    <th className="text-center">RESUELTA</th>
                                    <th className="text-center">ACCIÓN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {garantiasData.map(e=>
                                    <tr key={e.id}>
                                        <td>{e.id_producto}</td>
                                        <td>{e.producto.codigo_barras}</td>
                                        <td>{e.producto.codigo_alterno}</td>
                                        <td>{e.producto.descripcion}</td>
                                        <td className="text-center text-sinapsis fw-bold">{e.sumpendiente}</td>
                                        <td className="text-center text-success fw-bold">{e.sumresuelta}</td>
                                        <td className="text-center">
                                            <button 
                                                className="btn btn-sinapsis btn-sm" 
                                                onClick={()=>setSalidaGarantias(e.id_producto)}
                                            >
                                                <i className="fa fa-paper-plane me-1"></i> Transferir
                                            </button> 
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </>
}