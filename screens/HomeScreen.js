import React, { useState, useContext, useEffect, useRef } from 'react'
import { StyleSheet, Dimensions, View, Image, Platform, Text, Clipboard, Modal, SafeAreaView, Alert, Linking, TouchableOpacity,Keyboard  } from 'react-native';
export default function Home(props){
  return (<View></View>)
}
/*import MapView, { Marker } from 'react-native-maps';
import { Icon, SearchBar } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, TextInput } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import _ from 'lodash';
import AuthContext from '../navigation/AuthContext';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapViewDirections from 'react-native-maps-directions';
import { getCities, getRegion,getService } from '../rest/geoLocationApi'
import {getPartner} from '../rest/partnerApi';

const api_directions_key = "AIzaSyDcbXzRxlL0q_tM54tnAWHMlGdmPByFAfE";
const partnersData = [
  {
    name: "papadom",
    image: require("../assets/papadom.png")
  },
  {
    name: "Bershka",
    image: require("../assets/bershka.jpg")
  }, {
    name: "papadom",
    image: require("../assets/mootaz.jpg")
  }
]


//Services : every service contains the service title and two images one for the dark mode  and the other for the regular mode
const domains = [
  { title: "Livreur", imageDark: require("../assets/delivery-bike-dark.png"), image: require("../assets/delivery-bike.png") },
  { title: "Food", imageDark: require("../assets/fast-food-dark.png"), image: require("../assets/fast-food.png") },
  { title: "Traveaux ", imageDark: require("../assets/builder-dark.png"), image: require("../assets/builder.png") },
  { title: "Taxi", imageDark: require("../assets/taxi-dark.png"), image: require("../assets/taxi.png") },
  { title: "Urgence", imageDark: require("../assets/ambulance-dark.png"), image: require("../assets/ambulance.png") }
];


export default function Home({ navigation }) {
  const context = useContext(AuthContext);
  const searchInput = useRef()
  const [user, setUser] = useState(context.user);
  const [dark, setDark] = useState(context.darkMode);
  const [dropDown, setdropDown] = useState(false);
  const [Markers, setMarkers] = useState([]);
  const [location, setLocation] = useState(context.location);
  const [temporaryLocation, setTemporaryLocation] = useState(false);
  const [partners, setPartners] = useState([]);
  const [seviceChosen, setServiceChosen] = useState(false);
  const [smartCode, setSmartCode] = useState(context.user.locationCode);
  const [domain, setDomain] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [city, setCity] = useState("");
  const [showModal, setShowmodal] = useState(false);
  const [cities, setCities] = useState([]);
  const [services,setServices]=useState([]);
  const [regions, setRegions] = useState([]);
  const [locationState, setLocationState] = useState(context.locationState)
  useEffect(() => {


    getCities().then(cities => {
      setCities(cities),
        setSearchResult(cities)
    }).catch(
      err => { alert("getting cities error") }
    )


    // if(!locationState){
    //   Alert.alert(
    //     "Are you at Home",
    //     "press yes if you are",
    //     [
    //       {
    //         text: "yes",
    //         onPress: () => {
    //             context.updateUserLocationState(user._id)
    //         },
    //         style: "ok"
    //       },
    //       { text: "no", onPress: async () => {


    //         let { status } =  await Permissions.askAsync(Permissions.LOCATION);

    //          if (status !== 'granted') {
    //           Alert.alert('Permission to access location was denied');
    //                        }
    //           else {
    //           const _location =await Location.getCurrentPositionAsync({});


    //           const body ={locationCode: user.locationCode,
    //           location: {
    //                   latitude:_location.coords.latitude,
    //                    longitude:_location.coords.longitude  
    //           },
    //           userId: user._id
    //           }
    //         context.updateUserLocation(body);
    //       }

    //     }

    //     }
    //     ],
    //     { cancelable: false }
    //   );

    // }
  }, [context.location, context.locationState, context.temporaryLocation])







  useEffect(() => {
    if (!context.location) {
      (async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);


        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
        }
        else {
          let location = await Location.getCurrentPositionAsync({});
          setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        }
      })();
    }

    else {
      if (context.location.temperarlyLocation) {
        setLocation({
          latitude: context.location.temperarlyLocation.latitude
          , longitude: context.location.temperarlyLocation.longitude
        });
        setTemporaryLocation(true);
      }
      else {
        setLocation({
          latitude: context.location.location.latitude
          , longitude: context.location.location.longitude
        });
      }
    }



    setDark(context.darkMode);
  }, [context.darkMode])




  const filtreList = (text) => {
    setSearch(text)
    const query = text.toLowerCase();
    const citiesResult = _.filter(cities, city => {
      return _.includes(city.cityName.toLowerCase(), query)
    })
    setSearchResult(citiesResult)
  }

  const turnTemporaryLocation = async () => {
    if (temporaryLocation) {
      setTemporaryLocation(false);
      context.deleteTemprorayLocation();
    }
    else {
      setTemporaryLocation(true);
      let _location = await Location.getCurrentPositionAsync();
      context.handleTemporaryLocation({
        location: {
          latitude: _location.coords.latitude,
          longitude: _location.coords.longitude
        }
      }
        , user._id)
    }
  }

  const checkProfile = () => {
    navigation.navigate("Settings")

  }

const handleServicePartners= (service)=>{
  var partners_ids = []
  service.partnersRegions.map(partnerRegion=>{
    partnerRegion.partners.map(_partner=>{
      if(partners_ids.indexOf(_partner)>=0){}
      else {partners_ids.push(_partner)}

    })

  })
  partners_ids.map(_id=>{
      getPartner(_id).then(data=>{
         let index = partners.findIndex(partner=>{return partner._id == data.partner._id})
         if(index==-1){
            setPartners([...partners,data.partner])
       }
      
      
        }).catch(err=>alert("no partners found"))
  })

  setDomain(service.serviceName); 
  setServiceChosen(true);

}
  const _pressCall = () => {
    let phoneNumber = "28896426";

    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${"28896426"}`;
    }
    else {
      phoneNumber = `tel:${"28896426"}`;
    } Linking.openURL(phoneNumber)

  }



  const openDrawer = () => {
    navigation.openDrawer();
  }
  const handleItemCheck = (item) => {
    if(!regions){
      setRegions(item.regions);
    }
    else {
      setShowmodal(false);
      item.services.forEach(service_id=>{
        getService(service_id).then(_service=>{setServices(services=>[...services,_service])}).catch(err=>{alert("getting service error")})
      })

      setRegions(null);

    }
  }
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: 35.7643,
          longitude: 10.8113,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}

        style={styles.container}
        customMapStyle={dark ? darkStyle : defaultStyle}
        provider="google"
      >
        <Marker
          coordinate={
            Platform.OS == 'ios' ?
              {
                latitude: location ? location.latitude : 0

                ,
                longitude: location ? location.longitude : 0

              } :
              {
                latitude: location ? Number(location.latitude) : 0

                ,
                longitude: location ? Number(location.longitude) : 0

              }



          }
        >
          <Image source={require('../assets/mootaz.jpg')} style={{ height: 30, width: 30, borderRadius: 30, borderColor: "white", borderWidth: 2 }} />

        </Marker>

        <Marker
          coordinate={{
            latitude: 35.7773,
            longitude: 10.8313

          }}

        >
          <Image source={require('../assets/mootaz.jpg')} style={{ height: 30, width: 30, borderRadius: 30, borderColor: "white", borderWidth: 2 }} />

        </Marker>
        <MapViewDirections
          apikey={api_directions_key}
          origin={location}
          destination={{
            latitude: 35.7773,
            longitude: 10.8313

          }}
          strokeWidth={3}
          strokeColor={dark ? "#24A9E1" : "#3d3d3d"}
        />

      </MapView>

      <View style={styles.Mycode}>
        <View style={styles.dropDownContainer}>
          <TouchableOpacity onPress={() => { if (dropDown) { setdropDown(false) } else { setdropDown(true) } }}>

            <Image style={styles.dropDown} source={dropDown ? require("../assets/up.png") : require("../assets/down.png")} />
          </TouchableOpacity>
        </View>

        <Text style={styles.smartCode}>Smart Code:{smartCode}</Text>
      </View>

      <View style={styles.menu}>
        <Icon color={"white"} style={{ flex: 1, padding: 0 }} name="menu" onPress={openDrawer} />
      </View>

      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={checkProfile}>
          <Image style={styles.imageUser} source={user.photo ? { uri: user.photo } : require('../assets/user_image.png')} />
        </TouchableOpacity>

      </View>

      {dropDown ?
        <View style={styles.geoInfo}>
          <View style={styles.coordinatesSettings}>
            <Image style={styles.coordSettingsIcon} source={require("../assets/copy-dark.png")} />
            <TouchableOpacity onPress={() => { Clipboard.setString(user.locationCode) }}>
              <Text style={styles.codeManup}>copier mon code</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.coordinatesSettings}>
            <Image style={styles.coordSettingsIcon} source={require("../assets/share-dark.png")} />
            <Text style={styles.codeManup}>partager mon code</Text>
          </View>
          <View style={styles.coordinatesSettings}>
            <Image style={styles.coordSettingsIcon} source={require("../assets/temporary-dark.png")} />
            <TouchableOpacity onPress={turnTemporaryLocation}>
              <Text style={styles.codeManup}>postion temporaire({temporaryLocation ? "activé" : "desactivé"})</Text>
            </TouchableOpacity>
          </View>

        </View>
        : null
      }
      <View style={styles.searchBar}>
        <Icon name="search" color={"#24A9E1"} />
        <TextInput value={city} ref={searchInput} onChangeText={(text) => { setCity(text) }} onFocus={() => { setShowmodal(true) }} style={styles.searchInput} placeholder="Rechercher votre ville " placeholderTextColor="white" />
      </View>



      <ScrollView horizontal
        style={seviceChosen ? styles.domainswithPartners : styles.domainswithoutPartners}
        showsHorizontalScrollIndicator={false}


        //ios
        contentInset={{
          top: 0,
          left: 0,
          bottom: 0,
          right: "50%"
        }}
        //android
        contentContainerStyle={{
          paddingRight: Platform.OS == 'android' ? 20 : 0

        }}
      >
        {
          services && services.map((service) => {
            return (
              <View style={styles.domainsContainer} key={service._id}>
                <TouchableOpacity onPress={() => { handleServicePartners(service) }}>
                  <View style={domain == service.serviceName ? styles.serviceChosen : styles.service} >
                    <Image style={styles.imageService} source={{uri:service.icon}} />
                  </View>

                </TouchableOpacity>
                <Text style={styles.servicetitle}>{service.serviceName}</Text>
              </View>

            )
          }
          )
        }
      </ScrollView>



      <ScrollView horizontal
        style={styles.partners}
        showsHorizontalScrollIndicator={false}


        //ios
        contentInset={{
          top: 0,
          left: 0,
          bottom: 0,
          right: "50%"
        }}
        //android
        contentContainerStyle={{
          paddingRight: Platform.OS == 'android' ? 20 : 0

        }}
      >
        {
          seviceChosen && partners.map(partner => {
            return (
              <View style={styles.partnersContainer} key={partner._id}>
                <View style={styles.SinglePartner} >
                  <View style={styles.PartnerImageContainer}>
                    <Image style={styles.partnerImage} source={require("../assets/adidas.jpg")} />
                    <Text style={styles.partnerTitle}>{partner.partnerName}</Text>

                  </View>
                  <View style={styles.operations}>

                    <View style={styles.call}>
                      <TouchableOpacity style={{ width: "100%", height: "100%" }} onPress={_pressCall}>

                        <Image style={styles.messagingImage} source={require("../assets/phone-call.png")} />
                      </TouchableOpacity>

                    </View>


                    <View style={styles.messaging}>
                      <TouchableOpacity style={{ width: "100%", height: "100%" }} >
                        <Image style={styles.messagingImage} source={require("../assets/speech-bubble.png")} />

                      </TouchableOpacity>
                    </View>
                  </View>

                </View>

              </View>

            )
          }
          )
        }




      </ScrollView>





      { showModal &&
        <Modal
          transparent={true}
          animationType={'slide'}


        >
          <View style={{ backgroundColor: "#000000aa", flex: 1 }}>

            <View style={{ flex: 1, width: Dimensions.get("screen").width * 0.9, height: Dimensions.get("screen").height * 0.8, margin: 40, alignSelf: "center", backgroundColor: "white" }}>
              <View style={{ width: "100%", height: "20%" }}
              >
                <SearchBar
                  placeholder="Type Here..."
                  value={search}
                  onChangeText={filtreList}

                />
              </View>


              <View style={{ width: "100%", height: "65%", flexDirection: "column" }}>
                <FlatList
                  data={regions ? regions : searchResult}
                  renderItem={({ item }) =>
                    <TouchableOpacity onPress={() => { handleItemCheck(item) }}>

                      <View style={styles.City}>
                        <Text style={{ fontSize: 18, fontWeight: "600" }}>{regions ? item.regionName :item.cityName}</Text>

                      </View>
                    </TouchableOpacity>

                  }

                  keyExtractor={item => item._id}
                />
              </View>
              <View style={{ width: "100%", height: "15%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity  onPress={()=>
                {
                  setRegions(null);
                  setShowmodal(false);

                }
                  
              } style={{ width: "50%", height: "70%", borderRadius: 18, backgroundColor: "#2474f1",}}>
                  <View style={{ width: "100%", height: "100%",flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: Dimensions.get("window").width * 0.06, color: "white" }}>close</Text>
                  </View>
                </TouchableOpacity>

              </View>

            </View>
          </View>

        </Modal>

      }
    </View>

  );

}


const styles = StyleSheet.create({
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
    width: 70,
    height: "94%",
    overflow: "hidden"

  },
  partnersContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: 180,
    marginRight: 8,
    height: "94%",
    overflow: "hidden",

  },



  servicetitle: {
    color: "white"
  },
  imageService: {
    width: "40%",
    height: "40%",
    resizeMode: "contain"
  },
  searchInput: {
    backgroundColor: 'rgba(0,0,0,0)',
    width: "100%",
    height: 20,
    color: "white"
  },
  container: {
    flex: 1
  },


  imageUser: {
    flex: 1,
    width: 25,
    height: 25,
    borderRadius: 50,
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
  Mycode: {
    position: "absolute",
    top: "11%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "row",
    alignSelf: "center",
    padding: 10,
    shadowOpacity: 0.5,
    elevation: 10,
    width: "96%",
    height: "9%",
    borderRadius: 10,
    backgroundColor: "#24A9E1",
    justifyContent: "flex-start",
    alignContent: "space-between",
    alignItems: "flex-start"
  },
  geoInfo: {
    position: "absolute",
    top: "22%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "column",
    alignSelf: "center",
    padding: 10,
    shadowOpacity: 0.5,
    elevation: 10,
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
    fontSize: 15
  },
  dropDown: {
    width: "100%",
    height: "100%",
  },
  dropDownContainer: {
    width: "10%",
    height: "100%",
    marginHorizontal: 10,

  },
  smartCode: {
    fontSize: 20,
    color: "white",
    fontWeight: "700"
  },
  menu: {

    position: "absolute",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "row",
    alignSelf: "flex-start",
    padding: 10,
    shadowOpacity: 0.5,
    elevation: 10,

  },
  searchBar: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "row",
    padding: 10,
    shadowOpacity: 0.5,
    elevation: 10,
    width: "80%",
    height: "8%",
    borderRadius: 10,
  },
  domainswithoutPartners: {
    position: "absolute",
    top: "74%",
    left: "14%",
    height: "18%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
  },
  domainswithPartners: {
    position: "absolute",
    top: "55%",
    left: "14%",
    height: "18%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
  },
  partners: {
    position: "absolute",
    top: "74%",
    left: "14%",
    height: "18%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
    flexWrap: "wrap"
  },
  SinglePartner: {


    margin: 4,
    borderRadius: 10,
    width: 180,
    height: "92%",
    alignItems: "flex-start",
    backgroundColor: '#24A9E1',
    flexDirection: "row",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    borderRadius: 8,
    shadowColor: "white",

  },
  PartnerImageContainer: {
    backgroundColor: "#24A9E1",
    width: "70%",
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
  operations: {
    backgroundColor: "#219dd1",
    width: "30%",
    height: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    shadowColor: "white",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    borderRadius: 8,
    zIndex: 50,
    elevation: 10,
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
    elevation: 10,
    borderColor: "white",
    borderWidth: 0.2,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  messaging: {
    width: "100%",
    height: "50%",
    backgroundColor: "#219dd1",
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
    shadowOffset: { width: 2, height: 2 }
  },
  service: {
    margin: 4,
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(128,128,128,0.6)',

  },
  serviceChosen: {
    margin: 4,
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#24A9E1',
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

*/