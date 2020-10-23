import axios from 'axios';


export default axios.create({
    baseURL:'https://addresti-back-end.herokuapp.com/',
    headers:{
        'Authorization':localStorage.getItem('token')
    }
})