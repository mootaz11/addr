import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Image, TextInput, FlatList,Dimensions,TouchableOpacity,Text } from 'react-native';
import ProductListItem from '../../common/ProductListItem';
import MyButton from '../../common/MyButton';
import Colors from '../../constants/Colors';
import { getProducts } from '../../rest/partnerApi';
import AuthContext from '../../navigation/AuthContext';
import _ from 'lodash';
import { Icon } from 'react-native-elements';


const ListProductsScreen = (props) => {
    const [products, setProducts] = useState(null)
    const context = useContext(AuthContext)
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);


    const filtreList = (text) => {
        setSearch(text)
        const query = text.toLowerCase();
        const productsResult = _.filter(products, product => {
            return _.includes(product.name.toLowerCase(), query)
        })
        setSearchResult(productsResult)
    }



    useEffect(() => {
        console.log(context.user._id)
        getProducts(context.partner._id).then(products => {
            setProducts(products)
            setSearchResult(products)

        })
    }, [])

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
            />
        );
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.menu}>
                <View style={styles.leftArrowContainer}>
                    <TouchableOpacity style={styles.leftArrow}>
                        <Icon color={"black"} style={{ padding: 4, alignSelf: "center", justifyContent: "center" }} name="menu" onPress={openDrawer} />

                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.Title}>Partner products</Text>
                </View>


            </View>
            <View style={styles.partOne}>
                <View style={styles.search}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/images/searching.png")}
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
        paddingHorizontal: 120,
        borderRadius: 10,
        margin: 8
    }
});




export default ListProductsScreen;

