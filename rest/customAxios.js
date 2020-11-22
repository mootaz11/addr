import axios from 'axios';
import AuthContext from '../navigation/AuthContext'
import AsyncStorage from '@react-native-community/async-storage';

// 192.168.1.7
const custom_axios =  axios.create({
    baseURL:   "http://localhost:3000"   //'https://addresti-back-end.herokuapp.com'   
})

custom_axios.interceptors.request.use(async config => {
  const token =    localStorage.getItem('token')  // //await AsyncStorage.getItem('token') 
  if (token) {
    config.headers.Authorization = token
  }
  return config
},
error => {
  return Promise.reject(error)
})

export default custom_axios ;