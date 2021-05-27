import React, { useContext, useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity ,KeyboardAvoidingView,Keyboard} from 'react-native'
import { TextInput } from 'react-native-paper';
import _ from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';
import AuthContext from '../navigation/AuthContext';
import { LogBox } from 'react-native';
import { Dimensions } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications




export default function Conversation(props) {
    const context = useContext(AuthContext);
    const scrollViewRef = useRef();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [conversationId,setConversationId]=useState("");



    useEffect(() => {
        let mounted=true;
        if(mounted){
        setConversation(props.route.params.conversation);              
        let _conversations = [...context.conversations];                
        const index = _conversations.findIndex(conv => { return conv._id == props.route.params.conversation._id });
        
        let index_first=-1;
        if(conversationId.length>0){
             index_first=  _conversations.findIndex(conv => { return conv._id == conversationId });
        }

        if (index >= 0 ) {
            let _conversation = _conversations[index];
            (_conversation.messages)

            
            setMessages(_conversation.messages);
            setConversation(_conversation);
        }

        if(index_first>=0 && index==-1){
            let _conversation = _conversations[index_first];
            setMessages(_conversation.messages);
            setConversation(_conversation);
    
        }
    }

        return () =>{ mounted=false;setMessages([]);setConversation(null);}
    }, [context.conversations,props.route.params])

    const sendQrCode = () => {
        if (messages.length == 0) {
            const data = {
                users: conversation.users,
                title: conversation.title,
                image: conversation.image,
                type: conversation.type,
                content: "mon code est   :" + context.user.location.locationCode,
            }
            context.startNewConversation(data).then(conversation => {
                setConversationId(conversation._id)
                context.handleConversation(conversation);
            }).catch(err => { alert(err) })
        }
        else {
            const data = {
                conversationId: conversation._id,
                content: "mon code est   :" + context.user.location.locationCode,
                code: context.user.location.locationCode
            }
            context.send_message(data);
        }
    }

    const sendMessage = () => {
        if (messages.length == 0)
        {   let data= {};
            if(conversation.type=='group'){
                data = {
                    partner:conversation.partner._id,
                    users: conversation.users,
                    title: conversation.title,
                    image: conversation.image,
                    type: conversation.type,
                    content: message,
                }
                console.log("ok");
            }    
            else {
                data = {
                    users: conversation.users,
                    title: conversation.title,
                    image: conversation.image,
                    type: conversation.type,
                    content: message,
                }
            }
            
            context.startNewConversation(data).then(conversation => {
                setConversationId(conversation._id)
                context.handleConversation(conversation);
            }).catch(err => { (err) })
        }
        else {
            const data = {
                conversationId: conversation._id,
                content: message
            }
            context.send_message(data)
        }
        setMessage("");
        Keyboard.dismiss(0);

    }

    const goBack = () => {
        // (Object.keys(props.route.params));
        setConversationId("");
        props.navigation.goBack();
    }
    return (
        <View style={context.darkMode ?styles.containerDark : styles.container}>
            <View style={styles.menu}>
                <FontAwesome color={"white"} style={{ padding: 0, fontFamily:'Poppins',fontSize: 30 }} name="arrow-left" onPress={goBack} />
                <Image style={styles.friendImage} source={
                        props.route.params.conversation.type == "personal" ?
                        props.route.params.conversation.users[props.route.params.conversation.users.findIndex(u => { return u._id != context.user._id })].photo?
                            { uri: props.route.params.conversation.users[props.route.params.conversation.users.findIndex(u => { return u._id != context.user._id })].photo }
                            :require('../assets/user_image.png')
                            :

                            props.route.params.conversation.partner?
                                  (  (props.route.params.conversation.partner.managers.length>0&&props.route.params.conversation.partner.managers.findIndex(manager=>{return context.user._id ==manager.user})>=0)
                                ||  (props.route.params.conversation.partner.deliverers.length>0&&props.route.params.conversation.partner.deliverers.findIndex(deliverer=>{return context.user._id ==deliverer})>=0)
                                ||  props.route.params.conversation.partner.owner == context.user._id )? 
                                 
                                props.route.params.conversation.users[props.route.params.conversation.users.findIndex(user=>{return (props.route.params.conversation.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                     &&props.route.params.conversation.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && props.route.params.conversation.partner.owner != user._id})] ?

                                     props.route.params.conversation.users[props.route.params.conversation.users.findIndex(user=>{return (props.route.params.conversation.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                        &&props.route.params.conversation.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && props.route.params.conversation.partner.owner != user._id})].photo
                        ?
                            {
                                uri:  
                                props.route.params.conversation.users[props.route.params.conversation.users.findIndex(user=>{return (props.route.params.conversation.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                   &&props.route.params.conversation.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && props.route.params.conversation.partner.owner != user._id})].photo}
                                :
                                require("../assets/user_image.png")
                                :
                          
                          
                                {uri:props.route.params.conversation.image} 
                                :
                                {uri:props.route.params.conversation.image} 
                 :{uri:props.route.params.conversation.image}           
                } />
                <Text style={styles.Title}>{
                 props.route.params.conversation.type == "personal" ?
                 props.route.params.conversation.users[props.route.params.conversation.users.findIndex(u => { return u._id != context.user._id })].firstName ?
                     props.route.params.conversation.users[props.route.params.conversation.users.findIndex(u => { return u._id != context.user._id })].firstName+" "
                     +props.route.params.conversation.users[props.route.params.conversation.users.findIndex(u => { return u._id != context.user._id })].lastName : "" 
                     
                     
                     
                     :
                     
                     props.route.params.conversation.partner ? 
                     (  (props.route.params.conversation.partner.managers.length>0&&props.route.params.conversation.partner.managers.findIndex(manager=>{return context.user._id ==manager.user})>=0)
                   ||  (props.route.params.conversation.partner.deliverers.length>0&&props.route.params.conversation.partner.deliverers.findIndex(deliverer=>{return context.user._id ==deliverer})>=0)
                   ||  props.route.params.conversation.partner.owner == context.user._id )? 
                    
                   props.route.params.conversation.users[props.route.params.conversation.users.findIndex(user=>{return (props.route.params.conversation.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                        &&props.route.params.conversation.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && props.route.params.conversation.partner.owner != user._id})] ?
                        
                        props.route.params.conversation.users[props.route.params.conversation.users.findIndex(user=>{return (props.route.params.conversation.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                         &&props.route.params.conversation.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && props.route.params.conversation.partner.owner != user._id})].firstName+" " +  
                         
                         props.route.params.conversation.users[props.route.params.conversation.users.findIndex(user=>{return (props.route.params.conversation.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                         &&props.route.params.conversation.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && props.route.params.conversation.partner.owner != user._id})].lastName
                         
                         :
                         props.route.params.conversation.title:props.route.params.conversation.title:props.route.params.conversation.title }</Text>
            
            </View>





            <ScrollView  ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                style={context.darkMode ?styles.ConversationBodyDark : styles.ConversationBody}
            >
                     
                {
                    messages ?
                        messages.length > 0 ?
                            messages.map((message, index) => {
                                return (
                                    message.sender._id == context.user._id ?
                                        (<View style={styles.messageSentContainer} key={index}>
                                            <Image style={styles.userImage} source={context.user.photo ? { uri: context.user.photo } : require('../assets/user_image.png')} />
                                            <View style={context.darkMode ?styles.messageSentDark : styles.messageSent}>
                                                <Text style={context.darkMode ?styles.textMessageDark : styles.textMessage}>{message.content}</Text>
                                               
                                            </View>
                                            <Text style={styles.userTime}>{message.date.split('T')[1].split(':')[0] + ":" + message.date.split('T')[1].split(':')[1]}</Text>
                                        </View>
                                        ) :
                                        (
                                            <View style={styles.FriendmessageSentContainer} key={index}>
                                                <Text style={styles.FriendTime}>{message.date.split('T')[1].split(':')[0] + ":" + message.date.split('T')[1].split(':')[1]}</Text>
                                                <View style={context.darkMode ?styles.FriendmessageSentDark : styles.FriendmessageSent}>
                                                    <Text style={context.darkMode ?styles.textMessageDark : styles.textMessage}>{message.content}</Text>
                                                 

                                                </View>
                                                <Image style={styles.FriendImage} source={message.sender.photo ? {uri:message.sender.photo}:require('../assets/user_image.png')}/>

                                            </View>
                                        )
                                )

                            })
                            : null : null
                }

            </ScrollView>
            <View style={context.darkMode ?styles.sendMessageContainerDark : styles.sendMessageContainer}>
                <View style={context.darkMode ?styles.messageBodyContainerDark : styles.messageBodyContainer}>
                    <TextInput
                        style={context.darkMode ?styles.messageDark : styles.message}
                        placeholder={"Type a message.."}
                        underlineColor={context.darkMode ?"#292929" : "white"}
                        underlineColorAndroid={context.darkMode ?"#292929" : "white"}
                        onFocus={() => {
                            if (conversation) {
                                context.markAsReadConversation(conversation._id);
                            }
                        }}
                        //placeholderTextColor={"##919191"}
                        value={message}
                        onChangeText={(text) => { setMessage(text); }}

                    />
                 
                </View>
               
               
                <View style={context.darkMode ?styles.sentCodeContainerDark : styles.sentCodeContainer}>
                   

                    {
                        message.length>0 ? 
                        <TouchableOpacity onPress={sendMessage} style={{ width: "100%", height: "100%", }}>
                        <View style={context.darkMode ?styles.monCodecontainerDark : styles.monCodecontainer}>
                            <Image style={{width:"60%",height:"60%",resizeMode:"contain"}} source={require("../assets/logo_message.png")}/>
                        </View>
                    </TouchableOpacity>:
                     <TouchableOpacity onPress={sendQrCode} style={{ width: "100%", height: "100%", }}>
                     <View style={context.darkMode ?styles.monCodecontainerDark : styles.monCodecontainer}>
                         <Image style={{width:"70%",height:"70%",resizeMode:"contain"}} source={require("../assets/images/logoBlue.png")}/>
                     </View>
                 </TouchableOpacity>

                    }
                </View>
            </View>
        
        </View>
    )}
  

const styles = StyleSheet.create({
    sentCodeContainer:
    {
        backgroundColor: "white"
        , width: "25%", 
        height: Dimensions.get("screen").height*0.07,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    sentCodeContainerDark:
    {
        backgroundColor: "#292929"
        , width: Dimensions.get("screen").width*0.25,         
        height: Dimensions.get("screen").height*0.07,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    monCodecontainer: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    monCodecontainerDark: {
        width: "100%",
        height: "100%",
        borderRadius: 25,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },

    moncode:

    {
        color: "white",
        alignSelf: "stretch",
        fontFamily:'Poppins',fontSize: 12,
        fontWeight: "bold",
        textAlign: "center"
    },


    container: {
        flex: 1,
        backgroundColor: "#2474F1"
    },
    containerDark: {
        flex: 1,
        backgroundColor: "#292929"
    },
    menu: {

        position: "absolute",
        marginTop: Platform.OS == 'ios' ? 30 : 50,
        flexDirection: "row",
        alignSelf: "flex-start",
        alignContent: "space-between",
        padding: 10,
        shadowOpacity: 0.5,
        elevation: 10,
        alignItems: "center"

    },
    friendImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginHorizontal: 8

    },
    Title: {
        fontFamily:'Poppins',fontSize: 20,
        fontWeight: "600",
        color: "white"
    },
    ConversationBody: {
        width: "100%",
        height: "70%",
        position: "absolute",
        top: "19%",
        elevation: 10,
        backgroundColor: "white",
        borderTopRightRadius: 14,
        borderTopLeftRadius: 14,
        padding: 5,
    },
    ConversationBodyDark: {
        width: "100%",
        height: "70%",
        position: "absolute",
        top: "19%",
        elevation: 10,
        backgroundColor: "#121212",
        borderTopRightRadius: 14,
        borderTopLeftRadius: 14,
        padding: 5,
    },
    sendMessageContainer: {
        width: "100%",
        height: Dimensions.get("screen").height*0.13,
        position: "absolute",
        top: "89%",
        elevation: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "white",

    },
    sendMessageContainerDark: {
        width: "100%",
        height: Dimensions.get("screen").height*0.13,
                position: "absolute",
        top: "89%",
        elevation: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#292929",

    },


    messageBodyContainer: {
        width: "75%",
        height: Dimensions.get("screen").height*0.07,
        borderRadius: 25,
        margin: Dimensions.get("screen").width*0.02,
        backgroundColor: "#e6e6e6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignContent: "center"
    },
    messageBodyContainerDark: {
        width: "75%",
        height: Dimensions.get("screen").height*0.07,
        borderRadius: 25,
        margin: Dimensions.get("screen").width*0.02,
        backgroundColor: "#292929",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignContent: "center",

    },
    message: {
        width: "100%",
        height:Dimensions.get("screen").height*0.07,
        margin: 5,
        borderColor: "#e6e6e6",
        color: "#e6e6e6",
        fontFamily:'Poppins',fontSize: 12,
        borderTopStartRadius: 25,
        borderBottomStartRadius: 25,
        borderBottomEndRadius: 25,
        borderTopEndRadius: 25,

    },
    messageDark: {
        width: "100%",
        height:Dimensions.get("screen").height*0.07,
        margin: 5,
        borderColor: "#303030",
        color: "#303030",
        fontFamily:'Poppins',fontSize: 12,
        borderTopStartRadius: 25,
        borderBottomStartRadius: 25,
        borderBottomEndRadius: 25,
        borderTopEndRadius: 25,
        backgroundColor: "#303030"
    },
    sendMessageTouchable: {
        width: "16%",
        height: "100%",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        alignItems: "center",
        justifyContent: "center"

    },
    sendMessageButtonContainer: {
        width: 25,
        height: 25,
        borderRadius: 25,
        backgroundColor: "#2474F1",
        justifyContent: "center",
        alignItems: "center",
        margin: Dimensions.get("screen").width*0.02
    },
    sendMessageButtonContainerDark: {
        width: 25,
        height: 25,
        borderRadius: 25,
        backgroundColor: "#303030",
        justifyContent: "center",
        alignItems: "center",
        margin: Dimensions.get("screen").width*0.02
    },
    sendIcon: {
        width: "60%",
        height: "50%",
        resizeMode: "contain"
    },
    FriendmessageSentContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        margin: 8,
        padding: 6,
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        alignSelf: "flex-end"


    },

    messageSentContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        margin: 8,
        padding: 4,
        flexWrap: 'wrap',
        justifyContent: "flex-start",

    },
    FriendmessageSent: {
        
        flexDirection: "row",
        backgroundColor: '#E6E6E6',
        alignItems: "flex-start",
        margin: 10,
        padding: 5,
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        borderRadius: 15
    },
    FriendmessageSentDark: {
        width: "70%",
        flexDirection: "row",
        backgroundColor: "#292929",
        alignItems: "flex-start",
        margin: 10,
        padding: 5,
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        borderRadius: 15


    },
    messageSent:
    {
        
        flexDirection: "row",
        backgroundColor: '#CFE0FC',
        alignItems: "flex-start",
        margin: 10,
        padding: 5,
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        borderRadius: 15

    },
    messageSentDark:
    {
        flexDirection: "row",
        backgroundColor: '#2474F1',
        alignItems: "flex-start",
        margin: 10,
        padding: 5,
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        borderRadius: 15

    },

    textMessage: {
        color: 'black',
        fontFamily:'Poppins',fontSize: 12,
        margin: 5,
    }
    ,
    textMessageDark: {
        color: 'white',
        fontFamily:'Poppins',fontSize: 12,
        margin: 5,
    },
    userImageContainer:
    {
        flexDirection: "column",
        justifyContent: "flex-end",
        width: "20%",
    },
    FriendImage: {
        width: 30,
        height: 30,
        borderRadius: 50,
        alignSelf: 'flex-start',
        position: "relative",
        top: 10


    },
    userImage: {
        width: 30,
        height: 30,
        borderRadius: 50,
        alignSelf: 'flex-end',
        position: "relative",
        bottom: 10
    },
    seenImage: {
        width: 12,
        height: 12,
        borderRadius: 50,
        alignSelf: 'flex-end',



    },
    FriendTime: {
        alignSelf: 'flex-end',
        position: "absolute",
        left: "9%",
        top:"90%",
        fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.025,
        color: "grey"

    },
    userTime: {
        alignSelf: 'flex-end',
        position: "absolute",
        left: "72%",
        top:"90%",
        fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.025,
        color: "grey"

    }





})