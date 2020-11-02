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
export const getUserHistoryDeliveries = (userId)=>{
    return new Promise((resolve ,reject)=>{
        axios.get(`/order/deliverer/history/${userId}`).then(res=>{
            resolve(res);
        }).catch(err=>{reject(err)})
    })
}
export const   getUserActifDeliveries =(userId)=>{
    return new Promise((resolve ,reject)=>{
        axios.get(`/order/deliverer/actif/${userId}`).then(res=>{
            resolve(res);
        }).catch(err=>{reject(err)})
    })
}
export const getUserActifOrders =(userId)=>{
    return new Promise((resolve ,reject)=>{
        axios.get(`/order/client/actif/${userId}`).then(res=>{
            resolve(res);
        }).catch(err=>{reject(err)})
    })
}

export const getUserHistoryOrders = (userId)=>{
    return new Promise((resolve ,reject)=>{
        axios.get(`/order/client/history/${userId}`).then(res=>{
            resolve(res);
        }).catch(err=>{reject(err)})
    })
}

export const close_order = (orderId)=>{
    return new Promise((resolve ,reject)=>{
        axios.patch(`/order/state/${orderId}`).then(res=>{
            resolve(res);
        }).catch(err=>{reject(err)})
    })
}

export const deleteOrder = (orderId)=>{
    return new Promise((resolve ,reject)=>{
        axios.delete(`/order/${orderId}`).then(res=>{
            resolve(res);
        }).catch(err=>{reject(err)})
    })
}