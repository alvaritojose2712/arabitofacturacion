import { useEffect } from "react";
import Modaladdproductocarrito from './Modaladdproductocarrito'; 
import ListProductosInterno from './listProductosInterno'; 
import BarraPedLateral from './barraPedLateral'; 

export default function ModalAddListProductosInterno({
  auth,
  refaddfast,
  setinputqinterno,
  inputqinterno,
  tbodyproducInterref,
  productos,
  countListInter,
  setProductoCarritoInterno,
  moneda,
  ModaladdproductocarritoToggle,
  setQProductosMain,
  setCountListInter,
  toggleModalProductos,
  productoSelectinternouno,
  setproductoSelectinternouno,
  inputCantidadCarritoref,
  setCantidad,
  cantidad,
  number,
  dolar,
  setdevolucionTipo,
  devolucionTipo,
  addCarritoRequestInterno,
  getProductos,
  setView,
  pedidosFast,
  onClickEditPedido,
  pedidoData,
  permisoExecuteEnter,
}){
  

  useEffect(()=>{
    if (refaddfast) {
      if (refaddfast.current) {
        refaddfast.current.value = ""
        refaddfast.current.focus()
      }
    }
  },[]);
  useEffect(()=>{
    getProductos(inputqinterno,true)
  },[inputqinterno]);
    

    return (

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-auto p-0">
            <BarraPedLateral
              pedidosFast={pedidosFast}
              onClickEditPedido={onClickEditPedido}
              id={pedidoData.id}
            />
          </div>
          <div className="col">
            <div className="container-fluid">
              
              {productoSelectinternouno ? 
                  <Modaladdproductocarrito
                    toggleModalProductos={toggleModalProductos}
                    moneda={moneda}
                    productoSelectinternouno={productoSelectinternouno}
                    setproductoSelectinternouno={setproductoSelectinternouno}
                    inputCantidadCarritoref={inputCantidadCarritoref}
                    setCantidad={setCantidad}
                    cantidad={cantidad}
                    number={number}
                    dolar={dolar}
                    setdevolucionTipo={setdevolucionTipo}
                    devolucionTipo={devolucionTipo}
                    addCarritoRequestInterno={addCarritoRequestInterno}
                    ModaladdproductocarritoToggle={ModaladdproductocarritoToggle}
                  />:
                  <ListProductosInterno
                    auth={auth}
                    refaddfast={refaddfast}
                    setinputqinterno={setinputqinterno}
                    inputqinterno={inputqinterno}
                    tbodyproducInterref={tbodyproducInterref}
                    productos={productos}
                    countListInter={countListInter}
                    setProductoCarritoInterno={setProductoCarritoInterno}
                    moneda={moneda}
                    setCountListInter={setCountListInter}
                    setView={setView}
                    permisoExecuteEnter={permisoExecuteEnter}
                  />
                }
            </div>
          </div>
        </div>
      </div>
    )
}