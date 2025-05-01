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
  //tab
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

  //enter
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
      <section className="modal-custom"> 
        <div className="text-danger" onClick={setSelectItem}><span className="closeModal">&#10006;</span></div>
        <div className="modal-content-sm modal-cantidad">
          <div className="d-flex justify-content-between p-3">
            <span className="text-success price-main">
              {moneda(producto.precio)}<br/>
              {producto.bulto?<span className="bulto-badge" onClick={()=>setbultocarrito(producto.bulto)}>x{producto.bulto}</span>:null}
            </span>
            <div className="text-right product-info">
              <h5 className="product-code">{producto.codigo_proveedor}</h5>
              <h4 className="product-name">{producto.descripcion}</h4>
            </div>
          </div>
          <form onSubmit={e=>e.preventDefault()} className="form-container">
            <div className="form-section">
              <div className="input-group quantity-section">
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    ref={inputCantidadCarritoref} 
                    className="form-control input-cantidad" 
                    placeholder="Cantidad" 
                    onChange={(e)=>setCantidad(number(e.target.value))} 
                    value={cantidad?cantidad:""}
                  />
                </div>
                <div className="price-wrapper">
                  <div className="price-display">
                    <div className="price-row">
                      <span className="currency">$</span>
                      <span className="amount">{cantidad*producto.precio?moneda(cantidad*producto.precio):"0.00"}</span>
                    </div>
                    <div className="price-row">
                      <span className="currency">Bs.</span>
                      <span className="amount">{cantidad*producto.precio*dolar?moneda(cantidad*producto.precio*dolar):"0.00"}</span>
                    </div>
                  </div>
                </div>
                <div className="stock-wrapper">
                  <div className="stock-display">
                    <span className="stock-label">Ct.</span>
                    <span className="stock-amount">{producto.cantidad}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-label">Tipo de Pedido</div>
              <div className="btn-group order-buttons">
                <button 
                  className={"btn btn-"+(numero_factura=="ultimo"?"sinapsis":"outline-sinapsis")+" btn-lg"} 
                  onClick={()=>setNumero_factura("ultimo")}
                >
                  ÚLTIMO
                </button>
                <button 
                  className={"btn btn-"+(numero_factura=="nuevo"?"success":"outline-success")+" btn-lg"} 
                  onClick={()=>setNumero_factura("nuevo")}
                >
                  NUEVO PEDIDO
                </button>
              </div>
            </div>

            <div className="form-section">
              <div className="section-label">Acciones</div>
              <div className="btn-group action-buttons">
                <button 
                  className="btn btn-sinapsis agregar_carrito" 
                  type="button" 
                  onClick={addCarritoRequest} 
                  data-type="agregar"
                >
                  Agregar(enter)
                </button>
                <button 
                  className="btn btn-outline-success" 
                  type="button" 
                  onClick={addCarritoRequest} 
                  data-type="agregar_procesar"
                >
                  Procesar(TAB)
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm" 
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
      <div className="overlay"></div>

      <style jsx>{`
        .price-main {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .product-info {
          max-width: 60%;
        }

        .product-code {
          font-size: 0.9rem;
          color: #6c757d;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .product-name {
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.3;
          color: #212529;
        }

        .bulto-badge {
          display: inline-block;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          background: #e9ecef;
          border-radius: 4px;
          margin-top: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .bulto-badge:hover {
          background: #dee2e6;
        }

        .form-container {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .section-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #495057;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }

        .quantity-section {
          display: flex;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          overflow: hidden;
          height: 80px;
        }

        .input-wrapper {
          flex: 1;
          min-width: 120px;
        }

        .input-cantidad {
          height: 100%;
          border: 2px solid #ced4da;
          border-radius: 8px 0 0 8px;
          border-right: none;
          padding: 0 1rem;
          font-weight: 500;
          font-size: 1.5rem;
          transition: all 0.2s;
          background: #f8f9fa;
        }

        .input-cantidad:focus {
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
          background: #fff;
        }

        .price-wrapper {
          width: 180px;
          border-left: 2px solid #ced4da;
          border-right: 2px solid #ced4da;
        }

        .price-display {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 1rem;
          background: #fff;
        }

        .price-row {
          display: flex;
          align-items: baseline;
          justify-content: flex-end;
          line-height: 1.4;
        }

        .currency {
          font-size: 0.9rem;
          font-weight: 500;
          margin-right: 0.25rem;
          color: #6c757d;
        }

        .amount {
          font-size: 1.1rem;
          font-weight: 600;
          color: #212529;
          font-family: 'Roboto Mono', monospace;
          min-width: 80px;
          text-align: right;
        }

        .stock-wrapper {
          width: 100px;
        }

        .stock-display {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 0.75rem;
          background: #e9ecef;
          border-radius: 0 8px 8px 0;
        }

        .stock-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #6c757d;
          margin-bottom: 0.25rem;
        }

        .stock-amount {
          font-size: 1.1rem;
          font-weight: 600;
          color: #212529;
          font-family: 'Roboto Mono', monospace;
        }

        .order-buttons {
          width: 100%;
          gap: 0.75rem;
        }

        .order-buttons .btn {
          flex: 1;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.875rem 1.5rem;
          transition: all 0.2s;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .order-buttons .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .action-buttons {
          width: 100%;
          gap: 0.75rem;
        }

        .action-buttons .btn {
          flex: 1;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.875rem 1.5rem;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .action-buttons .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn-outline-secondary {
          border-width: 2px;
          font-size: 0.9rem;
          text-transform: none;
        }

        @media (max-width: 576px) {
          .form-container {
            padding: 1rem;
            gap: 1rem;
          }

          .section-label {
            font-size: 0.8rem;
          }

          .quantity-section {
            flex-direction: column;
            height: auto;
          }

          .input-wrapper {
            width: 100%;
          }

          .input-cantidad {
            border-radius: 8px 8px 0 0;
            border-right: 2px solid #ced4da;
            height: 60px;
          }

          .price-wrapper {
            width: 100%;
            border-left: none;
            border-right: none;
            border-top: 2px solid #ced4da;
            border-bottom: 2px solid #ced4da;
          }

          .price-display {
            padding: 0.5rem;
          }

          .stock-wrapper {
            width: 100%;
          }

          .stock-display {
            border-radius: 0 0 8px 8px;
            padding: 0.5rem;
          }

          .order-buttons,
          .action-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            margin-bottom: 0.5rem;
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </>
  )
}
