import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity, Button } from 'react-native'
import { TextInput, Paragraph } from 'react-native-paper';
import _ from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';
import AuthContext from '../navigation/AuthContext';



   
export default function Conversation(props) {
    const context = useContext(AuthContext);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(props.route.params.conversation.messages);
    const [conversation, setConversation] = useState(props.route.params.conversation);
    const [dark,setDark]=useState(context.darkMode);
    useEffect(()=>{
     

        if(conversation){
            context.markAsReadConversation(conversation._id);
        }
    
    },[])



    useEffect(()=>{
        setDark(context.darkMode)

    },[context.darkMode])

    useEffect(()=>{
        let _conversations = [...context.conversations];
        const index = _conversations.findIndex(conv=>{return conv._id==conversation._id});
        if(index>=0){
          let _conversation = _conversations[index];
          setMessages(_conversation.messages);
          setConversation(_conversation);        
        }
    },[context.conversations])
    
   

    const sendQrCode= ()=>{
        if(messages.length==0){
            const data={
                 users:conversation.users,
                 title:conversation.title,
                 image:conversation.image,
                 type:conversation.type,
                 content:"mon code est   :"+context.user.locationCode,
             }
             context.startNewConversation(data).then(conversation=>{
                  setConversation(conversation);

            }).catch(err=>{alert(err)})
         }
         else {
            const data={
                conversationId:conversation._id,
                content:"mon code est   :"+context.user.locationCode,
                code:context.user.locationCode
            }
            context.send_message(data);
        }
    }

    const sendMessage = () => {
        if(messages.length==0){
           const data={
            users:conversation.users,
            title:conversation.title,
            image:conversation.image,
            type:conversation.type,
            content:message,
            }
            context.startNewConversation(data).then(conversation=>{
                setConversation(conversation);
                context.handleConversation(conversation);
            }).catch(err=>{console.log(err)})

        }
        else {
            const data = {
                conversationId:conversation._id,
                content:message
            }
            context.send_message(data)

        }
        setMessage("");
    }



    const goBack = () => {
        //console.log (Object.keys(props.route.params));
       props.navigation.navigate((Object.keys(props.route.params)[1].toString()));
    }
    return (
        <View style={dark ? styles.containerDark :styles.container}>
            <View style={styles.menu}>
                <FontAwesome color={"white"} style={{  padding: 0, fontSize: 20 }} name="arrow-left" onPress={goBack} />
                <Image style={styles.friendImage} source={props.route.params.conversation.image} />
                <Text style={styles.Title}>{props.route.params.conversation.other ? props.route.params.conversation.other :props.route.params.conversation.users.filter(user=>user._id != context.user._id)[0].firstName+" "+props.route.params.conversation.users.filter(user=>user._id != context.user._id)[0].lastName }</Text>
            </View>
            <ScrollView style={dark ? styles.ConversationBodyDark : styles.ConversationBody}
            >
                {
                    messages ?
                    messages.length > 0 ?
                        messages.map((message, index) => {
                            return (
                                   message.sender._id == context.user._id ?
                                    (<View style={styles.messageSentContainer} key={index}>
                                        <Image style={styles.userImage} source={{uri:context.user.photo}} />
                                        <View style={dark ? styles.messageSentDark :styles.messageSent}>
                                              <Text style={dark ? styles.textMessageDark : styles.textMessage}>{message.content}</Text>
                                           { message.content.includes("mon code est   :") ? 
                                         (  <QRCode
                                            value={message.content.substr(16)}
                                            />)

                                            :null
                                          }
                                        </View>
                                        <Text style={styles.userTime}>{message.date.split('T')[1].split(':')[0]+":"+message.date.split('T')[1].split(':')[1]}</Text>
                                        <Image style={styles.seenImage} source={require("../assets/julia.jpg")}/>
                                    </View>
                                    ) :
                                    (
                                        <View style={styles.FriendmessageSentContainer} key={index}>
                                            <Text style={styles.FriendTime}>{message.date.split('T')[1].split(':')[0]+":"+message.date.split('T')[1].split(':')[1]}</Text>

                                            <View style={dark ? styles.FriendmessageSentDark : styles.FriendmessageSent}>
                                                <Text style={styles.textMessage}>{message.content}</Text>
                                                { message.content.includes("mon code est   :")? 
                                                (  <QRCode
                                                       
                                                    value={message.content.substr(16)}
                                                       
                                                   />)
       
                                                   :null
                                                 }
       
                                                </View>
                                            <Image style={styles.FriendImage} source={props.route.params.conversation.image} />

                                        </View>
                                    )
                            )

                        })
                        : null : null
                }

            </ScrollView>
            <View style={dark ? styles.sendMessageContainerDark : styles.sendMessageContainer}>
                <View style={dark ? styles.messageBodyContainerDark : styles.messageBodyContainer}>
                    <TextInput
                        style={dark ? styles.messageDark : styles.message}
                        placeholder={"Type a message.."}
                        underlineColor={dark ? "#292929":"white"}
                        underlineColorAndroid={dark ? "#292929" :"white"}
                        
                        //placeholderTextColor={"##919191"}
                        value={message}
                        onChangeText={(text) => { setMessage(text); }}
                        
                    />
                    {message.length > 0 &&
                        <TouchableOpacity style={styles.sendMessageTouchable} onPress={sendMessage}>
                            <View style={dark ? styles.sendMessageButtonContainerDark  :styles.sendMessageButtonContainer}>
                                <Image style={styles.sendIcon} source={require("../assets/sendMessage.png")} />
                            </View>
                        </TouchableOpacity>
                    }
                </View>
                <View style={dark ? styles.sentCodeContainerDark : styles.sentCodeContainer}>
                    <TouchableOpacity onPress={sendQrCode} style={{ width: "80%", height: "100%", }}>
                        <View style={dark ? styles.monCodecontainerDark :styles.monCodecontainer}>
                            <Text style={styles.moncode}>MON CODE</Text>

                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

}
const styles = StyleSheet.create({
    sentCodeContainer:
    {
        backgroundColor: "white"
        , width: "30%", height: 40,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    sentCodeContainerDark:
    {
        backgroundColor: "#292929"
        , width: "30%", height: 40,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    monCodecontainer: {
        backgroundColor: "#2474F1",
        width: "100%",
        height: "100%",
        borderRadius: 25,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    monCodecontainerDark: {
        backgroundColor: "#242424",
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
        alignSelf:"stretch",
        fontSize: 12,
        fontWeight: "bold",
        textAlign:"center"
    },


    container: {
        flex: 1,
        backgroundColor: "#2474F1"
    },
    containerDark: {
        flex: 1,
        backgroundColor:"#292929"
    },
    menu: {

        position: "absolute",
        marginTop: Platform.OS == 'ios' ? 30 : 20,
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
        fontSize: 20,
        fontWeight: "600",
        color: "white"
    },
    ConversationBody: {
        width: "100%",
        height: "73%",
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
        height: "73%",
        position: "absolute",
        top: "19%",
        elevation: 10,
        backgroundColor:"#121212",
        borderTopRightRadius: 14,
        borderTopLeftRadius: 14,
        padding: 5,
    },  
    sendMessageContainer: {
        width: "100%",
        height: "10%",
        position: "absolute",
        top: "90%",
        elevation: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "white",

    },
    sendMessageContainerDark: {
        width: "100%",
        height: "10%",
        position: "absolute",
        top: "90%",
        elevation: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#292929",

    },

    
    messageBodyContainer: {
        width: "64%",
        height: "80%",
        borderRadius: 25,
        margin: "2%",
        backgroundColor: "#e6e6e6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignContent: "center"
    },
    messageBodyContainerDark: {
        width: "64%",
        height: "80%",
        borderRadius: 25,
        margin: "2%",
        backgroundColor: "#292929",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignContent: "center"
    },
    message: {
        width: "80%",
        height: "100%",
        margin: 5,
        borderColor: "#e6e6e6",
        color: "#e6e6e6",
        fontSize: 12,
        borderTopStartRadius:25,
        borderBottomStartRadius:25,
        borderBottomEndRadius:25,
        borderTopEndRadius:25,

    },
    messageDark: {
        width: "80%",
        height: "100%",
        margin: 5,
        borderColor: "#303030",
        color: "#303030",
        fontSize: 12,
        borderTopStartRadius:25,
        borderBottomStartRadius:25,
        borderBottomEndRadius:25,
        borderTopEndRadius:25,
        backgroundColor:"#303030"
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
        width: "68%",
        height: "50%",
        borderRadius: 15,
        backgroundColor: "#2474F1",
        justifyContent: "center",
        alignItems: "center",
        margin: "1%"
    },
    sendMessageButtonContainerDark: {
        width: "68%",
        height: "50%",
        borderRadius: 15,
        backgroundColor: "#303030",
        justifyContent: "center",
        alignItems: "center",
        margin: "1%"
    },
    sendIcon: {
        width: "60%",
        height: "50%",
        resizeMode: "contain"
    },
    FriendmessageSentContainer: {
        width: "90%",
        flexDirection: "row",
        alignItems: "flex-start",
        margin: 8,
        padding: 6,
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        alignSelf:"flex-end"


    },

    messageSentContainer: {
        width: "90%",
        flexDirection: "row",
        alignItems: "flex-start",
        margin: 8,
        padding: 4,
        flexWrap: 'wrap',
        justifyContent: "flex-start",

    },
    FriendmessageSent: {
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
    FriendmessageSentDark:{
        width: "70%",
        flexDirection: "row",
        backgroundColor: '#E6E6E6',
        alignItems: "flex-start",
        margin: 10,
        padding: 5,
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        borderRadius: 15


    },
    messageSent:
    {
        width: "70%",
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
        width: "70%",
        flexDirection: "row",
        backgroundColor: '#19A3FE',
        alignItems: "flex-start",
        margin: 10,
        padding: 5,
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        borderRadius: 15

    },

    textMessage: {
        color: 'black',
        fontSize: 12,
        margin: 5,
    }
    ,
    textMessageDark: {
        color: 'white',
        fontSize: 12,
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
    seenImage:{
        width: 12,
        height: 12,
        borderRadius: 50,
        alignSelf: 'flex-end',
        
        
        
    },
    FriendTime: {
        alignSelf: 'flex-end',
        position: "absolute",
        left: "9%",
        bottom: "1%",
        fontSize: 12,
        color: "grey"

    },
    userTime: {
        alignSelf: 'flex-end',
        position: "absolute",
        left: "72%",
        bottom: 0,
        fontSize: 12,
        color: "grey"

    }





})