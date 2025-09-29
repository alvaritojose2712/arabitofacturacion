import { useEffect } from "react";
import Modaladdproductocarrito from './Modaladdproductocarrito'; 
import ListProductosInterno from './listProductosInterno';
import { useApp } from '../contexts/AppContext'; 
import BarraPedLateral from './barraPedLateral'; 

export default function ModalAddListProductosInterno({
  cedula_referenciapago,
  setcedula_referenciapago,
  telefono_referenciapago,
  settelefono_referenciapago,
  togglereferenciapago,
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
  addCarritoRequestInterno,
  getProductos,
  setView,
  pedidosFast,
  onClickEditPedido,
  pedidoData,
  permisoExecuteEnter,
  user,
  devolucion_numfactoriginal,
  db,
  notificar,
  getPedido,
  // Props para ordenamiento
  orderColumn,
  setOrderColumn,
  orderBy,
  setOrderBy,
}){
  // Usar el context para acceder a activeProductCart
  const { activeProductCart } = useApp();

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

        <div className="">
              {productoSelectinternouno && !activeProductCart ? 
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

                    devolucionMotivo={devolucionMotivo}
                    setdevolucionMotivo={setdevolucionMotivo}
                    devolucion_cantidad_salida={devolucion_cantidad_salida}
                    setdevolucion_cantidad_salida={setdevolucion_cantidad_salida}
                    devolucion_motivo_salida={devolucion_motivo_salida}
                    setdevolucion_motivo_salida={setdevolucion_motivo_salida}
                    devolucion_ci_cajero={devolucion_ci_cajero}
                    setdevolucion_ci_cajero={setdevolucion_ci_cajero}
                    devolucion_ci_autorizo={devolucion_ci_autorizo}
                    setdevolucion_ci_autorizo={setdevolucion_ci_autorizo}
                    devolucion_dias_desdecompra={devolucion_dias_desdecompra}
                    setdevolucion_dias_desdecompra={setdevolucion_dias_desdecompra}
                    devolucion_ci_cliente={devolucion_ci_cliente}
                    setdevolucion_ci_cliente={setdevolucion_ci_cliente}
                    devolucion_telefono_cliente={devolucion_telefono_cliente}
                    setdevolucion_telefono_cliente={setdevolucion_telefono_cliente}
                    devolucion_nombre_cliente={devolucion_nombre_cliente}
                    setdevolucion_nombre_cliente={setdevolucion_nombre_cliente}
                    devolucion_nombre_cajero={devolucion_nombre_cajero}
                    setdevolucion_nombre_cajero={setdevolucion_nombre_cajero}
                    devolucion_nombre_autorizo={devolucion_nombre_autorizo}
                    setdevolucion_nombre_autorizo={setdevolucion_nombre_autorizo}
                    devolucion_trajo_factura={devolucion_trajo_factura}
                    setdevolucion_trajo_factura={setdevolucion_trajo_factura}
                    devolucion_motivonotrajofact={devolucion_motivonotrajofact}
                    setdevolucion_motivonotrajofact={setdevolucion_motivonotrajofact}
                  />:
                  <ListProductosInterno
                    auth={auth}
                    refaddfast={refaddfast}
                    cedula_referenciapago={cedula_referenciapago}
                    setcedula_referenciapago={setcedula_referenciapago}
                    telefono_referenciapago={telefono_referenciapago}
                    settelefono_referenciapago={settelefono_referenciapago}
                    setinputqinterno={setinputqinterno}
                    inputqinterno={inputqinterno}
                    tbodyproducInterref={tbodyproducInterref}
                    productos={productos}
                    countListInter={countListInter}
                    moneda={moneda}
                    setCountListInter={setCountListInter}
                    setView={setView}
                    permisoExecuteEnter={permisoExecuteEnter}
                    user={user}
                    inputCantidadCarritoref={inputCantidadCarritoref}
                    setCantidad={setCantidad}
                    cantidad={cantidad}
                    number={number}
                    dolar={dolar}
                    addCarritoRequestInterno={addCarritoRequestInterno}
                    setproductoSelectinternouno={setproductoSelectinternouno}
                    devolucionTipo={devolucionTipo}
                    pedidoData={pedidoData}
                    devolucionMotivo={devolucionMotivo}
                    devolucion_cantidad_salida={devolucion_cantidad_salida}
                    devolucion_motivo_salida={devolucion_motivo_salida}
                    devolucion_ci_cajero={devolucion_ci_cajero}
                    devolucion_ci_autorizo={devolucion_ci_autorizo}
                    devolucion_dias_desdecompra={devolucion_dias_desdecompra}
                    devolucion_ci_cliente={devolucion_ci_cliente}
                    devolucion_telefono_cliente={devolucion_telefono_cliente}
                    devolucion_nombre_cliente={devolucion_nombre_cliente}
                    devolucion_nombre_cajero={devolucion_nombre_cajero}
                    devolucion_nombre_autorizo={devolucion_nombre_autorizo}
                    devolucion_trajo_factura={devolucion_trajo_factura}
                    devolucion_motivonotrajofact={devolucion_motivonotrajofact}
                    devolucion_numfactoriginal={devolucion_numfactoriginal}
                    db={db}
                    notificar={notificar}
                    getPedido={getPedido}
                    pedidosFast={pedidosFast}
                    onClickEditPedido={onClickEditPedido}
                    togglereferenciapago={togglereferenciapago}
                    orderColumn={orderColumn}
                    setOrderColumn={setOrderColumn}
                    orderBy={orderBy}
                    setOrderBy={setOrderBy}
                    getProductos={getProductos}
                  />
                }
        </div>
    )
}