import axios from './customAxios';


export const getProductsByCategory = (idcategory,gender)=>{
    return new Promise((resolve,reject)=>{
        axios.post(`/product/categoryMobile/${idcategory}`,{gender}).then(res=>{
            resolve(res.data.category.products);
        })
        .catch(err=>{reject(err)})
    })
}

export const addProduct=(partnerId,fd)=>{
    return new Promise((resolve,reject)=>{
        axios.post(`/product/${partnerId}`,fd).then(res=>{
                if(res.status===200){
                    resolve(res.data.message);
                }
                else {
                    resolve("operation not effected")
                }
        })
        .catch(err=>{
            reject(err);
        })
    })
}
export const getProduct = (productId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/product/${productId}`).then(res=>{
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


export const rateProduct = (productId,body)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/product/rate/${productId}`).then(res=>{
            if(res.status===200){
                resolve(res.data.message);
            }
            else {
                resolve("operation not effected");
            }
        }).catch(err=>{
            reject(err)
        })
    })
}




export const getPartnerProducts =(partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/product/partner/${partnerId}`).then(res=>{
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


