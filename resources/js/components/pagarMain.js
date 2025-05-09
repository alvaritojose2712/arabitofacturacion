import { useEffect, useState } from 'react';
import { useHotkeys } from "react-hotkeys-hook";
import BarraPedLateral from './barraPedLateral';

export default function PagarMain({
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
}){
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
      callback((bs / dolar).toFixed(2))
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
            e.set(((pedidoData.clean_total - val) / divisor).toFixed(2))
          }
        }
      })
    }
  }

  
  useEffect(() => {
    sumRecibido()
  }, [recibido_bs, recibido_cop, recibido_dolar])


  //esc
  useHotkeys(
    "esc",
    () => {
      if (!toggleAddPersona) {
          setView("seleccionar");
      }else{
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
    {enableOnTags: ["INPUT", "SELECT"]},
    []
  );
  //enter
  useHotkeys(
    "enter",
    event => {
      if(!event.repeat){
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
      }else{
        setView("ModalAddListProductosInterno")
      }
    },
    {
        enableOnTags: ["INPUT", "SELECT"],
    },
    []
  ); 
  
  const {
    id=null,
    created_at="",
    cliente="",
    items=[],
    retenciones=[],
    total_des=0,
    subtotal=0,
    total=0,
    total_porciento=0,
    cop=0,
    bs=0,
    editable=0,
    vuelto_entregado=0,
    estado=0,
    exento=0,
    gravable=0,
    ivas=0,
    monto_iva=0,
  } = pedidoData

    let ifnegative = items.filter(e => e.cantidad < 0).length
    return(
        pedidoData?
            <div className="container-fluid mb-5">
                <div className="row">
                    <div className="col-md-auto p-0">
                        <BarraPedLateral
                            pedidosFast={pedidosFast}
                            onClickEditPedido={onClickEditPedido}
                            id={id}
                        />
                    </div>
                    <div className="col">
                        <div className="position-relative">
                            <div className={(estado==1 ? "bg-success-light" : (estado==2 ? "bg-danger-light" : "bg-primary-light")) + (" d-flex justify-content-between p-3 rounded shadow-sm mb-3")}>
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        {estado == 1 ? 
                                            <i className="fa fa-check-circle text-success fa-3x"></i> :
                                            estado == 2 ? 
                                            <i className="fa fa-times-circle text-danger fa-3x"></i> :
                                            <i className="fa fa-clock-o text-primary fa-3x"></i>
                                        }
                                    </div>
                                    <div>
                                        <h4 className="mb-0 text-dark">Pedido #{id}</h4>
                                        <small className="text-muted">{created_at}</small>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <h5 className="text-primary mb-1">Total a Pagar</h5>
                                    <h3 className="text-dark mb-0">{moneda(pedidoData.clean_total)}</h3>
                                </div>
                            </div>

                            <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                                <table className="table table-hover table-striped align-middle">
                                    <thead className="bg-primary text-white sticky-top">
                                        <tr>
                                            <th style={{ width: '100px' }}>Código</th>
                                            <th>Producto</th>
                                            <th style={{ width: '80px', textAlign: 'center' }}>CT</th>
                                            {auth(1) ? <th style={{ width: '100px', textAlign: 'right' }}>BASE</th> : null}
                                            <th style={{ width: '100px', textAlign: 'right' }}>PRECIO</th>
                                            <th style={{ width: '100px', textAlign: 'right' }}>SUBTOTAL</th>
                                            <th style={{ width: '80px', textAlign: 'right' }}>%</th>
                                            <th style={{ width: '100px', textAlign: 'right' }}>TOTAL</th>
                                            {editable ? <th style={{ width: '50px' }}></th> : null}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items ? items.map((e, i) =>
                                        e.abono && !e.producto ?
                                            <tr key={e.id} className="align-middle">
                                                <td>MOV</td>
                                                <td>{e.abono}</td>
                                                <td>{e.cantidad}</td>
                                                <td>{e.monto}</td>
                                                <td onClick={setDescuentoUnitario} data-index={e.id} className="pointer">{e.descuento}</td>
                                                <td>{e.subtotal}</td>
                                                <td>{e.total_des}</td>
                                                <th className="fw-bold">{e.total}</th>
                                            </tr>
                                            : <tr key={e.id} title={showTittlePrice(e.producto.precio, e.total)} className="align-middle">
                                                {showXBulto?
                                                    <td>
                                                        <input type="text" className='form-control form-control-sm' value={changeOnlyInputBulto[e.id]?changeOnlyInputBulto[e.id]:""} onChange={event=>setchangeOnlyInputBultoFun(event.target.value,e.id)}/>
                                                    </td>
                                                :null}
                                                <td className="text-nowrap">{e.producto.codigo_barras}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {ifnegative ?
                                                            <>
                                                                {e.condicion == 1 ? <span className="badge bg-warning me-2">Garantía</span> : null}
                                                                {e.condicion == 2 || e.condicion == 0 ? <span className="badge bg-info me-2">Cambio</span> : null}
                                                            </>
                                                            : null
                                                        }
                                                        <span className="pointer" onClick={changeEntregado} data-id={e.id}>{e.producto.descripcion}</span>
                                                        {e.entregado ? <span className="badge bg-secondary ms-2">Entregado</span> : null}
                                                    </div>
                                                </td>
                                                <td className="pointer text-center" onClick={e.condicion == 1 ? null : setCantidadCarrito} data-index={e.id}>
                                                    {ifnegative ?
                                                        e.cantidad < 0
                                                            ? <span className="badge bg-success me-2"><i className="fa fa-arrow-down"></i></span>
                                                            : <span className="badge bg-danger me-2"><i className="fa fa-arrow-up"></i></span>
                                                        : null
                                                    }
                                                    {e.cantidad.replace(".00", "")}
                                                </td>
                                                {auth(1) ? <th className="pointer text-end">{moneda(e.producto.precio_base)}</th> : null}
                                                {e.producto.precio1 ?
                                                    <td className="text-success pointer text-end" data-iditem={e.id} onClick={setPrecioAlternoCarrito}>{e.producto.precio}</td>
                                                    :
                                                    <td className="pointer text-end">{moneda(e.producto.precio)}</td>
                                                }
                                                <td onClick={setDescuentoUnitario} data-index={e.id} className="pointer text-end">{e.subtotal}</td>
                                                <td onClick={setDescuentoUnitario} data-index={e.id} className="pointer text-end">{e.descuento}</td>
                                                <th className="fw-bold text-end">{e.total}</th>
                                                {editable ?
                                                    <td className="text-center"><i onClick={delItemPedido} data-index={e.id} className="fa fa-times text-danger pointer"></i></td>
                                                    : null
                                                }
                                            </tr>
                                        ) : null}
                                        <tr className="table-secondary">
                                            <td><button className="btn btn-outline-primary btn-sm" onDoubleClick={()=>setshowXBulto(true)}>{items ? items.length : null}</button></td>
                                            <th colSpan={auth(1) ? "8" : "7"} className="p-2">{cliente ? cliente.nombre : null} <b>{cliente ? cliente.identificacion : null}</b></th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-4">
                        <div className="mb-3">
                            <div className="row g-2">
                                <div className="col-12">
                                    <div className="container-fluid p-0">
                                        <div className="row g-2">
                                            {editable ?
                                                <>
                                                    <div className="col-6">
                                                        <div className={`card shadow-sm h-100 ${debito != "" ? "bg-success-light" : "bg-light"}`}>
                                                            <div className="card-body p-2">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="card-title mb-0 pointer" onClick={getDebito}>
                                                                        <i className="fa fa-credit-card text-primary me-1"></i> Débito
                                                                    </div>
                                                                    <span className='ref pointer' data-type="toggle" onClick={() => addRefPago("toggle")}>
                                                                        <i className="fa fa-plus-circle text-primary"></i>
                                                                    </span>
                                                                </div>
                                                                <div className="input-group input-group-sm mt-1">
                                                                    <input type="text" className='form-control' value={debito} onChange={(e) => syncPago(e.target.value, "Debito")} placeholder="D" />
                                                                    <button className="btn btn-primary" onClick={() => setPagoInBs(val => {syncPago(val, "Debito")})}>Bs</button>
                                                                </div>
                                                                {debito != "" && (
                                                                    <div className="text-primary fw-bold fs-4 mt-1">{debitoBs("debito")}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className={`card shadow-sm h-100 ${efectivo != "" ? "bg-success-light" : "bg-light"}`}>
                                                            <div className="card-body p-2">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="card-title mb-0 pointer" onClick={getEfectivo}>
                                                                        <i className="fa fa-money text-success me-1"></i> Efectivo
                                                                    </div>
                                                                </div>
                                                                <div className="input-group input-group-sm mt-1">
                                                                    <input type="text" className='form-control' value={efectivo} onChange={(e) => syncPago(e.target.value, "Efectivo")} placeholder="E" />
                                                                    <button className="btn btn-success" onClick={() => setPagoInBs(val => {syncPago(val, "Efectivo")})}>Bs</button>
                                                                </div>
                                                                {efectivo != "" && (
                                                                    <div className="text-success fw-bold fs-4 mt-1">{debitoBs("efectivo")}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className={`card shadow-sm h-100 ${transferencia != "" ? "bg-success-light" : "bg-light"}`}>
                                                            <div className="card-body p-2">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="card-title mb-0 pointer" onClick={getTransferencia}>
                                                                        <i className="fa fa-exchange text-info me-1"></i> Transferencia
                                                                    </div>
                                                                    <span className='ref pointer' data-type="toggle" onClick={() => addRefPago("toggle", transferencia, "1")}>
                                                                        <i className="fa fa-plus-circle text-info"></i>
                                                                    </span>
                                                                </div>
                                                                <div className="input-group input-group-sm mt-1">
                                                                    <input type="text" className='form-control' value={transferencia} onChange={(e) => syncPago(e.target.value, "Transferencia")} placeholder="T" />
                                                                    <button className="btn btn-info" onClick={() => setPagoInBs(val => {syncPago(val, "Transferencia")})}>Bs</button>
                                                                </div>
                                                                {transferencia != "" && (
                                                                    <div className="text-info fw-bold fs-4 mt-1">{debitoBs("transferencia")}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className={`card shadow-sm h-100 ${biopago != "" ? "bg-success-light" : "bg-light"}`}>
                                                            <div className="card-body p-2">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="card-title mb-0 pointer" onClick={getBio}>
                                                                        <i className="fa fa-mobile text-primary me-1"></i> Biopago
                                                                    </div>
                                                                    <span className='ref pointer' data-type="toggle" onClick={() => addRefPago("toggle", biopago, "5")}>
                                                                        <i className="fa fa-plus-circle text-primary"></i>
                                                                    </span>
                                                                </div>
                                                                <div className="input-group input-group-sm mt-1">
                                                                    <input type="text" className='form-control' value={biopago} onChange={(e) => syncPago(e.target.value, "Biopago")} placeholder="B" />
                                                                    <button className="btn btn-primary" onClick={() => setPagoInBs(val => {syncPago(val, "Biopago")})}>Bs</button>
                                                                </div>
                                                                {biopago != "" && (
                                                                    <div className="text-primary fw-bold fs-4 mt-1">{debitoBs("biopago")}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className={`card shadow-sm h-100 ${credito != "" ? "bg-success-light" : "bg-light"}`}>
                                                            <div className="card-body p-2">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="card-title mb-0 pointer" onClick={getCredito}>
                                                                        <i className="fa fa-calendar text-warning me-1"></i> Crédito
                                                                    </div>
                                                                </div>
                                                                <div className="input-group input-group-sm mt-1">
                                                                    <input type="text" className='form-control' value={credito} onChange={(e) => syncPago(e.target.value, "Credito")} placeholder="C" />
                                                                </div>
                                                                {credito != "" && (
                                                                    <div className="text-warning fw-bold fs-4 mt-1">{credito}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                      {autoCorrector ?
                                                          <button className="btn btn-outline-success btn-sm scale05" onClick={() => setautoCorrector(false)}>On</button> :
                                                          <button className="btn btn-outline-danger btn-sm scale05" onClick={() => setautoCorrector(true)}>Off</button>
                                                      }
                                                    </div>
                                                </>
                                            : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-lg border-primary mb-3">
                            <div className="card-body p-3">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <div className="text-muted mb-1">Total a Pagar <span data-index={id} onClick={setDescuentoTotal} className="pointer clickme">Desc. {total_porciento}%</span></div>
                                        <div className="d-flex align-items-baseline">
                                            <span className="text-success fw-bold display-4 me-2">{total}</span>
                                            <span className="text-primary fw-bold display-5">Bs {bs}</span>
                                            
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <div className="text-muted mb-1">COP</div>
                                        <span data-type="cop" className='fs-6 text-muted fw-bold pointer d-block opacity-75'>{cop}</span>
                                    </div>
                                </div>

                                {pedidoData.clean_total < 0 ?
                                    <div className="alert alert-warning mt-3 mb-0">
                                        <i className="fa fa-exclamation-triangle me-2"></i>
                                        Debemos pagarle diferencia al cliente
                                    </div>
                                : null}
                            </div>
                        </div>

                        <div className="card shadow-sm mb-3">
                            <div className="card-header bg-light py-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">Cálculo de Vueltos</h6>
                                    <div className="btn-group btn-group-sm">
                                        <button className="btn btn-outline-secondary" onClick={() => setVueltodolar()}>$</button>
                                        <button className="btn btn-outline-secondary" onClick={() => setVueltobs()}>BS</button>
                                        <button className="btn btn-outline-secondary" onClick={() => setVueltocop()}>COP</button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-2">
                                <div className="row g-2">
                                    <div className="col-12">
                                        <div className="row g-2">
                                            <div className="col">
                                                <div className="input-group input-group-sm">
                                                    <span className="input-group-text">$</span>
                                                    <input type="text" className="form-control" value={recibido_dolar} onChange={(e) => changeRecibido(e.target.value, "recibido_dolar")} placeholder="$" />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="input-group input-group-sm">
                                                    <span className="input-group-text">BS</span>
                                                    <input type="text" className="form-control" value={recibido_bs} onChange={(e) => changeRecibido(e.target.value, "recibido_bs")} placeholder="BS" />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="input-group input-group-sm">
                                                    <span className="input-group-text">COP</span>
                                                    <input type="text" className="form-control" value={recibido_cop} onChange={(e) => changeRecibido(e.target.value, "recibido_cop")} placeholder="COP" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="row g-2">
                                            <div className="col">
                                                <div className="input-group input-group-sm">
                                                    <span className="input-group-text pointer" onClick={setVueltodolar}>$</span>
                                                    <input type="text" className="form-control" value={cambio_dolar} onChange={(e) => syncCambio(e.target.value, "Dolar")} placeholder="$" />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="input-group input-group-sm">
                                                    <span className="input-group-text pointer" onClick={setVueltobs}>BS</span>
                                                    <input type="text" className="form-control" value={cambio_bs} onChange={(e) => syncCambio(e.target.value, "Bolivares")} placeholder="BS" />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="input-group input-group-sm">
                                                    <span className="input-group-text pointer" onClick={setVueltocop}>COP</span>
                                                    <input type="text" className="form-control" value={cambio_cop} onChange={(e) => syncCambio(e.target.value, "Pesos")} placeholder="COP" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <small className="text-muted me-2">Recibido:</small>
                                                <span className="text-success fw-bold">{recibido_tot}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <small className="text-muted me-2">Vuelto:</small>
                                                <span className="text-success fw-bold">{sumCambio()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {refPago && refPago.length > 0 && (
                            <div className="card shadow-sm mb-3">
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
                                  <select className="form-control" value={monedaToPrint} onChange={e=>setmonedaToPrint(e.target.value)}>
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
                                  <select className="form-control" value={selectprinter} onChange={e=>setselectprinter(e.target.value)}>
                                    {[...Array(10)].map((_, i) => (
                                      <option key={i+1} value={i+1}>CAJA {i+1}</option>
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

                        <div className="position-fixed" style={{ 
                            bottom: '0', 
                            left: '0', 
                            right: '0', 
                            backgroundColor: 'white', 
                            padding: '1rem', 
                            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                            zIndex: 1000
                        }}>
                            <div className="container-fluid">
                                <div className="row g-2 justify-content-center">
                                    {editable ?
                                    <>
                                        <div className="col-auto">
                                            <button className="btn btn-success" onClick={facturar_pedido} title="Facturar e Imprimir">
                                                <i className="fa fa-paper-plane"></i>
                                                <i className="fa fa-print ms-1"></i>
                                            </button>
                                        </div>
                                        <div className="col-auto">
                                            <button className="btn btn-primary" onClick={facturar_e_imprimir} title="Facturar">
                                                <i className="fa fa-paper-plane"></i>
                                            </button>
                                        </div>
                                    </>
                                    : null}
                                    {editable ?
                                    <>
                                        <div className="col-auto">
                                            <button className="btn btn-primary" onClick={() => setToggleAddPersona(true)} title="Cliente (F2)">
                                                <i className="fa fa-user"></i>
                                            </button>
                                        </div>
                                        <div className="col-auto">
                                            <button className="btn btn-primary" onClick={()=>toggleImprimirTicket()} title="Imprimir (F3)">
                                                <i className="fa fa-print"></i>
                                            </button>
                                        </div>
                                        <div className="col-auto">
                                            <button className="btn btn-dark text-light" onClick={()=>sendReciboFiscal()} title="Recibo Fiscal">
                                                <i className="fa fa-file-text"></i>
                                            </button>
                                        </div>
                                        {pedidoData.fiscal==1?
                                          <div className="col-auto">
                                            <button className="btn text-white btn-dark text-light btn-xl me-4" title="Nota de Crédito" onClick={()=>sendNotaCredito()}>
                                                <i className="fa fa-undo"></i>
                                            </button>
                                          </div>
                                        :null}
                                    </>
                                    : null}
                                   
                                    <div className="col-auto">
                                        <button className="btn btn-primary" onClick={()=>viewReportPedido()} title="Ver Pedido (F4)">
                                            <i className="fa fa-eye"></i>
                                        </button>
                                    </div>
                                    <div className="col-auto">
                                        <button className="btn btn-warning" onClick={()=>printBultos()} title="Imprimir Bultos">
                                            <i className="fa fa-print"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        :null
    )
}