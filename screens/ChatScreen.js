import React,{useContext, useEffect, useState} from 'react';
import { View, Text, StyleSheet,Platform,Image,TouchableOpacity} from 'react-native';
import { Icon } from 'react-native-elements';
import { ScrollView ,FlatList } from 'react-native-gesture-handler';
import AuthContext from '../navigation/AuthContext';
import _ from 'lodash';



export default function Chat({navigation}){
    const context = useContext(AuthContext);
    const [conversations,setConversations]=useState(context.conversations);
    const [user,setUser]=useState(context.user)
    const [notSeenConversations,setnotSeenConversations] = useState(context.notSeenConversations);    
    const [SeenConversations,setSeenConversations] = useState(context.seenConversations)
    const [dark,setDark]=useState(true);


    useEffect(()=>{
        setDark(context.darkMode)
        setConversations(context.conversations);
        setnotSeenConversations(context.notSeenConversations);
        setSeenConversations(context.seenConversations);
        

    },[context.conversations,context.notSeenConversations,context.seenConversations,context.socket,context.darkMode])
    
        
    
    const checkConversation =(conversation)=>{
    navigation.navigate("conversation",{conversation,chat:true})
}
const  openDrawer =()=>{
    navigation.openDrawer();
}


return(
    <View style={dark ? styles.containerDark :styles.container}>
    <View style={styles.menu}>
        <Icon color={"white"} style={{ flex: 1, padding: 0 }} name="menu" onPress={openDrawer} />
        <Text style={styles.Title}>Chat</Text>
     </View>
        <ScrollView style={styles.friends}
          horizontal
          showsHorizontalScrollIndicator={false}
          >
           {
               conversations ? 
               conversations.map((conversation,key)=>{
                   return (
                    <View style={styles.friendContainer} key={key}>
                        <TouchableOpacity onPress={()=>{checkConversation(conversation)}}>
                            <View  style={styles.headUserImageContainer}>
                             <Image style={styles.headUserImage} source = {conversation.users[conversation.users.findIndex(u=>{return u._id != user._id})].photo ? {uri:conversation.users[conversation.users.findIndex(u=>{return u._id != user._id})].photo} : require('../assets/user_image.png')}/>
                             <Text style={styles.friendHeadName}>{conversation.type=="personal" ? conversation.users[conversation.users.findIndex(u=>{return u._id != user._id})].firstName+" "+conversation.users[conversation.users.findIndex(u=>{return u._id != user._id})].lastName: conversation.lastName }</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                   )
               })
               :null
           }

            

        </ScrollView>
     <View style={dark ? styles.conversationsDark :styles.conversations}>
         <View style={styles.convContainer} >
                 <View style={styles.conversationImagecontainer}>
                 {notSeenConversations ? 
                 <FlatList
                    data={notSeenConversations}
                    renderItem={({ item }) =>
                <TouchableOpacity   onPress={() => {checkConversation(item)}}>
                  <View style={styles.conversationContainer} >
                        <View style={styles.ConvimageContainer}>
                            <Image source = {item.users[item.users.findIndex(u=>{return u._id != user._id})].photo ? {uri:item.users[item.users.findIndex(u=>{return u._id != user._id})].photo} : require('../assets/user_image.png')} style={styles.convImage}/>
                        </View>
                        <View style={styles.messageBody}>
                            <Text style={dark ? styles.senderDark : styles.sender}>{item.type=="personal" ? item.users[item.users.findIndex(u=>{return u._id != user._id})].firstName+" "+item.users[item.users.findIndex(u=>{return u._id != user._id})].lastName: item.title }</Text>
                            <Text numberOfLines={1}  style={styles.message}>{item.messages[item.messages.length-1].content.length>20 ? item.messages[item.messages.length-1].content.substr(0,20)+"...":item.messages[item.messages.length-1].content}</Text>
                        </View>
                        <View style ={styles.messageMeta}>
                        <Text style={styles.time}>{item.messages[item.messages.length-1].date.split('T')[1].split(':')[0]+":"+item.messages[item.messages.length-1].date.split('T')[1].split(':')[1]}</Text>
                       {
                           item.notSeen>0 ?
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
            :null
            }

{SeenConversations ? 
                 <FlatList
                    data={SeenConversations}
                    renderItem={({ item }) =>
                <TouchableOpacity   onPress={() => {checkConversation(item)}}>
                  <View style={styles.conversationContainer} >
                        <View style={styles.ConvimageContainer}>
                        <Image source = {item.users[item.users.findIndex(u=>{return u._id != user._id})].photo ? {uri:item.users[item.users.findIndex(u=>{return u._id != user._id})].photo} : require('../assets/user_image.png')} style={styles.convImage}/>
                        </View>
                        <View style={styles.messageBody}>
                            <Text style={dark ? styles.senderDark : styles.sender}>{item.type=="personal" ? item.users[item.users.findIndex(u=>{return u._id != user._id})].firstName+" "+item.users[item.users.findIndex(u=>{return u._id != user._id})].lastName: item.title }</Text>
                            <Text numberOfLines={1}  style={styles.message}>{item.messages[item.messages.length-1].content.length>20 ? item.messages[item.messages.length-1].content.substr(0,20)+"...":item.messages[item.messages.length-1].content}</Text>
                        </View>
                        <View style ={styles.messageMeta}>
                        <Text style={styles.time}>{item.messages[item.messages.length-1].date.split('T')[1].split(':')[0]+":"+item.messages[item.messages.length-1].date.split('T')[1].split(':')[1]}</Text>
                       {
                           item.notSeen>0 ?
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
            :null
            }

                 </View>
        </View>
     </View>

</View>
)

        }


const styles = StyleSheet.create({
    seen:{
        backgroundColor:"red",
        borderRadius:3,
        flexDirection:"column",
        flexWrap:"wrap",
        justifyContent:"center",
        alignItems:"center",
        margin:2,
        padding:2
    },
seenNumber:{
    color:"white",
    fontSize:11
},
    container:{
        flex:1,
        backgroundColor:"#2474F1"
    },
    containerDark:{
        flex:1,
        backgroundColor:"#292929"
    },
    menu: {

        position: "absolute",
        marginTop: Platform.OS == 'ios' ? 30 : 20,
        flexDirection: "row",
        alignSelf: "flex-start",
        alignContent:"space-between",
        padding: 10,
        shadowOpacity: 0.5,
        elevation: 10,
        alignItems:"center"
    
      },
      Title:{
          fontSize:22,
          color:"white",
          fontWeight:"600",
          letterSpacing:1,
          justifyContent:"center",
          marginHorizontal:5
        },
        conversations:{
            width:"100%",
            height:"70%",   
            position:"absolute",
            top:"30%",
            elevation: 10,
            backgroundColor:"white",
            borderTopRightRadius:15,
            borderTopLeftRadius:15,
            justifyContent:"center",
            alignItems:"center"
        },
        conversationsDark:{
            width:"100%",
            height:"70%",   
            position:"absolute",
            top:"30%",
            elevation: 10,
            backgroundColor:"#121212",
            borderTopRightRadius:15,
            borderTopLeftRadius:15,
            justifyContent:"center",
            alignItems:"center"
        },
        friends:{
            height:"18%",   
            position:"absolute",
            width:"100%",
            top:"11%",
            elevation: 10,
        },
        
        friendContainer:{
            alignItems: "center",
            justifyContent: "center",
            alignContent:"center",
            flexDirection: "column",
            flexWrap:"wrap",
            overflow: "hidden",
            margin:8,
        },
        headUserImageContainer:{
            justifyContent: "center",
            flexDirection: "column",
            alignItems:"center",
            flexWrap:"wrap",
            margin:2,
        },
        headUserImage:{
            height:60,
            width:60,
            borderRadius:60,
            resizeMode:"cover",

            

            },
            friendHeadName:{
                color:"white"
                ,fontSize:15,
                marginVertical:"1%",
                fontWeight:"100",
                letterSpacing:1
                
            },
            convContainer:{
                width:"100%",
                height:"80%",
                
            },
            conversationContainer:{
                height:100,
                width:"100%",
                flexDirection:"row",
                margin:10
            },
            ConvimageContainer:{
                width:"20%",
                height:"100%",
                justifyContent:"center"
            },
            messageBody:{
                padding:"5%",
                width:"60%",
                height:"100%",
                justifyContent:"center",
                flexDirection:"column",
            },
            messageMeta:{
                width:"20%",
                height:"100%",
                justifyContent:"center",
                flexDirection:"column",
                padding:"5%",
                alignItems:"center"



            },
            convImage:{
                width:70,
                height:70,
                borderRadius:70,
                resizeMode:"cover"
            },
            sender:{
                margin:2,
                fontSize:13,
                color:"black",
                fontWeight:"700",
            },
            senderDark:{
            margin:2,
            fontSize:13,
            color:"white",
            fontWeight:"700",
            },
            message:{
                color:"#bababa",
                overflow:"visible",
                fontSize:15,
                
            
            },
            time:{
                color:"#bababa",
                overflow:"visible",
                fontSize:12

            }

            
        
})


