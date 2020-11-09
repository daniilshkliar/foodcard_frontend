import axios from "axios";

const isAuthenticated = localStorage.getItem('refresh') && localStorage.getItem('access');
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
    async (error) => {
        const originalRequest = error.config;
        if (isAuthenticated && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const tokens = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
                refresh: localStorage.getItem('refresh')
            });
            localStorage.setItem('access', tokens.data.access);
            localStorage.setItem('refresh', tokens.data.refresh);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + tokens.data.access;
            return axiosApiInstance(originalRequest);
        }
        return Promise.reject(error);
});

export default axiosApiInstance;