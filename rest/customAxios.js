import axios from 'axios';
import { AsyncStorage } from 'react-native';


 export default  axios.create({
    baseURL:'http://localhost:3000',
    headers:{
        'Authorization':async ()=> await AsyncStorage.getItem('token')

    }
})