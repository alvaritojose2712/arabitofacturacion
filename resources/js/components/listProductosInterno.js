import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function ListProductosInterno({
    auth,
    refaddfast,
    setinputqinterno,
    inputqinterno,
    tbodyproducInterref,
    productos,
    countListInter,
    setProductoCarritoInterno,
    moneda,
    setCountListInter,
    setView,
    permisoExecuteEnter,
}){
//f1
  useHotkeys(
    "f1",
    () => {
      if (refaddfast) {
        if (refaddfast.current) {
          refaddfast.current.value = ""
          refaddfast.current.focus()
        }
      }
    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );
  //esc
  useHotkeys(
    "esc",
    () => {
      setView("pagar")
    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );
  //enter
  useHotkeys(
    "enter",
    (event) => {
      if (!event.repeat) {
        if (tbodyproducInterref) {
          if (tbodyproducInterref.current) {
            if (tbodyproducInterref.current.rows[countListInter]) {
              if (permisoExecuteEnter) {
                setProductoCarritoInterno(
                  tbodyproducInterref.current.rows[countListInter].attributes["data-index"].value
                );
              }
            }
          }
        }
      }
    },
    {
        keydown: true,
        keyup: false,
        filterPreventDefault: false,
        enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
    },
    []
  );

  //down
  useHotkeys(
    "down",
    () => {
        let index = countListInter + 1;
        if (tbodyproducInterref) {
          if (tbodyproducInterref.current) {
            if (tbodyproducInterref.current.rows[index]) {
              setCountListInter(index);
              tbodyproducInterref.current.rows[index].focus();
            }
          }
        }
    },
    {enableOnTags: ["INPUT", "SELECT"]},
    []
  );

  //up
  useHotkeys(
      "up",
      () => {
        if (countListInter > 0) {
            let index = countListInter - 1;
            if (tbodyproducInterref) {
              if (tbodyproducInterref.current) {
                if (tbodyproducInterref.current.rows[index]) {
                  tbodyproducInterref.current.rows[index].focus();
                  setCountListInter(index);
                }
              }
            }
        }
      },
      {enableOnTags: ["INPUT", "SELECT"]},
      []
  );

  useEffect(()=>{
    setCountListInter(0)
  },[])
    return (
        <table className="table">
            <thead>
                <tr>
                <td colSpan={auth(1) ? "9" : "8"} className='p-0 pt-1'>
                    <input type="text"
                    ref={refaddfast}
                    className="form-control"
                    placeholder="Agregar...(F1)"
                    onChange={e => setinputqinterno(e.target.value)}
                    value={inputqinterno}
                    />
                </td>
                </tr>
            </thead>
            <tbody ref={tbodyproducInterref}>
                {productos.length ? productos.map((e, i) =>
                <tr tabIndex="-1" className={(countListInter == i ? "bg-sinapsis-light" : null) + (' tr-producto ')} key={e.id} onClick={() => setProductoCarritoInterno(e.id)} data-index={e.id}>
                    <td className="cell2">{e.codigo_barras}</td>
                    <td className='text-left pl-5 cell4'>{e.descripcion}</td>
                    <td className="cell1">
                    <a href='#' className='formShowProductos btn btn-sinapsis btn-sm'>{e.cantidad}</a>
                    </td>
                    <td className="cell1">{e.unidad}</td>
                    <td className="cell2">
                    <div className="btn-group w-100">
                        <button type="button" className='m-0 btn btn-success text-light fs-4 fw-bold w-33'>{moneda(e.precio)}</button>
                        <button type="button" className='m-0 btn btn-secondary text-light w-33'>Bs.{moneda(e.bs)}</button>
                        <button type="button" className='m-0 btn btn-secondary text-light w-33'>P.{moneda(e.cop)}</button>

                    </div>
                    </td>
                </tr>
                ) : null}
            </tbody>
        </table>
    )
}