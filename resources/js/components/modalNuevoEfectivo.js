import { useEffect, useState } from "react";
export default function ModalNuevoEfectivo({
    setopenModalNuevoEfectivo,
    setControlEfec,
    catselect,
    setcontrolefecNewConcepto,
    controlefecNewConcepto,
    controlefecNewMonto,
    setcontrolefecNewMonto,
    controlefecNewMontoMoneda,
    setcontrolefecNewMontoMoneda,
    controlefecNewCategoria,
    setcontrolefecNewCategoria,
    categoriasCajas,
    controlefecSelectGeneral,
    setcontrolefecSelectGeneral,
    moneda,
    number,
    personalNomina,
    allProveedoresCentral,
    alquileresData,
    getAllProveedores,
    getAlquileres,
    getNomina,
    sucursalesCentral,

    transferirpedidoa,
    settransferirpedidoa,
    dolar,
    peso,
    getSucursales={getSucursales},

    departamentosCajas,
    controlefecNewDepartamento,
    setcontrolefecNewDepartamento,

    setcontrolefecid_persona,
    controlefecid_persona,
    setcontrolefecid_alquiler,
    controlefecid_alquiler,

    controlefecid_proveedor,
    setcontrolefecid_proveedor,
}){
    const [showtranscajatosucursal,setshowtranscajatosucursal] = useState(false)

    const [buscadorCategoria, setbuscadorCategoria] = useState("")
    const [buscadorAlquiler, setbuscadorAlquiler] = useState("")
    const [buscadorProveedor, setbuscadorProveedor] = useState("")
    const [buscadorPersonal, setbuscadorPersonal] = useState("")

    const [selectpersona, setselectpersona] = useState("")
    const [selectcargopersona, setselectcargopersona] = useState("")
    const [sumprestamos, setsumprestamos] = useState("")
    const [sumcreditos, setsumcreditos] = useState("")
    const [lastpago, setlastpago] = useState("")
    const [selectpersonapagosmespasado, setselectpersonapagosmespasado] = useState("")
    const [maxpagopersona, setmaxpagopersona] = useState(0)

    const [maxpagoalquiler, setmaxpagoalquiler] = useState(0)

   

    useEffect(()=>{
        setcontrolefecNewConcepto("")
    },[controlefecNewCategoria])

    
    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto" style={{ zIndex: 1500 }}>
            {/* Overlay/Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
                onClick={() => setopenModalNuevoEfectivo(false)}
                aria-hidden="true"
            ></div>
            
            {/* Modal Content */}
            <div className={`relative w-full max-w-5xl mx-4 my-6 rounded-lg shadow-xl max-h-[95vh] flex flex-col transform transition-all ${
                controlefecSelectGeneral === 1 ? 'bg-green-50' : 'bg-sinapsis '
            }`}>
                {/* Modal Header */}
                <div className={`flex items-center justify-between p-6 border-b rounded-t-lg ${
                    controlefecSelectGeneral === 1 ? 'border-green-200 bg-green-100' : 'border-blue-200 bg-blue-100'
                }`}>
                    <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                            controlefecSelectGeneral === 1 ? 'bg-green-500 text-white' : 'bg-sinapsis 0 text-white'
                        }`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.467-.22-2.121-.659C8.712 10.46 8.712 9.036 9.879 8.157c1.171-.879 3.07-.879 4.242 0L15 9" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Nuevo Movimiento - {controlefecSelectGeneral === 1 ? 'Caja Fuerte' : 'Caja Chica'}
                        </h3>
                    </div>
                    <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-lg p-2 transition-colors duration-200" 
                        onClick={() => setopenModalNuevoEfectivo(false)}
                        aria-label="Cerrar modal"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="flex-1 p-6 overflow-y-auto text-dark">
                    <form onSubmit={event=>{event.preventDefault();setControlEfec()}} className="space-y-6">
                        {/* Type Toggle Buttons */}
                        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                            <button 
                                type="button" 
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    controlefecSelectGeneral === 1 
                                        ? 'bg-green-500 text-white shadow-sm' 
                                        : 'text-gray-700 hover:text-gray-900'
                                }`}
                                onClick={() => setcontrolefecSelectGeneral(1)}
                            >
                                Caja Fuerte
                            </button>
                            <button 
                                type="button" 
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    controlefecSelectGeneral === 0 
                                        ? 'bg-sinapsis 0 text-white shadow-sm' 
                                        : 'text-gray-700 hover:text-gray-900'
                                }`}
                                onClick={() => setcontrolefecSelectGeneral(0)}
                            >
                                Caja Chica
                            </button>
                        </div>
                        {/* Departamento Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Departamento
                            </label>
                                <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    value={controlefecNewDepartamento}
                                onChange={e => setcontrolefecNewDepartamento(e.target.value)}
                            >
                                <option value="">Seleccione Departamento</option>
                                {departamentosCajas.map((e,i) => (
                                        <option key={i} value={e.id}>{e.nombre}</option>
                                ))}
                                </select>
                        </div>
                        {/* Categoría Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Categoría
                            </label>
                                <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    value={controlefecNewCategoria}
                                    onChange={e => {
                                        setcontrolefecNewCategoria(e.target.value)
                                        setcontrolefecid_persona(null)
                                        setcontrolefecid_alquiler(null)
                                }}
                            >
                                <option value="">Seleccione Categoría</option>
                                {categoriasCajas.filter(e => e.tipo === controlefecSelectGeneral).filter(e => e.showsucursal === 1).map((e, i) => {
                                    const excludedNames = [
                                        "INGRESO DESDE CIERRE",
                                        "CAJA FUERTE: INGRESO TRANSFERENCIA SUCURSAL",
                                        "CAJA FUERTE: EGRESO TRANSFERENCIA SUCURSAL",
                                        "CAJA FUERTE: INGRESO TRANSFERENCIA TRABAJADOR",
                                        "CAJA FUERTE: EGRESO TRANSFERENCIA TRABAJADOR"
                                    ];
                                    
                                    return !excludedNames.includes(e.nombre) ? (
                                        <option key={i} value={e.id}>{e.nombre}</option>
                                    ) : null;
                                })}
                                </select>
                        </div>
                        {/* Descripción Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Descripción
                            </label>
                            <textarea 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm resize-vertical"
                                placeholder="Descripción del movimiento..."
                                rows="3"
                                value={controlefecNewConcepto} 
                                onChange={e => setcontrolefecNewConcepto(e.target.value)}
                            />
                        </div>
                       
                        {/* Personal/Nómina Section */}
                        {[29, 30, 70, 71, 92, 87, 86, 28, 61].includes(parseInt(controlefecNewCategoria)) && (
                            <div className="space-y-4 bg-sinapsis  p-4 rounded-lg border border-blue-200">
                                <h4 className="text-sm font-medium text-blue-900">Seleccionar Personal</h4>
                                
                                {/* Search Bar */}
                                <div className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" 
                                        placeholder="Buscar Personal..." 
                                        value={buscadorPersonal} 
                                        onChange={e => setbuscadorPersonal(e.target.value)} 
                                    />
                                    <button 
                                        type="button" 
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
                                        onClick={() => getNomina()}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                    </div>

                                {/* Personal List */}
                                <div className="max-h-60 overflow-y-auto bg-white rounded-md border border-gray-200">
                                    {personalNomina.filter(e => !buscadorPersonal ? true : (e.nominanombre.toLowerCase().indexOf(buscadorPersonal.toLowerCase()) !== -1)).map(e => (
                                        <div 
                                            key={e.id} 
                                            className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-200 ${
                                                controlefecid_persona === e.id 
                                                    ? 'bg-blue-100 border-blue-300' 
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => {
                                                setcontrolefecid_persona(e.id);
                                                setcontrolefecNewMonto(e.maxpagopersona > e.quincena ? e.quincena : e.maxpagopersona);
                                                setmaxpagopersona(e.maxpagopersona);
                                                setsumprestamos(e.sumPrestamos);
                                                setsumcreditos(e.sumCreditos);
                                                setlastpago(e.mes);
                                                setselectpersonapagosmespasado(e.mespasado);
                                                setselectpersona(e.nominanombre);
                                                setselectcargopersona(e.cargo.cargosdescripcion);
                                                setcontrolefecNewMontoMoneda("dolar");
                                            }}
                                        >
                                            <div className="text-sm font-medium text-gray-900">
                                                {e.nominacedula} - {e.nominanombre}
                                            </div>
                                            {controlefecid_persona === e.id && (
                                                <div className="text-xs text-blue-600 mt-1">
                                                    Seleccionado
                                                </div>
                                            )}
                                    </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Alquileres Section */}
                        {parseInt(controlefecNewCategoria) === 34 && (
                            <div className="space-y-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <h4 className="text-sm font-medium text-yellow-900">Seleccionar Alquiler</h4>
                                
                                <div className="flex space-x-2">
                                    <select 
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                            value={controlefecid_alquiler} 
                                        onChange={e => {
                                            let val = e.target.value;
                                            setcontrolefecid_alquiler(val);
                                            let match = alquileresData.filter(e => e.id == val)[0];
                                            
                                            if (match) {
                                                setcontrolefecNewMonto(match.monto);
                                                setmaxpagoalquiler(match.monto);
                                                setcontrolefecNewMontoMoneda("dolar");
                                            }
                                        }}
                                    >
                                        <option value="">Seleccione Alquiler</option>
                                        {alquileresData.length > 0 && alquileresData.map(e => (
                                            <option value={e.id} key={e.id}>
                                                PAGO ALQUILER: {e.descripcion}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    <button 
                                        type="button" 
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
                                        onClick={() => getAlquileres()}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Proveedores Section */}
                        {parseInt(controlefecNewCategoria) === 40 && (
                            <div className="space-y-4 bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <h4 className="text-sm font-medium text-purple-900">Seleccionar Proveedor</h4>
                                
                                {/* Search Bar */}
                                <div className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" 
                                        placeholder="Buscar proveedor..." 
                                        value={buscadorProveedor} 
                                        onChange={e => setbuscadorProveedor(e.target.value)} 
                                    />
                                    <button 
                                        type="button" 
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
                                        onClick={() => getAllProveedores()}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Proveedores List */}
                                <div className="max-h-60 overflow-y-auto bg-white rounded-md border border-gray-200">
                                    {allProveedoresCentral.filter(e => !buscadorProveedor ? true : (e.descripcion.toLowerCase().indexOf(buscadorProveedor.toLowerCase()) !== -1)).map(e => (
                                        <div 
                                            key={e.id} 
                                            className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-200 ${
                                                controlefecNewConcepto === ("PAGO PROVEEDOR=" + e.descripcion + "=" + e.id) 
                                                    ? 'bg-purple-100 border-purple-300' 
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => {
                                                let val = "PAGO PROVEEDOR=" + e.descripcion + "=" + e.id;
                                                setcontrolefecNewConcepto(val);
                                                setcontrolefecid_proveedor(val);
                                            }}
                                        >
                                            <div className="text-sm font-medium text-gray-900">
                                                PAGO PROVEEDOR: {e.descripcion}
                                            </div>
                                            {controlefecNewConcepto === ("PAGO PROVEEDOR=" + e.descripcion + "=" + e.id) && (
                                                <div className="text-xs text-purple-600 mt-1">
                                                    Seleccionado
                                    </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                    </div>
                        )}


                        {/* Monto Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Monto
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                    <select
                                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        value={controlefecNewMontoMoneda}
                                        onChange={e => {
                                        setcontrolefecNewMonto("");
                                        setcontrolefecNewMontoMoneda(e.target.value);
                                    }}
                                >
                                    <option value="">Moneda</option>
                                    <option value="dolar">DÓLAR</option>
                                        <option value="peso">PESO</option>
                                        <option value="bs">BS</option>
                                        <option value="euro">EURO</option>
                                    </select>
                                
                                <input 
                                    type="text" 
                                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Monto..."
                                value={controlefecNewMonto}
                                onChange={e => {
                                        let val = (number(e.target.value));
                                        let factor = controlefecNewMontoMoneda === "dolar" ? 1 : (controlefecNewMontoMoneda === "bs" ? parseFloat(dolar) : (controlefecNewMontoMoneda === "peso" ? parseFloat(peso) : 1));

                                        if (parseInt(controlefecNewCategoria) === 29) {
                                            if (parseFloat(val) > parseFloat(maxpagopersona * factor)) {
                                                val = "";
                                            }
                                        }

                                        if (parseInt(controlefecNewCategoria) === 34) {
                                            if (parseFloat(val) > parseFloat(maxpagoalquiler * factor)) {
                                                val = "";
                                            }
                                        }
                                        setcontrolefecNewMonto(val);
                                    }} 
                                />
                            </div>
                        </div>
                        {/* Personal Information Table */}
                        {selectpersona && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Información del Personal</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 bg-white rounded-md">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Máximo</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Préstamos</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créditos</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes Actual</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes Pasado</th>
                                        </tr>
                                    </thead>
                                        <tbody className="bg-white">
                                            <tr>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{selectpersona}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{selectcargopersona}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-green-600">{maxpagopersona}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-red-600">{moneda(sumprestamos)}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{moneda(sumcreditos)}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{moneda(lastpago)}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{moneda(selectpersonapagosmespasado)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        )}
                        
                        {/* Transfer to Branch Section */}
                        {(showtranscajatosucursal || catselect.indexOf("TRANSFERENCIA TRABAJADOR") !== -1) && controlefecSelectGeneral === 1 ? (
                            catselect.indexOf("EFECTIVO ADICIONAL") === -1 && catselect.indexOf("NOMINA ABONO") === -1 && catselect.indexOf("TRASPASO A CAJA CHICA") === -1 ? (
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                    <h4 className="text-sm font-medium text-orange-900 mb-3">Transferir a Sucursal</h4>
                                    <div className="flex space-x-2">
                                        <select 
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" 
                                            value={transferirpedidoa} 
                                            onChange={e => settransferirpedidoa(e.target.value)}
                                        >
                                            <option value="">Seleccione Sucursal</option>
                                            {sucursalesCentral.map(e => (
                                            <option value={e.id} key={e.id}>
                                                {e.nombre}
                                            </option>
                                            ))}
                                        </select>
                                        <button 
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200 border border-green-600" 
                                            type="button" 
                                            onClick={() => setControlEfec(true)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : null
                        ) : (
                            /* Main Action Button */
                            <div className="flex justify-center">
                                <button 
                                    className={`inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        controlefecSelectGeneral === 1
                                            ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                                            : 'bg-sinapsis hover:bg-blue-700 text-white focus:ring-blue-500'
                                    }`}
                                    type="submit"
                                >
                                    {controlefecSelectGeneral === 1 ? "SOLICITAR APROBACIÓN" : "GUARDAR"}
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Toggle Transfer Option */}
                        <div className="flex justify-center mt-6 pt-4 border-t border-gray-200">
                            <button 
                                className={`text-sm font-medium rounded-md px-4 py-2 transition-colors duration-200 ${
                                    showtranscajatosucursal 
                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                                type="button" 
                                onClick={() => setshowtranscajatosucursal(!showtranscajatosucursal)}
                            >
                                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Transferir a sucursal...
                            </button>
                        </div>

                    </form>
				</div>
            </div>
        </div>
    )
}