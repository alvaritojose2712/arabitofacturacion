import { useHotkeys } from "react-hotkeys-hook";

export default function Modalconfigcreditio({
	viewconfigcredito,
	setviewconfigcredito,
	fechainiciocredito,
	setfechainiciocredito,
	fechavencecredito,
	setfechavencecredito,
	formatopagocredito,
	setformatopagocredito,
	datadeudacredito,
	setdatadeudacredito,
	setconfigcredito,

	setPagoPedido,
	pedidoData,
}){
	return(
		<>
			<section className="modal-custom"> 
				<div className="text-danger" onClick={()=>setviewconfigcredito(false)}><span className="closeModal">&#10006;</span></div>
				<div className="modal-content-sm modal-cantidad">
					<div className="">
						{pedidoData?pedidoData.cliente?
								<>
									<h5>{pedidoData.cliente.identificacion}</h5>
									<h2>{pedidoData.cliente.nombre}</h2>
								</>
							:null:null}
						<div className="text-center">
						{datadeudacredito?
							!datadeudacredito.check?
								<span className="text-danger fw-bold fs-4">Cliente presenta deuda ({datadeudacredito.diferencia}), Por favor revisar.</span>
							:	<span className="text-success fw-bold fs-4">Cliente solvente ({datadeudacredito.diferencia})</span>
							
						:null}
						</div>
					</div>
				<form onSubmit={setconfigcredito}>
					<h3>Parámetros del crédito</h3>
					<div className="form-group mb-2">
						<label htmlFor="">
							Fecha de inicio
						</label>
						<input type="date" className="form-control" value={fechainiciocredito} onChange={e=>setfechainiciocredito(e.target.value)}/>
					</div>
					<div className="form-group mb-2">
						<label htmlFor="">
							Fecha de Vencimiento
						</label>
						<input type="date" className="form-control" value={fechavencecredito} onChange={e=>setfechavencecredito(e.target.value)}/>
					</div>
					<div className="form-group mb-2">
						<label htmlFor="">
							Formato de pago
						</label>
						<select className="form-control" value={formatopagocredito} onChange={e=>setformatopagocredito(e.target.value)}>
							<option value="1">Pago Completo</option>
							<option value="0">Pago parcial</option>
						</select>
					</div>
					<div className="form-group mb-3">
						<button className="btn btn-outline-sinapsis">Guardar configuración de crédito</button>

						<span className="btn btn-outline-secondary" onClick={()=>setPagoPedido()}>Procesar pedido</span>
					</div>
				</form>
				</div>
			</section>
			<div className="overlay"></div>
		</>
	)
}