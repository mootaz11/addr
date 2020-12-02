import axios from 'axios'
import AsyncStorageService from '../rest/AsyncStorageService'
const production = false;

const host = production ? 'https://addresti-back-end.herokuapp.com' : 'http://localhost:3000' //'http://192.168.1.6:3000'
const custom_axios = axios.create({
    baseURL: host,

})

custom_axios.interceptors.request.use(
    (config) => {
        
        const accessToken = AsyncStorageService.getAccessToken() //await  AsyncStorageService.getAccessToken();
        if (accessToken) {

            config.headers['Authorization'] = 'Bearer ' + accessToken;
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });
custom_axios.interceptors.response.use((response) => {
    return response
},
    function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
           //const t= await  AsyncStorageService.getRefreshToken() 
            return axios.post(`${host}/user/token`, { refreshToken:AsyncStorageService.getRefreshToken()})
                .then(res => {
                    console.log(res)
                    if (res.status === 200) {
                        // 1) put token to LocalStorage
                        AsyncStorageService.setAccessToken(res.data.accessToken);

                        // 2) Change Authorization header
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + AsyncStorageService.getAccessToken();

                        // 3) return originalRequest object with Axios.
                        return axios(originalRequest);
                    }
                })
        } else return Promise.reject(error)
    });

export default custom_axios;