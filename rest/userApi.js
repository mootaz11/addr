import axios from "../rest/customAxios";



export const updateLocationState =(userId)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/user/location-state/${userId}`,info).then(res=>{
            resolve(res);
        })
        .catch(err=>{reject(err)})
    })

}
export const updateInfo = (info)=>{
    return new Promise((resolve,reject)=>{
        axios.patch("/user/",info).then(res=>{
            console.log(res);
            resolve(res);
        })
        .catch(err=>{reject(err)})
    })
}

export const updatePassword =(data)=>{
    return new Promise((resolve,reject)=>{
        axios.patch("/user/password",data).then(res=>{
            resolve(res);
        }).catch(err=>{reject(err)})
    })
}


export const updateImage = (fd)=>{
    return new Promise((resolve,reject)=>{
        axios.patch("/user/profile-image",fd).then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err);
        })
    })
}


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
            console.log(err)
            reject(err);
        })
    })
}


export const firstLogin = (userId)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/user/firstlogin/${userId}`).then(res=>{
            resolve(res);
        }).catch(err=>{reject(err)})
    })
}