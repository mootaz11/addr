import React, { useState, useEffect, useContext } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text, ActivityIndicator,Alert } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AuthContext from '../navigation/AuthContext';
import { updateOrder, getOrder,deleteOrder } from '../rest/ordersApi';


export default function bag(props) {
    const [products, setProducts] = useState([]);
    const [preOrder, setPreOrder] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [productVariants,setProductVariants]=useState([]);

    const context = useContext(AuthContext);

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            getOrder(props.route.params.order._id).then(order => {
                setPreOrder(order);
                if (order.type != 'food') {
                    var _variants = []
                    order.items.map(item => {
                        var p = 0;
                        let pricing = { ...item.product.pricing[item.product.pricing.findIndex(pricing => { return pricing._id == item.productPricing  })] };
                        
                                item.product.variants.map(variant => {
                                    if(variant.options.length>0){
                                        variant.options.map(option=>{
                                            if(pricing.variantOptions&&pricing.variantOptions.length>0&&pricing.variantOptions.findIndex(vo=>{return vo ==option._id})>=0){
                                                _variants.push({variant:option,_id:item._id});
                                            }
                                        })
                                    }
                              
                                })
                                p += pricing.price;
                                item.product.basePrice = p;
                                item.product.total = item.product.basePrice * item.quantity
        
                        })
                    setProductVariants(_variants);
                    console.log(order.items);
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
                                        _variants.push({variant : _variant,_id:item._id});}
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
        }
        return () => { mounted = false; setProducts([]); setPreOrder(null);setIngredients([]); }
    }, [props.route.params])

    const goBack = () => {
        props.navigation.goBack({ price: preOrder.price })
//        props.navigation.navigate('basket', { price: preOrder.price });
    }

    const increaseQuantity = (item) => {
        const _items = [...products];
        _items.map(_item => {
            if (_item._id == item._id) {
                _item.quantity += 1;
                _item.product.total = _item.product.basePrice * _item.quantity
                preOrder.price += _item.product.basePrice
            }
            if (_item.quantity > _item.product.stock&&_item.prduct.type=='regular') {
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
        if(products.length==1){

            deleteOrder(props.route.params.order._id).then(message=>{
                setProducts(products.filter(_prod => _prod._id != _product._id));   
                context.setBag(bag=>bag-1);
                Alert.alert(
                    "",
                    "order deleted !",
                    [
                      { text: "OK" ,onPress:()=>{
                        props.navigation.navigate("basket",{message:'order deleted'}) 
                    }}
                    ],
                    { cancelable: false }
                  );


            })


        }

        else {
            let _products=[...products];
            _products=_products.filter(_prod => _prod._id != _product._id)
            setProducts(_products);
            updateOrder(props.route.params.order._id, { newItems: _products, isFood: props.route.params.order.type == 'food' ? true : false }).then(message => {});
        }
        
    }

    const goToDeliveryAdress = () => {
        updateOrder(props.route.params.order._id, { newItems: products, isFood: props.route.params.order.type == 'food' ? true : false }).then(message => {
            props.navigation.navigate("deliveryAdress", { products: products, order: preOrder,partner:props.route.params.order.partner._id,productVariants:productVariants,ingredients:ingredients });
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
                                        <View style={{ width: "92%",flex:1, marginVertical: 4, alignSelf: "center" }}>
                                            <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 17, fontWeight: "700", color: "white" } : { fontFamily:'Poppins',fontSize: 17, fontWeight: "700" }}>{item.product.name}</Text>
                                        </View>
                                        <TouchableOpacity style={{ width: "92%", height: "8%" }} onPress={() => { removeProduct(item) }}>
                                            <View style={{ width: "100%", height: "100%", marginLeft:7, alignSelf: "center" }}>
                                                <Text style={{ fontFamily:'Poppins',fontSize: 16, fontWeight: "500", color: "grey" }}>Remove</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                            <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 20, fontWeight: "700", color: "white" } : { fontFamily:'Poppins',fontSize: 20, fontWeight: "700" }}>{item.product.basePrice ?item.product.basePrice.toString():"0"} TND</Text>
                                        </View>
                                        <View style={{ width: "92%", height: "10%", marginVertical: 4, alignSelf: "center" }}>
                                            <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 20, fontWeight: "700", color: "white" } : { fontFamily:'Poppins',fontSize: 20, fontWeight: "700" }}>{item.product.total ? item.product.total.toString() :item.product.basePrice ?  item.product.basePrice.toString():"0"} TND</Text>
                                        </View>
                                        <View style={{ flex:1, marginVertical: 4,marginLeft:6 }}>
                                            {
                                                ingredients && ingredients.length > 0 && ingredients.map(ingredient => (

                                                    ingredient._id==item._id
                                                    &&
                                                    <View key={ingredient.variant._id}>
                                                        <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 14, color: "white" } : { fontFamily:'Poppins',fontSize: 14,color:"black" }}>{ingredient.variant.name}</Text>
                                                    </View>

                                                ))
                                            }
                                            {
                                                productVariants && productVariants.length > 0 && productVariants.map(_variant => (

                                                    _variant._id==item._id
                                                    &&
                                                    <View key={_variant.variant._id}>
                                                        <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 14, color: "white" } : { fontFamily:'Poppins',fontSize: 14,color:"black" }}>{_variant.variant.name}</Text>
                                                    </View>

                                                ))
                                            }

                                        </View>
                                        <View style={{ width: "92%",flex:1, marginVertical: 4, alignSelf: "center", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                            <TouchableOpacity onPress={() => increaseQuantity(item)}>
                                                <FontAwesome color={context.darkMode ? "white" : "black"} style={{ padding: 0, fontFamily:'Poppins',fontSize: 26, fontWeight: "700" }} name="plus" />

                                            </TouchableOpacity>

                                            <View style={{ width: "25%", height: "80%", marginHorizontal: 6, borderWidth: 3, borderColor: "#bfbfbf", borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                                <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 20, fontWeight: "400", color: "white" } : { fontFamily:'Poppins',fontSize: 20, fontWeight: "400",color:"black" }}>{item.quantity}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => decreaseQuantity(item)}>
                                                <FontAwesome color={context.darkMode ? "white" : "black"} style={{ padding: 0, fontFamily:'Poppins',fontSize: 26, fontWeight: "700" }} name="minus" />
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
                            <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 20, fontWeight: "600", color: "white" } : { fontFamily:'Poppins',fontSize: 20, fontWeight: "600" }}>Total</Text>
                        </View>
                        <View >
                            <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 20, fontWeight: "600", color: "white" } : { fontFamily:'Poppins',fontSize: 20, fontWeight: "600" }}>{preOrder ? preOrder.price : null} DT</Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.addButton} onPress={goToDeliveryAdress}>
                            <View style={{ height: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontFamily:'Poppins',fontSize: 18, fontWeight: "700", color: "white" }}>CONTINUE TO CHECKOUT</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    else {
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
            <View
            style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <ActivityIndicator size="large" color={"#2474F1"} />
            </View>
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
        width: Dimensions.get("screen").height * 0.04,
        height: Dimensions.get("screen").height * 0.04,
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
        fontFamily:'Poppins',fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
    },
    TitleDark: {
        fontWeight: "700",
        fontFamily:'Poppins',fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
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
        height:"100%",
        flexDirection: "column",
    },

})