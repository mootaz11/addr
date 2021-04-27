import React , {useEffect, useState}from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, Switch} from 'react-native';


import Colors from '../constants/Colors';

const DeliveryListItem = (props) => {

    const [switchValue, setSwitchValue] = useState(false);
    const [dark,setDark]=useState(props.dark);
    
    const toggleSwitch = (value) => {
        setSwitchValue(value);
      };
      useEffect(()=>{
          setDark(props.dark);
      },[props.dark])
    return (
            <View style={styles.itemContainer}>
                <View style={styles.imageContainer}>
                    <Image 
                        style={styles.image} 
                        source={props.image}
                    />
                </View>
                <View style={styles.paragraphContainer}>
                    <Text style={dark ?styles.nameStyleDark :  styles.nameStyle}> {props.name} </Text>
                    <Text style={dark ? {color:"white"}:{color:"black"}}>{props.time}</Text>
                </View>
                <View style={styles.buttonsContainer}>      
                <TouchableOpacity onPress={props.startConversation.bind(this,props.deliverer,props.name)}> 
                        <Image
                        style={styles.imageButton}
                        source={dark ? require("../assets/speech-bubble.png") : require("../assets/images/speech.png")}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={props.deleteDeliverer.bind(this,props.deliverer._id)}>
                        <Image 
                        style={styles.imageButton}
                        source={dark ? require('../assets/images/trashDark.png') : require('../assets/images/trash.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
    );

};

const styles = StyleSheet.create({
    itemContainer: {
        height:57,
        flexDirection: 'row',
        //backgroundColor:'pink',
        marginVertical: 5
    },
    imageContainer:{
        //backgroundColor:'orange',
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    image: {
        width:'83%',
        height:'95%',
        borderRadius:30,
        //resizeMode:'contain'
    },
    paragraphContainer:{
        //backgroundColor:'purple',
        paddingLeft:5,
        flex:3,
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
        flexDirection:'row',
        //backgroundColor:'red',
        justifyContent:'space-around',
        alignItems: 'center',
    },
    imageButton:{
        height:'58%',//60%
        resizeMode: 'contain',
    }

});

export default DeliveryListItem;































/*import React , {useState}from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, Switch} from 'react-native';


import Colors from '../constants/Colors';

const DeliveryListItem = (props) => {

    const [switchValue, setSwitchValue] = useState(false);
    
    const toggleSwitch = (value) => {
        setSwitchValue(value);
      };
    
    return (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <View style={styles.imageContainer}>
                    <Image 
                        style={styles.image} 
                        source={props.image}
                    />
                </View>
                <View style={styles.paragraphContainer}>
                    <Text style={styles.nameStyle}> {props.name} </Text>
                    <Text>{props.time}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <Switch 
                    trackColor={{ false: "#767577", true: Colors.primary }}
                    thumbColor={switchValue ? "white" : "#f4f3f4"}
                    onValueChange={toggleSwitch}
                    value={switchValue}
                    />
                    <TouchableOpacity onPress={()=>{}}>
                        <Image 
                        style={styles.imageButton}
                        source={require('../assets/images/trash.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        //backgroundColor:'yellow'
    },
    itemContainer: {
        height:'90%',
        flexDirection: 'row',
        backgroundColor:'pink',
        marginVertical: 10
    },
    imageContainer:{
        //backgroundColor:'orange',
        flex:1,
        alignItems:'center'
    },
    image: {
        width:'100%',
        height:'100%',
        borderRadius:100,
        //resizeMode:'contain'
    },
    paragraphContainer:{
        //backgroundColor:'purple',
        paddingLeft:5,
        flex:3,
    },
    nameStyle:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonsContainer: {
        flex:2,
        flexDirection:'row',
        //backgroundColor:'red',
        justifyContent:'space-between',
        alignItems: 'center',
    },
    imageButton:{
        height:40,//60%
        resizeMode: 'contain',
    }

});

export default DeliveryListItem;*/
