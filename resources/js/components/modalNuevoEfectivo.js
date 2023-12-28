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
}){
    return (
        <>
        {/* <div>
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
        </div> */}
			<section className={"modal-custom"}> 
				<div className="text-danger" onClick={()=>setopenModalNuevoEfectivo(false)}><span className="closeModal">&#10006;</span></div>
				<div className={"shadow modal-content-sm modal-cantidad text-dark "+(controlefecSelectGeneral==1?"bg-success-light":"bg-sinapsis-light")}>
					
                    <form onSubmit={setControlEfec}>
                        <div className="btn-group mb-3">
                            <button type="button" className={("btn ") + (controlefecSelectGeneral == 1 ?"btn-success":"btn-outline-success")} onClick={()=>setcontrolefecSelectGeneral(1)}>Caja Fuerte</button> 
                            <button type="button" className={("btn ") + (controlefecSelectGeneral == 0 ? "btn-sinapsis" : "btn-outline-sinapsis")} onClick={() => setcontrolefecSelectGeneral(0)}>Caja Chica</button>
                        </div>
                        <div className="mb-3 d-flex justify-content-center">
                            <div className={"btn btn-"+(controlefecSelectGeneral==1?"success":"sinapsis")+" btn-lg"}>NUEVO MOVIMIENTO <i className="fa fa-plus"></i></div>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="">
                                DESCRIPCIÓN
                            </label>
                            {catselect.indexOf("NOMINA")===-1?
                                <textarea type="text" className="form-control"
                                    placeholder="Descripción..."
                                    value={controlefecNewConcepto} 
                                    onChange={e => setcontrolefecNewConcepto(e.target.value)}></textarea>
                            :
                                <select type="text" className="form-control"
                                    placeholder="Descripción..."
                                    value={controlefecNewConcepto} 
                                    onChange={event => {
                                        let val = event.target.value
                                        setcontrolefecNewConcepto(val)

                                        let matchcedula = val.split("=")[1]
                                        let match = personalNomina.filter(nomina=>nomina.nominacedula==matchcedula)[0]
                                        setcontrolefecNewMonto(match.cargo.cargossueldo)
                                        setcontrolefecNewMontoMoneda("dolar")
                                    }} >
                                        <option value="">-</option>

                                        {personalNomina.map(e=>
                                            <option key={e.id} value={"PAGO="+e.nominacedula+"="+e.nominanombre}>{"PAGO="+e.nominacedula+"="+e.nominanombre}</option>      
                                        )}
                                </select>
                            }
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="">
                                MONTO
                            </label>
                            <div className="input-group w-50">
                                {catselect.indexOf("NOMINA")===-1?
                                    <>
                                        <input type="text" className="form-control"
                                        placeholder="Monto..."
                                        value={controlefecNewMonto}
                                        onChange={e => setcontrolefecNewMonto(number(e.target.value))} />

                                        <div className="input-group-predend">
                                            <select
                                                className="form-control"
                                                value={controlefecNewMontoMoneda}
                                                onChange={e => setcontrolefecNewMontoMoneda(e.target.value)}>
                                                <option value="">-</option>
                                                    
                                                <option value="dolar">DOLAR</option>
                                                <option value="peso">PESO</option>
                                                <option value="bs">BS</option>
                                                <option value="euro">EURO</option>
                                            </select>
                                        </div>
                                    </>
                                :
                                <>
                                    <input type="text" className="form-control"
                                    placeholder="Monto..."
                                    value={controlefecNewMonto}
                                    disabled/>

                                    <div className="input-group-predend">
                                        <select
                                            className="form-control"
                                            value={controlefecNewMontoMoneda}
                                            disabled>
                                            <option value="dolar">DOLAR</option>
                                        </select>
                                    </div>
                                </>
                                }
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="">
                                CATEGORÍA
                            </label>
                            <select
                                className="form-control"
                                value={controlefecNewCategoria}
                                onChange={e => setcontrolefecNewCategoria(e.target.value)}>
                                <option value="">CATEGORÍA (NO COLOCAR CUALQUIER COSA)</option>

                                {categoriasCajas.filter(e=>e.indice!=1&&e.indice!=2&&e.tipo==controlefecSelectGeneral).map((e,i)=>
                                    <option key={i} value={e.indice}>{e.nombre}</option>
                                )}
                                
                            </select>
                        </div>
                        <div className="mb-3 d-flex justify-content-center">
                            <button className={"btn btn-"+(controlefecSelectGeneral==1?"success":"sinapsis")+" btn-lg"}>{(controlefecSelectGeneral==1?"SOLICITAR APROBACIÓN":"GUARDAR")} <i className="fa fa-paper-plane"></i></button>
                        </div>
                    </form>
				</div>
			</section>
            <div className="overlay"></div>
        </>

    )
}