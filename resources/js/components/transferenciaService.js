import db from '../database/database';

export const getTransferencias = (filters = {}) => {
    return db.get('/transferencias', { params: filters });
};

export const getTransferenciaById = (id) => {
    return db.get(`/transferencias/${id}`);
};

export const createTransferencia = (data) => {
    return db.post('/transferencias', data);
};

export const updateTransferenciaStatus = (id, estatus) => {
    return db.put(`/transferencias/${id}/estatus`, { estatus });
};