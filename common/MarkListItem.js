import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';


const MarkListItem = (props) => {
    if(props.empty){
        return <View style={[styles.itemContainer, styles.itemInvisible]} />;
    }
    else {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.indexContainer}>
                    <Text style={ props.darkMode ?{fontWeight: 'bold',color:"white" ,fontSize:18}: {fontWeight: 'bold', fontSize:18}}>{props.index}</Text>
                </View>
                <View style={styles.imageContainer}>
                <Image 
                    style={styles.image}
                    source={props.image}
                    />
                </View>
                <View style={styles.paragraphContainer}>
                    <Text style={props.darkMode ? {color:"white"}:{color:"black"}}>{props.name}</Text>
                    <Text style={props.darkMode ? {fontWeight: 'bold', fontSize: 16,color:"white"}:{fontWeight: 'bold', fontSize: 16,color:"black"}}>{props.price} TDN</Text>
                </View>
    
            </View>
        ); 
    };
};


const styles = StyleSheet.create({
    itemInvisible:{
        backgroundColor: 'transparent'
    },
    itemContainer:{
        //backgroundColor:'blue',
        flex:1,
        height:58,
        flexDirection:'row',
        marginHorizontal:5,
        marginVertical:3
    },

    indexContainer:{
        //backgroundColor:'orange',
        flex:0.20,
        alignItems:'center',
        justifyContent:'center',
    },
    imageContainer:{
        //backgroundColor:'red',
        flex:0.9,
        paddingHorizontal:6,
        paddingVertical: 3,
    },
    image:{
        height:'100%',
        width:'100%',
        resizeMode:'cover'
    },
    paragraphContainer:{
        //backgroundColor: 'green',
        flex:2,
        justifyContent:'center',
        marginHorizontal:6
    }
});

export default MarkListItem;
