import React, { useState, useEffect, useContext } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const products_data = [
    { name: "BIKER JACKER", price: 123.500, total: 123.500, quantity: 1, color: "white", size: "31/32", image: require("../assets/product1.webp"), _id: "55" },
    { name: "BIKER JACKER", price: 123.500, total: 123.500, quantity: 1, color: "white", size: "31/32", image: require("../assets/product2.webp"), _id: "56" },
    { name: "BIKER JACKER", price: 123.500, total: 123.500, quantity: 1, color: "white", size: "31/32", image: require("../assets/product3.webp"), _id: "57" },

]

export default function orderReview(props) {
    const [products, setProducts] = useState(products_data);


    const goBack = () => {
        props.navigation.navigate("singleProduct")
    }

    const increaseQuantity = () => {

    }
    const decreaseQuantity = () => {

    }
    const removeProduct = () => {

    }
    const goToDeliveryAdress = ()=>{
        props.navigation.navigate("deliveryAdress")
    }

    return (
        <View style={styles.container}>

            <View style={styles.menu}>
                <TouchableOpacity style={styles.leftArrowContainer} onPress={goBack}>
                    <View >
                        <Image style={styles.leftArrow} source={require("../assets/left-arrow.png")} />
                    </View>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.Title}>Review your order</Text>
                </View>

            </View>
            <View style={styles.orderInfo}>
                <View style={styles.orderInfoContainer}>
                    <View style={styles.clientInfo}>
                        <View style={styles.info}>
                            <Text style={{fontSize:15,fontWeight:"500"}}>Ahmed yassine allegue</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={{fontSize:15,fontWeight:"500"}}>Client address: 4785aaaa</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={{fontSize:15,fontWeight:"500"}}>kssar hellel,</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={{fontSize:15,fontWeight:"500"}}>Monastir</Text>
                        </View>
                       
                    </View>
                    <View style={styles.orderPaymentInfo}>

                    <View style={styles.info}>
                            <Text style={{fontSize:15,fontWeight:"500"}}>phone number : 28896426</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={{fontSize:15,fontWeight:"500",color: "#2474F1"}}>payment method</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={{fontSize:15,fontWeight:"500"}}>cash on delivery</Text>
                        </View>

                    </View>
                </View>
            </View>
            <View style={styles.bagContainer}>
                <FlatList
                    data={products}
                    renderItem={
                        ({ item }) =>
                            <View style={styles.productContainer}>
                                <View style={styles.productImageContainer}>
                                    <Image style={styles.productImage} source={item.image} />

                                </View>
                                <View style={styles.productInfoContainer}>
                                    <View style={{ width: "92%", height: "20%", marginVertical: 4, alignSelf: "center" }}>
                                        <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name} HI HI HIHIHI</Text>
                                    </View>
                                    <TouchableOpacity>
                                        <View style={{ width: "92%", height: "8%", marginVertical: 4, alignSelf: "center" }}>
                                            <Text style={{ fontSize: 16, fontWeight: "500", color: "grey" }}>Remove</Text>
                                        </View>
                                    </TouchableOpacity>


                                    <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                        <Text style={{ fontSize: 20, fontWeight: "700" }}>{item.price} TND</Text>
                                    </View>
                                    <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                        <Text style={{ fontSize: 20, fontWeight: "700" }}>{item.total} TND</Text>
                                    </View>
                                    <View style={{ width: "92%", height: "15%", marginVertical: 4, alignSelf: "center" }}>
                                        <Text style={{ fontSize: 14 }}>{item.color}</Text>
                                        <Text style={{ fontSize: 14 }}>{item.size}</Text>
                                    </View>
                                    <View style={{ width: "92%", height: "18%", marginVertical: 4, alignSelf: "center", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <TouchableOpacity>
                                            <FontAwesome color={"black"} style={{ padding: 0, fontSize: 26, fontWeight: "700" }} name="plus" />

                                        </TouchableOpacity>

                                        <View style={{ width: "30%", height: "100%", marginHorizontal: 6, borderWidth: 3, borderColor: "#bfbfbf", borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "center" }}>
                                            <Text color={"black"} style={{ fontSize: 20, fontWeight: "400" }}>{item.quantity}</Text>
                                        </View>

                                        <TouchableOpacity>
                                            <FontAwesome color={"black"} style={{ padding: 0, fontSize: 26, fontWeight: "700" }} name="minus" />
                                        </TouchableOpacity>

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
                        <Text style={{ fontSize: 20,fontWeight: "600"}}>Order Summary</Text>
                    </View>
                  
                </View>
               
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={{ fontSize: 20}}>Items Total</Text>
                    </View>
                    <View >
                        <Text style={{ fontSize: 20 }}>129,99TND</Text>
                    </View>
                </View>
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={{ fontSize: 20}}>Delivery</Text>
                    </View>
                    <View >
                        <Text style={{ fontSize: 20 }}>129,99TND</Text>
                    </View>
                </View>
                <View style={styles.orderOverview}>
                    <View >
                        <Text style={{ fontSize: 20, fontWeight: "600" }}>Total</Text>
                    </View>
                    <View >
                        <Text style={{ fontSize: 20, fontWeight: "600" }}>129,99TND</Text>
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
    )
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