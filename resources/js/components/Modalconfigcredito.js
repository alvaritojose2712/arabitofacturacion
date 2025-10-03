import { useHotkeys } from "react-hotkeys-hook";
import { useEffect } from "react";

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
	// Cerrar modal con tecla Escape
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				setviewconfigcredito(false);
			}
		};
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, []);

	return(
		<>
			{/* Backdrop */}
			<div 
				className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
				onClick={() => setviewconfigcredito(false)}
			></div>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
				<div 
					className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header con botón cerrar */}
					<div className="flex items-center justify-between p-6 border-b border-gray-200">
						<div className="flex-1">
							{pedidoData?.cliente && (
								<div className="space-y-1">
									<p className="text-sm text-gray-500 font-medium">
										{pedidoData.cliente.identificacion}
									</p>
									<h2 className="text-xl font-bold text-gray-900">
										{pedidoData.cliente.nombre}
									</h2>
								</div>
							)}
						</div>
						<button
							onClick={() => setviewconfigcredito(false)}
							className="ml-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Estado de deuda */}
					{datadeudacredito && (
						<div className={`px-6 py-4 ${!datadeudacredito.check ? 'bg-red-50' : 'bg-green-50'}`}>
							<p className={`text-center font-semibold ${!datadeudacredito.check ? 'text-red-700' : 'text-green-700'}`}>
								{!datadeudacredito.check 
									? `⚠️ Cliente presenta deuda (${datadeudacredito.diferencia}), Por favor revisar.`
									: `✓ Cliente solvente (${datadeudacredito.diferencia})`
								}
							</p>
						</div>
					)}

					{/* Contenido del formulario */}
					<form onSubmit={setconfigcredito} className="p-6 space-y-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Parámetros del crédito
						</h3>

						{/* Fecha de inicio */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Fecha de inicio
							</label>
							<input 
								type="date" 
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
								value={fechainiciocredito} 
								onChange={e => setfechainiciocredito(e.target.value)}
								required
							/>
						</div>

						{/* Fecha de vencimiento */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Fecha de Vencimiento
							</label>
							<input 
								type="date" 
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
								value={fechavencecredito} 
								onChange={e => setfechavencecredito(e.target.value)}
								required
							/>
						</div>

						{/* Formato de pago */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Formato de pago
							</label>
							<select 
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
								value={formatopagocredito} 
								onChange={e => setformatopagocredito(e.target.value)}
							>
								<option value="1">Pago Completo</option>
								<option value="0">Pago parcial</option>
							</select>
						</div>

						{/* Botones */}
						<div className="flex flex-col sm:flex-row gap-3 pt-4">
							<button 
								type="submit"
								className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
							>
								Guardar configuración
							</button>
							<button 
								type="button"
								onClick={() => setPagoPedido()}
								className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
							>
								Procesar pedido
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}