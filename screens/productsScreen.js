import React, { useContext, useState,useEffect } from 'react'
import {View,Text,StyleSheet, Dimensions,Image, TouchableOpacity, ActivityIndicator,SafeAreaView} from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native-gesture-handler';
import {getProductsByCategory} from '../rest/productApi';


export default function Products(props){
    
    const context = useContext(AuthContext)
    const [magictap,setmagicTap]= useState(false);
    const [products,setProducts]=useState(null);

    useEffect(()=>{
        let isMounted = true ;
            if(props.route.params.last_screen=="newArrivals"){
                    setProducts(props.route.params.newArrivals)
            }
            
            if(props.route.params.last_screen=="topTrends"){
                setProducts(props.route.params.topTrends);
            }
            if(props.route.params.last_screen=='food'){
                setProducts(props.route.params.products)    
            }
            if(props.route.params.last_screen!="topTrends"&&props.route.params.last_screen!="newArrivals"){     
                setProducts(props.route.params.products)    
            }
            return () =>{ isMounted=false;setProducts(null);}
            },[props.route.params])

    const goBack = ()=> {
        setProducts(null);
        props.navigation.goBack()
    }

    const checkSingleProduct=(value)=>{
        if(value.type=="food"){
            props.navigation.navigate("food",{product:value});
        }
        else {
        props.navigation.navigate("singleProduct",{product:value})
        }
    }
    
    return(
        <SafeAreaView style={{flex:1}}>
           <View style={context.darkMode ?   styles.containerDark :  styles.container}>
                        <View style={context.darkMode ?  styles.menuDark  : styles.menu}>
                <TouchableOpacity  style={styles.leftArrowContainer} onPress={goBack}>
                    <View>
                    <Image style={{height:Dimensions.get("screen").height * 0.03,width:Dimensions.get("screen").height * 0.03}}source={context.darkMode ? require("../assets/left-arrow-dark.png") : require("../assets/left-arrow.png")}/>
                    </View>
                    </TouchableOpacity>
                 <View style={styles.titleContainer}>
                 <Text style={context.darkMode ? styles.TitleDark :  styles.Title}>{props.route.params.last_screen=="newArrivals" ? "New Arrivals"  :  props.route.params.last_screen =="topTrends" ? "Top Trends" : "Products"}</Text>
                </View>   
                <View style={styles.searchContainer}>
                </View>
             </View>
              {
               products && products.length>0? 
               <View style={styles.partners}>
               <FlatList
                   data={products}
                   numColumns={2}
                   renderItem={({item})=>
                   <TouchableOpacity style={{width:"45%",height:250,margin:4}} onPress={()=>{checkSingleProduct(item)}} onMagicTap={()=>{setmagicTap(magictap=>!magictap)}}>
                   <View style={ magictap ? styles.partnerContainerTapped :(context.darkMode ?  styles.partnerContainerDark :  styles.partnerContainer)} >
                       <Image style={styles.partnerImage} source={{uri:item.mainImage}}/>    
                       <View style={styles.productinfo}>
                       <Text style={context.darkMode ?  styles.productTitleDark : styles.productTitle}>{item.name}</Text>
                       <Text style={styles.price}>{item.basePrice} DT</Text>
                           </View>    
                   </View>
                   </TouchableOpacity>


               }
               keyExtractor={item => item._id}               
               >
               </FlatList>
           </View>
           :
           <View style={{height:"90%",width:"100%",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
               <Text style={context.darkMode ? {fontFamily:'Poppins',fontSize:16,color:"white"}:{fontFamily:'Poppins',fontSize:16,color:"black"}}>no products in stock</Text>
           </View>
           }
        </View>
        </SafeAreaView>
);
}

const styles = StyleSheet.create({
    productTitle:{
        fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.03,
        color: "black",
        fontWeight: "400",
    },

    productTitleDark:{
        fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width*0.03,
        color: "white",
        fontWeight: "400",

    },
    price: {
        fontFamily:'Poppins',fontSize: 14,
        color: "grey",
        fontWeight: "100",
    },
container : {
    flex:1,
    flexDirection:"column",
    height:Dimensions.get("window").height,
    width:Dimensions.get("window").width,
    backgroundColor:"white",
},       

containerDark : {
    flex:1,
    flexDirection:"column",
    height:Dimensions.get("window").height,
    width:Dimensions.get("window").width,
    backgroundColor: "#121212",

},
menu: {
    width: "100%",
    height: "8%",
    backgroundColor: "white",
    flexDirection: "row",
    marginBottom: 8,
    marginTop:10
},
menuDark: {
    width: "100%",
    height: "8%",
    backgroundColor: "#121212",
    flexDirection: "row",
    marginBottom: 8,
    marginTop:10


},
leftArrowContainer: {
    width: "10%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop:5
},
leftArrow: {
    width: 30,
    height: 30
},


titleContainer:{
    width:"80%",
    height:"100%",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
},
Title: {
    fontWeight: "700",
    fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.05,
},
TitleDark: {
    fontWeight: "700",
    fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.05,
    color: "white"

},
searchContainer:{
    width:"10%",
    height:"100%",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
},
partners:{
    width:"100%",
    height:"90%"
},
partnerContainer:{
    width:"100%",
    height:"100%",
    borderRadius:8,
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
},
partnerContainerDark:{
    width:"100%",
    height:"100%",
    borderRadius:8,
    backgroundColor:"#292929",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"

},

partnerContainerTapped:{
    width:"100%",
    height:"100%",
    backgroundColor:"#2474F1",
    borderRadius:8,
    flexDirection:"column",
    justifyContent:"center"
},
partnerImage:{
    width:"100%",
    height:"80%",
    borderTopLeftRadius:8,
    borderTopRightRadius:8,
    borderBottomLeftRadius:8,
    borderBottomRightRadius:8,
    
    resizeMode:"cover"
},
productinfo:{
    width:"100%",
    height:"20%",

},
partnerName:{
    fontFamily:'Poppins',fontSize:18,
    color:"black",
    fontWeight:"500"
}




})