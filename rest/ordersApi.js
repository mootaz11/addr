import axios from "../rest/customAxios";


export const createOrder =(order )=>{
    return new Promise(async (resolve,reject)=>{
       try{
        const  orderCreated=  await axios.post("/order/",order)
        resolve(orderCreated);
       }
       catch(err){
           reject(err)
       }
    })
}

export const getClientPreOrders=()=>{
    return new Promise((resolve,reject)=>{
        axios.get("/order/client/pre-orders").then(res=>{
            if(res.status===200){
                resolve(res.data.orders)
            }

        }).catch(err=>{
            reject(err);
        })
    })
}

export const getClientOrders = ()=>{
    return new Promise((resolve,reject)=>{
        axios.get("/order/client").then(res=>{
            resolve(res.data.orders);
        })
        .catch(err=>{reject(err)})
    })
}

export const  getPartnerOrders = (partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/order/partner/${partnerId}`).then(res=>{
            resolve(res.data.orders);
        })
        .catch(err=>{reject(err)})
    })
}


//add partner id ; 
export const   getDelivererOrders = ()=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/order/deliverer`).then(res=>{
            resolve(res.data.orders);
        })
        .catch(err=>{reject(err)})
    })
}

export const   markOrderAsPrepared = (orderId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/order/mark-prepared/${orderId}`).then(res=>{
            resolve(res.data.message);
        })
        .catch(err=>{reject(err)})
    })
}
export const   markOrderAsTaked = (orderId)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/order/mark-taked/${orderId}`,{}).then(res=>{
            resolve(res.data.message);
        })
        .catch(err=>{reject(err)})
    })
}


export const   markOrderAsReceived = (orderId)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/order/mark-received/${orderId}`,{}).then(res=>{
            resolve(res.data.message);
        })
        .catch(err=>{reject(err)})
    })
}



