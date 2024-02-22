<?php $t_base = 0; ?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="icon" type="image/png" href="{{ asset('images/favicon.ico') }}">
    <title>Nota de Entrega {{	implode("-",$ids)	}}</title>

    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
	<style>
		@media print {
			.pagebreak { page-break-before: always; } /* page-break-after works, as well */
		}
	</style>
</head>
<body>

	@foreach ($pedidos as $pedido)
		
		<section class="container-fluid border">
				<table class="table table-bordered">
					<thead>
						<tr class="text-center">
							<td colspan="6">
								<img src="{{ asset('images/logo.png') }}" width="200px">
							</td>
						</tr>
					</thead>
					<tbody>
						<tr class="text-center">
							<td colspan="2">
								<h5>{{$sucursal->nombre_registro}}</h5>
							</td>
							<td colspan="4">
								<b>RIF. {{$sucursal->rif}}</b>
								<hr>
								<span>
									Domicilio Fiscal: {{$sucursal->direccion_registro}}
								</span>
							</td>
						</tr>
						<tr>
							<th colspan="2" class=""><h5>SUCURSAL</h5> {{$sucursal->sucursal}}</th>
							<th colspan="4" class="text-right"><h5>Fecha de emisión</h5> {{substr($pedido->created_at,0,10)}}</th>
						</tr>
						<tr>
							<th colspan="2" class="">NOTA ENTREGA</th>
							<th colspan="4" class="text-right text-danger"><h5>N° {{sprintf("%08d", $pedido->id)}}</h5></th>
						</tr>
						<tr>
							<th colspan="" class="text-right">Nombre y Apellido o Razón Social</th>
							<td colspan="" class="text-left">{{ $pedido->cliente->nombre }}</td>
							<th colspan="" class="text-right">N° RIF/C.I./Pasaporte</th>
							<td colspan="3" class="text-left">{{ $pedido->cliente->identificacion }}</td>
						</tr>
						<tr>
							<th colspan="" class="text-right">Domicilio Fiscal</th>
							<td colspan="" class="text-left">{{ $pedido->cliente->direccion }}</td>
							<th colspan="" class="text-right">Método de Pago</th>
							<td colspan="3" class="text-left">
								@foreach($pedido->pagos as $ee)
									@if($ee->tipo==1&&$ee->monto!=0)<span class="w-50 btn-sm btn-info btn">Trans. {{$ee->monto}}</span> @endif
									@if($ee->tipo==2&&$ee->monto!=0)<span class="w-50 btn-sm btn-secondary btn">Deb. {{$ee->monto}}</span> @endif
									@if($ee->tipo==3&&$ee->monto!=0)<span class="w-50 btn-sm btn-success btn">Efec. {{$ee->monto}}</span> @endif
									@if($ee->tipo==6&&$ee->monto!=0)<span class="w-50 btn-sm btn-danger btn">Vuel. {{$ee->monto}}</span> @endif
									@if($ee->tipo==4&&$ee->monto!=0)<span class="w-50 btn-sm btn-warning btn">Cred. {{$ee->monto}}</span> @endif
								@endforeach
							</td>
						</tr>

						<tr class="tr-secondary">
							<th>
								Código
							</th>
							<th>
								Descripción
							</th>
							<th>
								Cantidad
							</th>
							<th>
								P/U VENTA
							</th>
							@if(isset($_GET["admin"]))
								<th>
									P/U BASE
								</th>
							@endif
							<th>
								Descuento
							</th>
							<th class="text-right">
								SubTotal VENTA  
							</th>
							@if(isset($_GET["admin"]))
								<th class="text-right">
									SubTotal BASE  
								</th>
							@endif
						</tr>
						@php
							$sumBase = 0;
						@endphp
						@foreach ($pedido->items as $val)
							<tr class="tr-secondary">
								<td>
									{{$val->producto->codigo_barras}}
								</td>
								<td>
									{{$val->producto->descripcion}}
								</td>
								<td>
									{{$val->cantidad}}
								</td>
								<td>
									@if ($bs)
										{{moneda($val->producto->precio*$bs)}}
									@endif
									<br>
									REF:
									{{moneda($val->producto->precio)}}
								</td>
								@if(isset($_GET["admin"]))
									<th>
										<br>
										{{moneda($val->producto->precio_base)}}
									</th>
								@endif
								<td>
									{{$val->total_des}} ({{$val->descuento}}%)
								</td>
								<td class="text-right">
									@if ($bs)
										{{moneda($val->cantidad*$val->producto->precio*$bs)}} 
									@endif
									<br>
									REF: {{moneda($val->cantidad*$val->producto->precio)}}


								</td>
								@if(isset($_GET["admin"]))
									<th class="text-right">
										<br>
										@php
											$baseSub = $val->cantidad*$val->producto->precio_base;
											$sumBase += $baseSub;
										@endphp
										{{moneda($baseSub)}}
									</th>
								@endif
							</tr>

						@endforeach
						@if(isset($_GET["admin"]))
							<tr>
								<td colspan="7"></td>
								<th class="text-right">
									
									TOTAL BASE: {{moneda($sumBase)}}
								</th>
							</tr>
						@endif
						<tr class='hover'>
							<th colspan="5" class="text-right">SubTotal Venta</th>
							<td class="text-right">
								
								REF: {{$pedido->subtotal}}
							</td>
						</tr>
						<tr class='hover'>
						<th colspan="5" class="text-right pointer clickme">Desc. {{$pedido->total_porciento}}%
						</th>
						<td class="text-right">
							
							REF: {{$pedido->total_des}}
						</td>
						</tr>
						<tr class='hover'>
						<th colspan="5" class="text-right">Monto Exento</th>
						<td class="text-right">
							
							REF: {{$pedido->exento}}
						</td>
						</tr>
						<tr class='hover'>
						<th colspan="5" class="text-right">Monto Gravable</th>
						<td class="text-right">
							
							REF: {{$pedido->gravable}}
						</td>
						</tr>
						<tr class='hover'>
						<th colspan="5" class="text-right">IVA <span>({{$pedido->ivas}})</span></th>
						<td class="text-right">
							
							REF: {{$pedido->monto_iva}}
						</td>
						</tr>
						<tr class="hover h4">
						<th colspan="5" class="text-right">Total</th>
						<td class="text-right">
							@if ($bs)
								Bs. {{moneda(removemoneda($pedido->total)*$bs)}}
							@endif
							<br>
							REF: {{$pedido->total}}
						</td>
						</tr>
					</tbody>

				</table>
			
		</section> 
		<div class="pagebreak"> </div>
	@endforeach
	

    
    
</body>
</html>
