import { useEffect } from "react";
export default function ControlEfectivo({
    controlefecQ,    
    setcontrolefecQ,
    controlefecQDesde,    
    setcontrolefecQDesde,
    controlefecQHasta,    
    setcontrolefecQHasta,
    controlefecData,    
    setcontrolefecData,
    controlefecSelectGeneral,    
    setcontrolefecSelectGeneral,
    controlefecSelectUnitario,    
    setcontrolefecSelectUnitario,
    controlefecNewConcepto,    
    setcontrolefecNewConcepto,
    controlefecNewCategoria,    
    setcontrolefecNewCategoria,
    controlefecNewMonto,    
    setcontrolefecNewMonto,
    getControlEfec,    
    setgetControlEfec,
    setControlEfec,    
    setsetControlEfec,
    setcontrolefecQCategoria, 
    controlefecQCategoria,
    number,
    moneda,
    controlefecNewMontoMoneda,
    setcontrolefecNewMontoMoneda,
    
    categoriasCajas,
    setcategoriasCajas,
    getcatsCajas,
    delCaja,

    personalNomina,
    setpersonalNomina,
    getNomina,

    controlefecResponsable,
    setcontrolefecResponsable,
    controlefecAsignar,
    setcontrolefecAsignar,
}){ 

    useEffect(()=>{
        getcatsCajas()
        getNomina()
    },[]);
    
    useEffect(()=>{
        getControlEfec()
        setcontrolefecQCategoria("")

    },[
        controlefecSelectGeneral,
        controlefecQDesde,
        controlefecQHasta,
    ])


    let catselect = categoriasCajas.filter(e=>e.indice==controlefecNewCategoria).length?categoriasCajas.filter(e=>e.indice==controlefecNewCategoria)[0].nombre:""

    
    
    const getCatFun = (id_cat) => {
        let catfilter = categoriasCajas.filter(e=>e.indice==id_cat)
        if (catfilter.length) {
            return catfilter[0].nombre
        }

        return "ERROR"
    }
    return (
        <div className="container-fluid">
            <div className="btn-group mb-3">
              <button className={("btn ") + (controlefecSelectGeneral == 1 ?"btn-success":"btn-outline-success")} onClick={()=>setcontrolefecSelectGeneral(1)}>Caja Fuerte</button> 
              <button className={("btn ") + (controlefecSelectGeneral == 0 ? "btn-success" : "btn-outline-success")} onClick={() => setcontrolefecSelectGeneral(0)}>Caja Chica</button>
            </div>

            <div className="mb-3">
                <form className="input-group mb-3" onSubmit={setControlEfec}>
                    <div className="input-group-prepend">
                        <span className="input-group-text">Nuevo Movimiento</span>
                    </div>


                    {catselect.indexOf("NOMINA")===-1?
                        <input type="text" className="form-control"
                            placeholder="Descripción..."
                            value={controlefecNewConcepto} 
                            onChange={e => setcontrolefecNewConcepto(e.target.value)} />
                    :
                        <select type="text" className="form-control"
                            placeholder="Descripción..."
                            value={controlefecNewConcepto} 
                            onChange={e => setcontrolefecNewConcepto(e.target.value)} >
                                <option value="">-</option>

                                {personalNomina.map(e=>
                                    <option key={e.id} value={"PAGO="+e.nominacedula}>{"PAGO="+e.nominacedula}</option>      
                                )}
                        </select>
                    }
                    <input type="text" className="form-control"
                        placeholder="Monto..."
                        value={controlefecNewMonto}
                        onChange={e => setcontrolefecNewMonto(number(e.target.value))} />
                    <select
                        className="form-control"
                        value={controlefecNewMontoMoneda}
                        onChange={e => setcontrolefecNewMontoMoneda(e.target.value)}>
                        <option value="">MONEDA</option>
                            
                        <option value="dolar">DOLAR</option>
                        <option value="peso">PESO</option>
                        <option value="bs">BS</option>
                        <option value="euro">EURO</option>
                    </select>
                    <select
                        className="form-control"
                        value={controlefecNewCategoria}
                        onChange={e => setcontrolefecNewCategoria(e.target.value)}>
                        <option value="">CATEGORÍA (NO COLOCAR CUALQUIER COSA)</option>

                        {categoriasCajas.filter(e=>e.indice!=1&&e.indice!=2&&e.tipo==controlefecSelectGeneral).map((e,i)=>
                            <option key={i} value={e.indice}>{e.nombre}</option>
                        )}
                        
                    </select>
                    <select
                        className="form-control"
                        value={controlefecAsignar}
                        onChange={e => setcontrolefecAsignar(e.target.value)}>
                        <option value="">ASIGNAR A</option>

                        {categoriasCajas.filter(e=>e.indice!=1&&e.indice!=2&&e.tipo==3).map((e,i)=>
                            <option key={i} value={e.indice}>{e.nombre}</option>
                        )}
                        
                    </select>
                    <select
                        className="form-control"
                        value={controlefecResponsable}
                        onChange={e => setcontrolefecResponsable(e.target.value)}>
                        <option value="">RESPONSABLE DIRECTO</option>

                        {categoriasCajas.filter(e=>e.indice!=1&&e.indice!=2&&e.tipo==2).map((e,i)=>
                            <option key={i} value={e.indice}>{e.nombre}</option>
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
                    {categoriasCajas.filter(e=>e.tipo==controlefecSelectGeneral).map((e,i)=>
                        <option key={i} value={e.indice}>{e.nombre}</option>
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
                        <th className="text-right">Monto DOLAR</th>
                        <th className="">Balance DOLAR</th>
                        <th className="text-right">Monto BS</th>
                        <th className="">Balance BS</th>
                        <th className="text-right">Monto PESO</th>
                        <th className="">Balance PESO</th>

                        <th className="text-right">Monto EURO</th>
                        <th className="">Balance EURO</th>
                        <th>Categoría</th>
                        <th>ASIGNAR</th>
                        <th>RESPONSABLE</th>
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
                            
                            <td className={(e.montodolar<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.montodolar)}</td>
                            <td className={("")}>{moneda(e.dolarbalance)}</td>
                            
                            <td className={(e.montobs<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.montobs)}</td>
                            <td className={("")}>{moneda(e.bsbalance)}</td>
                            
                            <td className={(e.montopeso<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.montopeso)}</td>
                            <td className={("")}>{moneda(e.pesobalance)}</td>

                            <td className={(e.montoeuro<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.montoeuro)}</td>
                            <td className={("")}>{moneda(e.eurobalance)}</td>
                            <td className="">{getCatFun(e.categoria)}</td>
                            <td className="">{getCatFun(e.asignar)}</td>
                            <td className="">{getCatFun(e.responsable)}</td>


                            <td><i className="fa fa-times text-danger" onClick={()=>delCaja(e.id)}></i></td>
                            
                        </tr>)
                    :null:null:null}
                </tbody>
            </table>
        </div>
    )
}