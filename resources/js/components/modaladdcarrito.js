import { useHotkeys } from "react-hotkeys-hook";
import { useEffect } from "react";

export default function ModalAddCarrito({
  dolar,
  moneda,
  number,
  inputCantidadCarritoref,
  producto,
  pedidoList,
  setSelectItem,
  selectItem,
  addCarritoRequest,
  cantidad,
  numero_factura,
  setCantidad,
  setNumero_factura,
  permisoExecuteEnter,
  setPresupuesto,
  getPedidosList,
}) {
  const setbultocarrito = bulto => {
    let insert = window.prompt("Cantidad por bulto")
    if (insert) {
      let num = number(insert*bulto)
      if (typeof(num)=="number") {
        setCantidad(num)
      }
    }
  }

  useEffect(()=>{
      getPedidosList()
  },[])

  useHotkeys(
      "tab",
      (event) => {
        if(!event.repeat){
          if (typeof selectItem == "number") {
              addCarritoRequest("agregar_procesar");
          }
        }
      },
      {
          enableOnTags: ["INPUT", "SELECT"],
      },
      []
  );

  useHotkeys(
    "enter",
    (event) => {
      if(!event.repeat){
        if (permisoExecuteEnter) {
          addCarritoRequest("agregar");
        }
      }
    },
    {
        filterPreventDefault: false,
        enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
    },
    []
  );

  return (
    <>
      <section className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute top-4 right-4 text-red-500 cursor-pointer hover:text-red-600 transition-colors" onClick={setSelectItem}>
          <span className="text-2xl font-bold">&#10006;</span>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
          <div className="flex justify-between p-6 border-b">
            <div className="text-4xl font-bold text-green-600">
              {moneda(producto.precio)}
              {producto.bulto && (
                <span 
                  className="inline-block ml-2 text-sm font-medium px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => setbultocarrito(producto.bulto)}
                >
                  x{producto.bulto}
                </span>
              )}
            </div>
            <div className="text-right max-w-[60%]">
              <h5 className="text-sm text-gray-600 font-medium mb-1">{producto.codigo_proveedor}</h5>
              <h4 className="text-lg font-semibold text-gray-900 leading-tight">{producto.descripcion}</h4>
            </div>
          </div>

          <form onSubmit={e => e.preventDefault()} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex bg-white rounded-lg shadow-sm overflow-hidden h-20">
                <div className="flex-1 min-w-[120px]">
                  <input 
                    type="text" 
                    ref={inputCantidadCarritoref} 
                    className="w-full h-full px-4 text-lg border-2 border-gray-200 rounded-l-lg focus:border-sinapsis focus:ring-0"
                    placeholder="Cantidad" 
                    onChange={(e) => setCantidad(number(e.target.value))} 
                    value={cantidad ? cantidad : ""}
                  />
                </div>
                <div className="flex-1 px-4 py-2 bg-gray-50 border-l border-gray-200">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">$</span>
                      <span className="text-lg font-semibold">
                        {cantidad * producto.precio ? moneda(cantidad * producto.precio) : "0.00"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">Bs.</span>
                      <span className="text-lg font-semibold">
                        {cantidad * producto.precio * dolar ? moneda(cantidad * producto.precio * dolar) : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-20 flex items-center justify-center bg-gray-50 border-l border-gray-200">
                  <div className="text-center">
                    <span className="block text-sm text-gray-600">Ct.</span>
                    <span className="text-lg font-semibold">{producto.cantidad}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Tipo de Pedido</div>
              <div className="flex gap-4">
                <button 
                  className={`flex-1 py-3 px-6 text-lg font-medium rounded-lg transition-colors ${
                    numero_factura === "ultimo" 
                      ? "bg-sinapsis text-white hover:bg-sinapsis-select" 
                      : "bg-white text-sinapsis border-2 border-sinapsis hover:bg-sinapsis/5"
                  }`}
                  onClick={() => setNumero_factura("ultimo")}
                >
                  ÚLTIMO
                </button>
                <button 
                  className={`flex-1 py-3 px-6 text-lg font-medium rounded-lg transition-colors ${
                    numero_factura === "nuevo" 
                      ? "bg-green-600 text-white hover:bg-green-700" 
                      : "bg-white text-green-600 border-2 border-green-600 hover:bg-green-50"
                  }`}
                  onClick={() => setNumero_factura("nuevo")}
                >
                  NUEVO PEDIDO
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Acciones</div>
              <div className="flex gap-4">
                <button 
                  className="flex-1 py-3 px-6 bg-sinapsis text-white font-medium rounded-lg hover:bg-sinapsis-select transition-colors"
                  type="button" 
                  onClick={addCarritoRequest} 
                  data-type="agregar"
                >
                  Agregar(enter)
                </button>
                <button 
                  className="flex-1 py-3 px-6 bg-white text-green-600 border-2 border-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors"
                  type="button" 
                  onClick={addCarritoRequest} 
                  data-type="agregar_procesar"
                >
                  Procesar(TAB)
                </button>
                <button 
                  className="px-4 py-2 bg-white text-gray-600 border-2 border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  type="button" 
                  onClick={setPresupuesto} 
                  data-id={producto.id}
                >
                  Presupuesto
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
    </>
  );
}
