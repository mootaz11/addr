import { TapGestureHandler } from "react-native-gesture-handler";
import axios from "../rest/customAxios";

export const getPartner =(partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/partner/${partnerId}`).then(res=>{
            if(res.status==200){
                resolve(res.data.partner);
            }
            else {
                resolve(res.data.message);
            }
        }).catch(err=>{
            reject(err);
        })
    })
}



export const addCategory=(partnerId,nameCategory)=>{
    return new Promise((resolve,reject)=>{
        axios.post(`/partner/${partnerId}/category`,{name:nameCategory})
        .then(res=>{
            if(res.status===200){
                resolve(res.data.category)
            }
        }).catch(err=>{
            reject(err.message);
        })
    })
}


export const addSubCategory=(partnerId,categoryId,nameSubCategory)=>{
    return new Promise((resolve,reject)=>{
        axios.post(`/partner/${partnerId}/category/${categoryId}`,{name:nameSubCategory})
        .then(res=>{
            if(res.status===200){
                resolve(res.data.subCategory);
            }
        }).catch(err=>{
            reject(err.message);
        })
    })
}


export const getDelivererDashboard = (partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/partner/deliverer/dashboard/${partnerId}`).then(res=>{
            if(res.status===200){
                resolve(res.data);
            }
            
        }).catch(err=>{
            reject(err);
        })
    })
}






export const getPartnerWithProducts = (partnerId)=> {
    return new Promise ((resolve,reject)=>{
        axios.get(`/partner/addproduct/${partnerId}`).then(res=>{
            if(res.status==200){
                resolve(res.data.partner)
            }
            else {
                resolve(res.data.message);
            }
        }).catch(err=>{reject(err)})
    })
}


export const getAllPartners = (page,limit,service)=>{
    return new Promise ((resolve,reject)=>{
        axios.get(`/partner/`,{
            params: {page: page,limit:limit,service:service}
        }).then(res=>{
            if(res.status==200){
                resolve(res.data.partners)
            }
            else {
                resolve(res.data.message);
            }
        }).catch(err=>{reject(err)})
    })
}

export const deleteManager = (partnerId,user)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/partner/manager/${partnerId}`,{user}).then(res=>{
            resolve(res.data.message);
        })
        .catch(err=>{
            reject(err)
        })
    })
}

export const  addPartnerLocalisation =(partnerId,localisation)=>{

    return new Promise((resolve,reject)=>{
        axios.post(`/partner/${partnerId}/localisation`,{localisation:localisation}).then(res=>{
            resolve(res.data.localisation);
        })
        .catch(err=>{
            reject(err);
        })
    })

}
export const deletePartnerLocation = (partnerId,localisation)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/partner/${partnerId}/delete-localisation`,{localisation:localisation}).then(res=>{
            if(res.status===200){
                resolve(res.data.message);
            }
            
        }).catch(err=>{reject(err)})
    })
}




export const addView =(partnerId)=>{   
    return new Promise((resolve,reject)=>{
        axios.post(`/partner/view/${partnerId}`,{}).then(res=>{
            resolve(res.data)
        })
        .catch(err=>{
            reject(err);
        })
    })
}
export const deleteDeliverer = (partnerId,deliverer)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/partner/deliverer/${partnerId}`,{deliverer}).then(res=>{
            resolve(res.data.message);
        })
        .catch(err=>{
            reject(err)
        })
    })
}
export const getPartnerDashboard = (partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/partner/dashboard/${partnerId}`).then(res=>{
            if(res.status==200){
                resolve(res.data);
            }
            else {
                resolve(res.data.message);
            }
        }).catch(err=>{
            reject(err);
        })
    })
}



export const getPartnersByServiceName = (serviceName)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/partner/getPartnersByServiceName/${serviceName}`).then(res=>{
            resolve(res.data.partners);
        })
        .catch(err=>{reject(err)})
    })
}



