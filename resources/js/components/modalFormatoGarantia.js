export default function ModalFormatoGarantia({
    devolucionMotivo,
    setdevolucionMotivo,
    devolucion_cantidad_salida,
    setdevolucion_cantidad_salida,

    devolucion_motivo_salida,
    setdevolucion_motivo_salida,

    devolucion_ci_cajero,
    setdevolucion_ci_cajero,
    devolucion_ci_autorizo,
    setdevolucion_ci_autorizo,
    devolucion_dias_desdecompra,
    setdevolucion_dias_desdecompra,
    devolucion_ci_cliente,
    setdevolucion_ci_cliente,
    devolucion_telefono_cliente,
    setdevolucion_telefono_cliente,
    devolucion_nombre_cliente,
    setdevolucion_nombre_cliente,
    devolucion_nombre_cajero,
    setdevolucion_nombre_cajero,
    devolucion_nombre_autorizo,
    setdevolucion_nombre_autorizo,

    devolucion_trajo_factura,
    setdevolucion_trajo_factura,
    devolucion_motivonotrajofact,
    setdevolucion_motivonotrajofact,
    number,
    setviewGarantiaFormato,
    addCarritoRequestInterno,
    devolucion_numfactoriginal,
    setdevolucion_numfactoriginal,
}){
    return <>
        <section className="modal-custom-formato"> 
            <div className="container bg-light">
                <form onSubmit={event=>{
                    event.preventDefault();
                    addCarritoRequestInterno(null,false)
                }}>
                    <div className="text-center mb-1">
                        <i className="fa fa-times text-danger" onClick={()=>setviewGarantiaFormato(false)}></i>
                    </div>
                    <h2 className="text-center">FORMATO DE GARANTÍA</h2>
                    <h5 className="text-center">Explicar DETALLADAMENTE</h5>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="" className="form-label fw-bold">NÚMERO DE FACTURA ORIGINAL</label>
                                <input type="text" className="form-control" value={devolucion_numfactoriginal} required={true} onChange={event=>setdevolucion_numfactoriginal(number(event.target.value))} />
                            </div> 
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="" className="form-label fw-bold">CÉDULA CAJERO</label>
                                <input type="text" className="form-control" value={devolucion_ci_cajero} required={true} onChange={event=>setdevolucion_ci_cajero(number(event.target.value))} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="" className="form-label fw-bold">NOMBRE COMPLETO CAJERO</label>
                                <input type="text" className="form-control" value={devolucion_nombre_cajero} required={true} onChange={event=>setdevolucion_nombre_cajero(event.target.value)} />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="" className="form-label fw-bold">CÉDULA AUTORIZÓ</label>
                                <input type="text" className="form-control" value={devolucion_ci_autorizo} required={true} onChange={event=>setdevolucion_ci_autorizo(number(event.target.value))} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="" className="form-label fw-bold">NOMBRE COMPLETO AUTORIZÓ</label>
                                <input type="text" className="form-control" value={devolucion_nombre_autorizo} required={true} onChange={event=>setdevolucion_nombre_autorizo(event.target.value)} />
                            </div>
                        </div>

                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="" className="form-label fw-bold">CÉDULA CLIENTE</label>
                                <input type="text" className="form-control" value={devolucion_ci_cliente} required={true} onChange={event=>setdevolucion_ci_cliente(number(event.target.value))} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="" className="form-label fw-bold">NOMBRE COMPLETO CLIENTE</label>
                                <input type="text" className="form-control" value={devolucion_nombre_cliente} required={true} onChange={event=>setdevolucion_nombre_cliente(event.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="" className="form-label fw-bold">TELÉFONO CLIENTE</label>
                                <input type="text" className="form-control" value={devolucion_telefono_cliente} required={true} onChange={event=>setdevolucion_telefono_cliente(event.target.value)} />
                            </div>
                        </div>
                        
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="" className="form-label fw-bold">MOTIVO DETALLADO</label>
                                <textarea type="text" className="form-control" value={devolucionMotivo} required={true} onChange={event=>setdevolucionMotivo(event.target.value)} > </textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="" className="form-label fw-bold">DÍAS TRANSCURRIDOS DESDE LA COMPRA</label>
                                <input type="text" className="form-control w-25" value={devolucion_dias_desdecompra} required={true} onChange={event=>setdevolucion_dias_desdecompra(number(event.target.value))} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="" className="form-label fw-bold">¿TRAJO FACTURA?</label>
                                <select className="form-control" value={devolucion_trajo_factura} required={true} onChange={event=>setdevolucion_trajo_factura((event.target.value))}>
                                    <option value="">-</option>
                                    <option value="si">SÍ</option>
                                    <option value="no">NO</option>
                                </select>
                            </div>
                            {devolucion_trajo_factura=="no"?
                                <div className="mb-3">
                                    <label htmlFor="" className="form-label fw-bold">EN CASO DE NO TENER FACTURA, EXPLIQUE EL MOTIVO</label>
                                    <input type="text" className="form-control" value={devolucion_motivonotrajofact} required={true} onChange={event=>setdevolucion_motivonotrajofact((event.target.value))} />
                                </div>
                            :null}
                        </div>
                    </div>
                    <div className="text-center p-4">
                        <button className="btn btn-success">ENVIAR</button>
                    </div>
                </form>
            </div>
        </section>
        <div className="overlay"></div>
    </>
}