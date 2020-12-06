import React, {useState,useEffect} from 'react';
import {StyleSheet, View, Text, TextInput, Switch, Dimensions} from 'react-native';

import Colors from '../constants/Colors';

const OptionListItem = (props) => {
    const [switchValue, setSwitchValue] = useState(false);
    const [price,setPrice]=useState("");
    const [stock,setStock]=useState("");

    useEffect(()=>{
            setPrice(props.price.toString());
            setStock(props.stock.toString());

    },[props.price,props.stock])

    const toggleSwitch = (value) => {
        setSwitchValue(value);
        props.handleisChecked(props.idCombination)
      };
const handleText= (text,idCombination)=>{
    props.handlePriceChange(text,idCombination)
}
const handleStockText = (text,idCombination)=>{
    props.handleStockChange(text,idCombination);
}

    return(
            <View style={styles.itemContainer}>
                <View style={styles.textContainer}>
                    <Text>{props.name}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <TextInput
                    placeholder="price"
                    keyboardType="decimal-pad"
                    style={styles.priceInput}
                    value={price}
                    onChangeText={(text)=>{
                       handleText(text,props.idCombination)}}
                    />
                </View>
                <View style={styles.stockContainer}>
                    <View style={styles.stockInputContainer}>
                        <TextInput
                        placeholder="stock"
                        keyboardType="decimal-pad"
                        style={styles.stockInput}
                        value={stock}
                        onChangeText={(text)=>{
                           handleStockText(text,props.idCombination)}}
                        />
                    </View>
                    <View style={styles.switchContainer}>
                        <Switch 
                        trackColor={{ false: "#767577", true: Colors.primary }}
                        thumbColor={switchValue ? "white" : "#f4f3f4"}
                        onValueChange={toggleSwitch}
                        value={switchValue}
                        />
                    </View>
                </View>

            </View>
    );

}

const styles = StyleSheet.create({
    itemContainer:{
        //backgroundColor:'yellow',
        marginVertical:5,
        flexDirection:'row',
    },
    textContainer:{
        //backgroundColor:'pink',
        flex:1.17
    },
    priceContainer:{
        //backgroundColor:'brown',
        flex:1.85,
        justifyContent:'center',
        alignItems:'center'
        
    },
    priceInput:{
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius:6,
        height:Dimensions.get('window').height*0.055,//42
        width:'85%',
        paddingHorizontal:5
    },
    stockContainer:{
        //backgroundColor:'orange',
        flex:2.15,
        flexDirection:'row',
    },
    stockInputContainer:{
        //backgroundColor:'green',
        flex:2,
        justifyContent:'center',
        alignItems:'center'
    },
    stockInput:{
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius:6,
        height:Dimensions.get('window').height*0.055,
        width:'75%',
        paddingHorizontal:5
    },
    switchContainer:{
        //backgroundColor:'yellow',
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },

});

export default OptionListItem;