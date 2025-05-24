import React from 'react';

const StatusBadge = ({ estatus }) => {
    const statusColors = {
        'PENDIENTE': 'bg-red-500 text-white',
        'EN REVISION': 'bg-yellow-500 text-black',
        'REVISADO': 'bg-sky-500 text-white', // Azul Cielo
        'PROCESADO': 'bg-green-500 text-white',
    };
    const colorClass = statusColors[estatus.toUpperCase()] || 'bg-gray-500 text-white';

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
            {estatus}
        </span>
    );
};

export default StatusBadge;