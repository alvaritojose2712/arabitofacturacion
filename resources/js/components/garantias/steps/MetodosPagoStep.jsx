import React, { useState, useEffect } from 'react';

const MetodosPagoStep = ({ formData, updateFormData, errors, casoUso, tasasCambio, diferenciaPago = 0 }) => {
    const [metodos, setMetodos] = useState([]);
    const [nuevoMetodo, setNuevoMetodo] = useState({
        tipo: '',
        monto: 0,
        moneda: 'USD',
        banco: '',
        referencia: '',
        telefono: '',
        cuenta: ''
    });
    const [validandoTransferencia, setValidandoTransferencia] = useState(false);
    const [montoTotalDevolucion, setMontoTotalDevolucion] = useState(0);

    // Tipos de métodos de pago disponibles
    const tiposPago = [
        { value: 'efectivo', label: 'Efectivo', icon: '💵' },
        { value: 'debito', label: 'Débito', icon: '💳' },
        { value: 'biopago', label: 'BioPago', icon: '👆' },
        { value: 'transferencia', label: 'Transferencia', icon: '🏦' }
    ];

    // Bancos disponibles (similar a modalRefPago.js)
    const bancos = [
        { value: 'ZELLE', text: 'ZELLE' },
        { value: 'BINANCE', text: 'BINANCE' },
        { value: 'AIRTM', text: 'AirTM' },
        { value: '0102 BANCO DE VENEZUELA', text: '0102 BANCO DE VENEZUELA' },
        { value: '0104 VENEZOLANO DE CREDITO', text: '0104 VENEZOLANO DE CREDITO' },
        { value: '0105 BANCO MERCANTIL', text: '0105 BANCO MERCANTIL' },
        { value: '0108 BANCO PROVINCIAL', text: '0108 BANCO PROVINCIAL' },
        { value: '0134 BANESCO', text: '0134 BANESCO' },
        { value: '0151 BANCO FONDO COMUN', text: '0151 BANCO FONDO COMUN' },
        { value: '0156 100%BANCO', text: '0156 100%BANCO' },
        { value: '0157 DELSUR', text: '0157 DELSUR' },
        { value: '0163 BANCO DEL TESORO', text: '0163 BANCO DEL TESORO' },
        { value: '0166 BANCO AGRICOLA', text: '0166 BANCO AGRICOLA' },
        { value: '0168 BANCRECER', text: '0168 BANCRECER' },
        { value: '0169 MIBANCO', text: '0169 MIBANCO' },
        { value: '0171 BANCO ACTIVO', text: '0171 BANCO ACTIVO' },
        { value: '0172 BANCAMIGA', text: '0172 BANCAMIGA' },
        { value: '0174 BANPLUS', text: '0174 BANPLUS' },
        { value: '0175 BANCO BICENTENARIO', text: '0175 BANCO BICENTENARIO' },
        { value: '0177 BANCO DE LA FUERZA ARMADA', text: '0177 BANCO DE LA FUERZA ARMADA' },
        { value: '0191 BANCO NACIONAL DE CREDITO', text: '0191 BANCO NACIONAL DE CREDITO' }
    ];

    // Calcular monto total de devolución al cargar
    useEffect(() => {
        // Usar la diferencia de pago calculada por el carrito dinámico
        const total = Math.abs(diferenciaPago || 0);
        setMontoTotalDevolucion(total);
    }, [diferenciaPago]);

    // Actualizar métodos de pago en formData cuando cambian
    useEffect(() => {
        updateFormData('metodos_devolucion', metodos);
    }, [metodos]);

    // Verificar si un banco maneja USD
    const esBancoUSD = (banco) => {
        return ['ZELLE', 'BINANCE', 'AIRTM'].some(b => 
            banco.toUpperCase().includes(b)
        );
    };

    // Manejar cambio de banco para transferencias
    const handleBancoChange = (banco) => {
        const esUSD = esBancoUSD(banco);
        setNuevoMetodo(prev => ({
            ...prev,
            banco: banco,
            moneda: esUSD ? 'USD' : 'BS',
            monto: esUSD ? prev.monto : (prev.monto * (tasasCambio?.bs_to_usd || 37))
        }));
    };

    // Validar transferencia con central
    const validarTransferencia = async (metodo) => {
        if (metodo.tipo !== 'transferencia') return { success: true };
        
        setValidandoTransferencia(true);
        try {
            const response = await fetch('/api/garantias/transferencias/validar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    tipo: 'DEVOLUCION_GARANTIA',
                    monto: metodo.monto,
                    moneda: metodo.moneda,
                    banco: metodo.banco,
                    referencia: metodo.referencia,
                    telefono: metodo.telefono || '',
                    motivo: 'Devolución por garantía/devolución'
                })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, message: 'Error al validar transferencia' };
        } finally {
            setValidandoTransferencia(false);
        }
    };

    // Agregar método de pago
    const agregarMetodo = async () => {
        // Validaciones básicas
        if (!nuevoMetodo.tipo) {
            alert('Debe seleccionar un tipo de método de pago');
            return;
        }
        
        if (!nuevoMetodo.monto || nuevoMetodo.monto <= 0) {
            alert('El monto debe ser mayor a 0');
            return;
        }

        // Validaciones específicas para transferencia
        if (nuevoMetodo.tipo === 'transferencia') {
            if (!nuevoMetodo.banco || !nuevoMetodo.referencia) {
                alert('Para transferencias debe completar banco y referencia');
                return;
            }
            
            // Validar que la referencia no esté duplicada
            const refExistente = metodos.find(m => 
                m.tipo === 'transferencia' && 
                m.referencia === nuevoMetodo.referencia && 
                m.banco === nuevoMetodo.banco
            );
            
            if (refExistente) {
                alert('Ya existe una transferencia con esa referencia y banco');
                return;
            }
            
            // Validar transferencia con central
            const validacion = await validarTransferencia(nuevoMetodo);
            if (!validacion.success) {
                alert('Error al validar transferencia: ' + validacion.message);
                return;
            }
        }

        // Agregar el método
        const metodoCompleto = {
            ...nuevoMetodo,
            id: Date.now(), // ID temporal
            monto: parseFloat(nuevoMetodo.monto)
        };

        setMetodos(prev => [...prev, metodoCompleto]);
        
        // Limpiar formulario
        setNuevoMetodo({
            tipo: '',
            monto: 0,
            moneda: 'USD',
            banco: '',
            referencia: '',
            telefono: '',
            cuenta: ''
        });
    };

    // Eliminar método de pago
    const eliminarMetodo = (id) => {
        setMetodos(prev => prev.filter(m => m.id !== id));
    };

    // Calcular total de métodos agregados
    const totalMetodos = metodos.reduce((sum, metodo) => {
        // Convertir a USD si es necesario
        let montoUSD = metodo.monto;
        if (metodo.moneda === 'BS') {
            montoUSD = metodo.monto / (tasasCambio?.bs_to_usd || 37);
        }
        return sum + montoUSD;
    }, 0);

    // Verificar si los montos coinciden
    const montosCoinciden = Math.abs(montoTotalDevolucion - totalMetodos) < 0.01;

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Métodos de Pago - Diferencia
                </h3>
                <p className="text-blue-700 text-sm">
                    Configure los métodos de pago para procesar la diferencia. 
                    El monto total debe coincidir exactamente con la diferencia de pago calculada.
                </p>
            </div>

            {/* Resumen de montos */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Diferencia de Pago a Procesar:</p>
                        <p className="text-xl font-semibold text-gray-900">
                            ${montoTotalDevolucion.toFixed(2)} USD
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Métodos Agregados:</p>
                        <p className={`text-xl font-semibold ${
                            montosCoinciden ? 'text-green-600' : 'text-red-600'
                        }`}>
                            ${totalMetodos.toFixed(2)} USD
                        </p>
                    </div>
                </div>
                
                {!montosCoinciden && totalMetodos > 0 && (
                    <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded">
                        <p className="text-yellow-800 text-sm">
                            ⚠️ Los montos no coinciden. Falta: ${Math.abs(montoTotalDevolucion - totalMetodos).toFixed(2)}
                        </p>
                    </div>
                )}
            </div>

            {/* Formulario para agregar método */}
            <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Agregar Método de Pago</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tipo de método */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Método
                        </label>
                        <select
                            value={nuevoMetodo.tipo}
                            onChange={(e) => setNuevoMetodo(prev => ({ ...prev, tipo: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar...</option>
                            {tiposPago.map(tipo => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.icon} {tipo.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Monto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monto
                        </label>
                        <div className="flex">
                            <input
                                type="number"
                                step="0.01"
                                value={nuevoMetodo.monto}
                                onChange={(e) => setNuevoMetodo(prev => ({ ...prev, monto: e.target.value }))}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                            <select
                                value={nuevoMetodo.moneda}
                                onChange={(e) => setNuevoMetodo(prev => ({ ...prev, moneda: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={nuevoMetodo.tipo === 'transferencia'}
                            >
                                <option value="USD">USD</option>
                                <option value="BS">BS</option>
                            </select>
                        </div>
                    </div>

                    {/* Campos específicos para transferencia */}
                    {nuevoMetodo.tipo === 'transferencia' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Banco
                                </label>
                                <select
                                    value={nuevoMetodo.banco}
                                    onChange={(e) => handleBancoChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar banco...</option>
                                    {bancos.map(banco => (
                                        <option key={banco.value} value={banco.value}>
                                            {banco.text}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Referencia
                                </label>
                                <input
                                    type="text"
                                    value={nuevoMetodo.referencia}
                                    onChange={(e) => setNuevoMetodo(prev => ({ ...prev, referencia: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Número de referencia completo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={nuevoMetodo.telefono}
                                    onChange={(e) => setNuevoMetodo(prev => ({ ...prev, telefono: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Teléfono asociado"
                                />
                            </div>
                        </>
                    )}

                    {/* Cuenta para débito y biopago */}
                    {(nuevoMetodo.tipo === 'debito' || nuevoMetodo.tipo === 'biopago') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cuenta (opcional)
                            </label>
                            <input
                                type="text"
                                value={nuevoMetodo.cuenta}
                                onChange={(e) => setNuevoMetodo(prev => ({ ...prev, cuenta: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Número de cuenta"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <button
                        onClick={agregarMetodo}
                        disabled={validandoTransferencia}
                        className={`px-4 py-2 rounded-md font-medium text-white ${
                            validandoTransferencia 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {validandoTransferencia ? (
                            <>
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Validando...
                            </>
                        ) : (
                            'Agregar Método'
                        )}
                    </button>
                </div>
            </div>

            {/* Lista de métodos agregados */}
            {metodos.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Métodos de Pago Agregados ({metodos.length})
                    </h4>
                    
                    <div className="space-y-3">
                        {metodos.map(metodo => (
                            <div key={metodo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">
                                            {tiposPago.find(t => t.value === metodo.tipo)?.icon}
                                        </span>
                                        <span className="font-medium">
                                            {tiposPago.find(t => t.value === metodo.tipo)?.label}
                                        </span>
                                        <span className="text-gray-500">-</span>
                                        <span className="font-semibold text-green-600">
                                            {metodo.monto.toFixed(2)} {metodo.moneda}
                                        </span>
                                    </div>
                                    
                                    {metodo.tipo === 'transferencia' && (
                                        <div className="mt-1 text-sm text-gray-600">
                                            <span className="font-medium">Banco:</span> {metodo.banco}<br/>
                                            <span className="font-medium">Ref:</span> {metodo.referencia}
                                        </div>
                                    )}
                                </div>
                                
                                <button
                                    onClick={() => eliminarMetodo(metodo.id)}
                                    className="ml-4 px-2 py-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Errores */}
            {errors.metodos_devolucion && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{errors.metodos_devolucion}</p>
                </div>
            )}
        </div>
    );
};

export default MetodosPagoStep; 