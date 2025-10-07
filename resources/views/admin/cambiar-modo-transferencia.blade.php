<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Cambiar Modo de Transferencia - Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 flex items-center">
                        <i class="fas fa-cogs mr-3 text-blue-600"></i>
                        Configuración de Modo de Transferencia
                    </h1>
                    <p class="text-gray-600 mt-2">Solo administradores pueden cambiar esta configuración</p>
                </div>
                <div class="text-right">
                    <div class="bg-blue-100 px-4 py-2 rounded-lg">
                        <p class="text-sm text-blue-800 font-medium">Modo Actual</p>
                        <p class="text-lg font-bold text-blue-900" id="modo-actual">{{ strtoupper($modo_actual) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Información de Modos -->
        <div class="grid md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center mb-4">
                    <i class="fas fa-code text-purple-600 text-2xl mr-3"></i>
                    <h3 class="text-lg font-semibold text-gray-800">Código</h3>
                </div>
                <p class="text-gray-600 text-sm">Requiere código de aprobación manual para cada transferencia</p>
                <div class="mt-3 px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full inline-block">
                    Seguridad Alta
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center mb-4">
                    <i class="fas fa-server text-green-600 text-2xl mr-3"></i>
                    <h3 class="text-lg font-semibold text-gray-800">Central</h3>
                </div>
                <p class="text-gray-600 text-sm">Procesa transferencias a través del servidor central</p>
                <div class="mt-3 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full inline-block">
                    Automatizado
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center mb-4">
                    <i class="fas fa-credit-card text-blue-600 text-2xl mr-3"></i>
                    <h3 class="text-lg font-semibold text-gray-800">Megasoft</h3>
                </div>
                <p class="text-gray-600 text-sm">Integración directa con el sistema Megasoft</p>
                <div class="mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full inline-block">
                    Integración
                </div>
            </div>
        </div>

        <!-- Formulario de Cambio -->
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <i class="fas fa-exchange-alt mr-3 text-orange-600"></i>
                Cambiar Modo de Transferencia
            </h2>

            <form id="form-cambio-modo">
                <!-- Paso 1: Generar Código -->
                <div class="mb-6" id="paso-generar-codigo">
                    <h3 class="text-lg font-medium text-gray-700 mb-4">Paso 1: Generar Código Secreto</h3>
                    <div class="flex items-center space-x-4">
                        <button type="button" id="btn-generar-codigo" 
                                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                            <i class="fas fa-key mr-2"></i>
                            Generar Código
                        </button>
                        <div id="codigo-generado" class="hidden">
                            <div class="bg-gray-100 px-4 py-2 rounded-lg">
                                <p class="text-sm text-gray-600">Código generado:</p>
                                <p class="text-2xl font-bold text-blue-600 font-mono" id="codigo-display"></p>
                                <p class="text-xs text-gray-500 mt-1">Válido por 5 minutos</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Paso 2: Seleccionar Modo -->
                <div class="mb-6" id="paso-seleccionar-modo" style="display: none;">
                    <h3 class="text-lg font-medium text-gray-700 mb-4">Paso 2: Seleccionar Nuevo Modo</h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        <label class="cursor-pointer">
                            <input type="radio" name="nuevo_modo" value="codigo" class="sr-only">
                            <div class="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-500 transition-colors radio-option">
                                <div class="flex items-center justify-center mb-2">
                                    <i class="fas fa-code text-purple-600 text-3xl"></i>
                                </div>
                                <h4 class="text-center font-medium text-gray-800">Código</h4>
                                <p class="text-center text-sm text-gray-600 mt-1">Aprobación manual</p>
                            </div>
                        </label>

                        <label class="cursor-pointer">
                            <input type="radio" name="nuevo_modo" value="central" class="sr-only">
                            <div class="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors radio-option">
                                <div class="flex items-center justify-center mb-2">
                                    <i class="fas fa-server text-green-600 text-3xl"></i>
                                </div>
                                <h4 class="text-center font-medium text-gray-800">Central</h4>
                                <p class="text-center text-sm text-gray-600 mt-1">Servidor central</p>
                            </div>
                        </label>

                        <label class="cursor-pointer">
                            <input type="radio" name="nuevo_modo" value="megasoft" class="sr-only">
                            <div class="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors radio-option">
                                <div class="flex items-center justify-center mb-2">
                                    <i class="fas fa-credit-card text-blue-600 text-3xl"></i>
                                </div>
                                <h4 class="text-center font-medium text-gray-800">Megasoft</h4>
                                <p class="text-center text-sm text-gray-600 mt-1">Integración directa</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Paso 3: Ingresar Clave -->
                <div class="mb-6" id="paso-ingresar-clave" style="display: none;">
                    <h3 class="text-lg font-medium text-gray-700 mb-4">Paso 3: Ingresar Clave Secreta</h3>
                    <div class="max-w-md">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Clave Secreta (calculada desde el código)
                        </label>
                        <input type="password" id="codigo_secreto" name="codigo_secreto" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                               placeholder="Ingrese la clave calculada">
                       
                    </div>
                </div>

                <!-- Botón de Envío -->
                <div class="flex items-center justify-between pt-6 border-t border-gray-200" id="paso-enviar" style="display: none;">
                    <button type="button" onclick="window.history.back()" 
                            class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Volver
                    </button>
                    <button type="submit" id="btn-cambiar-modo"
                            class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        <i class="fas fa-save mr-2"></i>
                        Cambiar Modo de Transferencia
                    </button>
                </div>
            </form>
        </div>

        <!-- Alertas -->
        <div id="alert-container" class="fixed top-4 right-4 z-50"></div>
    </div>

    <script>
        // Configurar CSRF token para axios
        axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        let codigoGenerado = null;

        // Función para mostrar alertas
        function mostrarAlerta(mensaje, tipo = 'info') {
            const alertContainer = document.getElementById('alert-container');
            const alertId = 'alert-' + Date.now();
            
            const colores = {
                'success': 'bg-green-500',
                'error': 'bg-red-500',
                'info': 'bg-blue-500',
                'warning': 'bg-yellow-500'
            };

            const iconos = {
                'success': 'fa-check-circle',
                'error': 'fa-exclamation-circle',
                'info': 'fa-info-circle',
                'warning': 'fa-exclamation-triangle'
            };

            const alertHTML = `
                <div id="${alertId}" class="mb-4 ${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300">
                    <div class="flex items-center">
                        <i class="fas ${iconos[tipo]} mr-3"></i>
                        <span>${mensaje}</span>
                        <button onclick="cerrarAlerta('${alertId}')" class="ml-4 text-white hover:text-gray-200">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;

            alertContainer.insertAdjacentHTML('beforeend', alertHTML);
            
            // Mostrar la alerta
            setTimeout(() => {
                document.getElementById(alertId).classList.remove('translate-x-full');
            }, 100);

            // Auto-cerrar después de 5 segundos
            setTimeout(() => {
                cerrarAlerta(alertId);
            }, 5000);
        }

        function cerrarAlerta(alertId) {
            const alert = document.getElementById(alertId);
            if (alert) {
                alert.classList.add('translate-x-full');
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }
        }

        // Generar código secreto
        document.getElementById('btn-generar-codigo').addEventListener('click', async function() {
            try {
                const response = await axios.post('/generarCodigoSecreto');
                
                if (response.data.estado) {
                    codigoGenerado = response.data.codigo_generado;
                    document.getElementById('codigo-display').textContent = codigoGenerado;
                    document.getElementById('codigo-generado').classList.remove('hidden');
                    document.getElementById('paso-seleccionar-modo').style.display = 'block';
                    
                    mostrarAlerta(response.data.msj, 'success');
                } else {
                    mostrarAlerta(response.data.msj, 'error');
                }
            } catch (error) {
                mostrarAlerta('Error al generar código: ' + (error.response?.data?.msj || error.message), 'error');
            }
        });

        // Manejar selección de modo
        document.querySelectorAll('input[name="nuevo_modo"]').forEach(radio => {
            radio.addEventListener('change', function() {
                // Actualizar estilos visuales
                document.querySelectorAll('.radio-option').forEach(option => {
                    option.classList.remove('border-blue-500', 'bg-blue-50');
                    option.classList.add('border-gray-200');
                });

                const selectedOption = this.parentElement.querySelector('.radio-option');
                selectedOption.classList.remove('border-gray-200');
                selectedOption.classList.add('border-blue-500', 'bg-blue-50');

                // Mostrar siguiente paso
                document.getElementById('paso-ingresar-clave').style.display = 'block';
                document.getElementById('paso-enviar').style.display = 'flex';
            });
        });

        // Manejar envío del formulario
        document.getElementById('form-cambio-modo').addEventListener('submit', async function(e) {
            e.preventDefault();

            const nuevoModo = document.querySelector('input[name="nuevo_modo"]:checked')?.value;
            const codigoSecreto = document.getElementById('codigo_secreto').value;

            if (!nuevoModo) {
                mostrarAlerta('Debe seleccionar un modo de transferencia', 'warning');
                return;
            }

            if (!codigoSecreto) {
                mostrarAlerta('Debe ingresar la clave secreta', 'warning');
                return;
            }

            try {
                const response = await axios.post('/cambiarmodotransferencia', {
                    nuevo_modo: nuevoModo,
                    codigo_secreto: codigoSecreto
                });

                if (response.data.estado) {
                    mostrarAlerta(response.data.msj, 'success');
                    
                    // Actualizar modo actual en la interfaz
                    document.getElementById('modo-actual').textContent = nuevoModo.toUpperCase();
                    
                    // Resetear formulario después de 2 segundos
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    mostrarAlerta(response.data.msj, 'error');
                }
            } catch (error) {
                mostrarAlerta('Error al cambiar modo: ' + (error.response?.data?.msj || error.message), 'error');
            }
        });
    </script>
</body>
</html>
