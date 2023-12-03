import Historicocierre from '../components/historicocierre';

function Cierre({
	tipoUsuarioCierre,
	settipoUsuarioCierre,
	moneda,
	caja_usd,
	caja_cop,
	caja_bs,
	caja_punto,
	setcaja_biopago,
	caja_biopago,

	notaCierre,

	dejar_usd,
	dejar_cop,
	dejar_bs,

	setDejar_usd,
	setDejar_cop,
	setDejar_bs,

	onchangecaja,
	cierre,
	cerrar_dia,
	total_caja_neto,
	total_punto,
	total_biopago,
	fechaCierre,
	setFechaCierre,

	viewCierre,
	setViewCierre,
	toggleDetallesCierre,
	setToggleDetallesCierre,
	guardar_cierre,
	sendCuentasporCobrar,
	total_dejar_caja_neto,

	guardar_usd,
	setguardar_usd,
	guardar_cop,
	setguardar_cop,
	guardar_bs,
	setguardar_bs,

	number,

	billete1,
	billete5,
	billete10,
	billete20,
	billete50,
	billete100,
	
	setbillete1,
	setbillete5,
	setbillete10,
	setbillete20,
	setbillete50,
	setbillete100,
	setCaja_usd,
	setCaja_cop,
	setCaja_bs,
	setCaja_punto,
	veryenviarcierrefun,

	dolar,
	peso,
	cierres,
	fechaGetCierre,
	setfechaGetCierre,
	fechaGetCierre2,
	setfechaGetCierre2,
	getCierres, 
	verCierreReq,

	auth,
	totalizarcierre,
	setTotalizarcierre,

	tipo_accionCierre,
	settipo_accionCierre,
	getTotalizarCierre,

	cierrenumreportez,
	setcierrenumreportez,
	cierreventaexcento,
	setcierreventaexcento,
	cierreventagravadas,
	setcierreventagravadas,
	cierreivaventa,
	setcierreivaventa,
	cierretotalventa,
	setcierretotalventa,
	cierreultimafactura,
	setcierreultimafactura,
	cierreefecadiccajafbs,
	setcierreefecadiccajafbs,
	cierreefecadiccajafcop,
	setcierreefecadiccajafcop,
	cierreefecadiccajafdolar,
	setcierreefecadiccajafdolar,
	cierreefecadiccajafeuro,
	setcierreefecadiccajafeuro,
	fun_setguardar,


	setCajaFuerteEntradaCierreDolar,
	CajaFuerteEntradaCierreDolar,
	setCajaFuerteEntradaCierreCop,
	CajaFuerteEntradaCierreCop,
	setCajaFuerteEntradaCierreBs,
	CajaFuerteEntradaCierreBs,
	setCajaChicaEntradaCierreDolar,
	CajaChicaEntradaCierreDolar,
	setCajaChicaEntradaCierreCop,
	CajaChicaEntradaCierreCop,
	setCajaChicaEntradaCierreBs,
	CajaChicaEntradaCierreBs,
}) {

	const setcajaFuerteFun = (type,val) => {
		let val_chica = 0
		switch (type) {
			case "setCajaFuerteEntradaCierreDolar":
				setCajaFuerteEntradaCierreDolar(val)
				
				val_chica = parseFloat(guardar_usd-val).toFixed(2)
				setCajaChicaEntradaCierreDolar(val_chica)
			break;
			case "setCajaFuerteEntradaCierreCop":
				setCajaFuerteEntradaCierreCop(val)

				val_chica = parseFloat(guardar_cop-val).toFixed(2)
				setCajaChicaEntradaCierreCop(val_chica)
			break;
			case "setCajaFuerteEntradaCierreBs":
				setCajaFuerteEntradaCierreBs(val)

				val_chica = parseFloat(guardar_bs-val).toFixed(2)
				setCajaChicaEntradaCierreBs(val_chica)
			break;
		}
	}

	let totalCajaFuerte = (parseFloat(CajaFuerteEntradaCierreDolar) + parseFloat(CajaFuerteEntradaCierreCop/peso) + parseFloat(CajaFuerteEntradaCierreBs/dolar) ).toFixed(2)
	let totalCajaChica = (parseFloat(CajaChicaEntradaCierreDolar) + parseFloat(CajaChicaEntradaCierreCop/peso) + parseFloat(CajaChicaEntradaCierreBs/dolar) ).toFixed(2)
	
	return (
		<div className="container-fluid">
			<div className="row">
				
				<div className="col">
					<div className="container-fluid">
						<div className="row">
							<div className="col">
								<div className="btn-group mb-1">
									<button className={(viewCierre=="cuadre"?"btn-":"btn-outline-")+("sinapsis btn")} onClick={()=>setViewCierre("cuadre")}>Cuadre</button>
									{auth(1)?
										<button className={(viewCierre=="historico"?"btn-":"btn-outline-")+("sinapsis btn")} onClick={()=>setViewCierre("historico")}>Histórico</button>
									:null}
								</div>
								<br />
							</div>
							
						</div>
						<br/>
						{viewCierre=="cuadre"?
						<>
							<div className="input-group">
								<button className="btn btn-sinapsis" onClick={cerrar_dia}><i className="fa fa-cogs"></i></button>

								<input type="date" disabled={true} value={fechaCierre} className="form-control" onChange={null}/>
							</div>
							{cierre["fecha"]?
								<div className='d-flex justify-content-between'>

									<div className='btn-group mt-2 mb-2 w-30'>
		
										{tipo_accionCierre=="guardar"?
										<button className="btn-sm btn btn-outline-success" onClick={guardar_cierre} type="button">Guardar</button>
										:
											<button className="btn-sm btn btn-warning" onClick={guardar_cierre} type="button">Editar</button>
										}
										<button className="btn-sm btn btn-sinapsis" onClick={veryenviarcierrefun} type="button" data-type="ver">Ver</button>

										
										<button className="btn btn-sm" onClick={()=>setToggleDetallesCierre(!toggleDetallesCierre)}>Ver detalles</button>
									</div>
									<div className='d-flex flex-column'>

										<div className='btn-group mt-2 mb-2'>

											{auth(1)?
											<button className={"btn "+(totalizarcierre?"btn-success":"")+" btn-lg"} onClick={()=>getTotalizarCierre()}>Totalizar</button>
											
											:null}


											{totalizarcierre?<button className="btn btn-warning" onClick={veryenviarcierrefun} type="button" data-type="enviar">Enviar Cierre</button>:null}
											{/*<button className="btn btn-warning" onClick={sendCuentasporCobrar} type="button" data-type="enviar">Enviar Cuentas por Cobrar</button>*/}
										</div>
										<span>
											{totalizarcierre?"Totalizando ":"Cajero "} {cierre["fecha"]?cierre["usuariosget"].map(e=>
												<span key={e.id}> {e.usuario} </span>
											):null}
										</span>		
									</div>
									
								</div>
							:null}
							{cierre["fecha"]?
								<form onSubmit={cerrar_dia}>
									<button hidden={true}></button>
									<div className="container-fluid p-0">
											{toggleDetallesCierre?
												<table className="table">
													<tbody>
														<tr>
															<td><span className="fw-bold">Entregado:</span> {cierre["entregado"]}</td>
															
															<td><span className="fw-bold">Pendiente:</span> {cierre["pendiente"]}</td>
															
															<td><span className="fw-bold">Caja inicial:</span> {cierre["caja_inicial"]}</td>
															
														</tr>
													</tbody>
												</table>
											:null}
											<div className="p-3 card shadow-card mb-2 mt-2">
												<div className="row mb-2 border-bottom">
													<div className="col h3 text-center" >
														¿Cuánto hay en caja?
													</div>
												</div>
												<div className="row mb-2">
													<div className="col-2 text-success text-right">Billetes $</div>
													<div className="col font-weight-bold align-middle" >
														<div>
															<span className="h5">1</span>
																<input type="text" value={billete1} name="billete1" onChange={e=>setbillete1(number(e.target.value))} className="input-50" placeholder="1 $" />
																<span className="h5">5</span>
																<input type="text" value={billete5} name="billete5" onChange={e=>setbillete5(number(e.target.value))} className="input-50" placeholder="5 $" />
																<span className="h5">10</span>
																<input type="text" value={billete10} name="billete10" onChange={e=>setbillete10(number(e.target.value))} className="input-50" placeholder="10 $" />
																<span className="h5">20</span>
																<input type="text" value={billete20} name="billete20" onChange={e=>setbillete20(number(e.target.value))} className="input-50" placeholder="20 $" />
																<span className="h5">50</span>
																<input type="text" value={billete50} name="billete50" onChange={e=>setbillete50(number(e.target.value))} className="input-50" placeholder="50 $" />
																<span className="h5">100</span>
																<input type="text" value={billete100} name="billete100" onChange={e=>setbillete100(number(e.target.value))} className="input-50" placeholder="100 $" />
														</div>
													</div>
												</div>
												<div className="row mb-2">
													<div className="col-2"></div>
													<div className="col">
														$ <input type="text"  placeholder="$" name="caja_usd" value={caja_usd} onChange={onchangecaja}/>
													</div>

													<div className="col">
														P <input type="text"  placeholder="COP" name="caja_cop" value={caja_cop} onChange={onchangecaja}/>
													</div>

													<div className="col">
														Bs. <input type="text"  placeholder="Bs." name="caja_bs" value={caja_bs} onChange={onchangecaja}/>
													</div>
												</div>
												<div className="row mb-2">
													<div className="col-2 text-success text-right">Total Caja Actual en $</div>
													<div className="col" >
														<input type="text" value={total_caja_neto} className="form-control" disabled={true}/>
													</div>
												</div>
												<div className="row mb-2">
													<div className="col-2 text-success text-right">Total Punto de Venta en Bs</div>

													<div className="col align-middle text-center" >
														<input type="text" className="form-control" placeholder="Punto de venta Bs." name="caja_punto" value={caja_punto} onChange={onchangecaja}/>
													</div>
												</div>
												<div className="row mb-2">
													<div className="col-2 text-success text-right">Total Biopago en Bs</div>

													<div className="col align-middle text-center" >
														<input type="text" className="form-control" placeholder="Biopago Bs." name="caja_biopago" value={caja_biopago} onChange={onchangecaja}/>
													</div>
												</div>
											</div>	

											<div className="p-3 card shadow-card mb-2">
											
												<div className="row p-2 border-bottom">
													<div className="col h3 text-center" >
														¿Cuánto dejarás en caja?
													</div>
												</div>
												<div className="row p-2">
													<div className="col-2"></div>
													<div className="col">
														$ <input type="text" placeholder="$" name="dejar_usd" value={dejar_usd} onChange={onchangecaja}/>
													</div>
													<div className="col">
														P <input type="text" placeholder="COP" name="dejar_cop" value={dejar_cop} onChange={onchangecaja}/>
													</div>
													<div className="col">
														Bs. <input type="text" placeholder="Bs." name="dejar_bs" value={dejar_bs} onChange={onchangecaja}/>
														
													</div>
												</div>
												<div className="row p-2">
													<div className="col-2 text-success text-right">Total Dejar Caja</div>

													<div className="col align-middle text-center" >
														<input type="text" value={total_dejar_caja_neto} className="form-control" disabled={true}/>
													</div>
												</div>
											</div>


											<div className="p-3 card shadow-card mb-2">
												<div className="row p-2 border-bottom">
													<div className="col h3 text-center">
														Cuadre Final
													</div>
												</div>
												<div className="row p-2">
													<div className="col-2 text-succes text-right font-weight-bold"></div>
													<div className="col text-success">Facturado Real</div>
													<div className="col text-success">Facturado Digital</div>
													<div className="col"></div>
												</div>
												<div className="row p-2 border-bottom">
													<div className={(cierre["estado_efec"]==1?"text-success":"text-danger")+ (" col-2 text-right h5")}>Efectivo</div>
													<div className="col">
														{cierre["total_caja"]?cierre["total_caja"]:0}
														
													</div>
													<div className="col align-middle">
														{cierre[3]?cierre[3].toFixed(2):null}
													</div>

													<div className="col text-right">
														<div className={(cierre["estado_efec"]==1?"text-success":"text-danger")}>
															<span className="fst-italic fs-2">
																{cierre["msj_efec"]?cierre["msj_efec"]:null}
															</span>
														</div>
													</div>
												</div>
												<div className="row p-2 border-bottom">
													<div className={(cierre["estado_punto"]==1?"text-success":"text-danger")+(" col-2 text-right h5")}>Débito</div>
													<div className="col">
														{total_punto}
														
													</div>
													<div className="col align-middle">
														{cierre[2]?cierre[2].toFixed(2):null}
													</div>
													<div className="col text-right">
														<div className={(cierre["estado_punto"]==1?"text-success":"text-danger")}>
															<span className="fst-italic fs-2">
																{cierre["msj_punto"]?cierre["msj_punto"]:null}
															</span>
														</div>
													</div>
												</div>
												<div className="row p-2 border-bottom">
													<div className={(cierre["estado_biopago"]==1?"text-success":"text-danger")+(" col-2 text-right h5")}>Biopago</div>
													<div className="col">
														{total_biopago}
														
													</div>
													<div className="col align-middle">
														{cierre[5]?cierre[5].toFixed(2):null}
													</div>
													<div className="col text-right">
														<div className={(cierre["estado_biopago"]==1?"text-success":"text-danger")}>
															<span className="fst-italic fs-2">
																{cierre["msj_biopago"]?cierre["msj_biopago"]:null}
															</span>
														</div>
													</div>
												</div>
												
												<div className="row p-2 border-bottom">
													<div className="col-2 text-success text-right h5">Transferencia</div>
													<div className="col">
														{cierre[1]?cierre[1].toFixed(2):null}
													</div>
													<div className="col">
														{cierre[1]?cierre[1].toFixed(2):null}
													</div>
													<div className="col"></div>
												</div>
												<div className="row p-2">
													<div className="col-2 text-success text-right h5">Nota</div>
													<div className="col">
														<textarea name="notaCierre" placeholder="Novedades..." value={notaCierre?notaCierre:""} onChange={onchangecaja} cols="40" rows="2"></textarea>
													</div>
													<div className="col">
														
													</div>
												</div>
											</div>


											<div className="p-3 card shadow-card mb-2">

												<div className="row">
													<div className="col-2 text-success text-right font-weight-bold h5">Control de Efectivo</div>
													<div className="col">
														<span className="text-success fs-3 fw-bold">{cierre["efectivo_guardado"]?cierre["efectivo_guardado"]:null}</span>
													</div>
													<div className="col">
														<div className="input-group mb-3">
															<input type="text" className="form-control" placeholder="$" name="guardar_usd" value={guardar_usd} onChange={e=>setguardar_usd(number(e.target.value))} disabled={true}/>
															<div className="input-group-prepend w-50">
																<span className="input-group-text">USD($)</span>
															</div>
														</div>
														
													</div>
													<div className="col">
														<div className="input-group mb-3">
															<input type="text" className="form-control" placeholder="Bs." name="guardar_bs" value={guardar_bs} disabled={true} onChange={e=>fun_setguardar("setguardar_bs",number(e.target.value), cierre)}/>
															<div className="input-group-prepend w-50">
																<span className="input-group-text">Bs.</span>
															</div>
														</div>
													</div>
													<div className="col">
														<div className="input-group mb-3">
															<input type="text" className="form-control" placeholder="COP" name="guardar_cop" value={guardar_cop} disabled={true} onChange={e=>fun_setguardar("setguardar_cop",number(e.target.value), cierre)}/>
															<div className="input-group-prepend w-50">
																<span className="input-group-text">COP.</span>
															</div>
														</div>
														
													</div>
												</div>
												<hr />
												<div className="row">
													<div className="col-2 text-primary text-right font-weight-bold h5 align-items-center d-flex justify-content-end">Caja Fuerte</div>
													<div className="col">
														<span className="text-primary fs-3 fw-bold">{totalCajaFuerte}</span>
													</div>
													<div className="col">
														<div className="input-group mb-3">
															<input type="text" className="form-control" placeholder="$" name="CajaFuerteEntradaCierreDolar" value={CajaFuerteEntradaCierreDolar} onChange={e => setcajaFuerteFun("setCajaFuerteEntradaCierreDolar",number(e.target.value))} />
															<div className="input-group-prepend w-50">
																<span className="input-group-text">USD($)</span>
															</div>
														</div>

													</div>
													<div className="col">
														<div className="input-group mb-3">
															<input type="text" className="form-control" placeholder="Bs." name="CajaFuerteEntradaCierreBs" value={CajaFuerteEntradaCierreBs} onChange={e => setcajaFuerteFun("setCajaFuerteEntradaCierreBs",number(e.target.value))} />
															<div className="input-group-prepend w-50">
																<span className="input-group-text">Bs.</span>
															</div>
														</div>
													</div>
													<div className="col">
														<div className="input-group mb-3">
															<input type="text" className="form-control" placeholder="COP" name="CajaFuerteEntradaCierreCop" value={CajaFuerteEntradaCierreCop} onChange={e => setcajaFuerteFun("setCajaFuerteEntradaCierreCop",number(e.target.value))} />
															<div className="input-group-prepend w-50">
																<span className="input-group-text">COP.</span>
															</div>
														</div>

													</div>
												</div>

												<div className="row">
													<div className="col-2 text-success text-right font-weight-bold h5 align-items-center d-flex justify-content-end">Caja Chica</div>
													<div className="col">
														<span className="text-success fs-3 fw-bold">{totalCajaChica}</span>
													</div>
													<div className="col">
														<div className="input-group mb-3">
															<input type="text" className="form-control" placeholder="$" name="CajaChicaEntradaCierreDolar" value={CajaChicaEntradaCierreDolar} onChange={e => setCajaChicaEntradaCierreDolar(number(e.target.value))} disabled />
															<div className="input-group-prepend w-50">
																<span className="input-group-text">USD($)</span>
															</div>
														</div>

													</div>
													<div className="col">
														<div className="input-group mb-3">
															<input type="text" className="form-control" placeholder="Bs." name="CajaChicaEntradaCierreBs" value={CajaChicaEntradaCierreBs} onChange={e => setCajaChicaEntradaCierreBs(number(e.target.value))} disabled />
															<div className="input-group-prepend w-50">
																<span className="input-group-text">Bs.</span>
															</div>
														</div>
													</div>
													<div className="col">
														<div className="input-group mb-3">
															<input type="text" className="form-control" placeholder="COP" name="CajaChicaEntradaCierreCop" value={CajaChicaEntradaCierreCop} onChange={e => setCajaChicaEntradaCierreCop(number(e.target.value))} disabled />
															<div className="input-group-prepend w-50">
																<span className="input-group-text">COP.</span>
															</div>
														</div>

													</div>
												</div>
											</div>


											<div className="p-3 card shadow-card mb-2">
												<table className="table">
													<tbody>
														<tr>
															<th># de Reporte Z</th>
															<td>
																<input type="text" className='form-control' value={cierrenumreportez} onChange={e=>setcierrenumreportez(e.target.value)} />
															</td>
														</tr>
														<tr>
															<th>Venta Exento</th>
															<td>
																<input type="text" className='form-control' value={cierreventaexcento} onChange={e=>setcierreventaexcento(number(e.target.value))} />
															</td>
														</tr>
														<tr>
															<th>Ventas Gravadas (16%)</th>
															<td>
																<input type="text" className='form-control' value={cierreventagravadas} onChange={e=>setcierreventagravadas(number(e.target.value))} />
															</td>
														</tr>
														<tr>
															<th>IVA Ventas</th>
															<td>
																<input type="text" className='form-control' value={cierreivaventa} onChange={e=>setcierreivaventa(number(e.target.value))} />
															</td>
														</tr>
														<tr>
															<th>Total Ventas</th>
															<td>
																<input type="text" className='form-control' value={cierretotalventa} onChange={e=>setcierretotalventa(number(e.target.value))} />
															</td>
														</tr>
														<tr>
															<th>Última Factura</th>
															<td>
																<input type="text" className='form-control' value={cierreultimafactura} onChange={e=>setcierreultimafactura(e.target.value)} />
															</td>
														</tr>
														<tr>
															<td colSpan={2}>

															</td>
														</tr>
														<tr>
															<th>Efectivo adicional Ingresado en Caja Fuerte BS</th>
															<td>
																<input type="text" className='form-control' value={cierreefecadiccajafbs} onChange={e=>setcierreefecadiccajafbs(number(e.target.value))} />
															</td>
														</tr>
														<tr>
															<th>Efectivo adicional Ingresado en Caja Fuerte COP</th>
															<td>
																<input type="text" className='form-control' value={cierreefecadiccajafcop} onChange={e=>setcierreefecadiccajafcop(number(e.target.value))} />
															</td>
														</tr>
														<tr>
															<th>Efectivo adicional Ingresado en Caja Fuerte DOLAR</th>
															<td>
																<input type="text" className='form-control' value={cierreefecadiccajafdolar} onChange={e=>setcierreefecadiccajafdolar(number(e.target.value))} />
															</td>
														</tr>
														<tr>
															<th>Efectivo adicional Ingresado en Caja Fuerte EURO</th>
															<td>
																<input type="text" className='form-control' value={cierreefecadiccajafeuro} onChange={e=>setcierreefecadiccajafeuro(number(e.target.value))} />
															</td>
														</tr>
													</tbody>
												</table>
											</div>


									</div>

								</form>

								:<div className="d-flex justify-content-center align-items-center">
									<button className="btn btn-xl btn-success" onClick={cerrar_dia}>¡Cerremos el día!</button>
								</div>}
						</>
						:null}	
						{viewCierre=="historico"?
							<Historicocierre 
							cierres={cierres}
							fechaGetCierre={fechaGetCierre}
							setfechaGetCierre={setfechaGetCierre}

							fechaGetCierre2={fechaGetCierre2}
							setfechaGetCierre2={setfechaGetCierre2}

							getCierres={getCierres}
							verCierreReq={verCierreReq}

							tipoUsuarioCierre={tipoUsuarioCierre}
							settipoUsuarioCierre={settipoUsuarioCierre}
							/>
						:null}
					</div>
				</div>
			</div>
			
		</div>
	)
}

export default Cierre;