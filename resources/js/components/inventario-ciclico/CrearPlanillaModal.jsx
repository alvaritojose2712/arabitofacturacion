import React, { useState } from 'react';
import axios from 'axios';

const CrearPlanillaModal = ({ onClose, onPlanillaCreated, sucursalConfig, user }) => {
    const [formData, setFormData] = useState({
        notas_generales: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/inventario-ciclico/planillas', {
                sucursal_codigo: sucursalConfig?.codigo,
                id_usuario_creador: user?.id || 1,
                notas_generales: formData.notas_generales
            });

            if (response.data.success) {
                onPlanillaCreated(response.data.data);
            } else {
                setError(response.data.message || 'Error al crear la planilla');
            }
        } catch (error) {
            console.error('Error al crear planilla:', error);
            setError(error.response?.data?.message || 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            <i className="fa fa-plus mr-2 text-blue-600"></i>
                            Nueva Planilla de Inventario
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <i className="fa fa-times"></i>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Información de sucursal */}
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-600">
                                <strong>Sucursal:</strong> {sucursalConfig?.nombre}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Código:</strong> {sucursalConfig?.codigo}
                            </p>
                        </div>

                        {/* Notas generales */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notas Generales (Opcional)
                            </label>
                            <textarea
                                value={formData.notas_generales}
                                onChange={(e) => handleInputChange('notas_generales', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Observaciones generales sobre esta planilla..."
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                <i className="fa fa-exclamation-triangle mr-2"></i>
                                {error}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="fa fa-spinner fa-spin mr-2"></i>
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa fa-check mr-2"></i>
                                        Crear Planilla
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CrearPlanillaModal; 