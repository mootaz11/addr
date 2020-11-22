import React, { useState, useEffect, useContext } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const products_data = [
    { name: "BIKER JACKER", price: 123.500, total: 123.500, quantity: 1, color: "white", size: "31/32", image: require("../assets/product1.webp"), _id: "55" },
    { name: "BIKER JACKER", price: 123.500, total: 123.500, quantity: 1, color: "white", size: "31/32", image: require("../assets/product2.webp"), _id: "56" },
    { name: "BIKER JACKER", price: 123.500, total: 123.500, quantity: 1, color: "white", size: "31/32", image: require("../assets/product3.webp"), _id: "57" },

]

export default function bag(props) {
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
                    <Text style={styles.Title}>Bag</Text>
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
                                        <Text style={{ fontSize: 20, fontWeight: "700" }}>{item.name} HI HI HIHIHI</Text>
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
                        <Text style={{ fontSize: 20, fontWeight: "600" }}>Total</Text>
                    </View>
                    <View >
                        <Text style={{ fontSize: 20, fontWeight: "600" }}>129,99TND</Text>
                    </View>
                </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={goToDeliveryAdress}>
                    <View style={{ height: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "white" }}>CONTINUE TO CHECKOUT</Text>
                    </View>
                </TouchableOpacity>

            </View>
         </View>

        </View>
    )
}


const styles = StyleSheet.create({
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
        width: "100%",
        height: "75%",
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

    },
    menu: {
        width: "100%",
        height: "10%",
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