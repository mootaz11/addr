import React, { useState,useEffect } from 'react'
import AuthContext from './AuthContext';
import io  from 'socket.io-client';
import {createConversation, getUserConversations,sendMessage,markAsreadConversation} from '../rest/conversationApi';
import {getLocation,addLocation,updateLocation,addTemporarlyLocation} from '../rest/locationApi';
import {getConnectedUser} from '../rest/userApi';
import {getUserActifOrders,getUserHistoryOrders,getUserActifDeliveries} from '../rest/ordersApi';


import AsyncStorage from '@react-native-community/async-storage'
  const getToken = async () => {
        let token = '';
        try {
          token = await AsyncStorage.getItem('token') || 'none';
        } catch (error) {
          console.log(error.message);
        }
        return token;
      }

export default  function AppContext(props){
    const [socket, setSocket] = useState(io("http://192.168.1.7:3000"));
    const [location,setLocation]=useState(null);
    const [user, setUser] = useState(null)
    const [historyOrders,setHistoryOrders] =useState([]);
    const [actifOrders,setActifOrders]=useState([]);
    const [conversations,setConversations]=useState(null);
    const [notSeenConversations,setNotSeenConversations]=useState([]);
    const [seenConversations,setSeenConversations]=useState([]);
    const [actifDeliveries,setActifDeliveries]=useState([]);
    const [historyDeliveries,setHistoryDeliveries]=useState([])
    const [darkMode,setDarkMode]=useState(false);
    const token_init = localStorage.getItem("token") ; //getToken();   
    const [token,setToken]=useState(token_init)
    const [isloading,setIsloading]=useState(true);

    useEffect(() => {
        if (token) {
            getConnectedUser().then(res=>{  
                setDarkMode(false);
                setUser(res.data.connectedUser);
                if(res.data.connectedUser.locationState){
                    console.log(res.data.connectedUser.locationCode);
                    getLocation(res.data.connectedUser.locationCode).then(location=>{
                        setLocation(location);
                    }).catch(err=>{alert("error occured while setting Location")})
                }
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
      getUserConversations().then(_conversations=>{
                _conversations.map(conversation=>{
                            let notSeenSum=0;
                            let conv = {...conversation};
                            conv.messages.map(message=>{
                                if(message.sender._id != user._id && message.seen.length==0){
                                    notSeenSum+=1;}})
                                 conv.notSeen=notSeenSum;
                                 conv.last=conv.messages[conv.messages.length-1].date;
                           })
                 let _convs = [..._conversations];
                 const _convSorted = _convs.sort((a,b)=>a.last-b.last);       
                setConversations(_convSorted);
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
                const _conversations = [...conversations];
                    const conv_index =_conversations.findIndex(conv => {return conv._id == message.conversation});
                    if(conv_index >=0){
                         let _convReal = {..._conversations[conv_index]};
                         let notSeenMessages = [..._convReal.messages];
                         notSeenMessages.push(message);
                          _convReal.messages=notSeenMessages
                          _conversations.splice(conv_index,1);
                          _convReal.notSeen+=1;
                         _conversations.push(_convReal);
                     setConversations(_conversations)
                    }
                })
            socket.on('create-conversation',(conversation)=>{
                    let notSeenSum=0;
                    conversation.messages.map(message=>{
                        if(message.sender._id != user._id && message.seen.length==0){
                        notSeenSum+=1;}})
                        conversation.notSeen=notSeenSum;
                       setConversations([conversation, ...conversations]);
            })
             }
       
    },[conversations])  
    
    const handleConversation =(conversation)=>{
        setConversations(conversations=>[...conversations,conversation]);
    }
    const markAsReadConversation = (conv_id)=>{
            markAsreadConversation(conv_id).then(_conv=>{
                let _conversations = [...conversations];
                const index = _conversations.findIndex(conversation=>{return conversation._id ==_conv._id})                    
                if(index>=0){
                    _conversation_found = {..._conversations[index]};
                    _conversation_found.notSeen=0;
                    _conversations.splice(index,1);
                    let _newConversations = [conversation_found,..._conversations];
                    setConversations(_newConversations)} 
            }).catch(err=>{console.log(err)});          
        }
    const startNewConversation = (data)=>{
        return new Promise((resolve,reject)=>{
            createConversation(data).then(data=>{
                resolve(data.conversation);
            }).catch(err=>{reject(err)})
        }).catch(err=>{reject(err)})
    }
    const openConversationHandler = (id,Users) =>{
        console.log(id);
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
             sendMessage(message).then(message=>{
                let _conversations=[...conversations];
                const index = _conversations.findIndex(conversation=>{return conversation._id==message.conversation});
                if(index>=0){
                    let _conv = {..._conversations[index]};
                    let _messages = [..._conv.messages];
                    _messages.push(message);
                    _conv.messages=_messages;
                    _conversations.splice(index,1)
                    let _newConversations = [_conv,..._conversations]
                    setConversations(_newConversations);
                }

         }).catch(err=>{alert(err)})
        }


    const updateUser=(user)=>{
            setUser(user)
        }


    const modifyDarkModeHandler =()=>{
        console.log("hhhhh");
        setDarkMode(darkMode=>!darkMode);
        
    }
    
    const LoginHandler = async ({ user, token }) => {
         //await AsyncStorage.setItem('token', token);
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

    const updateUserLocation =(_location)=>{
        console.log("hello")
        if(!location){
            addLocation(_location).then(loc=>{
                console.log(loc);
                setLocation(loc.location);
            }).catch(err=>{console.log(err)})
        }
        else {
            updateLocation(_location['location']).then(res=>{
                setLocation(_location['location']);
                alert(res)
            })
            .catch(err=>{alert(err)})
        }
    }




return(
<AuthContext.Provider value={{
    darkMode:darkMode,
    user:user,
    socket:socket,
    conversations:conversations,
    notSeenConversations:notSeenConversations,
    location:location,
    LoginHandler:LoginHandler,
    openConversationHandler:openConversationHandler,
    logoutHandler:logoutHandler,
    modifyDarkModeHandler:modifyDarkModeHandler,
    isloading:isloading,
    actifOrders:actifOrders,
    historyOrders:historyOrders,
    actifDeliveries:actifDeliveries,
    historyDeliveries:historyDeliveries,
    startNewConversation:startNewConversation,
    send_message:send_message,
    seenConversations:seenConversations,
    handleConversation:handleConversation,
    markAsReadConversation:markAsReadConversation,
    updateUser:updateUser,
    updateUserLocation:updateUserLocation

}
}>

{props.children}
</AuthContext.Provider>
)


}