import { useState, useEffect } from 'react';
import { useHotkeys } from "react-hotkeys-hook";

import ModalShowPedidoFast from '../components/ModalShowPedidoFast';
import RefsList from './refslist';

function Pedidos({
	setView,
	getReferenciasElec,
	refrenciasElecData,
	togleeReferenciasElec,
	settogleeReferenciasElec,

	addNewPedido,
	auth,
	pedidoData,
	getPedidoFast,
	showModalPedidoFast,
	setshowModalPedidoFast,

	orderbycolumpedidos,
	setorderbycolumpedidos,
	orderbyorderpedidos,
	setorderbyorderpedidos,

	moneda,
	setshowMisPedido,
	showMisPedido,
	tipobusquedapedido,
	setTipoBusqueda,

	busquedaPedido,

	fecha1pedido,

	fecha2pedido,

	onChangePedidos,

	pedidos,
	getPedidos,

	onClickEditPedido,
	onCLickDelPedido,

	tipoestadopedido,
	setTipoestadopedido,
	filterMetodoPago,
	filterMetodoPagoToggle,
	clickSetOrderColumnPedidos,
	toggleImprimirTicket,

	setmodalchangepedido,
	setseletIdChangePedidoUserHandle,
	modalchangepedido,
	modalchangepedidoy,
	modalchangepedidox,
	usuarioChangeUserPedido,
	setusuarioChangeUserPedidoHandle,
	usuariosData,
}) {
	// Estado para manejar expansión de secciones
	const [expandedSections, setExpandedSections] = useState({});
	
	// Función para togglear sección específica
	const toggleSection = (productId, section) => {
		setExpandedSections(prev => ({
			...prev,
			[`${productId}-${section}`]: !prev[`${productId}-${section}`]
		}));
	};
	
	// Función para expandir/contraer todas las secciones de un producto
	const toggleAllSections = (productId) => {
		const ventasKey = `${productId}-ventas`;
		const devolucionesKey = `${productId}-devoluciones`;
		
		const ventasExpanded = expandedSections[ventasKey];
		const devolucionesExpanded = expandedSections[devolucionesKey];
		
		// Si alguna está expandida, contraer ambas, sino expandir ambas
		const shouldExpand = !ventasExpanded && !devolucionesExpanded;
		
		setExpandedSections(prev => ({
			...prev,
			[ventasKey]: shouldExpand,
			[devolucionesKey]: shouldExpand
		}));
	};
	useHotkeys(
		"esc",
		() => {
				setView("seleccionar");
		},
		{
			enableOnTags: ["INPUT", "SELECT"],
			filter: false,
		},
		[]
	);

	return (
		<div className="container-fluid px-4 py-3">
			{showModalPedidoFast && <ModalShowPedidoFast
				pedidoData={pedidoData}
				showModalPedidoFast={showModalPedidoFast}
				setshowModalPedidoFast={setshowModalPedidoFast}
				onClickEditPedido={onClickEditPedido}
			/>}

			{/* Filtros y Búsqueda */}
			<div className="row g-3 mb-4">
				{/* Estado de Pedidos */}
				<div className="col-md-4">
					<div className="card shadow-sm">
						<div className="card-body p-2">
							<div className="btn-group w-100" role="group">
								<button 
									className={`btn ${tipoestadopedido === "todos" ? "btn-dark" : "btn-outline-dark"}`}
									onClick={() => setTipoestadopedido("todos")}
								>
									<i className="fa fa-list me-1"></i> TODOS
								</button>
								<button 
									className={`btn ${tipoestadopedido === 0 ? "btn-primary" : "btn-outline-primary"}`}
									onClick={() => setTipoestadopedido(0)}
								>
									<i className="fa fa-clock-o me-1"></i> PENDIENTE
								</button>
								<button 
									className={`btn ${tipoestadopedido === 1 ? "btn-success" : "btn-outline-success"}`}
									onClick={() => setTipoestadopedido(1)}
								>
									<i className="fa fa-check me-1"></i> PROCESADO
								</button>
								<button 
									className={`btn ${tipoestadopedido === 2 ? "btn-danger" : "btn-outline-danger"}`}
									onClick={() => setTipoestadopedido(2)}
								>
									<i className="fa fa-times me-1"></i> ANULADO
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Búsqueda y Fechas */}
				<div className="col-md-8">
					<div className="card shadow-sm">
						<div className="card-body p-2">
							<div className="d-flex gap-2">
								<div className="btn-group">
									<button 
										className={`btn ${tipobusquedapedido === "fact" ? "btn-primary" : "btn-outline-primary"}`}
										onClick={() => setTipoBusqueda("fact")}
									>
										<i className="fa fa-search me-1"></i> FACTURA
									</button>
									<button 
										className={`btn ${tipobusquedapedido === "prod" ? "btn-primary" : "btn-outline-primary"}`}
										onClick={() => setTipoBusqueda("prod")}
									>
										<i className="fa fa-cube me-1"></i> PRODUCTO
									</button>
									<button 
										className={`btn ${tipobusquedapedido === "cliente" ? "btn-primary" : "btn-outline-primary"}`}
										onClick={() => setTipoBusqueda("cliente")}
									>
										<i className="fa fa-user me-1"></i> CLIENTE
									</button>
								</div>

								<form onSubmit={getPedidos} className="d-flex flex-grow-1 gap-2">
									<div className="input-group">
										<span className="input-group-text bg-white">
											<i className="fa fa-search text-muted"></i>
										</span>
										<input 
											className="form-control border-start-0" 
											placeholder="Buscar... #Factura, #Descripción, #Cliente" 
											value={busquedaPedido} 
											data-type="busquedaPedido" 
											onChange={onChangePedidos} 
											autoComplete="off" 
										/>
									</div>
									<div className="input-group" style={{ width: 'auto' }}>
										<input 
											type="date" 
											value={fecha1pedido} 
											data-type="fecha1pedido" 
											onChange={onChangePedidos} 
											className="form-control" 
										/>
										<input 
											type="date" 
											value={fecha2pedido} 
											data-type="fecha2pedido" 
											onChange={onChangePedidos} 
											className="form-control" 
										/>
									</div>
									<button type="button" className="btn btn-outline-primary" onClick={() => getPedidos()}>
										<i className="fa fa-sync-alt"></i>
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Controles y Métodos de Pago */}
			<div className="row g-3 mb-4">
				<div className="col-md-6">
					<div className="card shadow-sm">
						<div className="card-body p-2">
							<div className="d-flex gap-2 align-items-center">
								<button className="btn btn-primary fs-5 px-3" data-valor="id" onClick={clickSetOrderColumnPedidos}>
									<i className="fa fa-shopping-cart me-2"></i>
									{pedidos["fact"] ? pedidos["fact"].length : 0}
								</button>
								<div className="btn-group">
									<button 
										onClick={() => setshowMisPedido(true)} 
										className={`btn ${showMisPedido ? "btn-success" : "btn-outline-success"}`}
									>
										<i className="fa fa-user me-1"></i> Mis pedidos
									</button>
									{auth(1) && (
										<button 
											onClick={() => setshowMisPedido(false)} 
											className={`btn ${!showMisPedido ? "btn-success" : "btn-outline-success"}`}
										>
											<i className="fa fa-users me-1"></i> Todos
										</button>
									)}
									<button className="btn btn-success" onClick={addNewPedido}>
										<i className="fa fa-plus"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="card shadow-sm">
						<div className="card-body p-2">
							<div className="d-flex gap-2 justify-content-end align-items-center">
								<div className="btn-group">
									<button 
										className={`btn ${filterMetodoPagoToggle === "todos" ? "btn-dark" : "btn-outline-dark"}`}
										data-type="todos" 
										onClick={filterMetodoPago}
									>
										<i className="fa fa-list me-1"></i> Todos
									</button>
									<button 
										className={`btn ${filterMetodoPagoToggle === 1 ? "btn-info" : "btn-outline-info"}`}
										data-type="1" 
										onClick={filterMetodoPago}
									>
										<i className="fa fa-exchange me-1"></i> Trans.
									</button>
									<button 
										className={`btn ${filterMetodoPagoToggle === 2 ? "btn-secondary" : "btn-outline-secondary"}`}
										data-type="2" 
										onClick={filterMetodoPago}
									>
										<i className="fa fa-credit-card me-1"></i> Deb.
									</button>
									<button 
										className={`btn ${filterMetodoPagoToggle === 3 ? "btn-success" : "btn-outline-success"}`}
										data-type="3" 
										onClick={filterMetodoPago}
									>
										<i className="fa fa-money me-1"></i> Efec.
									</button>
									<button 
										className={`btn ${filterMetodoPagoToggle === 4 ? "btn-warning text-dark" : "btn-outline-warning"}`}
										data-type="4" 
										onClick={filterMetodoPago}
									>
										<i className="fa fa-calendar me-1"></i> Cred.
									</button>
									<button 
										className={`btn ${filterMetodoPagoToggle === 5 ? "btn-info text-dark" : "btn-outline-info"}`}
										data-type="5" 
										onClick={filterMetodoPago}
									>
										<i className="fa fa-mobile me-1"></i> Biopago
									</button>
									<button 
										className={`btn ${filterMetodoPagoToggle === 6 ? "btn-danger text-dark" : "btn-outline-danger"}`}
										data-type="6" 
										onClick={filterMetodoPago}
									>
										<i className="fa fa-ban me-1"></i> Anul.
									</button>

									<span className="btn btn-success" onClick={() => settogleeReferenciasElec(true)}>REFs.</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Filtro de Ordenamiento por Monto */}
			

			{/* Lista de Pedidos */}
			<div className="mt-4">
				{tipobusquedapedido === "prod" ? (
					<div className="row g-4">
						{pedidos["prod"]?.map(e => {
							if (!e) return null;
							
							// Separar cantidades positivas y negativas
							const ventasItems = e.items.filter(item => item.cantidad > 0);
							const devolucionesItems = e.items.filter(item => item.cantidad < 0);
							const ventasTotal = ventasItems.reduce((sum, item) => sum + parseInt(item.cantidad), 0);
							const devolucionesTotal = devolucionesItems.reduce((sum, item) => sum + Math.abs(parseInt(item.cantidad)), 0);
							
							return (
								<div className="col-12 col-lg-6 col-xl-4" key={e.id}>
									<div className="card h-100 shadow-sm border-0">
										<div className="card-header bg-primary text-white">
											<div className="d-flex justify-content-between align-items-center">
												<div>
													<h5 className="card-title mb-1 text-white fw-bold">{e.descripcion}</h5>
													<small className="text-white-75">
														<i className="fa fa-barcode me-1"></i>
														{e.codigo_proveedor} | {e.codigo_barras}
													</small>
												</div>
												<div className="text-end">
													<span className="badge bg-light text-primary fs-6 fw-bold">
														{e.cantidadtotal} Total
													</span>
												</div>
											</div>
										</div>
										
										<div className="card-body">
											{/* Precios */}
											<div className="row mb-3">
												<div className="col-6">
													<div className="text-center p-2 bg-light rounded">
														<small className="text-muted d-block">Precio Base</small>
														<strong className="text-primary">${e.precio_base}</strong>
													</div>
												</div>
												<div className="col-6">
													<div className="text-center p-2 bg-light rounded">
														<small className="text-muted d-block">Precio Venta</small>
														<strong className="text-success">${e.precio}</strong>
													</div>
												</div>
											</div>

											{/* Resumen de Cantidades */}
											<div className="row mb-3">
												{ventasTotal > 0 && (
													<div className="col-6">
														<div className="text-center p-2 bg-success bg-opacity-10 rounded border border-success border-opacity-25">
															<i className="fa fa-arrow-up text-success me-1"></i>
															<strong className="text-success">{ventasTotal}</strong>
															<small className="text-success d-block">Ventas</small>
														</div>
													</div>
												)}
												{devolucionesTotal > 0 && (
													<div className="col-6">
														<div className="text-center p-2 bg-danger bg-opacity-10 rounded border border-danger border-opacity-25">
															<i className="fa fa-arrow-down text-danger me-1"></i>
															<strong className="text-danger">{devolucionesTotal}</strong>
															<small className="text-danger d-block">Devoluciones</small>
														</div>
													</div>
												)}
											</div>

											{/* Detalles expandibles */}
											<div className="mt-3 space-y-2">
												{/* Ventas */}
												{ventasItems.length > 0 && (
													<div className="border border-green-200 rounded-lg">
														<button 
															className="w-full p-3 text-left bg-green-50 hover:bg-green-100 transition-colors duration-200 flex items-center justify-between rounded-t-lg"
															onClick={() => toggleSection(e.id, 'ventas')}
														>
															<div className="flex items-center space-x-2">
																<i className="fa fa-shopping-cart text-green-600"></i>
																<span className="font-semibold text-green-700">
																	Ventas ({ventasItems.length} pedidos - {ventasTotal} unidades)
																</span>
															</div>
															<i className={`fa transition-transform duration-200 ${
																expandedSections[`${e.id}-ventas`] ? 'fa-chevron-up' : 'fa-chevron-down'
															} text-green-600`}></i>
														</button>
														<div className={`transition-all duration-300 ease-in-out ${
															expandedSections[`${e.id}-ventas`] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
														} overflow-hidden`}>
															<div className="divide-y divide-gray-100">
																{ventasItems.map(item => (
																	<div key={item.id} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150">
																		<div className="flex items-center space-x-3">
																			<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
																				+{item.cantidad}
																			</span>
																			<div>
																				<div className="text-sm text-gray-600">{item.created_at}</div>
																				<div className="text-xs text-gray-500 flex items-center">
																					<i className="fa fa-user mr-1"></i>
																					{item.pedido?.vendedor?.nombre}
																				</div>
																			</div>
																		</div>
																		<button 
																			className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors duration-150 text-sm"
																			data-id={item.id_pedido}
																			onClick={onClickEditPedido}
																			title="Ver pedido"
																		>
																			<i className="fa fa-eye mr-1"></i>
																			#{item.id_pedido}
																		</button>
																	</div>
																))}
															</div>
														</div>
													</div>
												)}

												{/* Devoluciones */}
												{devolucionesItems.length > 0 && (
													<div className="border border-red-200 rounded-lg">
														<button 
															className="w-full p-3 text-left bg-red-50 hover:bg-red-100 transition-colors duration-200 flex items-center justify-between rounded-t-lg"
															onClick={() => toggleSection(e.id, 'devoluciones')}
														>
															<div className="flex items-center space-x-2">
																<i className="fa fa-undo text-red-600"></i>
																<span className="font-semibold text-red-700">
																	Devoluciones ({devolucionesItems.length} pedidos - {devolucionesTotal} unidades)
																</span>
															</div>
															<i className={`fa transition-transform duration-200 ${
																expandedSections[`${e.id}-devoluciones`] ? 'fa-chevron-up' : 'fa-chevron-down'
															} text-red-600`}></i>
														</button>
														<div className={`transition-all duration-300 ease-in-out ${
															expandedSections[`${e.id}-devoluciones`] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
														} overflow-hidden`}>
															<div className="divide-y divide-gray-100">
																{devolucionesItems.map(item => (
																	<div key={item.id} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150">
																		<div className="flex items-center space-x-3">
																			<span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
																				{item.cantidad}
																			</span>
																			<div>
																				<div className="text-sm text-gray-600">{item.created_at}</div>
																				<div className="text-xs text-gray-500 flex items-center">
																					<i className="fa fa-user mr-1"></i>
																					{item.pedido?.vendedor?.nombre}
																				</div>
																			</div>
																		</div>
																		<button 
																			className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors duration-150 text-sm"
																			data-id={item.id_pedido}
																			onClick={onClickEditPedido}
																			title="Ver pedido"
																		>
																			<i className="fa fa-eye mr-1"></i>
																			#{item.id_pedido}
																		</button>
																	</div>
																))}
															</div>
														</div>
													</div>
												)}
											</div>
										</div>
										
										{/* Footer con acciones rápidas */}
										<div className="card-footer bg-light border-0">
											<div className="d-flex justify-content-between align-items-center">
												<small className="text-muted">
													<i className="fa fa-calculator me-1"></i>
													Total: {moneda(e.totalventa || 0)}
												</small>
												<div className="flex space-x-2">
													<button 
														className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors duration-150 text-sm"
														onClick={() => toggleAllSections(e.id)}
														title="Expandir/Contraer todo"
													>
														<i className="fa fa-expand-arrows-alt mr-1"></i>
														Toggle
													</button>
													<button 
														className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-md transition-colors duration-150 text-sm"
														onClick={() => {
															// Acción para nuevo pedido con este producto
															console.log('Nuevo pedido con producto:', e.id);
														}}
														title="Nuevo pedido con este producto"
													>
														<i className="fa fa-plus mr-1"></i>
														Nuevo
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="table-responsive">
						<table className="table table-hover">
							<tbody>
								{pedidos["fact"]?.map(e => e && (
									<tr 
										key={e.id}
										className={`${e.estado === 1 ? "table-success" : e.estado === 2 ? "table-danger" : "table-warning"} align-middle`}
										style={{
											backgroundColor: e.estado === 1 ? 'rgba(25, 135, 84, 0.1)' : 
															e.estado === 2 ? 'rgba(220, 53, 69, 0.1)' : 
															'rgba(255, 193, 7, 0.15)'
										}}
									>
										{/* ID y Estado */}
										<td style={{ width: "120px" }}>
											<div className="d-flex flex-column align-items-center">
												<button 
													className="btn btn-primary w-100 mb-1 shadow-sm"
													data-id={e.id} 
													onClick={onClickEditPedido}
												>
													<i className="fa fa-hashtag me-1"></i>
													{e.id}
												</button>
												<span className={`badge ${e.estado === 1 ? "bg-success" : 
																				e.estado === 2 ? "bg-danger" : 
																				"bg-warning text-dark"} w-100 shadow-sm`}>
													{e.estado === 1 ? "Procesado" : e.estado === 2 ? "Anulado" : "Pendiente"}
												</span>
											</div>
										</td>

										{/* Información del Vendedor y Fecha */}
										<td style={{ width: "200px" }}>
											<div className="d-flex flex-column">
												<div className="d-flex align-items-center mb-1">
													<i className="fa fa-user-circle text-primary me-2"></i>
													<span className="fw-bold text-dark">{e.vendedor?.nombre}</span>
												</div>
												<div className="d-flex align-items-center">
													<i className="fa fa-clock-o text-secondary me-2"></i>
													<small className="text-secondary">{e.created_at}</small>
												</div>
											</div>
										</td>

										{/* Información del Cliente */}
										<td style={{ width: "250px" }}>
											<div className="d-flex flex-column">
												<div className="d-flex align-items-center mb-1">
													<i className="fa fa-user text-primary me-2"></i>
													<span className="fw-bold text-dark">{e.cliente ? e.cliente.nombre : "Cliente General"}</span>
												</div>
												{e.export && (
													<div className="d-flex align-items-center">
														<i className="fa fa-check-circle text-success me-2"></i>
														<span className="text-success fw-bold">Exportado</span>
													</div>
												)}
											</div>
										</td>

										{/* Métodos de Pago */}
										<td style={{ width: "300px" }}>
											<div className="d-flex flex-wrap gap-2 justify-content-center">
												{e.pagos?.map(ee => (
													ee.monto !== 0 && (
														<span 
															key={ee.id}
															className={`badge ${ee.tipo == 1 ? "bg-info" : 
																				ee.tipo == 2 ? "bg-secondary" : 
																				ee.tipo == 3 ? "bg-success" : 
																				ee.tipo == 4 ? "bg-warning text-dark" : 
																				ee.tipo == 5 ? "bg-info" : 
																				"bg-danger"} p-2 shadow-sm`}
														>
															<i className={`fa ${ee.tipo == 1 ? "fa-exchange" : 
																				ee.tipo == 2 ? "fa-credit-card" : 
																				ee.tipo == 3 ? "fa-money" : 
																				ee.tipo == 4 ? "fa-calendar" : 
																				ee.tipo == 5 ? "fa-mobile" : 
																				"fa-ban"} me-1`}></i>
															{ee.tipo == 1 ? "Trans." : 
																ee.tipo == 2 ? "Deb." : 
																ee.tipo == 3 ? "Efec." : 
																ee.tipo == 4 ? "Cred." : 
																ee.tipo == 5 ? "Biopago" : 
																"Vuel."} {ee.monto}
														</span>
													)
												))}
											</div>
										</td>

										{/* Total y Items */}
										<td style={{ width: "150px" }}>
											<div className="d-flex flex-column align-items-center">
												<span className="h4 text-primary mb-1 fw-bold">{moneda(e.totales)}</span>
												<span className="badge bg-dark text-white shadow-sm">
													<i className="fa fa-shopping-cart me-1"></i>
													{e.items ? e.items.length : 0} items
												</span>
											</div>
										</td>

										{/* Acciones */}
										<td style={{ width: "180px" }}>
											<div className="d-flex gap-1 justify-content-center">
												<button 
													className="btn btn-primary shadow-sm" 
													data-id={e.id} 
													onClick={onClickEditPedido}
													title="Editar pedido"
												>
													<i className="fa fa-edit me-1"></i>
													Editar
												</button>
												<button 
													className="btn btn-outline-primary shadow-sm" 
													data-id={e.id} 
													onClick={getPedidoFast}
													title="Ver detalles"
												>
													<i className="fa fa-eye"></i>
												</button>
												<button 
													className="btn btn-outline-success shadow-sm" 
													onClick={() => toggleImprimirTicket(e.id)}
													title="Imprimir ticket"
												>
													<i className="fa fa-print"></i>
												</button>
												{auth(1) && (
													<button 
														className="btn btn-outline-danger shadow-sm" 
														data-id={e.id} 
														data-type="getPedidos" 
														onClick={onCLickDelPedido}
														title="Eliminar pedido"
													>
														<i className="fa fa-times"></i>
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{togleeReferenciasElec &&
				<RefsList
					settogleeReferenciasElec={settogleeReferenciasElec}
					togleeReferenciasElec={togleeReferenciasElec}
					moneda={moneda}
					refrenciasElecData={refrenciasElecData}
					onClickEditPedido={onClickEditPedido}
					getReferenciasElec={getReferenciasElec}
				/>
			}
		</div>
	);
}
export default Pedidos;