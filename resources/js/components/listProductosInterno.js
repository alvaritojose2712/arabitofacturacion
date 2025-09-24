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
  user,
}) {
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
    { enableOnTags: ["INPUT", "SELECT"] },
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
    { enableOnTags: ["INPUT", "SELECT"] },
    []
  );

  useEffect(() => {
    setCountListInter(0)
  }, [])
  return (
    <div className="bg-white border border-gray-200 rounded">
      {/* Barra de búsqueda */}
      <div className="bg-gray-50 p-2 border-b">
        <input
          type="text"
          ref={refaddfast}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-400 focus:border-orange-400 text-xs"
          placeholder="Agregar...(F1)"
          onChange={e => setinputqinterno(e.target.value)}
          value={inputqinterno}
        />
      </div>

      {/* Tabla compacta con columnas fijas */}
      <table className="w-full text-xs table-fixed">
        <colgroup>
          <col className="w-16" />
          <col className="w-60" />
          <col className="w-12" />
          <col className="w-10" />
          <col className="w-40" />
        </colgroup>
        <thead className="bg-gray-50">
          <tr>
            <th className="px-1 py-1 text-left text-xs font-medium text-gray-600">Código</th>
            <th className="px-2 py-1 text-left text-xs font-medium text-gray-600">Descripción</th>
            <th className="px-1 py-1 text-center text-xs font-medium text-gray-600">Cant.</th>
            <th className="px-0.5 py-1 text-center text-xs font-medium text-gray-600">Und.</th>
            <th className="px-1 py-1 text-center text-xs font-medium text-gray-600">Precios</th>
          </tr>
        </thead>
        <tbody ref={tbodyproducInterref} className="divide-y divide-gray-200">
          {productos.length ? productos.map((e, i) =>
            <tr
              tabIndex="-1"
              className={`
                                ${countListInter == i ? 'bg-orange-50 border-l-2 border-orange-400' : 'hover:bg-orange-50'} 
                                tr-producto cursor-pointer
                            `}
              key={e.id}
              onClick={() => setProductoCarritoInterno(e.id)}
              data-index={e.id}
            >
              <td className="px-1 py-1 text-xs font-mono text-gray-700">
                <div className="truncate text-xs" title={e.codigo_barras}>
                  {e.codigo_barras}
                </div>
                <div className="truncate text-xs text-gray-500" title={e.codigo_proveedor}>
                  {e.codigo_proveedor}
                </div>
              </td>
              <td className="px-2 py-1 text-xs text-gray-900 font-medium">
                <div className="truncate" title={e.descripcion}>
                  {e.descripcion}
                </div>
              </td>
              <td className="px-1 py-1 text-center">
                <span className="inline-block px-1 py-0.5 bg-orange-100 text-orange-800 rounded text-xs formShowProductos cursor-pointer">
                  {e.cantidad}
                </span>
              </td>
              <td className="px-0.5 py-1 text-center text-xs text-gray-600">
                <div className="truncate text-xs">
                  {e.unidad}
                </div>
              </td>
              <td className="px-1 py-1">
                <div className="flex gap-0.5">
                  <span className="flex-1 px-1 py-0.5 bg-orange-100 text-orange-800 text-xs font-medium rounded text-center">
                    ${moneda(e.precio)}
                  </span>
                  <span className="flex-1 px-1 py-0.5 bg-orange-100 text-orange-800 text-xs rounded text-center">
                    Bs.{moneda(e.bs)}
                  </span>

                  {user.sucursal == "elorza" && (
                    <span className="flex-1 px-1 py-0.5 bg-orange-100 text-orange-800 text-xs rounded text-center">
                      P.{moneda(e.cop)}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ) : (
             <tr>
               <td colSpan="5" className="px-4 py-8 text-center text-gray-500 text-xs">
                 <div className="flex flex-col items-center space-y-3">
                   <div className="relative">
                     <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200">
                       <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-400 animate-spin"></div>
                     </div>
                   </div>
                   <div className="text-gray-600">
                     <span className="font-medium">Cargando productos</span>
                     <span className="animate-pulse">...</span>
                   </div>
                 </div>
               </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}