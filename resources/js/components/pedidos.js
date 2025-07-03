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
			<div className="row g-3 mb-4">
				<div className="col-md-12">
					<div className="card shadow-sm">
						<div className="card-body p-2">
							<div className="d-flex gap-2 justify-content-center align-items-center">
								<span className="text-muted me-2">
									<i className="fa fa-sort-amount-desc me-1"></i>
									Ordenar por monto:
								</span>
								<div className="btn-group">
									<button 
										className={`btn ${orderbyorderpedidos === "desc" ? "btn-primary" : "btn-outline-primary"}`}
										onClick={() => setorderbyorderpedidos("desc")}
										title="Mayor a menor"
									>
										<i className="fa fa-sort-numeric-desc me-1"></i>
										Mayor a menor
									</button>
									<button 
										className={`btn ${orderbyorderpedidos === "asc" ? "btn-primary" : "btn-outline-primary"}`}
										onClick={() => setorderbyorderpedidos("asc")}
										title="Menor a mayor"
									>
										<i className="fa fa-sort-numeric-asc me-1"></i>
										Menor a mayor
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Lista de Pedidos */}
			<div className="mt-4">
				{tipobusquedapedido === "prod" ? (
					<div className="row g-3">
						{pedidos["prod"]?.map(e => e && (
							<div className="col-md-6 col-lg-4" key={e.id}>
								<div className="card h-100 shadow-sm">
									<div className="card-body">
										<div className="d-flex justify-content-between align-items-start mb-3">
											<h5 className="card-title mb-0">
												<span className="badge bg-primary fs-5">{e.cantidadtotal}</span>
											</h5>
											<div className="text-end">
												<h6 className="text-dark mb-1">{e.descripcion}</h6>
												<small className="text-muted">{e.codigo_proveedor}</small>
											</div>
										</div>
										<div className="d-flex justify-content-between align-items-center">
											<span className="text-dark">{e.precio_base} / {e.precio}</span>
										</div>
										<ul className="list-group list-group-flush mt-3">
											{e.items.map(ee => (
												<li className="list-group-item d-flex justify-content-between align-items-center" key={ee.id}>
													<span className="text-dark">{ee.cantidad}</span>
													<span className="text-muted">{ee.created_at}</span>
													<button 
														className="btn btn-sm btn-primary"
														data-id={ee.id_pedido}
														onClick={onClickEditPedido}
													>
														Ped. {ee.id_pedido}
													</button>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="table-responsive">
						<table className="table table-hover">
							<tbody>
								{pedidos["fact"]?.sort((a, b) => {
									if (orderbyorderpedidos === "desc") {
										return b.totales - a.totales;
									} else if (orderbyorderpedidos === "asc") {
										return a.totales - b.totales;
									}
									return 0;
								}).map(e => e && (
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