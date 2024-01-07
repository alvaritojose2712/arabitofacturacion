export default function({
    pedidosFast,
    onClickEditPedido,
    id,
}){
    return (
        <>
            {pedidosFast ? pedidosFast.map(e =>
            e ?
                <div className="card-pedidos d-flex justify-content-center flex-column" key={e.id} data-id={e.id} onClick={onClickEditPedido}>
                    <h3>
                        <span className={(e.id == id ? "btn" : "btn-outline") + (!e.estado ? "-sinapsis" : "-success") + (" fs-4 btn f")}>
                        {e.id}
                        </span>
                    </h3>
                    <span className="text-muted text-center">
                        <b className={("h5 ") + (!e.estado ? " text-sinapsis" : " text-success")}></b>

                    </span>
                </div>
                : null
            ) : null}
        </>
    )
}