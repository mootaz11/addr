import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, Switch,Alert} from 'react-native';
import {updateProductState} from '../rest/productApi';

import Colors from '../constants/Colors';

const ProductListItem = (props) => {
    const [switchValue, setSwitchValue] = useState(props.isActive);
    const toggleSwitch = (value) => {
        updateProductState(props.id,value).then(message=>{
            setSwitchValue(value);
            Alert.alert('',message, [{ text: "OK" }],{cancelable:false})
        }).catch(err=>{
            alert("error occured")
        })
      };
    
    return (
        <View style={ styles.container}>
        <View style={ props.dark ?  styles.itemContainerDark : styles.itemContainer} >
            <View style={styles.indexContainer}>
                <Text style={props.dark ?  {color:"white"}:{color:"black"}}>{props.index}</Text>
            </View>
            <View style={styles.imageContainer}>
                <Image 
                style={styles.image} 
                source={{uri:props.image}}
                />
            </View>
            <View style={styles.textStyle1}>
                <View style={styles.textContainerTitle}>
                <Text style={props.dark ?  {color:"white"}:{color:"black"}}>{props.title ? props.title.length<=20 ?props.title:props.title.substring(0,20)+"...":""}</Text>
                </View>
                <View style={styles.textContainerStock}>
                <Text style={props.dark ?  {color:"white"}:{color:"black"}}>stock:</Text>
                <Text style={props.dark ?  {color:"white"}:{color:"black"}}>{props.stock}</Text>
                </View>
            </View>
            <View style={styles.textStyle2}>
                <View style={styles.priceContainer}>
                <Text style={props.dark ?  {color:"white"}:{color:"black"}}>
                        Price: 
                    </Text>
                    <Text style={props.dark ?  {color:"white"}:{color:"black"}}>
                        {props.price} TND 
                    </Text>
                </View>
                <View style={styles.switchContainer}>
                    <Text style={props.dark? {marginTop: 7,color:"white"}:{marginTop:7,color:"black"}}>Switch</Text> 
                    <Switch 
                    trackColor={{ false: "#767577", true: Colors.primary }}
                    thumbColor={switchValue ? "white" : "#f4f3f4"}
                    onValueChange={toggleSwitch}
                    value={switchValue}/>
                </View>
            </View>
        </View>
        </View>
    );

};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        height:100,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'yellow',
        paddingVertical: 10,
    },
 
    itemContainer: {
        backgroundColor: 'white',
        //backgroundColor:'red',
        flexDirection: 'row',
        height: '120%',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 20,
        marginVertical: 10,
        elevation: 5
    },
    itemContainerDark:{
        backgroundColor: '#292929',
        //backgroundColor:'red',
        flexDirection: 'row',
        height: '120%',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderColor: '#292929',
        borderWidth: 1,
        borderRadius: 20,
        marginVertical: 10,
        elevation: 5
    },
   
    indexContainer:{
        flex:0.5,
        //backgroundColor:'orange',
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:5
    },
    imageContainer:{
        flex:1,
        //backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center'
    },
     image: {
         width: '100%',
         height:'90%',
         borderRadius: 10
         //resizeMode: 'contain',
    },

    textStyle1: {
        flex:3,
        //backgroundColor: 'pink',
        justifyContent: 'space-between',
        height:'80%',
        marginHorizontal:3
    },
    textContainerTitle:{
        //backgroundColor:'green',
        //alignItems:'center'
    },
    textContainerStock: {
        //backgroundColor:'yellow',
        flexDirection:'row',
    },
    textStyle2: {
        //backgroundColor: 'grey',
        flex:3,
        justifyContent: 'space-between',
        height:'80%',
        marginRight: 3,
    },
    priceContainer:{
        flexDirection: 'row',
        //backgroundColor:'green',
        justifyContent:'space-between'
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default ProductListItem;










/*import React, {useState} from 'react';
import {StyleSheet, View, Text, Image, Switch} from 'react-native';

import Colors from '../constants/Colors';

const ProductListItem = (props) => {
    const [switchValue, setSwitchValue] = useState(false);
    
    const toggleSwitch = (value) => {
        setSwitchValue(value);
      };
    
    return (
        <View style={styles.container}>
        <View style={styles.itemContainer} >
            <Text style={{marginLeft:8}}>{props.index}</Text>
            <Image 
            style={styles.image} 
            source={props.image}
            />
            <View style={styles.textStyle1}>
                <View style={styles.textContainer}>
                    <Text>{props.title}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text>stock: {props.stock} </Text>
                </View>
            </View>
            <View style={styles.textStyle2}>
                <View>
                    <Text style={{marginTop: 2}}>
                        Price: {props.price} TND 
                    </Text>
                </View>
                <View style={styles.switch}>
                    <Text style={{marginTop: 4}}>Switch</Text> 
                    <Switch 
                    trackColor={{ false: "#767577", true: Colors.primary }}
                    thumbColor={switchValue ? "white" : "#f4f3f4"}
                    onValueChange={toggleSwitch}
                    value={switchValue}/>
                </View>
            </View>
        </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'yellow',
        paddingVertical: 10,
    },
    itemContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        height: '120%',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 20,
        marginVertical: 10,
        elevation: 5
    },
    image: {
        width: '15%',
        height:'90%',
        //resizeMode: 'contain',
    },
    switch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textStyle1: {
        flex:1,
        //backgroundColor: 'red',
        justifyContent: 'space-between',
    },
    textContainer: {
        marginVertical: 2
    },
    textStyle2: {
        //backgroundColor: 'grey',
        justifyContent: 'space-between',
        marginRight: 3
    }
});

export default ProductListItem;*/

