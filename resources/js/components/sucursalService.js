import db from '../database/database';

export const getSucursales = (excludeId = null) => {
    let params = {};
    if (excludeId) {
        params.exclude_id = excludeId;
    }
    return db.getSucursales(params);
};