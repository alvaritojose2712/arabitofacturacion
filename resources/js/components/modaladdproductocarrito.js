import { useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook";

export default function Modaladdproductocarrito({
  toggleModalProductos,
  moneda,
  productoSelectinternouno,
  inputCantidadCarritoref,
  setCantidad,
  cantidad,
  dolar,
  setdevolucionTipo,
  devolucionTipo,
  addCarritoRequestInterno,
  number,
  setproductoSelectinternouno,

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
}) {
  useEffect(()=>{
    if (inputCantidadCarritoref.current) {
      inputCantidadCarritoref.current.focus()
    }
  },[])
  //enter
  useHotkeys(
    "enter",
    (event) => {
      if(!event.repeat){
        addCarritoRequestInterno(event)
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
  //esc
  useHotkeys(
    "esc",
    () => {
   setproductoSelectinternouno(null);
    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );

  
  return (
    <>
      <section className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="absolute text-red-500 transition-colors cursor-pointer top-4 right-4 hover:text-red-600" onClick={() => toggleModalProductos(null)}>
          <span className="text-2xl font-bold">&#10006;</span>
        </div>
        
        <div className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl">
          <div className="flex justify-between p-6 border-b">
            <div className="text-4xl font-bold text-green-600">
              {moneda(productoSelectinternouno.precio)}
            </div>
            <div className="text-right max-w-[60%]">
              <h5 className="mb-1 text-sm font-medium text-gray-600">{productoSelectinternouno.codigo_proveedor}</h5>
              <h4 className="text-lg font-semibold leading-tight text-gray-900">{productoSelectinternouno.descripcion}</h4>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex h-20 overflow-hidden bg-white rounded-lg shadow-sm">
              <div className="flex-1 min-w-[120px]">
                <input 
                  type="text" 
                  ref={inputCantidadCarritoref} 
                  className="w-full h-full px-4 text-lg border-2 border-gray-200 rounded-l-lg focus:border-sinapsis focus:ring-0"
                  placeholder="Cantidad" 
                  onChange={(e) => setCantidad(number(e.target.value))} 
                  value={cantidad}
                />
              </div>
              <div className="flex-1 px-4 py-2 border-l border-gray-200 bg-gray-50">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="mr-1 text-gray-600">$</span>
                    <span className="text-lg font-semibold">
                      {cantidad * productoSelectinternouno.precio ? moneda(cantidad * productoSelectinternouno.precio) : "0.00"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1 text-gray-600">Bs.</span>
                    <span className="text-lg font-semibold">
                      {cantidad * productoSelectinternouno.precio * dolar ? moneda(cantidad * productoSelectinternouno.precio * dolar) : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-20 border-l border-gray-200 bg-gray-50">
                <div className="text-center">
                  <span className="block text-sm text-gray-600">Ct.</span>
                  <span className="text-lg font-semibold">{productoSelectinternouno.cantidad}</span>
                </div>
              </div>
            </div>

            <button 
              className="w-full px-6 py-3 font-medium text-white transition-colors rounded-lg bg-sinapsis hover:bg-sinapsis-select"
              type="button" 
              onClick={addCarritoRequestInterno} 
              data-type="agregar"
            >
              Agregar
            </button>

            <div className="flex justify-center space-x-4">
              {/* <button 
                type="button" 
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  devolucionTipo === 2 
                    ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() => setdevolucionTipo(devolucionTipo === 2 ? null : 2)}
              >
                Cambio
              </button>
              <button 
                type="button" 
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  devolucionTipo === 1 
                    ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() => setdevolucionTipo(devolucionTipo === 1 ? null : 1)}
              >
                Garantía
              </button> */}
            </div>
          </div>
        </div>
      </section>
      <div className="fixed inset-0 z-30 bg-black opacity-40"></div>
    </>
  )
}