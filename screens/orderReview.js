import React, { useState, useEffect, useContext } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity, Image,Alert, Text,ActivityIndicator ,SafeAreaView} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import AuthContext from '../navigation/AuthContext';
import {getOrder,placeOrder,getDeliveryOptions} from '../rest/ordersApi';


export default function orderReview(props) {
    const  context = useContext(AuthContext);
    const [orderReview,setOrderReview]=useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [products, setProducts] = useState([]);


    useEffect(()=>{
            getOrder(props.route.params.order._id).then(order=>{
                setOrderReview(order);


                if (order.type != 'food') {
                    order.items.map(item => {
                        item.product.total = item.product.basePrice * item.quantity
                    })
                    setProducts(order.items);
                }
                else {
                    var _variants = []
                    order.foodItems.map(item => {
                        var p = 0;
                        item.ingredients.map(e => {
                            if (item.product.pricing.findIndex(pricing => { return pricing._id == e }) >= 0) {
                                let pricing = { ...item.product.pricing[item.product.pricing.findIndex(pricing => { return pricing._id == e })] };
                                item.product.variants.map(variant => {
                                    if (variant.options.findIndex(option => { return option._id === pricing.variantOptions[0] }) >= 0) {                                    
                                        let _variant  = {...variant.options[variant.options.findIndex(option => { return option._id === pricing.variantOptions[0] })]}
                                        _variants.push({variant : _variant,_id:item._id});
                                    }
                                })
                                p += pricing.price;
                            }
                        })
                        item.product.basePrice = p;
                        item.product.total = item.product.basePrice * item.quantity
                    })
                    setIngredients(_variants);
                    
                    setProducts(order.foodItems);
                }
            })
            .catch(err=>{
                alert("network error");
            })       
    },[props.route.params])
    
    const goBack = ()=> {
        props.navigation.goBack();
    }

    const goToDeliveryAdress = ()=>{
     
                placeOrder(orderReview._id,{orderDestination:props.route.params.location,
                    deliveryPartnerId:props.route.params.deliveryPartnerId?
                    props.route.params.deliveryPartnerId
                    :orderReview.partner._id,phone:props.route.params.phone}).then(message=>{
                    Alert.alert(
                        "",
                        "order placed successfully!",
                        [
                          { text: "OK" ,onPress:()=>{
                            props.navigation.navigate("Home",{orderplaced:true});
                          }}
                        ],
                        { cancelable: false }
                      );
                })
                .catch(err=>{console.log(err)})
    }
    if(orderReview){
    return (
        <SafeAreaView>
        <View style={context.darkMode ? styles.containerDark : styles.container}>
            <View style={context.darkMode ? styles.menuDark : styles.menu}>
                <TouchableOpacity style={styles.leftArrowContainer} onPress={()=>{goBack()}}>
                    <View >
                        <Image style={styles.leftArrow} source={ context.darkMode ? require("../assets/left-arrow-dark.png") : require("../assets/left-arrow.png")} />
                    </View>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Review your order</Text>
                </View>
            </View>
            <View style={styles.orderInfo}>
                <View style={styles.orderInfoContainer}>
                    <View style={styles.clientInfo}>
                        <View style={styles.info}>
                            <Text style={context.darkMode ? {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color:"white"}: {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>{orderReview.client.firstName+" "+orderReview.client.lastName}</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={context.darkMode ? {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color:"white"}:{fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>Client code: {context.user.location.locationCode}</Text>
                        </View>
                    </View>
                    <View style={styles.orderPaymentInfo}>
                    <View style={styles.info}>
                            <Text style={context.darkMode ? {fontSize:Dimensions.get("screen").width*0.035,fontWeight:"500",color:"white"} : {fontSize:Dimensions.get("screen").width*0.0305,fontWeight:"500"}}>phone number : {props.route.params.phone.length>0 ?props.route.params.phone:orderReview.client.phone}</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={{fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color: "#2474F1"}}>payment method</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={context.darkMode ? {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color:"white"} : {fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>cash on delivery</Text>
                        </View>

                    </View>
                </View>
            </View>
            <View style={styles.bagContainer}>
                <FlatList
                    data={orderReview.type=="food" ? orderReview.foodItems : orderReview.items}
                    renderItem={
                        ({ item }) =>
                        <View style={context.darkMode ? styles.productContainerDark : styles.productContainer}>
                        <View style={styles.productImageContainer}>
                            <Image style={styles.productImage}  source={{uri:item.product.mainImage}} />
                        </View>
                        <View style={styles.productInfoContainer}>
                            <View style={{ width: "92%", height: "20%", marginVertical: 4, alignSelf: "center" }}>
                                <Text style={context.darkMode ? { fontSize: 17, fontWeight: "700" ,color:"white"}:{ fontSize: 17, fontWeight: "700" }}>{item.product.name}</Text>
                            </View>
                            <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                <Text style={context.darkMode ? { fontSize: 20, fontWeight: "700",color:"white" } :{ fontSize: 20, fontWeight: "700" }}>{item.product.basePrice} TND</Text>
                            </View>
                            <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                <Text style={context.darkMode ? { fontSize: 20, fontWeight: "700",color:"white" } :{ fontSize: 20, fontWeight: "700" }}>{item.product.basePrice} TND</Text>
                            </View>
                            <View style={{ width: "92%", height: "15%", marginVertical: 4, alignSelf: "center" }}>
                                {/* <Text style={context.dark ? { fontSize: 14 ,color:"white"} :{ fontSize: 14 }}>{item.color}</Text>
                                <Text style={context.context.dark ?  { fontSize: 14,color:"white" }:{ fontSize: 14 }}>{item.size}</Text> */}
                            </View>
                            <View style={{ width: "92%", height: "18%", marginVertical: 4, alignSelf: "center", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  

                                <View style={{ width: "30%", height: "100%", marginHorizontal: 6, borderWidth: 3, borderColor: "#bfbfbf", borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                    <Text  style={context.darkMode ? { fontSize: 20, fontWeight: "400" ,color:"white"}:{ fontSize: 20, fontWeight: "400" }}>{item.quantity}</Text>
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
                        <Text style={context.darkMode ? { fontSize: 20,fontWeight: "600",color:"white"}: { fontSize: 20,fontWeight: "600"}}>Order Summary</Text>
                    </View>
                  
                </View>
               
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={context.darkMode ?  { fontSize: 20,color:"white"}:{ fontSize: 20}}>Items Total</Text>
                    </View>
                    <View >
                        <Text style={context.darkMode ? { fontSize: 20 ,color:"white"}: { fontSize: 20 }}>{orderReview.price} TND</Text>
                    </View>
                </View>
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={context.darkMode ? { fontSize: 20 ,color:"white"} :{ fontSize: 20}}>Delivery Price:</Text>
                    </View>
                    <View >
                        <Text style={context.darkMode ? { fontSize: 20,color:"white" }:{ fontSize: 20 }}>{orderReview.partner.deliveryPrice} TND</Text>
                    </View>
                </View>
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={context.darkMode ? { fontSize: 20, fontWeight: "600" ,color:"white"}:{ fontSize: 20, fontWeight: "600" }}>Total</Text>
                    </View>
                    <View >
                        <Text style={context.darkMode ? { fontSize: 20, fontWeight: "600",color:"white" } : {  fontSize: 20, fontWeight: "600" }}>{orderReview.price+orderReview.partner.deliveryPrice} TND</Text>
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
        </SafeAreaView>
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
        height: "45%",
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
        marginTop:10,

    },
    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
        marginTop:10,
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
        height: 30,
        marginTop:10,

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