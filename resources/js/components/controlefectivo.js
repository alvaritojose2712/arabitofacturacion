export default function ControlEfectivo({
    controlefecQ,    setcontrolefecQ,
    controlefecQDesde,    setcontrolefecQDesde,
    controlefecQHasta,    setcontrolefecQHasta,
    controlefecData,    setcontrolefecData,
    controlefecSelectGeneral,    setcontrolefecSelectGeneral,
    controlefecSelectUnitario,    setcontrolefecSelectUnitario,
    controlefecNewConcepto,    setcontrolefecNewConcepto,
    controlefecNewCategoria,    setcontrolefecNewCategoria,
    controlefecNewMonto,    setcontrolefecNewMonto,
    getControlEfec,    setgetControlEfec,
    setControlEfec,    setsetControlEfec,
    setcontrolefecQCategoria, controlefecQCategoria,

    number,moneda
}){
    return (
        <div className="container">
            <div className="btn-group mb-3">
              <button className={("btn ") + (controlefecSelectGeneral == 0 ? "btn-success" : "btn-outline-success")} onClick={() => setcontrolefecSelectGeneral(0)}>Caja Chica</button>
              <button className={("btn ") + (controlefecSelectGeneral == 1 ?"btn-success":"btn-outline-success")} onClick={()=>setcontrolefecSelectGeneral(1)}>Caja Fuerte</button> 
            </div>

            <div className="mb-3">
                <form className="input-group mb-3" onSubmit={setControlEfec}>
                    <div className="input-group-prepend">
                        <span className="input-group-text">Nuevo Movimiento</span>
                    </div>

                    <input type="text" className="form-control"
                        placeholder="Descripción..."
                        value={controlefecNewConcepto} 
                        onChange={e => setcontrolefecNewConcepto(e.target.value)} />
                    <input type="text" className="form-control"
                        placeholder="Monto..."
                        value={controlefecNewMonto}
                        onChange={e => setcontrolefecNewMonto(number(e.target.value))} />
                    <select
                        className="form-control"
                        value={controlefecNewCategoria}
                        onChange={e => setcontrolefecNewCategoria(e.target.value)}>
                        {controlefecSelectGeneral==0?
                        <>
                            <option value="">-</option>
                            <option value="1">Caja Chica</option>
                            <option value="2">Caja Chica</option>
                        </>
                        :null}

                        {controlefecSelectGeneral==1?
                        <>
                            <option value="">-</option>
                            <option value="3">Caja Fuerte</option>
                            <option value="4">Caja Fuerte</option>
                        </>
                        :null}
                   
                    </select>
                    <button className="btn btn-outline-success"><i className="fa fa-paper-plane"></i></button>

                </form>
            </div>

            <div className="input-group mb-3">


                <input type="text" className="form-control"
                    placeholder="Buscar..."
                    onChange={e => setcontrolefecQ(e.target.value)}
                    value={controlefecQ} />
                <select
                    className="form-control"
                    onChange={e => setcontrolefecQCategoria(e.target.value)}
                    value={controlefecQCategoria}>
                    <option value="">Todos</option>
                    <option value="3">Funcionamiento</option>
                    <option value="2">Nómina</option>

                </select>

                <input type="date" className="form-control"
                    onChange={e => setcontrolefecQDesde(e.target.value)}
                    value={controlefecQDesde} />

                <input type="date" className="form-control"
                    onChange={e => setcontrolefecQHasta(e.target.value)}
                    value={controlefecQHasta} />

                <div className="input-group-append">
                    <span className="btn btn-outline-secondary" type="button" onClick={getControlEfec}><i className="fa fa-search"></i></span>
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>TIPO</th>
                        <th>FECHA</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th className="text-right">Monto</th>
                        <th className="text-right">Balance</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {controlefecData ? controlefecData.data ? controlefecData.data.length?
                        controlefecData.data.map(e=><tr key={e.id}>
                            <td className="">
                                <small className="text-muted">
                                    {e.tipo==0?"Caja Chica":null}
                                    {e.tipo==1?"Caja Fuerte":null}
                                </small>
                            </td>
                            <td className=""><small className="text-muted">{e.created_at}</small></td>
                            <td className="">{e.concepto}</td>
                            <td className="">{e.categoria}</td>
                            <td className={(e.monto<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.monto)}</td>
                            <td className="text-right">{moneda(e.balance)}</td>
                        </tr>)
                    :null:null:null}
                </tbody>
            </table>
        </div>
    )
}