import React, { useContext, useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-community/picker'
import { getProduct } from '../rest/productApi';
import { FlatList } from 'react-native-gesture-handler';
import { createOrder } from '../rest/ordersApi'
export default function SingleProduct(props) {
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [product, setProduct] = useState(null);
    const [dark, setDark] = useState(true);
    const [options, setOptions] = useState([]);
    const [active, setActive] = useState();
    const [productImages, setProductsImages] = useState([]);
    useEffect(() => {

        getProduct(props.route.params.product._id).then(product => {
            product.secondaryImages.forEach(element => {
                if (productImages.findIndex(image => { return image == element }) == -1) {
                    setProductsImages([...productImages, element])
                }
            });
            if (productImages.findIndex(image => { return image == product.mainImage }) == -1)
                setProductsImages([product.mainImage, ...productImages])
            setProduct(product)
        })
    }, [props.route.params.product])

    const _createOrder = () => {
        const body = {
            product: { ...product },
            quantity: 1,
            productPricing: product.pricing[0]._id,
        }
        createOrder(body).then(created => {
        }).catch(err => {
            alert("error occured");
        })
        // props.navigation.navigate("bag", { product: props.route.params.product });
    }
    const handleOption = (optionValue) => {
        console.log(optionValue);

    }
    const checkBag=()=>{
        props.navigation.navigate("bag")
    }
    const goBack = () => {
        props.navigation.goBack()
    }

    const changeImage = ({ nativeEvent }) => {
        const slide = Math.ceil(nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height);
        if (slide != active) {
            setActive(slide);
        }
    }
    if (product) {
        return (
            <View style={dark ? styles.containerDark : styles.container}>
                <View style={styles.headerImageContainer}>
                    <ScrollView
                        pagingEnabled
                        onScroll={changeImage}
                        showsVerticalScrollIndicator={false}
                        style={{ width: "100%", height: "100%" }}>
                        {
                            productImages.map((image, index) =>
                                (
                                    <Image key={index} style={styles.headerImage} source={{ uri: image }} />

                                ))

                        }
                    </ScrollView>
                    <TouchableOpacity style={styles.leftArrow} onPress={goBack}>
                        <Image style={{ width: "100%", height: "100%" }} source={require("../assets/left-arrow.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ position: "absolute", top: "5%", right: "2%" }} onPress={checkBag}>
                        <FontAwesome color={"black"} style={{ padding: 0, fontSize: 24, position: "absolute", top: "5%", right: "2%" }} name="shopping-bag" />

                    </TouchableOpacity>
                    <View style={{ position: "absolute", top: "20%", left: "2%", flex: 1, flexDirection: "column" }}>
                        {
                            productImages.map((image, index) => (
                                <View key={index} style={active == index ? { backgroundColor: "#2474F1", marginVertical: 8, width: 15, height: 15, borderRadius: 15, borderColor: "white", borderWidth: 1 } : { backgroundColor: "white", marginVertical: 8, width: 15, height: 15, borderRadius: 15, borderColor: "#2474F1", borderWidth: 1 }}></View>
                            ))
                        }


                    </View>
                </View>


                <ScrollView>
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
                        <View
                            style={{
                                borderBottomColor: dark ? "#292929" : '#d8d8d8',
                                borderBottomWidth: 1,
                                marginLeft: 5,
                                marginRight: 5,
                                marginTop: 5,
                                marginBottom: 5
                            }}
                        />
                        <View style={styles.colorAndSize}>

                            <FlatList
                                data={product.variants}
                                horizontal
                                renderItem={({ item }) =>
                                    <View style={{ width: 150, marginHorizontal: 5, flex: 1 }}>

                                        <Text style={{ fontSize: Dimensions.get("window").fontScale * 20, textAlign: "center", color: "white", }}>{item.name}</Text>
                                        <Picker
                                            selectedValue={""}
                                            onValueChange={(itemValue, itemIndex) => { console.log(itemValue); handleOption(itemValue) }}
                                        >
                                            {
                                                item.options.map((option, index) => (
                                                    <Picker.Item color={dark ? "white" : "black"} key={index} label={option.name} value={option._id} />
                                                ))
                                            }
                                        </Picker>
                                    </View>

                                }
                                keyExtractor={item => item._id}
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
                            <TouchableOpacity style={styles.addButton} onPress={_createOrder}>
                                <View style={{ height: "100%", height: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <FontAwesome color={"white"} style={{ marginRight: 8, padding: 0, fontSize: 15, fontWeight: "700" }} name="shopping-bag" />
                                    <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>ADD</Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                    </View>
                </ScrollView>
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
        height: Dimensions.get("window").height * 0.1,
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    addButton: {
        flex: 1,
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
        flex: 1,
        marginVertical: 6,
        width: "94%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center"
    },
    colorAndSize: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
    },
    productValues: {
        flex: 1,
        width: "100%",
        backgroundColor: "#F2F6FF",
    },
    productValuesDark: {
        flex: 1,
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
        flex: 1,
        width: "100%",
        backgroundColor: "white"

    },
    productBodyContainerDark: {
        flex: 1,
        width: "100%",
        backgroundColor: "#121212"



    },


    headerImageContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width,
    },
    headerImage: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width,
        resizeMode: "cover"
    },


})
