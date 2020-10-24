import axios from "../rest/customAxios";

export const getConnectedUser = ()=>{
    return new Promise((resolve,reject)=>{
        axios.get("/user/connected-user").then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err);
        })
    })
}

export const signup = (user)=>{
    return new Promise((resolve,reject)=>{
        axios.post("/user/",user).then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err);
        })
    })
}

export const login =(credentials)=>{
    return new Promise((resolve,reject)=>{
        axios.post("/user/login",credentials).then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err);
        })
    })
}


