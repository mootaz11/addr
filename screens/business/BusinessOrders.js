import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, TextInput, ScrollView,Dimensions } from 'react-native'
import { Icon } from 'react-native-elements';
import AuthContext from '../../navigation/AuthContext';
import _ from 'lodash';
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {markOrderAsPrepared,getPartnerOrders} from '../../rest/ordersApi'

const order_pipeline = [
    { step: "Order to prepare", _id: "1" },
    { step: "Prepared Order", _id: "2" },
    { step: "Order Delivered", _id: "3" }
];


export default function  BusinessOrders (props) {
    const context = React.useContext(AuthContext);
    
    const [orderstoPrepare, setOrderstoPrepare] = useState([]);
    const [preparedOrders,setPreparedOrders]=useState([]);
    const [deliveredOrders,setDeliveredOrders] = useState([]);

    const [checkedStep, setCheckedStep] = useState(order_pipeline[0])

    const [orderToPrepare, setOrderToPrepare] = useState(true);
    const [preparedOrder, setPreparedOrder] = useState(false);
    const [deliveredOrder, setDeliveredOrder] = useState(false);


    useEffect(()=>{
        getPartnerOrders(context.user._id).then(orders=>{
            let _ordersToPrepare =[]
            let _preparedOrders =[]
            let _deliveredOrders=[]

            orders.map(order=>{
                if(order.actif==true && order.taked==false && order.prepared==false){
                    _ordersToPrepare.push(order);
                }
                if(order.actif==true && order.taked==false && order.prepared==true)
                {
                    _preparedOrders.push(order);
                }
                if(order.actif==false && order.taked==true &&order.prepared==true)
                {
                    _deliveredOrders.push(order);
                }
            })
            setDeliveredOrders(_deliveredOrders);
            setPreparedOrders(_preparedOrders);
            setOrderstoPrepare(_ordersToPrepare);
        })
    },[])

   



    const openDrawer = () => {
        props.navigation.openDrawer();
    }



    const prepareOrderHandler = (item)=>{
        markOrderAsPrepared(item._id).then(message=>{
                setPreparedOrders([...preparedOrders,item]);
                setOrderstoPrepare(orderstoPrepare.filter(order => order._id != item._id));})}



    // const startConversation = (order)=>{
    //    const conversation =  context.openConversationHandler({},{user:order.client,other:order.deliverer});
    //    props.navigation.navigate("conversation",{conversation,orders:true})
    // }
            

    const checkStep = (item) => {
        setCheckedStep(item)
        if (item.step == "Order to prepare") {
            setPreparedOrder(false);
            setDeliveredOrder(false);
            setOrderToPrepare(false);
        }
        if (item.step == "Prepared Order") {
            setPreparedOrder(true)
            setDeliveredOrder(false);
            setOrderToPrepare(false);
        }
        if (item.step == "Order Delivered") {
            setOrderToPrepare(false);
            setDeliveredOrder(true);
            setPreparedOrder(false);
        }
    }




    return (
        <View style={context.darkMode ? styles.containerDark : styles.container}>
                          <View style={context.darkMode ? styles.menuDark : styles.menu}>
                        <View style={styles.leftArrowContainer} >
                        <TouchableOpacity onPress={openDrawer} style={{height:30,width:30}}>
                        <Image source={context.darkMode ?  require("../../assets/menu_dark.png"):require("../../assets/menu.png")} style={{height:"100%",width:"100%",resizeMode:"cover"}}/>
                        </TouchableOpacity>
                        </View>
                    <View style={styles.titleContainer}>

                    <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Orders</Text>
                </View>

            </View>
            <View style={styles.headerElements}>
                <FlatList
                    data={order_pipeline}
                    numColumns={2}
                    renderItem={({ item }) =>
                        <TouchableOpacity style={checkedStep && item._id == checkedStep._id ? styles.stepChecked : (context.darkMode ? styles.stepDark : styles.step)} onPress={() => checkStep(item)}>
                            <View style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                <Text style={checkedStep && item._id == checkedStep._id ? { color: "white", fontSize: 15, textAlign: "center" } : (context.darkMode ? { color: "white", fontSize: 15, textAlign: "center" } : { color: "black", fontSize: 15, textAlign: "center" })}>{item.step}</Text>
                            </View>
                        </TouchableOpacity>


                    }
                    keyExtractor={item => item._id}
                >

                </FlatList>

            </View>
            <View style={styles.ordersContainer}>

                <FlatList
                    data={orderToPrepare? orderstoPrepare : preparedOrder ? preparedOrders : deliveredOrder ? deliveredOrders : null}
                    renderItem={({ item }) =>
                    <TouchableOpacity>
                        <View style={context.darkMode ? styles.deliveryDark : styles.delivery} >
                            <View style={styles.clientImageContainer}>
                                <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={require("../../assets/user_image.png")} />
                            </View>
                            <View style={styles.deliveryInfo}>
                                <Text style={context.darkMode ? styles.infoDark : styles.info}>Nom de Livreur: {item.nomLivreur} </Text>
                                <Text  style={context.darkMode ? styles.infoDark : styles.info}>Date: {item.Date}</Text>
                            </View>
                            {
                                orderToPrepare || deliveredOrder ? 
                                    <View style={{ width: "25%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                                        <TouchableOpacity onPress={() => { orderToPrepare ? prepareOrderHandler(item):null }}>
                                            <FontAwesome color={Done ? "#4BB543" : "#cccccc"} style={{ padding: 0, fontSize: 30, }} name="check" />
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
        width: "60%",
        height: "100%",
        flexDirection: "column",
        padding: 4,
        justifyContent: "center"
    },
    info: {
        fontSize: 12,
        fontWeight: "600"
    },
    infoDark: {
        fontSize: Dimensions.get("window").width*0.038,
        fontWeight: "600",
        color: "white"
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
    deliveryDark: {
        backgroundColor: "#292929",
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
        backgroundColor: "#fcfcfc",
        margin: 6
    },
    stepDark: {
        backgroundColor: "#292929",
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
    containerDark: {
        backgroundColor: "#121212",
        width: "100%",
        height: "100%",
        flexDirection: "column",
    },
    container: {
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        flexDirection: "column",

    },
    menu: {
        marginTop:10,
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
        marginBottom: 8
    },
    leftArrowContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",
        marginBottom: 8,
        marginTop:10


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
        fontSize: Dimensions.get("window").width * 0.07,
    },
    TitleDark: {
        fontWeight: "700",
        fontSize: 28,
        color: "white"

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