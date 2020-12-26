import React, { useContext, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import {View,Text,FlatList,Image,TouchableOpacity,StyleSheet,ImageBackground}from 'react-native';
import AuthContext from '../../navigation/AuthContext';



export default function Partners(props){
    const context = useContext(AuthContext);
    const [background,setBackground] =useState(context.user.isPartner  ? context.user.partners[0].backgroundImage:context.user.workPlaces[0].backgroundImage);
    
    
    const checkPartner = (partner)=>{
        context.setPartner(partner);
        if(context.user.isPartner){
        props.navigation.navigate("businessDash")
        }
        if(context.user.isVendor){
            props.navigation.navigate("deliveryDash")
        }
    }


return(
<View style={{width:"100%",height:"100%"}}>
<ImageBackground style={{width:"100%",height:"100%",resizeMode:"cover"}} blurRadius={3}   source={background ? {uri:background }:require("../../assets/zarashop.jpg")}/>

     <View style={{height:"30%",width:"100%",position:"absolute",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <Text style={{fontSize:Dimensions.get("window").width*0.09,textAlign:"center",color:"white"}}>{context.user.isPartner ? "choose your partner":"choose your workplace"}</Text>
    </View>
<View style={{height:"70%",width:"100%",position:"absolute",top:"30%",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
    <View style={{justifyContent:"center",alignItems:"center",flexDirection:"column",height:"30%",width:"100%"}}>

<FlatList
    horizontal
    data={context.user.isPartner ? context.user.partners: context.user.isVendor ? context.user.workPlaces:[]}
    renderItem={({item})=>
<TouchableOpacity onLongPress={()=>setBackground(item.backgroundImage)} onPress={()=>{checkPartner(item)}}>

<View style={  styles.product}>
    <Image style={styles.productImage} source={item.profileImage ? { uri: item.profileImage } : require("../../assets/imagenotyet.jpg")} />
    <View style={{flex:1,flexDirection:"column",alignItems:"center",justifyContent:"center"}}><Text style={styles.productTitle}>{item.partnerName}</Text></View>
</View>
</TouchableOpacity>    

}
keyExtractor={item=>item._id}
>

</FlatList>
</View>
</View> 
</View>   

);
}


const styles = StyleSheet.create({
    product: {
        height: "100%",
        width: 140,
        marginHorizontal: 8,
        backgroundColor: '#292929' ,
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
        fontSize: 20,
        color: "white",
        textAlign:"center",
        fontWeight: "400",

    },
    productImage: {
        height: "70%",
        width: "100%",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        resizeMode: "cover"
    },
})