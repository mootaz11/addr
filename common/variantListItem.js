import React, {useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const VariantListItem = (props) =>{

    const renderListSousVariantsItem = (itemData) => {
        return (
            <View style={styles.sousVariantValueItemContainer}>
                <View style={styles.sousvariantValue}>
                    <Text style={{color:'white'}}>{itemData.item.sousvariant}</Text>
                </View>
                <View style={styles.deleteSousVariantImageContainer}>
                <TouchableOpacity onPress={props.onDeleteSousVariant.bind(this,props.variantId, itemData.item.id)}>
                <FontAwesome color={"black"}  name={"close"} />                    

                </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <View style={styles.itemContainer}>
            <View style={styles.variantNameContainer}>
                <Text style={{color:'white'}}>{props.variant}</Text>
            </View>
            <View style={styles.sousVariantsContainer}>
                <View style={styles.sousVariantsValuesContainer}>
                    <View style={styles.partSousVariants}>
                        <FlatList
                        data={props.sousvariants}
                        renderItem={renderListSousVariantsItem}
                        numColumns={3}
                        />
                    </View>
                </View>
                <View style={styles.deleteButtonContainer}>
                    <TouchableOpacity onPress={props.onDeleteVariant.bind(this, props.variantId)}>
                    <Image 
                    style={styles.imageDeleteButton}
                    source={require('../assets/images/trash.png')}
                    />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer:{
        //backgroundColor:'red',
        //flex:1,
        height:Dimensions.get('window').height*0.155, //120
        marginVertical:5
    },
    variantNameContainer:{
        backgroundColor:'#0862ef',
        marginBottom:3,
        borderRadius:5,
        flex:1,
        width:'25%',
        justifyContent:'center',
        alignItems:'center'
    },
    sousVariantsContainer:{
        backgroundColor:'white',
        flex:3,
        flexDirection:'row'
    },
    sousVariantsValuesContainer:{
        //backgroundColor:'#0862ef',
        //backgroundColor:'pink',
        flex:6,
        justifyContent:'center'
    },
    partSousVariants:{
        //backgroundColor:'pink',
        height:'80%',
        marginHorizontal:5,
        borderColor: '#0862ef',
        borderWidth: 2,
        borderRadius:8,
        paddingHorizontal:Dimensions.get('window').width*0.025,
    },
    sousVariantValueItemContainer:{
        backgroundColor:'#0862ef',
        flexDirection:'row',
        margin:3,
        width:'30%',
        height:Dimensions.get('window').height*0.0364,//28
        borderRadius:5
    },
    sousvariantValue:{
        //backgroundColor:'green',
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    deleteSousVariantImageContainer:{
        //backgroundColor:'purple',
        justifyContent:'center',
        alignItems:'center'
    },
    imageDeleteSousVariant:{
        //backgroundColor:'yellow'
        height:Dimensions.get('window').height*0.04, //15
        width:Dimensions.get('window').width*0.04,  //18
        resizeMode:'contain'
    },
    deleteButtonContainer:{
        //backgroundColor:'blue',
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    imageDeleteButton:{
        height:Dimensions.get('window').height*0.045, //35
        width:Dimensions.get('window').width*0.09,  //35
        //backgroundColor:'yellow'
    },
});

export default VariantListItem;