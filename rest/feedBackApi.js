import custom_axios from "./customAxios"
import axios from "./customAxios"



export const createFeedback = (partnerId,body)=>{
    return new Promise((resolve,reject)=>{
        axios.post(`/feedback/${partnerId}`,body).then(res=>{
            if(res.status===200){
                resolve(res.data.message);
            }
            
        }).catch(err=>{reject(err)})
    })
}






