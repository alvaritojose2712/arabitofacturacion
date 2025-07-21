import React, { useState } from 'react';

const FotosStep = ({ formData, updateFormData, errors }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);

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

    const handleFiles = (files) => {
        const validFiles = [];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        for (let file of files) {
            if (!allowedTypes.includes(file.type)) {
                alert(`El archivo ${file.name} no es una imagen válida`);
                continue;
            }
            
            if (file.size > maxSize) {
                alert(`El archivo ${file.name} es demasiado grande (máximo 5MB)`);
                continue;
            }

            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            processFiles(validFiles);
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
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const handleFacturaFileInput = (e) => {
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
                            <div className="upload-area text-center p-4 border border-dashed rounded">
                                <i className="fa fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                                <h6>Subir Foto de Factura</h6>
                                <p className="text-muted">Opcional - Foto clara de la factura original</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFacturaFileInput}
                                    className="form-control"
                                    id="facturaFileInput"
                                />
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
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
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
                                    <h6>Arrastra fotos aquí o haz clic para seleccionar</h6>
                                    <p className="text-muted">
                                        Formatos: JPG, PNG, GIF, WebP | Tamaño máximo: 5MB por foto
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileInput}
                                        className="form-control"
                                        id="productFileInput"
                                    />
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
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FotosStep; 