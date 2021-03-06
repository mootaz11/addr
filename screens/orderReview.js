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
                    var _variants = []
                    order.items.map(item => {
                        let p = 0;
                        item.product.basePrice=item.product.basePrice*((100-item.product.discount)/100)

                        let pricing = { ...item.product.pricing[item.product.pricing.findIndex(pricing => { return pricing._id == item.productPricing  })] };
                        
                               
                                p += pricing.price;
                                item.product.basePrice = p;
                                item.product.total = item.product.basePrice * item.quantity
                                order.price=item.product.total
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
                                        _variants.push({name:variant.name,variant : _variant,_id:item._id});
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
     

                placeOrder(orderReview._id,{orderDestination:props.route.params.orderDestination,
                    deliveryPartnerId:props.route.params.deliveryPartner?
                    props.route.params.deliveryPartner.id
                    :orderReview.partner._id,
                    phone:props.route.params.phone,
                    deliveryPrice:props.route.params.deliveryPartner?
                    props.route.params.deliveryPartner.Price:0
                }).then(message=>{
                    Alert.alert(
                        "",
                        "order placed successfully!",
                        [
                          { text: "OK" ,onPress:()=>{
                              if(context.bag>0){
                                context.setBag(bag=>bag-1);
                              }
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
                            <Text style={context.darkMode ? {fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color:"white"}: {fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>{orderReview.client.firstName+" "+orderReview.client.lastName}</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={context.darkMode ? {fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color:"white"}:{fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>Client code: {context.user.location.locationCode}</Text>
                        </View>
                    </View>
                    <View style={styles.orderPaymentInfo}>
                    <View style={styles.info}>
                            <Text style={context.darkMode ? {fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.035,fontWeight:"500",color:"white"} : {fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.0305,fontWeight:"500"}}>phone number : {props.route.params.phone.length>0 ?props.route.params.phone:orderReview.client.phone}</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={{fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color: "#2474F1"}}>payment method</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={context.darkMode ? {fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500",color:"white"} : {fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.038,fontWeight:"500"}}>cash on delivery</Text>
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
                            <Image style={styles.productImage} source={{ uri: item.product.mainImage }} />
                        </View>
                        <View style={styles.productInfoContainer}>
                            <View style={{ width: "92%",flex:1, marginVertical: 4, alignSelf: "center" }}>
                            <Text style={context.darkMode ? { fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.055 , color: "white" } : { fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.055}}>{item.product.name}</Text>
                            </View>

                            <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center",flexDirection:"row" }}>
                                        <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03, fontWeight: "700", color: "white" } : { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03, fontWeight: "700" }}>Price: </Text>
                                            <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "700", color: "white" } : { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "700" }}>{item.product.basePrice ?item.product.basePrice.toString():"0"} TND</Text>
                                        </View>
                                        <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center",flexDirection:"row" }}>
                                        <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03, fontWeight: "700", color: "white" } : { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03, fontWeight: "700" }}>Total: </Text>

                                            <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "700", color: "white" } : { fontFamily:'Poppins',fontSize:  Dimensions.get("screen").width*0.04, fontWeight: "700" }}>{item.product.total ? item.product.total.toString() :item.product.basePrice ?  item.product.basePrice.toString():"0"} TND</Text>
                                        </View>
                            <View style={{ flex:1, marginVertical: 4,marginLeft:6 }}>
                                {
                                     props.route.params.ingredients &&  props.route.params.ingredients.length > 0 &&  props.route.params.ingredients.map(ingredient => (

                                        ingredient._id==item._id
                                        &&
                                        <View key={ingredient.variant._id}>
                                            <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 14, color: "white" } : { fontFamily:'Poppins',fontSize: 14,color:"black" }}>{ingredient.name+" : "+ingredient.variant.name}</Text>
                                        </View>

                                    ))
                                }
                                {
                                    props.route.params.productVariants &&props.route.params.productVariants.length > 0 &&  props.route.params.productVariants.map(_variant => (

                                        _variant._id==item._id
                                        &&
                                        <View key={_variant.variant._id}>
                                            <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 14, color: "white" } : { fontFamily:'Poppins',fontSize: 14,color:"black" }}>{_variant.name+" : "+_variant.variant.name}</Text>
                                        </View>

                                    ))
                                }
                                 <View style={{ width: "92%",flex:1, marginVertical: 4, alignSelf: "center", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                           

                                            <View style={{ width: "25%", height: "80%", marginHorizontal: 6, borderWidth: 3, borderColor: "#bfbfbf", borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                                <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 20, fontWeight: "400", color: "white" } : { fontFamily:'Poppins',fontSize: 20, fontWeight: "400",color:"black" }}>{item.quantity}</Text>
                                            </View>
                                         
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
                        <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 20,fontWeight: "600",color:"white"}: { fontFamily:'Poppins',fontSize: 20,fontWeight: "600"}}>Order Summary</Text>
                    </View>
                  
                </View>
               
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={context.darkMode ?  { fontFamily:'Poppins',fontSize: 20,color:"white"}:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04}}>Items Total</Text>
                    </View>
                    <View >
                        <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04 ,color:"white"}: { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04 }}>{orderReview.price} TND</Text>
                    </View>
                </View>
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04 ,color:"white"} :{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04}}>Delivery Price:</Text>
                    </View>
                    <View >
                        <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04,color:"white" }:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04 }}>{props.route.params.deliveryPartner.Price ? (props.route.params.deliveryPartner.Price+"TND") :"no delivery price" }</Text>
                    </View>
                </View>
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={context.darkMode ? { fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "600" ,color:"white"}:{ fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "600" }}>Total</Text>
                    </View>
                    <View >
                        <Text style={context.darkMode ? { fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "600",color:"white" } : {  fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "600" }}>{props.route.params.deliveryPartner.Price ?(orderReview.price+props.route.params.deliveryPartner.Price) : orderReview.price} TND</Text>
                    </View>
                </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={goToDeliveryAdress}>
                    <View style={{ height: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "700", color: "white" }}>PLACE ORDER AND PAY</Text>
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
        height: "25%",
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
        flex:1,
        alignSelf: "center",
        marginVertical: 10,
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 12,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1
    },
    productContainerDark: {
        width: "90%",
        flex:1,
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
        backgroundColor:"white"

    },
    containerDark:{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "#121212",

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
        width: Dimensions.get("screen").height * 0.04,
        height: Dimensions.get("screen").height * 0.04,

        marginLeft:10,

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
        fontFamily:'Poppins',        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,

    },
    TitleDark:{
        fontWeight: "700",
        fontFamily:'Poppins',        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,

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