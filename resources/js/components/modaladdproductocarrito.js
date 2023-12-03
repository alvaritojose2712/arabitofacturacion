import { useEffect } from "react"
export default function Modaladdproductocarrito({
  toggleModalProductos,
  moneda,
  productoSelectinternouno,
  inputCantidadCarritoref,
  setCantidad,
  cantidad,
  dolar,
  setdevolucionTipo,
  devolucionTipo,
  addCarritoRequestInterno,
  ModaladdproductocarritoToggle,
  number,
}) {
  useEffect(()=>{
    if (inputCantidadCarritoref.current) {
      inputCantidadCarritoref.current.focus()
    }
  },[])
  return (
    <>
      <section className="modal-custom"> 
        <div className="text-danger" onClick={()=>toggleModalProductos(false)}><span className="closeModal">&#10006;</span></div>
        <div className="modal-content-sm modal-cantidad">
          <div className="d-flex justify-content-between p-3">
            <span className="text-success fs-2">
              {moneda(productoSelectinternouno.precio)}<br/>
            </span>
            <div className="text-right">
              <h5>{productoSelectinternouno.codigo_proveedor}</h5>
              <h4>{productoSelectinternouno.descripcion}</h4>
            </div>
          </div>
          <form onSubmit={e=>e.preventDefault()} className="d-flex justify-content-center flex-column p-3">
            <div className="input-group mb-3">
              <input type="text" ref={inputCantidadCarritoref} className="form-control fs-2" placeholder="Cantidad" onChange={(e)=>setCantidad(number(e.target.value))} value={cantidad}/>

              <div className="input-group-append text-right">
                <span className="input-group-text h-100 fs-3 text-right">
                  $. {cantidad*productoSelectinternouno.precio?moneda(cantidad*productoSelectinternouno.precio):null}<br/>
                  Bs. {cantidad*productoSelectinternouno.precio*dolar?<>{moneda(cantidad*productoSelectinternouno.precio*dolar)}</>:null}
                </span>
              </div>
              <div className="input-group-append text-right">

                <span className="input-group-text h-100 fs-3 text-right">
                Ct. {productoSelectinternouno.cantidad}
                </span>
              </div>
            </div>
            <div className="text-center mb-2">
              <button type="button" tabIndex="-1" className={("btn btn-lg btn-")+(devolucionTipo==2?"warning":"secondary")} onClick={()=>setdevolucionTipo(devolucionTipo==2?null:2)}>Cambio</button>
              <button type="button" tabIndex="-1" className={("m-3 btn btn-lg btn-")+(devolucionTipo==1?"warning":"secondary")} onClick={()=>setdevolucionTipo(devolucionTipo==1?null:1)}>Garantía</button>
            </div>
            <div className="btn-group">
              <button className="btn btn-sinapsis agregar_carrito" type="button" onClick={addCarritoRequestInterno} data-type="agregar">Agregar(enter)</button>
            </div>
          </form>
        </div>
      </section>
      <div className="overlay"></div>
    </>

    
  )
}