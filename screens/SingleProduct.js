import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-community/picker'
import { getProduct } from '../rest/productApi';
import { FlatList } from 'react-native-gesture-handler';

export default function SingleProduct(props) {

    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [product, setProduct] = useState(null);
    const [dark, setDark] = useState(true);
    const [options,setOptions]=useState([]);

    useEffect(() => {
        getProduct(props.route.params.product._id).then(product => {
            console.log(product)
            setProduct(product)
        })
    }, [props.route.params.product])

    const checkBag = () => {
        console.log(selectedSize);
        console.log(selectedColor);
        props.navigation.navigate("bag", { product: props.route.params.product });
    }
    const handleOption =(option,optionValue)=>{
        console.log(option);
        console.log(optionValue);
    }
    const goBack = () => {

        props.navigation.goBack()
    }

    if (product) {
        return (

            <View style={dark ? styles.containerDark : styles.container}>




                <View style={styles.headerImageContainer}>

                    <Image style={styles.headerImage} source={product.mainImage ? { uri: product.mainImage } : require("../assets/imagenotyet.jpg")} />
                    <TouchableOpacity style={styles.leftArrow} onPress={goBack}>
                        <Image style={{ width: "100%", height: "100%" }} source={require("../assets/left-arrow.png")} />
                    </TouchableOpacity>
                    <FontAwesome color={"black"} style={{ padding: 0, fontSize: 24, position: "absolute", top: "5%", right: "2%" }} name="shopping-bag" />
                </View>
                <View style={dark ? styles.productBodyContainerDark : styles.productBodyContainer}>
                    <View style={styles.productInfo}>
                        <View style={styles.productTitle}>
                            <Text style={dark ? { fontSize: 28, fontWeight: "600", color: "white" } : { fontSize: 28, fontWeight: "600" }}>{props.route.params.product.name}</Text>
                        </View>
                        <View style={styles.productDetails}>
                            <Text style={dark ? { fontSize: 14, fontWeight: "100", color: "white" } : { fontSize: 14, fontWeight: "100" }}>322/0495 - WHITE</Text>
                        </View>
                        <View style={styles.productDescription}>
                            <Text style={dark ? { fontSize: 14, fontWeight: "100", color: "white" } : { fontSize: 14, fontWeight: "100" }}>{props.route.params.product.description} </Text>
                        </View>
                    </View>
                </View>
                <View style={dark ? styles.productValuesDark : styles.productValues}>
                    <View style={styles.colorAndSize}>
                        <FlatList
                            data={product.variants}
                            horizontal
                            renderItem={({ item }) => 
                           <View style={{width:150,marginHorizontal:5,height:"100%"}}>
                                    <Picker
                                        selectedValue={item.name}
                                        style={{ marginRight: 14, height: "100%", width: "100%" }}
                                        onValueChange={(itemValue, itemIndex) => {handleOption(item,itemValue)}}
                                    >
                                        {
                                            item.options.map(option=>(
                                                <Picker.Item key={option._id} label={option.name} value={option.name} />

                                            ))
                                        }
                                    </Picker>
                                </View>

                            }
                            keyExtractor={item=>item._id}
                        >

                        </FlatList>


                    </View>
                    <View style={styles.cost}>
                        <View >
                            <Text style={dark ? { fontSize: 20, fontWeight: "600", color: "white" } : { fontSize: 20, fontWeight: "600" }}>Cost</Text>
                        </View>
                        <View >
                            <Text style={dark ? { fontSize: 20, fontWeight: "600", color: "white" } : { fontSize: 20, fontWeight: "600" }}>129,99TND</Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.addButton} onPress={checkBag}>
                            <View style={{ height: "100%", height: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <FontAwesome color={"white"} style={{ marginRight: 8, padding: 0, fontSize: 15, fontWeight: "700" }} name="shopping-bag" />
                                <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>ADD</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>


        );

    }
    else {
        return (<View style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>)
    }

}

const styles = StyleSheet.create({
    buttonContainer: {
        height: "40%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    addButton: {
        height: "80%",
        width: "94%",
        borderRadius: 8,
        backgroundColor: "#2474F1",

    },
    addButtonDark: {
        backgroundColor: "#121212",
        height: "80%",
        width: "94%",
        borderRadius: 8,
    },
    cost: {
        height: "30%",
        marginVertical: 6,
        width: "94%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center"
    },
    colorAndSize: {
        height: "30%",
        width: "100%",
        flexDirection: "row",
    },
    productValues: {
        height: "18%",
        width: "100%",
        backgroundColor: "#F2F6FF",
    },
    productValuesDark: {
        height: "18%",
        width: "100%",
        backgroundColor: "#121212"

    },
    productInfo: {
        height: "100%"
    },

    productTitle: {
        margin: 8
    },
    productDetails: {
        margin: 8

    },
    productDescription: {
        margin: 8
    },

    container: {
        backgroundColor: "#F2F6FF",
        flex: 1,
        flexDirection: "column",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
    },
    containerDark: {
        flex: 1,
        flexDirection: "column",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        backgroundColor: "#121212",

    },


    leftArrow: {
        width: 30,
        height: 30,
        position: "absolute",
        top: "5%",
        left: "2%",
        zIndex: 50,
        elevation: 10,



    },

    productBodyContainer: {
        height: "30%",
        width: "100%",
        backgroundColor: "white"

    },
    productBodyContainerDark: {
        height: "28%",
        width: "100%",
        backgroundColor: "#121212"



    },


    headerImageContainer: {
        width: "100%",
        height: "52%"
    },
    headerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },


})