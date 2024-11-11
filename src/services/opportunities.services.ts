import apiManager from './api';

export function getAllOpportunities(){
    return apiManager.get('/opportunities')
    .then(response => response.data)
    .catch(error => {
        throw error;
    });
}

export function deleteOpportunityById(id: string) {
    return apiManager.delete(`/del-opp/${id}`)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}