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
  
    useEffect(()=>{
        let _conversations = [...context.conversations];
        const index = _conversations.findIndex(conv=>{return conv._id==conversation._id});
        if(index>=0){
          let _conversation = _conversations[index];
          setMessages(messages => [...messages,_conversation.messages[_conversation.messages.length-1]]);
          setConversation(_conversation);        
        }
       // console.log(conv.messages[conv.messages.length-1])
    },[context.conversations,context.socket])
    
   

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
                setMessages(conversation.messages);
            }).catch(err=>{console.log(err)})
         }
         else {
            const data={
                conversationId:conversation._id,
                content:"mon code est   :"+context.user.locationCode,
                code:context.user.locationCode
            }
            setMessages(messages=>[...messages,data]);
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
                setMessages(conversation.messages)
                context.handleConversation(conversation);
            }).catch(err=>{console.log(err)})

        }
        else {
            const data = {
                conversationId:conversation._id,
                content:message
            }
            context.send_message(data).then(m=>{
                setMessages(messages=>[...messages,m]);
            }).catch(err=>console.log(err));

        }
        setMessage("");
    }

    const makeAsSeen = ()=>{
        if(conversation){
            context.markAsReadConversation()
        }
    
    
    }



    const goBack = () => {
        //console.log (Object.keys(props.route.params));
       props.navigation.navigate((Object.keys(props.route.params)[1].toString()));
    }
    return (
        <View style={styles.container}>
            <View style={styles.menu}>
                <FontAwesome color={"white"} style={{  padding: 0, fontSize: 20 }} name="arrow-left" onPress={goBack} />
                <Image style={styles.friendImage} source={props.route.params.conversation.image} />
                <Text style={styles.Title}>{props.route.params.conversation.other ? props.route.params.conversation.other : props.route.params.conversation.other}</Text>
            </View>
            <ScrollView style={styles.ConversationBody}
            >
                {
                    messages ?
                    messages.length > 0 ?
                        messages.map((message, index) => {
                            return (
                                   message.sender._id == context.user._id ?
                                    (<View style={styles.messageSentContainer} key={index}>
                                        <Image style={styles.userImage} source={require("../assets/mootaz.jpg")} />
                                        <View style={styles.messageSent}>
                                              <Text style={styles.textMessage}>{message.content}</Text>
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

                                            <View style={styles.FriendmessageSent}>
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
            <View style={styles.sendMessageContainer}>
                <View style={styles.messageBodyContainer}>
                    <TextInput
                        style={styles.message}
                        placeholder={"Type a message.."}
                        underlineColor={"white"}
                        underlineColorAndroid={"white"}
                        //placeholderTextColor={"##919191"}
                        value={message}
                        onChangeText={(text) => { setMessage(text); }}
                        onFocus={makeAsSeen}

                    />
                    {message.length > 0 &&
                        <TouchableOpacity style={styles.sendMessageTouchable} onPress={sendMessage}>
                            <View style={styles.sendMessageButtonContainer}>
                                <Image style={styles.sendIcon} source={require("../assets/sendMessage.png")} />
                            </View>
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.sentCodeContainer}>
                    <TouchableOpacity onPress={sendQrCode} style={{ width: "80%", height: "100%", }}>
                        <View style={styles.monCodecontainer}>
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

    monCodecontainer: {
        backgroundColor: "#2474F1",
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
    message: {
        width: "80%",
        height: "100%",
        margin: 5,
        borderColor: "#e6e6e6",
        color: "#e6e6e6",
        fontSize: 12,
        borderTopStartRadius:25,
        borderBottomStartRadius:25
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
        backgroundColor:'red'

    },
    FriendmessageSent: {
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

    textMessage: {
        color: 'black',
        fontSize: 12,
        margin: 5,
    }
    ,
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