import React, { useContext, useState,useEffect } from 'react'
import {View,Text,StyleSheet, Dimensions,Image, TouchableOpacity} from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from'@react-native-community/picker'

export default function SingleProduct(props){
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
   const checkBag = ()=>{
       console.log(selectedSize);
       console.log(selectedColor);
       props.navigation.navigate("bag");
   }

    const goBack = ()=>{
        props.navigation.navigate("products")
    }

return(
    <View style={ styles.container}>



    <View style={styles.headerImageContainer}>

        <Image style={styles.headerImage} source={props.route.params.product.image} />
        <TouchableOpacity style={styles.leftArrow} onPress={goBack}>
            <Image style={{ width: "100%", height: "100%" }} source={require("../assets/left-arrow.png")} />
        </TouchableOpacity>
        <FontAwesome color={"black"} style={{ padding: 0, fontSize: 24, position: "absolute", top: "5%", right: "2%" }} name="shopping-bag" />
    </View>
    <View style={styles.productBodyContainer}>
        <View style={styles.productInfo}>
        <View style={styles.productTitle}>
        <Text style={{fontSize:28,fontWeight:"600"}}>{props.route.params.product.name}</Text>
        </View>
        <View style={styles.productDetails}>
        <Text style={{fontSize:14,fontWeight:"100"}}>322/0495 - WHITE</Text>
        </View>
        <View style={styles.productDescription}>
            <Text style={{fontSize:14,fontWeight:"100"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud </Text>
        </View>
        </View>
    </View>
    <View style={styles.productValues}>
        <View style={styles.colorAndSize}>
        <Picker
        selectedValue={selectedColor}
        style={{ marginLeft:14, height: "80%",  width: "40%" }}
        onValueChange={(itemValue, itemIndex) => setSelectedColor(itemValue)}
      >
        <Picker.Item label="red" value="red" />
        <Picker.Item label="white" value="white" />
      </Picker>
      <Picker
        selectedValue={selectedSize}
        style={{marginRight:14, height: "80%", width: "40%" }}
        onValueChange={(itemValue, itemIndex) => setSelectedSize(itemValue)}
      >
        <Picker.Item label="M" value="M" />
        <Picker.Item label="S" value="S" />
        <Picker.Item label="XL" value="XL" />
        <Picker.Item label="L" value="L" />

      </Picker>

        </View>
        <View style={styles.cost}>
            <View >
                <Text style={{fontSize:20,fontWeight:"600"}}>Cost</Text>
            </View>
            <View >
                <Text style={{fontSize:20,fontWeight:"600"}}>129,99TND</Text>
            </View>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={checkBag}>

            <View style={{height:"100%",height:"100%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
            <FontAwesome color={"white"} style={{ marginRight:8,padding: 0,fontSize:15 ,fontWeight:"700" }} name="shopping-bag" />
                <Text style={{fontSize:15 ,fontWeight:"700",color:"white"}}>ADD</Text>
            </View>
            </TouchableOpacity>

        </View>

    </View>

</View>
);


}

const styles = StyleSheet.create({
    buttonContainer:{
      height:"40%",
      width:"100%",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center"  ,
    },
    addButton:{
        height:"80%",
        width:"94%",
        borderRadius:8,
        backgroundColor: "#2474F1",
  
    },
    cost:{
        height:"30%",
        marginVertical:6,
        width:"94%",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        alignSelf:"center"
    },
    colorAndSize:{
        height:"30%",
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    productValues:{
        height:"18%",
        width:"100%",
        backgroundColor:"#F2F6FF",
    },
    productInfo:{
        height:"100%"
    },

    productTitle:{
        margin:8
    },
    productDetails:{
        margin:8

    },
    productDescription:{
        margin:8
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

productBodyContainer:{
    height:"30%",
    width:"100%",
    backgroundColor:"white"

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