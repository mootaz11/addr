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
        axios.get(`/parter/addproduct/${partnerId}`).then(res=>{
            if(res.status==200){
                resolve(res.data)
            }
            else {
                resolve(res.data.message);
            }
        }).catch(err=>{reject(err)})
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


export  const addVariants = ()=>{
    
}
