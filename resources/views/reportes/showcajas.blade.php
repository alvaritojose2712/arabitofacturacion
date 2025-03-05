<table border="1">
    @foreach ($enero as $e)
        <tr>
            <td>{{$sucursal}}</td>
            <td>ENERO</td>
            <td>{{$e["vendedor"]}}</td>
            <td>{{$e["ventas"]}}</td>
        </tr>
    @endforeach

    @foreach ($febrero as $e)
        <tr>
            <td>{{$sucursal}}</td>
            <td>FEBRERO</td>
            <td>{{$e["vendedor"]}}</td>
            <td>{{$e["ventas"]}}</td>
        </tr>
    @endforeach

    @foreach ($marzo as $e)
        <tr>
            <td>{{$sucursal}}</td>
            <td>MARZO</td>
            <td>{{$e["vendedor"]}}</td>
            <td>{{$e["ventas"]}}</td>
        </tr>
    @endforeach
</table>