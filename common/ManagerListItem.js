import React ,{useState,useEffect} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';


const ManagerListItem = (props) => {
    const [dark,setDark]=useState(props.dark);
    
    
      useEffect(()=>{
          setDark(props.dark);
      },[props.dark])
    return (
            <View  style={styles.itemContainer}>
                <View style={styles.imageContainer}>
                <Image 
                    style={styles.image} 
                    source={props.image}
                    />
                </View>
                <View style={styles.paragraphContainer}>
                    <Text style={dark ? styles.nameStyleDark :  styles.nameStyle}> {props.name} </Text>
                    <Text style={dark ? {color:"white"}:{color:"black"}}>{props.title}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={props.startConversation.bind(this,props.manager)}> 
                        <Image
                        style={styles.imageButton}
                        source={dark ? require("../assets/speech-bubble.png") : require("../assets/images/speech.png")}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={props.deleteManager.bind(this,props.user)}>
                        <Image 
                        style={styles.imageButton}
                        source={dark ? require("../assets/images/trashDark.png") : require("../assets/images/trash.png")}
                        />
                    </TouchableOpacity>
                </View>
            </View>
    );

};


const styles = StyleSheet.create({
    itemContainer: {
        height:55,
        flexDirection: 'row',
        //backgroundColor:'pink',
        marginVertical: 4,
    },
    imageContainer:{
        //backgroundColor:'orange',
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    image: {
        width: '83%',
        height:'98%',
        borderRadius:30,
        //resizeMode:'contain'
    },
    paragraphContainer:{
        flex:3,
        paddingLeft:5,
        //backgroundColor:'purple',
    },
    nameStyle:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    nameStyleDark:{
        fontSize: 18,
        fontWeight: 'bold',
        color:"white"
    },
    buttonsContainer: {
        flex:1.5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    imageButton:{
        //backgroundColor:'green',
        height:'58%', //60%
        resizeMode: 'contain',
        //backgroundColor: 'yellow'
    }

});

export default ManagerListItem;

