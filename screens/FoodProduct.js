import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, SectionList,ActivityIndicator } from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RadioButton, Checkbox } from 'react-native-paper';
import { add } from 'react-native-reanimated';
import {getProduct} from '../rest/productApi';
import { createOrder } from '../rest/ordersApi';



export default function foodProduct(props) {
    const [checked, setChecked] = useState("");
    const [product, setProduct] = useState(null);
    const [choice, setChoice] = useState(null);
    const [supplements, setSupplements] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [food_data,setFoodData]=useState(null)
    useEffect(() => {
        if (props.route.params.product) {
            getProduct(props.route.params.product._id).then(product=>{
                let _food_data=[];
                 product.variants.map(variant=>{
                    let data = variant.options.map(option=>{
                       let index_pricing = product.pricing.findIndex(pricing=>{
                           return pricing.variantOptions.findIndex(Pricing_option=>{return Pricing_option._id==option._id})>=0
                       });
                       return {title:variant.name,choix:option.name,price:product.pricing[index_pricing].price,_id:product.pricing[index_pricing]._id}
                    })
                    _food_data.push({data,title:variant.name})
                 })
                
                setFoodData(_food_data)
                setProduct(product);  
            })
            .catch(err=>{
                alert("error while getting product")
            })
        }
    }, [props.route.params])

    const addChoice = (item) =>{
        setChecked(item);
        setChoice(item);
    }

    const addIngredients = (item) => {
        
        if (ingredients.findIndex(i => { return i._id == item._id }) >= 0) {
            setIngredients(ingredients.filter(i => i._id != item._id))
        }
        else {
            setIngredients(ingredients => [...ingredients, item])
        }

    }

    const addSupplements = (item) => {
        if (supplements.length > 26) {
            alert("you must choose only 16");
        }
        else {

            if (supplements.findIndex(i => { return i._id == item._id }) >= 0) {
                setSupplements(supplements.filter(i => i._id != item._id))
            }
            else {
                setSupplements(supplements => [...supplements, item])

            }

        }

    }



    const addProduct = () => {
        let _ingredients = [];
        
        supplements.forEach(supp=>{_ingredients.push(supp._id)})
        ingredients.forEach(ingr=>{_ingredients.push(ingr._id)})
        if(choice){
        _ingredients.push(choice._id);
        }
        if(_ingredients.length>0){ 
        createOrder({
            product:{...product},
            ingredients:_ingredients,
            quantity:1
        }).then(createdOrder=>{
            if(createdOrder){
                Alert.alert(
                    "",
                    "order created done !",
                    [
                      
                      { text: "OK" }
                    ],
                    { cancelable: false }


                  );

            }
        })
        .catch(err=>{
            alert("error occured")
        })
    
    }
        else {
            alert("please choose at least one option")
        }
    }

    const goBack = () => {
        props.navigation.goBack();
    }
    if (product) {
        return (
            <View style={styles.container}>
                <View style={styles.headerImageContainer}>

                    <Image style={styles.headerImage} source={product.mainImage ? { uri: product.mainImage } : require("../assets/mixmax.jpg")} />
                    <TouchableOpacity style={styles.leftArrow} onPress={goBack}>
                        <Image style={{ width: "100%", height: "100%" }} source={require("../assets/left-arrow-dark.png")} />
                    </TouchableOpacity>
                    <FontAwesome color={"white"} style={{ padding: 0, fontSize: 24, position: "absolute", top: "5%", right: "2%" }} name="shopping-bag" />
                </View>
                <View style={styles.details}>
                    <Text style={{fontSize:Dimensions.get("window").width*0.1,marginLeft:10,fontWeight:'500',letterSpacing:0.1}}>{product.name[0].toUpperCase()+product.name.slice(1)}</Text>
                    <SectionList
                        sections={food_data}
                        renderItem={({ item, index }) =>
                            <View style={styles.itemContainer}>
                                <View style={styles.itemInfo}>
                                    {

                                        item.title == "CHOIX" ?
                                            <TouchableOpacity key={item.choix} onPress={() => addChoice(item)}>
                                                <View style={styles.RadioButton}>
                                                    <Image style={{ width: "90%", height: "90%", resizeMode: "cover" }} source={item == checked ? require("../assets/button_checked.png") : require("../assets/button_unchecked.png")} />
                                                </View>
                                            </TouchableOpacity>


                                            :
                                            <TouchableOpacity key={item.choix} onPress={() => item.title == "INGREDIENTS" ? addIngredients(item) : addSupplements(item)}>
                                                <View style={styles.RadioButton}>
                                                    <Image style={{ width: "90%", height: "90%", resizeMode: "cover" }} source={item.title == "INGREDIENTS" ? ingredients.findIndex(i => { return i == item }) >= 0 ? require("../assets/checkbox_checked.png") : require("../assets/checkbox_unchecked.png") : supplements.findIndex(i => { return i == item }) >= 0 ? require("../assets/checkbox_checked.png") : require("../assets/checkbox_unchecked.png")} />
                                                </View>
                                            </TouchableOpacity>

                                    }

                                    <Text style={{ fontSize: 17 }}>{item.choix}</Text>

                                </View >
                                <Text style={{ fontSize: 17 }}>{item.price}00</Text>

                            </View>}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={styles.headerSection}>
                                <Text style={styles.sectionHeaderTitle}>{title}</Text>
                                {
                                    title === "SUPPLEMENTS" ?
                                        <Text style={{ fontSize: 15, fontWeight: "700", color: "white", backgroundColor: "#787878" }}>MAX 16</Text> :
                                        title === "CHOIX" ?
                                            <Text style={{ fontSize: 15, fontWeight: "700", color: "white", backgroundColor: "#787878" }}>Obligatoire</Text> :
                                            null

                                }
                            </View>

                        )}
                        keyExtractor={(item, index) => item + index}

                    />
                </View>
                <View style={styles.addProductContainer}>

                    <View style={styles.cost}>
                        <View >
                            <Text style={{ fontSize: 20, fontWeight: "600" }}>Cost</Text>
                        </View>
                        <View >
                            <Text style={{ fontSize: 20, fontWeight: "600" }}>129,99TND</Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.addButton} onPress={addProduct}>

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
    RadioButton: {
        width: 30,
        height: 30,
    },
    addProductContainer: {
        width: "90%",
        height: "13%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
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
    cost: {
        height: "30%",
        marginVertical: 6,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center"
    },
    itemInfo: {
        width: "50%",
        flexDirection: "row",
        height: "100%",
        alignItems: "center"
    },

    itemContainer: {
        height: 32,
        width: "90%",
        alignSelf: "center",
        padding: 3,
        flexDirection: "row",
        justifyContent: "space-between",


    },
    sectionHeaderTitle: {
        color: "#313131",
        fontSize: 15,
        fontWeight: "700"
    },
    headerSection: {
        height: 30,
        width: "90%",
        backgroundColor: "#ECECEC",
        alignSelf: "center",
        padding: 3,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    details: {
        width: "100%",
        height: "35%",
        flexDirection: "column",
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
