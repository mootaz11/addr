import React, { useState,useEffect } from 'react'
import AuthContext from './AuthContext';
import io  from 'socket.io-client';
import {createConversation, getUserConversations,sendMessage,getConversation} from '../rest/conversationApi';

import {getConnectedUser} from '../rest/userApi';
import {getUserActifOrders,getUserHistoryOrders,getUserActifDeliveries} from '../rest/ordersApi';
import { not } from 'react-native-reanimated';
//import AsyncStorage from '@react-native-community/async-storage'
/*  const getToken = async () => {
        let token = '';
        try {
          token = await AsyncStorage.getItem('token') || 'none';
        } catch (error) {
          console.log(error.message);
        }
        return token;
      }*/




export default  function AppContext(props){
    const [socket, setSocket] = useState(io("http://127.0.0.1:3000"));
    const [user, setUser] = useState(null)
    const [historyOrders,setHistoryOrders] =useState([]);
    const [actifOrders,setActifOrders]=useState([]);
    const [conversations,setConversations]=useState(null);
    const [notSeenConversations,setNotSeenConversations]=useState([]);
    const [seenConversations,setSeenConversations]=useState([]);
    const [actifDeliveries,setActifDeliveries]=useState([]);
    const [historyDeliveries,setHistoryDeliveries]=useState([])
    const [darkMode,setDarkMode]=useState(false);
    const token_init =localStorage.getItem("token") ; //getToken(); 
    const [token,setToken]=useState(token_init)
    const [isloading,setIsloading]=useState(true);

    useEffect(() => {
        if (token) {

            getConnectedUser().then(res=>{
                setUser(res.data.connectedUser);
                socket.emit('connectuser',token);
              
                setIsloading(false);  
            }).catch(err=>{
                console.log(err)
            })
        } 

        else {
            setIsloading(false);}
    },[token])

useEffect(()=>{
    if(user){
        console.log("use effectxxxxx");

      getUserConversations().then(_conversations=>{
                        let _notSeen =[];
                        let _Seen =[];
                        _conversations.map(conversation=>{
                            let notSeenSum=0;
                            let conv = {...conversation};
                            conv.messages.map(message=>{
                                if(message.sender._id != user._id && message.seen.length==0){
                                    notSeenSum+=1;}})
                                    if(notSeenSum>0)
                                    {conv.notSeen=notSeenSum;  
                                    _notSeen.push(conv);
                                    }
                                    else {
                                        _Seen.push(conv);
                                    }
                        })
                        setSeenConversations([..._Seen]);
                        setNotSeenConversations([..._notSeen]);
                        setConversations(_conversations);

                }).catch(err=>{console.log(err)})
            }
            },[user])
    
    useEffect(()=>{
        if(user){
            console.log("use effect 1");

            getUserActifOrders(user._id).then(res=>{
                setActifOrders(res.data.orders)
            }).catch(err=>{console.log(err)})
        
            getUserHistoryOrders(user._id).then(res=>{
                setHistoryOrders(res.data.orders)
            }).catch(err=>{console.log(err.message)})
        
        
            getUserActifDeliveries(user._id).then(res=>{
                setActifDeliveries(res.data.orders)
            }).catch(err=>{console.log(err)})
        
            getUserHistoryOrders(user._id).then(res=>{
                setHistoryDeliveries(res.data.orders)
            }).catch(err=>{console.log(err.message)})

        }
    },[user])


//markasread-conversation


    useEffect(()=>{
        socket.off('send-message');
        socket.off('create-conversation');
        
        if(conversations ){

            socket.on('send-message',(message)=>{
                socket.off('send-message')
                const _conversations = [...conversations];
                    const _notSeenConversations = [...notSeenConversations];
                    
                    const conv_index =_conversations.findIndex(conv => {return conv._id == message.conversation});
                    const not_seenIndex =_notSeenConversations.findIndex(conv => {return conv._id == message.conversation});
                    
                     if(conv_index >=0 && not_seenIndex>=0){    
                         let _convReal = {..._conversations[conv_index]};
                          let _convNotSeen = {..._notSeenConversations[not_seenIndex]};
                          let notSeenMessages = [..._convNotSeen.messages];
                          notSeenMessages.push(message);
                    
                          _convReal.messages=notSeenMessages
                          _convNotSeen.messages=notSeenMessages
                    
                          _conversations.splice(conv_index,1);
                          _notSeenConversations.splice(not_seenIndex,1);
                          _convNotSeen.notSeen+=1;
                         _notSeenConversations.push(_convNotSeen);
                         _conversations.push(_convReal);

                     setNotSeenConversations(_notSeenConversations);
                     setConversations(_conversations)
                    }
                })
            socket.on('create-conversation',(conversation)=>{
                    const _notSeen = [...notSeenConversations]; 
                    let notSeenSum=0;
                    let c ={...conversation};
                    conversation.messages.map(message=>{
                        if(message.sender._id != user._id && message.seen.length==0){
                        notSeenSum+=1;}})
                        if(notSeenSum>0)
                        {
                            conversation.notSeen=notSeenSum;
                        _notSeen.push(conversation);
                        setNotSeenConversations(_notSeen);
                       }
                       else {
                            setSeenConversations([c,...seenConversations]);
                    }
                    setConversations([c, ...conversations]);
                })
             }
       
    },[conversations,notSeenConversations,seenConversations])  
    

    const handleConversation =(conversation)=>{
        setConversations(conversations=>[...conversations,conversation]);
        setSeenConversations(seenConversations=>[...seenConversations,conversation]);    
    }


    const markAsReadConversation = (conv_id)=>{
        if(conversations.findIndex(conversation=>{return conversation._id==conv_id})>=0){

        
            let _conv = {...conversations.findIndex(conversation=>{return conversation._id==conv_id})};
            
            let _notSeenConversations = [...notSeenConversations];
            let _SeenConversations = [...seenConversations];
            let _conversations = [...conversations];
            console.log(_conv.messages);

            _notSeenConversations.filter(conversation => {return conversation._id != _conv._id});
            _conversations.filter(conversation => {return conversation._id != _conv._id});
            _SeenConversations.push(_conv);


            console.log(" not seen",_notSeenConversations)
            console.log("  seen",_SeenConversations)
            console.log("all",_conversations)
        }
    }


    const startNewConversation = (data)=>{
        return new Promise((resolve,reject)=>{
            createConversation(data).then(data=>{
                resolve(data.conversation);
            }).catch(err=>{reject(err)})
        }).catch(err=>{reject(err)})
    }


    const openConversationHandler = (id,Users) =>{
    if(conversations)
        if(!Users.other.isPartner){
         
            let conversation_found=null;
            
            conversations.map(conversation=>{
                if (conversation.users.findIndex(user=>{ return user._id==Users.other._id}) >=0
                && conversation.users.findIndex(user=>{return user._id==Users.user._id})>=0)
                {   
                    conversation_found=conversations[conversations.findIndex(conv=>{return conv==conversation})];
                }
            })
          if(conversation_found){
              conversation_found.other = Users.other.firstName+" "+Users.other.lastName;

            return conversation_found;
          }
          else {
              const new_conversation = {
                image:require("../assets/julia.jpg"),
                type:"personal",
                messages:[],
                other:Users.other.firstName+" "+Users.other.lastName,
                users:[Users.user._id,Users.other._id],
            }
            return new_conversation;
        }
        }        
        if(id){
            const convIndex = conversations.findIndex(conversation=>{return conversation._id == id});
           if(convIndex>=0){
            const conversation_found = conversations[convIndex];
            return conversation_found;               
           } 
           else  {
               return 'conversation not found';
           }
       
        }
    }

    
    const send_message = (message)=>{
         return new Promise((resolve,reject)=>{
             sendMessage(message).then(message=>{
                 console.log(message);
                resolve(message);
            }).catch(err=>reject(err))
         })
        }









    const modifyDarkMode =()=>{
        setDarkMode(darkMode=>!darkMode);
    }
    
    const LoginHandler = async ({ user, token }) => {
     // await AsyncStorage.setItem('token', token);
        localStorage.setItem("token",token);
        setToken(token);
        setUser(user);
    }

    const logoutHandler =  async () => {
        localStorage.removeItem("token");
        //await AsyncStorage.removeItem('token');
        setToken(null);

        setUser(null);
    }

return(
<AuthContext.Provider value={{
    darkMode:darkMode,
    user:user,
    socket:socket,
    conversations:conversations,
    notSeenConversations:notSeenConversations,
    LoginHandler:LoginHandler,
    openConversationHandler:openConversationHandler,
    logoutHandler:logoutHandler,
    setDarkMode:modifyDarkMode,
    isloading:isloading,
    actifOrders:actifOrders,
    historyOrders:historyOrders,
    actifDeliveries:actifDeliveries,
    historyDeliveries:historyDeliveries,
    startNewConversation:startNewConversation,
    send_message:send_message,
    seenConversations:seenConversations,
    handleConversation:handleConversation,
    markAsReadConversation:markAsReadConversation

}
}>

{props.children}
</AuthContext.Provider>
)


}