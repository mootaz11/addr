import React, { useState } from 'react'
import { View, Text, StyleSheet, Platform, Image, ScrollView, TouchableOpacity, Button } from 'react-native'
import { TextInput, Paragraph } from 'react-native-paper';
import _ from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import QRCode from 'react-native-qrcode-svg';



const mon_code = "moota12345";
const conversation_init = {
    users: ["25417290", "28896426"],
    messages: [

        {
            sender: "25417290",
            content: "bonjour mootaz cv !",
            code: "123",
            date: "12.45"
        },


        {
            sender: "28896426",
            content: "bonjour akram aya wineek  brabbi bech nass2lek ye5i chbi walid l 7anout aamalek hakkak ken jit kifek nkalmlloul 7akem  allahh yahddik a bro w khw  !",
            code: "124",
            date: "12.47"
        },


        {
            sender: "25417290",
            content: "hani kel aada ntab3ou fel denia !",
            code: "125",
            date: "12.55"
        },


        {
            sender: "28896426",
            content: "labess sa7bi nchhlh rabbi maak !",
            code: "126",
            date: "12.45"
        },
        {
            sender: "25417290",
            content: "aaa",
            code: "126",
            date: "12.45"
        },
        {
            sender: "25417290",
            content: "a",
            code: "126",
            date: "12.45"
        }


    ],
};

const current_user_id = "25417290";


export default function Conversation(props) {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(conversation_init.messages);
    const [conversation, setConversation] = useState(conversation_init)
    const [moncode, setMoncode] = useState(mon_code);
    

    const sendQrCode= ()=>{
        setMessages(messages => [...messages, {
            sender: "28896426",
            content: "mon code est : "+moncode,
            date: new Date().toISOString().split("T")[1].split(":")[0].toString() + ":" + new Date().toISOString().split("T")[1].split(":")[1].toString(),
            code: "128"
        }]
        )

    }

    const sendMessage = () => {

        setMessages(messages => [...messages, {
            sender: "28896426",
            content: message,
            date: new Date().toISOString().split("T")[1].split(":")[0].toString() + ":" + new Date().toISOString().split("T")[1].split(":")[1].toString(),
            code: "128"
        }]
        )
        setMessage("");



    }





    const goBack = () => {
        props.navigation.navigate("chat");
    }
    return (
        <View style={styles.container}>
            <View style={styles.menu}>
                <FontAwesome color={"white"} style={{  padding: 0, fontSize: 20 }} name="arrow-left" onPress={goBack} />
                <Image style={styles.friendImage} source={props.route.params.value.image} />
                <Text style={styles.Title}>{props.route.params.value.name ? props.route.params.value.name : props.route.params.value.sender}</Text>
            </View>
            <ScrollView style={styles.ConversationBody}
            >

                {
                    messages.length > 0 ?
                        messages.map((message, index) => {
                            return (
                                message.sender == current_user_id ?

                                    (<View style={styles.messageSentContainer} key={index}>
                                        <Image style={styles.userImage} source={require("../assets/mootaz.jpg")} />
                                        <View style={styles.messageSent}>
                                              <Text style={styles.textMessage}>{message.content}</Text>
                                           { message.content =="mon code est : "+moncode ? 
                                         (  <QRCode
                                                value={mon_code}
                                                
                                            />)

                                            :null
                                          }
                                        </View>
                                        <Text style={styles.userTime}>{message.date}</Text>

                                    </View>
                                    ) :
                                    (
                                        <View style={styles.FriendmessageSentContainer} key={index}>
                                            <Text style={styles.FriendTime}>{message.date}</Text>

                                            <View style={styles.FriendmessageSent}>
                                                <Text style={styles.textMessage}>{message.content}</Text>
                                                { message.content =="mon code est : "+moncode ? 
                                                (  <QRCode
                                                       
                                                       value={mon_code}
                                                       
                                                   />)
       
                                                   :null
                                                 }
       
                                                </View>
                                            <Image style={styles.FriendImage} source={props.route.params.value.image} />

                                        </View>
                                    )
                            )

                        })
                        : null
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
        padding: 6,
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
        left: "75%",
        bottom: 1,
        fontSize: 12,
        color: "grey"

    }





})