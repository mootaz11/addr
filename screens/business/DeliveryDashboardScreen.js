import React, { useContext, useState,useEffect } from 'react';

import { StyleSheet, View, Text, Image, FlatList, Dimensions, TouchableOpacity,ActivityIndicator     } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import MarkListItem from '../../common/MarkListItem';
import FeedbackListItem from '../../common/FeedbackListItem';
import { Icon } from 'react-native-elements';
import AuthContext from '../../navigation/AuthContext';
import {getDelivererDashboard} from '../../rest/partnerApi';
import { SafeAreaView } from 'react-native';


const DeliveryDashboardScreen = (props) => {
    const context = useContext(AuthContext);
    const [dashboard,setDashboard]= useState(null);

    useEffect(() => {
        getDelivererDashboard(context.partner._id).then(_dashboard=>{
            setDashboard(_dashboard)

        }).catch(err=>{
            alert("error has been occured")
        })      
        return () => {
            
        }
    }, [])

    const formatData = (data) => {
        const numberOfFullRows = Math.floor(data.length / 2);

        let numberOfElementsLastRow = data.length - (numberOfFullRows * 2);
        while (numberOfElementsLastRow !== 2 && numberOfElementsLastRow !== 0) {
            data.push({
                id: 'nul',
                empty: true
            });
            numberOfElementsLastRow = numberOfElementsLastRow + 1;
        };
        return data;
    };

    const openDrawer = () => { props.navigation.openDrawer() }
    const renderListMarkersItem = (itemData) => {
        if(itemData.item.partner){
        return (
            <MarkListItem
            darkMode={context.darkMode}
            index={itemData.index + 1}
                image={{uri:itemData.item.partner.profileImage}}
                name={itemData.item.partner.partnerName}
                price={itemData.item.price+"DT"}
                empty={!!itemData.item.empty}
            />
        );}
        else {
            return <View></View>
        }

    };

    const renderListFeedbacksItem = (itemData) => {
        return (
            <FeedbackListItem
                darkMode={context.darkMode}
                image={{uri:itemData.item.user.photo}}
                message={itemData.item.comment}
                rate={itemData.item.score}
            />
        );
    };


    if(dashboard){

    
    return (
        <SafeAreaView style={{flex:1}}>

<View style={context.darkMode ? styles.mainContainerDark : styles.mainContainer}>

            <View style={context.darkMode ?styles.menuDark : styles.menu}>
                <View style={styles.leftArrowContainer}>
                    <TouchableOpacity style={styles.leftArrow}>
                        <Icon color={context.darkMode ?"white" : "black"} style={{ padding: 4, alignSelf: "center", justifyContent: "center" }} name="menu" onPress={openDrawer} />

                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={context.darkMode ?styles.TitleDark : styles.Title}>Deliverer Dashboard</Text>
                </View>


            </View>
            <View style={styles.partOne}>
                <LinearGradient
                    colors={['#2474f1', '#8c4aac']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.part1}
                >
                    <View style={styles.paragraphContainer}>

                        <Text style={styles.textStyleTitre}>HI , {context.user.lastName.charAt(0).toUpperCase() + context.user.lastName.slice(1)}</Text>
                        <Text style={styles.textStyleTitle}>Ready to start your day with addressti</Text>

                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={require('../../assets/images/box.png')}
                        />
                    </View>
                </LinearGradient>
                <View style={styles.part2}>
                    <View style={styles.cardContainer}>
                        <Text style={context.darkMode ?{color:"white"}:{color:"black"}}>Delivery Fees</Text>
                        <LinearGradient
                            colors={['#256ced', '#564fc6']}
                            start={[0, 0]}
                            end={[1, 1]}
                            style={styles.cardValueContainer}
                        >
                            <Text style={styles.textValuesStyle}>{dashboard.deliveriesPrice}</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.cardContainer}>
                    <Text style={context.darkMode ?{color:"white"}:{color:"black"}}>Business Money</Text>
                        <LinearGradient
                            colors={['#6454c3', '#9440a1']}
                            start={[0, 0]}
                            end={[1, 1]}
                            style={styles.cardValueContainer}
                        >
                            <Text style={styles.textValuesStyle}>{dashboard.businessMoney}</Text>
                        </LinearGradient>
                    </View>
                </View>
                <View style={styles.part2}>
                    <View style={styles.cardContainer}>
                    <Text style={context.darkMode ?{color:"white"}:{color:"black"}}>Total</Text>
                        <LinearGradient
                            colors={['#376de5', '#654fbd']}
                            start={[0, 0]}
                            end={[1, 1]}
                            style={styles.cardValueContainer}
                        >
                            <Text style={styles.textValuesStyle}>{dashboard.businessMoney}</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.cardContainer}>
                    </View>
                </View>
                <View style={context.darkMode ? styles.part4Dark :styles.part4}>
                    <View style={styles.wheelImageContainer}>
                        <Image
                            style={styles.wheelImage}
                            source={require('../../assets/images/wheel.png')}
                        />
                    </View>
                    <View style={styles.drivingTotalContainer}>
                        <Text style={context.darkMode ? {fontWeight:"bold",color:"white"}:{ fontWeight: 'bold',color:"black" }}>Driving Totals</Text>
                    </View>
                    <View style={styles.completedDeliveryContainer}>
                        <Text style={context.darkMode?{color:"white"}:{color:"black"}}>{dashboard.completedOrdersCount}</Text>
                        <Text style={context.darkMode ? styles.smallTextDark:styles.smallText}>completed Delivery</Text>
                    </View>
                    {/* <View style={styles.completedDeliveryContainer}>
                        <Text>9,074.63</Text>
                        <Text style={styles.smallText}>Online Km</Text>
                    </View> */}
                </View>
            </View>
            <View
                style={{
                    borderBottomColor:context.darkMode ? "#292929": '#d8d8d8',
                    borderBottomWidth: 1,
                    marginLeft: 5,
                    marginRight: 5,
                    marginTop: 5,
                    marginBottom: 5
                }}
            />
       
            {
               dashboard && dashboard.unCompletedOrders  &&
            <View style={context.darkMode ? styles.partTwoDark: styles.partTwo}>
            
               
                <View style={styles.titreContainer}>
                    <Text style={context.darkMode ? styles.titreStyleDark:styles.titreStyle}>Money for return </Text>
                </View>
                <View style={styles.listContainer}>
                    <FlatList
                        data={formatData(dashboard.unCompletedOrders)}
                        renderItem={renderListMarkersItem}
                        numColumns={2}
                    />
                    
                </View>
    
    </View>
    
            }
    <View
                style={{
                    borderBottomColor:context.darkMode ? "#292929": '#d8d8d8',
                    borderBottomWidth: 1,
                    marginLeft: 5,
                    marginRight: 5,
                    marginTop: 5,
                    marginBottom: 5
                }}
            />
    {
     dashboard.feedbacks&& dashboard.feedbacks.length>0 &&
     <View style={context.darkMode ?styles.partThreeDark : styles.partThree}>
                <View style={styles.feedbacksTitreContainer}>
                    <Text style={context.darkMode ? styles.titreStyleDark: styles.titreStyle}>Feedbacks</Text>
                </View>
                <View style={styles.listFeedbacksContainer}>
                    <FlatList
                        data={dashboard.feedbacks}
                        renderItem={renderListFeedbacksItem}
                    />
                </View>
            </View>
    }
        </View>
    
        </SafeAreaView>

    )
            }
            else {
                return (<View style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>)
            }
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    mainContainerDark:{
        backgroundColor: "#121212",
        flex:1
    },
    partOne: {
        //backgroundColor:'blue',
        flex: 3.75,
        borderRadius: 20,
        alignItems: 'center',
    },

    part1: {
        //backgroundColor:'red',
        flex: 1.5,
        width: '92%',
        marginTop: 25,
        marginBottom: 3,
        borderRadius: 20,
        flexDirection: 'row'
    },
    paragraphContainer: {
        //backgroundColor:'green',
        flex: 1.75,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    textStyleTitre: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold'
    },
    textStyleTitle: {
        color: 'white'
    },
    imageContainer: {
        //backgroundColor:'purple',
        alignItems: 'center',
        flex: 1
    },
    image: {
        //backgroundColor:'green',
        position: 'absolute',
        //bottom:'10%',
        top: '-33%',
        right: '5%',
        height: '140%',
        width: '100%',
        resizeMode: 'contain',
    },

    part2: {
        //backgroundColor:'yellow',
        flex: 1,
        flexDirection: 'row',
        width: '92%',
        //marginTop: 3
    },
    cardContainer: {
        //backgroundColor:'green',
        alignItems: 'center',
        flex: 1,
        //margin:3
    },
    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
        marginTop:10
    },
    
    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",
        marginTop:10

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
        height: 30,
        marginTop:10
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
        fontSize: Dimensions.get("window").width * 0.07,
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
        fontSize: Dimensions.get("window").width * 0.07,
        color: "white"

    },
    cardValueContainer: {
        //backgroundColor: 'gray',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 9,
        borderRadius: 15,
        width: '93%'
    },
    textValuesStyle: {
        color: 'white',
        fontSize: Dimensions.get("window").width*0.075,
        fontWeight: 'bold'
    },

    part4: {
        backgroundColor: '#e6e6e6',
        flex: 0.7,
        width: '92%',
        flexDirection: 'row',
        marginVertical: 10,
        borderRadius:8
    },
    part4Dark:{
        backgroundColor: '#292929' ,
        flex: 0.7,
        width: '92%',
        flexDirection: 'row',
        marginVertical: 10,
        borderRadius:8

    },
    wheelImageContainer: {
        //backgroundColor:'orange',
        flex: 0.5,
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    wheelImage: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain'
    },
    drivingTotalContainer: {
        //backgroundColor:'purple',
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 5
    },
    completedDeliveryContainer: {
        //backgroundColor:'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5
    },
    smallText: {
        fontSize: 10,
        fontWeight: 'bold',
        color:"black"
    },
    smallTextDark:{
        fontSize: 10,
        fontWeight: 'bold',
        color:"white"
    },

    partTwo: {
        backgroundColor: 'white',
        flex: 1.4,
        borderRadius: 25,
    },
    partTwoDark:{
        backgroundColor: '#292929' ,
        flex: 1.4,
        borderRadius: 25,

    }
,
    titreContainer: {
        flex: 1,
        //width:'90%',
        paddingLeft: 10
    },
    titreStyle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical:1
        //fontStyle:'italic'
    },
    titreStyleDark:{
        marginVertical:1,
        fontWeight: 'bold',
        fontSize: 16,
        color:"white"
        //fontStyle:'italic'

    },
    listContainer: {
        //backgroundColor:'purple',
        flex: 6,
        paddingHorizontal: 5
    },



    partThree: {
        backgroundColor: 'white',
        flex: 2,
        borderRadius: 20
    },
    partThreeDark:{
        backgroundColor: '#292929',
        flex: 2,
        borderRadius: 20
    },
    feedbacksTitreContainer: {
        //backgroundColor:'green',
        flex: 1,
        paddingLeft: 10,
        marginBottom: 2
    },
    listFeedbacksContainer: {
        //backgroundColor:'orange',
        flex: 8,
        marginHorizontal: 10,
        marginBottom: 5
    }
});

export default DeliveryDashboardScreen;