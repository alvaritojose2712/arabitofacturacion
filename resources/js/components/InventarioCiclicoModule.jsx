import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlanillasList from './inventario-ciclico/PlanillasList';
import PlanillaDetalle from './inventario-ciclico/PlanillaDetalle';

const InventarioCiclicoModule = ({ user }) => {
    const [currentView, setCurrentView] = useState('list'); // 'list', 'detalle'
    const [selectedPlanilla, setSelectedPlanilla] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sucursalConfig, setSucursalConfig] = useState(null);

    useEffect(() => {
        loadSucursalConfig();
    }, []);

    const loadSucursalConfig = async () => {
        try {
            const response = await axios.get('/api/sucursal-config');
            if (response.data.success) {
                setSucursalConfig(response.data.data);
            }
        } catch (error) {
            console.error('Error al cargar configuración de sucursal:', error);
        }
    };

    const handlePlanillaSelect = (planilla) => {
        setSelectedPlanilla(planilla);
        setCurrentView('detalle');
    };

    const handleBackToList = () => {
        setSelectedPlanilla(null);
        setCurrentView('list');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                <i className="fa fa-clipboard-list mr-3 text-blue-600"></i>
                                Inventario Cíclico
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Gestión de planillas de inventario físico
                            </p>
                        </div>
                        {sucursalConfig && (
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {sucursalConfig.nombre}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Código: {sucursalConfig.codigo}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-b">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setCurrentView('list')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                currentView === 'list'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <i className="fa fa-list mr-2"></i>
                            Planillas
                        </button>
                        {currentView === 'detalle' && (
                            <button
                                onClick={handleBackToList}
                                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm"
                            >
                                <i className="fa fa-arrow-left mr-2"></i>
                                Volver
                            </button>
                        )}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : currentView === 'list' ? (
                    <PlanillasList 
                        onPlanillaSelect={handlePlanillaSelect}
                        sucursalConfig={sucursalConfig}
                        user={user}
                    />
                ) : currentView === 'detalle' && selectedPlanilla ? (
                    <PlanillaDetalle 
                        planilla={selectedPlanilla}
                        onBack={handleBackToList}
                        sucursalConfig={sucursalConfig}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default InventarioCiclicoModule; 