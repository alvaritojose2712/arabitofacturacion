import React, { useState } from 'react';
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
  const [updatingDollar, setUpdatingDollar] = useState(false);
  
  const handleUpdateDollar = async (e) => {
    const tipo = e.currentTarget.attributes["data-type"].value;
    
    if (tipo === "1") {
      setUpdatingDollar(true);
      try {
        await setMoneda(e);
      } finally {
        setUpdatingDollar(false);
      }
    } else {
      setMoneda(e);
    }
  };
  
  return (
    <header className="bg-white shadow-lg border-b-4 border-orange-500">
      {/* Header Principal */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y Sucursal */}
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Sinapsis" className="h-10 w-auto" />
              <div className="hidden sm:block">
                <h1 className="text-gray-800 font-bold text-lg">{user.sucursal}</h1>
          </div>
            </div>

            {/* Información del Usuario - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-gray-800 font-semibold text-sm">{user.nombre}</p>
                <p className="text-gray-600 text-xs">{user.usuario} ({user.role})</p>
          </div>

              {/* Botones de Acción - Desktop */}
              <div className="flex items-center space-x-2">
                {user.tipo_usuario!=7 && (user.usuario=="admin"||user.usuario=="ao") && (
                  <button 
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setView("configuracion")}
                    title="Configuración"
                  >
                    <i className="fa fa-cogs text-lg"></i>
                  </button>
                )}
                
                {user.tipo_usuario!=7 && (
                  <button 
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => {
                  setView("pedidos")
                  getPedidos()
                    }}
                    title="Pedidos"
                  >
                    <img src={carrito} alt="carrito" className="h-6 w-6" />
                </button>
                )}

                {/* Botón de Logout */}
                <button 
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  onClick={() => {
                    console.log('Botón logout clickeado');
                    logout();
                  }}
                  title={`Cerrar sesión - ${user.usuario} (${user.role})`}
                >
                  <i className="fa fa-sign-out-alt"></i>
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </div>
            </div>

            {/* Menú Móvil */}
            <div className="md:hidden flex items-center space-x-2">
              <div className="text-right">
                <p className="text-gray-800 font-semibold text-sm">{user.nombre}</p>
                <p className="text-gray-600 text-xs">{user.usuario}</p>
              </div>
              
              <button 
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                onClick={() => {
                  console.log('Botón logout clickeado');
                  logout();
                }}
                title="Cerrar sesión"
              >
                <i className="fa fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Navegación */}
      <div className="bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            {user.tipo_usuario==7 ? (
              /* Navegación para DICI */
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === "inventario" 
                      ? "bg-white text-orange-800 border-2 border-orange-800" 
                      : "bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500"
                  }`}
                  onClick={() => {setView("inventario"); setsubViewInventario("inventario")}}
                >
                  <i className="fa fa-boxes mr-2"></i>
                  <span className="hidden sm:inline">Inventario</span>
                  <span className="sm:hidden">Inv</span>
                </button>
                
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === "pedidosCentral" 
                      ? "bg-white text-orange-800 border-2 border-orange-800" 
                      : "bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500"
                  }`}
                      onClick={() => setView("pedidosCentral")}
                    >
                  <i className="fa fa-truck mr-2"></i>
                  <span className="hidden sm:inline">Recibir de Sucursal</span>
                  <span className="sm:hidden">Recibir</span>
                  </button>

                  {/*   <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === "tareas" 
                      ? "bg-white text-orange-800 border-2 border-orange-800" 
                      : "bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500"
                  }`}
                      onClick={() => setView("tareas")}
                    >
                  <i className="fa fa-tasks mr-2"></i>
                  <span className="hidden sm:inline">Tareas</span>
                  <span className="sm:hidden">Tareas</span>
                    </button> */}

                    <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === "garantias" 
                      ? "bg-white text-orange-800 border-2 border-orange-800" 
                      : "bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500"
                  }`}
                      onClick={() => setView("garantias")}
                    >
                  <i className="fa fa-shield-alt mr-2"></i>
                  <span className="hidden sm:inline">Garantías</span>
                  <span className="sm:hidden">Gar</span>
                    </button>

                    <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === "inventario-ciclico" 
                      ? "bg-white text-orange-800 border-2 border-orange-800" 
                      : "bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500"
                  }`}
                      onClick={() => setView("inventario-ciclico")}
                    >
                  <i className="fa fa-clipboard-list mr-2"></i>
                  <span className="hidden sm:inline">Inventario Cíclico</span>
                  <span className="sm:hidden">Cíclico</span>
                    </button>
              </div>
            ) : (
              /* Navegación para Usuarios Regulares */
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                {/* Menú Principal */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {auth(1) && (
                    <button 
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        view === "ventas" 
                          ? "bg-white text-orange-800 border-2 border-orange-800" 
                          : "bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500"
                      }`}
                      onClick={() => { setView("ventas"); getVentasClick()}}
                    >
                      <i className="fa fa-chart-line mr-2"></i>
                      <span className="hidden sm:inline">Ventas</span>
                      <span className="sm:hidden">Ventas</span>
                    </button>
                  )}

                  {auth(3) && (
                    <button 
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        view === "seleccionar" 
                          ? "bg-white text-orange-800 border-2 border-orange-800" 
                          : "bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500"
                      }`}
                      onClick={() => setView("seleccionar")}
                    >
                      <i className="fa fa-calculator mr-2"></i>
                      <span className="hidden sm:inline">Facturar</span>
                      <span className="sm:hidden">Fact</span>
                    </button>
                  )}

                  {auth(2) && (
                    <div className="relative">
                      <button 
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          toggleClientesBtn 
                            ? "bg-white text-orange-800 border-2 border-orange-800" 
                            : "bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500"
                        }`}
                        onClick={() => settoggleClientesBtn(!toggleClientesBtn)}
                      >
                        <i className="fa fa-users mr-2"></i>
                        <span className="hidden sm:inline">Clientes</span>
                        <span className="sm:hidden">Cli</span>
                        <i className="fa fa-chevron-down ml-2"></i>
                      </button>
                      
                      {toggleClientesBtn && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                          <button 
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg ${
                              view === "credito" ? "bg-orange-100 text-orange-800" : "text-gray-700"
                            }`}
                            onClick={() => {setView("credito"); settoggleClientesBtn(false)}}
                          >
                            <i className="fa fa-credit-card mr-2"></i>
                            Cuentas por cobrar
                          </button>
                          <button 
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg ${
                              view === "clientes_crud" ? "bg-orange-100 text-orange-800" : "text-gray-700"
                            }`}
                            onClick={() => {setView("clientes_crud"); settoggleClientesBtn(false)}}
                          >
                            <i className="fa fa-user-cog mr-2"></i>
                            Administrar Clientes
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      view === "cierres" 
                        ? "bg-white text-orange-800 border-2 border-orange-800" 
                        : "bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500"
                    }`}
                    onClick={() => auth(1) ? setView("cierres") : getPermisoCierre()}
                  >
                    <i className="fa fa-lock mr-2"></i>
                    <span className="hidden sm:inline">Cierre</span>
                    <span className="sm:hidden">Cierre</span>
                  </button>
                </div>

                {/* Tasas de Cambio y Menú Derecho */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-end items-center">
                  {/* Tasas de Cambio */}
                  <div className="flex gap-2">
                  <button 
                      className="px-3 py-1 bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleUpdateDollar} 
                    data-type="1"
                    disabled={updatingDollar}
                  >
                    {updatingDollar ? (
                      <>
                        <span className="animate-spin h-3 w-3 border-2 border-orange-600 border-t-transparent rounded-full mr-1"></span>
                        Actualizando...
                      </>
                    ) : (
                      <>USD {dolar}</>
                    )}
                  </button>
                  <button 
                      className="px-3 py-1 bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500 rounded-lg text-sm transition-colors"
                    onClick={handleUpdateDollar} 
                    data-type="2"
                  >
                    COP {peso}
                  </button>
                </div>

                  {/* Menú Derecho */}
                  <div className="flex gap-2">
                  {auth(1) && (
                    <button 
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          view === "inventario" 
                            ? "bg-white text-orange-800 border-2 border-orange-800" 
                            : "bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500"
                        }`}
                      onClick={() => setView("inventario")}
                    >
                        <i className="fa fa-cogs mr-2"></i>
                        <span className="hidden sm:inline">Administración</span>
                        <span className="sm:hidden">Admin</span>
                    </button>
                  )}
                  
                  {auth(1) && user.iscentral && (
                    <button 
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          view === "pedidosCentral" 
                            ? "bg-white text-orange-800 border-2 border-orange-800" 
                            : "bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-500"
                        }`}
                      onClick={() => setView("pedidosCentral")}
                    >
                        <i className="fa fa-truck mr-2"></i>
                        <span className="hidden sm:inline">Recibir de Sucursal</span>
                        <span className="sm:hidden">Recibir</span>
                    </button>
                  )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header