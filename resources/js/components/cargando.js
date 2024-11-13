import React, {Component} from 'react';

function Cargando(props) {
	return(
		<div className="loaders text-center cargando" >
			<div className="loader" style={{display:props.active?"":"none"}}>
					Dame chance...👽
		        <div className="loader-inner ball-pulse">
		          <div className="bg-sinapsis"></div>
		          <div className="bg-sinapsis"></div>
		          <div className="bg-sinapsis"></div>
		        </div>
		     </div>
		</div>
	);
}
export default Cargando;