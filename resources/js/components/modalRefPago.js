import { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function ModalRefPago({
    addRefPago,
    descripcion_referenciapago,
    setdescripcion_referenciapago,
    banco_referenciapago,
    setbanco_referenciapago,
    monto_referenciapago,
    setmonto_referenciapago,
    tipo_referenciapago,
    settipo_referenciapago,
    transferencia,
    dolar,
    number,
}){

    //enter
    useHotkeys(
        "enter",
        () => {
            addRefPago("enviar");
        },
        {
            filterPreventDefault: false,
            enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
        },
        []
    );
    
    useEffect(()=>{
        if (isrefbanbs) {
        }else{
        }
    },[isrefbanbs])
    
    useEffect(()=>{
        if (
            banco_referenciapago=="ZELLE" ||
            banco_referenciapago=="BINANCE" ||
            banco_referenciapago=="AirTM"
            ) {
            setisrefbanbs(false) 
            setmonto_referenciapago(transferencia)
        }else{
            let monto = (transferencia * dolar).toFixed(2)
            setmonto_referenciapago(monto)
            setisrefbanbs(true) 
        }
    },[banco_referenciapago])

    const [isrefbanbs, setisrefbanbs] = useState(true)

    return (
        <div className="modal-custom">
            <div className="text-danger" onClick={() => addRefPago("toggle")} data-type="toggle"><span className="closeModal">&#10006;</span></div>

            <div className="modal-content-sm shadow">
            <div className="col p-4">
                <h4>Agregar Referencia Bancaria (Enter dentro de un campo para guardar)</h4>
                <div className="form-group">
                <label className="form-label">Referencia</label>
                <input type="text" placeholder='Referencia completa de la transacción...' value={descripcion_referenciapago} onChange={e => setdescripcion_referenciapago(number(e.target.value))} className="form-control" />
                </div>

                <div className="form-group">
                <label className="form-label">Banco</label>
                <select className="form-control" value={banco_referenciapago} onChange={e => setbanco_referenciapago(e.target.value)}>
                    <option value="">--Seleccione Banco--</option>
                    <option value="ZELLE">ZELLE</option>
                    <option value="BINANCE">Binance</option>
                    <option value="AirTM">AirTM</option>
                    <option value="0102">0102 Banco de Venezuela, S.A. Banco Universal</option>
                    <option value="0108">0108 Banco Provincial, S.A. Banco Universal</option>
                    <option value="0105">0105 Banco Mercantil C.A., Banco Universal</option>
                    <option value="0134">0134 Banesco Banco Universal, C.A.</option>
                    <option value="0175">0175 Banco Bicentenario del Pueblo, Banco Universal C.A.</option>
                    <option value="0191">0191 Banco Nacional de Crédito C.A., Banco Universal</option>
                    <option value="0104">0104 Banco Venezolano de Crédito, S.A. Banco Universal</option>
                    <option value="0114">0114 Banco del Caribe C.A., Banco Universal</option>
                    <option value="0115">0115 Banco Exterior C.A., Banco Universal</option>
                    <option value="0151">0151 Banco Fondo Común, C.A Banco Universal</option>
                    <option value="0156">0156 100% Banco, Banco Comercial, C.A</option>
                    <option value="0157">0157 DelSur, Banco Universal C.A.</option>
                    <option value="0163">0163 Banco del Tesoro C.A., Banco Universal</option>
                    <option value="0168">0168 Bancrecer S.A., Banco Microfinanciero</option>
                    <option value="0169">0169 Mi Banco, Banco Microfinanciero, C.A.</option>
                    <option value="0171">0171 Banco Activo C.A., Banco Universal</option>
                    <option value="0172">0172 Bancamiga Banco Universal, C.A.</option>
                    <option value="0174">0174 Banplus Banco Universal, C.A.</option>
                </select>
                </div>

                <div className="form-group">
                <label className="form-label mt-2">Monto en {isrefbanbs
                    ?
                    <button className="btn btn-outline-sinapsis btn-sm">Bs</button>
                    :
                    <button className="btn btn-outline-success btn-sm">$</button>
                }
                </label>
                <input type="text" value={monto_referenciapago} onChange={e => setmonto_referenciapago(number(e.target.value))} className="form-control" />
                </div>

                <div className="form-group">
                    <label className="form-label">Tranferencia/Biopago/Débito</label>
                    <select className="form-control" value={tipo_referenciapago} onChange={e => settipo_referenciapago(e.target.value)}>
                        <option value="">--Seleccione Banco--</option>
                        <option value="1">Transferencia</option>
                        <option value="2">Debito</option>
                        <option value="5">BioPago</option>
                    </select>
                </div>
                <div className="form-group">
                    <button className="btn btn-success" onClick={()=>addRefPago("enviar")}>GUARDAR</button>
                </div>
            </div>
            </div>
        </div>
    )
}