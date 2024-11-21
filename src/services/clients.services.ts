import apiManager from './api';

// Obtener todos los clientes
export function getAllClients() {
    return apiManager.get('/clients')
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}

// Alternar el estado de un cliente (activar/desactivar)
export function toggleClientStatus(nit: number, currentStatus: boolean) {
    return apiManager.patch(`/clients/activate/${nit}`, { active: !currentStatus })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}

// Obtener datos de un cliente específico por NIT
export function getClientByNit(nit: string | undefined) {
    return apiManager.get(`/clients/${nit}`)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}

// Obtener el próximo ID para un cliente nuevo
export function getNextClientId() {
    return apiManager.get('/clients')
        .then(response => {
            const clients = response.data;
            return clients.reduce((max: number, client: { id?: number }) => Math.max(max, client.id || 0), 0) + 1;
        })
        .catch(error => {
            throw error;
        });
}
