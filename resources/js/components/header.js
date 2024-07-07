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
}) {
  
    return (
    <header className="mb-3">
      <div className="container-fluid">
        <div className="row">
          <div className="col-5 d-flex align-items-center">
          <span className="fst-weight-bold h2">{user.sucursal}</span>
            
          </div>
          <div className="col">
            <div className="d-flex header-justify-content-end flex-wrap align-items-center">
              <div className="p-3">
                <img src={logo} alt="sinapsis" className="logo" />
              </div>
              <div className="p-3">
                <img src={carrito} alt="sinapsis" width="50px" className="pointer carrito-icon" onClick={
                  ()=>{
                    setView("pedidos")
                    getPedidos()
                  }
                }/>
              </div>
            </div>

          </div>
          <div className="col-5 d-flex header-justify-content-end align-items-center">
            {user.usuario=="admin"||user.usuario=="ao"?<span className={"btn m-1 text-success"} onClick={() => setView("configuracion")}><i className="fa fa-cogs"></i></span>:null}
            
            <div>
              <span className="fw-bold">{user.nombre}</span><br/>
              <span className="fst-italic">{user.usuario} ({user.role})</span>
            </div>
            <span className="m-1 btn text-danger" onClick={logout}><i className="fa fa-times"></i></span>
          </div>
        </div>
      </div>
      <div className="bg-sinapsis container-fluid">
        <div className="row">
          <div className="col d-flex header-justify-content-end">
            
            {auth(1)?<span className={(view == "ventas" ? "btn btn-dark" : null) + (" p-3 pointer")} onClick={() => { setView("ventas"); getVentasClick()}}>Ventas</span>:null}

              {auth(3) ? <span className={(view == "seleccionar" ? "btn btn-dark" : null) + (" p-3 pointer")} onClick={() => setView("seleccionar")}>Facturar</span> : null}

            {auth(2)?<div className="dropdown btn">
              <button className={(toggleClientesBtn ? "btn btn-dark" : null)+(" btn dropdown-toggle text-light")} type="button" onClick={() => settoggleClientesBtn(!toggleClientesBtn)}>
                Clientes
              </button>
              <ul className={("dropdown-menu ")+ (toggleClientesBtn?"show":null)} onMouseLeave={()=>settoggleClientesBtn(false)}>
               {/*  <li>
                  <span className={(view == "vueltos" ? "btn btn-dark" : null) + (" p-3 pointer dropdown-item")} onClick={() => {setView("vueltos");settoggleClientesBtn(false)}}>Vueltos</span>
                </li> */}
                <li>
                  <span className={(view=="credito"?"btn btn-dark":null)+(" p-3 pointer dropdown-item")} onClick={()=>{setView("credito");settoggleClientesBtn(false)}}>Cuentas por cobrar</span>
                </li>
                <li>
                  <span className={(view == "clientes_crud" ? "btn btn-dark" : null) + (" p-3 pointer dropdown-item")} onClick={() => {setView("clientes_crud");settoggleClientesBtn(false)}}>Administrar Clientes</span>

                </li>
              </ul>
            </div>:null}


            {auth(1)
              ?<span className={(view=="cierres"?"btn btn-dark":null)+(" p-3 pointer")} onClick={()=>setView("cierres")}>Cierre</span>
              :<span className={(view=="cierres"?"btn btn-dark":null)+(" p-3 pointer")} onClick={()=>getPermisoCierre()}>Cierre</span>
            }
            
            {auth(1)?
            <>
              <small className="p-3 monto-header" onClick={setMoneda} data-type="1">USD {dolar} </small>
              <small className="p-3 monto-header" onClick={setMoneda} data-type="2">COP {peso} </small>
              <small className="p-3 monto-header"><i className="fa fa-refresh" onClick={updatetasasfromCentral}></i> </small>
              
            </>
            :
            <>
              <small className="p-3 monto-header" data-type="1">USD {dolar} </small>
              <small className="p-3 monto-header" data-type="2">COP {peso} </small>
            </>
            }
            
          </div>
          <div className="col-4 d-flex header-justify-content-end">

            
            {/* {auth(1)?<span className={(view=="tareas"?"btn btn-dark":null)+(" p-3 pointer")} onClick={()=>setView("tareas")}>Tareas</span>:null} */}
            {auth(1)?<span className={(view=="inventario"?"btn btn-dark":null)+(" p-3 pointer")} onClick={()=>setView("inventario")}>Administración</span>:null}
            
              {auth(1) && user.iscentral ? <span className={(view == "pedidosCentral" ? "btn btn-dark" : null) + (" p-3 pointer")} onClick={() => setView("pedidosCentral")}>Recibir de Sucursal</span> : null}
          </div>
        </div>
      </div>
    </header>
  )
}
export default Header