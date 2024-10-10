import logo from "../../images/logo.png"

import React, {Component} from 'react';
import Cargando from './cargando';
// import {handleNotification,Notification} from './handleNotification';

class Login extends Component{
	constructor(){
		super()
		this.state = {
			clave:"",
			usuario:"",
			activeLoading:false,
		}
		this.loc = window.location.origin
		this.getApiData = this.getApiData.bind(this)
		this.changeUniqueState = this.changeUniqueState.bind(this)

		this.submit = this.submit.bind(this)

	}

	getApiData(e,url,prop){
		axios.get(url,{params:{q:e?e.target.value:""}})
		.then(data=>{this.setState({[prop]:data.data})})
		.catch(err=>{console.log(err)})
	}


	
	changeUniqueState(newState){
		return new Promise(solve=>this.setState(newState,solve))
	}
	
	submit(event){
		event.preventDefault()
		this.setState({
			activeLoading:true 
		});
		axios
		.post("/login",{
			clave: this.state.clave,
			usuario: this.state.usuario,
		})
		.then((data)=>{
			this.setState({
				activeLoading:false,
			});
			if (data.data) {
				this.props.loginRes(data)
				if (data.data) {
					if (data.data.user.tipo_usuario==1) {
						window.setTimeout(()=>{
							location.reload()
						},3600000)
					}
				}
			}
			// handleNotification(data)

		})
		// .catch(error=>{handleNotification(error)})
	}
	
	
	render(){
		return(
			<div className="login">

				
				<div className="wrap-login100 d-flex justify-content-center">
					<form className="login100-form validate-form w-25" onSubmit={this.submit}>

						<div className="wrap-input100 validate-input" data-validate = "Introduzca Usuario">
							<input className="input100" type="text"  autoComplete="nope" value={this.state.usuario} name="usuario" onChange={(event)=>this.changeUniqueState({usuario:event.target.value})} placeholder="Usuario" required/>
							<span className="focus-input100" data-placeholder="U"></span>
						</div>

						<div className="wrap-input100 validate-input" data-validate="Introduzca Contraseña">
							<input className="input100" type="password" autoComplete="nope"  value={this.state.clave} name="clave" onChange={(event)=>this.changeUniqueState({clave:event.target.value})} placeholder="Contraseña" required/>
							<span className="focus-input100" data-placeholder="C"></span>
						</div>

						<div className="container-login100-form-btn">
							<button className="login100-form-btn">
								Empecemos...🚀
							</button>
						</div>
						<Cargando active={this.state.activeLoading}/>
						
					</form>
				</div>
				<span className="text-muted mt-4 text-center">
					OSPINO SYSTEMS, C.A<br/>
					<img src={logo} alt="logo ao" height="150px"/>
				</span>
			</div>
		);
	}
}

export default Login