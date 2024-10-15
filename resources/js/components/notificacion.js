
function Notificacion({msj,notificar}) {
	return (
		<pre className="notificacion">
			<h3>Notificación: <i className="fa fa-times" onClick={()=>notificar("")}></i></h3>

			<span className="fs-2">{msj}</span>
		</pre>
	)
}

export default Notificacion