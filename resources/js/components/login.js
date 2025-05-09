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
					/* if (data.data.user.tipo_usuario==1) {
						window.setTimeout(()=>{
							location.reload()
						},3600000)
					} */
				}
			}
			// handleNotification(data)

		})
		// .catch(error=>{handleNotification(error)})
	}
	
	
	render(){
		return(
			<div className="login-container">
				<div className="login-box">
					<div className="login-header">
						<img src={logo} alt="logo ao" className="login-logo" />
						<h2>Bienvenido</h2>
						<p className="text-muted">Ingresa tus credenciales para continuar</p>
					</div>

					<form className="login-form" onSubmit={this.submit}>
						<div className="form-group">
							<div className="input-group">
								<span className="input-group-text">
									<i className="fas fa-user"></i>
								</span>
								<input
									className="form-control"
									type="text"
									autoComplete="off"
									value={this.state.usuario}
									name="usuario"
									onChange={(event) => this.changeUniqueState({ usuario: event.target.value })}
									placeholder="Usuario"
									required
								/>
							</div>
						</div>

						<div className="form-group">
							<div className="input-group">
								<span className="input-group-text">
									<i className="fas fa-lock"></i>
								</span>
								<input
									className="form-control"
									type="password"
									autoComplete="off"
									value={this.state.clave}
									name="clave"
									onChange={(event) => this.changeUniqueState({ clave: event.target.value })}
									placeholder="Contraseña"
									required
								/>
							</div>
						</div>

						<button className="btn btn-primary btn-block login-button" type="submit">
							{this.state.activeLoading ? (
								<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
							) : (
								<i className="fas fa-sign-in-alt me-2"></i>
							)}
							Iniciar Sesión
						</button>
					</form>

					<div className="login-footer">
						<p className="company-name">OSPINO SYSTEMS, C.A</p>
						<p className="version">v1.0.0</p>
					</div>
				</div>

				<style jsx>{`
					.login-container {
						min-height: 100vh;
						display: flex;
						align-items: center;
						justify-content: center;
						background: linear-gradient(135deg, var(--sinapsis-color-light) 0%, var(--sinapsis-color) 100%);
						padding: 20px;
					}

					.login-box {
						background: white;
						border-radius: 15px;
						box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
						padding: 40px;
						width: 100%;
						max-width: 400px;
						position: relative;
					}

					.login-header {
						text-align: center;
						margin-bottom: 30px;
					}

					.login-logo {
						height: 120px;
						margin-bottom: 20px;
					}

					.login-header h2 {
						color: #2c3e50;
						margin-bottom: 10px;
						font-weight: 600;
					}

					.form-group {
						margin-bottom: 20px;
					}

					.input-group {
						border: 1px solid #e0e0e0;
						border-radius: 8px;
						overflow: hidden;
						transition: all 0.3s ease;
					}

					.input-group:focus-within {
						border-color: var(--sinapsis-color);
						box-shadow: 0 0 0 0.2rem rgba(242, 109, 10, 0.15);
					}

					.input-group-text {
						background: transparent;
						border: none;
						color: #6c757d;
					}

					.form-control {
						border: none;
						padding: 12px;
						font-size: 1rem;
					}

					.form-control:focus {
						box-shadow: none;
					}

					.login-button {
						width: 100%;
						padding: 12px;
						font-size: 1rem;
						font-weight: 500;
						background: var(--sinapsis-color);
						border: none;
						border-radius: 8px;
						transition: all 0.3s ease;
					}

					.login-button:hover {
						background: var(--sinapsis-color-select);
						transform: translateY(-1px);
					}

					.login-footer {
						text-align: center;
						margin-top: 30px;
						padding-top: 20px;
						border-top: 1px solid #eee;
					}

					.company-name {
						color: #2c3e50;
						font-weight: 500;
						margin-bottom: 5px;
					}

					.version {
						color: #6c757d;
						font-size: 0.8rem;
					}

					@media (max-width: 480px) {
						.login-box {
							padding: 20px;
						}

						.login-logo {
							height: 100px;
						}
					}
				`}</style>
			</div>
		);
	}
}

export default Login