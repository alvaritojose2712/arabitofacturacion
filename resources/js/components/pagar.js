import {useEffect,useState} from 'react';

import Modaladdproductocarrito from './Modaladdproductocarrito';
import ModaladdPersona from './ModaladdPersona';
import Modalconfigcredito from './Modalconfigcredito';



export default function Pagar({
changeEntregado,
setPagoPedido,
viewconfigcredito,
setviewconfigcredito,
fechainiciocredito,
setfechainiciocredito,
fechavencecredito,
setfechavencecredito,
formatopagocredito,
setformatopagocredito,
datadeudacredito,
setdatadeudacredito,
setconfigcredito,

setPrecioAlternoCarrito,
setCtxBultoCarrito,

addRefPago,
delRefPago,
refPago,
setrefPago,

pedidosFast,
pedidoData,
getPedido,
debito,
setDebito,
efectivo,
setEfectivo,
transferencia,
setTransferencia,
credito,
setCredito,

vuelto,
setVuelto,

number,
delItemPedido,
setDescuento,
setDescuentoUnitario,
setDescuentoTotal,
setCantidadCarrito,

toggleAddPersona,
setToggleAddPersona,

getPersona,
personas,
setPersonas,

ModaladdproductocarritoToggle,
setModaladdproductocarritoToggle,
toggleModalProductos,

setProductoCarritoInterno,

toggleImprimirTicket,
onchangeinputmain,
del_pedido,

productos,
getProductos,
facturar_pedido,
inputmodaladdpersonacarritoref,
inputaddcarritointernoref,

tbodyproducInterref,
tbodypersoInterref,

countListInter,
countListPersoInter,

clickSetOrderColumn,
orderColumn,
orderBy,
entregarVuelto,

setPersonaFast,
clienteInpidentificacion,
setclienteInpidentificacion,
clienteInpnombre,
setclienteInpnombre,
clienteInptelefono,
setclienteInptelefono,
clienteInpdireccion,
setclienteInpdireccion,
inputaddCarritoFast,
setinputaddCarritoFast,
refinputaddcarritofast,

viewReportPedido,
autoCorrector,
setautoCorrector,

getDebito,
getCredito,
getTransferencia,
getEfectivo,
onClickEditPedido,

setBiopago,
biopago,
getBio,

facturar_e_imprimir,

moneda,

dolar,
peso,

showinputaddCarritoFast,
setshowinputaddCarritoFast,
qProductosMain,
auth,

settogglereferenciapago,
togglereferenciapago,

tipo_referenciapago,
settipo_referenciapago,
descripcion_referenciapago,
setdescripcion_referenciapago,
monto_referenciapago,
setmonto_referenciapago,
banco_referenciapago,
setbanco_referenciapago,

refaddfast,
inputqinterno,
setinputqinterno,
productoSelectinternouno,
addCarritoRequestInterno,

setCantidad,
cantidad,
devolucionTipo,
setdevolucionTipo,
inputCantidadCarritoref ,

}) {



const showTittlePrice = (pu,total) => {
  try{
    return "P/U. Bs."+moneda(number(pu)*dolar)+"\n"+"Total Bs."+moneda(number(total)*dolar)

  }catch(err){
    return ""
  }
}

const [isrefbanbs, setisrefbanbs] = useState(true)
const [recibido_dolar, setrecibido_dolar] = useState("")
const [recibido_bs, setrecibido_bs] = useState("")
const [recibido_cop, setrecibido_cop] = useState("")
const [cambio_dolar, setcambio_dolar] = useState("")
const [cambio_bs, setcambio_bs] = useState("")
const [cambio_cop, setcambio_cop] = useState("")

const [cambio_tot_result, setcambio_tot_result] = useState("")
const [recibido_tot, setrecibido_tot] = useState("")
const changeRecibido = (val,type) => {
  switch(type){
    case "recibido_dolar":
      setrecibido_dolar(number(val))

    break;
    case "recibido_bs":
      setrecibido_bs(number(val))
    break;
    case "recibido_cop":
      setrecibido_cop(number(val))
    break;
  }

}
const setPagoInBs = callback => {
  let bs = parseFloat(window.prompt("Monto Bs"))
  if (bs) {
    callback((bs/dolar).toFixed(2))
  }
}
const sumRecibido = () => {
  let vuel_dolar = parseFloat(recibido_dolar?recibido_dolar:0)
  let vuel_bs = parseFloat(recibido_bs?recibido_bs:0) / parseFloat(dolar)
  let vuel_cop = parseFloat(recibido_cop?recibido_cop:0) / parseFloat(peso)

  let t =  (vuel_dolar + vuel_bs + vuel_cop)
  let cambio_dolar = recibido_dolar||recibido_bs||recibido_cop?t-pedidoData.clean_total:""

   
  setrecibido_tot((t).toFixed(2)) 
  setcambio_dolar(cambio_dolar!==""?cambio_dolar.toFixed(2):"")
  setcambio_bs("")
  setcambio_cop("")
  setcambio_tot_result(cambio_dolar!==""?cambio_dolar.toFixed(2):"") 
}
const setVueltobs = () => {
  setcambio_bs((cambio_tot_result*dolar).toFixed(2))
  setcambio_dolar("")
  setcambio_cop("")
}
const setVueltodolar = () => {
  setcambio_bs("")
  setcambio_dolar(cambio_tot_result)
  setcambio_cop("")
}
const setVueltocop = () => {
  setcambio_bs("")
  setcambio_dolar("")
  setcambio_cop((cambio_tot_result*peso).toFixed(2))
}
const syncCambio = (val,type) => {
  val = number(val)
  let valC = 0
  if (type=="Dolar") {
    setcambio_dolar(val)
    valC = val
  }
  else if (type=="Bolivares") {
    setcambio_bs(val) 
    valC = parseFloat(val?val:0) / parseFloat(dolar)

  }
  else if (type=="Pesos") {
    setcambio_cop(val)
    valC = parseFloat(val?val:0) / parseFloat(peso)
  }
  


  let divisor=0;

  let inputs = [
    {key:"Dolar", val:cambio_dolar, set:(val)=>setcambio_dolar(val)},
    {key:"Bolivares", val:cambio_bs, set:(val)=>setcambio_bs(val)},
    {key:"Pesos", val:cambio_cop, set:(val)=>setcambio_cop(val)},
  ]

  inputs.map(e => {
    if (e.key!=type) {
      if (e.val) {divisor++}
    }
  })
  let cambio_tot_resultvalC = 0
  if (cambio_bs&&cambio_dolar&&type=="Pesos") {
    let bs = parseFloat(cambio_bs) / parseFloat(dolar)
    setcambio_dolar((cambio_tot_result-bs-valC).toFixed(2))
  }else{
    inputs.map(e => {
      if (e.key!=type) {
        if (e.val) {
          cambio_tot_resultvalC = (cambio_tot_result-valC)/divisor
          if (e.key=="Dolar") {
            e.set((cambio_tot_resultvalC).toFixed(2))
          }else if (e.key=="Bolivares") {
            e.set((cambio_tot_resultvalC*dolar).toFixed(2))
          }else if (e.key=="Pesos") {
            e.set((cambio_tot_resultvalC*peso).toFixed(2))
          }
        }
      }
    })

  }

  
}
const sumCambio = () => {
  let vuel_dolar = parseFloat(cambio_dolar?cambio_dolar:0)
  let vuel_bs = parseFloat(cambio_bs?cambio_bs:0) / parseFloat(dolar)
  let vuel_cop = parseFloat(cambio_cop?cambio_cop:0) / parseFloat(peso)
  return (vuel_dolar + vuel_bs + vuel_cop).toFixed(2)
}
const debitoBs = (met) =>{
  try{
    if (met=="debito") {
      if (debito=="") {
        return ""
      }
     return "Bs."+moneda(dolar*debito)

    }

    if (met=="transferencia") {
      if (transferencia=="") {
        return ""
      }
     return "Bs."+moneda(dolar*transferencia)
      
    }
    if (met=="biopago") {
      if (biopago=="") {
        return ""
      }
     return "Bs."+moneda(dolar*biopago)
      
    }
    if (met=="efectivo") {
      if (efectivo=="") {
        return ""
      }
     return "Bs."+moneda(dolar*efectivo)
      
    }

  }catch(err){
    return ""
    console.log()
  }
}
const syncPago = (val,type)=>{
  val = number(val)
  if (type=="Debito") {

    setDebito(val)
  }
  else if (type=="Efectivo") {
    setEfectivo(val) 
  }
  else if (type=="Transferencia") {
    setTransferencia(val)
  }
  else if (type=="Credito") {
    setCredito(val)
  }
  else if (type=="Biopago") {
    setBiopago(val)
  }


  let divisor=0;

  let inputs = [
    {key:"Debito", val:debito, set:(val)=>setDebito(val)},
    {key:"Efectivo", val:efectivo, set:(val)=>setEfectivo(val)},
    {key:"Transferencia", val:transferencia, set:(val)=>setTransferencia(val)},
    {key:"Credito", val:credito, set:(val)=>setCredito(val)},
    {key:"Biopago", val:biopago, set:(val)=>setBiopago(val)},
  ]

  inputs.map(e => {
    if (e.key!=type) {
      if (e.val) {divisor++}
    }
  })

  if (autoCorrector) {
    inputs.map(e => {
      if (e.key!=type) {
        if (e.val) {
          e.set(((pedidoData.clean_total-val)/divisor).toFixed(2))
        }
      }
    })
  }
}

  useEffect(()=>{
    getProductos(inputqinterno,true)
  },[inputqinterno])
  useEffect(()=>{
    sumRecibido()
  },[recibido_bs,recibido_cop,recibido_dolar])
  useEffect(()=>{
    if (refinputaddcarritofast.current) {
      refinputaddcarritofast.current.value = ""

    }
    
    // refinputaddcarritofast.current.focus()
  },[])
  try{
    const {
      id,
      created_at,
      cliente,
      items,
      total_des,
      subtotal,
      total,

      clean_total,
      cop_clean,
      bs_clean,
      
      total_porciento,
      cop,
      bs,
      editable,
      vuelto_entregado,
      estado,

      exento,
      gravable,
      ivas,
      monto_iva,
    } = pedidoData

    let ifnegative = items.filter(e => e.cantidad < 0).length

    
    return (
      <>
        {viewconfigcredito?
          <Modalconfigcredito
            pedidoData={pedidoData}
            setPagoPedido={setPagoPedido}
            viewconfigcredito={viewconfigcredito}
            setviewconfigcredito={setviewconfigcredito}
            fechainiciocredito={fechainiciocredito}
            setfechainiciocredito={setfechainiciocredito}
            fechavencecredito={fechavencecredito}
            setfechavencecredito={setfechavencecredito}
            formatopagocredito={formatopagocredito}
            setformatopagocredito={setformatopagocredito}
            datadeudacredito={datadeudacredito}
            setdatadeudacredito={setdatadeudacredito}
            setconfigcredito={setconfigcredito}
          />
        :null}
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-auto p-0">
                
                {pedidosFast?pedidosFast.map(e=>
                  e?
                    <div className="card-pedidos d-flex justify-content-center flex-column" key={e.id} data-id={e.id} onClick={onClickEditPedido}>
                      <h3>
                        <span className={(e.id==id?"btn":"btn-outline")+(!e.estado?"-sinapsis":"-success")+(" fs-4 btn f")}>
                          {e.id}
                        </span>
                      </h3>
                      <span className="text-muted text-center">
                          <b className={("h5 ")+(!e.estado?" text-sinapsis":" text-success")}></b>

                      </span>
                    </div>
                  :null
                ):null} 
            </div>
            <div className="col">
            

              {toggleAddPersona&&<ModaladdPersona 
                setToggleAddPersona={setToggleAddPersona}
                getPersona={getPersona}
                personas={personas}
                setPersonas={setPersonas}
                inputmodaladdpersonacarritoref={inputmodaladdpersonacarritoref}
                tbodypersoInterref={tbodypersoInterref}
                countListPersoInter={countListPersoInter}

                setPersonaFast={setPersonaFast}
                clienteInpidentificacion={clienteInpidentificacion}
                setclienteInpidentificacion={setclienteInpidentificacion}
                clienteInpnombre={clienteInpnombre}
                setclienteInpnombre={setclienteInpnombre}
                clienteInptelefono={clienteInptelefono}
                setclienteInptelefono={setclienteInptelefono}
                clienteInpdireccion={clienteInpdireccion}
                setclienteInpdireccion={setclienteInpdireccion}
              />}
              <div className={(estado?"bg-success-light":"bg-sinapsis")+(" d-flex justify-content-between p-1 rounded")}>
                <span className='fs-5'>Pedido #{id}</span>
                <span className='pull-right'>{created_at}</span>
              </div>
              {ModaladdproductocarritoToggle&&<Modaladdproductocarrito
                toggleModalProductos={toggleModalProductos}
                moneda={moneda}
                productoSelectinternouno={productoSelectinternouno}
                inputCantidadCarritoref={inputCantidadCarritoref}
                setCantidad={setCantidad}
                  cantidad={cantidad}
                  number={number}
                dolar={dolar}
                setdevolucionTipo={setdevolucionTipo}
                devolucionTipo={devolucionTipo}
                addCarritoRequestInterno={addCarritoRequestInterno}
                ModaladdproductocarritoToggle={ModaladdproductocarritoToggle}
              />}
              <table className="table table-striped text-left">
                <thead>
                  {editable?
                    <tr>
                        <td colSpan={auth(1)?"9":"8"} className='p-0 pt-1'>
                            <input type="text" 
                              ref={refaddfast} 
                              className="form-control" 
                              placeholder="Agregar...(F1)" 
                              onChange={e=>setinputqinterno(e.target.value)}
                              value={inputqinterno}
                              

                            />
                             
                        </td>
                    </tr>
                  :null}
                  {inputqinterno===""?
                  <tr>
                    <th className="text-sinapsis cell2">Código</th>
                    <th className="text-sinapsis cell3">Producto</th>
                    <th className="text-sinapsis cell1">Ct.</th>
                    {auth(1)?<th className="text-sinapsis cell1">PBase</th>:null}

                    <th className="text-sinapsis cell1">PVenta</th>
                    
                    <th className="text-sinapsis">SubTotal</th>
                    <th className="text-sinapsis">Desc.%</th>
                    

                    <th className="text-sinapsis cell2">Total</th>
                    
                  </tr>
                  :null}
                </thead>
                {inputqinterno===""?
                <tbody>
                  {items?items.map((e,i)=>
                    e.abono&&!e.producto?
                    <tr key={e.id}>
                      <td>MOV</td>
                      <td>{e.abono}</td>
                      <td>{e.cantidad} </td>
                      <td>{e.monto}</td>
                      <td onClick={setDescuentoUnitario} data-index={e.id} className="align-middle pointer clickme">{e.descuento}</td>
                      <td>{e.subtotal}</td>
                      <td>{e.total_des}</td>
                      <th className="font-weight-bold">{e.total}</th>
                      <td> </td>
                    </tr>
                    :<tr key={e.id} title={showTittlePrice(e.producto.precio,e.total)}>
                      <td className="align-middle">{e.producto.codigo_barras}</td>
                        <td className="align-middle">
                          
                          {
                            ifnegative ?
                              <>
                              {
                                e.condicion ==1
                                ? <span className="me-2 btn btn-warning btn-sm-sm me-2">Garantía</span>
                                : null
                              }
    
                              {
                                e.condicion == 2 || e.condicion == 0
                                ? <span className="me-2 btn btn-info btn-sm-sm me-2">Cambio</span>
                                : null
                              }
                              </>
                            : null
                          }
                          <span className="pointer" onClick={changeEntregado} data-id={e.id}>{e.producto.descripcion}</span>
                          {e.entregado ? <span className="btn btn-outline-secondary btn-sm-sm">Entregado</span> : null}
                      </td>
                        <td className="pointer clickme align-middle" onClick={
                          e.condicion == 1 ? null : setCantidadCarrito
                        } data-index={e.id}>
                          {ifnegative ?
                            e.cantidad < 0
                              ? <span className="me-2 btn btn-outline-success btn-sm-sm"> <i className="fa fa-arrow-down"></i></span>
                              :<span className="me-2 btn btn-outline-danger btn-sm-sm"> <i className="fa fa-arrow-up"></i></span>
                          : null}
                          {e.cantidad.replace(".00", "")}
                          
                      </td>
                      {auth(1)?<th className="pointer align-middle">{moneda(e.producto.precio_base)}</th>:null}
                      {e.producto.precio1?
                      <td className="align-middle text-success pointer" data-iditem={e.id} onClick={setPrecioAlternoCarrito} >{e.producto.precio}</td>
                        :
                      <td className="align-middle pointer">{moneda(e.producto.precio)}</td>
                      }
                      <td onClick={setDescuentoUnitario} data-index={e.id} className="align-middle pointer">{e.subtotal}</td>
                      <td onClick={setDescuentoUnitario} data-index={e.id} className="align-middle pointer clickme">{e.descuento}</td>
                      


                      <th className="font-weight-bold align-middle">{e.total}</th>
                      {editable?
                        <td className="align-middle"> <i onClick={delItemPedido} data-index={e.id} className="fa fa-times text-danger"></i> </td>
                      :null}
                    </tr>
                  ):null}
                  <tr>
                    <td><button className="btn btn-outline-success fs-5">{items?items.length:null}</button></td>
                    <th colSpan={auth(1)?"8":"7"} className="p-2 align-middle">{cliente?cliente.nombre:null} <b>{cliente?cliente.identificacion:null}</b></th>
                  </tr>
                </tbody>
                :null}

                {inputqinterno!==""?
                  <tbody ref={tbodyproducInterref}>
                    {productos.length?productos.map((e,i)=>
                      <tr tabIndex="-1" className={(countListInter==i?"bg-select":null)+(' tr-producto ')} key={e.id} onClick={()=>setProductoCarritoInterno(e.id)} data-index={e.id}>
                        <td className="cell2">{e.codigo_barras}</td>
                        <td className='text-left pl-5 cell4'>{e.descripcion}</td>
                        <td className="cell1">
                          <a href='#' className='formShowProductos btn btn-sinapsis btn-sm'>{e.cantidad}</a>         
                        </td>
                        <td className="cell1">{e.unidad}</td>
                        <td className="cell2">
                          <div className="btn-group-vertical">
                              <button type="button" className='m-0 btn btn-success text-light fs-4 fw-bold'>{moneda(e.precio)}</button>
                              <button type="button" className='m-0 btn btn-secondary text-light'>Bs. {moneda(e.bs)}</button>
                              <button type="button" className='m-0 btn btn-secondary text-light'>Cop. {moneda(e.cop)}</button>

                          </div>
                        </td>
                      </tr>
                      ):null}
                  </tbody>
                :null}
              </table>
            </div>
          
            
            <div className="col-5">
              <div className="mb-1 container-fluid pt-1">
                <div className="row">
                  <div className="col p-0">
                    <div className="container-fluid p-0">
                      
                      <div className="row">
                      
                        <div className="col p-0">
                            {editable?
                            <div className={(debito!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card w125px")}>
                                <div className="card-body">
                                  <div className="card-title pointer" onClick={getDebito}>Déb. </div> 
                                  

                                  <div className="card-text pago-numero">
                                    <div className="input-group">
                                      <input type="text" className='form-control' value={debito} onChange={(e)=>syncPago(e.target.value,"Debito")} placeholder="D"/>
                                      <div className="input-group-prepend">
                                          <span className="input-group-text pointer" onClick={()=>setPagoInBs(val=>{
                                            syncPago(val,"Debito")
                                          })}>Bs</span>
                                      </div>
                                    </div>
                                  </div>
                                  <small className="text-muted fs-4">{debitoBs("debito")}</small>
                                  <span className='ref pointer' data-type="toggle" onClick={()=>addRefPago("toggle")}>Ref. <i className="fa fa-plus"></i></span>
                                  
                                  
                                </div>
                            </div>
                            :
                            <div className={(debito!=""?"bg-success-light card-sinapsis":"t-5")+(" card w125px")}>
                              <div className="card-body">
                                  <div className="card-title pointer">Déb.</div>
                                  <div className="card-text pago-numero">{debito}</div>
                                  
                              </div>
                            </div>
                            }
                            
                        </div>
                        <div className="col p-0">
                            {editable?
                            
                            <div className={(efectivo!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card w125px")}>
                            <div className="card-body">
                                <div className="card-title pointer" onClick={getEfectivo}>Efec.</div>
                                <div className="card-text pago-numero">
                                  <div className="input-group">
                                    <input type="text" className='form-control' value={efectivo} onChange={(e)=>syncPago(e.target.value,"Efectivo")} placeholder="E"/>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text pointer" onClick={()=>setPagoInBs(val=>{
                                          syncPago(val,"Efectivo")
                                        })}>Bs</span>
                                    </div>
                                  </div>
                                </div>
                                <small className="text-muted fs-4">{debitoBs("efectivo")}</small>
                            </div>
                            </div>
                            :
                            <div className={(efectivo!=""?"bg-success-light card-sinapsis":"t-5")+(" card w125px")}>
                            <div className="card-body">
                                <div className="card-title pointer">Efec.</div>
                                <div className="card-text pago-numero">{efectivo}</div>
                                
                            </div>
                            </div>
                            } 
            
                        </div>
            
                        <div className="col p-0">
                            {editable?
                            
                            <div className={(transferencia!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card w125px")}>
                            <div className="card-body">
                                <div className="card-title pointer" onClick={getTransferencia}>Tran.</div>
                                <div className="card-text pago-numero">
                                  <div className="input-group">
                                    <input type="text" className='form-control' value={transferencia} onChange={(e)=>syncPago(e.target.value,"Transferencia")} placeholder="T"/>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text pointer" onClick={()=>setPagoInBs(val=>{
                                          syncPago(val,"Transferencia")
                                        })}>Bs</span>
                                    </div>
                                  </div>
                                </div>
                                <small className="text-muted fs-4">{debitoBs("transferencia")}</small>
                                <span className='ref pointer' data-type="toggle" onClick={()=>addRefPago("toggle",transferencia,"1")}>Ref. <i className="fa fa-plus"></i></span>
                                

                            </div>
                            </div>
            
                            :
                            <div className={(transferencia!=""?"bg-success-light card-sinapsis":"t-5")+(" card w125px")}>
                            <div className="card-body">
                                <div className="card-title pointer">Tran.</div>
                                <div className="card-text pago-numero">{transferencia}</div>
                                
                            </div>
                            </div>
                            } 
            
                        </div>
            
                        <div className="col p-0">
                            {editable?
                            
                            <div className={(biopago!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card w125px")}>
                                <div className="card-body">
                                  <div className="card-title pointer" onClick={getBio}>Biopago</div>
                                  <div className="card-text pago-numero">
                                    <div className="input-group">
                                      <input type="text" className='form-control' value={biopago} onChange={(e)=>syncPago(e.target.value,"Biopago")} placeholder="B"/>
                                      <div className="input-group-prepend">
                                        <span className="input-group-text pointer" onClick={()=>setPagoInBs(val=>{
                                          syncPago(val,"Biopago")
                                        })}>Bs</span>
                                      </div>
                                    </div>
                                  </div>
                                  <small className="text-muted fs-4">{debitoBs("biopago")}</small>
                                  <span className='ref pointer' data-type="toggle" onClick={()=>addRefPago("toggle",biopago,"5")}>Ref. <i className="fa fa-plus"></i></span>
                                  
                                </div>
                            </div>
            
                            :
                            <div className={(biopago!=""?"bg-success-light card-sinapsis":"t-5")+(" card w125px")}>
                                <div className="card-body">
                                <div className="card-title pointer">Biopago.</div>
                                <div className="card-text pago-numero">{biopago}</div>
                                
                                </div>
                            </div>
                            } 
                        </div>
            
                        <div className="col p-0">
                            {editable?
                            
                            <div className={(credito!=""?"bg-success-light card-sinapsis":"t-5")+(" card w125px")}>
                            <div className="card-body">
                                <div className="card-title pointer" onClick={getCredito}>Créd.</div>
                                <div className="card-text pago-numero"><input type="text" value={credito} onChange={(e)=>syncPago(e.target.value,"Credito")} placeholder="C"/></div>
                                
                            </div>
                            </div>
                            :
            
                            <div className={(credito!=""?"bg-success-light card-sinapsis":"t-5")+(" card w125px")}>
                            <div className="card-body">
                                <div className="card-title pointer">Créd.</div>
                                <div className="card-text pago-numero">{credito}</div>
                                
                            </div>
                            </div>
                            }
                        </div>
                        
                        <div className="col p-0">
                        </div>
                        <div className="col p-0">
                        </div>
                        {
                          !editable?<div className="col p-0">
                            <div className="card-body">
                              <div onClick={entregarVuelto}>
                                <div className="card-text pago-numero">                
                                {vuelto}
                                </div>
                                <small className="text-success fst-italic pointer">Entregar</small><br/>
                                {vuelto_entregado?vuelto_entregado.map(e=><div title={e.created_at} key={e.id}>
                                Entregado = <b>{e.monto}</b>
                                
                                </div>):null}
                              </div>
                            </div>
                          </div>:null
                        }
                        {/* <div className="col p-0">
                            
                            <div className={(vuelto!=""?"card-danger-pago":"t-5")+(" card pointer w125px")}>
                            <div className="card-body">
                                <div className="card-title">Vuel.</div>
                                {
                                editable?
                                <div className="card-text pago-numero">
                                    <input type="text" value={vuelto} onChange={(e)=>setVuelto(number(e.target.value))} placeholder="V"/>
                                </div>
                                :
                                <div onClick={entregarVuelto}>
                                    <div className="card-text pago-numero">                
                                    {vuelto}
                                    </div>
                                    <small className="text-success fst-italic pointer">Entregar</small><br/>
                                    {vuelto_entregado?vuelto_entregado.map(e=><div title={e.created_at} key={e.id}>
                                    Entregado = <b>{e.monto}</b>
                                    
                                    </div>):null}
                                </div>
                                }
                            </div>
                            </div>
                        </div> */}
                        
            
                      </div>
                    </div>
                  </div>
                  <div className="p-1 col-md-auto d-flex align-items-center">
                    {autoCorrector?
                      <button className="btn btn-outline-success btn-sm scale05" onClick={()=>setautoCorrector(false)}>On</button>:
                      <button className="btn btn-outline-danger btn-sm scale05" onClick={()=>setautoCorrector(true)}>Off</button>
                    }
                    
                  </div>
                </div>

              </div>
              {editable?
                <div className="container p-0 m-0">
                  {togglereferenciapago?
                    <div className="modal-custom">
                      <div className="text-danger" onClick={()=>addRefPago("toggle")} data-type="toggle"><span className="closeModal">&#10006;</span></div>

                      <div className="modal-content-sm shadow">
                        <div className="col p-4">
                          <h4>Agregar Referencia Bancaria (Enter dentro de un campo para guardar)</h4>
                            <div className="form-group">
                              <label className="form-label">Referencia</label>
                              <input type="text" placeholder='Referencia completa de la transacción...' value={descripcion_referenciapago} onChange={e=>setdescripcion_referenciapago(e.target.value)} className="form-control" />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Banco</label>
                              <select className="form-control" value={banco_referenciapago} onChange={e=>setbanco_referenciapago(e.target.value)}>
                                <option value="">--Seleccione Banco--</option>
                                <option value="0102">0102 Banco de Venezuela, S.A. Banco Universal</option>	
                                <option value="0108">0108 Banco Provincial, S.A. Banco Universal</option>	
                                <option value="0105">0105 Banco Mercantil C.A., Banco Universal</option>	
                                <option value="0134">0134 Banesco Banco Universal, C.A.</option>	
                                <option value="0175">0175 Banco Bicentenario del Pueblo, Banco Universal C.A.</option>	
                                <option value="0191">0191 Banco Nacional de Crédito C.A., Banco Universal</option>	
                                <option value="0104">0104 Banco Venezolano de Crédito, S.A. Banco Universal</option>	
                                <option value="0114">0114 Banco del Caribe C.A., Banco Universal</option>	
                                <option value="0115">0115 Banco Exterior C.A., Banco Universal</option>	
                                <option value="0128">0128 Banco Caroní C.A., Banco Universal</option>	
                                <option value="0137">0137 Banco Sofitasa Banco Universal, C.A.</option>	
                                <option value="0138">0138 Banco Plaza, Banco universal</option>	
                                <option value="0146">0146 Banco de la Gente Emprendedora C.A.</option>	
                                <option value="0151">0151 Banco Fondo Común, C.A Banco Universal</option>	
                                <option value="0156">0156 100% Banco, Banco Comercial, C.A</option>	
                                <option value="0157">0157 DelSur, Banco Universal C.A.</option>	
                                <option value="0163">0163 Banco del Tesoro C.A., Banco Universal</option>	
                                <option value="0166">0166 Banco Agrícola de Venezuela C.A., Banco Universal</option>	
                                <option value="0168">0168 Bancrecer S.A., Banco Microfinanciero</option>	
                                <option value="0169">0169 Mi Banco, Banco Microfinanciero, C.A.</option>	
                                <option value="0171">0171 Banco Activo C.A., Banco Universal</option>	
                                <option value="0172">0172 Bancamiga Banco Universal, C.A.</option>	
                                <option value="0173">0173 Banco Internacional de Desarrollo C.A., Banco Universal</option>	
                                <option value="0174">0174 Banplus Banco Universal, C.A.</option>	
                                <option value="0177">0177 Banco de la Fuerza Armada Nacional Bolivariana, B.U.</option>	
                                <option value="ZELLE">ZELLE</option>	
                                <option value="BINANCE">Binance</option>	
                                <option value="AirTM">AirTM</option>	
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label mt-2">Monto en {isrefbanbs
                                  ? 
                                  <button className="btn btn-outline-sinapsis btn-sm" onClick={()=>{setisrefbanbs(false);setmonto_referenciapago(transferencia)}}>Bs</button>
                                  : 
                                  <button className="btn btn-outline-success btn-sm" onClick={()=>{setisrefbanbs(true);setmonto_referenciapago(transferencia*dolar)}}>$</button>
                                }  
                              </label>
                              <input type="text" disabled={true} value={monto_referenciapago} onChange={e=>setmonto_referenciapago(e.target.value)} className="form-control" />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Tranferencia/Biopago/Débito</label>
                              <select className="form-control" value={tipo_referenciapago} onChange={e=>settipo_referenciapago(e.target.value)}>
                                <option value="">--Seleccione Banco--</option>
                                <option value="1">Transferencia</option>
                                <option value="2">Debito</option> 
                                <option value="5">BioPago</option>
                              </select>
                            </div>
                        </div>
                      </div>
                    </div>

                    :null
                  }
                  <div className="row mb-4">
                    <div className="col">
                      {refPago ? refPago.length ?<h4 className='text-center'>Referencias Bancarias</h4>:null:null}

                      <ul className="list-group">
                      
                        {refPago ? refPago.length ? refPago.map(e=>
                          <li key={e.id} className='list-group-item d-flex justify-content-between align-items-start'>
                            <span className='cell45'>Ref.{e.descripcion} ({e.banco})</span>
                            {e.tipo==1&&e.monto!=0?<span className="cell45 btn-sm btn-info btn">Trans. {moneda(e.monto)} </span>:null}
	                          {e.tipo==2&&e.monto!=0?<span className="cell45 btn-sm btn-secondary btn">Deb. Bs.{moneda(e.monto)} </span>:null}
	                          {e.tipo==5&&e.monto!=0?<span className="cell45 btn-sm btn-secondary btn">Biopago. Bs.{moneda(e.monto)} </span>:null}
                            <span className="cell1 text-danger text-right" data-id={e.id} onClick={delRefPago}>
                              <i className="fa fa-times"></i>
                            </span>
                          </li>
                        )
                        :null:null}
                      </ul>

                    </div>
                  </div>
                </div>:null
              }

              <div className="mt-1 mb-1">
                
                <table className="table table-sm">
                  <tbody>
                    <tr className='hover text-center'>
                      <th className="">Sub-Total</th>
                      <th data-index={id} onClick={setDescuentoTotal} className="pointer clickme">Desc. {total_porciento}%</th>
                      <th className="">Monto Exento</th>
                      <th className="">Monto Gravable</th>
                      <th className="">IVA <span>({ivas})</span></th>
                    </tr>
                    <tr className="hover text-center">
                      <td className="">{subtotal}</td>
                      <td className="">{total_des}</td>
                      <td className="">{exento}</td>
                      <td className="">{gravable}</td>
                      <td className="">{monto_iva}</td>
                      
                    </tr>
                    
                    <tr className="text-muted">
                      <th colSpan="2" className='align-bottom text-right'>
                        <span data-type="cop" className='fs-5 pointer'>COP {cop}</span>
                      </th>
                      <th colSpan="2" className='text-center align-bottom'>
                        <span className="fw-bold ">Total</span>
                        <br />
                        <span data-type="dolar" className=" text-success fw-bold fs-11 pointer">{total}</span>
                      </th>
                      <th colSpan="2" className='align-bottom'>
                        <span data-type="bs" className='fs-2 pointer'> Bs {bs}</span><br/>
                      </th>
                    </tr>
                    {pedidoData.clean_total < 0 ?
                      <tr>
                        <td colSpan={6}>
                          <span className="text-muted">Debemos pagarle diferencia al cliente</span>
                        </td>
                    </tr>
                    :null}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-center">
                <table className="table-sm">
                  <tbody>
                    <tr>
                      <td>
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col p-0">
                              <div className={(recibido_dolar!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer" >$</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={recibido_dolar} onChange={(e)=>changeRecibido(e.target.value,"recibido_dolar")} placeholder="$"/></div>
                                </div>
                              </div>
                            </div>

                            <div className="col p-0">
                              <div className={(recibido_bs!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer" >BS</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={recibido_bs} onChange={(e)=>changeRecibido(e.target.value,"recibido_bs")} placeholder="BS"/></div>
                                </div>
                              </div>
                            </div>

                            <div className="col p-0">
                              <div className={(recibido_cop!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer" >COP</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={recibido_cop} onChange={(e)=>changeRecibido(e.target.value,"recibido_cop")} placeholder="COP"/></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </td>
                      <td className="align-middle text-right">
                        Pagado
                        <br/>
                        <span className="text-success fs-2 fw-bold">
                          {recibido_tot}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col p-0">
                              <div className={(cambio_dolar!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer " onClick={setVueltodolar} >$</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={cambio_dolar} onChange={(e)=>syncCambio(e.target.value,"Dolar")} placeholder="$"/></div>
                                </div>
                              </div>
                            </div>

                            <div className="col p-0">
                              <div className={(cambio_bs!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer " onClick={setVueltobs} >BS</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={cambio_bs} onChange={(e)=>syncCambio(e.target.value,"Bolivares")} placeholder="BS"/></div>
                                </div>
                              </div>
                            </div>

                            <div className="col p-0">
                              <div className={(cambio_cop!=""?"bg-success-light card-sinapsis addref":"t-5")+(" card")}>
                                <div className="card-body p-2">
                                  <div className="card-title pointer " onClick={setVueltocop} >COP</div>
                                  <div className="card-text pago-numero"><input type="text" className="fs-3" value={cambio_cop} onChange={(e)=>syncCambio(e.target.value,"Pesos")} placeholder="COP"/></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle text-right">
                        Cambio
                        <br/>
                        <span className="text-success fs-2 fw-bold">
                          {sumCambio()}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center p-2">
                <div className="">
                  {editable?
                    <>
                    <button className="btn btn-circle text-white btn-success btn-xl me-1" onClick={facturar_pedido}>ENTER <i className="fa fa-paper-plane"></i></button>

                    <button className="btn btn-circle btn-primary text-white btn-xl me-5" onClick={facturar_e_imprimir}> 
                      CL+ETR<i className="fa fa-paper-plane"></i>
                      <i className="fa fa-print"></i>
                    </button>
                    </>
                  :null}
                  {editable?
                  <button className="btn btn-circle text-white btn-sinapsis btn-xl me-1" onClick={()=>setToggleAddPersona(true)}>F2 <i className="fa fa-user"></i></button>
                  :null}
                  <button className="btn btn-circle text-white btn-sinapsis btn-xl me-4" onClick={toggleImprimirTicket}>F3 <i className="fa fa-print"></i></button>
                  <button className="btn btn-circle text-white btn-sinapsis btn-xl me-4" onClick={viewReportPedido}>F4 <i className="fa fa-eye"></i></button>
                  {editable?
                  <button className="btn btn-circle text-white btn-danger btn-sm" onClick={del_pedido}>F5 <i className="fa fa-times"></i></button>
                  :null}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </>

      
    )
  }catch(err){
    console.log(err)
    return ""

  }
}