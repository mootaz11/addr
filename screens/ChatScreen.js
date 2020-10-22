import React,{useState} from 'react';
import { View, Text, StyleSheet,Platform,Image,TouchableOpacity} from 'react-native';
import { Icon } from 'react-native-elements';
import { ScrollView ,FlatList } from 'react-native-gesture-handler';

const latestMessages=[{
    sender:"JULIA TENDORI",
    id:"55",
    time:"17:45 ",
    message:"tnajem tjibli sandwich l win ne5dem svp !",
    image:require("../assets/julia.jpg")
},
{
    sender:"MIXMAX XXXXXX",
    id:"54",
    time:"12:30 ",
    message:"tnajem tjibli sandwich l win ne5dem svp !",
    image:require("../assets/papadom.png")
},
{
    sender:"MOOTAZ TENDORI",
    id:"57",
    time:"12:20 ",
    message:"tnajem tjibli sandwich l win ne5dem svp !",
    image:require("../assets/mootaz.jpg")
},
{
    sender:"BAHRI TENDORI",
    id:"77",
    time:"12:20 ",
    message:"tnajem tjibli sandwich l win ne5dem svp !",
    image:require("../assets/mixmax.png")
},

]
const usersConnected=[
{
    name:"Chinchin",
    id:"55",
    image:require("../assets/chinchin.png")
},
{
    name:"Mix Max",
    id:"545",
    image:require("../assets/mixmax.png")

},
{
    name:"Mootaz",
    id:"54",
    image:require("../assets/mootaz.jpg")

},
{
    name:"Julia",
    id:"54",
    image:require("../assets/julia.jpg")

},
{
    name:"papadam",
    id:"544",
    image:require("../assets/papadom.png")

},

];



export default function Chat({navigation}){
    const [groupChat,setGroupChat]= useState([]);
    const [personalChat,setPersonal]=useState([]);
const checkConversation =(value)=>{
    console.log(value)
    navigation.navigate("conversation",{value})
}
const  openDrawer =()=>{
    navigation.openDrawer();
}

return(
    <View style={styles.container}>
    <View style={styles.menu}>
        <Icon color={"white"} style={{ flex: 1, padding: 0 }} name="menu" onPress={openDrawer} />
        <Text style={styles.Title}>Chat</Text>
     </View>
        <ScrollView style={styles.friends}
          horizontal
          showsHorizontalScrollIndicator={false}
          >
           {
               usersConnected.map((value,key)=>{
                   return (
                    <View style={styles.friendContainer} key={key}>
                        <TouchableOpacity onPress={()=>{checkConversation(value)}}>
                            <View  style={styles.headUserImageContainer} >
                             <Image style={styles.headUserImage} source = {value.image}/>
                             <Text style={styles.friendHeadName}>{value.name}</Text>

                            </View>
                        </TouchableOpacity>
                    </View>
                   )
               })

           }

            

        </ScrollView>
     <View style={styles.conversations}>
         <View style={styles.convContainer} >
                 <View style={styles.conversationImagecontainer}>
                 <FlatList
                    data={latestMessages}
                    renderItem={({ item }) =>
                <TouchableOpacity   onPress={() => {checkConversation(item)}}>
                  <View style={styles.conversationContainer} >
                        <View style={styles.ConvimageContainer}>
                            <Image source={item.image} style={styles.convImage}/>
                        </View>
                        <View style={styles.messageBody}>
                            <Text style={styles.sender}>{item.sender}</Text>
                            <Text style={styles.message}>{item.message}</Text>
                        </View>
                        <View style ={styles.messageMeta}>
                        <Text style={styles.time}>{item.time}</Text>

                        </View>
                  </View>
                </TouchableOpacity>

              }

              keyExtractor={item => item.id}
            />

                 </View>
        </View>
     </View>

</View>
)

}



const styles = StyleSheet.create({
   

    container:{
        flex:1,
        backgroundColor:"#2474F1"
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
            borderTopRightRadius:"12%",
            borderTopLeftRadius:"12%",
            justifyContent:"center",
            alignItems:"center"
        },
        friends:{
            height:"18%",   
            position:"absolute",
            width:"100%",
            top:"10%",
            elevation: 10,
        },
        
        friendContainer:{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "15%",
            height:"87%",
            overflow: "hidden",
            margin:8,
        },
        headUserImageContainer:{
            justifyContent: "center",
            flexDirection: "column",
            alignItems:"center",
            width:100,
            height:100,
            margin:2,


        },
        headUserImage:{
            height:"70%",
            width:"70%",
            borderRadius:"50%",
            resizeMode:"cover",

            

            },
            friendHeadName:{
                color:"white"
                ,fontSize:"80%",
                margin:"1%",
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



            },
            convImage:{
                width:"98%",
                height:"88%",
                borderRadius:"50%",
                resizeMode:"cover"
            },
            sender:{
                margin:2,
                fontSize:"100%",
                color:"black",
                fontWeight:"700",
            },
            message:{
                color:"#bababa",
                overflow:"visible",
                fontSize:"80%"
            },
            time:{
                color:"#bababa",
                overflow:"visible",
                fontSize:"80%"

            }

            
        
})


