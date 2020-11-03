import axios from '../rest/customAxios';

export const leftConversation = (conversation)=>{
    return new Promise((resolve,reject)=>{
        axios.patch("/chat/left",conversation).then(res=>{
            resolve(res.data.conversation);
        })
        .catch(err=>{
            reject(err)
        })
    })
}

export const sendMessage = (message,token)=>{
    return new Promise((resolve,reject)=>{
        axios.post("/chat/message",message).then(res=>{
            resolve(res.data.message);
        })
        .catch(err=>{
            reject(err.message);
        })
    })
}

export const getConversation = (convId)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/chat/${convId}`).then(res=>{
            resolve(res.data);
        }).catch(err=>{reject(err)})
    })
}




export const createConversation =(conversation)=>{
    return new Promise((resolve ,reject)=>{
        axios.post("/chat/",conversation).then(res=>{
            resolve(res.data);
        }).catch(err=>{reject(err)})
    })
}


export  const getUserConversations=()=>{
    return new Promise((resolve,reject)=>{
        axios.get(`/chat/user/`).then(res=>{
            resolve(res.data.conversations);
        }).catch(err=>{reject(err)})
    })
}


export const markAsreadConversation=(convId)=>{
    return new Promise((resolve,reject)=>{
        axios.patch(`/chat/read/${convId}`,{}).then(res=>{
            resolve(res.data.conversation);
        })
        .catch(err=>{reject(err)});
    })
}