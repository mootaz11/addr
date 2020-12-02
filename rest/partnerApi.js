import axios from "../rest/customAxios";

export const getPartner =(partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/partner/${partnerId}`).then(res=>{
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


export const getProducts = (partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`partner/${partnerId}/products`).then(res=>{
            resolve(res.data.products);
        })
        .catch(err=>{reject(err)})
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
        axios.post(`/partner/${partnerId}/localisation`,{localisation}).then(res=>{
            resolve(res.data.localisation);
        })
        .catch(err=>{
            reject(err);
        })
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

export const getPartnerProducts =(partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/partner/${partnerId}`).then(res=>{
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


export const addProduct = (productData,partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.post(`/partner/${partnerId}/product`,productData).then(res=>{
            resolve(res.data.message);
        }).catch(err=>{
            reject(err);
        })
    })
}

export const getProduct = (productId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/partner/product/${productId}`).then(res=>{
                if(res.status===200){
                    resolve(res.data.product);
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

export const getProductsByCategory = (idcategory,gender)=>{
    return new Promise((resolve,reject)=>{
        axios.post(`/partner/productsByCategory/${idcategory}`,{gender}).then(res=>{
            resolve(res.data.filtered_products);
        })
        .catch(err=>{reject(err)})
    })
}