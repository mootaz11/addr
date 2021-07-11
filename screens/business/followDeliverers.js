import React, { useContext, useState,useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image,FlatList,TouchableOpacity,SafeAreaView,Modal,TextInput,TouchableWithoutFeedback,Animated } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import {getDeliverers} from '../../rest/partnerApi';
import AuthContext from '../../navigation/AuthContext';
import MapViewDirections from 'react-native-maps-directions';
import {ScrollView} from 'react-native-gesture-handler';

const api_directions_key = "AIzaSyDcbXzRxlL0q_tM54tnAWHMlGdmPByFAfE";





export default function followDeliverers(props) {
    const context = useContext(AuthContext)
    const [deliverers,setDeliverers]=useState([]);
    const [target,setTarget]=useState(null);
    const [modalListPartners, setModalListPartners] = useState(false)
    const [profiles, setProfiles] = useState([]);
    const [profileChecked, setProfileChecked] = useState(false);
    const [positionModal,setPositionModal]=useState(new Animated.ValueXY({x:0,y:0}))



    useEffect(() => {
        if(context.partner){
            getDeliverers(context.partner._id).then(_deliverers=>{
            setDeliverers(_deliverers) 
             }).catch(err=>{console.log(err)})
        }
       

        return () => {
            
        }
    }, [context.partner])
    const checkAccount = (item) => {
        context.setProfile(item);
        if (!item.firstName) {
          context.setPartner(item);
            
            if(item.delivery.cities.length>0 || item.delivery.regions.length>0||item.delivery.localRegions.length>0){
                if(item.owner ==context.user._id){
                    props.navigation.navigate('deliveryDash');
                }
    
                if (item.managers.length > 0 && item.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
                &&item.managers[item.managers.findIndex(manager => { return manager.user == context.user._id })].access.deliveryAccess.deposit) {
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
    




    const openDrawer = () => {
        props.navigation.openDrawer();
    }
    const checkoutTarget =(evt,deliverer)=>{
        setTarget(deliverer.path.targetPosition);
    }

    const modalDown =()=>{
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
    



    
                                      





    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={context.darkMode ? styles.containerDark : styles.container}>
            <View style={context.darkMode ?  styles.menuDark: styles.menu}>
            <View style={styles.leftArrowContainer} >
                     <TouchableOpacity onPress={openDrawer} style={{height:Dimensions.get("screen").width*0.04,width:Dimensions.get("screen").width*0.04}}>
                        <Image source={context.darkMode ?  require("../../assets/menu_dark.png"):require("../../assets/menu.png")} style={{height:"100%",width:"100%",resizeMode:"cover"}}/>

                        </TouchableOpacity>
                     </View>
                <View style={styles.titleContainer}>
                    <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Follow Deliverers</Text>

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

                <View style={styles.mapContainer}>
              
                    <MapView
                        initialRegion={{
                            latitude: 35.7643,
                            longitude: 10.8113,
                            latitudeDelta:  0.05,
                            longitudeDelta: 0.05 ,

                        }}

                        style={{ flex: 1 }}
                        customMapStyle={darkStyle}
                        provider="google"
                    >

                      




                        {
                            deliverers && deliverers.length>0&&deliverers.map((deliverer, index) =>
                                <React.Fragment>
  <Marker
                            coordinate={{
                                latitude: context.partner ?context.partner.localisation? context.partner.localisation.lat:Number(0):Number(0),
                                longitude:context.partner ?context.partner.localisation? context.partner.localisation.lng:Number(0):Number(0)
                            }}

                        >
                            <Image source={context.partner ? context.partner.profileImage ?{uri:context.partner.profileImage}:require("../../assets/user_image.png") :require("../../assets/user_image.png")} style={{ height: 40, width: 40, borderRadius: 30, borderColor: "white", borderWidth: 2 }} />

                        </Marker>

<Marker

key={index}
coordinate={{
    latitude:deliverer ? deliverer.path?deliverer.path.currentPosition.lat:Number(0):Number(0),
    longitude: deliverer ?deliverer.path? deliverer.path.currentPosition.lng:Number(0):Number(0)
}}
onPress={(evt) => { checkoutTarget(evt,deliverer) }}


>
<Image source={deliverer&&deliverer.user&&deliverer.user.photo ? {uri:deliverer.user.photo}:require("../../assets/user_image.png")} style={{ height: 40, width: 40, borderRadius: 30, borderColor: "white", borderWidth: 2 }} />

</Marker>



{target&&deliverer&&deliverer.path&&(target.lat==deliverer.path.targetPosition.lat&&target.lng==deliverer.path.targetPosition.lng)&&<MapViewDirections
          apikey={api_directions_key}
          origin={{
            latitude: deliverer.path.currentPosition.lat,
            longitude: deliverer.path.currentPosition.lng
                            }}
          destination={{
            latitude:target.lat,
            longitude: target.lng
                    }}
          strokeWidth={3}

          strokeColor={"#2474F1" }

      />
}
                                    {context.partner.localisation && target&& (target.lng!=context.partner.localisation.lng&&target.lat!=context.partner.localisation.lat)&&
                        <Marker


coordinate={{
    latitude:target.lat,
    longitude: target.lng
}}


>
<Image source={require("../../assets/target.png")} style={{ height: 40, width: 40, borderRadius: 30, borderColor: "white", borderWidth: 2 }} />

</Marker>



}




                                </React.Fragment>
                        




                        
                            )   
                        }


                    </MapView>
                    <View style={styles.distance}>
                        <Text style={{ color: "white" }}>Distance:500KM</Text>
                    </View>
                    <View style={styles.circuit}>
                        <Text style={{ color: "white", textAlignVertical: "center", fontFamily:'Poppins',fontSize: 18 }}>Circuit </Text>
                    </View>
                    <View style={styles.addLocation}>
                        <View style={{ width: 30, height: 30, borderRadius: 30, backgroundColor: '#2474f1' }}></View>

                        <Text style={{ color: "white", textAlignVertical: "center", marginLeft: 5, fontFamily:'Poppins',fontSize: 16 }}>client location</Text>
                    </View>
                    <View style={styles.getPosition}>
                        <View style={{ width: 30, height: 30, borderRadius: 30, backgroundColor: 'red' }}></View>
                        <Text style={{ color: "white", textAlignVertical: "center", marginLeft: 5, fontFamily:'Poppins',fontSize: 16 }}>Partner location</Text>
                    </View>
                </View>

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
      <View style={{ width: "100%", height: "10%", flexDirection: "column",alignItems: "center", justifyContent: "center" }}>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    distance: {
        width: "40%",
        height: 40,
        position: "absolute",
        marginLeft: 10,
        right: "2%",
        top: "70%",
        flexDirection: "row",
        alignItems: "center"
    },
    circuit: {
        width: "50%",
        height: 40,
        position: "absolute",
        marginLeft: 10,
        top: "60%",
        flexDirection: "row",
        alignItems: "center"

    },
    addLocation: {
        width: "40%",
        height: 40,
        position: "absolute",
        marginLeft: 10,
        top: "70%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"

    },
    getPosition: {
        width: "40%",
        height: 40,
        position: "absolute",
        marginLeft: 10,
        top: "80%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"

    },

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
        flexDirection: "column"

    },
    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
        marginTop: 10
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
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07
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
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
        color: "white"

    },



})
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
];

