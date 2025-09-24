import React, { useState } from 'react';
import logo from "../../images/logo.png"
import carrito from "../../images/carrito1.png"
import BarraPedLateral from './barraPedLateral';

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
  // Props para pedidos
  pedidosFast,
  onClickEditPedido,
  currentPedidoId,
  addNewPedido,
  pedidoData,
}) {
  const [updatingDollar, setUpdatingDollar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUpdateDollar = async (e) => {
    const tipo = e.currentTarget.attributes["data-type"].value;

    // First confirmation
    if (!window.confirm("¿Está seguro que desea actualizar la tasa?")) {
      return;
    }

    // Second confirmation
    if (!window.confirm("Esta acción no se puede deshacer. ¿Desea continuar?")) {
      return;
    }

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
    <>
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar compacto con todas las opciones */}
      <div className={`fixed left-0 top-0 h-full w-60 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>

        {/* Header del Sidebar */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Sinapsis" className="h-6 w-auto" />
              <div>
                <h1 className="text-gray-800 font-bold text-sm">{user.sucursal}</h1>
                <p className="text-gray-600 text-xs">{user.nombre}</p>
              </div>
            </div>
            <button
              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fa fa-times text-sm"></i>
            </button>
          </div>
        </div>

        {/* Contenido del Sidebar */}
        <div className="p-3 h-full overflow-y-auto">
          <nav className="space-y-1">


           

            {user.tipo_usuario == 7 ? (
              /* Navegación para DICI */
              <>
                <button
                  className={`w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left ${view === "inventario"
                      ? "bg-orange-100 text-orange-800 border-l-4 border-orange-800"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => { setView("inventario"); setsubViewInventario("inventario"); setSidebarOpen(false) }}
                >
                  <i className="fa fa-boxes mr-2 w-4"></i>
                  Inventario
                </button>

                <button
                  className={`w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left ${view === "pedidosCentral"
                      ? "bg-orange-100 text-orange-800 border-l-4 border-orange-800"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => { setView("pedidosCentral"); setSidebarOpen(false) }}
                >
                  <i className="fa fa-truck mr-2 w-4"></i>
                  Recibir de Sucursal
                </button>

                <button
                  className={`w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left ${view === "garantias"
                      ? "bg-orange-100 text-orange-800 border-l-4 border-orange-800"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => { setView("garantias"); setSidebarOpen(false) }}
                >
                  <i className="fa fa-shield-alt mr-2 w-4"></i>
                  Garantías
                </button>

                <button
                  className={`w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left ${view === "inventario-ciclico"
                      ? "bg-orange-100 text-orange-800 border-l-4 border-orange-800"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => { setView("inventario-ciclico"); setSidebarOpen(false) }}
                >
                  <i className="fa fa-clipboard-list mr-2 w-4"></i>
                  Inventario Cíclico
                </button>
              </>
            ) : (
              /* Navegación para Usuarios Regulares - TODO */
              <>
                {auth(1) && (
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left ${view === "ventas"
                        ? "bg-orange-100 text-orange-800 border-l-4 border-orange-800"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                    onClick={() => { setView("ventas"); getVentasClick(); setSidebarOpen(false) }}
                  >
                    <i className="fa fa-chart-line mr-2 w-4"></i>
                    Ventas
                  </button>
                )}

                {auth(3) && (
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left ${view === "pedidos"
                        ? "bg-orange-100 text-orange-800 border-l-4 border-orange-800"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                    onClick={() => { setView("pedidos"); setSidebarOpen(false) }}
                  >
                    <i className="fa fa-calculator mr-2 w-4"></i>
                    Pedidos
                  </button>
                )}

                {auth(2) && (
                  <div className="space-y-1">
                    <button
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors text-left ${toggleClientesBtn
                          ? "bg-orange-100 text-orange-800"
                          : "text-gray-700 hover:bg-gray-100"
                        }`}
                      onClick={() => settoggleClientesBtn(!toggleClientesBtn)}
                    >
                      <div className="flex items-center">
                        <i className="fa fa-users mr-2 w-4"></i>
                        Clientes
                      </div>
                      <i className={`fa fa-chevron-${toggleClientesBtn ? 'up' : 'down'} text-xs`}></i>
                    </button>

                    {toggleClientesBtn && (
                      <div className="ml-6 space-y-1">
                        <button
                          className={`w-full flex items-center px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${view === "credito" ? "bg-orange-50 text-orange-800" : "text-gray-600 hover:bg-gray-50"
                            }`}
                          onClick={() => { setView("credito"); settoggleClientesBtn(false); setSidebarOpen(false) }}
                        >
                          <i className="fa fa-credit-card mr-2 w-3"></i>
                          Cuentas por cobrar
                        </button>
                        <button
                          className={`w-full flex items-center px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${view === "clientes_crud" ? "bg-orange-50 text-orange-800" : "text-gray-600 hover:bg-gray-50"
                            }`}
                          onClick={() => { setView("clientes_crud"); settoggleClientesBtn(false); setSidebarOpen(false) }}
                        >
                          <i className="fa fa-user-cog mr-2 w-3"></i>
                          Administrar Clientes
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <button
                  className={`w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left ${view === "cierres"
                      ? "bg-orange-100 text-orange-800 border-l-4 border-orange-800"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => {
                    auth(1) ? setView("cierres") : getPermisoCierre();
                    setSidebarOpen(false);
                  }}
                >
                  <i className="fa fa-lock mr-2 w-4"></i>
                  Cierre
                </button>

                {auth(1) && (
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left ${view === "inventario"
                        ? "bg-orange-100 text-orange-800 border-l-4 border-orange-800"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                    onClick={() => { setView("inventario"); setSidebarOpen(false) }}
                  >
                    <i className="fa fa-cogs mr-2 w-4"></i>
                    Administración
                  </button>
                )}

                {auth(1) && user.iscentral && (
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left ${view === "pedidosCentral"
                        ? "bg-orange-100 text-orange-800 border-l-4 border-orange-800"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                    onClick={() => { setView("pedidosCentral"); setSidebarOpen(false) }}
                  >
                    <i className="fa fa-truck mr-2 w-4"></i>
                    Recibir de Sucursal
                  </button>
                )}

                {/* Separador */}
                <div className="border-t border-gray-200 my-3"></div>

                {/* Tasas de cambio */}
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3">Tasas</h3>
                  <button
                    className="w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleUpdateDollar}
                    data-type="1"
                    disabled={updatingDollar}
                  >
                    <i className="fa fa-dollar-sign mr-2 w-4"></i>
                    {updatingDollar ? (
                      <>
                        <span className="animate-spin h-3 w-3 border-2 border-orange-600 border-t-transparent rounded-full mr-2"></span>
                        Actualizando USD...
                      </>
                    ) : (
                      <>USD {dolar}</>
                    )}
                  </button>
                  <button
                    className="w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left text-gray-700 hover:bg-gray-100"
                    onClick={handleUpdateDollar}
                    data-type="2"
                  >
                    <i className="fa fa-coins mr-2 w-4"></i>
                    COP {parseFloat(peso).toFixed(2)}
                  </button>
                </div>
              </>
            )}

            {/* Separador */}
            <div className="border-t border-gray-200 my-3"></div>

            {/* Configuración y logout */}
            <div className="space-y-1">
              {user.tipo_usuario != 7 && (user.usuario == "admin" || user.usuario == "ao") && (
                <button
                  className="w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left text-gray-700 hover:bg-gray-100"
                  onClick={() => { setView("configuracion"); setSidebarOpen(false) }}
                >
                  <i className="fa fa-cogs mr-2 w-4"></i>
                  Configuración
                </button>
              )}

              <button
                className="w-full flex items-center px-3 py-2 rounded text-sm font-medium transition-colors text-left text-red-600 hover:bg-red-50"
                onClick={() => {
                  console.log('Botón logout clickeado');
                  logout();
                }}
              >
                <i className="fa fa-sign-out-alt mr-2 w-4"></i>
                Cerrar Sesión
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Header unificado */}
      <header className="bg-white border-b-2 border-orange-500">
        <div className="px-3 py-2">
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa y sucursal */}
            <div className="flex items-center gap-2">
              <button
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                onClick={() => setSidebarOpen(true)}
              >
                <i className="fa fa-bars"></i>
              </button>
              <div className="hidden sm:block">
                <span className="text-gray-800 font-bold text-sm">{user.sucursal}</span>
              </div>
            </div>

            {/* Gestión de pedidos */}
            <BarraPedLateral
              addNewPedido={addNewPedido}
              pedidosFast={pedidosFast}
              onClickEditPedido={onClickEditPedido}
              pedidoData={pedidoData}
            />

            {/* Separador */}
            <div className="w-px h-5 bg-gray-300"></div>

            {/* Botones de acción y tasas */}
            <div className="flex items-center gap-2">
              {/* Botón Pedidos */}
              <button
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  view === "pedidos"
                    ? "bg-orange-100 text-orange-800 border border-orange-800"
                    : "bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-500"
                }`}
                onClick={() => setView("pedidos")}
                title="Ver pedidos"
              >
                <i className="fa fa-calculator mr-1"></i>
                Pedidos
              </button>

              {/* Tasas */}
              <button
                className="px-2 py-1 rounded text-xs font-medium bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-500 transition-colors disabled:opacity-50"
                onClick={handleUpdateDollar}
                data-type="1"
                disabled={updatingDollar}
              >
                {updatingDollar ? (
                  <><span className="animate-spin h-2 w-2 border border-orange-600 border-t-transparent rounded-full mr-1"></span>USD...</>
                ) : (
                  <><i className="fa fa-dollar-sign mr-1"></i>{dolar}</>
                )}
              </button>

              <button
                className="px-2 py-1 rounded text-xs font-medium bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-500 transition-colors"
                onClick={handleUpdateDollar}
                data-type="2"
              >
                <i className="fa fa-coins mr-1"></i>{parseFloat(peso).toFixed(2)}
              </button>
            </div>

            {/* Separador */}
            <div className="w-px h-5 bg-gray-300"></div>

            {/* Información del usuario */}
          {/*   <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-gray-800 font-semibold text-xs">{user.nombre}</p>
                <p className="text-gray-600 text-xs">{user.usuario} ({user.role})</p>
              </div>
            </div> */}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header