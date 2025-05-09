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
  setclienteInpdireccion,
  number
}) {
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
        <div className="modal-content modal-cantidad">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Cliente</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setToggleAddPersona(false)}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="search-container mb-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  ref={inputmodaladdpersonacarritoref} 
                  placeholder="Buscar cliente..." 
                  onChange={(val) => getPersona(val.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover table-striped tabla_datos">
                <thead className="table-light">
                  <tr>
                    <th scope="col">CÉDULA</th>
                    <th scope="col">NOMBRE Y APELLIDO</th>
                  </tr>
                </thead>
                <tbody ref={tbodypersoInterref}>
                  {personas.length ? personas.map((e, i) => (
                    <tr 
                      tabIndex="-1" 
                      className={`${countListPersoInter === i ? "table-primary" : ""} tr-producto`} 
                      key={e.id} 
                      onClick={setPersonas} 
                      data-index={e.id}
                    >
                      <td>{e.identificacion}</td>
                      <td data-index={i}>{e.nombre}</td>
                    </tr>
                  )) : null}

                  {!personas.length && (
                    <tr>
                      <td colSpan="2">
                        <div className="p-4">
                          <form onSubmit={setPersonaFast} className="w-75 mx-auto">
                            <div className="row g-3">
                              <div className="col-md-6">
                                <div className="form-floating mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="identificacion"
                                    value={clienteInpidentificacion}
                                    onChange={e => setclienteInpidentificacion(e.target.value)}
                                    placeholder="C.I./RIF"
                                  />
                                  <label htmlFor="identificacion">C.I./RIF</label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    value={clienteInpnombre}
                                    onChange={e => setclienteInpnombre(e.target.value)}
                                    placeholder="Nombres y Apellidos"
                                  />
                                  <label htmlFor="nombre">Nombres y Apellidos</label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="telefono"
                                    value={clienteInptelefono}
                                    onChange={e => setclienteInptelefono(e.target.value)}
                                    placeholder="Teléfono"
                                  />
                                  <label htmlFor="telefono">Teléfono</label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="direccion"
                                    value={clienteInpdireccion}
                                    onChange={e => setclienteInpdireccion(e.target.value)}
                                    placeholder="Dirección"
                                  />
                                  <label htmlFor="direccion">Dirección</label>
                                </div>
                              </div>
                            </div>
                            <div className="d-grid gap-2 mt-4">
                              <button className="btn btn-primary" type="submit">
                                <i className="fas fa-save me-2"></i>
                                Guardar Cliente
                              </button>
                            </div>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <div className="overlay"></div>
    </>
  );
}
