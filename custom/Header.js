import React from 'react'
import {View,StyleSheet,Text,Image,Dimensions} from 'react-native';
import {Icon} from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';


export default function Header({navigation,title})
{
    const openDrawer = ()=>{
       navigation.openDrawer(); 
    }
    const checkProfile =()=>{
        navigation.navigate("Settings")
    }
    return(
        <View style={styles.headerContainer}>
            <Icon  style={styles.menu} name="menu" onPress={openDrawer}/>
             {title && <Text>{title}</Text>}
            <TouchableOpacity onPress={checkProfile}>
            <Image style={styles.imageUser} source={require("../assets/mootaz.jpg")} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer:{  
        width: Dimensions.get('screen').width,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center' ,
        
        
    },
    imageUser:{
        width:25,
        height:25,
        borderRadius:50,
        marginRight:20
    },
    menu:{
        marginLeft:15

    }
});


