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
            <div className="items-center flex-1 hidden min-w-0 gap-2 md:flex">
                {/* Botón Nuevo Pedido - Desktop */}
                {addNewPedido && (
                    <button
                        className="flex items-center flex-shrink-0 gap-1 px-2 py-1 text-xs font-medium text-orange-700 transition-colors border !border-orange-200 rounded bg-orange-50 hover:bg-orange-100"
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
                        <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                            Pedidos:
                        </span>
                        <div className="flex flex-1 gap-1 overflow-x-auto">
                            {pedidosFast.map((pedido) =>
                                pedido ? (
                                    <button
                                        key={pedido.id}
                                        data-id={pedido.id}
                                        onClick={onClickEditPedido}
                                        title={`Pedido #${pedido.id} - ${
                                            pedido.estado
                                                ? "Completado"
                                                : "Pendiente"
                                        }`}
                                        style={{
                                            border: "1px solid"
                                        }}
                                        className={`px-2 py-1 rounded text-xs font-medium   transition-colors flex-shrink-0 min-w-[2.5rem] ${
                                            pedido.id == id
                                                ? pedido.estado
                                                    ? "bg-green-500 text-white !border-green-200 shadow-sm"
                                                    : "bg-orange-500 text-white !border-orange-200 shadow-sm"
                                                : pedido.estado
                                                ? "bg-green-100 text-green-700 !border-green-300 hover:bg-green-200"
                                                : "bg-orange-100 text-orange-700 !border-orange-200 hover:bg-orange-200"
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
            <div className="flex items-center flex-1 min-w-0 gap-2 md:hidden">
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
                            className="w-full px-2 py-1 pr-8 text-xs bg-white border border-gray-300 rounded appearance-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
                            value={id || ""}
                            onChange={(e) => {
                                if (e.target.value && onClickEditPedido) {
                                    const event = {
                                        currentTarget: {
                                            attributes: {
                                                "data-id": {
                                                    value: e.target.value,
                                                },
                                            },
                                        },
                                    };
                                    onClickEditPedido(event);
                                }
                            }}
                        >
                            <option value="">Seleccionar pedido...</option>
                            {pedidosFast.map((pedido) =>
                                pedido ? (
                                    <option key={pedido.id} value={pedido.id}>
                                        #{pedido.id} -{" "}
                                        {pedido.estado
                                            ? "Completado"
                                            : "Pendiente"}
                                    </option>
                                ) : null
                            )}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <i className="text-xs text-gray-400 fa fa-chevron-down"></i>
                        </div>
                    </div>
                )}

                {/* Indicador Visual del Pedido Actual - Mobile */}
                {id && (
                    <div className="flex-shrink-0">
                        <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                pedidosFast?.find((p) => p?.id == id)?.estado
                                    ? "bg-green-100 text-green-800 border border-green-300"
                                    : "bg-orange-100 text-orange-800 border border-orange-300"
                            }`}
                        >
                            #{id}
                        </span>
                    </div>
                )}

            </div>


        </>
    );
}