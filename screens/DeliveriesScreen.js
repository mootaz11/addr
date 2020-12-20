 import React,{useState} from 'react'
 import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native'
 import { Icon } from 'react-native-elements';
 import AuthContext from '../navigation/AuthContext';
 import _ from 'lodash';
 import { FlatList } from 'react-native-gesture-handler';
 import FontAwesome from 'react-native-vector-icons/FontAwesome';
 

 const order_pipeline = [
     { step: "Order placed", _id: "1" },
     { step: "waiting order", _id: "2" },
     { step: "Order to Deliver", _id: "3" },
     { step: "Order Delivered", _id: "4" },
 ];
 
 const placedorder_data = [
     {
         nomLivreur: "sara sara ",
         productname: "zgougou",
         Date: "11.08.2020",
         _id: "1"
     },
     {
         nomLivreur: "sara sara ",
         productname: "zgougou",
         Date: "11.08.2020", _id: "2"
     },
     {
         nomLivreur: "sara sara ",
         productname: "zgougou",
         Date: "11.08.2020",
         _id: "3"
     },
     {
         nomLivreur: "sara sara ",
         productname: "zgougou",
         Date: "11.08.2020", _id: "4"
     }
   ]
 
 const order_during_deliv = [
     {
         nomLivreur: "sara sara ",
         productname: "zgougou",
         Date: "11.08.2020", _id: "2"
     },
     {
         nomLivreur: "sara sara ",
         productname: "zgougou",
         Date: "11.08.2020",
         _id: "3"
     },
    ]

 const historique = [
    {
         nomLivreur: "sara sara ",
         productname: "zgougou",
         Date: "11.08.2020", _id: "2"
     },
    ]
 

 export default function  Deliveries (props) {
     const context = React.useContext(AuthContext);
     const [placedOrdersData, setPlacedOrdersData] = useState(context.actifOrders);
     const [historyOrdersData, setHistoryOrdersData] = useState(context.historyOrders);
     const [orderDuringDeliveryData, setOrderDuringDeliveryData] = useState([]);
 
     const [checkedStep, setCheckedStep] = useState(order_pipeline[0])
 
     const [orderPlaced, setOrderPlaced] = useState(true);
     const [orderDuringDelivery, setOrderDuringDelivery] = useState(false);
     const [history, setHistory] = useState(false);
     const [Done, setDone] = useState(false);
 
 
     const [search, setSearch] = useState("");
     const [searchResult, setSearchResult] = useState(context.historyOrders);
 
 
     /*useEffect(() => {
         setDark(context.darkMode);
     }, [context.darkMode])
 */
 
     const openDrawer = () => {
         props.navigation.openDrawer();
     }

    
 

     const orderDone = (item) => {
         setDone(true);
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
 <SafeAreaView>
 <View style={context.darkMode ? styles.containerDark : styles.container}>
             <View style={context.darkMode ? styles.menuDark : styles.menu}>
                 <TouchableOpacity style={styles.leftArrowContainer}>
                     <View >
                         <Icon color={context.darkMode ? "white":"#2474F1"} style={{ flex: 1, padding: 0 ,justifyContent:"center"}} name="menu" onPress={openDrawer} />
                     </View>
                 </TouchableOpacity>
                 <View style={styles.titleContainer}>
                     <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Deliveries</Text>
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
                     data={orderPlaced ? placedorder_data : orderDuringDelivery ? order_during_deliv : history ? historique : null}
                     renderItem={({ item }) =>
                     <TouchableOpacity>
                         <View style={context.darkMode ? styles.deliveryDark :  styles.delivery} >
                             <View style={styles.clientImageContainer}>
                                 <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={require("../assets/mootaz.jpg")} />
                             </View>
                             <View style={styles.deliveryInfo}>
                                 <Text style={context.darkMode ? styles.infoDark : styles.info}>Nom de Livreur: {item.nomLivreur} </Text>
                                 <Text style={context.darkMode ? styles.infoDark : styles.info}>Nom de Produit: {item.productname} </Text>
                                 <Text style={context.darkMode ? styles.infoDark : styles.info}>Date: {item.Date}</Text>
                                 {   history &&
                                     <TouchableOpacity>
                                         <Text style={{ fontSize: 12, fontWeight: "600", color: "#2474F1", textDecorationLine: "underline" }}>your opinion about the product</Text>
                                     </TouchableOpacity>
                                     
                             }
 
 
                             </View>
                             {
                                 orderDuringDelivery ?
 
                                     <View style={{ width: "25%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
 
                                         <TouchableOpacity onPress={() => { orderDone(item) }}>
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