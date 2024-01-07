
function Proveedores({
  setProveedor,
  proveedordescripcion,
  setproveedordescripcion,
  proveedorrif,
  setproveedorrif,
  proveedordireccion,
  setproveedordireccion,
  proveedortelefono,
  setproveedortelefono,

  setIndexSelectProveedores,
  indexSelectProveedores,
  qBuscarProveedor,
  setQBuscarProveedor,
  proveedoresList,

  delProveedor,
  setView,




}) {

 

  const setIndexSelectProveedoresFun = e => {
    let index = e.currentTarget.attributes["data-index"].value
    
    if (index==indexSelectProveedores) {
      setIndexSelectProveedores(null)
    }else{
      setIndexSelectProveedores(index)
    }
  }
  const setNuevoProveedor = () => {
    setproveedordescripcion("")
    setproveedorrif("")
    setproveedordireccion("")
    setproveedortelefono("")
    setIndexSelectProveedores(null)
  }
  return (
    <>
      <div className="container">
        <h1> <span className="pointer" onClick={()=>setView("SelectFacturasInventario")}><i className="fa fa-arrow-left"></i> Volver a Facturas</span></h1>
        <div className="row">
          <div className="col">

              <h1>Proveedores <button className="btn btn-sm btn-success" onClick={setNuevoProveedor}>Nuevo</button></h1>

              <div className="">
                <div className="input-group ">
                  <input type="text" 
                  className="form-control" 
                  placeholder="Buscar..." 
                  value={qBuscarProveedor} 
                  onChange={e=>setQBuscarProveedor(e.target.value)}/>
                  <div className="input-group-prepend">
                    <button className="btn btn-outline-secondary" type="button"><i className="fa fa-search"></i></button>
                  </div>
                </div>
              </div>
              { 
                proveedoresList.length
                ? proveedoresList.map( (e,i) =>
                  <div 
                  onClick={setIndexSelectProveedoresFun} 
                  data-index={i}
                  key={e.id}
                  className={(indexSelectProveedores==i?"bg-sinapsis":"bg-light text-secondary")+" card mt-2 pointer"}>
                    <div className="card-header flex-row row justify-content-between">
                      <div>
                        <small>ID.{e.id}</small>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div><span>{e.rif}</span></div>
                        <div><span className="">{e.telefono}</span></div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="">
                        <h5 
                        className="card-title"
                        ><b>{e.descripcion}</b></h5>
                      </div> 
                      <p className="card-text">
                      </p>
                    </div>
                  </div>
                 )
                : <div className='h3 text-center text-dark mt-2'><i>¡Sin resultados!</i></div>
              }
            
          </div>
          <div className="col">
            
              <form onSubmit={setProveedor}>
                <div className="form-group">
                  <label htmlFor="">
                    Descripción
                  </label> 
                    <input type="text" 
                    value={proveedordescripcion} 
                    onChange={e=>setproveedordescripcion(e.target.value)} 
                    className="form-control"/>
                </div>
                <div className="form-group">
                  <label htmlFor="">
                    RIF
                  </label> 
                    <input type="text" 
                    value={proveedorrif} 
                    onChange={e=>setproveedorrif(e.target.value)} 
                    className="form-control"/>
                </div>
                <div className="form-group">
                  <label htmlFor="">
                    Dirección
                  </label> 
                    <input type="text" 
                    value={proveedordireccion} 
                    onChange={e=>setproveedordireccion(e.target.value)} 
                    className="form-control"/>
                </div>
                <div className="form-group">
                  <label htmlFor="">
                    Teléfono
                  </label> 
                    <input type="text" 
                    value={proveedortelefono} 
                    onChange={e=>setproveedortelefono(e.target.value)} 
                    className="form-control"/>
                </div>
                <div className="form-group mt-1">
                {indexSelectProveedores==null?
                  <button className="btn btn-outline-success btn-block" type="submit">Guardar</button>
                : 
                  <div className="btn-group">
                    <button className="btn btn-sinapsis btn-block" type="submit">Editar</button>
                    <button className="btn btn-outline-danger btn-block" onClick={delProveedor} type="button"><i className="fa fa-times"></i></button>
                    
                  </div>
                }
                </div>
              </form>            
          </div>
        </div>
      </div>
    </>
  )
}
export default Proveedores