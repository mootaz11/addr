import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Platform ,SafeAreaView} from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native-gesture-handler';
import {  getPartnerWithProducts } from '../rest/partnerApi'
const _categories = [
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
    const [categories,setCategories]=useState(null);
    /* useEffect(() => {
         setDarkmode(context.darkMode)
     }, [context.darkMode])
 */

 useEffect(() => {
    let isMounted = true;
        getPartnerWithProducts(props.route.params.partner._id).then(partner => {
            if(isMounted)
            {   
                setPartner(partner);
                if(partner.services.isFood){
                    setCategories(partner.categories);
                }
                else {
                    setCategories(partner.categories)
                }
                if(partner.lastProducts.length>0){
                    setNewArrivals(partner.lastProducts)       }
                  }    
                })
            .catch(err => { 
                if(isMounted){
                    alert("error while getting partner ")     
                }}
            )
            return () =>{ isMounted=false;}
    },[props.route.params])

    const goBack = () => {
        setNewArrivals(null);
        setPartner(null);
        props.navigation.navigate("Home",{brand:props.route.params.partner._id});
    }
    const showallNewArrivals = () => {
        props.navigation.navigate("products", { last_screen: "newArrivals" ,newArrivals:newArrivals})
    }

    const showallTopTrends =()=>{
        props.navigation.navigate("products", { last_screen: "topTrends" ,topTrends:topTrends})

    }
    const checkCategory = (item) => {


        if(partner.services.isFood){
            let _products =[];
        item.subCategories.map(sub=>{
            _products = _products.concat(sub.products)
        })

           props.navigation.navigate("products", {last_screen:"food",products:_products});
        }

        else {
            props.navigation.navigate("subCategory", { gender: item.name ,categories:partner.categories})
        }
    
    }
    const checkProduct = (item)=>{
        if(item.type=="food"){
            props.navigation.navigate("food",{product:item,last:null,partner:partner})
                        }
        else {
        props.navigation.navigate("singleProduct",{product:item,last:null})
        }
    }
    const checkBasket =()=>{
         props.navigation.navigate("basket",{last_screen:"singleBrand"});
    }

    
    const startPartnerConversation = () => {
        if(partner){
        let users_id = []
        partner.managers.forEach(manager => {
          users_id.push(manager.user);
        })
        users_id.push(context.user._id);
        users_id.push(partner.owner._id);
        const conversation = context.openConversationHandler({}, { users_id }, "group", partner);
        props.navigation.navigate("conversation", { conversation:conversation})
      
    }}
    
    



    return (

        <View style={!context.darkMode ?styles.container : styles.containerDark}>
            <View style={styles.headerImageContainer}>

                <Image style={styles.headerImage} blurRadius={0.5}  source={partner && partner.services.isFood?partner.backgroundImage ?{uri:partner.backgroundImage}: require("../assets/fast_food.jpg"):partner &&partner.backgroundImage ?{uri:partner.backgroundImage}: require("../assets/shop.jpg")} />
                <View style={styles.titleContainer}>
                </View>
                <Text style={styles.description}>The customer has always driven the business model</Text>
                <TouchableOpacity style={styles.leftArrow} onPress={goBack}>
                    <Image style={{ width: "100%", height: "100%" }} source={require("../assets/left-arrow-dark.png")} />

                </TouchableOpacity>

                <TouchableOpacity onPress={checkBasket}  style={{ position: "absolute",width: Dimensions.get("screen").height * 0.03, height: Dimensions.get("screen").height * 0.03,top: "10%", right: "4%" ,elevation:10,zIndex:50}}>
                <FontAwesome color={"white"} style={{ padding: 0, fontFamily:'Poppins',fontSize: Dimensions.get("screen").height * 0.03,}} name="shopping-bag" />


                </TouchableOpacity>

                <TouchableOpacity  onPress={()=>{startPartnerConversation()}} style={{width:Dimensions.get("screen").width*0.12,height:Dimensions.get("screen").width*0.12,position:"absolute",borderRadius:Dimensions.get("screen").width*0.12,top: "75%", right: "4%",elevation:10,zIndex:50,backgroundColor:"#2474F1"}}>
                    <View style={{fwidth:Dimensions.get("screen").width*0.12,height:Dimensions.get("screen").width*0.12,borderRadius:Dimensions.get("screen").width*0.12,flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                            <Image style={{width:"60%",height:"60%",resizeMode:"cover"}} source={require("../assets/chatting.png")}/>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.categories}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
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
                        <Text style={context.darkMode ?{ fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.05, color: "white", fontWeight: "500" } : { fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.05, color: "black", fontWeight: "500" }}>New Arrivals</Text>
                    </View>
                   
                   { newArrivals&&<TouchableOpacity  onPress={()=>{showallNewArrivals()}} >
                        <View style={{ flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "space-between", marginRight: 5 }}>
                            <Text style={context.darkMode ?{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.035, color: "white" } : { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.035, color: "black" }}>show all</Text>
                            <FontAwesome color={context.darkMode ?"white" : "black"}  style={{marginHorizontal: 3, fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.035 }} name="caret-right" />


                        </View>
                    </TouchableOpacity>}
                </View>
                <View style={styles.newArrivalsBody}>
                    {newArrivals ? <FlatList
                        data={newArrivals}
                        showsHorizontalScrollIndicator={false}

                        horizontal
                        renderItem={
                            ({ item }) =>
                                <TouchableOpacity onPress={()=>{checkProduct(item)}}>

                                <View style={context.darkMode ?styles.productDark : styles.product}>
                                    <Image style={styles.productImage} source={item.mainImage ? { uri: item.mainImage } : require("../assets/imagenotyet.jpg")} />
                                    <Text style={context.darkMode ?styles.productTitleDark : styles.productTitle}>{item.name}</Text>
                                    <Text style={styles.price}>{item.basePrice} DT</Text>
                                </View>
                                </TouchableOpacity>
                        }
                        keyExtractor={item => item._id}
                    >

                    </FlatList>
                        :
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <Text style={context.darkMode  ? { textAlign: "center", color: "white", fontFamily:'Poppins',fontSize: 16 }: { textAlign: "center", color: "black", fontFamily:'Poppins',fontSize: 16 }}>no new Arrivals yet</Text>

                        </View>}
                </View>
            </View>
            <View style={styles.newArrivals}>
                <View style={styles.newArrivalsHeader}>
                    <View style={{ marginLeft: 5 }}>
                        <Text style={context.darkMode ?{ fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.05, color: "white", fontWeight: "500" } : { fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.05, color: "black", fontWeight: "500" }}>Top Trends</Text>
                    </View>
               {   topTrends&&  <TouchableOpacity onPress={()=>{showallTopTrends()}}>
                        <View style={{ flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "space-between", marginRight: 5 }}>
                            <Text style={context.darkMode ?{ fontFamily:'Poppins', fontSize: Dimensions.get("screen").width*0.035, color: "white" } : { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.035, color: "black" }}>show all</Text>
                            <FontAwesome color={context.darkMode ?"white" : "black"} style={{ marginHorizontal: 3, fontFamily:'Poppins',fontSize: 15 }} name="caret-right"  />


                        </View>
                    </TouchableOpacity>
}
                </View>
                <View style={styles.newArrivalsBody}>
                    {topTrends ?
                        <FlatList
                        showsHorizontalScrollIndicator={false}
                            data={topTrends}
                            horizontal
                            renderItem={
                                ({ item }) =>
                                    <View style={context.darkMode ?styles.productDark : styles.product}>
                                        <Image style={styles.productImage} source={item.mainImage ? { uri: item.mainImage } : require("../assets/imagenotyet.jpg")} />
                                        <Text style={context.darkMode ?styles.productTitleDark : styles.productTitle}>{item.name}</Text>
                                        <Text style={styles.price}>{item.basePrice} DT</Text>
                                    </View>
                            }
                            keyExtractor={item => item._id}
                        >

                        </FlatList>
                        :
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <Text style={context.darkMode  ? { textAlign: "center", color: "white", fontFamily:'Poppins',fontSize: 16 }: { textAlign: "center", color: "black", fontFamily:'Poppins',fontSize: 16 }}>no Trends yet</Text>

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
        width: Dimensions.get("screen").height * 0.03,
        height: Dimensions.get("screen").height * 0.03,
        position: "absolute",
        top: "10%",
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
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width*0.09,
        fontWeight: "600",
        textShadowColor:"black",
        textShadowOffset:{width:1,height:1},
        textShadowRadius: 0.26,
        elevation:8

    },
    description: {
        color: "white",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width*0.03,
        fontWeight: "300",
        position: "absolute",
        top: "80%",
        textShadowColor:"black",
        textShadowOffset:{width:1,height:1},
        textShadowRadius: 0.26,
        elevation:8


    },
    categories: {
        width: "100%",
        height: "8%",
    },
    category: {
        height: "70%",
        width: Dimensions.get("screen").width*0.2,
        backgroundColor: "#2474F1",
        borderRadius: 24,
        margin: 4,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"

    },
    categoryTitle: {
        fontFamily:'Poppins'
        ,fontSize: Dimensions.get("screen").width*0.03,
        textAlign:"center",
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
        height: "79%",


    },
    product: {
        height: "100%",
        width: 140,
        marginHorizontal: 8,
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
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
    
        resizeMode: "cover"
    },
    productTitle: {
        fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.028,
        color: "black",
        fontWeight: "400",
    },

    productTitleDark: {
      fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.028,
        color: "white",
        fontWeight: "400",
        
    },
    price: {
        fontFamily:'Poppins',fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.028,
        color: "grey",
        fontWeight: "100",
    }


})