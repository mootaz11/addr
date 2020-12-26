 import React,{useState,useContext,useEffect} from 'react'
 import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView ,Dimensions} from 'react-native'
 import { Icon } from 'react-native-elements';
 import AuthContext from '../navigation/AuthContext';
 import _ from 'lodash';
 import { FlatList } from 'react-native-gesture-handler';
 import FontAwesome from 'react-native-vector-icons/FontAwesome';
 import {getDelivererOrders,markOrderAsTaked} from '../rest/ordersApi'

 const order_pipeline = [
     { step: "Order", _id: "1" },
     { step: "Waiting order", _id: "2" },
     { step: "Order to Deliver", _id: "3" },
     { step: "Order Delivered", _id: "4" },
 ];
 
 
//waiting order (prepared:true,actif:true,taked:false) ok => livreur , taked:true
//

 export default function  Deliveries (props) {
     const context = useContext(AuthContext);
     const [Orders, setOrders] = useState([]);
     const [waitingOrders, setWaitingOrders] = useState([]);
     const [OrdersTodeliver, setOrdersToDeliver] = useState([]);
     const [ordersDelivered,setOrdersDelivered]=useState([]);
     const [checkedStep, setCheckedStep] = useState(order_pipeline[0])

     const [order, setOrder] = useState(true);
     const [waitingOrder,setWaitingOrder]=useState(false);
     const [orderToDeliver,setOrderToDeliver]=useState(false);
     const [orderDelivered,setOrderDelivered]=useState(false);

    
    useEffect(() => {
       getDelivererOrders(context.partner._id).then(orders=>{
           let _orders=[];
           let _waitingOrders=[];
           let _ordersToDeliver=[];
           let _deliveredOrders=[];

           orders.map(order=>{
            if (order.actif == true && order.taked == false && order.prepared == false) {
                _orders.push(order);
            }
            if(order.actif==true&&order.taked==false&&order.prepared==true){
                _waitingOrders.push(order);
            }
            if(order.actif==true&&order.taked==true&&order.prepared==true){
                _ordersToDeliver.push(order);
            }
            if(order.actif==false&&order.taked==true&&order.prepared==true){
                _deliveredOrders.push(order);
                console.log(order);
            }
           })
           setOrders(_orders);
           setOrdersToDeliver(_ordersToDeliver);
           setWaitingOrders(_waitingOrders);
           setOrdersDelivered(_deliveredOrders);
       })
    }, [])
 
 
 
   
     const openDrawer = () => {
         props.navigation.openDrawer();
     }


    const takeOrder =(item)=>{
        markOrderAsTaked(item._id,context.partner._id).then(message=>{
            setOrderToDeliver([...OrdersTodeliver,item]);
            setWaitingOrders(waitingOrders.filter(order=>order._id!=item._id));
        })
    }
 

     const checkStep = (item) => {
         setCheckedStep(item)
     
         if (item.step == "Order") {
            setOrder(true);
            setOrderDelivered(false);
            setOrderToDeliver(false);
            setWaitingOrder(false)     
        
        }
         
        if (item.step == "Waiting order") {
            setOrder(false);
            setOrderDelivered(false);
            setOrderToDeliver(false);
            setWaitingOrder(true)     
         }
         
         if(item.step=="Order to Deliver"){
            setOrder(false);
            setOrderDelivered(false);
            setOrderToDeliver(true);
            setWaitingOrder(false);     
         }
         
         if (item.step == "Order Delivered") {
            setOrder(false);
            setOrderDelivered(true);
            setOrderToDeliver(false);
            setWaitingOrder(false)     
         }

     }
     return (
 <SafeAreaView style={{flex:1}}>
 <View style={context.darkMode ? styles.containerDark : styles.container}>
             <View style={context.darkMode ? styles.menuDark : styles.menu}>
                 <TouchableOpacity style={styles.leftArrowContainer}>
                     <View >
                     <TouchableOpacity onPress={openDrawer} style={{height:30,width:30}}>
                        <Image source={context.darkMode ?  require("../assets/menu_dark.png"):require("../assets/menu.png")} style={{height:"100%",width:"100%",resizeMode:"cover"}}/>
                        </TouchableOpacity>
                     </View>
                 </TouchableOpacity>
                 <View style={styles.titleContainer}>
                     <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Commande</Text>
                 </View>
 
             </View>
             <View style={styles.headerElements}>
                 <FlatList
                     data={order_pipeline}
                     numColumns={2}
                     renderItem={({ item }) =>
                         <TouchableOpacity style={checkedStep && item._id == checkedStep._id ? styles.stepChecked :(context.darkMode ? styles.stepDark: styles.step)} onPress={() => checkStep(item)}>
                             <View style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                 <Text style={checkedStep && item._id == checkedStep._id ? { color: "white", fontSize: 15, textAlign: "center" } : (context.darkMode ? { color: "white", fontSize: 15, textAlign: "center" }:{ color: "black", fontSize: 15, textAlign: "center" } )}>{item.step}</Text>
                             </View>
                         </TouchableOpacity>
 
 
                     }
                     keyExtractor={item => item._id}
                 >
 
                 </FlatList>
 
             </View>
             <View style={styles.ordersContainer}>
 
                 <FlatList
                     data={order ? Orders : waitingOrder ? waitingOrders : orderToDeliver ? OrdersTodeliver : orderDelivered ? ordersDelivered :null}
                     renderItem={({ item }) =>
                     <TouchableOpacity disabled={!orderDelivered}>
                         <View style={context.darkMode ? styles.deliveryDark :  styles.delivery} >
                             <View style={styles.clientImageContainer}>
                                 <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={require("../assets/mootaz.jpg")} />
                             </View>
                             <View style={styles.deliveryInfo}>
                                 <Text style={context.darkMode ? styles.infoDark : styles.info}>Nom de client: {item.client.lastName+" "+item.client.firstName} </Text>
                                 <Text style={context.darkMode ? styles.infoDark : styles.info}>Telephone: +216 {item.client.phone}</Text>
                                 <Text style={context.darkMode ? styles.infoDark : styles.info}>Date: {item.date.split('T')[0]}</Text>

                             </View>
                             {
                                 waitingOrder ?
                                 <View style={{ width: "10%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                 <TouchableOpacity onPress={() => { waitingOrder ?  takeOrder(item):null }}>
                                         <FontAwesome color={"#4BB543"} style={{ padding: 0, fontSize: 30, }} name="check" />
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
        backgroundColor: "#fcfcfc",
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
        marginTop:10,
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
        marginBottom: 8
    },
    menuDark:{
        marginTop:10,
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
        justifyContent: "center",
        marginTop:5
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
    TitleDark:{
        fontWeight: "700",
        fontSize: Dimensions.get("window").width * 0.07,
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