import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useEffect } from "react";


export default function VentasComponet({
	ventasData,
	getVentasClick,
	setfechaventas,
	fechaventas,
	moneda,
	onClickEditPedido,
	getVentas,
}) {
	useEffect(() => {
		getVentas();
	}, [fechaventas]);
	
	let dataGrafica = ventasData.grafica ? ventasData.grafica:[]
	let ventas = []

	try{
		ventas = ventasData["ventas"].map(e=>e)

	}catch(err){}
	return (
		<div className="container">
			<div className="input-group mb-4">
				<div className="input-prepend-text">
					<button className="btn btn-outline-success" onClick={getVentasClick}><i className="fa fa-refresh"></i></button>
				</div>
				<input type="date" className="form-control" onChange={e=>setfechaventas(e.target.value)} value={fechaventas}/>
			</div>	
			<div className="container-fluid">
				<div className="row">
					<div className="col p-0">
						{ventasData?
							<div className="btn-group">
								<button className="btn btn-outline-success fs-1">Tot. {ventasData["total"]}</button>
								<button className="btn btn-outline-sinapsis fs-4">Efec. {ventasData[3]}</button>
								<button className="btn btn-outline-sinapsis fs-4">Deb. {ventasData[2]}</button>
								<button className="btn btn-outline-sinapsis fs-4">Trans. {ventasData[1]}</button>
							</div>
						:null}

					</div>
					<div className="col p-0">
						{ventasData?
							<span className="text-success pull-right fs-2">
								<i className="fa fa-user m-2"></i>
								<button className="btn btn-xl btn-outline-success btn-circle fs-4">
									{ventasData["numventas"]}
								</button>
							</span>
						:null}						
					</div>	
				</div>
			</div>
			<div className='m-3 d-flex justify-content-center'>
				<LineChart width={1000} height={350} data={dataGrafica}>
					<Line type="monotone" dataKey="monto" stroke="#8884d8" />
					<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
					<XAxis dataKey="hora" />
					<YAxis />
					<Tooltip />
				</LineChart>
			</div>
			<div>
				<table className="table text-center">
					<thead>
						<tr>
							<th>ID</th>
							<th>Monto</th>
							<th>Hora</th>
						</tr>
					</thead>
					<tbody>
						{ventas.map((e,i)=>
								<tr key={e.id_pedido}>
									<td><span className="btn btn-sinapsis" data-id={e.id_pedido} onClick={onClickEditPedido}>{e.id_pedido}</span></td>
									<td>{moneda(e.monto)}</td>
									<td>{e.hora}</td>
								</tr>
							)}
					</tbody>
				</table>
			</div>
		</div>
	)
}