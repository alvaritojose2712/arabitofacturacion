export default function ModalFormatoGarantia({
    devolucionMotivo,
    setdevolucionMotivo,
    devolucion_cantidad_salida,
    setdevolucion_cantidad_salida,

    devolucion_motivo_salida,
    setdevolucion_motivo_salida,

    devolucion_ci_cajero,
    setdevolucion_ci_cajero,
    devolucion_ci_autorizo,
    setdevolucion_ci_autorizo,
    devolucion_dias_desdecompra,
    setdevolucion_dias_desdecompra,
    devolucion_ci_cliente,
    setdevolucion_ci_cliente,
    devolucion_telefono_cliente,
    setdevolucion_telefono_cliente,
    devolucion_nombre_cliente,
    setdevolucion_nombre_cliente,
    devolucion_nombre_cajero,
    setdevolucion_nombre_cajero,
    devolucion_nombre_autorizo,
    setdevolucion_nombre_autorizo,

    devolucion_trajo_factura,
    setdevolucion_trajo_factura,
    devolucion_motivonotrajofact,
    setdevolucion_motivonotrajofact,
    number,
    setviewGarantiaFormato,
    addCarritoRequestInterno,
    devolucion_numfactoriginal,
    setdevolucion_numfactoriginal,
}){
    return (
        <>
            <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">FORMATO DE GARANTÍA</h2>
                        <button 
                            onClick={() => setviewGarantiaFormato(false)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={event => {
                        event.preventDefault();
                        addCarritoRequestInterno(null, false)
                    }} className="p-6 space-y-6">
                        <p className="text-center text-gray-600 font-medium">Explicar DETALLADAMENTE</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Factura Original */}
                            <div className="col-span-full">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    NÚMERO DE FACTURA ORIGINAL
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={devolucion_numfactoriginal} 
                                    required={true} 
                                    onChange={event => setdevolucion_numfactoriginal(number(event.target.value))} 
                                />
                            </div>

                            {/* Cajero */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CÉDULA CAJERO
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={devolucion_ci_cajero} 
                                        required={true} 
                                        onChange={event => setdevolucion_ci_cajero(number(event.target.value))} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        NOMBRE COMPLETO CAJERO
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={devolucion_nombre_cajero} 
                                        required={true} 
                                        onChange={event => setdevolucion_nombre_cajero(event.target.value)} 
                                    />
                                </div>
                            </div>

                            {/* Autorizó */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CÉDULA AUTORIZÓ
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={devolucion_ci_autorizo} 
                                        required={true} 
                                        onChange={event => setdevolucion_ci_autorizo(number(event.target.value))} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        NOMBRE COMPLETO AUTORIZÓ
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={devolucion_nombre_autorizo} 
                                        required={true} 
                                        onChange={event => setdevolucion_nombre_autorizo(event.target.value)} 
                                    />
                                </div>
                            </div>

                            {/* Cliente */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CÉDULA CLIENTE
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={devolucion_ci_cliente} 
                                        required={true} 
                                        onChange={event => setdevolucion_ci_cliente(number(event.target.value))} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        NOMBRE COMPLETO CLIENTE
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={devolucion_nombre_cliente} 
                                        required={true} 
                                        onChange={event => setdevolucion_nombre_cliente(event.target.value)} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        TELÉFONO CLIENTE
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={devolucion_telefono_cliente} 
                                        required={true} 
                                        onChange={event => setdevolucion_telefono_cliente(event.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Motivo y Días */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    MOTIVO DETALLADO
                                </label>
                                <textarea 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[100px]"
                                    value={devolucionMotivo} 
                                    required={true} 
                                    onChange={event => setdevolucionMotivo(event.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    DÍAS TRANSCURRIDOS DESDE LA COMPRA
                                </label>
                                <input 
                                    type="text" 
                                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={devolucion_dias_desdecompra} 
                                    required={true} 
                                    onChange={event => setdevolucion_dias_desdecompra(number(event.target.value))} 
                                />
                            </div>
                        </div>

                        {/* Factura */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    ¿TRAJO FACTURA?
                                </label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                    value={devolucion_trajo_factura} 
                                    required={true} 
                                    onChange={event => setdevolucion_trajo_factura(event.target.value)}
                                >
                                    <option value="">-</option>
                                    <option value="si">SÍ</option>
                                    <option value="no">NO</option>
                                </select>
                            </div>
                            
                            {devolucion_trajo_factura === "no" && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        EN CASO DE NO TENER FACTURA, EXPLIQUE EL MOTIVO
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={devolucion_motivonotrajofact} 
                                        required={true} 
                                        onChange={event => setdevolucion_motivonotrajofact(event.target.value)} 
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center pt-4">
                            <button 
                                type="submit"
                                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                            >
                                ENVIAR
                            </button>
                        </div>
                    </form>
                </div>
            </section>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
        </>
    )
}