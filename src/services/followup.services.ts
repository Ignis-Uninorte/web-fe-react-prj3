import apiManager from './api';

export function getAllFollowUps(){
    return apiManager.get('/activities')
    .then(response => response.data)
    .catch(error => {
        throw error;
    });
}

export function deleteFollowUp(id: number) {
    return apiManager.delete(`/activities/${id}`)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}