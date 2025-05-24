import React, { useState, useEffect } from 'react';

const SelectedProductItem = ({ product, onRemove, onQuantityChange, maxQuantity }) => {
    const [cantidad, setCantidad] = useState(product.cantidad_enviada || 1);

    useEffect(() => {
        // Si la cantidad inicial es 0 o no está definida, la establecemos a 1
        if (!product.cantidad_enviada || product.cantidad_enviada <= 0) {
            setCantidad(1);
            onQuantityChange(product.id, 1); // Notificar al padre
        } else {
            setCantidad(product.cantidad_enviada);
        }
    }, [product.cantidad_enviada, product.id, onQuantityChange]);


    const handleQtyChange = (e) => {
        let newQty = parseInt(e.target.value, 10);
        if (isNaN(newQty) || newQty < 1) newQty = 1;
        if (newQty > maxQuantity) newQty = maxQuantity;
        setCantidad(newQty);
        onQuantityChange(product.id, newQty);
    };

    return (
        <li className="flex justify-between items-center p-2 border-b">
            <div>
                <p className="font-semibold">{product.descripcion}</p>
                <p className="text-sm text-gray-600">{product.codigo_barras} (Stock: {maxQuantity})</p>
            </div>
            <div className="flex items-center">
                <input
                    type="number"
                    min="1"
                    max={maxQuantity}
                    value={cantidad}
                    onChange={handleQtyChange}
                    className="form-input w-20 p-1 border border-gray-300 rounded text-center mr-2"
                />
                <button
                    onClick={() => onRemove(product.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                >
                    Eliminar
                </button>
            </div>
        </li>
    );
};

export default SelectedProductItem;