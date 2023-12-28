import { useEffect } from "react";
import ModalNuevoEfectivo  from "./modalNuevoEfectivo";
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


    setopenModalNuevoEfectivo,
    openModalNuevoEfectivo,
    verificarMovPenControlEfec,
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

    const getCatGeneralFun = (id_cat) => {

        let catgeneralList = [
            {color:"#cc3300", nombre:"EGRESOS",},
            {color:"#3E7B00", nombre:"INGRESO",},
            {color:"#ff9900", nombre:"GASTO",},
            {color:"#A07800", nombre:"GASTO GENERAL",},
            {color:"#808080", nombre:"MOVIMIENTO EXTERNO",},
            {color:"#595959", nombre:"MOVIMIENTO NULO INTERNO",},
            {color:"#A8A805", nombre:"CAJA GENERAL IDEPENDIENTE",},
        ]
        let catfilter = categoriasCajas.filter(e=>e.indice==id_cat)
        if (catfilter.length) {
            return catgeneralList[catfilter[0].catgeneral]
        }

        return {color:"", nombre:""}

    }



    
    return (
        <div className="container-fluid">
            <div className="btn-group mb-3">
              <button className={("btn ") + (controlefecSelectGeneral == 1 ?"btn-success":"btn-outline-success")} onClick={()=>setcontrolefecSelectGeneral(1)}>Caja Fuerte</button> 
              <button className={("btn ") + (controlefecSelectGeneral == 0 ? "btn-sinapsis" : "btn-outline-sinapsis")} onClick={() => setcontrolefecSelectGeneral(0)}>Caja Chica</button>
            </div>

            <div className="mb-3 d-flex justify-content-center">
                <button className={"btn btn-outline-"+(controlefecSelectGeneral==1?"success":"sinapsis")+" btn-lg"} onClick={e=>setopenModalNuevoEfectivo(true)}>NUEVO MOVIMIENTO <i className="fa fa-plus"></i></button>
            </div>

            <div className="input-group mb-3">

                <button className="btn btn-warning" onClick={verificarMovPenControlEfec}>VERIFICAR PENDIENTES <i className="fa fa-clock-o"></i></button>
                <input type="text" className="form-control"
                    placeholder="Buscar..."
                    onChange={e => setcontrolefecQ(e.target.value)}
                    value={controlefecQ} />
                <select
                    className="form-control"
                    onChange={e => setcontrolefecQCategoria(e.target.value)}
                    value={controlefecQCategoria}>
                        <option value="">-BUSCAR-</option>
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
                        <th>FECHA</th>
                        <th>ESTATUS</th>
                        <th>CAT GENERAL</th>
                        <th className="w-20">CATEGORÍA</th>
                        <th>DESCRIPCIÓN</th>
                        <th className="text-right">Monto DOLAR</th>
                        <th className="">Balance DOLAR</th>
                        <th className="text-right">Monto BS</th>
                        <th className="">Balance BS</th>
                        <th className="text-right">Monto PESO</th>
                        <th className="">Balance PESO</th>

                        <th className="text-right">Monto EURO</th>
                        <th className="">Balance EURO</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {controlefecData ? controlefecData.data ? controlefecData.data.length?
                        controlefecData.data.map(e=><tr key={e.id}>
                            <td className=""><small className="text-muted">{e.created_at}</small></td>
                            <td className="">
                                <small className="text-muted">
                                    
                                    {e.estatus==0?<button className="btn btn-warning btn-sm">PENDIENTE <i className="fa fa-clock-o"></i></button>:null}
                                    {e.estatus==1?<button className="btn btn-success btn-sm">APROBADO <i className="fa fa-check"></i></button>:null}
                                </small>
                            </td>
                            <td className="">
                                <button className="btn w-100 btn-sm" style={{color:"white",fontWeight:"bold",backgroundColor:getCatGeneralFun(e.categoria).color}}>{getCatGeneralFun(e.categoria).nombre}</button>
                            </td>
                            <td className="w-20">{getCatFun(e.categoria)}</td>
                            <td className="">{e.concepto}</td>
                            
                            <td className={(e.montodolar<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.montodolar)}</td>
                            <td className={("")}>{moneda(e.dolarbalance)}</td>
                            
                            <td className={(e.montobs<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.montobs)}</td>
                            <td className={("")}>{moneda(e.bsbalance)}</td>
                            
                            <td className={(e.montopeso<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.montopeso)}</td>
                            <td className={("")}>{moneda(e.pesobalance)}</td>

                            <td className={(e.montoeuro<0? "text-danger": "text-success")+(" text-right")}>{moneda(e.montoeuro)}</td>
                            <td className={("")}>{moneda(e.eurobalance)}</td>


                            <td><i className="fa fa-times text-danger" onClick={()=>delCaja(e.id)}></i></td>
                            
                        </tr>)
                    :null:null:null}
                </tbody>
            </table>


            {openModalNuevoEfectivo&&
                <ModalNuevoEfectivo
                    setopenModalNuevoEfectivo={setopenModalNuevoEfectivo}
                    openModalNuevoEfectivo={openModalNuevoEfectivo}
                    setControlEfec={setControlEfec}
                    catselect={catselect}
                    setcontrolefecNewConcepto={setcontrolefecNewConcepto}
                    controlefecNewConcepto={controlefecNewConcepto}
                    controlefecNewMonto={controlefecNewMonto}
                    setcontrolefecNewMonto={setcontrolefecNewMonto}
                    controlefecNewMontoMoneda={controlefecNewMontoMoneda}
                    setcontrolefecNewMontoMoneda={setcontrolefecNewMontoMoneda}
                    controlefecNewCategoria={controlefecNewCategoria}
                    setcontrolefecNewCategoria={setcontrolefecNewCategoria}

                    personalNomina={personalNomina}
                    categoriasCajas={categoriasCajas}
                    controlefecSelectGeneral={controlefecSelectGeneral}
                    setcontrolefecSelectGeneral={setcontrolefecSelectGeneral }
                    moneda={moneda}
                    number={number}
                >

                </ModalNuevoEfectivo>
            }
        </div>
    )
}