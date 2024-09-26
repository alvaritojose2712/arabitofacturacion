import {useState} from 'react';
import axios from 'axios';

// import '../css/loading.css';




const host = ""
// const host = "http://localhost/sinapsisapp"

const db = {
  // setCentralData: data=>axios.get(host+"setCentralData",{params:data}),
  getMoneda: ()=>axios.post(host+"getMoneda"),
  getinventario: data=>axios.post(host+"getinventario",data),
  setCarrito: data=>axios.get(host+"setCarrito",{params:data}),
  addNewPedido: data=>axios.get(host+"addNewPedido",{params:data}),
  
  getPedido: data=>axios.post(host+"getPedido",data),
  getPedidosList: data=>axios.post(host+"getPedidosList",data),
  verificarLogin: () => axios.post(host + "verificarLogin"),
 
  logout: ()=>axios.get(host+"logout"),
  closeAllSession: ()=>axios.get(host+"closeAllSession"),
  
  
  sendClavemodal: data=>axios.post(host+"sendClavemodal",data),
  saveReplaceProducto: data=>axios.post(host+"saveReplaceProducto",data),
  
  guardarCierre: data=>axios.post(host+"guardarCierre",data),
  reversarCierre: data=>axios.get(host+"reversarCierre",{params:data}),
  
  getNomina: data=>axios.post(host+"getNomina",data),
  getAlquileres: data=>axios.post(host+"getAlquileres",data),
  

  setMoneda: data=>axios.post(host+"setMoneda",data),
  delItemPedido: data=>axios.post(host+"delItemPedido",data),
  changeEntregado: data=>axios.post(host+"changeEntregado",data),

  setDescuentoUnitario: data=>axios.post(host+"setDescuentoUnitario",data),
  setDescuentoTotal: data=>axios.post(host+"setDescuentoTotal",data),

  setCantidad: data=>axios.post(host+"setCantidad",data),
  setPrecioAlternoCarrito: data=>axios.post(host+"setPrecioAlternoCarrito",data),
  setCtxBultoCarrito: data=>axios.post(host+"setCtxBultoCarrito",data),
  

  
  getpersona: data=>axios.post(host+"getpersona",data),
  setpersonacarrito: data=>axios.post(host+"setpersonacarrito",data),

  setPagoPedido: data=>axios.post(host+"setPagoPedido",data),
  setPagoPedidoTrans: data=>axios.post(host+"setPagoPedidoTrans",data),
  
  createDevolucion: data=>axios.post(host+"createDevolucion",data),
  setDevolucion: data=>axios.post(host+"setDevolucion",data),
  setpagoDevolucion: data=>axios.post(host+"setpagoDevolucion",data),
  
  
  delpedido: data=>axios.post(host+"delpedido",data),

  getPedidos: data=>axios.post(host+"getPedidos",data),

  cerrar: data=>axios.post(host+"cerrar",data),

  today: data=>axios.post(host+"today",data),
  getVentas: data=>axios.post(host+"getVentas",data),
  
  getPedidosFast: data=>axios.post(host+"getPedidosFast",data),
  
  
  getip: data=>axios.get(host+"getip",{params:data}),
  setPagoCredito: data=>axios.post(host+"setPagoCredito",data),

  getDeudores: data=>axios.post(host+"getDeudores",data),
  
  backup: data=>axios.get(host+"backup",data),
  getDeudor: data=>axios.post(host+"getDeudor",data),
  checkDeuda: data=>axios.post(host+"checkDeuda",data),
  
  entregarVuelto: data=>axios.post(host+"entregarVuelto",data),

  getMovimientosCaja: data=>axios.post(host+"getMovimientosCaja",data),

  setMovimientoCaja: data=>axios.post(host+"setMovimientoCaja",data),
  
  delMovCaja: data=>axios.post(host+"delMovCaja",data),

  getMovimientos: data=>axios.post(host+"getMovimientos",data),
  
  getBuscarDevolucion: data=>axios.post(host+"getBuscarDevolucion",data),
  getBuscarDevolucionhistorico: data=>axios.post(host+"getBuscarDevolucionhistorico",data),

  getTareasCentral: data=>axios.get(host+"getTareasCentral",{params:data}),
  
  runTareaCentral: data=>axios.post(host+"runTareaCentral",data),
  

  delMov: data=>axios.post(host+"delMov",data),

  
  setProveedor: data=>axios.post(host+"setProveedor",data),
  guardarNuevoProducto: data => axios.post(host + "guardarNuevoProducto", data),
  
  getInventarioNovedades: data => axios.post(host + "getInventarioNovedades", data),
  resolveInventarioNovedades: data => axios.post(host + "resolveInventarioNovedades", data),
  sendInventarioNovedades: data => axios.post(host + "sendInventarioNovedades", data),
  delInventarioNovedades: data => axios.post(host + "delInventarioNovedades", data),
  
  
  
  
  
  guardarNuevoProductoLote: data=>axios.post(host+"guardarNuevoProductoLote",data),
  guardarNuevoProductoLoteFact: data=>axios.post(host+"guardarNuevoProductoLoteFact",data),
  addProductoFactInventario: data=>axios.post(host+"addProductoFactInventario",data),
  
  getProveedores: data=>axios.post(host+"getProveedores",data),
  
  delProveedor: data=>axios.post(host+"delProveedor",data),
  delProducto: data=>axios.post(host+"delProducto",data),
  
  getMarcas: data=>axios.post(host+"getMarcas",data),
  getDepositos: data=>axios.post(host+"getDepositos",data),
  
  getFacturas: data=>axios.post(host+"getFacturas",data),
  setFactura: data=>axios.post(host+"setFactura",data),
  sendFacturaCentral: data=>axios.post(host+"sendFacturaCentral",data),
  getAllProveedores: data=>axios.post(host+"getAllProveedores",data),
  
  setGastoOperativo: data=>axios.post(host+"setGastoOperativo",data),
  
  
  
  delFactura: data=>axios.post(host+"delFactura",data),

  delItemFact: data=>axios.post(host+"delItemFact",data),

  setClienteCrud: data=>axios.post(host+"setClienteCrud",data),
  getClienteCrud: data=>axios.post(host+"getClienteCrud",data),
  delCliente: data=>axios.post(host+"delCliente",data),

  getFallas: data=>axios.post(host+"getFallas",data),
  setFalla: data=>axios.post(host+"setFalla",data),
  delFalla: data=>axios.post(host+"delFalla",data),
  imprimirTicked: data=>axios.post(host+"imprimirTicked",data),
  getTotalizarCierre: data=>axios.post(host+"getTotalizarCierre",data),
  changepedidouser: data=>axios.post(host+"changepedidouser",data),
  

  getTareasLocal: data=>axios.get(host+"getTareasLocal",{params:data}),
  resolverTareaLocal: data=>axios.get(host+"resolverTareaLocal",{params:data}),
  
  sendCierre: data=>axios.get(host+"verCierre",{params:data}),
  printTickedPrecio: ({ id }) => window.open(host + "/printTickedPrecio?id=" + id, "targed=blank"),

  

  saveMontoFactura: data=>axios.post(host+"saveMontoFactura",data),

  reqpedidos: data => axios.post(host + "reqpedidos", data),
  changeIdVinculacionCentral: data => axios.post(host + "changeIdVinculacionCentral", data),
  
  setexportpedido: data => axios.post(host + "setexportpedido", data),
  
  getmastermachine: data=>axios.post(host+"getmastermachine",data),
  getStatusCierre: data=>axios.post(host+"getStatusCierre",data),
  

  getSucursal: data=>axios.get(host+"getSucursal",{params:data}),
  
  getCategorias: data=>axios.get(host+"getCategorias",{params:data}),
  getcatsCajas: data=>axios.get(host+"getcatsCajas",{params:data}),
  
  delCategoria: data=>axios.post(host+"delCategoria",data),
  setCategorias: data=>axios.post(host+"setCategorias",data),
  
  


  getProductosSerial: data=>axios.get(host+"getProductosSerial",{params:data}),
  checkPedidosCentral: data=>axios.post(host+"checkPedidosCentral",data),
  
  setUsuario: data=>axios.post(host+"setUsuario",data),
  delUsuario: data => axios.post(host + "delUsuario", data),
  getUsuarios: data => axios.get(host + "getUsuarios", { params: data }),
  getCierres: data=>axios.get(host+"getCierres",{params:data}),
  sendCuentasporCobrar: data => axios.get(host + "sendCuentasporCobrar", { params: data }),
  
  
  removeLote: data=>axios.post(host+"removeLote",data),
  getEstaInventario: data => axios.post(host + "getEstaInventario", data),
  
  getUniqueProductoById: data => axios.get(host + "getUniqueProductoById", { params: data }),
  setPagoProveedor: data => axios.post(host + "setPagoProveedor", data),
  getPagoProveedor: data => axios.post(host + "getPagoProveedor", data),
  delPagoProveedor: data => axios.post(host + "delPagoProveedor", data),
  getPermisoCierre: data => axios.post(host + "getPermisoCierre", data),
  
  guardarDeSucursalEnCentral: data => axios.post(host + "guardarDeSucursalEnCentral", data),
  

  
  getHistoricoInventario: data => axios.get(host + "getHistoricoInventario", { params: data }),
  getmovientoinventariounitario: data => axios.get(host + "getmovientoinventariounitario", { params: data }),
  getSyncProductosCentralSucursal: data => axios.post(host + "getSyncProductosCentralSucursal", data),
  

  
  addRefPago: data => axios.post(host + "addRefPago", data),
  delRefPago: data=>axios.post(host+"delRefPago",data),

  addRetencionesPago: data => axios.post(host + "addRetencionesPago", data),
  delRetencionPago: data=>axios.post(host+"delRetencionPago",data),

  

  getGarantias: data=>axios.post(host+"getGarantias",data),
  setSalidaGarantias: data=>axios.post(host+"setSalidaGarantias",data),
  
  delGastos: data=>axios.post(host+"delGastos",data),
  getGastos: data=>axios.post(host+"getGastos",data),
  setGasto: data=>axios.post(host+"setGasto",data),
  
  setCtxBulto: data=>axios.post(host+"setCtxBulto",data),
  setStockMin: data=>axios.post(host+"setStockMin",data),
  
  setPrecioAlterno: data=>axios.post(host+"setPrecioAlterno",data),
  printPrecios: data=>axios.post(host+"printPrecios",data),
  
  setconfigcredito: data=>axios.post(host+"setconfigcredito",data),
  
  setSocketUrlDB: data => axios.get(host + "setSocketUrlDB", { params: data }),
  recibedSocketEvent: data => axios.get(host + "recibedSocketEvent", { params: data }),
  
  setNuevaTareaCentral: data =>axios.get(host+"setNuevaTareaCentral",{params:data}),
  setInventarioFromSucursal: data => axios.post(host + "setInventarioFromSucursal", data),
  getSucursales: data => axios.post(host + "getSucursales", data),
  getInventarioSucursalFromCentral: data => axios.post(host + "getInventarioSucursalFromCentral", data),
  setInventarioSucursalFromCentral: data => axios.post(host + "setInventarioSucursalFromCentral", data),
  
  setCambiosInventarioSucursal: data => axios.post(host + "setCambiosInventarioSucursal", data),
  getInventarioFromSucursal: data => axios.post(host + "getInventarioFromSucursal", data),
  saveChangeInvInSucurFromCentral: data => axios.post(host + "saveChangeInvInSucurFromCentral", data),
  setnewtasainsucursal: data => axios.post(host + "setnewtasainsucursal", data),
  updatetasasfromCentral: data => axios.post(host + "updatetasasfromCentral", data),
  
  getControlEfec: data => axios.post(host + "getControlEfec", data),
  setControlEfec: data => axios.post(host + "setControlEfec", data),
  reversarMovPendientes: data => axios.post(host + "reversarMovPendientes", data),
  aprobarRecepcionCaja: data => axios.post(host + "aprobarRecepcionCaja", data),
  
  
  verificarMovPenControlEfec: data => axios.post(host + "verificarMovPenControlEfec", data),
  verificarMovPenControlEfecTRANFTRABAJADOR: data => axios.post(host + "verificarMovPenControlEfecTRANFTRABAJADOR", data),
  
  
  delCaja: data => axios.post(host + "delCaja", data),
  
  getReferenciasElec: data => axios.get(host + "getReferenciasElec", { params: data }),
  getPorcentajeInventario: data => axios.post(host + "getPorcentajeInventario",  data),
  cleanInventario: data => axios.post(host + "cleanInventario",  data),
  
  openverDetallesImagenFactura: data => axios.get(host + "verDetallesImagenFactura", { params: data }),
  openVerFactura: ({ id }) => window.open(host + "verFactura?id=" + id, "targed=blank"),
  
  openPrintCreditos: (param) => window.open(host + "verCreditos?"+param,"targed=blank"),
  openVerCierre: ({ type,fechaCierre,totalizarcierre,usuario }) => window.open(host + "verCierre?type=" + type + "&fecha=" + fechaCierre+ "&totalizarcierre=" + totalizarcierre + "&usuario=" + usuario,"targed=blank"),
  openNotaentregapedido: ({ id }) => window.open(host + "/notaentregapedido?id=" + id, "targed=blank"),
  
  openReporteInventario: () => window.open(host + "reporteInventario", "targed=blank"),
  openReporteFalla: (id) => window.open(host + "reporteFalla?id=" + id, "targed=blank"),
  openTransferenciaPedido: (id) => window.open(host + "openTransferenciaPedido?id=" + id, "targed=blank"),
  
  
  
  
  

  
  
  
  
  // getProveedores: ()=>axios.post(host+"getProveedores.php"),
  // getusuarios: ()=>axios.post(host+"getusuarios.php"),
  // setPedidos: (data)=>{
  //   return axios.post(host+"setpedidos.php", data,)
  // },
  // setProducto: (data)=>{
  //   return axios.post(host+"setproducto.php", data,)
  // },
  // resolverPedido: (data)=>{
  //   return axios.post(host+"resolverPedido.php", data,)
  // },
  // setVerificarProducto: (data)=>{
  //   return axios.post(host+"setVerificarProducto.php", data,)
  // },
  // setDeletepedido: (data)=>{
  //   return axios.post(host+"setDeletepedido.php", data,)
  // },
  
  
  

}

export default db