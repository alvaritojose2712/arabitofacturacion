export default function ModalShowPedidoFast({
pedidoData,
showModalPedidoFast,
setshowModalPedidoFast,
onClickEditPedido,
}) {
	try{

		const {
	      id,
	      created_at,
	      cliente,
	      items,
	      total_des,
	      subtotal,
	      total,

	      clean_total,
	      cop_clean,
	      bs_clean,
	      
	      total_porciento,
	      cop,
	      bs,
	      editable,
	      vuelto_entregado,
	      estado,

	      exento,
	      gravable,
	      ivas,
	      monto_iva,
	      pagos
	    } = pedidoData
		return (
			 <>
	      <section className="modal-custom"> 
	        <div className="text-danger" onClick={()=>setshowModalPedidoFast(!showModalPedidoFast)}><span className="closeModal">&#10006;</span></div>
	        <div className="modal-content">
	        	<div className={(" text-center p-1 d-flex justify-content-between")}>
              <span className="text-muted m-2">{created_at}</span>
              <button data-id={id} onClick={onClickEditPedido} className="btn btn-lg btn-block btn-outline-sinapsis">Pedido #{id}</button>
            </div>
            <div className="container-fluid">
            	<div className="row">
		            <div className="col">
		            	
				        	<table className="table table-striped text-center">
			              <thead>
			                <tr>
			                  <th className="text-sinapsis cell2">Código</th>
			                  <th className="text-sinapsis cell3">Producto</th>
			                  <th className="text-sinapsis cell1">Cant.</th>
			                  <th className="text-sinapsis cell1">Precio</th>
			                  {/*
			                  <th className="text-sinapsis">Sub-total</th>
			                  <th className="text-sinapsis">Desc.%</th>
			                  <th className="text-sinapsis">Tot.Desc.</th>
			                  */}
			                  <th className="text-sinapsis cell2">Total</th>
			                  
			                </tr>
			              </thead>
			              <tbody>
			                {items?items.map((e,i)=>
			                  e.abono&&!e.producto?
			                  <tr key={e.id}>
			                    <td>PAGO</td>
			                    <td>{e.abono}</td>
			                    <td>{e.cantidad} </td>
			                    <td>{e.monto}</td>
			                    {/*<td onClick={setDescuentoUnitario} data-index={e.id} className="align-middle pointer clickme">{e.descuento}</td>
			                    <td>{e.subtotal}</td>
			                    {/*<td>{e.total_des}</td>*/}

			                    <th className="font-weight-bold">{e.total}</th>
			                  </tr>
			                  :<tr key={e.id}>
			                    <td className="align-middle">{e.producto.codigo_barras}</td>
			                    <td className="align-middle">
			                      {e.producto.descripcion} {/*{e.producto.bulto?<span className="btn btn-outline-secondary btn-sm-sm" data-iditem={e.id} onClick={setCtxBultoCarrito}>1x {e.producto.bulto}</span>:null}*/}
			                      
			                    </td>
			                    <td className="pointer clickme align-middle">
			                      {e.cantidad.replace(".00","")} 
			                    </td>
			                    {e.producto.precio1?
			                    <td className="align-middle text-success pointer" >{e.producto.precio}</td>
			                      :
			                    <td className="align-middle pointer">{e.producto.precio}</td>
			                    }
			                    {/* <td onClick={setDescuentoUnitario} data-index={e.id} className="align-middle pointer">{e.descuento}</td>
			                    <td onClick={setDescuentoUnitario} data-index={e.id} className="align-middle pointer clickme">{e.descuento}</td>*/}
			                    


			                    <th className="font-weight-bold align-middle">{e.total}</th>
			                  </tr>
			                ):null}
			                <tr>
			                  <td><button className="btn btn-outline-success fs-5">{items?items.length:null}</button></td>
			                  <th colSpan="5" className="p-2 align-middle">{cliente?cliente.nombre:null} <b>{cliente?cliente.identificacion:null}</b></th>
			                </tr>
			              </tbody>
			            </table>
		            </div>
		            <div className="col-3">
		            	<table className="table">
		            		<tbody>
		            			<tr className='hover'>
		                    <th className="">Sub-Total</th>
		                    <td colSpan="2" className="text-right">{subtotal}</td>
		                  </tr>
		                  <tr className='hover'>
		                    <th className="pointer clickme">Desc. {total_porciento}%
		                    </th>
		                    <td colSpan="2" className="text-right">{total_des}</td>
		                  </tr>
		                  <tr className='hover'>
		                    <th className="">Monto Exento</th>
		                    <td colSpan="2" className="text-right">{exento}</td>
		                  </tr>
		                  <tr className='hover'>
		                    <th className="">Monto Gravable</th>
		                    <td colSpan="2" className="text-right">{gravable}</td>
		                  </tr>
		                  <tr className='hover'>
		                    <th className="">IVA <span>({ivas})</span></th>
		                    <td colSpan="2" className="text-right">{monto_iva}</td>
		                  </tr>
		                  <tr className="hover h4">
		                    <th className="">Total</th>
		                    <td className="text-left text-muted align-bottom">
		                      
		                    </td>
		                    <td className="text-right text-success fw-bold fs-11">
		                      <span data-type="dolar" className="pointer">{total}</span>
		                    </td>
		                  </tr>

		                  <tr className="text-muted">
		                    <td className="text-left text-muted">
		                      
		                    </td>
		                    <th className="text-right" colSpan="2">
		                      <span  data-type="bs" className='fs-2 pointer'> Bs {bs}</span><br/>
		                      <span  data-type="cop" className='fs-5 pointer'>COP {cop}</span>
		                    </th>
		                  </tr>
		            		</tbody>
		            	</table>

		            	<div className="d-flex justify-content-center mt-2">
			    					{pagos.map(ee=>
			    						<span className="h4" key={ee.id}>
				    						{ee.monto!=0&&ee.tipo==1?
				    							<span className="btn btn-info btn-sm">Trans. {ee.monto}</span>
				    						:null}

				    						{ee.monto!=0&&ee.tipo==2?
				    							<span className="btn btn-secondary btn-sm">Deb. {ee.monto}</span>
				    						:null}

				    						{ee.monto!=0&&ee.tipo==3?
				    							<span className="btn btn-success btn-sm">Efec. {ee.monto}</span>
				    						:null}

				    						{ee.monto!=0&&ee.tipo==4?
				    							<span className="btn btn-sinapsis btn-sm">Cred. {ee.monto}</span>
				    						:null}

				    						{ee.monto!=0&&ee.tipo==5?
				    							<span className="btn btn-primary btn-sm">Otr. {ee.monto}</span>
				    						:null}

				    						{ee.monto!=0&&ee.tipo==6?
				    							<span className="btn btn-danger btn-sm">Vuel. {ee.monto}</span>
				    						:null}
			    						</span>
			    					)}
			    				</div>
		            </div>
            	</div>
            </div>
									
	        </div>
	      </section>
	      <div className="overlay" onClick={()=>setshowModalPedidoFast(!showModalPedidoFast)}></div>
	    </>

		)
	}catch(err){
		return ""		
	}
}