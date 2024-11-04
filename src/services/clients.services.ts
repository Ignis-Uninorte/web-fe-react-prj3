import apiManager from './api';

export function getAllClients(){
    return apiManager.get('/clients')
    .then(response => response.data)
    .catch(error => {
        throw error;
    });
}
