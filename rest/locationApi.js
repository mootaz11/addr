import axios from "../rest/customAxios";


export const addLocation =(location)=>{
    return new Promise((resolve,reject)=>{
        axios.post("/location/",location).then(res=>{
            resolve(res.data.createdLocation);
        }).catch(err=>{reject(err)})
    })
}


export const getUserLocation=(code)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/location/${code}`).then(res=>{
            if(res.status==200){
                resolve(res.data.location);
            }
        }).catch(err=>{reject(err)})
    })
}



export const getUserConnectedLocation = ()=>{
    return new Promise ((resolve ,reject)=>{
        axios.get(`/location/`).then(res=>{
            if(res.status===200){
            resolve(res.data.location);
            }
        })
        .catch(err=>{
            reject(err);
        })

    })
}

export const addTemporarlyLocation =(userId,location)=>{
    return new Promise((resolve,reject)=>{
        axios.post(`/location/temp-location/${userId}`,location)
        .then(res=>{
            if(res.status===200)

{           
     resolve(res.data.location)
}       
        
        })
        .catch(err=>{reject(err)})
    })
}


export const updateLocation =(location)=>{
    return new Promise((resolve,reject)=>{
        axios.patch("/location/",location).then(res=>{
            resolve(res.data.message);
        })
        .catch(err=>{reject(err)})
    })
}



