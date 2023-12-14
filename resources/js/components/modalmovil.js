import { useEffect } from "react"

export default function Modalmovil({
    x,
    y,
    setmodalmovilshow,
    modalmovilshow,
    getProductos,
    productos,
    linkproductocentralsucursal,
    inputbuscarcentralforvincular,
    modalmovilRef,
    margin=42
}) {
    useEffect(()=>{
        
        if (inputbuscarcentralforvincular) {
            if (inputbuscarcentralforvincular.current) {
                inputbuscarcentralforvincular.current.focus()
            }
        }
        if (modalmovilRef) {
            if (modalmovilRef.current) {
                modalmovilRef.current?.scrollIntoView({ block: "nearest", behavior: 'smooth' });
            }
        }

    },[y])
    return (
        <div className="modalmovil" style={{top:y+margin,left:x}} ref={modalmovilRef} onMouseLeave={()=>setmodalmovilshow(false)}>
            <div className="input-group">
                <input type="text" className="form-control" placeholder="Buscar en Local..." ref={inputbuscarcentralforvincular}  onChange={e=>getProductos(e.target.value,true)}/>
                
                <div className="input-group-prepend">
                    <span className="input-group-text">Productos Local</span>
                </div>
            </div>
            
            <table className="table">
                <thead>
                    <tr>
                        <td></td>
                        <th>C. Alterno</th>
                        <th>C. Barras</th>
                        <th>Unidad</th>
                        <th>Descripción</th>
                        <th>Base</th>
                        <th>Venta</th>
                        <th>Categoría/Proveedor</th>
                    </tr>
                </thead>
                <tbody>
                {productos.length?productos.map(e=>
                    <tr key={e.id} data-id={e.id} className="pointer align-middle">
                        <td> <button className="btn btn-outline-success" onClick={()=>linkproductocentralsucursal(e.id)}><i className="fa fa-link fa-2x"></i> <br /> #{e.id}</button></td>
                        <td>{e.codigo_proveedor}</td>
                        <td>{e.codigo_barras}</td>
                        <td>{e.unidad}</td>
                        <td>{e.descripcion}</td>
                        <td>{e.precio_base}</td>
                        <td className="text-success">{e.precio}</td>
                        <td>{e.id_categoria}/{e.id_proveedor}</td>
                    </tr>
                ):null}
                </tbody>
            </table>
        </div>
    )
}