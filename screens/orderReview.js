import React, { useState, useEffect, useContext } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text,ActivityIndicator } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import {getOrder} from '../rest/ordersApi';


export default function orderReview(props) {
    const [dark,setDark]=useState(true);
    const [orderReview,setOrderReview]=useState(null);
    useEffect(()=>{
            getOrder(props.route.params.order).then(order=>{
                console.log(order);
                setOrderReview(order);
            })
            .catch(err=>{
                alert("error occured");
            })
    },[props.route.params])
    

    const goToDeliveryAdress = ()=>{
        props.navigation.navigate("deliveryAdress")
    }
    if(orderReview){
    return (
        <View style={dark ? styles.containerDark : styles.container}>

            <View style={dark ? styles.menuDark : styles.menu}>
                <TouchableOpacity style={styles.leftArrowContainer} onPress={goToDeliveryAdress}>
                    <View >
                        <Image style={styles.leftArrow} source={ dark ? require("../assets/left-arrow-dark.png") : require("../assets/left-arrow.png")} />
                    </View>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={dark ? styles.TitleDark : styles.Title}>Review your order</Text>
                </View>

            </View>
            <View style={styles.orderInfo}>
                <View style={styles.orderInfoContainer}>
                    <View style={styles.clientInfo}>
                        <View style={styles.info}>
                            <Text style={dark ? {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color:"white"}: {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>{orderReview.client.firstName+" "+orderReview.client.lastName}</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={dark ? {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color:"white"}:{fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>Client code: {orderReview.client.locationCode}</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={dark ? {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color:"white"}:{fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>kssar hellel,</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={dark ? {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color:"white"} : {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>Monastir</Text>
                        </View>
                       
                    </View>
                    <View style={styles.orderPaymentInfo}>

                    <View style={styles.info}>
                            <Text style={dark ? {fontSize:Dimensions.get("screen").width*0.035,fontWeight:"500",color:"white"} : {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>phone number : 28896426</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={{fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color: "#2474F1"}}>payment method</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={dark ? {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color:"white"} : {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>cash on delivery</Text>
                        </View>

                    </View>
                </View>
            </View>
            <View style={styles.bagContainer}>
                <FlatList
                    data={orderReview.type=="food" ? orderReview.foodItems : orderReview.items}
                    renderItem={
                        ({ item }) =>
                        <View style={dark ? styles.productContainerDark : styles.productContainer}>
                        <View style={styles.productImageContainer}>
                            <Image style={styles.productImage} source={item.product.mainImage} />

                        </View>
                        <View style={styles.productInfoContainer}>
                            <View style={{ width: "92%", height: "20%", marginVertical: 4, alignSelf: "center" }}>
                                <Text style={dark ? { fontSize: 17, fontWeight: "700" ,color:"white"}:{ fontSize: 17, fontWeight: "700" }}>{item.product.name}</Text>
                            </View>
                            <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                <Text style={dark ? { fontSize: 20, fontWeight: "700",color:"white" } :{ fontSize: 20, fontWeight: "700" }}>{item.product.basePrice} TND</Text>
                            </View>
                            <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                <Text style={dark ? { fontSize: 20, fontWeight: "700",color:"white" } :{ fontSize: 20, fontWeight: "700" }}>{item.product.basePrice} TND</Text>
                            </View>
                            <View style={{ width: "92%", height: "15%", marginVertical: 4, alignSelf: "center" }}>
                                {/* <Text style={dark ?{ fontSize: 14 ,color:"white"} :{ fontSize: 14 }}>{item.color}</Text>
                                <Text style={dark ?{ fontSize: 14,color:"white" }:{ fontSize: 14 }}>{item.size}</Text> */}
                            </View>
                            <View style={{ width: "92%", height: "18%", marginVertical: 4, alignSelf: "center", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  

                                <View style={{ width: "30%", height: "100%", marginHorizontal: 6, borderWidth: 3, borderColor: "#bfbfbf", borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                    <Text  style={dark ? { fontSize: 20, fontWeight: "400" ,color:"white"}:{ fontSize: 20, fontWeight: "400" }}>{item.quantity}</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                    }
                    keyExtractor={item => item._id}
                >

                </FlatList>
            </View>
            <View style={styles.finalSteps}>
            <View style={styles.orderOverview}>
                    <View >
                        <Text style={dark ? { fontSize: 20,fontWeight: "600",color:"white"}: { fontSize: 20,fontWeight: "600"}}>Order Summary</Text>
                    </View>
                  
                </View>
               
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={dark ?{ fontSize: 20,color:"white"}:{ fontSize: 20}}>Items Total</Text>
                    </View>
                    <View >
                        <Text style={dark ? { fontSize: 20 ,color:"white"}: { fontSize: 20 }}>{orderReview.price} TND</Text>
                    </View>
                </View>
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={dark ? { fontSize: 20 ,color:"white"} :{ fontSize: 20}}>Delivery</Text>
                    </View>
                    <View >
                        <Text style={dark ? { fontSize: 20,color:"white" }:{ fontSize: 20 }}>129,99TND</Text>
                    </View>
                </View>
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={dark ? { fontSize: 20, fontWeight: "600" ,color:"white"}:{ fontSize: 20, fontWeight: "600" }}>Total</Text>
                    </View>
                    <View >
                        <Text style={dark ? { fontSize: 20, fontWeight: "600",color:"white" } : {  fontSize: 20, fontWeight: "600" }}>129,99TND</Text>
                    </View>
                </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={goToDeliveryAdress}>
                    <View style={{ height: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "white" }}>PLACE ORDER AND PAY</Text>
                    </View>
                </TouchableOpacity>

            </View>
         </View>

        </View>
    )}
    else {
        return (<View style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>)
    }
}


const styles = StyleSheet.create({
    info:{
        marginVertical:4,
        height:"20%"
    },
    clientInfo:{
        width:"48%",
        height:"90%",
        flexDirection:"column"
    },
    orderPaymentInfo:{
        width:"48%",
        height:"90%",
    },
    
    orderInfo:{
        width:"100%",
        height:"20%",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center"
    },
    orderInfoContainer:{
        width:"94%",
        height:"94%",
        borderWidth:1,
        borderRadius:12,
        borderColor:"#ababab",
        padding:5,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
        
    },
    addButton:{
        height:"80%",
        width:"92%",
        borderRadius:8,
        backgroundColor: "#2474F1",
        flexDirection: "column", 
        justifyContent: "center",
         alignItems: "center" ,
    },
    cost: {
        height: "30%",
      
    },
    buttonContainer: {
        height: "30%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 4,
        

    },
    orderOverview: {
        width: "92%",
        height: "18%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center"

    },
    finalSteps: {
        height: "22%",
        width: "100%",
    },
    bagContainer: {
        width: "100%",
        height: "48%",
        flexDirection: "column",
        justifyContent: "center",
    },
    productContainer: {
        width: "90%",
        height: 250,
        alignSelf: "center",
        marginVertical: 10,
        flexDirection: "row",
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
        backgroundColor:"white"

    },
    containerDark:{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "#121212",

    },
    productContainerDark:{
        width: "90%",
        height: 250,
        alignSelf: "center",
        marginVertical: 10,
        flexDirection: "row",
        backgroundColor:"#292929",
        borderRadius: 12,


    },
    menuDark:{
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",

    },
    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
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

})