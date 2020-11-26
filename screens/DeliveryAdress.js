import React, { useState, useEffect, useContext } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text, TextInput } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { set } from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const deliveryOptions = [
    { name: "Sara", price: 20, ratings: 5, workdays: "4-7 jours ouvrés", _id: "55", image: require("../assets/mootaz.jpg") },
    { name: "Saleh", price: 25, ratings: 3, workdays: "4-7 jours ouvrés", _id: "56", image: require("../assets/mootaz.jpg") },
    { name: "Ammar", price: 24, ratings: 5, workdays: "4-7 jours ouvrés", _id: "57", image: require("../assets/mootaz.jpg") },
    { name: "Mohamed", price: 15, ratings: 0, workdays: "4-7 jours ouvrés", _id: "85", image: require("../assets/mootaz.jpg") },
]
export const  generateRatings = (id,delivery)=>{
    let rating = deliveryOptions[deliveryOptions.findIndex(item=>{return item._id==id})].ratings;
    let ratingsTab=[];
    for (let i = 0;i<rating;i++)
    {
        ratingsTab.push(
             <FontAwesome key={i} color={delivery && id==delivery._id ? "white" :"black"} style={{  fontSize: 16, fontWeight: "600" }} name="star" />
  )
    }
    if(ratingsTab.length>0){
        return ratingsTab

    }
    else {
        return <Text  style={delivery && id==delivery._id ?{  fontSize: 16,color:"white" }:{  fontSize: 16 }}>no ratings</Text>
    }
}
export default function deliveryAdress(props) {
    const [locationChosen,setlocationChosen]=useState(false)
    const [deliveryOption,setDeliveryOption]=useState(null);
    const [phoneNumber,setPhoneNumber]=useState("");
    const [dark,setDark]=useState(true)
    
    const goBack = () => {
        props.navigation.navigate("bag")
    }

    const checkReview =()=>{
        props.navigation.navigate("orderReview")
    }
    



    return (
        <View style={dark ? styles.containerDark : styles.container}>

            <View style={dark  ? styles.menuDark : styles.menu}>
                <TouchableOpacity style={styles.leftArrowContainer} onPress={goBack}>
                    <View >
                        <Image style={styles.leftArrow} source={dark ? require("../assets/left-arrow-dark.png"):require("../assets/left-arrow.png")} />
                    </View>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={dark ?  styles.TitleDark:styles.Title}>delivery address</Text>
                </View>

            </View>


            <View style={styles.infoadressContainer}>
                <View style={styles.getDeliveryTo}>
                    <Text style={dark ? { fontSize: 20, fontWeight: "700" ,color:"white"}: { fontSize: 20, fontWeight: "700" }}>Get delivery to your</Text>
                </View>
                <TouchableOpacity style={locationChosen ?  styles.otherPosition :(dark ? styles.homeDark: styles.home) } onPress={()=>{setlocationChosen(locationChosen=>!locationChosen)}}>
                    <View style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Text style={locationChosen ? { fontSize: 18, fontWeight: "400", color: "white" }:(dark ? {fontSize:18,fontWeight:"400",color:"white"}:{ fontSize: 18, fontWeight: "400", color: "black" })}>Home</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity  style={!locationChosen ? styles.otherPosition : (dark ?styles.homeDark : styles.home)} onPress={()=>{setlocationChosen(locationChosen=>!locationChosen)}}>
                    <View style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Text style={!locationChosen ? { fontSize: 18, fontWeight: "400", color: "white" }:(dark ? {fontSize:18,fontWeight:"400",color:"white"}:{ fontSize: 18, fontWeight: "400", color: "black" })}>Other position</Text>
                    </View>
                </TouchableOpacity>
                <View style={dark ? styles.phoneNumberContainerDark :styles.phoneNumberContainer}>
                    <Image style={{ width: "20%", height: "50%", resizeMode: "contain" }} source={require("../assets/phone_delivery.png")} />
                    <TextInput placeholder={"PHONE NUMBER"} placeholderTextColor={dark ?"white" :"#bfbfbf"} style={dark ?{ width: "80%", height: "50%", borderBottomColor: "#121212" }: { width: "80%", height: "50%", borderBottomColor: "#bfbfbf", }} />
                </View>


            </View>

            <View style={{ width: "100%", height: "10%", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <View style={dark ? { borderColor: "white", borderWidth: 1, width: "94%", height: 1 }:{ borderColor: "#bfbfbf", borderWidth: 1, width: "94%", height: 1 }}></View>
            </View>

            <View style={styles.deliveries}>
                <Text style={dark ? {fontSize:20,fontWeight:"600",color:"white"}:{fontSize:20,fontWeight:"600"}}>Choose your delivery Option</Text>
                <FlatList data={deliveryOptions}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={()=>{setDeliveryOption(item)}}>

                        <View style={deliveryOption && item._id == deliveryOption._id ? styles.deliveryOptionChosen:(dark ? styles.deliveryOptionDark : styles.deliveryOption)}>
                            <View style={styles.deliveryOptionContainer}>
                                <View style={styles.deliveryImageContainer}>
                                    <Image style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 12 }} source={item.image} />
                                </View>
                                <View style={styles.deliveryOptionInfoContainer}>
                                    <View style={styles.delivererInfo}>
                                        <Text style={ deliveryOption && item._id == deliveryOption._id ?{textAlign:"center" ,fontSize:15,fontWeight:'600',color:"white"}:(dark ? {textAlign:"center" ,fontSize:15,fontWeight:'600',color:"white"}:{textAlign:"center" ,fontSize:15,fontWeight:'600'})}>name : {item.name}</Text>
                                        <Text style={ deliveryOption && item._id == deliveryOption._id ?{textAlign:"center" ,fontSize:15,fontWeight:'600',color:"white"}:(dark ? {textAlign:"center" ,fontSize:15,fontWeight:'600',color:"white"}:{textAlign:"center" ,fontSize:15,fontWeight:'600'})}>price : {item.price} TND</Text>
                                    </View>
                                    
                                    <View style={styles.ratingsContainer}>
                                        { 
                                            (generateRatings(item._id,deliveryOption))
                                        }
                                        
                                    </View>
                                </View>
                                <View style={styles.openDays}>
                                <View style={styles.delivererInfo}>
                                        <Text style={deliveryOption && item._id==deliveryOption._id ?{textAlign:"center" ,fontSize:16,fontWeight:'600',color:"white"}:(dark ?{textAlign:"center" ,fontSize:16,fontWeight:'600',color:"white"}: {textAlign:"center" ,fontSize:16,fontWeight:'600'})}>{item.workdays}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                        </TouchableOpacity>

                    }

                    keyExtractor={item => item._id}

                >

                </FlatList>

            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={checkReview}>
                    <View style={{ height: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "white" }}>NEXT</Text>
                    </View>
                </TouchableOpacity>

            </View>



        </View>
    )
}


const styles = StyleSheet.create({
    addButton:{
        height:"60%",
        width:"92%",
        borderRadius:8,
        backgroundColor: "#2474F1",
        flexDirection: "column", 
        justifyContent: "center",
         alignItems: "center" ,
    },
    buttonContainer:{
        width:"100%",
        height:"10%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    openDays:{
        width:"42%",
        height: "98%",

    },
    deliveryOption: {
        width: "92%",
        height: 90,
        flexDirection: "column",
        borderRadius: 12,
        marginVertical: 8,
        alignSelf: "center",
        justifyContent:"center",
        shadowOffset:{height:1,width:1},
        shadowOpacity:0.2,
        borderRadius:12,
        shadowColor:"#ededed"

    },
    deliveryOptionDark:{
        width: "92%",
        height: 90,
        flexDirection: "column",
        borderRadius: 12,
        marginVertical: 8,
        alignSelf: "center",
        justifyContent:"center",
        shadowOffset:{height:1,width:1},
        shadowOpacity:0.2,
        borderRadius:12,
        shadowColor:"#ededed",
        backgroundColor:"#292929"
    },
    deliveryOptionChosen: {
        width: "92%",
        height: 90,
        flexDirection: "column",
        borderRadius: 12,
        marginVertical: 8,
        alignSelf: "center",
        justifyContent:"center",
        backgroundColor: "#2474F1",
        shadowOffset:{height:1,width:1},
        shadowOpacity:0.2,
        borderRadius:12,
        shadowColor:"#ededed"

    },


    deliveryOptionContainer:{
        height:"96%",
        width:"96%",
        flexDirection: "row",
        alignItems:"center",

    },
    deliveryImageContainer: {
        width: "22%",
        height: "98%",
        borderRadius: 12,
    },
    deliveryOptionInfoContainer: {
        width: "36%",
        height: "92%",
        alignItems:"center",
        flexDirection:"column"
    },
    delivererInfo:{
        width:"100%",
        height:"50%",
        marginVertical:4
    },
    
    ratingsContainer:{
        width:"100%",
        height:"45%",
        alignItems:"center",
        flexDirection:"row",
        justifyContent:"center"

    },
    deliveries: {
        width: "100%",
        height: "45%",
        flexDirection: "column",
        justifyContent: "center",


    },
    otherPosition: {
        width: "95%",
        height: "20%",
        margin: 6,
        alignSelf: "center",
        backgroundColor: "#2474F1",
        borderRadius: 14,


    },

    home: {
        width: "95%",
        height: "20%",
        margin: 6,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        borderRadius: 14,
    },
    homeDark:{
        backgroundColor:"#292929",
        width: "95%",
        height: "20%",
        margin: 6,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        borderRadius: 14,

    },
    phoneNumberContainer: {
        width: "95%",
        height: "20%",
        margin: 6,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "#bfbfbf",
        borderLeftColor: "white",
        borderRightColor: "white",
        borderTopColor: "white",
        borderWidth: 1

    },     

    phoneNumberContainerDark:{
        width: "95%",
        height: "20%",
        margin: 6,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "#292929",
        borderLeftColor: "#292929",
        borderRightColor: "#292929",
        borderTopColor: "#292929",
        borderWidth: 1,
        borderRadius:10
    },
    getDeliveryTo: {
        width: "95%",
        height: "20%",
        margin: 4,
        alignSelf: "center"

    },
    infoadressContainer: {
        width: "80%",
        height: "25%",
    },

    container: {
        backgroundColor: "white",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,

    },
    containerDark:{
        backgroundColor: "white",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "#121212",

    },
    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
        marginBottom: 8
    },
    menuDark:{
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",
        marginBottom: 8

    },
    leftArrowContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    leftArrow: {
        width: 30,
        height: 30
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
        fontSize: 28
    },
    TitleDark:{
        fontWeight: "700",
        fontSize: 28,
        color:"white"

    }


})