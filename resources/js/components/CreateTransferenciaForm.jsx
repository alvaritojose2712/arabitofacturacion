import React, { useState, useEffect } from 'react';
import { getSucursales } from './sucursalService';
import { createTransferencia } from './transferenciaService';
import ProductSearchInput from './ProductSearchInput';
import SelectedProductItem from './SelectedProductItem';

// Asume que tienes esta variable global o la obtienes de alguna manera
// En una app real, esto vendría de la autenticación o configuración
const ID_SUCURSAL_ACTUAL_ORIGEN = 1; // ¡DEBES REEMPLAZAR ESTO!

const CreateTransferenciaForm = ({ onTransferCreated, onCancel }) => {
    const [sucursalesDestino, setSucursalesDestino] = useState([]);
    const [selectedSucursalDestino, setSelectedSucursalDestino] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                // Excluir la sucursal actual de los destinos
                const response = await getSucursales(ID_SUCURSAL_ACTUAL_ORIGEN);
                setSucursalesDestino(response.data);
            } catch (err) {
                console.error("Error cargando sucursales:", err);
                setError('No se pudieron cargar las sucursales de destino.');
            }
        };
        fetchSucursales();
    }, []);

    const handleAddProduct = (product) => {
        // Evitar duplicados
        if (selectedProducts.find(p => p.id === product.id)) {
            alert("Este producto ya ha sido agregado.");
            return;
        }
        setSelectedProducts(prev => [...prev, { ...product, cantidad_enviada: 1 }]);
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    const handleQuantityChange = (productId, cantidad) => {
        setSelectedProducts(prev =>
            prev.map(p => (p.id === productId ? { ...p, cantidad_enviada: cantidad } : p))
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!selectedSucursalDestino) {
            setError('Debe seleccionar una sucursal de destino.');
            return;
        }
        if (selectedProducts.length === 0) {
            setError('Debe agregar al menos un producto a la transferencia.');
            return;
        }

        const transferenciaData = {
            sucursal_origen_id: ID_SUCURSAL_ACTUAL_ORIGEN, // Obtener de la sesión del usuario
            sucursal_destino_id: selectedSucursalDestino,
            observaciones: observaciones,
            productos: selectedProducts.map(p => ({ id: p.id, cantidad_enviada: p.cantidad_enviada })),
        };

        setIsLoading(true);
        try {
            const response = await createTransferencia(transferenciaData);
            onTransferCreated(response.data); // Notificar al componente padre
            // Reset form o redirigir
            setSelectedSucursalDestino('');
            setObservaciones('');
            setSelectedProducts([]);
        } catch (err) {
            console.error("Error creando transferencia:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Error al crear la transferencia.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-4">Nueva Transferencia</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3" role="alert">{error}</div>}

            <div>
                <label htmlFor="sucursal_destino" className="block text-sm font-medium text-gray-700">Sucursal Destino:</label>
                <select
                    id="sucursal_destino"
                    value={selectedSucursalDestino}
                    onChange={(e) => setSelectedSucursalDestino(e.target.value)}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Seleccione una sucursal</option>
                    {sucursalesDestino.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="product_search" className="block text-sm font-medium text-gray-700">Buscar Productos:</label>
                <ProductSearchInput
                    onProductSelect={handleAddProduct}
                    sucursalIdActual={ID_SUCURSAL_ACTUAL_ORIGEN}
                />
            </div>

            {selectedProducts.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Productos Seleccionados:</h3>
                    <ul className="mt-2 border rounded max-h-96 overflow-y-auto">
                        {selectedProducts.map(product => (
                            <SelectedProductItem
                                key={product.id}
                                product={product}
                                onRemove={handleRemoveProduct}
                                onQuantityChange={handleQuantityChange}
                                maxQuantity={product.cantidad} // Usar la cantidad original del inventario como máximo
                            />
                        ))}
                    </ul>
                </div>
            )}

            <div>
                <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">Observaciones:</label>
                <textarea
                    id="observaciones"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows="3"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
                 <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading || selectedProducts.length === 0}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isLoading ? 'Creando...' : 'Crear Transferencia'}
                </button>
            </div>
        </form>
    );
};

export default CreateTransferenciaForm;