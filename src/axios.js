import axios from 'axios';
// import _ from 'lodash';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    // withCredentials: true
    headers: {
        'Content-Type': 'application/json',
    },
});

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        console.log("tokent", token);
        if (!token) {
            console.warn("No token found in localStorage");
        }
        config.headers.Authorization = token ? `Bearer ${token}` : '';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        if (response && response.data) return response.data;
        return response;
    }
), function (error) {
    return Promise.reject(error);
};

export default instance;
