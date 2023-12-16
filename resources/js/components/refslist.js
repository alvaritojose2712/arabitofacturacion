import { useEffect } from "react";
export default function RefsList({
    togleeReferenciasElec,
    settogleeReferenciasElec,
    moneda,
    refrenciasElecData,
    onClickEditPedido,
    getReferenciasElec,
}) {

    useEffect(() => {
        getReferenciasElec()
    }, [
        togleeReferenciasElec
    ])

    return (

        <>
            <section className="modal-custom">
                <div className="text-danger" onClick={() => settogleeReferenciasElec(false)}><span className="closeModal">&#10006;</span></div>
                <div className="modal-content-sm modal-cantidad">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>USUARIO</th>
                                <th>PEDIDO</th>
                                <th>TIPO</th>
                                <th>REF</th>
                                <th>BANCO</th>
                                <td className='text-success'>TOT. MONTO <b>{moneda(refrenciasElecData.total)}</b></td>
                                <th>HORA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {refrenciasElecData.refs ? refrenciasElecData.refs.map(e =>
                                <tr key={e.id}>
                                    <td>{e.vendedorUser}</td>
                                    <td> <button className="btn btn-success" onClick={() => onClickEditPedido(null, e.id_pedido)}>{e.id_pedido}</button></td>
                                    <td>
                                        {e.tipo == 1 && e.monto != 0 ? <span className="btn-sm btn-info btn">Trans.</span> : null}
                                        {e.tipo == 2 && e.monto != 0 ? <span className="btn-sm btn-secondary btn">Deb. </span> : null}
                                        {e.tipo == 5 && e.monto != 0 ? <span className="btn-sm btn-secondary btn">Biopago. </span> : null}
                                    </td>
                                    <td>{e.descripcion}</td>
                                    <td>{e.banco}</td>
                                    <td>{moneda(e.monto)}</td>
                                    <td>{e.created_at}</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </section>
            <div className="overlay"></div>
        </>
    )
}