import { useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook";

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
  number,
  setproductoSelectinternouno,

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
}) {
  useEffect(()=>{
    if (inputCantidadCarritoref.current) {
      inputCantidadCarritoref.current.focus()
    }
  },[])
  //enter
  useHotkeys(
    "enter",
    (event) => {
      if(!event.repeat){
        addCarritoRequestInterno(event)
      }
    },
    {
        keydown: true,
        keyup: false,
        filterPreventDefault: false,
        enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
    },
    []
  );
  //esc
  useHotkeys(
    "esc",
    () => {
      setproductoSelectinternouno(null)
    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );

  
  return (
    <>
      <section className="modal-custom"> 
        <div className="text-danger" onClick={()=>toggleModalProductos(null)}><span className="closeModal">&#10006;</span></div>
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
          <div className="d-flex justify-content-center flex-column p-3">
            
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
            <div className="btn-group mb-2 w-100">
              <button className="btn btn-sinapsis agregar_carrito" type="button" onClick={addCarritoRequestInterno} data-type="agregar">Agregar(enter)</button>
            </div>
            
            

            <div className="text-center">
              <button type="button" tabIndex="-1" className={("btn btn-lg btn-")+(devolucionTipo==2?"warning":"secondary")} onClick={()=>setdevolucionTipo(devolucionTipo==2?null:2)}>Cambio</button>
              <button type="button" tabIndex="-1" className={("m-3 btn btn-lg btn-")+(devolucionTipo==1?"warning":"secondary")} onClick={()=>setdevolucionTipo(devolucionTipo==1?null:1)}>Garantía</button>
            </div>
          </div>
        </div>
      </section>
      <div className="overlay"></div>
    </>
  )
}