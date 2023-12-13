import "../../css/modal.css";

import { useHotkeys } from "react-hotkeys-hook";

import { useState, useEffect, useRef, Component } from "react";
import { cloneDeep } from "lodash";
import db from "../database/database";

import { moneda, number } from "./assets";
import ProductosList from "../components/productoslist";
import ModalAddCarrito from "../components/modaladdcarrito";
import ModalMovimientos from "../components/ModalMovimientos";
import Configuracion from "../components/configuracion";

import Pagar from "../components/pagar";
import Header from "../components/header";
import Panelcentrodeacopio from "../components/panelcentrodeacopio";

import Pedidos from "../components/pedidos";

import Credito from "../components/credito";
import Vueltos from "../components/vueltos";
import Clientes from "../components/clientes";

import PedidosCentralComponent from "../components/pedidosCentral";

import Cierres from "../components/cierre";
import Inventario from "../components/inventario";

import Cajagastos from "../components/cajagastos";
import Ventas from "../components/ventas";

import ViewPedidoVendedor from "../components/viewPedidoVendedor";

export default function Facturar({ user, notificar, setLoading }) {

    const [inputqinterno, setinputqinterno] = useState("")

    const [buscarDevolucionhistorico, setbuscarDevolucionhistorico] = useState("");
    const [
        productosDevolucionSelecthistorico,
        setproductosDevolucionSelecthistorico,
    ] = useState([]);

    const [presupuestocarrito, setpresupuestocarrito] = useState([])
    const [selectprinter, setselectprinter] = useState(null);

    const [dropprintprice, setdropprintprice] = useState(false);

    const [num, setNum] = useState(50);
    const [showOptionQMain, setshowOptionQMain] = useState(false);
    const [itemCero, setItemCero] = useState(false);
    const [qProductosMain, setQProductosMain] = useState("");

    const [orderColumn, setOrderColumn] = useState("cantidad");
    const [orderBy, setOrderBy] = useState("desc");

    const [inputaddCarritoFast, setinputaddCarritoFast] = useState("");

    const [view, setView] = useState("seleccionar");
    const [selectItem, setSelectItem] = useState(null);
    const [pedidoSelect, setPedidoSelect] = useState(null);
    const [pedidoData, setPedidoData] = useState({});

    const [dolar, setDolar] = useState("");
    const [peso, setPeso] = useState("");

    const [cantidad, setCantidad] = useState("");
    const [numero_factura, setNumero_factura] = useState("nuevo");

    const [onlyVueltos, setOnlyVueltos] = useState(0);

    const [showinputaddCarritoFast, setshowinputaddCarritoFast] = useState(false);

    const [productos, setProductos] = useState([]);

    const [productosInventario, setProductosInventario] = useState([]);

    const [qBuscarInventario, setQBuscarInventario] = useState("");
    const [indexSelectInventario, setIndexSelectInventario] = useState(null);

    const [inpInvbarras, setinpInvbarras] = useState("");
    const [inpInvcantidad, setinpInvcantidad] = useState("");
    const [inpInvalterno, setinpInvalterno] = useState("");
    const [inpInvunidad, setinpInvunidad] = useState("UND");
    const [inpInvcategoria, setinpInvcategoria] = useState("24");
    const [inpInvdescripcion, setinpInvdescripcion] = useState("");
    const [inpInvbase, setinpInvbase] = useState("");
    const [inpInvventa, setinpInvventa] = useState("");
    const [inpInviva, setinpInviva] = useState("0");
    const [inpInvporcentaje_ganancia, setinpInvporcentaje_ganancia] = useState("0");

    const [inpInvLotes, setinpInvLotes] = useState([]);

    const [inpInvid_proveedor, setinpInvid_proveedor] = useState("");
    const [inpInvid_marca, setinpInvid_marca] = useState("");
    const [inpInvid_deposito, setinpInvid_deposito] = useState("");

    const [depositosList, setdepositosList] = useState([]);
    const [marcasList, setmarcasList] = useState([]);

    const [Invnum, setInvnum] = useState(25);
    const [InvorderColumn, setInvorderColumn] = useState("id");
    const [InvorderBy, setInvorderBy] = useState("desc");

    const [proveedordescripcion, setproveedordescripcion] = useState("");
    const [proveedorrif, setproveedorrif] = useState("");
    const [proveedordireccion, setproveedordireccion] = useState("");
    const [proveedortelefono, setproveedortelefono] = useState("");

    const [subViewInventario, setsubViewInventario] = useState("inventario");

    const [indexSelectProveedores, setIndexSelectProveedores] = useState(null);

    const [qBuscarProveedor, setQBuscarProveedor] = useState("");

    const [proveedoresList, setProveedoresList] = useState([]);

    const [pedidoList, setPedidoList] = useState([]);
    const [showMisPedido, setshowMisPedido] = useState(true);

    const [orderbycolumpedidos, setorderbycolumpedidos] = useState("id");
    const [orderbyorderpedidos, setorderbyorderpedidos] = useState("desc");

    const [debito, setDebito] = useState("");
    const [efectivo, setEfectivo] = useState("");
    const [transferencia, setTransferencia] = useState("");
    const [credito, setCredito] = useState("");
    const [vuelto, setVuelto] = useState("");
    const [biopago, setBiopago] = useState("");
    const [tipo_referenciapago, settipo_referenciapago] = useState("");
    const [descripcion_referenciapago, setdescripcion_referenciapago] = useState("");
    const [monto_referenciapago, setmonto_referenciapago] = useState("");
    const [banco_referenciapago, setbanco_referenciapago] = useState("0108");
    const [togglereferenciapago, settogglereferenciapago] = useState("");

    const [refrenciasElecData, setrefrenciasElecData] = useState([]);
    const [togleeReferenciasElec, settogleeReferenciasElec] = useState(false);

    const [viewconfigcredito, setviewconfigcredito] = useState(false);
    const [fechainiciocredito, setfechainiciocredito] = useState("");
    const [fechavencecredito, setfechavencecredito] = useState("");
    const [formatopagocredito, setformatopagocredito] = useState(1);
    const [datadeudacredito, setdatadeudacredito] = useState({});

    const [descuento, setDescuento] = useState(0);

    const [ModaladdproductocarritoToggle, setModaladdproductocarritoToggle] = useState(false);

    const [toggleAddPersona, setToggleAddPersona] = useState(false);
    const [personas, setPersona] = useState([]);

    const [pedidos, setPedidos] = useState([]);

    const [movimientosCaja, setMovimientosCaja] = useState([]);
    const [movimientos, setMovimientos] = useState([]);

    const [tipobusquedapedido, setTipoBusqueda] = useState("fact");

    const [tipoestadopedido, setTipoestadopedido] = useState("todos");

    const [busquedaPedido, setBusquedaPedido] = useState("");
    const [fecha1pedido, setFecha1pedido] = useState("");
    const [fecha2pedido, setFecha2pedido] = useState("");

    const [caja_usd, setCaja_usd] = useState("");
    const [caja_cop, setCaja_cop] = useState("");
    const [caja_bs, setCaja_bs] = useState("");
    const [caja_punto, setCaja_punto] = useState("");
    const [caja_biopago, setcaja_biopago] = useState("");

    const [dejar_usd, setDejar_usd] = useState("");
    const [dejar_cop, setDejar_cop] = useState("");
    const [dejar_bs, setDejar_bs] = useState("");

    const [lotespuntototalizar,setlotespuntototalizar] = useState([])
    const [biopagostotalizar,setbiopagostotalizar] = useState([])

    const [cierre, setCierre] = useState({});
    const [totalizarcierre, setTotalizarcierre] = useState(false);

    const [today, setToday] = useState("");

    const [fechaCierre, setFechaCierre] = useState("");
    

    const [viewCierre, setViewCierre] = useState("cuadre");
    const [toggleDetallesCierre, setToggleDetallesCierre] = useState(0);

    const [filterMetodoPagoToggle, setFilterMetodoPagoToggle] = useState("todos");

    const [notaCierre, setNotaCierre] = useState("");

    const [qDeudores, setQDeudores] = useState("");
    const [orderbycolumdeudores, setorderbycolumdeudores] = useState("saldo");
    const [orderbyorderdeudores, setorderbyorderdeudores] = useState("asc");
    const [limitdeudores, setlimitdeudores] = useState(25);

    const [deudoresList, setDeudoresList] = useState([]);
    const [cierres, setCierres] = useState({});

    const [selectDeudor, setSelectDeudor] = useState(null);

    const [tipo_pago_deudor, setTipo_pago_deudor] = useState("3");
    const [monto_pago_deudor, setMonto_pago_deudor] = useState("");

    const [detallesDeudor, setDetallesDeudor] = useState([]);

    const [counterListProductos, setCounterListProductos] = useState(0);

    const [countListInter, setCountListInter] = useState(0);
    const [countListPersoInter, setCountListPersoInter] = useState(0);

    const [viewCaja, setViewCaja] = useState(false);

    const [movCajadescripcion, setMovCajadescripcion] = useState("");
    const [movCajatipo, setMovCajatipo] = useState(1);
    const [movCajacategoria, setMovCajacategoria] = useState(5);
    const [movCajamonto, setMovCajamonto] = useState("");
    const [movCajaFecha, setMovCajaFecha] = useState("");

    const refaddfast = useRef(null)

    const tbodyproductosref = useRef(null);
    const inputBuscarInventario = useRef(null);

    const tbodyproducInterref = useRef(null);
    const tbodypersoInterref = useRef(null);

    const inputCantidadCarritoref = useRef(null);
    const inputbusquedaProductosref = useRef(null);
    const inputmodaladdpersonacarritoref = useRef(null);
    const inputaddcarritointernoref = useRef(null);

    const refinputaddcarritofast = useRef(null);

    const [typingTimeout, setTypingTimeout] = useState(0);

    const [fechaMovimientos, setFechaMovimientos] = useState("");

    const [showModalMovimientos, setShowModalMovimientos] = useState(false);
    const [buscarDevolucion, setBuscarDevolucion] = useState("");
    const [tipoMovMovimientos, setTipoMovMovimientos] = useState("1");
    const [tipoCatMovimientos, setTipoCatMovimientos] = useState("2");
    const [productosDevolucionSelect, setProductosDevolucionSelect] = useState([]);

    const [idMovSelect, setIdMovSelect] = useState("nuevo");

    const [showModalFacturas, setshowModalFacturas] = useState(false);

    const [facturas, setfacturas] = useState([]);

    const [factqBuscar, setfactqBuscar] = useState("");
    const [factqBuscarDate, setfactqBuscarDate] = useState("");
    const [factOrderBy, setfactOrderBy] = useState("id");
    const [factOrderDescAsc, setfactOrderDescAsc] = useState("desc");
    const [factsubView, setfactsubView] = useState("buscar");
    const [factSelectIndex, setfactSelectIndex] = useState(null);
    const [factInpid_proveedor, setfactInpid_proveedor] = useState("");
    const [factInpnumfact, setfactInpnumfact] = useState("");
    const [factInpdescripcion, setfactInpdescripcion] = useState("");
    const [factInpmonto, setfactInpmonto] = useState("");
    const [factInpfechavencimiento, setfactInpfechavencimiento] = useState("");

    const [factInpestatus, setfactInpestatus] = useState(0);

    const [qBuscarCliente, setqBuscarCliente] = useState("");
    const [numclientesCrud, setnumclientesCrud] = useState(25);

    const [clientesCrud, setclientesCrud] = useState([]);
    const [indexSelectCliente, setindexSelectCliente] = useState(null);

    const [clienteInpidentificacion, setclienteInpidentificacion] = useState("");
    const [clienteInpnombre, setclienteInpnombre] = useState("");
    const [clienteInpcorreo, setclienteInpcorreo] = useState("");
    const [clienteInpdireccion, setclienteInpdireccion] = useState("");
    const [clienteInptelefono, setclienteInptelefono] = useState("");
    const [clienteInpestado, setclienteInpestado] = useState("");
    const [clienteInpciudad, setclienteInpciudad] = useState("");

    const [sumPedidosArr, setsumPedidosArr] = useState([]);

    const [controlefecQ, setcontrolefecQ] = useState("")
    const [controlefecQDesde, setcontrolefecQDesde] = useState("")
    const [controlefecQHasta, setcontrolefecQHasta] = useState("")
    const [controlefecQCategoria, setcontrolefecQCategoria] = useState("")
    

    const [controlefecData, setcontrolefecData] = useState([])
    const [controlefecSelectGeneral, setcontrolefecSelectGeneral] = useState(1)
    const [controlefecSelectUnitario, setcontrolefecSelectUnitario] = useState(null)
    const [controlefecNewConcepto, setcontrolefecNewConcepto] = useState("")
    const [controlefecNewMonto, setcontrolefecNewMonto] = useState("")
    const [controlefecNewMontoMoneda, setcontrolefecNewMontoMoneda] = useState("")
    

    const [controlefecNewCategoria, setcontrolefecNewCategoria] = useState("")

    const [qFallas, setqFallas] = useState("");
    const [orderCatFallas, setorderCatFallas] = useState("proveedor");
    const [orderSubCatFallas, setorderSubCatFallas] = useState("todos");
    const [ascdescFallas, setascdescFallas] = useState("");
    const [fallas, setfallas] = useState([]);

    const [autoCorrector, setautoCorrector] = useState(true);

    const [pedidosCentral, setpedidoCentral] = useState([]);
    const [indexPedidoCentral, setIndexPedidoCentral] = useState(null);

    const [showaddpedidocentral, setshowaddpedidocentral] = useState(false);
    const [permisoExecuteEnter, setpermisoExecuteEnter] = useState(true);

    const [guardar_usd, setguardar_usd] = useState("");
    const [guardar_cop, setguardar_cop] = useState("");
    const [guardar_bs, setguardar_bs] = useState("");

    const [tipo_accionCierre, settipo_accionCierre] = useState("");

    const [ventasData, setventasData] = useState([]);

    const [fechaventas, setfechaventas] = useState("");

    const [pedidosFast, setpedidosFast] = useState([]);

    const [sucursaldata, setSucursaldata] = useState("");

    const [billete1, setbillete1] = useState("");
    const [billete5, setbillete5] = useState("");
    const [billete10, setbillete10] = useState("");
    const [billete20, setbillete20] = useState("");
    const [billete50, setbillete50] = useState("");
    const [billete100, setbillete100] = useState("");

    const [pathcentral, setpathcentral] = useState("");
    const [mastermachines, setmastermachines] = useState([]);

    const [usuariosData, setusuariosData] = useState([]);
    const [usuarioNombre, setusuarioNombre] = useState("");
    const [usuarioUsuario, setusuarioUsuario] = useState("");
    const [usuarioRole, setusuarioRole] = useState("");
    const [usuarioClave, setusuarioClave] = useState("");

    const [qBuscarUsuario, setQBuscarUsuario] = useState("");
    const [indexSelectUsuarios, setIndexSelectUsuarios] = useState(null);

    const [toggleClientesBtn, settoggleClientesBtn] = useState(false);

    const [modViewInventario, setmodViewInventario] = useState("list");

    const [loteIdCarrito, setLoteIdCarrito] = useState(null);
    const refsInpInvList = useRef(null);

    const [valheaderpedidocentral, setvalheaderpedidocentral] = useState("12340005ARAMCAL");
    const [valbodypedidocentral, setvalbodypedidocentral] = useState(
        "12341238123456123456123451234123712345612345612345123412361234561234561234512341235123456123456123451234123412345612345612345"
    );

    const [fechaGetCierre, setfechaGetCierre] = useState("");
    const [fechaGetCierre2, setfechaGetCierre2] = useState("");
    
    const [tipoUsuarioCierre, settipoUsuarioCierre] = useState("");

    const [CajaFuerteEntradaCierreDolar, setCajaFuerteEntradaCierreDolar] = useState("0")
    const [CajaFuerteEntradaCierreCop, setCajaFuerteEntradaCierreCop] = useState("0")
    const [CajaFuerteEntradaCierreBs, setCajaFuerteEntradaCierreBs] = useState("0")
    const [CajaChicaEntradaCierreDolar, setCajaChicaEntradaCierreDolar] = useState("0")
    const [CajaChicaEntradaCierreCop, setCajaChicaEntradaCierreCop] = useState("0")
    const [CajaChicaEntradaCierreBs, setCajaChicaEntradaCierreBs] = useState("0")

    const [lote1punto,setlote1punto] = useState("")
    const [montolote1punto,setmontolote1punto] = useState("")
    const [lote2punto,setlote2punto] = useState("")
    const [montolote2punto,setmontolote2punto] = useState("")
    const [serialbiopago,setserialbiopago] = useState("")

    const [puntolote1banco,setpuntolote1banco] = useState("")
    const [puntolote2banco,setpuntolote2banco] = useState("")

    const [modFact, setmodFact] = useState("factura");

    // 1234123812345612345612345
    // 1234123712345612345612345
    // 1234123612345612345612345
    // 1234123512345612345612345
    // 1234123412345612345612345
    // 12341234ARAMCAL

    const [socketUrl, setSocketUrl] = useState("");
    const [tareasCentral, settareasCentral] = useState([]);

    const [categoriaEstaInve, setcategoriaEstaInve] = useState("");
    const [fechaQEstaInve, setfechaQEstaInve] = useState("");
    const [fechaFromEstaInve, setfechaFromEstaInve] = useState("");
    const [fechaToEstaInve, setfechaToEstaInve] = useState("");
    const [orderByEstaInv, setorderByEstaInv] = useState("desc");
    const [orderByColumEstaInv, setorderByColumEstaInv] = useState("cantidadtotal");
    const [dataEstaInven, setdataEstaInven] = useState([]);

    const [tipopagoproveedor, settipopagoproveedor] = useState("");
    const [montopagoproveedor, setmontopagoproveedor] = useState("");
    const [pagosproveedor, setpagosproveedor] = useState([]);

    const [busquedaAvanazadaInv, setbusquedaAvanazadaInv] = useState(false);

    const [selectSucursalCentral, setselectSucursalCentral] = useState(null);
    const [sucursalesCentral, setsucursalesCentral] = useState([]);
    const [
        inventarioModifiedCentralImport,
        setinventarioModifiedCentralImport,
    ] = useState([]);

    const [
        parametrosConsultaFromsucursalToCentral,
        setparametrosConsultaFromsucursalToCentral,
    ] = useState({ numinventario: 25, novinculados: "novinculados" });
    const [subviewpanelcentroacopio, setsubviewpanelcentroacopio] = useState("");
    const [
        inventarioSucursalFromCentral,
        setdatainventarioSucursalFromCentral,
    ] = useState([]);
    const [
        estadisticasinventarioSucursalFromCentral,
        setestadisticasinventarioSucursalFromCentral,
    ] = useState({});

    const [fallaspanelcentroacopio, setfallaspanelcentroacopio] = useState([]);
    const [estadisticaspanelcentroacopio, setestadisticaspanelcentroacopio] = useState([]);
    const [gastospanelcentroacopio, setgastospanelcentroacopio] = useState([]);
    const [cierrespanelcentroacopio, setcierrespanelcentroacopio] = useState(
        []
    );
    const [diadeventapanelcentroacopio, setdiadeventapanelcentroacopio] = useState([]);
    const [tasaventapanelcentroacopio, settasaventapanelcentroacopio] = useState([]);

    const [busqAvanzInputs, setbusqAvanzInputs] = useState({
        codigo_barras: "",
        codigo_proveedor: "",
        id_proveedor: "",
        id_categoria: "",
        unidad: "",
        descripcion: "",
        iva: "",
        precio_base: "",
        precio: "",
        cantidad: "",
    });

    const [replaceProducto, setreplaceProducto] = useState({este:null, poreste:null})
    const [transferirpedidoa,settransferirpedidoa] = useState("")



    const getControlEfec = ()=>{
        db.getControlEfec({
            controlefecQ,
            controlefecQDesde,
            controlefecQHasta,
            controlefecQCategoria,
            controlefecSelectGeneral
        }).then(res=>{
            setcontrolefecData(res.data)
        })
    }
    const delCaja = (id)=>{
        db.delCaja({
            id
        }).then(res=>{
            getControlEfec()
        })
    }
    

    const setControlEfec = e => {
        e.preventDefault()

        if (confirm("¿Realmente desea cargar el movimiento?")) {
            
            if (
                !controlefecNewConcepto ||
                !controlefecNewCategoria ||
                !controlefecNewMonto ||
                !controlefecNewMontoMoneda
            ) {
                alert("Error: Campos Vacíos!") 
            }else{

                db.setControlEfec({
                    concepto: controlefecNewConcepto,
                    categoria: controlefecNewCategoria,
                    monto: controlefecNewMonto,
                    controlefecSelectGeneral,
                    controlefecSelectUnitario,
                    controlefecNewMontoMoneda,
                }).then(res=>{
                    getControlEfec()
                    notificar(res.data.msj)
                })
            }
        }
    }
    
    const selectRepleceProducto = (id) => {
        if (replaceProducto.este) {
            setreplaceProducto({...replaceProducto, poreste: id})
        }else{
            setreplaceProducto({...replaceProducto, este: id})
        }
    }
    const saveReplaceProducto = () => {
        db.saveReplaceProducto({
            replaceProducto
        }).then(({data})=>{
            if (data.estado) {
                buscarInventario()
                setreplaceProducto({este:null, poreste:null})
            }
            notificar(data.msj)
        })
    }



    ///Configuracion Component
    const [subViewConfig, setsubViewConfig] = useState("usuarios");

    ///End Configuracion Component

    const getSucursales = () => {
        db.getSucursales({}).then((res) => {
            if (res.data.estado) {
                setsucursalesCentral(res.data.msj);
                setLoading(false);
            }else{
                notificar(res.data.msj,false)
            }
        });
    };
    const onchangeparametrosConsultaFromsucursalToCentral = (e) => {
        const key = e.target.getAttribute("name");
        let value = e.target.value;
        setparametrosConsultaFromsucursalToCentral({
            ...parametrosConsultaFromsucursalToCentral,
            [key]: value,
        });
    };
    const [modalmovilx, setmodalmovilx] = useState(0);
    const [modalmovily, setmodalmovily] = useState(0);
    const [modalmovilshow, setmodalmovilshow] = useState(false);
    const [
        idselectproductoinsucursalforvicular,
        setidselectproductoinsucursalforvicular,
    ] = useState({ index: null, id: null });
    const inputbuscarcentralforvincular = useRef(null);
    const [tareasenprocesocentral, settareasenprocesocentral] = useState({});

    const [tareasinputfecha,settareasinputfecha] = useState("")
    const [tareasAdminLocalData, settareasAdminLocalData] = useState([])
    const getTareasLocal = () => {
        setLoading(true)
        db.getTareasLocal({
            fecha: tareasinputfecha,
        }).then(res=>{
            setLoading(false)
            settareasAdminLocalData(res.data)
        })
    } 
    const resolverTareaLocal = (id,tipo="aprobar") => {
        setLoading(true)
        db.resolverTareaLocal({
            id,
            tipo
        }).then(res=>{
            setLoading(false)
            getTareasLocal()
        })
    }   
    const [datainventarioSucursalFromCentralcopy,setdatainventarioSucursalFromCentralcopy] = useState([])
    const autovincularSucursalCentral = () => {
        let obj = cloneDeep(inventarioSucursalFromCentral);
        
        db.getSyncProductosCentralSucursal({obj}).then(res=>{
            setdatainventarioSucursalFromCentral(res.data);
        })


    }
    const modalmovilRef = useRef(null)
    const openVincularSucursalwithCentral = (e, idinsucursal) => {
        if (
            idinsucursal.index == idselectproductoinsucursalforvicular.index &&
            modalmovilshow
        ) {
            setmodalmovilshow(false);
        } else {
            setmodalmovilshow(true);
            if (modalmovilRef) {
                if (modalmovilRef.current) {
                    modalmovilRef.current?.scrollIntoView({ block: "nearest", behavior: 'smooth' });
                }
            }
        }
        
        
        let p = e.currentTarget.getBoundingClientRect();
        let y = p.top + window.scrollY;
        let x = p.left;
        setmodalmovily(y);
        setmodalmovilx(x);
        
        setidselectproductoinsucursalforvicular({
            index: idinsucursal.index,
            id: idinsucursal.id,
        });
    };
    const linkproductocentralsucursal = (idincentral) => {
        if (!inventarioSucursalFromCentral.filter(e=>e.id_vinculacion==idincentral).length) {
            changeInventarioFromSucursalCentral(
                idincentral,
                idselectproductoinsucursalforvicular.index,
                idselectproductoinsucursalforvicular.id,
                "changeInput",
                "id_vinculacion"
            );
    
            setmodalmovilshow(false);
        }else{
            alert("¡Error: Éste ID ya se ha vinculado!")
        }
    };


    const linkproductocentralsucursalSUCURSAL = (idinsucursal) => {

         //Id in central ID VINCULACION
         let pedidosCentralcopy = cloneDeep(pedidosCentral)
        db.changeIdVinculacionCentral({
            pedioscentral: pedidosCentralcopy[indexPedidoCentral],
            idinsucursal,
            idincentral: idselectproductoinsucursalforvicular.id,  //id vinculacion
        }).then(({data})=>{

            if (data.estado) {
                pedidosCentralcopy[indexPedidoCentral] = data.pedido
                setpedidoCentral(pedidosCentralcopy)
                setmodalmovilshow(false);
            }else{
                notificar(data.msj)
            }

        })
    };


    let puedoconsultarproductosinsucursalfromcentral = () => {
        //si todos los productos son consultados(0) o Procesados(3), puedo buscar mas productos.
        if (inventarioSucursalFromCentral) {
          return !inventarioSucursalFromCentral.filter(
              (e) => e.estatus == 1 /* || e.estatus == 2 */
          ).length;
        }
    };
    const getInventarioSucursalFromCentral = (type_force = null) => {
        setLoading(true);
        switch (type_force) {
            case "cierrespanelcentroacopio":
              break
            case "inventarioSucursalFromCentralmodify":
                //Si no, no puego buscar mas productos. En vez de eso, voy a editar/guardar nuevos productos
                let enedicionoinsercion = inventarioSucursalFromCentral.filter(
                    (e) => e.estatus == 1
                );
                db.getInventarioSucursalFromCentral({
                    type: "inventarioSucursalFromCentralmodify",
                    id_tarea:
                        tareasenprocesocentral.inventarioSucursalFromCentral,
                    productos: enedicionoinsercion,
                    codigo_destino: selectSucursalCentral,
                }).then((res) => {
                    if (res.data.estado) {
                        setdatainventarioSucursalFromCentral([])
                    }
                    notificar(res.data.msj, true);
                    setLoading(false);
                    
                });
                break;
            case "inventarioSucursalFromCentral":
                //si todos los productos son consultados(0) o Procesados(3), puedo buscar mas productos.
                if (puedoconsultarproductosinsucursalfromcentral()) {
                    let pedidonum = "";
                    if (parametrosConsultaFromsucursalToCentral.novinculados==="pedido") {
                        pedidonum = window.prompt("ID PEDIDO")
                    }
                    db.getInventarioSucursalFromCentral({
                        pedidonum,
                        codigo_destino: selectSucursalCentral,
                        type: type_force
                            ? type_force
                            : subviewpanelcentroacopio,
                        parametros: parametrosConsultaFromsucursalToCentral,
                    }).then((res) => {
                        
                        notificar(res.data.msj, true);
                        setLoading(false);
                        
                    });
                }
                break;
        }
    };
    const guardarDeSucursalEnCentral = (index, id) =>{
        db.guardarDeSucursalEnCentral({
            producto: inventarioSucursalFromCentral[index], 
        }).then(res=>{
            let d = res.data

            if (d.estado) {

                changeInventarioFromSucursalCentral(
                    d.id,
                    index,
                    id,
                    "changeInput",
                    "id_vinculacion"
                );
                notificar(d.msj,false)
            }else{

                if (d.id) {
                    changeInventarioFromSucursalCentral(
                        d.id,
                        index,
                        id,
                        "changeInput",
                        "id_vinculacion"
                    );  
                }
                notificar(d.msj,false)
            }
        })
    }

    const setInventarioSucursalFromCentral = (type_force = null) => {
        setLoading(true);
        db.setInventarioSucursalFromCentral({
            codigo_destino: selectSucursalCentral,
            type: type_force ? type_force : subviewpanelcentroacopio,
        }).then((res) => {
            setLoading(false);
            let data = res.data
            if (data.estado) {
                switch (subviewpanelcentroacopio) {
                    case "inventarioSucursalFromCentral":
                        settareasenprocesocentral({
                            ...tareasenprocesocentral,
                            inventarioSucursalFromCentral: data.msj.id,
                        }); //Guardar Id de tarea recibida
                        
                        if (data.msj.respuesta) {
                            let respuesta = JSON.parse(data.msj.respuesta);
                            setdatainventarioSucursalFromCentral(respuesta.respuesta?respuesta.respuesta:respuesta);
                            setdatainventarioSucursalFromCentralcopy(respuesta.respuesta?respuesta.respuesta:respuesta)

                            setestadisticasinventarioSucursalFromCentral(respuesta.estadisticas);
                        }
                        break;
                    case "fallaspanelcentroacopio":
                        setfallaspanelcentroacopio(res.data);
                        break;
                    case "estadisticaspanelcentroacopio":
                        setestadisticaspanelcentroacopio(res.data);
                        break;
                    case "gastospanelcentroacopio":
                        setgastospanelcentroacopio(res.data);
                        break;
                    case "cierrespanelcentroacopio":
                        setcierrespanelcentroacopio(res.data);
                        break;
                    case "diadeventapanelcentroacopio":
                        setdiadeventapanelcentroacopio(res.data);
                        break;
                    case "tasaventapanelcentroacopio":
                        settasaventapanelcentroacopio(res.data);
                        break;
                }
            } else {
                notificar(res.data.msj, true);
            }
        });
    };
    const [uniqueproductofastshowbyid, setuniqueproductofastshowbyid] =
        useState({});
    const [showdatafastproductobyid, setshowdatafastproductobyid] =
        useState(false);

    const getUniqueProductoById = (e, id) => {
        let p = e.currentTarget.getBoundingClientRect();
        let y = p.top + window.scrollY;
        let x = p.left;
        setmodalmovily(y);
        setmodalmovilx(x);
        setshowdatafastproductobyid(true);

        setuniqueproductofastshowbyid({});
        db.getUniqueProductoById({ id }).then((res) => {
            setuniqueproductofastshowbyid(res.data);
        });
    };
    const getTareasCentral = (estado = [0]) => {
        setLoading(true);
        settareasCentral([]);
        db.getTareasCentral({ estado }).then((res) => {
            let data = res.data
            if (data.estado) {
                let dataclone = data.msj
                settareasCentral(dataclone);
            }else{
                notificar(data.msj, true)
            }
            setLoading(false);
        });
    };
    const runTareaCentral = (i) => {
        setLoading(true);
        db.runTareaCentral({
            tarea: tareasCentral[i],
        }).then((res) => {
            let data = res.data
            notificar(data.msj, true);
            if (data.estado) {
                getTareasCentral()
            }
            setLoading(false);
        });
    };

    const updatetasasfromCentral = () => {
        setLoading(true);
        db.updatetasasfromCentral({}).then((res) => {
            getMoneda();
            setLoading(false);
        });
    };
    const setchangetasasucursal = (e) => {
        let tipo = e.currentTarget.attributes["data-type"].value;
        let valor = window.prompt("Nueva tasa");
        if (valor) {
            if (number(valor)) {
                setLoading(true);
                db.setnewtasainsucursal({
                    tipo,
                    valor,
                    id_sucursal: selectSucursalCentral,
                }).then((res) => {
                    notificar(res);
                    getInventarioSucursalFromCentral(
                        "tasaventapanelcentroacopio"
                    );
                    setLoading(false);
                });
            }
        }
    };

    const saveChangeInvInSucurFromCentral = () => {
        setLoading(true);
        db.saveChangeInvInSucurFromCentral({
            inventarioModifiedCentralImport:
                inventarioModifiedCentralImport.filter(
                    (e) => e.type === "replace"
                ),
        }).then((res) => {
            notificar(res);
            getInventarioFromSucursal();
            setLoading(false);
        });
    };
    const getInventarioFromSucursal = () => {
        setLoading(true);
        db.getInventarioFromSucursal({}).then((res) => {
            if (res.data) {
                if (res.data.length) {
                    if (typeof res.data[Symbol.iterator] === "function") {
                        if (!res.data.estado === false) {
                            setinventarioModifiedCentralImport([]);
                        } else {
                            setinventarioModifiedCentralImport(res.data);
                        }
                    }
                } else {
                    setinventarioModifiedCentralImport([]);
                }
            }

            if (res.data.estado === false) {
                notificar(res);
            }
            setLoading(false);
        });
    };
    const setCambiosInventarioSucursal = () => {
        let checkempty = inventarioSucursalFromCentral.filter(
            (e) =>
                e.codigo_barras == "" ||
                e.descripcion == "" ||
                e.id_categoria == "" ||
                e.unidad == "" ||
                e.id_proveedor == "" ||
                e.cantidad == "" ||
                e.precio == ""
        );

        if (inventarioSucursalFromCentral.length && !checkempty.length) {
            setLoading(true);
            db.setCambiosInventarioSucursal({
                productos: inventarioSucursalFromCentral,
                sucursal: sucursaldata,
            }).then((res) => {
                notificar(res);
                setLoading(false);
                try {
                    if (res.data.estado) {
                        getInventarioSucursalFromCentral(
                            subviewpanelcentroacopio
                        );
                    }
                } catch (err) {}
            });
        } else {
            alert(
                "¡Error con los campos! Algunos pueden estar vacíos " +
                    JSON.stringify(checkempty)
            );
        }
    };

    ///Sockets

    /*  Echo.private("centra")
  .listen('NuevaTarea', (e) => {
    console.log("central Channel Private " + e);
  });
  
  Echo.channel("centra")
  .listen('NuevaTarea', (e) => {
    console.log("central Channel Public " + e);
  }); */
    /* Echo.channel('central')
    .listen('NuevaTarea', e => {
      console.log(e);
    });*/

    ///End Sockets
    useHotkeys(
        "tab",
        () => {
            if (typeof selectItem == "number" && view == "seleccionar") {
                addCarritoRequest("agregar_procesar");
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
        },
        [view, selectItem]
    );
    useHotkeys(
        "f1",
        () => {
            if (view == "pagar") {
                if (refaddfast) {
                    if (refaddfast.current) {
                      refaddfast.current.focus()
                    }
                    if (inputqinterno!=="") {
                        setinputqinterno("")
                    }
                }
                setQProductosMain("");
                setCountListInter(0);
                // if (ModaladdproductocarritoToggle) {
                //     toggleModalProductos(false)
                // }else{
                //     toggleModalProductos(true, () => {
                        
                //     });
                // }
            } else if (selectItem === null && view == "seleccionar") {
                getPedido("ultimo", () => {
                    setView("pagar");
                });
            } else if (
                view == "inventario" &&
                subViewInventario == "inventario" &&
                modViewInventario == "list"
            ) {
                guardarNuevoProductoLote();
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
        },
        [view, selectItem]
    );
    useHotkeys(
        "f2",
        () => {
            if (view == "seleccionar") {
                setView("pedidos");
                getPedidos();
            } else if (view == "pagar") {
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
            } else if (
                view == "inventario" &&
                subViewInventario == "inventario" &&
                modViewInventario == "list"
            ) {
                changeInventario(null, null, null, "add");
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
        },
        [view]
    );
    useHotkeys(
        "f5",
        () => {
            if (view == "pagar") {
                del_pedido();
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
        },
        [view]
    );

    useHotkeys(
        "f4",
        () => {
            if (view == "pagar") {
                viewReportPedido();
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
        },
        [view]
    );

    useHotkeys(
        "f3",
        () => {
            if (view == "pagar") {
                toggleImprimirTicket();
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
            filter: false,
        },
        [view]
    );

    useHotkeys(
        "esc",
        () => {
            try {
                if (view == "pedidos") {
                    setView("seleccionar");
                } else if (
                    view == "seleccionar" &&
                    typeof selectItem == "number"
                ) {
                    setSelectItem(null);
                    setViewCaja(false);
                } else if (
                    view == "seleccionar" &&
                    typeof selectItem != "number"
                ) {
                    inputbusquedaProductosref.current.value = "";
                    inputbusquedaProductosref.current.focus();
                    if (viewCaja) {
                        setViewCaja(false);
                    }
                    if (showModalMovimientos) {
                        setShowModalMovimientos(false);
                    }
                } else if (view == "pagar") {
                    setToggleAddPersona(false);
                    toggleModalProductos(false);
                    setViewCaja(false);
                    if (
                        !ModaladdproductocarritoToggle &&
                        !toggleAddPersona &&
                        view != "seleccionar"
                    ) {
                        setView("seleccionar");
                    }
                } else if (view == "inventario") {
                    inputBuscarInventario.current.value = "";
                    inputBuscarInventario.current.focus();
                }
            } catch (err) {}
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
            filter: false,
        },
        [
            view,
            selectItem,
            viewCaja,
            showModalMovimientos,
            ModaladdproductocarritoToggle,
            toggleAddPersona,
        ]
    );

    useHotkeys(
        "space",
        () => {
            if (view == "seleccionar" && selectItem !== null) {
                setNumero_factura("nuevo");
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
            filter: false,
        },
        [view, selectItem]
    );

    useHotkeys(
        "d",
        () => {
            if (view == "pagar") {
                if (document.activeElement !== refaddfast.current) {
                    if (inputqinterno=="" && !togglereferenciapago) {
                        getDebito();
                    }
                }
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
            filter: false,
        },
        [view]
    );

    useHotkeys(
        "c",
        () => {
            if (view == "pagar") {
                if (document.activeElement !== refaddfast.current) {
                    if (inputqinterno=="" && !togglereferenciapago) {
                        getCredito();
                    }
                }
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
            filter: false,
        },
        [view]
    );

    useHotkeys(
        "t",
        () => {
            if (view == "pagar") {
                if (document.activeElement !== refaddfast.current) {
                    if (inputqinterno=="" && !togglereferenciapago) {
                        getTransferencia();
                    }
                }
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
            filter: false,
        },
        [view]
    );

    useHotkeys(
        "b",
        () => {
            if (view == "pagar") {
                if (document.activeElement !== refaddfast.current) {
                    if (inputqinterno=="" && !togglereferenciapago) {
                        getBio();
                    }   
                }
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
            filter: false,
        },
        [view]
    );

    useHotkeys(
        "e",
        () => {
            if (view == "pagar") {
                if (document.activeElement !== refaddfast.current) {
                    if (inputqinterno=="" && !togglereferenciapago) {
                        getEfectivo();
                    }
                }

            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
            filter: false,
        },
        [view]
    );
    useHotkeys(
        "down",
        (event) => {
            if (view == "seleccionar") {
                try {
                    let index = counterListProductos + 1;
                    if (tbodyproductosref.current.rows[index]) {
                        setCounterListProductos(index);

                        tbodyproductosref.current.rows[index].focus();
                    }
                } catch (err) {
                    //console.log(err)
                }
            } else if (view == "pagar") {
                if (inputqinterno !== "") {
                    let index = countListInter + 1;
                    if (tbodyproducInterref.current.rows[index]) {
                        setCountListInter(index);
                        tbodyproducInterref.current.rows[index].focus();
                    }
                } else if (toggleAddPersona) {
                    let index = countListPersoInter + 1;
                    if (tbodypersoInterref) {
                        if (tbodypersoInterref.current) {
                            if (tbodypersoInterref.current.rows) {
                                if (tbodypersoInterref.current.rows[index]) {
                                    setCountListPersoInter(index);
                                    tbodypersoInterref.current.rows[
                                        index
                                    ].focus();
                                }
                            }
                        }
                    }
                }
            } else if (
                view == "inventario" &&
                subViewInventario == "inventario" &&
                modViewInventario == "list"
            ) {
                // focusInputSibli(event.target, 1)
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
        },
        [
            view,
            counterListProductos,
            countListInter,
            countListPersoInter,
            subViewInventario,
            modViewInventario,
        ]
    );
    useHotkeys(
        "up",
        (event) => {
            if (view == "seleccionar") {
                if (counterListProductos > 0) {
                    try {
                        let index = counterListProductos - 1;
                        if (tbodyproductosref.current.rows[index]) {
                            tbodyproductosref.current.rows[index].focus();
                            setCounterListProductos(index);
                        }
                    } catch (err) {}
                }
            } else if (view == "pagar") {
                if (inputqinterno !== "") {
                    if (countListInter > 0) {
                        let index = countListInter - 1;
                        if (tbodyproducInterref.current.rows[index]) {
                            tbodyproducInterref.current.rows[index].focus();
                            setCountListInter(index);
                        }
                    }
                } else if (toggleAddPersona) {
                    if (countListPersoInter > 0) {
                        let index = countListPersoInter - 1;

                        if (tbodypersoInterref) {
                            if (tbodypersoInterref.current) {
                                if (tbodypersoInterref.current.rows) {
                                    if (
                                        tbodypersoInterref.current.rows[index]
                                    ) {
                                        tbodypersoInterref.current.rows[
                                            index
                                        ].focus();
                                        setCountListPersoInter(index);
                                    }
                                }
                            }
                        }
                    }
                }
            } else if (
                view == "inventario" &&
                subViewInventario == "inventario" &&
                modViewInventario == "list"
            ) {
                // focusInputSibli(event.target, -1)
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
        },
        [
            view,
            counterListProductos,
            countListInter,
            countListPersoInter,
            subViewInventario,
            modViewInventario,
        ]
    );
    useHotkeys(
        "enter",
        (event) => {
            if (typeof selectItem != "number" && view == "seleccionar") {
                try {
                    if (tbodyproductosref.current) {
                        let tr =
                            tbodyproductosref.current.rows[
                                counterListProductos
                            ];
                        let index = tr.attributes["data-index"].value;
                        if (permisoExecuteEnter) {
                            if (productos[index]) {
                                if (!productos[index].lotes.length) {
                                    addCarrito(index);
                                }
                            }
                            // console.log("Execute Enter")
                        }
                        //wait
                    }
                } catch (err) {}
            } else if (
                typeof selectItem == "number" &&
                view == "seleccionar" &&
                productos[selectItem]
            ) {
                addCarritoRequest("agregar");
            } else if (view == "pagar") {
                if (ModaladdproductocarritoToggle) {
                    addCarritoRequestInterno()
                }else if (inputqinterno !== "") {
                    if (tbodyproducInterref.current.rows[countListInter]) {
                        if (permisoExecuteEnter) {
                            setProductoCarritoInterno(
                                tbodyproducInterref.current.rows[countListInter]
                                    .attributes["data-index"].value
                            );
                            // console.log("Execute Enter")
                        }
                        //wait
                    }
                } else if (toggleAddPersona) {
                    if (tbodypersoInterref) {
                        if (tbodypersoInterref.current) {
                            if (
                                tbodypersoInterref.current.rows[
                                    countListPersoInter
                                ]
                            ) {
                                if (
                                    tbodypersoInterref.current.rows[
                                        countListPersoInter
                                    ].attributes["data-index"]
                                ) {
                                    setPersonas(
                                        tbodypersoInterref.current.rows[
                                            countListPersoInter
                                        ].attributes["data-index"].value
                                    );
                                }
                            }
                        }
                    }
                } else if (togglereferenciapago) {
                    addRefPago("enviar");
                } else {
                    if (inputqinterno=="") {
                        if (viewconfigcredito) {
                            setPagoPedido();
                        } else if(document.activeElement===refaddfast.current){
                            addCarritoFast()
                        } else {
                            facturar_e_imprimir();
                        }
                    }
                }
            } else if (
                view == "inventario" &&
                subViewInventario == "inventario" &&
                modViewInventario == "list"
            ) {
                focusInputSibli(event.target, 1);
            }
        },
        {
            keydown:true,
            keyup:false,
            filterPreventDefault: false,
            enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
        },
        [
            view,
            counterListProductos,
            selectItem,
            subViewInventario,
            modViewInventario,
        ]
    );

    useHotkeys(
        "ctrl+enter",
        (event) => {
            if (view == "pagar") {
                if (ModaladdproductocarritoToggle) {
                } else if (toggleAddPersona) {
                } else {
                    facturar_pedido();
                }
            }
        },
        {
            filterPreventDefault: false,
            enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
        },
        [
            view,
            counterListProductos,
            selectItem,
            subViewInventario,
            modViewInventario,
        ]
    );

    useEffect(() => {
        if (showinputaddCarritoFast) {
            if (inputbusquedaProductosref) {
                if (inputbusquedaProductosref.current) {
                    inputbusquedaProductosref.current.focus();
                }
            }
        }
    }, [showinputaddCarritoFast]);

    const [refPago, setrefPago] = useState([]);

    const addNewPedido = () => {
        db.addNewPedido({}).then(res=>{
            onClickEditPedido(null,res.data)
        })
    }
    const [categoriasCajas, setcategoriasCajas] = useState([])

    const getcatsCajas = () =>{
        db.getcatsCajas({}).then(res=>{
            setcategoriasCajas(res.data) 
        })
    }
    const addRefPago = (tipo, montoTraido = "", tipoTraido = "") => {
        /* let descripcion = window.prompt("Referencia")
    let monto = window.prompt("Monto")
    let banco = window.prompt("Banco") */
        if (tipo == "toggle") {
            settogglereferenciapago(!togglereferenciapago);

            settipo_referenciapago(tipoTraido);
            setmonto_referenciapago(montoTraido * dolar);
        }
        if (tipo == "enviar") {
            if (
                pedidoData.id &&
                descripcion_referenciapago &&
                monto_referenciapago
            ) {
                db.addRefPago({
                    tipo: tipo_referenciapago,
                    descripcion: descripcion_referenciapago,
                    monto: monto_referenciapago,
                    banco: banco_referenciapago,
                    id_pedido: pedidoData.id,
                }).then((res) => {
                    getPedido(null, null, false);
                    notificar(res);
                    settogglereferenciapago(false);

                    settipo_referenciapago("");
                    setdescripcion_referenciapago("");
                    setmonto_referenciapago("");
                    setbanco_referenciapago("");
                });
            }
        }
    };
    const changeEntregado = (e) => {
        let id = e.currentTarget.attributes["data-id"].value;
        if (confirm("Confirme Entrega de producto")) {
            db.changeEntregado({ id }).then((res) => {
                getPedido();
                notificar(res);
            });
        }
    };
    const delRefPago = (e) => {
        let id = e.currentTarget.attributes["data-id"].value;
        if (confirm("Confirme eliminación de referencia")) {
            db.delRefPago({ id }).then((res) => {
                getPedido();
                notificar(res);
            });
        }
    };
    //Gastos component

    const [qgastosfecha1, setqgastosfecha1] = useState("");
    const [qgastosfecha2, setqgastosfecha2] = useState("");
    const [qgastos, setqgastos] = useState("");
    const [qcatgastos, setqcatgastos] = useState("");
    const [gastosdescripcion, setgastosdescripcion] = useState("");
    const [gastoscategoria, setgastoscategoria] = useState("3");
    const [gastosmonto, setgastosmonto] = useState("");
    const [gastosData, setgastosData] = useState({});

    const delGastos = (e) => {
        let id = e.currentTarget.attributes["data-id"].value;
        if (id && confirm("Confirme eliminación de gasto")) {
            db.delGastos({ id }).then((res) => {
                notificar(res);
                getGastos();
            });
        }
    };
    const getGastos = () => {
        db.getGastos({
            qgastosfecha1,
            qgastosfecha2,
            qgastos,
            qcatgastos,
        }).then((res) => {
            if (res.data) {
                if (res.data.gastos) {
                    setgastosData(res.data);
                } else {
                    setgastosData({});
                }
            }
        });
    };
    const setGasto = (e) => {
        e.preventDefault();

        db.setGasto({
            gastosdescripcion,
            gastoscategoria,
            gastosmonto,
        }).then((res) => {
            notificar(res);
            getGastos();
        });
    };
    //End Gastos Component

    ////Historico producto
   
    const [showmodalhistoricoproducto, setshowmodalhistoricoproducto] = useState(false);
    
    const [fecha1modalhistoricoproducto, setfecha1modalhistoricoproducto] = useState("");
    const [fecha2modalhistoricoproducto, setfecha2modalhistoricoproducto] = useState("");
    const [usuariomodalhistoricoproducto, setusuariomodalhistoricoproducto] = useState("");
    const [datamodalhistoricoproducto, setdatamodalhistoricoproducto] = useState([]);
    const [selectproductohistoricoproducto, setselectproductohistoricoproducto] = useState(null);
    
    const openmodalhistoricoproducto = (id) => {
      getmovientoinventariounitario(id)
      setselectproductohistoricoproducto(id)
      setshowmodalhistoricoproducto(true)
    }

    const getmovientoinventariounitario = (id) => {
      db.getmovientoinventariounitario({
        id:id?id:selectproductohistoricoproducto,
        fecha1modalhistoricoproducto,
        fecha2modalhistoricoproducto,
        usuariomodalhistoricoproducto,
      }).then(res=>{
        if (Array.isArray(res.data)) {
          setdatamodalhistoricoproducto(res.data)
        }else{
          notificar(res.data)
        }
      })
    }
    
    /////End Historio producto


    //////Historico inventario
    const [qhistoinven, setqhistoinven] = useState("");
    const [fecha1histoinven, setfecha1histoinven] = useState("");
    const [fecha2histoinven, setfecha2histoinven] = useState("");
    const [orderByHistoInven, setorderByHistoInven] = useState("desc");
    const [usuarioHistoInven, setusuarioHistoInven] = useState("");
    const [historicoInventario, sethistoricoInventario] = useState([]);
    const getHistoricoInventario = () => {
      setLoading(true)

      db.getHistoricoInventario({
        qhistoinven,
        fecha1histoinven,
        fecha2histoinven,
        orderByHistoInven,
        usuarioHistoInven,
      }).then(res=>{
        sethistoricoInventario(res.data)
        setLoading(false)
      })
    }

    
    
    
    
    
    
    
    
    
    //////

    const [qBuscarCategorias, setQBuscarCategorias] = useState("");
    const [categorias, setcategorias] = useState([]);

    const [categoriasDescripcion, setcategoriasDescripcion] = useState("");
    const [indexSelectCategorias, setIndexSelectCategorias] = useState(null);

    const delCategorias = () => {
        setLoading(true);
        let id = null;
        if (indexSelectCategorias) {
            if (categorias[indexSelectCategorias]) {
                id = categorias[indexSelectCategorias].id;
            }
        }

        db.delCategoria({ id }).then((res) => {
            setLoading(false);
            getCategorias();
            notificar(res);
            setIndexSelectCategorias(null);
        });
    };

    const addNewCategorias = (e) => {
        e.preventDefault();

        let id = null;
        if (indexSelectCategorias) {
            if (categorias[indexSelectCategorias]) {
                id = categorias[indexSelectCategorias].id;
            }
        }

        if (categoriasDescripcion) {
            setLoading(true);
            db.setCategorias({ id, categoriasDescripcion }).then((res) => {
                notificar(res);
                setLoading(false);
                getCategorias();
            });
        }
    };
    const getCategorias = () => {
        db.getCategorias({
            q: qBuscarCategorias,
        }).then((res) => {
            if (res.data) {
                if (res.data.length) {
                    setcategorias(res.data);
                } else {
                    setcategorias([]);
                }
            }
        });
    };
    const setInputsCats = () => {
        if (indexSelectCategorias) {
            let obj = categorias[indexSelectCategorias];
            if (obj) {
                setcategoriasDescripcion(obj.descripcion);
            }
        }
    };
    useEffect(() => {
        setInputsCats();
    }, [indexSelectCategorias]);
    useEffect(() => {
        getCategorias();
    }, [qBuscarCategorias]);

    useEffect(() => {
        getUsuarios();
    }, [qBuscarUsuario]);

    useEffect(() => {
        setInputsUsuarios();
    }, [indexSelectUsuarios]);

    useEffect(() => {
        // let isMounted = true;
        getMoneda(); // ya invoca getProductos()
        getPedidosList();
        getToday();
        setSocketUrlDB();
        getSucursalFun();

        // return () => { isMounted = false }
    }, []);

    useEffect(() => {
        getFallas();
    }, [qFallas, orderCatFallas, orderSubCatFallas, ascdescFallas]);
    
    useEffect(() => {
        getClienteCrud();
    }, [qBuscarCliente]);
    useEffect(() => {
        focusCtMain();
    }, [selectItem]);
    useEffect(() => {
        getFacturas(false);
    }, [factqBuscar, factqBuscarDate, factOrderBy, factOrderDescAsc]);
    useEffect(() => {
        if (view == "pedidos") {
            getPedidos();
        }
    }, [
        fecha1pedido,
        fecha2pedido,
        tipobusquedapedido,
        tipoestadopedido,
        filterMetodoPagoToggle,
        orderbycolumpedidos,
        orderbyorderpedidos,
    ]);
    useEffect(() => {
        if (selectDeudor == null) {
            getDeudores();
        } else {
            getDeudor();
        }
    }, [selectDeudor]);
    useEffect(() => {
        getBuscarDevolucion();
    }, [buscarDevolucion]);

    useEffect(() => {
        buscarInventario();
    }, [Invnum, InvorderColumn, InvorderBy, qBuscarInventario]);

    useEffect(() => {
        if (viewCaja) {
            getMovimientosCaja();
        }
    }, [viewCaja, movCajaFecha]);
    useEffect(() => {
        if (view=="devoluciones") {
            getBuscarDevolucionhistorico();
        }
    }, [buscarDevolucionhistorico, view, fechaMovimientos]);

    useEffect(() => {
        getProveedores();
    }, [qBuscarProveedor]);
    useEffect(() => {
        if (view == "inventario") {
            if (subViewInventario == "fallas") {
                getFallas();
            } else if (subViewInventario == "inventario") {
                getProductos();
            } else if (subViewInventario == "proveedores") {
                getProveedores();
            }
        } else if (view == "pedidosCentral") {
            getmastermachine();
        }

        if (view == "seleccionar") {
            if (inputbusquedaProductosref) {
                if (inputbusquedaProductosref.current) {
                    inputbusquedaProductosref.current.value = "";
                    inputbusquedaProductosref.current.focus();
                }
            }
        }
    }, [view, subViewInventario]);

    useEffect(() => {
        if (view == "credito" || view == "vueltos") {
            getDeudores();
            getDeudor();
        }
    }, [view, qDeudores, orderbycolumdeudores, orderbyorderdeudores]);

    useEffect(() => {
        getProductos();
    }, [
        num,
        itemCero,
        //qProductosMain,
        orderColumn,
        orderBy,
    ]);

    useEffect(() => {
        setInputsInventario();
    }, [indexSelectInventario]);

    

    useEffect(() => {
        if (subViewInventario == "proveedores") {
            setInputsProveedores();
        } else if (subViewInventario == "facturas") {
            getPagoProveedor();
        }
    }, [subViewInventario, indexSelectProveedores]);

    useEffect(() => {
        setBilletes();
    }, [billete1, billete5, billete10, billete20, billete50, billete100]);
    

    useEffect(() => {
        getPedidos();
    }, [showMisPedido]);

    /* useEffect(() => {
    getInventarioSucursalFromCentral(subviewpanelcentroacopio)
  }, [subviewpanelcentroacopio]) */

    let total_caja_calc = (
        parseFloat(caja_usd ? caja_usd : 0) +
        parseFloat(caja_cop ? caja_cop : 0) / parseFloat(peso) +
        parseFloat(caja_bs ? caja_bs : 0) / parseFloat(dolar)
    ).toFixed(2);
    let total_caja_neto =
        !total_caja_calc || total_caja_calc == "NaN" ? 0 : total_caja_calc;

    let total_dejar_caja_calc = (
        parseFloat(dejar_usd ? dejar_usd : 0) +
        parseFloat(dejar_cop ? dejar_cop : 0) / parseFloat(peso) +
        parseFloat(dejar_bs ? dejar_bs : 0) / parseFloat(dolar)
    ).toFixed(2);
    let total_dejar_caja_neto =
        !total_dejar_caja_calc || total_dejar_caja_calc == "NaN"
            ? 0
            : total_dejar_caja_calc;

    let total_punto = dolar && caja_punto ? (caja_punto / dolar).toFixed(2) : 0;
    let total_biopago =
        dolar && caja_biopago ? (caja_biopago / dolar).toFixed(2) : 0;
    
    const runSockets = () => {
        /* const channel = Echo.channel("private.eventocentral."+user.sucursal)

        channel.subscribed(()=>{
            console.log("Subscrito a Central!")
        })
        .listen(".eventocentral",event=>{
            db.recibedSocketEvent({event}).then(({data})=>{
                console.log(data,"recibedSocketEvent Response")
            })
        }) */
    }

    const getSucursalFun = () => {
        db.getSucursal({}).then((res) => {
            if (res.data.codigo) {
                setSucursaldata(res.data);
            }
        });
    };
    const openReporteFalla = (id) => {
        if (id) {
            db.openReporteFalla(id);
        }
    };
    const getEstaInventario = () => {
        if (time != 0) {
            clearTimeout(typingTimeout);
        }

        let time = window.setTimeout(() => {
            setLoading(true);
            db.getEstaInventario({
                fechaQEstaInve,
                fechaFromEstaInve,
                fechaToEstaInve,
                orderByEstaInv,
                categoriaEstaInve,
                orderByColumEstaInv,
            }).then((e) => {
                setdataEstaInven(e.data);
                setLoading(false);
            });
        }, 150);
        setTypingTimeout(time);
    };
    const setporcenganancia = (tipo, base = 0, fun = null) => {
        let insert = window.prompt("Porcentaje");
        if (insert) {
            if (number(insert)) {
                if (tipo == "unique") {
                    let re = (
                        parseFloat(inpInvbase) +
                        parseFloat(inpInvbase) * (parseFloat(insert) / 100)
                    ).toFixed(2);
                    if (re) {
                        setinpInvventa(re);
                    }
                } else if ("list") {
                    let re = (
                        parseFloat(base) +
                        parseFloat(base) * (parseFloat(insert) / 100)
                    ).toFixed(2);
                    if (re) {
                        fun(re);
                    }
                }
            }
        }
    };

    const focusInputSibli = (tar, mov) => {
        let inputs = [].slice.call(refsInpInvList.current.elements);
        let index;
        if (tar.tagName == "INPUT") {
            if (mov == "down") {
                mov = 11;
            } else if (mov == "up") {
                mov = -11;
            }
        }
        for (let i in inputs) {
            if (tar == inputs[i]) {
                index = parseInt(i) + mov;
                if (refsInpInvList.current[index]) {
                    refsInpInvList.current[index].focus();
                }
                break;
            }
        }
        if (typeof index === "undefined") {
            if (refsInpInvList.current[0]) {
                refsInpInvList.current[0].focus();
            }
        }
    };
    const sendCuentasporCobrar = () => {
        db.sendCuentasporCobrar({}).then((res) => {
            notificar(res);
        });
    };
    const setBackup = () => {
        db.backup({});
    };
    const getCierres = () => {
        db.getCierres({ fechaGetCierre, fechaGetCierre2 , tipoUsuarioCierre}).then((res) => {
            if (res.data) {
                if (res.data.cierres) {
                    setCierres(res.data);
                } else {
                    setCierres({});
                }
            }
        });
    };
    const setcajaFuerteFun = (type,val,notchica=true) => {
		let val_chica = 0
		switch (type) {
			case "setCajaFuerteEntradaCierreDolar":
				setCajaFuerteEntradaCierreDolar(val)
				
				val_chica = parseFloat(guardar_usd-val).toFixed(2)
				if (notchica) {
                    setCajaChicaEntradaCierreDolar(val_chica)   
                }
			break;
			case "setCajaFuerteEntradaCierreCop":
				setCajaFuerteEntradaCierreCop(val)

				val_chica = parseFloat(guardar_cop-val).toFixed(2)
				if (notchica) {
                    setCajaChicaEntradaCierreCop(val_chica)   
                }
			break;
			case "setCajaFuerteEntradaCierreBs":
				setCajaFuerteEntradaCierreBs(val)

				val_chica = parseFloat(guardar_bs-val).toFixed(2)
				if (notchica) {
                    setCajaChicaEntradaCierreBs(val_chica)   
                }
			break;
		}
	}
    const fun_setguardar = (type,val,cierreForce) =>{
		let total = number(cierreForce["efectivo_guardado"])
		if (type=="setguardar_cop") {
			
				setguardar_cop(val)
                setcajaFuerteFun("setCajaFuerteEntradaCierreCop",val,false)

				let p = number((val/peso).toFixed(1))
				let u = total-p

				setguardar_bs("")
                setcajaFuerteFun("setCajaFuerteEntradaCierreBs","",false)

				setguardar_usd(u)
                setcajaFuerteFun("setCajaFuerteEntradaCierreDolar",u,false)
		}

		if (type=="setguardar_bs") {
			setguardar_bs(val)
            setcajaFuerteFun("setCajaFuerteEntradaCierreBs",val,false)


			if (!val) {
				let p = number((guardar_cop/peso).toFixed(1))
				let u = total-p

				setguardar_usd(u)
                setcajaFuerteFun("setCajaFuerteEntradaCierreDolar",u,false)
			}else{
				let u = ((total-number((guardar_cop/peso).toFixed(1)))-number((val/dolar).toFixed(1))).toFixed(1)
				setguardar_usd(u)
                setcajaFuerteFun("setCajaFuerteEntradaCierreDolar",u,false)

			}
		}


	}
    const cerrar_dia = (e = null) => {
        if (e) {
            e.preventDefault();
        }
        setLoading(true);
        db.cerrar({
            total_caja_neto,
            total_punto,
            dejar_usd,
            dejar_cop,
            dejar_bs,
            totalizarcierre,
            total_biopago,
        }).then((res) => {
            let cierreData = res.data;
            if (res.data) {
                setguardar_usd(cierreData["efectivo_guardado"]);

                fun_setguardar("setguardar_cop",guardar_cop,cierreData)
                fun_setguardar("setguardar_bs",guardar_bs,cierreData)

                settipo_accionCierre(cierreData["tipo_accion"]);
                setFechaCierre(cierreData["fecha"]);


                /* setCajaFuerteEntradaCierreBs()
                setCajaFuerteEntradaCierreCop() */
            }
            setCierre(cierreData);
            if (res.data.estado == false) {
                notificar(res);
            }
            console.log(res.data.estado);
            setLoading(false);
        });
    };
    const focusCtMain = () => {
        if (inputCantidadCarritoref.current) {
            inputCantidadCarritoref.current.focus();
        }
    };
    function getBuscarDevolucion() {
        setLoading(true);

        if (time != 0) {
            clearTimeout(typingTimeout);
        }

        let time = window.setTimeout(() => {
            db.getBuscarDevolucion({
                qProductosMain: buscarDevolucion,
                num: 10,
                itemCero:true, 
                orderColumn: "descripcion",
                orderBy: "asc",
            }).then((res) => {
                setProductosDevolucionSelect(res.data);
                setLoading(false);
            });
        }, 150);
        setTypingTimeout(time);
    }
    const setToggleAddPersonaFun = (prop, callback = null) => {
        setToggleAddPersona(prop);
        if (callback) {
            callback();
        }
    };
    const getMovimientos = (val = "") => {
        setLoading(true);
        db.getMovimientos({ val, fechaMovimientos }).then((res) => {
            setMovimientos(res.data);

            // if (!res.data.length) {
            // setIdMovSelect("nuevo")
            // }else{
            //   if (res.data[0]) {
            //     setIdMovSelect(res.data[0].id)
            //   }
            // }
            setLoading(false);
        });
    };
    const getDeudor = () => {
        try {
            if (deudoresList[selectDeudor]) {
                setLoading(true);
                db.getDeudor({
                    onlyVueltos,
                    id: deudoresList[selectDeudor].id,
                }).then((res) => {
                    // detallesDeudor
                    setDetallesDeudor(res.data);
                    setLoading(false);
                });
            }
        } catch (err) {}
    };
    const entregarVuelto = () => {
        let monto = window.prompt("Monto a entregar");
        if (monto) {
            if (pedidoData.id && number(monto)) {
                setLoading(true);

                db.entregarVuelto({ id_pedido: pedidoData.id, monto }).then(
                    (res) => {
                        notificar(res);
                        getPedido();
                        getMovimientosCaja();
                        setLoading(false);
                    }
                );
            }
        }
    };
    const getDebito = () => {
        setDebito(pedidoData.clean_total);
        setEfectivo("");
        setTransferencia("");
        setCredito("");
        setBiopago("");
    };
    const getCredito = () => {
        setCredito(pedidoData.clean_total);
        setEfectivo("");
        setDebito("");
        setTransferencia("");
        setBiopago("");
    };
    const getTransferencia = () => {
        setTransferencia(pedidoData.clean_total);
        setEfectivo("");
        setDebito("");
        setCredito("");
        setBiopago("");
    };
    const getBio = () => {
        setBiopago(pedidoData.clean_total);
        setTransferencia("");
        setEfectivo("");
        setDebito("");
        setCredito("");
    };
    const getEfectivo = () => {
        setEfectivo(pedidoData.clean_total);
        setDebito("");
        setTransferencia("");
        setCredito("");
        setBiopago("");
    };
    const getToday = () => {
        db.today({}).then((res) => {
            let today = res.data;
            setToday(today);

            setFecha1pedido(today);
            setFecha2pedido(today);
            setFechaMovimientos(today);
            setMovCajaFecha(today);
            setfechaventas(today);
            setqgastosfecha1(today);
            setqgastosfecha2(today);
            setfechainiciocredito(today);
            setcontrolefecQDesde(today);
            setcontrolefecQHasta(today);

            setcontrolefecQDesde(today)
            setcontrolefecQHasta(today)
        });
    };
    const getMovimientosCaja = () => {
        setLoading(true);
        db.getMovimientosCaja({ fecha: movCajaFecha }).then((res) => {
            setMovimientosCaja(res.data);
            setLoading(false);
        });
    };
    const setMovimientoCaja = (e) => {
        e.preventDefault();
        setLoading(true);
        db.setMovimientoCaja({
            descripcion: movCajadescripcion,
            tipo: movCajatipo,
            categoria: movCajacategoria,
            monto: movCajamonto,
            fecha: movCajaFecha,
        }).then((res) => {
            getMovimientosCaja();
            notificar(res);
            setLoading(false);
            setMovCajadescripcion("");
            setMovCajamonto("");
        });
    };
    const filterMetodoPago = (e) => {
        let type = e.currentTarget.attributes["data-type"].value;

        setFilterMetodoPagoToggle(type);
    };
    const onchangecaja = (e) => {
        let name = e.currentTarget.attributes["name"].value;
        let val;
        if (
            name == "notaCierre" ||
            name == "tipo_pago_deudor" ||
            name == "qDeudores"
        ) {
            val = e.currentTarget.value;
        } else {
            val = number(e.currentTarget.value);
            val = val == "NaN" || !val ? "" : val;
        }

        switch (name) {
            case "caja_usd":
                setCaja_usd(val);
                break;

            case "caja_cop":
                setCaja_cop(val);
                setguardar_cop(val)
                break;
                
            case "caja_bs":
                setCaja_bs(val);
                setguardar_bs(val)
                break;

            case "dejar_usd":
                setDejar_usd(val);
                break;

            case "dejar_cop":
                setDejar_cop(val);
                setguardar_cop(caja_cop-val)
                break;
                
            case "dejar_bs":
                    
                setDejar_bs(val);
                setguardar_bs(caja_bs-val)

                break;

            case "caja_punto":
                setCaja_punto(val);
                break;

            case "notaCierre":
                setNotaCierre(val);
                break;

            case "tipo_pago_deudor":
                setTipo_pago_deudor(val);
                break;
            case "monto_pago_deudor":
                setMonto_pago_deudor(val);
                break;
            case "qDeudores":
                setQDeudores(val);
                break;
            case "caja_biopago":
                setcaja_biopago(val);
                break;
        }
    };

   
    const setMoneda = (e) => {
        const tipo = e.currentTarget.attributes["data-type"].value;
        let valor = window.prompt("Nuevo valor");
        if (valor) {
            db.setMoneda({ tipo, valor }).then((res) => {
                getMoneda();
                /* getProductos(); */
            });
        }
    };
    const getMoneda = () => {
        setLoading(true);
        db.getMoneda().then((res) => {
            if (res.data.peso) {
                setPeso(res.data.peso);
            }

            if (res.data.dolar) {
                setDolar(res.data.dolar);
            }
            setLoading(false);
        });
    };
    const toggleModalProductos = (prop, callback = null) => {
        setModaladdproductocarritoToggle(prop);
        
        if (callback) {
            callback();
        }
    };
    const toggleImprimirTicket = (id_fake = null) => {
        if (pedidoData) {
            let printer = 0;
            let printdefault = 1
            if (user.usuario) {
                let lastchar = user.usuario.slice(-1)
                if (
                    lastchar==1 ||
                    lastchar==2 ||
                    lastchar==3 ||
                    lastchar==4
                ) {
                    printdefault = lastchar
                }
            }
            if (!selectprinter) {
                printer = parseInt(
                    window.prompt("Número de impresora donde desea imprimir (La que seleccione se guardará por ésta sesión). 1 | 2 | 3 | 4", printdefault)
                );
            }

            let promptInfoCliente = window.prompt("(Moneda: $ | bs | cop),(Identificación),(Nombre y Apellido) Separado por coma (,)",
                    pedidoData.cliente
                        ? "bs," +
                              pedidoData.cliente.identificacion +
                              "," +
                              pedidoData.cliente.nombre
                        : ""
                ).split(",");
            let moneda = promptInfoCliente[0];
            let identificacion = promptInfoCliente[1];
            let nombres = promptInfoCliente[2];

            if (identificacion) {
                if (selectprinter) {printer = selectprinter;} else {setselectprinter(printer);}
                if (!printer) {alert("¡Debe seleccionar una tickera!")}
                if (nombres&&printer) {
                    console.log("Imprimiendo en Caja " + printer);

                    db.imprimirTicked({
                        id: id_fake ? id_fake : pedidoData.id,
                        identificacion,
                        nombres,
                        moneda,
                        printer,
                        presupuestocarrito
                    }).then((res) => {
                        notificar(res.data.msj);
                    });
                }

            }
        }
    };
    const onChangePedidos = (e) => {
        const type = e.currentTarget.attributes["data-type"].value;
        const value = e.currentTarget.value;
        switch (type) {
            case "busquedaPedido":
                setBusquedaPedido(value);
                break;
            case "fecha1pedido":
                setFecha1pedido(value);
                break;
            case "fecha2pedido":
                setFecha2pedido(value);
                break;
        }
    };
    const getPedidos = (e) => {
        if (e) {
            e.preventDefault();
        }
        setLoading(true);
        setPedidos([]);

        if (time != 0) {
            clearTimeout(typingTimeout);
        }
        let time = window.setTimeout(() => {
            db.getPedidos({
                vendedor: showMisPedido ? [user.id_usuario] : [],
                busquedaPedido,
                fecha1pedido,
                fecha2pedido,
                tipobusquedapedido,
                tipoestadopedido,
                filterMetodoPagoToggle,
                orderbycolumpedidos,
                orderbyorderpedidos,
            }).then((res) => {
                if (res.data) {
                    setPedidos(res.data);
                } else {
                    setPedidos([]);
                }
                setLoading(false);
            });
        }, 150);
        setTypingTimeout(time);
    };
    const getProductos = (valmain = null,itemCeroForce=null) => {
        setpermisoExecuteEnter(false);
        setLoading(true);

        if (time != 0) {
            clearTimeout(typingTimeout);
        }

        if (view == "seleccionar") {
            if (inputbusquedaProductosref.current) {
                valmain = inputbusquedaProductosref.current.value;
            }
        }

        let time = window.setTimeout(() => {
            db.getinventario({
                vendedor: showMisPedido ? [user.id_usuario] : [],
                num,
                itemCero: itemCeroForce?itemCeroForce:itemCero,
                qProductosMain: valmain ? valmain : qProductosMain,
                orderColumn,
                orderBy,
            }).then((res) => {
                if (res.data) {
                    if (res.data.estado===false) {
                        notificar(res.data.msj,false)
                    }
                    let len = res.data.length;
                    if (len) {
                        setProductos(res.data);
                    }
                    if (!len) {
                        setProductos([]);
                    }
                    if (!res.data[counterListProductos]) {
                        setCounterListProductos(0);
                        setCountListInter(0);
                    }

                    if (showinputaddCarritoFast) {
                        if (len == 1) {
                            setQProductosMain("");
                            let id_pedido_fact = null;
                            if (
                                ModaladdproductocarritoToggle &&
                                pedidoData.id
                            ) {
                                id_pedido_fact = pedidoData.id;
                            }
                            addCarritoRequest(
                                "agregar",
                                res.data[0].id,
                                id_pedido_fact
                            );
                        }
                    }
                }
                setLoading(false);
            });
            setpermisoExecuteEnter(true);
        }, 150);
        setTypingTimeout(time);
    };
    const getPersona = (q) => {
        setLoading(true);
        if (time != 0) {
            clearTimeout(typingTimeout);
        }

        let time = window.setTimeout(() => {
            db.getpersona({ q }).then((res) => {
                if (res.data) {
                    if (res.statusText == "OK") {
                        if (res.data.length) {
                            setPersona(res.data);
                        } else {
                            setPersona([]);
                        }
                    }
                    if (!res.data.length) {
                        setclienteInpidentificacion(q);
                    }
                    setLoading(false);
                }
            });
        }, 100);
        setTypingTimeout(time);
    };

    const [devolucionselect, setdevolucionselect] = useState(null);
    const [menuselectdevoluciones, setmenuselectdevoluciones] =
        useState("cliente");

    const [clienteselectdevolucion, setclienteselectdevolucion] =
        useState(null);
    const [productosselectdevolucion, setproductosselectdevolucion] = useState(
        []
    );
    const [prodTempoDevolucion, setprodTempoDevolucion] = useState({})
    
    const [devolucionSalidaEntrada, setdevolucionSalidaEntrada] = useState(null)
    const [devolucionTipo, setdevolucionTipo] = useState(null)
    const [devolucionCt, setdevolucionCt] = useState("")
    const [devolucionMotivo, setdevolucionMotivo] = useState("")


    const [pagosselectdevolucion, setpagosselectdevolucion] = useState([]);
    const [pagosselectdevoluciontipo, setpagosselectdevoluciontipo] =
        useState("");
    const [pagosselectdevolucionmonto, setpagosselectdevolucionmonto] =
        useState("");

    const getSum = (total, num) => {
        return total + number(num.cantidad) * number(num.precio);
    };

    let devolucionsumentrada = () => {
        let val = productosselectdevolucion
            .filter((e) => e.tipo == 1)
            .reduce(getSum, 0);
        return val;
    };
    let devolucionsumsalida = () => {
        let val = productosselectdevolucion
            .filter((e) => e.tipo == 0)
            .reduce(getSum, 0);
        return val;
    };
    let devolucionsumdiferencia = () => {
        let val = devolucionsumsalida() - devolucionsumentrada();
        return {
            dolar: val,
            bs: val * dolar,
        };
    };

    const sethandlepagosselectdevolucion = () => {
        if (
            !pagosselectdevolucion.filter(
                (e) => e.tipo == pagosselectdevoluciontipo
            ).length &&
            (pagosselectdevoluciontipo || pagosselectdevolucionmonto)
        ) {
            setpagosselectdevolucion(
                pagosselectdevolucion.concat({
                    tipo: pagosselectdevoluciontipo,
                    monto: pagosselectdevolucionmonto,
                })
            );
        }
    };
    const delpagodevolucion = (id) => {
        setpagosselectdevolucion(
            pagosselectdevolucion.filter((e) => e.tipo != id)
        );
    };
    const delproductodevolucion = (id) => {
        setproductosselectdevolucion(
            productosselectdevolucion.filter((e) => e.idproducto != id)
        );
    };

    const getBuscarDevolucionhistorico = () => {
        setLoading(true);

        db.getBuscarDevolucionhistorico({
            q: buscarDevolucionhistorico,
            num: 10,
            orderColumn: "id",
            orderBy: "desc",
        }).then((res) => {
            setproductosDevolucionSelecthistorico(res.data);
            setLoading(false);
        });
    };
    const agregarProductoDevolucionTemporal = () =>{
        setprodTempoDevolucion({})
        let id = prodTempoDevolucion.id
        let precio = prodTempoDevolucion.precio
        let descripcion = prodTempoDevolucion.descripcion
        let codigo = prodTempoDevolucion.codigo_barras
        if (
            !productosselectdevolucion.filter(
                (e) => e.idproducto == id && e.tipo == devolucionSalidaEntrada
            ).length
        ) {
            setproductosselectdevolucion(
                productosselectdevolucion.concat({
                    idproducto: id,
                    tipo:devolucionSalidaEntrada,
                    categoria:devolucionTipo,
                    cantidad:devolucionCt,
                    motivo:devolucionMotivo,
                    precio: precio,
                    descripcion: descripcion,
                    codigo: codigo,
                })
            );
        }

        console.log(productosselectdevolucion)

    }
    const sethandleproductosselectdevolucion = (e) => {
        let type = e.currentTarget;
        let id = type.attributes["data-id"].value;


       
        let prod = productosDevolucionSelect.filter(e=>e.id==id)[0]

        setdevolucionSalidaEntrada(null)
        setdevolucionTipo(null)
        setdevolucionCt("")
        setdevolucionMotivo("")
        setprodTempoDevolucion({
            id:id,
            precio:prod.precio,
            descripcion:prod.descripcion,
            codigo_barras:prod.codigo_barras,
            codigo_proveedor:prod.codigo_proveedor,
        })

        
    };

    const setPersonaFastDevolucion = (e) => {
        e.preventDefault();
        db.setClienteCrud({
            id: null,
            clienteInpidentificacion,
            clienteInpnombre,
            clienteInpdireccion,
            clienteInptelefono,
        }).then((res) => {
            notificar(res);
            if (res.data) {
                if (res.data.estado) {
                    if (res.data.id) {
                        setclienteselectdevolucion(res.data.id);
                        setmenuselectdevoluciones("inventario");
                    }
                }
            }
            setLoading(false);
        });
    };

    const createDevolucion = (id) => {
        setLoading(true);

        if (devolucionselect) {
            alert("Error: Devolución pendiente");
        } else {
            db.createDevolucion({
                idcliente: id,
            }).then((res) => {
                notificar(res);
                if (res.data) {
                    let data = res.data;
                    setdevolucionselect(data.id_devolucion);
                }
                setLoading(false);
            });
        }
    };

    const setDevolucion = () => {
        if (
            confirm(
                "¿Está seguro de guardar la información? Ésta acción no se puede deshacer"
            )
        ) {
            let tipo
            if (devolucionsumdiferencia().dolar>0) {tipo = 1}
            if (devolucionsumdiferencia().dolar<0) {tipo = -1}

            let procesado = false

            let ref, banco
            
            pagosselectdevolucion.map((e) => {
                if (e.tipo=="1") {
                    ref = window.prompt("Referencia")
                    banco = window.prompt("Banco")
                }
                if (e.tipo=="1" && (!ref || !banco)) {
                    alert("Error: Debe cargar referencia de transferencia electrónica.");
                }else{
                    db.setPagoCredito({
                        id_cliente: clienteselectdevolucion,
                        tipo_pago_deudor: e.tipo,
                        monto_pago_deudor: e.monto*tipo,
                    }).then((res) => {
                        notificar(res);
                        if (res.data.estado) {
                            setpagosselectdevolucion([]);
                        }
                        if (ref && banco) {
                            db.addRefPago({
                                check:false,
                                tipo: 1,
                                descripcion: ref,
                                banco: banco,
                                monto: e.monto*tipo,
                                id_pedido: res.data.id_pedido,
                            }).then((res) => {
                                notificar(res);
                            });
                        }
                    });
                }
            });
            
            db.setDevolucion({
                productosselectdevolucion,
                id_cliente: clienteselectdevolucion,
            }).then((res) => {
                procesado = false
                notificar(res)
                if (res.data.estado) {
                    setproductosselectdevolucion([])
                    setclienteselectdevolucion(null)
                }
            });
        }
    };

    const setpagoDevolucion = (id_producto) => {
        db.setpagoDevolucion({
            devolucionselect,
            id_producto,
        }).then((res) => {
            notificar(res);
            if (res.data) {
                let data = res.data;
            }
            setLoading(false);
        });
    };

    const setPersonaFast = (e) => {
        e.preventDefault();
        db.setClienteCrud({
            id: null,
            clienteInpidentificacion,
            clienteInpnombre,
            clienteInpdireccion,
            clienteInptelefono,
        }).then((res) => {
            notificar(res);
            if (res.data) {
                if (res.data.estado) {
                    if (res.data.id) {
                        setPersonas(res.data.id);
                    }
                }
            }
            setLoading(false);
        });
    };
    const printCreditos = () => {
        db.openPrintCreditos(
            "qDeudores=" +
                qDeudores +
                "&orderbycolumdeudores=" +
                orderbycolumdeudores +
                "&orderbyorderdeudores=" +
                orderbyorderdeudores +
                ""
        );
    };
    const getPedidosList = (callback = null) => {
        db.getPedidosList({
            vendedor: user.id_usuario ? user.id_usuario : 1,
        }).then((res) => {
            if (res.data) {
                setPedidoList(res.data);
            }
            if (res.data[0]) {
                setNumero_factura(res.data[0].id);
            } else {
                setNumero_factura("nuevo");
            }
            if (callback) {
                callback(res.data[0].id);
            }
        });
    };
    const [showModalPedidoFast, setshowModalPedidoFast] = useState(false);
    const getPedidoFast = (e) => {
        let id = e.currentTarget.attributes["data-id"].value;
        setshowModalPedidoFast(true);
        getPedido(id);
    };

    const getReferenciasElec = () => {
        setrefrenciasElecData([])
        db.getReferenciasElec({
            fecha1pedido,
            fecha2pedido,
        }).then(res=>{
            setrefrenciasElecData(res.data)
        })

    }

    const getPedido = (id, callback = null, clearPagosPedido = true) => {
        setLoading(true);
        if (!id) {
            id = pedidoSelect;
        } else {
            setPedidoSelect(id);
        }
        db.getPedido({ id }).then((res) => {
            setLoading(false);
            if (res.data) {
                if (res.data.estado===false) {
                    notificar(res.data.msj,false)
                }
                setPedidoData(res.data);
                setdatadeudacredito({});
                setviewconfigcredito(false);

                if (clearPagosPedido) {
                    setTransferencia("");
                    setDebito("");
                    setEfectivo("");
                    setCredito("");
                    setVuelto("");
                    setBiopago("");
                }
                setrefPago([]);

                getPedidosFast();

                if (res.data.referencias) {
                    if (res.data.referencias.length) {
                        setrefPago(res.data.referencias);
                    }
                } else {
                    setrefPago([]);
                }

                if (res.data.pagos) {
                    let d = res.data.pagos;
                    if (d.filter((e) => e.tipo == 1)[0]) {
                        let var_setTransferencia = d.filter(
                            (e) => e.tipo == 1
                        )[0].monto;
                        if (var_setTransferencia == "0.00") {
                            if (clearPagosPedido) {
                                setTransferencia("");
                            }
                        } else {
                            setTransferencia(
                                d.filter((e) => e.tipo == 1)[0].monto
                            );
                        }
                    }
                    if (d.filter((e) => e.tipo == 2)[0]) {
                        let var_setDebito = d.filter((e) => e.tipo == 2)[0]
                            .monto;
                        if (var_setDebito == "0.00") {
                            if (clearPagosPedido) {
                                setDebito("");
                            }
                        } else {
                            setDebito(d.filter((e) => e.tipo == 2)[0].monto);
                        }
                    }
                    if (d.filter((e) => e.tipo == 3)[0]) {
                        let var_setEfectivo = d.filter((e) => e.tipo == 3)[0]
                            .monto;
                        if (var_setEfectivo == "0.00") {
                            if (clearPagosPedido) {
                                setEfectivo("");
                            }
                        } else {
                            setEfectivo(d.filter((e) => e.tipo == 3)[0].monto);
                        }
                    }
                    if (d.filter((e) => e.tipo == 4)[0]) {
                        let var_setCredito = d.filter((e) => e.tipo == 4)[0]
                            .monto;
                        if (var_setCredito == "0.00") {
                            if (clearPagosPedido) {
                                setCredito("");
                            }
                        } else {
                            setCredito(d.filter((e) => e.tipo == 4)[0].monto);
                        }
                    }

                    if (d.filter((e) => e.tipo == 5)[0]) {
                        let var_setBiopago = d.filter((e) => e.tipo == 5)[0]
                            .monto;
                        if (var_setBiopago == "0.00") {
                            if (clearPagosPedido) {
                                setBiopago("");
                            }
                        } else {
                            setBiopago(d.filter((e) => e.tipo == 5)[0].monto);
                        }
                    }
                    if (d.filter((e) => e.tipo == 6)[0]) {
                        let var_setVuelto = d.filter((e) => e.tipo == 6)[0]
                            .monto;
                        if (var_setVuelto == "0.00") {
                            if (clearPagosPedido) {
                                setVuelto("");
                            }
                        } else {
                            setVuelto(d.filter((e) => e.tipo == 6)[0].monto);
                        }
                    }
                } else {
                    alert("Sin pagos registrados");
                }
                if (callback) {
                    callback();
                }

                setinputqinterno("")
            }
        });
    };
    const addCarritoFast = () => {
        if (pedidoData.id) {
          if (refaddfast) {
            if (refaddfast.current) {
              db.getinventario({exacto:"si",num:1,itemCero,qProductosMain:refaddfast.current.value,orderColumn:"id",orderBy:"desc"}).then(res=>{
                if(res.data.length==1){
                  let id = res.data[0].id
                  db.setCarrito({id,type:null,cantidad:1000000,numero_factura:pedidoData.id}).then(res=>{
                    setinputqinterno("")
                    getPedido()
                  })
                }
              })
            }
          }
        }
      } 
    const addCarrito = (e, callback = null) => {
        let index, loteid;
        if (e.currentTarget) {
            let attr = e.currentTarget.attributes;
            index = attr["data-index"].value;

            if (attr["data-loteid"]) {
                loteid = attr["data-loteid"].value;
            }
        } else {
            index = e;
        }
        setLoteIdCarrito(loteid);

        if (index != counterListProductos && productos[index].lotes.length) {
            setCounterListProductos(index);
        } else {
            if (pedidoList[0]) {
                setNumero_factura(pedidoList[0].id);
            } else {
                setNumero_factura("nuevo");
            }
            setSelectItem(parseInt(index));
            if (callback) {
                callback();
            }
        }
    };
    const addCarritoRequest = (
        e,
        id_direct = null,
        id_pedido_direct = null,
        cantidad_direct = null
    ) => {
        try {
            setLoading(true);
            let type;
            if (e.currentTarget) {
                type = e.currentTarget.attributes["data-type"].value;
                e.preventDefault();
            } else {
                type = e;
            }
            let id = null;
            if (productos[selectItem]) {id = productos[selectItem].id;}
            if (id_direct) {id = id_direct;}

            db.setCarrito({
                id,
                type,
                cantidad: cantidad_direct? cantidad_direct: cantidad,
                numero_factura: id_pedido_direct
                    ? id_pedido_direct
                    : numero_factura,
                loteIdCarrito,
            }).then((res) => {
                // getProductos()
                if (res.data.msj) {
                    notificar(res.data.msj)
                }
                if (numero_factura == "nuevo") {
                    getPedidosList();
                }
                switch (res.data.type) {
                    case "agregar":
                        setSelectItem(null);
                        notificar(res);

                        if (
                            showinputaddCarritoFast &&
                            ModaladdproductocarritoToggle
                        ) {
                            getPedido(res.data.num_pedido);
                        }

                        break;
                    case "agregar_procesar":
                        getPedido(res.data.num_pedido, () => {
                            setView("pagar");
                            setSelectItem(null);
                        });
                        break;
                }
                setCantidad("");
                if (inputbusquedaProductosref) {
                    if (inputbusquedaProductosref.current) {
                        inputbusquedaProductosref.current.value = "";
                        inputbusquedaProductosref.current.focus();
                    }
                }

                setLoading(false);
            });
        } catch (err) {
            alert(err);
        }
    };
    const onClickEditPedido = (e,id_force=null) => {
        let id ;
        if (!e && id_force) {
            id = id_force
        }else{
            id = e.currentTarget.attributes["data-id"].value;
        }
        getPedido(id, () => {
            setView("pagar");
        });
    };
    const setexportpedido = () => {
        let sucursal = sucursalesCentral.filter(e=>e.id==transferirpedidoa)

        if (sucursal.length) {
            
            if (confirm("¿Realmente desea exportar los productos a "+sucursal[0].nombre+"?")){
                db.setexportpedido({ transferirpedidoa, id:pedidoData.id }).then((res) => {
                    if (res.data.estado) {
                        setPedidoTransferido()
                    }
                    notificar(res);
                });
            }
        }
    };

    const setPedidoTransferido = () => {
        //setPagoPedido
        db.setPagoPedidoTrans({
            id: pedidoData.id,
        }).then(res=>{

            setLoading(false);
            if (res.data) {
                if (inputqinterno!=="") {
                    setinputqinterno("");
                }
                setView("seleccionar");
                // getPedidos()
                getPedidosList();
                getProductos();

                setSelectItem(null);
                setviewconfigcredito(false);

                if (callback) {callback()}
            }
            notificar(res)
        })
    }
    const onCLickDelPedido = (e) => {
        if (confirm("¿Seguro de eliminar?")) {
            const current = e.currentTarget.attributes;
            const id = current["data-id"].value;
            let motivo = window.prompt("¿Cuál es el Motivo de eliminación?");
            if (motivo) {
                db.delpedido({ id, motivo }).then((res) => {
                    notificar(res);

                    switch (current["data-type"].value) {
                        case "getDeudor":
                            getDeudor();

                            break;

                        case "getPedidos":
                            getPedidos();
                            getPedidosList();

                            break;
                    }
                });
            }
        }
    };
    const delItemPedido = (e) => {
        setLoading(true);
        const index = e.currentTarget.attributes["data-index"].value;
        db.delItemPedido({ index }).then((res) => {
            getPedido();
            setLoading(false);
            notificar(res);
        });
    };
    const setPrecioAlternoCarrito = (e) => {
        let iditem = e.currentTarget.attributes["data-iditem"].value;
        let p = window.prompt("p1 | p2", "p1");
        if (p == "p1" || p == "p2") {
            db.setPrecioAlternoCarrito({ iditem, p }).then((res) => {
                notificar(res);
                getPedido();
            });
        }
    };

    const setCtxBultoCarrito = (e) => {
        let iditem = e.currentTarget.attributes["data-iditem"].value;
        let ct = window.prompt("Cantidad por bulto");
        if (ct) {
            db.setCtxBultoCarrito({ iditem, ct }).then((res) => {
                notificar(res);
                getPedido();
            });
        }
    };

    const setDescuentoTotal = (e) => {
        // setLoading(true)

        let descuento = window.prompt("Descuento Total *0 para eliminar*");
        let index = e.currentTarget.attributes["data-index"].value;

        if (descuento) {
            if (descuento == "0") {
                db.setDescuentoTotal({ index, descuento: 0 }).then((res) => {
                    getPedido();
                    setLoading(false);
                    notificar(res);
                });
            } else {
                if (
                    typeof parseFloat(descuento) == "number" &&
                    pedidoData.clean_subtotal
                ) {
                    let total = parseFloat(pedidoData.clean_subtotal);

                    descuento =
                        100 -
                        ((parseFloat(descuento) * 100) / total).toFixed(3);

                    db.setDescuentoTotal({ index, descuento }).then((res) => {
                        getPedido();
                        setLoading(false);
                        notificar(res);
                    });
                }
            }
        }
    };
    const setDescuentoUnitario = (e) => {
        setLoading(true);
        const descuento = window.prompt("Descuento unitario");
        if (descuento) {
            const index = e.currentTarget.attributes["data-index"].value;
            db.setDescuentoUnitario({ index, descuento }).then((res) => {
                getPedido();
                setLoading(false);
                notificar(res);
            });
        }
    };
    const setCantidadCarrito = (e) => {
        const cantidad = window.prompt("Cantidad");
        if (cantidad) {
            const index = e.currentTarget.attributes["data-index"].value;
            setLoading(true);
            db.setCantidad({ index, cantidad }).then((res) => {
                getPedido();
                setLoading(false);
                notificar(res);
            });
        }
    };
    const [productoSelectinternouno, setproductoSelectinternouno] = useState(null)
    const setProductoCarritoInterno = (id) => {

        let prod = productos.filter(e=>e.id==id)[0]
        setproductoSelectinternouno({
            descripcion: prod.descripcion,
            precio: prod.precio,
            unidad: prod.unidad,
            cantidad: prod.cantidad,
            id,
        })
        setdevolucionTipo(null)
        setModaladdproductocarritoToggle(true);

       /*  let cantidad = window.prompt("Cantidad", "1");
        if (cantidad && pedidoData.id) {
            setLoading(true);
            let id;
            if (e.currentTarget) {
                id = e.currentTarget.attributes["data-index"].value;
            } else {
                id = e;
            }
            
        } */

    };
    const addCarritoRequestInterno = () => {
            
        let type = "agregar";
        db.setCarrito({
            id: productoSelectinternouno.id,
            type,
            cantidad,
            numero_factura: pedidoData.id,
            devolucionTipo,
        }).then((res) => {

            if (res.data.msj) {
                notificar(res.data.msj)
            }
            getPedido();
            setLoading(false);
            setinputqinterno("")
            setModaladdproductocarritoToggle(false);
        });

        setdevolucionTipo(null)
        setCantidad("")

    }
    const setPersonas = (e) => {
        setLoading(true);
        let id_cliente;

        if (e.currentTarget) {
            id_cliente = e.currentTarget.attributes["data-index"].value;
        } else {
            id_cliente = e;
        }
        if (pedidoData.id) {
            db.setpersonacarrito({
                numero_factura: pedidoData.id,
                id_cliente,
            }).then((res) => {
                getPedido();
                setToggleAddPersona(false);
                setLoading(false);
                notificar(res);
            });
        }
    };
    const facturar_e_imprimir = () => {
        
        facturar_pedido(()=>{
            toggleImprimirTicket()
        });
    };
    const setPagoPedido = (callback=null) => {
        if (transferencia && !refPago.filter((e) => e.tipo == 1).length) {
            alert(
                "Error: Debe cargar referencia de transferencia electrónica."
            );
        } else {
            setLoading(true);
            db.setPagoPedido({
                id: pedidoData.id,
                debito,
                efectivo,
                transferencia,
                biopago,
                credito,
                vuelto,
            }).then((res) => {
                notificar(res);
                setLoading(false);

                if (res.data.estado) {
                    if (inputqinterno!=="") {
                        setinputqinterno("");
                    }
                    setView("seleccionar");
                    // getPedidos()
                    getPedidosList();
                    getProductos();

                    setSelectItem(null);
                    setviewconfigcredito(false);

                    if (callback) {callback()}
                }
            });
        }
    };

    const setconfigcredito = (e) => {
        e.preventDefault();

        if (pedidoData.id) {
            setLoading(true);
            db.setconfigcredito({
                fechainiciocredito,
                fechavencecredito,
                formatopagocredito,
                id_pedido: pedidoData.id,
            }).then((res) => {
                notificar(res);
                setLoading(false);
            });
        }
    };
    const facturar_pedido = (callback=null) => {
        if (refinputaddcarritofast.current !== document.activeElement) {
            if (pedidoData.id) {
                if (credito) {
                    db.checkDeuda({ id_cliente: pedidoData.id_cliente }).then(
                        (res) => {
                            if (res.data) {
                                let p = res.data.pedido_total;
                                setdatadeudacredito(p);
                                setviewconfigcredito(true);
                            }
                        }
                    );
                } else {
                    setPagoPedido(callback);
                }
            }
        }
    };
    const del_pedido = () => {
        if (confirm("¿Seguro de eliminar?")) {
            if (pedidoData.id) {
                let motivo = window.prompt(
                    "¿Cuál es el Motivo de eliminación?"
                );
                if (motivo) {
                    db.delpedido({ id: pedidoData.id, motivo }).then((res) => {
                        notificar(res);
                        getPedidosList();
                        setView("seleccionar");
                    });
                }
            } else {
                alert("No hay pedido seleccionado");
            }
        }
    };
    const [cierrenumreportez, setcierrenumreportez] = useState("")
    const [cierreventaexcento, setcierreventaexcento] = useState("")
    const [cierreventagravadas, setcierreventagravadas] = useState("")
    const [cierreivaventa, setcierreivaventa] = useState("")
    const [cierretotalventa, setcierretotalventa] = useState("")
    const [cierreultimafactura, setcierreultimafactura] = useState("")
    const [cierreefecadiccajafbs, setcierreefecadiccajafbs] = useState("")
    const [cierreefecadiccajafcop, setcierreefecadiccajafcop] = useState("")
    const [cierreefecadiccajafdolar, setcierreefecadiccajafdolar] = useState("")
    const [cierreefecadiccajafeuro, setcierreefecadiccajafeuro] = useState("")
    const guardar_cierre = (e, callback = null) => {

        let valCajaFuerteEntradaCierreDolar = CajaFuerteEntradaCierreDolar? CajaFuerteEntradaCierreDolar:0
        let valCajaChicaEntradaCierreDolar = CajaChicaEntradaCierreDolar? CajaChicaEntradaCierreDolar:0
        let valCajaFuerteEntradaCierreCop = CajaFuerteEntradaCierreCop? CajaFuerteEntradaCierreCop:0
        let valCajaChicaEntradaCierreCop = CajaChicaEntradaCierreCop? CajaChicaEntradaCierreCop:0
        let valCajaFuerteEntradaCierreBs = CajaFuerteEntradaCierreBs? CajaFuerteEntradaCierreBs:0
        let valCajaChicaEntradaCierreBs = CajaChicaEntradaCierreBs? CajaChicaEntradaCierreBs:0

        let sumcajaDolar = parseFloat(valCajaFuerteEntradaCierreDolar)+parseFloat(valCajaChicaEntradaCierreDolar)        
        if (Math.trunc(parseFloat(guardar_usd)) != Math.trunc(sumcajaDolar)) {
            alert("Error en suma de cajas (FUERTE)(CHICA): <sumcajaDolar> ")
            return 
        }

        let sumcajaCop = parseFloat(valCajaFuerteEntradaCierreCop)+parseFloat(valCajaChicaEntradaCierreCop)
        if (Math.trunc(parseFloat(guardar_cop)) != Math.trunc(sumcajaCop)) {
            alert("Error en suma de cajas (FUERTE)(CHICA): <sumcajaCop> ")
            return 
        }

        let sumcajaBs = parseFloat(valCajaFuerteEntradaCierreBs)+parseFloat(valCajaChicaEntradaCierreBs)
        if (Math.trunc(parseFloat(guardar_bs)) != Math.trunc(sumcajaBs)) {
            alert("Error en suma de cajas (FUERTE)(CHICA): <sumcajaBs> ")
            return 
        }
        if (window.confirm("¿Realmente desea Guardar/Editar?")) {
            setLoading(true);
            console.log(tipo_accionCierre)
            db.guardarCierre({
                fechaCierre,

                total_caja_neto,

                dejar_usd,
                dejar_cop,
                dejar_bs,

                total_dejar_caja_neto,
                total_punto,
                total_biopago,

                guardar_usd,
                guardar_cop,
                guardar_bs,

                caja_usd,
                caja_cop,
                caja_bs,
                caja_punto,
                caja_biopago,

                efectivo: cierre["total_caja"],
                transferencia: cierre[1],
                entregadomenospend: cierre["entregadomenospend"],
                caja_inicial: cierre["caja_inicial"],

                precio: cierre["precio"],
                precio_base: cierre["precio_base"],
                ganancia: cierre["ganancia"],
                porcentaje: cierre["porcentaje"],
                desc_total: cierre["desc_total"],
                numventas: cierre["numventas"],

                notaCierre,
                totalizarcierre,
                
                numreportez:cierrenumreportez,
                ventaexcento:cierreventaexcento,
                ventagravadas:cierreventagravadas,
                ivaventa:cierreivaventa,
                totalventa:cierretotalventa,
                ultimafactura:cierreultimafactura,
                efecadiccajafbs:cierreefecadiccajafbs,
                efecadiccajafcop:cierreefecadiccajafcop,
                efecadiccajafdolar:cierreefecadiccajafdolar,
                efecadiccajafeuro:cierreefecadiccajafeuro,
                
                inventariobase: cierre["total_inventario_base"],
                inventarioventa: cierre["total_inventario"],
                creditoporcobrartotal: cierre["cred_total"],
                credito: cierre["4"],
                vueltostotales: cierre["vueltos_totales"],
                abonosdeldia: cierre["abonosdeldia"],
                
                CajaFuerteEntradaCierreDolar,
                CajaFuerteEntradaCierreCop,
                CajaFuerteEntradaCierreBs,
                CajaChicaEntradaCierreDolar,
                CajaChicaEntradaCierreCop,
                CajaChicaEntradaCierreBs,
                
                montolote1punto,
                montolote2punto,
                lote1punto,
                lote2punto,
                serialbiopago,
                puntolote1banco,
                puntolote2banco,
                tipo_accionCierre,
                
            }).then((res) => {
                setLoading(false);
                notificar(res, false);
                if (res.data.estado) {
                    db.getStatusCierre({ fechaCierre }).then((res) => {
                        settipo_accionCierre(res.data.tipo_accionCierre);
                    });
                }
            });
        }
    };

    const veryenviarcierrefun = (e, callback = null) => {
        let type = e.currentTarget.attributes["data-type"].value;

        if (type == "ver") {
            verCierreReq(fechaCierre, type);
        } else {
            setLoading(true);

            db.sendCierre({ type, fecha: fechaCierre, totalizarcierre }).then((res) => {
                notificar(res, false);
                setLoading(false);
            });
        }
    };
    const verCierreReq = (fechaCierre, type = "ver", usuario = "") => {
        // console.log(fecha)
        // if (window.confirm("Confirme envio")) {
        db.openVerCierre({ fechaCierre, type, totalizarcierre, usuario});
        // }
    };
    const setPagoCredito = (e) => {
        e.preventDefault();
        if (deudoresList[selectDeudor]) {
            let ref, banco
            if (tipo_pago_deudor=="1") {
                ref = window.prompt("Referencia")
                banco = window.prompt("Banco")
            }
            
            if (tipo_pago_deudor=="1" && (!ref || !banco)) {
                alert("Error: Debe cargar referencia de transferencia electrónica.");
            }else{

                let id_cliente = deudoresList[selectDeudor].id;
                setLoading(true);
                db.setPagoCredito({
                    id_cliente,
                    tipo_pago_deudor,
                    monto_pago_deudor,
                }).then((res) => {
                    notificar(res);
                    setLoading(false);
                    getDeudor(id_cliente);

                    if (ref && banco) {
                        db.addRefPago({
                            tipo: 1,
                            descripcion: ref,
                            monto: monto_pago_deudor,
                            banco: banco,
                            id_pedido: res.data.id_pedido,
                        }).then((res) => {
                            notificar(res);
                        });
                    }

                });
            }
        }
    };
    const getDeudores = (e) => {
        setLoading(true);

        if (time != 0) {
            clearTimeout(typingTimeout);
        }

        let time = window.setTimeout(() => {
            db.getDeudores({
                qDeudores,
                view,
                orderbycolumdeudores,
                orderbyorderdeudores,
                limitdeudores,
            }).then((res) => {
                if (res.data) {
                    if (res.data.length) {
                        setDeudoresList(res.data);
                    } else {
                        setDeudoresList([]);
                    }
                }
                setLoading(false);
            });
        }, 150);
        setTypingTimeout(time);
    };
    const clickSetOrderColumn = (e) => {
        let valor = e.currentTarget.attributes["data-valor"].value;

        if (valor == orderColumn) {
            if (orderBy == "desc") {
                setOrderBy("asc");
            } else {
                setOrderBy("desc");
            }
        } else {
            setOrderColumn(valor);
        }
    };

    const clickSetOrderColumnPedidos = (e) => {
        let valor = e.currentTarget.attributes["data-valor"].value;

        if (valor == orderbycolumpedidos) {
            if (orderbyorderpedidos == "desc") {
                setorderbyorderpedidos("asc");
            } else {
                setorderbyorderpedidos("desc");
            }
        } else {
            setorderbycolumpedidos(valor);
        }
    };
    const onchangeinputmain = (e) => {
        let val = e.currentTarget.value;
        setQProductosMain(val);
    };
    const delMovCaja = (e) => {
        if (confirm("¿Seguro de eliminar?")) {
            setLoading(true);
            const id = e.currentTarget.attributes["data-id"].value;

            db.delMovCaja({ id }).then((res) => {
                setLoading(false);
                getMovimientosCaja();
                notificar(res);
            });
        }
    };
    const delMov = (e) => {
        if (confirm("¿Seguro de eliminar?")) {
            setLoading(true);
            const id = e.currentTarget.attributes["data-id"].value;

            db.delMov({ id }).then((res) => {
                setLoading(false);
                notificar(res);
                getMovimientos();
            });
        }
    };

    const getTotalizarCierre = () => {
        if (!totalizarcierre) {
            db.getTotalizarCierre({}).then((res) => {
                if (res.data) {
                    let d = res.data;
                    setCaja_usd(d.caja_usd);
                    setCaja_cop(d.caja_cop);
                    setCaja_bs(d.caja_bs);
                    setCaja_punto(d.caja_punto);
                    setcaja_biopago(d.caja_biopago);

                    setDejar_usd(d.dejar_dolar);
                    setDejar_cop(d.dejar_peso);
                    setDejar_bs(d.dejar_bss);

                    setlotespuntototalizar(d.lotes);
                    setbiopagostotalizar(d.biopagos);
                }
            });
        }
        setTotalizarcierre(!totalizarcierre);
    };
    const buscarInventario = (e) => {
        let checkempty = productosInventario
            .filter((e) => e.type)
            .filter(
                (e) =>
                    e.codigo_barras == "" ||
                    e.descripcion == "" ||
                    e.id_categoria == "" ||
                    e.unidad == "" ||
                    e.id_proveedor == "" ||
                    e.cantidad == "" ||
                    e.precio == ""
            );

        if (!checkempty.length) {
            setLoading(true);

            if (time != 0) {
                clearTimeout(typingTimeout);
            }

            let time = window.setTimeout(() => {
                db.getinventario({
                    num: Invnum,
                    itemCero:true,
                    qProductosMain: qBuscarInventario,
                    orderColumn: InvorderColumn,
                    orderBy: InvorderBy,
                    busquedaAvanazadaInv,
                    busqAvanzInputs,
                }).then((res) => {
                    if (res.data) {
                        if (res.data.length) {
                            setProductosInventario(res.data);
                        } else {
                            setProductosInventario([]);
                        }
                        setIndexSelectInventario(null);
                        if (res.data.length === 1) {
                            setIndexSelectInventario(0);
                        } else if (res.data.length == 0) {
                            setinpInvbarras(qBuscarInventario);
                        }
                    }
                    setLoading(false);
                });
            }, 120);
            setTypingTimeout(time);
        } else {
            alert("Hay productos pendientes en carga de Inventario List!");
        }
    };
    const getProveedores = (e) => {
        if (time != 0) {
            clearTimeout(typingTimeout);
        }

        let time = window.setTimeout(() => {
            setLoading(true);
            db.getProveedores({
                q: qBuscarProveedor,
            }).then((res) => {
                if (res.data.length) {
                    setProveedoresList(res.data);
                } else {
                    setProveedoresList([]);
                }
                setLoading(false);
                if (res.data.length === 1) {
                    setIndexSelectProveedores(0);
                }
            });
        }, 150);
        setTypingTimeout(time);

        if (!categorias.length) {
            getCategorias();
        }
        if (!depositosList.length) {
            db.getDepositos({
                q: qBuscarProveedor,
            }).then((res) => {
                setdepositosList(res.data);
            });
        }
    };
    const setInputsInventario = () => {
        if (productosInventario[indexSelectInventario]) {
            let obj = productosInventario[indexSelectInventario];
            setinpInvbarras(obj.codigo_barras ? obj.codigo_barras : "");
            setinpInvcantidad(obj.cantidad ? obj.cantidad : "");
            setinpInvalterno(obj.codigo_proveedor ? obj.codigo_proveedor : "");
            setinpInvunidad(obj.unidad ? obj.unidad : "");
            setinpInvdescripcion(obj.descripcion ? obj.descripcion : "");
            setinpInvbase(obj.precio_base ? obj.precio_base : "");
            setinpInvventa(obj.precio ? obj.precio : "");
            setinpInviva(obj.iva ? obj.iva : "");

            setinpInvcategoria(obj.id_categoria ? obj.id_categoria : "");
            setinpInvid_proveedor(obj.id_proveedor ? obj.id_proveedor : "");
            setinpInvid_marca(obj.id_marca ? obj.id_marca : "");
            setinpInvid_deposito(obj.id_deposito ? obj.id_deposito : "");

            setinpInvLotes(obj.lotes ? obj.lotes : []);
        }
    };
    const setNewProducto = () => {
        setIndexSelectInventario(null);
        setinpInvbarras("");
        setinpInvcantidad("");
        setinpInvalterno("");
        setinpInvunidad("UND");
        setinpInvdescripcion("");
        setinpInvbase("");
        setinpInvventa("");
        setinpInviva("0");

        setinpInvLotes([]);

        if (facturas[factSelectIndex]) {
            setinpInvid_proveedor(facturas[factSelectIndex].proveedor.id);
        }

        setinpInvid_marca("GENÉRICO");
        setinpInvid_deposito(1);
    };
    const setInputsProveedores = () => {
        if (proveedoresList[indexSelectProveedores]) {
            let obj = proveedoresList[indexSelectProveedores];

            setproveedordescripcion(obj.descripcion);
            setproveedorrif(obj.rif);
            setproveedordireccion(obj.direccion);
            setproveedortelefono(obj.telefono);
        }
    };
    const guardarNuevoProducto = (e) => {
        e.preventDefault();
        setLoading(true);

        let id = null;

        if (indexSelectInventario != null) {
            if (productosInventario[indexSelectInventario]) {
                id = productosInventario[indexSelectInventario].id;
            }
        }

        let id_factura = null;

        if (factSelectIndex != null) {
            if (facturas[factSelectIndex]) {
                id_factura = facturas[factSelectIndex].id;
            }
        }

        db.guardarNuevoProducto({
            id,
            inpInvbarras,
            inpInvcantidad,
            inpInvalterno,
            inpInvunidad,
            inpInvcategoria,
            inpInvdescripcion,
            inpInvbase,
            inpInvventa,
            inpInviva,
            inpInvid_proveedor,
            inpInvid_marca,
            inpInvid_deposito,
            inpInvporcentaje_ganancia,
            id_factura,

            inpInvLotes,
        }).then((res) => {
            notificar(res);

            setLoading(false);

            if (res.data.estado) {
                buscarInventario();
                getFacturas(false);

                setinpInvbarras("");
                setinpInvcantidad("");
                setinpInvalterno("");
                setinpInvunidad("UND");
                setinpInvcategoria("24");
                setinpInvdescripcion("");
                setinpInvbase("");
                setinpInvventa("");
                setinpInviva("0");
                setinpInvid_marca("");
            }
        });
    };
    const getPedidosFast = () => {
        db.getPedidosFast({
            vendedor: showMisPedido ? [user.id_usuario] : [],
            fecha1pedido,
        }).then((res) => {
            setpedidosFast(res.data);
        });
    };
    const [modalchangepedido,setmodalchangepedido] = useState(false)
    
    const [usuarioChangeUserPedido,setusuarioChangeUserPedido] = useState("")
    const [seletIdChangePedidoUser,setseletIdChangePedidoUser] = useState(null)
    
    const [modalchangepedidoy,setmodalchangepedidoy] = useState(0)
    const [modalchangepedidox,setmodalchangepedidox] = useState(0)
    
    const setusuarioChangeUserPedidoHandle = (val) => {
        let id_usuario =  val
        setusuarioChangeUserPedido(val)

        if (window.confirm("Por favor confirmar transferencia de pedido #"+seletIdChangePedidoUser+" a usuario "+id_usuario)) {
            db.changepedidouser({
                id_usuario,
                id_pedido:seletIdChangePedidoUser
            }).then(res=>{
                setseletIdChangePedidoUser(null)
                setusuarioChangeUserPedido("")
                setmodalchangepedido(false)
                getPedidos()
                getPedidosList()
                notificar(res)
            })
        }
    }
    const setseletIdChangePedidoUserHandle = (event, id) => {
        setseletIdChangePedidoUser(id)
        setmodalchangepedido(true)

        let p = event.currentTarget.getBoundingClientRect();
        let y = p.top + window.scrollY;
        let x = p.left;
        setmodalchangepedidoy(y);
        setmodalchangepedidox(x);
        
    }





    const setSameGanancia = () => {
        let insert = window.prompt("Porcentaje");
        if (insert) {
            let obj = cloneDeep(productosInventario);
            obj.map((e) => {
                if (e.type) {
                    let re = (
                        parseFloat(e.precio_base) +
                        parseFloat(e.precio_base) * (parseFloat(insert) / 100)
                    ).toFixed(2);
                    if (re) {
                        e.precio = re;
                    }
                }
                return e;
            });
            setProductosInventario(obj);
        }
    };
    const [sameCatValue, setsameCatValue] = useState("");
    const [sameProValue, setsameProValue] = useState("");

    const setSameCat = (val) => {
        if (confirm("¿Confirma Generalizar categoría?")) {
            let obj = cloneDeep(productosInventario);
            obj.map((e) => {
                if (e.type) {
                    e.id_categoria = val;
                }
                return e;
            });
            setProductosInventario(obj);
            setsameCatValue(val);
        }
    };
    const setSamePro = (val) => {
        if (confirm("¿Confirma Generalizar proveeedor?")) {
            let obj = cloneDeep(productosInventario);
            obj.map((e) => {
                if (e.type) {
                    e.id_proveedor = val;
                }
                return e;
            });
            setProductosInventario(obj);
            setsameProValue(val);
        }
    };

    const busqAvanzInputsFun = (e, key) => {
        let obj = cloneDeep(busqAvanzInputs);
        obj[key] = e.target.value;
        setbusqAvanzInputs(obj);
    };
    const buscarInvAvanz = () => {
        buscarInventario(null);
    };

    const setProveedor = (e) => {
        setLoading(true);
        e.preventDefault();

        let id = null;

        if (indexSelectProveedores != null) {
            if (proveedoresList[indexSelectProveedores]) {
                id = proveedoresList[indexSelectProveedores].id;
            }
        }
        db.setProveedor({
            proveedordescripcion,
            proveedorrif,
            proveedordireccion,
            proveedortelefono,
            id,
        }).then((res) => {
            notificar(res);
            getProveedores();
            setLoading(false);
        });
    };
    const delProveedor = (e) => {
        let id;
        if (indexSelectProveedores != null) {
            if (proveedoresList[indexSelectProveedores]) {
                id = proveedoresList[indexSelectProveedores].id;
            }
        }
        if (confirm("¿Desea Eliminar?")) {
            setLoading(true);
            db.delProveedor({ id }).then((res) => {
                setLoading(false);
                getProveedores();
                notificar(res);

                if (res.data.estado) {
                    setIndexSelectProveedores(null);
                }
            });
        }
    };
    const delProducto = (e) => {
        let id;
        if (indexSelectInventario != null) {
            if (productosInventario[indexSelectInventario]) {
                id = productosInventario[indexSelectInventario].id;
            }
        }
        if (confirm("¿Desea Eliminar?")) {
            setLoading(true);
            db.delProducto({ id }).then((res) => {
                setLoading(false);
                buscarInventario();
                notificar(res);
                if (res.data.estado) {
                    setIndexSelectInventario(null);
                }
            });
        }
    };
    const getFacturas = (clean = true) => {
        if (time != 0) {
            clearTimeout(typingTimeout);
        }

        let time = window.setTimeout(() => {
            setLoading(true);
            db.getFacturas({
                factqBuscar,
                factqBuscarDate,
                factOrderBy,
                factOrderDescAsc,
            }).then((res) => {
                setLoading(false);
                setfacturas(res.data);

                if (res.data.length === 1) {
                    setfactSelectIndex(0);
                }

                if (clean) {
                    setfactSelectIndex(null);
                }
            });
        }, 100);
        setTypingTimeout(time);
    };
    const setFactura = (e) => {
        e.preventDefault();
        setLoading(true);

        let id = null;

        if (factSelectIndex != null) {
            if (facturas[factSelectIndex]) {
                id = facturas[factSelectIndex].id;
            }
        }
        db.setFactura({
            factInpid_proveedor,
            factInpnumfact,
            factInpdescripcion,
            factInpmonto,
            factInpfechavencimiento,
            factInpestatus,
            id,
        }).then((res) => {
            notificar(res);
            getFacturas();
            setLoading(false);
            if (res.data.estado) {
                setfactsubView("buscar");
                setfactSelectIndex(null);
            }
        });
    };
    const delFactura = (e) => {
        let id = null;

        if (factSelectIndex != null) {
            if (facturas[factSelectIndex]) {
                id = facturas[factSelectIndex].id;
            }
        }
        if (confirm("¿Desea Eliminar?")) {
            setLoading(true);
            db.delFactura({ id }).then((res) => {
                setLoading(false);
                getFacturas();
                notificar(res);
                if (res.data.estado) {
                    setfactsubView("buscar");
                    setfactSelectIndex(null);
                }
            });
        }
    };
    const saveFactura = () => {
        if (facturas[factSelectIndex]) {
            let id = facturas[factSelectIndex].id;
            let monto = facturas[factSelectIndex].summonto_base_clean;
            db.saveMontoFactura({ id, monto }).then((e) => {
                getFacturas(false);
            });
        }
    };
    const delItemFact = (e) => {
        let id = e.currentTarget.attributes["data-id"].value;

        if (confirm("¿Desea Eliminar?")) {
            setLoading(true);
            db.delItemFact({ id }).then((res) => {
                setLoading(false);
                notificar(res);
                if (res.data.estado) {
                    getFacturas(false);
                    buscarInventario();
                }
            });
        }
    };
    const setClienteCrud = (e) => {
        e.preventDefault();
        setLoading(true);
        let id = null;

        if (indexSelectCliente != null) {
            if (clientesCrud[indexSelectCliente]) {
                id = clientesCrud[indexSelectCliente].id;
            }
        }

        db.setClienteCrud({
            id,
            clienteInpidentificacion,
            clienteInpnombre,
            clienteInpcorreo,
            clienteInpdireccion,
            clienteInptelefono,
            clienteInpestado,
            clienteInpciudad,
        }).then((res) => {
            notificar(res);
            getClienteCrud();
            setLoading(false);
        });
    };
    const getClienteCrud = () => {
        setLoading(true);
        db.getClienteCrud({ q: qBuscarCliente, num: numclientesCrud }).then(
            (res) => {
                setLoading(false);
                setclientesCrud(res.data);
                setindexSelectCliente(null);
            }
        );
    };
    const delCliente = () => {
        let id = null;

        if (indexSelectCliente != null) {
            if (clientesCrud[indexSelectCliente]) {
                id = clientesCrud[indexSelectCliente].id;
            }
        }
        if (confirm("¿Desea Eliminar?")) {
            setLoading(true);
            db.delCliente({ id }).then((res) => {
                setLoading(false);
                getClienteCrud();
                notificar(res);
                if (res.data.estado) {
                    setindexSelectCliente(null);
                }
            });
        }
    };
    const sumPedidos = (e) => {
        let tipo = e.currentTarget.attributes["data-tipo"].value;
        let id = e.currentTarget.attributes["data-id"].value;
        if (tipo == "add") {
            if (sumPedidosArr.indexOf(id) < 0) {
                setsumPedidosArr(sumPedidosArr.concat(id));
            }
        } else {
            setsumPedidosArr(sumPedidosArr.filter((e) => e != id));
        }
    };
    
    const getFallas = () => {
        setLoading(true);
        db.getFallas({
            qFallas,
            orderCatFallas,
            orderSubCatFallas,
            ascdescFallas,
        }).then((res) => {
            setfallas(res.data);
            setLoading(false);
        });
    };
    const setFalla = (e) => {
        let id_producto = e.currentTarget.attributes["data-id"].value;
        db.setFalla({ id: null, id_producto }).then((res) => {
            notificar(res);
            setSelectItem(null);
        });
    };
    
    const delitempresupuestocarrito = index => {
        setpresupuestocarrito(presupuestocarrito.filter((e,i)=>i!=index))
    }
    const setpresupuestocarritotopedido = () => {

        if (presupuestocarrito.length===1) {
            
            presupuestocarrito.map(e=>{
                addCarritoRequest(
                    "agregar",
                    e.id,
                    "nuevo",
                    e.cantidad
                )
            })
        }else if(presupuestocarrito.length>1){
            let clone = cloneDeep(presupuestocarrito)
            let first = clone[0]

            db.setCarrito({
                id: first.id,
                cantidad: first.cantidad,
                type:"agregar",
                numero_factura: "nuevo",
                loteIdCarrito,
            }).then((res) => {
                delete clone[0];
                getPedidosList(lastpedido=>{
                    clone.map(e=>{
                        db.setCarrito({
                            id: e.id,
                            cantidad: e.cantidad,
                            type:"agregar",
                            numero_factura:lastpedido,
                            loteIdCarrito,
                        }).then((res) => {
                            notificar(res);
                            
                        });
                    })
                });
            });
        }
    }
    const setPresupuesto = e =>{
        let id_producto = e.currentTarget.attributes["data-id"].value;
        let findpr = productos.filter(e=>e.id==id_producto)
        if (findpr.length) {
            let pro = findpr[0]
            
            let copypresupuestocarrito = cloneDeep(presupuestocarrito)
            if (copypresupuestocarrito.filter(e=>e.id==id_producto).length) {
                copypresupuestocarrito = copypresupuestocarrito.filter(e=>e.id!=id_producto)
            }
            let ct = (cantidad?cantidad:1)
            let subtotalpresu = parseFloat(pro.precio)*ct 
            copypresupuestocarrito = copypresupuestocarrito.concat({
                id: pro.id,
                precio: pro.precio,
                cantidad:ct,
                descripcion: pro.descripcion,
                subtotal: subtotalpresu
            })
            
            setpresupuestocarrito(copypresupuestocarrito)
            setSelectItem(null);
        }

    }
    const delFalla = (e) => {
        if (confirm("¿Desea Eliminar?")) {
            let id = e.currentTarget.attributes["data-id"].value;
            db.delFalla({ id }).then((res) => {
                notificar(res);
                getFallas();
            });
        }
    };
    const viewReportPedido = () => {
        db.openNotaentregapedido({ id: pedidoData.id });
    };

    const setInventarioFromSucursal = () => {
        setLoading(true);
        db.setInventarioFromSucursal({ path: pathcentral }).then((res) => {
            console.log(res.data);
            notificar(res);
            setLoading(false);
        });
    };
    const getip = () => {
        db.getip({}).then((res) => alert(res.data));
    };
    const getmastermachine = () => {
        setLoading(true);
        setpathcentral("");

        db.getmastermachine({}).then((res) => {
            if (res.data) {
                if (!res.data.length) {
                    setmastermachines([]);
                } else {
                    setmastermachines(res.data);
                }
                setLoading(false);
            }
        });
    };
    const setSocketUrlDB = () => {
       // db.setSocketUrlDB({}).then((res) => setSocketUrl(res.data));
    };
    const getPedidosCentral = () => {
        setLoading(true);
        db.reqpedidos({ path: pathcentral }).then((res) => {
            setLoading(false);
            setpedidoCentral([]);

            if (res.data) {
                if (res.data.length) {
                    if (res.data[0]) {
                        if (res.data[0].id) {
                            setpedidoCentral(res.data);
                        }
                    }
                } else {
                    setpedidoCentral([]);
                }

                if (res.data.msj) {
                    notificar(res);
                }
            } else {
                setpedidoCentral([]);
            }
        });
    };
    const procesarImportPedidoCentral = () => {
        // console.log(valbodypedidocentral)
        // Id pedido 4
        // Count items pedido 4
        // sucursal code *

        // console.log(valheaderpedidocentral)
        //id_pedido 4 (0)
        //id_producto 4 (0)
        //base 6 (2)
        //venta 6 (2)
        //cantidad 5 (1)

        try {
            // Header...
            let id_pedido_header = valheaderpedidocentral
                .substring(0, 4)
                .replace(/\b0*/g, "");
            let count = valheaderpedidocentral
                .substring(4, 8)
                .replace(/\b0*/g, "");
            let sucursal_code = valheaderpedidocentral.substring(8);

            let import_pedido = {};

            if (id_pedido_header && count && sucursal_code) {
                db.getSucursal({}).then((res) => {
                    try {
                        if (res.data) {
                            if (res.data.codigo) {
                                if (res.data.codigo != sucursal_code) {
                                    throw "Error: Pedido no pertenece a esta sucursal!";
                                } else {
                                    import_pedido.created_at = today;
                                    import_pedido.sucursal = sucursal_code;
                                    import_pedido.id = id_pedido_header;
                                    import_pedido.base = 0;
                                    import_pedido.venta = 0;
                                    import_pedido.items = [];

                                    let body = valbodypedidocentral
                                        .toString()
                                        .replace(/[^0-9]/g, "");
                                    if (!body) {
                                        throw "Error: Cuerpo incorrecto!";
                                    } else {
                                        let ids_productos = body
                                            .match(/.{1,25}/g)
                                            .map((e, i) => {
                                                if (e.length != 25) {
                                                    throw "Error: Líneas no tienen la longitud!";
                                                }
                                                let id_pedido = e
                                                    .substring(0, 4)
                                                    .replace(/\b0*/g, "");
                                                let id_producto = e
                                                    .substring(4, 8)
                                                    .replace(/\b0*/g, "");

                                                let base =
                                                    e
                                                        .substring(8, 12)
                                                        .replace(/\b0*/g, "") +
                                                    "." +
                                                    e.substring(12, 14);
                                                let venta =
                                                    e
                                                        .substring(14, 18)
                                                        .replace(/\b0*/g, "") +
                                                    "." +
                                                    e.substring(18, 20);

                                                let cantidad =
                                                    e
                                                        .substring(20, 24)
                                                        .replace(/\b0*/g, "") +
                                                    "." +
                                                    e.substring(24, 25);

                                                // if (id_pedido_header!=id_pedido) {
                                                //
                                                //   throw("Error: Producto #"+(i+1)+" no pertenece a este pedido!")
                                                // }

                                                return {
                                                    id_producto,
                                                    id_pedido,
                                                    base,
                                                    venta,
                                                    cantidad,
                                                };
                                            });
                                        db.getProductosSerial({
                                            count,
                                            ids_productos: ids_productos.map(
                                                (e) => e.id_producto
                                            ),
                                        }).then((res) => {
                                            try {
                                                let obj = res.data;

                                                if (obj.estado) {
                                                    if (obj.msj) {
                                                        let pro = obj.msj.map(
                                                            (e, i) => {
                                                                let filter =
                                                                    ids_productos.filter(
                                                                        (ee) =>
                                                                            ee.id_producto ==
                                                                            e.id
                                                                    )[0];

                                                                let cantidad =
                                                                    filter.cantidad;
                                                                let base =
                                                                    filter.base;
                                                                let venta =
                                                                    filter.venta;
                                                                let monto =
                                                                    cantidad *
                                                                    venta;

                                                                import_pedido.items.push(
                                                                    {
                                                                        cantidad:
                                                                            cantidad,
                                                                        producto:
                                                                            {
                                                                                precio_base:
                                                                                    base,
                                                                                precio: venta,
                                                                                codigo_barras:
                                                                                    e.codigo_barras,
                                                                                codigo_proveedor:
                                                                                    e.codigo_proveedor,
                                                                                descripcion:
                                                                                    e.descripcion,
                                                                                id: e.id,
                                                                            },
                                                                        id: i,
                                                                        monto,
                                                                    }
                                                                );

                                                                import_pedido.base +=
                                                                    parseFloat(
                                                                        cantidad *
                                                                            base
                                                                    );
                                                                import_pedido.venta +=
                                                                    parseFloat(
                                                                        monto
                                                                    );
                                                            }
                                                        );
                                                        // console.log("import_pedido",import_pedido)
                                                        setpedidoCentral(
                                                            pedidosCentral.concat(
                                                                import_pedido
                                                            )
                                                        );
                                                        setshowaddpedidocentral(
                                                            false
                                                        );
                                                    }
                                                } else {
                                                    alert(obj.msj);
                                                }
                                            } catch (err) {
                                                alert(err);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        alert(err);
                    }
                });
            } else {
                throw "Error: Cabezera incorrecta!";
            }
        } catch (err) {
            alert(err);
        }
    };
    const selectPedidosCentral = (e) => {
        try {
            let index = e.currentTarget.attributes["data-index"].value;
            let tipo = e.currentTarget.attributes["data-tipo"].value;

            let pedidosCentral_copy = cloneDeep(pedidosCentral);

            if (tipo == "select") {
                if (pedidosCentral_copy[indexPedidoCentral].items[index].aprobado === true) {
                    delete pedidosCentral_copy[indexPedidoCentral].items[index].aprobado
                } else if (pedidosCentral_copy[indexPedidoCentral].items[index].aprobado === false) {
                    pedidosCentral_copy[indexPedidoCentral].items[index].aprobado = true;
                } else if (typeof pedidosCentral_copy[indexPedidoCentral].items[index].aprobado === "undefined") {
                    pedidosCentral_copy[indexPedidoCentral].items[index].aprobado = true;
                }
            } /* else if (tipo == "changect_real") {
                pedidosCentral_copy[indexPedidoCentral].items[index].ct_real =
                    number(e.currentTarget.value, 4);
            } */

            setpedidoCentral(pedidosCentral_copy);

            // console.log(pedidosCentral_copy)
        } catch (err) {
            console.log(err);
        }
    };
    const checkPedidosCentral = () => {
        if (indexPedidoCentral !== null && pedidosCentral) {
            if (pedidosCentral[indexPedidoCentral]) {
                setLoading(true);
                db.checkPedidosCentral({
                    pathcentral,
                    pedido: pedidosCentral[indexPedidoCentral],
                }).then((res) => {
                    setLoading(false);

                    notificar(res);
                    if (res.data.estado) {
                        getPedidosCentral();
                    }
                });
            }
        }
    };
    const verDetallesFactura = (e = null) => {
        let id = facturas[factSelectIndex];
        if (e) {
            id = e;
        }
        if (id) {
            db.openVerFactura({ id: facturas[factSelectIndex].id });
        }
    };
    const getVentas = () => {
        setLoading(true);
        db.getVentas({ fechaventas }).then((res) => {
            setventasData(res.data);
            setLoading(false);
        });
    };
    const getVentasClick = () => {
        getVentas();
    };
    const setBilletes = () => {
        let total = 0;
        total =
            parseInt(!billete1 ? 0 : billete1) * 1 +
            parseInt(!billete5 ? 0 : billete5) * 5 +
            parseInt(!billete10 ? 0 : billete10) * 10 +
            parseInt(!billete20 ? 0 : billete20) * 20 +
            parseInt(!billete50 ? 0 : billete50) * 50 +
            parseInt(!billete100 ? 0 : billete100) * 100;
        setCaja_usd(total);
    };
    const addNewUsuario = (e) => {
        e.preventDefault();

        let id = null;
        if (indexSelectUsuarios) {
            id = usuariosData[indexSelectUsuarios].id;
        }

        if (usuarioRole && usuarioNombre && usuarioUsuario) {
            setLoading(true);
            db.setUsuario({
                id,
                role: usuarioRole,
                nombres: usuarioNombre,
                usuario: usuarioUsuario,
                clave: usuarioClave,
            }).then((res) => {
                notificar(res);
                setLoading(false);
                getUsuarios();
            });
        } else {
            console.log(
                "Err: addNewUsuario" +
                    usuarioRole +
                    " " +
                    usuarioNombre +
                    " " +
                    usuarioUsuario
            );
        }
    };
    const setInputsUsuarios = () => {
        if (indexSelectUsuarios) {
            let obj = usuariosData[indexSelectUsuarios];
            if (obj) {
                setusuarioNombre(obj.nombre);
                setusuarioUsuario(obj.usuario);
                setusuarioRole(obj.tipo_usuario);
                setusuarioClave(obj.clave);
            }
        }
    };
    const getUsuarios = () => {
        setLoading(true);
        db.getUsuarios({ q: qBuscarUsuario }).then((res) => {
            setLoading(false);
            setusuariosData(res.data);
        });
    };
    const delUsuario = () => {
        setLoading(true);
        let id = null;
        if (indexSelectUsuarios) {
            id = usuariosData[indexSelectUsuarios].id;
        }
        db.delUsuario({ id }).then((res) => {
            setLoading(false);
            getUsuarios();
            notificar(res);
        });
    };
    const selectProductoFast = (e) => {
        let id = e.currentTarget.attributes["data-id"].value;
        let val = e.currentTarget.attributes["data-val"].value;

        setQBuscarInventario(val);
        setfactSelectIndex("ninguna");
        setView("inventario");
        setsubViewInventario("inventario");
    };
    const addNewLote = (e) => {
        let addObj = {
            lote: "",
            creacion: "",
            vence: "",
            cantidad: "",
            type: "new",
            id: null,
        };
        setinpInvLotes(inpInvLotes.concat(addObj));
    };
    const changeModLote = (val, i, id, type, name = null) => {
        let lote = cloneDeep(inpInvLotes);

        switch (type) {
            case "update":
                if (lote[i].type != "new") {
                    lote[i].type = "update";
                }
                break;
            case "delModeUpdateDelete":
                delete lote[i].type;
                break;
            case "delNew":
                lote = lote.filter((e, ii) => ii !== i);
                break;
            case "changeInput":
                lote[i][name] = val;
                break;

            case "delMode":
                lote[i].type = "delete";
                let id_replace = 0;
                lote[i].id_replace = id_replace;
                break;
        }
        setinpInvLotes(lote);
    };
    const reporteInventario = () => {
        db.openReporteInventario();
    };
    const [personalNomina, setpersonalNomina] = useState([])
    const getNomina = () => {
        db.getNomina({}).then(res=>{
            if (res.data.length) {
                if (res.data[0].nominacargo) {
                    setpersonalNomina(res.data)
                }
            }
        })
    }
    
    const guardarNuevoProductoLote = (e) => {
        if (!user.iscentral) {
            alert("No tiene permisos para gestionar Inventario")
            return;

        }
        // e.preventDefault()
        let id_factura = null;

        if (factSelectIndex != null) {
            if (facturas[factSelectIndex]) {
                id_factura = facturas[factSelectIndex].id;
            }
        }
        let lotesFil = productosInventario.filter((e) => e.type);

        let checkempty = lotesFil.filter(
            (e) =>
                e.codigo_barras == "" ||
                e.descripcion == "" ||
                e.id_categoria == "" ||
                e.unidad == "" ||
                e.id_proveedor == "" ||
                e.cantidad == "" ||
                e.precio == ""
        );

        if (lotesFil.length && !checkempty.length) {
            setLoading(true);
            db.guardarNuevoProductoLote({ lotes: lotesFil, id_factura }).then(res => {
                let data = res.data
                notificar(data.msj);
                if (data.estado) {
                    getFacturas(null);
                    buscarInventario();
                }
                setLoading(false);
            });
        } else {
            alert(
                "¡Error con los campos! Algunos pueden estar vacíos " +
                    JSON.stringify(checkempty)
            );
        }
    };
    const delPagoProveedor = (e) => {
        let id = e.target.attributes["data-id"].value;
        if (confirm("¿Seguro de eliminar?")) {
            db.delPagoProveedor({ id }).then((res) => {
                getPagoProveedor();
                notificar(res);
            });
        }
    };
    const getPagoProveedor = () => {
        if (proveedoresList[indexSelectProveedores]) {
            setLoading(true);
            db.getPagoProveedor({
                id_proveedor: proveedoresList[indexSelectProveedores].id,
            }).then((res) => {
                setLoading(false);
                setpagosproveedor(res.data);
            });
        }
    };
    const setPagoProveedor = (e) => {
        e.preventDefault();
        if (tipopagoproveedor && montopagoproveedor) {
            if (proveedoresList[indexSelectProveedores]) {
                db.setPagoProveedor({
                    tipo: tipopagoproveedor,
                    monto: montopagoproveedor,
                    id_proveedor: proveedoresList[indexSelectProveedores].id,
                }).then((res) => {
                    getPagoProveedor();
                    notificar(res);
                });
            }
        }
    };
    const setCtxBulto = (e) => {
        let id = e.currentTarget.attributes["data-id"].value;
        let bulto = window.prompt("Cantidad por bulto");
        if (bulto) {
            db.setCtxBulto({ id, bulto }).then((res) => {
                buscarInventario();
                notificar(res);
            });
        }
    };
    const setStockMin = (e) => {
        let id = e.currentTarget.attributes["data-id"].value;
        let min = window.prompt("Cantidad Mínima");
        if (min) {
            db.setStockMin({ id, min }).then((res) => {
                buscarInventario();
                notificar(res);
            });
        }
    };

    
    const setPrecioAlterno = (e) => {
        let id = e.currentTarget.attributes["data-id"].value;
        let type = e.currentTarget.attributes["data-type"].value;
        let precio = window.prompt("PRECIO " + type);
        if (precio) {
            db.setPrecioAlterno({ id, type, precio }).then((res) => {
                buscarInventario();
                notificar(res);
            });
        }
    };
    const changeInventario = (val, i, id, type, name = null) => {
        let obj = cloneDeep(productosInventario);

        switch (type) {
            case "update":
                if (obj[i].type != "new") {
                    obj[i].type = "update";
                }
                break;
            case "delModeUpdateDelete":
                delete obj[i].type;
                break;
            case "delNew":
                obj = obj.filter((e, ii) => ii !== i);
                break;
            case "changeInput":
                obj[i][name] = val;
                break;
            case "add":
                let pro = "";

                if (facturas[factSelectIndex]) {
                    pro = facturas[factSelectIndex].proveedor.id;
                } else {
                    pro = sameProValue;
                }

                let newObj = [
                    {
                        id: null,
                        codigo_proveedor: "",
                        codigo_barras: "",
                        descripcion: "",
                        id_categoria: sameCatValue,
                        id_marca: "",
                        unidad: "UND",
                        id_proveedor: pro,
                        cantidad: "",
                        precio_base: "",
                        precio: "",
                        iva: "0",
                        type: "new",
                    },
                ];

                obj = newObj.concat(obj);
                break;

            case "delMode":
                obj[i].type = "delete";
                let id_replace = 0;
                obj[i].id_replace = id_replace;
                break;
        }
        setProductosInventario(obj);
    };
    
    
    
    
    
    
    
    const changeInventarioFromSucursalCentral = (
        val,
        i,
        id,
        type,
        name = null
    ) => {
        let obj = cloneDeep(inventarioSucursalFromCentral);

        switch (type) {
            case "update":
                if (obj[i].type != "new") {
                    obj[i].type = "update";
                    obj[i]["estatus"] = 1;
                }
                break;
            case "delModeUpdateDelete":
                obj[i]["id_vinculacion"] = null;
                obj[i]["estatus"] = 0;
                delete obj[i].type;
                break;
            case "delNew":
                obj = obj.filter((e, ii) => ii !== i);
                break;
            case "changeInput":
                if (id === null) {
                    let copyproducto = productos.filter((e) => e.id == val)[0];
                    obj[i] = {
                        bulto: copyproducto.bulto,
                        cantidad: "0.00",
                        codigo_barras: copyproducto.codigo_barras,
                        codigo_proveedor: copyproducto.codigo_proveedor,
                        descripcion: copyproducto.descripcion,
                        id_categoria: copyproducto.id_categoria,
                        id_deposito: copyproducto.id_deposito,
                        id_marca: copyproducto.id_marca,
                        id_proveedor: copyproducto.id_proveedor,
                        iva: copyproducto.iva,
                        porcentaje_ganancia: copyproducto.porcentaje_ganancia,
                        precio: copyproducto.precio,
                        precio1: copyproducto.precio1,
                        precio2: copyproducto.precio2,
                        precio3: copyproducto.precio3,
                        precio_base: copyproducto.precio_base,
                        stockmax: copyproducto.stockmax,
                        stockmin: copyproducto.stockmin,
                        unidad: copyproducto.unidad,
                        id_vinculacion: val,
                        type: "new",
                        estatus: 1,
                    };
                } else if (name == "id_vinculacion") {
                    if (obj[i].type != "new") {
                        obj[i].type = "update";
                        obj[i]["estatus"] = 1;

                        let productoclone = productos.filter(e=>e.id==val)

                        if (productoclone.length) {
                            obj[i]["codigo_barras"] = productoclone[0].codigo_barras
                            obj[i]["codigo_proveedor"] = productoclone[0].codigo_proveedor
                            obj[i]["id_proveedor"] = productoclone[0].id_proveedor
                            obj[i]["id_categoria"] = productoclone[0].id_categoria
                            obj[i]["id_marca"] = productoclone[0].id_marca
                            obj[i]["unidad"] = productoclone[0].unidad
                            obj[i]["id_deposito"] = productoclone[0].id_deposito
                            obj[i]["descripcion"] = productoclone[0].descripcion
                            obj[i]["iva"] = productoclone[0].iva
                            obj[i]["porcentaje_ganancia"] = productoclone[0].porcentaje_ganancia
                            obj[i]["precio_base"] = productoclone[0].precio_base
                            obj[i]["precio"] = productoclone[0].precio
                            obj[i]["precio1"] = productoclone[0].precio1
                            obj[i]["precio2"] = productoclone[0].precio2
                            obj[i]["precio3"] = productoclone[0].precio3
                            obj[i]["bulto"] = productoclone[0].bulto
                            obj[i]["stockmin"] = productoclone[0].stockmin
                            obj[i]["stockmax"] = productoclone[0].stockmax
                        }
                    }
                }
                obj[i][name] = val;
                break;
            case "add":
                /*  let pro = ""

      if (facturas[factSelectIndex]) {
        pro = facturas[factSelectIndex].proveedor.id
      } else {
        pro = sameProValue
      }

      */
                let newObj = [{
                    id: null,
                    id_vinculacion: null,
                    codigo_proveedor: "",
                    codigo_barras: "",
                    descripcion: "",
                    id_categoria: 1,
                    id_marca: "",
                    unidad: "UND",
                    id_proveedor: 1,
                    cantidad: "",
                    precio_base: "",
                    precio: "",
                    iva: "0",
                    type: "new",
                    estatus: 1,
                    precio1: 0,
                    precio2: 0,
                    precio3: 0,
                    stockmin: 0,
                    stockmax: 0,
                    id_vinculacion: null,

                }]

                obj = newObj.concat(obj) 
                break;

            case "delMode":
                obj[i].type = "delete";
                obj[i]["estatus"] = 1;
                break;
        }
        setdatainventarioSucursalFromCentralcopy(obj)
        setdatainventarioSucursalFromCentral(obj);
    };

    const printPrecios = (type) => {
        if (productosInventario.length) {
            db.printPrecios({
                type,
                ids: productosInventario.map((e) => e.id),
            }).then((res) => {
                setdropprintprice(false);
            });
        }
    };
    const logout = () => {
        db.logout().then((e) => {
            window.location.href = "/";
        });
    };
    const auth = (permiso) => {
        let nivel = user.nivel;
        if (permiso == 1) {
            if (nivel == 1) {
                return true;
            }
        }
        if (permiso == 2) {
            //if (nivel == 1 || nivel == 2) {
            return true;
            //}
        }
        if (permiso == 3) {
            //if (nivel == 1 || nivel == 3) {
            return true;
            //}
        }
        return false;
    };
    const printTickedPrecio = (id) => {
        db.printTickedPrecio({ id });
    };
    let sumsubtotalespresupuesto = ()=>{
        let sum = 0;
        presupuestocarrito.map(e=>{
            sum += parseFloat(e.subtotal)
        })
        return moneda(sum)
    } 

    const [isCierre, setisCierre] = useState(false)
    const getPermisoCierre = () => {
        if (!isCierre) {
            
            db.getPermisoCierre({}).then(res=>{
                if (res.data) {
                    setisCierre(true)
                    setView("cierres")
                }else{
                    notificar("Debe esperar aprobación del Administrador")
                }
            })
        }else{
            setView("cierres")

        }
    }

   

    return (
        <>
            <Header
                updatetasasfromCentral={updatetasasfromCentral}
                getip={getip}
                auth={auth}
                logout={logout}
                user={user}
                dolar={dolar}
                peso={peso}
                setMoneda={setMoneda}
                view={view}
                getPedidos={getPedidos}
                setViewCaja={setViewCaja}
                viewCaja={viewCaja}
                setShowModalMovimientos={setShowModalMovimientos}
                showModalMovimientos={showModalMovimientos}
                getVentasClick={getVentasClick}
                toggleClientesBtn={toggleClientesBtn}
                settoggleClientesBtn={settoggleClientesBtn}
                setView={setView}
                isCierre={isCierre}
                getPermisoCierre={getPermisoCierre}
            />
            {view=="tareas"?
                <div className="container">
                    <h1>Tareas <button className="btn btn-outline-success" onClick={getTareasLocal}><i className="fa fa-search"></i></button></h1>
                    <input type="date" className="form-control" value={tareasinputfecha} onChange={e=>settareasinputfecha(e.target.value)} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>ID Pedido</th>
                                <th>Usuario</th>
                                <th>Tipo</th>
                                <th>Descripcion</th>
                                <th>Hora</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tareasAdminLocalData.length?
                                tareasAdminLocalData.map(e=>
                                    <tr key={e.id} >
                                                
                                        <td><button className="btn btn-danger" onClick={()=>resolverTareaLocal(e.id,"rechazar")}>Rechazar</button></td>
                                        <td className="h3">#{e.id_pedido}</td>
                                        <td>{e.usuario?e.usuario.usuario:null}</td>
                                        <td>{e.tipo}</td>
                                        <td>{e.descripcion}</td>
                                        <td>{e.created_at}</td>
                                        <td>
                                            {e.estado?
                                                <button className="btn btn-success">Resuelta</button>
                                            :
                                                <button className="btn btn-warning" onClick={()=>resolverTareaLocal(e.id)}>Resolver</button>
                                            }
                                        </td>
                                    </tr>
                                )
                            :null
                            }
                        </tbody>
                    </table>
                </div>
            :null}
            {view == "seleccionar" ? (
                <div className={(presupuestocarrito.length?"container-fluid":"container")+(" p-0")}>
                    <div className="row">
                        
                        <div className="col">

                            {typeof selectItem == "number" ? (
                                productos[selectItem] ? (
                                    <ModalAddCarrito
                                        setPresupuesto={setPresupuesto}
                                        dolar={dolar}
                                        producto={productos[selectItem]}
                                        setSelectItem={setSelectItem}
                                        cantidad={cantidad}
                                        setCantidad={setCantidad}
                                        numero_factura={numero_factura}
                                        setNumero_factura={setNumero_factura}
                                        pedidoList={pedidoList}
                                        setFalla={setFalla}
                                        number={number}
                                        moneda={moneda}
                                        inputCantidadCarritoref={
                                            inputCantidadCarritoref
                                        }
                                        addCarritoRequest={addCarritoRequest}
                                    />
                                ) : null
                            ) : null}

                            
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    ref={inputbusquedaProductosref}
                                    placeholder="Buscar... Presiona (ESC)"
                                    onChange={(e) => getProductos(e.target.value)}
                                />
                                {/*<button onClick={()=>setshowinputaddCarritoFast(!showinputaddCarritoFast)} className={("btn btn-outline-")+(showinputaddCarritoFast?"success":"sinapsis")}>Agg. rápido</button>*/}

                                {showOptionQMain ? (
                                    <>
                                        <span
                                            className="input-group-text pointer"
                                            onClick={() => setshowOptionQMain(false)}
                                        >
                                            <i className="fa fa-arrow-right"></i>
                                        </span>
                                        <span
                                            className="input-group-text pointer"
                                            onClick={() => {
                                                let num = window.prompt(
                                                    "Número de resultados a mostrar"
                                                );
                                                if (num) {
                                                    setNum(num);
                                                }
                                            }}
                                        >
                                            Num.({num})
                                        </span>
                                        <span
                                            className="input-group-text pointer"
                                        >
                                            En cero: {itemCero ? "Sí" : "No"}
                                        </span>
                                    </>
                                ) : (
                                    <span
                                        className="input-group-text pointer"
                                        onClick={() => setshowOptionQMain(true)}
                                    >
                                        <i className="fa fa-arrow-left"></i>
                                    </span>
                                )}
                            </div>
                            <ProductosList
                                moneda={moneda}
                                auth={auth}
                                productos={productos}
                                addCarrito={addCarrito}
                                clickSetOrderColumn={clickSetOrderColumn}
                                orderColumn={orderColumn}
                                orderBy={orderBy}
                                counterListProductos={counterListProductos}
                                setCounterListProductos={setCounterListProductos}
                                tbodyproductosref={tbodyproductosref}
                                focusCtMain={focusCtMain}
                                selectProductoFast={selectProductoFast}
                            />
                            {productos.length == 0 ? (
                                <div className="text-center p-2">
                                    <small className="mr-2">Nada para mostrar...</small>
                                </div>
                            ) : null}

                            {viewCaja ? (
                                <Cajagastos
                                    setMovimientoCaja={setMovimientoCaja}
                                    movCajadescripcion={movCajadescripcion}
                                    setMovCajadescripcion={setMovCajadescripcion}
                                    movCajamonto={movCajamonto}
                                    setMovCajamonto={setMovCajamonto}
                                    number={number}
                                    setMovCajacategoria={setMovCajacategoria}
                                    movCajacategoria={movCajacategoria}
                                    setMovCajatipo={setMovCajatipo}
                                    movimientosCaja={movimientosCaja}
                                    delMovCaja={delMovCaja}
                                    movCajatipo={movCajatipo}
                                    movCajaFecha={movCajaFecha}
                                    viewCaja={viewCaja}
                                    setViewCaja={setViewCaja}
                                    setMovCajaFecha={setMovCajaFecha}
                                />
                            ) : null}

                        </div>
                        {presupuestocarrito.length?
                            <div className="col-4">

                                <div className="modalpresupuesto">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td>
                                                <button className="btn btn-outline-danger" onClick={()=>setpresupuestocarrito([])}><i className="fa fa-times"></i></button>
                                                </td>
                                                <td className="text-center">
                                                    <h1>Presupuesto</h1>
                                                </td>
                                                <td className="text-right">
                                                
                                                    <button className="btn btn-warning" onClick={()=>toggleImprimirTicket("presupuesto")}><i className="fa fa-print"></i></button>
                                                    <button className="btn btn-outline-success" onClick={setpresupuestocarritotopedido}><i className="fa fa-save"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Descripción</th>
                                                <th>Ct.</th>
                                                <th>Precio</th>
                                                <th className="text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {presupuestocarrito.map((e,i)=>
                                                <tr key={i} className="pointer" onClick={() => delitempresupuestocarrito(i)}>
                                                    <td>{i+1}</td>
                                                    <td>{e.descripcion}</td>
                                                    <td>{e.cantidad}</td>
                                                    <td>{e.precio}</td>
                                                    <td className="text-right">{e.subtotal}</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td colSpan="4" className="h4 text-right">
                                                    Total
                                                </td>
                                                <td className="text-right text-success h3">{sumsubtotalespresupuesto()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        :null}
                    </div>
                </div>
            ) : null}

            {view == "devoluciones" ?
                <ModalMovimientos
                    getMovimientos={getMovimientos}
                    setShowModalMovimientos={setShowModalMovimientos}
                    showModalMovimientos={showModalMovimientos}
                    setBuscarDevolucion={setBuscarDevolucion}
                    buscarDevolucion={buscarDevolucion}
                    setTipoMovMovimientos={setTipoMovMovimientos}
                    tipoMovMovimientos={tipoMovMovimientos}
                    setTipoCatMovimientos={setTipoCatMovimientos}
                    tipoCatMovimientos={tipoCatMovimientos}
                    productosDevolucionSelect={
                        productosDevolucionSelect
                    }
                    idMovSelect={idMovSelect}
                    setIdMovSelect={setIdMovSelect}
                    movimientos={movimientos}
                    delMov={delMov}
                    setFechaMovimientos={setFechaMovimientos}
                    fechaMovimientos={fechaMovimientos}
                    setPersonaFastDevolucion={setPersonaFastDevolucion}
                    setpagoDevolucion={setpagoDevolucion}
                    setDevolucion={setDevolucion}
                    createDevolucion={createDevolucion}
                    devolucionselect={devolucionselect}
                    menuselectdevoluciones={menuselectdevoluciones}
                    setmenuselectdevoluciones={
                        setmenuselectdevoluciones
                    }
                    clienteselectdevolucion={clienteselectdevolucion}
                    setclienteselectdevolucion={
                        setclienteselectdevolucion
                    }
                    productosselectdevolucion={
                        productosselectdevolucion
                    }
                    setproductosselectdevolucion={
                        setproductosselectdevolucion
                    }
                    pagosselectdevolucion={pagosselectdevolucion}
                    setpagosselectdevolucion={setpagosselectdevolucion}
                    sethandleproductosselectdevolucion={
                        sethandleproductosselectdevolucion
                    }
                    setprodTempoDevolucion={setprodTempoDevolucion}
                    devolucionSalidaEntrada={devolucionSalidaEntrada} 
                    setdevolucionSalidaEntrada={setdevolucionSalidaEntrada}
                    devolucionTipo={devolucionTipo} 
                    setdevolucionTipo={setdevolucionTipo}
                    devolucionCt={devolucionCt} 
                    setdevolucionCt={setdevolucionCt}
                    devolucionMotivo={devolucionMotivo} 
                    setdevolucionMotivo={setdevolucionMotivo}
                    prodTempoDevolucion={prodTempoDevolucion}
                    agregarProductoDevolucionTemporal={agregarProductoDevolucionTemporal}
                    setbuscarDevolucionhistorico={
                        setbuscarDevolucionhistorico
                    }
                    buscarDevolucionhistorico={
                        buscarDevolucionhistorico
                    }
                    productosDevolucionSelecthistorico={
                        productosDevolucionSelecthistorico
                    }
                    devolucionsumentrada={devolucionsumentrada}
                    devolucionsumsalida={devolucionsumsalida}
                    devolucionsumdiferencia={devolucionsumdiferencia}
                    delpagodevolucion={delpagodevolucion}
                    delproductodevolucion={delproductodevolucion}
                    pagosselectdevolucionmonto={
                        pagosselectdevolucionmonto
                    }
                    setpagosselectdevolucionmonto={
                        setpagosselectdevolucionmonto
                    }
                    pagosselectdevoluciontipo={
                        pagosselectdevoluciontipo
                    }
                    setpagosselectdevoluciontipo={
                        setpagosselectdevoluciontipo
                    }
                    sethandlepagosselectdevolucion={
                        sethandlepagosselectdevolucion
                    }
                    setToggleAddPersona={setToggleAddPersona}
                    getPersona={getPersona}
                    personas={personas}
                    setPersonas={setPersonas}
                    clienteInpidentificacion={clienteInpidentificacion}
                    setclienteInpidentificacion={
                        setclienteInpidentificacion
                    }
                    clienteInpnombre={clienteInpnombre}
                    setclienteInpnombre={setclienteInpnombre}
                    clienteInptelefono={clienteInptelefono}
                    setclienteInptelefono={setclienteInptelefono}
                    clienteInpdireccion={clienteInpdireccion}
                    setclienteInpdireccion={setclienteInpdireccion}
                    number={number}
                />
            : null }
            {view == "pedidosCentral" ? (
                <PedidosCentralComponent
                    saveChangeInvInSucurFromCentral={
                        saveChangeInvInSucurFromCentral
                    }
                    socketUrl={socketUrl}
                    setSocketUrl={setSocketUrl}
                    mastermachines={mastermachines}
                    getmastermachine={getmastermachine}
                    setInventarioFromSucursal={setInventarioFromSucursal}
                    getInventarioFromSucursal={getInventarioFromSucursal}
                    pathcentral={pathcentral}
                    setpathcentral={setpathcentral}
                    getPedidosCentral={getPedidosCentral}
                    selectPedidosCentral={selectPedidosCentral}
                    checkPedidosCentral={checkPedidosCentral}
                    setinventarioModifiedCentralImport={
                        setinventarioModifiedCentralImport
                    }
                    inventarioModifiedCentralImport={
                        inventarioModifiedCentralImport
                    }
                    pedidosCentral={pedidosCentral}
                    setIndexPedidoCentral={setIndexPedidoCentral}
                    indexPedidoCentral={indexPedidoCentral}
                    moneda={moneda}
                    showaddpedidocentral={showaddpedidocentral}
                    setshowaddpedidocentral={setshowaddpedidocentral}
                    valheaderpedidocentral={valheaderpedidocentral}
                    setvalheaderpedidocentral={setvalheaderpedidocentral}
                    valbodypedidocentral={valbodypedidocentral}
                    setvalbodypedidocentral={setvalbodypedidocentral}
                    procesarImportPedidoCentral={procesarImportPedidoCentral}
                    getTareasCentral={getTareasCentral}
                    settareasCentral={settareasCentral}
                    tareasCentral={tareasCentral}
                    runTareaCentral={runTareaCentral}

                    modalmovilRef={modalmovilRef}
                    modalmovilx={modalmovilx}
                    modalmovily={modalmovily}
                    setmodalmovilshow={setmodalmovilshow}
                    modalmovilshow={modalmovilshow}
                    getProductos={getProductos}
                    productos={productos}
                    linkproductocentralsucursal={linkproductocentralsucursalSUCURSAL}
                    inputbuscarcentralforvincular={inputbuscarcentralforvincular}
                    openVincularSucursalwithCentral={openVincularSucursalwithCentral}
                    idselectproductoinsucursalforvicular={idselectproductoinsucursalforvicular}
                />
            ) : null}
            {view == "ventas" ? (
                <Ventas
                    ventasData={ventasData}
                    getVentasClick={getVentasClick}
                    setfechaventas={setfechaventas}
                    fechaventas={fechaventas}
                    moneda={moneda}
                    onClickEditPedido={onClickEditPedido}
                    getVentas={getVentas}
                />
            ) : null}

            {view == "vueltos" ? (
                <Vueltos
                    onchangecaja={onchangecaja}
                    qDeudores={qDeudores}
                    deudoresList={deudoresList}
                    selectDeudor={selectDeudor}
                    setSelectDeudor={setSelectDeudor}
                    tipo_pago_deudor={tipo_pago_deudor}
                    monto_pago_deudor={monto_pago_deudor}
                    setPagoCredito={setPagoCredito}
                    onClickEditPedido={onClickEditPedido}
                    onCLickDelPedido={onCLickDelPedido}
                    detallesDeudor={detallesDeudor}
                    onlyVueltos={onlyVueltos}
                    setOnlyVueltos={setOnlyVueltos}
                    qBuscarCliente={qBuscarCliente}
                    setqBuscarCliente={setqBuscarCliente}
                    clientesCrud={clientesCrud}
                    setindexSelectCliente={setindexSelectCliente}
                    indexSelectCliente={indexSelectCliente}
                    setClienteCrud={setClienteCrud}
                    delCliente={delCliente}
                    clienteInpidentificacion={clienteInpidentificacion}
                    setclienteInpidentificacion={setclienteInpidentificacion}
                    clienteInpnombre={clienteInpnombre}
                    setclienteInpnombre={setclienteInpnombre}
                    clienteInpcorreo={clienteInpcorreo}
                    setclienteInpcorreo={setclienteInpcorreo}
                    clienteInpdireccion={clienteInpdireccion}
                    setclienteInpdireccion={setclienteInpdireccion}
                    clienteInptelefono={clienteInptelefono}
                    setclienteInptelefono={setclienteInptelefono}
                    clienteInpestado={clienteInpestado}
                    setclienteInpestado={setclienteInpestado}
                    clienteInpciudad={clienteInpciudad}
                    setclienteInpciudad={setclienteInpciudad}
                    sumPedidos={sumPedidos}
                />
            ) : null}

            {view == "clientes_crud" ? (
                <Clientes
                    qBuscarCliente={qBuscarCliente}
                    setqBuscarCliente={setqBuscarCliente}
                    clientesCrud={clientesCrud}
                    setindexSelectCliente={setindexSelectCliente}
                    indexSelectCliente={indexSelectCliente}
                    setClienteCrud={setClienteCrud}
                    delCliente={delCliente}
                    clienteInpidentificacion={clienteInpidentificacion}
                    setclienteInpidentificacion={setclienteInpidentificacion}
                    clienteInpnombre={clienteInpnombre}
                    setclienteInpnombre={setclienteInpnombre}
                    clienteInpcorreo={clienteInpcorreo}
                    setclienteInpcorreo={setclienteInpcorreo}
                    clienteInpdireccion={clienteInpdireccion}
                    setclienteInpdireccion={setclienteInpdireccion}
                    clienteInptelefono={clienteInptelefono}
                    setclienteInptelefono={setclienteInptelefono}
                    clienteInpestado={clienteInpestado}
                    setclienteInpestado={setclienteInpestado}
                    clienteInpciudad={clienteInpciudad}
                    setclienteInpciudad={setclienteInpciudad}
                />
            ) : null}

            {view == "cierres" ? (
                <Cierres

                    puntolote1banco={puntolote1banco}
                    puntolote2banco={puntolote2banco}

                    setpuntolote1banco={setpuntolote1banco}
                    setpuntolote2banco={setpuntolote2banco}
                    lote1punto={lote1punto}
                    setlote1punto={setlote1punto}
                    montolote1punto={montolote1punto}
                    setmontolote1punto={setmontolote1punto}
                    lote2punto={lote2punto}
                    setlote2punto={setlote2punto}
                    montolote2punto={montolote2punto}
                    setmontolote2punto={setmontolote2punto}
                    serialbiopago={serialbiopago}
                    setserialbiopago={setserialbiopago}

                    setCajaFuerteEntradaCierreDolar={setCajaFuerteEntradaCierreDolar}
                    CajaFuerteEntradaCierreDolar={CajaFuerteEntradaCierreDolar}
                    setCajaFuerteEntradaCierreCop={setCajaFuerteEntradaCierreCop}
                    CajaFuerteEntradaCierreCop={CajaFuerteEntradaCierreCop}
                    setCajaFuerteEntradaCierreBs={setCajaFuerteEntradaCierreBs}
                    CajaFuerteEntradaCierreBs={CajaFuerteEntradaCierreBs}
                    setCajaChicaEntradaCierreDolar={setCajaChicaEntradaCierreDolar}
                    CajaChicaEntradaCierreDolar={CajaChicaEntradaCierreDolar}
                    setCajaChicaEntradaCierreCop={setCajaChicaEntradaCierreCop}
                    CajaChicaEntradaCierreCop={CajaChicaEntradaCierreCop}
                    setCajaChicaEntradaCierreBs={setCajaChicaEntradaCierreBs}
                    CajaChicaEntradaCierreBs={CajaChicaEntradaCierreBs}

                    tipoUsuarioCierre={tipoUsuarioCierre}
                    settipoUsuarioCierre={settipoUsuarioCierre}
                    cierrenumreportez={cierrenumreportez}
                    setcierrenumreportez={setcierrenumreportez}
                    cierreventaexcento={cierreventaexcento}
                    setcierreventaexcento={setcierreventaexcento}
                    cierreventagravadas={cierreventagravadas}
                    setcierreventagravadas={setcierreventagravadas}
                    cierreivaventa={cierreivaventa}
                    setcierreivaventa={setcierreivaventa}
                    cierretotalventa={cierretotalventa}
                    setcierretotalventa={setcierretotalventa}
                    cierreultimafactura={cierreultimafactura}
                    setcierreultimafactura={setcierreultimafactura}
                    cierreefecadiccajafbs={cierreefecadiccajafbs}
                    setcierreefecadiccajafbs={setcierreefecadiccajafbs}
                    cierreefecadiccajafcop={cierreefecadiccajafcop}
                    setcierreefecadiccajafcop={setcierreefecadiccajafcop}
                    cierreefecadiccajafdolar={cierreefecadiccajafdolar}
                    setcierreefecadiccajafdolar={setcierreefecadiccajafdolar}
                    cierreefecadiccajafeuro={cierreefecadiccajafeuro}
                    setcierreefecadiccajafeuro={setcierreefecadiccajafeuro}

                    getTotalizarCierre={getTotalizarCierre}
                    totalizarcierre={totalizarcierre}
                    setTotalizarcierre={setTotalizarcierre}
                    moneda={moneda}
                    auth={auth}
                    sendCuentasporCobrar={sendCuentasporCobrar}
                    fechaGetCierre2={fechaGetCierre2}
                    setfechaGetCierre2={setfechaGetCierre2}
                    verCierreReq={verCierreReq}
                    fechaGetCierre={fechaGetCierre}
                    setfechaGetCierre={setfechaGetCierre}
                    getCierres={getCierres}
                    cierres={cierres}
                    number={number}
                    guardar_usd={guardar_usd}
                    setguardar_usd={setguardar_usd}
                    guardar_cop={guardar_cop}
                    setguardar_cop={setguardar_cop}
                    guardar_bs={guardar_bs}
                    setguardar_bs={setguardar_bs}
                    settipo_accionCierre={settipo_accionCierre}
                    tipo_accionCierre={tipo_accionCierre}
                    caja_usd={caja_usd}
                    setcaja_usd={setCaja_usd}
                    caja_cop={caja_cop}
                    setcaja_cop={setCaja_cop}
                    caja_bs={caja_bs}
                    setcaja_bs={setCaja_bs}
                    caja_punto={caja_punto}
                    setCaja_punto={setCaja_punto}
                    setcaja_biopago={setcaja_biopago}
                    caja_biopago={caja_biopago}
                    dejar_usd={dejar_usd}
                    dejar_cop={dejar_cop}
                    dejar_bs={dejar_bs}
                    setDejar_usd={setDejar_usd}
                    setDejar_cop={setDejar_cop}
                    setDejar_bs={setDejar_bs}
                    lotespuntototalizar={lotespuntototalizar}
                    biopagostotalizar={biopagostotalizar}
                    cierre={cierre}
                    cerrar_dia={cerrar_dia}
                    fun_setguardar={fun_setguardar}
                    setcajaFuerteFun={setcajaFuerteFun}
                    total_caja_neto={total_caja_neto}
                    total_punto={total_punto}
                    total_biopago={total_biopago}
                    total_dejar_caja_neto={total_dejar_caja_neto}
                    viewCierre={viewCierre}
                    setViewCierre={setViewCierre}
                    toggleDetallesCierre={toggleDetallesCierre}
                    setToggleDetallesCierre={setToggleDetallesCierre}
                    onchangecaja={onchangecaja}
                    fechaCierre={fechaCierre}
                    setFechaCierre={setFechaCierre}
                    guardar_cierre={guardar_cierre}
                    veryenviarcierrefun={veryenviarcierrefun}
                    notaCierre={notaCierre}
                    billete1={billete1}
                    setbillete1={setbillete1}
                    billete5={billete5}
                    setbillete5={setbillete5}
                    billete10={billete10}
                    setbillete10={setbillete10}
                    billete20={billete20}
                    setbillete20={setbillete20}
                    billete50={billete50}
                    setbillete50={setbillete50}
                    billete100={billete100}
                    setbillete100={setbillete100}
                    dolar={dolar}
                    peso={peso}
                />
            ) : null}
            {view == "pedidos" ? (
                <Pedidos
                    getReferenciasElec={getReferenciasElec}
                    refrenciasElecData={refrenciasElecData}
                    togleeReferenciasElec={togleeReferenciasElec}
                    settogleeReferenciasElec={settogleeReferenciasElec}

                    addNewPedido={addNewPedido}
                    setmodalchangepedido={setmodalchangepedido}
                    setseletIdChangePedidoUserHandle={setseletIdChangePedidoUserHandle}
                    modalchangepedido={modalchangepedido}
                    modalchangepedidoy={modalchangepedidoy}
                    modalchangepedidox={modalchangepedidox}
                    usuarioChangeUserPedido={usuarioChangeUserPedido}
                    setusuarioChangeUserPedidoHandle={setusuarioChangeUserPedidoHandle}
                    usuariosData={usuariosData}
                    auth={auth}
                    toggleImprimirTicket={toggleImprimirTicket}
                   
                    pedidoData={pedidoData}
                    showModalPedidoFast={showModalPedidoFast}
                    setshowModalPedidoFast={setshowModalPedidoFast}
                    getPedidoFast={getPedidoFast}
                    clickSetOrderColumnPedidos={clickSetOrderColumnPedidos}
                    orderbycolumpedidos={orderbycolumpedidos}
                    setorderbycolumpedidos={setorderbycolumpedidos}
                    orderbyorderpedidos={orderbyorderpedidos}
                    setorderbyorderpedidos={setorderbyorderpedidos}
                    moneda={moneda}
                    setshowMisPedido={setshowMisPedido}
                    showMisPedido={showMisPedido}
                    tipobusquedapedido={tipobusquedapedido}
                    setTipoBusqueda={setTipoBusqueda}
                    busquedaPedido={busquedaPedido}
                    fecha1pedido={fecha1pedido}
                    fecha2pedido={fecha2pedido}
                    onChangePedidos={onChangePedidos}
                    onClickEditPedido={onClickEditPedido}
                    onCLickDelPedido={onCLickDelPedido}
                    pedidos={pedidos}
                    getPedidos={getPedidos}
                    filterMetodoPago={filterMetodoPago}
                    filterMetodoPagoToggle={filterMetodoPagoToggle}
                    tipoestadopedido={tipoestadopedido}
                    setTipoestadopedido={setTipoestadopedido}
                />
            ) : null}

            {view == "inventario" ? (
                <Inventario
                    personalNomina={personalNomina}
                    setpersonalNomina={setpersonalNomina}
                    getNomina={getNomina}
                    categoriasCajas={categoriasCajas}
                    setcategoriasCajas={setcategoriasCajas}
                    getcatsCajas={getcatsCajas}
                    getEstaInventario={getEstaInventario}

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

                    controlefecNewConcepto={controlefecNewConcepto}
                    setcontrolefecNewConcepto={setcontrolefecNewConcepto}

                    controlefecNewCategoria={controlefecNewCategoria}
                    setcontrolefecNewCategoria={setcontrolefecNewCategoria}

                    controlefecNewMonto={controlefecNewMonto}
                    setcontrolefecNewMonto={setcontrolefecNewMonto}

                    controlefecNewMontoMoneda={controlefecNewMontoMoneda}
                    setcontrolefecNewMontoMoneda={setcontrolefecNewMontoMoneda}

                    controlefecQCategoria={controlefecQCategoria}
                    setcontrolefecQCategoria={setcontrolefecQCategoria}

                    getControlEfec={getControlEfec}
                    setControlEfec={setControlEfec}
                    delCaja={delCaja}
                    saveReplaceProducto={saveReplaceProducto}
                    selectRepleceProducto={selectRepleceProducto}
                    replaceProducto={replaceProducto}
                    setreplaceProducto={setreplaceProducto}
                    user={user}
                    setStockMin={setStockMin}
                    datamodalhistoricoproducto={datamodalhistoricoproducto}
                    setdatamodalhistoricoproducto={setdatamodalhistoricoproducto}
                    getmovientoinventariounitario={getmovientoinventariounitario}
                    openmodalhistoricoproducto={openmodalhistoricoproducto}
                    showmodalhistoricoproducto={showmodalhistoricoproducto}
                    setshowmodalhistoricoproducto={setshowmodalhistoricoproducto}
                    fecha1modalhistoricoproducto={fecha1modalhistoricoproducto}
                    setfecha1modalhistoricoproducto={setfecha1modalhistoricoproducto}
                    fecha2modalhistoricoproducto={fecha2modalhistoricoproducto}
                    setfecha2modalhistoricoproducto={setfecha2modalhistoricoproducto}
                    usuariomodalhistoricoproducto={usuariomodalhistoricoproducto}
                    setusuariomodalhistoricoproducto={setusuariomodalhistoricoproducto}

                    usuariosData={usuariosData}
                    getUsuarios={getUsuarios}
                    
                    qhistoinven={qhistoinven}
                    setqhistoinven={setqhistoinven}
                    fecha1histoinven={fecha1histoinven}
                    setfecha1histoinven={setfecha1histoinven}
                    fecha2histoinven={fecha2histoinven}
                    setfecha2histoinven={setfecha2histoinven}
                    orderByHistoInven={orderByHistoInven}
                    setorderByHistoInven={setorderByHistoInven}
                    historicoInventario={historicoInventario}
                    usuarioHistoInven={usuarioHistoInven}
                    setusuarioHistoInven={setusuarioHistoInven}
                    getHistoricoInventario={getHistoricoInventario}

                    categoriaEstaInve={categoriaEstaInve}
                    setcategoriaEstaInve={setcategoriaEstaInve}
                    printTickedPrecio={printTickedPrecio}
                    sameCatValue={sameCatValue}
                    sameProValue={sameProValue}
                    setdropprintprice={setdropprintprice}
                    dropprintprice={dropprintprice}
                    printPrecios={printPrecios}
                    setCtxBulto={setCtxBulto}
                    setPrecioAlterno={setPrecioAlterno}
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
                    delPagoProveedor={delPagoProveedor}
                    busqAvanzInputsFun={busqAvanzInputsFun}
                    busqAvanzInputs={busqAvanzInputs}
                    buscarInvAvanz={buscarInvAvanz}
                    busquedaAvanazadaInv={busquedaAvanazadaInv}
                    setbusquedaAvanazadaInv={setbusquedaAvanazadaInv}
                    setSameGanancia={setSameGanancia}
                    setSameCat={setSameCat}
                    setSamePro={setSamePro}
                    openReporteFalla={openReporteFalla}
                    getPagoProveedor={getPagoProveedor}
                    setPagoProveedor={setPagoProveedor}
                    pagosproveedor={pagosproveedor}
                    tipopagoproveedor={tipopagoproveedor}
                    settipopagoproveedor={settipopagoproveedor}
                    montopagoproveedor={montopagoproveedor}
                    setmontopagoproveedor={setmontopagoproveedor}
                    setmodFact={setmodFact}
                    modFact={modFact}
                    saveFactura={saveFactura}
                    categorias={categorias}
                    setporcenganancia={setporcenganancia}
                    refsInpInvList={refsInpInvList}
                    guardarNuevoProductoLote={guardarNuevoProductoLote}
                    changeInventario={changeInventario}
                    reporteInventario={reporteInventario}
                    addNewLote={addNewLote}
                    changeModLote={changeModLote}
                    modViewInventario={modViewInventario}
                    setmodViewInventario={setmodViewInventario}
                    setNewProducto={setNewProducto}
                    verDetallesFactura={verDetallesFactura}
                    showaddpedidocentral={showaddpedidocentral}
                    setshowaddpedidocentral={setshowaddpedidocentral}
                    valheaderpedidocentral={valheaderpedidocentral}
                    setvalheaderpedidocentral={setvalheaderpedidocentral}
                    valbodypedidocentral={valbodypedidocentral}
                    setvalbodypedidocentral={setvalbodypedidocentral}
                    procesarImportPedidoCentral={procesarImportPedidoCentral}
                    moneda={moneda}
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
                    depositosList={depositosList}
                    marcasList={marcasList}
                    setshowModalFacturas={setshowModalFacturas}
                    showModalFacturas={showModalFacturas}
                    facturas={facturas}
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
                    factInpestatus={factInpestatus}
                    setfactInpestatus={setfactInpestatus}
                    setFactura={setFactura}
                    delFactura={delFactura}
                    Invnum={Invnum}
                    setInvnum={setInvnum}
                    InvorderColumn={InvorderColumn}
                    setInvorderColumn={setInvorderColumn}
                    InvorderBy={InvorderBy}
                    setInvorderBy={setInvorderBy}
                    delItemFact={delItemFact}
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
                    getPedidosCentral={getPedidosCentral}
                    selectPedidosCentral={selectPedidosCentral}
                    checkPedidosCentral={checkPedidosCentral}
                    pedidosCentral={pedidosCentral}
                    setIndexPedidoCentral={setIndexPedidoCentral}
                    indexPedidoCentral={indexPedidoCentral}
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
                    dataEstaInven={dataEstaInven}
                />
            ) : null}
            {view == "ViewPedidoVendedor" ? <ViewPedidoVendedor /> : null}
            {view == "pagar" ? (
                <Pagar
                    getSucursales={getSucursales}
                    setexportpedido={setexportpedido}
                    transferirpedidoa={transferirpedidoa}
                    settransferirpedidoa={settransferirpedidoa}
                    sucursalesCentral={sucursalesCentral}
                    inputqinterno={inputqinterno}
                    setinputqinterno={setinputqinterno}
                    refaddfast={refaddfast}
                    changeEntregado={changeEntregado}
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
                    setCtxBultoCarrito={setCtxBultoCarrito}
                    setPrecioAlternoCarrito={setPrecioAlternoCarrito}
                    addRefPago={addRefPago}
                    settogglereferenciapago={settogglereferenciapago}
                    settipo_referenciapago={settipo_referenciapago}
                    tipo_referenciapago={tipo_referenciapago}
                    setdescripcion_referenciapago={
                        setdescripcion_referenciapago
                    }
                    descripcion_referenciapago={descripcion_referenciapago}
                    setmonto_referenciapago={setmonto_referenciapago}
                    monto_referenciapago={monto_referenciapago}
                    setbanco_referenciapago={setbanco_referenciapago}
                    banco_referenciapago={banco_referenciapago}
                    togglereferenciapago={togglereferenciapago}
                    delRefPago={delRefPago}
                    refPago={refPago}
                    setrefPago={setrefPago}
                    qProductosMain={qProductosMain}
                    showinputaddCarritoFast={showinputaddCarritoFast}
                    setshowinputaddCarritoFast={setshowinputaddCarritoFast}
                    dolar={dolar}
                    peso={peso}
                    moneda={moneda}
                    facturar_e_imprimir={facturar_e_imprimir}
                    pedidosFast={pedidosFast}
                    onClickEditPedido={onClickEditPedido}
                    tipobusquedapedido={tipobusquedapedido}
                    pedidos={pedidos}
                    pedidoData={pedidoData}
                    getPedido={getPedido}
                    debito={debito}
                    setDebito={setDebito}
                    efectivo={efectivo}
                    setEfectivo={setEfectivo}
                    transferencia={transferencia}
                    setTransferencia={setTransferencia}
                    vuelto={vuelto}
                    setVuelto={setVuelto}
                    setBiopago={setBiopago}
                    biopago={biopago}
                    number={number}
                    credito={credito}
                    inputmodaladdpersonacarritoref={
                        inputmodaladdpersonacarritoref
                    }
                    inputaddcarritointernoref={inputaddcarritointernoref}
                    viewReportPedido={viewReportPedido}
                    delItemPedido={delItemPedido}
                    setDescuento={setDescuento}
                    setDescuentoUnitario={setDescuentoUnitario}
                    setDescuentoTotal={setDescuentoTotal}
                    setCantidadCarrito={setCantidadCarrito}
                    ModaladdproductocarritoToggle={
                        ModaladdproductocarritoToggle
                    }
                    setModaladdproductocarritoToggle={
                        setModaladdproductocarritoToggle
                    }
                    toggleModalProductos={toggleModalProductos}
                    toggleAddPersona={toggleAddPersona}
                    setToggleAddPersona={setToggleAddPersona}
                    personas={personas}
                    getPersona={getPersona}
                    setPersonas={setPersonas}
                    setProductoCarritoInterno={setProductoCarritoInterno}
                    productoSelectinternouno={productoSelectinternouno}
                    addCarritoRequestInterno={addCarritoRequestInterno}
                    inputCantidadCarritoref = {inputCantidadCarritoref }
                    setCantidad={setCantidad}
                    cantidad={cantidad}
                    devolucionTipo={devolucionTipo}
                    setdevolucionTipo={setdevolucionTipo}
                    del_pedido={del_pedido}
                    toggleImprimirTicket={toggleImprimirTicket}
                    productos={productos}
                    getProductos={getProductos}
                    facturar_pedido={facturar_pedido}
                    setCredito={setCredito}
                    tbodyproducInterref={tbodyproducInterref}
                    tbodypersoInterref={tbodypersoInterref}
                    countListInter={countListInter}
                    countListPersoInter={countListPersoInter}
                    onchangeinputmain={onchangeinputmain}
                    clickSetOrderColumn={clickSetOrderColumn}
                    orderColumn={orderColumn}
                    orderBy={orderBy}
                    entregarVuelto={entregarVuelto}
                    setPersonaFast={setPersonaFast}
                    clienteInpidentificacion={clienteInpidentificacion}
                    setclienteInpidentificacion={setclienteInpidentificacion}
                    clienteInpnombre={clienteInpnombre}
                    setclienteInpnombre={setclienteInpnombre}
                    clienteInptelefono={clienteInptelefono}
                    setclienteInptelefono={setclienteInptelefono}
                    clienteInpdireccion={clienteInpdireccion}
                    setclienteInpdireccion={setclienteInpdireccion}
                    inputaddCarritoFast={inputaddCarritoFast}
                    setinputaddCarritoFast={setinputaddCarritoFast}
                    addCarritoFast={addCarritoFast}
                    refinputaddcarritofast={refinputaddcarritofast}
                    autoCorrector={autoCorrector}
                    setautoCorrector={setautoCorrector}
                    getDebito={getDebito}
                    getCredito={getCredito}
                    getTransferencia={getTransferencia}
                    getEfectivo={getEfectivo}
                    getBio={getBio}
                    auth={auth}
                />
            ) : null}
            {view == "panelcentrodeacopio" ? (
                <Panelcentrodeacopio
                    guardarDeSucursalEnCentral={guardarDeSucursalEnCentral}
                    autovincularSucursalCentral={autovincularSucursalCentral}
                    datainventarioSucursalFromCentralcopy={datainventarioSucursalFromCentralcopy}
                    setdatainventarioSucursalFromCentralcopy={setdatainventarioSucursalFromCentralcopy}
                    estadisticasinventarioSucursalFromCentral={
                        estadisticasinventarioSucursalFromCentral
                    }
                    uniqueproductofastshowbyid={uniqueproductofastshowbyid}
                    getUniqueProductoById={getUniqueProductoById}
                    showdatafastproductobyid={showdatafastproductobyid}
                    setshowdatafastproductobyid={setshowdatafastproductobyid}
                    puedoconsultarproductosinsucursalfromcentral={puedoconsultarproductosinsucursalfromcentral}
                    getProductos={getProductos}
                    productos={productos}
                    idselectproductoinsucursalforvicular={idselectproductoinsucursalforvicular}
                    linkproductocentralsucursal={linkproductocentralsucursal}
                    openVincularSucursalwithCentral={
                        openVincularSucursalwithCentral
                    }
                    modalmovilRef={modalmovilRef}
                    inputbuscarcentralforvincular={
                        inputbuscarcentralforvincular
                    }
                    modalmovilx={modalmovilx}
                    modalmovily={modalmovily}
                    modalmovilshow={modalmovilshow}
                    setmodalmovilshow={setmodalmovilshow}
                    getTareasCentral={getTareasCentral}
                    tareasCentral={tareasCentral}
                    getSucursales={getSucursales}
                    sucursalesCentral={sucursalesCentral}
                    setselectSucursalCentral={setselectSucursalCentral}
                    selectSucursalCentral={selectSucursalCentral}
                    getInventarioSucursalFromCentral={
                        getInventarioSucursalFromCentral
                    }
                    setInventarioSucursalFromCentral={
                        setInventarioSucursalFromCentral
                    }
                    subviewpanelcentroacopio={subviewpanelcentroacopio}
                    setsubviewpanelcentroacopio={setsubviewpanelcentroacopio}
                    parametrosConsultaFromsucursalToCentral={
                        parametrosConsultaFromsucursalToCentral
                    }
                    setparametrosConsultaFromsucursalToCentral={
                        setparametrosConsultaFromsucursalToCentral
                    }
                    onchangeparametrosConsultaFromsucursalToCentral={
                        onchangeparametrosConsultaFromsucursalToCentral
                    }
                    fallaspanelcentroacopio={fallaspanelcentroacopio}
                    estadisticaspanelcentroacopio={
                        estadisticaspanelcentroacopio
                    }
                    gastospanelcentroacopio={gastospanelcentroacopio}
                    cierrespanelcentroacopio={cierrespanelcentroacopio}
                    diadeventapanelcentroacopio={diadeventapanelcentroacopio}
                    tasaventapanelcentroacopio={tasaventapanelcentroacopio}
                    setchangetasasucursal={setchangetasasucursal}
                    inventarioSucursalFromCentral={
                        inventarioSucursalFromCentral
                    }
                    categorias={categorias}
                    proveedoresList={proveedoresList}
                    changeInventarioFromSucursalCentral={
                        changeInventarioFromSucursalCentral
                    }
                    setCambiosInventarioSucursal={setCambiosInventarioSucursal}
                    number={number}
                />
            ) : null}
            {view == "credito" ? (
                <Credito
                    limitdeudores={limitdeudores}
                    setlimitdeudores={setlimitdeudores}
                    moneda={moneda}
                    orderbycolumdeudores={orderbycolumdeudores}
                    setorderbycolumdeudores={setorderbycolumdeudores}
                    orderbyorderdeudores={orderbyorderdeudores}
                    setorderbyorderdeudores={setorderbyorderdeudores}
                    printCreditos={printCreditos}
                    onchangecaja={onchangecaja}
                    qDeudores={qDeudores}
                    deudoresList={deudoresList}
                    tipo_pago_deudor={tipo_pago_deudor}
                    monto_pago_deudor={monto_pago_deudor}
                    selectDeudor={selectDeudor}
                    setSelectDeudor={setSelectDeudor}
                    setPagoCredito={setPagoCredito}
                    detallesDeudor={detallesDeudor}
                    onClickEditPedido={onClickEditPedido}
                    onCLickDelPedido={onCLickDelPedido}
                    onlyVueltos={onlyVueltos}
                    setOnlyVueltos={setOnlyVueltos}
                    qBuscarCliente={qBuscarCliente}
                    setqBuscarCliente={setqBuscarCliente}
                    clientesCrud={clientesCrud}
                    setindexSelectCliente={setindexSelectCliente}
                    indexSelectCliente={indexSelectCliente}
                    setClienteCrud={setClienteCrud}
                    delCliente={delCliente}
                    clienteInpidentificacion={clienteInpidentificacion}
                    setclienteInpidentificacion={setclienteInpidentificacion}
                    clienteInpnombre={clienteInpnombre}
                    setclienteInpnombre={setclienteInpnombre}
                    clienteInpcorreo={clienteInpcorreo}
                    setclienteInpcorreo={setclienteInpcorreo}
                    clienteInpdireccion={clienteInpdireccion}
                    setclienteInpdireccion={setclienteInpdireccion}
                    clienteInptelefono={clienteInptelefono}
                    setclienteInptelefono={setclienteInptelefono}
                    clienteInpestado={clienteInpestado}
                    setclienteInpestado={setclienteInpestado}
                    clienteInpciudad={clienteInpciudad}
                    setclienteInpciudad={setclienteInpciudad}
                    sumPedidos={sumPedidos}
                    sumPedidosArr={sumPedidosArr}
                    setsumPedidosArr={setsumPedidosArr}
                />
            ) : null}

            {view == "configuracion" ? (
                <Configuracion
                    subViewConfig={subViewConfig}
                    setsubViewConfig={setsubViewConfig}
                    categorias={categorias}
                    addNewCategorias={addNewCategorias}
                    categoriasDescripcion={categoriasDescripcion}
                    setcategoriasDescripcion={setcategoriasDescripcion}
                    indexSelectCategorias={indexSelectCategorias}
                    setIndexSelectCategorias={setIndexSelectCategorias}
                    qBuscarCategorias={qBuscarCategorias}
                    setQBuscarCategorias={setQBuscarCategorias}
                    delCategorias={delCategorias}
                    addNewUsuario={addNewUsuario}
                    usuarioNombre={usuarioNombre}
                    setusuarioNombre={setusuarioNombre}
                    usuarioUsuario={usuarioUsuario}
                    setusuarioUsuario={setusuarioUsuario}
                    usuarioRole={usuarioRole}
                    setusuarioRole={setusuarioRole}
                    usuarioClave={usuarioClave}
                    setusuarioClave={setusuarioClave}
                    indexSelectUsuarios={indexSelectUsuarios}
                    setIndexSelectUsuarios={setIndexSelectUsuarios}
                    qBuscarUsuario={qBuscarUsuario}
                    setQBuscarUsuario={setQBuscarUsuario}
                    delUsuario={delUsuario}
                    usuariosData={usuariosData}
                />
            ) : null}
        </>
    );
}
