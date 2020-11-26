import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';


const ManagerListItem = (props) => {
    
    return (
            <View style={styles.itemContainer}>
                <View style={styles.imageContainer}>
                <Image 
                    style={styles.image} 
                    source={props.image}
                    />
                </View>
                <View style={styles.paragraphContainer}>
                    <Text style={styles.nameStyle}> {props.name} </Text>
                    <Text>{props.title}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={()=>{}}> 
                        <Image
                        style={styles.imageButton}
                        source={require('../assets/images/speech.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{}}>
                        <Image 
                        style={styles.imageButton}
                        source={require('../assets/images/trash.png')}
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
    buttonsContainer: {
        flex:1.5,
        flexDirection: 'row',
        //backgroundColor:'green',
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

