import React, { useState, useContext, useEffect, useRef,useCallback } from 'react'
import { Picker } from '@react-native-community/picker';
import { StyleSheet, Dimensions, View, Image, Platform, Text, Modal, Alert, Animated, Clipboard, ActivityIndicator, TouchableOpacity, Linking, TouchableWithoutFeedback } from 'react-native';
import MapView, { Callout, CalloutSubview, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import _ from 'lodash';
import Geocoder from 'react-native-geocoding';
import AuthContext from '../navigation/AuthContext';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { getCities } from '../rest/geoLocationApi'
import { getPartnerWithProducts, getAllPartners } from '../rest/partnerApi';
import { getClientOrders } from '../rest/ordersApi'
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
  const [partnersSearched,setPartnersSearched]=useState([]);
  const [cities, setCities] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [profileChecked, setProfileChecked] = useState(false);
  const [alignement, setAlignement] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [position, setPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [positionModal,setPositionModal]=useState(new Animated.ValueXY({x:0,y:0}))
  const flatlistRef = useRef();
  const regionPickerRef= useRef();
  const cityPickerRef=useRef();
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
  const [servicePartnersSearched,setServicePartnersSearched]=useState([]);
  const [searchBoutique,setSearchBoutique]=useState(false);
  const [search,setSearch]=useState("");
  const [searchedProducts,setSearchedProducts]=useState([]);
  const [startSearch,setStartSearch]=useState(false);
  const [orders, setOrders] = useState([]);

  const [page,setPage] = useState(0)
  const [limit,setLimit]=useState(0)

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


  const searchProducts=(searchText)=>{
    setSearch(searchText);
    if(searchText.length==0){
      setSearchedProducts([]);
    }

    const query =  searchText.toLowerCase();
    setSearchedProducts([]);
    if(searchBoutique&&partners.length>0){
      const partners_results = _.filter(partners, partner => {
        return _.includes(partner.partnerName.toLowerCase(), query)
    })
    setPartnersSearched(partners_results)
    }
    if(searchBoutique&&servicePartners.length>0){
      const partners_results = _.filter(servicePartners, partner => {
        return _.includes(partner.partnerName.toLowerCase(), query)
    })
    setServicePartnersSearched(partners_results);
    }


    if(!searchBoutique&&searchText.length>0){
      let _products = [];
      partners.map(partner=>{
        if(partner.products&&partner.products.length>0){
          const product_result = _.filter(partner.products, prod => {
            return _.includes(prod.name.toLowerCase(), query)
        })

        _products=_products.concat(product_result);
      }

      if(partner.lastProducts&&partner.lastProducts.length>0){
        const product_result = _.filter(partner.lastProducts, prod => {
          return _.includes(prod.name.toLowerCase(), query)
      })

      _products=_products.concat(product_result);
    }


      
      })
    setSearchedProducts(_products);
    }

    
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




  useEffect(() => {
    setSearchedProducts([]);

    flatlistRef.current.scrollToOffset({ animated: true, offset: 0 });
   
    setAlignement(new Animated.ValueXY({ x: 0, y: 0 }));
    setPosition(new Animated.ValueXY({ x: 0, y: 0 }));
    getClientOrders().then(_orders => {
      setOrders(_orders.filter(order => order.actif == true && order.taked == true && order.prepared == true));
    })

    console.log(context.user.searchedLocations);
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
          setAddress({ city:"choose city", region:"choose region" });
        })
        .catch(error => console.warn(error));
    }

  

    getDomains().then(_domains => {
      _domains.map(domain => {
        if (domains_images.findIndex(d => { return d.type == domain.type }) >= 0) {
          domain.image = domains_images[domains_images.findIndex(d => { return d.type == domain.type })].image;
        }
      })


      setDomains(_domains.filter(_d => _d.status == true));
      

      if (_domains.length > 0 && _domains[1].services) {

        setDomain(_domains[1]);



    if(context.homeLocation==null)
    {   
      
      setServices(_domains[1].services);
        if (_domains[1].services.length > 0) {
          let partners_ids = [];
          let _partners = [];
          getAllPartners(1, 10, _domains[1].services[0]._id).then(partners => {
            let _partners = [];
            partners.map(partner => {
              if (partner.products.length > 0) {
                _partners.push(partner);
              }
            })
  
            setPartners(_partners);
            setPartnersSearched(_partners)
          }).catch(err => { console.log(err); alert("error") })

          
          setService(_domains[1].services[0].serviceName.fr);


        }}
        else {
            setSearchedProducts([]);
            setPartners([]);
            setPartnersSearched([])
            checkRegion(context.homeLocation.region,_domains[0]);
         
    
        }
      }
    })

    setServiceChosen(false)
    return () => { setCities([]); setServices([]); setPartners([]);setPartnersSearched([]); setDomain(null) }
  }
    , [props.route.params])



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







  const openFacebook = (facebook) => {
    Linking.canOpenURL(`fb://page/${facebook}`).then(supported => {
      if (supported) {
        return Linking.openURL(`fb://page/${facebook}`);
      } else {
        return Linking.openURL(facebook);
      }
    })

  }


  const openInstagram = (instagram) => {
    Linking.canOpenURL(`instagram://user?username=${instagram}`).then(supported => {
      if (supported) {
        return Linking.openURL(`instagram://user?username=${instagram}`);
      } else {
        return Linking.openURL(instagram);
      }
    })

  }



  const openYoutube = (youtube) => {
    Linking.canOpenURL(`vnd.youtube://user/channel/${youtube}`).then(supported => {
      if (supported) {
        return Linking.openURL(`vnd.youtube://user/channel/${youtube}`);
      } else {
        return Linking.openURL(youtube);
      }
    })

  }



  const checkAccount = (item) => {
    context.setProfile(item);

    if (!item.firstName) {
      context.setPartner(item);

      if (item.delivery.cities.length > 0 || item.delivery.regions.length > 0 || item.delivery.localRegions.length > 0) {
        if (item.owner == context.user._id) {
          props.navigation.navigate('deliveryDash');
        }

        if (item.managers.length > 0 && item.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
          && item.managers[item.managers.findIndex(manager => { return manager.user == context.user._id })].access.deliveryAccess.deposit) {
          props.navigation.navigate('debou');
        }
        if (item.deliverers.findIndex(d => { return d.user == context.user._id }) >= 0) {
          if (item.deliverers[item.deliverers.findIndex(d => { return d.user == context.user._id })].type == "delivery") {
            props.navigation.navigate("livraisons", { last_screen: "delivery" });
          }
          if (item.deliverers[item.deliverers.findIndex(d => { return d.user == context.user._id })].type == "collect") {
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
      if (item.delivery.cities.length == 0 && item.delivery.regions.length == 0&&item.delivery.localRegions.length == 0) {
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
      _profiles =_profiles.concat(context.user.workPlaces);
      console.log(context.user)
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
  const checkDomain = (_domain) => {
    
    setSearchedProducts([]);
    setPartners([]);
    setPartnersSearched([])
    if (_domain.type == "food" || _domain.type == "service") {
      if(context.homeLocation!=null){
        checkRegion(context.homeLocation.region,_domain);
        setDomain(_domain);   
        setSearchedProducts([]);
        setPartners([]);
        setPartnersSearched([])
      }
      
      if(context.homeLocation==null && (_domain.type=="service" || _domain.type=="food")){

        
        setShowmodal(!showModal);
        setServices([]);
        setService("");  
      }
    }

    if (_domain.type == "shopping") {
      setService(_domain.services[0].serviceName.fr);

      flatlistRef.current.scrollToEnd({ animated: true })
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
          setPartnersSearched(_partners)
        }).catch(err => { console.log(err); alert("error") })
      }
    }
    setDomain(_domain);   
    goUp()
  }

  const handleServicePartners = (service) => {

    setService(service.serviceName.fr);
    setPartners([]);
    setPartnersSearched([])
    setServicePartners([]);
    setServicePartnersSearched([])
    
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
                  setPartnersSearched(_partners)
                }
              }

              else {
                _service_partners.push(partnerData)
                setServicePartners(_service_partners);
                setServicePartnersSearched(_service_partners)
              }
            }
          }
          ).catch(err => console.log(err))

        })
      }

      else {
        setPartners([]);
        setServicePartnersSearched([]);
        setPartnersSearched([]);
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
        setPartnersSearched(_partners)
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

  const checkRegion = (item,_domain) => {
    if(context.homeLocation==null){
      setShowmodal(!showModal);
      context.setHomeLocation({region:item});
    }

    setSearchedProducts([]);
    setPartnersSearched([]);
    setServicePartnersSearched([]);
    setSelectedCity(null);
    setPartners([]);
    setServices([]);
    setServicePartners([]);
    

    setSelectedRegion(selectedRegion);
    setShowPicker(!showPicker);
    setRegionPicker(!regionPicker);


    let _services = [];
    const index = regions.findIndex(region => { return region._id == item });
    if (index >= 0) {
      _services = [...regions[index].services];
      setAddress({ ...address, region: regions[index].regionName })
      let _services_filtered = [..._domain.services.filter(service => _services.findIndex(s => { return s == service._id }) >= 0)];

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
                    setPartnersSearched(_partners)
                  }
                }

                if (_domain.type == "service") {
                  _servicePartners.push(partnerData);
                  setServicePartners(_servicePartners);
                  setServicePartnersSearched(_servicePartners)
                }
              }
            }
            ).catch(err => console.log(err))
          })
        }

        else {
          setPartners([]);
          setPartnersSearched([]);
          setServicePartnersSearched([]);
          setServicePartners([]);
        }
      }
      else {
        setServices([]);
      }

    }

  }
  const checkProduct = (item)=>{
    if(item.type=="food"){
        props.navigation.navigate("food",{product:item,last:"Home"})
                    }
    else {
    props.navigation.navigate("singleProduct",{product:item,last:"Home"})
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
    props.navigation.navigate("conversation", { conversation:conversation, home: true })
  }




  const checkBasket = () => {
    props.navigation.navigate("basket", { last_screen: "Home" });

  }

  const openDrawer = () => {
    props.navigation.openDrawer();
  }





  const checkPartner = (value) => {
    props.navigation.navigate("singleBrand", { partner: value, lastScreen: "Home",last:null })
  }
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: context.location ? context.location.location ? Number(context.location.location.latitude) : 33.8869 :  33.8869,
          longitude: context.location ? context.location.location ? Number(context.location.location.longitude) :9.5375 : 9.5375
          , latitudeDelta: 0.05,
          longitudeDelta: 0.05
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
                    latitude: friendLocation ? friendLocation.location ? Number(friendLocation.location.latitude) : 0:0,
                    longitude: friendLocation ?friendLocation.location ? Number(friendLocation.location.longitude) : 0:0
                  } :
                  {
                    latitude: friendLocation ?friendLocation.location ? Number(friendLocation.location.latitude) : 0:0,
                    longitude: friendLocation ?friendLocation.location ? Number(friendLocation.location.longitude) : 0:0
                  }
              }
             
            >
              <Image source={friendLocation.user ? friendLocation.user.photo ? { uri: friendLocation.user.photo } : require("../assets/user_image.png"):require("../assets/user_image.png")} style={{ height: 30, width: 30, borderRadius: 30, borderColor: "#2474F1", borderWidth: 2 }} />
            {
             Platform.OS=='android'?
             <Callout tooltip>
              <View style={{width:Dimensions.get("screen").width*0.22,flexDirection:"row",alignItems:"center",borderRadius:8,height:Dimensions.get("screen").width*0.14,backgroundColor:"white"}}>
                <View style={{height:"90%",width:"4%"}}></View>
                <View style={{height:"90%",width:"4%",backgroundColor:"#2474F1",borderRadius:8}}>
                </View>
                <View style={{height:"90%",width:"70%",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                  <Text style={{fontFamily:"Poppins",fontSize:Dimensions.get("screen").width*0.02}}>{(friendLocation.user.firstName+" "+friendLocation.user.lastName).length>10 ?(friendLocation.user.firstName+" "+friendLocation.user.lastName).substring(0,10)+"..":friendLocation.user.firstName+" "+friendLocation.user.lastName }</Text>
                  <Text style={{fontFamily:"Poppins",fontSize:Dimensions.get("screen").width*0.02}}>{"2h: 45min"}</Text>
                  <Text style={{fontFamily:"Poppins",fontSize:Dimensions.get("screen").width*0.02}}>{friendLocation.user.phone}</Text>
                  {( 
                     orders.findIndex(order => { return order.deliveryOrder.clientDeliverer && order.deliveryOrder.clientDeliverer._id && friendLocation.user._id==order.deliveryOrder.clientDeliverer._id }) >= 0
                  )
                  ?   <View style={{width:"80%",borderRadius:10,flexDirection:"column",justifyContent:"center",alignItems:"center",height:Dimensions.get("screen").width*0.04,backgroundColor:"#2474F1"}}>
                  <Text style={{fontFamily:"Poppins",fontSize:Dimensions.get("screen").width*0.02,color:"white"}}>{"Delivery man"}</Text>
                  </View>:null}
                
                </View>
                <View style={{height:"90%",width:"24%",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                    <TouchableOpacity style={{width:"100%",height:"60%"}} onPress={()=>{console.log("ok")}}>
                      <Image style={{width:"80%",height:"80%",resizeMode:"contain"}} source={require("../assets/images/messenger.png")}/>
                    </TouchableOpacity>
                </View>
             </View>
           </Callout>:
           <CalloutSubview>
             <View style={{width:Dimensions.get("screen").width*0.22,flexDirection:"row",alignItems:"center",borderRadius:8,height:Dimensions.get("screen").width*0.14,backgroundColor:"white"}}>
                <View style={{height:"90%",width:"4%"}}></View>
                <View style={{height:"90%",width:"4%",backgroundColor:"#2474F1",borderRadius:8}}>
                </View>
                <View style={{height:"90%",width:"70%",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                  <Text style={{fontFamily:"Poppins",fontSize:Dimensions.get("screen").width*0.02}}>{(friendLocation.user.firstName+" "+friendLocation.user.lastName).length>10 ?(friendLocation.user.firstName+" "+friendLocation.user.lastName).substring(0,10)+"..":friendLocation.user.firstName+" "+friendLocation.user.lastName }</Text>
                  <Text style={{fontFamily:"Poppins",fontSize:Dimensions.get("screen").width*0.02}}>{"2h: 45min"}</Text>
                  <Text style={{fontFamily:"Poppins",fontSize:Dimensions.get("screen").width*0.02}}>{friendLocation.user.phone}</Text>
                  {( 
                     orders.findIndex(order => { return order.deliveryOrder.clientDeliverer && order.deliveryOrder.clientDeliverer._id && friendLocation.user._id==order.deliveryOrder.clientDeliverer._id }) >= 0
                  )
                  ?   <View style={{width:"80%",borderRadius:10,flexDirection:"column",justifyContent:"center",alignItems:"center",height:Dimensions.get("screen").width*0.04,backgroundColor:"#2474F1"}}>
                  <Text style={{fontFamily:"Poppins",fontSize:Dimensions.get("screen").width*0.02,color:"white"}}>{"Delivery man"}</Text>
                  </View>:null}
                
                </View>
                <View style={{height:"90%",width:"24%",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                    <TouchableOpacity style={{width:"100%",height:"60%"}} onPress={()=>{console.log("ok")}}>
                      <Image style={{width:"80%",height:"80%",resizeMode:"contain"}} source={require("../assets/images/messenger.png")}/>

                    </TouchableOpacity>

                </View>

             </View>
           </CalloutSubview> 
            }           
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
      <Animated.View style={context.darkMode ?
        {
          width: "100%",
          height: Dimensions.get("screen").height*1.4,
          zIndex:1,
          elevation:1,
          position: "absolute", backgroundColor: "black",
         
          top: Dimensions.get('screen').height * 0.64, flexDirection: "column"
          , transform: [{ translateX: position.x }, { translateY: position.y }]
        } :
        {
          width: "100%",
          height: Dimensions.get("screen").height*1.4,
          zIndex:1,
          elevation:1,
          position: "absolute", backgroundColor: "white",
          top: Dimensions.get('screen').height * 0.64, flexDirection: "column"
          , transform: [{ translateX: position.x }, { translateY: position.y }]
        }
      }>

      </Animated.View>

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
                fontFamily: 'PoppinsBold', fontSize: Dimensions.get("window").width * 0.06,
                color: "white"
              }}>{context.user?context.user.location ?  context.user.location.locationCode  ?  context.user.location.locationCode.toUpperCase():"":"":""}</Text>
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
          {width: "84%",
          height: Dimensions.get("screen").height * 0.045,

            position: "absolute",
            left: "14%", 

            backgroundColor: "#333333",
            marginTop: Platform.OS == 'ios' ? 40 : 30,
            flexDirection: "row",
            borderRadius: 12,
          zIndex:1,
            elevation: 1,

        
          

          } :
          {
            width: "84%",
            height: Dimensions.get("screen").height * 0.045,

            position: "absolute",
            left: "14%",
            zIndex:1,

            backgroundColor: "#f7f7f7",
            marginTop: Platform.OS == 'ios' ? 40 : 30,
            flexDirection: "row",
            borderRadius: 12,
            elevation: 1,

           
          
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
          borderRadius: 12,
        }}>
          <TextInput
            style={context.darkMode ? { width: "100%", color: "white", height: Dimensions.get("screen").height * 0.045 } : { width: "100%", color: "black", height: Dimensions.get("screen").height * 0.045 }}
            placeholderTextColor={"#B5B5B5"}
            value={search}
            onFocus={()=>{setStartSearch(!startSearch)}}
            onChangeText={(text)=>{searchProducts(text)}}
            placeholder={"Search"}
          />
        </View>
        <View style={{
          width: "35%",
          height: "100%",
          borderRadius: 12,
          flexDirection: "row",
          justifyContent: "center",

        }}>

          <View style={{ width: "30%", height: "100%", flexDirection: "column",justifyContent: "center", alignItems: "flex-end" }}>
            <TouchableOpacity style={{ width: "100%", height: "100%", }} onPress={()=>{checkBasket()}}>
              <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={context.darkMode ? require("../assets/homeBagDark.png") : require("../assets/homeBag.png")} />
              <View style={{ width: Dimensions.get("screen").width * 0.035, height: Dimensions.get("screen").width * 0.035, backgroundColor: "red", borderRadius: 12, flexDirection: "column", justifyContent: "center", alignItems: "center", position: "absolute", top: "55%", right: "14%" }}>
              <Text style={{ fontFamily: 'Poppins', fontSize: 10, color: "white" }}>{context.bag}</Text>
            </View>
            </TouchableOpacity>
          
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
                        <Image style={{ width: 50, height: 50, borderRadius: 50, resizeMode: "contain" }} source={item.photo ? { uri: item.photo } : item.profileImage ? { uri: item.profileImage } : require("../assets/user_image.png")} />
                      </View>
                      <View style={{
                        width: "60%", height: "100%", flexDirection: "column",
                        justifyContent: "center"
                      }}>

                        <Text style={{ marginHorizontal: 15, fontFamily: 'Poppins', fontSize: 15 }}>{item.firstName ? item.firstName + " " + item.lastName : item.partnerName}</Text>
                      </View>
                      <View style={{ width: "20%", height: "100%", flexDirection: "column", justifyContent: "center" }}>
                        <View style={ context.profile && context.profile._id &&context.profile._id === item._id ? { width: 30, height: 30, borderRadius: 30, borderColor: "#2474F1", borderWidth: 8, alignSelf: "center" } : { width: 30, height: 30, borderRadius: 30, borderColor: "#dbdbdb", borderWidth: 1, alignSelf: "center" }}></View>
                      </View>

                    </View>
                  </TouchableOpacity>

                )
                }
                keyExtractor={item => (item._id+ new Date().toISOString())}
              >
              </FlatList>
              <View style={{ width: "100%", height: "10%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <ScrollView   onScrollBeginDrag={() => {modalDown(); }}>
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
                      <TouchableOpacity onPress={() => { setCityPicker(!cityPicker) ;if(cityPickerRef.current){cityPickerRef.current.show();} }} style={{ flexDirection: "row", width: "100%", height: "100%", justifyContent: 'flex-start' }}>
                        <Image style={{ marginLeft: 8, width: "12%", height: "100%", resizeMode: "contain" }} source={require("../assets/picker_up.png")} />
                        <View style={{ width: "88%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <Text style={{ fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.05, color: "white", }}>{address ? address.city : ""}</Text>
                        </View>
                      </TouchableOpacity> :
                      <Picker
                        ref={cityPickerRef}
                        
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

                      <TouchableOpacity style={{ flexDirection: "row", width: "100%", height: "100%", justifyContent: 'flex-start' }} onPress={() => { if (selectedCity) { setShowPicker(!showPicker);context.setHomeLocation(null); setRegionPicker(!regionPicker) } else alert("please choose city first") }}>
                        <Image style={{ marginLeft: 8, width: "12%", height: "100%", resizeMode: "contain" }} source={require("../assets/picker_up.png")} />
                        <View style={{ width: "88%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <Text style={{ fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.05, color: "white", }}>{address ? address.region : ""}</Text>
                        </View>

                      </TouchableOpacity>
                      :

                      <Picker
                      ref={regionPickerRef}

                        style={Platform.OS == 'ios' ? { width: "100%", height: "100%", justifyContent: "flex-end", flexDirection: "column" } : {}}
                        selectedValue={selectedRegion}
                        onValueChange={(itemValue, itemIndex) => { checkRegion(itemValue,domain) }}
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

 

      <Animated.View style={{
        width: "100%",
        height: Dimensions.get("screen").height * 0.8,
        position: "absolute",
        zIndex:5,
        elevation:3,
        top: Dimensions.get('screen').height * 0.6, flexDirection: "column"
        , transform: [{ translateX: alignement.x }, { translateY: alignement.y }]
      }}>
        <View style={{ width: "100%", height: "10%" }}>
          <FlatList
            horizontal
            ref={flatlistRef}
            showsHorizontalScrollIndicator={false}
            data={domains}
            renderItem={({ item }) => (
              <View key={item._id} style={styles.domainsContainer}>
                <TouchableOpacity disabled={domains.length==0} onPress={() => { checkDomain(item) }}>
                  <View style={domain && domain.name.fr == item.name.fr ? context.darkMode ? styles.serviceChosenDark : styles.serviceChosen : context.darkMode ? styles.serviceDark : styles.service} >
                    <Image style={{ width: Dimensions.get("screen").width * 0.12, height: Dimensions.get("screen").width * 0.12, borderRadius: Dimensions.get("screen").width * 0.12, resizeMode: "cover" }} source={item.image ? item.image : require("../assets/images/food.png")} />
                    <Text style={context.darkMode ? { color: "white", fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.035 } :
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
        <View style={{ width: "100%", height: "4%", marginVertical: 3 }}>
          <View style={{width:"90%",height:"100%",flexDirection:"row",alignSelf:"center",justifyContent:"space-between"}}>
                  


                <View style={{width:"60%",height:"100%"}}>
                 {startSearch&& <TouchableOpacity onPress={()=>{setSearchBoutique(!searchBoutique)}} style={{width:"100%",height:"100%",flexDirection:"row",alignSelf:"center",alignItems:"center"}}>

                  <View style={!searchBoutique ? {
                      width:Dimensions.get("screen").width*0.04,
                      height:Dimensions.get("screen").width*0.04,
                      borderRadius:Dimensions.get("screen").width*0.04,backgroundColor:"white",borderWidth:3,marginRight:Dimensions.get("screen").width*0.03,borderColor:'#2474F1'}:
                      {
                        width:Dimensions.get("screen").width*0.04,
                        height:Dimensions.get("screen").width*0.04,
                        borderRadius:Dimensions.get("screen").width*0.04,backgroundColor:"#2474F1",borderWidth:3,marginRight:Dimensions.get("screen").width*0.03,borderColor:'white'}
                      
                      }>

                    </View>

                    <Text style={context.darkMode ? { color: "white", fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.03 } :
                      { color: "black", fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.03 }}>Boutique</Text>
                                  </TouchableOpacity>}

                  </View>
                 {context.homeLocation && domain && (domain.type == "food" || domain.type == "service")&& <View style={{width:"40%",height:"100%",flexDirection:"row",justifyContent:"flex-end"}}>
                    <View style={{width:"20%",height:"100%"}}>
                     <TouchableOpacity onPress={()=>{setShowmodal(!showModal)}} style={{width:Dimensions.get("screen").width*0.05,borderRadius:Dimensions.get("screen").width**0.05, height:Dimensions.get("screen").width*0.05}}>
                      <View style={{width:Dimensions.get("screen").width*0.05,flexDirection:"column",justifyContent:"center",backgroundColor:"white",alignItems:"center",
                      height:Dimensions.get("screen").width*0.05,borderRadius:Dimensions.get("screen").width*0.05}}>
                        <Image style={{width:"70%",height:"70%",resizeMode:"cover"}} source={require("../assets/images/draw.png")}/>
                      </View>
                      </TouchableOpacity>
                    </View>
                    </View>}
          </View>
        </View>

        <View style={{ width: "100%", height: "82%", marginVertical: 3 }}>
          {partnersSearched.length>0&&searchedProducts.length==0 ?
            <FlatList
              onScrollBeginDrag={slidepartners}
              data={partnersSearched}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) =>
                <Partner
                navigation={props.navigation}
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
            partnersSearched.length==0&&
            partners.length==0&&
            searchedProducts.length==0&&
            servicePartnersSearched.length > 0 ?
              <FlatList
                data={servicePartnersSearched}
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
                searchedProducts.length>0?
                <View style={{ width: "100%", height: Dimensions.get("screen").height, marginVertical: 3 }}>
                <FlatList
                data={searchedProducts}
                numColumns={3}
                renderItem={({ item }) =>
                  <TouchableOpacity onPress={()=>{checkProduct(item)}} style={{       margin: 4,
    height: Dimensions.get("screen").height*0.25,
  width: "30%"}}>
    <View  style={context.darkMode ? styles.productDark   : styles.product}>
    <Image style={styles.productImage} source={{uri:item.mainImage}} />
   <View style={{height:"20%",width:"100%",flexDirection:"column"}}>
   <Text style={ context.darkMode ? styles.productTitleDark:styles.productTitle}>{item.name.length>13?item.name.substring(0,13)+'...':item.name}</Text>
    <Text style={context.darkMode ? styles.productTitleDark:styles.productTitle}>{item.description?item.description:"no description"}</Text>
    <Text style={context.darkMode ?{fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03,
color: "white",
fontWeight: "300"
}: {fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.02,
color: "black"} }>{item.basePrice} DT</Text>
   </View>
  


  </View>
  </TouchableOpacity>
                }
                keyExtractor={item => item._id}
              >

              </FlatList>  
                </View>
              
              
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
    height: "40%",
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: "cover"
  },
  productTitle: {
    fontFamily:'PoppinsBold',
    fontSize: Dimensions.get("screen").width*0.03,
    color: "black",
  },
  productTitleDark: {
    fontFamily:'PoppinsBold',
    fontSize: Dimensions.get("screen").width*0.03,
    color: "white",
},
  product: {
    height: 200,
    width: "100%",
    marginHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 8
  },

  productDark: {
    height: 200,
    width: "100%",
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





 


  
 

  container: {
    flex: 1
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
    height: Dimensions.get("screen").height * 0.03,
    width: Dimensions.get("screen").height * 0.03,
    marginTop: Platform.OS == 'ios' ? 40 : 35,

    position: "absolute",
    left: "4%",
    elevation:1,
    zIndex:1,
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

