import axios from '../rest/customAxios';


export const getCities = ()=>{
    return new Promise((resolve,reject)=>{
        axios.get("/geo-location/city").then(res=>{
            resolve(res.data);
    }).catch(err=>{reject(err)});
})
} 


export const getRegion =(id)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/geo-location/region/${id}`).then(res=>{resolve(res.data)})
        .catch(err=>{reject(err)})
    })
}