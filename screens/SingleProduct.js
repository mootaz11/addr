import React, { useContext, useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-community/picker'
import { getProduct } from '../rest/productApi';
import { FlatList } from 'react-native-gesture-handler';
import { createOrder } from '../rest/ordersApi'
import _ from 'lodash';

export default function SingleProduct(props) {
    const context = useContext(AuthContext)
    const [product, setProduct] = useState(null);
    const [active, setActive] = useState();
    const [productImages, setProductsImages] = useState([]);
    const [description, setDescription] = useState("");
    const [option, setOption] = useState("");
    const [variantsIds, setVariantsIds] = useState([]);
    const [productPricing, setProductPricing] = useState(null);
    const [selectedOption,setSelectedOption]=useState(null);
    const [productPrice,setProductPrice]=useState(0);
    const [selectedVariant,setSelectedVariant]=useState(null);


    useEffect(() => {
        let mounted=true;
        if(mounted){
            getProduct(props.route.params.product._id).then(product => {
                var descr = ""
                var variants_ids = []
    
                product.variants.map(variant => {
                    descr += variant.name + " : " + variant.options[0].name + " | "
                    variants_ids.push({ variant: variant._id, variantOption: variant.options[0]._id })
    
                });
                descr=descr.substr(0,descr.length-2)
                
                product.pricing.map(pricing => {
                    var plen = 0;
                    for (let i = 0; i < variants_ids.length; i++) {
                        if (pricing.variantOptions.findIndex(u => { return u._id == variants_ids[i].variantOption }) >= 0) {
                            plen += 1;
                        }
                    }
                    if (plen == pricing.variantOptions.length) {
                        setProductPricing(null);
                        
                    }
                })
    
                setDescription(descr)
                setVariantsIds(variants_ids)
    
                let _product_images = [];
                product.secondaryImages.map(element => {
                    if (_product_images.findIndex(image => { return image == element }) === -1) {
                        _product_images.push(element);
                    }
                });
                if (_product_images.findIndex(image => { return image == product.mainImage }) == -1) {
                    _product_images.push(product.mainImage);
                }
                setProductsImages(_product_images);
                setProduct(product)
            })
        }
        return ()=>{mounted=false,  setProduct(null);
            setProductsImages([]);
            setVariantsIds([])}
    }, [props.route.params.product])

    const _createOrder = () => {
        if (product && productPricing) {

            const body = {
                product: { ...product },
                quantity: 1,
                productPricing: productPricing._id,
            }
            createOrder(body).then(orderCreated => {
                if (orderCreated) {
                    context.setBag(bag=>bag+1)
                    Alert.alert(
                        "",
                        "order created done ",
                        [
                            { text: "OK" ,onPress:()=>{
                                props.navigation.navigate("basket", { last_screen: "SingleProduct" });

                            }}                        ],
                        { cancelable: false }
                    );
                }
            }).catch(err => {
                alert("order did not passed");
            })
        }
        else {
            alert("no options chosen")
        }
    }
    const checkBasket = () => {
        setProduct(null);
        setProductsImages([]);
        setVariantsIds([]);
        props.navigation.navigate("basket", { last_screen: "SingleProduct" });
    }
    const handleOption = (optionValue) => {
        var variants_ids = [];
        product.variants.map(variant => {
            if (variant.options.findIndex(o => { return o._id == optionValue }) >= 0) {
                if (variantsIds.findIndex(_variant => { return _variant.variant == variant._id }) >= 0) {
                    variants_ids = [...variantsIds];
                    let _variant = variantsIds[variantsIds.findIndex(_variant => { return _variant.variant == variant._id })];
                    _variant.variantOption = optionValue;
                    variants_ids[variants_ids.findIndex(_variant => { return _variant.variant == variant._id })] = _variant;
                    setVariantsIds(variants_ids);
                }
            }
        })
        product.pricing.map(pricing => {
            var plen = 0;
            for (let i = 0; i < variants_ids.length; i++) {
                if (pricing.variantOptions.findIndex(u => { return u._id == variants_ids[i].variantOption }) >= 0) {
                    plen += 1;
                }
            }
            if (plen == pricing.variantOptions.length) {
                setProductPricing(pricing);
            }
        })



    }

    const goBack = () => {
        console.log(props.route.params);
        
        if(props.route.params.last&&props.route.params.last=="Home"){
            props.navigation.navigate("Home",{product:product})
        }
        else {
            props.navigation.goBack()

        }
        setProduct(null);
        setProductsImages([]);
        setVariantsIds([])
    }

    const changeImage = ({ nativeEvent }) => {
        const slide = Math.ceil(nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height);
        if (slide != active) {
            setActive(slide);
        }
    }
    if (product) {
        return (
            <View style={context.darkMode ? styles.containerDark : styles.container}>
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
                    <TouchableOpacity style={{ position: "absolute", top: "8%", right: "2%" }} onPress={() => { checkBasket() }}>
                        <FontAwesome color={"black"} style={{   fontSize: Dimensions.get("screen").height * 0.03 }} name="shopping-bag" />

                    </TouchableOpacity>
                    <View style={{ position: "absolute", top: "20%", left: "2%", flex: 1, flexDirection: "column" }}>
                        {
                            productImages.map((image, index) => (
                                <View key={index} style={active == index ? { backgroundColor: "#2474F1", marginVertical: 8, width: 15, height: 15, borderRadius: 15, borderColor: "white", borderWidth: 1 } : { backgroundColor: "white", marginVertical: 8, width: 15, height: 15, borderRadius: 15, borderColor: "#2474F1", borderWidth: 1 }}></View>
                            ))
                        }


                    </View>
                </View>


                    <View style={context.darkMode ? styles.productBodyContainerDark : styles.productBodyContainer}>
                        <View style={styles.productInfo}>
                            <View style={styles.productTitle}>
                                <Text style={context.darkMode ? { fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width*0.07, fontWeight: "600", color: "white" } : { fontFamily: 'PoppinsBold', fontSize: 28, fontWeight: "600" }}>{props.route.params.product.name}</Text>
                            </View>
                            <View style={styles.productDetails}>
                                <Text style={context.darkMode ? { fontFamily: 'Poppins', fontSize: 14, fontWeight: "100", color: "white" } : { fontFamily: 'Poppins', fontSize: 14, fontWeight: "100" }}>{description.length > 0 && description}</Text>
                            </View>
                            <View style={styles.productDescription}>
                                <Text style={context.darkMode ? { fontFamily: 'Poppins', fontSize: 14, fontWeight: "100", color: "white" } : { fontFamily: 'Poppins', fontSize: 14, fontWeight: "100" }}>{props.route.params.product.description} </Text>
                            </View>
                        </View>
                    </View>
                    <View style={context.darkMode ? styles.productValuesDark : styles.productValues}>
                        <View
                            style={{
                                height:"12%"

                            }}
                        />
                        <View style={styles.colorAndSize}>

                            <FlatList
                                data={product.variants}
                                horizontal
                                renderItem={({ item }) =>
                                    <View style={context.darkMode ? {width: 150, height: Dimensions.get("screen").width *0.1,borderRadius:12, marginHorizontal: 3, flex: 1,borderWidth:1,borderColor:"#bfbfbf",backgroundColor:"#333333"}:{ width: 150,borderWidth:1,borderColor:"#bfbfbf", height: Dimensions.get("screen").width *0.1,borderRadius:12, marginHorizontal: 3, flex: 1, backgroundColor: "white" }}>
                                        {(selectedOption!=item._id)&&<TouchableOpacity onPress={() => {setSelectedOption(item._id); console.log(item) }} style={{ flexDirection: "row", width: "100%", height: "100%", justifyContent: 'flex-start' }}>
                                            <Image style={{ marginLeft: 8, width: "15%", height: "100%", resizeMode: "contain" }} source={context.darkMode ?require("../assets/picker_up_dark.png"):require("../assets/picker_up.png")} />
                                            <View style={{ width: "85%", height: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={context.darkMode ? { fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.035, color: "white"}:{ fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.035, color: "black"}}>{item.name+": "}</Text>

                                                <Text style={context.darkMode ? { fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.035, color: "white"}:{ fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.035, color: "black"}}>{item.options[item.options.findIndex(option =>{return  variantsIds[variantsIds.findIndex(_variantId => { return _variantId.variant == item._id })].variantOption==option._id})].name}</Text>
                                            </View>
                                        </TouchableOpacity>}                                
                                       {
                                      (selectedOption==item._id)&&
                                       <Picker

                                            selectedValue={variantsIds[variantsIds.findIndex(_variantId => { return _variantId.variant == item._id })].variantOption}
                                            onValueChange={(itemValue, itemIndex) => { handleOption(itemValue); setOption(itemValue);setSelectedOption(null)}}>

                                                
                                            {
                                                item.options.map((option, index) => (
                                                    <Picker.Item color={"black"} key={index} label={option.name} value={option._id} />
                                                ))
                                            }


                                        </Picker>
                                       } 


                                    </View>

                                }
                                keyExtractor={item => item._id}
                            >

                            </FlatList>

                        </View>

                        <View style={styles.cost}>
                            <View >
                                <Text style={context.darkMode ? { fontFamily: 'Poppins', fontSize: 20, fontWeight: "600", color: "white" } : { fontFamily: 'Poppins', fontSize: 20, fontWeight: "600", color: "black" }}>Cost</Text>
                            </View>
                            <View >
                                <Text style={context.darkMode ? { fontFamily: 'Poppins', fontSize: 20, fontWeight: "600", color: "white" } : { fontFamily: 'Poppins', fontSize: 20, fontWeight: "600", color: "black" }}>{product ? productPricing ? productPricing.price :product.basePrice*((100-product.discount)/100) : ""} DT</Text>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.addButton} onPress={_.once(_createOrder)}>
                                <View style={{ height: "100%", height: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <FontAwesome color={"white"} style={{ marginRight: 8, padding: 0, fontSize: 15, fontWeight: "700" }} name="shopping-bag" />
                                    <Text style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: "700", color: "white" }}>ADD</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                             </View>


        );

    }
    else {
        return (<View style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            <ActivityIndicator color="#2474F1" size="large" />
        </View>)
    }

}

const styles = StyleSheet.create({
    buttonContainer: {
        height: Dimensions.get("window").height * 0.055,
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
        height:Dimensions.get("screen").height*0.05,
        marginVertical:Dimensions.get("screen").width*0.01,
        width: "94%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center"
    },
    colorAndSize: {
        height:Dimensions.get("screen").height*0.098,
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
        height: Dimensions.get("screen").height*0.25
    },

    productTitle: {
        marginLeft:5,
        height:"50%"
    },
    productDetails: {
        height:"20%",
        marginLeft:5

    },
    productDescription: {
        height:"30%",
        marginLeft: 5
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
        width: Dimensions.get("screen").height * 0.03,
        height: Dimensions.get("screen").height * 0.03,
        position: "absolute",
        top: "8%",
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
        height: Dimensions.get("window").height*0.5,
    },
    headerImage: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height*0.5,
        resizeMode: "cover"
    },


})
