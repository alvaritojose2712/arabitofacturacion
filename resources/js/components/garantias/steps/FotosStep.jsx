import React, { useState, useRef } from 'react';

const FotosStep = ({ formData, updateFormData, errors }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const facturaFileInputRef = useRef(null);

    // Detectar si es dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    // Manejar eventos táctiles para móviles
    const handleTouchStart = (e) => {
        // En móviles, no usar preventDefault para evitar el error
        if (!isMobile) {
            e.preventDefault();
        }
        setDragActive(true);
    };

    const handleTouchEnd = (e) => {
        // En móviles, no usar preventDefault para evitar el error
        if (!isMobile) {
            e.preventDefault();
        }
        setDragActive(false);
    };

    // Manejar clic simple
    const handleClick = (e, selectorFunction) => {
        console.log('Click detected, calling selector function');
        e.preventDefault();
        e.stopPropagation();
        selectorFunction();
    };

    const handleFiles = (files) => {
        const validFiles = [];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        for (let file of files) {
            // Verificar si el archivo tiene un tipo válido
            if (!file.type || !allowedTypes.includes(file.type)) {
                // En móviles, algunos archivos pueden no tener type pero ser imágenes válidas
                if (isMobile && file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    // Asumir que es una imagen válida en móviles
                    console.log(`Archivo móvil detectado: ${file.name}`);
                } else {
                    alert(`El archivo ${file.name} no es una imagen válida`);
                    continue;
                }
            }
            
            if (file.size > maxSize) {
                alert(`El archivo ${file.name} es demasiado grande (máximo 5MB)`);
                continue;
            }

            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            processFiles(validFiles);
        } else {
            console.log('No se encontraron archivos válidos para procesar');
        }
    };

    const processFiles = (files) => {
        setUploading(true);
        
        const processedFiles = [];
        let processedCount = 0;

        files.forEach((file) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                processedFiles.push({
                    file: file,
                    preview: e.target.result,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    description: ''
                });
                
                processedCount++;
                
                if (processedCount === files.length) {
                    // Agregar a las fotos existentes
                    const currentPhotos = formData.fotos_productos || [];
                    const newPhotos = [...currentPhotos, ...processedFiles];
                    updateFormData('fotos_productos', newPhotos);
                    setUploading(false);
                }
            };
            
            reader.readAsDataURL(file);
        });
    };

    const handleFileInput = (e) => {
        console.log('File input triggered:', e.target.files);
        if (e.target.files) {
            handleFiles(e.target.files);
        } else {
            console.log('No files selected in file input');
        }
    };

    const handleFacturaFileInput = (e) => {
        console.log('Factura file input triggered:', e.target.files);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                updateFormData('foto_factura', {
                    file: file,
                    preview: e.target.result,
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
            };
            
            reader.readAsDataURL(file);
        } else {
            console.log('No factura file selected');
        }
    };

    // Función para abrir el selector de archivos
    const openFileSelector = () => {
        console.log('openFileSelector called, fileInputRef:', fileInputRef.current);
        if (fileInputRef.current) {
            console.log('Triggering click on file input');
            fileInputRef.current.click();
        } else {
            console.error('fileInputRef.current is null');
        }
    };

    const openFacturaFileSelector = () => {
        console.log('openFacturaFileSelector called, facturaFileInputRef:', facturaFileInputRef.current);
        if (facturaFileInputRef.current) {
            console.log('Triggering click on factura file input');
            facturaFileInputRef.current.click();
        } else {
            console.error('facturaFileInputRef.current is null');
        }
    };

    const removePhoto = (index) => {
        const photos = formData.fotos_productos || [];
        const newPhotos = photos.filter((_, i) => i !== index);
        updateFormData('fotos_productos', newPhotos);
    };

    const updatePhotoDescription = (index, description) => {
        const photos = formData.fotos_productos || [];
        const newPhotos = [...photos];
        newPhotos[index].description = description;
        updateFormData('fotos_productos', newPhotos);
    };

    const removeFacturaPhoto = () => {
        updateFormData('foto_factura', null);
    };

    const requiereCliente = formData.caso_uso !== 5;

    return (
        <div className="fotos-step">
            <div className="mb-4">
                <h4 className="text-primary mb-3">
                    <i className="fa fa-camera me-2"></i>
                    Fotos de Evidencia
                </h4>
                <p className="text-muted">
                    Sube fotos como evidencia de la garantía o devolución. Las fotos son opcionales pero recomendadas.
                </p>
            </div>

            {/* Foto de Factura - Solo si requiere cliente */}
            {requiereCliente && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h6 className="mb-0">
                            <i className="fa fa-file-invoice me-2"></i>
                            Foto de la Factura
                        </h6>
                    </div>
                    <div className="card-body">
                        {!formData.foto_factura ? (
                            <div 
                                className="upload-area text-center p-4 border border-dashed rounded"
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => handleClick(e, openFacturaFileSelector)}
                            >
                                <i className="fa fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                                <h6>Subir Foto de Factura</h6>
                                <p className="text-muted">Opcional - Foto clara de la factura original</p>
                                <p className="text-info small">
                                    <i className="fa fa-mobile-alt me-1"></i>
                                    {isMobile ? 'Toca aquí para seleccionar foto' : 'Haz clic para seleccionar'}
                                </p>

                            </div>
                        ) : (
                            <div className="uploaded-factura">
                                <div className="row">
                                    <div className="col-md-4">
                                        <img
                                            src={formData.foto_factura.preview}
                                            alt="Factura"
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="text-success">
                                            <i className="fa fa-check-circle me-2"></i>
                                            Foto de Factura Cargada
                                        </h6>
                                        <p className="mb-2">
                                            <strong>Archivo:</strong> {formData.foto_factura.name}
                                        </p>
                                        <p className="mb-3">
                                            <strong>Tamaño:</strong> {(formData.foto_factura.size / 1024).toFixed(2)} KB
                                        </p>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={removeFacturaPhoto}
                                        >
                                            <i className="fa fa-trash me-1"></i>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Fotos de Productos */}
            <div className="card">
                <div className="card-header">
                    <h6 className="mb-0">
                        <i className="fa fa-images me-2"></i>
                        Fotos de Productos
                    </h6>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <div
                            className={`upload-area text-center p-4 border border-dashed rounded ${dragActive ? 'border-primary bg-light' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={(e) => handleClick(e, openFileSelector)}

                        >
                            {uploading ? (
                                <div>
                                    <div className="spinner-border text-primary mb-3" role="status">
                                        <span className="visually-hidden">Subiendo...</span>
                                    </div>
                                    <p>Procesando fotos...</p>
                                </div>
                            ) : (
                                <div>
                                    <i className="fa fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                                    <h6>
                                        {isMobile ? 'Toca aquí para seleccionar fotos' : 'Arrastra fotos aquí o haz clic para seleccionar'}
                                    </h6>
                                    <p className="text-muted">
                                        Formatos: JPG, PNG, GIF, WebP | Tamaño máximo: 5MB por foto
                                    </p>
                                    {isMobile && (
                                        <p className="text-info small">
                                            <i className="fa fa-mobile-alt me-1"></i>
                                            Compatible con cámara y galería
                                        </p>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fotos Subidas */}
                    {formData.fotos_productos && formData.fotos_productos.length > 0 && (
                        <div className="uploaded-photos">
                            <h6 className="mb-3">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                Fotos Subidas ({formData.fotos_productos.length})
                            </h6>
                            <div className="row">
                                {formData.fotos_productos.map((photo, index) => (
                                    <div key={index} className="col-md-6 col-lg-4 mb-3">
                                        <div className="card">
                                            <img
                                                src={photo.preview}
                                                alt={`Producto ${index + 1}`}
                                                className="card-img-top"
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <div className="card-body">
                                                <h6 className="card-title text-truncate">
                                                    {photo.name}
                                                </h6>
                                                <p className="card-text small text-muted">
                                                    {(photo.size / 1024).toFixed(2)} KB
                                                </p>
                                                <div className="mb-2">
                                                    <label className="form-label small">Descripción:</label>
                                                    <textarea
                                                        className="form-control form-control-sm"
                                                        rows="2"
                                                        value={photo.description || ''}
                                                        onChange={(e) => updatePhotoDescription(index, e.target.value)}
                                                        placeholder="Describe qué se ve en la foto..."
                                                    />
                                                </div>
                                                <button
                                                    className="btn btn-outline-danger btn-sm w-100"
                                                    onClick={() => removePhoto(index)}
                                                >
                                                    <i className="fa fa-trash me-1"></i>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Consejos */}
                    <div className="mt-4">
                        <h6 className="text-info">
                            <i className="fa fa-lightbulb me-2"></i>
                            Consejos para las Fotos
                        </h6>
                        <ul className="list-unstyled small text-muted">
                            <li>
                                <i className="fa fa-check text-success me-2"></i>
                                Toma fotos claras y bien iluminadas
                            </li>
                            <li>
                                <i className="fa fa-check text-success me-2"></i>
                                Enfoca los daños o defectos claramente
                            </li>
                            <li>
                                <i className="fa fa-check text-success me-2"></i>
                                Incluye fotos del producto completo y detalles
                            </li>
                            <li>
                                <i className="fa fa-check text-success me-2"></i>
                                Agrega descripciones explicativas
                            </li>
                            <li>
                                <i className="fa fa-check text-success me-2"></i>
                                La foto de factura debe ser legible
                            </li>
                            {isMobile && (
                                <li>
                                    <i className="fa fa-check text-success me-2"></i>
                                    En móviles, puedes usar la cámara o seleccionar de la galería
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Información importante */}
            <div className="alert alert-info mt-4">
                <div className="d-flex align-items-start">
                    <i className="fa fa-info-circle me-2 mt-1"></i>
                    <div>
                        <h6 className="alert-heading">Información Importante</h6>
                        <ul className="mb-0 small">
                            <li>Las fotos son opcionales pero muy recomendadas como evidencia</li>
                            <li>Puedes subir múltiples fotos del producto</li>
                            <li>Las fotos se almacenan de forma segura en el sistema</li>
                            <li>Máximo 5MB por foto, formatos JPG, PNG, GIF, WebP</li>
                            <li>Puedes agregar descripciones para cada foto</li>
                            {isMobile && (
                                <li>En dispositivos móviles, toca el área para seleccionar fotos</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Inputs ocultos para selección de archivos */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture={isMobile ? "environment" : undefined}
                onChange={handleFileInput}
                style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                id="productFileInput"
            />
            <input
                ref={facturaFileInputRef}
                type="file"
                accept="image/*"
                capture={isMobile ? "environment" : undefined}
                onChange={handleFacturaFileInput}
                style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                id="facturaFileInput"
            />
        </div>
    );
};

export default FotosStep; 