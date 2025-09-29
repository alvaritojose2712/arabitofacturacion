import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ProductosList from "../components/productoslist";

export default function PresupuestoMain({
    user,
    productos,
    moneda,
    inputbusquedaProductosref,
    presupuestocarrito,
    getProductos,
    showOptionQMain,
    setshowOptionQMain,
    num,
    setNum,
    itemCero,
    setpresupuestocarrito,
    toggleImprimirTicket,
    delitempresupuestocarrito,
    sumsubtotalespresupuesto,
    auth,
    addCarrito,
    clickSetOrderColumn,
    orderColumn,
    orderBy,
    counterListProductos,
    setCounterListProductos,
    tbodyproductosref,
    focusCtMain,
    selectProductoFast,
    setpresupuestocarritotopedido,
    openBarcodeScan,
    number,
    dolar
}) {
    // Estado para mostrar/ocultar menú flotante
    const [showFloatingMenu, setShowFloatingMenu] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showHeaderAndMenu, setShowHeaderAndMenu] = useState(true);

    // Efecto para control de scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setShowFloatingMenu(false);
            } else {
                // Scrolling up
                setShowFloatingMenu(true);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    // Hotkeys para navegación de productos
    useHotkeys(
        "down",
        () => {
            let index = counterListProductos + 1;
            if (tbodyproductosref) {
                if (tbodyproductosref.current) {
                    if (tbodyproductosref.current.rows[index]) {
                        setCounterListProductos(index);
                        tbodyproductosref.current.rows[index].focus();
                    }
                }
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
        },
        []
    );

    useHotkeys(
        "up",
        () => {
            if (counterListProductos > 0) {
                let index = counterListProductos - 1;
                if (tbodyproductosref) {
                    if (tbodyproductosref.current) {
                        if (tbodyproductosref.current.rows[index]) {
                            tbodyproductosref.current.rows[index].focus();
                            setCounterListProductos(index);
                        }
                    }
                }
            }
        },
        {
            enableOnTags: ["INPUT", "SELECT"],
        },
        []
    );

    // Función para mostrar título con precios en Bs
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

    return (
        <div className="container-fluid" style={{ minHeight: "100vh" }}>
            <div className="row h-100">
                {/* Lado izquierdo - Lista de productos */}
                <div
                    className="col-lg-7"
                    style={{
                        height: "100vh",
                        overflowY: "auto",
                        paddingRight: "8px",
                    }}
                >
                    <div className="d-flex justify-content-center mt-3">
                        <div className="mb-4 input-group">
                            {/* {showOptionQMain ? (
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
                                    <span className="input-group-text pointer">
                                        En cero: {itemCero ? "Sí" : "No"}
                                    </span>
                                </>
                            ) : (
                                <span
                                    className="input-group-text pointer text-dark"
                                    onClick={() => setshowOptionQMain(true)}
                                >
                                    <i className="fa fa-arrow-left"></i>
                                </span>
                            )} */}
                            <input
                                type="text"
                                className="form-control fs-2"
                                ref={inputbusquedaProductosref}
                                placeholder="Buscar productos para presupuesto... Presiona (ESC)"
                                onChange={(e) => getProductos(e.target.value)}
                            />
                           {/*  <span 
                                className="input-group-text text-dark" 
                                onClick={() => openBarcodeScan("inputbusquedaProductosref")}
                            >
                                <i className="fas fa-barcode"></i>
                            </span> */}
                        </div>
                    </div>
                    
                    <ProductosList
                        user={user}
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
                </div>

                {/* Lado derecho - Carrito de presupuesto */}
                <div
                    className="col-lg-5 bg-zinc-100"
                    style={{
                        height: "100vh",
                        overflowY: "auto",
                        paddingLeft: "8px",
                    }}
                >
                    {presupuestocarrito.length ? (
                        <>
                            <div className="relative mt-2">
                                <div className="flex justify-between p-3 bg-blue-50 border border-blue-200 rounded mb-3">
                                    <div className="flex items-center">
                                        <div className="mr-3">
                                            <i className="text-2xl text-blue-500 fa fa-file-text-o"></i>
                                        </div>
                                        <div>
                                            <h4 className="mb-0 text-sm font-medium text-gray-800">
                                                Presupuesto
                                            </h4>
                                            <small className="text-xs text-gray-500">
                                                {new Date().toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h5 className="mb-1 text-xs font-medium text-orange-600">
                                            Total Estimado
                                        </h5>
                                        <h3 className="mb-0 text-lg font-bold text-gray-800">
                                            Ref {sumsubtotalespresupuesto()}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 overflow-hidden bg-white border border-gray-200 rounded">
                                <table className="w-full text-xs table-fixed">
                                    <colgroup>
                                        <col className="!w-[60%]" />
                                        <col className="!w-[10%]" />
                                        <col className="!w-[15%]" />
                                        <col className="!w-[15%]" />
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
                                            <th className="px-2 py-3 text-xs font-medium tracking-wider text-right text-gray-600 uppercase">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {presupuestocarrito.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() => delitempresupuestocarrito(index)}
                                                title={showTittlePrice(item.precio, item.subtotal)}
                                            >
                                                <td className="px-2 py-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs">
                                                            <div className="font-mono text-gray-600">
                                                                {item.codigo_barras || 'N/A'}
                                                            </div>
                                                            <div className="font-medium text-gray-900" title={item.descripcion}>
                                                                {item.descripcion}
                                                            </div>
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-1 text-center">
                                                    <span className="text-xs font-medium">
                                                        {item.cantidad}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-1 text-right">
                                                    <span className="text-xs font-medium">
                                                        {moneda(item.precio)}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-1 text-right">
                                                    <span className="text-xs font-bold text-blue-600">
                                                        {moneda(item.subtotal)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Resumen del presupuesto */}
                            <div className="mb-3 overflow-hidden bg-white border border-gray-200 rounded">
                                <div className="p-3 bg-gray-50 border-b">
                                    <h6 className="mb-0 text-sm font-medium text-gray-800">
                                        Resumen del Presupuesto
                                    </h6>
                                </div>
                                <div className="p-3">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Items:</span>
                                        <span className="text-sm font-medium">{presupuestocarrito.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <span className="text-base font-semibold text-gray-800">Total:</span>
                                        <span className="text-lg font-bold text-blue-600">
                                            Ref {sumsubtotalespresupuesto()}
                                        </span>
                                    </div>
                                    {dolar && (
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-gray-500">En Bolívares:</span>
                                            <span className="text-sm font-medium text-gray-600">
                                                Bs. {moneda(parseFloat(sumsubtotalespresupuesto().replace(/[^\d.-]/g, '')) * dolar)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="sticky bottom-0 p-3 bg-white border border-gray-200 rounded">
                                <div className="flex gap-2">
                                    <button
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded hover:bg-orange-600 transition-colors"
                                        onClick={() => toggleImprimirTicket("presupuesto")}
                                    >
                                        <i className="mr-2 fa fa-print"></i>
                                        Imprimir Presupuesto
                                    </button>
                                    <button
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                                        onClick={setpresupuestocarritotopedido}
                                    >
                                        <i className="mr-2 fa fa-save"></i>
                                        Convertir a Pedido
                                    </button>
                                </div>
                                <button
                                    className="w-full px-4 py-2 mt-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                                    onClick={() => setpresupuestocarrito([])}
                                >
                                    <i className="mr-2 fa fa-times"></i>
                                    Limpiar Presupuesto
                                </button>
                            </div>

                            {/* Menú Flotante para acciones rápidas */}
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
                                            <button
                                                className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-orange-500 rounded-full hover:bg-orange-600"
                                                onClick={() => toggleImprimirTicket("presupuesto")}
                                                title="Imprimir Presupuesto"
                                            >
                                                <i className="text-xs fa fa-print"></i>
                                            </button>
                                            <button
                                                className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-green-500 rounded-full hover:bg-green-600"
                                                onClick={setpresupuestocarritotopedido}
                                                title="Convertir a Pedido"
                                            >
                                                <i className="text-xs fa fa-save"></i>
                                            </button>
                                            <button
                                                className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-gray-500 rounded-full hover:bg-gray-600"
                                                onClick={() => setpresupuestocarrito([])}
                                                title="Limpiar Presupuesto"
                                            >
                                                <i className="text-xs fa fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        // Estado vacío cuando no hay productos en el presupuesto
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
                                        className="fa fa-file-text-o text-muted"
                                        style={{ fontSize: "3.5rem" }}
                                    ></i>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="mb-2 text-muted fw-normal">
                                    Presupuesto vacío
                                </h3>
                                <p
                                    className="mb-0 text-muted"
                                    style={{
                                        maxWidth: "300px",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    Busca y selecciona productos de la lista de la izquierda
                                    para crear un presupuesto para tu cliente.
                                </p>
                            </div>

                            <div className="gap-2 d-flex flex-column">
                                <div className="d-flex align-items-center text-muted small">
                                    <i className="fa fa-lightbulb-o me-2 text-warning"></i>
                                    <span>
                                        Haz clic en cualquier producto para agregarlo
                                    </span>
                                </div>
                                <div className="d-flex align-items-center text-muted small">
                                    <i className="fa fa-search me-2 text-info"></i>
                                    <span>
                                        Usa la barra de búsqueda para encontrar productos específicos
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
