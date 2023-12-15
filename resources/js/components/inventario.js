
import Proveedores from '../components/proveedores';
import CargarProducto from '../components/cargarproducto';
import Facturas from '../components/facturas';
import Fallas from '../components/fallas';

import InventarioForzado from '../components/inventarioForzado';
import EstadisticaInventario from '../components/estadisticainventario';
import Gastos from '../components/gastos';
import ControlEfectivo from '../components/controlefectivo';

import React, { useEffect } from 'react';





function Inventario({
  personalNomina,
  setpersonalNomina,
  getNomina,
  delCaja,
  categoriasCajas,
  setcategoriasCajas,
  getcatsCajas,
  controlefecQ, setcontrolefecQ,
  controlefecQDesde, setcontrolefecQDesde,
  controlefecQHasta, setcontrolefecQHasta,
  controlefecData, setcontrolefecData,
  controlefecSelectGeneral, setcontrolefecSelectGeneral,
  controlefecSelectUnitario, setcontrolefecSelectUnitario,
  controlefecNewConcepto, setcontrolefecNewConcepto,
  controlefecNewCategoria, setcontrolefecNewCategoria,
  controlefecNewMonto, setcontrolefecNewMonto,
  getControlEfec, setgetControlEfec,
  setControlEfec, setsetControlEfec,
  setcontrolefecQCategoria, controlefecQCategoria,

  children,
  getEstaInventario,
  user,
  printTickedPrecio,
  setdropprintprice,
  dropprintprice,
  printPrecios,
  setCtxBulto,
  setStockMin,
  setPrecioAlterno,

  openReporteFalla,
  setporcenganancia,
  changeInventario,
  
  /* showaddpedidocentral,
  setshowaddpedidocentral,
  valheaderpedidocentral,
  setvalheaderpedidocentral,
  valbodypedidocentral,
  setvalbodypedidocentral,
  procesarImportPedidoCentral, */

  productosInventario,
  qBuscarInventario,
  setQBuscarInventario,

  setIndexSelectInventario,
  indexSelectInventario,

  inputBuscarInventario,

  inpInvbarras,
  setinpInvbarras,
  inpInvcantidad,
  setinpInvcantidad,
  inpInvalterno,
  setinpInvalterno,
  inpInvunidad,
  setinpInvunidad,
  inpInvcategoria,
  setinpInvcategoria,
  inpInvdescripcion,
  setinpInvdescripcion,
  inpInvbase,
  setinpInvbase,
  inpInvventa,
  setinpInvventa,
  inpInviva,
  setinpInviva,

  number,
  guardarNuevoProducto,

  setProveedor,
  proveedordescripcion,
  setproveedordescripcion,
  proveedorrif,
  setproveedorrif,
  proveedordireccion,
  setproveedordireccion,
  proveedortelefono,
  setproveedortelefono,

  subViewInventario,
  setsubViewInventario,

  setIndexSelectProveedores,
  indexSelectProveedores,
  qBuscarProveedor,
  setQBuscarProveedor,
  proveedoresList,

  delProveedor,
  delProducto,

  inpInvid_proveedor,
  setinpInvid_proveedor,
  inpInvid_marca,
  setinpInvid_marca,
  inpInvid_deposito,
  setinpInvid_deposito,
  setshowModalFacturas,
  showModalFacturas,
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
  factInpid_proveedor,
  setfactInpid_proveedor,
  factInpnumfact,
  setfactInpnumfact,
  factInpdescripcion,
  setfactInpdescripcion,
  factInpmonto,
  setfactInpmonto,
  factInpfechavencimiento,
  setfactInpfechavencimiento,

  setFactura,

  factInpestatus,
  setfactInpestatus,

  delFactura,

  Invnum,
  setInvnum,
  InvorderColumn,
  setInvorderColumn,
  InvorderBy,
  setInvorderBy,

  delItemFact,

  qFallas,
  setqFallas,
  orderCatFallas,
  setorderCatFallas,
  orderSubCatFallas,
  setorderSubCatFallas,
  ascdescFallas,
  setascdescFallas,
  fallas,
  delFalla,

  getPedidosCentral,
  selectPedidosCentral,
  checkPedidosCentral,

  pedidosCentral,
  setIndexPedidoCentral,
  indexPedidoCentral,
  moneda,
  
  verDetallesFactura,
  setNewProducto,
  modViewInventario,
  setmodViewInventario,
  inpInvLotes,

  addNewLote,
  changeModLote,
  reporteInventario,

  guardarNuevoProductoLote,
  refsInpInvList,
  categorias,

  fechaQEstaInve,
  setfechaQEstaInve,
  fechaFromEstaInve,
  setfechaFromEstaInve,
  fechaToEstaInve,
  setfechaToEstaInve,
  orderByEstaInv,
  setorderByEstaInv,
  orderByColumEstaInv,
  setorderByColumEstaInv,
  dataEstaInven,

  saveFactura,
  
  setmodFact,
  modFact,

  setPagoProveedor,
  tipopagoproveedor,
  settipopagoproveedor,
  montopagoproveedor,
  setmontopagoproveedor,
  getPagoProveedor,
  pagosproveedor,

  setSameGanancia,
  setSameCat,
  setSamePro,
  busquedaAvanazadaInv,
  setbusquedaAvanazadaInv,

  busqAvanzInputsFun,
  busqAvanzInputs,
  buscarInvAvanz,

  delPagoProveedor,

  qgastosfecha1,
  setqgastosfecha1,
  qgastosfecha2,
  setqgastosfecha2,
  qgastos,
  setqgastos,
  qcatgastos,
  setqcatgastos,
  gastosdescripcion,
  setgastosdescripcion,
  gastoscategoria,
  setgastoscategoria,
  gastosmonto,
  setgastosmonto,
  gastosData,
  delGastos,
  getGastos,
  setGasto,

  sameCatValue,
  sameProValue,
  categoriaEstaInve,
  setcategoriaEstaInve,

  qhistoinven,
  setqhistoinven,
  fecha1histoinven,
  setfecha1histoinven,
  fecha2histoinven,
  setfecha2histoinven,
  orderByHistoInven,
  setorderByHistoInven,
  historicoInventario,
  usuarioHistoInven,
  setusuarioHistoInven,
  usuariosData,
  getUsuarios,
  getHistoricoInventario,

  openmodalhistoricoproducto,
  showmodalhistoricoproducto,
  setshowmodalhistoricoproducto,
  fecha1modalhistoricoproducto,
  setfecha1modalhistoricoproducto,
  fecha2modalhistoricoproducto,
  setfecha2modalhistoricoproducto,
  usuariomodalhistoricoproducto,
  setusuariomodalhistoricoproducto,

  datamodalhistoricoproducto,
  setdatamodalhistoricoproducto,
  getmovientoinventariounitario,

  selectRepleceProducto,
  replaceProducto,
  setreplaceProducto,
  saveReplaceProducto,
  
  controlefecNewMontoMoneda,
  setcontrolefecNewMontoMoneda,

  controlefecResponsable,
  setcontrolefecResponsable,
  controlefecAsignar,
  setcontrolefecAsignar,

  
}) {
  useEffect(()=>{
    getUsuarios()
  }, [])

  const type = type => {
    return !type || type === "delete" ? true : false
  }

  return (
    <>
      <div className="container">
        <div className="row">
        <div className="col mb-2 d-flex justify-content-between">
          <div className="btn-group">              
              <button className={("btn ")+(subViewInventario=="inventario"?"btn-success":"btn-outline-success")} onClick={()=>setsubViewInventario("inventario")}>Inventario</button>
              
              {user.iscentral?
                <button className={("btn ")+(subViewInventario=="precarga"?"btn-success":"btn-outline-success")} onClick={()=>setsubViewInventario("precarga")}>PreCarga</button>
              :null}
              {user.iscentral?
                <button className={("btn ")+(subViewInventario=="proveedores"?"btn-success":"btn-outline-success")} onClick={()=>setsubViewInventario("proveedores")}>Proveedores</button>
              :null}
              <>
                <button className={("btn ") + (subViewInventario=="facturas"?"btn-success":"btn-outline-success")} onClick={()=>setsubViewInventario("facturas")}>Facturas</button>
              </>
              <button className={("btn ") + (subViewInventario=="fallas"?"btn-success":"btn-outline-success")} onClick={()=>setsubViewInventario("fallas")}>Fallas</button>
          </div>
          <div className="btn-group">
              <button className={("btn ") + (subViewInventario == "gastos" ? "btn-success" : "btn-outline-success")} onClick={() => setsubViewInventario("gastos")}>Gastos</button>
              <button className={("btn ") + (subViewInventario == "efectivo" ? "btn-success" : "btn-outline-success")} onClick={() => setsubViewInventario("efectivo")}>Control de Efectivo</button>
              <button className={("btn ") + (subViewInventario=="estadisticas"?"btn-success":"btn-outline-success")} onClick={()=>setsubViewInventario("estadisticas")}>Estadísticas</button> 
          </div>
          
        </div>
          
        </div>
      </div>
      <hr/>
      {children}
      {
        subViewInventario=="efectivo"?
          <ControlEfectivo
            controlefecResponsable={controlefecResponsable}
            setcontrolefecResponsable={setcontrolefecResponsable}
            controlefecAsignar={controlefecAsignar}
            setcontrolefecAsignar={setcontrolefecAsignar}
            personalNomina={personalNomina}
            setpersonalNomina={setpersonalNomina}
            getNomina={getNomina}
            delCaja={delCaja}
            categoriasCajas={categoriasCajas}
            setcategoriasCajas={setcategoriasCajas}
            getcatsCajas={getcatsCajas}
            controlefecNewMontoMoneda={controlefecNewMontoMoneda}
            setcontrolefecNewMontoMoneda={setcontrolefecNewMontoMoneda}
            controlefecQ={controlefecQ}
            setcontrolefecQ={setcontrolefecQ}
            controlefecQDesde={controlefecQDesde}
            setcontrolefecQDesde={setcontrolefecQDesde}
            controlefecQHasta={controlefecQHasta}
            setcontrolefecQHasta={setcontrolefecQHasta}
            controlefecData={controlefecData}
            setcontrolefecData={setcontrolefecData}
            controlefecSelectGeneral={controlefecSelectGeneral}
            setcontrolefecSelectGeneral={setcontrolefecSelectGeneral}
            controlefecSelectUnitario={controlefecSelectUnitario}
            setcontrolefecSelectUnitario={setcontrolefecSelectUnitario}
            controlefecNewCategoria={controlefecNewCategoria}
            setcontrolefecNewCategoria={setcontrolefecNewCategoria}
            controlefecNewConcepto={controlefecNewConcepto}
            setcontrolefecNewConcepto={setcontrolefecNewConcepto}
            controlefecNewMonto={controlefecNewMonto}
            setcontrolefecNewMonto={setcontrolefecNewMonto}
            getControlEfec={getControlEfec}
            setgetControlEfec={setgetControlEfec}
            setControlEfec={setControlEfec}
            setsetControlEfec={setsetControlEfec}
            setcontrolefecQCategoria={setcontrolefecQCategoria}
            controlefecQCategoria={controlefecQCategoria}

            number={number}
            moneda={moneda}
          />
        :null
      }
      {
        subViewInventario=="facturas"?
          <Facturas
            delPagoProveedor={delPagoProveedor}
            pagosproveedor={pagosproveedor}
            getPagoProveedor={getPagoProveedor}
            setPagoProveedor={setPagoProveedor}
            tipopagoproveedor={tipopagoproveedor}
            settipopagoproveedor={settipopagoproveedor}
            montopagoproveedor={montopagoproveedor}
            setmontopagoproveedor={setmontopagoproveedor}
            setmodFact={setmodFact}
            modFact={modFact}
            qBuscarProveedor={qBuscarProveedor}
            setQBuscarProveedor={setQBuscarProveedor}
            setIndexSelectProveedores={setIndexSelectProveedores}
            indexSelectProveedores={indexSelectProveedores}

            moneda={moneda}
            saveFactura={saveFactura}
            setsubViewInventario={setsubViewInventario}
            setshowModalFacturas={setshowModalFacturas}
            showModalFacturas={showModalFacturas}
            facturas={facturas}
            verDetallesFactura={verDetallesFactura}

            factqBuscar={factqBuscar}
            setfactqBuscar={setfactqBuscar}
            factqBuscarDate={factqBuscarDate}
            setfactqBuscarDate={setfactqBuscarDate}
            factsubView={factsubView}
            setfactsubView={setfactsubView}
            factSelectIndex={factSelectIndex}
            setfactSelectIndex={setfactSelectIndex}
            factOrderBy={factOrderBy}
            setfactOrderBy={setfactOrderBy}
            factOrderDescAsc={factOrderDescAsc}
            setfactOrderDescAsc={setfactOrderDescAsc}
            factInpid_proveedor={factInpid_proveedor}
            setfactInpid_proveedor={setfactInpid_proveedor}
            factInpnumfact={factInpnumfact}
            setfactInpnumfact={setfactInpnumfact}
            factInpdescripcion={factInpdescripcion}
            setfactInpdescripcion={setfactInpdescripcion}
            factInpmonto={factInpmonto}
            setfactInpmonto={setfactInpmonto}
            factInpfechavencimiento={factInpfechavencimiento}
            setfactInpfechavencimiento={setfactInpfechavencimiento}
            setFactura={setFactura}
            proveedoresList={proveedoresList}

            number={number}
            
            factInpestatus={factInpestatus}
            setfactInpestatus={setfactInpestatus}
            delFactura={delFactura}
            delItemFact={delItemFact}
          />
        :null
      }
      {
        subViewInventario=="inventario"?
          <>
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col d-flex justify-content-center">
                      <button className="btn btn-sinapsis ms-2" onClick={()=>setmodViewInventario("list")}>Gestión <i className="fa fa-paper-plane"></i></button>
                      <button className="btn btn-sinapsis ms-2" onClick={()=>setmodViewInventario("historico")}>Histórico <i className="fa fa-refresh"></i></button>

                    </div>
                    
                  </div>

                  
                </div>

                {factSelectIndex == null ? null
                  :
                  <div className="input-group w-25">
                    <span className="input-group-text" >{facturas[factSelectIndex] ? facturas[factSelectIndex].proveedor.descripcion : null}</span>

                    <button className="btn btn-outline-secondary"
                      onClick={() => { setshowModalFacturas(true); setfactsubView("detalles") }}>{facturas[factSelectIndex] ? facturas[factSelectIndex].numfact : null}</button>
                    <button className="btn btn-outline-danger" onClick={() => setfactSelectIndex(null)}>
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                }
              </div>
              <hr/>
            </div>
            
            {modViewInventario=="historico"?
            <>
              <div className="container">
                <div className="input-group">
                  <select
                    className={("form-control form-control-sm ")}
                    value={usuarioHistoInven}
                    onChange={e => setusuarioHistoInven((e.target.value))}
                  >
                    <option value="">--Seleccione Usuario--</option>
                    {usuariosData.map(e => <option value={e.id} key={e.id}>{e.usuario}</option>)}
                    
                  </select>
                  <input type="text" className="form-control" placeholder="Buscar..." value={qhistoinven} onChange={e=>setqhistoinven(e.target.value)}/>
                  <input type="date" className="form-control" value={fecha1histoinven} onChange={e=>setfecha1histoinven(e.target.value)}/>
                  <input type="date" className="form-control" value={fecha2histoinven} onChange={e=>setfecha2histoinven(e.target.value)}/>
                  
                  <select className="form-control" value={orderByHistoInven} onChange={e=>setorderByHistoInven(e.target.value)}>
                    <option value="asc">ASC</option>
                    <option value="desc">DESC</option>
                  </select>

                  <button className="btn btn-success" onClick={getHistoricoInventario}><i className="fa fa-search"></i></button>
                  

                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="pointer">Usuario</th>
                      <th className="pointer">Origen</th>
                      <th className="pointer">Alterno</th>
                      <th className="pointer">Barras</th>
                      <th className="pointer">Descripción</th>
                      <th className="pointer">Cantidad</th>
                      <th className="pointer">Base</th>
                      <th className="pointer">Venta</th>
                      <th className="pointer">Hora</th>
                    </tr>
                  </thead>
                    {historicoInventario.length?historicoInventario.map(e=>
                        <tbody key={e.id}>
                              <tr className='bg-danger-light'>
                                <td rowSpan={2} className='align-middle'>{e.usuario?e.usuario.usuario:""}</td>
                                <td rowSpan={2} className='align-middle'>{e.origen?e.origen:""}</td>
                                {e.antes?
                                  <>
                                    <td>{e.antes.codigo_proveedor?e.antes.codigo_proveedor:""}</td>
                                    <td>{e.antes.codigo_barras?e.antes.codigo_barras:""}</td>
                                    <td>{e.antes.descripcion?e.antes.descripcion:""}</td>
                                    <td>{e.antes.cantidad?e.antes.cantidad:""}</td>
                                    <td>{moneda(e.antes.precio_base?e.antes.precio_base:"")}</td>
                                    <td>{moneda(e.antes.precio?e.antes.precio:"")}</td>
                                  </>
                                :
                                <>
                                    <td colSpan={6} className='text-center h4'>
                                      Producto nuevo
                                    </td>
                                  </>
                                }
                                <td>{e.created_at?e.created_at:""}</td>
                              </tr>
                              <tr className='bg-success-light pb-table2'>
                                {e.despues?
                                  <>
                                    <td>{e.despues.codigo_proveedor?e.despues.codigo_proveedor:""}</td>
                                    <td>{e.despues.codigo_barras?e.despues.codigo_barras:""}</td>
                                    <td>{e.despues.descripcion?e.despues.descripcion:""}</td>
                                    <td>{e.despues.cantidad?e.despues.cantidad:""}</td>
                                    <td>{moneda(e.despues.precio_base?e.despues.precio_base:"")}</td>
                                    <td>{moneda(e.despues.precio?e.despues.precio:"")}</td>
                                  </>
                                :
                                <>
                                    <td colSpan={6} className='text-center h4'>
                                      Producto Eliminado
                                    </td>
                                  </>
                                }
                                <td>{e.created_at?e.created_at:""}</td>
                              </tr>
                        </tbody>
                      
                      ):null}
                </table>
              </div>
            </>
           /*  <CargarProducto
              categorias={categorias}
              setporcenganancia={setporcenganancia}
              type={type}
              setNewProducto={setNewProducto}
              productosInventario={productosInventario}
              qBuscarInventario={qBuscarInventario}
              setQBuscarInventario={setQBuscarInventario}

              setIndexSelectInventario={setIndexSelectInventario}
              indexSelectInventario={indexSelectInventario}
              inputBuscarInventario={inputBuscarInventario}

              inpInvbarras={inpInvbarras}
              setinpInvbarras={setinpInvbarras}
              inpInvcantidad={inpInvcantidad}
              setinpInvcantidad={setinpInvcantidad}
              inpInvalterno={inpInvalterno}
              setinpInvalterno={setinpInvalterno}
              inpInvunidad={inpInvunidad}
              setinpInvunidad={setinpInvunidad}
              inpInvcategoria={inpInvcategoria}
              setinpInvcategoria={setinpInvcategoria}
              inpInvdescripcion={inpInvdescripcion}
              setinpInvdescripcion={setinpInvdescripcion}
              inpInvbase={inpInvbase}
              setinpInvbase={setinpInvbase}
              inpInvventa={inpInvventa}
              setinpInvventa={setinpInvventa}
              inpInviva={inpInviva}
              setinpInviva={setinpInviva}
              inpInvLotes={inpInvLotes}

              number={number}

              guardarNuevoProducto={guardarNuevoProducto}

              setProveedor={setProveedor}
              proveedordescripcion={proveedordescripcion}
              setproveedordescripcion={setproveedordescripcion}
              proveedorrif={proveedorrif}
              setproveedorrif={setproveedorrif}
              proveedordireccion={proveedordireccion}
              setproveedordireccion={setproveedordireccion}
              proveedortelefono={proveedortelefono}
              setproveedortelefono={setproveedortelefono}

              subViewInventario={subViewInventario}
              setsubViewInventario={setsubViewInventario}

              setIndexSelectProveedores={setIndexSelectProveedores}
              indexSelectProveedores={indexSelectProveedores}
              qBuscarProveedor={qBuscarProveedor}
              setQBuscarProveedor={setQBuscarProveedor}
              proveedoresList={proveedoresList}

              delProveedor={delProveedor}
              delProducto={delProducto}

              inpInvid_proveedor={inpInvid_proveedor}
              setinpInvid_proveedor={setinpInvid_proveedor}
              inpInvid_marca={inpInvid_marca}
              setinpInvid_marca={setinpInvid_marca}
              inpInvid_deposito={inpInvid_deposito}
              setinpInvid_deposito={setinpInvid_deposito}
              
              Invnum={Invnum}
              setInvnum={setInvnum}
              InvorderColumn={InvorderColumn}
              setInvorderColumn={setInvorderColumn}
              InvorderBy={InvorderBy}
              setInvorderBy={setInvorderBy}

              addNewLote={addNewLote}
              changeModLote={changeModLote}
              
            /> */
            :null} 

            {modViewInventario=="list"?
              <InventarioForzado
                selectRepleceProducto={selectRepleceProducto}
                replaceProducto={replaceProducto}
                setreplaceProducto={setreplaceProducto}
                saveReplaceProducto={saveReplaceProducto}
                user={user}
                setStockMin={setStockMin}
                getmovientoinventariounitario={getmovientoinventariounitario}
                datamodalhistoricoproducto={datamodalhistoricoproducto}
                setdatamodalhistoricoproducto={setdatamodalhistoricoproducto}
                usuariosData={usuariosData}
                openmodalhistoricoproducto={openmodalhistoricoproducto}
                showmodalhistoricoproducto={showmodalhistoricoproducto}
                setshowmodalhistoricoproducto={setshowmodalhistoricoproducto}
                fecha1modalhistoricoproducto={fecha1modalhistoricoproducto}
                setfecha1modalhistoricoproducto={setfecha1modalhistoricoproducto}
                fecha2modalhistoricoproducto={fecha2modalhistoricoproducto}
                setfecha2modalhistoricoproducto={setfecha2modalhistoricoproducto}
                usuariomodalhistoricoproducto={usuariomodalhistoricoproducto}
                setusuariomodalhistoricoproducto={setusuariomodalhistoricoproducto}

                reporteInventario={reporteInventario}
                printTickedPrecio={printTickedPrecio}
                sameCatValue={sameCatValue}
                sameProValue={sameProValue}
                setCtxBulto={setCtxBulto}
                setPrecioAlterno={setPrecioAlterno}
                busqAvanzInputsFun={busqAvanzInputsFun}
                busqAvanzInputs={busqAvanzInputs}
                buscarInvAvanz={buscarInvAvanz}

                busquedaAvanazadaInv={busquedaAvanazadaInv}
                setbusquedaAvanazadaInv={setbusquedaAvanazadaInv}
                setSameCat={setSameCat}
                setSamePro={setSamePro}
                setSameGanancia={setSameGanancia}

                categorias={categorias}
                setporcenganancia={setporcenganancia}

                refsInpInvList={refsInpInvList}
                proveedoresList={proveedoresList}
                guardarNuevoProductoLote={guardarNuevoProductoLote}
                inputBuscarInventario={inputBuscarInventario}
                type={type}
                number={number}
                productosInventario={productosInventario}
                qBuscarInventario={qBuscarInventario}
                setQBuscarInventario={setQBuscarInventario}

                changeInventario={changeInventario}

                Invnum={Invnum}
                setInvnum={setInvnum}
                InvorderColumn={InvorderColumn}
                setInvorderColumn={setInvorderColumn}
                InvorderBy={InvorderBy}
                setInvorderBy={setInvorderBy}
              />
            :null
            }
          </>
        :null
          
      }
      {subViewInventario=="proveedores"?<Proveedores 

        number={number}
        setProveedor={setProveedor}
        proveedordescripcion={proveedordescripcion}
        setproveedordescripcion={setproveedordescripcion}
        proveedorrif={proveedorrif}
        setproveedorrif={setproveedorrif}
        proveedordireccion={proveedordireccion}
        setproveedordireccion={setproveedordireccion}
        proveedortelefono={proveedortelefono}
        setproveedortelefono={setproveedortelefono}
        subViewInventario={subViewInventario}
        setsubViewInventario={setsubViewInventario}
        setIndexSelectProveedores={setIndexSelectProveedores}
        indexSelectProveedores={indexSelectProveedores}
        qBuscarProveedor={qBuscarProveedor}
        setQBuscarProveedor={setQBuscarProveedor}
        proveedoresList={proveedoresList}
        delProveedor={delProveedor}
        delProducto={delProducto}
        inpInvid_proveedor={inpInvid_proveedor}
        setinpInvid_proveedor={setinpInvid_proveedor}
        inpInvid_marca={inpInvid_marca}
        setinpInvid_marca={setinpInvid_marca}
        inpInvid_deposito={inpInvid_deposito}
        setinpInvid_deposito={setinpInvid_deposito}
      />:null}

      {subViewInventario=="fallas"?<Fallas 
        openReporteFalla={openReporteFalla}
        qFallas={qFallas}
        setqFallas={setqFallas}
        orderCatFallas={orderCatFallas}
        setorderCatFallas={setorderCatFallas}
        orderSubCatFallas={orderSubCatFallas}
        setorderSubCatFallas={setorderSubCatFallas}
        ascdescFallas={ascdescFallas}
        setascdescFallas={setascdescFallas}
        fallas={fallas}
        delFalla={delFalla}
      />:null}
      {subViewInventario=="estadisticas"?
        <EstadisticaInventario
          categoriaEstaInve={categoriaEstaInve}
          setcategoriaEstaInve={setcategoriaEstaInve}
          categorias={categorias}
          fechaQEstaInve={fechaQEstaInve}
          setfechaQEstaInve={setfechaQEstaInve}
          fechaFromEstaInve={fechaFromEstaInve}
          setfechaFromEstaInve={setfechaFromEstaInve}
          fechaToEstaInve={fechaToEstaInve}
          setfechaToEstaInve={setfechaToEstaInve}
          orderByEstaInv={orderByEstaInv}
          setorderByEstaInv={setorderByEstaInv}
          orderByColumEstaInv={orderByColumEstaInv}
          setorderByColumEstaInv={setorderByColumEstaInv}
          moneda={moneda}
          getEstaInventario={getEstaInventario}
          dataEstaInven={dataEstaInven}
        />
      :null}
      {subViewInventario=="gastos"?<Gastos
        qgastosfecha1={qgastosfecha1}
        setqgastosfecha1={setqgastosfecha1}
        qgastosfecha2={qgastosfecha2}
        setqgastosfecha2={setqgastosfecha2}
        qgastos={qgastos}
        setqgastos={setqgastos}
        qcatgastos={qcatgastos}
        setqcatgastos={setqcatgastos}
        gastosdescripcion={gastosdescripcion}
        setgastosdescripcion={setgastosdescripcion}
        gastoscategoria={gastoscategoria}
        setgastoscategoria={setgastoscategoria}
        gastosmonto={gastosmonto}
        setgastosmonto={setgastosmonto}
        gastosData={gastosData}
        delGastos={delGastos}
        getGastos={getGastos}
        setGasto={setGasto}
        number={number}
        moneda={moneda}
      />:null}

      

    </>
  )
}
export default Inventario