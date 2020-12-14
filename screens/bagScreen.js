import React, { useState, useEffect, useContext } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AuthContext from '../navigation/AuthContext';


const products_data = [
    { name: "BIKER JACKER", price: 123.500, total: 123.500, quantity: 1, color: "white", size: "31/32", image: require("../assets/product1.webp"), _id: "55" },
    { name: "BIKER JACKER", price: 123.500, total: 123.500, quantity: 1, color: "white", size: "31/32", image: require("../assets/product2.webp"), _id: "56" },
    { name: "BIKER JACKER", price: 123.500, total: 123.500, quantity: 1, color: "white", size: "31/32", image: require("../assets/product3.webp"), _id: "57" },
]


export default function bag(props) {
    const [products, setProducts] = useState([]);
    const [dark,setDark]= useState(true)
    const [preOrder,setPreOrder]=useState(null);
    const context = useContext(AuthContext);
    useEffect(()=>{
        setPreOrder(props.route.params.order);
        props.route.params.order.items.map(item=>{
            item.product.total=0
        })
        setProducts(props.route.params.order.items);
    
    },[props.route.params])

    const goBack = () => {
        props.navigation.navigate('basket');
    }

    const increaseQuantity = (item) => {
            const  _items = [...products];
            
            _items.map(_item=>{
                if(_item._id==item._id){
                    _item.quantity+=1;
                    _item.product.total=_item.product.basePrice*_item.quantity
                    preOrder.price+=_item.product.basePrice
                }
            })       
            setProducts(_items);
    }

    const decreaseQuantity = (item) => {
        const  _items = [...products];           
        _items.map(_item=>{
            if(_item._id==item._id){
                if(_item.quantity>1){
                    _item.quantity-=1;
                    _item.product.total=_item.product.total-_item.product.basePrice
                    preOrder.price-=_item.product.basePrice

                }
            }
        })       
        setProducts(_items);
}

    const removeProduct = () => {
    }

    const goToDeliveryAdress = ()=>{
        props.navigation.navigate("deliveryAdress",{products:products})
    }

    return (
        <View style={dark ? styles.containerDark : styles.container}>
            <View style={dark ? styles.menuDark : styles.menu}>
                <TouchableOpacity style={styles.leftArrowContainer} onPress={goBack}>
                    <View >
                        <Image style={styles.leftArrow} source={dark ? require("../assets/left-arrow-dark.png"):require("../assets/left-arrow.png")} />
                    </View>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={dark ? styles.TitleDark : styles.Title}>Bag</Text>
                </View>
            </View>
            <View style={styles.bagContainer}>
                <FlatList
                    data={products}
                    renderItem={
                        ({ item }) =>
                            <View style={dark ? styles.productContainerDark : styles.productContainer}>
                                <View style={styles.productImageContainer}>
                                    <Image style={styles.productImage} source={{uri:item.product.mainImage}} />
                                </View>
                                <View style={styles.productInfoContainer}>
                                    <View style={{ width: "92%", height: "20%", marginVertical: 4, alignSelf: "center" }}>
                                        <Text style={dark ? { fontSize: 17, fontWeight: "700" ,color:"white"}:{ fontSize: 17, fontWeight: "700" }}>{item.product.name}</Text>
                                    </View>
                                    <TouchableOpacity>
                                        <View style={{ width: "92%", height: "8%", marginVertical: 4, alignSelf: "center" }}>
                                            <Text style={{ fontSize: 16, fontWeight: "500", color: "grey" }}>Remove</Text>
                                        </View>
                                    </TouchableOpacity>


                                    <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                        <Text style={dark ? { fontSize: 20, fontWeight: "700",color:"white" } :{ fontSize: 20, fontWeight: "700" }}>{item.product.basePrice.toString()} TND</Text>
                                    </View>
                                    <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                        <Text style={dark ? { fontSize: 20, fontWeight: "700",color:"white" } :{ fontSize: 20, fontWeight: "700" }}>{item.product.total ? item.product.total.toString():item.product.basePrice.toString()} TND</Text>
                                    </View>
                                    <View style={{ width: "92%", height: "15%", marginVertical: 4, alignSelf: "center" }}>
                                        <Text style={dark ?{ fontSize: 14 ,color:"white"} :{ fontSize: 14 }}>ssss</Text>
                                        <Text style={dark ?{ fontSize: 14,color:"white" }:{ fontSize: 14 }}>ssss</Text>
                                    </View>
                                    <View style={{ width: "92%", height: "18%", marginVertical: 4, alignSelf: "center", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <TouchableOpacity onPress={()=>increaseQuantity(item)}>
                                            <FontAwesome color={dark ? "white":"black"} style={{ padding: 0, fontSize: 26, fontWeight: "700" }} name="plus" />

                                        </TouchableOpacity>

                                        <View style={{ width: "30%", height: "100%", marginHorizontal: 6, borderWidth: 3, borderColor: "#bfbfbf", borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "center" }}>
                                            <Text  style={dark ? { fontSize: 20, fontWeight: "400" ,color:"white"}:{ fontSize: 20, fontWeight: "400" }}>{item.quantity}</Text>
                                        </View>
                                        <TouchableOpacity onPress={()=>decreaseQuantity(item)}>
                                            <FontAwesome color={dark ? "white":"black"} style={{ padding: 0, fontSize: 26, fontWeight: "700" }} name="minus" />
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
                        <Text style={dark ? { fontSize: 20, fontWeight: "600" ,color:"white"}:{ fontSize: 20, fontWeight: "600" }}>Total</Text>
                    </View>
                    <View >
                <Text style={dark ? { fontSize: 20, fontWeight: "600" ,color:"white"}:{ fontSize: 20, fontWeight: "600" }}>{preOrder ? preOrder.price: null} DT</Text>
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
        height: "77%",
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
    productContainerDark:{
        width: "90%",
        height: 250,
        alignSelf: "center",
        marginVertical: 10,
        flexDirection: "row",
        backgroundColor:"#292929",
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

    },
    containerDark:{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "#121212",

    },
    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
    },
    menuDark:{
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
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