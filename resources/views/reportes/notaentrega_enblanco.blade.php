<?php $t_base = 0; ?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="icon" type="image/png" href="{{ asset('images/favicon.ico') }}">
    <title>Nota de Despacho {{	implode("-",$ids)	}}</title>

    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
	<style>
		@media print {
			.pagebreak { page-break-before: always; }
		}
		
		.delivery-note {
			font-family: Arial, sans-serif;
			max-width: 800px;
			margin: 0 auto;
			padding: 20px;
		}
		
		.delivery-header {
			text-align: center;
			margin-bottom: 30px;
			border-bottom: 2px solid #333;
			padding-bottom: 15px;
		}
		
		.delivery-title {
			font-size: 24px;
			font-weight: bold;
			margin-bottom: 10px;
		}
		
		.client-info {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 20px;
			margin-bottom: 30px;
		}
		
		.client-section {
			border: 1px solid #ddd;
			padding: 15px;
			border-radius: 5px;
		}
		
		.client-section h4 {
			margin: 0 0 10px 0;
			color: #333;
			font-size: 16px;
		}
		
		.client-field {
			margin-bottom: 8px;
		}
		
		.client-label {
			font-weight: bold;
			color: #555;
		}
		
		.products-table {
			width: 100%;
			border-collapse: collapse;
			margin-bottom: 30px;
		}
		
		.products-table th {
			background-color: #f8f9fa;
			border: 1px solid #ddd;
			padding: 12px 8px;
			text-align: center;
			font-weight: bold;
			font-size: 14px;
		}
		
		.products-table td {
			border: 1px solid #ddd;
			padding: 10px 8px;
			text-align: center;
			font-size: 13px;
		}
		
		.products-table .product-description {
			text-align: left;
			max-width: 200px;
		}
		
		.products-table .quantity {
			text-align: center;
			font-weight: bold;
		}
		
		.totals-section {
			display: grid;
			grid-template-columns: 2fr 1fr;
			gap: 20px;
			margin-bottom: 30px;
		}
		
		.totals-table {
			width: 100%;
			border-collapse: collapse;
		}
		
		.totals-table th,
		.totals-table td {
			border: 1px solid #ddd;
			padding: 8px 12px;
			text-align: right;
		}
		
		.totals-table th {
			background-color: #f8f9fa;
			font-weight: bold;
		}
		
		.total-row {
			font-weight: bold;
			font-size: 16px;
			background-color: #e9ecef;
		}
		
		.signatures-section {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 40px;
			margin-top: 50px;
		}
		
		.signature-box {
			border-top: 1px solid #333;
			padding-top: 10px;
			text-align: center;
		}
		
		.signature-label {
			font-weight: bold;
			margin-bottom: 30px;
		}
		
		.notes-section {
			margin-top: 30px;
			border: 1px solid #ddd;
			padding: 15px;
			border-radius: 5px;
		}
		
		.notes-title {
			font-weight: bold;
			margin-bottom: 10px;
		}
		
		.status-badge {
			display: inline-block;
			padding: 4px 8px;
			border-radius: 4px;
			font-size: 12px;
			font-weight: bold;
			margin-left: 10px;
		}
		
		.status-anulado {
			background-color: #dc3545;
			color: white;
		}
		
		.status-pendiente {
			background-color: #ffc107;
			color: black;
		}
	</style>
</head>
<body>

	@foreach ($pedidos as $pedido)
		
		<div class="delivery-note">
			<div class="delivery-header">
				<div class="delivery-title">
					NOTA DE DESPACHO
					@if($pedido->estado==2)
						<span class="status-badge status-anulado">ANULADO</span>
					@endif
					@if($pedido->estado==0)
						<span class="status-badge status-pendiente">PENDIENTE</span>
					@endif
				</div>
				<div style="font-size: 18px; margin-bottom: 5px;">
					N° {{sprintf("%08d", $pedido->id)}}
				</div>
				<div style="font-size: 14px; color: #666;">
					Fecha: {{substr($pedido->created_at,0,10)}}
				</div>
			</div>
			
			<div class="client-info">
				<div class="client-section">
					<h4>DATOS DEL CLIENTE</h4>
					<div class="client-field">
						<span class="client-label">Nombre/Razón Social:</span><br>
						{{ $pedido->cliente->nombre }}
					</div>
					<div class="client-field">
						<span class="client-label">RIF/C.I./Pasaporte:</span><br>
						{{ $pedido->cliente->identificacion }}
					</div>
					<div class="client-field">
						<span class="client-label">Dirección:</span><br>
						{{ $pedido->cliente->direccion }}
					</div>
				</div>
				
				<div class="client-section">
					<h4>INFORMACIÓN DE PAGO</h4>
					<div class="client-field">
						<span class="client-label">Método de Pago:</span><br>
						@foreach($pedido->pagos as $ee)
							@if($ee->tipo==1&&$ee->monto!=0)<span class="status-badge" style="background-color: #17a2b8;">Trans. {{$ee->monto}}</span> @endif
							@if($ee->tipo==2&&$ee->monto!=0)<span class="status-badge" style="background-color: #6c757d;">Deb. {{$ee->monto}}</span> @endif
							@if($ee->tipo==3&&$ee->monto!=0)<span class="status-badge" style="background-color: #28a745;">Efec. {{$ee->monto}}</span> @endif
							@if($ee->tipo==6&&$ee->monto!=0)<span class="status-badge" style="background-color: #dc3545;">Vuel. {{$ee->monto}}</span> @endif
							@if($ee->tipo==4&&$ee->monto!=0)<span class="status-badge" style="background-color: #ffc107; color: black;">Cred. {{$ee->monto}}</span> @endif
						@endforeach
					</div>
					@if(isset($sucursal))
					<div class="client-field">
						<span class="client-label">Sucursal:</span><br>
						{{$sucursal->sucursal}}
					</div>
					@endif
				</div>
			</div>

			<table class="products-table">
				<thead>
					<tr>
						<th style="width: 15%;">Código</th>
						<th style="width: 40%;">Descripción del Producto</th>
						<th style="width: 10%;">Cantidad</th>
						<th style="width: 15%;">Precio Unitario</th>
						@if(isset($_GET["admin"]))
							<th style="width: 10%;">Precio Base</th>
						@endif
						<th style="width: 10%;">Descuento</th>
						<th style="width: 15%;">Subtotal</th>
						@if(isset($_GET["admin"]))
							<th style="width: 10%;">Subtotal Base</th>
						@endif
					</tr>
				</thead>
				<tbody>
					@php
						$sumBase = 0;
					@endphp
					@foreach ($pedido->items as $val)
						<tr>
							<td>{{$val->producto->codigo_barras}}</td>
							<td class="product-description">{{$val->producto->descripcion}}</td>
							<td class="quantity">{{$val->cantidad}}</td>
							<td>
								@if ($bs)
									{{moneda($val->producto->precio*$bs)}}<br>
								@endif
								<small>REF: {{moneda($val->producto->precio)}}</small>
							</td>
							@if(isset($_GET["admin"]))
								<td>{{moneda($val->producto->precio_base)}}</td>
							@endif
							<td>{{$val->total_des}}<br><small>({{$val->descuento}}%)</small></td>
							<td>
								@if ($bs)
									{{moneda($val->cantidad*$val->producto->precio*$bs)}}<br>
								@endif
								<small>REF: {{moneda($val->cantidad*$val->producto->precio)}}</small>
							</td>
							@if(isset($_GET["admin"]))
								@php
									$baseSub = $val->cantidad*$val->producto->precio_base;
									$sumBase += $baseSub;
								@endphp
								<td>{{moneda($baseSub)}}</td>
							@endif
						</tr>
					@endforeach
				</tbody>
			</table>

			<div class="totals-section">
				<div class="notes-section">
					<div class="notes-title">Observaciones:</div>
					<div style="min-height: 80px; border: 1px solid #eee; padding: 10px; background-color: #f9f9f9;">
						<!-- Espacio para observaciones -->
					</div>
				</div>
				
				<table class="totals-table">
					<tr>
						<th>SubTotal Venta</th>
						<td>REF: {{$pedido->subtotal}}</td>
					</tr>
					<tr>
						<th>Descuento {{$pedido->total_porciento}}%</th>
						<td>REF: {{$pedido->total_des}}</td>
					</tr>
					<tr>
						<th>Monto Exento</th>
						<td>REF: {{$pedido->exento}}</td>
					</tr>
					<tr>
						<th>Monto Gravable</th>
						<td>REF: {{$pedido->gravable}}</td>
					</tr>
					<tr>
						<th>IVA ({{$pedido->ivas}})</th>
						<td>REF: {{$pedido->monto_iva}}</td>
					</tr>
					@if(isset($_GET["admin"]))
						<tr>
							<th>TOTAL BASE</th>
							<td>{{moneda($sumBase)}}</td>
						</tr>
					@endif
					<tr class="total-row">
						<th>TOTAL</th>
						<td>
							@if ($bs)
								Bs. {{moneda(removemoneda($pedido->total)*$bs)}}<br>
							@endif
							REF: {{$pedido->total}}
						</td>
					</tr>
				</table>
			</div>

			<div class="signatures-section">
				<div class="signature-box">
					<div class="signature-label">Firma del Cliente</div>
				</div>
				<div class="signature-box">
					<div class="signature-label">Firma del Despachador</div>
				</div>
			</div>
		</div>
		
		@if(!$loop->last)
			<div class="pagebreak"></div>
		@endif
	@endforeach

</body>
</html> 