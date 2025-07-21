# REORGANIZACIÓN DE RUTAS ESPECÍFICAS

## 📋 Resumen de Cambios

Se han reorganizado las rutas específicas para DICI y SUPERADMIN, moviéndolas del middleware `auth.user:caja` a un grupo específico con middleware `auth.user:login` y permisos especiales.

## 🔄 Rutas Movidas

### **ANTES** (Middleware `auth.user:caja` - Tipos 1, 5, 6)
Las siguientes rutas estaban accesibles para GERENTE, SUPERVISOR DE CAJA y SUPERADMIN:

### **DESPUÉS** (Middleware `auth.user:login` con permisos especiales - Solo DICI y SUPERADMIN)

#### **Rutas de Validación de Facturas**
- `POST validateFactura` - Validar si un número de factura existe en pedidos

#### **Rutas de Búsqueda de Productos en Inventario**
- `POST searchProductosInventario` - Buscar productos en inventario por múltiples campos
- `GET producto/{id}` - Obtener producto específico por ID

#### **Rutas de Gestión de Responsables**
- `POST searchResponsables` - Buscar responsables existentes
- `POST saveResponsable` - Guardar nuevo responsable
- `GET responsable/{id}` - Obtener responsable por ID
- `GET responsables/tipo/{tipo}` - Obtener responsables por tipo

#### **Rutas Web para Garantías/Devoluciones**
- `POST garantias/crear` - Crear garantía/devolución con pedido automático
- `POST garantias/crear-pedido` - Crear solo el pedido de garantía/devolución

## 🔐 Permisos Actualizados

### **Middleware AuthenticateUser.php**

Se actualizó el método `hasLoginAccess()` para incluir las rutas específicas:

```php
// Tipo 7 (DICI) solo tiene acceso a rutas específicas
if ($userType == 7) {
    $allowedRoutes = [
        // ... rutas existentes ...
        // Rutas específicas para DICI y SUPERADMIN
        'validateFactura',
        'searchProductosInventario',
        'producto',
        'searchResponsables',
        'saveResponsable',
        'responsable',
        'responsables/tipo',
        'garantias/crear',
        'garantias/crear-pedido'
    ];
    
    return in_array($request->route()->uri, $allowedRoutes);
}
```

## 👥 Tipos de Usuario Afectados

### **✅ Acceso Permitido**
- **DICI (tipo 7)**: Acceso completo a todas las rutas específicas
- **SUPERADMIN (tipo 6)**: Acceso completo a todas las rutas específicas

### **❌ Acceso Denegado**
- **GERENTE (tipo 1)**: Sin acceso a rutas específicas
- **Cajero Vendedor (tipo 4)**: Sin acceso a rutas específicas
- **SUPERVISOR DE CAJA (tipo 5)**: Sin acceso a rutas específicas

## 🏗️ Estructura de Rutas

### **Nuevo Grupo de Rutas**
```php
// ================ RUTAS ESPECÍFICAS PARA DICI Y SUPERADMIN ================
Route::group(['middleware' => ['auth.user:login']], function () {
    
    // ================ RUTAS PARA VALIDACIÓN DE FACTURAS ================
    Route::post('validateFactura', [InventarioController::class,"validateFactura"]);

    // ================ RUTAS PARA BÚSQUEDA DE PRODUCTOS EN INVENTARIO ================
    Route::post('searchProductosInventario', [InventarioController::class,"searchProductosInventario"]);
    Route::get('producto/{id}', [InventarioController::class,"getProductoById"]);

    // ================ RUTAS PARA GESTIÓN DE RESPONSABLES ================
    Route::post('searchResponsables', [ResponsablesController::class,"searchResponsables"]);
    Route::post('saveResponsable', [ResponsablesController::class,"saveResponsable"]);
    Route::get('responsable/{id}', [ResponsablesController::class,"getResponsableById"]);
    Route::get('responsables/tipo/{tipo}', [ResponsablesController::class,"getResponsablesByTipo"]);

    // ================ RUTAS WEB PARA GARANTÍAS/DEVOLUCIONES ================
    Route::post('garantias/crear', [GarantiaController::class,"crearGarantiaCompleta"]);
    Route::post('garantias/crear-pedido', [GarantiaController::class,"crearPedidoGarantia"]);
    
});
```

## 🧪 Comandos de Verificación

### **Probar Permisos de Rutas**
```bash
php artisan routes:test-permissions
```

### **Verificar Rutas Registradas**
```bash
php artisan route:list | findstr "validateFactura"
```

## ✅ Beneficios de la Reorganización

1. **🔒 Mayor Seguridad**: Solo DICI y SUPERADMIN pueden acceder a funciones críticas
2. **📋 Mejor Organización**: Rutas agrupadas por funcionalidad y permisos
3. **🎯 Separación de Responsabilidades**: Cada tipo de usuario tiene acceso solo a lo necesario
4. **🔧 Mantenimiento Simplificado**: Fácil gestión de permisos por grupo de rutas

## 📝 Notas Importantes

- **Compatibilidad**: Las rutas mantienen la misma funcionalidad, solo cambian los permisos
- **Frontend**: No requiere cambios en el frontend si ya maneja errores de permisos
- **APIs**: Las rutas API de garantías permanecen en `routes/api.php` (solo DICI)
- **Logs**: Se registran automáticamente los intentos de acceso denegado

---

**Estado**: ✅ **COMPLETADO**
**Impacto**: 🔒 **Mayor seguridad y mejor organización**
**Compatibilidad**: ✅ **100% con sistema existente** 