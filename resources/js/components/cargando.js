import React from 'react';

function Cargando({ active = true, message = "Cargando..." }) {
	if (!active) return null;

	return (
		<div className="loading-overlay" role="alert" aria-busy="true">
			<div className="loading-container">
				<div className="loading-spinner">
					<div className="spinner-circle"></div>
					<div className="spinner-circle"></div>
					<div className="spinner-circle"></div>
				</div>
				<div className="loading-message">{message}</div>
			</div>
			<style jsx>{`
				.loading-overlay {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: rgba(255, 255, 255, 0.9);
					display: flex;
					justify-content: center;
					align-items: center;
					z-index: 9999;
					backdrop-filter: blur(4px);
				}

				.loading-container {
					text-align: center;
					padding: 2rem;
					border-radius: 1rem;
					background: white;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
				}

				.loading-spinner {
					display: flex;
					justify-content: center;
					gap: 0.5rem;
					margin-bottom: 1rem;
				}

				.spinner-circle {
					width: 12px;
					height: 12px;
					border-radius: 50%;
					background-color: #007bff;
					animation: bounce 0.5s ease-in-out infinite;
				}

				.spinner-circle:nth-child(2) {
					animation-delay: 0.1s;
				}

				.spinner-circle:nth-child(3) {
					animation-delay: 0.2s;
				}

				.loading-message {
					color: #2c3e50;
					font-size: 1.1rem;
					font-weight: 500;
				}

				@keyframes bounce {
					0%, 100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-10px);
					}
				}
			`}</style>
		</div>
	);
}

export default Cargando;