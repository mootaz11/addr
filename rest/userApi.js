import axios from "../rest/customAxios";



export const updateLocationState =()=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/user/location-state`,{locationState:true}).then(res=>{
            if(res.status===200){
            resolve(res.data.message);
            }
        })
        .catch(err=>{reject(err)})
    })

}


export const getUserNotifications =(total,limit)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/user/notifications`,{params: {total: total,limit:limit}
    }).then(res=>{
            if(res.status===200){
                resolve(res.data.notifications);
            }

        }).catch(err=>{reject(err)})
    })
}








export const setNotifToken =(id,token)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/user/${id}/update-notificationtoken`,{notificationToken:token}).then(res=>{
            if(res.status===200){
                resolve(res.data.user);
            }

        }).catch(err=>{reject(err)})
    })
}

export const updateInfo = (info)=>{
    return new Promise((resolve,reject)=>{
        axios.patch("/user/phone",info).then(res=>{
            resolve(res);
        })
        .catch(err=>{reject(err)})
    })
}

export const userLogout = (token)=>{
    return new Promise((resolve,reject)=>{
        axios.post("/user/logout",token).then(res=>{
            if(res.status===200){
            resolve(res.data.message);
            }
        })
        .catch(err=>{reject(err)})
    })
}


export const sendContact =(data)=>{
    return new Promise((resolve,reject)=>{
        axios.post("/user/contact",{data}).then(res=>{
            if(res.status===200){
                resolve(res.data.message);
            }
        })
        .catch(err=>{
            reject(err)
        })
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