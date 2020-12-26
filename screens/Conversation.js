import React, { useContext, useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity ,KeyboardAvoidingView,Keyboard} from 'react-native'
import { TextInput } from 'react-native-paper';
import _ from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';
import AuthContext from '../navigation/AuthContext';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications




export default function Conversation(props) {
    const context = useContext(AuthContext);
    const scrollViewRef = useRef();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [dark, setDark] = useState(context.darkMode);
    const [conversationId,setConversationId]=useState("");



    useEffect(() => {
        let mounted=true;
        if(mounted){
        setConversation(props.route.params.conversation);    
        let _conversations = [...context.conversations];
        
        const index = _conversations.findIndex(conv => { return conv._id == props.route.params.conversation._id });
        const index_first=  _conversations.findIndex(conv => { return conv._id == conversationId });
        if (index >= 0 ) {
            console.log(index);
            let _conversation = _conversations[index];
            setMessages(_conversation.messages);
            setConversation(_conversation);
        }
        if(index_first>=0){
            let _conversation = _conversations[index_first];
            setMessages(_conversation.messages);
            setConversation(_conversation);
            setConversationId("");
        }
    }
        return () =>{ mounted=false;setMessages([]);setConversation(null)}
    }, [context.conversations,props.route.params])

    const sendQrCode = () => {
        if (messages.length == 0) {
            const data = {
                users: conversation.users,
                title: conversation.title,
                image: conversation.image,
                type: conversation.type,
                content: "mon code est   :" + context.user.locationCode,
            }
            context.startNewConversation(data).then(conversation => {
                setConversationId(conversation._id)
            }).catch(err => { alert(err) })
        }
        else {
            const data = {
                conversationId: conversation._id,
                content: "mon code est   :" + context.user.locationCode,
                code: context.user.locationCode
            }
            context.send_message(data);
        }
    }

    const sendMessage = () => {
        if (messages.length == 0)
        {
            const data = {
                partner:conversation.partner?conversation.partner._id:null,
                users: conversation.users,
                title: conversation.title,
                image: conversation.image,
                type: conversation.type,
                content: message,
            }
            context.startNewConversation(data).then(conversation => {
                setConversationId(conversation._id)
                context.handleConversation(conversation);
            }).catch(err => { console.log(err) })
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
        //console.log (Object.keys(props.route.params));
        props.navigation.goBack()
    }
    return (
        <View style={context.darkMode ?styles.containerDark : styles.container}>
            <View style={styles.menu}>
                <FontAwesome color={"white"} style={{ padding: 0, fontSize: 30 }} name="arrow-left" onPress={goBack} />
                <Image style={styles.friendImage} source={{uri:props.route.params.conversation.image}} />
                <Text style={styles.Title}>{
                props.route.params.conversation.type == "personal" ?
                    props.route.params.conversation.other ? 
                            props.route.params.conversation.other : 
                                props.route.params.conversation.users.filter(user => user._id != context.user._id)[0].firstName + " " + props.route.params.conversation.users.filter(user => user._id != context.user._id)[0].lastName : 
                                    !context.user.isPartner ? props.route.params.conversation.title:
                                       props.route.params.conversation.users.filter(user => user != context.user._id)[0].firstName+" "+props.route.params.conversation.users.filter(user => user != context.user._id)[0].lastName}</Text>
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
                                                {message.content.includes("mon code est   :") ?
                                                    (<QRCode
                                                        value={message.content.substr(16)}
                                                    />)
                                                    : null
                                                }
                                            </View>
                                            <Text style={styles.userTime}>{message.date.split('T')[1].split(':')[0] + ":" + message.date.split('T')[1].split(':')[1]}</Text>
                                          
                
                                        </View>
                                        ) :
                                        (
                                            <View style={styles.FriendmessageSentContainer} key={index}>
                                                <Text style={styles.FriendTime}>{message.date.split('T')[1].split(':')[0] + ":" + message.date.split('T')[1].split(':')[1]}</Text>
                                                <View style={context.darkMode ?styles.FriendmessageSentDark : styles.FriendmessageSent}>
                                                    <Text style={context.darkMode ?styles.textMessageDark : styles.textMessage}>{message.content}</Text>
                                                    {message.content.includes("mon code est   :") ?
                                                        (<QRCode
                                                            value={message.content.substr(16)}
                                                        />)
                                                        : null
                                                    }

                                                </View>
                                                <Image style={styles.FriendImage} source={{uri:conversation.users[conversation.users.findIndex(user=>{return user._id==message.sender})].photo}}/>

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
                    {message.length > 0 &&
                        <TouchableOpacity style={styles.sendMessageTouchable} onPress={sendMessage}>
                            <View style={context.darkMode ?styles.sendMessageButtonContainerDark : styles.sendMessageButtonContainer}>
                                <Image style={styles.sendIcon} source={require("../assets/sendMessage.png")} />
                            </View>
                        </TouchableOpacity>
                    }
                </View>
                <View style={context.darkMode ?styles.sentCodeContainerDark : styles.sentCodeContainer}>
                    <TouchableOpacity onPress={sendQrCode} style={{ width: "80%", height: "100%", }}>
                        <View style={context.darkMode ?styles.monCodecontainerDark : styles.monCodecontainer}>
                            <Text style={styles.moncode}>MON CODE</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        
        </View>
    )}
  

const styles = StyleSheet.create({
    sentCodeContainer:
    {
        backgroundColor: "white"
        , width: "30%", 
        height: 40,
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
        alignSelf: "stretch",
        fontSize: 12,
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
        height: "72%",
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
        height: "72%",
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
        height: "12%",
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
        height: "12%",
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
        height: 40,
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
        height: 40,
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
        height:40,
        margin: 5,
        borderColor: "#e6e6e6",
        color: "#e6e6e6",
        fontSize: 12,
        borderTopStartRadius: 25,
        borderBottomStartRadius: 25,
        borderBottomEndRadius: 25,
        borderTopEndRadius: 25,

    },
    messageDark: {
        width: "80%",
        height: 40,
        margin: 5,
        borderColor: "#303030",
        color: "#303030",
        fontSize: 12,
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
        margin: "1%"
    },
    sendMessageButtonContainerDark: {
        width: 25,
        height: 25,
        borderRadius: 25,
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
        alignSelf: "flex-end"


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