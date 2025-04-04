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
    verificarMovPenControlEfecTRANFTRABAJADOR,
    allProveedoresCentral,
    getAllProveedores,
    getAlquileres,
    alquileresData,
    sucursalesCentral,
    transferirpedidoa,
    settransferirpedidoa,
    getSucursales,
    reversarMovPendientes,
    aprobarRecepcionCaja,
    dolar,
    peso,
    departamentosCajas,
    controlefecNewDepartamento,
    setcontrolefecNewDepartamento,
    setcontrolefecid_persona,
    controlefecid_persona,
    setcontrolefecid_alquiler,
    controlefecid_alquiler,

    controlefecid_proveedor,
    setcontrolefecid_proveedor,
}){ 

    useEffect(()=>{
        getcatsCajas()
        getNomina()
        getAlquileres()
        getSucursales()
    },[]);
    
    useEffect(()=>{
        getControlEfec()
        setcontrolefecQCategoria("")

    },[
        controlefecSelectGeneral,
        controlefecQDesde,
        controlefecQHasta,
    ])


    let catselect = categoriasCajas.filter(e=>e.id==controlefecNewCategoria).length?categoriasCajas.filter(e=>e.id==controlefecNewCategoria)[0].nombre:""

    
    
    const getCatFun = (id_cat) => {
        let catfilter = categoriasCajas.filter(e=>e.id==id_cat)
        if (catfilter.length) {
            return catfilter[0].nombre
        }

        return "ERROR"
    }

    const getCatGeneralFun = (id_cat) => {

        let catgeneralList = [
            {color:"#ff0000", nombre:"PAGO A PROVEEDORES"}	,
            {color:"#00ff00", nombre:"INGRESO"}	,
            {color:"#ff9900", nombre:"GASTO"}	,
            {color:"#b45f06", nombre:"GASTO GENERAL"}	,
            {color:"#6F6A6A", nombre:"TRANSFERENCIA TRABAJADOR"}	,
            {color:"#434343", nombre:"MOVIMIENTO NULO INTERNO"}	,
            {color:"#fff2cc", nombre:"CAJA MATRIZ"}	,
            {color:"#b7b7b7", nombre:"FDI"}	,
            {color:"#6aa84f", nombre:"INGRESO EXTERNO"}	,
            {color:"#93c47d", nombre:"INGRESO INTERNO"}	,
            {color:"#999999", nombre:"TRANSFERENCIA EFECTIVO SUCURSAL"}	,
        ]

        let catfilter = categoriasCajas.filter(e=>e.id==id_cat)
        if (catfilter.length) {
            return catgeneralList[catfilter[0].catgeneral]
        }

        return {color:"", nombre:""}

    }
    const getSu = id_sucursal => {
        let fil = sucursalesCentral.filter(e=>e.id==id_sucursal)
        if (fil.length) {
            return fil[0].codigo
        }
        return "NO IDENTIFICADO"
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

                {/* <button className="btn btn-warning" onClick={verificarMovPenControlEfec}>VERIFICAR PENDIENTES <i className="fa fa-clock-o"></i></button>
                <button className="btn btn-outline-danger" onClick={reversarMovPendientes}>REVERSAR PENDIENTE <i className="fa fa-times"></i></button>
                 */}
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
                        <option key={i} value={e.id}>{e.nombre}</option>
                    )}

                </select>

                <input type="date" className="form-control"
                    onChange={e => setcontrolefecQDesde(e.target.value)}
                    value={controlefecQDesde} />

                <input type="date" className="form-control"
                    onChange={e => setcontrolefecQHasta(e.target.value)}
                    value={controlefecQHasta} />
               {/*  <button className="btn btn-warning" onClick={verificarMovPenControlEfecTRANFTRABAJADOR}>VERIFICAR TRANSFERENCIAS TRABAJADOR <i className="fa fa-clock-o"></i></button>
 */}


                <div className="input-group-append">
                    <span className="btn btn-outline-secondary" type="button" onClick={getControlEfec}><i className="fa fa-search"></i></span>
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>NUM</th>
                        <th>FECHA</th>
                        <th>ESTATUS</th>
                        <th>CAT GENERAL</th>
                        <th className="w-20">CATEGORÍA</th>
                        <th>DESCRIPCIÓN</th>
                        <th className="text-right">Monto DOLAR</th>
                        <th className="text-success fs-2"> {controlefecData ? controlefecData.data ? moneda(controlefecData[controlefecSelectGeneral==1?"fuerte":"chica"].dolarbalance):null:null} </th>
                        <th className="text-right">Monto BS</th>
                        <th className="text-success fs-2"> {controlefecData ? controlefecData.data ? moneda(controlefecData[controlefecSelectGeneral==1?"fuerte":"chica"].bsbalance):null:null} </th>
                        <th className="text-right">Monto PESO</th>
                        <th className="text-success fs-2"> {controlefecData ? controlefecData.data ? moneda(controlefecData[controlefecSelectGeneral==1?"fuerte":"chica"].pesobalance):null:null} </th>
                        <th className="text-right">Monto EURO</th>
                        <th className="text-success fs-2"> {controlefecData ? controlefecData.data ? moneda(controlefecData[controlefecSelectGeneral==1?"fuerte":"chica"].eurobalance):null:null} </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {controlefecData ? controlefecData.data ? controlefecData.data.length?
                        controlefecData.data.map((e,i)=><tr key={e.id}>
                            <td className=""><small className="text-muted">{i+1}</small></td>
                            <td className=""><small className="text-muted">{e.created_at}</small></td>
                            <td className="">
                                <small className="text-muted">
                                    
                                    {e.estatus==0?<button className="btn btn-warning btn-sm">PENDIENTE <i className="fa fa-clock-o"></i></button>:null}
                                    {e.estatus==1?<button className="btn btn-success btn-sm">APROBADO <i className="fa fa-check"></i></button>:null}
                                </small>
                            </td>
                            <td className="">
                                <button className="btn w-100 btn-sm" style={{color:"black",fontWeight:"bold",backgroundColor:getCatGeneralFun(e.categoria).color}}>{getCatGeneralFun(e.categoria).nombre}</button>
                            </td>
                            <td className="w-20">{getCatFun(e.categoria)}</td>
                            <td className="">
                                {e.concepto}
                                {e.id_sucursal_destino?
                                    <div>
                                        <b>TRANSFERIR A SUCURSAL ({getSu(e.id_sucursal_destino)})</b>
                                    </div>
                                :null}

                                {e.id_sucursal_emisora?
                                    <div>
                                        <b>RECIBES DE SUCURSAL ({getSu(e.id_sucursal_emisora)})</b>
                                    </div>
                                :null}
                                {e.id_sucursal_emisora&&e.estatus==0?
                                    <div>
                                        <div className="p-2">
                                            <div className="btn-group">
                                                <button className="btn btn-success" onClick={()=>aprobarRecepcionCaja(e.idincentralrecepcion,"aprobar")}>APROBAR RECEPCIÓN</button>
                                                <button className="btn btn-danger" onClick={()=>aprobarRecepcionCaja(e.idincentralrecepcion,"rechazar")}>RECHAZAR RECEPCIÓN</button>
                                            </div>
                                        </div>
                                    </div>
                                :null}


                                
                            </td>
                            
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
                    setcontrolefecid_persona={setcontrolefecid_persona}
                    controlefecid_persona={controlefecid_persona}
                    setcontrolefecid_alquiler={setcontrolefecid_alquiler}
                    controlefecid_alquiler={controlefecid_alquiler}

                    controlefecid_proveedor={controlefecid_proveedor}
                    setcontrolefecid_proveedor={setcontrolefecid_proveedor}

                    controlefecNewDepartamento={controlefecNewDepartamento}
                    setcontrolefecNewDepartamento={setcontrolefecNewDepartamento}
                    departamentosCajas={departamentosCajas}
                    dolar={dolar}
                    peso={peso}
                    getSucursales={getSucursales}
                    transferirpedidoa={transferirpedidoa}
                    settransferirpedidoa={settransferirpedidoa}
                    sucursalesCentral={sucursalesCentral}
                    allProveedoresCentral={allProveedoresCentral}
                    getAllProveedores={getAllProveedores}
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
                    alquileresData={alquileresData}
                    getAlquileres={getAlquileres}
                    getNomina={getNomina}
                >

                </ModalNuevoEfectivo>
            }
        </div>
    )
}