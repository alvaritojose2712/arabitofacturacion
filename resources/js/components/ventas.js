import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useEffect, useState } from "react";

export default function VentasComponet({
	ventasData,
	getVentasClick,
	setfechaventas,
	fechaventas,
	moneda,
	onClickEditPedido,
	getVentas,
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [chartType, setChartType] = useState('line'); // 'line' o 'bar'

	useEffect(() => {
		getVentas();
	}, [fechaventas]);
	
	// Procesar datos de manera segura
	let dataGrafica = [];
	let ventas = [];

	try {
		// Datos de gráfica
		if (ventasData?.grafica && Array.isArray(ventasData.grafica)) {
			dataGrafica = ventasData.grafica.map(item => ({
				hora: item.hora || '',
				monto: parseFloat(item.monto) || 0
			}));
		}

		// Datos de ventas
		if (ventasData?.ventas && Array.isArray(ventasData.ventas)) {
			ventas = ventasData.ventas.map(item => ({
				id_pedido: item.id_pedido || 0,
				monto: parseFloat(item.monto) || 0,
				hora: item.hora || ''
			}));
		}
	} catch(err) {
		console.error('Error procesando datos de ventas:', err);
		dataGrafica = [];
		ventas = [];
	}

	const handleRefresh = async () => {
		setIsLoading(true);
		try {
			await getVentasClick();
		} finally {
			setIsLoading(false);
		}
	};

	const formatCurrency = (amount) => {
		return moneda ? moneda(amount) : `$${parseFloat(amount).toFixed(2)}`;
	};

	const getResumenData = () => {
		if (!ventasData || !ventasData.resumen) return [];
		
		return [
			{ 
				label: 'Total', 
				value: ventasData.total || '0.00', 
				color: 'bg-green-500',
				textColor: 'text-green-700',
				borderColor: 'border-green-500'
			},
			{ 
				label: 'Efectivo', 
				value: ventasData.resumen.efectivo || '0.00', 
				color: 'bg-blue-500',
				textColor: 'text-blue-700',
				borderColor: 'border-blue-500'
			},
			{ 
				label: 'Débito', 
				value: ventasData.resumen.debito || '0.00', 
				color: 'bg-purple-500',
				textColor: 'text-purple-700',
				borderColor: 'border-purple-500'
			},
			{ 
				label: 'Transferencia', 
				value: ventasData.resumen.transferencia || '0.00', 
				color: 'bg-orange-500',
				textColor: 'text-orange-700',
				borderColor: 'border-orange-500'
			},
			{ 
				label: 'BioPago', 
				value: ventasData.resumen.biopago || '0.00', 
				color: 'bg-teal-500',
				textColor: 'text-teal-700',
				borderColor: 'border-teal-500'
			}
		];
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			{/* Header con fecha y botón de refresh */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="flex items-center gap-3">
						<button 
							className={`p-3 rounded-lg transition-all duration-200 ${
								isLoading 
									? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
									: 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
							}`}
							onClick={handleRefresh}
							disabled={isLoading}
							title="Actualizar datos"
						>
							<i className={`fa ${isLoading ? 'fa-spinner fa-spin' : 'fa-refresh'} text-lg`}></i>
						</button>
											<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Fecha de Ventas
						</label>
						<input 
							type="date" 
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
							onChange={e => setfechaventas(e.target.value)} 
							value={fechaventas}
						/>
						{ventasData && ventasData.fecha && (
							<p className="text-xs text-gray-500 mt-1">
								Consultando: {ventasData.fecha}
							</p>
						)}
					</div>
					</div>
					
					{/* Selector de tipo de gráfica */}
					<div className="flex items-center gap-2">
						<label className="text-sm font-medium text-gray-700">Gráfica:</label>
						<select 
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
							value={chartType}
							onChange={(e) => setChartType(e.target.value)}
						>
							<option value="line">Línea</option>
							<option value="bar">Barras</option>
						</select>
					</div>
				</div>
			</div>

			{/* Resumen de ventas */}
			{ventasData && ventasData.estado && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
					{getResumenData().map((item, index) => (
						<div key={index} className={`bg-white rounded-lg shadow-sm border-2 ${item.borderColor} p-4`}>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">{item.label}</p>
									<p className={`text-2xl font-bold ${item.textColor}`}>
										{formatCurrency(item.value)}
									</p>
								</div>
								<div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center`}>
									<i className="fa fa-dollar text-white text-lg"></i>
			</div>	
							</div>
						</div>
					))}
				</div>
			)}

			{/* Número de ventas */}
			{ventasData && ventasData.estado && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
					<div className="flex items-center justify-center sm:justify-end gap-4">
						<div className="text-center sm:text-right">
							<p className="text-sm font-medium text-gray-600 mb-1">
								<i className="fa fa-shopping-cart mr-2"></i>
								Total de Ventas
							</p>
							<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full border-4 border-green-500">
								<span className="text-2xl font-bold text-green-700">
									{ventasData.numventas || 0}
								</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Gráfica */}
			{ventasData && ventasData.estado && dataGrafica.length > 0 && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
						Ventas por Hora - {fechaventas}
					</h3>
					<div className="w-full h-80">
						<ResponsiveContainer width="100%" height="100%">
							{chartType === 'line' ? (
								<LineChart data={dataGrafica}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis 
										dataKey="hora" 
										stroke="#6b7280"
										fontSize={12}
									/>
									<YAxis 
										stroke="#6b7280"
										fontSize={12}
										tickFormatter={(value) => `$${value}`}
									/>
									<Tooltip 
										contentStyle={{
											backgroundColor: '#ffffff',
											border: '1px solid #e5e7eb',
											borderRadius: '8px',
											boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
										}}
										formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, 'Monto']}
									/>
									<Line 
										type="monotone" 
										dataKey="monto" 
										stroke="#f97316" 
										strokeWidth={3}
										dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
										activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
									/>
								</LineChart>
							) : (
								<BarChart data={dataGrafica}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis 
										dataKey="hora" 
										stroke="#6b7280"
										fontSize={12}
									/>
									<YAxis 
										stroke="#6b7280"
										fontSize={12}
										tickFormatter={(value) => `$${value}`}
									/>
									<Tooltip 
										contentStyle={{
											backgroundColor: '#ffffff',
											border: '1px solid #e5e7eb',
											borderRadius: '8px',
											boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
										}}
										formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, 'Monto']}
									/>
									<Bar 
										dataKey="monto" 
										fill="#f97316"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							)}
						</ResponsiveContainer>
					</div>	
				</div>
			)}

			{/* Tabla de ventas */}
			{ventasData && ventasData.estado && ventas.length > 0 && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
					<div className="px-4 py-3 border-b border-gray-200">
						<h3 className="text-lg font-semibold text-gray-800">
							Detalle de Ventas
						</h3>
			</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										ID Pedido
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Monto
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Hora
									</th>
						</tr>
					</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{ventas.map((venta, index) => (
									<tr key={venta.id_pedido || index} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4 whitespace-nowrap">
											<button 
												className="inline-flex items-center px-3 py-1 border border-orange-300 rounded-full text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
												onClick={() => onClickEditPedido(venta.id_pedido)}
												title="Ver pedido"
											>
												{venta.id_pedido}
											</button>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{formatCurrency(venta.monto)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{venta.hora}
										</td>
								</tr>
								))}
					</tbody>
				</table>
			</div>
		</div>
			)}

			{/* Estado vacío */}
			{(!ventasData || !ventasData.estado || ventas.length === 0) && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<i className="fa fa-chart-line text-gray-400 text-2xl"></i>
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No hay datos de ventas
					</h3>
					<p className="text-gray-500">
						Selecciona una fecha para ver las ventas del día
					</p>
				</div>
			)}
		</div>
	);
}