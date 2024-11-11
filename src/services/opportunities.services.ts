import apiManager from './api';

export function getAllOpportunities(){
    return apiManager.get('/opportunities')
    .then(response => response.data)
    .catch(error => {
        throw error;
    });
}
