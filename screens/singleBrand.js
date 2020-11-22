import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Platform } from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native-gesture-handler';
const categories = [
    { name: "Men", _id: "55" },
    { name: "Women", _id: "56" },
    { name: "kids", _id: "57" },
    { name: "kids", _id: "58" },
    { name: "kids", _id: "59" },

];
const newArrivals = [
    { name: "BIKER JACKET", price: "129.99 TND", image: require("../assets/bikerjacket.jpg"), _id: "51" },
    { name: "BIKER JACKET", price: "129.99 TND", image: require("../assets/bikerjacket.jpg"), _id: "52" },
    { name: "BIKER JACKET", price: "129.99 TND", image: require("../assets/bikerjacket.jpg"), _id: "53" }
];
export default function SingleBrand(props) {
    const context = useContext(AuthContext)
    const [darkmode, setDarkmode] = useState(true);
    const [magictap, setmagicTap] = useState(false)

    useEffect(() => {
        setDarkmode(context.darkMode)
    }, [context.darkMode])

    const goBack = () => {
        props.navigation.navigate("brand")
    }
    const showall = () => { }
    const checkCategory = (item)=>{
        props.navigation.navigate("gender",{gender:item.name})
    }
    return (
        <View style={!darkmode ? styles.container : styles.containerDark}>




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
                        <TouchableOpacity onPress={()=>{checkCategory(item)}}>
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
                        <Text style={{ fontSize: 24, color: "black", fontWeight: "500" }}>New Arrivals</Text>
                    </View>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "space-between", marginRight: 5 }}>
                            <Text style={{ fontSize: 15, color: "black" }}>show all</Text>
                            <FontAwesome color={"black"} style={{ marginHorizontal: 3, fontSize: 15 }} name="caret-right" onPress={showall} />


                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.newArrivalsBody}>
                    <FlatList
                        data={newArrivals}
                        horizontal
                        renderItem={
                            ({ item }) =>
                                <View style={styles.product}>
                                    <Image style={styles.productImage} source={item.image} />
                                    <Text style={styles.productTitle}>{item.name}</Text>
                                    <Text style={styles.price}>{item.price}</Text>
                                </View>
                        }
                        keyExtractor={item => item._id}
                    >

                    </FlatList>

                </View>
            </View>
            <View style={styles.newArrivals}>
                <View style={styles.newArrivalsHeader}>
                    <View style={{ marginLeft: 5 }}>
                        <Text style={{ fontSize: 24, color: "black", fontWeight: "500" }}>Top Trends</Text>
                    </View>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "space-between", marginRight: 5 }}>
                            <Text style={{ fontSize: 15, color: "black" }}>show all</Text>
                            <FontAwesome color={"black"} style={{ marginHorizontal: 3, fontSize: 15 }} name="caret-right" onPress={showall} />


                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.newArrivalsBody}>
                    <FlatList
                        data={newArrivals}
                        horizontal
                        renderItem={
                            ({ item }) =>
                                <View style={styles.product}>
                                    <Image style={styles.productImage} source={item.image} />
                                    <Text style={styles.productTitle}>{item.name}</Text>
                                    <Text style={styles.price}>{item.price}</Text>
                                </View>
                        }
                        keyExtractor={item => item._id}
                    >

                    </FlatList>

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
    price: {
        fontSize: 14,
        color: "grey",
        fontWeight: "100",
    }


})