
function Notificacion({msj,notificar}) {
	return (
		<pre className="notificacion">
			<h5>Notificación: <i className="fa fa-times" onClick={()=>notificar("")}></i></h5>

			{msj}
		</pre>
	)
}

export default Notificacion