import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import BarraPedLateral from "./barraPedLateral";
import ModalAddListProductosInterno from "./modalAddListProductosInterno";

import db from "../database/database";

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
    notificar,
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

    cedula_referenciapago,
    setcedula_referenciapago,
    telefono_referenciapago,
    settelefono_referenciapago,
    // Props para ordenamiento
    orderColumn,
    setOrderColumn,
    orderBy,
    setOrderBy,
}) {
    const [recibido_dolar, setrecibido_dolar] = useState("");
    const [recibido_bs, setrecibido_bs] = useState("");
    const [recibido_cop, setrecibido_cop] = useState("");
    const [cambio_dolar, setcambio_dolar] = useState("");

    // Estado para mostrar/ocultar menú flotante
    const [showFloatingMenu, setShowFloatingMenu] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showVueltosSection, setShowVueltosSection] = useState(false);
    const [showTransferirSection, setShowTransferirSection] = useState(false);
    const [showHeaderAndMenu, setShowHeaderAndMenu] = useState(true);
    const [cambio_bs, setcambio_bs] = useState("");
    const [cambio_cop, setcambio_cop] = useState("");

    const [cambio_tot_result, setcambio_tot_result] = useState("");
    const [recibido_tot, setrecibido_tot] = useState("");
    const showTittlePrice = (pu, total) => {
        try {
            return (
                "P/U. Bs." +
                moneda(number(pu) * dolar) +
                "\n" +
                "Total Bs." +
                moneda(number(total) * dolar)
            );
        } catch (err) {
            return "";
        }
    };
    const changeRecibido = (val, type) => {
        switch (type) {
            case "recibido_dolar":
                setrecibido_dolar(number(val));

                break;
            case "recibido_bs":
                setrecibido_bs(number(val));
                break;
            case "recibido_cop":
                setrecibido_cop(number(val));
                break;
        }
    };
    const setPagoInBs = (callback) => {
        let bs = parseFloat(window.prompt("Monto Bs"));
        if (bs) {
            callback((bs / dolar).toFixed(4));
        }
    };
    const sumRecibido = () => {
        let vuel_dolar = parseFloat(recibido_dolar ? recibido_dolar : 0);
        let vuel_bs =
            parseFloat(recibido_bs ? recibido_bs : 0) / parseFloat(dolar);
        let vuel_cop =
            parseFloat(recibido_cop ? recibido_cop : 0) / parseFloat(peso);

        let t = vuel_dolar + vuel_bs + vuel_cop;
        let cambio_dolar =
            recibido_dolar || recibido_bs || recibido_cop
                ? t - pedidoData.clean_total
                : "";

        setrecibido_tot(t.toFixed(2));
        setcambio_dolar(cambio_dolar !== "" ? cambio_dolar.toFixed(2) : "");
        setcambio_bs("");
        setcambio_cop("");
        setcambio_tot_result(
            cambio_dolar !== "" ? cambio_dolar.toFixed(2) : ""
        );
    };
    const setVueltobs = () => {
        setcambio_bs((cambio_tot_result * dolar).toFixed(2));
        setcambio_dolar("");
        setcambio_cop("");
    };
    const setVueltodolar = () => {
        setcambio_bs("");
        setcambio_dolar(cambio_tot_result);
        setcambio_cop("");
    };
    const setVueltocop = () => {
        setcambio_bs("");
        setcambio_dolar("");
        setcambio_cop((cambio_tot_result * peso).toFixed(2));
    };
    const syncCambio = (val, type) => {
        val = number(val);
        let valC = 0;
        if (type == "Dolar") {
            setcambio_dolar(val);
            valC = val;
        } else if (type == "Bolivares") {
            setcambio_bs(val);
            valC = parseFloat(val ? val : 0) / parseFloat(dolar);
        } else if (type == "Pesos") {
            setcambio_cop(val);
            valC = parseFloat(val ? val : 0) / parseFloat(peso);
        }

        let divisor = 0;

        let inputs = [
            {
                key: "Dolar",
                val: cambio_dolar,
                set: (val) => setcambio_dolar(val),
            },
            {
                key: "Bolivares",
                val: cambio_bs,
                set: (val) => setcambio_bs(val),
            },
            { key: "Pesos", val: cambio_cop, set: (val) => setcambio_cop(val) },
        ];

        inputs.map((e) => {
            if (e.key != type) {
                if (e.val) {
                    divisor++;
                }
            }
        });
        let cambio_tot_resultvalC = 0;
        if (cambio_bs && cambio_dolar && type == "Pesos") {
            let bs = parseFloat(cambio_bs) / parseFloat(dolar);
            setcambio_dolar((cambio_tot_result - bs - valC).toFixed(2));
        } else {
            inputs.map((e) => {
                if (e.key != type) {
                    if (e.val) {
                        cambio_tot_resultvalC =
                            (cambio_tot_result - valC) / divisor;
                        if (e.key == "Dolar") {
                            e.set(cambio_tot_resultvalC.toFixed(2));
                        } else if (e.key == "Bolivares") {
                            e.set((cambio_tot_resultvalC * dolar).toFixed(2));
                        } else if (e.key == "Pesos") {
                            e.set((cambio_tot_resultvalC * peso).toFixed(2));
                        }
                    }
                }
            });
        }
    };
    const sumCambio = () => {
        let vuel_dolar = parseFloat(cambio_dolar ? cambio_dolar : 0);
        let vuel_bs = parseFloat(cambio_bs ? cambio_bs : 0) / parseFloat(dolar);
        let vuel_cop =
            parseFloat(cambio_cop ? cambio_cop : 0) / parseFloat(peso);
        return (vuel_dolar + vuel_bs + vuel_cop).toFixed(2);
    };
    const debitoBs = (met) => {
        try {
            if (met == "debito") {
                if (debito == "") {
                    return "";
                }
                return "Bs." + moneda(dolar * debito);
            }

            if (met == "transferencia") {
                if (transferencia == "") {
                    return "";
                }
                return "Bs." + moneda(dolar * transferencia);
            }
            if (met == "biopago") {
                if (biopago == "") {
                    return "";
                }
                return "Bs." + moneda(dolar * biopago);
            }
            if (met == "efectivo") {
                if (efectivo == "") {
                    return "";
                }
                return "Bs." + moneda(dolar * efectivo);
            }
        } catch (err) {
            return "";
            console.log();
        }
    };
    const syncPago = (val, type) => {
        val = number(val);
        if (type == "Debito") {
            setDebito(val);
        } else if (type == "Efectivo") {
            setEfectivo(val);
        } else if (type == "Transferencia") {
            setTransferencia(val);
        } else if (type == "Credito") {
            setCredito(val);
        } else if (type == "Biopago") {
            setBiopago(val);
        }

        let divisor = 0;

        let inputs = [
            { key: "Debito", val: debito, set: (val) => setDebito(val) },
            { key: "Efectivo", val: efectivo, set: (val) => setEfectivo(val) },
            {
                key: "Transferencia",
                val: transferencia,
                set: (val) => setTransferencia(val),
            },
            { key: "Credito", val: credito, set: (val) => setCredito(val) },
            { key: "Biopago", val: biopago, set: (val) => setBiopago(val) },
        ];

        inputs.map((e) => {
            if (e.key != type) {
                if (e.val) {
                    divisor++;
                }
            }
        });

        if (autoCorrector) {
            inputs.map((e) => {
                if (e.key != type) {
                    if (e.val) {
                        e.set(
                            ((pedidoData.clean_total - val) / divisor).toFixed(
                                4
                            )
                        );
                    }
                }
            });
        }
    };

    const [validatingRef, setValidatingRef] = useState(null);

    // Estados para modal de código de aprobación
    const [showCodigoModal, setShowCodigoModal] = useState(false);
    const [codigoGenerado, setCodigoGenerado] = useState("");
    const [claveIngresada, setClaveIngresada] = useState("");
    const [currentRefId, setCurrentRefId] = useState(null);

    const sendRefToMerchant = (id_ref) => {
        console.log(id_ref, "id_ref BEFORE");
        setValidatingRef(id_ref);
        console.log(id_ref, "id_ref");
        db.sendRefToMerchant({
            id_ref: id_ref,
        })
            .then((res) => {
                // Verificar si se requiere código de aprobación
                if (res.data.estado === "codigo_required") {
                    setCodigoGenerado(res.data.codigo_generado);
                    setCurrentRefId(id_ref);
                    setShowCodigoModal(true);
                    setClaveIngresada("");
                } else {
                    // Mostrar la respuesta exacta del backend
                    notificar(res.data.msj);

                    // Refrescar los datos del pedido después de un pequeño delay
                    // para asegurar que la BD se haya actualizado completamente
                    setTimeout(() => {
                        getPedido(null, null, false);
                    }, 500);
                }
            })
            .catch((error) => {
                notificar({
                    msj:
                        "Error al validar referencia: " +
                        (error.response?.data?.msj || error.message),
                    estado: false,
                });
            })
            .finally(() => {
                setValidatingRef(null);
            });
    };

    // Función para validar el código de aprobación
    const validarCodigo = () => {
        if (!claveIngresada.trim()) {
            notificar({
                msj: "Por favor ingrese la clave de aprobación",
                estado: false,
            });
            return;
        }

        db.validarCodigoAprobacion({
            codigo: claveIngresada,
            id_ref: currentRefId,
        })
            .then((res) => {
                if (res.data.estado) {
                    notificar(res.data.msj);
                    setShowCodigoModal(false);
                    setClaveIngresada("");
                    setCodigoGenerado("");
                    setCurrentRefId(null);

                    // Refrescar los datos del pedido
                    setTimeout(() => {
                        getPedido(null, null, false);
                    }, 500);
                } else {
                    notificar({
                        msj: res.data.msj,
                        estado: false,
                    });
                }
            })
            .catch((error) => {
                notificar({
                    msj:
                        "Error al validar código: " +
                        (error.response?.data?.msj || error.message),
                    estado: false,
                });
            });
    };

    // Función para cerrar el modal de código
    const cerrarModalCodigo = () => {
        setShowCodigoModal(false);
        setClaveIngresada("");
        setCodigoGenerado("");
        setCurrentRefId(null);
    };

    // Función para generar la clave desde el código mostrado
    const generarClaveDesdecodigo = (codigo) => {
        // Algoritmo simple: tomar los últimos 4 dígitos, sumar 1234 y tomar los últimos 4 dígitos del resultado
        const ultimosCuatro = codigo.toString().slice(-4);
        const suma = parseInt(ultimosCuatro) + 1234;
        return suma.toString().slice(-4);
    };

    useEffect(() => {
        sumRecibido();
    }, [recibido_bs, recibido_cop, recibido_dolar]);

    useEffect(() => {
        getPedidosFast();
    }, []);

    // useEffect para detectar scroll y mostrar/ocultar menú
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY) {
                // Scroll hacia arriba - mostrar menú
                setShowFloatingMenu(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // Scroll hacia abajo - ocultar menú (solo después de 50px)
                setShowFloatingMenu(false);
            }

            setLastScrollY(currentScrollY);
        };

        // Agregar listener al scroll global de la ventana
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    //esc

    //c
    useHotkeys(
        "c",
        (event) => {
            // Solo ejecutar si NO estamos en ningún input o select
            const isInputOrSelect =
                event.target.tagName === "INPUT" ||
                event.target.tagName === "SELECT" ||
                event.target.tagName === "TEXTAREA";

            if (!isInputOrSelect) {
                event.preventDefault();
                event.stopPropagation();
                getCredito();
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
            filter: false,
        },
        []
    );

    useHotkeys(
        "t",
        (event) => {
            // Solo ejecutar si NO estamos en ningún input o select
            const isInputOrSelect =
                event.target.tagName === "INPUT" ||
                event.target.tagName === "SELECT" ||
                event.target.tagName === "TEXTAREA";

            if (!isInputOrSelect) {
                event.preventDefault();
                event.stopPropagation();
                getTransferencia();
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
            filter: false,
        },
        []
    );
    //b
    useHotkeys(
        "b",
        (event) => {
            // Solo ejecutar si NO estamos en ningún input o select
            const isInputOrSelect =
                event.target.tagName === "INPUT" ||
                event.target.tagName === "SELECT" ||
                event.target.tagName === "TEXTAREA";

            if (!isInputOrSelect) {
                event.preventDefault();
                event.stopPropagation();
                getBio();
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
            filter: false,
        },
        []
    );
    //e
    useHotkeys(
        "e",
        (event) => {
            // Solo ejecutar si NO estamos en ningún input o select
            const isInputOrSelect =
                event.target.tagName === "INPUT" ||
                event.target.tagName === "SELECT" ||
                event.target.tagName === "TEXTAREA";

            if (!isInputOrSelect) {
                event.preventDefault();
                event.stopPropagation();
                getEfectivo();
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
            filter: false,
        },
        []
    );
    //d
    useHotkeys(
        "d",
        (event) => {
            // Solo ejecutar si NO estamos en ningún input o select
            const isInputOrSelect =
                event.target.tagName === "INPUT" ||
                event.target.tagName === "SELECT" ||
                event.target.tagName === "TEXTAREA";

            if (!isInputOrSelect) {
                event.preventDefault();
                event.stopPropagation();
                getDebito();
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
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
    //ctrl+enter
    useHotkeys(
        "ctrl+enter",
        (event) => {
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
    //f1 - Crear nuevo pedido
    useHotkeys(
        "f1",
        () => {
            // Validar que existe la función addNewPedido
            if (typeof addNewPedido === "function") {
                addNewPedido();
            } else {
                console.warn("addNewPedido function not available");
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
        },
        []
    );

 

    //f10 - Toggle header y menú flotante
    useHotkeys(
        "f10",
        (event) => {
            event.preventDefault(); // Prevenir comportamiento por defecto del navegador
            setShowHeaderAndMenu(!showHeaderAndMenu);
            // Scroll al top
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
            filter: false,
        },
        [showHeaderAndMenu]
    );

    //tab - Comportamiento por defecto cuando el modal de referencia está abierto
    useHotkeys(
        "tab",
        (event) => {
            // Solo aplicar comportamiento por defecto si el modal de referencia está abierto
            if (togglereferenciapago) {
                // Permitir el comportamiento por defecto del TAB (navegación entre elementos)
                return; // No hacer preventDefault, dejar que el TAB funcione normalmente
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
            filter: false,
        },
        [togglereferenciapago]
    );

    //r - Abrir modal de referencia de pago
    useHotkeys(
        "r",
        (event) => {
            // Solo ejecutar si NO estamos en ningún input o select
            const isInputOrSelect =
                event.target.tagName === "INPUT" ||
                event.target.tagName === "SELECT" ||
                event.target.tagName === "TEXTAREA";

            if (!isInputOrSelect) {
                event.preventDefault();
                event.stopPropagation();

                // Determinar qué tipo de pago está activo y su monto
                let montoActivo = transferencia;
                let tipoActivo = "1"; // Transferencia por defecto

                if (debito && debito > 0) {
                    montoActivo = debito;
                    tipoActivo = "2"; // Débito
                } else if (efectivo && efectivo > 0) {
                    montoActivo = efectivo;
                    tipoActivo = "3"; // Efectivo
                } else if (credito && credito > 0) {
                    montoActivo = credito;
                    tipoActivo = "4"; // Crédito
                } else if (biopago && biopago > 0) {
                    montoActivo = biopago;
                    tipoActivo = "5"; // Biopago
                }

                addRefPago("toggle", montoActivo, tipoActivo);
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
            filter: false,
        },
        [transferencia, debito, efectivo, credito, biopago]
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
    } = pedidoData;

    let ifnegative = items.filter((e) => e.cantidad < 0).length;
    return pedidoData ? (
        <div className="container-fluid" style={{ minHeight: "100vh" }}>
            <div className="row h-100">
                <div
                    className="col-lg-7"
                    style={{
                        height: "100vh",
                        overflowY: "auto",
                        paddingRight: "8px",
                    }}
                >
                    <ModalAddListProductosInterno
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
                        setProductoCarritoInterno={setProductoCarritoInterno}
                        moneda={moneda}
                        ModaladdproductocarritoToggle={
                            ModaladdproductocarritoToggle
                        }
                        setQProductosMain={setQProductosMain}
                        setCountListInter={setCountListInter}
                        toggleModalProductos={toggleModalProductos}
                        productoSelectinternouno={productoSelectinternouno}
                        setproductoSelectinternouno={
                            setproductoSelectinternouno
                        }
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
                        setdevolucion_cantidad_salida={
                            setdevolucion_cantidad_salida
                        }
                        devolucion_motivo_salida={devolucion_motivo_salida}
                        setdevolucion_motivo_salida={
                            setdevolucion_motivo_salida
                        }
                        devolucion_ci_cajero={devolucion_ci_cajero}
                        setdevolucion_ci_cajero={setdevolucion_ci_cajero}
                        devolucion_ci_autorizo={devolucion_ci_autorizo}
                        setdevolucion_ci_autorizo={setdevolucion_ci_autorizo}
                        devolucion_dias_desdecompra={
                            devolucion_dias_desdecompra
                        }
                        setdevolucion_dias_desdecompra={
                            setdevolucion_dias_desdecompra
                        }
                        devolucion_ci_cliente={devolucion_ci_cliente}
                        setdevolucion_ci_cliente={setdevolucion_ci_cliente}
                        devolucion_telefono_cliente={
                            devolucion_telefono_cliente
                        }
                        setdevolucion_telefono_cliente={
                            setdevolucion_telefono_cliente
                        }
                        devolucion_nombre_cliente={devolucion_nombre_cliente}
                        setdevolucion_nombre_cliente={
                            setdevolucion_nombre_cliente
                        }
                        devolucion_nombre_cajero={devolucion_nombre_cajero}
                        setdevolucion_nombre_cajero={
                            setdevolucion_nombre_cajero
                        }
                        devolucion_nombre_autorizo={devolucion_nombre_autorizo}
                        setdevolucion_nombre_autorizo={
                            setdevolucion_nombre_autorizo
                        }
                        devolucion_trajo_factura={devolucion_trajo_factura}
                        setdevolucion_trajo_factura={
                            setdevolucion_trajo_factura
                        }
                        devolucion_motivonotrajofact={
                            devolucion_motivonotrajofact
                        }
                        setdevolucion_motivonotrajofact={
                            setdevolucion_motivonotrajofact
                        }
                        addCarritoRequestInterno={addCarritoRequestInterno}
                        getProductos={getProductos}
                        setView={setView}
                        pedidosFast={pedidosFast}
                        onClickEditPedido={onClickEditPedido}
                        pedidoData={pedidoData}
                        permisoExecuteEnter={permisoExecuteEnter}
                        user={user}
                        db={db}
                        notificar={notificar}
                        getPedido={getPedido}
                        togglereferenciapago={togglereferenciapago}
                        orderColumn={orderColumn}
                        setOrderColumn={setOrderColumn}
                        orderBy={orderBy}
                        setOrderBy={setOrderBy}
                    />
                </div>

                <div
                    className="col-lg-5 bg-zinc-100"
                    style={{
                        height: "100vh",
                        overflowY: "auto",
                        paddingLeft: "8px",
                    }}
                >
                    {id ? (
                        <>
                            <div className="relative mt-2">
                                <div
                                    className={`${
                                        estado == 1
                                            ? "bg-green-50 border-green-200"
                                            : estado == 2
                                            ? "bg-red-50 border-red-200"
                                            : "bg-blue-50 border-blue-200"
                                    } flex justify-between p-3 bg-white rounded border  mb-3`}
                                >
                                    <div className="flex items-center">
                                        <div className="mr-3">
                                            {estado == 1 ? (
                                                <i className="text-2xl text-green-500 fa fa-check-circle"></i>
                                            ) : estado == 2 ? (
                                                <i className="text-2xl text-red-500 fa fa-times-circle"></i>
                                            ) : (
                                                <i className="text-2xl text-blue-500 fa fa-clock-o"></i>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="mb-0 text-sm font-medium text-gray-800">
                                                Pedido #{id}
                                            </h4>
                                            <small className="text-xs text-gray-500">
                                                {created_at}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h5 className="mb-1 text-xs font-medium text-orange-600">
                                            Total a Pagar
                                        </h5>
                                        <h3 className="mb-0 text-lg font-bold text-gray-800">
                                            Ref {moneda(pedidoData.clean_total)}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 overflow-hidden bg-white border border-gray-200 rounded">
                                <table className="w-full text-xs table-fixed">
                                    <colgroup>
                                        <col className="!w-[60%]" />
                                        <col className="!w-[10%]" />
                                        <col className="!w-[10%]" />
                                        <col className="!w-[10%]" />
                                        {editable && <col className="!w-[10%]" />}
                                    </colgroup>
                                    <thead className="border-b border-gray-200 bg-gray-50">
                                        <tr>
                                            <th className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase">
                                                Producto
                                            </th>
                                            <th className="px-2 py-3 text-xs font-medium tracking-wider text-center text-gray-600 uppercase">
                                                Cant.
                                            </th>
                                            <th className="px-2 py-3 text-xs font-medium tracking-wider text-right text-gray-600 uppercase">
                                                Precio
                                            </th>
                                            {/*  <th className="px-2 py-3 text-xs font-medium tracking-wider text-right text-gray-600 uppercase">
                                                Subtotal
                                            </th> */}
                                            <th className="px-2 py-3 text-xs font-medium tracking-wider text-right text-gray-600 uppercase">
                                                Total
                                            </th>
                                            {editable && (
                                                <th className="px-2 py-3 text-xs font-medium tracking-wider text-center text-gray-600 uppercase">
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {items
                                            ? items.map((e, i) =>
                                                  e.abono && !e.producto ? (
                                                      <tr
                                                          key={e.id}
                                                          className="hover:bg-gray-50"
                                                      >
                                                          <td className="px-2 py-1 text-xs text-gray-600">
                                                              MOV
                                                          </td>
                                                          <td className="px-2 py-1 text-xs">
                                                              {e.abono}
                                                          </td>
                                                          <td className="px-2 py-1 text-xs text-center">
                                                              {e.cantidad}
                                                          </td>
                                                          <td className="px-2 py-1 text-xs text-right">
                                                              {e.monto}
                                                          </td>
                                                          <td
                                                              onClick={
                                                                  setDescuentoUnitario
                                                              }
                                                              data-index={e.id}
                                                              className="px-2 py-1 text-xs text-right cursor-pointer hover:bg-orange-50"
                                                          >
                                                              {e.descuento}
                                                          </td>
                                                          <td className="px-2 py-1 text-xs text-right">
                                                              {e.total_des}
                                                          </td>
                                                          <td className="px-2 py-1 text-xs font-bold text-right">
                                                              {e.total}
                                                          </td>
                                                      </tr>
                                                  ) : (
                                                      <tr
                                                          key={e.id}
                                                          title={showTittlePrice(
                                                              e.producto.precio,
                                                              e.total
                                                          )}
                                                          className="hover:bg-gray-50"
                                                      >
                                                          <td className="px-2 py-1">
                                                              <div className="flex items-center space-x-2">
                                                                  {ifnegative ? (
                                                                      <>
                                                                          {e.condicion ==
                                                                          1 ? (
                                                                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                                                                                  Garantía
                                                                              </span>
                                                                          ) : null}
                                                                          {e.condicion ==
                                                                              2 ||
                                                                          e.condicion ==
                                                                              0 ? (
                                                                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                                                                  Cambio
                                                                              </span>
                                                                          ) : null}
                                                                      </>
                                                                  ) : null}
                                                                  <span
                                                                      className="text-xs cursor-pointer"
                                                                      data-id={
                                                                          e.id
                                                                      }
                                                                  >
                                                                      <div className="font-mono text-gray-600">
                                                                          {
                                                                              e
                                                                                  .producto
                                                                                  .codigo_barras
                                                                          }
                                                                      </div>
                                                                      <div
                                                                          className="font-medium text-gray-900 "
                                                                          title={
                                                                              e
                                                                                  .producto
                                                                                  .descripcion
                                                                          }
                                                                      >
                                                                          {
                                                                              e
                                                                                  .producto
                                                                                  .descripcion
                                                                          }
                                                                      </div>
                                                                  </span>
                                                                  {/*  {e.entregado ? (
                                                                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                                                                          Entregado
                                                                      </span>
                                                                  ) : null} */}
                                                              </div>
                                                          </td>
                                                          <td
                                                              className="px-2 py-1 text-center cursor-pointer"
                                                              onClick={
                                                                  e.condicion ==
                                                                  1
                                                                      ? null
                                                                      : setCantidadCarrito
                                                              }
                                                              data-index={e.id}
                                                          >
                                                              <div className="flex items-center justify-center space-x-1">
                                                                  {ifnegative ? (
                                                                      e.cantidad <
                                                                      0 ? (
                                                                          <span className="px-1 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                                                                              <i className="fa fa-arrow-down"></i>
                                                                          </span>
                                                                      ) : (
                                                                          <span className="px-1 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                                                                              <i className="fa fa-arrow-up"></i>
                                                                          </span>
                                                                      )
                                                                  ) : null}
                                                                  <span className="text-xs">
                                                                      {Number(
                                                                          e.cantidad
                                                                      ) %
                                                                          1 ===
                                                                      0
                                                                          ? Number(
                                                                                e.cantidad
                                                                            )
                                                                          : Number(
                                                                                e.cantidad
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                  </span>
                                                              </div>
                                                          </td>
                                                          {e.producto
                                                              .precio1 ? (
                                                              <td
                                                                  className="px-2 py-1 text-xs text-right text-green-600 cursor-pointer"
                                                                  data-iditem={
                                                                      e.id
                                                                  }
                                                                  onClick={
                                                                      setPrecioAlternoCarrito
                                                                  }
                                                              >
                                                                  {
                                                                      e.producto
                                                                          .precio
                                                                  }
                                                              </td>
                                                          ) : (
                                                              <td className="px-2 py-1 text-xs text-right cursor-pointer">
                                                                  {moneda(
                                                                      e.producto
                                                                          .precio
                                                                  )}
                                                              </td>
                                                          )}
                                                          {/*   <td
                                                              onClick={
                                                                  setDescuentoUnitario
                                                              }
                                                              data-index={e.id}
                                                              className="px-2 py-1 text-xs text-right cursor-pointer hover:bg-orange-50"
                                                          >
                                                              {e.subtotal}
                                                          </td> */}
                                                          <td className="px-2 py-1 text-xs font-bold text-right">
                                                              {e.total}
                                                          </td>
                                                          {editable ? (
                                                              <td className="px-2 py-1 text-center">
                                                                  <i
                                                                      onClick={
                                                                          delItemPedido
                                                                      }
                                                                      data-index={
                                                                          e.id
                                                                      }
                                                                      className="text-red-500 cursor-pointer fa fa-times hover:text-red-700"
                                                                  ></i>
                                                              </td>
                                                          ) : null}
                                                      </tr>
                                                  )
                                              )
                                            : null}
                                        <tr className="table-secondary">
                                            <td>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onDoubleClick={() =>
                                                        setshowXBulto(true)
                                                    }
                                                >
                                                    {items
                                                        ? items.length
                                                        : null}
                                                </button>
                                            </td>
                                            <th
                                                colSpan={auth(1) ? "8" : "7"}
                                                className="p-2"
                                            >
                                                {cliente
                                                    ? cliente.nombre
                                                    : null}{" "}
                                                <b>
                                                    {cliente
                                                        ? cliente.identificacion
                                                        : null}
                                                </b>
                                            </th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mb-3">
                                <div className="grid grid-cols-2 gap-2">
                                    
                                        <>
                                            <div
                                                className={`border rounded p-2 ${
                                                    debito != ""
                                                        ? "bg-green-50 border-green-200"
                                                        : "bg-gray-50 border-gray-200"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div
                                                        className="flex items-center text-xs font-medium cursor-pointer"
                                                        onClick={getDebito}
                                                    >
                                                        <i className="mr-1 text-orange-500 fa fa-credit-card"></i>{" "}
                                                        Débito
                                                    </div>
                                                    <span
                                                        className="cursor-pointer"
                                                        data-type="toggle"
                                                        onClick={() => {
                                                            // Determinar qué tipo de pago está activo y su monto
                                                            let montoActivo =
                                                                transferencia;
                                                            let tipoActivo =
                                                                "1"; // Transferencia por defecto

                                                            if (
                                                                debito &&
                                                                debito > 0
                                                            ) {
                                                                montoActivo =
                                                                    debito;
                                                                tipoActivo =
                                                                    "2"; // Débito
                                                            } else if (
                                                                efectivo &&
                                                                efectivo > 0
                                                            ) {
                                                                montoActivo =
                                                                    efectivo;
                                                                tipoActivo =
                                                                    "3"; // Efectivo
                                                            } else if (
                                                                credito &&
                                                                credito > 0
                                                            ) {
                                                                montoActivo =
                                                                    credito;
                                                                tipoActivo =
                                                                    "4"; // Crédito
                                                            } else if (
                                                                biopago &&
                                                                biopago > 0
                                                            ) {
                                                                montoActivo =
                                                                    biopago;
                                                                tipoActivo =
                                                                    "5"; // Biopago
                                                            }

                                                            addRefPago(
                                                                "toggle",
                                                                montoActivo,
                                                                tipoActivo
                                                            );
                                                        }}
                                                    >
                                                        <i className="text-xs text-orange-500 fa fa-plus-circle"></i>
                                                    </span>
                                                </div>
                                                <div className="flex">
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                                                        value={debito}
                                                        onChange={(e) =>
                                                            syncPago(
                                                                e.target.value,
                                                                "Debito"
                                                            )
                                                        }
                                                        placeholder="D"
                                                    />
                                                    <span
                                                        className="px-2 py-1 text-xs text-white bg-orange-500 rounded-r hover:bg-orange-600"
                                                        onClick={() =>
                                                            setPagoInBs(
                                                                (val) => {
                                                                    syncPago(
                                                                        val,
                                                                        "Debito"
                                                                    );
                                                                }
                                                            )
                                                        }
                                                    >
                                                        Bs
                                                    </span>
                                                </div>
                                                {debito != "" && (
                                                    <div className="mt-1 text-sm font-bold text-orange-600">
                                                        {debitoBs("debito")}
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className={`border rounded p-2 ${
                                                    efectivo != ""
                                                        ? "bg-green-50 border-green-200"
                                                        : "bg-gray-50 border-gray-200"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div
                                                        className="flex items-center text-xs font-medium cursor-pointer"
                                                        onClick={getEfectivo}
                                                    >
                                                        <i className="mr-1 text-green-500 fa fa-money"></i>{" "}
                                                        Efectivo
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                                                        value={efectivo}
                                                        onChange={(e) =>
                                                            syncPago(
                                                                e.target.value,
                                                                "Efectivo"
                                                            )
                                                        }
                                                        placeholder="E"
                                                    />
                                                    <span
                                                        className="px-2 py-1 text-xs text-white bg-green-500 rounded-r hover:bg-green-600"
                                                        onClick={() =>
                                                            setPagoInBs(
                                                                (val) => {
                                                                    syncPago(
                                                                        val,
                                                                        "Efectivo"
                                                                    );
                                                                }
                                                            )
                                                        }
                                                    >
                                                        Bs
                                                    </span>
                                                </div>
                                                {efectivo != "" && (
                                                    <div className="mt-1 text-sm font-bold text-green-600">
                                                        {debitoBs("efectivo")}
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className={`border rounded p-2 ${
                                                    transferencia != ""
                                                        ? "bg-green-50 border-green-200"
                                                        : "bg-gray-50 border-gray-200"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div
                                                        className="flex items-center text-xs font-medium cursor-pointer"
                                                        onClick={
                                                            getTransferencia
                                                        }
                                                    >
                                                        <i className="mr-1 text-blue-500 fa fa-exchange"></i>{" "}
                                                        Transferencia
                                                    </div>
                                                    <span
                                                        className="cursor-pointer"
                                                        data-type="toggle"
                                                        onClick={() =>
                                                            addRefPago(
                                                                "toggle",
                                                                transferencia,
                                                                "1"
                                                            )
                                                        }
                                                    >
                                                        <i className="text-xs text-blue-500 fa fa-plus-circle"></i>
                                                    </span>
                                                </div>
                                                <div className="flex">
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                                                        value={transferencia}
                                                        onChange={(e) =>
                                                            syncPago(
                                                                e.target.value,
                                                                "Transferencia"
                                                            )
                                                        }
                                                        placeholder="T"
                                                    />
                                                    <span
                                                        className="px-2 py-1 text-xs text-white bg-blue-500 rounded-r hover:bg-blue-600"
                                                        onClick={() =>
                                                            setPagoInBs(
                                                                (val) => {
                                                                    syncPago(
                                                                        val,
                                                                        "Transferencia"
                                                                    );
                                                                }
                                                            )
                                                        }
                                                    >
                                                        Bs
                                                    </span>
                                                </div>
                                                {transferencia != "" && (
                                                    <div className="mt-1 text-sm font-bold text-blue-600">
                                                        {debitoBs(
                                                            "transferencia"
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className={`border rounded p-2 ${
                                                    biopago != ""
                                                        ? "bg-green-50 border-green-200"
                                                        : "bg-gray-50 border-gray-200"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div
                                                        className="flex items-center text-xs font-medium cursor-pointer"
                                                        onClick={getBio}
                                                    >
                                                        <i className="mr-1 text-purple-500 fa fa-mobile"></i>{" "}
                                                        Biopago
                                                    </div>
                                                    <span
                                                        className="cursor-pointer"
                                                        data-type="toggle"
                                                        onClick={() =>
                                                            addRefPago(
                                                                "toggle",
                                                                biopago,
                                                                "5"
                                                            )
                                                        }
                                                    >
                                                        <i className="text-xs text-purple-500 fa fa-plus-circle"></i>
                                                    </span>
                                                </div>
                                                <div className="flex">
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                                                        value={biopago}
                                                        onChange={(e) =>
                                                            syncPago(
                                                                e.target.value,
                                                                "Biopago"
                                                            )
                                                        }
                                                        placeholder="B"
                                                    />
                                                    <span
                                                        className="px-2 py-1 text-xs text-white bg-purple-500 rounded-r hover:bg-purple-600"
                                                        onClick={() =>
                                                            setPagoInBs(
                                                                (val) => {
                                                                    syncPago(
                                                                        val,
                                                                        "Biopago"
                                                                    );
                                                                }
                                                            )
                                                        }
                                                    >
                                                        Bs
                                                    </span>
                                                </div>
                                                {biopago != "" && (
                                                    <div className="mt-1 text-sm font-bold text-purple-600">
                                                        {debitoBs("biopago")}
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className={`border rounded p-2 ${
                                                    credito != ""
                                                        ? "bg-green-50 border-green-200"
                                                        : "bg-gray-50 border-gray-200"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div
                                                        className="flex items-center text-xs font-medium cursor-pointer"
                                                        onClick={getCredito}
                                                    >
                                                        <i className="mr-1 text-yellow-500 fa fa-calendar"></i>{" "}
                                                        Crédito
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <input
                                                        type="text"
                                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                                                        value={credito}
                                                        onChange={(e) =>
                                                            syncPago(
                                                                e.target.value,
                                                                "Credito"
                                                            )
                                                        }
                                                        placeholder="C"
                                                    />
                                                </div>
                                                {credito != "" && (
                                                    <div className="mt-1 text-sm font-bold text-yellow-600">
                                                        {credito}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-center">
                                                {autoCorrector ? (
                                                    <button
                                                        className="px-3 py-1 text-xs text-green-600 border border-green-500 rounded hover:bg-green-50"
                                                        onClick={() =>
                                                            setautoCorrector(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        Auto resta On
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="px-3 py-1 text-xs text-red-600 border border-red-500 rounded hover:bg-red-50"
                                                        onClick={() =>
                                                            setautoCorrector(
                                                                true
                                                            )
                                                        }
                                                    >
                                                        Auto resta Off
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    
                                </div>
                            </div>

                            <div className="p-3 mb-3 bg-white border border-orange-400 rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-600">
                                        Total a Pagar
                                    </span>
                                    <span
                                        data-index={id}
                                        onClick={setDescuentoTotal}
                                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-800 transition-all duration-200 bg-orange-100 border border-orange-200 rounded-full cursor-pointer hover:bg-orange-200 hover:border-orange-300"
                                    >
                                        <i className="mr-1 text-xs fa fa-percentage"></i>
                                        {total_porciento}%
                                    </span>
                                </div>
                                <div className="flex items-start justify-between mt-4">
                                    <span className="text-2xl font-bold text-green-500">
                                        Ref {total}
                                    </span>
                                    <span className="text-2xl font-bold text-orange-500">
                                        Bs{" "}
                                        {moneda(
                                            dolar * pedidoData.clean_total
                                        ) ?? 0}
                                    </span>
                                </div>
                                {user.sucursal == "elorza" && (
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">
                                            COP{" "}
                                            <span
                                                data-type="cop"
                                                className="font-bold text-gray-600 cursor-pointer"
                                            >
                                                {cop}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {pedidoData.clean_total < 0 ? (
                                    <div className="p-2 mt-3 text-xs border border-yellow-200 rounded bg-yellow-50">
                                        <i className="mr-2 text-yellow-600 fa fa-exclamation-triangle"></i>
                                        <span className="text-yellow-800">
                                            Debemos pagarle diferencia al
                                            cliente
                                        </span>
                                    </div>
                                ) : null}
                            </div>

                            <div className="mb-3 bg-white border border-gray-200 rounded">
                                <div className="px-3 py-2 border-b bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() =>
                                                setShowVueltosSection(
                                                    !showVueltosSection
                                                )
                                            }
                                            className="flex items-center text-xs font-medium text-gray-700 transition-colors hover:text-orange-600"
                                        >
                                            <i
                                                className={`mr-2 text-xs fa fa-chevron-${
                                                    showVueltosSection
                                                        ? "down"
                                                        : "right"
                                                } transition-transform`}
                                            ></i>
                                            Cálculo de Vueltos
                                        </button>
                                        {showVueltosSection && (
                                            <div className="flex space-x-1">
                                                <button
                                                    className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                                    onClick={() =>
                                                        setVueltodolar()
                                                    }
                                                >
                                                    $
                                                </button>
                                                <button
                                                    className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                                    onClick={() =>
                                                        setVueltobs()
                                                    }
                                                >
                                                    BS
                                                </button>
                                                <button
                                                    className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                                    onClick={() =>
                                                        setVueltocop()
                                                    }
                                                >
                                                    COP
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {showVueltosSection && (
                                    <div className="p-3">
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="flex">
                                                    <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 border border-r-0 border-gray-300 rounded-l">
                                                        $
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-r focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                                                        value={recibido_dolar}
                                                        onChange={(e) =>
                                                            changeRecibido(
                                                                e.target.value,
                                                                "recibido_dolar"
                                                            )
                                                        }
                                                        placeholder="$"
                                                    />
                                                </div>
                                                <div className="flex">
                                                    <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 border border-r-0 border-gray-300 rounded-l">
                                                        BS
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-r focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                                                        value={recibido_bs}
                                                        onChange={(e) =>
                                                            changeRecibido(
                                                                e.target.value,
                                                                "recibido_bs"
                                                            )
                                                        }
                                                        placeholder="BS"
                                                    />
                                                </div>
                                                <div className="flex">
                                                    <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 border border-r-0 border-gray-300 rounded-l">
                                                        COP
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-r focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                                                        value={recibido_cop}
                                                        onChange={(e) =>
                                                            changeRecibido(
                                                                e.target.value,
                                                                "recibido_cop"
                                                            )
                                                        }
                                                        placeholder="COP"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="flex">
                                                    <span
                                                        className="px-2 py-1 text-xs text-orange-600 bg-orange-100 border border-r-0 border-orange-300 rounded-l cursor-pointer"
                                                        onClick={setVueltodolar}
                                                    >
                                                        $
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-2 py-1 text-xs border border-orange-300 rounded-r focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                                                        value={cambio_dolar}
                                                        onChange={(e) =>
                                                            syncCambio(
                                                                e.target.value,
                                                                "Dolar"
                                                            )
                                                        }
                                                        placeholder="$"
                                                    />
                                                </div>
                                                <div className="flex">
                                                    <span
                                                        className="px-2 py-1 text-xs text-orange-600 bg-orange-100 border border-r-0 border-orange-300 rounded-l cursor-pointer"
                                                        onClick={setVueltobs}
                                                    >
                                                        BS
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-2 py-1 text-xs border border-orange-300 rounded-r focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                                                        value={cambio_bs}
                                                        onChange={(e) =>
                                                            syncCambio(
                                                                e.target.value,
                                                                "Bolivares"
                                                            )
                                                        }
                                                        placeholder="BS"
                                                    />
                                                </div>
                                                <div className="flex">
                                                    <span
                                                        className="px-2 py-1 text-xs text-orange-600 bg-orange-100 border border-r-0 border-orange-300 rounded-l cursor-pointer"
                                                        onClick={setVueltocop}
                                                    >
                                                        COP
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-2 py-1 text-xs border border-orange-300 rounded-r focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                                                        value={cambio_cop}
                                                        onChange={(e) =>
                                                            syncCambio(
                                                                e.target.value,
                                                                "Pesos"
                                                            )
                                                        }
                                                        placeholder="COP"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                <div className="flex items-center">
                                                    <small className="mr-2 text-xs text-gray-500">
                                                        Recibido:
                                                    </small>
                                                    <span className="text-xs font-bold text-green-600">
                                                        {recibido_tot}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <small className="mr-2 text-xs text-gray-500">
                                                        Vuelto:
                                                    </small>
                                                    <span className="text-xs font-bold text-green-600">
                                                        {sumCambio()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {refPago && refPago.length > 0 && (
                                <div className="mb-3 bg-white border border-gray-200 rounded-lg ">
                                    <div className="px-3 py-2 border-b border-orange-100 bg-orange-50">
                                        <div className="flex items-center justify-between">
                                            <h6 className="flex items-center text-sm font-medium text-gray-800">
                                                <i className="mr-2 text-xs text-orange-500 fa fa-credit-card"></i>
                                                Referencias Bancarias
                                            </h6>
                                            <button
                                                className="px-2 py-1 text-xs font-medium text-orange-600 transition-colors bg-white border border-orange-200 rounded hover:bg-orange-50"
                                                onClick={addRetencionesPago}
                                            >
                                                <i className="mr-1 fa fa-plus"></i>
                                                Retención
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-2 space-y-2">
                                        {refPago.map((e) => (
                                            <div
                                                key={e.id}
                                                className={`relative bg-white border rounded-lg p-1.5 transition-all duration-200 ${
                                                    validatingRef === e.id
                                                        ? "border-blue-300 bg-blue-50 "
                                                        : "border-gray-200 hover:border-gray-300 hover:"
                                                }`}
                                            >
                                                {/* Loader overlay */}
                                                {validatingRef === e.id && (
                                                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-blue-50/80 backdrop-blur-sm">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-4 h-4 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                                            <span className="text-xs font-medium text-blue-700">
                                                                Validando...
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between gap-3">
                                                    {/* Info de la referencia */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            {/* Detalles de la referencia */}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-gray-900 truncate">
                                                                    {e.descripcion
                                                                        ? `#${e.descripcion}`
                                                                        : "Sin referencia"}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    CI:{" "}
                                                                    {e.cedula}
                                                                </p>
                                                            </div>

                                                            {/* Monto como badge a la derecha */}
                                                            {(e.tipo == 1 &&
                                                                e.monto != 0) ||
                                                            (e.tipo == 2 &&
                                                                e.monto != 0) ||
                                                            (e.tipo == 5 &&
                                                                e.monto !=
                                                                    0) ? (
                                                                <div className="ml-3">
                                                                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                                                                        {e.tipo ==
                                                                            1 &&
                                                                            "T. "}
                                                                        {e.tipo ==
                                                                            2 &&
                                                                            "D. "}
                                                                        {e.tipo ==
                                                                            5 &&
                                                                            "B. "}
                                                                        {moneda(
                                                                            e.monto
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    {/* Estado y acciones */}
                                                    <div className="flex items-center gap-2">
                                                        {/* Estado */}
                                                        {e.estatus ===
                                                        "aprobada" ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded">
                                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                                                                Aprobada
                                                            </span>
                                                        ) : e.estatus ===
                                                          "rechazada" ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded">
                                                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></div>
                                                                Rechazada
                                                            </span>
                                                        ) : e.estatus ===
                                                          "pendiente" ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded">
                                                                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-1.5"></div>
                                                                Pendiente
                                                            </span>
                                                        ) : e.estatus ===
                                                          "error" ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded">
                                                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></div>
                                                                Error
                                                            </span>
                                                        ) : // Fallback para referencias sin estatus
                                                        !e.descripcion ||
                                                          e.descripcion.trim() ===
                                                              "" ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
                                                                Sin validar
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded">
                                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                                                                Validada
                                                            </span>
                                                        )}

                                                        {/* Botones de acción */}
                                                        <div className="flex items-center gap-1">
                                                            {(e.estatus ===
                                                                "pendiente" ||
                                                                e.estatus ===
                                                                    "error" ||
                                                                !e.descripcion ||
                                                                e.descripcion.trim() ===
                                                                    "") && (
                                                                <button
                                                                    className="flex items-center justify-center w-6 h-6 text-blue-600 transition-colors bg-blue-100 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    onClick={() =>
                                                                        sendRefToMerchant(
                                                                            e.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        validatingRef ===
                                                                        e.id
                                                                    }
                                                                    title={
                                                                        e.estatus ===
                                                                        "error"
                                                                            ? "Reintentar Validación"
                                                                            : "Validar Referencia"
                                                                    }
                                                                >
                                                                    <i
                                                                        className={`text-xs fa ${
                                                                            e.estatus ===
                                                                            "error"
                                                                                ? "fa-refresh"
                                                                                : "fa-paper-plane"
                                                                        }`}
                                                                    ></i>
                                                                </button>
                                                            )}
                                                            <button
                                                                className="flex items-center justify-center w-6 h-6 text-red-600 transition-colors bg-red-100 rounded hover:bg-red-200"
                                                                data-id={e.id}
                                                                onClick={
                                                                    delRefPago
                                                                }
                                                                title="Eliminar"
                                                            >
                                                                <i className="text-xs fa fa-times"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {retenciones &&
                                            retenciones.length > 0 &&
                                            retenciones.map((retencion) => (
                                                <div
                                                    key={retencion.id}
                                                    className="flex items-center justify-between px-3 py-2 bg-orange-50 hover:bg-orange-100"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span className="px-2 py-0.5 text-xs font-medium bg-orange-200 text-orange-800 rounded">
                                                            Retención
                                                        </span>
                                                        <span className="text-sm text-gray-700">
                                                            {
                                                                retencion.descripcion
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">
                                                            -
                                                            {moneda(
                                                                retencion.monto
                                                            )}
                                                        </span>
                                                        <button
                                                            className="p-1 text-red-500 transition-colors rounded hover:bg-red-50"
                                                            onClick={() =>
                                                                delRetencionPago(
                                                                    retencion.id
                                                                )
                                                            }
                                                            title="Eliminar"
                                                        >
                                                            <i className="text-xs fa fa-times"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-3">
                                <div className="flex gap-2">
                                    <div className="flex items-center flex-1 px-2 py-1 bg-white border border-gray-200 rounded">
                                        <i className="mr-1 text-xs text-orange-500 fa fa-coins"></i>
                                        <select
                                            className="flex-1 text-xs text-gray-700 bg-transparent border-none focus:outline-none"
                                            value={monedaToPrint}
                                            onChange={(e) =>
                                                setmonedaToPrint(e.target.value)
                                            }
                                        >
                                            <option value="bs">BS</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center flex-1 px-2 py-1 bg-white border border-gray-200 rounded">
                                        <i className="mr-1 text-xs text-orange-500 fa fa-print"></i>
                                        <select
                                            className="flex-1 text-xs text-gray-700 bg-transparent border-none focus:outline-none"
                                            value={selectprinter}
                                            onChange={(e) =>
                                                setselectprinter(e.target.value)
                                            }
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option
                                                    key={i + 1}
                                                    value={i + 1}
                                                >
                                                    C{i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {auth(1) && (
                                <div className="mb-3 bg-white border border-gray-200 rounded">
                                    <div className="px-3 py-2 border-b bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() =>
                                                    setShowTransferirSection(
                                                        !showTransferirSection
                                                    )
                                                }
                                                className="flex items-center text-xs font-medium text-gray-700 transition-colors hover:text-blue-600"
                                            >
                                                <i
                                                    className={`mr-2 text-xs fa fa-chevron-${
                                                        showTransferirSection
                                                            ? "down"
                                                            : "right"
                                                    } transition-transform`}
                                                ></i>
                                                Transferir a Sucursal
                                            </button>
                                        </div>
                                    </div>
                                    {showTransferirSection && (
                                        <div className="p-3">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="px-3 py-2 text-blue-600 transition-colors border border-blue-200 rounded bg-blue-50 hover:bg-blue-100"
                                                    onClick={getSucursales}
                                                    title="Buscar sucursales"
                                                >
                                                    <i className="text-xs fa fa-search"></i>
                                                </button>
                                                <select
                                                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                    value={transferirpedidoa}
                                                    onChange={(e) =>
                                                        settransferirpedidoa(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Seleccionar Sucursal
                                                    </option>
                                                    {sucursalesCentral.map(
                                                        (e) => (
                                                            <option
                                                                key={e.id}
                                                                value={e.id}
                                                            >
                                                                {e.nombre}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <button
                                                    className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
                                                    onClick={setexportpedido}
                                                    disabled={
                                                        !transferirpedidoa
                                                    }
                                                >
                                                    <i className="mr-1 fa fa-paper-plane"></i>
                                                    Transferir
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Menú Flotante Responsive con Scroll Detection */}
                            {showHeaderAndMenu && (
                                <div
                                    className={`fixed z-50 transform -translate-x-1/2 bottom-2 left-1/2 transition-all duration-300 ${
                                        showFloatingMenu
                                            ? "translate-y-0 opacity-100"
                                            : "translate-y-full opacity-0 pointer-events-none"
                                    }`}
                                >
                                    <div className="px-4 py-2 border border-gray-200 rounded-full shadow-lg bg-white/90 backdrop-blur-sm">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Botones Principales */}
                                            {editable ? (
                                                <>
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-green-500 rounded-full hover:bg-green-600"
                                                        onClick={
                                                            facturar_pedido
                                                        }
                                                        title="Facturar e Imprimir (Enter)"
                                                    >
                                                        <i className="text-xs fa fa-paper-plane"></i>
                                                    </button>
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
                                                        onClick={
                                                            facturar_e_imprimir
                                                        }
                                                        title="Solo Facturar"
                                                    >
                                                        <i className="text-xs fa fa-paper-plane"></i>
                                                    </button>

                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-orange-500 rounded-full hover:bg-orange-600"
                                                        onClick={() =>
                                                            setToggleAddPersona(
                                                                true
                                                            )
                                                        }
                                                        title="Cliente (F2)"
                                                    >
                                                        <i className="text-xs fa fa-user"></i>
                                                    </button>
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-purple-500 rounded-full hover:bg-purple-600"
                                                        onClick={() =>
                                                            toggleImprimirTicket()
                                                        }
                                                        title="Imprimir (F3)"
                                                    >
                                                        <i className="text-xs fa fa-print"></i>
                                                    </button>
                                                </>
                                            ) : null}

                                            {/* Botones Secundarios */}
                                            <button
                                                className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-indigo-500 rounded-full hover:bg-indigo-600"
                                                onClick={() =>
                                                    viewReportPedido()
                                                }
                                                title="Ver Pedido (F4)"
                                            >
                                                <i className="text-xs fa fa-eye"></i>
                                            </button>

                                            {editable && (
                                                <>
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-gray-700 rounded-full hover:bg-gray-800"
                                                        onClick={() =>
                                                            sendReciboFiscal()
                                                        }
                                                        title="Recibo Fiscal"
                                                    >
                                                        <i className="text-xs fa fa-file-text"></i>
                                                    </button>
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-yellow-500 rounded-full hover:bg-yellow-600"
                                                        onClick={() =>
                                                            printBultos()
                                                        }
                                                        title="Imprimir Bultos"
                                                    >
                                                        <i className="text-xs fa fa-print"></i>
                                                    </button>
                                                </>
                                            )}

                                            {/* Nota de Crédito */}
                                            {pedidoData.fiscal == 1 && (
                                                <button
                                                    className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-red-600 rounded-full hover:bg-red-700"
                                                    title="Nota de Crédito"
                                                    onClick={() =>
                                                        sendNotaCredito()
                                                    }
                                                >
                                                    <i className="text-xs fa fa-undo"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        // Empty State
                        <div
                            className="p-5 text-center d-flex flex-column align-items-center justify-content-center"
                            style={{ height: "100%" }}
                        >
                            <div className="mb-4">
                                <div
                                    className="mb-3 bg-light rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: "120px", height: "120px" }}
                                >
                                    <i
                                        className="fa fa-shopping-cart text-muted"
                                        style={{ fontSize: "3.5rem" }}
                                    ></i>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="mb-2 text-muted fw-normal">
                                    Ningún pedido seleccionado
                                </h3>
                                <p
                                    className="mb-0 text-muted"
                                    style={{
                                        maxWidth: "300px",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    Selecciona un pedido de la lista lateral
                                    para ver los detalles de pago y procesar la
                                    facturación.
                                </p>
                            </div>

                            <div className="gap-2 d-flex flex-column">
                                <div className="d-flex align-items-center text-muted small">
                                    <i className="fa fa-lightbulb-o me-2 text-warning"></i>
                                    <span>
                                        Haz clic en cualquier pedido para
                                        comenzar
                                    </span>
                                </div>
                                <div className="d-flex align-items-center text-muted small">
                                    <i className="fa fa-keyboard-o me-2 text-info"></i>
                                    <span>
                                        Usa F2, F3, F4 para acciones rápidas
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Código de Aprobación */}
            {showCodigoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Código de Aprobación
                                </h3>
                                <button
                                    onClick={cerrarModalCodigo}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="bg-gray-100 p-4 rounded-lg text-center mb-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Código generado:
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600 font-mono">
                                        {codigoGenerado}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Solo una persona autorizada puede
                                        descifrar este código
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ingrese la clave de aprobación:
                                    </label>
                                    <input
                                        type="password"
                                        value={claveIngresada}
                                        onChange={(e) =>
                                            setClaveIngresada(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ingrese la clave"
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                validarCodigo();
                                            }
                                        }}
                                        autoFocus
                                    />
                                </div>

                                <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                                    <p className="font-medium text-yellow-800 mb-1">
                                        Instrucciones:
                                    </p>
                                    <p>
                                        La persona autorizada debe generar la
                                        clave correcta basándose en el código
                                        mostrado arriba.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={cerrarModalCodigo}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={validarCodigo}
                                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!claveIngresada.trim()}
                                >
                                    Validar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ) : null;
}
