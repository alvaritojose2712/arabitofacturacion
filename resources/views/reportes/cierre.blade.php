<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Reporte de Cierre</title>
	<style type="text/css">
		.bg-white{
			background-color: white;
		}
		body{

		}
		.long-text{
			width: 400px;
		}
		table, td, th {  
		  border: 1px solid #ddd;
		  text-align: center;
		}
		th{
			font-size:15px;
		}

		table {
		  border-collapse: collapse;
		  width: 100%;
		}

		th, td {
		  padding: 15px;
		}
		.right{
			text-align: right;
		}

		.left{
			text-align: left;
		}
		
		.margin-bottom{
			margin-bottom:5px;
		}
		.amarillo{
			background-color:#FFFF84;
		}
		.verde{
			background-color:#84FF8D;
		}
		.rojo{
			background-color:#FF8484;
		}
		.sin-borde{
			border:none;
		}
		.text-warning{
			background: yellow;
		}
		.text-success{
			background: green;
			color: white;
		}
		.text-success-only{
			color: green;
		}
		.fs-3{
			font-size: xx-large;
			font-weight: bold;
		}

		.table-dark{
			background-color: #f2f2f2;
		}
		.container{
			width: 100%;
		}
		h1{
			font-size:3em;
		}
		.d-flex div{
			display: inline-block;
		}
		
		.tr-striped:nth-child(odd) {
            background-color: #8F9AA5;
        }
		.bg-danger-light{
			background-color: #fec7d1 !important; 
		}
		.bg-success-light{
			background-color: #c4f7c7 !important; 
		}

	</style>
</head>
<body>
	<div class="container bg-white">
		<table class="table">
			<tbody>
				<tr>
					<td colspan="6">
						<h1>{{$sucursal->sucursal}}</h1>
					</td>
				</tr>
				<tr>
					<td>
						@if (isset($message))
							<img src="{{$message->embed('images/logo-small.jpg')}}" width="200px" >
						@else
							<img src="{{asset('images/logo-small.jpg')}}" width="200px" >
						@endif
						

						<h5>{{$sucursal->nombre_registro}}</h5>
						
						<b>RIF. {{$sucursal->rif}}</b>
						<hr>
						<span>
							Domicilio Fiscal: {{$sucursal->direccion_registro}}
						</span>

					</td>
					<td colspan="2">
						<h2>CAJA</h2>
						$ = <b>{{($cierre->dejar_dolar)}}</b>
						<br/>
						<br/>
						P = <b>{{($cierre->dejar_peso)}}</b>
						<br/>
						<br/>
						BSS = <b>{{($cierre->dejar_bss)}}</b>
					</td>
					<td>
						<h2>TASA</h2>
						{{($cierre->tasa)}}
					</td>
					<td>
						<h2>{{$cierre->fecha}}</h2>
						<h4>CAJERO: {{$cierre->usuario->usuario}}</h4>
					</td>
				</tr>
				<tr class="">
					<th class="right">
						VENTAS DEL DÍA
					</th>
					<td class=""><span class="text-success-only fs-3">{{($facturado["numventas"])}}</span></td>
					<th class="right">
						INVENTARIO
					</th>
					<td class="">Venta: {{$total_inventario_format}}<br>Base: {{$total_inventario_base_format}}</td>

					<td>
						<b>VUELTOS TOTALES</b> <hr>
						{{($vueltos_totales)}}
					</td>
				</tr>
				
				
				<tr>
					<th>DÉBITO</th>
					<th>EFECTIVO</th>
					<th>TRANSFERENCIA / BIOPAGO</th>
					<th>CRÉDITO</th>
					<th>ENTREG / PEND</th>

				</tr>
				<tr>
					<td>{{($facturado[2])}}</td>
					<td>{{($facturado[3])}}</td>
					<td>{{($facturado[1])}} / {{($facturado[5])}}</td>
					<td>{{($facturado[4])}}</td>
					<td>{{($facturado["entregado"])}} - {{($facturado["pendiente"])}} = {{($facturado["entregadomenospend"])}}</td>
				</tr>
				<tr>
					<th colspan="5">REFERENCIAS DE PAGOS ELECTRÓNICOS</th>

				</tr>
				@foreach ($referencias as $e)
					<tr>
						<td>
							{{$e->banco}}
							@if ($e->tipo==1)
							Transferencia
							@endif
							@if ($e->tipo==2)
							Débito
							@endif
						</td>
						<th>{{$e->descripcion}}</th>
						<td>{{$e->monto}}</td>
						<td>Pedido #{{$e->id_pedido}}</td>
						<th>{{$e->created_at}}</th>
					</tr>
				@endforeach
				<tr>
					<th colspan="3">
						<h3>TOTAL FACTURADO:</h3>
						<h1 class="text-success">{{($facturado_tot)}}</h1>
					</th>
					<th colspan="1" class="">

						<h3>EFECTIVO GUARDADO:</h3>
						<span class="">$ <span class="fs-3">{{($cierre->efectivo_guardado)}}</span></span><br>
						<span class="">COP <span class="fs-3">{{($cierre->efectivo_guardado_cop)}}</span></span><br>
						<span class="">BS <span class="fs-3">{{($cierre->efectivo_guardado_bs)}}</span></span><br>
					</th>
					<th class="right d-flex">
						<table>
							<tr>
								<td>
									BASE:
									<hr/>
									% Gan.
									<hr/>
									VENTA:
									<hr/>
									con DESC.
									<hr/>
									GANANCIA:
									
								</td>
								<td>
									{{($precio_base)}}
									<hr/>
									{{($porcentaje)}}
									<hr/>
									{{($precio)}}
									<hr/>
									{{($desc_total)}}
									<hr/>
									{{($ganancia)}}
									
								</td>
							</tr>
						</table>
						<div>
							
						</div>
						<div>
						</div>
					</th>
				</tr>
				
				<tr>
					<th class="right sin-borde">DÉBITO</th>
					<td class="sin-borde">{{($cierre->debito)}}</td>
					<td rowspan="4" colspan="3">
						<h2>
							NOTA
						</h2>
						{{ ($cierre->nota) }}
					</td>
					
				</tr>
				<tr>
					<th class="right sin-borde">EFECTIVO</th>
					<td class="sin-borde">{{($cierre->efectivo)}}</td>
					

				</tr>
				<tr>
					<th class="right sin-borde">TRANSFERENCIA</th>
					<td class="sin-borde">{{($cierre->transferencia)}}</td>
					

				</tr>
				<tr>
					<th class="right sin-borde">BIOPAGO</th>
					<td class="sin-borde">{{($cierre->caja_biopago)}}</td>
					

				</tr>
				<tr>
					<th class="right sin-borde">TOTAL REAL</th>
					<td class="sin-borde text-success"><h1>{{($cierre_tot)}}</h1></td>
					
					
				</tr>
				<tr>
					<td colspan="5"><b>CRÉDITO POR COBRAR TOTAL</b> <br> <span class="h2">{{number_format($cred_total,2)}}</span></td>
				</tr>
				<tr>
					<td colspan="5"><b>ABONOS DEL DÍA</b> <br> <span class="h2">{{number_format($abonosdeldia,2)}}</span></td>
				</tr>
				
				@foreach ($pedidos_abonos as $e)
					<tr>
						<td>
							Abono. #{{$e->id}}
						</td>
						<td colspan="3">
							Cliente: {{$e->cliente->nombre}}. {{$e->cliente->identificacion}}
						</td>
						<td>
							@foreach ($e->pagos as $ee)
								
								<span> 
									<b>
										@switch($ee->tipo)
											@case(1)
											Transferencia
											@break
											@case(2)
											Debito
											@break
											
											@case(3)
											Efectivo
											@break
											@case(4)
											Credito
											@break
											@case(5)
											Otros
											@break
											@case(6)
											Vuelto
											@break
										@endswitch  
									</b>
									{{$ee->monto}}
								</span>
								<br>
							@endforeach
						</td>
					</tr>
				@endforeach

				{{-- <tr>
					<td colspan=""><b>CAJA FUERTE BALANCE</b></td>
					<td>DOLAR: <b><span class="h2">{{number_format($cajas["balance"]["fuerte"]["dolarbalance"],2)}}</span></b></td>
					<td>BS: <b><span class="h2">{{number_format($cajas["balance"]["fuerte"]["bsbalance"],2)}}</span></b></td>
					<td>PESO: <b><span class="h2">{{number_format($cajas["balance"]["fuerte"]["pesobalance"],2)}}</span></b></td>
				</tr>
				
				<tr>
					<td colspan="5">
						<table>
							<thead>
								<tr>
									<th>TIPO</th>
									<th>FECHA</th>
									<th>Descripción</th>
									<th>Categoría</th>
									<th className="text-right">Monto DOLAR</th>
									<th className="">Balance DOLAR</th>
									<th className="text-right">Monto BS</th>
									<th className="">Balance BS</th>
									<th className="text-right">Monto PESO</th>
									<th className="">Balance PESO</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								@foreach ($cajas["detalles"]["fuerte"] as $e)
									<tr>
										<td className="">
											<small className="text-muted">
												{{$e->tipo==0?"Caja Chica":null}}
												{{$e->tipo==1?"Caja Fuerte":null}}
											</small>
										</td>
										<td className=""><small className="text-muted">{{$e->created_at}}</small></td>
										<td className="">{{$e->concepto}}</td>
										<td className="">getCatFun({{$e->categoria}})</td>
										
										<td className={{($e->montodolar<0? "text-danger": "text-success")." text-right"}}>{{number_format($e->montodolar)}}</td>
										<td>{{number_format($e->dolarbalance)}}</td>
										
										<td className={{($e->montobs<0? "text-danger": "text-success")." text-right"}}>{{number_format($e->montobs)}}</td>
										<td>{{number_format($e->bsbalance)}}</td>
										
										<td className={{($e->montopeso<0? "text-danger": "text-success")." text-right"}}>{{number_format($e->montopeso)}}</td>
										<td>{{number_format($e->pesobalance)}}</td>
										
									</tr>
								@endforeach
							</tbody>
						</table>
					</td>
				</tr>

				<tr>
					<td colspan=""><b>CAJA CHICA BALANCE</b></td>
					<td>DOLAR: <b><span class="h2">{{number_format($cajas["balance"]["chica"]["dolarbalance"],2)}}</span></b></td>
					<td>BS: <b><span class="h2">{{number_format($cajas["balance"]["chica"]["bsbalance"],2)}}</span></b></td>
					<td>PESO: <b><span class="h2">{{number_format($cajas["balance"]["chica"]["pesobalance"],2)}}</span></b></td>
				</tr>
				
				<tr>
					<td colspan="5">
						<table>
							<thead>
								<tr>
									<th>TIPO</th>
									<th>FECHA</th>
									<th>Descripción</th>
									<th>Categoría</th>
									<th className="text-right">Monto DOLAR</th>
									<th className="">Balance DOLAR</th>
									<th className="text-right">Monto BS</th>
									<th className="">Balance BS</th>
									<th className="text-right">Monto PESO</th>
									<th className="">Balance PESO</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								@foreach ($cajas["detalles"]["chica"] as $e)
									<tr>
										<td className="">
											<small className="text-muted">
												{{$e->tipo==0?"Caja Chica":null}}
												{{$e->tipo==1?"Caja Fuerte":null}}
											</small>
										</td>
										<td className=""><small className="text-muted">{{$e->created_at}}</small></td>
										<td className="">{{$e->concepto}}</td>
										<td className="">getCatFun({{$e->categoria}})</td>
										
										<td className={{($e->montodolar<0? "text-danger": "text-success")." text-right"}}>{{number_format($e->montodolar)}}</td>
										<td>{{number_format($e->dolarbalance)}}</td>
										
										<td className={{($e->montobs<0? "text-danger": "text-success")." text-right"}}>{{number_format($e->montobs)}}</td>
										<td>{{number_format($e->bsbalance)}}</td>
										
										<td className={{($e->montopeso<0? "text-danger": "text-success")." text-right"}}>{{number_format($e->montopeso)}}</td>
										<td>{{number_format($e->pesobalance)}}</td>
										
									</tr>
								@endforeach
							</tbody>
						</table>
					</td>
				</tr> --}}
				<tr>
					<th colspan="5">MOVIMIENTOS DE CAJA</th>
				
				</tr>
				<tr>
					<th colspan="2">ENTREGADO</th>
					<th colspan="3">PENDIENTE</th>
				</tr>
				@foreach($facturado["entre_pend_get"] as $fila)
				

					@if($fila["tipo"]==1)
						<tr>
							<td>{{$fila["monto"]}} <b></b></td>
							<th>{{$fila["descripcion"]}} <br>{{$fila["created_at"]}}</th>
							<th colspan='3'></th>
						</tr>
					@else
						<tr>
							<th></th>
							<th></th>
							<td>{{ $fila["monto"] }} <b></b></td>
							<th colspan='1'>{{ $fila["descripcion"] }}</th>
							<th>{{ $fila["created_at"] }}</th>
						</tr>
					@endif
				@endforeach

				@foreach($vueltos_des as $val)

					<tr>
						<th></th>
						<th></th>
						<td>{{ $val["monto"] }} <b></b></td>
						<th colspan='2'>Ped.{{ $val["id_pedido"] }} Cliente: {{$val->cliente->cliente->identificacion}}
							<br/>
							{{ $val["updated_at"] }}
						</th>
					</tr>
				@endforeach
				
				
			</tbody>
		</table>
		<hr/>
		
		<table class="table">
			<thead>
				<tr>
					<th colspan="9">
						MOVIMIENTOS DE INVENTARIO
					</th>
				</tr>
			  <tr>
				<th class="pointer">Usuario</th>
				<th class="pointer">Origen</th>
				<th class="pointer">Alterno</th>
				<th class="pointer">Barras</th>
				<th class="pointer">Descripción</th>
				<th class="pointer">Cantidad</th>
				<th class="pointer">Base</th>
				<th class="pointer">Venta</th>
				<th class="pointer">Hora</th>
			  </tr>
			</thead>
				@foreach ($movimientosInventario as $e)
					<tbody>
						<tr>
							<td rowSpan="2" class='align-middle'>{{$e->usuario?$e->usuario->usuario:""}}</td>
							<td rowSpan="2" class='align-middle'>{{$e->origen?$e->origen:""}}</td>
							@if ($e->antes)
								<td class="bg-danger-light">{{$e->antes->codigo_proveedor?$e->antes->codigo_proveedor:""}}</td>
								<td class="bg-danger-light">{{$e->antes->codigo_barras?$e->antes->codigo_barras:""}}</td>
								<td class="bg-danger-light">{{$e->antes->descripcion?$e->antes->descripcion:""}}</td>
								<td class="bg-danger-light">{{$e->antes->cantidad?$e->antes->cantidad:""}}</td>
								<td class="bg-danger-light">{{$e->antes->precio_base?$e->antes->precio_base:""}}</td>
								<td class="bg-danger-light">{{$e->antes->precio?$e->antes->precio:""}}</td>
							@else
								<td colSpan="6" class='text-center h4'>
								Producto nuevo
								</td>
							@endif
							
							<td>{{$e->created_at?$e->created_at:""}}</td>
						</tr>
						<tr>
							@if ($e->despues)
								<td class="bg-success-light">{{$e->despues->codigo_proveedor?$e->despues->codigo_proveedor:""}}</td>
								<td class="bg-success-light">{{$e->despues->codigo_barras?$e->despues->codigo_barras:""}}</td>
								<td class="bg-success-light">{{$e->despues->descripcion?$e->despues->descripcion:""}}</td>
								<td class="bg-success-light">{{$e->despues->cantidad?$e->despues->cantidad:""}}</td>
								<td class="bg-success-light">{{$e->despues->precio_base?$e->despues->precio_base:""}}</td>
								<td class="bg-success-light">{{$e->despues->precio?$e->despues->precio:""}}</td>
							@else
								<td colSpan="6" class='text-center h4'>
								Producto Eliminado
								</td>
							@endif
							<td>{{$e->created_at?$e->created_at:""}}</td>
						</tr>
					</tbody>
				@endforeach
		  </table>
		<table class="table">
			<tbody>
				<tr>
					<th colspan="7">MOVIMIENTOS DE PEDIDOS</th>
				</tr>
					@foreach($movimientos as $val)
						@if ($val->motivo)
							<tr>
								<td>{{$val->usuario?$val->usuario->usuario:null}}</td>
								<td>{{$val->tipo}}</td>
								<td><b>Motivo</b><br/>{{$val->motivo}}</td>
								<td><b>{{$val->tipo_pago?"MétodoDePago":"Sin pago"}}</b><br/>{{$val->tipo_pago}}</td>
								<td><b>Monto</b><br/>{{$val->monto}}</td>
								<td>
									<b>Items {{count($val->items)}}</b>
									
									<br/>
									@foreach ($val->items as $item)
										@if ($item->producto)
											{{$item->producto->codigo_barras}} <br>
										@endif
									@endforeach
								</td>
								<td>{{$val->created_at}}</td>
							</tr>

						@else	
							@foreach ($val->items as $e)
								<tr>
									<td>
										@if ($e->tipo==1)
											Entrada de Producto
										@endif
										@if ($e->tipo==0)
											Salida de Producto
										@endif

										@if ($e->tipo==2)
											{{$e->categoria}}
										@endif
									</td>
									<td>
										<b>Motivo</b><br/>
										@if ($e->categoria==1)
											Garantía
										@elseif ($e->categoria==2)
											Cambio
										@else
										{{$e->categoria}}
										@endif

									</td>
									@if (!$e->producto)
										<td><b>Producto/Desc.</b><br/> {{$e->descripcion}}</td>
										<td>P/U. {{$e->precio}}</td>
									@else
										<td><b>Producto</b><br/> {{$e->producto->descripcion}}</td>
										<td>P/U. {{$e->producto->precio}}</td>
									@endif
									<td>Ct. {{$e->cantidad}}</td>
									<td>{{$e->created_at}}</td>
								</tr>
							@endforeach
						@endif
					@endforeach
				
			</tbody>
		</table>	
		
	</div>
	
</body>
</html>