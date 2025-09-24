import { useEffect, useState } from 'react';
import { useHotkeys } from "react-hotkeys-hook";
import BarraPedLateral from './barraPedLateral';
import ModalAddListProductosInterno from './modalAddListProductosInterno';
export default function PagarMain({
  ModaladdproductocarritoToggle,
  productoSelectinternouno,
  devolucionTipo,
  setdevolucionTipo,
  cantidad,
  addCarritoRequestInterno,
  setproductoSelectinternouno,
  setinputqinterno,
  inputqinterno,
  refaddfast,
  tbodyproducInterref,
  productos,
  countListInter,
  setProductoCarritoInterno,
  setQProductosMain,
  setCountListInter,
  toggleModalProductos,
  inputCantidadCarritoref,
  setCantidad,
  getProductos,
  permisoExecuteEnter,
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



  getPedidosFast,
  addNewPedido,
  addRetencionesPago,
  delRetencionPago,
  user,
  view,
  changeEntregado,
  setPagoPedido,
  viewconfigcredito,
  setPrecioAlternoCarrito,
  addRefPago,
  delRefPago,
  refPago,
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
  toggleImprimirTicket,
  sendReciboFiscal,
  sendNotaCredito,
  del_pedido,
  facturar_pedido,
  inputmodaladdpersonacarritoref,
  entregarVuelto,
  setclienteInpnombre,
  setclienteInptelefono,
  setclienteInpdireccion,
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
  auth,
  togglereferenciapago,
  setToggleAddPersonaFun,
  transferirpedidoa,
  settransferirpedidoa,
  sucursalesCentral,
  setexportpedido,
  getSucursales,
  setView,
  setselectprinter,
  setmonedaToPrint,
  selectprinter,
  monedaToPrint,
  setGastoOperativo,

  changeOnlyInputBulto,
  setchangeOnlyInputBultoFun,
  printBultos,
  showXBulto,
  setshowXBulto,
}) {
  const [recibido_dolar, setrecibido_dolar] = useState("")
  const [recibido_bs, setrecibido_bs] = useState("")
  const [recibido_cop, setrecibido_cop] = useState("")
  const [cambio_dolar, setcambio_dolar] = useState("")
  const [cambio_bs, setcambio_bs] = useState("")
  const [cambio_cop, setcambio_cop] = useState("")

  const [cambio_tot_result, setcambio_tot_result] = useState("")
  const [recibido_tot, setrecibido_tot] = useState("")
  const showTittlePrice = (pu, total) => {
    try {
      return "P/U. Bs." + moneda(number(pu) * dolar) + "\n" + "Total Bs." + moneda(number(total) * dolar)

    } catch (err) {
      return ""
    }
  }
  const changeRecibido = (val, type) => {
    switch (type) {
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
      callback((bs / dolar).toFixed(4))
    }
  }
  const sumRecibido = () => {
    let vuel_dolar = parseFloat(recibido_dolar ? recibido_dolar : 0)
    let vuel_bs = parseFloat(recibido_bs ? recibido_bs : 0) / parseFloat(dolar)
    let vuel_cop = parseFloat(recibido_cop ? recibido_cop : 0) / parseFloat(peso)

    let t = (vuel_dolar + vuel_bs + vuel_cop)
    let cambio_dolar = recibido_dolar || recibido_bs || recibido_cop ? t - pedidoData.clean_total : ""


    setrecibido_tot((t).toFixed(2))
    setcambio_dolar(cambio_dolar !== "" ? cambio_dolar.toFixed(2) : "")
    setcambio_bs("")
    setcambio_cop("")
    setcambio_tot_result(cambio_dolar !== "" ? cambio_dolar.toFixed(2) : "")
  }
  const setVueltobs = () => {
    setcambio_bs((cambio_tot_result * dolar).toFixed(2))
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
    setcambio_cop((cambio_tot_result * peso).toFixed(2))
  }
  const syncCambio = (val, type) => {
    val = number(val)
    let valC = 0
    if (type == "Dolar") {
      setcambio_dolar(val)
      valC = val
    }
    else if (type == "Bolivares") {
      setcambio_bs(val)
      valC = parseFloat(val ? val : 0) / parseFloat(dolar)

    }
    else if (type == "Pesos") {
      setcambio_cop(val)
      valC = parseFloat(val ? val : 0) / parseFloat(peso)
    }



    let divisor = 0;

    let inputs = [
      { key: "Dolar", val: cambio_dolar, set: (val) => setcambio_dolar(val) },
      { key: "Bolivares", val: cambio_bs, set: (val) => setcambio_bs(val) },
      { key: "Pesos", val: cambio_cop, set: (val) => setcambio_cop(val) },
    ]

    inputs.map(e => {
      if (e.key != type) {
        if (e.val) { divisor++ }
      }
    })
    let cambio_tot_resultvalC = 0
    if (cambio_bs && cambio_dolar && type == "Pesos") {
      let bs = parseFloat(cambio_bs) / parseFloat(dolar)
      setcambio_dolar((cambio_tot_result - bs - valC).toFixed(2))
    } else {
      inputs.map(e => {
        if (e.key != type) {
          if (e.val) {
            cambio_tot_resultvalC = (cambio_tot_result - valC) / divisor
            if (e.key == "Dolar") {
              e.set((cambio_tot_resultvalC).toFixed(2))
            } else if (e.key == "Bolivares") {
              e.set((cambio_tot_resultvalC * dolar).toFixed(2))
            } else if (e.key == "Pesos") {
              e.set((cambio_tot_resultvalC * peso).toFixed(2))
            }
          }
        }
      })

    }


  }
  const sumCambio = () => {
    let vuel_dolar = parseFloat(cambio_dolar ? cambio_dolar : 0)
    let vuel_bs = parseFloat(cambio_bs ? cambio_bs : 0) / parseFloat(dolar)
    let vuel_cop = parseFloat(cambio_cop ? cambio_cop : 0) / parseFloat(peso)
    return (vuel_dolar + vuel_bs + vuel_cop).toFixed(2)
  }
  const debitoBs = (met) => {
    try {
      if (met == "debito") {
        if (debito == "") {
          return ""
        }
        return "Bs." + moneda(dolar * debito)

      }

      if (met == "transferencia") {
        if (transferencia == "") {
          return ""
        }
        return "Bs." + moneda(dolar * transferencia)

      }
      if (met == "biopago") {
        if (biopago == "") {
          return ""
        }
        return "Bs." + moneda(dolar * biopago)

      }
      if (met == "efectivo") {
        if (efectivo == "") {
          return ""
        }
        return "Bs." + moneda(dolar * efectivo)

      }

    } catch (err) {
      return ""
      console.log()
    }
  }
  const syncPago = (val, type) => {
    val = number(val)
    if (type == "Debito") {

      setDebito(val)
    }
    else if (type == "Efectivo") {
      setEfectivo(val)
    }
    else if (type == "Transferencia") {
      setTransferencia(val)
    }
    else if (type == "Credito") {
      setCredito(val)
    }
    else if (type == "Biopago") {
      setBiopago(val)
    }


    let divisor = 0;

    let inputs = [
      { key: "Debito", val: debito, set: (val) => setDebito(val) },
      { key: "Efectivo", val: efectivo, set: (val) => setEfectivo(val) },
      { key: "Transferencia", val: transferencia, set: (val) => setTransferencia(val) },
      { key: "Credito", val: credito, set: (val) => setCredito(val) },
      { key: "Biopago", val: biopago, set: (val) => setBiopago(val) },
    ]

    inputs.map(e => {
      if (e.key != type) {
        if (e.val) { divisor++ }
      }
    })

    if (autoCorrector) {
      inputs.map(e => {
        if (e.key != type) {
          if (e.val) {
            e.set(((pedidoData.clean_total - val) / divisor).toFixed(4))
          }
        }
      })
    }
  }


  useEffect(() => {
    sumRecibido()
  }, [recibido_bs, recibido_cop, recibido_dolar])

  useEffect(() => {
    getPedidosFast()
  }, [])


  //esc
  useHotkeys(
    "esc",
    () => {
      if (!toggleAddPersona) {
        setView("seleccionar");
      } else {
        setToggleAddPersona(false)
      }
    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );
  //c
  useHotkeys(
    "c",
    () => {

      getCredito();

    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );

  useHotkeys(
    "t",
    () => {

      getTransferencia();

    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );
  //b
  useHotkeys(
    "b",
    () => {

      getBio();

    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );
  //e
  useHotkeys(
    "e",
    () => {

      getEfectivo();


    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );
  //d
  useHotkeys(
    "d",
    () => {

      getDebito();

    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );
  //f5
  useHotkeys(
    "f5",
    () => {
      del_pedido();
    },
    {
      enableOnTags: ["INPUT", "SELECT"],
    },
    []
  );
  //f4
  useHotkeys(
    "f4",
    () => {
      viewReportPedido();
    },
    {
      enableOnTags: ["INPUT", "SELECT"],
    },
    []
  );
  //f3
  useHotkeys(
    "f3",
    () => {
      toggleImprimirTicket();
    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );
  //f2
  useHotkeys(
    "f2",
    () => {

      setToggleAddPersonaFun(true, () => {
        setclienteInpnombre("");
        setclienteInptelefono("");
        setclienteInpdireccion("");

        if (inputmodaladdpersonacarritoref) {
          if (inputmodaladdpersonacarritoref.current) {
            inputmodaladdpersonacarritoref.current.focus();
          }
        }
      });

    },
    { enableOnTags: ["INPUT", "SELECT"] },
    []
  );
  //enter
  useHotkeys(
    "enter",
    event => {
      if (!event.repeat) {
        facturar_e_imprimir();
      }
    },
    {
      keydown: true,
      keyup: false,
      enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
    },
    []
  );
  //f1
  useHotkeys(
    "f1",
    () => {
      if (view === "ModalAddListProductosInterno") {
        setView("pagar")
      } else {
        refaddfast.current.focus()
      }
    },
    {
      enableOnTags: ["INPUT", "SELECT"],
    },
    []
  );

  const {
    id = null,
    created_at = "",
    cliente = "",
    items = [],
    retenciones = [],
    total_des = 0,
    subtotal = 0,
    total = 0,
    total_porciento = 0,
    cop = 0,
    bs = 0,
    editable = 0,
    vuelto_entregado = 0,
    estado = 0,
    exento = 0,
    gravable = 0,
    ivas = 0,
    monto_iva = 0,
  } = pedidoData

  let ifnegative = items.filter(e => e.cantidad < 0).length
  return (
    pedidoData ?
      <div className="container-fluid" style={{ height: '100vh', overflow: 'hidden' }}>
        <div className="row h-100">
          <div className="col-lg-7" style={{ height: '100vh', overflowY: 'auto', paddingRight: '8px' }}>
            <ModalAddListProductosInterno
              auth={auth}
              refaddfast={refaddfast}
              setinputqinterno={setinputqinterno}
              inputqinterno={inputqinterno}
              tbodyproducInterref={tbodyproducInterref}
              productos={productos}
              countListInter={countListInter}
              setProductoCarritoInterno={setProductoCarritoInterno}
              moneda={moneda}
              ModaladdproductocarritoToggle={ModaladdproductocarritoToggle}
              setQProductosMain={setQProductosMain}
              setCountListInter={setCountListInter}
              toggleModalProductos={toggleModalProductos}
              productoSelectinternouno={productoSelectinternouno}
              setproductoSelectinternouno={setproductoSelectinternouno}
              inputCantidadCarritoref={inputCantidadCarritoref}
              setCantidad={setCantidad}
              cantidad={cantidad}
              number={number}
              dolar={dolar}
              setdevolucionTipo={setdevolucionTipo}
              devolucionTipo={devolucionTipo}
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
              addCarritoRequestInterno={addCarritoRequestInterno}
              getProductos={getProductos}
              setView={setView}
              pedidosFast={pedidosFast}
              onClickEditPedido={onClickEditPedido}
              pedidoData={pedidoData}
              permisoExecuteEnter={permisoExecuteEnter}
              user={user}
            />

          </div>

          <div className="col-lg-5 bg-zinc-100" style={{ height: '100vh', overflowY: 'auto', paddingLeft: '8px' }}>


            {id ? (
              <>
                <div className="relative mt-2">
                  <div className={`${estado == 1 ? "bg-green-50 border-green-200" : (estado == 2 ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200")} flex justify-between p-3 bg-white rounded border  mb-3`}>
                    <div className="flex items-center">
                      <div className="mr-3">
                        {estado == 1 ?
                          <i className="fa fa-check-circle text-green-500 text-2xl"></i> :
                          estado == 2 ?
                            <i className="fa fa-times-circle text-red-500 text-2xl"></i> :
                            <i className="fa fa-clock-o text-blue-500 text-2xl"></i>
                        }
                      </div>
                      <div>
                        <h4 className="mb-0 text-gray-800 text-sm font-medium">Pedido #{id}</h4>
                        <small className="text-gray-500 text-xs">{created_at}</small>
                      </div>
                    </div>
                    <div className="text-right">
                      <h5 className="text-orange-600 mb-1 text-xs font-medium">Total a Pagar</h5>
                      <h3 className="text-gray-800 mb-0 text-lg font-bold">{moneda(pedidoData.clean_total)}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded mb-3">
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-gray-200">
                    {items ? items.map((e, i) =>
                      e.abono && !e.producto ?
                        <tr key={e.id} className="hover:bg-gray-50">
                          <td className="px-2 py-1 text-xs text-gray-600">MOV</td>
                          <td className="px-2 py-1 text-xs">{e.abono}</td>
                          <td className="px-2 py-1 text-xs text-center">{e.cantidad}</td>
                          <td className="px-2 py-1 text-xs text-right">{e.monto}</td>
                          <td onClick={setDescuentoUnitario} data-index={e.id} className="px-2 py-1 text-xs text-right cursor-pointer hover:bg-orange-50">{e.descuento}</td>
                          <td className="px-2 py-1 text-xs text-right">{e.total_des}</td>
                          <td className="px-2 py-1 text-xs text-right font-bold">{e.total}</td>
                        </tr>
                        : <tr key={e.id} title={showTittlePrice(e.producto.precio, e.total)} className="hover:bg-gray-50">
                          <td className="px-2 py-1">
                            <div className="flex items-center space-x-2">
                              {ifnegative ?
                                <>
                                  {e.condicion == 1 ? <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">Garantía</span> : null}
                                  {e.condicion == 2 || e.condicion == 0 ? <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">Cambio</span> : null}
                                </>
                                : null
                              }
                              <span className="cursor-pointer text-xs" onClick={changeEntregado} data-id={e.id}>
                                <div className="font-mono text-gray-600">{e.producto.codigo_barras}</div>
                                <div className="font-medium text-gray-900 truncate max-w-40" title={e.producto.descripcion}>{e.producto.descripcion}</div>
                              </span>
                              {e.entregado ? <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">Entregado</span> : null}
                            </div>
                          </td>
                          <td className="px-2 py-1 text-center cursor-pointer" onClick={e.condicion == 1 ? null : setCantidadCarrito} data-index={e.id}>
                            <div className="flex items-center justify-center space-x-1">
                              {ifnegative ?
                                e.cantidad < 0
                                  ? <span className="px-1 py-0.5 bg-green-100 text-green-800 rounded text-xs"><i className="fa fa-arrow-down"></i></span>
                                  : <span className="px-1 py-0.5 bg-red-100 text-red-800 rounded text-xs"><i className="fa fa-arrow-up"></i></span>
                                : null
                              }
                              <span className="text-xs">{Number(e.cantidad) % 1 === 0 ? Number(e.cantidad) : Number(e.cantidad).toFixed(2)}</span>
                            </div>
                          </td>
                          {e.producto.precio1 ?
                            <td className="px-2 py-1 text-right text-green-600 cursor-pointer text-xs" data-iditem={e.id} onClick={setPrecioAlternoCarrito}>{e.producto.precio}</td>
                            :
                            <td className="px-2 py-1 text-right cursor-pointer text-xs">{moneda(e.producto.precio)}</td>
                          }
                          <td onClick={setDescuentoUnitario} data-index={e.id} className="px-2 py-1 text-right cursor-pointer hover:bg-orange-50 text-xs">{e.subtotal}</td>
                          <td className="px-2 py-1 text-right font-bold text-xs">{e.total}</td>
                          {editable ?
                            <td className="px-2 py-1 text-center"><i onClick={delItemPedido} data-index={e.id} className="fa fa-times text-red-500 cursor-pointer hover:text-red-700"></i></td>
                            : null
                          }
                        </tr>
                    ) : null}
                    
                    </tbody>
                  </table>
                </div>
                <div className="mb-3">
                  <div className="grid grid-cols-2 gap-2">
                          {editable ?
                            <>
                              <div className={`border rounded p-2 ${debito != "" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                                <div className="flex justify-between items-center mb-2">
                                  <div className="text-xs font-medium cursor-pointer flex items-center" onClick={getDebito}>
                                    <i className="fa fa-credit-card text-orange-500 mr-1"></i> Débito
                                  </div>
                                  <span className='cursor-pointer' data-type="toggle" onClick={() => addRefPago("toggle")}>
                                    <i className="fa fa-plus-circle text-orange-500 text-xs"></i>
                                  </span>
                                </div>
                                <div className="flex">
                                  <input type="text" className='flex-1 px-2 py-1 border border-gray-300 rounded-l text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400' value={debito} onChange={(e) => syncPago(e.target.value, "Debito")} placeholder="D" />
                                  <button className="px-2 py-1 bg-orange-500 text-white rounded-r text-xs hover:bg-orange-600" onClick={() => setPagoInBs(val => { syncPago(val, "Debito") })}>Bs</button>
                                </div>
                                {debito != "" && (
                                  <div className="text-orange-600 font-bold text-sm mt-1">{debitoBs("debito")}</div>
                                )}
                              </div>
                              <div className={`border rounded p-2 ${efectivo != "" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                                <div className="flex justify-between items-center mb-2">
                                  <div className="text-xs font-medium cursor-pointer flex items-center" onClick={getEfectivo}>
                                    <i className="fa fa-money text-green-500 mr-1"></i> Efectivo
                                  </div>
                                </div>
                                <div className="flex">
                                  <input type="text" className='flex-1 px-2 py-1 border border-gray-300 rounded-l text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400' value={efectivo} onChange={(e) => syncPago(e.target.value, "Efectivo")} placeholder="E" />
                                  <button className="px-2 py-1 bg-green-500 text-white rounded-r text-xs hover:bg-green-600" onClick={() => setPagoInBs(val => { syncPago(val, "Efectivo") })}>Bs</button>
                                </div>
                                {efectivo != "" && (
                                  <div className="text-green-600 font-bold text-sm mt-1">{debitoBs("efectivo")}</div>
                                )}
                              </div>
                              <div className={`border rounded p-2 ${transferencia != "" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                                <div className="flex justify-between items-center mb-2">
                                  <div className="text-xs font-medium cursor-pointer flex items-center" onClick={getTransferencia}>
                                    <i className="fa fa-exchange text-blue-500 mr-1"></i> Transferencia
                                  </div>
                                  <span className='cursor-pointer' data-type="toggle" onClick={() => addRefPago("toggle", transferencia, "1")}>
                                    <i className="fa fa-plus-circle text-blue-500 text-xs"></i>
                                  </span>
                                </div>
                                <div className="flex">
                                  <input type="text" className='flex-1 px-2 py-1 border border-gray-300 rounded-l text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400' value={transferencia} onChange={(e) => syncPago(e.target.value, "Transferencia")} placeholder="T" />
                                  <button className="px-2 py-1 bg-blue-500 text-white rounded-r text-xs hover:bg-blue-600" onClick={() => setPagoInBs(val => { syncPago(val, "Transferencia") })}>Bs</button>
                                </div>
                                {transferencia != "" && (
                                  <div className="text-blue-600 font-bold text-sm mt-1">{debitoBs("transferencia")}</div>
                                )}
                              </div>
                              <div className={`border rounded p-2 ${biopago != "" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                                <div className="flex justify-between items-center mb-2">
                                  <div className="text-xs font-medium cursor-pointer flex items-center" onClick={getBio}>
                                    <i className="fa fa-mobile text-purple-500 mr-1"></i> Biopago
                                  </div>
                                  <span className='cursor-pointer' data-type="toggle" onClick={() => addRefPago("toggle", biopago, "5")}>
                                    <i className="fa fa-plus-circle text-purple-500 text-xs"></i>
                                  </span>
                                </div>
                                <div className="flex">
                                  <input type="text" className='flex-1 px-2 py-1 border border-gray-300 rounded-l text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400' value={biopago} onChange={(e) => syncPago(e.target.value, "Biopago")} placeholder="B" />
                                  <button className="px-2 py-1 bg-purple-500 text-white rounded-r text-xs hover:bg-purple-600" onClick={() => setPagoInBs(val => { syncPago(val, "Biopago") })}>Bs</button>
                                </div>
                                {biopago != "" && (
                                  <div className="text-purple-600 font-bold text-sm mt-1">{debitoBs("biopago")}</div>
                                )}
                              </div>
                              <div className={`border rounded p-2 ${credito != "" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                                <div className="flex justify-between items-center mb-2">
                                  <div className="text-xs font-medium cursor-pointer flex items-center" onClick={getCredito}>
                                    <i className="fa fa-calendar text-yellow-500 mr-1"></i> Crédito
                                  </div>
                                </div>
                                <div className="flex">
                                  <input type="text" className='w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400' value={credito} onChange={(e) => syncPago(e.target.value, "Credito")} placeholder="C" />
                                </div>
                                {credito != "" && (
                                  <div className="text-yellow-600 font-bold text-sm mt-1">{credito}</div>
                                )}
                              </div>
                              <div className="flex items-center justify-center">
                                {autoCorrector ?
                                  <button className="px-3 py-1 border border-green-500 text-green-600 rounded text-xs hover:bg-green-50" onClick={() => setautoCorrector(false)}>On</button> :
                                  <button className="px-3 py-1 border border-red-500 text-red-600 rounded text-xs hover:bg-red-50" onClick={() => setautoCorrector(true)}>Off</button>
                                }
                              </div>
                            </>
                            : null}
                  </div>
                </div>

                <div className="border border-orange-400 rounded p-3 mb-3 bg-white">
                  <div className="text-gray-600 mb-2 text-xs">
                    Total a Pagar 
                    <span data-index={id} onClick={setDescuentoTotal} className="cursor-pointer ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded">
                      Desc. {total_porciento}%
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-green-600 font-bold text-2xl">{total}</span>
                    <span className="text-orange-600 font-bold text-lg">
                      <small className="text-xs">Bs.</small> {bs}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-xs">
                      COP <span data-type="cop" className='text-gray-600 font-bold cursor-pointer'>{cop}</span>
                    </div>
                  </div>

                  {pedidoData.clean_total < 0 ?
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-3 text-xs">
                      <i className="fa fa-exclamation-triangle text-yellow-600 mr-2"></i>
                      <span className="text-yellow-800">Debemos pagarle diferencia al cliente</span>
                    </div>
                    : null}
                </div>

                <div className="border border-gray-200 rounded mb-3 bg-white">
                  <div className="bg-gray-50 px-3 py-2 border-b">
                    <div className="flex justify-between items-center">
                      <h6 className="mb-0 text-xs font-medium text-gray-700">Cálculo de Vueltos</h6>
                      <div className="flex space-x-1">
                        <button className="px-2 py-1 border border-gray-300 text-gray-600 rounded text-xs hover:bg-gray-50" onClick={() => setVueltodolar()}>$</button>
                        <button className="px-2 py-1 border border-gray-300 text-gray-600 rounded text-xs hover:bg-gray-50" onClick={() => setVueltobs()}>BS</button>
                        <button className="px-2 py-1 border border-gray-300 text-gray-600 rounded text-xs hover:bg-gray-50" onClick={() => setVueltocop()}>COP</button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex">
                          <span className="px-2 py-1 bg-gray-100 border border-r-0 border-gray-300 rounded-l text-xs text-gray-600">$</span>
                          <input type="text" className="flex-1 px-2 py-1 border border-gray-300 rounded-r text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400" value={recibido_dolar} onChange={(e) => changeRecibido(e.target.value, "recibido_dolar")} placeholder="$" />
                        </div>
                        <div className="flex">
                          <span className="px-2 py-1 bg-gray-100 border border-r-0 border-gray-300 rounded-l text-xs text-gray-600">BS</span>
                          <input type="text" className="flex-1 px-2 py-1 border border-gray-300 rounded-r text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400" value={recibido_bs} onChange={(e) => changeRecibido(e.target.value, "recibido_bs")} placeholder="BS" />
                        </div>
                        <div className="flex">
                          <span className="px-2 py-1 bg-gray-100 border border-r-0 border-gray-300 rounded-l text-xs text-gray-600">COP</span>
                          <input type="text" className="flex-1 px-2 py-1 border border-gray-300 rounded-r text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400" value={recibido_cop} onChange={(e) => changeRecibido(e.target.value, "recibido_cop")} placeholder="COP" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex">
                          <span className="px-2 py-1 bg-orange-100 border border-r-0 border-orange-300 rounded-l text-xs text-orange-600 cursor-pointer" onClick={setVueltodolar}>$</span>
                          <input type="text" className="flex-1 px-2 py-1 border border-orange-300 rounded-r text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400" value={cambio_dolar} onChange={(e) => syncCambio(e.target.value, "Dolar")} placeholder="$" />
                        </div>
                        <div className="flex">
                          <span className="px-2 py-1 bg-orange-100 border border-r-0 border-orange-300 rounded-l text-xs text-orange-600 cursor-pointer" onClick={setVueltobs}>BS</span>
                          <input type="text" className="flex-1 px-2 py-1 border border-orange-300 rounded-r text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400" value={cambio_bs} onChange={(e) => syncCambio(e.target.value, "Bolivares")} placeholder="BS" />
                        </div>
                        <div className="flex">
                          <span className="px-2 py-1 bg-orange-100 border border-r-0 border-orange-300 rounded-l text-xs text-orange-600 cursor-pointer" onClick={setVueltocop}>COP</span>
                          <input type="text" className="flex-1 px-2 py-1 border border-orange-300 rounded-r text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400" value={cambio_cop} onChange={(e) => syncCambio(e.target.value, "Pesos")} placeholder="COP" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <div className="flex items-center">
                          <small className="text-gray-500 mr-2 text-xs">Recibido:</small>
                          <span className="text-green-600 font-bold text-xs">{recibido_tot}</span>
                        </div>
                        <div className="flex items-center">
                          <small className="text-gray-500 mr-2 text-xs">Vuelto:</small>
                          <span className="text-green-600 font-bold text-xs">{sumCambio()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {refPago && refPago.length > 0 && (
                  <div className="card  mb-3">
                    <div className="card-header bg-light py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Referencias Bancarias</h6>
                        <button className="btn btn-sm btn-success" onClick={addRetencionesPago}>
                          <i className="fa fa-plus me-1"></i> Retención
                        </button>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <ul className="list-group list-group-flush">
                        {refPago.map(e => (
                          <li key={e.id} className='list-group-item d-flex justify-content-between align-items-center py-2'>
                            <div className="d-flex align-items-center">
                              <span className="badge bg-light text-dark me-2">Ref.{e.descripcion}</span>
                              <small className="text-muted">({e.banco})</small>
                            </div>
                            <div className="d-flex align-items-center">
                              {e.tipo == 1 && e.monto != 0 && (
                                <span className="badge bg-info me-2">Trans. {moneda(e.monto)}</span>
                              )}
                              {e.tipo == 2 && e.monto != 0 && (
                                <span className="badge bg-secondary me-2">Deb. Bs.{moneda(e.monto)}</span>
                              )}
                              {e.tipo == 5 && e.monto != 0 && (
                                <span className="badge bg-primary me-2">Biopago. Bs.{moneda(e.monto)}</span>
                              )}
                              <button className="btn btn-sm btn-link text-danger p-0" data-id={e.id} onClick={delRefPago}>
                                <i className="fa fa-times"></i>
                              </button>
                            </div>
                          </li>
                        ))}
                        {retenciones && retenciones.length > 0 && retenciones.map(retencion => (
                          <li key={retencion.id} className='list-group-item d-flex justify-content-between align-items-center py-2 bg-light'>
                            <div className="d-flex align-items-center">
                              <span className="badge bg-light text-dark me-2">Desc.{retencion.descripcion}</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="badge bg-info me-2">Monto. {moneda(retencion.monto)}</span>
                              <button className="btn btn-sm btn-link text-danger p-0" onClick={() => delRetencionPago(retencion.id)}>
                                <i className="fa fa-times"></i>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className='mb-4'>
                  <div className="container-fluid p-0">
                    <div className="row g-2">
                      <div className="col">
                        <div className="input-group input-group-sm">
                          <span className="input-group-text bg-light">
                            <i className="fa fa-money text-primary"></i>
                          </span>
                          <select className="form-control" value={monedaToPrint} onChange={e => setmonedaToPrint(e.target.value)}>
                            <option value="bs">BS</option>
                            <option value="$">$</option>
                            <option value="cop">COP</option>
                          </select>
                        </div>
                      </div>
                      <div className="col">
                        <div className="input-group input-group-sm">
                          <span className="input-group-text bg-light">
                            <i className="fa fa-print text-primary"></i>
                          </span>
                          <select className="form-control" value={selectprinter} onChange={e => setselectprinter(e.target.value)}>
                            {[...Array(10)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>CAJA {i + 1}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {auth(1) && (
                  <div className="transfer-section mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <i className="fa fa-exchange text-primary me-2"></i>
                      <h6 className="mb-0">Transferir a Sucursal</h6>
                    </div>
                    <div className="input-group input-group-sm">
                      <button className="btn btn-outline-primary" onClick={getSucursales}>
                        <i className="fa fa-search"></i>
                      </button>
                      <select className="form-control" value={transferirpedidoa} onChange={e => settransferirpedidoa(e.target.value)}>
                        <option value="">Seleccionar Sucursal</option>
                        {sucursalesCentral.map(e => (
                          <option key={e.id} value={e.id}>{e.nombre}</option>
                        ))}
                      </select>
                      <button className="btn btn-primary" onClick={setexportpedido}>
                        <i className="fa fa-paper-plane me-1"></i>
                        Transferir
                      </button>
                    </div>
                  </div>
                )}

                <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 py-2 px-4 bg-white rounded-full mb-2 border border-gray-300 shadow-lg" style={{
                  zIndex: 1000
                }}>
                  <div className="flex space-x-2 items-center">
                      {editable ?
                        <>
                          <button className="px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 text-xs font-medium" onClick={facturar_pedido} title="Facturar e Imprimir">
                            <i className="fa fa-paper-plane mr-1"></i>
                            <i className="fa fa-print"></i>
                          </button>
                          <button className="px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs font-medium" onClick={facturar_e_imprimir} title="Facturar">
                            <i className="fa fa-paper-plane"></i>
                          </button>
                        </>
                        : null}
                      {editable ?
                        <>
                          <button className="px-3 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 text-xs font-medium" onClick={() => setToggleAddPersona(true)} title="Cliente (F2)">
                            <i className="fa fa-user"></i>
                          </button>
                          <button className="px-3 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 text-xs font-medium" onClick={() => toggleImprimirTicket()} title="Imprimir (F3)">
                            <i className="fa fa-print mr-1"></i>{pedidoData.ticked}
                          </button>
                          <button className="px-3 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 text-xs font-medium" onClick={() => sendReciboFiscal()} title="Recibo Fiscal">
                            <i className="fa fa-file-text"></i>
                          </button>
                        </>
                        : null}
                      {pedidoData.fiscal == 1 ?
                        <button className="px-3 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 text-xs font-medium" title="Nota de Crédito" onClick={() => sendNotaCredito()}>
                          <i className="fa fa-undo"></i>
                        </button>
                        : null}

                      <button className="px-3 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 text-xs font-medium" onClick={() => viewReportPedido()} title="Ver Pedido (F4)">
                        <i className="fa fa-eye"></i>
                      </button>
                      <button className="px-3 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 text-xs font-medium" onClick={() => printBultos()} title="Imprimir Bultos">
                        <i className="fa fa-print"></i>
                      </button>
                  </div>
                </div>

              </>
            ) : (
              // Empty State
              <div className="d-flex flex-column align-items-center justify-content-center text-center p-5" style={{ height: '100%' }}>
                <div className="mb-4">
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '120px', height: '120px' }}>
                    <i className="fa fa-shopping-cart text-muted" style={{ fontSize: '3.5rem' }}></i>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-muted mb-2 fw-normal">Ningún pedido seleccionado</h3>
                  <p className="text-muted mb-0" style={{ maxWidth: '300px', lineHeight: '1.5' }}>
                    Selecciona un pedido de la lista lateral para ver los detalles de pago y procesar la facturación.
                  </p>
                </div>

                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center text-muted small">
                    <i className="fa fa-lightbulb-o me-2 text-warning"></i>
                    <span>Haz clic en cualquier pedido para comenzar</span>
                  </div>
                  <div className="d-flex align-items-center text-muted small">
                    <i className="fa fa-keyboard-o me-2 text-info"></i>
                    <span>Usa F2, F3, F4 para acciones rápidas</span>
                  </div>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
      : null
  )
}