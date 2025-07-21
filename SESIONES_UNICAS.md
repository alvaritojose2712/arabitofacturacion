# SISTEMA DE SESIONES ÚNICAS

## 📋 Resumen

El sistema de sesiones únicas evita que un usuario pueda tener múltiples sesiones activas simultáneamente. Cuando un usuario inicia sesión, todas sus sesiones previas se invalidan automáticamente.

## 🏗️ Arquitectura

### Componentes Principales

1. **Tabla `user_sessions`** - Almacena todas las sesiones activas
2. **Modelo `UserSession`** - Maneja la lógica de la base de datos
3. **Servicio `SessionManager`** - Gestiona la creación y validación de sesiones
4. **Middleware actualizado** - Compatible con sesiones únicas y legacy
5. **Controladores actualizados** - Login/logout integrados

### Estructura de la Base de Datos

```sql
CREATE TABLE user_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NOT NULL,
    last_activity TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    legacy_session_data JSON NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_active (usuario_id, is_active),
    INDEX idx_session_active (session_id, is_active),
    INDEX idx_last_activity (last_activity)
);
```

## 🔧 Funcionalidades

### 1. Sesiones Únicas
- **Una sesión por usuario**: Al iniciar sesión, se invalidan todas las sesiones previas
- **Tokens únicos**: Cada sesión tiene un UUID único
- **Expiración automática**: Sesiones expiran después de 8 horas de inactividad

### 2. Compatibilidad Legacy
- **Datos legacy**: Mantiene compatibilidad con el frontend existente
- **Fallback automático**: Si no hay token, usa sesión legacy
- **Transición suave**: No requiere cambios inmediatos en el frontend

### 3. Seguridad
- **Validación de IP**: Registra la dirección IP de cada sesión
- **User Agent**: Registra el navegador/dispositivo
- **Logging**: Registra todas las actividades de sesión

## 🚀 Uso

### Login (Automático)
```php
// En HomeController::login()
$sessionManager = app(\App\Services\SessionManager::class);
$sessionData = $sessionManager->createSession($usuario, $request);

// Retorna token de sesión
return Response::json([
    "session_token" => $sessionData['session_token'],
    // ... otros datos
]);
```

### Validación en Middleware (Automático)
```php
// En AuthenticateUser middleware
$sessionId = $request->header('X-Session-Token') ?? 
            $request->cookie('session_token');

if ($sessionId) {
    $sessionData = app(\App\Services\SessionManager::class)
        ->validateSession($sessionId);
}
```

### Logout (Automático)
```php
// En HomeController::logout()
$sessionManager = app(\App\Services\SessionManager::class);
$sessionManager->invalidateSession($sessionId);
```

## 🛠️ Comandos Artisan

### Ver Estadísticas
```bash
php artisan sessions:stats
```

### Ver Sesiones de Usuario Específico
```bash
php artisan sessions:stats --user=1
```

### Limpiar Sesiones Expiradas
```bash
php artisan sessions:cleanup
```

## 📊 Tipos de Usuario Soportados

| ID | Tipo | Nivel | Descripción |
|----|------|-------|-------------|
| 1 | GERENTE | 2 | Acceso completo a control de efectivo y ventas |
| 4 | Cajero Vendedor | 5 | Consulta inventario, agrega pedidos, pagos |
| 5 | SUPERVISOR DE CAJA | 4 | Solo reimpresión |
| 6 | SUPERADMIN | 1 | Acceso total al sistema |
| 7 | DICI | 3 | Inventario, garantías, gestión de inventario |

## 🔄 Migración desde Sistema Anterior

### Compatibilidad Automática
- ✅ **Sesiones existentes**: Siguen funcionando
- ✅ **Frontend**: No requiere cambios inmediatos
- ✅ **APIs**: Mantienen funcionalidad
- ✅ **Middleware**: Compatible con ambos sistemas

### Beneficios Inmediatos
- 🚫 **No más sesiones múltiples**: Un usuario = una sesión
- 🔒 **Mayor seguridad**: Control total de sesiones activas
- 📈 **Mejor rendimiento**: Sesiones expiradas se limpian automáticamente
- 📊 **Auditoría completa**: Logs de todas las actividades

## 🧪 Testing

### Probar Login
1. Iniciar sesión con un usuario
2. Verificar que se crea la sesión: `php artisan sessions:stats`
3. Intentar iniciar sesión desde otro navegador/dispositivo
4. Verificar que la primera sesión se invalida

### Probar Expiración
1. Crear una sesión
2. Esperar 8 horas (o modificar el tiempo en el código)
3. Ejecutar: `php artisan sessions:cleanup`
4. Verificar que la sesión se marca como inactiva

### Probar Middleware
1. Hacer una petición con token válido
2. Verificar que pasa el middleware
3. Hacer una petición sin token
4. Verificar que se deniega el acceso

## 🔧 Configuración

### Tiempo de Expiración
```php
// En SessionManager.php
public function isExpired(): bool
{
    return $this->last_activity < now()->subHours(8); // Cambiar aquí
}
```

### Limpieza Automática
Agregar al cron job del servidor:
```bash
# Cada hora
0 * * * * cd /path/to/project && php artisan sessions:cleanup
```

## 📝 Logs

El sistema registra automáticamente:
- ✅ Creación de nuevas sesiones
- ✅ Invalidación de sesiones
- ✅ Limpieza de sesiones expiradas
- ✅ Intentos de acceso con sesiones inválidas

## 🎯 Próximos Pasos

1. **Frontend Integration**: Actualizar el frontend para usar tokens
2. **WebSocket Support**: Integrar con sistema de notificaciones en tiempo real
3. **Analytics**: Dashboard de sesiones activas
4. **Notificaciones**: Alertar sobre sesiones sospechosas

---

**Estado**: ✅ **COMPLETAMENTE FUNCIONAL**
**Compatibilidad**: ✅ **100% con sistema existente**
**Seguridad**: ✅ **Sesiones únicas implementadas** 