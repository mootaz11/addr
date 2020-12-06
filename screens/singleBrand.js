import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Platform } from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native-gesture-handler';
import {  getPartnerWithProducts } from '../rest/partnerApi'
const categories = [
    { name: "Men", _id: "55" },
    { name: "Women", _id: "56" },
    { name: "kids", _id: "57" },
    { name: "others", _id: "58" },

];

export default function SingleBrand(props) {
    const context = useContext(AuthContext)
    const [dark, setDark] = useState(true);
    const [magictap, setmagicTap] = useState(false)
    const [newArrivals, setNewArrivals] = useState(null);
    const [topTrends, setTopTrends] = useState(null);
    const [partner,setPartner]=useState(null);

    /* useEffect(() => {
         setDarkmode(context.darkMode)
     }, [context.darkMode])
 */
    
    useEffect(() => {
        getPartnerWithProducts(props.route.params.partner._id).then(partner => {
            if(partner.lastProducts.length>0){
                setPartner(partner)
                console.log(partner)
                setNewArrivals(partner.lastProducts)
            }
            else {
                setNewArrivals(null);
            }
        })
            .catch(err => { alert("error while getting partner ") })

    }, [props.route.params.partner])
    const goBack = () => {
        props.navigation.goBack()
    }
    const showall = () => { }
    const checkCategory = (item) => {
        props.navigation.navigate("gender", { gender: item.name ,categories:partner.categories})
    }
    const checkProduct = (item)=>{
        props.navigation.navigate("singleProduct",{product:item})
    }
    return (
        <View style={!dark ? styles.container : styles.containerDark}>




            <View style={styles.headerImageContainer}>

                <Image style={styles.headerImage} source={require("../assets/zarashop.jpg")} />
                <View style={styles.titleContainer}>
                    <Text numberOfLines={2} style={styles.title}>Make Yourself Comfortable</Text>

                </View>
                <Text style={styles.description}>The customer has always driven the business model</Text>
                <TouchableOpacity style={styles.leftArrow} onPress={goBack}>
                    <Image style={{ width: "100%", height: "100%" }} source={require("../assets/left-arrow-dark.png")} />

                </TouchableOpacity>
                <FontAwesome color={"white"} style={{ padding: 0, fontSize: 24, position: "absolute", top: "5%", right: "50%" }} name="shopping-bag" />
                <FontAwesome color={"white"} style={{ padding: 0, fontSize: 24, position: "absolute", top: "5%", right: "2%" }} name="search" />

            </View>
            <View style={styles.categories}>
                <FlatList
                    horizontal
                    data={categories}

                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => { checkCategory(item) }}>
                            <View style={styles.category}>
                                <Text style={styles.categoryTitle}>{item.name}</Text>

                            </View>

                        </TouchableOpacity>

                    }

                    keyExtractor={item => item._id}

                >

                </FlatList>
            </View>
            <View style={styles.newArrivals}>
                <View style={styles.newArrivalsHeader}>
                    <View style={{ marginLeft: 5 }}>
                        <Text style={dark ? { fontSize: 24, color: "white", fontWeight: "500" } : { fontSize: 24, color: "black", fontWeight: "500" }}>New Arrivals</Text>
                    </View>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "space-between", marginRight: 5 }}>
                            <Text style={dark ? { fontSize: 15, color: "white" } : { fontSize: 15, color: "black" }}>show all</Text>
                            <FontAwesome color={dark ? "white" : "black"} style={{ marginHorizontal: 3, fontSize: 15 }} name="caret-right" onPress={showall} />


                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.newArrivalsBody}>
                    {newArrivals ? <FlatList
                        data={newArrivals}
                        horizontal
                        renderItem={
                            ({ item }) =>
                                <TouchableOpacity onPress={()=>{checkProduct(item)}}>

                                <View style={dark ? styles.productDark : styles.product}>
                                    <Image style={styles.productImage} source={item.mainImage ? { uri: item.mainImage } : require("../assets/imagenotyet.jpg")} />
                                    <Text style={dark ? styles.productTitleDark : styles.productTitle}>{item.name}</Text>
                                    <Text style={styles.price}>{item.basePrice} DT</Text>
                                </View>
                                </TouchableOpacity>

                        }
                        keyExtractor={item => item._id}
                    >

                    </FlatList>
                        :
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>no new Arrivals yet</Text>

                        </View>}
                </View>
            </View>
            <View style={styles.newArrivals}>
                <View style={styles.newArrivalsHeader}>
                    <View style={{ marginLeft: 5 }}>
                        <Text style={dark ? { fontSize: 24, color: "white", fontWeight: "500" } : { fontSize: 24, color: "black", fontWeight: "500" }}>Top Trends</Text>
                    </View>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "space-between", marginRight: 5 }}>
                            <Text style={dark ? { fontSize: 15, color: "white" } : { fontSize: 15, color: "black" }}>show all</Text>
                            <FontAwesome color={dark ? "white" : "black"} style={{ marginHorizontal: 3, fontSize: 15 }} name="caret-right" onPress={showall} />


                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.newArrivalsBody}>
                    {topTrends ?
                        <FlatList
                            data={topTrends}
                            horizontal
                            renderItem={
                                ({ item }) =>
                                    <View style={dark ? styles.productDark : styles.product}>
                                        <Image style={styles.productImage} source={item.mainImage ? { uri: item.mainImage } : require("../assets/imagenotyet.jpg")} />
                                        <Text style={dark ? styles.productTitleDark : styles.productTitle}>{item.name}</Text>
                                        <Text style={styles.price}>{item.basePrice} DT</Text>
                                    </View>
                            }
                            keyExtractor={item => item._id}
                        >

                        </FlatList>
                        :
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>no Top Trends yet</Text>

                        </View>
                    }
                </View>
            </View>



        </View>
    );


}

const styles = StyleSheet.create({
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
        backgroundColor: "#121212"
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
        height: "35%"
    },
    headerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    titleContainer: {
        position: "absolute",
        top: "40%",
        zIndex: 50,
        elevation: 10,
    },
    title: {
        color: "white",
        fontSize: 34,
        fontWeight: "600",

    },
    description: {
        color: "white",
        fontSize: 20,
        fontWeight: "300",
        position: "absolute",
        top: "75%",
        zIndex: 50,
        elevation: 10

    },
    categories: {
        width: "100%",
        height: "8%",
    },
    category: {
        height: "70%",
        width: 100,
        backgroundColor: "#2474F1",
        borderRadius: 24,
        margin: 10,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"

    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: "500",
        color: "white"
    }
    ,
    newArrivals: {
        width: "100%",
        height: "28%",
    },
    newArrivalsHeader: {
        width: "100%",
        height: "22%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"

    },

    newArrivalsBody: {
        width: "100%",
        height: "78%",


    },
    product: {
        height: "100%",
        width: 140,
        marginHorizontal: 8,
        backgroundColor: "white",
        borderRadius: 8

    },
    productDark: {
        height: "100%",
        width: 140,
        marginHorizontal: 8,
        borderRadius: 8,
        backgroundColor: "#292929",


    },
    productImage: {
        height: "70%",
        width: "100%",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        resizeMode: "cover"
    },
    productTitle: {
        fontSize: 16,
        color: "black",
        fontWeight: "400",

    },
    productTitleDark: {
        fontSize: 16,
        color: "white",
        fontWeight: "400",

    },
    price: {
        fontSize: 14,
        color: "grey",
        fontWeight: "100",
    }


})