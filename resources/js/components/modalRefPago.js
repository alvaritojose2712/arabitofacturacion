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
    bancos,
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
                <select className="form-control" value={banco_referenciapago} onChange={e=>setbanco_referenciapago(e.target.value)}>
                    {bancos.map((e,i)=>
                        <option key={i} value={e.value}>{e.text}</option>
                    )}
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