import axios from "../rest/customAxios";


export const signup = (user)=>{
    return new Promise((resolve,reject)=>{
        axios.post("/user/",user).then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err);
        })
    })
}