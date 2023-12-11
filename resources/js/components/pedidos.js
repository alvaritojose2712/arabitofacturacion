import {useState, useEffect} from 'react';

import ModalShowPedidoFast from '../components/ModalShowPedidoFast';

function Pedidos({
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

	useEffect(()=>{
		getReferenciasElec()
	},[
		togleeReferenciasElec
	])
	try{
		return (
			<div className="container">
				{showModalPedidoFast&&<ModalShowPedidoFast
					pedidoData={pedidoData}
					showModalPedidoFast={showModalPedidoFast}
					setshowModalPedidoFast={setshowModalPedidoFast}
					onClickEditPedido={onClickEditPedido}
				/>}

        <div className="d-flex justify-content-center align-items-center">
					<div className="input-group cell2">
					  <div className="input-group-prepend">
							<div className="radios d-flex mr-2">
								<div className={" m-1 pointer "+(tipoestadopedido=="todos"?"select-fact bg-warning":"select-fact")} onClick={()=>setTipoestadopedido("todos")}>
									Todos <i className="fa fa-clock-o"></i>
								</div>
								<div className={" m-1 pointer "+(tipoestadopedido==0?"select-fact bg-warning":"select-fact")} onClick={()=>setTipoestadopedido(0)}>
									Pend. <i className="fa fa-clock-o"></i>
								</div>
								<div className={" m-1 pointer " + (tipoestadopedido==1?"select-fact bg-success":"select-fact")} onClick={()=>setTipoestadopedido(1)}>
									Procs. <i className="fa fa-check"></i> 
								</div>
							</div>
						</div>
					</div>
					<div className="input-group cell8">
					  <div className="input-group-prepend">
              <div className="input-group-text">
                <div className="radios d-flex mr-2">
                  <div className={" m-1 pointer "+(tipobusquedapedido=="fact"?"select-fact bg-sinapsis":"select-fact")} onClick={()=>setTipoBusqueda("fact")}>
                    Fact. <i className="fa fa-search"></i>
                  </div>
                  <div className={" m-1 pointer " + (tipobusquedapedido=="prod"?"select-fact bg-sinapsis":"select-fact")} onClick={()=>setTipoBusqueda("prod")}>
                    Prod. <i className="fa fa-search"></i> 
                  </div>
                  <div className={" m-1 pointer " + (tipobusquedapedido=="cliente"?"select-fact bg-sinapsis":"select-fact")} onClick={()=>setTipoBusqueda("cliente")}>
                    Clien. <i className="fa fa-user"></i> 
                  </div>
                </div>
              </div>
	          </div>

	          <form onSubmit={getPedidos} className="form-control">
	          	
	          	<input className="form-control" placeholder="Buscar... #Factura, #Descripción, #Cliente" value={busquedaPedido} data-type="busquedaPedido" onChange={onChangePedidos} autoComplete="off" />
	          </form>
	          <input type="date" value={fecha1pedido} data-type="fecha1pedido" onChange={onChangePedidos} className="form-control" />
	          <input type="date" value={fecha2pedido} data-type="fecha2pedido" onChange={onChangePedidos} className="form-control" />
						<i className="fa fa-reload" onClick={()=>getPedidos()}></i>
					</div>
				</div>
				<div className="d-flex justify-content-between mt-2 mb-2">
					<div className="input-group cell3">
	      		<div className="btn-group">
	      			<button onClick={()=>setshowMisPedido(true)} className={("btn btn-sm btn-outline-")+(!showMisPedido?null:"success")}>Mis pedidos</button>
					{auth(1)?
	      				<button onClick={()=>setshowMisPedido(false)} className={("btn btn-sm btn-outline-")+(showMisPedido?null:"success")}>Todos los pedidos</button>
					:null}

					<button className="btn btn-success" onClick={addNewPedido}><i className="fa fa-plus"></i></button>
	      		</div>
	      	</div>
					<div className="cell4">
						<span className={(filterMetodoPagoToggle=="todos"?"btn-dark":"")+(" pointer btn")} data-type="todos" onClick={filterMetodoPago}>Todos</span>
						<span className={(filterMetodoPagoToggle==1?"btn-info":"")+(" btn")} data-type="1" onClick={filterMetodoPago}>Trans.</span>
						<span className={(filterMetodoPagoToggle==2?"btn-secondary":"")+(" btn")} data-type="2" onClick={filterMetodoPago}>Deb.</span>
						<span className={(filterMetodoPagoToggle==3?"btn-success":"")+(" btn")} data-type="3" onClick={filterMetodoPago}>Efec.</span>
						<span className={(filterMetodoPagoToggle==4?"btn-warning":"")+(" btn")} data-type="4" onClick={filterMetodoPago}>Cred.</span>
						<span className={(filterMetodoPagoToggle==5?"btn-info":"")+(" btn")} data-type="5" onClick={filterMetodoPago}>Biopago.</span>
						<span className={(filterMetodoPagoToggle==6?"btn-danger":"")+(" btn")} data-type="6" onClick={filterMetodoPago}>Vuel.</span>															
						<span className="btn btn-success" onClick={()=>settogleeReferenciasElec(true)}>REFs.</span>															
					</div>
				</div>

				<div className="m-3">
					{tipobusquedapedido=="prod"?
						<>
							{pedidos["prod"]?pedidos["prod"].map(e=>
								e?
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
								    		{e.items.map(ee=>
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
								:null
							):null}	
						</>
					:null}

					{tipobusquedapedido=="fact"||tipobusquedapedido=="cliente"?
						<>
									
							<div className="p-0 card-pedidos-header d-flex justify-content-between align-items-center">
								<div className="cell1">
									<span className="badge btn-sinapsis fs-2 pointer" data-valor="id" onClick={clickSetOrderColumnPedidos}>
									{pedidos["fact"]?pedidos["fact"].length:null}
									</span>
										{orderbycolumpedidos=="id"?(<i className={(orderbyorderpedidos=="desc"?"fa fa-arrow-up":"fa fa-arrow-down")+" text-sinapsis"}></i>):null}
								</div>
								<div className="cell2">
									<b className="fs-2 text-success pointer" data-valor="totales" onClick={clickSetOrderColumnPedidos}>{pedidos["totaltotal"]}</b>
									{orderbycolumpedidos=="totales"?(<i className={(orderbyorderpedidos=="desc"?"fa fa-arrow-up":"fa fa-arrow-down")+" text-success"}></i>):null}
								</div>
							</div>
							{pedidos["fact"]?pedidos["fact"].map(e=>
								e?
									<div className={("card-pedidos ")+(e.estado?"":"bg-sinapsis-light")} key={e.id}>
											
										<div className="cell1 pointer"/*  data-id={e.id} onClick={onClickEditPedido} */>
											
											<h3>
												<span className="btn btn-sm btn-secondary">
													{e.id}
												</span>
											</h3>
											<span className="text-muted text-left">
									    		{e.vendedor?e.vendedor.nombre:null} <i className="fa fa-undo pointer text-success" onClick={(event)=>{setseletIdChangePedidoUserHandle(event,e.id)}}></i>
									    	</span>
											{modalchangepedido?
												<div className="modalchangepedido" style={{top:modalchangepedidoy+20,left:modalchangepedidox}}>
													<div className="w-100 btn mb-1 btn-sm">
														<i className="fa fa-times text-danger" onClick={()=>setmodalchangepedido(false)}></i>
													</div>
													<h5>Transferir a...</h5>
													<select
														className={("form-control form-control-sm ")}
														value={usuarioChangeUserPedido}
														onChange={e => setusuarioChangeUserPedidoHandle((e.target.value))}
													>
														<option value="">--Seleccione Usuario--</option>
														{usuariosData.length?usuariosData.filter(e=>e.tipo_usuario==4).map(e => <option value={e.id} key={e.id}>{e.id} - {e.usuario}</option>):null}
														
													</select>
												</div>
											:null}
									    <br/>
									    <small className="text-muted font-size-12">{e.created_at}</small>
										</div>
										<div className="cell5 pointer" data-id={e.id} onClick={onClickEditPedido}>
					    				<div className="d-flex justify-content-center">
					    					{e.pagos?e.pagos.map(ee=>
					    						<span className="h4" key={ee.id}>
						    						{ee.monto!=0&&ee.tipo==1?
						    							<span className="btn btn-info btn-sm">Trans. {ee.monto}</span>
						    						:null}

						    						{ee.monto!=0&&ee.tipo==2?
						    							<span className="btn btn-secondary btn-sm">Deb. {ee.monto}</span>
						    						:null}

						    						{ee.monto!=0&&ee.tipo==3?
						    							<span className="btn btn-success btn-sm">Efec. {ee.monto}</span>
						    						:null}

						    						{ee.monto!=0&&ee.tipo==4?
						    							<span className="btn btn-sinapsis btn-sm">Cred. {ee.monto}</span>
						    						:null}

						    						{ee.monto!=0&&ee.tipo==5?
						    							<span className="btn btn-primary btn-sm">Biopago {ee.monto}</span>
						    						:null}

						    						{ee.monto!=0&&ee.tipo==6?
						    							<span className="btn btn-danger btn-sm">Vuel. {ee.monto}</span>
						    						:null}
					    						</span>
					    					):null}
					    				</div>
					    				<div className="text-center">
					    					Cliente: <b>{e.cliente?e.cliente.nombre:null}</b>
					    				</div>
											{e.export?<div className="text-center">
												<b>Exportado</b>
											</div>:null}
					    			</div>
					    			<div className="cell4">
										  <table className="table table-sm">
								    		<tbody>
								    			<tr>
								    				<td className="cell6" data-id={e.id} onClick={onClickEditPedido}><b className="h3 text-success">{moneda(e.totales)}</b></td>
											    	<td className="text-muted cell1" data-id={e.id} onClick={onClickEditPedido}>
											    		<small>Items. {e.items?e.items.length:null}</small>
											    	</td>
											    	<td className="cell3">
															<div className="btn-options btn-group">
																<button className="btn btn-outline-success btn-sm" data-id={e.id} onClick={getPedidoFast}><i className="fa fa-eye"></i></button>
																<button className="btn btn-outline-sinapsis btn-sm" onClick={() => toggleImprimirTicket(e.id)}><i className="fa fa-print"></i></button>
																
																{auth(1)?<button className="btn btn-outline-danger btn-sm" data-id={e.id} data-type="getPedidos" onClick={onCLickDelPedido}><i className="fa fa-times"></i></button>:null}
															</div>
											    	</td>
								    				
								    			</tr>
								    			
								    		</tbody>
								    	</table>
					    			</div>
												
									</div>
								:null
							):null}	
						</>
					:null}
				</div>


				{togleeReferenciasElec&&
					 <>
					 <section className="modal-custom"> 
					   <div className="text-danger" onClick={()=>settogleeReferenciasElec(false)}><span className="closeModal">&#10006;</span></div>
					   <div className="modal-content-sm modal-cantidad">
						 <table className="table">
							<thead>
								<tr>
									<th>USUARIO</th>
									<th>PEDIDO</th>
									<th>TIPO</th>
									<th>REF</th>
									<th>BANCO</th>
									<td className='text-success'>TOT. MONTO <b>{moneda(refrenciasElecData.total)}</b></td>
									<th>HORA</th>
								</tr>
							</thead>
							<tbody>
								{refrenciasElecData.refs?refrenciasElecData.refs.map(e=>
									<tr key={e.id}>
										<td>{e.vendedorUser}</td>
										<td> <button className="btn btn-success" onClick={()=>onClickEditPedido(null,e.id_pedido)}>{e.id_pedido}</button></td>
										<td>
											{e.tipo==1&&e.monto!=0?<span className="btn-sm btn-info btn">Trans.</span>:null}
											{e.tipo==2&&e.monto!=0?<span className="btn-sm btn-secondary btn">Deb. </span>:null}
											{e.tipo==5&&e.monto!=0?<span className="btn-sm btn-secondary btn">Biopago. </span>:null}	
										</td>
										<td>{e.descripcion}</td>
										<td>{e.banco}</td>
										<td>{moneda(e.monto)}</td>
										<td>{e.created_at}</td>
									</tr>	
								):null}
							</tbody>
						 </table>
					   </div>
					 </section>
					 <div className="overlay"></div>
				   </>
				}
			</div>
		)
	}catch(err){
		console.log("ped.",pedidos)
		console.log("err",err)
	}
}
export default Pedidos;