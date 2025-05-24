import React, { useState, useEffect, useRef } from 'react';
import { searchProductos } from './productoService';

const ProductSearchInput = ({ onProductSelect, sucursalIdActual, clearInputAfterSelect = true }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!searchTerm || searchTerm.length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        setIsLoading(true);
        const timerId = setTimeout(async () => {
            try {
                const response = await searchProductos(searchTerm, sucursalIdActual);
                setResults(response.data);
                setShowResults(true);
            } catch (error) {
                console.error("Error buscando productos:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500); // Debounce

        return () => clearTimeout(timerId);
    }, [searchTerm, sucursalIdActual]);

    const handleSelect = (product) => {
        onProductSelect(product);
        if (clearInputAfterSelect) {
            setSearchTerm('');
        }
        setResults([]);
        setShowResults(false);
        inputRef.current?.focus(); // Re-focus para escáner
    };

    useEffect(() => {
        // Auto-focus para escáner de código de barras
        inputRef.current?.focus();
    }, []);


    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                className="form-input w-full p-2 border border-gray-300 rounded"
                placeholder="Buscar por código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && results.length > 0 && setShowResults(true)}
                // onBlur={() => setTimeout(() => setShowResults(false), 100)} // Hide on blur with delay
            />
            {isLoading && <div className="p-2 text-sm text-gray-500">Buscando...</div>}
            {showResults && results.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
                    {results.map(product => (
                        <li
                            key={product.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={() => handleSelect(product)} // Use onMouseDown to fire before onBlur
                        >
                            {product.descripcion} ({product.codigo_barras}) - Stock: {product.cantidad}
                        </li>
                    ))}
                </ul>
            )}
            {showResults && results.length === 0 && !isLoading && searchTerm && (
                 <div className="p-2 text-sm text-gray-500">No se encontraron productos.</div>
            )}
        </div>
    );
};

export default ProductSearchInput;