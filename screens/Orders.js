import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Modal, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements';
import AuthContext from '../navigation/AuthContext';
import _ from 'lodash';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getClientOrders, markOrderAsReceived } from "../rest/ordersApi"
import {createFeedback} from '../rest/feedBackApi';

const order_pipeline = [
    { step: "Order placed", _id: "1" },
    { step: "Order during delivery", _id: "2" },
    { step: "Historique", _id: "3" },
];

const _ratings = [{ pressed: false }, { pressed: false }, { pressed: false }, { pressed: false }, { pressed: false }]




export default function Orders(props) {
    const context = React.useContext(AuthContext);
    const [placedOrdersData, setPlacedOrdersData] = useState([]);
    const [historyOrdersData, setHistoryOrdersData] = useState([]);
    const [orderDuringDeliveryData, setOrderDuringDeliveryData] = useState([]);
    const [checkedStep, setCheckedStep] = useState(null)
    const [orderPlaced, setOrderPlaced] = useState(true);
    const [orderDuringDelivery, setOrderDuringDelivery] = useState(false);
    const [history, setHistory] = useState(false);
    const [dark, setDark] = useState(true);
    const [rate, setRate] = useState(false);
    const [product,setProduct]=useState(false);
    const [information, setInformation] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [ratings, setRatings] = useState(null);
    const [orderRate,setOrderRate]=useState(null);
    const [feedBack,setFeedBack]=useState("");
    const [orderInfo,setOrderInfo]=useState(null);
    useEffect(() => {
        let mounted = true ; 
        if(mounted){
            setCheckedStep(order_pipeline[0]);
        getClientOrders().then(orders => {
            setRatings(_ratings);
            let _placedOrders = [];
            let _orderDuringDelivery = [];
            let _historyOrders = [];
            if (orders.length > 0) {
                orders.map(order => {
                    if (order.actif == true && order.taked == false && order.prepared == false) {
                        _placedOrders.push(order);
                    }
                    if (order.actif == true && order.taked == true && order.prepared == true) {
                        _orderDuringDelivery.push(order);
                    }
                    if (order.actif == false) {
                        _historyOrders.push(order);
                    }
                })
            }

            setHistoryOrdersData(_historyOrders);
            setPlacedOrdersData(_placedOrders);
            setOrderDuringDeliveryData(_orderDuringDelivery);


        }).catch(err => {
            console.log(err);
        })
    }
        return ()=>{setRatings([]);
            setOrderDuringDelivery([]);
            setPlacedOrdersData([]);
            setHistoryOrdersData([]);
            setHistory(false);
            setOrderPlaced(true);
            setCheckedStep(null);
            setOrderDuringDelivery(false);
            mounted=false}
    }, [])

    

    const openDrawer = () => {
        props.navigation.openDrawer();
    }

    const handleRatings = (index) => {
        let _rates = [...ratings];
        console.log(index)
        for (let i = 0; i < _rates.length; i++) {
            if (i <= index) {
                _rates[i].pressed = true;
            }
            else {
                _rates[i].pressed = false;
            }
        }
        setRatings(_rates)
    }



    const orderDone = (item) => {
        markOrderAsReceived(item._id).then(res => {
            item.actif = false;
            setOrderDuringDeliveryData(orderDuringDeliveryData.filter(order => order._id != item._id));
            setHistoryOrdersData(historyOrdersData => [item, ...historyOrdersData])
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
    const start_conversation=()=>{
        const conversation =  context.openConversationHandler({},{user:context.user,other:orderInfo.deliverer},"personal");
        props.navigation.navigate("conversation",{conversation,orders:true})
    
    }
    
    const rateDeliverer =()=>{
    
        const body={
            deliverer:orderRate.deliverer._id,
            comment:feedBack,
            score:ratings.filter(rating=>rating.pressed!=false).length
        };
        createFeedback(context.partner._id,body).then(message=>{
            console.log(message);
        })
        .catch(err=>{alert("error occured")})
        setRatings(_ratings);
        setEnabled(false);
        setRate(false);
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={context.darkMode ? styles.containerDark : styles.container}>
                <View style={context.darkMode ? styles.menuDark : styles.menu}>
                        <View style={styles.leftArrowContainer} >
                        <TouchableOpacity onPress={openDrawer} style={{height:30,width:30}}>
                        <Image source={context.darkMode ?  require("../assets/menu_dark.png"):require("../assets/menu.png")} style={{height:"100%",width:"100%",resizeMode:"cover",marginHorizontal: 4}}/>
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
               {placedOrdersData.length>0 ||placedOrdersData.length>0||orderDuringDeliveryData.length>0?  <View style={styles.ordersContainer}>
                    <FlatList
                        data={orderPlaced ? placedOrdersData : orderDuringDelivery ? orderDuringDeliveryData : history ? historyOrdersData : null}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => {setOrderInfo(item); setEnabled(!enabled); setInformation(!information) }}>
                                <View style={context.darkMode ? styles.deliveryDark : styles.delivery} >
                                    <View style={styles.clientImageContainer}>
                                        <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={item.deliverer ? {uri:item.deliveryPartner.image} :require("../assets/deliverer.jpg")} />
                                    </View>
                                    <View style={styles.deliveryInfo}>
                                        <Text style={context.darkMode ? styles.infoDark : styles.info}>Nom de Livreur: {item.deliverer ? item.deliverer.firstName + " " + item.deliverer.lastName : "wait for deliverer "} </Text>
                                        <Text style={context.darkMode ? styles.infoDark : styles.info}>Numero Telephone:  {item.deliverer ? item.deliverer.phone ? item.deliverer.phone : "no phone yet" : "wait for  deliverer "} </Text>
                                        <Text style={context.darkMode ? styles.infoDark : styles.info}>Date: {item.date.split('T')[0]}</Text>
                                        {history &&
                                            <TouchableOpacity onPress={() => {setOrderRate(item); setEnabled(!enabled); setRate(!rate) }}>
                                                <Text style={{fontSize: Dimensions.get("window").width*0.038, fontWeight: "600", color: "#2474F1", textDecorationLine: "underline" }}>your opinion about this order</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    {
                                        orderDuringDelivery &&

                                            <View style={{ width: "10%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                                                <TouchableOpacity onPress={() => { orderDone(item) }}>
                                                    <FontAwesome color={"#4BB543"} style={{ padding: 0, fontSize: 30, }} name="check" />

                                                </TouchableOpacity>

                                            </View>
                                            
                                    }
                                </View>
                            </TouchableOpacity>
                        }
                        keyExtractor={item => item._id}
                    >
                    </FlatList>
                </View>
                :
                orderPlaced ?
                <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                <Image source={require("../assets/empty_basket.png")} style={{ width:"50%",height:"50%"}}/>
                <Text style={context.darkMode ? {fontSize:20,color:"white",textAlign:"center"}:{fontSize:20,color:"black",textAlign:"center"}}>order placed is Empty</Text>
            </View>
            :
            history ? 
            <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <Image source={require("../assets/historique.png")} style={{ width:"50%",height:"50%"}}/>
            <Text style={context.darkMode ? {fontSize:20,color:"white",textAlign:"center"}:{fontSize:20,color:"black",textAlign:"center"}}>historical orders are Empty</Text>
        </View>:
         <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
         <Image source={require("../assets/order_during_delivery.png")} style={{ width:"50%",height:"50%"}}/>
         <Text style={context.darkMode ? {fontSize:20,color:"white",textAlign:"center"}:{fontSize:20,color:"black",textAlign:"center"}}>order during delivery is Empty</Text>
     </View>

                }

                <Modal
                    transparent={true}
                    animationType={'slide'}
                    visible={enabled}
                >
                    <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
                        <View style={{ flex: 1, width: Dimensions.get("screen").width * 0.9, height: Dimensions.get("screen").height * 0.8, margin: 40, alignSelf: "center", justifyContent: "center", backgroundColor: "white" }}>
                            {information &&
                                <View style={{ width: "100%", height: "90%" }}>
                                    <View style={{ width: "90%", alignSelf: "center", height: "12%", borderBottomColor: "#2474F1", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ fontSize: Dimensions.get("window").width * 0.05 }}>Livraison par:{orderInfo ? orderInfo.deliverer? orderInfo.deliverer.firstName+" "+orderInfo.deliverer.lastName:"":""}</Text>
                                        <TouchableOpacity style={{width:30,height:30}} onPress={()=>{start_conversation()}}>
                                            <View style={{width:"100%",height:"100%"}}>
                                                <Image style={{width:"100%",height:"100%"}} source={require("../assets/message_deliverer.png")}/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <View style={{ width: "90%", alignSelf: "center", height: "12%", borderBottomColor: "#2474F1", borderBottomWidth: 1, flexDirection: "column", justifyContent: "center" }}>
                                        <Text style={{ fontSize: Dimensions.get("window").width * 0.05 }}>produit par:{orderInfo.partner.partnerName}</Text>

                                    </View>
                                    <View style={{ width: "90%", alignSelf: "center", height: "12%", borderBottomColor: "#2474F1", borderBottomWidth: 1, flexDirection: "column", justifyContent: "center" }}>
                                        <Text style={{ fontSize: Dimensions.get("window").width * 0.05 }}>ville:monastir</Text>
                                    </View>
                                    <View style={{ width: "90%", alignSelf: "center", height: "12%", borderBottomColor: "#2474F1", borderBottomWidth: 1, flexDirection: "column", justifyContent: "center" }}>
                                        <Text style={{ fontSize: Dimensions.get("window").width * 0.05 }}>Region:mokninnn</Text>

                                    </View>
                                    <View style={{ width: "90%", alignSelf: "center", height: "12%", borderBottomColor: "#2474F1", borderBottomWidth: 1, flexDirection: "column", justifyContent: "center" }}>
                                        <Text style={{ fontSize: Dimensions.get("window").width * 0.05 }}>Prix:{orderInfo.price} TND</Text>
                                    </View>
                                    <View style={{ width: "90%", alignSelf: "center", height: "30%", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", }}>
                                        <TouchableOpacity style={{ width: "80%", height: "40%" }} onPress={() => { setEnabled(!enabled); setInformation(!information) }}>
                                            <View style={{ width: "100%", height: "100%", borderRadius: 25, backgroundColor: "#2474F1", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ fontSize: Dimensions.get("window").width * 0.06, color: "white" }}>imprimer Information</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            }

                            {
                                rate &&
                                <View style={{ width: "100%", height: "80%" }}>
                                    <View style={{ width: "100%", height: "20%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <Text style={{ fontSize: Dimensions.get("window").width * 0.08, color: "#2474F1" }}>{"Rate delivery man"}</Text>
                                    </View>
                                    <View style={{ width: "90%", height: "20%", flexDirection: "column", alignSelf: "center" }}>
                                        <Text style={{ fontSize: Dimensions.get("window").width * 0.08, color: "#2474F1" }}>Rate</Text>
                                        <View style={{ width: "100%", height: "80%", flexDirection: "row", justifyContent: "center" }}>
                                            {
                                                ratings.map((rating, index) => (
                                                    <TouchableOpacity onPress={() => { handleRatings(index) }}>
                                                        <FontAwesome key={index} color={rating.pressed ? "#bab82d" : "#e8e6e6"} style={{ fontSize: 40, marginHorizontal: 5, fontWeight: "600" }} name="star" />
                                                    </TouchableOpacity>
                                                ))
                                            }
                                        </View>
                                    </View>
                                    <View style={{ width: "90%", height: "50%", flexDirection: "column", alignSelf: "center" }}>
                                        <Text style={{ fontSize: Dimensions.get("window").width * 0.05, color: "#2474F1", marginBottom: 10 }}>Feedback</Text>
                                        <TextInput style={{ width: "100%", height: 100, borderColor: "grey", borderWidth: 1, borderRadius: 12 }} value={feedBack} onChangeText={(text)=>{setFeedBack(text)}} />
                                        <View style={{ flexDirection: "row", width: "60%", alignSelf: "flex-end", height: "30%" }}>
                                            <TouchableOpacity onPress={()=>{setRate(!rate);setEnabled(false);setRatings(_ratings)}} style={{ width: "40%", height: "80%"}}>
                                            <View style={{ width: "100%", height: "100%", flexDirection: "column", alignItems: "center", marginTop: 10,justifyContent:"center" }}>
                                                <Text style={{ fontSize: Dimensions.get("window").width * 0.07, textAlign:'center',textDecorationLine: "underline", color: "#2474F1", marginBottom: 10 }}>skip</Text>
                                            </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={()=>rateDeliverer()} style={{ width: "50%", height: "70%"}}>
                                            <View style={{ width: "100%", height: "100%", borderRadius: 20, flexDirection: "column",justifyContent:"center", alignItems: "center", marginTop: 10, backgroundColor: "#2474F1" }}>
                                            <Text style={{ fontSize: Dimensions.get("window").width * 0.06, color: "white" }}>Rate</Text>

                                            </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            }
                        </View>

                    </View>

                </Modal>

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
        fontSize: Dimensions.get("window").width*0.038,
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

    container: {
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        flexDirection: "column",

    },

    containerDark: {
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
        marginBottom: 8,
        marginTop:10
    },
    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",
        marginBottom: 8,
        marginTop:10


    },
    leftArrowContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop:5
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