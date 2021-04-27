import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Picker } from '@react-native-community/picker';
import { StyleSheet, Dimensions, View, Image, Platform, Text, Modal, Alert, Animated, Clipboard, ActivityIndicator, TouchableOpacity, Linking, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import _ from 'lodash';
import Geocoder from 'react-native-geocoding';
import AuthContext from '../navigation/AuthContext';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { getCities } from '../rest/geoLocationApi'
import { getPartnerWithProducts, getAllPartners } from '../rest/partnerApi';
import { getClientOrders, getDelivererOrders } from '../rest/ordersApi'
import { getDomains } from '../rest/geoLocationApi';
import { getUserLocation } from '../rest/locationApi';
import Partner from '../common/Partner';
import PartnerService from '../common/partnerService'

const api_directions_key = "AIzaSyDcbXzRxlL0q_tM54tnAWHMlGdmPByFAfE";


const domains_images = [
  { type: 'service', image: require("../assets/images/Service.png") },
  { type: 'shopping', image: require("../assets/images/shopping.png") },
  { type: 'food', image: require("../assets/images/food.png") },
]


export default function Home(props) {
  const context = useContext(AuthContext);
  const [seviceChosen, setServiceChosen] = useState(false);
  const [domain, setDomain] = useState();
  const [service, setService] = useState("");
  const [showModal, setShowmodal] = useState(false);
  const [domains, setDomains] = useState([]);
  const [services, setServices] = useState([]);
  const [partners, setPartners] = useState([]);
  const [profile, setProfile] = useState(null);
  const [cities, setCities] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [profileChecked, setProfileChecked] = useState(false);
  const [alignement, setAlignement] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [position, setPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

  const [modalListPartners, setModalListPartners] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState();
  const [showPicker, setShowPicker] = useState(false)
  const [cityPicker, setCityPicker] = useState(false);
  const [regionPicker, setRegionPicker] = useState(false);
  const [address, setAddress] = useState({ city: '', region: '' });
  const [friendsLocation, setFriendsLocation] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [servicePartners, setServicePartners] = useState([]);
  const [orders, setOrders] = useState([]);


  const goUp = () => {
    Animated.timing(alignement, {
      toValue: { x: 0, y: -Dimensions.get("screen").height * 0.47 },
      duration: 300,
      useNativeDriver: true
    }).start();


    Animated.timing(position, {
      toValue: { x: 0, y: -Dimensions.get("screen").height * 0.65 },
      duration: 300,
      useNativeDriver: true
    }).start();

  }
  const slidepartners = useCallback(({ nativeEvent }) => {

    Animated.timing(alignement, {
      toValue: { x: 0, y: -Dimensions.get("screen").height * 0.47 },
      duration: 300,
      useNativeDriver: true
    }).start();


    Animated.timing(position, {
      toValue: { x: 0, y: -Dimensions.get("screen").height * 0.65 },
      duration: 300,
      useNativeDriver: true
    }).start();



  })




  const getLocation = () => {
    if (context.user && context.user.isVendor && context.partner) {
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


  useEffect(() => {
    if(context.user){
      setProfile(context.user);

    }
    setAlignement(new Animated.ValueXY({ x: 0, y: 0 }));
    setPosition(new Animated.ValueXY({ x: 0, y: 0 }));
    getClientOrders().then(_orders => {
      setOrders(_orders.filter(order => order.actif == true && order.taked == true && order.prepared == true));
    })

    setFriendsLocation(context.user.searchedLocations);
    getCities().then(cities => {
      const _cities = [{ cityName: 'choose city', _id: "af0f260a-9f70-11eb-a8b3-0242ac130003" }, ...cities]
      setCities(_cities);
      setPartners([]);
      setServicePartners([]);
    }).catch(err => { alert("getting cities error") })


    Geocoder.init("AIzaSyDcbXzRxlL0q_tM54tnAWHMlGdmPByFAfE"); // use a valid API key
    if (context.location && context.location.location) {
      Geocoder.from({ longitude: context.location.location.longitude, latitude: context.location.location.latitude })
        .then(json => {
          var region = json.results[0].address_components[1].long_name
          var city = json.results[0].address_components[2].long_name

          setAddress({ city, region });

        })
        .catch(error => console.warn(error));
    }

    if (context.user.isVendor && context.partner) {
      getDelivererOrders(context.partner._id).then(orders => {
        setDeliveries(orders);
      }).catch(err => {
      })
    }

    getDomains().then(_domains => {
      _domains.map(domain => {
        if (domains_images.findIndex(d => { return d.type == domain.type }) >= 0) {
          domain.image = domains_images[domains_images.findIndex(d => { return d.type == domain.type })].image;
        }
      })

      setDomains(_domains.filter(_d => _d.status == true));
      if (_domains.length > 0 && _domains[0].services) {
        setDomain(_domains[0]);
        setServices(_domains[0].services);
        if (_domains[0].services.length > 0) {
          let partners_ids = [];
          let _partners = [];
          _domains[0].services[0].partnersRegions.map(partnerRegion => {
            partnerRegion.partners.map(_partner => {
              if (partners_ids.indexOf(_partner) == -1) { partners_ids.push(_partner) }
            })
          })
          if (partners_ids.length > 0) {
            partners_ids.map(_id => {
              getPartnerWithProducts(_id).then(partnerData => {
                let index = _partners.findIndex(partner => { return partner._id == partnerData._id })
                if (index == -1) {
                  if (partnerData.lastProducts.length > 0) {
                    _partners.push(partnerData);
                    setPartners(_partners);
                  }
                }

              }).catch(err => { })



            })
          }
          else {
            setPartners([]);
          }
          setService(_domains[0].services[0].serviceName.fr);


        }
      }
    })

    setServiceChosen(false)
    return () => { setCities([]); setServices([]); setPartners([]); setDomain(null) }
  }
    , [props.route.params,context.user])



  const copyCode = () => {
    if (context.user.location) {
      Clipboard.setString(context.user.location.locationCode.toLowerCase());
      Alert.alert('', 'Code copied!', [{ text: 'Okay' }]);

    }
  }
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

  // transform:[
  //   {translateX:alignement.x},
  //   {translateY:alignement.y}
  // ]







  const openFacebook = () => {
    Linking.canOpenURL("fb://page/Addresti-118226009977589").then(supported => {
      if (supported) {
        return Linking.openURL("fb://page/Addresti-118226009977589");
      } else {
        return Linking.openURL("https://www.facebook.com/page/Addresti-118226009977589");
      }
    })

  }


  const openInstagram = () => {
    Linking.canOpenURL('instagram://user?username=addresti.tn').then(supported => {
      if (supported) {
        return Linking.openURL("instagram://user?username=addresti.tn");
      } else {
        return Linking.openURL("https://www.instagram.com/addresti.tn");
      }
    })

  }



  const openYoutube = () => {
    Linking.canOpenURL('vnd.youtube://user/channel/UC8XPr58aTMCHWieX273gyCQ').then(supported => {
      if (supported) {
        return Linking.openURL("vnd.youtube://user/channel/UC8XPr58aTMCHWieX273gyCQ");
      } else {
        return Linking.openURL("https://www.youtube.com/channel/UC8XPr58aTMCHWieX273gyCQ");
      }
    })

  }



  const checkAccount = (item) => {
    setProfile(item);
    if (!item.firstName) {
      context.setPartner(item);

      if (item.delivery.cities.length > 0 || item.delivery.regions.length > 0) {
        if (item.owner == context.user._id) {
          props.navigation.navigate('deliveryDash');
        }

        if (item.managers.length > 0 && item.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
          && item.managers[item.managers.findIndex(manager => { return manager.user == context.user._id })].access.deliveryAccess.deposit) {
          props.navigation.navigate('debou');
        }
        if (item.deliverers.findIndex(d => { return d.user == context.user._id }) >= 0) {
          if (item.deliverers[item.deliverers.findIndex(d => { return d.user == context.user._id })].type == "delivery") {
            props.navigation.navigate("livraisons", { last_screen: "" });
          }
          if (item.deliverers[item.deliverers.findIndex(d => { return d.user == context.user._id })].type == "collect") {
            props.navigation.navigate("collecting");
          }

          if (item.deliverers[item.deliverers.findIndex(d => { return d.user == context.user._id })].type == "both") {
            props.navigation.navigate("collecting");
          }


        }
        setModalListPartners(!modalListPartners)

      }
      if (item.delivery.cities.length == 0 && item.delivery.regions.length == 0) {
        if (item.managers.findIndex(m => { return m.manager == context.user._id }) >= 0 && item.managers[item.managers.findIndex(m => { return m.manager == context.user._id })].access.businessAccess.dashboard) {
          props.navigation.navigate("businessDash");
        }
        if (item.managers.findIndex(m => { return m.manager == context.user._id }) >= 0 && item.managers[item.managers.findIndex(m => { return m.manager == context.user._id })].access.businessAccess.products) {
          props.navigation.navigate("listProducts");
        }
        if (item.managers.findIndex(m => { return m.manager == context.user._id }) >= 0 && item.managers[item.managers.findIndex(m => { return m.manager == context.user._id })].access.businessAccess.orders) {
          props.navigation.navigate("businessorders");
        }
        if (item.owner == context.user._id) {
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


  const checkDomain = (_domain) => {

    setPartners([]);
    if (_domain.type == "food" || _domain.type == "service") {
      setShowmodal(!showModal);
      setServices([]);
      setService("");
    }

    if (_domain.type == "shopping") {
      if (_domain.services.length > 0) {
        setServices(_domain.services);
        getAllPartners(1, 10, _domain.services[0]._id).then(partners => {
          let _partners = [];
          partners.map(partner => {
            if (partner.products.length > 0) {
              _partners.push(partner);
            }
          })

          setPartners(_partners);
        }).catch(err => { console.log(err); alert("error") })
        setService(_domain.services[0].serviceName.fr);
      }
    }
    setDomain(_domain);
    goUp()
  }

  const handleServicePartners = (service) => {

    setService(service.serviceName.fr);
    setPartners([]);
    setServicePartners([]);
    if (service.isFood || domain.type == "service") {
      let partners_ids = [];
      let _partners = [];
      let _service_partners = [];
      service.partnersRegions.map(partnerRegion => {
        partnerRegion.partners.map(_partner => {
          if (partners_ids.indexOf(_partner) >= 0) { }
          else { partners_ids.push(_partner) }
        })

      })



      if (partners_ids.length > 0) {
        partners_ids.map(_id => {
          getPartnerWithProducts(_id).then(partnerData => {
            let index = _partners.findIndex(partner => { return partner._id == partnerData._id })
            if (index == -1) {
              if (service.isFood) {
                if (partnerData.lastProducts.length > 0) {
                  _partners.push(partnerData);
                  setPartners(_partners);
                }
              }

              else {
                _service_partners.push(partnerData)
                setServicePartners(_service_partners);
              }
            }
          }
          ).catch(err => console.log(err))

        })
      }

      else {
        setPartners([]);
        setServicePartners([]);
      }

    }

    else {
      getAllPartners(1, 10, service._id).then(partners => {
        let _partners = [];
        partners.map(partner => {
          if (partner.products.length) {
            _partners.push(partner);
          }
        })
        setPartners(_partners);
      }).catch(err => { console.log(err) })
    }
  }




  const searchLocation = (text) => {
    setSearchCode(text);
    if (text.length == 8) {
      getUserLocation(text.toLowerCase()).then(location => {
        setFriendsLocation([...friendsLocation, location])
      })
    }
  }

  const checkRegion = (item) => {

    setSelectedCity(null);
    setPartners([]);
    setServices([]);
    setServicePartners([]);

    setSelectedRegion(selectedRegion);
    setShowmodal(!showModal);
    setShowPicker(!showPicker);
    setRegionPicker(!regionPicker);

    let _services = [];

    const index = regions.findIndex(region => { return region._id == item });

    if (index >= 0) {
      _services = [...regions[index].services];
      setAddress({ ...address, region: regions[index].regionName })
      let _services_filtered = [...domain.services.filter(service => _services.findIndex(s => { return s == service._id }) >= 0)];

      if (_services_filtered.length > 0) {
        setServices(_services_filtered);
        setService(_services_filtered[0].serviceName.fr);



        let partners_ids = [];
        let _partners = [];
        let _servicePartners = [];

        _services_filtered[0].partnersRegions.map(partnerRegion => {
          partnerRegion.partners.map(_partner => {
            if (partners_ids.indexOf(_partner) >= 0) { }
            else { partners_ids.push(_partner) }
          })
        })

        if (partners_ids.length > 0) {
          partners_ids.map(_id => {
            getPartnerWithProducts(_id).then(partnerData => {
              let index = _partners.findIndex(partner => { return partner._id == partnerData._id })
              if (index == -1) {
                if (_services_filtered[0].isFood) {
                  if (partnerData.lastProducts.length > 0) {
                    _partners.push(partnerData);
                    setPartners(_partners);
                  }
                }

                if (domain.type == "service") {
                  _servicePartners.push(partnerData);
                  setServicePartners(_servicePartners);
                }
              }
            }
            ).catch(err => console.log(err))
          })
        }

        else {
          setPartners([]);
          setServicePartners([]);
        }
      }
      else {
        setServices([]);
      }

    }

  }


  const checkCity = (item) => {
    const index = cities.findIndex(city => { return city._id == item });
    if (index >= 0) {
      const _regions = [{ regionName: "select region", _id: '0e08e320-9f72-11eb-a8b3-0242ac130003' }, ...cities[index].regions]
      setRegions(_regions);
      setAddress({ ...address, city: cities[index].cityName })
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
    //props.navigation.navigate("conversation", { conversation, home: true })
  }




  const checkBasket = () => {
    props.navigation.navigate("basket", { last_screen: "Home" });

  }

  const openDrawer = () => {
    props.navigation.openDrawer();
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
          friendsLocation.length > 0 ?
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
              }>

              <Image source={context.user.photo ? { uri: context.user.photo } : require("../assets/user_image.png")} style={{ height: 30, width: 30, borderRadius: 30, borderColor: "#2474F1", borderWidth: 1 }} />

            </Marker>

            : null
        }
        {
          friendsLocation.length > 0
          &&

          friendsLocation.map((friendLocation, index) =>
            <Marker
              key={index}
              coordinate={
                Platform.OS == 'ios' ?
                  {
                    latitude: friendLocation ? Number(friendLocation.location.latitude) : 0,
                    longitude: friendLocation ? Number(friendLocation.location.longitude) : 0
                  } :
                  {
                    latitude: friendLocation ? Number(friendLocation.location.latitude) : 0,
                    longitude: friendLocation ? Number(friendLocation.location.longitude) : 0
                  }
              }
            >
              <Image source={friendLocation.user.photo ? { uri: friendLocation.user.photo } : require("../assets/user_image.png")} style={{ height: 30, width: 30, borderRadius: 30, borderColor: "#2474F1", borderWidth: 2 }} />
            </Marker>

          )
        }

        {friendsLocation.length == 0 &&
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
            <Image source={require('../assets/appLogo.png')} style={{ height: 40, width: 40 }} />

          </Marker>
        }



        {
          friendsLocation.length > 0 && friendsLocation.map((friendLocation, index) =>
            <MapViewDirections
              key={index}
              apikey={api_directions_key}
              origin={{
                latitude: context.location ? context.location.location ? Number(context.location.location.latitude) : 0 : 0,
                longitude: context.location ? context.location.location ? Number(context.location.location.longitude) : 0 : 0
              }}
              destination={{
                latitude: friendLocation ? Number(friendLocation.location.latitude) : 0,
                longitude: friendLocation ? Number(friendLocation.location.longitude) : 0
              }}
              strokeWidth={3}
              strokeColor={

                orders.findIndex(order => { return order.deliveryOrder.clientDeliverer && order.deliveryOrder.clientDeliverer._id && friendLocation.user._id }) >= 0
                  || orders.findIndex(order => { return order.deliveryOrder.client && order.deliveryOrder.client._id && friendLocation.user._id }) >= 0
                  ? "#24A9E1" : "#03ba88"}




            />)}

      </MapView>

      <View style={styles.Mycode}>
        <View style={styles.dropDownContainer}>
          <Image style={styles.dropDown} source={require("../assets/logo_white.png")} />
        </View>
        {
          isSearch ?
            <TextInput
              style={{ width: "80%", height: Dimensions.get("screen").height * 0.09, color: "white" }}
              placeholderTextColor={"white"}
              value={searchCode}
              onChangeText={(text) => { searchLocation(text) }}
              placeholder={"Search smart code"}
            /> :
            <View style={{ width: "50%", height: "100%", flexDirection: "column", justifyContent: "flex-start" }}>
              <View style={{ width: "100%", height: "30%" }}>
                <Text style={styles.smartCode}>Smart Code</Text>
              </View>

              <Text style={{
                fontFamily: 'PoppinsBold', fontSize: Dimensions.get("window").width * 0.07,
                color: "white"
              }}>{context.user && context.user.location.locationCode.toUpperCase()}</Text>
            </View>
        }
        <View style={{ width: "20%", height: "100%", borderRadius: 24 }}>
          <TouchableOpacity style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", }} onPress={() => { copyCode() }}>
            <Image style={{ width: Dimensions.get("window").width * 0.07, height: Dimensions.get("window").width * 0.07, resizeMode: "center" }} source={require("../assets/copy.png")} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchCity}>
        <TouchableOpacity style={{ width: "70%", height: "70%", flexDirection: "column", justifyContent: "center", alignItems: "center" }} onPress={() => { setIsSearch(!isSearch) }}>
          <Image style={{ width: "70%", height: "70%", resizeMode: "contain" }} source={require("../assets/images/searchingDark.png")} />
        </TouchableOpacity>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center", height: Dimensions.get("screen").height * 0.03,
          width: Dimensions.get("screen").height * 0.03,
        }} onPress={() => { openDrawer() }}>

          <Image source={context.darkMode ? require("../assets/menu_dark.png") : require("../assets/menu.png")} style={{ height: "80%", width: "80%", resizeMode: "contain" }} />
        </TouchableOpacity>
      </View>

      <View style={
        context.darkMode ?
          {
            position: "absolute",
            left: "14%", width: "84%",
            height: Dimensions.get("screen").height * 0.045,
            backgroundColor: "#333333",
            marginTop: Platform.OS == 'ios' ? 40 : 30,
            flexDirection: "row",
            borderRadius: 12
          } :
          {
            position: "absolute",
            left: "14%", width: "84%",
            height: Dimensions.get("screen").height * 0.045,
            backgroundColor: "#f7f7f7",
            marginTop: Platform.OS == 'ios' ? 40 : 30,
            flexDirection: "row",
            borderRadius: 12,
            elevation: 10,
            zIndex: 50

          }}>
        <View style={{
          width: "10%",
          height: "100%",
          borderRadius: 12,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

        }}>
          <Image style={{ width: Dimensions.get("screen").height * 0.022, height: Dimensions.get("screen").height * 0.022, resizeMode: "contain" }} source={require("../assets/searchHome.png")} />
        </View>
        <View style={{
          width: "55%",
          height: "100%",
          borderRadius: 12
        }}>
          <TextInput
            style={context.darkMode ? { width: "100%", color: "white", height: Dimensions.get("screen").height * 0.045 } : { width: "100%", color: "black", height: Dimensions.get("screen").height * 0.045 }}
            placeholderTextColor={"#B5B5B5"}
            placeholder={"Search"}
          />
        </View>
        <View style={{
          width: "35%",
          height: "100%",
          borderRadius: 12,
          flexDirection: "row",
          justifyContent: "center"
        }}>

          <View style={{ width: "30%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
            <TouchableOpacity style={{ width: "80%", height: "80%" }} onPress={checkBasket}>
              <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={context.darkMode ? require("../assets/homeBagDark.png") : require("../assets/homeBag.png")} />
            </TouchableOpacity>
            <View style={{ width: Dimensions.get("screen").width * 0.035, height: Dimensions.get("screen").width * 0.035, backgroundColor: "red", borderRadius: 12, flexDirection: "column", justifyContent: "center", alignItems: "center", position: "absolute", top: "55%", right: "14%" }}>
              <Text style={{ fontFamily: 'Poppins', fontSize: 10, color: "white" }}>{context.bag}</Text>
            </View>
          </View>

          <View style={{ width: "30%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
            <TouchableOpacity style={{ width: "80%", height: "80%" }} onPress={() => { checkProfile() }}>
              <Image style={{ width: Dimensions.get("screen").height * 0.035, height: Dimensions.get("screen").height * 0.035, borderRadius: Dimensions.get("screen").height * 0.35, resizeMode: "cover" }} source={context.user.photo ? { uri: context.user.photo } : require('../assets/user_image.png')} />
            </TouchableOpacity>
          </View>
        </View>

      </View>

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
                        <Image style={{ width: 50, height: 50, borderRadius: 50, resizeMode: "contain" }} source={item.photo ? { uri: item.photo } : item.profileImage ? { uri: item.profileImage } : require("../assets/user_image.png")} />
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
          <TouchableWithoutFeedback style={{ width: Dimensions.get("screen").width * 1, height: Dimensions.get("screen").height * 0.32 }} onPress={() => { setShowmodal(!showModal) }}>
            <View style={{ width: Dimensions.get("screen").width * 1, height: Dimensions.get("screen").height * 0.25 }}>
            </View>

          </TouchableWithoutFeedback>




          <View style={{ width: Dimensions.get("screen").width * 0.9, flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 12, height: Dimensions.get("screen").height * 0.36, margin: 40, alignSelf: "center", backgroundColor: "#626262" }}>
            <View style={{ width: "86%", height: "86%", backgroundColor: "#626262", flexDirection: "column", justifyContent: "flex-start" }}>
              <Text style={{ fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.05, color: "white", marginBottom: 15 }}>Select your place</Text>
              <View style={{ width: "100%", height: "70%", flexDirection: "column", justifyContent: "space-between" }}>

                <View style={{ backgroundColor: "#3E3E3E", width: "100%", height: 60, borderRadius: 12 }}>
                  {
                    !cityPicker ?
                      <TouchableOpacity onPress={() => { setCityPicker(!cityPicker) }} style={{ flexDirection: "row", width: "100%", height: "100%", justifyContent: 'flex-start' }}>
                        <Image style={{ marginLeft: 8, width: "12%", height: "100%", resizeMode: "contain" }} source={require("../assets/picker_up.png")} />
                        <View style={{ width: "88%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <Text style={{ fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.05, color: "white", }}>{address ? address.city : ""}</Text>
                        </View>
                      </TouchableOpacity> :
                      <Picker
                        selectedValue={selectedCity}
                        style={Platform.OS == 'ios' ? { width: "100%", height: "100%", justifyContent: "flex-end", flexDirection: "column" } : {}}
                        onValueChange={(itemValue, itemIndex) => { checkCity(itemValue) }}
                        mode="dropdown">

                        {
                          cities && cities.length > 0 &&

                          cities.map((city, index) => {

                            return (

                              <Picker.Item key={city._id} color={Platform.OS == 'android' ? 'black' : 'white'} label={city.cityName} value={city._id} />

                            )

                          })
                        }
                      </Picker>
                  }

                </View>


                <View style={{ backgroundColor: "#3E3E3E", width: "100%", height: 60, marginBottom: Dimensions.get("screen").width * 0.05, borderRadius: 12 }}>

                  {


                    !regionPicker ?

                      <TouchableOpacity style={{ flexDirection: "row", width: "100%", height: "100%", justifyContent: 'flex-start' }} onPress={() => { if (selectedCity) { setShowPicker(!showPicker); setRegionPicker(!regionPicker) } else alert("please choose city first") }}>
                        <Image style={{ marginLeft: 8, width: "12%", height: "100%", resizeMode: "contain" }} source={require("../assets/picker_up.png")} />
                        <View style={{ width: "88%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <Text style={{ fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.05, color: "white", }}>{address ? address.region : ""}</Text>
                        </View>

                      </TouchableOpacity>
                      :

                      <Picker
                        style={Platform.OS == 'ios' ? { width: "100%", height: "100%", justifyContent: "flex-end", flexDirection: "column" } : {}}
                        selectedValue={selectedRegion}
                        onValueChange={(itemValue, itemIndex) => { checkRegion(itemValue) }}
                        mode="dropdown"
                      >

                        {
                          regions && regions.length > 0 &&
                          regions.map((region) => {
                            return (
                              <Picker.Item key={region._id} color={Platform.OS == 'android' ? 'black' : 'white'} label={region.regionName} value={region._id} />
                            )
                          })
                        }
                      </Picker>

                  }
                </View>


              </View>
            </View>

          </View>
          <TouchableWithoutFeedback style={{ width: Dimensions.get("screen").width * 1, height: Dimensions.get("screen").height * 0.32 }} onPress={() => { setShowmodal(!showModal) }}>
            <View style={{ width: Dimensions.get("screen").width * 1, height: Dimensions.get("screen").height * 0.25 }}>
            </View>

          </TouchableWithoutFeedback>

        </View>
      </Modal>
      <Animated.View style={context.darkMode ?
        {
          width: "100%",
          height: Dimensions.get("screen").height,
          position: "absolute", backgroundColor: "black",
          top: Dimensions.get('screen').height * 0.64, flexDirection: "column"
          , transform: [{ translateX: position.x }, { translateY: position.y }]

        } :
        {
          width: "100%",
          height: Dimensions.get("screen").height,
          position: "absolute", backgroundColor: "white",
          top: Dimensions.get('screen').height * 0.64, flexDirection: "column"
          , transform: [{ translateX: position.x }, { translateY: position.y }]
        }
      }>

      </Animated.View>
      <Animated.View style={{
        width: "100%",
        height: Dimensions.get("screen").height * 0.8,
        position: "absolute",
        top: Dimensions.get('screen').height * 0.6, flexDirection: "column"
        , transform: [{ translateX: alignement.x }, { translateY: alignement.y }]
      }}>
        <View style={{ width: "100%", height: "10%" }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={domains}
            renderItem={({ item }) => (
              <View key={item._id} style={styles.domainsContainer}>
                <TouchableOpacity onPress={() => { checkDomain(item) }}>
                  <View style={domain && domain.name.fr == item.name.fr ? context.darkMode ? styles.serviceChosenDark : styles.serviceChosen : context.darkMode ? styles.serviceDark : styles.service} >
                    <Image style={{ width: Dimensions.get("screen").width * 0.12, height: Dimensions.get("screen").width * 0.12, borderRadius: Dimensions.get("screen").width * 0.12, resizeMode: "cover" }} source={item.image ? item.image : require("../assets/images/food.png")} />
                    <Text style={context.darkMode ? { color: "white", fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.05 } :
                      { color: "black", fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.035 }}>{item.name.fr}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item._id}
          >
          </FlatList>
        </View>
        <View style={{ width: "100%", height: "5%", marginVertical: 3 }}>
          <FlatList
            horizontal
            data={services}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View key={item._id} style={service == item.serviceName.fr ? styles.serviceChosenWithDomain : styles.serviceWithDomain}>

                <TouchableOpacity
                  onPress={() => {
                    handleServicePartners(item)
                  }}

                  style={

                    { width: "100%", height: "100%" }}
                >
                  <View style={
                    context.darkMode ?
                      { width: "100%", height: "100%", backgroundColor: "#333333", flexDirection: "column", borderRadius: 7, justifyContent: "center", alignItems: "center" } :
                      { width: "100%", height: "100%", backgroundColor: "#f3f3f3", flexDirection: "column", borderRadius: 7, justifyContent: "center", alignItems: "center" }}
                  >

                    <Text style={context.darkMode ? { color: "white", fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.03 } :
                      { color: "black", fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.025 }}>{item.serviceName.fr}</Text>

                  </View>
                </TouchableOpacity>
              </View>
            )}

            keyExtractor={item => item._id}
          >
          </FlatList>

        </View>
        <View style={{ width: "100%", height: "82%", marginVertical: 3 }}>
          {partners.length > 0 ?
            <FlatList

              onScrollBeginDrag={slidepartners}
              data={partners}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) =>
                <Partner
                  partnerName={item.partnerName}
                  checkPartner={checkPartner}
                  profileImage={item.profileImage}
                  products={item.lastProducts ? item.lastProducts : item.products}
                  partner={item}
                />
              }
              keyExtractor={(item, index) => (index + item._id).toString()}
            >

            </FlatList>
            :
            servicePartners.length > 0 ?
              <FlatList
                data={servicePartners}
                renderItem={({ item }) =>
                  <PartnerService
                    partnerService={item}
                    openFacebook={openFacebook}
                    openInstagram={openInstagram}
                    openYoutube={openYoutube}
                    darkMode={context.darkMode}
                    startConversation={startPartnerConversation}
                  />

                }
                keyExtractor={item => item._id}
              >

              </FlatList>
              :


              <View style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "flex-start", marginTop: Dimensions.get("window").height * 0.1, alignItems: "center" }}>
                <ActivityIndicator size="large" color={"#2474F1"} />
              </View>
          }
          {
          }
        </View>

      </Animated.View>



    </View>
  );
}

const styles = StyleSheet.create({
  price: {
    fontFamily: 'Poppins', fontSize: 14,
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
    fontFamily: 'Poppins', fontSize: 16,
    color: "black",
    fontWeight: "400"
  },
  productTitleDark: {
    fontFamily: 'Poppins', fontSize: 16,
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
    marginHorizontal: 1,
    width: Dimensions.get("screen").width * 0.41,
    height: "98%",
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
    fontFamily: 'Poppins', fontSize: Dimensions.get("window").width * 0.045

  },
  searchInputDark: {
    color: "white",
    textDecorationLine: 'underline',
    fontFamily: 'Poppins', fontSize: Dimensions.get("window").width * 0.045
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
    top: "9%",
    left: "81%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("screen").width * 0.15,
    height: Dimensions.get("screen").width * 0.15,
    borderRadius: Dimensions.get("screen").width * 0.15,
    backgroundColor: "#2474F1",
  },
  Mycode: {
    position: "absolute",
    top: "9%",
    left: "4%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "row",
    alignSelf: "center",
    width: "76%",
    height: Dimensions.get("screen").width * 0.15,
    borderRadius: Dimensions.get("screen").width * 0.15 / 2,
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
    fontFamily: 'Poppins', fontSize: 15,
    textShadowColor: "black",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1
  },
  dropDown: {
    width: "80%",
    height: "80%",
    resizeMode: 'contain'
  },
  dropDownContainer: {
    width: "20%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",

    marginHorizontal: 10,

  },
  smartCode: {
    marginTop: 3,
    fontFamily: 'Poppins', fontFamily: 'Poppins',
    fontSize: Dimensions.get("window").width * 0.03,
    color: "white",
    fontWeight: "700",
    fontFamily: 'Poppins'
  },

  menu: {

    position: "absolute",
    left: "4%",
    height: Dimensions.get("screen").height * 0.03,
    width: Dimensions.get("screen").height * 0.03,
    marginTop: Platform.OS == 'ios' ? 40 : 35,
    zIndex: 50,
    elevation: 10
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
    left: "0%",
    height: Dimensions.get("window").width * 0.24,
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
    zIndex: 50
  },

  domainswithPartnersDark: {
    position: "absolute",
    backgroundColor: "black",
    top: "55%",
    width: "100%",
    left: "0%",
    height: Dimensions.get("window").width * 0.24,
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
    zIndex: 50
  },

  domainswithServices: {
    position: "absolute",
    backgroundColor: "white",
    top: "68%",
    width: "100%",
    left: "0%",
    height: Dimensions.get("window").width * 0.16,
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
  },
  domainswithServicesDark: {
    position: "absolute",
    backgroundColor: "black",
    top: "68%",
    width: "100%",
    left: "0%",
    height: Dimensions.get("window").width * 0.16,
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
  },
  partners: {
    position: "absolute",
    top: "70%",
    left: "2%",
    width: "100%",
    height: "18%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
  },




  service: {
    marginHorizontal: 1,
    width: Dimensions.get("window").width * 0.4,
    height: "98%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderColor: "#c7c7c7",
    borderWidth: 2,
    borderRadius: 8
  },
  serviceDark: {
    marginHorizontal: 1,
    width: Dimensions.get("window").width * 0.4,
    height: "98%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#333333",
    borderRadius: 11,
  },
  serviceChosenWithDomain: {
    marginHorizontal: 1,
    alignItems: "center",
    width: Dimensions.get("window").width * 0.28,
    height: "95%",
    flexDirection: "row",
    justifyContent: "center",
    borderColor: '#2474F1',
    borderWidth: 2,
    borderRadius: 7
  },
  serviceWithDomain: {
    marginHorizontal: 1,
    width: Dimensions.get("window").width * 0.28,
    height: "95%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 7
  },
  serviceChosen: {
    justifyContent: "space-evenly",
    alignItems: "center",

    width: Dimensions.get("window").width * 0.4,
    height: "98%",
    flexDirection: "row",
    borderColor: '#2474F1',
    borderWidth: 2,
    backgroundColor: "#f3f3f3",
    borderRadius: 11
  },

  serviceChosenDark: {
    marginHorizontal: 1,
    justifyContent: "space-evenly",
    alignItems: "center",

    width: Dimensions.get("screen").width * 0.4,
    height: "98%",
    flexDirection: "row",
    borderColor: '#2474F1',
    borderWidth: 2,
    backgroundColor: "#333333",
    borderRadius: 11
  }
});





const defaultStyle = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]


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

