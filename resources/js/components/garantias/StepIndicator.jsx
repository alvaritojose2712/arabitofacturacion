import React from 'react';

const StepIndicator = ({ steps, currentStep }) => {
    const getStepStatus = (stepNumber) => {
        if (stepNumber < currentStep) return 'completed';
        if (stepNumber === currentStep) return 'active';
        return 'upcoming';
    };

    const getStepIcon = (stepNumber, status) => {
        if (status === 'completed') {
            return <i className="fa fa-check"></i>;
        }
        return stepNumber;
    };

    return (
        <div className="step-indicator">
            {/* Desktop Layout */}
            <div className="hidden md:block">
                <div className="flex justify-between items-start">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex-1 relative">
                            <div className="step-item text-center">
                                {/* Línea conectora (excepto para el último paso) */}
                                {index < steps.length - 1 && (
                                    <div 
                                        className={`step-line ${getStepStatus(step.number) === 'completed' ? 'completed' : ''}`}
                                    ></div>
                                )}
                                
                                {/* Círculo del paso */}
                                <div 
                                    className={`step-circle ${getStepStatus(step.number)}`}
                                    title={step.description}
                                >
                                    {getStepIcon(step.number, getStepStatus(step.number))}
                                </div>
                                
                                {/* Información del paso */}
                                <div className="step-info">
                                    <div className={`step-title ${getStepStatus(step.number) === 'active' ? 'text-primary fw-bold' : ''}`}>
                                        {step.title}
                                    </div>
                                    <div className="step-description text-muted small">
                                        {step.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tablet Layout */}
            <div className="hidden sm:block md:hidden">
                <div className="flex justify-between items-start">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex-1 relative">
                            <div className="step-item text-center">
                                {/* Línea conectora (excepto para el último paso) */}
                                {index < steps.length - 1 && (
                                    <div 
                                        className={`step-line-tablet ${getStepStatus(step.number) === 'completed' ? 'completed' : ''}`}
                                    ></div>
                                )}
                                
                                {/* Círculo del paso */}
                                <div 
                                    className={`step-circle-tablet ${getStepStatus(step.number)}`}
                                    title={step.description}
                                >
                                    {getStepIcon(step.number, getStepStatus(step.number))}
                                </div>
                                
                                {/* Información del paso - Solo título en tablet */}
                                <div className="step-info-tablet">
                                    <div className={`step-title-tablet ${getStepStatus(step.number) === 'active' ? 'text-primary fw-bold' : ''}`}>
                                        {step.title}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden">
                <div className="flex justify-between items-center">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex-1 relative">
                            <div className="step-item-mobile text-center">
                                {/* Línea conectora (excepto para el último paso) */}
                                {index < steps.length - 1 && (
                                    <div 
                                        className={`step-line-mobile ${getStepStatus(step.number) === 'completed' ? 'completed' : ''}`}
                                    ></div>
                                )}
                                
                                {/* Círculo del paso */}
                                <div 
                                    className={`step-circle-mobile ${getStepStatus(step.number)}`}
                                    title={step.title}
                                >
                                    {getStepIcon(step.number, getStepStatus(step.number))}
                                </div>
                                
                                {/* Información del paso - Solo número en mobile */}
                                <div className="step-info-mobile">
                                    <div className={`step-number-mobile ${getStepStatus(step.number) === 'active' ? 'text-primary fw-bold' : ''}`}>
                                        {step.number}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Estilos CSS inline para asegurar que funcione */}
            <style jsx>{`
                .step-indicator {
                    position: relative;
                    padding: 20px 0;
                }

                /* Desktop Layout */
                .step-item {
                    position: relative;
                    z-index: 1;
                }

                .step-line {
                    position: absolute;
                    top: 25px;
                    left: 60%;
                    right: -40%;
                    height: 2px;
                    background-color: #dee2e6;
                    z-index: 0;
                }

                .step-line.completed {
                    background-color: #28a745;
                }

                .step-circle {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 10px;
                    font-weight: bold;
                    font-size: 16px;
                    border: 2px solid;
                    background-color: white;
                    transition: all 0.3s ease;
                }

                .step-circle.upcoming {
                    border-color: #dee2e6;
                    color: #6c757d;
                    background-color: #f8f9fa;
                }

                .step-circle.active {
                    border-color: #007bff;
                    color: #007bff;
                    background-color: #fff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
                }

                .step-circle.completed {
                    border-color: #28a745;
                    color: white;
                    background-color: #28a745;
                }

                .step-title {
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 4px;
                }

                .step-description {
                    font-size: 12px;
                    line-height: 1.3;
                }

                .step-info {
                    max-width: 120px;
                    margin: 0 auto;
                }

                /* Tablet Layout */
                .step-line-tablet {
                    position: absolute;
                    top: 20px;
                    left: 60%;
                    right: -40%;
                    height: 2px;
                    background-color: #dee2e6;
                    z-index: 0;
                }

                .step-line-tablet.completed {
                    background-color: #28a745;
                }

                .step-circle-tablet {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 8px;
                    font-weight: bold;
                    font-size: 14px;
                    border: 2px solid;
                    background-color: white;
                    transition: all 0.3s ease;
                }

                .step-circle-tablet.upcoming {
                    border-color: #dee2e6;
                    color: #6c757d;
                    background-color: #f8f9fa;
                }

                .step-circle-tablet.active {
                    border-color: #007bff;
                    color: #007bff;
                    background-color: #fff;
                    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
                }

                .step-circle-tablet.completed {
                    border-color: #28a745;
                    color: white;
                    background-color: #28a745;
                }

                .step-title-tablet {
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 1.2;
                }

                .step-info-tablet {
                    max-width: 80px;
                    margin: 0 auto;
                }

                /* Mobile Layout */
                .step-item-mobile {
                    position: relative;
                    z-index: 1;
                }

                .step-line-mobile {
                    position: absolute;
                    top: 15px;
                    left: 60%;
                    right: -40%;
                    height: 2px;
                    background-color: #dee2e6;
                    z-index: 0;
                }

                .step-line-mobile.completed {
                    background-color: #28a745;
                }

                .step-circle-mobile {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 6px;
                    font-weight: bold;
                    font-size: 12px;
                    border: 2px solid;
                    background-color: white;
                    transition: all 0.3s ease;
                }

                .step-circle-mobile.upcoming {
                    border-color: #dee2e6;
                    color: #6c757d;
                    background-color: #f8f9fa;
                }

                .step-circle-mobile.active {
                    border-color: #007bff;
                    color: #007bff;
                    background-color: #fff;
                    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
                }

                .step-circle-mobile.completed {
                    border-color: #28a745;
                    color: white;
                    background-color: #28a745;
                }

                .step-number-mobile {
                    font-size: 10px;
                    font-weight: 500;
                    color: #6c757d;
                }

                .step-number-mobile.text-primary {
                    color: #007bff !important;
                }

                .step-info-mobile {
                    max-width: 30px;
                    margin: 0 auto;
                }

                /* Responsive adjustments */
                @media (max-width: 640px) {
                    .step-indicator {
                        padding: 15px 0;
                    }
                    
                    .step-circle-mobile {
                        width: 28px;
                        height: 28px;
                        font-size: 11px;
                    }
                    
                    .step-line-mobile {
                        top: 14px;
                    }
                }
            `}</style>
        </div>
    );
};

export default StepIndicator; 