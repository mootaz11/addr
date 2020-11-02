import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage'
/*const  getToken = async () => {
        
    let token = '';
    try {
      token = await AsyncStorage.getItem('token') || 'none';
      console.log(token);

    } catch (error) {
      console.log(error.message);
    }
    return token;
  }
  const t = getToken();*/
export default  axios.create({
    baseURL:   "http://localhost:3000",  //'https://addresti-back-end.herokuapp.com'
    headers:{
        'Authorization': localStorage.getItem("token"),
        'Access-Control-Allow-Origin':"*",
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',

    }
})