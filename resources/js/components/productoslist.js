import React from "react"

function ProductosList({
  auth,
  productos,
  addCarrito,
  clickSetOrderColumn,
  orderColumn,
  orderBy,
  counterListProductos,
  tbodyproductosref,
  selectProductoFast,
  moneda,
  user
}) {
  return (
    <>
      {/* Versión Desktop */}
      <div className="d-none d-lg-block">
        <table className="table table-hover table-fixed" style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
          <colgroup>
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '40%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '26%' }} />
          </colgroup>
          <thead className="bg-light border-bottom">
            <tr>
              <th className="py-3 pointer" data-valor="codigo_proveedor" onClick={clickSetOrderColumn} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                BARRAS
                {orderColumn=="codigo_proveedor" && (
                  <i className={`fa fa-arrow-${orderBy=="desc"?"up":"down"} ms-2`}></i>
                )}
              </th>
              <th className="py-3 pointer" data-valor="codigo_proveedor" onClick={clickSetOrderColumn} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                ALTERNO
                {orderColumn=="codigo_proveedor" && (
                  <i className={`fa fa-arrow-${orderBy=="desc"?"up":"down"} ms-2`}></i>
                )}
              </th>
              <th className="py-3 pointer" data-valor="descripcion" onClick={clickSetOrderColumn} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                DESCRIPCIÓN
                {orderColumn=="descripcion" && (
                  <i className={`fa fa-arrow-${orderBy=="desc"?"up":"down"} ms-2`}></i>
                )}
              </th>
              <th className="py-3 pointer text-center" data-valor="cantidad" onClick={clickSetOrderColumn} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                CANT
                {orderColumn=="cantidad" && (
                  <i className={`fa fa-arrow-${orderBy=="desc"?"up":"down"} ms-2`}></i>
                )}
              </th>
            
              <th className="py-3 pointer" data-valor="precio" onClick={clickSetOrderColumn} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                PRECIO
                {orderColumn=="precio" && (
                  <i className={`fa fa-arrow-${orderBy=="desc"?"up":"down"} ms-2`}></i>
                )}
              </th>
            </tr>
          </thead>
          <tbody ref={tbodyproductosref} className="table-group-divider">
            {productos?.length ? productos.map((e,i) => (
              <tr 
                key={e.id}
                data-index={i} 
                tabIndex="-1" 
                className={`${counterListProductos == i ? "table-active" : ""} align-middle`}
                onClick={(event) => addCarrito(event)}
                style={{ cursor: 'pointer' }}
              >
                <td className="py-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <span className="fw-bold">{e.codigo_barras}</span>
                </td>
                <td className="py-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <span className="text-muted">{e.codigo_proveedor}</span>
                </td>
                <td className="py-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <span className="fs-5">{e.descripcion}</span>
                </td>
                <td className="py-3 text-center" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <span className={`badge ${parseFloat(e.cantidad) > 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                    {e.cantidad.replace(".00", "")}
                  </span>
                </td>
                <td className="py-3" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <div className="d-flex flex-column gap-2">
                    <button className="btn btn-dark w-100">
                      <span className="fs-4 fw-bold">{moneda(e.precio)}</span>
                    </button>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-dark flex-grow-1">
                        <small>Bs.</small> {moneda(e.bs)}
                      </button>
                      {user.sucursal=="elorza" && (
                        <button className="btn btn-outline-dark flex-grow-1">
                          <small>Cop.</small> {moneda(e.cop)}
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <div className="text-muted">
                    <i className="fas fa-box-open fa-3x mb-3"></i>
                    <p className="h4">No hay productos disponibles</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Versión Móvil */}
      <div className="d-lg-none">
        {productos?.length ? (
          <div className="row g-3">
            {productos.map((e, i) => (
              <div 
                key={e.id}
                data-index={i}
                onClick={addCarrito}
                className="col-12"
              >
                <div className={`card h-100 shadow-sm ${counterListProductos == i ? 'border-dark' : ''}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="card-subtitle mb-1 text-muted">
                          <small>{e.codigo_barras}</small>
                        </h6>
                        <h6 className="card-subtitle mb-2 text-muted">
                          <small>{e.codigo_proveedor}</small>
                        </h6>
                      </div>
                      <span className={`badge ${parseFloat(e.cantidad) > 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                        {e.cantidad.replace(".00", "")}
                      </span>
                    </div>
                    
                    <h5 className="card-title mb-3">{e.descripcion}</h5>
                    
                    <div className="d-flex flex-column gap-2">
                      <button className="btn btn-dark w-100">
                        <span className="fs-4 fw-bold">{moneda(e.precio)}</span>
                      </button>
                      <div className="d-flex gap-2">
                        <button className="btn btn-outline-dark flex-grow-1">
                          <small>Bs.</small> {moneda(e.bs)}
                        </button>
                        {user.sucursal=="elorza" && (
                          <button className="btn btn-outline-dark flex-grow-1">
                            <small>Cop.</small> {moneda(e.cop)}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="text-muted">
              <i className="fas fa-box-open fa-3x mb-3"></i>
              <p className="h4">No hay productos disponibles</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ProductosList