
// Linking.openURL(url);

import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import { Icon } from 'react-native-elements';
import AuthContext from '../navigation/AuthContext';
import _ from 'lodash';
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getClientOrders,markOrderAsReceived} from "../rest/ordersApi"


const order_pipeline = [
    { step: "Order placed", _id: "1" },
    { step: "Order during delivery", _id: "2" },
    { step: "Historique", _id: "3" },
];


export default function Orders(props) {
    const context = React.useContext(AuthContext);

    const [placedOrdersData, setPlacedOrdersData] = useState([]);
    const [historyOrdersData, setHistoryOrdersData] = useState([]);
    const [orderDuringDeliveryData, setOrderDuringDeliveryData] = useState([]);

    const [checkedStep, setCheckedStep] = useState(order_pipeline[0])

    const [orderPlaced, setOrderPlaced] = useState(true);
    const [orderDuringDelivery, setOrderDuringDelivery] = useState(false);
    const [history, setHistory] = useState(false);


    const [dark, setDark] = useState(true);

    useEffect(()=>{
        getClientOrders().then(orders=>{
            let _placedOrders =[];
            let _orderDuringDelivery=[];
            let _historyOrders = [];
            if(orders.length>0){
                orders.map(order=>{
                    if(order.actif==true && order.taked==false && order.prepared==false){
                        _placedOrders.push(order);
                    }
                    if(order.actif==true && order.taked==true && order.prepared==true)
                    {
                        _orderDuringDelivery.push(order);
                    }
                    if(order.actif==false){
                        _historyOrders.push(order);
                    }
                })
            }
        
            setHistoryOrdersData(_historyOrders);
            setPlacedOrdersData(_placedOrders);
            setOrderDuringDeliveryData(_orderDuringDelivery);


        }).catch(err=>{
            alert(err.message);
        })
    },[])

/*    useEffect(() => {
        setDark(context.darkMode);
    }, [context.darkMode])
*/

    const openDrawer = () => {
        props.navigation.openDrawer();
    }






    // const startConversation = (order)=>{
    //    const conversation =  context.openConversationHandler({},{user:order.client,other:order.deliverer});
    //    props.navigation.navigate("conversation",{conversation,orders:true})
    // }

    const orderDone = (item) => {
        markOrderAsReceived(item._id).then(res=>{
            item.actif=false;
            setOrderDuringDeliveryData(orderDuringDeliveryData.filter(order=>order._id!=item._id));
            setHistoryOrdersData(historyOrdersData=>[item,...historyOrdersData])
        })
    }

    const checkStep = (item) => {
        setCheckedStep(item)
        if (item.step == "Order placed") {
            setOrderPlaced(true);
            setHistory(false);
            setOrderDuringDelivery(false);
        }
        if (item.step == "Order during delivery") {
            setOrderPlaced(false);
            setHistory(false);
            setOrderDuringDelivery(true);
        }
        if (item.step == "Historique") {
            setOrderPlaced(false);
            setHistory(true);
            setOrderDuringDelivery(false);
        }
    }




    return (
        <SafeAreaView style={{flex:1}}>
        <View style={ dark ? styles.containerDark : styles.container}>
            <View style={dark ? styles.menuDark :  styles.menu}>
                <TouchableOpacity style={styles.leftArrowContainer}>
                    <View >
                        <Icon color={ dark ? "white" : "#2474F1"} style={{ flex: 1, padding: 0,justifyContent:"center" }} name="menu" onPress={openDrawer} />
                    </View>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={dark ? styles.TitleDark : styles.Title}>Commande</Text>
                </View>

            </View>
            <View style={styles.headerElements}>
                <FlatList
                    data={order_pipeline}
                    numColumns={2}
                    renderItem={({ item }) =>
                        <TouchableOpacity style={checkedStep && item._id == checkedStep._id ? styles.stepChecked : (dark ? styles.stepDark :styles.step)} onPress={() => checkStep(item)}>
                            <View style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                <Text style={checkedStep && item._id == checkedStep._id ? { color: "white", fontSize: 15, textAlign: "center" } : (dark ?  {color: "white", fontSize: 15, textAlign: "center"} :{color: "black", fontSize: 15, textAlign: "center"} )}>{item.step}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item._id}
                >

                </FlatList>

            </View>
            <View style={styles.ordersContainer}>

                <FlatList
                    data={orderPlaced ? placedOrdersData : orderDuringDelivery ? orderDuringDeliveryData : history ? historyOrdersData : null}
                    renderItem={({ item }) =>
                    <TouchableOpacity>
                        <View style={dark ? styles.deliveryDark : styles.delivery} >
                            <View style={styles.clientImageContainer}>
                                <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={require("../assets/mootaz.jpg")} />
                            </View>
                            <View style={styles.deliveryInfo}>
                                <Text style={dark ? styles.infoDark :styles.info}>Nom de Livreur: {item.deliverer.firstName +" "+item.deliverer.lastName} </Text>
                                <Text style={dark ? styles.infoDark :styles.info}>Numero Telephone:  {item.deliverer.phone ?item.deliverer.phone :"no phone yet"} </Text>
                                <Text style={dark ? styles.infoDark :styles.info}>Date: {item.date.split('T')[0]}</Text>
                                {   history &&
                                    <TouchableOpacity>
                                        <Text style={{ fontSize: 12, fontWeight: "600", color: "#2474F1", textDecorationLine: "underline" }}>your opinion about the product</Text>
                                    </TouchableOpacity>
                                    
                            }


                            </View>
                            {
                                orderDuringDelivery ?

                                    <View style={{ width: "10%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                                        <TouchableOpacity onPress={() => { orderDone(item) }}>
                                            <FontAwesome color={ "#4BB543" } style={{ padding: 0, fontSize: 30, }} name="check" />

                                        </TouchableOpacity>

                                    </View>
                                    : null
                            }
                        </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item._id}
                >
                </FlatList>
            </View>

        </View>
        </SafeAreaView>
    );
}





const styles = StyleSheet.create({

    actions: {
        width: "25%",
        height: "100%",
        flexDirection: "row",
        borderRadius: 12
    },
    deliveryInfo: {
        width: "75%",
        height: "100%",
        flexDirection: "column",
        padding: 4,
        justifyContent: "center",

    },
    info: {
        fontSize: 12,
        fontWeight: "600"
    },
    infoDark:{
        fontSize: 12,
        fontWeight: "600",
        color:"white"
    },
    clientImageContainer: {
        width: "15%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12
    },

    delivery: {
        width: "100%",
        height: 80,
        backgroundColor: "white",
        shadowColor: "grey",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        borderRadius: 12,
        marginVertical: 6,


    },
    deliveryDark:{
        backgroundColor:"#292929",
        width: "100%",
        height: 80,
        shadowColor: "grey",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        borderRadius: 12,
        marginVertical: 6,

    },
    crud: {
        width: "60%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6E6E6",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12

    },
    step: {
        width: "45%",
        height: 40,
        borderRadius: 14,
        backgroundColor: "white",
        margin: 6
    },
    stepDark:{
        backgroundColor:"#292929",
        width: "45%",
        height: 40,
        borderRadius: 14,
        margin: 6
    },
    stepChecked: {
        width: "45%",
        height: 40,
        borderRadius: 14,
        backgroundColor: "#2474F1",
        margin: 6
    },

    container: {
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        flexDirection: "column",

    },

    containerDark:{
        backgroundColor: "#121212",
        width: "100%",
        height: "100%",
        flexDirection: "column",
    },
    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
        marginBottom: 8
    },
    menuDark:{
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",
        marginBottom: 8,
        
        
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
        fontSize: 28
    },
    TitleDark:{
        fontWeight: "700",
        fontSize: 28,
        color:"white"
        
    },
    headerElements: {
        width: "94%",
        height: "18%",
        alignSelf: "center"
    },
    ordersContainer: {
        width: "94%",
        height: "72%",
        alignSelf: "center"
    }
}
);