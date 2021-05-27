import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, TextInput, Animated,ScrollView,Dimensions,Alert,Modal,TouchableWithoutFeedback } from 'react-native'
import { Icon } from 'react-native-elements';
import AuthContext from '../../navigation/AuthContext';
import _ from 'lodash';
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {markOrderAsPrepared,getPartnerOrders,markOrderAspayed} from '../../rest/ordersApi'

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
    const [orderInfo,setOrderInfo]=useState(null);
    const [enabled, setEnabled] = useState(false);
    const [information, setInformation] = useState(false);
    const [checkedStep, setCheckedStep] = useState(order_pipeline[0])
    const [orderToPrepare, setOrderToPrepare] = useState(true);
    const [preparedOrder, setPreparedOrder] = useState(false);
    const [deliveredOrder, setDeliveredOrder] = useState(false);
    const [payedOrders,setPayedOrders]=useState([]);
    const [modalListPartners, setModalListPartners] = useState(false)
    const [profiles, setProfiles] = useState([]);
    const [profileChecked, setProfileChecked] = useState(false);
    const [positionModal,setPositionModal]=useState(new Animated.ValueXY({x:0,y:0}))



    useEffect(()=>{
        if(context.partner){

        
        getPartnerOrders(context.partner._id).then(orders=>{
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
    }
    },[context.partner])
    const modalDown =()=>{
        console.log(positionModal);
        Animated.timing(positionModal, {
          toValue: { x: 0, y:0},
          duration: 200,
          useNativeDriver: true
        }).start(()=>{
          setModalListPartners(!modalListPartners)
    
        });
    
     
    
    }
    
      const modalUp =()=>{
        Animated.timing(positionModal, {
          toValue: { x: 0, y:200},
          duration: 200,
          useNativeDriver: true
        }).start();
      }
    
   
    const checkAccount = (item) => {
        context.setProfile(item);
        if (!item.firstName) {
          context.setPartner(item);
            
            if(item.delivery.cities.length>0 || item.delivery.regions.length>0||item.delivery.localRegions.length>0){
                if(item.owner ==context.user._id){
                    props.navigation.navigate('deliveryDash');
                }
    
                if (item.managers.length > 0 && item.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
                && item.managers[item.managers.findIndex(manager => { return manager.user == context.user._id })].access.deliveryAccess.deposit) {
                props.navigation.navigate('debou');
              }
                if(item.deliverers.findIndex(d=>{return d.user==context.user._id})>=0){
                  if(item.deliverers[item.deliverers.findIndex(d=>{return d.user==context.user._id})].type=="delivery"){
                    props.navigation.navigate("livraisons", { last_screen: "delivery" });
                }
                  if(item.deliverers[item.deliverers.findIndex(d=>{return d.user==context.user._id})].type=="collect"){
                    props.navigation.navigate("collecting");
                  }
        
                  if (item.delivery.localRegions.length > 0 && item.deliverers[item.deliverers.findIndex(d => { return d.user == context.user._id })].type == "both") {
            
                    getTobepickedUpOrders(context.user._id,context.partner._id).then(_orders=>{
                      _orders.map(_order=>{
                          markOrderAsDuringClientDelivery(context.partner._id, _order._id,
                              {lat:context.location.location.latitude,lng:context.location.location.longitude}, 
                              {lng:_order.client.location.location.longitude,
                              lat:_order.client.location.location.latitude})
                              .then(message => {
                              }).catch(err=>{alert("failed while updating order")})                    })
        
                  
                              props.navigation.navigate('delivering', { last_screen: "menu to  delivering" })
        
                  })          
                }
                  
        
                }
                setModalListPartners(!modalListPartners)
    
            }
    
    
            if(item.delivery.cities.length==0 && item.delivery.regions.length==0&& item.delivery.localRegions.length==0)
              {
              if(item.managers.findIndex(m=>{return m.manager==context.user._id})>=0 &&item.managers[item.managers.findIndex(m=>{return m.manager==context.user._id})].access.businessAccess.dashboard){
                props.navigation.navigate("businessDash");
              }
              if(item.managers.findIndex(m=>{return m.manager==context.user._id})>=0 &&item.managers[item.managers.findIndex(m=>{return m.manager==context.user._id})].access.businessAccess.products){
                  props.navigation.navigate("listProducts");
              }
              if(item.managers.findIndex(m=>{return m.manager==context.user._id})>=0 &&item.managers[item.managers.findIndex(m=>{return m.manager==context.user._id})].access.businessAccess.orders){
                props.navigation.navigate("businessorders");
              }
             if(item.owner==context.user._id){
              props.navigation.navigate("businessDash");
    
             }
              setModalListPartners(!modalListPartners)
    
            }
        
          
    
    
    
    
          
    
        
      }
    
    
        else {
          setModalListPartners(!modalListPartners)
          context.setPartner(null);
    
          props.navigation.navigate("Settings")
        }
      }
      const checkProfile = () => {

        let _profiles = [];

    if (context.user.isVendor) {
      _profiles =_profiles.concat(context.user.workPlaces);
    }

    if (context.user.isPartner) {
        _profiles = _profiles.concat(context.user.partners);
     
      }
        if (_profiles.findIndex(p => { return p._id == context.user._id }) == -1) {
          _profiles.push(context.user);
       
    
        }
        setProfiles(_profiles);
    
        // setProfiles([context.user,...profiles]);
        setProfileChecked(!profileChecked);
        setModalListPartners(!modalListPartners)
        modalUp();
    
      }
    



    const openDrawer = () => {
        props.navigation.openDrawer();
    }
    const prepareOrderHandler = (item)=>{
        markOrderAsPrepared(item._id,context.partner._id).then(message=>{
            Alert.alert(
                "",
                "order prepared succefully!",
                [
                  { text: "OK" ,onPress:()=>{
                    setPreparedOrders([...preparedOrders,item]);
                    setOrderstoPrepare(orderstoPrepare.filter(order => order._id != item._id));
               
                  }
                }
                ],
                { cancelable: false }
              );
            }   
        )
            
            }


    const markOrdderAspayedDone =(item)=>{
        markOrderAspayed(item._id,context.partner._id).then(message=>{
            Alert.alert(
                "",
                "order payed succefully!",
                [
                  { text: "OK" ,onPress:()=>{
                        setPayedOrders([...payedOrders,item]);
                  }
                }
                ],
                { cancelable: false }
              );
               
        })
    }


    // const startConversation = (order)=>{
    //    const conversation =  context.openConversationHandler({},{user:order.client,other:order.deliverer});
    //    props.navigation.navigate("conversation",{conversation,orders:true})
    // }
            
    

    const printInfo = ()=>{
        setEnabled(!enabled); 
        setInformation(!information)
    }


    const checkStep = (item) => {
        setCheckedStep(item)
        if (item.step == "Order to prepare") {
            setPreparedOrder(false);
            setDeliveredOrder(false);
            setOrderToPrepare(true);
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

    const start_conversation=()=>{
        if(orderInfo.deliveryOrder&&orderInfo.deliveryOrder.clientDeliverer){
            const conversation =  context.openConversationHandler({},{user:context.user,other:orderInfo.deliveryOrder.clientDeliverer},"personal");
            setEnabled(!enabled)
            props.navigation.navigate("conversation",{conversation,orders:true})    
    
        }
        else {
            alert("deliverer not found yet");
        }
    }
    


    return (
        <View style={context.darkMode ? styles.containerDark : styles.container}>
                         <View style={context.darkMode ?  styles.menuDark: styles.menu}>
            <View style={styles.leftArrowContainer} >
                     <TouchableOpacity onPress={openDrawer} style={{height:Dimensions.get("screen").width*0.04,width:Dimensions.get("screen").width*0.04}}>
                        <Image source={context.darkMode ?  require("../../assets/menu_dark.png"):require("../../assets/menu.png")} style={{height:"100%",width:"100%",resizeMode:"cover"}}/>

                        </TouchableOpacity>
                     </View>
                <View style={styles.titleContainer}>
                    <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Orders</Text>

                </View>
                <View style={{
                            width: "15%",
                            height: "100%",
                    
                }}>
                    <TouchableOpacity  onPress={() => { checkProfile() }} style={{width: "100%",  flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
}}>
                    <Image
                    
                    style={{ height: Dimensions.get("screen").width*0.07, width:  Dimensions.get("screen").width*0.07, borderRadius:  Dimensions.get("screen").width*0.07, borderColor: "#2474F1", borderWidth: 1 }}                 
                       source={context.partner ? context.partner.profileImage ? {uri:context.partner.profileImage}:require('../../assets/user_image.png') : context.user ? context.user.photo ? { uri: context.user.photo } : require('../../assets/user_image.png') :require('../../assets/user_image.png')} />

                    </TouchableOpacity>

                </View>


            </View>
            <View style={styles.headerElements}>
                <FlatList
                    data={order_pipeline}
                    numColumns={2}
                    renderItem={({ item }) =>
                        <TouchableOpacity style={checkedStep && item._id == checkedStep._id ? styles.stepChecked : (context.darkMode ? styles.stepDark : styles.step)} onPress={() => checkStep(item)}>
                            <View style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                            <Text style={checkedStep && item._id == checkedStep._id ? { color: "white", fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03, textAlign: "center" } : (context.darkMode ? { color: "white", fontFamily:'Poppins',fontSize:  Dimensions.get("screen").width*0.03, textAlign: "center" } : { color: "black", fontFamily:'Poppins',fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03, textAlign: "center" })}>{item.step}</Text>
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
                            <TouchableOpacity style={{width:"100%",height:Dimensions.get("screen").height*0.18}} onPress={() => {setOrderInfo(item); setEnabled(!enabled); setInformation(!information) }}>
                        <View style={context.darkMode ? styles.deliveryDark : styles.delivery} >
                            <View style={styles.clientImageContainer}>
                                <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={require("../../assets/user_image.png")} />
                            </View>
                            <View style={styles.deliveryInfo}>
                                <Text style={context.darkMode ? styles.infoDark : styles.info}>Nom de client: {item.client.firstName+" "+item.client.lastName} </Text>
                                <Text  style={context.darkMode ? styles.infoDark : styles.info}>Date: {item.date.toLocaleString().split(':')[0].split('T')[0]}</Text>
                            </View>
                            {
                                orderToPrepare || deliveredOrder && payedOrders.findIndex(order=>{return order._id==item._id})==-1 ? 
                                    <View style={{ width: "25%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                                        <TouchableOpacity onPress={() => { orderToPrepare ? prepareOrderHandler(item):markOrdderAspayedDone(item) }}>
                                            <FontAwesome color={"#4BB543" } style={{ padding: 0, fontFamily:'Poppins',fontSize: 30, }} name="check" />
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
            <Modal
                    transparent={true}
                    animationType={'slide'}
                    visible={enabled&&deliveredOrder}
                >
                    <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
                        <View style={{ flex: 1, width: Dimensions.get("screen").width * 0.9, height: Dimensions.get("screen").height * 0.8, margin: 40,borderRadius:12, alignSelf: "center", justifyContent: "center", backgroundColor: "white" }}>
                            {information &&
                                <View style={{ width: "100%", height: "90%" }}>
                                    <View style={{ width: "90%", alignSelf: "center", height: "12%", borderBottomColor: "#2474F1", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.05 }}>Livraison par:{orderInfo ? orderInfo.deliveryOrder.clientDeliverer? orderInfo.deliveryOrder.clientDeliverer.username :"":""}</Text>
                                        <TouchableOpacity style={{width:30,height:30}} onPress={()=>{start_conversation()}}>
                                            <View style={{width:"100%",height:"100%"}}>
                                                <Image style={{width:"100%",height:"100%"}} source={require("../../assets/message_deliverer.png")}/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <View style={{ width: "90%", alignSelf: "center", height: "12%", borderBottomColor: "#2474F1", borderBottomWidth: 1, flexDirection: "column", justifyContent: "center" }}>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.05 }}>produit par:{orderInfo.partner.partnerName}</Text>

                                    </View>
                                    <View style={{ width: "90%", alignSelf: "center", height: "12%", borderBottomColor: "#2474F1", borderBottomWidth: 1, flexDirection: "column", justifyContent: "center" }}>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.05 }}>ville:{orderInfo.city.cityName}</Text>
                                    </View>
                                    <View style={{ width: "90%", alignSelf: "center", height: "12%", borderBottomColor: "#2474F1", borderBottomWidth: 1, flexDirection: "column", justifyContent: "center" }}>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.05 }}>Region:{orderInfo.region.regionName}</Text>

                                    </View>
                                    <View style={{ width: "90%", alignSelf: "center", height: "12%", borderBottomColor: "#2474F1", borderBottomWidth: 1, flexDirection: "column", justifyContent: "center" }}>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.05 }}>Prix:{orderInfo.price+orderInfo.deliveryOrder.price  +` : base price +delivery (${orderInfo.deliveryOrder.price})`} TND</Text>
                                    </View>
                                    <View style={{ width: "90%", alignSelf: "center", height: "30%", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", }}>
                                        <TouchableOpacity style={{ width: "80%", height: "40%" }} onPress={() => { printInfo()  }}>
                                            <View style={{ width: "100%", height: "100%", borderRadius: 25, backgroundColor: "#2474F1", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.04, color: "white" }}>imprimer</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            }

                          
                        </View>

                    </View>

                </Modal>
                <Modal

transparent={true}
visible={modalListPartners}

>
<View style={{ backgroundColor: "#000000aa", flex: 1 }}>
  <Animated.View style={{ width: Dimensions.get("screen").width,position:"absolute",top:-200,transform: [{ translateX: positionModal.x }, { translateY: positionModal.y }]
,height: 200, alignSelf: "center", backgroundColor: "white" }}>
    <View style={{ width: "100%", height: "95%" }}>
      <FlatList
        data={profiles}
        renderItem={({ item }) =>
        (
          <TouchableOpacity key={item._id} onPress={() => { checkAccount(item) }}>
            <View style={{ flexDirection: "row", width: "100%", height: 60 }}>
              <View style={{ width: "20%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Image style={{ width: 50, height: 50, borderRadius: 50, resizeMode: "contain" }} source={item.photo ? { uri: item.photo } : item.profileImage ? { uri: item.profileImage } : require("../../assets/user_image.png")} />
              </View>
              <View style={{
                width: "60%", height: "100%", flexDirection: "column",
                justifyContent: "center"
              }}>

                <Text style={{ marginHorizontal: 15, fontFamily: 'Poppins', fontSize: 15 }}>{item.firstName ? item.firstName + " " + item.lastName : item.partnerName}</Text>
              </View>
              <View style={{ width: "20%", height: "100%", flexDirection: "column", justifyContent: "center" }}>
                <View style={context.profile._id === item._id ? { width: 30, height: 30, borderRadius: 30, borderColor: "#2474F1", borderWidth: 8, alignSelf: "center" } : { width: 30, height: 30, borderRadius: 30, borderColor: "#dbdbdb", borderWidth: 1, alignSelf: "center" }}></View>
              </View>

            </View>
          </TouchableOpacity>

        )
        }
        keyExtractor={item => item._id}
      >
      </FlatList>
      <View style={{ width: "100%", height: "10%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <ScrollView onScrollBeginDrag={() => {modalDown(); }}>
          <View style={{ width: 50, height: 3, backgroundColor: "black", borderRadius: 5 }}></View>
        </ScrollView>
      </View>
    </View>

  </Animated.View>

  <View style={{width:"100%",position:"absolute",top:200,height:Dimensions.get("screen").height-200}}>
<TouchableWithoutFeedback style={{width:"100%",height:"100%"}} onPress={()=>{modalDown()}}>
        <View style={{width:"100%",height:"100%"}}></View>
</TouchableWithoutFeedback>
  </View>
</View>

</Modal>
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
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width*0.038,
        fontWeight: "600"
    },
    infoDark: {
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width*0.038,
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
        height:Dimensions.get("screen").height*0.18 ,    
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
        height:Dimensions.get("screen").height*0.18  ,   
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
    listPartners: {
        position: "absolute",
        alignSelf: 'center',
        marginTop: Platform.OS == 'ios' ? 30 : 20,
        elevation: 10,
        top: 0,
        backgroundColor: "white",
        width: "98%",
        height: 150,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        //flex:1,
        shadowOpacity: 0.5,
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
        width: "75%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    Title: {
        fontWeight: "700",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
    },
    TitleDark: {
        fontWeight: "700",
        fontFamily:'Poppins',fontSize: 28,
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