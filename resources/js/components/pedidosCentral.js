import React, { useState, useEffect } from 'react';

import Modalmovil from "./modalmovil";

export default function PedidosCentralComponent({
	socketUrl,
	setSocketUrl,
	setInventarioFromSucursal,
	getInventarioFromSucursal,
	getPedidosCentral,
	selectPedidosCentral,
	checkPedidosCentral,

	pedidosCentral,
	setIndexPedidoCentral,
	indexPedidoCentral,
	moneda,

	showaddpedidocentral,
	setshowaddpedidocentral,
	valheaderpedidocentral,
	setvalheaderpedidocentral,
	valbodypedidocentral,
	setvalbodypedidocentral,
	procesarImportPedidoCentral,

	pathcentral,
	setpathcentral,
	mastermachines,
	getmastermachine,

	setinventarioModifiedCentralImport,
	inventarioModifiedCentralImport,
	saveChangeInvInSucurFromCentral,

	getTareasCentral,
	settareasCentral,
	tareasCentral,
	runTareaCentral,

	modalmovilRef,
	modalmovilx,
	modalmovily,
	setmodalmovilshow,
	modalmovilshow,
	getProductos,
	productos,
	linkproductocentralsucursal,
	inputbuscarcentralforvincular,
	openVincularSucursalwithCentral,
	idselectproductoinsucursalforvicular,
	removeVinculoCentral,
	sucursalesCentral,

	qpedidoscentralq,
	setqpedidoscentralq,
	qpedidocentrallimit,
	setqpedidocentrallimit,
	qpedidocentralestado,
	setqpedidocentralestado,
	qpedidocentralemisor,
	setqpedidocentralemisor,
	getSucursales,
}){

	const [subviewcentral, setsubviewcentral] = useState("pedidos")
	const [showdetailsPEdido, setshowdetailsPEdido] = useState(false)
	const [showCorregirDatos, setshowCorregirDatos] = useState(null)
	const [buscarDatosFact, setbuscarDatosFact] = useState("")
	const [ismovil, setismovil] = useState(window.innerWidth <= 768)
	
	useEffect(() => {
		const handleResize = () => {
			setismovil(window.innerWidth <= 768)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])
	
	try {
		return (
			<div className="container-fluid">

			{modalmovilshow ? (
                <Modalmovil
					margin={100}
                    modalmovilRef={modalmovilRef}
                    x={modalmovilx}
                    y={modalmovily}
                    setmodalmovilshow={setmodalmovilshow}
                    modalmovilshow={modalmovilshow}
                    getProductos={getProductos}
                    productos={productos}
                    linkproductocentralsucursal={linkproductocentralsucursal}
                    inputbuscarcentralforvincular={inputbuscarcentralforvincular}
                />
            ) : null}

				<div className="btn-group mb-2">
					<button className={subviewcentral == "pedidos" ? ("btn btn-outline-sinapsis") : ("btn btn-outline-secondary")} onClick={() => { getPedidosCentral(); setsubviewcentral("pedidos") }}>Recibir Pedidos</button>
					<button className={subviewcentral == "tareas" ? ("btn btn-outline-sinapsis") : ("btn btn-outline-secondary")} onClick={() => { setsubviewcentral("tareas") }}>Tareas</button>
					{/* <button className={subviewcentral == "inventario" ? ("btn btn-outline-sinapsis") : ("btn btn-outline-secondary")} onClick={() => { getInventarioFromSucursal(); setsubviewcentral("inventario") }}>Actualizar Inventario</button>
 */}
				</div>
				{subviewcentral == "tareas" ?
					<>
						<h1>Tareas <button className="btn btn-outline-success btn-sm" onClick={()=>getTareasCentral([0])}> <i className="fa fa-search"></i>	</button></h1>
						<button className="btn btn-sinapsis" onClick={()=>runTareaCentral()}>RESOLVER TODO</button>
						<div className="row">

							<div className="col">
								
								<div>
									{
										tareasCentral.length
											? tareasCentral.map((e,i) =>
												e ?
													<div
														key={e.id}
														className={("bg-light text-secondary") + " card mt-2 pointer"}>
														<div className="card-body flex-row justify-content-between">
															<div>
																<h4>Destino <button className="btn btn-secondary">{e.sucursal.nombre}</button> </h4>
																<small className="text-muted fst-italic">Acción</small> <br />
																<small className="text-muted fst-italic">
																	<b>
																		{e.tipo==1?"MODIFICAR":null}
																		{e.tipo==2?"ELIMINAR DUPLICADOS":null}
																	</b> 
																</small>
																<br />
																<small className="text-muted fst-italic">FECHA</small> <br />
																<small className="text-muted fst-italic"><b>{e.created_at}</b> </small>
																<br />
																{e.prodantesproducto?
																<>


																	<small className="text-success fst-italic">Hay respuesta por resolver</small> 
																	<table className="table">
																		<thead>
																			<tr>
																				<td>id</td>
																				<td>codigo_proveedor</td>
																				<td>codigo_barras</td>
																				<td>descripcion</td>
																				<td>cantidad</td>
																				<td>stockmax</td>
																				<td>stockmin</td>
																				<td>unidad</td>
																				<td>id_categoria</td>
																				<td>id_proveedor</td>
																				<td>precio</td>
																				<td>precio_base</td>
																				<td>iva</td>
																				<td>INV</td>
																			</tr>
																		</thead>
																		<tbody key={e.id}>	
																			{e["prodantesproducto"]?
																				<tr className='bg-danger-light'>
																					<td>{e["prodantesproducto"].id}</td>
																					
																					<td>{e["prodantesproducto"].codigo_proveedor}</td>
																					<td>{e["prodantesproducto"].codigo_barras}</td>
																					<td>{e["prodantesproducto"].descripcion}</td>
																					<td>{e["prodantesproducto"].cantidad}</td>
																					<td>{e["prodantesproducto"].stockmax}</td>
																					<td>{e["prodantesproducto"].stockmin}</td>
																					<td>{e["prodantesproducto"].unidad}</td>
																					<td>{e["prodantesproducto"].id_categoria}</td>
																					<td>{e["prodantesproducto"].id_proveedor}</td>
																					<td>{e["prodantesproducto"].precio}</td>
																					<td>{e["prodantesproducto"].precio_base}</td>
																					<td>{e["prodantesproducto"].iva}</td>
																					<td>{e["prodantesproducto"].push}</td>
																					
																				</tr>
																			:null}
																			{e["prodcambiarproducto"]?
																				<tr className='bg-success-light'>
																					<td>{e["prodcambiarproducto"].id}</td>
																				
																					<td>{e["prodcambiarproducto"].codigo_proveedor}</td>
																					<td>{e["prodcambiarproducto"].codigo_barras}</td>
																					<td>{e["prodcambiarproducto"].descripcion}</td>
																					<td>{e["prodcambiarproducto"].cantidad}</td>
																					<td>{e["prodcambiarproducto"].stockmax}</td>
																					<td>{e["prodcambiarproducto"].stockmin}</td>
																					<td>{e["prodcambiarproducto"].unidad}</td>
																					<td>{e["prodcambiarproducto"].id_categoria}</td>
																					<td>{e["prodcambiarproducto"].id_proveedor}</td>
																					<td>{e["prodcambiarproducto"].precio}</td>
																					<td>{e["prodcambiarproducto"].precio_base}</td>
																					<td>{e["prodcambiarproducto"].iva}</td>
																					<td>{e["prodcambiarproducto"].push}</td>
																					
																				</tr>
																			:null}
																		</tbody>
																	</table>


																</>
																:null}
															</div>
														</div>

													</div>
													: null
											)
											: <div className='h3 text-center text-dark mt-2'><i>¡Sin resultados!</i></div>

									}
								</div>
							</div>
						</div>
					</>
					: null}
				{subviewcentral == "pedidos" ?
					<>
						<h1>TRANSFERENCIAS</h1>
						
						<div className="row">

							<div className="col-md-3 col-sm-12 table-responsive">
								<form onSubmit={event=>{event.preventDefault();getPedidosCentral()}} className='mb-2'>
									<div className="input-group">
										<input type="text" className="form-control" placeholder='Número de Transferencia...' value={qpedidoscentralq} onChange={e => setqpedidoscentralq(e.target.value)} />
										<select className="form-control" value={qpedidocentrallimit} onChange={e => setqpedidocentrallimit(e.target.value)}>
											<option value="">-RESULTADOS-</option>
											<option value="5">5 (Carga SúperRápida)</option>
											<option value="10">10 (Carga Rápida)</option>
											<option value="20">20 (Carga Media)</option>
											<option value="50">50 (Carga Lenta)</option>
											<option value="100">100 (Carga SúperLenta)</option>
										</select>
									</div>
									<div className="input-group">
										<select className="form-control" value={qpedidocentralestado} onChange={e => setqpedidocentralestado(e.target.value)}>
											<option value="">-SELECCIONE ESTADO-</option>
											<option value="1">PENDIENTE</option>
											<option value="3">EN REVISIÓN</option>
											<option value="4">REVISADO</option>
										</select>
										<select className="form-control" value={qpedidocentralemisor} onChange={e => setqpedidocentralemisor(e.target.value)}>
											<option value="">-EMISOR-</option>
											{sucursalesCentral.map(e =>
												<option value={e.id} key={e.id}>
													{e.nombre}
												</option>
											)}
										</select>
										<button className="btn btn-outline-secondary btn-sm" onClick={getSucursales}><i className="fa fa-search"></i> SUCS</button>

									</div>
									<div className="input-group mt-2">
										<button className="btn btn-outline-success w-100" onClick={()=>getPedidosCentral()}><i className="fa fa-search"></i> TRANSFERENCIAS</button>
									</div>

								</form>

								<div>
									{
										pedidosCentral.length
											? pedidosCentral.map((e, i) =>
												e ?
													<>
														<div onClick={() => setIndexPedidoCentral(i)} data-index={i} key={e.id} className=' row p-0 pointer hover'>
															<div 
																className={
																	(e.estado==1? "bg-danger text-light":
																		e.estado==3? "bg-warning text-dark":
																			e.estado==4? "bg-info text-light":"") + (" col-1 fs-3")
																}
															>
																	{/* {
																	e.estado==1? "PENDIENTE":
																		e.estado==3? "EN REVISIÓN":
																			e.estado==4? "REVISADO":null
																	} */}
																	{
																	e.estado==1? "":
																		e.estado==3? "":
																			e.estado==4? "":null
																	}

															</div>
															<div className="col">
																<div className="row">
																	<div className="col">
																		<div className={(indexPedidoCentral == i ? "" : "text-secondary") + " d-flex justify-content-between align-items-center w-100 mt-3"}>
																			
																			<button className="btn btn-secondary">#{e.id}</button> <button className="btn" style={{backgroundColor:e.origen.background}}>{e.origen.codigo}</button>
																			<span className="text-muted fst-italic fs-6 ms-1">ITEMS <b>{e.items.length}</b> </span>
																		</div>
																	</div>
																</div>
																<div className="row">
																	<div className="col">
																		<div className="d-flex justify-content-between p-1 fw-bold">
																			<span className='text-sinapsis'>{e.cxp?"FACT "+e.cxp.numfact:null}</span> - <span>{e.cxp?e.cxp.proveedor.descripcion.substr(0,15):null}</span>
																		</div>
																	</div>
																</div>
																<div className="row">
																	<div className="col">
																		<div className='text-center w-100'>
																			<small className="text-muted fst-italic text-center"><b>{e.created_at}</b> </small>
																		</div>
																	</div>
																</div>
															</div>
														</div>
														<hr />
													</>

													: null
											)
											: <div className='h3 text-center text-dark mt-2'><i>¡Sin resultados!</i></div>

									}
								</div>
							</div>
							{!showaddpedidocentral ?
								<div className="col-md-9 col-sm-12 table-responsive">
									{indexPedidoCentral !== null && pedidosCentral ?
										pedidosCentral[indexPedidoCentral] ?
											<div className="d-flex justify-content-between border p-1">
												<div className="w-50">
													<div>
														<small className="text-muted fst-italic">{pedidosCentral[indexPedidoCentral].created_at}</small>
													</div>
													<div className="d-flex align-items-center">
														<span className="fs-3 fw-bold"></span>
														<span className="btn btn-secondary m-1" onClick={()=>setshowdetailsPEdido(!showdetailsPEdido)}>{pedidosCentral[indexPedidoCentral].id}</span>

													</div>
												</div>
												<div className="w-50 text-right">
													<span>
														<span className="h6 text-muted font-italic">Base. </span>
														<span className="h6 text-sinapsis">{moneda(pedidosCentral[indexPedidoCentral].base)}</span>
													</span>
													<br />

													<span>
														<span className="h6 text-muted font-italic">Venta. </span>
														<span className="h3 text-success">{moneda(pedidosCentral[indexPedidoCentral].venta)}</span>
													</span>

													<br /><span className="h6 text-muted">Items. <b>{pedidosCentral[indexPedidoCentral].items.length}</b></span>
												</div>
											</div>
											: null
										: null}
									{
										showdetailsPEdido?
											<>	

											<table className="table">
												<tbody>

													{
														indexPedidoCentral !== null && pedidosCentral ?
														pedidosCentral[indexPedidoCentral] ?
															pedidosCentral[indexPedidoCentral].items.map((e, i) =>
																<tr>
																	<th><small className='text-muted'>{pedidosCentral[indexPedidoCentral].origen.codigo}</small></th>
																<th className="align-middle fs-4">
																	<span className={(typeof (e.ct_real) != "undefined" ? "" : null)}>{e.cantidad.toString().replace(/\.00/, "")}</span>
																</th>
																<td className="align-top">
																	{e.producto.codigo_barras?
																		e.producto.codigo_barras:
																		null
																	}
																</td>

																<td>

																	{e.producto.codigo_proveedor?
																		e.producto.codigo_proveedor:
																		null
																	}
																</td>
																<td className="align-top">{e.producto.descripcion} </td>
																<td className="align-top text-sinapsis">{moneda(e.producto.precio_base)}</td>
																<td className="align-top text-success">{moneda(e.producto.precio)}</td>
																<td className="align-top text-right">{moneda(e.monto)}</td>
																</tr>
															)		
															: null
														: null
													}
												</tbody>

											</table>

											</>
										:null
									}




									<input type="text" className="form-control fs-2" placeholder='Buscar PRODUCTO EN FACTURA, ESCANEAR...' value={buscarDatosFact} onChange={event=>setbuscarDatosFact(event.target.value)} />	
									{ismovil?
										<div >
											<div className="table-responsive">
												{!ismovil &&
													<div className="d-flex fw-bold border-bottom py-2">
														<div className="col"><small><span className="text-muted">Verificar</span></small></div>
														<div className="col">ID ITEM</div>
														<div className="col">BARRAS</div>
														<div className="col">ALTERNO</div>
														<div className="col">DESCRIPCIÓN</div>
														<div className="col bg-ct">CANTIDAD</div>
													{/* 	<div className="col bg-basefact">BASE F</div> */}
														<div className="col bg-base">BASE</div>
														<div className="col bg-venta">VENTA</div>
														<div className="col text-right">SUBTOTAL</div>
													</div>
												}

											</div>
												{indexPedidoCentral !== null && pedidosCentral ?
													pedidosCentral[indexPedidoCentral] ?
														pedidosCentral[indexPedidoCentral].items.map((e, i) =>
															
															pedidosCentral[indexPedidoCentral].items.filter(fil=>{
																if (!buscarDatosFact) {return true}
																else{
																	return (fil.producto.codigo_barras?(fil.producto.codigo_barras).toLowerCase().indexOf((buscarDatosFact).toLowerCase()) != -1:false) || 
																	(fil.producto.codigo_proveedor?(fil.producto.codigo_proveedor).toLowerCase().indexOf((buscarDatosFact).toLowerCase()) != -1:false) ||
																	(fil.producto.descripcion?(fil.producto.descripcion).toLowerCase().indexOf((buscarDatosFact).toLowerCase()) != -1:false)
																}
															}).filter(ee=>ee.id==e.id).length
															?
															<>
															
																
																<div key={e.id} className="mb-3 border rounded p-2 bg-light">
																	{e.super != 1?
																	
																		e.vinculo_sugerido && (
																		<div className="mb-2">
																			{e.vinculo_real && (
																			<button className="btn btn-warning btn-sm fs-10px">
																				{e.vinculo_real} <i className="fa fa-link"></i>
																			</button>
																			)}
																			<div className="small text-muted">Sugerido: {e.vinculo_sugerido.descripcion}</div>
																			<div><strong>Barras:</strong> {e.vinculo_sugerido.codigo_barras}</div>
																			<div><strong>Proveedor:</strong> {e.vinculo_sugerido.codigo_proveedor}</div>
																		</div>
																		)

																	:null}


																	<div className="d-flex justify-content-between align-items-center mb-2">
																	<div>
																		{typeof (e.aprobado) === "undefined" ? (
																		<button
																			onClick={selectPedidosCentral}
																			data-index={i}
																			data-tipo="select"
																			className="btn btn-outline-danger btn-sm"
																		>
																			<i className="fa fa-times"></i> {i + 1}
																		</button>
																		) : e.aprobado ? (
																		<button
																			onClick={selectPedidosCentral}
																			data-index={i}
																			data-tipo="select"
																			className="btn btn-outline-success btn-sm"
																		>
																			<i className="fa fa-check"></i> {i + 1}
																		</button>
																		) : null}
																	</div>
																	<i
																		className="fa fa-question text-warning"
																		onClick={() => setshowCorregirDatos(showCorregirDatos !== i ? i : null)}
																	></i>
																	</div>

																	<div className="mb-2">
																	<strong>Barras:</strong> {e.producto.codigo_barras || <small className="text-muted">nuevo</small>}
																	{showCorregirDatos === i && (
																		<>
																		<br />
																		<input
																			className="form-control form-control-sm mt-1"
																			type="text"
																			value={e.barras_real || ""}
																			data-index={i}
																			data-tipo="changebarras_real"
																			onChange={selectPedidosCentral}
																			placeholder="Corregir Barras..."
																		/>
																		</>
																	)}
																	</div>

																	<div className="mb-2">
																	<strong>Proveedor:</strong> {e.producto.codigo_proveedor || <small className="text-muted">nuevo</small>}
																	{showCorregirDatos === i && (
																		<>
																		<br />
																		<input
																			className="form-control form-control-sm mt-1"
																			type="text"
																			value={e.alterno_real || ""}
																			data-index={i}
																			data-tipo="changealterno_real"
																			onChange={selectPedidosCentral}
																			placeholder="Corregir Alterno..."
																		/>
																		</>
																	)}
																	</div>

																	<div className="mb-2">
																	<strong>Descripción:</strong> {e.producto.descripcion}
																	<small className="text-muted ms-2">{pedidosCentral[indexPedidoCentral].origen.codigo}</small>
																	{showCorregirDatos === i && (
																		<>
																		<br />
																		<input
																			className="form-control form-control-sm mt-1"
																			type="text"
																			value={e.descripcion_real || ""}
																			data-index={i}
																			data-tipo="changedescripcion_real"
																			onChange={selectPedidosCentral}
																			placeholder="Corregir Descripción..."
																		/>
																		</>
																	)}
																	</div>

																	<div className="mb-2">
																	<strong>Cantidad:</strong> {e.cantidad}
																	{showCorregirDatos === i && (
																		<>
																		<br />
																		<input
																			className="form-control form-control-sm mt-1"
																			type="text"
																			value={e.ct_real || ""}
																			data-index={i}
																			data-tipo="changect_real"
																			onChange={selectPedidosCentral}
																			placeholder="Corregir Ct..."
																		/>
																		</>
																	)}
																	</div>

																	<div className="mb-2 text-sinapsis"><strong>Base:</strong> {moneda(e.base)}</div>
																	<div className="mb-2 text-success"><strong>Venta:</strong> {moneda(e.venta)}</div>
																	<div className="mb-2 text-end"><strong>Monto:</strong> {moneda(e.monto)}</div>

																	{e.super === 1 && (
																	<div className="text-center p-2 mt-3" style={{
																		background: "linear-gradient(45deg, rgb(255, 215, 0), rgb(255, 165, 0))",
																		color: "#000",
																		fontStyle: "italic"
																	}}>
																		<i className="fa fa-globe"></i> SUPER GLOBAL
																	</div>
																	)}
																</div>
																

															</>
															:null

														)
														: null
													: null}
										</div>
									:null}

									{!ismovil?
										<table className="table">
											<thead className="table-responsive">
												<tr className="fw-bold border-bottom py-2">
													<td><small><span className="text-muted">Verificar</span></small></td>
													<td>ID ITEM</td>
													<td>BARRAS</td>
													<td>ALTERNO</td>
													<td>DESCRIPCIÓN</td>
													<td className="bg-ct">CANTIDAD</td>
												{/* 	<td className="bg-basefact">BASE F</td> */}
													<td className="bg-base">BASE</td>
													<td className="bg-venta">VENTA</td>
													<td className="text-right">SUBTOTAL</td>
												</tr>

											</thead>
												{indexPedidoCentral !== null && pedidosCentral ?
													pedidosCentral[indexPedidoCentral] ?
														pedidosCentral[indexPedidoCentral].items.map((e, i) =>
															
															pedidosCentral[indexPedidoCentral].items.filter(fil=>{
																if (!buscarDatosFact) {return true}
																else{
																	return (fil.producto.codigo_barras?(fil.producto.codigo_barras).toLowerCase().indexOf((buscarDatosFact).toLowerCase()) != -1:false) || 
																	(fil.producto.codigo_proveedor?(fil.producto.codigo_proveedor).toLowerCase().indexOf((buscarDatosFact).toLowerCase()) != -1:false) ||
																	(fil.producto.descripcion?(fil.producto.descripcion).toLowerCase().indexOf((buscarDatosFact).toLowerCase()) != -1:false)
																}
															}).filter(ee=>ee.id==e.id).length
															?
															<>
															
																<tbody key={e.id}>
																{e.super != 1?
																	e.vinculo_sugerido?
																		<tr>
																			<td></td>
																			<td> 
																				{e.vinculo_real?
																					<button className={"btn-warning"+(" btn fs-10px btn-sm")} 
																						
																						>
																						{e.vinculo_real} <i className="fa fa-link"></i>
																					</button>
																				:null}
																			</td>
																			<td>{e.vinculo_sugerido.codigo_barras}</td>
																			<td>{e.vinculo_sugerido.codigo_proveedor}</td>
																			<td>{e.vinculo_sugerido.descripcion} <small className='text-muted'>SUGERIDO POR SUCURSAL DESTINO</small></td>
																		</tr>
																	:null
																:null}

																{e.super==0?
																<tr>
																	<td className='align-middle' rowSpan={2}>
																		{typeof (e.aprobado) === "undefined"?
																			<button 
																				onClick={selectPedidosCentral}
																				data-index={i}
																				data-tipo="select"
																				className="btn btn-outline-danger"
																			>
																					<i className="fa fa-times"></i> {i+1}
																			</button>
																		:
																			e.aprobado === true?
																				<button 
																					onClick={selectPedidosCentral}
																					data-index={i}
																					data-tipo="select"
																					className="btn btn-outline-success"
																				>
																					<i className="fa fa-check"></i> {i+1}
																				</button>
																			:null
																		}

																		<i className="fa fa-question text-warning fa-2x ms-2" 
																		onClick={()=>{
																			if (showCorregirDatos!=i) {
																				setshowCorregirDatos(i)	
																			}else if(showCorregirDatos==i){
																				setshowCorregirDatos(null)
																			} 
																		}}></i> 

																		
																	</td>

																	<td>
																		<div className="btn-group">
																			

																			{e.vinculo_real?
																				<>
																					<button className={"btn-warning"+(" btn fs-10px btn-sm")}
																						onDoubleClick={selectPedidosCentral}
																						data-index={i}
																						data-tipo="changevinculo_real"
																						value={""}
																					>
																						{e.vinculo_real} <i className="fa fa-link"></i> 
																					</button> SUGERIDO
																				</>
																			:
																				<>
																					{!e.match?
																						<button
																							className={(idselectproductoinsucursalforvicular.index==i?"btn-danger":"btn-outline-danger")+(" btn fs-10px btn-sm")}
																							onClick={(event)=>openVincularSucursalwithCentral(event,{id: e.producto.idinsucursal ? e.producto.idinsucursal: e.producto.id , index: i,})} 
																						>
																							<i className="fa fa-times"></i>
																							
																						</button>
																					:
																						e.modificable?
																							<button
																								className={(idselectproductoinsucursalforvicular.index==i?"btn-warning":"btn-warning")+(" btn fs-10px btn-sm")}
																									onClick={(event)=>openVincularSucursalwithCentral(event,{id: e.producto.idinsucursal ? e.producto.idinsucursal: e.producto.id , index: i,})} 
																							>
																								<i className="fa fa-link"></i>
																							</button>
																						:
																						<button className={"btn-outline-success btn fs-10px btn-sm"}  onClick={(event)=>openVincularSucursalwithCentral(event,{id: e.producto.idinsucursal ? e.producto.idinsucursal: e.producto.id , index: i,})}>
																							<i className="fa fa-check"></i>
																						</button>
																					} 
																				
																				</>
																			}
																		</div>
																	</td>
																	<td className='d-flex justify-content-between align-items-end'>
																		{e.match&&e.match.codigo_barras?e.match.codigo_barras: <small className="text-muted">se creará nuevo</small>} 

																		
																	</td>
																	<td>
																		{e.match&&e.match.codigo_barras?e.match.codigo_proveedor: <small className="text-muted">se creará nuevo</small>	}

																	</td>
																	<td className='align-bottom'>
																		{e.match&&e.match.descripcion?e.match.descripcion: <small className="text-muted">se creará nuevo</small>	} 	<small className='text-muted'> {pedidosCentral[indexPedidoCentral].destino.codigo} (VINCULO CENTRAL 
																			{e.match?
																				e.match.codigo_barras!=e.producto.codigo_barras?
																					<i onDoubleClick={()=>removeVinculoCentral(e.id)} className="fa fa-times text-danger"></i>
																				:null
																			:null
																			})</small>
																	</td>
																	<td></td>
																	<td className='align-bottom'>{e.match&&e.match.precio_base?e.match.precio_base: <small className="text-muted">se creará nuevo</small>	}</td>
																	<td className='align-bottom'>{e.match&&e.match.precio?e.match.precio: <small className="text-muted">se creará nuevo</small>	}</td>
																</tr>:
																	<tr>
																		<td className='align-middle' rowSpan={2}>
																			{typeof (e.aprobado) === "undefined"?
																				<button 
																					onClick={selectPedidosCentral}
																					data-index={i}
																					data-tipo="select"
																					className="btn btn-outline-danger"
																				>
																					<i className="fa fa-times"></i> {i+1}
																				</button>
																			:
																				e.aprobado === true?
																					<button 
																						onClick={selectPedidosCentral}
																						data-index={i}
																						data-tipo="select"
																						className="btn btn-outline-success"
																					>
																						<i className="fa fa-check"></i> {i+1}
																					</button>
																				:null
																			}

																			<i className="fa fa-question text-warning fa-2x ms-2" 
																			onClick={()=>{
																				if (showCorregirDatos!=i) {
																					setshowCorregirDatos(i)	
																				}else if(showCorregirDatos==i){
																					setshowCorregirDatos(null)
																				} 
																			}}></i> 

																			
																		</td>
																		<td colSpan={10} className='align-middle' style={{background: "linear-gradient(45deg, rgb(255, 215, 0), rgb(255, 165, 0))", color: "rgb(0, 0, 0)",  textAlign: 
																			"center", fontStyle: "italic"}}>
																			<i className="fa fa-globe"></i> SUPER GLOBAL
																		</td>
																	</tr>
																}
																<tr className={(e.aprobado ? "bg-success-light" : "bg-sinapsis-light" ) + (" pointer borderbottom table-margenbottom")}>
																	
																	<td>{e.id}</td>
																	
																	<td className="align-top">
																		{e.producto.codigo_barras?e.producto.codigo_barras:null}

																		{showCorregirDatos==i||e.barras_real?
																			<>
																				<br />
																				<input type="text" value={e.barras_real?e.barras_real:""}
																					data-index={i}
																					data-tipo="changebarras_real"
																					onChange={selectPedidosCentral}
																					size="20"
																					placeholder='Corregir Barras...'
																				/>
																			</>
																		:null}
																	</td>
																	<td>
																		{e.producto.codigo_proveedor?e.producto.codigo_proveedor:null}
																		{showCorregirDatos==i||e.alterno_real?
																			<>
																				<br />
																				<input type="text" value={e.alterno_real?e.alterno_real:""}
																					data-index={i}
																					data-tipo="changealterno_real"
																					onChange={selectPedidosCentral}
																					size="20"
																					placeholder='Corregir Alterno...'
																				/>
																			</>
																		:null}

																	</td>
																	<td className="align-top">
																		{e.producto.descripcion} <small className='text-muted'>{pedidosCentral[indexPedidoCentral].origen.codigo}</small>
																		{
																			showCorregirDatos==i||e.descripcion_real?
																			<>
																				<br />
																				<input type="text" value={e.descripcion_real?e.descripcion_real:""}
																					data-index={i}
																					data-tipo="changedescripcion_real"
																					onChange={selectPedidosCentral}
																					size="20"
																					placeholder='Corregir Descripcion...'
																				/>
																			</>
																			:null
																		}
																	</td>
																	<th className="align-top">
																		<span className={(typeof (e.ct_real) != "undefined" ? "" : null)}>{e.cantidad.toString().replace(/\.00/, "")}</span>
																		{showCorregirDatos==i||e.ct_real?
																				<>
																					<br />
																					<input type="text" value={e.ct_real?e.ct_real:""}
																						data-index={i}
																						data-tipo="changect_real"
																						onChange={selectPedidosCentral}
																						size="5"
																						placeholder='Corregir Ct...'
																						
																					/>
																				</>
																		:null}
																	</th>
																	<td className="align-top text-sinapsis">{moneda(e.base)}</td>
																	<td className="align-top text-success">{moneda(e.venta)}</td>
																	<td className="align-top text-right">{moneda(e.monto)}</td>
																</tr>
																</tbody>
															</>
															:null

														)
														: null
													: null}
										</table>
									:null}
									{indexPedidoCentral !== null && pedidosCentral ?
										pedidosCentral[indexPedidoCentral] ?
											!pedidosCentral[indexPedidoCentral].items.filter(e => (typeof (e.aprobado) === "undefined")).length ?
												<div className="btn-group">
													<button className="btn btn-outline-success btn-block btn-xl" onClick={checkPedidosCentral}>Guardar Pedido</button>
												</div>
												: null
											: null
										: null}
								</div>
								: <div className="col">
									<h3>Importar pedido</h3>
									<div className="form-group">
										<label htmlFor="">Cabezera del pedido</label>
										<input type="text" className="form-control" value={valheaderpedidocentral} onChange={e => setvalheaderpedidocentral(e.target.value)} placeholder="Cabezera del pedido" />
									</div>

									<div className="form-group">
										<label htmlFor="">Cuerpo del pedido</label>
										<textarea className="form-control" value={valbodypedidocentral} onChange={e => setvalbodypedidocentral(e.target.value)} placeholder="Cuerpo del pedido" cols="30" rows="15"></textarea>

									</div>
									<div className="form-group">
										<button className="btn btn-block btn-success" onClick={procesarImportPedidoCentral}>Importar</button>
									</div>
								</div>}
						</div>
					</>
					: null}
				{/* {subviewcentral == "inventario" ?
					<>
						<h1>Inventario</h1>
						<button className="btn btn-outline-sinapsis pull-right" onClick={() => { setInventarioFromSucursal(); setsubviewcentral("") }}>Exportar inventario a Central</button>

						<table className="table">
							<thead>
								<tr>
									<th className="cell05 pointer"><span>ID / ID SUCURSAL</span></th>
									<th className="cell1 pointer"><span>C. Alterno</span></th>
									<th className="cell1 pointer"><span>C. Barras</span></th>
									<th className="cell05 pointer"><span>Unidad</span></th>
									<th className="cell2 pointer"><span>Descripción</span></th>
									<th className="cell05 pointer"><span>Ct.</span></th>
									<th className="cell1 pointer"><span>Base</span></th>
									<th className="cell15 pointer">
										<span>Venta </span>
									</th>
									<th className="cell15 pointer" >
										<span>
											Categoría
										</span>

										<br />
										<span>
											Preveedor
										</span>

									</th>
									<th className="cell05 pointer"><span>IVA</span></th>
									<th className="cell1"></th>

								</tr>
							</thead>
							<tbody>
								{inventarioModifiedCentralImport.length ? inventarioModifiedCentralImport.map((e, i) =>
									<tr key={i} className={(e.type == "replace" ? "bg-success-light" : "text-muted") + (" pointer")} >
										<td className="cell05" title={e.id_pro_sucursal_fixed ? (" FIXED "+e.id_pro_sucursal_fixed):null}>
											{e.id_pro_sucursal ? e.id_pro_sucursal : e.id}
											 
										</td>

										<td className="cell1">{e.codigo_proveedor}</td>
										<td className="cell1">{e.codigo_barras}</td>
										<td className="cell05">{e.unidad}</td>
										<td className="cell2">{e.descripcion}</td>
										<th className="cell05">{e.cantidad}
										</th>
										<td className="cell1">{e.precio_base}</td>
										<td className="cell15 text-success">
											{e.precio}

										</td>
										<td className="cell15">{e.categoria.descripcion} <br /> {e.proveedor.descripcion}</td>
										<td className="cell05">{e.iva}</td>


									</tr>
								) : <tr>
									<td colSpan={7}>Sin resultados</td>
								</tr>}
							</tbody>
						</table>
						{inventarioModifiedCentralImport.length ? <button className="btn btn-outline-success w-100" onClick={saveChangeInvInSucurFromCentral}>
							Guardar Cambios
						</button> : null}
					</>
					: null} */}


			</div>
		)	
	} catch (error) {
		alert("Error en PedidosCentral.js"+error)
		return ""	
	}
	

}