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


	try {
		return (
			<div className="container-fluid pe-5 ps-5">
				{showModalPedidoFast && <ModalShowPedidoFast
					pedidoData={pedidoData}
					showModalPedidoFast={showModalPedidoFast}
					setshowModalPedidoFast={setshowModalPedidoFast}
					onClickEditPedido={onClickEditPedido}
				/>}

				<div className="d-flex justify-content-center align-items-center">
					<div className="input-group cell4">
						<div className="input-group-prepend">
							<div className="radios d-flex mr-2">
								<div className={" m-1 pointer " + (tipoestadopedido == "todos" ? "select-fact bg-warning" : "select-fact")} onClick={() => setTipoestadopedido("todos")}>
									TODOS
								</div>
								<div className={" m-1 pointer " + (tipoestadopedido == 0 ? "select-fact bg-warning" : "select-fact")} onClick={() => setTipoestadopedido(0)}>
									PENDIENTE <i className="fa fa-clock-o"></i>
								</div>
								<div className={" m-1 pointer " + (tipoestadopedido == 1 ? "select-fact bg-success" : "select-fact")} onClick={() => setTipoestadopedido(1)}>
									PROCESADO <i className="fa fa-check"></i>
								</div>
								<div className={" m-1 pointer " + (tipoestadopedido == 2 ? "select-fact bg-danger" : "select-fact")} onClick={() => setTipoestadopedido(2)}>
									ANULADO <i className="fa fa-times"></i>
								</div>
							</div>
						</div>
					</div>
					<div className="input-group cell6">
						<div className="input-group-prepend">
							<div className="input-group-text">
								<div className="radios d-flex mr-2">
									<div className={" m-1 pointer " + (tipobusquedapedido == "fact" ? "select-fact bg-sinapsis" : "select-fact")} onClick={() => setTipoBusqueda("fact")}>
										FACTURA <i className="fa fa-search"></i>
									</div>
									<div className={" m-1 pointer " + (tipobusquedapedido == "prod" ? "select-fact bg-sinapsis" : "select-fact")} onClick={() => setTipoBusqueda("prod")}>
										PRODUCTO <i className="fa fa-search"></i>
									</div>
									<div className={" m-1 pointer " + (tipobusquedapedido == "cliente" ? "select-fact bg-sinapsis" : "select-fact")} onClick={() => setTipoBusqueda("cliente")}>
										CLIENTE <i className="fa fa-user"></i>
									</div>
								</div>
							</div>
						</div>

						<form onSubmit={getPedidos} className="form-control">

							<input className="form-control" placeholder="Buscar... #Factura, #Descripción, #Cliente" value={busquedaPedido} data-type="busquedaPedido" onChange={onChangePedidos} autoComplete="off" />
						</form>
						<input type="date" value={fecha1pedido} data-type="fecha1pedido" onChange={onChangePedidos} className="form-control" />
						<input type="date" value={fecha2pedido} data-type="fecha2pedido" onChange={onChangePedidos} className="form-control" />
						<i className="fa fa-reload" onClick={() => getPedidos()}></i>
					</div>
				</div>
				<div className="d-flex justify-content-between mt-2 mb-2 align-items-center">

					<div className="cell3 d-flex justify-content-between">
						<button className="btn btn-sinapsis fs-5 pointer" data-valor="id" onClick={clickSetOrderColumnPedidos}>
							{pedidos["fact"] ? pedidos["fact"].length : null}
							{/* {orderbycolumpedidos == "id" ? (<i className={(orderbyorderpedidos == "desc" ? "fa fa-arrow-up" : "fa fa-arrow-down") + " text-light"}></i>) : null} */}
						</button>
						<div className="input-group">
							<div className="btn-group">
								<button onClick={() => setshowMisPedido(true)} className={("btn btn-sm btn-outline-") + (!showMisPedido ? null : "success")}>Mis pedidos</button>
								{auth(1) ?
									<button onClick={() => setshowMisPedido(false)} className={("btn btn-sm btn-outline-") + (showMisPedido ? null : "success")}>Todos los pedidos</button>
								: null}

								<button className="btn btn-success" onClick={addNewPedido}><i className="fa fa-plus"></i></button>
							</div>
						</div>
					</div>

					<div className="cell4 d-flex align-items-center">
						<span className={(filterMetodoPagoToggle == "todos" ? "btn-dark" : "") + (" pointer btn")} data-type="todos" onClick={filterMetodoPago}>Todos</span>
						<span className={(filterMetodoPagoToggle == 1 ? "btn-info" : "") + (" btn")} data-type="1" onClick={filterMetodoPago}>Trans.</span>
						<span className={(filterMetodoPagoToggle == 2 ? "btn-secondary" : "") + (" btn")} data-type="2" onClick={filterMetodoPago}>Deb.</span>
						<span className={(filterMetodoPagoToggle == 3 ? "btn-success" : "") + (" btn")} data-type="3" onClick={filterMetodoPago}>Efec.</span>
						<span className={(filterMetodoPagoToggle == 4 ? "btn-warning" : "") + (" btn")} data-type="4" onClick={filterMetodoPago}>Cred.</span>
						<span className={(filterMetodoPagoToggle == 5 ? "btn-info" : "") + (" btn")} data-type="5" onClick={filterMetodoPago}>Biopago.</span>
						<span className={(filterMetodoPagoToggle == 6 ? "btn-danger" : "") + (" btn")} data-type="6" onClick={filterMetodoPago}>Vuel.</span>
						<span className="btn btn-success" onClick={() => settogleeReferenciasElec(true)}>REFs.</span>

						<span className="ms-4">
							<b className="fs-2 text-success pointer" data-valor="totales" onClick={clickSetOrderColumnPedidos}>{pedidos["totaltotal"]}</b>
							{orderbycolumpedidos == "totales" ? (<i className={(orderbyorderpedidos == "desc" ? "fa fa-arrow-up" : "fa fa-arrow-down") + " text-success"}></i>) : null}
						</span>

					</div>
				</div>

				<div className="mt-3">
					{tipobusquedapedido == "prod" ?
						<>
							{pedidos["prod"] ? pedidos["prod"].map(e =>
								e ?
									<div className="card-pedidos d-flex justify-content-between" key={e.id}>
										<div className="">
											<h1>
												<span className="badge btn-sinapsis">
													{e.cantidadtotal}
												</span>
											</h1>
											<h6 className=" mb-2 text-muted">{e.descripcion}</h6>
											<h6 className=" mb-2 text-muted">{e.codigo_proveedor}</h6>
											<h6 className=" mb-2 text-muted">{e.precio_base} / {e.precio}</h6>
										</div>
										<div className="w-50">
											<ul className="list-group">
												{e.items.map(ee =>
													<li className="list-group-item d-flex justify-content-between align-items-center" key={ee.id}>
														<span>{ee.cantidad}</span>
														<span className="text-muted mr-1">{ee.created_at}</span>
														<span className="badge btn-secondary badge-pill pointer"
															data-id={ee.id_pedido}
															onClick={onClickEditPedido}>Ped. {ee.id_pedido}</span>

													</li>

												)}
											</ul>

										</div>
									</div>
									: null
							) : null}
						</>
						: null}

					{tipobusquedapedido == "fact" || tipobusquedapedido == "cliente" ?
						<>

							{/* <div className="p-0 card-pedidos-header d-flex justify-content-between align-items-center">
								<div className="cell1">
									
								</div>
								<div className="cell2">
									
								</div>
							</div> */}

							<table className="table">
								<tbody>
									{pedidos["fact"] ? pedidos["fact"].map(e =>
										e ?
											<tr className={(e.estado==1 ? "bg-success-light" : (e.estado==2 ? "bg-danger-light" : "bg-sinapsis-light")  )} key={e.id}>
												<td className='cell05' data-id={e.id} onClick={onClickEditPedido} >
													<span className="btn btn-sm btn-secondary fs-3 w-100">
														{e.id}
													</span>
												</td>
												<td className='align-middle' data-id={e.id} onClick={onClickEditPedido} >
													<span className="text-muted text-left">
														{e.vendedor ? e.vendedor.nombre : null} {/* <i className="fa fa-undo pointer text-success" onClick={(event) => { setseletIdChangePedidoUserHandle(event, e.id) }}></i> */}
													</span>
													<br />
													<small className="text-muted font-size-12">{e.created_at}</small>
												</td>
												
													{/* 
													<td>
														{modalchangepedido ?
															<div className="modalchangepedido" style={{ top: modalchangepedidoy + 20, left: modalchangepedidox }}>
																<div className="w-100 btn mb-1 btn-sm">
																	<i className="fa fa-times text-danger" onClick={() => setmodalchangepedido(false)}></i>
																</div>
																<h5>Transferir a...</h5>
																<select
																	className={("form-control form-control-sm ")}
																	value={usuarioChangeUserPedido}
																	onChange={e => setusuarioChangeUserPedidoHandle((e.target.value))}
																>
																	<option value="">--Seleccione Usuario--</option>
																	{usuariosData.length ? usuariosData.filter(e => e.tipo_usuario == 4).map(e => <option value={e.id} key={e.id}>{e.id} - {e.usuario}</option>) : null}

																</select>
															</div>
															: null} 
													</td>
														*/}

												<td className='text-center align-middle' data-id={e.id} onClick={onClickEditPedido} >
													<div className="text-center">
														Cliente: <b>{e.cliente ? e.cliente.nombre : null}</b>
													</div>
													{e.export ? 
														<div className="text-center">
															<b>Exportado</b>
														</div> 
													: null}
												</td>

												<td data-id={e.id} onClick={onClickEditPedido} className='text-center align-middle'>
													<div className="d-flex justify-content-center">
														{e.pagos ? e.pagos.map(ee =>
															<span className="h4" key={ee.id}>
																{ee.monto != 0 && ee.tipo == 1 ?
																	<span className="btn btn-info fs-4">Trans. {ee.monto}</span>
																	: null}

																{ee.monto != 0 && ee.tipo == 2 ?
																	<span className="btn btn-secondary fs-4">Deb. {ee.monto}</span>
																	: null}

																{ee.monto != 0 && ee.tipo == 3 ?
																	<span className="btn btn-success fs-4">Efec. {ee.monto}</span>
																	: null}

																{ee.monto != 0 && ee.tipo == 4 ?
																	<span className="btn btn-sinapsis fs-4">Cred. {ee.monto}</span>
																	: null}

																{ee.monto != 0 && ee.tipo == 5 ?
																	<span className="btn btn-primary fs-4">Biopago {ee.monto}</span>
																	: null}

																{ee.monto != 0 && ee.tipo == 6 ?
																	<span className="btn btn-danger fs-4">Vuel. {ee.monto}</span>
																	: null}
															</span>
														) : null}
													</div>
												</td>
												<td className="text-center align-middle" data-id={e.id} onClick={onClickEditPedido}><b className="h3 text-success">{moneda(e.totales)}</b></td>
												<td className="text-muted text-center align-middle" data-id={e.id} onClick={onClickEditPedido}>
													<small>Items. {e.items ? e.items.length : null}</small>
												</td>
												<td className="text-center align-middle">
													<div className="btn-options btn-group w-100">
														<button className="btn btn-outline-success btn-sm" data-id={e.id} onClick={getPedidoFast}><i className="fa fa-eye"></i></button>
														<button className="btn btn-outline-sinapsis btn-sm" onClick={() => toggleImprimirTicket(e.id)}><i className="fa fa-print"></i></button>

														{auth(1) ? <button className="btn btn-outline-danger btn-sm" data-id={e.id} data-type="getPedidos" onClick={onCLickDelPedido}><i className="fa fa-times"></i></button> : null}
													</div>
												</td>
											</tr>

											: null
									) : null}
								</tbody>
							</table>


						</>
						: null}
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
		)
	} catch (err) {
		console.log("ped.", pedidos)
		console.log("err", err)
	}
}
export default Pedidos;