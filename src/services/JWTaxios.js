import axios from 'axios';

const jwt_axios = axios.create();

jwt_axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            return axios.get("/authentication/token/refresh/", {
                withCredentials: true 
            }).then(response => {
                originalRequest._retry = true;
                return jwt_axios(originalRequest);
            }).catch(error => {
                return Promise.reject(error);
            });
        }
        return Promise.reject(error);
    }
);

export default jwt_axios;