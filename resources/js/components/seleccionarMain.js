import ProductosList from "../components/productoslist";
import { useHotkeys } from "react-hotkeys-hook";

export default function SeleccionarMain({
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
}){
    //down
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

    //up
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
    return (
        <div className={"container-fluid"  + (" pe-5 ps-5")}>
            <div className="row">

                <div className="col">


                    <div className="d-flex justify-content-center">
                        <div className="input-group mb-4 w-50">
                            <input
                                type="text"
                                className="form-control fs-2"
                                ref={inputbusquedaProductosref}
                                placeholder="Buscar... Presiona (ESC)"
                                onChange={(e) => getProductos(e.target.value)}
                            />
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
                {presupuestocarrito.length ?
                    <div className="col-4">

                        <div className="modalpresupuesto">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>
                                            <button className="btn btn-outline-danger" onClick={() => setpresupuestocarrito([])}><i className="fa fa-times"></i></button>
                                        </td>
                                        <td className="text-center">
                                            <h1>Presupuesto</h1>
                                        </td>
                                        <td className="text-right">

                                            <button className="btn btn-warning" onClick={() => toggleImprimirTicket("presupuesto")}><i className="fa fa-print"></i></button>
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
                                    {presupuestocarrito.map((e, i) =>
                                        <tr key={i} className="pointer" onClick={() => delitempresupuestocarrito(i)}>
                                            <td>{i + 1}</td>
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
                : null}
            </div>
        </div>
    )
}