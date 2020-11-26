import React from 'react';

import {View , StyleSheet, Image, TextInput, FlatList} from 'react-native';

import ProductListItem from '../../common/ProductListItem';
import MyButton from '../../common/MyButton';
import Colors from '../../constants/Colors';

const products = [
    {
        id: '1',
        image:'../../assets/images/image.jpg',
        title:'dssdsd dfd',
        price: 12,
        stock: 20
    },
    {
        id: '2',
        image:'../../assets/images/image.jpg',
        title:'Chemise Nike',
        price: 12,
        stock: 20
    },
    {
        id:'3',
        image:'../../assets/images/image.jpg',
        title:'dssdsd fdddd sdsd sdsd sfsf ',
        price: 12,
        stock: 20
    },
    {
        id:'4',
        image:'../../assets/images/image.jpg',
        title:'Chesseur adidas vraie',
        price: 12,
        stock: 20
    },
    {
        id:'5',
        image:'../../assets/images/image.jpg',
        title:'dssdsd',
        price: 12,
        stock: 20
    },
];

const ListProductsScreen = (props) => {

    const renderListItem = itemData => {
        return (
            <ProductListItem 
            index={itemData.index + 1}
            title={itemData.item.title}
            stock={itemData.item.stock}
            price={itemData.item.price}
            image={require("../../assets/images/image.jpg")}
            />
        );
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.partOne}>
                <View style={styles.search}>
                    <Image 
                    style={styles.image} 
                    source={require("../../assets/images/searching.png")}  
                    />
                    <TextInput
                    placeholder="Search Product"
                    placeholderTextColor={Colors.placeholder}
                    />
                </View>
            </View>
            <View style={styles.partTwo}>
                <FlatList 
                data={products} 
                renderItem={renderListItem} 
                />
            </View>
            <View style={styles.partThree}>
                <MyButton style={styles.buttonStyle}>
                    Add product
                </MyButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background
    },
    partOne: {
        flex: 1,
        marginTop:30,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'pink',
    },
    search: {
        width:'85%',
        height:'50%',
        flexDirection:'row',
        alignItems: 'center',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius: 10
    },
    image:{
        width: '10%',
        height:'60%',
        resizeMode: 'contain',
        margin: 13
    },
    partTwo: {
        flex:6,
        //backgroundColor: 'grey'
    },
    partThree: {
        flex:1,
        alignItems: 'center',
        justifyContent:'center'
        //backgroundColor: 'green'
    },
    buttonStyle:{
        paddingHorizontal: 120, 
        borderRadius: 10,
        margin:8
    }
});




export default ListProductsScreen;

