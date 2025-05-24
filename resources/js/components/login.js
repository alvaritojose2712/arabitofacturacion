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
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-sinapsis/20 p-4 relative overflow-hidden">
				{/* Floating Stars Background */}
				<div className="absolute inset-0 overflow-hidden">
					{[...Array(50)].map((_, i) => (
						<div
							key={i}
							className="absolute w-1 h-1 bg-white rounded-full animate-float"
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								animationDelay: `${Math.random() * 5}s`,
								animationDuration: `${5 + Math.random() * 10}s`,
								opacity: Math.random() * 0.5 + 0.3
							}}
						/>
					))}
				</div>

				{/* Login Box */}
				<div className="w-full max-w-md backdrop-blur-sm rounded-2xl overflow-hidden relative z-10">
					{/* Logo Section */}
					<div className="p-8 text-center">
						<img src={logo} alt="logo ao" className="h-28 w-auto mx-auto mb-6 object-contain" />
					</div>

					{/* Form Section */}
					<form onSubmit={this.submit} className="px-8 pb-8">
						{/* Username Input */}
						<div className="mb-8">
							<div className="relative group">
								<div className="absolute left-0 top-4 text-white/50 group-focus-within:text-sinapsis transition-colors duration-300">
									<i className="fas fa-user"></i>
								</div>
								<input
									className="w-full py-4 pl-10 pr-4 bg-transparent text-white placeholder-transparent peer border-0 border-b-2 border-white/20 focus:border-sinapsis transition-all duration-300 focus:outline-none focus:ring-0"
									type="text"
									autoComplete="off"
									autoCorrect="off"
									autoCapitalize="off"
									spellCheck="false"
									value={this.state.usuario}
									name="usuario"
									onChange={(event) => this.changeUniqueState({ usuario: event.target.value })}
									placeholder="Usuario"
									required
								/>
								<label className="absolute left-10 -top-2.5 text-white/70 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-sinapsis">
									Usuario
								</label>
							</div>
						</div>

						{/* Password Input */}
						<div className="mb-10">
							<div className="relative group">
								<div className="absolute left-0 top-4 text-white/50 group-focus-within:text-sinapsis transition-colors duration-300">
									<i className="fas fa-lock"></i>
								</div>
								<input
									className="w-full py-4 pl-10 pr-4 bg-transparent text-white placeholder-transparent peer border-0 border-b-2 border-white/20 focus:border-sinapsis transition-all duration-300 focus:outline-none focus:ring-0"
									type="password"
									autoComplete="new-password"
									autoCorrect="off"
									autoCapitalize="off"
									spellCheck="false"
									value={this.state.clave}
									name="clave"
									onChange={(event) => this.changeUniqueState({ clave: event.target.value })}
									placeholder="Contraseña"
									required
								/>
								<label className="absolute left-10 -top-2.5 text-white/70 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-sinapsis">
									Contraseña
								</label>
							</div>
						</div>

						{/* Submit Button */}
						<button 
							className="w-full py-4 px-4 bg-sinapsis/90 text-white font-medium rounded-lg hover:bg-sinapsis transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-sinapsis/20"
							type="submit"
						>
							{this.state.activeLoading ? (
								<span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
							) : (
								<i className="fas fa-sign-in-alt"></i>
							)}
							Iniciar Sesión
						</button>
					</form>

					{/* Footer */}
					<div className="px-8 py-6 border-t border-white/10 text-center">
						<p className="text-white/80 font-medium">OSPINO SYSTEMS, C.A</p>
						<p className="text-white/50 text-sm mt-1">v1.0.0</p>
					</div>
				</div>

				{/* Quote Container */}
				<div className="fixed bottom-10 right-10 max-w-md bg-gray-900/40 backdrop-blur-sm rounded-lg p-6 shadow-xl transition-all duration-700 z-10 hidden md:block">
					{this.state.isLoadingQuotes ? (
						<div className="flex items-center justify-center text-white/70">
							<span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
							Cargando frases motivacionales...
						</div>
					) : (
						<>
							<p className="text-white/90 italic text-lg leading-relaxed mb-2 transition-opacity duration-700">
								{currentQuote.content}
							</p>
							<p className="text-white/60 text-sm transition-opacity duration-700">
								- {currentQuote.author}
							</p>
						</>
					)}
				</div>

				<style jsx>{`
					@keyframes float {
						0% {
							transform: translateY(0) translateX(0);
						}
						50% {
							transform: translateY(-20px) translateX(10px);
						}
						100% {
							transform: translateY(0) translateX(0);
						}
					}
					.animate-float {
						animation: float linear infinite;
					}
				`}</style>
			</div>
		);
	}
}

export default Login