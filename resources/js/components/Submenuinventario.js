export default function Submenuinventario({
    view,
    setView,
    setsubViewInventario,
    showAjustesPuntuales,
}){
    return (
        <div className="d-flex justify-content-center align-items-center flex-column">
            <button className="btn btn-info fs-1 mb-5" onClick={()=>setView("SelectFacturasInventario")}>Nueva mercancía</button>
            <button className="btn btn-info fs-1" onClick={()=>showAjustesPuntuales()}>Ajustes puntuales</button>
        </div>   
    )
}