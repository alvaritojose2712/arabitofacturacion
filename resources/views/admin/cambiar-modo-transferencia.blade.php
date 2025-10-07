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
<body class="min-h-screen bg-gray-100">
    <div class="container px-4 py-8 mx-auto">
        <!-- Header -->
        <div class="p-6 mb-6 bg-white rounded-lg shadow-md">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="flex items-center text-2xl font-bold text-gray-800">
                        <i class="mr-3 text-blue-600 fas fa-cogs"></i>
                        Configuración de Modo de Transferencia
                    </h1>
                    <p class="mt-2 text-gray-600">Solo administradores pueden cambiar esta configuración</p>
                </div>
                <div class="text-right">
                    <div class="px-4 py-2 bg-blue-100 rounded-lg">
                        <p class="text-sm font-medium text-blue-800">Modo Actual</p>
                        <p class="text-lg font-bold text-blue-900" id="modo-actual">{{ strtoupper($modo_actual) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Información de Modos -->
        <div class="grid gap-6 mb-6 md:grid-cols-3">
            <div class="p-6 bg-white rounded-lg shadow-md">
                <div class="flex items-center mb-4">
                    <i class="mr-3 text-2xl text-purple-600 fas fa-code"></i>
                    <h3 class="text-lg font-semibold text-gray-800">Código</h3>
                </div>
                <p class="text-sm text-gray-600">Requiere código de aprobación manual para cada transferencia</p>
                <div class="inline-block px-3 py-1 mt-3 text-xs text-purple-800 bg-purple-100 rounded-full">
                    Seguridad Alta
                </div>
            </div>

            <div class="p-6 bg-white rounded-lg shadow-md">
                <div class="flex items-center mb-4">
                    <i class="mr-3 text-2xl text-green-600 fas fa-server"></i>
                    <h3 class="text-lg font-semibold text-gray-800">Central</h3>
                </div>
                <p class="text-sm text-gray-600">Procesa transferencias a través del servidor central</p>
                <div class="inline-block px-3 py-1 mt-3 text-xs text-green-800 bg-green-100 rounded-full">
                    Automatizado
                </div>
            </div>

            <div class="p-6 bg-white rounded-lg shadow-md">
                <div class="flex items-center mb-4">
                    <i class="mr-3 text-2xl text-blue-600 fas fa-credit-card"></i>
                    <h3 class="text-lg font-semibold text-gray-800">Megasoft</h3>
                </div>
                <p class="text-sm text-gray-600">Integración directa con el sistema Megasoft</p>
                <div class="inline-block px-3 py-1 mt-3 text-xs text-blue-800 bg-blue-100 rounded-full">
                    Integración
                </div>
            </div>
        </div>

        <!-- Formulario de Cambio -->
        <div class="p-6 bg-white rounded-lg shadow-md">
            <h2 class="flex items-center mb-6 text-xl font-semibold text-gray-800">
                <i class="mr-3 text-orange-600 fas fa-exchange-alt"></i>
                Cambiar Modo de Transferencia
            </h2>

            <form id="form-cambio-modo">
                <!-- Paso 1: Generar Código -->
                <div class="mb-6" id="paso-generar-codigo">
                    <h3 class="mb-4 text-lg font-medium text-gray-700">Paso 1: Generar Código Secreto</h3>
                    <div class="flex items-center space-x-4">
                        <button type="button" id="btn-generar-codigo" 
                                class="flex items-center px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                            <i class="mr-2 fas fa-key"></i>
                            Generar Código
                        </button>
                        <div id="codigo-generado" class="hidden">
                            <div class="px-4 py-2 bg-gray-100 rounded-lg">
                                <p class="text-sm text-gray-600">Código generado:</p>
                                <p class="font-mono text-2xl font-bold text-blue-600" id="codigo-display"></p>
                                <p class="mt-1 text-xs text-gray-500">Válido por 5 minutos</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Paso 2: Seleccionar Modo -->
                <div class="mb-6" id="paso-seleccionar-modo" style="display: none;">
                    <h3 class="mb-4 text-lg font-medium text-gray-700">Paso 2: Seleccionar Nuevo Modo</h3>
                    <div class="grid gap-4 md:grid-cols-3">
                        <label class="cursor-pointer">
                            <input type="radio" name="nuevo_modo" value="codigo" class="sr-only">
                            <div class="p-4 transition-colors border-2 border-gray-200 rounded-lg hover:border-purple-500 radio-option">
                                <div class="flex items-center justify-center mb-2">
                                    <i class="text-3xl text-purple-600 fas fa-code"></i>
                                </div>
                                <h4 class="font-medium text-center text-gray-800">Código</h4>
                                <p class="mt-1 text-sm text-center text-gray-600">Aprobación manual</p>
                            </div>
                        </label>

                        <label class="cursor-pointer">
                            <input type="radio" name="nuevo_modo" value="central" class="sr-only">
                            <div class="p-4 transition-colors border-2 border-gray-200 rounded-lg hover:border-green-500 radio-option">
                                <div class="flex items-center justify-center mb-2">
                                    <i class="text-3xl text-green-600 fas fa-server"></i>
                                </div>
                                <h4 class="font-medium text-center text-gray-800">Central</h4>
                                <p class="mt-1 text-sm text-center text-gray-600">Servidor central</p>
                            </div>
                        </label>

                        <label class="cursor-pointer">
                            <input type="radio" name="nuevo_modo" value="megasoft" class="sr-only">
                            <div class="p-4 transition-colors border-2 border-gray-200 rounded-lg hover:border-blue-500 radio-option">
                                <div class="flex items-center justify-center mb-2">
                                    <i class="text-3xl text-blue-600 fas fa-credit-card"></i>
                                </div>
                                <h4 class="font-medium text-center text-gray-800">Megasoft</h4>
                                <p class="mt-1 text-sm text-center text-gray-600">Integración directa</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Paso 3: Ingresar Clave -->
                <div class="mb-6" id="paso-ingresar-clave" style="display: none;">
                    <h3 class="mb-4 text-lg font-medium text-gray-700">Paso 3: Ingresar Clave Secreta</h3>
                    <div class="max-w-md">
                        <label class="block mb-2 text-sm font-medium text-gray-700">
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
                            class="px-6 py-2 font-medium text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600">
                        <i class="mr-2 fas fa-arrow-left"></i>
                        Volver
                    </button>
                    <button type="submit" id="btn-cambiar-modo"
                            class="px-6 py-2 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700">
                        <i class="mr-2 fas fa-save"></i>
                        Cambiar Modo de Transferencia
                    </button>
                </div>
            </form>
        </div>

        <!-- Alertas -->
        <div id="alert-container" class="fixed z-50 top-4 right-4"></div>
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
