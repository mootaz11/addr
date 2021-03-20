import React, { useState, useEffect } from 'react'
import AuthContext from './AuthContext';
import io from 'socket.io-client';
import AsyncStorageService from '../rest/AsyncStorageService'
import { createConversation, getUserConversations, sendMessage, markAsreadConversationApi } from '../rest/conversationApi';
import { getLocation, updateLocation, addTemporarlyLocation } from '../rest/locationApi';
import { getConnectedUser, updateLocationState, setNotifToken, userLogout } from '../rest/userApi';
import Loading from '../screens/Loading';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import Constants from 'expo-constants';

export default function AppContext(props) {

    const [socket, setSocket] = useState(io('http://192.168.1.11:5000'));
    const [location, setLocation] = useState(null);
    const [user, setUser] = useState(null)
    const [deliveryData, setDeliveryData] = useState(null)

    const [conversations, setConversations] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [isloading, setIsloading] = useState(true);
    const [partner, setPartner] = useState(null);
    const [bag, setBag] = useState(bag);
    const [loggedIn,setLoggedIn]=useState(false);



    const registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            const token = await Notifications.getExpoPushTokenAsync()
            if (token) {
                setNotifToken(user._id, token).then(user => {
                })
            }

        } else {
            alert('Must use physical device for Push Notifications');
        }
        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('default', {
                name: 'default',
                sound: true,
                priority: 'max',
                vibrate: [0, 250, 250, 250],
            });
        }       
    };
    useEffect(() => {
        AsyncStorageService.getAccessToken().then(token => {
            if (token) {
                getConnectedUser().then(res => {
                    getLocation().then(async location => {
                        if (!res.data.connectedUser.isPartner) { setBag(res.data.orders); }
                        setLocation(location);
                        setDarkMode(false);
                        setUser(res.data.connectedUser);
                        async function fetchData() {
                            await registerForPushNotificationsAsync();
                          }
                          fetchData();
                                
                        const t = await AsyncStorageService.getAccessToken();
                        socket.emit('connectuser', t);
                    }).catch(err => { alert("error occured while setting Location") })
                }).catch(err => {
                    setIsloading(false);
                    setLoggedIn(false);
                })
            }
            else {
                setIsloading(false);
                setLoggedIn(false);

            }
        })
    }, [loggedIn])


   

    useEffect(() => {
        if (user) {
            getUserConversations().then(_conversations => {
                _conversations.map(conversation => {
                    let notSeenSum = 0;
                    let conv = { ...conversation };
                    conv.messages.map(message => {
                        if (message.sender._id != user._id && message.seen.length == 0) {
                            notSeenSum += 1;
                        }
                    })
                    conv.notSeen = notSeenSum;
                    conv.last = conv.messages[conv.messages.length - 1].date;
                })
                
                let _convs = [..._conversations];
                const _convSorted = _convs.sort((a, b) => a.last - b.last);
                setConversations(_convSorted);
                setIsloading(false);
                setLoggedIn(true);

            }).catch(err => { alert("network or server error")})
        }
    }, [user])




    const sendLocalisation = (id_user,partner,order,position)=>{
        socket.emit('localisation',{userid:id_user,partner:partner,order:order,position:{latitude:position.coords.latitude,longitude:position.coords.longitude}});
    };


    useEffect(()=>{
        socket.on('new-localisation',({ userid, order, position, partner })=>{
            setDeliveryData({...deliveryData,position:position,person:order.deliverer});
        })
    },[socket])
    


    useEffect(() => {
        socket.off('send-message');
        socket.off('create-conversation');
        if (conversations) {
            socket.on('send-message', (message) => {
                const _conversations = [...conversations];

                const conv_index = _conversations.findIndex(conv => { return conv._id == message.conversation });
                let notSeenSum = 0
                if (conv_index >= 0) {
                    let _convReal = { ..._conversations[conv_index] };
                    let notSeenMessages = [..._convReal.messages];
                    if (notSeenMessages.findIndex(_message => { return _message._id === message._id }) == -1) {
                        notSeenMessages.push(message);
                    }
                    notSeenMessages.map(message => {
                        if (message.sender._id != user._id && message.seen.length == 0) {
                            notSeenSum += 1;
                        }
                    })

                    _convReal.messages = notSeenMessages
                    _conversations.splice(conv_index, 1);
                    _convReal.notSeen = notSeenSum;

                    _conversations.push(_convReal);
                    setConversations(_conversations)
                }
            })
            socket.on('create-conversation', (conversation) => {
                let notSeenSum = 0;
                conversation.messages.map(message => {
                    if (message.sender._id != user._id && message.seen.length == 0) {
                        notSeenSum += 1;
                    }
                })
                conversation.notSeen = notSeenSum;
                if (conversations.findIndex(_conversation => { return _conversation._id === conversation._id }) == -1) {
                    setConversations([conversation, ...conversations]);
                }
            })
        }

    }, [conversations])

    const handleConversation = (conversation) => {
        if (conversations.findIndex(_conv => { return _conv._id === conversation._id }) == -1) {
            setConversations(conversations => [...conversations, conversation]);
        }
    }

    const markAsReadConversation = (conv_id) => {
        if(conv_id){
        markAsreadConversationApi(conv_id).then(_conv => {
            let _conversations = [...conversations];
            const index = _conversations.findIndex(conversation => { return conversation._id == _conv._id })
            if (index >= 0) {
                let _conversation_found = { ..._conversations[index] };
                _conversation_found.notSeen = 0;
                _conversation_found.messages = _conv.messages;
                _conversations.splice(index, 1);
                let _newConversations = [_conversation_found, ..._conversations];
                setConversations(_newConversations)
            }
        }).catch(err => { alert("network or server error ") });
    }
}
    const startNewConversation = (data) => {
        return new Promise((resolve, reject) => {
            createConversation(data).then(data => {
                resolve(data.conversation);
            }).catch(err => { reject(err) })
        }).catch(err => { reject(err) })
    }

    const openConversationHandler = (id, Users, type, partner) => {
        if (conversations)
            if (type != null && type == "personal") {
                let conversation_found = null;
                conversations.map(conversation => {
                    if (conversation.users.findIndex(user => { return user._id == Users.other._id }) >= 0
                        && conversation.users.findIndex(user => { return user._id == Users.user._id }) >= 0&&conversation.users.length==2) {
                            conversation_found = conversations[conversations.findIndex(conv => { return conv == conversation })];}
                        })
                if (conversation_found) {
                    conversation_found.other = Users.other.firstName + " " + Users.other.lastName;
                    return conversation_found;
                }
                else {
                    const new_conversation = {
                        image: Users.other.photo?Users.other.photo:require('../assets/user_image.png'),
                        type: "personal",
                        messages: [],
                        other: Users.other.firstName + " " + Users.other.lastName,
                        users: [Users.user._id, Users.other._id],
                    }
                    return new_conversation;
                }
            }
        if (type == "group" && type != null) {
            let conversation_found = null;
            conversations.map(conversation => {
                let count = 0;
                Users.users_id.map(user => {
                    if (conversation.users.findIndex(u => { return u._id == user }) >= 0) {
                        count += 1
                    }
                })
                if (count == Users.users_id.length) {
                    conversation_found = conversations[conversations.findIndex(conv => { return conv._id == conversation._id })];

                }
            })

            if (conversation_found) {
                return conversation_found;
            }


            else {
                const new_conversation = {
                    image: partner.profileImage,
                    type: "group",
                    messages: [],
                    partner: partner,
                    title: partner.partnerName,
                    users: Users.users_id,
                }
                return new_conversation;
            }






        }
        if (id) {
            const convIndex = conversations.findIndex(conversation => { return conversation._id == id });
            if (convIndex >= 0) {
                const conversation_found = conversations[convIndex];
                return conversation_found;
            }
            else {
                return 'conversation not found';
            }

        }
    }
    
    const send_message = (message) => {
        sendMessage(message).then(message => {
            let _conversations = [...conversations];
            const index = _conversations.findIndex(conversation => { return conversation._id == message.conversation });
            if (index >= 0) {
                let _conv = { ..._conversations[index] };
                let _messages = [..._conv.messages];
                _messages.push(message);
                _conv.messages = _messages;
                _conversations.splice(index, 1)
                let _newConversations = [_conv, ..._conversations]
                setConversations(_newConversations);

                _conv.users.map(_user=>{
                    if(_user._id!=user._id&&_user.NotificationToken!=""){
                       let response = fetch('https://exp.host/--/api/v2/push/send', {
                            method: 'POST',
                            headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              to: _user.NotificationToken,
                              sound: 'default',
                              title: 'Notification',
                              body: `New Message from ${user.firstName}`
                            })
                          });
                    }
                })
                   

            }

        }).catch(err => { alert(err) })
    }




    const modifyDarkModeHandler = () => {
        setDarkMode(darkMode => !darkMode);

    }

    const LoginHandler = async ({ user, token }) => {
        await AsyncStorageService.setToken(token);
        setUser(user);
        setLoggedIn(true);
    }


    const logoutHandler =  () => {
        AsyncStorageService.getAccessToken().then(t=>{
            userLogout({ token: t }).then( async (res) => {
                if (res) {
                    
                         await  AsyncStorageService.clearToken();
                            setConversations(null);
                            setLoggedIn(false);     

                }
            }).catch(err => {
                alert("error occured while logout")
            })
        }).catch(err=>{
            alert("error occured while logout")

        })
       
    }

    const _createOrder = (body) =>{
    }




    const updateUserLocation = (_location, isHome) => {
        updateLocation({ location: _location }).then(res => {
            setLocation({ ...location, location: _location });
            if (isHome) {
                updateLocationState(user._id).then(message => {
                    setUser({ ...user, locationState: true });
                }).catch(err => alert("update location state failed"))
            }
        }).catch(err => { alert("update location failed") })
    }



    const handleTemporaryLocation = (loc, user_id) => {
        addTemporarlyLocation(user_id, loc).then(_location => {
            setLocation({ ...location, temperarlyLocation: _location["temperarlyLocation"] })
        })
    }
   

    return (
        <AuthContext.Provider value={{
            darkMode: darkMode,
            user: user,
            loggedIn:loggedIn,
            partner: partner,
            socket: socket,
            conversations: conversations,
            location: location,
            bag: bag,
            deliveryData:deliveryData,
            isloading: isloading,
            setUser: setUser,
            setLocation: setLocation,
            setPartner: setPartner,
            LoginHandler: LoginHandler,
            sendLocalisation:sendLocalisation,
            openConversationHandler: openConversationHandler,
            logoutHandler: logoutHandler,
            modifyDarkModeHandler: modifyDarkModeHandler,
            startNewConversation: startNewConversation,
            send_message: send_message,
            handleConversation: handleConversation,
            markAsReadConversation: markAsReadConversation,
            updateUserLocation: updateUserLocation,
            handleTemporaryLocation: handleTemporaryLocation,
            _createOrder: _createOrder
        }
        }>

            {isloading ? <Loading /> : props.children}

        </AuthContext.Provider>
    )


}