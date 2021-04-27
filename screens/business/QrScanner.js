import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Button, Alert, TouchableOpacity, SafeAreaView, TextInput, Image } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import AuthContext from '../../navigation/AuthContext';
import { Modal } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

import { 
     markOrderAsDuringCollectDelivery,
      markOrderAsDuringClientDelivery,
     markOrderArrivedInDeposit,
     getNotArrivedOrders,
     getTobeDeliveredOrders,
     getTobepickedUpOrders
    } 
    from '../../rest/ordersApi'

export default function qrScanner(props) {

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const context = useContext(AuthContext)
    const [scanned, setScanned] = useState(false);
    const [count, setCount] = useState(0);
    const [notCompeleted, setNotCompleted] = useState(false);
    const [disabled,setDisabled]= useState(false);
    const [tobepickeduporders, setTobepickeduporders] = useState([]);
    const [tobedeliveredorders, setTobedeliveredorders] = useState([]);
    const [notArrivedOrders, setNotArrivedOrders] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [modalListPartners, setModalListPartners] = useState(false)
    const [profile, setProfile] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [profileChecked, setProfileChecked] = useState(false);



    useEffect(() => {
        _requestCameraPermission();
            setDisabled(false)
            getNotArrivedOrders(context.user._id,context.partner._id).then(_notArrivedOrders=>{
                if(_notArrivedOrders.length>0){
                    setCompleted(false);
                }
                setNotArrivedOrders(_notArrivedOrders)
            
            }).catch();


            getTobeDeliveredOrders(context.user._id,context.partner._id).then(todayTobedeliveredupOrders=>{
                if(todayTobedeliveredupOrders.length>0){
                    setCompleted(false);
                }
                setTobedeliveredorders(todayTobedeliveredupOrders)
            }).catch();


            getTobepickedUpOrders(context.user._id,context.partner._id).then(todayTobepickedupOrders=>{
                            
                setTobepickeduporders(todayTobepickedupOrders)
            }).catch();


           



    }, [props.route.params]);

    const checkAccount = (item) => {
        setProfile(item);
        if (!item.firstName) {
          context.setPartner(item);
            
            if(item.delivery.cities.length>0 || item.delivery.regions.length>0){
                if(item.owner ==context.user._id){
                    props.navigation.navigate('deliveryDash');
                }
    
                if (item.managers.length > 0 && item.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
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
    

    const checkifCompleted = () => {


        if ( !props.route.params.last_screen) {
                if(tobedeliveredorders.length > 0 )
                {
                    setNotCompleted(!notCompeleted)
                }
                else {
                    setCompleted(!completed);
                    setDisabled(!disabled);

                }
        }
    
    
        if(props.route.params.last_screen == "debou_items"){
                if (notArrivedOrders.length > 0 ) {
                setNotCompleted(!notCompeleted)
                
            }
            else {
                setCompleted(!completed)
                setDisabled(!disabled);

            }
        }

        if(props.route.params.last_screen=="collecting"){
            if(tobepickeduporders.length>0){
                setNotCompleted(!notCompeleted)
            }
            else {
                setCompleted(!completed)
                setDisabled(!disabled);

            }
        }





    }
    const checkDelivering = () => {
        if (tobepickeduporders.length == 0) {
            props.navigation.navigate('delivering', { last_screen: "qr scanner to delivering" })
        }
    }

    const checkBasket = () => {
        props.navigation.navigate('basket');
    }

    const checkCollecting = () => {
        props.navigation.navigate('collecting', { last_screen: "qr scanner to collecting" })
    }

    const openDrawer = () => {
        props.navigation.openDrawer();
    }

    const _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        setHasCameraPermission("granted");
    };

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
    


    const checkDebou =()=>{
        props.navigation.navigate('debou')
    }
    const _handleBarcodeScanned = (result) => {
        setScanned(true);
        setCount(count + 1);
        Alert.alert(`Scanned! code :${result.data}`, 'press OK to continue scanning', [{
            text: 'OK', onPress: () => {
                setScanned(false);


                if (props.route.params.last_screen && props.route.params.last_screen == "debou_items") {
                        if (notArrivedOrders.length > 0) {
                            if (notArrivedOrders.findIndex(order => { return order._id == result.data }) >= 0) {
                                markOrderArrivedInDeposit(context.partner._id, result.data).then(message => {
                                    setNotArrivedOrders(notArrivedOrders.filter(order => order._id != result.data));
                                })
                            }
                        }

                        else {
                            setCompleted(!completed)

                        }
                     }


                
                if (props.route.params.last_screen && props.route.params.last_screen == "collecting" && props.route.params.order_id) {
                    if (result.data == props.route.params.order_id) {
                        markOrderAsDuringCollectDelivery(
                            context.partner._id, result.data,
                            tobepickeduporders[tobepickeduporders.findIndex(order => { return order._id == props.route.params.order_id })].client.location,
                            context.location.location
                        ).then(message => {
                            setTobepickeduporders(tobepickeduporders.filter(order => order._id != props.route.params.order_id));
                        })
                    }
                }

                if (!props.route.params.last_screen) {
                    if (tobedeliveredorders.length > 0 && tobedeliveredorders.findIndex(order => { return order._id == result.data }) >= 0) {

                        markOrderAsDuringClientDelivery(context.partner._id, result.data,context.location.location, 
                            tobedeliveredorders[tobedeliveredorders.findIndex(order => { return order._id == props.route.params.order_id })].client.location).then(message => {
                            setTobedeliveredorders(tobedeliveredorders.filter(order => order._id != result.data));
                        })
                    }}}}]);};


    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>

                {hasCameraPermission == null
                    ? <Text>Requesting for camera permission</Text>
                    : hasCameraPermission === false
                        ? <Text>
                            Camera permission is not granted
                              </Text>
                        : <BarCodeScanner
                            onBarCodeScanned={scanned ? undefined : _handleBarcodeScanned}
                            style={{
                                height: Dimensions.get('screen').height,
                                width: Dimensions.get('screen').width,
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"

                            }}
                        >

<View style={
      
        {
        position: "absolute",
        alignSelf:"center",
        width: "84%",
        height: Dimensions.get("screen").height * 0.045,
        backgroundColor: "#f7f7f7",
        top:"10%",
        flexDirection: "row",
        borderRadius: 12
      }}>
        <View style={{
          width: "10%",
          height: "100%",
          borderRadius: 12,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Image style={{ width: Dimensions.get("screen").height * 0.022 , height:Dimensions.get("screen").height * 0.022 , resizeMode: "contain" }} source={require("../../assets/searchHome.png")} />
        </View>
        <View style={{
          width: "55%",
          height: "100%",
          borderRadius: 12
        }}>
          <TextInput
            style={context.darkMode ? { width: "100%",color:"white", height: Dimensions.get("screen").height * 0.045 }:{ width: "100%",color:"black", height: Dimensions.get("screen").height * 0.045 }}
            placeholderTextColor={"#B5B5B5"}
            placeholder={"Search"}
          />
        </View>
        <View style={{
          width: "35%",
          height: "100%",
          borderRadius: 12,
          flexDirection: "row",
          justifyContent:"center"
        }}>

          <View style={{ width: "30%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
            <TouchableOpacity style={{ width: "80%", height: "80%" }} onPress={checkBasket}>
              <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={context.darkMode ? require("../../assets/homeBagDark.png") : require("../../assets/homeBag.png")} />
            </TouchableOpacity>
            <View style={{ width: Dimensions.get("screen").width * 0.035, height: Dimensions.get("screen").width * 0.035, backgroundColor: "red", borderRadius: 12, flexDirection: "column", justifyContent: "center", alignItems: "center", position: "absolute", top: "55%", right: "14%" }}>
              <Text style={{ fontFamily: 'Poppins', fontSize: 10, color: "white" }}>{context.bag }</Text>
            </View>

          </View>

          <View style={{ width: "30%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
            <TouchableOpacity style={{ width: "80%", height: "80%" }} onPress={() => { checkProfile() }}>
              <Image style={{ width: Dimensions.get("screen").height * 0.035, height: Dimensions.get("screen").height * 0.035, borderRadius: Dimensions.get("screen").height * 0.35, resizeMode: "cover" }} source={context.user.photo ? { uri: context.user.photo } :require('../../assets/user_image.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>


                            <View style={!completed ? {
                                width: "60%", height: 60, borderRadius: 12, opacity: 0.8, backgroundColor: "#3E3E3E",
                                position: "absolute", top: "65%"
                            } : {
                                width: "60%", height: 60, borderRadius: 12, opacity: 0.8, backgroundColor: "#73e340",
                                position: "absolute", top: "65%"
                            }}>
                                <TouchableOpacity disabled={disabled} onPress={() => { checkifCompleted() }} style={{ width: "100%", height: "100%", borderRadius: 20, justifyContent: 'center', alignItems: "center", flexDirection: "column" }}>
                                    <Text style={{ fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.06, color: "white" }}>
                                        Scan done
                                    </Text>
                                </TouchableOpacity>
                            </View>
{
props.route.params.last_screen=="debou_items" ?

<View style={{ width: "80%", height: 80, flexDirection: "column",justifyContent:"center",alignItems:"center", borderRadius: 16, position: "absolute", bottom: 40, backgroundColor: "#3E3E3E" }}>

<View style={{ width: "50%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <TouchableOpacity style={{ width: "50%", height: "50%" }} onPress={() => { checkDebou() }}>
        <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../../assets/warehouse.png")} />
    </TouchableOpacity>
    <Text style={{ color: "#7a7a7a" }}>Debou items</Text>
</View>
</View>
:
<View style={{ width: "80%", height: 80, flexDirection: "row", borderRadius: 16, position: "absolute", bottom: 40, backgroundColor: "#3E3E3E" }}>
<View style={{ width: "50%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <TouchableOpacity style={{ width: "50%", height: "50%" }} onPress={() => { checkDelivering() }}>
        <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../../assets/delivery_guy.png")} />
    </TouchableOpacity>
    <Text style={{ color: "#7a7a7a" }}>Delivering</Text>
</View>
<View style={{ width: "50%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <TouchableOpacity style={{ width: "50%", height: "50%" }} onPress={() => { checkCollecting() }}>
        <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../../assets/delivery_truck.png")} />
    </TouchableOpacity>
    <Text style={{ color: "#7a7a7a" }}>Collecting</Text>
</View>
</View>
}

                            <View style={{ width: 200, height: 200, flexDirection: "column", justifyContent: 'space-between' }}>
                                <View style={{ width: "100%", height: "50%", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Image style={{ width: 50, height: 50 }} source={require("../../assets/corner1.png")} />
                                    <Image style={{ width: 50, height: 50, }} source={require("../../assets/corner3.png")} />
                                </View>
                                <View style={{ width: "100%", height: "50%", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Image style={{ width: 50, height: 50 }} source={require("../../assets/corner4.png")} />
                                    <Image style={{ width: 50, height: 50, }} source={require("../../assets/corner2.png")} />
                                </View>
                            </View>
                        </BarCodeScanner>}

            </View>
            <Modal transparent={true}
                animationType={'slide'}
                visible={notCompeleted}
            >
                <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
                    <View style={{ width: Dimensions.get("screen").width * 0.9, height: 260, marginTop: Dimensions.get("screen").height * 0.2, borderRadius: 12, alignSelf: "center", backgroundColor: "white" }}>
                        <View style={{ width: "100%", height: "100%" }}>
                            <View style={{ width: "100%", height: "80%", flexDirection: "column", alignItems: "center", }}>
                                <Text style={{ color: "red", fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.06, margin: 10 }}>{"Not Completed"}</Text>
                                <View style={{ width: Dimensions.get("screen").width * 0.25, borderRadius: Dimensions.get("screen").width * 0.25, height: Dimensions.get("screen").width * 0.25, flexDirection: "column", backgroundColor: "#EBEBEB", alignItems: "center", justifyContent: "center" }}>
                                    <Image style={{ width: "60%", height: "60%", resizeMode: "cover" }} source={require("../../assets/images/order_warning.png")} />
                                </View>
                                <Text style={{ color: "black", fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.05, margin: 10, textAlign: "center" }}>{"Are you sure,you want to confirm delivering order ?"}</Text>
                                <Text style={{ color: "grey", fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.04, textAlign: "center", margin: 10 }}>{"Please make sure you scanned all orders !"}</Text>
                            </View>
                            <View style={{ width: "100%", height: "20%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity style={{ width: "45%", height: "75%" }} onPress={() => { setNotCompleted(!notCompeleted) }}>
                                    <View style={{ width: "100%", height: "100%", borderRadius: 12, flexDirection: "column", backgroundColor: "#2474F1", justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ color: "white", fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.06, margin: 10 }}>Scan</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View></View></Modal>


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
        </View>
    );
}

const styles = StyleSheet.create({



    container: {
        flex: 1,
        flexDirection: "column",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        backgroundColor: "#F2F6FF",
    },

    containerDark: {
        flex: 1,
        flexDirection: "column",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        backgroundColor: "#121212",

    },
    mapContainer: {
        width: "100%",
        height: "92%",
        flexDirection: "column",

    },

    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",
        marginTop: 10

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
        marginTop: 10
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
        fontFamily: 'Poppins', fontSize: Dimensions.get("window").width * 0.08
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
        fontFamily: 'Poppins', fontSize: Dimensions.get("window").width * 0.08,
        color: "white"

    },


})
