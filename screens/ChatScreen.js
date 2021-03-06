import React, { useContext,useState,useEffect } from 'react';
import { Dimensions } from 'react-native';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AuthContext from '../navigation/AuthContext';


export default function Chat({ navigation }) {
    const context = useContext(AuthContext);
    const checkConversation = (conversation) => {
        navigation.navigate("conversation", { conversation, chat: true })
    }

  
    
   
    const openDrawer = () => {
        navigation.openDrawer();
    }

    return (
        <View style={context.darkMode ? styles.containerDark : styles.container}>
            <View style={styles.menu}>
                <TouchableOpacity onPress={openDrawer} style={{ height: Dimensions.get("screen").height * 0.03,width:Dimensions.get("screen").height * 0.03,}}>
                    <Image source={require("../assets/menu_dark.png")} style={{ height: "80%", width: "80%", resizeMode: "cover" }} />
                </TouchableOpacity>
                <Text style={styles.Title}>Chat</Text>
            </View>

            <View style={styles.friends}>
                {context.conversations && context.conversations.length > 0 &&
                    <FlatList
                        horizontal
                        data={context.conversations}
                        renderItem={({ item }) =>
                            <View style={styles.friendContainer}>
                                <TouchableOpacity onPress={() => { checkConversation(item) }}>
                                    <View style={styles.headUserImageContainer}>
                                        <Image style={styles.headUserImage} source={
                                            item.type == "personal" ?
                                                item.users[item.users.findIndex(u => { return u._id != context.user._id })].photo?
                                                    { uri: item.users[item.users.findIndex(u => { return u._id != context.user._id })].photo }
                                                    :require('../assets/user_image.png')
                                                    :

                                                    item.partner?
                                                          (  (item.partner.managers.length>0&&item.partner.managers.findIndex(manager=>{return context.user._id ==manager.user})>=0)
                                                        ||  (item.partner.deliverers.length>0&&item.partner.deliverers.findIndex(deliverer=>{return context.user._id ==deliverer})>=0)
                                                        ||  item.partner.owner == context.user._id )? 
                                                         
                                                        item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                             &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})] ?

                                                             item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                                &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})].photo
                                                ?
                                                    {
                                                        uri:  
                                                        item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                           &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})].photo}
                                                        :
                                                        require("../assets/user_image.png")
                                                        :
                                                  
                                                  
                                                        {uri:item.image} 
                                                        :
                                                        {uri:item.image} 
                                         :{uri:item.image}           
                                        }
                                        />


                                        <Text numberOfLines={1} style={styles.friendHeadName}>{
                                            item.type == "personal" ?
                                                item.users[item.users.findIndex(u => { return u._id != context.user._id })].firstName ?
                                                    item.users[item.users.findIndex(u => { return u._id != context.user._id })].firstName : "" 
                                                    
                                                    
                                                    
                                                    :
                                                    
                                                    item.partner ? 
                                                    (  (item.partner.managers.length>0&&item.partner.managers.findIndex(manager=>{return context.user._id ==manager.user})>=0)
                                                  ||  (item.partner.deliverers.length>0&&item.partner.deliverers.findIndex(deliverer=>{return context.user._id ==deliverer})>=0)
                                                  ||  item.partner.owner == context.user._id )? 
                                                   
                                                  item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                       &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})] ?
                                                       
                                                       item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                        &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})].firstName:
                                                        item.title:item.title:item.title


                                              } </Text>

                                        <Text numberOfLines={1} style={styles.friendHeadName}>{
                                            item.type == "personal" ?
                                                item.users[item.users.findIndex(u => { return u._id != context.user._id })].lastName.length > 8
                                                    ?
                                                    item.users[item.users.findIndex(u => { return u._id != context.user._id })].lastName.substring(0, 8) + ".."
                                                    :
                                                    item.users[item.users.findIndex(u => { return u._id != context.user._id })].lastName
                                                :

                                                item.partner ? 
                                                (  (item.partner.managers.length>0&&item.partner.managers.findIndex(manager=>{return context.user._id ==manager.user})>=0)
                                              ||  (item.partner.deliverers.length>0&&item.partner.deliverers.findIndex(deliverer=>{return context.user._id ==deliverer})>=0)
                                              ||  item.partner.owner == context.user._id )? 
                                               
                                              item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                   &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})] ?
                                                   
                                                   item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                    &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})].lastName.length>8 ? 
                                                    item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                        &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})].lastName.substring(0, 8) + "..":
                                                        item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                            &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})].lastName
                                                    
                                                    :
                                                    "":"":""

                                        }</Text>


                                    </View>
                                </TouchableOpacity>
                            </View>

                        }
                        keyExtractor={item => item._id}
                    />

                }
            </View>




            <View style={context.darkMode ? styles.conversationsDark : styles.conversations}>
                <View style={styles.convContainer} >
                    {context.conversations &&context.conversations.length>0?
                        <FlatList
                            data={context.conversations}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => { checkConversation(item) }}>
                                    <View style={styles.conversationContainer} >
                                        <View style={styles.ConvimageContainer}>
                                            <Image style={styles.headUserImage} source={
                                              item.type == "personal" ?
                                              item.users[item.users.findIndex(u => { return u._id != context.user._id })].photo?
                                                  { uri: item.users[item.users.findIndex(u => { return u._id != context.user._id })].photo }
                                                  :require('../assets/user_image.png')
                                                  :

                                                  item.partner?
                                                        (  (item.partner.managers.length>0&&item.partner.managers.findIndex(manager=>{return context.user._id ==manager.user})>=0)
                                                      ||  (item.partner.deliverers.length>0&&item.partner.deliverers.findIndex(deliverer=>{return context.user._id ==deliverer})>=0)
                                                      ||  item.partner.owner == context.user._id )? 
                                                       
                                                      item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                           &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})] ?

                                                           item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                              &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})].photo
                                              ?
                                                  {
                                                      uri:  
                                                      item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                         &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})].photo}
                                                      :
                                                      require("../assets/user_image.png")
                                                      :
                                                
                                                
                                                      {uri:item.image} 
                                                      :
                                                      {uri:item.image} 
                                       :{uri:item.image}           

                                            }
                                            />
                                        </View>
                                        <View style={styles.messageBody}>
                                            <Text style={context.darkMode ? styles.senderDark : styles.sender}>{
                                                item.type == "personal" ?
                                                item.users[item.users.findIndex(u => { return u._id != context.user._id })].firstName ?
                                                    item.users[item.users.findIndex(u => { return u._id != context.user._id })].firstName+" "
                                                    +item.users[item.users.findIndex(u => { return u._id != context.user._id })].lastName : "" 
                                                    
                                                    
                                                    
                                                    :
                                                    
                                                    item.partner ? 
                                                    (  (item.partner.managers.length>0&&item.partner.managers.findIndex(manager=>{return context.user._id ==manager.user})>=0)
                                                  ||  (item.partner.deliverers.length>0&&item.partner.deliverers.findIndex(deliverer=>{return context.user._id ==deliverer})>=0)
                                                  ||  item.partner.owner == context.user._id )? 
                                                   
                                                  item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                       &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})] ?
                                                       
                                                       item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                        &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})].firstName+" " +  
                                                        
                                                        item.users[item.users.findIndex(user=>{return (item.partner.managers.findIndex(manager=>{return manager.user==user._id})==-1
                                                        &&item.partner.deliverers.findIndex(del=>{return del==user._id})==-1) && item.partner.owner != user._id})].lastName
                                                        
                                                        :
                                                        item.title:item.title:item.title

                                            }</Text>
                                            <Text numberOfLines={1} style={styles.message}>{item.messages[item.messages.length - 1].content.length > 20 ? item.messages[item.messages.length - 1].content.substr(0, 20) + "..." : item.messages[item.messages.length - 1].content}</Text>
                                        </View>
                                        <View style={styles.messageMeta}>
                                            <Text style={styles.time}>{item.messages[item.messages.length - 1].date.split('T')[1].split(':')[0] + ":" + item.messages[item.messages.length - 1].date.split('T')[1].split(':')[1]}</Text>
                                            {
                                                item.notSeen > 0 ?
                                                    <View style={styles.seen}>
                                                        <Text style={styles.seenNumber}>{item.notSeen.toString()}</Text>
                                                    </View>
                                                    : null
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            }

                            keyExtractor={item => item._id}
                        />
                        : null
                    }

                </View>
            </View>
        </View>

    )

}


const styles = StyleSheet.create({
    seen: {
        backgroundColor: "red",
        borderRadius: 3,
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        margin: 2,
        padding: 2
    },
    seenNumber: {
        color: "white",
        fontFamily:'Poppins',fontSize: 11,
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
    Title: {
        fontFamily:'Poppins',fontSize: 22,
        color: "white",
        fontWeight: "600",
        letterSpacing: 1,
        justifyContent: "center",
        marginHorizontal: 5
    },
    conversations: {
        width: "100%",
        height: "70%",
        position: "absolute",
        top: "30%",
        elevation: 10,
        backgroundColor: "white",
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    conversationsDark: {
        width: "100%",
        height: "70%",
        position: "absolute",
        top: "30%",
        elevation: 10,
        backgroundColor: "#121212",
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    friends: {
        height: "20%",
        position: "absolute",
        width: "100%",
        top: "11%",
        elevation: 10,
    },

    friendContainer: {
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        flexDirection: "column",
        width: Dimensions.get("screen").height * 0.12,
        height: Dimensions.get("screen").height*0.16,
        overflow: "hidden",
        margin:  Dimensions.get("screen").width*0.01,
    
    },
    headUserImageContainer: {
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width:"100%",
        height:"100%",
       
    },
    headUserImage: {
        height: Dimensions.get("screen").width*0.17,
        width: Dimensions.get("screen").width*0.17,
        borderRadius: Dimensions.get("screen").width*0.17,
        resizeMode: "cover",



    },
    friendHeadName: {
        color: "white"
        , fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03,
        fontWeight: "100",
        letterSpacing: 1,
        textAlign: "center"

    },
    convContainer: {
        width: "100%",
        height: "80%",

    },
    conversationContainer: {
        height: 60,
        width: "100%",
        flexDirection: "row",
        margin: 10
    },
    ConvimageContainer: {
        width: "20%",
        height: "100%",
        justifyContent: "center"
    },
    messageBody: {
        padding: "5%",
        width: "60%",
        height: "100%",
        justifyContent: "center",
        flexDirection: "column",
    },
    messageMeta: {
        width: "20%",
        height: "100%",
        justifyContent: "center",
        flexDirection: "column",
        padding: "5%",
        alignItems: "center"



    },
    convImage: {
        width: 70,
        height: 70,
        borderRadius: 70,
        resizeMode: "cover"
    },
    sender: {
        margin: 2,
        fontFamily:'Poppins',fontSize: 13,
        color: "black",
        fontWeight: "700",
    },
    senderDark: {
        margin: 2,
        fontFamily:'Poppins',fontSize: 13,
        color: "white",
        fontWeight: "700",
    },
    message: {
        color: "#bababa",
        overflow: "visible",
        fontFamily:'Poppins',fontSize: 15,


    },
    time: {
        color: "#bababa",
        overflow: "visible",
        fontFamily:'Poppins',fontSize: 12

    }



})


