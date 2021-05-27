import React,{useContext} from 'react';

import AuthContext from '../navigation/AuthContext';
import { StyleSheet,View,Image, Text,Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


const Product = (props)=>{
    const context= useContext(AuthContext);
return (
  <TouchableOpacity onPress={props.checkProduct.bind(this,props.product)} style={{       marginHorizontal: 2,
    height: "98%",
  width: Dimensions.get("screen").height*0.2,}}>

    <View  style={context.darkMode ? styles.productDark   : styles.product}>
    <Image style={styles.productImage} source={props.mainImage} />
    <Text style={ context.darkMode ? styles.productTitleDark:styles.productTitle}>{props.name.length>13?props.name.substring(0,13)+'...':props.name}</Text>
    <Text style={context.darkMode ? styles.productTitleDark:styles.productTitle}>{props.product.discount ? props.basePrice*((100-props.product.discount)/100):props.basePrice} DT</Text>
  {props.product.discount >0&&  <Text style={context.darkMode ?{fontFamily:'Poppins',textDecorationLine:"line-through",fontSize: Dimensions.get("screen").width*0.02,
color: "white",
fontWeight: "300"
}: {fontFamily:'Poppins',textDecorationLine:"line-through",fontSize: Dimensions.get("screen").width*0.02,
color: "black"} }>{props.basePrice} DT</Text>}


  </View>
{props.product.discount >0&&  <View style={{width:Dimensions.get("screen").width*0.07,height:Dimensions.get("screen").width*0.07,borderRadius:Dimensions.get("screen").width*0.07,backgroundColor:"#2474F1",position:"absolute",top:"2%",right:"2%",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
    <Text style={{fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.025,
color: "white"}}>{props.product.discount }%</Text>
  </View>}
  </TouchableOpacity>

)
}
const styles = StyleSheet.create({
    price: {
      fontFamily:'Poppins', 
      fontSize: Dimensions.get("screen").width*0.03,
      color: "grey",
    }, 
    productImage: {
      height: Dimensions.get("screen").height*0.2,
      width: "100%",
      borderRadius:8,
      resizeMode: "cover"
    },
    productTitle: {
      fontFamily:'PoppinsBold',
      fontSize: Dimensions.get("screen").width*0.03,
      color: "black",
    },
    productTitleDark: {
      fontFamily:'PoppinsBold',
      fontSize: Dimensions.get("screen").width*0.03,
      color: "white",
  },
    product: {
      height: "100%",
      width: Dimensions.get("screen").height*0.2,
      backgroundColor: "white",
      marginHorizontal:2,
      borderRadius: 8,
      flexDirection:"column",
      
    },
    productDark: {
      height: "90%",
      width: Dimensions.get("screen").height*0.2,
      marginHorizontal:2,
      borderRadius: 8,
      backgroundColor: "black",
      flexDirection:"column"

  
  },
    
  
    
  });
  
  

export default Product ; 