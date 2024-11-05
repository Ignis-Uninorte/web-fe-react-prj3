import apiManager from './api';

export function getAllClients(){
    return apiManager.get('/clients')
    .then(response => response.data)
    .catch(error => {
        throw error;
    });
}

export function toggleClientStatus(nit: number, currentStatus: boolean) {
    return apiManager.patch(`/clients/activate/${nit}`, { active: !currentStatus })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}
