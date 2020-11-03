import axios from 'axios';
import AuthContext from '../navigation/AuthContext'
import AsyncStorage from '@react-native-community/async-storage';


const custom_axios =  axios.create({
    baseURL:   'https://addresti-back-end.herokuapp.com'   //"http://192.168.1.7:3000" 
})

custom_axios.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
},
error => {
  return Promise.reject(error)
})

export default custom_axios ;