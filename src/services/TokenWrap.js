import axios from 'axios';

const isAuthenticated = localStorage.getItem('access');
const axiosApiInstance = axios.create();

axiosApiInstance.interceptors.request.use(
    (config) => {
        if (isAuthenticated) {
            config.headers = { 
                'Authorization': 'Bearer ' + localStorage.getItem('access')
            }
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
});

axiosApiInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;
        if (isAuthenticated && error.response.status === 401 && !originalRequest._retry) {
            return axios.get("/authentication/token/refresh/", {
                withCredentials: true 
            }).then(response => {
                localStorage.setItem('access', response.data.access);
                originalRequest._retry = true;
                originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;
                return axiosApiInstance(originalRequest);
            }).catch(error => {
                localStorage.removeItem('access');
                return Promise.reject(error);
            });
        }
        return Promise.reject(error);
    }
);

export default axiosApiInstance;