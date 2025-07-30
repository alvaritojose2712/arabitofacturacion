import React, { useState, useEffect } from 'react';
import StepIndicator from './StepIndicator';
import ResponsablesStep from './steps/ResponsablesStep';
import CarritoDinamico from '../CarritoDinamico';
import MetodosPagoStep from './steps/MetodosPagoStep';
import FotosStep from './steps/FotosStep';
import RevisionStep from './steps/RevisionStep';

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
                // Validar que la factura haya sido validada
                if (!formData.factura_venta_id && !validacionDesactivada) {
                    newErrors.factura_venta_id = 'Número de factura es obligatorio';
                } else if (!facturaValidada && !validacionDesactivada) {
                    newErrors.factura_validacion = 'Debe validar la factura antes de continuar';
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
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        <div>
                            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                                Validar Factura
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 sm:mb-4">
                                Ingrese el número de factura para validar y cargar los datos del cliente.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de Factura *
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        value={formData.factura_venta_id}
                                        onChange={(e) => {
                                            updateFormData('factura_venta_id', e.target.value);
                                            // Resetear validación cuando cambia el número
                                            if (facturaValidada) {
                                                setFacturaValidada(false);
                                                setFacturaInfo(null);
                                            }
                                            // Limpiar errores relacionados con la factura
                                            if (errors.factura_venta_id || errors.factura_validacion) {
                                                setErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.factura_venta_id;
                                                    delete newErrors.factura_validacion;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        className={`w-full px-3 py-2 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.factura_venta_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Ej: 123456"
                                        disabled={validandoFactura || validacionDesactivada}
                                    />
                                    <button
                                        type="button"
                                        onClick={validarFactura}
                                        disabled={!formData.factura_venta_id || validandoFactura || validacionDesactivada}
                                        className={`w-full sm:w-auto px-6 py-3 sm:py-2 rounded-md font-medium text-white transition-colors ${
                                            !formData.factura_venta_id || validandoFactura || validacionDesactivada
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : facturaValidada
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    >
                                        {validandoFactura ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Validando...</span>
                                            </div>
                                        ) : facturaValidada ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <span>✅</span>
                                                <span>Validada</span>
                                            </div>
                                        ) : (
                                            <span>Validar Factura</span>
                                        )}
                                    </button>
                                </div>
                                {errors.factura_venta_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.factura_venta_id}</p>
                                )}
                                {errors.factura_validacion && (
                                    <p className="mt-1 text-sm text-red-600">{errors.factura_validacion}</p>
                                )}
                            </div>

                            {/* Botón para desactivar validación de factura */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setValidacionDesactivada(!validacionDesactivada);
                                        if (!validacionDesactivada) {
                                            // Al activar el modo de traslado interno, limpiar datos de factura
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
                                    className={`w-full sm:w-auto px-4 py-3 sm:py-2 rounded-md font-medium transition-colors ${
                                        validacionDesactivada
                                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                >
                                    {validacionDesactivada ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="fa fa-toggle-on"></i>
                                            <span>Traslado Interno Activado</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="fa fa-toggle-off"></i>
                                            <span>Activar Traslado Interno</span>
                                        </div>
                                    )}
                                </button>
                                
                                {validacionDesactivada && (
                                    <div className="text-sm text-orange-600 text-center sm:text-left">
                                        <i className="fa fa-info-circle me-1"></i>
                                        Traslado interno
                                    </div>
                                )}
                            </div>

                            {/* Información de la factura si está disponible */}
                            {facturaInfo && !validacionDesactivada && (
                                <div className="space-y-3 sm:space-y-4">
                                    {/* Información básica */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                                        <h4 className="text-sm font-medium text-green-800 mb-2 sm:mb-3">✅ Factura Válida</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 text-sm">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                                <span className="text-green-600 font-medium">Cliente:</span> 
                                                <span className="text-gray-900">{facturaInfo.pedido.cliente || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                                <span className="text-green-600 font-medium">Fecha:</span> 
                                                <span className="text-gray-900">{new Date(facturaInfo.pedido.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                                <span className="text-green-600 font-medium">Total:</span> 
                                                <span className="text-gray-900 font-semibold">${facturaInfo.pedido.monto_total}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                                <span className="text-green-600 font-medium">Estado:</span> 
                                                <span className="text-gray-900">{facturaInfo.pedido.estado_text}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Métodos de pago */}
                                    {facturaInfo.metodos_pago.length > 0 && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                            <h4 className="text-sm font-medium text-blue-800 mb-2 sm:mb-3">💳 Cómo pagó el cliente:</h4>
                                            <div className="space-y-2 sm:space-y-3">
                                                {facturaInfo.metodos_pago.map((metodo, index) => (
                                                    <div key={index} className="bg-white p-2 sm:p-3 rounded border">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-lg">
                                                                        {metodo.icono || '💳'}
                                                                    </span>
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {metodo.descripcion}
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded self-start sm:self-auto">
                                                                    ID: {metodo.tipo}
                                                                </span>
                                                            </div>
                                                            <div className="text-left sm:text-right">
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    ${metodo.monto.toFixed(2)}
                                                                </div>
                                                                {metodo.cuenta !== undefined && metodo.cuenta !== null && (
                                                                    <div className="text-xs text-gray-500">
                                                                        {metodo.cuenta === 1 ? 'Crédito' : 'Abono'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-blue-200">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-medium text-blue-800">Total pagado:</span>
                                                    <span className="font-bold text-blue-900">
                                                        ${facturaInfo.metodos_pago.reduce((sum, metodo) => sum + metodo.monto, 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Productos facturados */}
                                    {facturaInfo.productos_facturados.length > 0 && (
                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
                                            <h4 className="text-sm font-medium text-purple-800 mb-2 sm:mb-3">📦 Productos que se llevó el cliente:</h4>
                                            <div className="max-h-60 overflow-y-auto space-y-2 sm:space-y-3">
                                                {facturaInfo.productos_facturados.map((producto, index) => (
                                                    <div key={index} className="bg-white p-2 sm:p-3 rounded border">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {producto.descripcion}
                                                                </p>
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {producto.codigo_barras && (
                                                                        <span>CB: {producto.codigo_barras} | </span>
                                                                    )}
                                                                    {producto.codigo_proveedor && (
                                                                        <span>CP: {producto.codigo_proveedor}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-right text-sm">
                                                                <div className="font-medium text-gray-900">
                                                                    {producto.cantidad} uds
                                                                </div>
                                                                <div className="text-gray-600">
                                                                    ${producto.precio_unitario.toFixed(2)} c/u
                                                                </div>
                                                                <div className="text-purple-700 font-medium">
                                                                    ${producto.subtotal.toFixed(2)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {!facturaValidada && !validacionDesactivada && (
                                <div className="bg-blue-50 p-4 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        <strong>Instrucciones:</strong> Ingrese el número de factura y haga clic en "Validar Factura" 
                                        para verificar la información y continuar al siguiente paso.
                                    </p>
                                </div>
                            )}

                            {validacionDesactivada && (
                                <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                                    <h4 className="text-sm font-medium text-orange-800 mb-2">
                                        🔄 Modo Traslado Interno Activado
                                    </h4>
                                    <p className="text-sm text-orange-700 mb-3">
                                        <strong>Casos de uso:</strong> Productos dañados internamente, traslados entre sucursales, 
                                        o situaciones donde no existe factura de venta.
                                    </p>
                                    <div className="text-sm text-orange-700">
                                        <p><strong>Validación especial:</strong> El carrito dinámico validará que el producto que entra 
                                        sea el mismo que sale, manteniendo el balance equilibrado.</p>
                                    </div>
                                </div>
                            )}

                            {facturaValidada && !validacionDesactivada && (
                                <div className="bg-green-50 p-4 rounded-md">
                                    <p className="text-sm text-green-800">
                                        <strong>✅ Factura validada exitosamente.</strong> El sistema detectará automáticamente el tipo de garantía/devolución 
                                        basado en los productos que agregue en el siguiente paso.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <ResponsablesStep
                        formData={formData}
                        updateNestedFormData={updateNestedFormData}
                        errors={errors}
                        casoUso={formData.caso_uso}
                        db={db}
                    />
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Carrito Dinámico de Productos
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Agregue los productos usando los botones <strong>Garantía</strong> (productos dañados), 
                                <strong>Devolución</strong> (productos buenos) o <strong>Entregar</strong> (productos a entregar).
                                El caso de uso se determinará automáticamente.
                            </p>
                        </div>
                        
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
                        
                        {/* Sección de métodos de pago - OPCIONAL */}
                        {validacionCarrito.diferencia_pago !== 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-blue-900 mb-4">
                                    💳 Métodos de Pago (Opcional)
                                </h4>
                                <p className="text-sm text-blue-700 mb-4">
                                    Se detectó una diferencia de pago de <strong>${Math.abs(validacionCarrito.diferencia_pago || 0).toFixed(2)}</strong>.
                                    Puede configurar métodos de pago opcionalmente para procesar esta diferencia.
                                </p>
                                
                               {/*  <MetodosPagoStep
                                    formData={formData}
                                    updateFormData={updateFormData}
                                    errors={errors}
                                    casoUso={casosUso.find(c => c.id === carritoData?.resumen?.caso_uso)}
                                    tasasCambio={tasasCambio}
                                    diferenciaPago={validacionCarrito.diferencia_pago}
                                /> */}
                            </div>
                        )}
                        
                        {/* Mostrar errores de validación específicos */}
                        {Object.keys(errors).length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <h4 className="text-sm font-medium text-red-800 mb-2">Errores de validación del wizard:</h4>
                                <ul className="text-sm text-red-700 space-y-1">
                                    {Object.entries(errors).map(([key, error]) => (
                                        <li key={key}>• <strong>{key}:</strong> {error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {/* Mostrar errores de validación del carrito */}
                        {validacionCarrito.errores.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <h4 className="text-sm font-medium text-red-800 mb-2">Errores de validación del carrito:</h4>
                                <ul className="text-sm text-red-700 space-y-1">
                                    {validacionCarrito.errores.map((error, index) => (
                                        <li key={index}>• {error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {/* Mostrar caso de uso detectado */}
                        {carritoData && carritoData.resumen && carritoData.resumen.caso_uso && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <h4 className="text-sm font-medium text-blue-800 mb-2">
                                    🎯 Caso de uso detectado automáticamente:
                                </h4>
                                <p className="text-sm text-blue-700">
                                    <strong>Caso {carritoData.resumen.caso_uso}:</strong> {carritoData.resumen.descripcion_caso}
                                </p>
                            </div>
                        )}
                    </div>
                );
            case 4:
                // Nuevo step: Motivos y Detalles
                const tipoSolicitud = carritoData?.resumen?.caso_uso <= 2 ? 'GARANTIA' : 'DEVOLUCION';
                const casoDetectado = casosUso.find(c => c.id === carritoData?.resumen?.caso_uso);
                
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Motivos y Detalles del Proceso
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Describa el motivo y proporcione detalles adicionales sobre {tipoSolicitud === 'GARANTIA' ? 'la garantía' : 'la devolución'}.
                            </p>
                        </div>

                        {/* Información del caso detectado */}
                        {casoDetectado && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <h4 className="text-sm font-medium text-blue-800 mb-2">
                                    📋 Caso de uso: {casoDetectado.titulo}
                                </h4>
                                <p className="text-sm text-blue-700">
                                    {casoDetectado.descripcion}
                                </p>
                            </div>
                        )}

                        {/* Formulario de motivos */}
                        <div className="bg-white border border-gray-300 rounded-lg p-6">
                            <div className="space-y-4">
                                {/* Campo de motivo según el tipo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {tipoSolicitud === 'GARANTIA' ? 'Motivo de la Garantía' : 'Motivo de la Devolución'} 
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <textarea
                                        value={tipoSolicitud === 'GARANTIA' ? (formData.motivo || '') : (formData.motivo_devolucion || '')}
                                        onChange={(e) => updateFormData(tipoSolicitud === 'GARANTIA' ? 'motivo' : 'motivo_devolucion', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            (tipoSolicitud === 'GARANTIA' ? errors.motivo : errors.motivo_devolucion) ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        rows={3}
                                        placeholder={tipoSolicitud === 'GARANTIA' 
                                            ? 'Describa el problema o defecto del producto...' 
                                            : 'Describa el motivo de la devolución...'
                                        }
                                    />
                                    {(tipoSolicitud === 'GARANTIA' ? errors.motivo : errors.motivo_devolucion) && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {tipoSolicitud === 'GARANTIA' ? errors.motivo : errors.motivo_devolucion}
                                        </p>
                                    )}
                                </div>

                                {/* Detalles adicionales */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Detalles Adicionales
                                        <span className="text-gray-500 text-xs ml-2">(Opcional pero recomendado)</span>
                                    </label>
                                    <textarea
                                        value={formData.detalles_adicionales || ''}
                                        onChange={(e) => updateFormData('detalles_adicionales', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={4}
                                        placeholder="Proporcione detalles adicionales como: circunstancias del daño, tiempo de uso, condiciones ambientales, observaciones especiales, etc."
                                    />
                                </div>

                                {/* Información adicional según el caso */}
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h5 className="text-sm font-medium text-gray-800 mb-2">Información de contexto:</h5>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div>• Factura: #{formData.factura_venta_id}</div>
                                        <div>• Cliente: {formData.cliente.nombre} {formData.cliente.apellido}</div>
                                        <div>• Tipo de proceso: {tipoSolicitud === 'GARANTIA' ? 'Garantía' : 'Devolución'}</div>
                                        <div>• Balance: {carritoData?.resumen?.balance_tipo === 'favor_cliente' ? 'A favor del cliente' : 
                                                        carritoData?.resumen?.balance_tipo === 'favor_empresa' ? 'A favor de la empresa' : 
                                                        'Equilibrado'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <FotosStep
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                    />
                );
            case 6:
                const casoUso = carritoData?.resumen?.caso_uso || formData.caso_uso;
                return (
                    <RevisionStep
                        formData={formData}
                        casoUso={casosUso.find(c => c.id === casoUso)}
                        onSubmit={submitForm}
                        loading={loading}
                        errors={errors}
                        carritoData={carritoData}
                    />
                );
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

                {/* Step Indicator - Responsive */}
                <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
                    <StepIndicator steps={steps} currentStep={currentStep} />
                </div>

                {/* Step Content - Responsive */}
                <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
                    <div className="max-w-none">
                        {renderStepContent()}
                    </div>
                </div>

                {/* Navigation - Responsive */}
                <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between">
                        {/* Botón Anterior */}
                        <div className="order-2 sm:order-1">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`w-full sm:w-auto px-4 py-3 sm:py-2 rounded-md font-medium transition-colors ${
                                    currentStep === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                                }`}
                            >
                                <span className="hidden sm:inline">← Anterior</span>
                                <span className="sm:hidden">← Volver</span>
                            </button>
                        </div>

                        {/* Botón Siguiente/Enviar */}
                        <div className="order-1 sm:order-2">
                            {currentStep < steps.length ? (
                                <button
                                    onClick={nextStep}
                                    disabled={validating}
                                    className={`w-full sm:w-auto px-6 py-3 sm:py-2 rounded-md font-medium text-white transition-colors ${
                                        validating 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                                    }`}
                                >
                                    {validating ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Validando...</span>
                                        </div>
                                    ) : (
                                        <span>Siguiente →</span>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={submitForm}
                                    disabled={loading}
                                    className={`w-full sm:w-auto px-6 py-3 sm:py-2 rounded-md font-medium text-white transition-colors ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Enviando...</span>
                                        </div>
                                    ) : (
                                        <span>Crear Garantía</span>
                                    )}
                                </button>
                            )}
                        </div>
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