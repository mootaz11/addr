import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Image, TextInput, FlatList,Dimensions,TouchableOpacity,Text } from 'react-native';
import ProductListItem from '../../common/ProductListItem';
import MyButton from '../../common/MyButton';
import Colors from '../../constants/Colors';
import {  getPartnerProducts } from '../../rest/productApi';
import AuthContext from '../../navigation/AuthContext';
import _ from 'lodash';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';


const ListProductsScreen = (props) => {
    const [products, setProducts] = useState(null)
    const context = useContext(AuthContext)
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [dark,setDark]=useState(true);

    const filtreList = (text) => {
        setSearch(text)
        const query = text.toLowerCase();
        const productsResult = _.filter(products, product => {
            return _.includes(product.name.toLowerCase(), query)
        })
        setSearchResult(productsResult)
    }



    useEffect(() => {
        getPartnerProducts(context.partner._id).then(data => {
            setProducts(data.products)
            setSearchResult(data.products)

        })
    }, [])
    const addProductHandle =()=>{
        props.navigation.navigate("addProduct")
    }
    const openDrawer = ()=>{
        props.navigation.openDrawer();
    }
    const renderListItem = itemData => {
        console.log(itemData.item.mainImage)
        return (
            <ProductListItem
                index={itemData.index + 1}
                title={itemData.item.name}
                stock={itemData.item.stock}
                price={itemData.item.basePrice}
                image={itemData.item.mainImage}
                dark ={dark}
            />
        );
    };

    return (
        <SafeAreaView style={{flex:1}}>
        <View style={dark ? styles.mainContainerDark: styles.mainContainer}>
            <View style={dark ? styles.menuDark : styles.menu}>
                <View style={styles.leftArrowContainer}>
                    <TouchableOpacity style={styles.leftArrow}>
                        <Icon color={dark ? "white":"black"} style={{ padding: 4, alignSelf: "center", justifyContent: "center" }} name="menu" onPress={openDrawer} />

                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={dark ? styles.TitleDark : styles.Title}>Partner products</Text>
                </View>


            </View>
            <View style={styles.partOne}>
                <View style={styles.search}>
                    <Image
                        style={styles.image}
                        source={dark ?require("../../assets/images/searchingDark.png") :require("../../assets/images/searching.png")}
                    />
                    <TextInput
                        value={search}
                        onChangeText={filtreList}

                        placeholder="Search Product"
                        placeholderTextColor={Colors.placeholder}
                    />
                </View>
            </View>
            <View style={styles.partTwo}>
                <FlatList
                    data={searchResult}
                    renderItem={renderListItem}
                    keyExtractor={item=>item._id}
                />
            </View>
            <View style={styles.partThree}>
                <MyButton onPress={addProductHandle} style={styles.buttonStyle}>
                    Add product
                </MyButton>
            </View>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
    },
    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",

    },
    leftArrowContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    leftArrow: {
        width: 30,
        height: 30
    },

    titleContainer: {
        width: "80%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    Title: {
        fontWeight: "700",
        fontSize: Dimensions.get("window").width * 0.08
    },
    searchContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },

    TitleDark: {
        fontWeight: "700",
        fontSize: 28,
        color: "white"

    },
    mainContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background
    },
    mainContainerDark:{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: "#121212",
    },
    partOne: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'pink',
    },
    search: {
        width: '85%',
        height: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius: 10
    },
    image: {
        width: '10%',
        height: '60%',
        resizeMode: 'contain',
        margin: 13
    },
    partTwo: {
        flex: 6,
        //backgroundColor: 'grey'
    },
    partThree: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
        //backgroundColor: 'green'
    },
    buttonStyle: {
        paddingHorizontal: 100,
        paddingVertical:10,
        borderRadius: 10,
        margin:4
    }
});




export default ListProductsScreen;

