import React,{useContext} from 'react';

import AuthContext from '../navigation/AuthContext';
import { StyleSheet,View,Image, Text,Dimensions } from 'react-native';


const Product = (props)=>{
    const context= useContext(AuthContext);

return (
    <View  style={context.darkMode ? styles.productDark   : styles.product}>
    <Image style={styles.productImage} source={props.mainImage} />
    <Text style={ context.darkMode ? styles.productTitleDark:styles.productTitle}>{props.name}</Text>
    <Text style={context.darkMode ? styles.productTitleDark:styles.productTitle}>{props.description?props.description:"no description"}</Text>
    <Text style={context.darkMode ?{fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03,
color: "white",
fontWeight: "300"
}: {fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03,
color: "black"} }>{props.basePrice} DT</Text>


  </View>
)
}
const styles = StyleSheet.create({
    price: {
      fontFamily:'Poppins',      fontSize: Dimensions.get("screen").width*0.03,

      color: "grey",
    },
    productImage: {
      height: 140,
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
      height: "90%",
      width: 140,
      marginHorizontal: 2,
      backgroundColor: "white",
      borderRadius: 8,
      flexDirection:"column",
      
    },
    productDark: {
      height: "90%",
      width: 140,
      marginHorizontal:2,
      borderRadius: 8,
      backgroundColor: "black",
      flexDirection:"column"

  
  },
    
  
    
  });
  
  

export default Product ; 