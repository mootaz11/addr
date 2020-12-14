import React, { useContext, useState,useEffect } from 'react'
import {View,Text,StyleSheet, Dimensions,Image, TouchableOpacity, ActivityIndicator} from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native-gesture-handler';
import {getProductsByCategory} from '../rest/productApi';


export default function Products(props){
    const context = useContext(AuthContext)
    const [dark,setDark] =  useState(context.darkMode);
    const [magictap,setmagicTap]= useState(false);
    const [products,setProducts]=useState(null);

    useEffect(()=>{
        console.log(props.route.params.category.name);
        
        let isMounted = true ;
            if(props.route.params.last_screen=="newArrivals"){
                    setProducts(props.route.params.newArrivals)
            }
            else{  
                getProductsByCategory(props.route.params.category._id,props.route.params.gender)
                .then(_products=>{
                    if(isMounted){
                        if(_products.length>0){
                            setProducts(_products);
                        }
                    }
                  
                }).catch(err=>{
                    if(isMounted){
                        alert("error occured")
                    }
                })      
            }
            
            
            return () =>{ isMounted=false;setProducts(null);}
            },[props.route.params])


            useEffect(()=>{
        setDark(context.darkMode)
                },[context.darkMode])
    
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
           <View style={!dark ? styles.container: styles.containerDark}>
                        <View style={dark ? styles.menuDark  : styles.menu}>
                <TouchableOpacity  style={styles.leftArrowContainer} onPress={goBack}>
                    <View >
                    <Image style={styles.leftArrow} source={dark ?require("../assets/left-arrow-dark.png") : require("../assets/left-arrow.png")}/>
                    </View>
                    </TouchableOpacity>
                 <View style={styles.titleContainer}>
                 <Text style={dark ?styles.TitleDark :  styles.Title}>Products</Text>
                </View>   
                <View style={styles.searchContainer}>

                <FontAwesome color={dark ?"white" :  "black"} style={{ padding: 0, fontSize: 24 }} name="search" />
                </View>
             </View>
              {
               products ? 
               <View style={styles.partners}>
               <FlatList
                   data={products}
                   numColumns={2}
                   renderItem={({item})=>
                   <TouchableOpacity style={{width:"45%",height:250,margin:8,}} onPress={()=>{checkSingleProduct(item)}} onMagicTap={()=>{setmagicTap(magictap=>!magictap)}}>
                   <View style={ magictap ? styles.partnerContainerTapped :(dark ? styles.partnerContainerDark :  styles.partnerContainer)} >
                        
                       <Image style={styles.partnerImage} source={{uri:item.mainImage}}/>    

                       <View style={styles.productinfo}>
                       <Text style={dark ? styles.productTitleDark : styles.productTitle}>{item.name}</Text>
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
               <Text style={{fontSize:16,color:"white"}}>no products in stock</Text>
          
           </View>


           }
           
           
        
        </View>
    );

}


const styles = StyleSheet.create({
    productTitle: {
        fontSize: 16,
        color: "black",
        fontWeight: "400",

    },
    productTitleDark:{
        fontSize: 16,
        color: "white",
        fontWeight: "400",

    },
    price: {
        fontSize: 14,
        color: "grey",
        fontWeight: "100",
    },
container : {
    flex:1,
    flexDirection:"column",
    height:Dimensions.get("window").height,
    width:Dimensions.get("window").width,
    backgroundColor:"#F2F6FF",
},       

containerDark : {
    flex:1,
    flexDirection:"column",
    height:Dimensions.get("window").height,
    width:Dimensions.get("window").width,
    backgroundColor: "#121212",

},
menuDark:{
    width:"100%",
    height:"10%",
    flexDirection:"row",
    backgroundColor: "#121212",


},
menu:{
    width:"100%",
    height:"10%",
    backgroundColor:"white",
    flexDirection:"row",
},
leftArrowContainer:{
    width:"10%",
    height:"100%",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
},
leftArrow:{
    width:30,
    height:30
},

titleContainer:{
    width:"80%",
    height:"100%",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
},
Title:{
    fontWeight:"700",
    fontSize:28
},
TitleDark:{
    fontWeight:"700",
    fontSize:28,
    color:"white"

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
    backgroundColor:"white",
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
    resizeMode:"cover"
},
productinfo:{
    width:"100%",
    height:"20%",

},
partnerName:{
    fontSize:18,
    color:"black",
    fontWeight:"500"
}




})