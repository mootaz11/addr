import React, { useState,useEffect } from 'react'
import AuthContext from './AuthContext';
import io  from 'socket.io-client';
import AsyncStorageService from '../rest/AsyncStorageService'
import {createConversation, getUserConversations,sendMessage,markAsreadConversation} from '../rest/conversationApi';
import {getLocation,updateLocation,addTemporarlyLocation} from '../rest/locationApi';
import {getConnectedUser,updateLocationState} from '../rest/userApi';
import Loading from '../screens/Loading';

export default  function AppContext(props){
    const [socket, setSocket] = useState(io("http://localhost:3000"));
    const [location,setLocation]=useState(null);
    const [user, setUser] = useState(null)
    const [conversations,setConversations]=useState(null);
    const [darkMode,setDarkMode]=useState(false);
    const [locationState,setLocationState]=useState(false);
    const [isloading,setIsloading]=useState(true);
    const [partner,setPartner]=useState(null)
    const [bag,setBag]=useState(bag);
    useEffect(() => {
        if (AsyncStorageService.getAccessToken()) {
            getConnectedUser().then(res=>{  
                    getLocation().then(location=>{
                        if(!res.data.connectedUser.isPartner){setBag(res.data.orders);}
                        setLocation(location);
                        setDarkMode(false);
                        setUser(res.data.connectedUser);
                    }).catch(err=>{alert("error occured while setting Location")})
                                    
                socket.emit('connectuser',token);
            }).catch(err=>{
                setIsloading(false);
            })
        } 

        else {
            setIsloading(false);
        }
    },[])

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

                setIsloading(false);
                }).catch(err=>{console.log(err)})
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
                         let notSeenSum = 0
                         notSeenMessages.map(message=>{
                            if(message.sender._id != user._id && message.seen.length==0){
                                notSeenSum+=1;}})          
                          _convReal.messages=notSeenMessages
                          _conversations.splice(conv_index,1);
                          _convReal.notSeen=notSeenSum;
                          console.log(_convReal);
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
                        console.log(conversation);
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
                    let _conversation_found = {..._conversations[index]};
                    _conversation_found.notSeen=0;
                    _conversations.splice(index,1);
                    let _newConversations = [_conversation_found,..._conversations];
                    console.log("neww",_newConversations);
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

    const openConversationHandler = (id,Users,type,partner) =>{
        if(conversations)
            if(type!=null && type=="personal"){
            let conversation_found=null;
            conversations.map(conversation=>{
                if (conversation.users.findIndex(user=>{return user==Users.other._id}) >=0
                && conversation.users.findIndex(user=>{return user==Users.user._id})>=0)
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
        if(type=="group"&&type!=null)
        {
            let conversation_found=null;
            conversations.map(conversation=>{
                let count =0 ;
                Users.users_id.map(user=>{
                    if(conversation.users.findIndex(u=>{return u._id==user})>=0){
                        count+=1
                    }    
                })
                if(count==Users.users_id.length)
                {   
                    conversation_found=conversations[conversations.findIndex(conv=>{return conv._id==conversation._id})];

                }
            })
            
            if(conversation_found){
               return conversation_found;
        }
          
        
        else {
            const new_conversation = {
                image:partner.profileImage,
                type:"group",
                messages:[],
                partner:partner,
                title:partner.partnerName,
                users:Users.users_id,
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




    const modifyDarkModeHandler =()=>{
        setDarkMode(darkMode=>!darkMode);
        
    }
    
    const LoginHandler = async ({ user, token }) => {
        AsyncStorageService.setToken(token);
        setUser(user);
    }

    const logoutHandler =  () => {
        AsyncStorageService.clearToken();
    
    }
    const _createOrder =( body ) =>{
        console.log(body);
    }




    const updateUserLocation =(_location,isHome)=>{
        updateLocation({location:_location}).then(res=>{
                setLocation({...location,location:_location});
                if(isHome){
                    updateLocationState(user._id).then(message=>{
                        setUser({...user,locationState:true});    
                    }).catch(err=>alert("update location state failed"))
                    }
            }).catch(err=>{alert("update location failed")})}
                


    const handleTemporaryLocation = (loc,user_id)=>{  
        addTemporarlyLocation(user_id,loc).then(_location=>{
            setLocation({...location,temperarlyLocation:_location["temperarlyLocation"]})
        })
    }
    const deleteTemprorayLocation = ()=>{
        addTemporarlyLocation(user._id,{location:{latitude:null,longitude:null}}).then(_location=>{
            setLocation({...location,temperarlyLocation:_location["temperarlyLocation"]})
        }).catch(err=>{alert("update temperarly location failed")})
    }

return(
<AuthContext.Provider value={{
    darkMode:darkMode,
    user:user,
    partner:partner,
    socket:socket,
    conversations:conversations,
    location:location,
    bag:bag,
    isloading:isloading,
    setUser:setUser,
    setLocation:setLocation,
    setPartner:setPartner,
    LoginHandler:LoginHandler,
    openConversationHandler:openConversationHandler,
    logoutHandler:logoutHandler,
    modifyDarkModeHandler:modifyDarkModeHandler,
    startNewConversation:startNewConversation,
    send_message:send_message,
    handleConversation:handleConversation,
    markAsReadConversation:markAsReadConversation,
    updateUserLocation:updateUserLocation,
    handleTemporaryLocation:handleTemporaryLocation,
    deleteTemprorayLocation:deleteTemprorayLocation,
    _createOrder:_createOrder
}
}>

{isloading ? <Loading/> : props.children}

</AuthContext.Provider>
)


}