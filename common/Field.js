import React from 'react';
import {Text,View,TextInput,StyleSheet,Image} from 'react-native';

export default function Field(props){
    const error = props.error;
    const handleChange =(value)=>{
        props.onChange(props.name,value)
    }
    
    const handleTouch=()=>{
        props.onTouch(props.name)
    }

    return (
            <View style={styles.inputContainer}>
                <Image style={styles.image} source={props.imageSrc}/>
                <TextInput  
                    onBlur={handleTouch} 
                    onChangeText={handleChange} 
                    style={styles.input} 
                    placeholder={props.placeholder}
                    placeholderTextColor={"#DBDBDB"}
                    secureTextEntry={props.secureTextEntry}            
                    />            
            </View>
    );
}

const styles = StyleSheet.create({
    error:{
        marginTop:5,
        color:'red'
    },
inputContainer:{
    flexDirection:"row",
    alignItems:"center",
    marginTop:10,
    width:"94%",
    height:40,
    borderWidth:0.5,
    borderColor:'#DBDBDB',
    paddingVertical:10,
    borderRadius:20,
    margin:"2%",
    

        
},
image:{
    margin:8,
    width:"12%",
    height:30,
    resizeMode:"contain"
    
},
input:{
    height:"100%",
    width:"88%",
    alignSelf:'stretch',
    color:"black"

    
}

});
