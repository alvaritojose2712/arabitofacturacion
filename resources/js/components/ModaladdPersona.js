
import { useHotkeys } from "react-hotkeys-hook";

export default function Modaladdproductocarrito({
  countListPersoInter,
  tbodypersoInterref,
  setToggleAddPersona,
  getPersona,
  personas,
  setPersonas,
  inputmodaladdpersonacarritoref,

  setPersonaFast,
  clienteInpidentificacion,
  setclienteInpidentificacion,
  clienteInpnombre,
  setclienteInpnombre,
  clienteInptelefono,
  setclienteInptelefono,
  clienteInpdireccion,
  setclienteInpdireccion

}) {

   //esc
  useHotkeys(
    "esc",
    () => {
      setToggleAddPersona(false)
    },
    {
      enableOnTags: ["INPUT", "SELECT"],
      filter: false,
    },
    []
  );

  return (
    <>
      <section className="modal-custom"> 
        <div className="text-danger" onClick={()=>setToggleAddPersona(false)}><span className="closeModal">&#10006;</span></div>
        <div className="modal-content modal-cantidad">
          <div className="d-flex justify-content-between">
          <div>
            <h5>Agregar Cliente</h5>
          </div>
          </div>
          <div>
            <input type="text" className="form-control" ref={inputmodaladdpersonacarritoref} placeholder="Buscar..." onChange={(val)=>getPersona(val.target.value)}/>
          </div>

          <table className="table table-bordered tabla_datos">
            <thead>
              <tr>
                <th>CÉDULA</th>
                <th>NOMBRE Y APELLIDO</th>
              </tr>
            </thead>
            <tbody ref={tbodypersoInterref}>
              {personas.length?personas.map((e,i)=>
                <tr tabIndex="-1" className={(countListPersoInter==i?"bg-select":null)+(' tr-producto')} key={e.id} onClick={setPersonas} data-index={e.id}>
                  <td>{e.identificacion}</td>
                  <td data-index={i}>{e.nombre}</td>
                </tr>
                ):null}

              {!personas.length?<tr>
                <td colSpan="2">
                  <form onSubmit={setPersonaFast} className="w-50 m-3">
                      <div className="form-group">
                        <label htmlFor="">
                          C.I./RIF
                        </label> 
                          <input type="text" 
                          value={clienteInpidentificacion} 
                          onChange={e=>setclienteInpidentificacion(e.target.value)} 
                          className="form-control"/>
                      </div>

                      <div className="form-group">
                        <label htmlFor="">
                          Nombres y Apellidos
                        </label> 
                          <input type="text" 
                          value={clienteInpnombre} 
                          onChange={e=>setclienteInpnombre(e.target.value)} 
                          className="form-control"/>
                      </div>
                      <div className="form-group">
                        <label htmlFor="">
                          Teléfono
                        </label> 
                          <input type="text" 
                          value={clienteInptelefono} 
                          onChange={e=>setclienteInptelefono(e.target.value)} 
                          className="form-control"/>
                      </div>
                      <div className="form-group">
                        <label htmlFor="">
                          Dirección
                        </label> 
                          <input type="text" 
                          value={clienteInpdireccion} 
                          onChange={e=>setclienteInpdireccion(e.target.value)} 
                          className="form-control"/>
                      </div>
                      <div className="form-group">
                        <button className="btn btn-outline-success btn-block" type="submit">Guardar</button>
                      </div>
                  </form>
                </td>
              </tr>:null}
            </tbody>
          </table>
    

        </div>
      </section>
      <div className="overlay"></div>
    </>
  )  
}
