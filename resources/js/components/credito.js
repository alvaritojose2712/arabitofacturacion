
import Clientes from '../components/clientes';

function Credito({
  limitdeudores,
  setlimitdeudores,

  orderbycolumdeudores,
  setorderbycolumdeudores,
  orderbyorderdeudores,
  setorderbyorderdeudores,

  onchangecaja,

  qDeudores,
  deudoresList,

  selectDeudor,
  setSelectDeudor,

  tipo_pago_deudor,
  monto_pago_deudor,
  setPagoCredito,
  onClickEditPedido,
  detallesDeudor,
  onlyVueltos,
  setOnlyVueltos,

  sumPedidos,
  sumPedidosArr,
  setsumPedidosArr,
  printCreditos,
  moneda,
  getDeudores,

}) {

  return (
    <div className="container"> 
    
      <div className="row">
        <div className="col">
          <h3>Cuentas por cobrar</h3> 
        </div>
        <div className="col text-right">
          <button className="btn btn-outline-success m-2" onClick={printCreditos}>
            <i className="fa fa-print"></i>
          </button>
          <button className="btn btn-outline-success" onClick={()=>{
            let num = window.prompt("num")

            if (num) {
              setlimitdeudores(num)
            }
          }}>Resultados. {limitdeudores}</button>
        </div>
      </div> 

      {
        selectDeudor===null?
        <div>
          <form onSubmit={getDeudores}>
            <input type="text" className="form-control" placeholder='Buscar...' value={qDeudores} name="qDeudores"  onChange={onchangecaja}/>
          </form>
          <table className="table table-hoverable">
            <thead>
              <tr>
                <th className="text-center">Nombres</th>
                <th className="text-center pointer hover" onClick={()=>orderbycolumdeudores=="vence"?setorderbyorderdeudores(orderbyorderdeudores=="desc"?"asc":"desc"):setorderbycolumdeudores("vence")}>Vence</th>
                <th className="text-right pointer hover" onClick={()=>orderbycolumdeudores=="saldo"?setorderbyorderdeudores(orderbyorderdeudores=="desc"?"asc":"desc"):setorderbycolumdeudores("saldo")}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {deudoresList.length?deudoresList.map((e,i)=>
                e?
                <tr key={e.id} className="text-center pointer" onClick={()=>{
                      setOnlyVueltos(0)
                      setSelectDeudor(i)
                      setsumPedidosArr([])

                    }}>
                  <td>{e.id} - {e.nombre} - {e.identificacion}</td>
                  <td>{e.vence} ({e.dias} días)</td>
                  <td  className={(e.saldo>0?"text-success":"text-danger")+(" h2 text-right")}>
                    <button className={("btn ")+(e.saldo<0?"btn-outline-danger":"btn-outline-success")}>{moneda(e.saldo)}</button>
                  </td>
                </tr>
                :null
              ):null}
            </tbody>

          </table>
            {!deudoresList.length ? <div className='h3 text-center text-dark mt-2'><i>¡Sin resultados!</i></div> : null}
        </div>:
        <div className="p-4">
          <h3 className="text-center"><i className="fa fa-times text-danger pointer" onClick={()=>{
            setSelectDeudor(null)
            setOnlyVueltos(0)
          }}></i></h3>
          <hr/>
          <div>
            <table className="table table-striped">
              <thead>
                  <tr className="">
                    {detallesDeudor["pedido_total"]?
                    <>
                      <th className="" colSpan="2">
                        {deudoresList[selectDeudor]?
                        <div className="">
                          <span className="">{deudoresList[selectDeudor].identificacion}</span>
                          <h1 className="">{deudoresList[selectDeudor].nombre}</h1>
                        </div>:null}
                        {sumPedidosArr?
                          sumPedidosArr.map(e=><button key={e} className="btn btn-outline-success" data-id={e} data-tipo="del" onClick={sumPedidos}>{e}</button>)
                        :null}
                        {sumPedidosArr.length?
                          <a className="" target="_blank" href={"/sumpedidos?id="+sumPedidosArr}>
                            <button className="btn btn-success">Emitir Factura.</button>
                          </a>
                          :null}
                      </th>
                      {!onlyVueltos?
                        <>
                            <td className="text-right">Balance: <h2 className={(detallesDeudor["pedido_total"]["diferencia"]>0?"text-success":"text-danger")}>{detallesDeudor["pedido_total"]["diferencia"]}</h2></td>
                            <td className="text-right h3 text-danger">{moneda(detallesDeudor["pedido_total"][1])}</td>
                            <td className="text-right h3 text-success">{moneda(detallesDeudor["pedido_total"][0])}</td>
                        </>
                      :null}
                    </>
                    :null}
                  </tr>
                <tr>
                  <th className="text-right">VENCE</th>
                  <th>PEDIDO</th>
                  <th>TIPO PAGO</th>
                  <th className="text-right ">CRÉDITO</th>
                  <th className="text-right ">ABONO</th>
                </tr>
              </thead>
              <tbody>

              {!onlyVueltos?
                <tr>
                  <td colSpan="2"></td>
                  <td>
                      <form onSubmit={setPagoCredito} className="w-50">

                        <div className="form-group">
                          <label htmlFor="">Tipo de pago</label>
                          <select value={tipo_pago_deudor} name="tipo_pago_deudor" onChange={onchangecaja} className="form-control">
                            <option value="3">Efectivo</option>            
                                     
                            <option value="2">Débito</option>            
                            <option value="5">Biopago</option>            
                          </select>
                        </div>
                      </form>
                  </td>
                  <td colSpan="2">
                      <form onSubmit={setPagoCredito} className="">
                        <div className="form-group">
                          <label htmlFor="">Monto Pago</label>
                          <input name="monto_pago_deudor" value={monto_pago_deudor} onChange={onchangecaja} className="form-control"/>
                        </div>
                      </form>

                  </td>
                </tr>
              :null}

                {
                  detallesDeudor&&detallesDeudor["pedido"]?
                    detallesDeudor["pedido"].map(e=>
                      <tr key={e.id}>
                        <td className="d-flex justify-content-between align-items-center">
                          {!sumPedidosArr.filter(id_save=>id_save==e.id).length?
                            <button className="btn btn-outline-success" data-id={e.id} data-tipo="add" onClick={sumPedidos}>Select</button>
                            :
                          
                            <button className="btn btn-outline-danger" data-id={e.id} data-tipo="del" onClick={sumPedidos}>UnSelect</button>
                          }
                          {/*<span title="Eliminar pedido">
                            Eliminar <i className="fa fa-times text-danger" data-type="getDeudor" onClick={onCLickDelPedido} data-id={e.id}></i> {e.created_at}
                          </span>*/}
                          <span>{e.fecha_vence}</span>
                        </td>
                        <td className="align-middle">
                          <button className="btn btn-secondary btn-lg w-50" data-id={e.id} onClick={onClickEditPedido}>{e.id} <i className="fa fa-eye"></i></button>
                        </td>
                        <td className="align-middle">
                          {e.pagos.map(ee=><div key={ee.id}>
                            {ee.tipo==1&&ee.monto!=0?<span className="w-50 btn-sm btn-info btn">Trans. {ee.monto}</span>:null}
                            {ee.tipo==2&&ee.monto!=0?<span className="w-50 btn-sm btn-secondary btn">Deb. {ee.monto}</span>:null}
                            {ee.tipo==3&&ee.monto!=0?<span className="w-50 btn-sm btn-success btn">Efec. {ee.monto}</span>:null}
                            {ee.tipo==5&&ee.monto!=0?<span className="w-50 btn-sm btn-info btn">Biopago {ee.monto}</span>:null}
                            {ee.tipo==6&&ee.monto!=0?<span className="w-50 btn-sm btn-danger btn" data-id={e.id} onClick={onClickEditPedido}>Vuel. {ee.monto}</span>:null}
                            {ee.tipo==4&&ee.monto!=0?<span className="w-50 btn-sm btn-warning btn">Cred. {ee.monto}</span>:null}
                          </div>)}
                          {e.entregado.map((ee,i)=><div key={ee.id}>
                            <span className="w-50 btn-sm btn-warning btn">{ee.descripcion} {ee.monto}</span>
                          </div>)}
                        </td>
                        {e.saldoDebe?
                          <>
                            <th className="text-danger h2 text-right align-middle">{moneda(e.saldoDebe)}</th>
                            <td></td>
                            
                          </>:
                          <>
                            <td></td>
                            <th className="text-success h2 text-right align-middle">{moneda(e.saldoAbono)}</th>
                          </>
                        }
                      </tr>
                    )
                  :null
                }
              </tbody>
            </table>
          </div>
        </div>
      }
      
    </div>
  )
}
export default Credito