import logo from "../../images/logo.png"
import carrito from "../../images/carrito1.png"

function Header({
  updatetasasfromCentral,
  user,
  logout,
  getip,
  settoggleClientesBtn,
  toggleClientesBtn,
  getVentasClick,
  dolar,
  peso,
  view,
  setView,
  setMoneda,
  getPedidos,
  setViewCaja,
  viewCaja,
  setShowModalMovimientos,
  showModalMovimientos,
  auth,
  isCierre,
  getPermisoCierre,
  setsubViewInventario,
  subViewInventario,
}) {
  return (
    <header className="mb-3">
      {/* Barra superior */}
      <div className="container-fluid py-2">
        <div className="row align-items-center">
          {/* Logo y nombre de sucursal */}
          <div className="col-md-4 d-flex align-items-center">
            <span className="fw-bold h4 mb-0">{user.sucursal}</span>
          </div>

          {/* Logo central */}
          <div className="col-md-4 d-flex justify-content-center">
            <div className="d-flex align-items-center">
              <img src={logo} alt="sinapsis" className="logo" style={{ maxHeight: '50px' }} />
            </div>
          </div>

          {/* Usuario y carrito */}
          {user.tipo_usuario!=7?
            <div className="col-md-4 d-flex justify-content-end align-items-center">
              <div className="d-flex align-items-center gap-3">
                {user.usuario=="admin"||user.usuario=="ao" ? (
                  <button className="btn btn-outline-dark" onClick={() => setView("configuracion")}>
                    <i className="fa fa-cogs"></i>
                  </button>
                ) : null}
                
                <div className="text-end">
                  <span className="fw-bold d-block">{user.nombre}</span>
                  <small className="text-muted">{user.usuario} ({user.role})</small>
                </div>

                <button className="btn btn-outline-dark" onClick={() => {
                  setView("pedidos")
                  getPedidos()
                }}>
                  <img src={carrito} alt="carrito" width="30px" />
                </button>

                <button className="btn btn-outline-danger" onClick={logout}>
                  <i className="fa fa-times"></i>
                </button>
              </div>
            </div>
          :null}
        </div>
      </div>

      {/* Barra de navegación */}
      <div className="bg-sinapsis container-fluid py-2">
        <div className="row">
          <div className="col-12">
            {user.tipo_usuario==7?
              <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
                <button 
                  className={`btn ${view === "inventario" ? "btn-dark" : "btn-outline-light"}`}
                  onClick={() => {setView("inventario"); setsubViewInventario("inventario")}}
                >
                  Inventario
                </button>
                <button 
                      className={`btn ${view === "pedidosCentral" ? "btn-dark" : "btn-outline-light"}`}
                      onClick={() => setView("pedidosCentral")}
                    >
                    Recibir de Sucursal
                  </button>

                    <button 
                      className={`btn ${view === "tareas" ? "btn-dark" : "btn-outline-light"}`}
                      onClick={() => setView("tareas")}
                    >
                      Tareas
                    </button>
              </div>
            :
              <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
                {/* Menú izquierdo */}
                <div className="d-flex flex-wrap gap-2">
                  {auth(1) && (
                    <button 
                      className={`btn ${view === "ventas" ? "btn-dark" : "btn-outline-light"}`}
                      onClick={() => { setView("ventas"); getVentasClick()}}
                    >
                      Ventas
                    </button>
                  )}

                  {auth(3) && (
                    <button 
                      className={`btn ${view === "seleccionar" ? "btn-dark" : "btn-outline-light"}`}
                      onClick={() => setView("seleccionar")}
                    >
                      Facturar
                    </button>
                  )}

                  {auth(2) && (
                    <div className="dropdown">
                      <button 
                        className={`btn ${toggleClientesBtn ? "btn-dark" : "btn-outline-light"} dropdown-toggle`}
                        type="button" 
                        onClick={() => settoggleClientesBtn(!toggleClientesBtn)}
                      >
                        Clientes
                      </button>
                      <ul className={`dropdown-menu ${toggleClientesBtn ? "show" : ""}`} onMouseLeave={() => settoggleClientesBtn(false)}>
                        <li>
                          <button 
                            className={`dropdown-item ${view === "credito" ? "active" : ""}`}
                            onClick={() => {setView("credito"); settoggleClientesBtn(false)}}
                          >
                            Cuentas por cobrar
                          </button>
                        </li>
                        <li>
                          <button 
                            className={`dropdown-item ${view === "clientes_crud" ? "active" : ""}`}
                            onClick={() => {setView("clientes_crud"); settoggleClientesBtn(false)}}
                          >
                            Administrar Clientes
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}

                  <button 
                    className={`btn ${view === "cierres" ? "btn-dark" : "btn-outline-light"}`}
                    onClick={() => auth(1) ? setView("cierres") : getPermisoCierre()}
                  >
                    Cierre
                  </button>

                 
                </div>

                {/* Tasas de cambio */}
                <div className="d-flex gap-2 align-items-center">
                  <button 
                    className="btn btn-outline-light btn-sm"
                    onClick={setMoneda} 
                    data-type="1"
                  >
                    USD {dolar}
                  </button>
                  <button 
                    className="btn btn-outline-light btn-sm"
                    onClick={setMoneda} 
                    data-type="2"
                  >
                    COP {peso}
                  </button>
                </div>


                {/* Menú derecho */}
                <div className="d-flex gap-2">
                  {auth(1) && (
                    <button 
                      className={`btn ${view === "inventario" ? "btn-dark" : "btn-outline-light"}`}
                      onClick={() => setView("inventario")}
                    >
                      Administración
                    </button>
                  )}
                  
                  {auth(1) && user.iscentral && (
                    <button 
                      className={`btn ${view === "pedidosCentral" ? "btn-dark" : "btn-outline-light"}`}
                      onClick={() => setView("pedidosCentral")}
                    >
                      Recibir de Sucursal
                    </button>
                  )}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header