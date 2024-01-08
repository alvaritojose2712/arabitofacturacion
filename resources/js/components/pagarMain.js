import { useEffect, useState } from 'react';
import { useHotkeys } from "react-hotkeys-hook";
import BarraPedLateral from './barraPedLateral';

export default function PagarMain({
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
    refaddfast,
    inputqinterno,
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

  useEffect(()=>{
    if (user.usuario) {
      let lastchar = user.usuario.slice(-1)
      if (
          lastchar == 1 ||
          lastchar == 2 ||
          lastchar == 3 ||
          lastchar == 4 ||
          lastchar == 5 ||
          lastchar == 6 ||
          lastchar == 7 ||
          lastchar == 8 ||
          lastchar == 9 ||
          lastchar == 10
      ) {
          setselectprinter(lastchar)
      }
    }
  },[])

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
              if (document.activeElement !== refaddfast.current) {
                  if (inputqinterno == "" && !togglereferenciapago) {
                      getCredito();
                  }
              }
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
              if (document.activeElement !== refaddfast.current) {
                  if (inputqinterno == "" && !togglereferenciapago) {
                      getTransferencia();
                  }
              }
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
              if (document.activeElement !== refaddfast.current) {
                  if (inputqinterno == "" && !togglereferenciapago) {
                      getBio();
                  }
              }
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
              if (document.activeElement !== refaddfast.current) {
                  if (inputqinterno == "" && !togglereferenciapago) {
                      getEfectivo();
                  }
              }

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
        if (document.activeElement !== refaddfast.current) {
            if (inputqinterno == "" && !togglereferenciapago) {
                getDebito();
            }
        }
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
    () => {
        facturar_e_imprimir();
    },
    {
        filterPreventDefault: false,
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
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-auto p-0">
                      <BarraPedLateral
                        pedidosFast={pedidosFast}
                        onClickEditPedido={onClickEditPedido}
                        id={id}
                      />
                    </div>
                    <div className="col">
                        <div className={(estado ? "bg-success-light" : "bg-sinapsis") + (" d-flex justify-content-between p-1 rounded")}>
                        <span className='fs-5'>Pedido #{id}</span>
                        <span className='pull-right'>{created_at}</span>
                        </div>
                        
                        <table className="table table-striped text-center">
                        <thead>
                            <tr>
                            <th className="text-sinapsis cell2">Código</th>
                            <th className="text-sinapsis cell3">Producto</th>
                            <th className="text-sinapsis cell1">Ct.</th>
                            {auth(1) ? <th className="text-sinapsis cell1">PBase</th> : null}

                            <th className="text-sinapsis cell1">PVenta</th>

                            <th className="text-sinapsis">SubTotal</th>
                            <th className="text-sinapsis">Desc.%</th>


                            <th className="text-sinapsis cell2">Total</th>

                            </tr>
                        </thead>
                        <tbody>
                            {items ? items.map((e, i) =>
                            e.abono && !e.producto ?
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
                                : <tr key={e.id} title={showTittlePrice(e.producto.precio, e.total)}>
                                <td className="align-middle">{e.producto.codigo_barras}</td>
                                <td className="align-middle">

                                    {
                                    ifnegative ?
                                        <>
                                        {
                                            e.condicion == 1
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
                                        : <span className="me-2 btn btn-outline-danger btn-sm-sm"> <i className="fa fa-arrow-up"></i></span>
                                    : null}
                                    {e.cantidad.replace(".00", "")}

                                </td>
                                {auth(1) ? <th className="pointer align-middle">{moneda(e.producto.precio_base)}</th> : null}
                                {e.producto.precio1 ?
                                    <td className="align-middle text-success pointer" data-iditem={e.id} onClick={setPrecioAlternoCarrito} >{e.producto.precio}</td>
                                    :
                                    <td className="align-middle pointer">{moneda(e.producto.precio)}</td>
                                }
                                <td onClick={setDescuentoUnitario} data-index={e.id} className="align-middle pointer">{e.subtotal}</td>
                                <td onClick={setDescuentoUnitario} data-index={e.id} className="align-middle pointer clickme">{e.descuento}</td>



                                <th className="font-weight-bold align-middle">{e.total}</th>
                                {editable ?
                                    <td className="align-middle"> <i onClick={delItemPedido} data-index={e.id} className="fa fa-times text-danger"></i> </td>
                                    : null}
                                </tr>
                            ) : null}
                            <tr>
                            <td><button className="btn btn-outline-success fs-5">{items ? items.length : null}</button></td>
                            <th colSpan={auth(1) ? "8" : "7"} className="p-2 align-middle">{cliente ? cliente.nombre : null} <b>{cliente ? cliente.identificacion : null}</b></th>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    
                    <div className="col-5">
                        
                        <div className="mb-1 container-fluid pt-1">
                        <div className="row">
                            <div className="col p-0">
                            <div className="container-fluid p-0">

                                <div className="row">

                                <div className="col p-0">
                                    {editable ?
                                    <div className={(debito != "" ? "bg-success-light card-sinapsis addref" : "t-5") + (" card w125px")}>
                                        <div className="card-body">
                                        <div className="card-title pointer" onClick={getDebito}>Déb. </div>


                                        <div className="card-text pago-numero">
                                            <div className="input-group">
                                            <input type="text" className='form-control' value={debito} onChange={(e) => syncPago(e.target.value, "Debito")} placeholder="D" />
                                            <div className="input-group-prepend">
                                                <span className="input-group-text pointer" onClick={() => setPagoInBs(val => {
                                                syncPago(val, "Debito")
                                                })}>Bs</span>
                                            </div>
                                            </div>
                                        </div>
                                        <small className="text-muted fs-4">{debitoBs("debito")}</small>
                                        <span className='ref pointer' data-type="toggle" onClick={() => addRefPago("toggle")}>Ref. <i className="fa fa-plus"></i></span>


                                        </div>
                                    </div>
                                    :
                                    <div className={(debito != "" ? "bg-success-light card-sinapsis" : "t-5") + (" card w125px")}>
                                        <div className="card-body">
                                        <div className="card-title pointer">Déb.</div>
                                        <div className="card-text pago-numero">{debito}</div>

                                        </div>
                                    </div>
                                    }

                                </div>
                                <div className="col p-0">
                                    {editable ?

                                    <div className={(efectivo != "" ? "bg-success-light card-sinapsis addref" : "t-5") + (" card w125px")}>
                                        <div className="card-body">
                                        <div className="card-title pointer" onClick={getEfectivo}>Efec.</div>
                                        <div className="card-text pago-numero">
                                            <div className="input-group">
                                            <input type="text" className='form-control' value={efectivo} onChange={(e) => syncPago(e.target.value, "Efectivo")} placeholder="E" />
                                            <div className="input-group-prepend">
                                                <span className="input-group-text pointer" onClick={() => setPagoInBs(val => {
                                                syncPago(val, "Efectivo")
                                                })}>Bs</span>
                                            </div>
                                            </div>
                                        </div>
                                        <small className="text-muted fs-4">{debitoBs("efectivo")}</small>
                                        </div>
                                    </div>
                                    :
                                    <div className={(efectivo != "" ? "bg-success-light card-sinapsis" : "t-5") + (" card w125px")}>
                                        <div className="card-body">
                                        <div className="card-title pointer">Efec.</div>
                                        <div className="card-text pago-numero">{efectivo}</div>

                                        </div>
                                    </div>
                                    }

                                </div>

                                <div className="col p-0">
                                    {editable ?

                                    <div className={(transferencia != "" ? "bg-success-light card-sinapsis addref" : "t-5") + (" card w125px")}>
                                        <div className="card-body">
                                        <div className="card-title pointer" onClick={getTransferencia}>Tran.</div>
                                        <div className="card-text pago-numero">
                                            <div className="input-group">
                                            <input type="text" className='form-control' value={transferencia} onChange={(e) => syncPago(e.target.value, "Transferencia")} placeholder="T" />
                                            <div className="input-group-prepend">
                                                <span className="input-group-text pointer" onClick={() => setPagoInBs(val => {
                                                syncPago(val, "Transferencia")
                                                })}>Bs</span>
                                            </div>
                                            </div>
                                        </div>
                                        <small className="text-muted fs-4">{debitoBs("transferencia")}</small>
                                        <span className='ref pointer' data-type="toggle" onClick={() => addRefPago("toggle", transferencia, "1")}>Ref. <i className="fa fa-plus"></i></span>


                                        </div>
                                    </div>

                                    :
                                    <div className={(transferencia != "" ? "bg-success-light card-sinapsis" : "t-5") + (" card w125px")}>
                                        <div className="card-body">
                                        <div className="card-title pointer">Tran.</div>
                                        <div className="card-text pago-numero">{transferencia}</div>

                                        </div>
                                    </div>
                                    }

                                </div>

                                <div className="col p-0">
                                    {editable ?

                                    <div className={(biopago != "" ? "bg-success-light card-sinapsis addref" : "t-5") + (" card w125px")}>
                                        <div className="card-body">
                                        <div className="card-title pointer" onClick={getBio}>Biopago</div>
                                        <div className="card-text pago-numero">
                                            <div className="input-group">
                                            <input type="text" className='form-control' value={biopago} onChange={(e) => syncPago(e.target.value, "Biopago")} placeholder="B" />
                                            <div className="input-group-prepend">
                                                <span className="input-group-text pointer" onClick={() => setPagoInBs(val => {
                                                syncPago(val, "Biopago")
                                                })}>Bs</span>
                                            </div>
                                            </div>
                                        </div>
                                        <small className="text-muted fs-4">{debitoBs("biopago")}</small>
                                        <span className='ref pointer' data-type="toggle" onClick={() => addRefPago("toggle", biopago, "5")}>Ref. <i className="fa fa-plus"></i></span>

                                        </div>
                                    </div>

                                    :
                                    <div className={(biopago != "" ? "bg-success-light card-sinapsis" : "t-5") + (" card w125px")}>
                                        <div className="card-body">
                                        <div className="card-title pointer">Biopago.</div>
                                        <div className="card-text pago-numero">{biopago}</div>

                                        </div>
                                    </div>
                                    }
                                </div>

                                <div className="col p-0">
                                    {editable ?

                                    <div className={(credito != "" ? "bg-success-light card-sinapsis" : "t-5") + (" card w125px")}>
                                        <div className="card-body">
                                        <div className="card-title pointer" onClick={getCredito}>Créd.</div>
                                        <div className="card-text pago-numero"><input type="text" value={credito} onChange={(e) => syncPago(e.target.value, "Credito")} placeholder="C" /></div>

                                        </div>
                                    </div>
                                    :

                                    <div className={(credito != "" ? "bg-success-light card-sinapsis" : "t-5") + (" card w125px")}>
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
                                    !editable ? <div className="col p-0">
                                    <div className="card-body">
                                        <div onClick={entregarVuelto}>
                                        <div className="card-text pago-numero">
                                            {vuelto}
                                        </div>
                                        <small className="text-success fst-italic pointer">Entregar</small><br />
                                        {vuelto_entregado ? vuelto_entregado.map(e => <div title={e.created_at} key={e.id}>
                                            Entregado = <b>{e.monto}</b>

                                        </div>) : null}
                                        </div>
                                    </div>
                                    </div> : null
                                }
                                


                                </div>
                            </div>
                            </div>
                            <div className="p-1 col-md-auto d-flex align-items-center">
                            {autoCorrector ?
                                <button className="btn btn-outline-success btn-sm scale05" onClick={() => setautoCorrector(false)}>On</button> :
                                <button className="btn btn-outline-danger btn-sm scale05" onClick={() => setautoCorrector(true)}>Off</button>
                            }

                            </div>
                        </div>

                        </div>
                        {editable ?
                            <div className="container p-0 m-0">
                                <div className="row mb-4">
                                    <div className="col">
                                        {refPago ? refPago.length ? <h4 className='text-center'>Referencias Bancarias</h4> : null : null}

                                        <ul className="list-group">

                                            {refPago ? refPago.length ? refPago.map(e =>
                                                <li key={e.id} className='list-group-item d-flex justify-content-between align-items-start'>
                                                <span className='cell45'>Ref.{e.descripcion} ({e.banco})</span>
                                                {e.tipo == 1 && e.monto != 0 ? <span className="cell45 btn-sm btn-info btn">Trans. {moneda(e.monto)} </span> : null}
                                                {e.tipo == 2 && e.monto != 0 ? <span className="cell45 btn-sm btn-secondary btn">Deb. Bs.{moneda(e.monto)} </span> : null}
                                                {e.tipo == 5 && e.monto != 0 ? <span className="cell45 btn-sm btn-secondary btn">Biopago. Bs.{moneda(e.monto)} </span> : null}
                                                <span className="cell1 text-danger text-right" data-id={e.id} onClick={delRefPago}>
                                                    <i className="fa fa-times"></i>
                                                </span>
                                                </li>
                                            )
                                            : null : null}
                                        </ul>

                                    </div>
                                </div>
                            </div> 
                            : null
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
                                <span data-type="bs" className='fs-2 pointer'> Bs {bs}</span><br />
                                </th>
                            </tr>
                            {pedidoData.clean_total < 0 ?
                                <tr>
                                <td colSpan={6}>
                                    <span className="text-muted">Debemos pagarle diferencia al cliente</span>
                                </td>
                                </tr>
                                : null}
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
                                        <div className={(recibido_dolar != "" ? "bg-success-light card-sinapsis addref" : "t-5") + (" card")}>
                                        <div className="card-body p-2">
                                            <div className="card-title pointer" >$</div>
                                            <div className="card-text pago-numero"><input type="text" className="fs-3" value={recibido_dolar} onChange={(e) => changeRecibido(e.target.value, "recibido_dolar")} placeholder="$" /></div>
                                        </div>
                                        </div>
                                    </div>

                                    <div className="col p-0">
                                        <div className={(recibido_bs != "" ? "bg-success-light card-sinapsis addref" : "t-5") + (" card")}>
                                        <div className="card-body p-2">
                                            <div className="card-title pointer" >BS</div>
                                            <div className="card-text pago-numero"><input type="text" className="fs-3" value={recibido_bs} onChange={(e) => changeRecibido(e.target.value, "recibido_bs")} placeholder="BS" /></div>
                                        </div>
                                        </div>
                                    </div>

                                    <div className="col p-0">
                                        <div className={(recibido_cop != "" ? "bg-success-light card-sinapsis addref" : "t-5") + (" card")}>
                                        <div className="card-body p-2">
                                            <div className="card-title pointer" >COP</div>
                                            <div className="card-text pago-numero"><input type="text" className="fs-3" value={recibido_cop} onChange={(e) => changeRecibido(e.target.value, "recibido_cop")} placeholder="COP" /></div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                </td>
                                <td className="align-middle text-right">
                                Pagado
                                <br />
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
                                        <div className={(cambio_dolar != "" ? "bg-success-light card-sinapsis addref" : "t-5") + (" card")}>
                                        <div className="card-body p-2">
                                            <div className="card-title pointer " onClick={setVueltodolar} >$</div>
                                            <div className="card-text pago-numero"><input type="text" className="fs-3" value={cambio_dolar} onChange={(e) => syncCambio(e.target.value, "Dolar")} placeholder="$" /></div>
                                        </div>
                                        </div>
                                    </div>

                                    <div className="col p-0">
                                        <div className={(cambio_bs != "" ? "bg-success-light card-sinapsis addref" : "t-5") + (" card")}>
                                        <div className="card-body p-2">
                                            <div className="card-title pointer " onClick={setVueltobs} >BS</div>
                                            <div className="card-text pago-numero"><input type="text" className="fs-3" value={cambio_bs} onChange={(e) => syncCambio(e.target.value, "Bolivares")} placeholder="BS" /></div>
                                        </div>
                                        </div>
                                    </div>

                                    <div className="col p-0">
                                        <div className={(cambio_cop != "" ? "bg-success-light card-sinapsis addref" : "t-5") + (" card")}>
                                        <div className="card-body p-2">
                                            <div className="card-title pointer " onClick={setVueltocop} >COP</div>
                                            <div className="card-text pago-numero"><input type="text" className="fs-3" value={cambio_cop} onChange={(e) => syncCambio(e.target.value, "Pesos")} placeholder="COP" /></div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </td>
                                <td className="align-middle text-right">
                                Cambio
                                <br />
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
                                {editable ?
                                <>
                                    <button className="btn btn-circle text-white btn-success btn-xl me-1" onClick={facturar_pedido}>
                                    CL+ETR<i className="fa fa-paper-plane"></i>
                                    <i className="fa fa-print"></i>
                                    </button>

                                    <button className="btn btn-circle btn-primary text-white btn-xl me-5" onClick={facturar_e_imprimir}>
                                    ENTER <i className="fa fa-paper-plane"></i>
                                    </button>
                                </>
                                : null}
                                {editable ?
                                <button className="btn btn-circle text-white btn-sinapsis btn-xl me-1" onClick={() => setToggleAddPersona(true)}>F2 <i className="fa fa-user"></i></button>
                                : null}
                                <button className="btn btn-circle text-white btn-sinapsis btn-xl me-4" onClick={toggleImprimirTicket}>F3 <i className="fa fa-print"></i></button>
                                <button className="btn btn-circle text-white btn-sinapsis btn-xl me-4" onClick={viewReportPedido}>F4 <i className="fa fa-eye"></i></button>
                                {editable ?
                                <button className="btn btn-circle text-white btn-danger btn-sm" onClick={del_pedido}>F5 <i className="fa fa-times"></i></button>
                                : null}
                            </div>
                        </div>

                        <div className='mb-5'>
                          <div className="input-group">
                            <span className="input-group-text w-25">
                              MONEDA
                            </span>

                            
                            <select className="form-control" value={monedaToPrint} onChange={e=>setmonedaToPrint(e.target.value)}>
                              <option value="bs">BS</option>
                              <option value="$">$</option>
                              <option value="cop">COP</option>
                            </select>
                          </div>

                          <div className="input-group">
                            <span className="input-group-text w-25">
                              IMPRESORA
                            </span>
                            
                            <select className="form-control" value={selectprinter} onChange={e=>setselectprinter(e.target.value)}>
                              <option value="1">CAJA 1</option>
                              <option value="2">CAJA 2</option>
                              <option value="3">CAJA 3</option>
                              <option value="4">CAJA 4</option>
                              <option value="5">CAJA 5</option>
                              <option value="6">CAJA 6</option>
                              <option value="7">CAJA 7</option>
                              <option value="8">CAJA 8</option>
                              <option value="9">CAJA 9</option>
                              <option value="10">CAJA 10</option>
                            </select>
                          </div>
                        </div>
                        
                        {auth(1)?
                          <div className="mb-3">
                            <div className="input-group w-100">
                              <button className="btn btn-outline-secondary btn-sm" onClick={getSucursales}><i className="fa fa-search"></i></button>
                              <select className="form-control" value={transferirpedidoa} onChange={e => settransferirpedidoa(e.target.value)}>
                                  <option value="">Transferir A</option>
                                  {sucursalesCentral.map(e =>
                                  <option value={e.id} key={e.id}>
                                      {e.nombre}
                                  </option>
                                  )}
                              </select>
                              <button className="btn btn-outline-secondary btn-sm" onClick={setexportpedido}><i className="fa fa-paper-plane"></i></button>
                            </div>
                          </div>
                        :null}

                        
                        <div className="">
                          <div className="input-group w-100">
                            <div className="input-group-text">
                              GASTO OPERATIVO
                            </div>
                            <button className="btn btn-outline-secondary btn-sm" onClick={setGastoOperativo}><i className="fa fa-paper-plane"></i></button>
                          </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        :null
    )
}