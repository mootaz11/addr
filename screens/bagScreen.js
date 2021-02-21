import React, { useState, useEffect, useContext } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AuthContext from '../navigation/AuthContext';
import { updateOrder, getOrder } from '../rest/ordersApi';


export default function bag(props) {
    const [products, setProducts] = useState([]);
    const [preOrder, setPreOrder] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const context = useContext(AuthContext);

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            getOrder(props.route.params.order._id).then(order => {
                setPreOrder(order);
                if (order.type != 'food') {
                    order.items.map(item => {
                        item.product.total = item.product.basePrice * item.quantity

                    })
                    setProducts(order.items);
                }
                else {
                    order.foodItems.map(item => {
                        var p = 0;
                        item.ingredients.map(e => {
                            if (item.product.pricing.findIndex(pricing => { return pricing._id == e }) >= 0) {
                                let pricing = { ...item.product.pricing[item.product.pricing.findIndex(pricing => { return pricing._id == e })] };
                                item.product.variants.map(variant => {
                                    if (variant.options.findIndex(option => { return option._id === pricing.variantOptions[0] }) >= 0) {
                                        setIngredients([...ingredients, variant.options[variant.options.findIndex(option => { return option._id === pricing.variantOptions[0] })]])
                                    }
                                })



                                p += pricing.price;
                            }
                        })
                        item.product.basePrice = p;
                        item.product.total = item.product.basePrice * item.quantity
                    })
                    setProducts(order.foodItems);

                }
            })
        }

        return () => { mounted = false; setProducts([]); setPreOrder(null) }


    }, [props.route.params])

    const goBack = () => {
        props.navigation.navigate('basket', { price: preOrder.price });
    }

    const increaseQuantity = (item) => {
        const _items = [...products];
        _items.map(_item => {
            if (_item._id == item._id) {
                _item.quantity += 1;
                _item.product.total = _item.product.basePrice * _item.quantity
                preOrder.price += _item.product.basePrice
            }
            if (_item.quantity > _item.product.stock) {
                alert("no stock valid for this product")
            }
        })
        setProducts(_items);
    }


    const decreaseQuantity = (item) => {
        const _items = [...products];
        _items.map(_item => {
            if (_item._id == item._id) {
                if (_item.quantity > 1) {
                    _item.quantity -= 1;
                    _item.product.total = _item.product.total - _item.product.basePrice
                    preOrder.price -= _item.product.basePrice

                }
                if (_item.quantity > _item.product.stock) {
                    alert("no stock valid for this product")
                }
            }
        })
        setProducts(_items);
    }

    const removeProduct = (_product) => {
        setProducts(products.filter(_prod => _prod._id != _product._id));
    }

    const goToDeliveryAdress = () => {
        updateOrder(props.route.params.order._id, { newItems: products, isFood: props.route.params.order.type == 'food' ? true : false }).then(message => {
            props.navigation.navigate("deliveryAdress", { products: products, order: preOrder });
        }).catch(err => {
            alert("error occured during update")
        })
    }
    if (preOrder && products) {
        return (
            <View style={context.darkMode ? styles.containerDark : styles.container}>
                <View style={context.darkMode ? styles.menuDark : styles.menu}>
                    <TouchableOpacity style={styles.leftArrowContainer} onPress={goBack}>
                        <View >
                            <Image style={styles.leftArrow} source={context.darkMode ? require("../assets/left-arrow-dark.png") : require("../assets/left-arrow.png")} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Bag</Text>
                    </View>
                </View>
                <View style={styles.bagContainer}>
                    {<FlatList
                        data={products}
                        renderItem={
                            ({ item }) =>
                                <View style={context.darkMode ? styles.productContainerDark : styles.productContainer}>
                                    <View style={styles.productImageContainer}>
                                        <Image style={styles.productImage} source={{ uri: item.product.mainImage }} />
                                    </View>
                                    <View style={styles.productInfoContainer}>
                                        <View style={{ width: "92%", height: "20%", marginVertical: 4, alignSelf: "center" }}>
                                            <Text style={context.darkMode ? { fontSize: 17, fontWeight: "700", color: "white" } : { fontSize: 17, fontWeight: "700" }}>{item.product.name}</Text>
                                        </View>
                                        <TouchableOpacity style={{ width: "92%", height: "8%" }} onPress={() => { removeProduct(item) }}>
                                            <View style={{ width: "100%", height: "100%", margin: 1, alignSelf: "center" }}>
                                                <Text style={{ fontSize: 16, fontWeight: "500", color: "grey" }}>Remove</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                            <Text style={context.darkMode ? { fontSize: 20, fontWeight: "700", color: "white" } : { fontSize: 20, fontWeight: "700" }}>{item.product.basePrice.toString()} TND</Text>
                                        </View>
                                        <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                            <Text style={context.darkMode ? { fontSize: 20, fontWeight: "700", color: "white" } : { fontSize: 20, fontWeight: "700" }}>{item.product.total ? item.product.total.toString() : item.product.basePrice.toString()} TND</Text>
                                        </View>
                                        <View style={{ width: "92%", height: "15%", marginVertical: 4, alignSelf: "center" }}>
                                            {
                                                ingredients && ingredients.length > 0 && ingredients.map(ingredient => (
                                                    <View key={ingredient._id}>
                                                        <Text style={context.darkMode ? { fontSize: 14, color: "white" } : { fontSize: 14 }}>ssss</Text>
                                                    </View>

                                                ))
                                            }

                                        </View>
                                        <View style={{ width: "92%", height: "18%", marginVertical: 4, alignSelf: "center", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                            <TouchableOpacity onPress={() => increaseQuantity(item)}>
                                                <FontAwesome color={context.darkMode ? "white" : "black"} style={{ padding: 0, fontSize: 26, fontWeight: "700" }} name="plus" />

                                            </TouchableOpacity>

                                            <View style={{ width: "30%", height: "100%", marginHorizontal: 6, borderWidth: 3, borderColor: "#bfbfbf", borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                                <Text style={context.darkMode ? { fontSize: 20, fontWeight: "400", color: "white" } : { fontSize: 20, fontWeight: "400" }}>{item.quantity}</Text>
                                            </View>

                                            <TouchableOpacity onPress={() => decreaseQuantity(item)}>
                                                <FontAwesome color={context.darkMode ? "white" : "black"} style={{ padding: 0, fontSize: 26, fontWeight: "700" }} name="minus" />
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                        }
                        keyExtractor={item => item._id}
                    >

                    </FlatList>}
                </View>
                <View style={styles.finalSteps}>
                    <View style={styles.orderOverview}>
                        <View >
                            <Text style={context.darkMode ? { fontSize: 20, fontWeight: "600", color: "white" } : { fontSize: 20, fontWeight: "600" }}>Total</Text>
                        </View>
                        <View >
                            <Text style={context.darkMode ? { fontSize: 20, fontWeight: "600", color: "white" } : { fontSize: 20, fontWeight: "600" }}>{preOrder ? preOrder.price : null} DT</Text>
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
    else {
        return (
            <View style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }
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
        backgroundColor: "white",
        borderRadius: 12,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1
    },
    productContainerDark: {
        width: "90%",
        height: 250,
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
        marginTop: 10
    },

    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",
        marginTop: 10

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
        marginTop: 10
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
        fontSize: Dimensions.get("window").width * 0.07,
    },
    TitleDark: {
        fontWeight: "700",
        fontSize: Dimensions.get("window").width * 0.07,
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

})