import { useField } from "formik";
import axios from "../rest/customAxios";

export const getDeliveryOptions = (partnerId,body)=>{
return new Promise((resolve,reject)=>{
    axios.post(`/order/delivery-options/${partnerId}`,body).then(res=>{
            if(res.status===200){
            resolve(res.data);
        }
        else  {
            resolve(res.data.message);
        }
    }).catch(err=>{reject(err)})
})
}


export const duringCollectDelivery = (idcollecter,partner)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/delivery-order/duringCollectDelivery/${partner}/${idcollecter}`).then(res=>{
            resolve(res.data.duringCollectDeliveries);


           
        })
        .catch(err=>{reject(err)})
    })
}
export const getTobepickedUpOrders= (idcollecter,partner)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/delivery-order/tobepickedup/${partner}/${idcollecter}`).then(res=>{
            resolve(res.data.todayTobepickedupOrders);


           
        })
        .catch(err=>{reject(err)})
    })
}



export const getduringClientDeliveryorders= (iddeliverer,partner)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/delivery-order/duringclientdelivery/${partner}/${iddeliverer}`).then(res=>{
            resolve(res.data.duringClientdeliveries);
        })
        .catch(err=>{reject(err)})
    })
}

export const getArrivedOrders= (idmanager,partner)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/delivery-order/arrived/${partner}/${idmanager}`).then(res=>{
            resolve(res.data.filteredArrivedOrders);
        })
        .catch(err=>{reject(err)})
    })
}







export const getTobeDeliveredOrders= (iddeliverer,partner)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/delivery-order/tobedelivered/${partner}/${iddeliverer}`).then(res=>{
                resolve(res.data.todayTobedeliveredupOrders);

                   })
        .catch(err=>{reject(err)})
    })
}

export const getNotArrivedOrders= (idmanager,partner)=>{
    return new Promise((resolve,reject)=>{

        axios.get(`/delivery-order/notarrived/${partner}/${idmanager}`).then(res=>{
                resolve(res.data.notArrivedOrders);
                 })
        .catch(err=>{reject(err)})
    })
}






export const markOrderAsDuringCollectDelivery =(partnerId,orderId,targetPosition,delivererPosition)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/delivery-order/${partnerId}/status/during-collect-delivery/${orderId}`,
        {targetPosition:targetPosition,delivererPosition:delivererPosition}).then(res=>{
                if(res.status===200){
                    resolve(res.data.message);
                }
        })
    })
}

export const markOrderArrivedInDeposit =(partnerId,orderId,targetPosition,delivererPosition)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/delivery-order/${partnerId}/status/arrived-deposit/${orderId}`).then(res=>{
                if(res.status===200){
                    resolve(res.data.message);
                }
        })

        .catch(err=>{
            reject(err);
        })
    })
}

export const markOrderAsToBeDelivered=(orderId,partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/delivery-order/${partnerId}/status/tobe-delivered/${orderId}`).then(res=>{

                if(res.status===200){
                    resolve(res.data.message);
                }
        }).catch(err=>{
            reject(err)
        })
    })
}

export const markOrderAsDuringClientDelivery=(partnerId,orderId,delivererPosition,targetPosition)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/delivery-order/${partnerId}/status/arrived-deposit/${orderId}`,{delivererPosition:delivererPosition,targetPosition:targetPosition}).then(res=>{
                if(res.status===200){
                    resolve(res.data.message);
                }
        })
    }).catch(err=>{
        reject(err);
    })
}




export const getAllDeliveryOrders = (_idPartner)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/delivery-order/partner/${_idPartner}`).then(res=>{
            if(res.status===200){
                resolve(res.data.orders);
            }
        })
        .catch(err=>{
            reject(err);
        })
    })
}
export const getDeliveryOrder =(id)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/delivery-order/${id}`).then(res=>{
            if(res.status==200){
                resolve(res.data.order);
            }
        })
        .catch(err=>{reject(err)})
    })
}



export const placeOrder = (_id,body)=>{
return new Promise((resolve,reject)=>{
    axios.patch(`/order/place-order/${_id}`,body).then(res=>{
        if(res.status===200){
            resolve(res.data.message);
        }
    })
    .catch(err=>{
        reject(err)})
})
}





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

export const updateOrder =(orderId,body)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/order/${orderId}`,body).then(res=>{
            if(res.status===200){
                resolve(res.data.message)                
            }
        }).catch(err=>{
            reject(err);
        })
    })
}

export const deleteOrder=(orderId)=>{
    return new Promise ((resolve,reject)=>{
        axios.delete(`/order/${orderId}`,{}).then(res=>{
            if(res.status===200){
                resolve(res.data.message)
            }
        }).catch(err=>{reject(errr)})
    })
}




export const getOrder =(orderId)=> {
    return new Promise((resolve,reject)=>{
        axios.get(`/order/${orderId}`).then(res=>{
            if(res.status===200){
                resolve(res.data.order);
            }
        }).catch(err=>{
            reject(err);
        })
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

export const getClientOrders =  ()=>{
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
export const   getDelivererOrders = (partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/order/deliverer/${partnerId}`).then(res=>{
            resolve(res.data.orders);
        })
        .catch(err=>{reject(err)})
    })
}

export const   markOrderAsPrepared = (orderId,partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/order/mark-prepared/${partnerId}/${orderId}`).then(res=>{
            resolve(res.data.message);
        })
        .catch(err=>{reject(err)})
    })
}

export const   markOrderAsTaked = (orderId,partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/order/mark-taked/${partnerId}/${orderId}`,{}).then(res=>{
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


export const   markOrderAspayed = (orderId,partnerId)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/order/mark-payed/${partnerId}/${orderId}`,{}).then(res=>{
            resolve(res.data.message);
        })
        .catch(err=>{reject(err)})
    })
}



