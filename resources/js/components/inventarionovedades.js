export default function InventarioNovedades({
    inventarioNovedadesData,
    getInventarioNovedades,
    resolveInventarioNovedades,
    sendInventarioNovedades,
    delInventarioNovedades,
    number,
}){
    return(
        <div className="container">

                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                <form onSubmit={event=>{getInventarioNovedades();event.preventDefault()}}>
                                    <button className="btn btn-success"><i className="fa fa-search"></i></button>
                                </form>
                            </th>
                            <th className="text-center">REF</th>
                            <th className="cell1 pointer"><span >C. Barras</span></th>
                            <th className="cell1 pointer"><span >C. Alterno</span></th>
                            <th className="cell2 pointer"><span >Descripción</span></th>
                            <th className="cell05 pointer"><span >Ct.</span></th>
                            <th className="cell1 pointer"><span >Base</span></th>
                            <th className="cell15 pointer">Venta</th>
                            <th className="text-center">RESPONSABLE</th>
                            <th className="text-center">MOTIVO</th>
                        </tr>
                    </thead>
                        {
                            inventarioNovedadesData?
                                inventarioNovedadesData.length?
                                    inventarioNovedadesData.map(e=>
                                        <tbody key={e.id}>
                                            <tr>
                                                <td rowSpan={2} className="align-middle">
                                                    <div className="btn-group">
                                                        <button className="btn btn-success" onClick={()=>sendInventarioNovedades(e.id)}><i className="fa fa-paper-plane"></i></button>
                                                        <button className="btn btn-danger" onClick={()=>delInventarioNovedades(e.id)}><i className="fa fa-trash"></i></button>
                                                    </div>
                                                </td>
                                                <td className="align-middle text-center" rowSpan={2}> <button className="btn btn-success">{e.producto?e.id:"NUEVO"}</button> </td>

                                                <td className="bg-danger-light">{e.producto?e.producto.codigo_barras:"NUEVO"}</td>
                                                <td className="bg-danger-light">{e.producto?e.producto.codigo_proveedor:"NUEVO"}</td>
                                                <td className="bg-danger-light">{e.producto?e.producto.descripcion:"NUEVO"}</td>
                                                <td className="bg-danger-light">{e.producto?e.producto.cantidad:"NUEVO"}</td>
                                                <td className="bg-danger-light">{e.producto?e.producto.precio_base:"NUEVO"}</td>
                                                <td className="bg-danger-light">{e.producto?e.producto.precio:"NUEVO"}</td>
                                                <td className="bg-warning-light align-middle text-center" rowSpan={2}>{e.responsable}</td>
                                                <td className="bg-warning-light align-middle text-center" rowSpan={2}>{e.motivo}</td>
                                                <td className="bg-warning-light align-middle text-center" rowSpan={2}>
                                                    <div className="btn-group">
                                                        <button className="btn btn-warning">
                                                            <i className="fa fa-refresh fa-2x m-2 text-success" onClick={()=>resolveInventarioNovedades(e.id)}></i>
                                                        </button>
                                                        <button className="btn">
                                                            {e.estado? <i className="fa fa-2x fa-check text-success m-2"></i>: <i className="fa fa-2x fa-times text-danger"></i> }
                                                        </button>
                                                    </div>
                                                </td>
                                                
                                            </tr>

                                            <tr className="bg-success-light">
                                                <td className="bg-success-light">{e.codigo_barras}</td>
                                                <td className="bg-success-light">{e.codigo_proveedor}</td>
                                                <td className="bg-success-light">{e.descripcion}</td>
                                                <td className="bg-success-light">{e.cantidad}</td>
                                                <td className="bg-success-light">{e.precio_base}</td>
                                                <td className="bg-success-light">{e.precio}</td>
                                                
                                            </tr>
                                        </tbody>
                                    )
                                :null
                            :null

                        }
                        
                </table>
                
        </div>
    )
}