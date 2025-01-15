<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Inventario {{date("Y-m-d h:i:s")}}</title>
	<style type="text/css">

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
		  width: 70%;
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
			display: flex;
			justify-content: center;
		}
		h1{
			font-size:3em;
		}
		.d-flex div{
			display: inline-block;
		}
		.img{
			filter: sepia(100%);
		}
        .w-100{
            width: 100%;
        }
		.mb-2{
			margin-bottom: 2em;
		}
		

	</style>
</head>
<body>
	<div class="">
        
        <table class="table w-100">
            <thead>
                <tr>
                    <td colspan="2">
                        <form action="">
							<div class="mb-2">
								<input type="text" name="descripcion" placeholder="Descripción">
								<input type="text" name="codigo_proveedor" placeholder="Código alterno">
								<input type="text" name="codigo_barras" placeholder="Código barras">
								<input type="text" size="6" name="precio_base" placeholder="Costo">
								<input type="text" size="6" name="precio" placeholder="Venta">
								<input type="text" size="6" name="cantidad" placeholder="Ct.">
								<select name="proveedor">
									<option value="">--Seleccione--</option>
									
									@foreach ($proveedores as $e)
									<option value="{{$e->id}}">{{$e->descripcion}}</option>
									@endforeach
								</select>
								<select name="categoria">
									<option value="">--Seleccione--</option>
									@foreach ($categorias as $e)
									<option value="{{$e->id}}">{{$e->descripcion}}</option>
									@endforeach
								</select>
								<input type="text" name="marca" placeholder="Marca">
								<button type="submit">Buscar</button>   
							</div>
							<div>
								<label>
									<input type="hidden" name="view_codigo_proveedor" value="off">
									<input type="checkbox" name="view_codigo_proveedor" checked="true">
								Código A.
								</label>
								<label>
									<input type="hidden" name="view_codigo_barras" value="off">
									<input type="checkbox" name="view_codigo_barras" checked="true">
								Código de barras
								</label>
								<label>
									<input type="hidden" name="view_descripcion" value="off">
									<input type="checkbox" name="view_descripcion" checked="true">
								Descripción
								</label>
								<label>
									<input type="hidden" name="view_proveedor" value="off">
									<input type="checkbox" name="view_proveedor" checked="true">
								Proveedor
								</label>
								<label>
									<input type="hidden" name="view_categoria" value="off">
									<input type="checkbox" name="view_categoria" checked="true">
								Categoría
								</label>
								<label>
									<input type="hidden" name="view_id_marca" value="off">
									<input type="checkbox" name="view_id_marca" checked="true">
								Marca
								</label>
								<label>
									<input type="hidden" name="view_cantidad" value="off">
									<input type="checkbox" name="view_cantidad" checked="true">
								Ct.
								</label>
								<label>
									<input type="hidden" name="view_precio_base" value="off">
									<input type="checkbox" name="view_precio_base" checked="true">
								Costo
								</label>
								<label>
									<input type="hidden" name="view_t_costo" value="off">
									<input type="checkbox" name="view_t_costo" checked="true">
								Total Costo
								</label>
								<label>
									<input type="hidden" name="view_precio" value="off">
									<input type="checkbox" name="view_precio" checked="true">
								Venta
								</label>
								<label>
									<input type="hidden" name="view_t_venta" value="off">
									<input type="checkbox" name="view_t_venta" checked="true">
								Total Venta
								</label>
							</div>
                        </form>
                    </td>
                </tr>
                <tr>
					<td colspan="">
						@if (isset($message))
							<img src="{{$message->embed('images/logo.png')}}" width="200px" class="img">
						@else
							<img src="{{asset('images/logo.png')}}" width="200px" class="img">
						@endif
						<h5>{{$sucursal->nombre_registro}}</h5>
						
						<b>RIF. {{$sucursal->rif}}</b>
						<br/>
						<span>
							{{$sucursal->direccion_registro}}
						</span>
					</td>
                    <td>
						<h2>Inventario {{date("Y-m-d h:i:s")}}</h2>
						<table class="table w-100">
							<tr>
								<td class="right">Productos</td>
								<th class="left">{{$count}}</th>
							</tr>
							@if ($view_t_costo)
								<tr>
									<td class="right">Total Costo</td>
									<th class="left">{{$costo}}</th>
								</tr>
							@endif
							@if ($view_t_venta)
								<tr>
									<td class="right">Total Venta</td>
									<th class="left">{{$venta}}</th>
								</tr>
							@endif
						</table>
                    </td>
				</tr>
				 
            </thead>  
        </table>
		<table class="table w-100">
			<tbody>
                <tr>
					@if ($view_codigo_proveedor)
						
						<th>Código A.</th>
					@endif
                    @if ($view_codigo_barras)
						
						<th>Código de barras</th>
					@endif
                    @if ($view_descripcion)
						
						<th>Descripción</th>
					@endif
                    @if ($view_proveedor)
						
						<th>Proveedor</th>
					@endif
                    @if ($view_categoria)
						
						<th>Categoría</th>
					@endif
                    @if ($view_id_marca)
						
						<th>Marca</th>
					@endif

                    @if ($view_cantidad)
						
						<th>Ct.</th>
					@endif
					<th>UND</th>
                    @if ($view_precio_base)
						
						<th>Costo</th>
					@endif
					@if ($view_t_costo)
						
						<th>Total Costo</th>
					@endif
                    @if ($view_precio)
						
						<th>Venta</th>
					@endif
                    @if ($view_t_venta)
						
						<th>Total Venta</th>
					@endif
                
				
				</tr>
                @foreach ($data as $e)
                    <tr>
						@if ($view_codigo_proveedor)<td>{{$e->codigo_proveedor}}</td> @endif
                        @if ($view_codigo_barras)<td>{{$e->codigo_barras}}</td> @endif
                        @if ($view_descripcion)<td>{{$e->descripcion}}</td> @endif
                        @if ($view_proveedor)<th>{{$e->proveedor->descripcion}}</th> @endif
                        @if ($view_categoria)<th>{{$e->categoria->descripcion}}</th> @endif
                        @if ($view_id_marca)<th>{{$e->id_marca}}</th> @endif
						@if ($view_cantidad)<td>{{$e->cantidad}}</td> @endif
						<td>{{$e->unidad}}</td> 
                        @if ($view_precio_base)<td>{{$e->precio_base}}</td> @endif
						@if ($view_t_costo)<td>{{$e->t_costo}}</td> @endif
                        @if ($view_precio)<td>{{$e->precio}}</td> @endif
                        @if ($view_t_venta)<td>{{$e->t_venta}}</td> @endif

                    </tr>

				

                @endforeach
                <tr></tr>
			</tbody>
		</table>
		
	</div>
	
</body>
</html>