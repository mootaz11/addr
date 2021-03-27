import React, { useState, useContext, useEffect } from 'react'
import { Picker } from '@react-native-community/picker';
import { StyleSheet, Dimensions, View, Image, Platform, Text, Modal, Alert, Animated, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import _ from 'lodash';

import AuthContext from '../navigation/AuthContext';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapViewDirections from 'react-native-maps-directions';
import { getCities, getService } from '../rest/geoLocationApi'
import { getPartner } from '../rest/partnerApi';
import { getDelivererOrders } from '../rest/ordersApi'
import { Easing } from 'react-native-reanimated';
import {getDomains} from '../rest/geoLocationApi';

const api_directions_key = "AIzaSyDcbXzRxlL0q_tM54tnAWHMlGdmPByFAfE";


const _partners = [
  {
    partnerName: "lacost",
    id: 1,
    partnerImage: require("../assets/lacoste.png"),
    products: [
      {
        _id: 6,

        mainImage: require("../assets/lacoste.png"),
        name: "aaa",
        basePrice: 555
      },
      {
        _id: 5,

        mainImage: require("../assets/lacoste.png"),
        name: "aaa",
        basePrice: 555
      },
      {
        _id: 9,

        mainImage: require("../assets/lacoste.png"),
        name: "aaa",
        basePrice: 555
      },
      {
        _id: 8,

        mainImage: require("../assets/lacoste.png"),
        name: "aaa",
        basePrice: 555
      }
    ]
  },
  {
    id: 2,
    partnerName: "lacost",
    partnerImage: require("../assets/lacoste.png"),
    products: [
      {
        _id: 10,
        mainImage: require("../assets/lacoste.png"),
        name: "aaa",
        basePrice: 555
      },
      {
        _id: 12,

        mainImage: require("../assets/lacoste.png"),
        name: "aaa",
        basePrice: 555
      },
      {
        _id: 15,

        mainImage: require("../assets/lacoste.png"),
        name: "aaa",
        basePrice: 555
      },
      {
        _id: 17,

        mainImage: require("../assets/lacoste.png"),
        name: "aaa",
        basePrice: 555
      }
    ]
  }
]

export default function Home(props) {
  const context = useContext(AuthContext);
  const [dropDown, setdropDown] = useState(false);
  const [seviceChosen, setServiceChosen] = useState(false);
  

  const [domain, setDomain] = useState("");
  const [service,setService]=useState("");

  const [showModal, setShowmodal] = useState(false);
  const [domains,setDomains]=useState([]);
  const [services, setServices] = useState([]);
  const [partners, setPartners] = useState(null);
  const [profile,setProfile]=useState(null);
  const [cities, setCities] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [profileChecked, setProfileChecked] = useState(false);
  const [alignement] = useState(new Animated.Value(0));
  const [modalListPartners, setModalListPartners] = useState(false)
  const [selectedCity, setSelectedCity] = useState();
  const [selectedRegion, setSelectedRegion] = useState();
  const [showPicker, setShowPicker] = useState(false)
  const [cityPicker, setCityPicker] = useState(false);
  const [regionPicker, setRegionPicker] = useState(false);

  const calcCrow = (lat1, lon1, lat2, lon2) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344
      console.log(dist / 1000)
      return dist / 1000;
    }
  }



  const getLocation = () => {
    if (context.user.isVendor && context.partner) {
      if (deliveries.length > 0) {
        deliveries.map(async order => {
          if (order.actif == true && order.taked == true && order.prepared == true) {
            let gpsServiceStatus = await Location.hasServicesEnabledAsync();
            if (gpsServiceStatus) {
              let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
              context.sendLocalisation(order.client._id, context.partner, order, location);
            }
            else {
              alert("Enable Location service");
            }
          }
        })
      }
    }


  }

  getLocation();

  const checkCitiesList = () => {
    getCities().then(cities => {
    
      setCities(cities)
      setShowmodal(!showModal);

    }).catch(err => { alert("getting cities error") })
  }


  useEffect(() => {
  
    if (context.user.isVendor && context.partner) {
      getDelivererOrders(context.partner._id).then(orders => {
        setDeliveries(orders);
      }).catch(err => {
        alert("getting deliveries error")
      })
    }

    getDomains().then(_domains=>{
      setDomains(_domains);
      if(_domains.length>0&&_domains[0].services){
        setDomain(_domains[0].name.fr);
        setServices(_domains[0].services);
        if(_domains[0].services.length>0){
          handleServicePartners(_domains[0].services[0]);
          setService(_domains[0].services[0].serviceName.fr);
        
        }
      }

    })

    setPartners(null);
    setServiceChosen(false)
    return () => { setCities([]); setServices([]); setPartners([]); setDomain(null) }
  
  
  }, [props.route.params])





  useEffect(() => {
    if (!context.user.locationState) {
      Alert.alert(
        "Are you at Home",
        "press yes if you are",
        [
          {
            text: "yes",
            onPress: async () => {
              let { status } = await Permissions.askAsync(Permissions.LOCATION);
              if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
              }
              else {
                const _location = await Location.getCurrentPositionAsync({});
                const location = {
                  latitude: _location.coords.latitude,
                  longitude: _location.coords.longitude
                }
                context.updateUserLocation(location, true);
              }
            },
            style: "ok"
          },
          {
            text: "no", onPress: async () => {

              let { status } = await Permissions.askAsync(Permissions.LOCATION);

              if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
              }

              else {
                const _location = await Location.getCurrentPositionAsync({});

                const location = {
                  latitude: _location.coords.latitude,
                  longitude: _location.coords.longitude
                }

                context.updateUserLocation(location, false);
              }

            }

          }
        ],
        { cancelable: false }
      );

    }
  }, [context.user])



  
  const slideUp = ({ nativeEvent }) => {
    if (nativeEvent.contentOffset.y > 0) {
      console.log(nativeEvent.contentOffset.y)
      bringUpActionSheet();
    }
    else {

    }

  }



  // const filtreList = (text) => {
  //   setSearch(text)
  //   const query = text.toLowerCase();
  //   const citiesResult = _.filter(cities, city => {
  //     return _.includes(city.cityName.toLowerCase(), query)
  //   })
  //   setSearchResult(citiesResult)
  // }

  const bringUpActionSheet = () => {
    Animated.timing(alignement, {
      toValue: 500,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }









  const checkAccount = (item) => {
    setModalListPartners(!modalListPartners)
    setProfile(item);

    if (!item.firstName) {
      context.setPartner(item);

      if (item.deliverers.findIndex(del => { return del === context.user._id }) >= 0) {
        props.navigation.navigate("deliveryDash")
      }
      else {
        props.navigation.navigate("businessDash")

      }
    }
    else {
      props.navigation.navigate("Settings")
    }
  }




  const checkProfile = () => {
    let _profiles = [];

    if (context.user.isVendor) {
      _profiles = context.user.workPlaces;


    }
    if (context.user.isPartner) {
      _profiles = context.user.partners;
    }
    if (_profiles.findIndex(p => { return p._id == context.user._id }) == -1) {
      _profiles.push(context.user);

    }
    setProfiles(_profiles);

    // setProfiles([context.user,...profiles]);
    setProfileChecked(!profileChecked);
    setModalListPartners(!modalListPartners)
  }

  const checkDomain =(_domain)=>{
    setDomain(_domain.name.fr);
    setServices(_domain.services);
    setService("");
    setPartners(null);
  }

  const handleServicePartners = (service) => {
     
      var partners_ids = []
      var _partners = [];

      service.partnersRegions.map(partnerRegion => {
        partnerRegion.partners.map(_partner => {
          if (partners_ids.indexOf(_partner) >= 0) { }
          else { partners_ids.push(_partner) }
        })
      })


      if(partners_ids.length>0){
      partners_ids.map(_id => {
        getPartner(_id).then(partnerData => {
          let index = _partners.findIndex(partner => { return partner._id == partnerData._id })
          if(index==-1){
            _partners.push(partnerData);
          }
          setPartners(_partners);
        }
        ).catch(err => console.log(err))
      })}
      else {
        setPartners(null);
      }

setService(service.serviceName.fr);



  }

  const checkRegion=(item)=>{
    setSelectedRegion(selectedRegion);
    setShowmodal(!showModal);
    setShowPicker(!showPicker);
    setRegionPicker(!regionPicker);
    var _services = [];

    const index = regions.findIndex(region=>{return region._id==item});
    
    if(index>=0){
       _services = [...regions[index].services];      
       var _domains = [...domains];   
      _domains.map(_domain=>{
          if(_domain.services.findIndex(_service=>{_service._id==item})==-1){
            setDomains(domains.filter(domain=>domain._id!=_domain._id))
            if(domains.length>0){
              setServices(domains[0].services);
              setPartners(null);
            }
          }
      })

    }
  }
  const checkCity=(item)=>{
    const index = cities.findIndex(city=>{return city._id ==item});
    if(index>=0){
      console.log(cities[index]);
      setRegions(cities[index].regions);
    }
   setSelectedCity(item);
   setShowPicker(!showPicker); 
   setCityPicker(!cityPicker)
  }



  const startPartnerConversation = (partner) => {
    let users_id = []
    partner.managers.forEach(manager => {
      users_id.push(manager.user);
    })
    users_id.push(context.user._id);
    users_id.push(partner.owner._id);
    const conversation = context.openConversationHandler({}, { users_id }, "group", partner);
    props.navigation.navigate("conversation", { conversation, home: true })
  }




  const checkBasket = () => {
    props.navigation.navigate("basket", { last_screen: "Home" });

  }
 
  
  const openDrawer = () => {
    props.navigation.openDrawer();
  }
  
  

  
  const handleItemCheck = (item) => {
    if (!regions) {
      setRegions(item.regions);
      setPartners(null);
      setServices(null);
    }
    else {
      setRegions(null);
      setShowmodal(false);

      let _services = [];
      item.services.forEach(service_id => {
        getService(service_id).then(_service => {
          console.log(_service);
          if (_services.findIndex(s => { return s._id == _service._id }) == -1) {
            _services.push(_service);
          }
          setInitServices(false);
          setServices(_services);
        }).catch(err => { console.log(err) })
      })
    }
  }
  const checkPartner = (value) => {
    props.navigation.navigate("singleBrand", { partner: value, lastScreen: "Home" })
  }




  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: context.location ? context.location.location ? Number(context.location.location.latitude) : 0 : 0,
          longitude: context.location ? context.location.location ? Number(context.location.location.longitude) : 0 : 0
          , latitudeDelta: 0.5,
          longitudeDelta: 0.5
        }}

        style={styles.container}
        customMapStyle={context.darkMode ? darkStyle : defaultStyle}
        provider="google"

      >
        {
          context.deliveryData ? context.location ? context.location.location
            ? calcCrow(context.deliveryData.position.latitude,
              context.deliveryData.position.longitude, context.location.location.latitude, context.location.location.latitude) <= 3 ?
              <Marker
                coordinate={
                  Platform.OS == 'ios' ?
                    {
                      latitude: context.location ? context.location.location ? Number(context.location.location.latitude) : 0 : 0,
                      longitude: context.location ? context.location.location ? Number(context.location.location.longitude) : 0 : 0

                    } :
                    {
                      latitude: context.location ? context.location.location ? Number(context.location.location.latitude) : 0 : 0,
                      longitude: context.location ? context.location.location ? Number(context.location.location.longitude) : 0 : 0

                    }
                }
              >

                <Image source={context.user.photo ? { uri: context.user.photo } : require('../assets/user_image.png')} style={context.darkMode ? { height: 30, width: 30, borderRadius: 30, borderColor: "white", borderWidth: 2 } : { height: 30, width: 30, borderRadius: 30, borderColor: "#2474F1", borderWidth: 2 }} />




              </Marker>
              : null : null : null : <Marker
                coordinate={
                  Platform.OS == 'ios' ?
                    {
                      latitude: context.location ? context.location.location ? Number(context.location.location.latitude) : 0 : 0,
                      longitude: context.location ? context.location.location ? Number(context.location.location.longitude) : 0 : 0

                    } :
                    {
                      latitude: context.location ? context.location.location ? Number(context.location.location.latitude) : 0 : 0,
                      longitude: context.location ? context.location.location ? Number(context.location.location.longitude) : 0 : 0

                    }
                }
              >
            <Image source={require('../assets/appLogo.png')} style={{ height: 40, width: 40}} />

          </Marker>
        }

        {
          context.deliveryData ? context.location ? context.location.location

            ? calcCrow(context.deliveryData.position.latitude,
              context.deliveryData.position.longitude, context.location.location.latitude, context.location.location.latitude) <= 3 ?

              <Marker
                coordinate={{
                  latitude: Number(context.deliveryData.position.latitude),
                  longitude: Number(context.deliveryData.position.longitude)

                }}

              >
                <Image source={require('../assets/user_image.png')} style={context.darkMode ? { height: 30, width: 30, borderRadius: 30, borderColor: "white", borderWidth: 2 } : { height: 30, width: 30, borderRadius: 30, borderColor: "#2474F1", borderWidth: 2 }} />
              </Marker>
              : null : null : null : null
        }


        {
          context.deliveryData ? context.location ? context.location.location
            ? calcCrow(context.deliveryData.position.latitude,
              context.deliveryData.position.longitude, context.location.location.latitude, context.location.location.latitude) <= 3 ?

              <MapViewDirections
                apikey={api_directions_key}
                origin={context.location ? context.location.location ? context.location.location : context.location.temperarlyLocation : null}
                destination={{
                  latitude: context.deliveryData.position.latitude,
                  longitude: context.deliveryData.position.longitude
                }}
                strokeWidth={3}
                strokeColor={context.darkMode ? "#2474F1" : "#3d3d3d"}
              />
              : null : null : null : null
        }
      </MapView>

      <View style={styles.Mycode}>
        <View style={styles.dropDownContainer}>
          <Image style={styles.dropDown} source={require("../assets/logo_white.png")} />
        </View>
        <View style={{ width: "80%", height: "90%", flexDirection: "column", alignSelf: "flex-end" }}>
          <Text style={styles.smartCode}>Smart Code</Text>
          <Text style={{
            fontSize: Dimensions.get("window").width * 0.07,
            color: "white",
            fontWeight: "700"
          }}>{context.user.location.locationCode}</Text>
        </View>
      </View>
      <View style={styles.searchCity}>
        <TouchableOpacity style={{ width: "80%", height: "80%", flexDirection: "column", justifyContent: "center", alignItems: "center" }} onPress={() => { checkCitiesList() }}>
          <Image style={{ width: "70%", height: "70%", resizeMode: "contain" }} source={require("../assets/images/searchingDark.png")} />
        </TouchableOpacity>

      </View>

      <View style={styles.menu}>
        <TouchableOpacity onPress={() => { openDrawer() }}>
          <Image source={context.darkMode ? require("../assets/menu_dark.png") : require("../assets/menu.png")} style={{ height: 30, width: 30, resizeMode: "cover" }} />
        </TouchableOpacity>
      </View>




      <View style={
        context.darkMode ?
        {
          position: "absolute",
          left: "14%", width: "84%",
          height: Dimensions.get("screen").height * 0.058,
          backgroundColor: "#292929",
          marginTop: Platform.OS == 'ios' ? 40 : 30,
          flexDirection: "row",
          borderRadius: 12
        }:
        {
        position: "absolute",
        left: "14%", width: "84%",
        height: Dimensions.get("screen").height * 0.058,
        backgroundColor: "#f7f7f7",
        marginTop: Platform.OS == 'ios' ? 40 : 30,
        flexDirection: "row",
        borderRadius: 12
      }}>
        <View style={{
          width: "15%",
          height: "100%",
          borderRadius: 12,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"

        }}>
          <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={require("../assets/searchHome.png")} />
        </View>
        <View style={{
          width: "55%",
          height: "100%",
          borderRadius: 12
        }}>
          <TextInput
            style={context.darkMode ? { width: "100%",color:"white", height: Dimensions.get("screen").height * 0.058 }:{ width: "100%",color:"black", height: Dimensions.get("screen").height * 0.058 }}
            placeholderTextColor={"#B5B5B5"}
            
            placeholder={"Search"}
          />
        </View>
        <View style={{
          width: "30%",
          height: "100%",
          borderRadius: 12,
          flexDirection: "row",
        }}>
          <View style={{ width: "50%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={{ width: "80%", height: "80%" }} onPress={checkBasket}>
              <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={context.darkMode ? require("../assets/homeBagDark.png") : require("../assets/homeBag.png")} />
            </TouchableOpacity>
            <View style={{ width: 10, height: 10, backgroundColor: "red", borderRadius: 10, position: "absolute", top: "76%", right: "16%" }}></View>
          </View>

          <View style={{ width: "50%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={{ width: "80%", height: "80%" }} onPress={() => { checkProfile() }}>
              <Image style={{ width: Dimensions.get("screen").height * 0.05, height: Dimensions.get("screen").height * 0.05, borderRadius: Dimensions.get("screen").height * 0.05, resizeMode: "cover" }} source={context.user.photo ? { uri: context.user.photo } :require('../assets/user_image.png')} />
            </TouchableOpacity>
          </View>


        </View>

      </View>



      {dropDown ?
        <View style={styles.geoInfo}>
          <View style={styles.coordinatesSettings}>
            <Image style={styles.coordSettingsIcon} source={require("../assets/copy-dark.png")} />
            <TouchableOpacity onPress={() => { copyCode() }}>
              <Text style={styles.codeManup}>copier mon code</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.coordinatesSettings}>

            <Image style={styles.coordSettingsIcon} source={require("../assets/share-dark.png")} />
            <TouchableOpacity onPress={(shareCode)}>

              <Text style={styles.codeManup}>partager mon code</Text>
            </TouchableOpacity>

          </View>


        </View>
        : null
      }



      <View style={styles.domainswithPartners}>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={domains}
          renderItem={({ item }) => (
            <View style={styles.domainsContainer}>
              <TouchableOpacity onPress={() => {checkDomain(item)}}>
                <View style={domain == item.name.fr ? context.darkMode ?  styles.serviceChosenDark: styles.serviceChosen : context.darkMode ? styles.serviceDark:styles.service} >
                  <Image style={styles.imageService} source={require("../assets/fast_food.jpg")} />
                  <Text style={context.darkMode ? { color: "white", fontSize: Dimensions.get("screen").width * 0.05 } :
                    { color: "black", fontSize: Dimensions.get("screen").width * 0.05 }}>{item.name.fr}</Text>

                </View>
              </TouchableOpacity>
            </View>

          )}

          keyExtractor={item => item._id}
        >
        </FlatList>

      </View>
      <View style={styles.domainswithServices}>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={services}
          renderItem={({ item }) => (
            <View style={service == item.serviceName.fr ? styles.serviceChosenWithDomain : styles.serviceWithDomain}>
              <TouchableOpacity style={
                context.darkMode ?
               {width:"100%",height:"100%",backgroundColor: "#292929",flexDirection:"column",justifyContent:"center",alignItems:"center"}:
              {width:"100%",height:"100%",    backgroundColor: "#e3e3e3",flexDirection:"column",justifyContent:"center",alignItems:"center"}}
               onPress={() => { 
                handleServicePartners(item)
               }}>
                 
                 
                  <Text style={context.darkMode ? { color: "white", fontSize: Dimensions.get("screen").width * 0.05 } :
                    { color: "black", fontSize: Dimensions.get("screen").width * 0.05 }}>{item.serviceName.fr}</Text>
              </TouchableOpacity>
            </View>
          )}

          keyExtractor={item => item._id}
        >
        </FlatList>
      </View>

      <Modal

        transparent={true}
        animationType={'slide'}
        visible={modalListPartners}

      >
        <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
          <View style={{ width: Dimensions.get("screen").width, height: 200, marginTop: 50, alignSelf: "center", backgroundColor: "white" }}>
            <View style={{ width: "100%", height: "95%" }}>
              <FlatList
                data={profiles}
                renderItem={({ item }) =>
                (
                  <TouchableOpacity onPress={() => { checkAccount(item) }}>
                    <View style={{ flexDirection: "row", width: "100%", height: 60 }}>
                      <View style={{ width: "20%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <Image style={{ width: 50, height: 50, borderRadius: 50,resizeMode:"contain" }} source={item.photo ? { uri: item.photo } : item.image ? { uri: item.imge } : require("../assets/user_image.png")} />
                      </View>
                      <View style={{ width: "60%", height: "100%", flexDirection: "column", 
                      justifyContent: "center" }}>
                      
                        <Text style={{ marginHorizontal:15,fontSize: 15 }}>{item.firstName ? item.firstName + " " + item.lastName : item.partnerName}</Text>
                      </View>
                       <View style={{ width: "20%", height: "100%", flexDirection: "column", justifyContent: "center" }}>
                        <View style={profile===item  ? {width:30,height:30,borderRadius:30,borderColor:"#2474F1",borderWidth:8,alignSelf:"center"}:{width:30,height:30,borderRadius:30,borderColor:"#dbdbdb",borderWidth:1,alignSelf:"center"}}></View>
                      </View>

                    </View>
                  </TouchableOpacity>

                )
                }
                keyExtractor={item => item._id}
              >

              </FlatList>
              <View style={{ width: "100%", height: "5%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

                <ScrollView onScroll={() => { setModalListPartners(!modalListPartners) }}>
                  <View style={{ width: 50, height: 3, backgroundColor: "black", borderRadius: 5 }}></View>


                </ScrollView>
              </View>
            </View>

          </View>
        </View>

      </Modal>

      <Modal

        transparent={true}
        animationType={'fade'}
        visible={showModal}

      >

        <View style={{ backgroundColor: "#000000aa", flex: 1, justifyContent: "center" }}>

          <View style={{ width: Dimensions.get("screen").width * 0.9, flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 12, height: Dimensions.get("screen").height * 0.5, margin: 40, alignSelf: "center", backgroundColor: "#626262" }}>
            <View style={{ width: "86%", height: "86%", backgroundColor: "#626262", flexDirection: "column", justifyContent: "flex-start" }}>
              <Text style={{ fontSize: Dimensions.get("screen").width * 0.08, color: "white", marginBottom: 15 }}>Select your place</Text>


              <View style={{ width: "100%", height: "70%", flexDirection: "column", justifyContent: "space-between" }}>


                {!showPicker &&
                  <View style={{ backgroundColor: "#3E3E3E", width: "100%", height: 60, borderRadius: 12 }}>
                    <TouchableOpacity onPress={() => { setShowPicker(!showPicker); setCityPicker(!cityPicker) }} style={{ flexDirection: "row", width: "100%", height: "100%", justifyContent: 'flex-start' }}>
                      <Image style={{ marginLeft: 8, width: "15%", height: "100%", resizeMode: "contain" }} source={require("../assets/picker_up.png")} />
                      <View style={{ width: "85%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: Dimensions.get("screen").width * 0.06, color: "white", }}>City</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                }
                {!showPicker &&
                  <View style={{ backgroundColor: "#3E3E3E", width: "100%", height: 60, borderRadius: 12 }}>
                    <TouchableOpacity style={{ flexDirection: "row", width: "100%", height: "100%", justifyContent: 'flex-start' }} onPress={() => { if( selectedCity)   {setShowPicker(!showPicker); setRegionPicker(!regionPicker)} else alert("please choose city first") }}>
                      <Image style={{ marginLeft: 8, width: "15%", height: "100%", resizeMode: "contain" }} source={require("../assets/picker_up.png")} />
                      <View style={{ width: "85%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: Dimensions.get("screen").width * 0.06, color: "white", }}>Region</Text>
                      </View>

                    </TouchableOpacity>
                  </View>
                }

              </View>



              {
                showPicker && cityPicker &&
                <View style={{flex: 1 }}>
                  <Picker
                  style={{width:"100%",height:"100%"}}
                    selectedValue={selectedCity} 
                    onValueChange={(itemValue, itemIndex) => { checkCity(itemValue) }}
                    mode="dropdown">
                    {
                      cities && cities.length > 0 &&
                      cities.map((city, index) => {
                        return (
                          <Picker.Item key={index} color={'white'} label={city.cityName} value={city._id} />

                        )
                      })
                    }

                  </Picker>
                </View>
              }

              {showPicker && regionPicker &&

                <View style={{ width: "100%", height: "80%" }}>

                  <Picker
                    selectedValue={selectedRegion}
                    onValueChange={(itemValue, itemIndex) => { checkRegion(itemValue)}}
                    mode="dropdown"
                  >

{

regions && regions.length > 0 &&
regions.map((region, index) => {
  return (
    <Picker.Item key={index} color={'white'} label={region.regionName} value={region._id} />

  )
})
}
                  </Picker>
                </View>

              }


            </View>
          </View>
        </View>
      </Modal>
{partners&&
      <Animated.View style={context.darkMode? {
        width: "100%",
        height: Dimensions.get("screen").height / 1.6,
        backgroundColor: "black",
      position: "absolute",
            top: Dimensions.get("screen").height * 0.84,/*translateY:alignement*/}:{
        width: "100%",
        height: Dimensions.get("screen").height / 1.6,
        backgroundColor: "white",
      position: "absolute",
            top: Dimensions.get("screen").height * 0.84,/*translateY:alignement*/}}>
        <ScrollView style={{ height: "100%", width: "100%" }}
          onScroll={
            (e) => { slideUp(e) }
          }
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <FlatList
            data={partners}
            
            renderItem={({ item }) =>
              <View style={{ width: "100%", height: 220, marginVertical: 5}}>
                <View style={{ width: "100%", height: "30%",  flexDirection: "row"}}>
                  <View style={{ width: "50%", height: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <Image style={{ width: 50, height: 50, borderRadius: 50, marginHorizontal: 10 }} source={{uri:item.profileImage}} />
                    <Text style={context.darkMode ? { fontSize: Dimensions.get("screen").width * 0.05, color: "white" } : { fontSize: Dimensions.get("screen").width * 0.05, color: "black" }}>{item.partnerName}</Text>
                  </View>

                  <View style={{ width: "50%", height: "100%",  flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <TouchableOpacity onPress={() => {
                    checkPartner(item);
                   }}>
                      <Text style={{ fontSize: Dimensions.get("screen").width * 0.05, color: "#2474F1" }}>voir la boutique</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ width: "100%", height: "70%"}}>
                <FlatList
                    data={item.products}
                    horizontal
                    renderItem={
                      ({ item }) =>
                        <View style={context.darkMode ? styles.productDark   : styles.product}>
                          <Image style={styles.productImage} source={item.mainImage ? item.mainImage : require("../assets/imagenotyet.jpg")} />
                          <Text style={ context.darkMode ? styles.productTitleDark:styles.productTitle}>{item.name}</Text>
                          <Text style={context.darkMode ? styles.productTitleDark:styles.productTitle}>{item.name}</Text>

                          <Text style={context.darkMode ? styles.productTitleDark:styles.productTitle}>{item.basePrice} DT</Text>
                        </View>
                    }
                    keyExtractor={item => item._id}
                  >

                  </FlatList>
                </View>

              </View>
            }
            keyExtractor={item => item.id}
          >

          </FlatList>



        </ScrollView>

      </Animated.View>
}

    </View >

  );

}


const styles = StyleSheet.create({
  price: {
    fontSize: 14,
    color: "grey",
    fontWeight: "100",
  },
  productImage: {
    height: "70%",
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: "cover"
  },
  productTitle: {
    fontSize: 16,
    color: "black",
    fontWeight: "400"
  },
  productTitleDark: {
    fontSize: 16,
    color: "white",
    fontWeight: "400",

},
  product: {
    height: "100%",
    width: 140,
    marginHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 8

  },
  productDark: {
    height: "100%",
    width: 140,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "black",


},
  City: {
    marginVertical: 6,
    padding: 5,
    width: Dimensions.get("screen").width,
    height: "5%",
    flex: 1,
    shadowColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',


  },

  domainsContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginHorizontal: 5,
    width: Dimensions.get("window").width * 0.5,
    height: "100%",
    overflow: "hidden"

  },
  serviceContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginHorizontal: 5,
    width: Dimensions.get("window").width * 0.4,
    height: "100%",
    overflow: "hidden"

  },


  partnersContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: 180,
    marginRight: 8,
    height: "94%",

  },



  servicetitle: {
    color: "white",
    textAlign: "center"
  },
  imageService: {
    width: Dimensions.get("screen").width * 0.17,
    height: Dimensions.get("screen").width * 0.17,
    borderRadius: Dimensions.get("screen").width * 0.17,
    resizeMode: "cover",
    marginRight: 3
  },
  searchInput: {
    color: "black",
    textDecorationLine: 'underline',
    fontSize: Dimensions.get("window").width * 0.045

  },
  searchInputDark: {
    color: "white",
    textDecorationLine: 'underline',
    fontSize: Dimensions.get("window").width * 0.045
  }
  ,

  container: {
    flex: 1
  },



  imageContainer: {
    position: "absolute",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
    shadowOpacity: 0.5,
    padding: 10,
    alignSelf: "flex-end",
    flexDirection: "row",


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
  }
  ,
  searchCity: {
    position: "absolute",
    top: "11%",
    left: "81%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 24,
    backgroundColor: "#2474F1",
  },
  Mycode: {
    position: "absolute",
    top: "11%",
    left: "4%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "row",
    alignSelf: "center",
    width: "76%",
    height: 50,
    borderRadius: 24,
    backgroundColor: "#2474F1",
  },
  geoInfo: {
    position: "absolute",
    top: "22%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "column",
    alignSelf: "center",
    padding: 10,
    width: "96%",
    height: "22%",
    borderRadius: 10,
  },
  coordinatesSettings: {
    margin: "2%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",

  },
  coordSettingsIcon: {
    width: "8%",
    height: "100%",
    margin: "1%",
    resizeMode: "contain"
  },
  codeManup: {
    color: "white",
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 15,
    textShadowColor: "black",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1
  },
  dropDown: {
    width: "100%",
    height: "100%",
    resizeMode: 'contain'
  },
  dropDownContainer: {
    width: "20%",
    height: "100%",
    marginHorizontal: 10,

  },
  smartCode: {
    fontSize: Dimensions.get("window").width * 0.04,
    color: "white",
    fontWeight: "700"
  },

  menu: {

    position: "absolute",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "row",
    padding: 10,
    shadowOpacity: 0.5,
    elevation: 10,
    width: Dimensions.get("screen").height * 0.052,
    height: Dimensions.get("screen").height * 0.052
  },
  searchBar: {
    position: "absolute",
    top: "65%",
    alignSelf: "center",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "row",
    padding: 10,
    shadowOpacity: 0.5,
    width: "80%",
    height: "8%",
    borderRadius: 10,
  },
  searchBarAfterSetService: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "row",
    padding: 10,
    shadowOpacity: 0.5,
    width: "80%",
    height: "8%",
    borderRadius: 10,
  },

  domainswithoutPartners: {
    position: "absolute",
    top: "74%",
    left: "2%",
    height: "18%",
    width: "100%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
  },
  domainswithPartners: {
    position: "absolute",
    top: "55%",
    width: "100%",
    left: "2%",
    height: "18%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
  },
  domainswithServices: {
    position: "absolute",
    top: "71%",
    width: "100%",
    left: "2%",
    height: "6%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
  },
  partners: {
    position: "absolute",
    top: "74%",
    left: "2%",
    width: "100%",
    height: "18%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
  },
  SinglePartner: {

    margin: 4,
    borderRadius: 10,
    width: 180,
    height: "92%",
    alignItems: "flex-start",
    backgroundColor: '#2474F1',
    flexDirection: "row",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    borderRadius: 8,
    shadowColor: "white",

  },
  PartnerImageContainer: {
    backgroundColor: "#2474F1",
    width: "100%",
    height: "100%",
    shadowColor: "white",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    borderRadius: 8,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  partnerImage: {
    width: 60,
    height: 60,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 70,
    resizeMode: "cover"
  },
  partnerTitle: {
    color: "white",
    fontWeight: "500"
  },
  showmore: {
    color: "white",
    fontWeight: "500",
    fontSize: Dimensions.get("window").width * 0.06,
    textAlign: "center"
  },
  operations: {
    backgroundColor: "#2474F1",
    width: "30%",
    height: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    shadowColor: "white",
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 0.2


  },
  call: {
    width: "100%",
    height: "50%",
    shadowColor: "white",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    borderRadius: 8,
    zIndex: 50,
    borderColor: "white",
    borderWidth: 0.2,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  messaging: {
    width: "100%",
    height: "50%",
    backgroundColor: "#2474F1",
    shadowColor: "white",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    borderRadius: 8,
    zIndex: 50,
    elevation: 10,
    borderColor: "white",
    borderWidth: 0.2,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

  },
  messagingImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    shadowColor: "white",
    shadowOffset: { width: 2, height: 2 },
  },

  service: {
    margin: 4,
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#e3e3e3",
    borderRadius: 8
  },
  serviceDark:{
    margin: 4,
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
        backgroundColor: "#292929",
    borderRadius: 8
  },
  serviceChosenWithDomain: {
    margin: 4,
    alignItems: "center",
    width: Dimensions.get("screen").width * 0.4,
    height: 35,
    flexDirection: "row",
    justifyContent: "center",
    borderColor: '#2474F1',
    borderWidth: 1,
    borderRadius: 8
  },
  serviceWithDomain: {
    margin: 4,
    width: Dimensions.get("screen").width * 0.4,
    height: 35,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e3e3e3",
    borderRadius: 8
  },
  serviceChosen: {
    margin: 4,
    alignItems: "center",
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.2,
    flexDirection: "row",
    justifyContent: "flex-start",
    borderColor: '#2474F1',
    borderWidth: 1,
    backgroundColor: "#e3e3e3",
    borderRadius: 8
  },
  serviceChosenDark: {
    margin: 4,
    alignItems: "center",
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.2,
    flexDirection: "row",
    justifyContent: "flex-start",
    borderColor: '#2474F1',
    borderWidth: 1,
    backgroundColor: "#292929",
    borderRadius: 8
  }
});





const defaultStyle = [];


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

