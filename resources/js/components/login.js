import logo from "../../images/logo-blanco.png"

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
			quotes: [],
			currentQuoteIndex: 0,
			isLoadingQuotes: true
		}
		this.loc = window.location.origin
		this.getApiData = this.getApiData.bind(this)
		this.changeUniqueState = this.changeUniqueState.bind(this)

		this.submit = this.submit.bind(this)
		this.fetchQuotes = this.fetchQuotes.bind(this)
		this.rotateQuote = this.rotateQuote.bind(this)
	}

	async fetchQuotes() {
		try {
			// Fetch 100 quotes in batches of 10 to avoid overwhelming the API
			const batchSize = 10;
			const totalQuotes = 100;
			let allQuotes = [];

			for(let i = 0; i < totalQuotes; i += batchSize) {
				const promises = Array(batchSize).fill().map(() => 
					fetch('https://api.quotable.io/random?tags=success|motivation')
						.then(res => res.json())
				);
				
				const batchQuotes = await Promise.all(promises);
				allQuotes = [...allQuotes, ...batchQuotes];
				
				// Update state with current batch to show progress
				this.setState(prevState => ({
					quotes: [...prevState.quotes, ...batchQuotes],
					isLoadingQuotes: i + batchSize < totalQuotes
				}));
			}

			// Shuffle the quotes array
			allQuotes = allQuotes.sort(() => Math.random() - 0.5);
			this.setState({ 
				quotes: allQuotes,
				isLoadingQuotes: false
			});
		} catch (error) {
			console.error('Error fetching quotes:', error);
			// Fallback quotes in case of API failure
			const fallbackQuotes = [
				{ content: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", author: "Robert Collier" },
				{ content: "Cada día es una nueva oportunidad para ser mejor.", author: "Anónimo" },
				{ content: "La excelencia no es un acto, es un hábito.", author: "Aristóteles" },
				{ content: "El único límite es el que te pones a ti mismo.", author: "Anónimo" },
				{ content: "La persistencia es el camino del éxito.", author: "Anónimo" },
				{ content: "El éxito no es final, el fracaso no es fatal: lo que cuenta es el coraje para continuar.", author: "Winston Churchill" },
				{ content: "La calidad perdura mucho después de olvidado el precio.", author: "Aldo Gucci" },
				{ content: "El éxito es ir de fracaso en fracaso sin perder el entusiasmo.", author: "Winston Churchill" },
				{ content: "La mejor manera de predecir el futuro es crearlo.", author: "Peter Drucker" },
				{ content: "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.", author: "Albert Schweitzer" }
			];
			this.setState({ 
				quotes: fallbackQuotes,
				isLoadingQuotes: false
			});
		}
	}

	rotateQuote() {
		this.setState(prevState => ({
			currentQuoteIndex: (prevState.currentQuoteIndex + 1) % prevState.quotes.length
		}));
	}

	componentDidMount() {
		this.fetchQuotes();
		this.quoteInterval = setInterval(() => {
			this.rotateQuote();
		}, 15000); // Cambiar la cita cada 15 segundos
	}

	componentWillUnmount() {
		clearInterval(this.quoteInterval);
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
		const currentQuote = this.state.quotes[this.state.currentQuoteIndex] || { content: "", author: "" };

		return(
			<div className="login-container">
				<div className="login-box">
					<div className="login-header">
						<img src={logo} alt="logo ao" className="login-logo" />
					</div>

					<form className="login-form" onSubmit={this.submit}>
						<div className="form-group">
							<div className="input-group">
								<span className="input-group-text">
									<i className="fas fa-user"></i>
								</span>
								<input
									className="form-control-login"
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
									className="form-control-login"
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

				<div className="quote-container">
					{this.state.isLoadingQuotes ? (
						<div className="loading-quotes">
							<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
							Cargando frases motivacionales...
						</div>
					) : (
						<>
							<p className="quote-text">{currentQuote.content}</p>
							<p className="quote-author">- {currentQuote.author}</p>
						</>
					)}
				</div>

				<style jsx>{`
					.login-container {
						min-height: 100vh;
						display: flex;
						align-items: center;
						justify-content: center;
						background: linear-gradient(135deg, 
							rgba(26, 26, 26, 1) 0%,
							rgba(26, 26, 26, 0.95) 40%,
							rgba(242, 109, 10, 0.2) 100%
						);
						padding: 20px;
						position: relative;
					}

					.login-box {
						/* background: rgba(45, 45, 45, 0.95);
						border-radius: 15px;
						box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
						padding: 40px;
						width: 100%;
						max-width: 400px;
						position: relative;
						color: #ffffff;
						backdrop-filter: blur(5px);
						z-index: 2; */
					}

					.login-header {
						text-align: center;
						margin-bottom: 30px;
					}

					.login-logo {
						height: 120px;
						margin-bottom: 20px;
					}

					.quote-container {
						position: fixed;
						bottom: 40px;
						right: 40px;
						text-align: right;
						padding: 20px;
						background: rgba(45, 45, 45, 0.7);
						backdrop-filter: blur(5px);
						border-radius: 8px;
						transition: all 1.5s ease-in-out;
						min-height: 100px;
						max-width: 400px;
						z-index: 1;
					}

					.loading-quotes {
						color: rgba(255, 255, 255, 0.7);
						font-size: 0.9rem;
						text-align: center;
					}

					.quote-text {
						color: #ffffff;
						font-style: italic;
						margin: 0;
						font-size: 1.1rem;
						line-height: 1.5;
						text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
						transition: opacity 1.5s ease-in-out;
						opacity: 1;
					}

					.quote-author {
						color: rgba(255, 255, 255, 0.7);
						margin: 10px 0 0 0;
						font-size: 0.9rem;
						text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
						transition: opacity 1.5s ease-in-out;
						opacity: 1;
					}

					.quote-container.fade-out .quote-text,
					.quote-container.fade-out .quote-author {
						opacity: 0;
					}

					.form-group {
						margin-bottom: 20px;
					}

					.input-group {
						border: 1px solid rgba(255, 255, 255, 0.1);
						border-radius: 0;
						overflow: hidden;
						transition: all 0.3s ease;
						background: rgba(255, 255, 255, 0.05);
					}

					.input-group:focus-within {
						border-color: var(--sinapsis-color);
						box-shadow: 0 0 0 0.2rem rgba(242, 109, 10, 0.15);
					}

					.input-group-text {
						background: transparent;
						border: none;
						color: #ffffff;
					}

					.form-control-login {
						border: none;
						padding: 12px;
						font-size: 1rem;
						background: transparent;
						color: #ffffff;
					}

					.form-control-login::placeholder {
						color: rgba(255, 255, 255, 0.5);
					}

					.form-control-login:focus {
						box-shadow: none;
					}

					.login-button {
						width: 100%;
						padding: 12px;
						font-size: 1rem;
						font-weight: 500;
						background: var(--sinapsis-color);
						border: none;
						border-radius: 0;
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
						border-top: 1px solid rgba(255, 255, 255, 0.1);
					}

					.company-name {
						color: #ffffff;
						font-weight: 500;
						margin-bottom: 5px;
					}

					.version {
						color: rgba(255, 255, 255, 0.5);
						font-size: 0.8rem;
					}

					@media (max-width: 768px) {
						.quote-container {
							bottom: 20px;
							right: 20px;
							left: 20px;
							max-width: none;
						}
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