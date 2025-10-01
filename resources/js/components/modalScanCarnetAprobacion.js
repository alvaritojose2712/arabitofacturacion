import { useEffect, useState, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function ModalScanCarnetAprobacion({
    isOpen,
    onClose,
    onScanSuccess,
    inputCarnetRef,
    valinputsetclaveadmin,
    setvalinputsetclaveadmin,
}) {
    const [error, setError] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const scannerRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputCarnetRef.current) {
            inputCarnetRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!valinputsetclaveadmin.trim()) {
            setError("Por favor escanee o ingrese el código del carnet");
            return;
        }
        onScanSuccess(valinputsetclaveadmin);
        onClose();
    };

    const openBarcodeScan = () => {
        if (isScanning) {
            // Si ya está escaneando, cerrar el scanner
            if (scannerRef.current) {
                scannerRef.current.clear();
                scannerRef.current = null;
            }
            setIsScanning(false);
            return;
        }

        // Verificar si Html5QrcodeScanner está disponible
        if (typeof Html5QrcodeScanner === 'undefined') {
            setError("Scanner no disponible. Ingrese el código manualmente.");
            return;
        }

        setIsScanning(true);
        setError("");

        // Crear el scanner
        scannerRef.current = new Html5QrcodeScanner("reader", { 
            fps: 10,
            qrbox: { width: 300, height: 150 }
        });

        scannerRef.current.render(success, error);

        function success(result) {
            setvalinputsetclaveadmin(result);
            if (scannerRef.current) {
                scannerRef.current.clear();
                scannerRef.current = null;
            }
            setIsScanning(false);
            setError("");
        }

        function error(err) {
            // No mostrar errores de escaneo en consola
            console.log("Error de escaneo:", err);
        }
    };

    // Función para limpiar el input después de dejar de escribir
    const clearInputAfterDelay = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
            setvalinputsetclaveadmin("");
        }, 500); // 0.5 segundos
    };

    const handleClose = () => {
        if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
        }
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        setIsScanning(false);
        setvalinputsetclaveadmin("");
        setError("");
        onClose();
    };

    useHotkeys(
        "esc",
        (event) => {
            handleClose();
        },
        {
            filterPreventDefault: false,
            enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
        },
        [isOpen]
    );

    if (!isOpen) return null;

    return (
        <>
            <section className="modal-custom">
                <div className="shadow-lg modal-content-supersm">
                    <div className="pb-0 border-0 modal-header">
                        <h5 className="modal-title">
                            <i className="fa fa-id-card text-warning me-2"></i>
                            Escanear Carnet de Aprobación
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={handleClose}
                            aria-label="Cerrar"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-muted">
                                    Escanee el código de barras del carnet de aprobación
                                </label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control form-control-lg ${error ? 'is-invalid' : ''}`}
                                        ref={inputCarnetRef}
                                        value={valinputsetclaveadmin}
                                        onChange={e => {
                                            setvalinputsetclaveadmin(e.target.value);
                                            setError("");
                                            clearInputAfterDelay();
                                        }}
                                        onBlur={() => {
                                            setTimeout(() => {
                                                setvalinputsetclaveadmin("");
                                            }, 100);
                                        }}
                                        onPaste={(e) => {
                                            e.preventDefault();
                                            return false;
                                        }}
                                        onCopy={(e) => {
                                            e.preventDefault();
                                            return false;
                                        }}
                                        onCut={(e) => {
                                            e.preventDefault();
                                            return false;
                                        }}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            return false;
                                        }}
                                        onDrag={(e) => {
                                            e.preventDefault();
                                            return false;
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            return false;
                                        }}
                                        autoComplete="new-password"
                                        autoSave="off"
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                        spellCheck="false"
                                        data-lpignore="true"
                                        data-form-type="other"
                                        data-1p-ignore="true"
                                        data-bwignore="true"
                                        data-kwignore="true"
                                        placeholder="Código del carnet"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${isScanning ? 'btn-danger' : 'btn-outline-primary'}`}
                                        onClick={openBarcodeScan}
                                    >
                                        <i className={`fa ${isScanning ? 'fa-stop' : 'fa-qrcode'}`}></i>
                                        {isScanning ? ' Detener' : ' Escanear'}
                                    </button>
                                </div>
                                {error && (
                                    <div className="invalid-feedback d-block">
                                        {error}
                                    </div>
                                )}
                            </div>
                            
                            {/* Área del scanner */}
                            {isScanning && (
                                <div className="mb-3">
                                    <div id="reader" className="border rounded p-2 bg-light"></div>
                                </div>
                            )}

                            <div className="gap-2 d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handleClose}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-warning"
                                    disabled={!valinputsetclaveadmin.trim()}
                                >
                                    <i className="fa fa-check me-1"></i>
                                    Aprobar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <div className="overlay"></div>
            <style jsx>{`
                .modal-custom {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1050;
                }
                .modal-content-supersm {
                    background: white;
                    border-radius: 0.5rem;
                    padding: 1.5rem;
                    min-width: 450px;
                }
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    z-index: 1040;
                }
                .form-control:focus {
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
                }
                .btn-close:focus {
                    box-shadow: none;
                }
                #reader {
                    min-height: 200px;
                }
            `}</style>
        </>
    );
}
