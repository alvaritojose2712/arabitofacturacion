

function ModalSelectFactura({
  moneda,
  setshowModalFacturas,
  facturas,

  factqBuscar,
  setfactqBuscar,
  factqBuscarDate,
  setfactqBuscarDate,
  factsubView,
  setfactsubView,
  factSelectIndex,
  setfactSelectIndex,
  factOrderBy,
  setfactOrderBy,
  factOrderDescAsc,
  setfactOrderDescAsc,

  setfactInpdescripcion,
  factInpdescripcion,
  factInpid_proveedor,
  setfactInpid_proveedor,
  factInpnumfact,
  setfactInpnumfact,
  factInpmonto,
  setfactInpmonto,
  factInpfechavencimiento,
  setfactInpfechavencimiento,

  factInpnumnota,
  setfactInpnumnota,
  factInpsubtotal,
  setfactInpsubtotal,
  factInpdescuento,
  setfactInpdescuento,
  factInpmonto_gravable,
  setfactInpmonto_gravable,
  factInpmonto_exento,
  setfactInpmonto_exento,
  factInpiva,
  setfactInpiva,
  factInpfechaemision,
  setfactInpfechaemision,
  factInpfecharecepcion,
  setfactInpfecharecepcion,
  factInpnota,
  setfactInpnota,

  setFactura,

  proveedoresList,
  number,

  factInpestatus,
  setfactInpestatus,

  delFactura,
  delItemFact,

  verDetallesFactura,
  setsubViewInventario,
  saveFactura,

  setmodFact,
  modFact,
  qBuscarProveedor,
  setQBuscarProveedor,
  setIndexSelectProveedores,
  indexSelectProveedores,

  setPagoProveedor,
  tipopagoproveedor,
  settipopagoproveedor,
  montopagoproveedor,
  setmontopagoproveedor,
  getPagoProveedor,
  pagosproveedor,
  delPagoProveedor,
  subViewInventario,
  setView,
  sendFacturaCentral,

  allProveedoresCentral,
  getAllProveedores,
}) {
  const setfactOrderByFun = val => {
    if (val==factOrderBy) {
      if (factOrderDescAsc=="desc") {
        setfactOrderDescAsc("asc")
      }else{
        setfactOrderDescAsc("desc")

      }
    }else{
      setfactOrderBy(val)
    }
  }
  const setfactSelectIndexFun = (i,view) =>{
    setfactSelectIndex(i)
    setfactsubView(view)

    if (facturas[i]) {
      let obj = facturas[i]
      setfactInpid_proveedor(obj.id_proveedor)
      setfactInpnumfact(obj.numfact)
      setfactInpdescripcion(obj.descripcion)
      setfactInpmonto(obj.monto)
      setfactInpfechavencimiento(obj.fechavencimiento)
      setfactInpestatus(obj.estatus)

    }
  }

  const setfactSelectIndexFunInv = i => {
    setfactSelectIndex(i)
    // setshowModalFacturas(false)
    setfactsubView("detalles")

  }
  const setNuevaFact = () => {
    setfactSelectIndex(null)
    setfactsubView("agregar")


    setfactInpdescripcion("")
    setfactInpid_proveedor("")
    setfactInpnumfact("")
    setfactInpfechavencimiento("")
    setfactInpestatus("0")

    setfactInpnumnota("")
    setfactInpsubtotal("")
    setfactInpdescuento("")
    setfactInpmonto_gravable("")
    setfactInpmonto_exento("")
    setfactInpiva("")
    setfactInpfechaemision("")
    setfactInpfecharecepcion("")
    setfactInpnota("")

  }

  const linkfact = (type,num) => {
    if (type=="fact") {
      setfactqBuscar(num)
      let match = facturas.filter(e=>e.numfact==num)
      if (match.length) {
        setfactSelectIndex(0)
      }
      setmodFact("factura")
      setfactsubView("detalles")
      
    }

    if (type=="prove") {
      setQBuscarProveedor(num)
      setmodFact("proveedor")
    }




  }

  return (
    <>
      <section className=""> 
        <div className="container-fluid">
          <div className="row">
            <div className="col-3">
             
              
              {modFact == "proveedor" ?
                <>
                  <input type="text"
                    className="form-control"
                    placeholder="Buscar proveedor..."
                    value={qBuscarProveedor}
                    onChange={e => setQBuscarProveedor(e.target.value)} />
                  
                  {
                    proveedoresList.length
                      ? proveedoresList.map((e, i) =>
                        <div
                          onClick={()=>setIndexSelectProveedores(i)}
                          key={e.id}
                          className={(indexSelectProveedores == i ? "bg-sinapsis" : "bg-light text-secondary") + " card mt-2 pointer"}>
                          <div className="card-header flex-row row justify-content-between">
                            <div>
                              <small>ID.{e.id}</small>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div><span>{e.rif}</span></div>
                              <div><span className="">{e.telefono}</span></div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="">
                              <h5
                                className="card-title"
                              ><b>{e.descripcion}</b></h5>
                            </div>
                            <p className="card-text">
                            </p>
                          </div>
                        </div>
                      )
                      : <div className='h3 text-center text-dark mt-2'><i>¡Sin resultados!</i></div>
                  }
                </>
              : null}
              {modFact=="factura"?
                <>
                  <div className="input-group">
                    <input type="text"
                      className="form-control"
                      placeholder="Buscar factura..."
                      value={factqBuscar}
                      onChange={e => setfactqBuscar(e.target.value)} />
                    <input type="date"
                      className="form-control"
                      value={factqBuscarDate}
                      onChange={e => setfactqBuscarDate(e.target.value)} />
                    {modFact =="factura"?<button className="btn-sm btn btn-success" onClick={()=>setNuevaFact()}> <i className="fa fa-plus"></i>    </button>:null}
                    
                  </div>
                  <div className=" mb-1 mt-1 btn-group w-100">
                    <span className="btn btn-secondary" onClick={() => setfactOrderByFun("id")}>ID
                      {factOrderBy == "id" ? (<i className={factOrderDescAsc == "desc" ? "fa fa-arrow-up" : "fa fa-arrow-down"}></i>) : null}
                    </span>
                    <span className="btn btn-secondary" onClick={() => setfactOrderByFun("numfact")}>Num.Fact.
                      {factOrderBy == "numfact" ? (<i className={factOrderDescAsc == "desc" ? "fa fa-arrow-up" : "fa fa-arrow-down"}></i>) : null}
                    </span>
                    <span className="btn btn-secondary" onClick={() => setfactOrderByFun("id_proveedor")}>Proveedor
                      {factOrderBy == "id_proveedor" ? (<i className={factOrderDescAsc == "desc" ? "fa fa-arrow-up" : "fa fa-arrow-down"}></i>) : null}
                    </span>
                    <span className="btn btn-secondary" onClick={() => setfactOrderByFun("monto")}>Monto
                      {factOrderBy == "monto" ? (<i className={factOrderDescAsc == "desc" ? "fa fa-arrow-up" : "fa fa-arrow-down"}></i>) : null}
                    </span>
                    <span className="btn btn-secondary" onClick={() => setfactOrderByFun("estatus")}>Estatus
                      {factOrderBy == "estatus" ? (<i className={factOrderDescAsc == "desc" ? "fa fa-arrow-up" : "fa fa-arrow-down"}></i>) : null}
                    </span>
                    <span className="btn btn-secondary" onClick={() => setfactOrderByFun("created_at")}>Fecha
                      {factOrderBy == "created_at" ? (<i className={factOrderDescAsc == "desc" ? "fa fa-arrow-up" : "fa fa-arrow-down"}></i>) : null}
                    </span>
                  </div>

                  {facturas?facturas.length?facturas.map((e,i)=>
                    <div className="text-secondary mb-3 pointer shadow p-2" key={e.id}>
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted">{e.created_at}</small>
                        <span className={((e.estatus==0?"btn-danger":e.estatus==1?"btn-warning":e.estatus==2?"btn-success":""))+(" btn-sm btn pointer")}>
                          {e.estatus==0?"CREADA":""}
                          {e.estatus==1?"ENVIADA":""}
                          {e.estatus==2?"PROCESADA":""}
                        </span>
                      </div>
                      <div>
                        <div onClick={()=>setfactSelectIndexFunInv(i)} className="">
                          <span className={(i==factSelectIndex?"btn-success":"btn-sinapsis")+(" w-100 btn fs-3 pointer")}>{e.numfact}</span>
                        </div>
                      </div>
                      <p>
                        {e.proveedor.descripcion}
                      </p>
                      {/*<div>
                      <i className={e.estatus=="1"?"fa fa-check text-success":"fa fa-times text-danger"}></i>
                      <br/>
                      </div>*/}
                      <div className="d-flex justify-content-between">
                        <div className="btn-group">
                          
                          <button className="btn btn fs-3 btn-sinapsis" onClick={()=>setfactSelectIndexFun(i,"agregar")}><i className="fa fa-pencil"></i></button>
                          
                          {e.estatus==0?<button className="btn btn fs-3 btn-success" onClick={()=>sendFacturaCentral(e.id)}><i className="fa fa-send"></i></button>:""}

                          {e.estatus==1?<button className="btn btn fs-3 btn-success" onClick={()=>{
                            setfactSelectIndexFunInv(i);
                            setView("inventario")
                            setsubViewInventario("inventario")
                          }}><i className="fa fa-hand-pointer-o"></i></button>:""}
                        </div>

                        <div><span className="text-success fs-3">{moneda(e.monto)}</span></div>

                      </div>
                    </div>)
                  :null:null}


                </>
              :null}
            </div>
            {modFact == "proveedor" ?
              <div className="col">

                {proveedoresList[indexSelectProveedores]&&<>
                  <h3><b>{proveedoresList[indexSelectProveedores].descripcion}</b></h3>
                  
                  <h4>Registrar Pago</h4>
                  
                  
                  <form onSubmit={setPagoProveedor} className="container-fluid mb-3">
                    <div className="row">
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="">Tipo de pago</label>
                          <select value={tipopagoproveedor} name="tipopagoproveedor" onChange={e => settipopagoproveedor(e.target.value)} className="form-control">
                            <option value="">--Seleccione--</option>
                            <option value="3">Efectivo</option>
                            <option value="1">Transferencia</option>
                            <option value="2">Débito</option>
                          </select>
                        </div>

                      </div>
                      <div className="col">
                        <div className="form-group mb-1">
                          <label htmlFor="">Monto Pago</label>
                          <input value={montopagoproveedor} placeholder="Monto" onChange={e => setmontopagoproveedor(number(e.target.value))} className="form-control" />
                        </div>

                      </div>
                      <div className="col-md-auto d-flex align-items-center">
                        <div className="form-group">
                          <button className="btn btn-outline-success">Guardar</button>
                        </div>

                      </div>
                    </div>
                  </form>
                  <h4>Histórico</h4>

                  <table className="table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th className="text-right">Abono</th>
                        <th className="text-right">Credito</th>
                        <th className="text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagosproveedor?pagosproveedor.map((e,i)=>
                        <tr key={e.id}>
                          <td>{e.numfact ? null : <i className="fa fa-times text-danger" data-id={e.id} onClick={delPagoProveedor}></i>}</td>
                          <td>{e.created_at}</td>
                          {e.numfact?<>
                            <td></td>
                            <td></td>
                            <td className="text-danger pointer text-right" onClick={() => linkfact("fact",e.numfact)} title={e.numfact}>{moneda(e.monto)}</td>
                            <td className="text-right"><b>{moneda(e.balance)}</b></td>
                          </>:<>
                              <td>
                                <span className="h4">
                                  {e.monto != 0 && e.tipo == 1 ?
                                    <span className="w-75 btn btn-info btn-sm">Transferencia</span>
                                    : null}

                                  {e.monto != 0 && e.tipo == 2 ?
                                    <span className="w-75 btn btn-secondary btn-sm">Débito</span>
                                    : null}

                                  {e.monto != 0 && e.tipo == 3 ?
                                    <span className="w-75 btn btn-success btn-sm">Efectivo</span>
                                    : null}
                                </span>
                              </td>
                              <td className="text-success text-right">{moneda(e.monto)}</td>
                            <td></td>
                            <td className="text-right"><b>{moneda(e.balance)}</b></td>
                          </>}
                        </tr>
                      ):null}
                    </tbody>
                  </table>
                </>}
              </div>
            :null}
            {modFact == "factura" ?
              <div className="col">
                <div className="btn-group mb-4">
                  <button className={("btn ")+(factsubView=="detalles"?"btn-success":"btn-outline-sinapsis")} onClick={()=>setfactsubView("detalles")}>Detalles</button>            
                  <button className={("btn ")+(factsubView=="agregar"?"btn-success":"btn-outline-sinapsis")} onClick={()=>setfactsubView("agregar")}>

                    {factSelectIndex==null?
                      <span>Agregar</span>
                    : 
                      <>
                        Editar
                        <span> {facturas[factSelectIndex]?
                            facturas[factSelectIndex].numfact
                          :null}
                        </span>
                        -
                        <span>
                        {facturas[factSelectIndex]?
                          facturas[factSelectIndex].proveedor.descripcion
                        :null}
                        </span>
                      </>
                        
                    }
                  </button>
                </div>
                {factsubView=="agregar"?
                  <form onSubmit={setFactura}>

                      {factSelectIndex==null?
                        <h3>Registrar Factura</h3>
                      : <>
                        <h3>Editar Factura <button className="btn btn-outline-danger" onClick={()=>setfactSelectIndex(null)}>Cancelar</button></h3>
                        <h1 className="text-right">{facturas[factSelectIndex]?
                            facturas[factSelectIndex].numfact
                          :null}</h1>
                        <h1 className="text-right">{facturas[factSelectIndex]?
                          facturas[factSelectIndex].proveedor.descripcion
                        :null}</h1>
                      </>
                      }
                      

                      <div className="form-group">
                        <label htmlFor="">
                          Descripción
                        </label> 
                          <input type="text" 
                          value={factInpdescripcion} 
                          onChange={e=>setfactInpdescripcion(e.target.value)} 
                          className="form-control"/>
                      </div>

                      <div className="form-group">
                        <div className="input-group">
                          <div className="input-group-text">
                            Proveedor
                          </div>
                          <select className="form-control" onChange={e=>setfactInpid_proveedor(e.target.value)} value={factInpid_proveedor}>
                            <option value="">-</option>
                            {allProveedoresCentral.length?
                              allProveedoresCentral.map(e=><option value={e.id} key={e.id}>{e.descripcion}</option>)
                            :null}
                          </select>

                          <button type="button" className={("btn ")+(subViewInventario=="proveedores"?"btn-success":"btn-outline-success")} 
                          onClick={()=>getAllProveedores()}><i className="fa fa-search"></i></button>
                          

                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="">
                          Número de Factura (OBLIGATORIO)
                        </label> 
                          <input type="text" 
                          value={factInpnumfact} 
                          onChange={e=>setfactInpnumfact(e.target.value)} 
                          className="form-control"/>
                      </div>

                      <div className="form-group">
                        <label htmlFor="">
                          Número de Nota (SI APLICA)
                        </label> 
                          <input type="text" 
                          value={factInpnumnota} 
                          onChange={e=>setfactInpnumnota(e.target.value)} 
                          className="form-control"/>
                      </div>

                      <div className="mt-3 mb-3 d-flex flex-row">
                        <div className="form-group w-30">
                          <label className="fw-bold" htmlFor="">
                            SUBTOTAL
                          </label> 
                            <input type="text" 
                            placeholder="SOLO DÓLARES"
                            value={factInpsubtotal} 
                            onChange={e=>setfactInpsubtotal(number(e.target.value))} 
                            className="form-control"/>
                        </div>

                        <div className="form-group w-30">
                          <label className="fw-bold" htmlFor="">
                            DESCUENTO
                          </label> 
                            <input type="text" 
                            placeholder="SOLO DÓLARES"
                            value={factInpdescuento} 
                            onChange={e=>setfactInpdescuento(number(e.target.value))} 
                            className="form-control"/>
                        </div>

                        <div className="form-group w-30">
                          <label className="fw-bold" htmlFor="">
                            MONTO GRAVABLE
                          </label> 
                            <input type="text" 
                            placeholder="SOLO DÓLARES"
                            value={factInpmonto_gravable} 
                            onChange={e=>setfactInpmonto_gravable(number(e.target.value))} 
                            className="form-control"/>
                        </div>

                        <div className="form-group w-30">
                          <label className="fw-bold" htmlFor="">
                            MONTO EXENTO
                          </label> 
                            <input type="text" 
                            placeholder="SOLO DÓLARES"
                            value={factInpmonto_exento} 
                            onChange={e=>setfactInpmonto_exento(number(e.target.value))} 
                            className="form-control"/>
                        </div>

                        <div className="form-group w-30">
                          <label className="fw-bold" htmlFor="">
                            IVA
                          </label> 
                            <input type="text" 
                            placeholder="SOLO DÓLARES"
                            value={factInpiva} 
                            onChange={e=>setfactInpiva(number(e.target.value))} 
                            className="form-control"/>
                        </div>
                        <div className="form-group w-30">
                          <label className="fw-bold" htmlFor="">
                            TOTAL
                          </label> 
                            <input type="text" 
                            placeholder="SOLO DÓLARES"
                            value={factInpmonto} 
                            onChange={e=>setfactInpmonto(number(e.target.value))} 
                            className="form-control"/>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="">
                          Fecha de Emisión
                        </label> 
                          <input type="date" 
                          value={factInpfechaemision} 
                          onChange={e=>setfactInpfechaemision(e.target.value)} 
                          className="form-control"/>
                      </div>

                      <div className="form-group">
                        <label htmlFor="">
                          Fecha de Vencimiento
                        </label> 
                          <input type="date" 
                          value={factInpfechavencimiento} 
                          onChange={e=>setfactInpfechavencimiento(e.target.value)} 
                          className="form-control"/>
                      </div>
                      <div className="form-group">
                        <label htmlFor="">
                          Fecha de Recepción
                        </label> 
                          <input type="date" 
                          value={factInpfecharecepcion} 
                          onChange={e=>setfactInpfecharecepcion(e.target.value)} 
                          className="form-control"/>
                      </div>

                      <div className="form-group">
                        <label htmlFor="">
                          NOTA
                        </label> 
                          <textarea type="text" 
                          value={factInpnota} 
                          onChange={e=>setfactInpnota(e.target.value)} 
                          className="form-control"></textarea>
                      </div>

                      
                      <div className="form-group mt-2">
                      {factSelectIndex==null?
                        <button className="btn btn-outline-success btn-block" type="submit">Guardar</button>
                      : 
                        <div className="btn-group">
                          <button className="btn btn-sinapsis btn-block" type="submit">Editar</button>
                          <button className="btn btn-outline-danger btn-block" onClick={delFactura} type="button"><i className="fa fa-times"></i></button>
                          
                        </div>
                      }
                      </div>
                  </form>
                :null}

                {factsubView=="detalles"?
                  facturas[factSelectIndex]?<>
                    <div className="d-flex justify-content-between">
                      <div>
                        <small className="text-muted">Items. {facturas[factSelectIndex].items ? facturas[factSelectIndex].items.length :null}</small><br/>
                        
                        <span className="fw-bold">{facturas[factSelectIndex].proveedor.descripcion}</span>
                        
                        <p>{facturas[factSelectIndex].descripcion}</p>
                      </div>
                      <div className="text-right">
                        <div className="btn-group mb-2">
                          <button className="btn btn-success"><b>SUBTOTAL:</b> {moneda(facturas[factSelectIndex].subtotal)}</button>
                          <button className="btn btn-outline-success"><b>DESCUENTO:</b> {moneda(facturas[factSelectIndex].descuento)}</button>
                          <button className="btn btn-success"><b>GRAVABLE:</b> {moneda(facturas[factSelectIndex].monto_gravable)}</button>
                          <button className="btn btn-outline-success"><b>EXENTO:</b> {moneda(facturas[factSelectIndex].monto_exento)}</button>
                          <button className="btn btn-success"><b>IVA:</b> {moneda(facturas[factSelectIndex].iva)}</button>
                          <button className="btn btn-outline-success"><b>TOTAL:</b> {moneda(facturas[factSelectIndex].monto)}</button>
                        </div>
                        <br />
                        <div className="w-100 d-flex justify-content-between">
                          <span className="text-muted"><b>EMITIDA:</b> {facturas[factSelectIndex].fechaemision}</span>

                          <span className="text-muted"><b>RECIBIDA:</b> {facturas[factSelectIndex].fecharecepcion}</span>

                          <span className="text-muted"><b>VENCE:</b> {facturas[factSelectIndex].fechavencimiento}</span>
                        </div>
                      </div>
                    </div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Ct.</th>
                          <th>Cod.</th>
                          <th>Alterno.</th>
                          <th>Descripción</th>
                          <th className="text-right">Base</th>
                          <th className="text-right">Total Base</th>
                          <th className="text-right">Venta</th>
                          <th className="text-right">Total Venta</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        
                      {facturas[factSelectIndex].items?facturas[factSelectIndex].items.map(e=>
                        <tr key={e.id}>
                          <td>{e.tipo}</td>
                          <th>{e.cantidad}</th>
                          <td>{e.producto.codigo_barras}</td>
                          <td>{e.producto.codigo_proveedor}</td>
                          <td>{e.producto.descripcion}</td>
                          <td className="text-right">{e.producto.precio_base}</td>
                          <td className="text-right">{moneda(e.subtotal_base_clean)}</td>
                          <td className="text-right">{e.producto.precio}</td>
                          <td className="text-right">{moneda(e.subtotal_clean)}</td>
                          <td><i className="fa fa-times text-danger" data-id={e.id} onClick={delItemFact}></i></td>
                        </tr>
                      ):null}
                      <tr>
                        <td colSpan={5}>

                        </td>
                        <td colSpan={2} className="text-success h5 text-right">
                          {moneda(facturas[factSelectIndex].summonto_base_clean)}
                        </td>
                        <td colSpan={2} className="h5 text-right">
                          {moneda(facturas[factSelectIndex].summonto_clean)}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <div className="m-5 d-flex justify-content-center align-items-center">
                      <button className="btn btn lg btn-xl btn-outline-success" onClick={verDetallesFactura}>Ver todo <i className="fa fa-send"></i></button>
                    </div>
                  </>:null
                :null}
              </div>
            :null}
          </div>
        </div>   
      </section>
    </>

    
  )
}
export default ModalSelectFactura