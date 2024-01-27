<?php

use App\Http\Controllers\TareaslocalController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CatcajasController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\MonedaController;
use App\Http\Controllers\ItemsPedidosController;
use App\Http\Controllers\ClientesController;
use App\Http\Controllers\MovimientosCajaController;

use App\Http\Controllers\PagoPedidosController;
use App\Http\Controllers\MovimientosController;
use App\Http\Controllers\ProveedoresController;
use App\Http\Controllers\CategoriasController;


use App\Http\Controllers\MarcasController;
use App\Http\Controllers\DepositosController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\ItemsFacturaController;
use App\Http\Controllers\SucursalController;
use App\Http\Controllers\tickera;
use App\Http\Controllers\sendCentral;
use App\Http\Controllers\UsuariosController;
use App\Http\Controllers\LotesController;
use App\Http\Controllers\PagoFacturasController;
use App\Http\Controllers\PagosReferenciasController;
use App\Http\Controllers\GastosController;
use App\Http\Controllers\tickeprecioController;
use App\Http\Controllers\CierresController;
use App\Http\Controllers\DevolucionesController;
use App\Http\Controllers\MovimientosInventarioController;
use App\Http\Controllers\MovimientosInventariounitarioController;

use App\Http\Controllers\CajasController;
Route::get('checkroutes', [PedidosController::class,"checkroutes"]);
Route::get('checkPed', [PedidosController::class,"checkPed"]);
Route::get('checkCt', [PedidosController::class, "checkCt"]);
Route::get('completePed', [PedidosController::class, "completePed"]);
Route::get('repareId', [PedidosController::class, "repareId"]);




Route::get('getip', [sendCentral::class,"getip"]);
Route::get('/update', function () {
    return '
		c:\\xampp\mysql\bin\mysql -u root -p sinapsis --binary-mode o < sinapsisData.sql <br/>
		git stash <br/>
		c:\\xampp\mysql\bin\mysqldump -u root -p --no-create-db --no-create-info --complete-insert --extended-insert sinapsis > sinapsisData.sql <br/>
		git stash <br/>
		git pull https://github.com/alvaritojose2712/arabitofacturacion.git <br/>
		php artisan optimize <br/>
		php artisan optimize:clear <br/>
	';
});
Route::get('/backup', function () {
    \Illuminate\Support\Facades\Artisan::call('database:backup');
    return 'Respaldo Exitoso!';
});

Route::get('/backup-run', function () {

    \Illuminate\Support\Facades\Artisan::call('backup:run');

    return 'Copia de seguridad completada!';

});
Route::get('error', function (){
	return view("layouts.error");
})->name("error");



Route::get('sendAllTest', [sendCentral::class,"sendAllTest"]);
Route::get('', [HomeController::class,"index"]);

Route::get('senComoVamos', [sendCentral::class,"sendComovamos"]);

Route::get('closeAllSession', [HomeController::class,"closeAllSession"]);
Route::post('login', [HomeController::class,"login"]);
Route::get('logout', [HomeController::class,"logout"]);
Route::post('verificarLogin', [HomeController::class,"verificarLogin"]);

Route::get('sucursal', [SucursalController::class,"index"]);
Route::get('setSucursal', [SucursalController::class,"setSucursal"])->name("setSucursal");
Route::get('getSucursal', [SucursalController::class,"getSucursal"]);
Route::post('getMoneda', [MonedaController::class,"getMoneda"]);
Route::post('today', [PedidosController::class,"today"]);

//Fuera de los middlewares debido a que es la ruta mas solicitadad de la app. Mejora el rendimiento al hacer menos calculos
Route::post('getinventario', [InventarioController::class,"index"]);
Route::get('getcatsCajas', [CatcajasController::class,"getcatsCajas"]);
Route::post('getNomina', [sendCentral::class,"getNomina"]);


Route::get('/importarcatcajas', [sendCentral::class,"getCatCajas"]);

Route::group(['middleware' => ['login']], function () {
	
	Route::group(['middleware' => ['caja']], function () {

		Route::post('setGastoOperativo', [PagoPedidosController::class,"setGastoOperativo"]);


		Route::post('getStatusCierre', [CierresController::class,"getStatusCierre"]);

		
		Route::get('addNewPedido', [PedidosController::class,"addNewPedido"]);
		Route::get('setCarrito', [InventarioController::class,"setCarrito"]);

		Route::post('getPedidosList', [PedidosController::class,"getPedidosUser"]);
		
		Route::get('getReferenciasElec', [PagosReferenciasController::class,"getReferenciasElec"]);

		Route::post('getVentas', [PedidosController::class,"getVentas"]);
		Route::post('getPedido', [PedidosController::class,"getPedido"]);
		Route::post('getPedidosFast', [PedidosController::class,"getPedidosFast"]);
		Route::post('delItemPedido', [ItemsPedidosController::class,"delItemPedido"]);
		Route::post('changeEntregado', [ItemsPedidosController::class,"changeEntregado"]);
		
		Route::post('setCantidad', [ItemsPedidosController::class,"setCantidad"]);
		Route::post('setpersonacarrito', [PedidosController::class,"setpersonacarrito"]);
		
		Route::post('setPrecioAlternoCarrito', [ItemsPedidosController::class,"setPrecioAlternoCarrito"]);
		Route::post('setCtxBultoCarrito', [ItemsPedidosController::class,"setCtxBultoCarrito"]);
		
		Route::post('getPedidos', [PedidosController::class,"getPedidos"]);
		
		Route::get('notaentregapedido', [PedidosController::class,"notaentregapedido"]);
		
		Route::post('setDescuentoUnitario', [ItemsPedidosController::class,"setDescuentoUnitario"]);
		Route::post('setDescuentoTotal', [ItemsPedidosController::class,"setDescuentoTotal"]);
	
		Route::post('getpersona', [ClientesController::class,"getpersona"]);
		
		Route::post('setPagoPedido', [PagoPedidosController::class,"setPagoPedido"]);
		
		Route::post('setconfigcredito', [PagoPedidosController::class,"setconfigcredito"]);
		

		Route::post('addRefPago', [PagosReferenciasController::class,"addRefPago"]);
		Route::post('delRefPago', [PagosReferenciasController::class,"delRefPago"]);
		
		Route::post('setMoneda', [MonedaController::class,"setMoneda"]);
		
		Route::post('setPagoCredito', [PagoPedidosController::class,"setPagoCredito"]);
		
		Route::post('getDeudores', [PagoPedidosController::class,"getDeudores"]);
		Route::post('getDeudor', [PagoPedidosController::class,"getDeudor"]);
		Route::post('checkDeuda', [PagoPedidosController::class,"checkDeuda"]);
		
		
		Route::post('entregarVuelto', [PagoPedidosController::class,"entregarVuelto"]);
		
		Route::post('getMovimientosCaja', [MovimientosCajaController::class,"getMovimientosCaja"]);
		Route::post('setMovimientoCaja', [MovimientosCajaController::class,"setMovimientoCaja"]);
		
		Route::post('getMovimientos', [MovimientosController::class,"getMovimientos"]);
		Route::post('getBuscarDevolucion', [InventarioController::class,"index"]);
		Route::post('getBuscarDevolucionhistorico', [DevolucionesController::class,"getBuscarDevolucionhistorico"]);
		
		Route::post('setClienteCrud', [ClientesController::class,"setClienteCrud"]);
		Route::post('getClienteCrud', [ClientesController::class,"getpersona"]);
		Route::post('delCliente', [ClientesController::class,"delCliente"]);
		Route::get('sumpedidos', [PedidosController::class,"sumpedidos"]);
		
		Route::post('imprimirTicked', [tickera::class,"imprimir"]);
		Route::get('getProductosSerial', [InventarioController::class,"getProductosSerial"]);

		Route::post('guardarCierre', [PedidosController::class,"guardarCierre"]);
		Route::get('verCierre', [PedidosController::class,"verCierre"]);
		Route::post('cerrar', [PedidosController::class,"cerrar"]);
		Route::post('getPermisoCierre', [TareaslocalController::class,"getPermisoCierre"]);
		Route::get('sendCuentasporCobrar', [PedidosController::class,"sendCuentasporCobrar"]);

		Route::post('createDevolucion', [DevolucionesController::class,"createDevolucion"]);
		Route::post('setDevolucion', [DevolucionesController::class,"setDevolucion"]);
		Route::post('setpagoDevolucion', [DevolucionesController::class,"setpagoDevolucion"]);
		Route::post('changepedidouser', [PedidosController::class,"changepedidouser"]);
		Route::get('getUsuarios', [UsuariosController::class,"getUsuarios"]);
		
		Route::post('delpedido', [PedidosController::class,"delpedido"]);

		
		
	});
	Route::group(['middleware' => ['vendedor']], function () {
		// Route::post('getinventario', [InventarioController::class,"index"]);
		// Route::post('setCarrito', [InventarioController::class,"setCarrito"]);
	});
	
	Route::group(['middleware' => ['admin']], function () {

		
		Route::get('openTransferenciaPedido', [InventarioController::class,"openTransferenciaPedido"]);
		Route::post('setPagoPedidoTrans', [PagoPedidosController::class,"setPagoPedidoTrans"]);
		
		Route::post('getControlEfec', [CajasController::class,"getControlEfec"]);
		Route::post('verificarMovPenControlEfec', [sendCentral::class,"verificarMovPenControlEfec"]);
		
		Route::post('delCaja', [CajasController::class,"delCaja"]);
		
		Route::post('setControlEfec', [CajasController::class,"setControlEfec"]);
		
		Route::get('delpedidoforce', [PedidosController::class,"delpedidoForce"]);
		Route::get('reversarCierre', [CierresController::class,"reversarCierre"]);
		
		
		
		Route::get('getTareasLocal', [TareaslocalController::class,"getTareasLocal"]);
		Route::get('resolverTareaLocal', [TareaslocalController::class,"resolverTareaLocal"]);
		
		Route::get('getHistoricoInventario', [MovimientosInventarioController::class,"getHistoricoInventario"]);
		Route::get('getmovientoinventariounitario', [MovimientosInventariounitarioController::class,"getmovientoinventariounitario"]);
		Route::post('getSyncProductosCentralSucursal', [InventarioController::class,"getSyncProductosCentralSucursal"]);
		
		Route::post('saveReplaceProducto', [InventarioController::class,"saveReplaceProducto"]);
		Route::post('guardarDeSucursalEnCentral', [InventarioController::class,"guardarDeSucursalEnCentral"]);
		
		
		
		
		/* GastosController */
		
		Route::get('getCierres', [PedidosController::class,"getCierres"]);
		Route::post('setProveedor', [ProveedoresController::class,"setProveedor"]);
		Route::post('guardarNuevoProducto', [InventarioController::class,"guardarNuevoProducto"]);
		Route::post('guardarNuevoProductoLote', [InventarioController::class,"guardarNuevoProductoLote"]);

		Route::post('setCtxBulto', [InventarioController::class,"setCtxBulto"]);
		Route::post('setStockMin', [InventarioController::class,"setStockMin"]);
		
		Route::post('setPrecioAlterno', [InventarioController::class,"setPrecioAlterno"]);
		
		Route::post('getProveedores', [ProveedoresController::class,"getProveedores"]);
		Route::get('getCategorias', [CategoriasController::class,"getCategorias"]);
		Route::post('delCategoria', [CategoriasController::class,"delCategoria"]);
		Route::post('setCategorias', [CategoriasController::class,"setCategorias"]);

		Route::post('delGastos', [GastosController::class,"delGastos"]);
		Route::post('getGastos', [GastosController::class,"getGastos"]);
		Route::post('setGasto', [GastosController::class,"setGasto"]);


	
		Route::post('delProveedor', [ProveedoresController::class,"delProveedor"]);
		Route::post('delProducto', [InventarioController::class,"delProducto"]);
	
		Route::post('getDepositos', [DepositosController::class,"getDepositos"]);
		Route::post('getMarcas', [MarcasController::class,"getMarcas"]);
		
		Route::post('getFacturas', [FacturaController::class,"getFacturas"]);
		Route::post('setFactura', [FacturaController::class,"setFactura"]);
		Route::post('sendFacturaCentral', [sendCentral::class,"sendFacturaCentral"]);
		Route::post('getAllProveedores', [sendCentral::class,"getAllProveedores"]);
		
		
		Route::post('delFactura', [FacturaController::class,"delFactura"]);
	
		Route::post('delItemFact', [ItemsFacturaController::class,"delItemFact"]);
		
		Route::post('getFallas', [InventarioController::class,"getFallas"]);
		Route::post('setFalla', [InventarioController::class,"setFalla"]);
		Route::post('delFalla', [InventarioController::class,"delFalla"]);
		Route::get('reporteFalla', [InventarioController::class,"reporteFalla"]);
		
		
		Route::post('removeLote', [LotesController::class,"removeLote"]);
		
		Route::get('verFactura', [FacturaController::class,"verFactura"]);
		Route::get('verDetallesImagenFactura', [FacturaController::class,"verDetallesImagenFactura"]);
		
		Route::post('setUsuario', [UsuariosController::class,"setUsuario"]);
		Route::post('delUsuario', [UsuariosController::class,"delUsuario"]);
		Route::get('verCreditos', [PagoPedidosController::class,"verCreditos"]);
		Route::get('reporteInventario', [InventarioController::class,"reporteInventario"]);
		Route::post('getEstaInventario', [InventarioController::class,"getEstaInventario"]);

		Route::post('changeIdVinculacionCentral', [InventarioController::class,"changeIdVinculacionCentral"]);

		Route::post('saveMontoFactura', [FacturaController::class,"saveMontoFactura"]);
		Route::post('setPagoProveedor', [PagoFacturasController::class,"setPagoProveedor"]);
		Route::post('getPagoProveedor', [PagoFacturasController::class,"getPagoProveedor"]);
		Route::post('delPagoProveedor', [PagoFacturasController::class,"delPagoProveedor"]);
		
		Route::post('delMovCaja', [MovimientosCajaController::class,"delMovCaja"]);
		
		Route::get('printTickedPrecio', [tickeprecioController::class,"tickedPrecio"]);
		Route::post('getTotalizarCierre', [CierresController::class,"getTotalizarCierre"]);

		Route::post('printPrecios', [tickera::class,"precio"]);
		
		
		Route::post('delMov', [MovimientosController::class,"delMov"]);
		
	//Central
		Route::post('checkPedidosCentral', [InventarioController::class,"checkPedidosCentral"]);
		Route::post('saveChangeInvInSucurFromCentral', [InventarioController::class,"saveChangeInvInSucurFromCentral"]);
		Route::get('getUniqueProductoById', [InventarioController::class,"getUniqueProductoById"]);

		
		
		Route::get('setVentas', [sendCentral::class,"setVentas"]);
		Route::get('setGastos', [sendCentral::class,"setGastos"]);
		Route::get('setCentralData', [sendCentral::class,"setCentralData"]);
		Route::get('central', [sendCentral::class,"index"]);
		Route::get('getMonedaCentral', [sendCentral::class,"getMonedaCentral"]);
		
		Route::get('setFacturasCentral', [sendCentral::class,"setFacturasCentral"]);
		
		Route::post('getmastermachine', [sendCentral::class,"getmastermachine"]);
		Route::post('setnewtasainsucursal', [sendCentral::class,"setnewtasainsucursal"]);
		Route::post('updatetasasfromCentral', [sendCentral::class,"updatetasasfromCentral"]);
		
		//req
		Route::get('setNuevaTareaCentral', [sendCentral::class,"setNuevaTareaCentral"]);
	
		Route::get('setSocketUrlDB', [sendCentral::class,"setSocketUrlDB"]);
		
		Route::post('reqpedidos', [sendCentral::class,"reqpedidos"]);
		Route::post('setInventarioFromSucursal', [sendCentral::class,"setInventarioFromSucursal"]);
		Route::post('getSucursales', [sendCentral::class,"getSucursales"]);
		Route::post('getInventarioSucursalFromCentral', [sendCentral::class,"getInventarioSucursalFromCentral"]);
		Route::post('setInventarioSucursalFromCentral', [sendCentral::class,"setInventarioSucursalFromCentral"]);
		
		Route::post('getInventarioFromSucursal', [sendCentral::class,"getInventarioFromSucursal"]);
		
		Route::post('setCambiosInventarioSucursal', [sendCentral::class,"setCambiosInventarioSucursal"]);
		Route::get('getTareasCentral', [sendCentral::class,"getTareasCentral"]);
		Route::post('runTareaCentral', [sendCentral::class,"runTareaCentral"]);
		
		//res
		Route::post('resinventario', [sendCentral::class,"resinventario"]);
		Route::post('respedidos', [sendCentral::class,"respedidos"]);
	
		Route::post('setexportpedido', [PedidosController::class,"setexportpedido"]);
		
		Route::get("/recibedSocketEvent",[sendCentral::class,"recibedSocketEvent"]);
		
		
		
		//Update App
		//Route::get('update', [sendCentral::class,"updateApp"]);
	});
	
		
});
	

// }


