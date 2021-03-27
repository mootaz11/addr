import axios from 'axios'
import AsyncStorageService from '../rest/AsyncStorageService'
const production = false;

const host = production ? 'https://addresti-back-end.herokuapp.com':'http://192.168.1.14:5000'
const custom_axios = axios.create({
    baseURL: host,
})



custom_axios.interceptors.request.use(
    async  config => {
        const accessToken = await AsyncStorageService.getAccessToken();
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
    async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            
            originalRequest._retry = true;
            const t= await  AsyncStorageService.getAccessToken() 
            return axios.post(`${host}/user/token`, {
                 accessToken: t
                })
                .then(async res => {
                    if (res.status === 200) {
                        // 1) put token to LocalStorage
                        await AsyncStorageService.setAccessToken(res.data.accessToken);

                        // 2) Change Authorization header
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + await AsyncStorageService.getAccessToken();
                        originalRequest.headers['Authorization'] = 'Bearer ' + await AsyncStorageService.getAccessToken();
                        
                        // 3) return originalRequest object with Axios.
                        return axios(originalRequest);
                    }
                })
        } else return Promise.reject(error)
    });


export default custom_axios;