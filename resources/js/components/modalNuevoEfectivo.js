import { useEffect, useState } from "react";
export default function ModalNuevoEfectivo({
    setopenModalNuevoEfectivo,
    setControlEfec,
    catselect,
    setcontrolefecNewConcepto,
    controlefecNewConcepto,
    controlefecNewMonto,
    setcontrolefecNewMonto,
    controlefecNewMontoMoneda,
    setcontrolefecNewMontoMoneda,
    controlefecNewCategoria,
    setcontrolefecNewCategoria,
    categoriasCajas,
    controlefecSelectGeneral,
    setcontrolefecSelectGeneral,
    moneda,
    number,
    personalNomina,
    allProveedoresCentral,
    alquileresData,
    getAllProveedores,
    getAlquileres,
    getNomina,
    sucursalesCentral,

    transferirpedidoa,
    settransferirpedidoa,
    dolar,
    peso,
    getSucursales={getSucursales},

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
    const [showtranscajatosucursal,setshowtranscajatosucursal] = useState(false)

    const [buscadorCategoria, setbuscadorCategoria] = useState("")
    const [buscadorAlquiler, setbuscadorAlquiler] = useState("")
    const [buscadorProveedor, setbuscadorProveedor] = useState("")
    const [buscadorPersonal, setbuscadorPersonal] = useState("")

    const [selectpersona, setselectpersona] = useState("")
    const [selectcargopersona, setselectcargopersona] = useState("")
    const [sumprestamos, setsumprestamos] = useState("")
    const [sumcreditos, setsumcreditos] = useState("")
    const [lastpago, setlastpago] = useState("")
    const [selectpersonapagosmespasado, setselectpersonapagosmespasado] = useState("")
    const [maxpagopersona, setmaxpagopersona] = useState(0)

    const [maxpagoalquiler, setmaxpagoalquiler] = useState(0)

   

    useEffect(()=>{
        setcontrolefecNewConcepto("")
    },[controlefecNewCategoria])

    
    return (
        <>
        {/* <div>
                <select
                    className="form-control"
                    value={controlefecAsignar}
                    onChange={e => setcontrolefecAsignar(e.target.value)}>
                    <option value="">ASIGNAR A</option>

                    {categoriasCajas.filter(e=>e.tipo==3).map((e,i)=>
                        <option key={i} value={e.id}>{e.nombre}</option>
                    )}
                    
                </select>
                <select
                    className="form-control"
                    value={controlefecResponsable}
                    onChange={e => setcontrolefecResponsable(e.target.value)}>
                    <option value="">RESPONSABLE DIRECTO</option>

                    {categoriasCajas.filter(e=>e.tipo==2).map((e,i)=>
                        <option key={i} value={e.id}>{e.nombre}</option>
                    )}
                    
                </select>
        </div> */}
			<section className={"modal-custom"}> 
				<div className="text-danger" onClick={()=>setopenModalNuevoEfectivo(false)}><span className="closeModal">&#10006;</span></div>
				<div className={"shadow modal-content-sm modal-cantidad text-dark "+(controlefecSelectGeneral==1?"bg-success-light":"bg-sinapsis-light")}>
					
                    <form onSubmit={event=>{event.preventDefault();setControlEfec()}}>
                        <div className="btn-group mb-3">
                            <button type="button" className={("btn ") + (controlefecSelectGeneral == 1 ?"btn-success":"btn-outline-success")} onClick={()=>setcontrolefecSelectGeneral(1)}>Caja Fuerte</button> 
                            <button type="button" className={("btn ") + (controlefecSelectGeneral == 0 ? "btn-sinapsis" : "btn-outline-sinapsis")} onClick={() => setcontrolefecSelectGeneral(0)}>Caja Chica</button>
                        </div>
                        <div className="mb-3 d-flex justify-content-center">
                            <div className={"btn btn-"+(controlefecSelectGeneral==1?"success":"sinapsis")+" btn-lg"}>NUEVO MOVIMIENTO <i className="fa fa-plus"></i></div>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="">
                                DEPARTAMENTO
                            </label>
                            <div className="input-group mb-2">
                                <select
                                    className="form-control"
                                    value={controlefecNewDepartamento}
                                    onChange={e => setcontrolefecNewDepartamento(e.target.value)}>
                                    <option value="">-DEPARTAMENTO-</option>

                                    {departamentosCajas.map((e,i)=>
                                        <option key={i} value={e.id}>{e.nombre}</option>
                                    )}
                                    
                                </select>
                                {/* <input type="text" className="form-control" placeholder="Buscar Categoria..." value={buscadorCategoria} onChange={e=>setbuscadorCategoria(e.target.value)} /> */}
                            </div>
                            

                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="">
                                CATEGORÍA
                            </label>
                            <div className="input-group mb-2">
                                <select
                                    className="form-control"
                                    value={controlefecNewCategoria}
                                    onChange={e => {
                                        setcontrolefecNewCategoria(e.target.value)
                                        setcontrolefecid_persona(null)
                                        setcontrolefecid_alquiler(null)
                                    }}>
                                    <option value="">CATEGORÍA</option>

                                    {categoriasCajas.filter(e=>e.tipo==controlefecSelectGeneral).filter(e=>e.showsucursal==1).map((e,i)=>
                                        "INGRESO DESDE CIERRE"!=e.nombre && 
                                        "CAJA FUERTE: INGRESO TRANSFERENCIA SUCURSAL"!=e.nombre && 
                                        "CAJA FUERTE: EGRESO TRANSFERENCIA SUCURSAL"!=e.nombre && 
                                        "CAJA FUERTE: INGRESO TRANSFERENCIA TRABAJADOR"!=e.nombre && 
                                        "CAJA FUERTE: EGRESO TRANSFERENCIA TRABAJADOR"!=e.nombre?
                                        <option key={i} value={e.id}>{e.nombre}</option>
                                        :null
                                    )}
                                    
                                </select>
                                {/* <input type="text" className="form-control" placeholder="Buscar Categoria..." value={buscadorCategoria} onChange={e=>setbuscadorCategoria(e.target.value)} /> */}
                            </div>
                            

                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="">
                                DESCRIPCIÓN
                            </label>
                           
                            <textarea type="text" className="form-control"
                                placeholder="Descripción..."
                                value={controlefecNewConcepto} 
                                onChange={e => setcontrolefecNewConcepto(e.target.value)}></textarea>
                        </div>
                       
                        {
                            
                            controlefecNewCategoria==29||controlefecNewCategoria==30||controlefecNewCategoria==70||controlefecNewCategoria==71||controlefecNewCategoria==92||controlefecNewCategoria==87||controlefecNewCategoria==86||controlefecNewCategoria==28||controlefecNewCategoria==61? 	
                            /* 
                            29	CAJA FUERTE: BONO PRODUCTIVIDAD 
                            30	CAJA FUERTE: NOMINA PRESTAMO
                            70	CAJA FUERTE: NOMINA BONO VACACIONAL
                            71	CAJA FUERTE: NOMINA LIQUIDACION
                            92	CAJA FUERTE: BONO DE RETIRO
                            87	CAJA FUERTE: BONO NAVIDEÑO
                            86	CAJA FUERTE: UTILIDADES (NOMINA)
                            28	CAJA FUERTE: PAGO A PRESTAMOS (NOMINA ABONO)
                            61	CAJA FUERTE: NOMINA PRESTACIONES SOCIALES
                            */
                                <div className="form-group mb-2">
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder="Buscar Personal..." value={buscadorPersonal} onChange={e=>setbuscadorPersonal(e.target.value)} />
                                        <button type="button" className={("btn btn-success")} onClick={()=>getNomina()}><i className="fa fa-search"></i></button>
                                    </div>

                                    <div className="card card-personal">

                                        <ul className="list-group">
                                            {personalNomina.filter(e=> !buscadorPersonal?true: (e.nominanombre.toLowerCase().indexOf(buscadorPersonal.toLowerCase())!==-1) ).map(e=>{
                                                return <li key={e.id} className={"list-group-item "+(controlefecid_persona==e.id?" active pointer ":"")} onClick={()=>{
                                                    setcontrolefecid_persona(e.id)
                                                    
                                                    setcontrolefecNewMonto(e.maxpagopersona>e.quincena?e.quincena:e.maxpagopersona)
                                                    setmaxpagopersona(e.maxpagopersona)

                                                    setsumprestamos(e.sumPrestamos)
                                                    setsumcreditos(e.sumCreditos)
                                                    setlastpago(e.mes)
                                                    setselectpersonapagosmespasado(e.mespasado)

                                                    setselectpersona(e.nominanombre)
                                                    
                                                    setselectcargopersona(e.cargo.cargosdescripcion)
                                                    

                                                    setcontrolefecNewMontoMoneda("dolar")
                                                }}>{e.nominacedula+" "+e.nominanombre}</li>

                                            })}
                                        </ul>
                                    </div>
                                </div>
                            :null
                        }
                        {    
                        
                            controlefecNewCategoria==34?/* CAJA FUERTE: ALQUILER */
                                <div className="form-group mb-2">
                                    <div className="input-group">
                                        <select type="text" className="form-control"
                                            value={controlefecid_alquiler} 
                                            onChange={e=>{
                                                let val = e.target.value
                                                setcontrolefecid_alquiler(val)
                                                let match = alquileresData.filter(e=>e.id==val)[0]
                                                
                                                setcontrolefecNewMonto(match.monto)
                                                setmaxpagoalquiler(match.monto)
                                                setcontrolefecNewMontoMoneda("dolar")

                                            }} >
                                                <option value="">-</option>
                                    
                                                {alquileresData.length?
                                                    alquileresData.map(e=><option value={e.id} key={e.id}>PAGO ALQUILER: {e.descripcion}</option>)
                                                :null}
                                    
                                        </select>
                                        {/* <input type="text" className="form-control" placeholder="Buscar Alquiler..." value={buscadorAlquiler} onChange={e=>setbuscadorAlquiler(e.target.value)} /> */}

                                        <button type="button" className={("btn btn-success")} onClick={()=>getAlquileres()}><i className="fa fa-search"></i></button>
                                    </div>
                                </div>
                            :null	
                        }

                        {    
                            
                            controlefecNewCategoria==40?/* CAJA FUERTE: PAGO PROVEEDOR */
                                <>
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder="Buscar proveedor..." value={buscadorProveedor} onChange={e=>setbuscadorProveedor(e.target.value)} />
                                        <button type="button" className={("btn btn-success")} onClick={()=>getAllProveedores()}><i className="fa fa-search"></i></button>
                                    </div>
                                    <div className="card card-personal">

                                        <ul className="list-group">
                                            {allProveedoresCentral.filter(e=>!buscadorProveedor?true: (e.descripcion.toLowerCase().indexOf(buscadorProveedor.toLowerCase())!==-1) ).map(e=>
                                                <li key={e.id} className={"list-group-item "+(controlefecNewConcepto==("PAGO PROVEEDOR="+e.descripcion+"="+e.id)?" active pointer ":"")} onClick={()=>{
                                                    let val = "PAGO PROVEEDOR="+e.descripcion+"="+e.id
                                                    setcontrolefecNewConcepto(val)
                                                    setcontrolefecid_proveedor(val)
                                                }}>{"PAGO PROVEEDOR="+e.descripcion}</li>
                                            )}
                                        </ul>
                                    </div>
                                </>
                            :null	
                        }


                        <div className="form-group mb-2">
                            <label htmlFor="">
                                MONTO
                            </label>
                            <div className="input-group w-50">

                                <div className="input-group-predend">
                                    <select
                                        className="form-control"
                                        value={controlefecNewMontoMoneda}
                                        onChange={e => {
                                            setcontrolefecNewMonto("")
                                            setcontrolefecNewMontoMoneda(e.target.value)
                                        }}>
                                        <option value="">-</option>
                                            
                                        <option value="dolar">DOLAR</option>
                                        <option value="peso">PESO</option>
                                        <option value="bs">BS</option>
                                        <option value="euro">EURO</option>
                                    </select>
                                </div>
                                <input type="text" className="form-control"
                                placeholder="Monto..."
                                value={controlefecNewMonto}
                                disabled={false}
                                onChange={e => {

                                    let val = (number(e.target.value))
                                    let factor = controlefecNewMontoMoneda=="dolar"?1:(controlefecNewMontoMoneda=="bs"?parseFloat(dolar):(controlefecNewMontoMoneda=="peso"?parseFloat(peso):1))

                                    if (controlefecNewCategoria==29) {
                                        if (parseFloat(val)>parseFloat(maxpagopersona*factor)) {
                                            val = ""
                                        }
                                    }

                                    if (controlefecNewCategoria==34) {
                                        if (parseFloat(val)>parseFloat(maxpagoalquiler*factor)) {
                                            val = ""
                                        }
                                    }
                                    setcontrolefecNewMonto(val)
                                }} />
                            </div>
                        </div>
                        {selectpersona?
                            <div className="p-3">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>NOMBRES Y APELLIDOS</th>
                                            <th>CARGO</th>
                                            <th>MÁXIMO A COBRAR ESTE MES</th>
                                            
                                            <th>PRESTAMOS TOTALES</th>
                                            <th>CRÉDITOS TOTALES</th>
                                            <th>PAGOS QUINCENA (MES ACTUAL)</th>
                                            <th>PAGOS QUINCENA (MES PASADO)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{selectpersona}</td>
                                            <td>{selectcargopersona}</td>
                                            <td className="text-success">{maxpagopersona}</td>
                                            <td className="text-danger fs-5">{moneda(sumprestamos)}</td>
                                            <td className="text-sinapsis fs-5">{moneda(sumcreditos)}</td>
                                            <td>{moneda(lastpago)}</td>
                                            <td>{moneda(selectpersonapagosmespasado)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        :null}
                        
                        {(showtranscajatosucursal || catselect.indexOf("TRANSFERENCIA TRABAJADOR")!=-1) && controlefecSelectGeneral==1?
                            catselect.indexOf("EFECTIVO ADICIONAL")==-1 && catselect.indexOf("NOMINA ABONO")==-1 && catselect.indexOf("TRASPASO A CAJA CHICA")==-1?<>
                                <div className="w-100 d-flex justify-content-center mt-3">
                                    <div className="input-group w-30">
                                        <select className="form-control" value={transferirpedidoa} onChange={e => settransferirpedidoa(e.target.value)}>
                                            <option value="">Transferir A</option>
                                            {sucursalesCentral.map(e =>
                                            <option value={e.id} key={e.id}>
                                                {e.nombre}
                                            </option>
                                            )}
                                        </select>
                                        <button className="btn btn-outline-success btn-sm" type="button" onClick={()=>setControlEfec(true)}><i className="fa fa-paper-plane"></i></button>

                                    </div>
                                </div>
                            </>:null
                        :
                            <div className="mb-3 d-flex justify-content-center">
                                <button className={"btn btn-"+(controlefecSelectGeneral==1?"success":"sinapsis")+" btn-lg"}>{(controlefecSelectGeneral==1?"SOLICITAR APROBACIÓN":"GUARDAR")} <i className="fa fa-paper-plane"></i></button>
                            </div>
                        }


                        <div className="text-center mt-5">
                            <button className={("btn ")+ (showtranscajatosucursal?"btn-sinapsis":"") + (" btn-sm")} type="button" onClick={()=>setshowtranscajatosucursal(!showtranscajatosucursal)}>Transferir a sucursal... <i className="fa fa-send"></i></button>
                        </div>

                    </form>
				</div>
			</section>
            <div className="overlay"></div>
        </>

    )
}