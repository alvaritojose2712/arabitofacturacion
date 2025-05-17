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
			isLoadingQuotes: false
		}
		this.loc = window.location.origin
		this.getApiData = this.getApiData.bind(this)
		this.changeUniqueState = this.changeUniqueState.bind(this)

		this.submit = this.submit.bind(this)
		this.rotateQuote = this.rotateQuote.bind(this)
		
		// Colección local de frases motivacionales
		this.motivationalQuotes = [
			// Frases de Éxito
			{ content: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", author: "Robert Collier" },
			{ content: "El éxito no es final, el fracaso no es fatal: lo que cuenta es el coraje para continuar.", author: "Winston Churchill" },
			{ content: "El éxito es ir de fracaso en fracaso sin perder el entusiasmo.", author: "Winston Churchill" },
			{ content: "La mejor venganza es un éxito masivo.", author: "Frank Sinatra" },
			{ content: "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.", author: "Albert Schweitzer" },
			{ content: "El éxito es la realización progresiva de un ideal digno.", author: "Earl Nightingale" },
			{ content: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", author: "Robert Collier" },
			{ content: "El éxito no es para los que piensan que pueden hacer algo, sino para los que lo hacen.", author: "Anónimo" },
			{ content: "El éxito es la capacidad de ir de un fracaso a otro sin perder el entusiasmo.", author: "Winston Churchill" },
			{ content: "El éxito no es la ausencia de fracasos, es la persistencia a través de los fracasos.", author: "Aisha Tyler" },

			// Frases de Motivación Personal
			{ content: "Cada día es una nueva oportunidad para ser mejor.", author: "Anónimo" },
			{ content: "La excelencia no es un acto, es un hábito.", author: "Aristóteles" },
			{ content: "El único límite es el que te pones a ti mismo.", author: "Anónimo" },
			{ content: "La persistencia es el camino del éxito.", author: "Anónimo" },
			{ content: "La disciplina es el puente entre las metas y los logros.", author: "Jim Rohn" },
			{ content: "El optimismo es la fe que lleva al logro.", author: "Helen Keller" },
			{ content: "La creatividad es la inteligencia divirtiéndose.", author: "Albert Einstein" },
			{ content: "La confianza en sí mismo es el primer secreto del éxito.", author: "Ralph Waldo Emerson" },
			{ content: "El conocimiento es la inversión que paga los mejores intereses.", author: "Benjamin Franklin" },
			{ content: "La innovación distingue entre un líder y un seguidor.", author: "Steve Jobs" },

			// Frases de Crecimiento Personal
			{ content: "La mejor manera de predecir el futuro es crearlo.", author: "Peter Drucker" },
			{ content: "El cambio es la única constante en la vida.", author: "Heráclito" },
			{ content: "La determinación de hoy es el éxito de mañana.", author: "Robert H. Schuller" },
			{ content: "El aprendizaje es un tesoro que seguirá a su dueño a todas partes.", author: "Proverbio chino" },
			{ content: "La visión sin acción es solo un sueño. La acción sin visión es solo pasar el tiempo.", author: "Joel A. Barker" },
			{ content: "El entusiasmo es la madre del esfuerzo, y sin él nunca se logró nada grande.", author: "Ralph Waldo Emerson" },
			{ content: "La paciencia es amarga, pero su fruto es dulce.", author: "Jean-Jacques Rousseau" },
			{ content: "El trabajo duro vence al talento cuando el talento no trabaja duro.", author: "Tim Notke" },
			{ content: "La calidad perdura mucho después de olvidado el precio.", author: "Aldo Gucci" },
			{ content: "El coraje no es tener la fuerza para seguir adelante, es seguir adelante cuando no tienes fuerza.", author: "Napoleón Bonaparte" },

			// Frases de Trabajo Duro
			{ content: "El trabajo duro supera al talento cuando el talento no trabaja duro.", author: "Tim Notke" },
			{ content: "La genialidad es 1% inspiración y 99% transpiración.", author: "Thomas Edison" },
			{ content: "El éxito es el resultado de la perfección, el trabajo duro, el aprendizaje de los errores, la lealtad y la persistencia.", author: "Colin Powell" },
			{ content: "No hay atajos para el éxito. Es trabajo duro, perseverancia, aprendizaje, estudio, sacrificio y, sobre todo, amor por lo que estás haciendo.", author: "Pelé" },
			{ content: "El trabajo duro no garantiza el éxito, pero mejora sus probabilidades.", author: "B.J. Gupta" },
			{ content: "El trabajo duro es el precio que pagamos por el éxito.", author: "Anónimo" },
			{ content: "La diferencia entre lo ordinario y lo extraordinario es ese pequeño extra.", author: "Jimmy Johnson" },
			{ content: "El trabajo duro es el combustible del éxito.", author: "Anónimo" },
			{ content: "La excelencia no es un acto, es un hábito. El trabajo duro es la clave.", author: "Aristóteles" },
			{ content: "El trabajo duro es el puente entre tus sueños y la realidad.", author: "Anónimo" },

			// Frases de Oportunidades
			{ content: "Las oportunidades no ocurren, las creas.", author: "Chris Grosser" },
			{ content: "La oportunidad no toca la puerta, la creas.", author: "Anónimo" },
			{ content: "Cada día es una nueva oportunidad para ser mejor.", author: "Anónimo" },
			{ content: "Las oportunidades son como los amaneceres. Si esperas demasiado, te las pierdes.", author: "William Arthur Ward" },
			{ content: "La oportunidad es como el amanecer: si esperas demasiado, la pierdes.", author: "William Arthur Ward" },
			{ content: "Las oportunidades no son perdidas, son tomadas por otros.", author: "Anónimo" },
			{ content: "La oportunidad es el momento perfecto para comenzar.", author: "Anónimo" },
			{ content: "Las oportunidades son como los autobuses, siempre viene otro.", author: "Anónimo" },
			{ content: "La oportunidad es el momento de actuar.", author: "Anónimo" },
			{ content: "Las oportunidades son como las estrellas, siempre están ahí, solo necesitas mirar hacia arriba.", author: "Anónimo" },

			// Frases de Perseverancia
			{ content: "La perseverancia es el trabajo duro que haces después de que te cansas del trabajo duro que ya hiciste.", author: "Newt Gingrich" },
			{ content: "La perseverancia es el secreto de todos los triunfos.", author: "Victor Hugo" },
			{ content: "La perseverancia es el camino del éxito.", author: "Anónimo" },
			{ content: "La perseverancia es la madre del éxito.", author: "Anónimo" },
			{ content: "La perseverancia es la clave del éxito.", author: "Anónimo" },
			{ content: "La perseverancia es el puente entre el fracaso y el éxito.", author: "Anónimo" },
			{ content: "La perseverancia es la diferencia entre el éxito y el fracaso.", author: "Anónimo" },
			{ content: "La perseverancia es el camino hacia la grandeza.", author: "Anónimo" },
			{ content: "La perseverancia es la llave que abre todas las puertas.", author: "Anónimo" },
			{ content: "La perseverancia es el motor del éxito.", author: "Anónimo" },

			// Frases de Actitud
			{ content: "La actitud es una pequeña cosa que marca una gran diferencia.", author: "Winston Churchill" },
			{ content: "Tu actitud determina tu altitud.", author: "Zig Ziglar" },
			{ content: "La actitud es más importante que la aptitud.", author: "Anónimo" },
			{ content: "La actitud es el pincel de la mente. Puede colorear cualquier situación.", author: "Anónimo" },
			{ content: "La actitud es el 90% del éxito.", author: "Anónimo" },
			{ content: "La actitud es la diferencia entre una aventura y un problema.", author: "Anónimo" },
			{ content: "La actitud es el espejo del alma.", author: "Anónimo" },
			{ content: "La actitud es la clave del éxito.", author: "Anónimo" },
			{ content: "La actitud es el motor del éxito.", author: "Anónimo" },
			{ content: "La actitud es el puente entre el fracaso y el éxito.", author: "Anónimo" },

			// Frases de Liderazgo
			{ content: "El liderazgo es la capacidad de transformar la visión en realidad.", author: "Warren Bennis" },
			{ content: "El liderazgo es influencia.", author: "John C. Maxwell" },
			{ content: "El liderazgo es acción, no posición.", author: "Donald H. McGannon" },
			{ content: "El liderazgo es la capacidad de hacer que otros quieran hacer lo que tú quieres que hagan.", author: "Anónimo" },
			{ content: "El liderazgo es la capacidad de inspirar a otros a seguirte.", author: "Anónimo" },
			{ content: "El liderazgo es la capacidad de tomar decisiones difíciles.", author: "Anónimo" },
			{ content: "El liderazgo es la capacidad de ver el futuro.", author: "Anónimo" },
			{ content: "El liderazgo es la capacidad de motivar a otros.", author: "Anónimo" },
			{ content: "El liderazgo es la capacidad de servir a otros.", author: "Anónimo" },
			{ content: "El liderazgo es la capacidad de hacer que otros sean mejores.", author: "Anónimo" },

			// Frases de Innovación
			{ content: "La innovación distingue entre un líder y un seguidor.", author: "Steve Jobs" },
			{ content: "La innovación es el motor del progreso.", author: "Anónimo" },
			{ content: "La innovación es la clave del éxito.", author: "Anónimo" },
			{ content: "La innovación es el puente entre el presente y el futuro.", author: "Anónimo" },
			{ content: "La innovación es la capacidad de ver lo que otros no ven.", author: "Anónimo" },
			{ content: "La innovación es la capacidad de hacer lo que otros no hacen.", author: "Anónimo" },
			{ content: "La innovación es la capacidad de pensar diferente.", author: "Anónimo" },
			{ content: "La innovación es la capacidad de crear valor.", author: "Anónimo" },
			{ content: "La innovación es la capacidad de resolver problemas.", author: "Anónimo" },
			{ content: "La innovación es la capacidad de mejorar.", author: "Anónimo" },

			// Frases de Excelencia
			{ content: "La excelencia no es un acto, es un hábito.", author: "Aristóteles" },
			{ content: "La excelencia es el resultado de la atención a los detalles.", author: "Anónimo" },
			{ content: "La excelencia es el resultado de la práctica constante.", author: "Anónimo" },
			{ content: "La excelencia es el resultado del trabajo duro.", author: "Anónimo" },
			{ content: "La excelencia es el resultado de la dedicación.", author: "Anónimo" },
			{ content: "La excelencia es el resultado de la pasión.", author: "Anónimo" },
			{ content: "La excelencia es el resultado de la perseverancia.", author: "Anónimo" },
			{ content: "La excelencia es el resultado de la disciplina.", author: "Anónimo" },
			{ content: "La excelencia es el resultado de la consistencia.", author: "Anónimo" },
			{ content: "La excelencia es el resultado de la mejora continua.", author: "Anónimo" }
		];
	}

	componentDidMount() {
		// Mezclar las frases aleatoriamente
		const shuffledQuotes = [...this.motivationalQuotes].sort(() => Math.random() - 0.5);
		this.setState({ 
			quotes: shuffledQuotes,
			isLoadingQuotes: false
		});

		this.quoteInterval = setInterval(() => {
			this.rotateQuote();
		}, 15000); // Cambiar la cita cada 15 segundos
	}

	rotateQuote() {
		this.setState(prevState => ({
			currentQuoteIndex: (prevState.currentQuoteIndex + 1) % prevState.quotes.length
		}));
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