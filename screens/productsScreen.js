import React, { useContext, useState,useEffect } from 'react'
import {View,Text,StyleSheet, Dimensions,Image, TouchableOpacity} from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native-gesture-handler';

const products=[
    {name:"BIKER JACKER",price:"123.487 TND",image:require("../assets/product1.webp"),_id:"55"},
    {name:"BIKER JACKER",price:"123.487 TND",image:require("../assets/product2.webp"),_id:"56"},
    {name:"BIKER JACKER",price:"123.487 TND",image:require("../assets/product3.webp"),_id:"57"},
    {name:"BIKER JACKER",price:"123.487 TND",image:require("../assets/product4.webp"),_id:"58"},
    {name:"BIKER JACKER",price:"123.487 TND",image:require("../assets/product5.webp"),_id:"59"},
    {name:"BIKER JACKER",price:"123.487 TND",image:require("../assets/product6.webp"),_id:"60"},

]


export default function Products(props){
    const context = useContext(AuthContext)
    const [dark,setDark] =  useState(true);
    const [magictap,setmagicTap]= useState(false)

    /*useEffect(()=>{
        setDarkmode(context.darkMode)
    },[context.darkMode])
    */

    const goBack = ()=> {
        props.navigation.navigate("gender")
    }
    const checkSingleProduct=(value)=>{
        props.navigation.navigate("singleProduct",{product:value})
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
            <View style={styles.partners}>
                <FlatList
                    data={products}
                    numColumns={2}
                    renderItem={({item})=>
                    <TouchableOpacity style={{width:"45%",height:250,margin:8,}} onPress={()=>{checkSingleProduct(item)}} onMagicTap={()=>{setmagicTap(magictap=>!magictap)}}>
                    <View style={ magictap ? styles.partnerContainerTapped :(dark ? styles.partnerContainerDark :  styles.partnerContainer)} >
                        <Image style={styles.partnerImage} source={item.image}/>    
                        <View style={styles.productinfo}>
                        <Text style={dark ? styles.productTitleDark : styles.productTitle}>{item.name}</Text>
                        <Text style={styles.price}>{item.price}</Text>

                            </View>    
                    </View>
                    </TouchableOpacity>


                }
                keyExtractor={item => item._id}
                
                >

                </FlatList>

            </View>
        
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
    color:"back",
    fontWeight:"500"
}




})