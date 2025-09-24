export default function({
    pedidosFast,
    onClickEditPedido,
    pedidoData,
    addNewPedido,
}){
    const { id=null } = pedidoData
    
    return (
        <>
            {/* Versión Desktop - Horizontal */}
            <div className="hidden md:flex items-center gap-2 flex-1 min-w-0">
                {/* Botón Nuevo Pedido - Desktop */}
                {addNewPedido && (
                    <button 
                        className="flex-shrink-0 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-500 px-2 py-1 rounded font-medium text-xs transition-colors flex items-center gap-1"
                        onClick={() => addNewPedido()}
                        title="Crear nuevo pedido"
                    >
                        <i className="fa fa-plus"></i>
                        <span>Nuevo</span>
                    </button>
                )}

                {/* Lista de Pedidos - Horizontal */}
                {pedidosFast && pedidosFast.length > 0 && (
                    <>
                        <span className="text-gray-600 text-xs font-medium whitespace-nowrap">Pedidos:</span>
                        <div className="flex gap-1 overflow-x-auto flex-1">
                            {pedidosFast.map(pedido => 
                                pedido ? (
                                    <button
                                        key={pedido.id}
                                        data-id={pedido.id}
                                        onClick={onClickEditPedido}
                                        title={`Pedido #${pedido.id} - ${pedido.estado ? 'Completado' : 'Pendiente'}`}
                                        className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 min-w-[2.5rem] ${
                                            pedido.id == id 
                                                ? pedido.estado 
                                                    ? "bg-green-500 text-white border border-green-600 shadow-sm" 
                                                    : "bg-orange-500 text-white border border-orange-600 shadow-sm"
                                                : pedido.estado
                                                    ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                                                    : "bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200"
                                        }`}
                                    >
                                        #{pedido.id}
                                    </button>
                                ) : null
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Versión Mobile - Vertical */}
            <div className="md:hidden flex items-center gap-2 flex-1 min-w-0">
                {/* Botón Nuevo Pedido - Mobile */}
                {addNewPedido && (
                    <button 
                        className="flex-shrink-0 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-500 p-1.5 rounded font-medium text-xs transition-colors"
                        onClick={() => addNewPedido()}
                        title="Crear nuevo pedido"
                    >
                        <i className="fa fa-plus"></i>
                    </button>
                )}

                {/* Dropdown de Pedidos para Mobile */}
                {pedidosFast && pedidosFast.length > 0 && (
                    <div className="relative flex-1">
                        <select 
                            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-orange-400 focus:border-orange-400 pr-8 appearance-none"
                            value={id || ''}
                            onChange={(e) => {
                                if (e.target.value && onClickEditPedido) {
                                    const event = { currentTarget: { attributes: { 'data-id': { value: e.target.value } } } };
                                    onClickEditPedido(event);
                                }
                            }}
                        >
                            <option value="">Seleccionar pedido...</option>
                            {pedidosFast.map(pedido => 
                                pedido ? (
                                    <option 
                                        key={pedido.id} 
                                        value={pedido.id}
                                    >
                                        #{pedido.id} - {pedido.estado ? 'Completado' : 'Pendiente'}
                                    </option>
                                ) : null
                            )}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <i className="fa fa-chevron-down text-gray-400 text-xs"></i>
                        </div>
                    </div>
                )}

                {/* Indicador Visual del Pedido Actual - Mobile */}
                {id && (
                    <div className="flex-shrink-0">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            pedidosFast?.find(p => p?.id == id)?.estado
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-orange-100 text-orange-800 border border-orange-300"
                        }`}>
                            #{id}
                        </span>
                    </div>
                )}
            </div>
        </>
    )
}