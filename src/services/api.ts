import axios from 'axios';

export const REMOTE_API = 'https://three-web-be-json-server-api-ignis.onrender.com';

const apiManager = axios.create({
    baseURL: REMOTE_API,
})

export default apiManager;
