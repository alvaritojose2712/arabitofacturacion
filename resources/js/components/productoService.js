import db from '../database/database';

export const searchProductos = (term, sucursalIdActual) => {
    if (!term || term.length < 2) return Promise.resolve({ data: [] }); // No buscar con menos de 2 caracteres
    return db.getinventario({ params: { term, sucursal_id_actual: sucursalIdActual } });
};