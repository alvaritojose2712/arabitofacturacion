import { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function ModalRefPago({
    addRefPago,
    descripcion_referenciapago,
    setdescripcion_referenciapago,
    banco_referenciapago,
    setbanco_referenciapago,
    monto_referenciapago,
    setmonto_referenciapago,
    tipo_referenciapago,
    settipo_referenciapago,
    transferencia,
    dolar,
    number,
    bancos,
}) {
    const [isrefbanbs, setisrefbanbs] = useState(true);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};

        if (!descripcion_referenciapago || descripcion_referenciapago.trim() === '') {
            newErrors.descripcion = 'La referencia es obligatoria';
        }

        if (!banco_referenciapago || banco_referenciapago === '') {
            newErrors.banco = 'Debe seleccionar un banco';
        }

        if (!monto_referenciapago || monto_referenciapago <= 0) {
            newErrors.monto = 'El monto debe ser mayor a 0';
        }

        if (!tipo_referenciapago || tipo_referenciapago === '') {
            newErrors.tipo = 'Debe seleccionar el tipo de pago';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await addRefPago("enviar");
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cerrar modal
    const handleClose = () => {
        addRefPago("toggle");
    };

    // Manejar tecla Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Efecto para calcular monto según banco
    useEffect(() => {
        if (
            banco_referenciapago == "ZELLE" ||
            banco_referenciapago == "BINANCE" ||
            banco_referenciapago == "AirTM"
            ) {
            setisrefbanbs(false);
            setmonto_referenciapago(transferencia);
        } else {
            let monto = (transferencia * dolar).toFixed(2);
            setmonto_referenciapago(monto);
            setisrefbanbs(true);
        }
    }, [banco_referenciapago, transferencia, dolar]);

    // Limpiar errores cuando cambian los valores
    useEffect(() => {
        if (errors.descripcion && descripcion_referenciapago) {
            setErrors(prev => ({ ...prev, descripcion: null }));
        }
        if (errors.banco && banco_referenciapago) {
            setErrors(prev => ({ ...prev, banco: null }));
        }
        if (errors.monto && monto_referenciapago > 0) {
            setErrors(prev => ({ ...prev, monto: null }));
        }
        if (errors.tipo && tipo_referenciapago) {
            setErrors(prev => ({ ...prev, tipo: null }));
        }
    }, [descripcion_referenciapago, banco_referenciapago, monto_referenciapago, tipo_referenciapago]);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">
                                Referencia Bancaria
                            </h3>
                            <button
                                onClick={handleClose}
                                className="rounded-full p-1 text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-orange-100 text-sm mt-1">
                            Presiona Enter en cualquier campo para guardar
                        </p>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                        
                        {/* Referencia */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Referencia <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Referencia completa de la transacción..."
                                value={descripcion_referenciapago}
                                onChange={e => setdescripcion_referenciapago(
                                    banco_referenciapago == "ZELLE" ? e.target.value : number(e.target.value)
                                )}
                                onKeyPress={handleKeyPress}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                    errors.descripcion ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.descripcion && (
                                <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                            )}
                        </div>

                        {/* Banco */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Banco <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={banco_referenciapago}
                                onChange={e => {
                                    setdescripcion_referenciapago("");
                                    setbanco_referenciapago(e.target.value);
                                }}
                                onKeyPress={handleKeyPress}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                    errors.banco ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">-- Seleccione un banco --</option>
                                {bancos
                                    .filter(e => e.value != "0134 BANESCO ARABITO PUNTOS 9935")
                                    .filter(e => e.value != "0134 BANESCO TITANIO")
                                    .map((e, i) => (
                                        <option key={i} value={e.value}>
                                            {e.text}
                                        </option>
                                    ))
                                }
                    </select>
                            {errors.banco && (
                                <p className="mt-1 text-sm text-red-600">{errors.banco}</p>
                            )}
                    </div>

                        {/* Monto */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Monto en {isrefbanbs ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Bs
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        $
                                    </span>
                                )}
                                <span className="text-red-500">*</span>
                    </label>
                            <input
                                type="text"
                                value={monto_referenciapago}
                                onChange={e => setmonto_referenciapago(number(e.target.value))}
                                onKeyPress={handleKeyPress}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                    errors.monto ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.monto && (
                                <p className="mt-1 text-sm text-red-600">{errors.monto}</p>
                            )}
                    </div>

                        {/* Tipo de Pago */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Pago <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={tipo_referenciapago}
                                onChange={e => settipo_referenciapago(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                    errors.tipo ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">-- Seleccione tipo --</option>
                            <option value="1">Transferencia</option>
                                <option value="2">Débito</option>
                            <option value="5">BioPago</option>
                        </select>
                            {errors.tipo && (
                                <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
                            )}
                    </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Guardar</span>
                                    </>
                                )}
                            </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}