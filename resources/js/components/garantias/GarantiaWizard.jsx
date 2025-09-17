import React, { useState, useEffect, useRef } from 'react';
import StepIndicator from './StepIndicator';
import ResponsablesStep from './steps/ResponsablesStep';
import CarritoDinamico from '../CarritoDinamico';
import MetodosPagoStep from './steps/MetodosPagoStep';
import FotosStep from './steps/FotosStep';
import RevisionStep from './steps/RevisionStep';

// Componente unificado para el cliente
const UnifiedClienteForm = ({ formData, updateNestedFormData, errors, db }) => {
    const [busquedaTermino, setBusquedaTermino] = useState('');
    const [clientesEncontrados, setClientesEncontrados] = useState([]);
    const [buscandoCliente, setBuscandoCliente] = useState(false);
    const [modoCreacion, setModoCreacion] = useState(true);

    const buscarCliente = async (cedula) => {
        if (!cedula || cedula.length < 2) {
            setClientesEncontrados([]);
            return;
        }

        setBuscandoCliente(true);
        try {
            const response = await db.searchResponsables({
                tipo: 'cliente',
                termino: cedula,
                limit: 5
            });

            const apiResponse = response.data;
            if (apiResponse.status === 200 && apiResponse.data.length > 0) {
                setClientesEncontrados(apiResponse.data);
                setModoCreacion(false); // Cambiar a modo selección si hay resultados
            } else {
                setClientesEncontrados([]);
                setModoCreacion(true); // Modo creación si no hay resultados
            }
        } catch (error) {
            setClientesEncontrados([]);
            setModoCreacion(true);
        } finally {
            setBuscandoCliente(false);
        }
    };

    const seleccionarCliente = (cliente) => {
        updateNestedFormData('cliente', 'id', cliente.id);
        updateNestedFormData('cliente', 'nombre', cliente.nombre);
        updateNestedFormData('cliente', 'apellido', cliente.apellido);
        updateNestedFormData('cliente', 'cedula', cliente.cedula);
        updateNestedFormData('cliente', 'telefono', cliente.telefono || '');
        updateNestedFormData('cliente', 'correo', cliente.correo || '');
        updateNestedFormData('cliente', 'direccion', cliente.direccion || '');
        setBusquedaTermino('');
        setClientesEncontrados([]);
    };

    const handleCedulaChange = (cedula) => {
        updateNestedFormData('cliente', 'cedula', cedula);
        setBusquedaTermino(cedula);
        if (cedula.length >= 3) {
            buscarCliente(cedula);
        } else {
            setClientesEncontrados([]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cédula del Cliente *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.cliente.cedula || ''}
                            onChange={(e) => handleCedulaChange(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.cliente_cedula ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ej: 12345678"
                        />
                        {buscandoCliente && (
                            <div className="absolute right-3 top-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                    </div>
                    {errors.cliente_cedula && (
                        <p className="mt-1 text-sm text-red-600">{errors.cliente_cedula}</p>
                    )}
                </div>
            </div>

            {/* Resultados de búsqueda */}
            {clientesEncontrados.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-blue-800 mb-3">Clientes encontrados:</h5>
                    <div className="space-y-2">
                        {clientesEncontrados.map((cliente) => (
                            <button
                                key={cliente.id}
                                type="button"
                                onClick={() => seleccionarCliente(cliente)}
                                className="w-full text-left p-3 bg-white border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                            >
                                <div className="font-medium">{cliente.nombre} {cliente.apellido}</div>
                                <div className="text-sm text-gray-500">CI: {cliente.cedula}</div>
                                {cliente.telefono && (
                                    <div className="text-sm text-gray-500">Tel: {cliente.telefono}</div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Formulario de datos del cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        value={formData.cliente.nombre || ''}
                        onChange={(e) => updateNestedFormData('cliente', 'nombre', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cliente_nombre ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nombre del cliente"
                        readOnly={formData.cliente.id && !modoCreacion}
                    />
                    {errors.cliente_nombre && (
                        <p className="mt-1 text-sm text-red-600">{errors.cliente_nombre}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                    </label>
                    <input
                        type="text"
                        value={formData.cliente.apellido || ''}
                        onChange={(e) => updateNestedFormData('cliente', 'apellido', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cliente_apellido ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Apellido del cliente"
                        readOnly={formData.cliente.id && !modoCreacion}
                    />
                    {errors.cliente_apellido && (
                        <p className="mt-1 text-sm text-red-600">{errors.cliente_apellido}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                    </label>
                    <input
                        type="text"
                        value={formData.cliente.telefono || ''}
                        onChange={(e) => updateNestedFormData('cliente', 'telefono', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: 04241234567"
                        readOnly={formData.cliente.id && !modoCreacion}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo
                    </label>
                    <input
                        type="email"
                        value={formData.cliente.correo || ''}
                        onChange={(e) => updateNestedFormData('cliente', 'correo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ejemplo@correo.com"
                        readOnly={formData.cliente.id && !modoCreacion}
                    />
                </div>
            </div>

            {formData.cliente.id && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                        <i className="fa fa-check-circle text-green-600 mr-2"></i>
                        <span className="text-sm font-medium text-green-800">Cliente seleccionado desde la base de datos</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente unificado para foto de factura
const UnifiedFotoFactura = ({ formData, updateFormData }) => {
    const fileInputRef = useRef(null);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                updateFormData('foto_factura', {
                    file: file,
                    preview: e.target.result,
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
            };
            
            reader.readAsDataURL(file);
        }
    };

    const openFileSelector = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const removePhoto = () => {
        updateFormData('foto_factura', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {!formData.foto_factura ? (
                <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={openFileSelector}
                >
                    <i className="fa fa-camera text-4xl text-gray-400 mb-4 block"></i>
                    <h5 className="text-lg font-medium text-gray-700 mb-2">Subir Foto de Factura</h5>
                    <p className="text-sm text-gray-500 mb-4">
                        {isMobile ? 'Toca para seleccionar foto' : 'Haz clic para seleccionar imagen'}
                    </p>
                    <div className="text-xs text-gray-400">
                        Formatos: JPG, PNG, GIF | Máximo 5MB
                    </div>
                </div>
            ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                        <img
                            src={formData.foto_factura.preview}
                            alt="Factura"
                            className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                            <h5 className="font-medium text-green-800 mb-2">
                                <i className="fa fa-check-circle mr-2"></i>
                                Foto de Factura Cargada
                            </h5>
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Archivo:</strong> {formData.foto_factura.name}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                                <strong>Tamaño:</strong> {(formData.foto_factura.size / 1024).toFixed(2)} KB
                            </p>
                            <button
                                type="button"
                                onClick={removePhoto}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                <i className="fa fa-trash mr-1"></i>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture={isMobile ? "environment" : undefined}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </div>
    );
};

const GarantiaWizard = ({ onSuccess, sucursalConfig, db }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [tasasCambio, setTasasCambio] = useState({ bs_to_usd: 37, cop_to_usd: 1 });
    const [modoValidacion, setModoValidacion] = useState(false); // Variable para activar/desactivar validación
    const [facturaInfo, setFacturaInfo] = useState(null); // Información completa de la factura
    const [validandoFactura, setValidandoFactura] = useState(false); // Estado de validación de factura
    const [facturaValidada, setFacturaValidada] = useState(false); // Si la factura ya fue validada
    const [validacionDesactivada, setValidacionDesactivada] = useState(false); // Para casos de traslados internos
    const [formData, setFormData] = useState({
        // Tipo y caso de uso
        tipo_solicitud: '', // 'GARANTIA' o 'DEVOLUCION'
        caso_uso: null, // 1, 2, 3, 4, 5
        
        // Información de la factura
        factura_venta_id: '',
        numfact_original: '',
        dias_transcurridos_compra: '',
        
        // Responsables
        cliente: {
            nombre: '',
            apellido: '',
            cedula: '',
            telefono: '',
            direccion: '',
            correo: ''
        },
        cajero: {
            nombre: '',
            apellido: '',
            cedula: ''
        },
        supervisor: {
            nombre: '',
            apellido: '',
            cedula: ''
        },
        dici: {
            nombre: '',
            apellido: '',
            cedula: ''
        },
        
        // Información del producto
        id_producto: '',
        producto_nombre: '',
        cantidad: 1,
        cantidad_salida: 0,
        monto_devolucion_dinero: 0,
        
        // Motivos
        motivo: '',
        motivo_devolucion: '',
        detalles_adicionales: '',
        
        // Métodos de devolución
        metodos_devolucion: [],
        
        // Fotos
        foto_factura: null,
        fotos_productos: [],
        fotos_descripciones: [],
        
        // Productos del carrito (solo para casos 1-4)
        productos_carrito: []
    });

    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Estado para el carrito dinámico
    const [carritoData, setCarritoData] = useState(null);
    const [validacionCarrito, setValidacionCarrito] = useState({ esValido: false, errores: [], requiereMetodosPago: false, diferencia_pago: 0 });

    const steps = [
        { number: 1, title: 'Validar Factura', description: 'Verificar número de factura y cargar datos' },
        { number: 2, title: 'Responsables', description: 'Información de las personas involucradas' },
        { number: 3, title: 'Carrito Dinámico', description: 'Agregar productos y métodos de pago' },
        { number: 4, title: 'Motivos y Detalles', description: 'Describir el motivo y detalles del proceso' },
        { number: 5, title: 'Fotos', description: 'Subir evidencias fotográficas' },
        { number: 6, title: 'Revisión', description: 'Verificar y enviar la solicitud' }
    ];

    // Obtener tasas de cambio al cargar el componente
    useEffect(() => {
        const obtenerTasas = async () => {
            try {
                const response = await fetch('/api/garantias/tasas-cambio');
                if (response.ok) {
                    const data = await response.json();
                    setTasasCambio(data.tasas || { bs_to_usd: 37, cop_to_usd: 1 });
                }
            } catch (error) {
                console.warn('Error al obtener tasas de cambio, usando por defecto');
            }
        };
        obtenerTasas();
    }, []);

    // Establecer valores por defecto para responsables (excepto cliente)
    useEffect(() => {
        // Cajero por defecto
        if (!formData.cajero.nombre) {
            updateNestedFormData('cajero', 'nombre', 'Cajero');
            updateNestedFormData('cajero', 'apellido', 'Predeterminado');
            updateNestedFormData('cajero', 'cedula', '00000000');
        }
        
        // Supervisor por defecto
        if (!formData.supervisor.nombre) {
            updateNestedFormData('supervisor', 'nombre', 'Supervisor');
            updateNestedFormData('supervisor', 'apellido', 'Predeterminado');
            updateNestedFormData('supervisor', 'cedula', '11111111');
        }
        
        // DICI por defecto
        if (!formData.dici.nombre) {
            updateNestedFormData('dici', 'nombre', 'DICI');
            updateNestedFormData('dici', 'apellido', 'Predeterminado');
            updateNestedFormData('dici', 'cedula', '22222222');
        }
    }, []);

    const casosUso = [
        {
            id: 1,
            tipo: 'GARANTIA',
            titulo: 'Garantía - Producto por Producto',
            descripcion: 'El cliente trae un producto dañado y se le entrega un producto bueno',
            icono: '🔄',
            campos_requeridos: ['producto', 'cantidad_salida'],
            flujo: 'Entra: Producto dañado → Sale: Producto bueno',
            requiere_devolucion_dinero: false
        },
        {
            id: 2,
            tipo: 'GARANTIA',
            titulo: 'Garantía - Producto por Dinero',
            descripcion: 'El cliente trae un producto dañado y se le devuelve el dinero',
            icono: '💰',
            campos_requeridos: ['producto', 'monto_devolucion'],
            flujo: 'Entra: Producto dañado → Sale: Dinero',
            requiere_devolucion_dinero: true
        },
        {
            id: 3,
            tipo: 'DEVOLUCION',
            titulo: 'Devolución - Producto por Producto',
            descripcion: 'El cliente devuelve un producto bueno y se le entrega otro producto',
            icono: '↔️',
            campos_requeridos: ['producto', 'cantidad_salida'],
            flujo: 'Entra: Producto bueno → Sale: Producto bueno',
            requiere_devolucion_dinero: false
        },
        {
            id: 4,
            tipo: 'DEVOLUCION',
            titulo: 'Devolución - Producto por Dinero',
            descripcion: 'El cliente devuelve un producto bueno y se le devuelve el dinero',
            icono: '💵',
            campos_requeridos: ['producto', 'monto_devolucion'],
            flujo: 'Entra: Producto bueno → Sale: Dinero',
            requiere_devolucion_dinero: true
        },
        {
            id: 5,
            tipo: 'GARANTIA',
            titulo: 'Producto Dañado Interno',
            descripcion: 'Producto dañado encontrado internamente (sin cliente)',
            icono: '🔧',
            campos_requeridos: ['producto'],
            flujo: 'Producto dañado → Dar de baja',
            requiere_devolucion_dinero: false
        }
    ];

    // Función para validar la factura
    const validarFactura = async () => {
        if (!formData.factura_venta_id) {
            setErrors({ factura_venta_id: 'Número de factura es obligatorio' });
            return;
        }

        setValidandoFactura(true);
        setErrors({});

        try {
            const response = await db.validateFactura({ numfact: formData.factura_venta_id });
            if (response.status === 200) {
                const data = response.data;
                if (!data.exists) {
                    setErrors({ factura_venta_id: 'Esta factura no existe en el sistema' });
                    setFacturaInfo(null);
                    setFacturaValidada(false);
                } else {
                    // Almacenar información completa de la factura
                    setFacturaInfo({
                        pedido: data.pedido,
                        metodos_pago: data.metodos_pago || [],
                        productos_facturados: data.productos_facturados || []
                    });
                    
                    // Auto-completar información del cliente si está disponible
                    if (data.pedido.cliente_nombre) {
                        updateNestedFormData('cliente', 'nombre', data.pedido.cliente_nombre);
                        updateNestedFormData('cliente', 'cedula', data.pedido.cliente_identificacion || '');
                    }
                    
                    // Auto-completar días transcurridos desde la compra
                    if (data.pedido.dias_transcurridos_compra !== undefined) {
                        updateFormData('dias_transcurridos_compra', data.pedido.dias_transcurridos_compra);
                    }
                    
                    setFacturaValidada(true);
                }
            } else {
                setErrors({ factura_venta_id: 'Error al validar la factura' });
                setFacturaInfo(null);
                setFacturaValidada(false);
            }
        } catch (error) {
            setErrors({ factura_venta_id: 'Error al validar la factura' });
            setFacturaInfo(null);
            setFacturaValidada(false);
        } finally {
            setValidandoFactura(false);
        }
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateNestedFormData = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    // Manejar cambios en el carrito dinámico
    const handleCarritoChange = (data) => {
        setCarritoData(data);
        
        // Actualizar formData con los datos del carrito
        if (data && data.resumen) {
            updateFormData('caso_uso', data.resumen.caso_uso);
            updateFormData('tipo_solicitud', data.resumen.caso_uso <= 2 ? 'GARANTIA' : 'DEVOLUCION');
            
            // Convertir el formato del carrito dinámico al formato esperado
            const productosCarrito = [];
            
            // Agregar productos de entrada
            data.entradas.forEach(item => {
                productosCarrito.push({
                    id: item.id,
                    descripcion: item.descripcion,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    estado: item.estado,
                    tipo: 'entrada',
                    subtotal: item.subtotal
                });
            });
            
            // Agregar productos de salida
            data.salidas.forEach(item => {
                productosCarrito.push({
                    id: item.id,
                    descripcion: item.descripcion,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    estado: item.estado,
                    tipo: 'salida',
                    subtotal: item.subtotal
                });
            });
            
            updateFormData('productos_carrito', productosCarrito);
        }
    };

    // Manejar cambios en la validación del carrito
    const handleValidacionChange = (validacion) => {
        setValidacionCarrito(validacion);
    };

    // Forzar actualización del carrito cuando cambien los métodos de pago
    useEffect(() => {
        if (carritoData && (carritoData.entradas.length > 0 || carritoData.salidas.length > 0)) {
            // Disparar revalidación del carrito
            handleCarritoChange(carritoData);
        }
    }, [formData.metodos_devolucion]);



    // Verificar si el caso actual requiere devolución de dinero
    const requiereDevolucionDinero = () => {
        // Verificar si hay métodos de pago configurados
        return formData.metodos_devolucion && formData.metodos_devolucion.length > 0;
    };

    const validateStep = async (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                // Validar factura (si no es traslado interno)
                if (!formData.factura_venta_id && !validacionDesactivada) {
                    newErrors.factura_venta_id = 'Número de factura es obligatorio';
                } else if (!facturaValidada && !validacionDesactivada) {
                    newErrors.factura_validacion = 'Debe validar la factura antes de continuar';
                }

                // Validar cliente (siempre requerido en la vista unificada)
                if (!formData.cliente.nombre) newErrors.cliente_nombre = 'Nombre del cliente requerido';
                if (!formData.cliente.apellido) newErrors.cliente_apellido = 'Apellido del cliente requerido';
                if (!formData.cliente.cedula) newErrors.cliente_cedula = 'Cédula del cliente requerida';

                // Validar que hay productos en el carrito
                if (!carritoData || (carritoData.entradas.length === 0 && carritoData.salidas.length === 0)) {
                    newErrors.productos_carrito = 'Debe agregar al menos un producto al carrito';
                    break;
                }
                
                // Validar que se detectó un caso de uso
                if (!carritoData.resumen || !carritoData.resumen.caso_uso) {
                    newErrors.caso_uso = 'No se pudo determinar el caso de uso automáticamente';
                    break;
                }
                
                // Validar usando el carrito dinámico (sin restricciones de métodos de pago)
                if (!validacionCarrito.esValido) {
                    newErrors.carrito = 'El carrito no es válido. Por favor revise los errores.';
                    // Agregar errores específicos del carrito (excluyendo errores de métodos de pago)
                    validacionCarrito.errores.forEach((error, index) => {
                        // Omitir errores de métodos de pago ya que son opcionales
                        if (!error.includes('Se requieren métodos de')) {
                            newErrors[`carrito_error_${index}`] = error;
                        }
                    });
                    break;
                }
                break;

            case 2:
                // Validar cliente (no requerido solo para caso de uso 5)
                const requiereCliente = formData.caso_uso !== 5;
                if (requiereCliente) {
                    if (!formData.cliente.nombre) newErrors.cliente_nombre = 'Nombre del cliente requerido';
                    if (!formData.cliente.apellido) newErrors.cliente_apellido = 'Apellido del cliente requerido';
                    if (!formData.cliente.cedula) newErrors.cliente_cedula = 'Cédula del cliente requerida';
                }
                
                // Validar cajero (siempre requerido)
                if (!formData.cajero.nombre) newErrors.cajero_nombre = 'Nombre del cajero requerido';
                if (!formData.cajero.apellido) newErrors.cajero_apellido = 'Apellido del cajero requerido';
                if (!formData.cajero.cedula) newErrors.cajero_cedula = 'Cédula del cajero requerida';
                
                // Validar supervisor (siempre requerido)
                if (!formData.supervisor.nombre) newErrors.supervisor_nombre = 'Nombre del supervisor requerido';
                if (!formData.supervisor.apellido) newErrors.supervisor_apellido = 'Apellido del supervisor requerido';
                if (!formData.supervisor.cedula) newErrors.supervisor_cedula = 'Cédula del supervisor requerida';
                
                // Validar DICI (siempre requerido)
                if (!formData.dici.nombre) newErrors.dici_nombre = 'Nombre del DICI requerido';
                if (!formData.dici.apellido) newErrors.dici_apellido = 'Apellido del DICI requerido';
                if (!formData.dici.cedula) newErrors.dici_cedula = 'Cédula del DICI requerida';
                break;

            case 3:
                // Validar que hay productos en el carrito
                if (!carritoData || (carritoData.entradas.length === 0 && carritoData.salidas.length === 0)) {
                    newErrors.productos_carrito = 'Debe agregar al menos un producto al carrito';
                    break;
                }
                
                // Validar que se detectó un caso de uso
                if (!carritoData.resumen || !carritoData.resumen.caso_uso) {
                    newErrors.caso_uso = 'No se pudo determinar el caso de uso automáticamente';
                    break;
                }
                
                // NO SE VALIDAN MÉTODOS DE PAGO - se procesarán posteriormente
                // Los métodos de pago son opcionales en este paso
                
                // Validar usando el carrito dinámico (sin restricciones de métodos de pago)
                if (!validacionCarrito.esValido) {
                    newErrors.carrito = 'El carrito no es válido. Por favor revise los errores.';
                    // Agregar errores específicos del carrito (excluyendo errores de métodos de pago)
                    validacionCarrito.errores.forEach((error, index) => {
                        // Omitir errores de métodos de pago ya que son opcionales
                        if (!error.includes('Se requieren métodos de')) {
                            newErrors[`carrito_error_${index}`] = error;
                        }
                    });
                    break;
                }
                
                break;

            case 4: // Motivos y Detalles
                // Validar motivo según el tipo de solicitud
                const tipoSolicitud = carritoData?.resumen?.caso_uso <= 2 ? 'GARANTIA' : 'DEVOLUCION';
                
                if (tipoSolicitud === 'GARANTIA') {
                    if (!formData.motivo || formData.motivo.trim() === '') {
                        newErrors.motivo = 'El motivo de la garantía es obligatorio';
                            }
                        } else {
                    if (!formData.motivo_devolucion || formData.motivo_devolucion.trim() === '') {
                        newErrors.motivo_devolucion = 'El motivo de la devolución es obligatorio';
                        }
                    }
                    
                // Detalles adicionales son opcionales pero recomendados
                if (!formData.detalles_adicionales || formData.detalles_adicionales.trim() === '') {
                    // Solo warning, no error - se recomienda agregar detalles adicionales
                }
                break;

            case 5: // Fotos
                // Las fotos son opcionales, pero si se suben debe haber descripción
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = async () => {
        setValidating(true);
        try {
            const isValid = await validateStep(currentStep);
            
            if (isValid) {
                setCurrentStep(prev => Math.min(prev + 1, steps.length));
            }
        } finally {
            setValidating(false);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        // Limpiar errores cuando se navega hacia atrás
        setErrors({});
    };

    const submitForm = async () => {
        if (!(await validateStep(currentStep))) return;

        setLoading(true);
        try {
            // Crear FormData para manejar archivos y datos
            const formDataToSend = new FormData();
            
            // Datos básicos de la garantía
            const casoUso = carritoData?.resumen?.caso_uso || formData.caso_uso;
            formDataToSend.append('caso_uso', casoUso);
            formDataToSend.append('factura_venta_id', parseInt(formData.factura_venta_id) || 0);
            formDataToSend.append('modo_traslado_interno', validacionDesactivada); // Agregar modo traslado interno
            
            // Datos del carrito dinámico
            if (carritoData) {
                formDataToSend.append('entradas', JSON.stringify(carritoData.entradas));
                formDataToSend.append('salidas', JSON.stringify(carritoData.salidas));
                formDataToSend.append('resumen_carrito', JSON.stringify(carritoData.resumen));
            }
            
            // Productos del carrito (formato compatible con el backend)
            const productos = formData.productos_carrito?.map(item => ({
                id_producto: item.id,
                cantidad: item.cantidad,
                monto_devolucion_unitario: item.monto_devolucion_unitario || 0,
                tipo: item.tipo || 'entrada',
                estado: item.estado || 'BUENO'
            })) || [];
            formDataToSend.append('productos', JSON.stringify(productos));
            
            // Datos completos de garantía con todos los responsables
            const garantiaData = {
                motivo: formData.motivo || formData.motivo_devolucion || '',
                dias_desdecompra: formData.dias_transcurridos_compra || 0,
                cantidad_salida: formData.cantidad_salida || 0,
                motivo_salida: formData.motivo_salida || '',
                detalles_adicionales: formData.detalles_adicionales || '',
                
                // Cliente completo
                cliente: {
                    cedula: formData.cliente.cedula || '',
                    nombre: formData.cliente.nombre || '',
                    apellido: formData.cliente.apellido || '',
                    telefono: formData.cliente.telefono || '',
                    direccion: formData.cliente.direccion || '',
                    correo: formData.cliente.correo || ''
                },
                
                // Cajero completo
                cajero: {
                    cedula: formData.cajero.cedula || '',
                    nombre: formData.cajero.nombre || '',
                    apellido: formData.cajero.apellido || ''
                },
                
                // Supervisor completo
                supervisor: {
                    cedula: formData.supervisor.cedula || '',
                    nombre: formData.supervisor.nombre || '',
                    apellido: formData.supervisor.apellido || ''
                },
                
                // DICI si existe
                dici: formData.dici ? {
                    cedula: formData.dici.cedula || '',
                    nombre: formData.dici.nombre || '',
                    apellido: formData.dici.apellido || ''
                } : null
            };
            formDataToSend.append('garantia_data', JSON.stringify(garantiaData));
            
            // Métodos de devolución
            const metodosDevolucion = requiereDevolucionDinero() ? (formData.metodos_devolucion || []) : [];
            formDataToSend.append('metodos_devolucion', JSON.stringify(metodosDevolucion));
            
            // Foto de factura si existe
            if (formData.foto_factura && formData.foto_factura.file) {
                formDataToSend.append('foto_factura', formData.foto_factura.file);
            }
            
            // Fotos de productos si existen
            if (formData.fotos_productos && formData.fotos_productos.length > 0) {
                formData.fotos_productos.forEach((foto, index) => {
                    // Extraer el archivo real del objeto
                    if (foto.file) {
                        formDataToSend.append(`fotos_productos[${index}]`, foto.file);
                    }
                });
            }
            
            // Descripciones de fotos si existen - extraer de los objetos foto
            if (formData.fotos_productos && formData.fotos_productos.length > 0) {
                formData.fotos_productos.forEach((foto, index) => {
                    const descripcion = foto.description || 'Foto del producto';
                    formDataToSend.append(`fotos_descripciones[${index}]`, descripcion);
                });
            }

            // Obtener token de sesión del localStorage
            const sessionToken = localStorage.getItem('session_token');
            
            const response = await fetch('/api/garantias/registrar-solicitud', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Session-Token': sessionToken || ''
                    // NO incluir Content-Type para FormData - el navegador lo establecerá automáticamente
                },
                body: formDataToSend
            });

            // Manejo mejorado de errores HTTP
            if (!response.ok) {
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    } else if (errorData.errors) {
                        // Manejo de errores de validación
                        const validationErrors = Object.values(errorData.errors).flat();
                        errorMessage = validationErrors.join('\n');
                    }
                } catch (parseError) {
                    // Si no se puede parsear el JSON, usar el mensaje HTTP básico
                    console.error('Error parsing response:', parseError);
                }
                
                setErrors({ submit: errorMessage });
                return;
            }

            const result = await response.json();

            if (result.success) {
                let mensaje = `✅ Solicitud de garantía/devolución enviada exitosamente!\n\n`;
                
                // Mostrar ID de solicitud si está disponible
                if (result.data && result.data.solicitud_id) {
                    mensaje += `🆔 ID Solicitud: ${result.data.solicitud_id}\n`;
                }
                
                if (result.data && result.data.monto_total_devolucion) {
                    mensaje += `💰 Monto Total: ${result.data.monto_total_devolucion} USD\n`;
                }
                
                mensaje += `\n⏳ La solicitud está PENDIENTE DE APROBACIÓN en central.\n`;
                mensaje += `🚫 NO SE CREA PEDIDO hasta recibir aprobación.\n`;
                
                // Solo mostrar métodos de devolución si los hay
                if (result.metodos_devolucion && result.metodos_devolucion.length > 0) {
                    mensaje += `💵 NO ENTREGAR DINERO hasta recibir aprobación.\n\n`;
                    mensaje += `📊 Métodos de devolución configurados:\n`;
                    result.metodos_devolucion.forEach((metodo, index) => {
                        mensaje += `${index + 1}. ${metodo.tipo.toUpperCase()}: ${metodo.monto_original} ${metodo.moneda_original}\n`;
                    });
                } else {
                    mensaje += `📦 Caso sin devolución de dinero - Solo productos.\n`;
                }
                
                alert(mensaje);
                onSuccess();
            } else {
                // Manejo mejorado de errores de respuesta
                let errorMessage = 'Error al crear la solicitud.' + JSON.stringify(result);
                
                if (result.message) {
                    errorMessage = result.message;
                } else if (result.error) {
                    errorMessage = result.error;
                } else if (result.errors) {
                    // Manejo de errores de validación
                    const validationErrors = Object.values(result.errors).flat();
                    errorMessage = validationErrors.join('\n');
                }
                
                setErrors({ submit: errorMessage });
            }
        } catch (error) {
            console.error('Error en submitForm:', error);
            
            // Manejo más específico de errores de conexión
            let errorMessage = 'Error de conexión. Intente nuevamente.';
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        {/* Título principal */}
                        <div>
                            <h3 className="text-xl font-medium text-gray-900 mb-4">
                                Registro de Garantía/Devolución - Vista Unificada
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Complete todos los datos necesarios en una sola vista simplificada.
                            </p>
                        </div>

                        {/* Sección 1: Validación de Factura */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                                <i className="fa fa-file-invoice mr-2"></i>
                                1. Validación de Factura
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número de Factura *
                                    </label>
                                    <div className="flex gap-3">
                                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                                            <input
                                                type="text"
                                                value={formData.factura_venta_id}
                                                onChange={(e) => {
                                                    updateFormData('factura_venta_id', e.target.value);
                                                    if (facturaValidada) {
                                                        setFacturaValidada(false);
                                                        setFacturaInfo(null);
                                                    }
                                                    if (errors.factura_venta_id || errors.factura_validacion) {
                                                        setErrors(prev => {
                                                            const newErrors = { ...prev };
                                                            delete newErrors.factura_venta_id;
                                                            delete newErrors.factura_validacion;
                                                            return newErrors;
                                                        });
                                                    }
                                                }}
                                                className={`w-full sm:flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.factura_venta_id ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Ej: 123456"
                                                disabled={validandoFactura || validacionDesactivada}
                                            />
                                            <button
                                                type="button"
                                                onClick={validarFactura}
                                                disabled={!formData.factura_venta_id || validandoFactura || validacionDesactivada}
                                                className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium text-white transition-colors ${
                                                    !formData.factura_venta_id || validandoFactura || validacionDesactivada
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : facturaValidada
                                                        ? 'bg-green-600 hover:bg-green-700'
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                            >
                                                {validandoFactura ? 'Validando...' : facturaValidada ? '✅ Validada' : 'Validar'}
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValidacionDesactivada(!validacionDesactivada);
                                                if (!validacionDesactivada) {
                                                    setFacturaValidada(false);
                                                    setFacturaInfo(null);
                                                    updateFormData('factura_venta_id', '');
                                                    setErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors.factura_venta_id;
                                                        delete newErrors.factura_validacion;
                                                        return newErrors;
                                                    });
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                validacionDesactivada
                                                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            }`}
                                        >
                                            {validacionDesactivada ? 'Traslado ON' : 'Traslado OFF'}
                                        </button>
                                    </div>
                                    {errors.factura_venta_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.factura_venta_id}</p>
                                    )}
                                    {errors.factura_validacion && (
                                        <p className="mt-1 text-sm text-red-600">{errors.factura_validacion}</p>
                                    )}
                                </div>

                                {/* Información de la factura (compacta) */}
                                {facturaInfo && !validacionDesactivada && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h5 className="text-sm font-medium text-green-800 mb-3">✅ Factura Válida</h5>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><span className="font-medium">Cliente:</span> {facturaInfo.pedido.cliente || 'N/A'}</div>
                                            <div><span className="font-medium">Total:</span> ${facturaInfo.pedido.monto_total}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sección 2: Datos del Cliente */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                                <i className="fa fa-user mr-2"></i>
                                2. Datos del Cliente
                            </h4>
                            <UnifiedClienteForm 
                                formData={formData} 
                                updateNestedFormData={updateNestedFormData} 
                                errors={errors} 
                                db={db} 
                            />
                        </div>

                        {/* Sección 3: Foto de Factura */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
                                <i className="fa fa-camera mr-2"></i>
                                3. Foto de Factura
                            </h4>
                            <UnifiedFotoFactura 
                                formData={formData} 
                                updateFormData={updateFormData} 
                            />
                        </div>

                        {/* Sección 4: Carrito de Productos */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center">
                                <i className="fa fa-shopping-cart mr-2"></i>
                                4. Productos
                            </h4>
                            <CarritoDinamico
                                onCarritoChange={handleCarritoChange}
                                onValidacionChange={handleValidacionChange}
                                factura={{ numero: formData.factura_venta_id }}
                                sucursalConfig={sucursalConfig}
                                initialData={carritoData}
                                db={db}
                                metodosPagoConfigurados={formData.metodos_devolucion || []}
                                tasasCambio={tasasCambio}
                                modoValidacion={modoValidacion}
                                productosFacturados={facturaInfo?.productos_facturados || []}
                                modoTrasladoInterno={validacionDesactivada}
                            />
                        </div>
                    </div>
                );
            // PASOS 2-6 OCULTOS - Solo usar step 1 unificado
            // case 2, 3, 4, 5, 6 - Hidden but preserved for future use
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header Responsive */}
                <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 leading-tight">
                                Nueva Solicitud de Garantía/Devolución
                            </h2>
                            <p className="text-sm text-gray-600 mt-1 sm:mt-2">
                                Siga los pasos para crear una nueva solicitud
                            </p>
                        </div>
                        
                        {/* Indicador de progreso móvil */}
                        <div className="sm:hidden">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">Paso {currentStep}</span>
                                <span className="text-gray-400">de {steps.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step Indicator Oculto - Solo un paso */}
                {/* <StepIndicator steps={steps} currentStep={currentStep} /> */}

                {/* Step Content - Responsive */}
                <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
                    <div className="max-w-none">
                        {renderStepContent()}
                    </div>
                </div>

                {/* Navigation - Responsive */}
                <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200">
                    <div className="flex justify-center">
                        {/* Solo botón de envío en vista unificada */}
                        <button
                            onClick={submitForm}
                            disabled={loading || validating}
                            className={`w-full sm:w-auto px-8 py-3 sm:py-2 rounded-md font-medium text-white transition-colors ${
                                loading || validating
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Creando Garantía...</span>
                                </div>
                            ) : validating ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Validando...</span>
                                </div>
                            ) : (
                                <span>🚀 Crear Garantía/Devolución</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error general - Responsive */}
                {errors.submit && (
                    <div className="px-2 sm:px-4 lg:px-6 py-3 bg-red-50 border-l-4 border-red-400">
                        <p className="text-red-700 text-sm sm:text-base">{errors.submit}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GarantiaWizard; 