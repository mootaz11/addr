import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native';
import { Platform } from 'react-native';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import AuthContext from '../navigation/AuthContext';
import {getUserNotifications} from '../rest/userApi';


export default function Notifications(props){
    const context = useContext(AuthContext);
    const [limite,setLimite]=useState(20);

        console.log(context.notifications[0])
    const goBack = () => {props.navigation.goBack()}


const handleloadMore =()=>{
    setLimite(limite=>limite+10);
        getUserNotifications(context.total,limite).then(notifications=>{
            let new_notif = [...context.notifications,...notifications]            
            context.setNotifications(new_notif);
        });
}




    return (
        <SafeAreaView>
        <View style={context.darkMode ? styles.containerDark : styles.container}>
            <View style={context.darkMode ? styles.menuDark : styles.menu}>
                <TouchableOpacity style={styles.leftArrowContainer} onPress={goBack}>
                    <View >
                        <Image style={styles.leftArrow} source={context.darkMode ? require("../assets/left-arrow-dark.png") : require("../assets/left-arrow.png")} />
                    </View>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Notifications</Text>
                </View>
            </View>
            {
                context.notifications&&context.notifications.length>0 ? 
                <View style={styles.bagContainer}>
                <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.05, fontWeight: "500",color:"white" }:{ fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.05,color:"black", fontWeight: "500" }}>Notifications({context.total})</Text>
                <FlatList
                    data={context.notifications}
                    renderItem={
                        ({ item }) =>
                        <TouchableOpacity  onPress={()=>{}}>
                            <View style={context.darkMode ? styles.productContainerDark : styles.productContainer}>
                               
                                <View style={{ width: "30%", height: "100%", flexDirection: "column",justifyContent:"center"  ,borderRadius:12}}>
                                    <View style={{margin:4}}>
                                        <Text style={context.darkMode ? {textAlign:"left" ,fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"white"}:{textAlign:"left" ,fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"black"}}>User :</Text>
                                    </View>
                                    <View style={{margin:5}}>
                                        <Text style={context.darkMode ? {textAlign:"left",fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"white"} : {textAlign:"left",fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"black"}}>Date :</Text>
                                    </View>
                                    <View style={{flexWrap:"wrap",margin:5}}>
                                        <Text style={context.darkMode ? {textAlign:"left",fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"white"} : context.darkMode ? {textAlign:"left",fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"white"} : {textAlign:"left",fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"black"}}>Content :</Text>
                                    </View>
                                </View>


                                <View style={{ width: "40%", height: "100%", flexDirection: "column",justifyContent:"center",borderRadius:12 }}>
                                <View style={{margin:5}}>
                                        <Text style={{textAlign:"left" ,fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"#2474F1"}}>{item.user.firstName +" "+item.user.lastName}</Text>
                                    </View>
                                    <View style={{marginVertical:5}}>
                                        <Text style={context.darkMode ? {textAlign:"left",fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"white"} : {textAlign:"left",fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"black"}}>{item.date ? item.date.toString().split('T')[0]:''}</Text>
                                    </View>
                                    <View style={{margin:5}}>
                                        <Text style={context.darkMode ? {textAlign:"left",fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"white"} : {textAlign:"left",fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.03,fontWeight:"500",color:"black"}}>{item.content}</Text>
                                    </View>
                    
                                </View>
                                <View style={{ width: "30%", height: "100%", flexDirection: "column",justifyContent:"center",alignItems:"center",borderRadius:12 }}>
                                    <View style={{width:Dimensions.get("screen").width*0.17,height:Dimensions.get("screen").width*0.17,borderRadius:Dimensions.get("screen").width*0.17,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
                                    <Image style={{width:Dimensions.get("screen").width*0.17,height:Dimensions.get("screen").width*0.17,borderRadius:Dimensions.get("screen").width*0.17,resizeMode:"cover"}} source={ item.partner ? {uri:item.partner.profileImage}:require("../assets/user_image.png")}/>
                                    </View>
                                </View>
                            </View>
                            </TouchableOpacity>
                    }
                    onEndReached={handleloadMore}
                    
                    onEndReachedThreshold={100}

                    keyExtractor={item => item._id}
                >

                </FlatList>
            </View>
        :
        <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <Image source={require("../assets/images/notification.png")} style={{ width:"50%",height:"50%"}}/>
            <Text style={context.darkMode ? {fontFamily:'PoppinsBold',fontSize:Dimensions.get("screen").width*0.08,marginTop:10,color:"white",textAlign:"center"}:{fontFamily:'PoppinsBold',fontSize:Dimensions.get("screen").width*0.08,marginTop:10,color:"black",textAlign:"center"}}>No notifications yet ! </Text>
        </View>
                }
        </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    addButton: {
        height: "80%",
        width: "92%",
        borderRadius: 8,
        backgroundColor: "#2474F1",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    cost: {
        height: "30%",

    },
    buttonContainer: {
        height: "45%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 4,


    },
    orderOverview: {
        width: "92%",
        height: "40%",
        marginVertical: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center"

    },
    finalSteps: {
        height: "15%",
        width: "100%",
    },

    bagContainer: {
        marginTop: 30,
        width: "90%",
        height: "77%",
        alignSelf: "center",
        flexDirection: "column",
        justifyContent: "center",
    },

    productContainer: {
        width: "100%",
        height: 120,
        alignSelf: "center",
        marginVertical: 10,
        flexDirection: "row",
        borderRadius: 12,
        backgroundColor:"white",
        shadowColor:Platform.OS=='ios' ?'grey':'black',
        shadowOpacity:0.5,
        borderWidth:3,
        shadowOffset: { width: 1, height: 2},
        borderColor:"white",
        elevation:Platform.OS=='android'?1:0,
        shadowRadius:2,
        
    },
    productContainerDark: {
        width: "100%",
        height: 120,
        alignSelf: "center",
        marginVertical: 10,
        flexDirection: "row",
        backgroundColor: "#292929",
        borderRadius: 12,


    },
    productImageContainer: {
        width: "50%",
        height: "100%",
        borderRadius: 12,
    },
    productImage: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
        resizeMode: "cover"
    },
    container: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "white"

    },
    containerDark: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "#121212",

    },
    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
        marginTop:15
    },
    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",
        marginTop:15

    },
    leftArrowContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    leftArrow: {
        width: Dimensions.get("screen").height * 0.04,
        height: Dimensions.get("screen").height * 0.04
        ,marginLeft:10
        
        

    },

    titleContainer: {
        width: "80%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    Title: {
        fontWeight: "700",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
        color:"black"
    },
    TitleDark: {
        fontWeight: "700",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
        color: "white"

    },
    searchContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    productInfoContainer: {
        width: "50%",
        height: "100%",
        flexDirection: "column",
    },

});