import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Dimensions,Modal } from 'react-native'
import AuthContext from '../../navigation/AuthContext';
import _ from 'lodash';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { FlatList } from 'react-native-gesture-handler';
import {duringCollectDelivery,getTobepickedUpOrders} from '../../rest/ordersApi'
import {ScrollView} from 'react-native-gesture-handler';

const api_directions_key = "AIzaSyDcbXzRxlL0q_tM54tnAWHMlGdmPByFAfE";



export default function collecting(props) {
    const context = useContext(AuthContext);
    const [waitingOrder, setWaitingOrder] = useState(true);
    const [todayOrder, setTodayOrder] = useState(false);
    const [showDeleteOrder, setShowDeleteOrder] = useState(false);
    const [showPopup,setShowPopup]=useState(false);
    const [waitingOrders, setWaitingOrders] = useState([])
    const [todayOrders, setTodayOrders] = useState([])
    const [order_id,setOrderId]=useState(null);
    const [pathmodal,setPathmodal]=useState(false);
    const [targetLocation,setTargetLocation]=useState(null);
    const [modalListPartners, setModalListPartners] = useState(false)
    const [profile, setProfile] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [profileChecked, setProfileChecked] = useState(false);


    useEffect(() => {
      getTobepickedUpOrders(context.user._id,context.partner._id).then(
        _waitingorders=>{setWaitingOrders(_waitingorders)}      

      ).catch();

      duringCollectDelivery(context.user._id,context.partner._id).then(
        _duringclientOrders=>{
          setTodayOrders(_duringclientOrders)        
        }  
      ).catch()
      

    }, [props.route.params])
    
    
    const start_conversation=(partner)=>{
        let users_id = []
        partner.managers.forEach(manager => {
          users_id.push(manager.user);
        })
        users_id.push(context.user._id);
        users_id.push(partner.owner);
        const conversation = context.openConversationHandler({}, { users_id }, "group", partner);
        props.navigation.navigate("conversation", { conversation, orders: true })
        
        
        
         // const conversation =  context.openConversationHandler({},{user:context.user,other:orderInfo.deliveryOrder.clientDeliverer},"personal");
        // props.navigation.navigate("conversation",{conversation,orders:true})
    
    }

    const checkAccount = (item) => {
      setProfile(item);
      if (!item.firstName) {
        context.setPartner(item);
          
          if(item.delivery.cities.length>0 || item.delivery.regions.length>0){
              if(item.owner ==context.user._id){
                  props.navigation.navigate('deliveryDash');
              }
              if (item.managers.length > 0 &&item.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
              && item.managers[item.managers.findIndex(manager => { return manager.user == context.user._id })].access.deliveryAccess.deposit) {
              props.navigation.navigate('debou');
            }
              if(item.deliverers.findIndex(d=>{return d.user==context.user._id})>=0){
                if(item.deliverers[item.deliverers.findIndex(d=>{return d.user==context.user._id})].type=="delivery"){
                    props.navigation.navigate("livraisons",{last_screen:""});
                }
                if(item.deliverers[item.deliverers.findIndex(d=>{return d.user==context.user._id})].type=="collect"){
                  props.navigation.navigate("collecting");
                }
      
                if(item.deliverers[item.deliverers.findIndex(d=>{return d.user==context.user._id})].type=="both"){
                  props.navigation.navigate("collecting");
                }
                
      
              }
              setModalListPartners(!modalListPartners)
  
          }
  
  
          if(item.delivery.cities.length==0 && item.delivery.regions.length==0)
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
    
  
  
    const seePath =(order)=>{
        setTargetLocation({partner_image:order.purchaseOrder.partner.profileImage ,location:order.purchaseOrder.partner.localisation})
        setPathmodal(!pathmodal)

    }
    const checkProfile = () => {
      let _profiles = [];
  
      if (context.user.isVendor) {
        _profiles = context.user.workPlaces;
  
        if(context.partner && context.user.workPlaces.findIndex(partner=>{return partner._id == context.partner._id})){
          setProfile(context.partner);
      }

      }
      if (context.user.isPartner) {
          _profiles = context.user.partners;
          if(context.partner && context.user.partners.findIndex(partner=>{return partner._id == context.partner._id})){
            setProfile(context.partner);
        }
        }
      if (_profiles.findIndex(p => { return p._id == context.user._id }) == -1) {
        _profiles.push(context.user);
        if(!context.partner){
            setProfile(context.user);
        }
  
      }
      setProfiles(_profiles);
  
      // setProfiles([context.user,...profiles]);
      setProfileChecked(!profileChecked);
      setModalListPartners(!modalListPartners)
    }
  

    const scanOrderTocollect = ()=>{
        setShowPopup(!showPopup);
        props.navigation.navigate("livraisons",{last_screen:"collecting",order_id:order_id})
        setTodayOrders([]);
        setWaitingOrders([]);
    }




    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={context.darkMode ? styles.containerDark : styles.container}>
            <View style={context.darkMode ? styles.menuDark : styles.menu}>
                    <View style={styles.leftArrowContainer} >
                    <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={{ height: Dimensions.get("screen").width*0.06, width:  Dimensions.get("screen").width*0.06}}>
                            <Image source={require("../../assets/left_arrow.png")} style={{ height: "100%", width: "100%", resizeMode: "cover" }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleContainer}>

                        <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Collecting</Text>
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
                <View style={{ width: "94%", height: "20%", flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => {
                        setTodayOrder(!todayOrder); setWaitingOrder(!waitingOrder)
                    }} style={{ width: "50%", height: "50%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04 }}>Waiting Orders</Text>
                        {waitingOrder &&
                            <View style={{ width: Dimensions.get("screen").width * 0.3, height: 2, marginTop: 3, backgroundColor: "#2474F1" }}></View>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setTodayOrder(!todayOrder); setWaitingOrder(!waitingOrder)
                    }} style={{ width: "50%", height: "50%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04}}>Today's Orders</Text>
                        {todayOrder &&
                            <View style={{ width: Dimensions.get("screen").width * 0.3, height: 2, marginTop: 3, backgroundColor: "#2474F1" }}></View>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.ordersContainer}>
                    <FlatList
                        data={waitingOrder ? waitingOrders : todayOrders}
                        renderItem={({ item }) =>
                            <TouchableOpacity disabled={true}>
                                <View style={context.darkMode ? styles.deliveryDark : styles.delivery}>
                                    <View style={styles.clientImageContainer}>
                                        <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={waitingOrder ? require("../../assets/images/clock.png"):require("../../assets/images/tick_order.png")} />
                                    </View>
                                    <View style={{ width: "85%", height: "100%", flexDirection: "column" }}>
                                        <View style={styles.deliveryTitle}>
                                            <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.05, color: "#2474F1", textDecorationLine: "underline", textTransform: 'capitalize' }}>{item.productName}</Text>
                                            <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.05, color: "grey" }}>{}</Text>
                                        </View>
                                        <View style={{ width: "100%", height: "60%", flexDirection: "row" }}>
                                            <View style={styles.deliveryInfo}>
                                                <View style={{ width: "100%", height: "25%", flexDirection: "row" }}>
                                                    <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>Nom de client:</Text>
                                                    <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "grey" }}>{item.client.firstName+" "+item.client.lastName}</Text>
                                                </View>
                                                <View style={{ width: "100%", height: "25%", flexDirection: "row" }}>
                                                    <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>N° de Tel:</Text>
                                                    <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "grey" }}>{item.phone}</Text>
                                                </View>
                                                <View style={{ width: "100%", height: "25%", flexDirection: "row" }}>
                                                    <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>Prix:</Text>
                                                    <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "grey" }}>{item.price} Dt</Text>
                                                </View>
                                                <View style={{ width: "100%", height: "25%", flexDirection: "row" }}>
                                                    <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>ID:</Text>
                                                    <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "grey" }}>{item._id}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.actions}>
                                                <TouchableOpacity onPress={()=>{seePath(item)}} style={{ width: "80%", height: "40%" }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../../assets/images/logoBlue.png")} />
                                                </TouchableOpacity>
                                                <TouchableOpacity  onPress={()=>{start_conversation(item.purchaseOrder.partner)}} style={{ width: "80%", height: "40%" }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../../assets/images/messenger.png")} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                {
                                    waitingOrder&&<View style={{ width: "100%", height: "20%", flexDirection: "row", justifyContent: "flex-end" }}>
                                    <TouchableOpacity onPress={()=>{setShowPopup(!showPopup),setShowDeleteOrder(true)}} style={{ width: "30%", height: "80%", backgroundColor: "#ff4119", marginHorizontal: 3, borderRadius: 8, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <Text style={{ color: "white" }}>Remove</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{setShowPopup(!showPopup),setShowDeleteOrder(false);setOrderId(item._id)}} style={{ width: "30%", height: "80%", backgroundColor: "#73e340", marginHorizontal: 3, borderRadius: 8, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <Text style={{ color: "white" }}>Confirm</Text></TouchableOpacity>
                                </View>

                                }
                                        

                                    </View>
                                </View>

                            </TouchableOpacity>
                        }
                        keyExtractor={item => item._id}
                    >
                    </FlatList>
                </View>
                {showPopup&&
                 <View style={{ width: "90%", borderRadius: 12, flexDirection: "column", height: "60%", top: "30%", position: "absolute", backgroundColor: "white" }}>
                 <View style={{ width: "100%", height: "80%", flexDirection: "column", alignItems: "center", }}>
                     <Text style={showDeleteOrder ? { color: "red", fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.08, margin: 10 } : { color: "#46EB24", fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.08, margin: 10 }}>{showDeleteOrder ? "Remove Order" : "Order in Debou"}</Text>
                     <View style={{ width: Dimensions.get("screen").width * 0.3, borderRadius: Dimensions.get("screen").width * 0.3, height: Dimensions.get("screen").width * 0.3, flexDirection: "column", backgroundColor: "#EBEBEB", alignItems: "center", justifyContent: "center" }}>
                         <Image style={{ width: "60%", height: "60%", resizeMode: "cover" }} source={showDeleteOrder ? require("../../assets/images/order_warning.png") : require("../../assets/images/check_order.png")} />
                     </View>
                     <Text style={{ color: "black", fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, margin: 10, textAlign: "center" }}>{showDeleteOrder ? "Are you sure you want to cancel this order ? " : "Are you sure,you want to confirm delivering order ?"}</Text>
                     <Text style={{ color: "grey", fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, textAlign: "center", margin: 10 }}>{showDeleteOrder ? "Please becareful while removing order this action can't be undone !" : "Please make sure that item delivered this action can't be undone !"}</Text>
                 </View>


                 <View style={{ width: "100%", height: "15%", flexDirection: "row" }}>


                     <View  style={showDeleteOrder ? { width: "50%", height: "100%", backgroundColor: "#384068", borderBottomLeftRadius: 12, borderTopLeftRadius: 12 } : { width: "50%", height: "100%", backgroundColor: "#46EB24", borderBottomLeftRadius: 12, borderTopLeftRadius: 12 }}>
                         <TouchableOpacity onPress={()=>{scanOrderTocollect()}} style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                             <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.06, color: "white" }}>
                                 {showDeleteOrder ? "Yes,remove it" : "Confirm"}
                             </Text>
                         </TouchableOpacity>


                     </View>

                     <View style={showDeleteOrder ? { width: "50%", height: "100%", backgroundColor: "red", borderBottomRightRadius: 12, borderTopRightRadius: 12 }:{ width: "50%", height: "100%", backgroundColor: "#384068", borderBottomRightRadius: 12, borderTopRightRadius: 12 }}>
                         <TouchableOpacity onPress={()=>{setShowPopup(!showPopup)}} style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                             <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.06, color: "white" }}>
                                 {showDeleteOrder ? "No,Keep it":"cancel"}
                             </Text>
                         </TouchableOpacity>

                     </View>
                 </View>

             </View>
                }
               
            </View>
            <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={pathmodal}>
                        <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
                            <View style={{ backgroundColor: "#ffffff", margin: 40, flexDirection: "column", borderRadius: 10, height: Dimensions.get("window").height * 0.8, width: Dimensions.get("window").width * 0.9, alignSelf: "center" }}>
                                <View style={{ width: "100%", height: "80%" }}>
                                    <MapView
                                        initialRegion={{
                                            latitude: context.location ? context.location.location ? Number(context.location.location.latitude) : 0 : 0,
                                            longitude: context.location ? context.location.location ? Number(context.location.location.longitude) : 0 : 0
                                            , latitudeDelta: 0.5,
                                            longitudeDelta: 0.5 * (Dimensions.get("window").width / Dimensions.get("window").height)

                                        }}

                                        style={{ flex: 1, borderRadius: 10 }}
                                        customMapStyle={darkStyle}
                                        provider="google"
                                    >
                                        <Marker
                                            coordinate={
                                                Platform.OS == 'ios' ?
                                                    {
                                                        latitude: context.location.location ? Number(context.location.location.latitude) : 0

                                                        ,
                                                        longitude: context.location.location ? Number(context.location.location.longitude) : 0

                                                    } :
                                                    {
                                                        latitude: context.location.location ? Number(context.location.location.latitude) : 0

                                                        ,
                                                        longitude: context.location.location ? Number(context.location.location.longitude) : 0

                                                    }



                                            }
                                        >
                                            <Image source={context.user.photo?{uri:context.user.photo}:require('../../assets/user_image.png')} style={{ height: 40, width: 40 ,borderRadius:40,borderWidth:2,borderColor:"#2474F1"}} />

                                        </Marker>
                                        <Marker
                                            coordinate={
                                                Platform.OS == 'ios' ?
                                                    {
                                                        latitude:targetLocation&& targetLocation.location ? Number(targetLocation.location.lat) : 0
,
                                                        longitude:targetLocation&& targetLocation.location ? Number(targetLocation.location.lng) : 0

                                                    } :
                                                    {
                                                        latitude:targetLocation&& targetLocation.location ? Number(targetLocation.location.lat) : 0

                                                        ,
                                                        longitude:targetLocation&& targetLocation.location ? Number(targetLocation.location.lng) : 0

                                                    }



                                            }
                                        >
                                            <Image source={targetLocation&&targetLocation.partner_image?{uri:targetLocation.partner_image}:require('../../assets/logoAddresti.png')} style={{ height: 40, width: 40,borderRadius:40,borderWidth:2,borderColor:"#2474F1" }} />

                                        </Marker>
                                        <MapViewDirections
          apikey={api_directions_key}
          origin={{
            latitude: context.location ? context.location.location ? Number(context.location.location.latitude) : 0 : 0,
            longitude: context.location ? context.location.location ? Number(context.location.location.longitude) : 0 : 0
                    }}
          destination={{
            latitude: targetLocation  ? Number(targetLocation.location.lat) : 0 ,
            longitude:targetLocation  ?  Number(targetLocation.location.lng) : 0 
            }}
          strokeWidth={3}

          strokeColor={"#2474F1" }

      />
                                    </MapView>

                                </View>
                                <View style={{ width: "100%", height: "20%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity style={{ width: "50%", height: 50, }} onPress={() => { setPathmodal(!pathmodal) }}>

                                        <View style={{ width: "100%", height: 50, backgroundColor: "#2474F1", borderRadius: 24, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ color: "white", fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.05 }}>close</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>
                    </Modal>
                    <Modal

transparent={true}
animationType={'slide'}
visible={modalListPartners}

>
<View style={{ backgroundColor: "#000000aa", flex: 1 }}>
  <View style={{ width: Dimensions.get("screen").width, height: 200, alignSelf: "center", backgroundColor: "white" }}>
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
                <View style={profile === item ? { width: 30, height: 30, borderRadius: 30, borderColor: "#2474F1", borderWidth: 8, alignSelf: "center" } : { width: 30, height: 30, borderRadius: 30, borderColor: "#dbdbdb", borderWidth: 1, alignSelf: "center" }}></View>
              </View>

            </View>
          </TouchableOpacity>

        )
        }
        keyExtractor={item => item._id}
      >
      </FlatList>
      <View style={{ width: "100%", height: "5%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <ScrollView  onScroll={() => { setModalListPartners(!modalListPartners) }}>
          <View style={{ width: 50, height: 3, backgroundColor: "black", borderRadius: 5 }}></View>
        </ScrollView>
      </View>
    </View>

  </View>
</View>

</Modal>

        </SafeAreaView>
    );
}





const styles = StyleSheet.create({
    actions: {
        width: "24%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },

    deliveryTitle: {
        width: "100%",
        height: "20%",
        flexDirection: "row",
        justifyContent: "flex-start",
    },

    deliveryInfo: {
        width: "76%",
        height: "100%",
        flexDirection: "column",
    },
    info: {
        fontFamily:'Poppins',fontSize: 12,
        fontWeight: "600"
    },
    infoDark: {
        fontFamily:'Poppins',fontSize: 12,
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
        height: 150,
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
        height: 150,
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
        alignItems: "center"

    },

    containerDark: {
        backgroundColor: "#121212",
        width: "100%",
        height: "100%",
        flexDirection: "column",
    },
    menu: {
        marginTop: 10,
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
        marginBottom: 8
    },
    menuDark: {
        marginTop: 10,
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
        marginLeft: 8
    },


    titleContainer: {
        width: "75%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    Title: {
        fontWeight: "400",
        color: "#cccccc",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.05,
    },
    TitleDark: {
        fontWeight: "400",
        color: "#fff",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,

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

const darkStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ]
  
  