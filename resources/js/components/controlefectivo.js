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

    number,moneda,


    controlefecNewMontoMoneda,
    setcontrolefecNewMontoMoneda,
}){ 

    
    let catcaja = [
        {val:"", name: "", tipo:0 },
        {val:"", name: "", tipo:1 },
        {val:1, name: "INGRESO DESDE CIERRE", tipo:0 },
        {val:2, name: "INGRESO DESDE CIERRE", tipo:1 },
        {val:3, name: "Caja Chica: CAFE Y AZUCAR", tipo:0 },
        {val:4, name: "Caja Chica: LIMPIEZA Y MANTENIMIENTO", tipo:0 },
        {val:5, name: "Caja Fuerte: PAGO PROVEEDOR", tipo:1 },
        {val:6, name: "Caja Fuerte NOMINA", tipo:1 },
        {val:7, name: "Caja Fuerte ALQUILERES", tipo:1 },
    ]
    const getCatFun = (id_cat) => {
        let catfilter = catcaja.filter(e=>e.val==id_cat)
        if (catfilter.length) {
            return catfilter[0].name
        }

        return "ERROR"
    }
    return (
        <div className="container-fluid">
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
                        value={controlefecNewMontoMoneda}
                        onChange={e => setcontrolefecNewMontoMoneda(e.target.value)}>
                        <option value="">-</option>
                            
                        <option value="dolar">DOLAR</option>
                        <option value="peso">PESO</option>
                        <option value="bs">BS</option>
                    </select>
                    <select
                        className="form-control"
                        value={controlefecNewCategoria}
                        onChange={e => setcontrolefecNewCategoria(e.target.value)}>
                        {catcaja.filter(e=>e.val!=1&&e.val!=2&&e.tipo==controlefecSelectGeneral).map((e,i)=>
                            
                            <option key={i} value={e.val}>{e.name}</option>
                        )}
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
                    {catcaja.filter(e=>e.tipo==controlefecSelectGeneral).map((e,i)=>
                        <option key={i} value={e.val}>{e.name}</option>
                    )}

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
                        <th className="text-right">Monto DOLAR</th>
                        <th className="">Balance DOLAR</th>
                        <th className="text-right">Monto BS</th>
                        <th className="">Balance BS</th>
                        <th className="text-right">Monto PESO</th>
                        <th className="">Balance PESO</th>
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
                            <td className="">{getCatFun(e.categoria)}</td>
                            
                            <td className={(e.montodolar<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.montodolar)}</td>
                            <td className={("")}>{moneda(e.dolarbalance)}</td>
                            
                            <td className={(e.montobs<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.montobs)}</td>
                            <td className={("")}>{moneda(e.bsbalance)}</td>
                            
                            <td className={(e.montopeso<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.montopeso)}</td>
                            <td className={("")}>{moneda(e.pesobalance)}</td>
                            
                        </tr>)
                    :null:null:null}
                </tbody>
            </table>
        </div>
    )
}