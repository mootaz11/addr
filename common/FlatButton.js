import React from 'react';
import {StyleSheet,TouchableOpacity,Text,View} from 'react-native';


export default function FlatButton({text}){
    return(
        <View style={styles.button}>
            <Text style={styles.buttonText}>{text}</Text>
        </View>
        );
}



const styles = StyleSheet.create({

    button:{
    width:"100%",
    borderRadius:25,
    paddingVertical:14,
    paddingHorizontal:10,
    backgroundColor:"#2474F1",
    shadowColor:'#fff',
    marginVertical:7,
    shadowOffset:{width:1,height:1},
    shadowColor:'#333',
    shadowOpacity:0.3,
    marginTop:20,
},
buttonText:{
color:'white',
fontWeight:'bold',
textTransform:'uppercase',
textAlign:'center',
fontSize:16,
letterSpacing:1,
textAlign:'center'
}
}
)
