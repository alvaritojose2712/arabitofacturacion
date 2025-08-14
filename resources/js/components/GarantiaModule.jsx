import React, { useState, useEffect } from 'react';
import db from '../database/database';
import GarantiaWizard from './garantias/GarantiaWizard';
import GarantiaList from './garantias/GarantiaList';
import GarantiaConfig from './garantias/GarantiaConfig';
import GarantiaInventario from './garantias/GarantiaInventario';
import GarantiaReverso from './garantias/GarantiaReverso';
import GarantiaReversoAprobadas from './garantias/GarantiaReversoAprobadas';

const GarantiaModule = () => {
    const [currentView, setCurrentView] = useState('list'); // 'list', 'wizard', 'config', 'inventario', 'reverso', 'reverso-aprobadas'
    const [garantias, setGarantias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limiteResultados, setLimiteResultados] = useState(10);
    const [sucursalConfig, setSucursalConfig] = useState({
        id: 1,
        nombre: 'Sucursal Principal',
        central_api_url: 'http://localhost:8000/api'
    });

    useEffect(() => {
        cargarGarantias();
        cargarConfiguracion();
    }, []);

    useEffect(() => {
        cargarGarantias();
    }, [limiteResultados]);

    const cargarGarantias = async () => {
        setLoading(true);
        try {
            // Cargar garantías locales y sincronizar con central
            const response = await db.syncGarantias({
                per_page: limiteResultados
            });
            
            if (response.status === 200 && response.data.success) {
                setGarantias(response.data.garantias || []);
            }
        } catch (error) {
            console.error('Error al cargar garantías:', error);
        } finally {
            setLoading(false);
        }
    };

    const cargarConfiguracion = async () => {
        try {
            const response = await db.checkGarantiaConnection();
            
            if (response.status === 200) {
                const data = response.data;
                setSucursalConfig(prevConfig => ({
                    ...prevConfig,
                    connected: data.connected || false,
                    central_url: data.central_url || prevConfig.central_api_url
                }));
            }
        } catch (error) {
            console.error('Error al cargar configuración:', error);
        }
    };

    const estadisticas = {
        total: garantias.length,
        pendientes: garantias.filter(g => g.estatus === 'PENDIENTE').length,
        aprobadas: garantias.filter(g => g.estatus === 'APROBADA' && !g.ejecutada).length,
        ejecutadas: garantias.filter(g => g.ejecutada).length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="w-full px-2 sm:px-4 lg:px-6">
                    <div className="py-2 sm:py-3 md:py-4">
                        {/* Header */}
                        <div className="mb-2 sm:mb-3 md:mb-4">
                            <h1 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                                <i className="fa fa-shield-alt mr-2 text-blue-600"></i>
                                Sistema de Garantías
                            </h1>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                                {sucursalConfig.nombre}
                            </p>
                        </div>
                        
                        {/* Estadísticas rápidas */}
                        <div className="grid grid-cols-5 gap-1 sm:gap-2 md:gap-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-1 sm:p-2 md:p-3 text-center">
                                <div className="text-lg md:text-xl font-bold text-blue-600">{estadisticas.total}</div>
                                <div className="text-xs text-gray-600">Total</div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-1 sm:p-2 md:p-3 text-center">
                                <div className="text-lg md:text-xl font-bold text-yellow-600">{estadisticas.pendientes}</div>
                                <div className="text-xs text-gray-600">Pendientes</div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-1 sm:p-2 md:p-3 text-center">
                                <div className="text-lg md:text-xl font-bold text-green-600">{estadisticas.aprobadas}</div>
                                <div className="text-xs text-gray-600">Por Ejecutar</div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-1 sm:p-2 md:p-3 text-center">
                                <div className="text-lg md:text-xl font-bold text-red-600">{estadisticas.ejecutadas}</div>
                                <div className="text-xs text-gray-600">Ejecutadas</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-1 sm:p-2 md:p-3 text-center">
                                <div className="text-lg md:text-xl font-bold text-gray-600">{estadisticas.ejecutadas}</div>
                                <div className="text-xs text-gray-600">Finalizadas</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-b">
                <div className="w-full px-2 sm:px-4 lg:px-6">
                    <div className="flex justify-between items-center">
                        <nav className="flex items-center justify-center md:justify-start space-x-1 md:space-x-2 lg:space-x-4 bg-gray-50 rounded-lg p-1 md:p-2">
                            <button
                                onClick={() => setCurrentView('inventario')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-xs md:text-sm transition-all duration-200 ${
                                    currentView === 'inventario'
                                        ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                }`}
                            >
                                <i className="fa fa-warehouse text-sm"></i>
                                <span className="hidden sm:inline">Inventario</span>
                                <span className="sm:hidden">Inv</span>
                            </button>
                            <button
                                onClick={() => setCurrentView('list')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-xs md:text-sm transition-all duration-200 ${
                                    currentView === 'list'
                                        ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                }`}
                            >
                                <i className="fa fa-list-alt text-sm"></i>
                                <span className="hidden sm:inline">Solicitudes</span>
                                <span className="sm:hidden">Sol</span>
                            </button>
                            <button
                                onClick={() => setCurrentView('wizard')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-xs md:text-sm transition-all duration-200 ${
                                    currentView === 'wizard'
                                        ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                }`}
                            >
                                <i className="fa fa-plus-circle text-sm"></i>
                                <span className="hidden sm:inline">Nueva Garantía</span>
                                <span className="sm:hidden">Nueva</span>
                            </button>
                            <button
                                onClick={() => setCurrentView('reverso')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-xs md:text-sm transition-all duration-200 ${
                                    currentView === 'reverso'
                                        ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                }`}
                            >
                                <i className="fa fa-undo text-sm"></i>
                                <span className="hidden sm:inline">Reverso</span>
                                <span className="sm:hidden">Rev</span>
                            </button>
                            <button
                                onClick={() => setCurrentView('reverso-aprobadas')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-xs md:text-sm transition-all duration-200 ${
                                    currentView === 'reverso-aprobadas'
                                        ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                }`}
                            >
                                <i className="fa fa-check-circle text-sm"></i>
                                <span className="hidden sm:inline">Reversos Aprobados</span>
                                <span className="sm:hidden">Aprob</span>
                            </button>
                        </nav>
                        
                        {/* Selector de límite de resultados */}
                        {currentView === 'list' && (
                            <div className="flex items-center space-x-2">
                                <select 
                                    value={limiteResultados}
                                    onChange={(e) => setLimiteResultados(parseInt(e.target.value))}
                                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                    <option value={200}>200</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Cargando...</span>
                    </div>
                )}

                {!loading && currentView === 'list' && (
                    <GarantiaList 
                        garantias={garantias}
                        onReload={cargarGarantias}
                        sucursalConfig={sucursalConfig}
                        db={db}
                    />
                )}

                {!loading && currentView === 'wizard' && (
                    <GarantiaWizard 
                        onSuccess={() => {
                            cargarGarantias();
                            setCurrentView('list');
                        }}
                        sucursalConfig={sucursalConfig}
                        db={db}
                    />
                )}

                {!loading && currentView === 'config' && (
                    <GarantiaConfig 
                        config={sucursalConfig}
                        onSave={(newConfig) => {
                            setSucursalConfig(newConfig);
                            cargarConfiguracion();
                        }}
                        db={db}
                    />
                )}

                {!loading && currentView === 'inventario' && (
                    <GarantiaInventario 
                        sucursalConfig={sucursalConfig}
                    />
                )}

                {!loading && currentView === 'reverso' && (
                    <GarantiaReverso />
                )}

                {!loading && currentView === 'reverso-aprobadas' && (
                    <GarantiaReversoAprobadas />
                )}
            </div>
        </div>
    );
};

export default GarantiaModule; 