import React from 'react';
import {View,Image,StyleSheet} from 'react-native';


export default function Splash(props){
    return (
        <View style={styles.container}>
            <Image source={require("../assets/logo.png")} style={styles.image}/>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center"

    }
    ,image:{
        width:"50%",
        height:"50%",
        resizeMode:"contain"
    }
})