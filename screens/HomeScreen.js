import React, { useState ,useContext,useEffect} from 'react'
import { StyleSheet, Dimensions, View, Image, Platform, Text, Clipboard, Modal, SafeAreaView,Alert,Linking,TouchableOpacity} from 'react-native';
export default function Home({navigation}){
  return (<View></View>)
}
/*
import MapView, { Marker } from 'react-native-maps';
import { Icon, SearchBar } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import _ from 'lodash';
import AuthContext from '../navigation/AuthContext';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';


const api_directions_key = "AIzaSyDcbXzRxlL0q_tM54tnAWHMlGdmPByFAfE";
const partnersData = [
  {
    name:"papadom",
    image:require("../assets/mootaz.jpg")
  },
  {
    name:"papadom",
    image:require("../assets/mootaz.jpg")
  },{
    name:"papadom",
    image:require("../assets/mootaz.jpg")
  }
]

const cities = [
  { value: "Monastir", key: "1" },
  { value: "Sousse", key: "2" },
  { value: "Béja", key: "3" },
  { value: "Kairouan", key: "4" },
  { value: "Gafsa", key: "5" },
  { value: "Guebili", key: "6" },
  { value: "Tunis", key: "7" },
  { value: "Manouba", key: "8" },
  { value: "Ariana", key: "9" },
  { value: "Ben Arous", key: "10" },
  { value: "Sfax", key: "11" },
  { value: "Médenine", key: "12" },
  { value: "Tataouine", key: "13" },
  { value: "Bizerte", key: "14" },
  { value: "Kef", key: "15" },
  { value: "Tozeur", key: "16" },
  { value: "Kasserine", key: "17" },
  { value: "Jendouba", key: "18" },
  { value: "Seliana", key: "19" },
  { value: "Gabes", key: "20" },
  { value: "Zaghouan", key: "21" },
  { value: "Nabeul", key: "22" },
  { value: "Sidi Bouzid", key: "23" },
  { value: "Mahdia", key: "24" },]



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
  const [user,setUser]=useState(context.user);
  const [dark,setDark] = useState(context.darkMode);
  const [dropDown, setdropDown] = useState(false);
  const [Markers, setMarkers] = useState([]);
  const [location, setLocation] = useState(null);
  const [temporaryLocation, setTemporaryLocation] = useState(false);
  
  const [partners, setPartners] = useState([]);

  const [smartCode, setSmartCode] = useState(context.user.locationCode);
  const [domain, setDomain] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(cities);
  const [city, setCity] = useState("");
  const [showModal,setShowmodal]=useState(false);
  useEffect(()=>{
    if(!user.locationState){
      Alert.alert(
        "Are you at Home",
        "press yes if you are",
        [
          {
            text: "yes",
            onPress: () => {

            },
            style: "ok"
          },
          { text: "no", onPress: async () => {
              const _location =await Location.getCurrentPositionAsync({});
              const body ={locationCode: user.locationCode,
              location: {
                      latitude:_location.coords.latitude,
                       longitude:_location.coords.longitude  
              },
              user: user._id
              }
              context.updateUserLocation(body);
          } }
        ],
        { cancelable: false }
      );
  
    }
  },[])

  useEffect(()=>{
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
      }
      
      let location = await Location.getCurrentPositionAsync({});
      setLocation({latitude:location.coords.latitude,longitude:location.coords.longitude});
    })();

    setDark(context.darkMode);
  },[location,context.darkMode,context.user])




  const filtreList = (text) => {
    setSearch(text)
    const query = text.toLowerCase();
    const citiesResult = _.filter(cities, city => {
      return _.includes(city.value.toLowerCase(), query)
    })
    setSearchResult(citiesResult)
  }

  const LeaveHome = () => {
    if (temporaryLocation) {
      setTemporaryLocation(false);
      //back to home
    }
    else {
      setTemporaryLocation(true);
      //change temporary location 
    }
  }

  const checkProfile = () => {
    navigation.navigate("Settings")

  }


  const _pressCall =()=>{
    let phoneNumber = "28896426";

    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${"28896426"}`;
    }
    else  {
      phoneNumber = `tel:${"28896426"}`;
    }    Linking.openURL(phoneNumber)

  }



  const openDrawer = () => {
    navigation.openDrawer();
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
        customMapStyle={ dark ? darkStyle : defaultStyle}
        provider="google"
      >
        <Marker
          coordinate={{
            latitude: location ? location.latitude : 0

            ,
            longitude:location ? location.longitude : 0

          }}
        >
          <Image  source={  require('../assets/mootaz.jpg') } style={{ height: 30, width: 30, borderRadius: 30,borderColor:"white" ,borderWidth:2}} />

        </Marker>

        <Marker
          coordinate={{
            latitude: 35.7773,
            longitude: 10.8313

          }}

        >
          <Image source={require('../assets/mootaz.jpg')} style={{ height: 30, width: 30, borderRadius: 30,borderColor:"white" ,borderWidth:2}} />

        </Marker>
        <MapViewDirections
          apikey={api_directions_key}
           origin={location}
          destination={{
            latitude: 35.7773,
            longitude: 10.8313

          }}
          strokeWidth={3}
          strokeColor= { dark ? "#24A9E1":"#3d3d3d"}      
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
          <Image style={styles.imageUser} source={user.photo ? {uri:user.photo} : require('../assets/user_image.png')} />
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
            <TouchableOpacity onPress={LeaveHome}>
              <Text style={styles.codeManup}>postion temporaire({temporaryLocation ? "activé" : "desactivé"})</Text>
            </TouchableOpacity>
          </View>

        </View>
        : null
      }
      <View style={styles.searchBar}>
        <Icon name="search" color={"#24A9E1"} />
        <TextInput onChange={()=>{setShowmodal(true)}} style={styles.searchInput} placeholder="Rechercher votre ville " placeholderTextColor="white" />
     </View>



      <ScrollView horizontal
        style={styles.domains}
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
            domains.map((value, index) => {
            return (
              <View style={styles.domainsContainer} key={index}>
                <TouchableOpacity onPress={() => { setDomain(value.title) }}>
                  <View style={domain == value.title ? styles.serviceChosen : styles.service} >
                    <Image style={styles.imageService} source={value.imageDark} />
                  </View>

                </TouchableOpacity>
                <Text style={styles.servicetitle}>{value.title}</Text>
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
          domains.map((value, index) => {
            return (
              <View style={styles.partnersContainer} key={index}>
                  <View style={styles.SinglePartner} >
                    <View style={styles.PartnerImageContainer}></View>
                    <View style={styles.operations}>
                     
                      <View style={styles.call}>
                      <TouchableOpacity style={{width:"100%",height:"100%"}} onPress={_pressCall}>

                      <Image style={styles.messagingImage} source={require("../assets/phone-call.png")}/>
                      </TouchableOpacity>

                      </View>


                      <View style={styles.messaging}>
                        <TouchableOpacity style={{width:"100%",height:"100%"}} >
                        <Image   style={styles.messagingImage}  source={require("../assets/speech-bubble.png")}/>

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
        animationType={'fade'}

      >
        <View style={{ flex: 1, width: Dimensions.get("screen").width, height: Dimensions.get("screen").height, marginTop: "3%", backgroundColor: "white" }}>
          <SearchBar
            placeholder="Type Here..."
            value={search}
            onChangeText={filtreList}

          />

          <SafeAreaView style={styles.container}>
            <FlatList
              data={searchResult}
              renderItem={({ item }) =>
                <TouchableOpacity onPress={() => { setCity(item.value); console.log(city);setShowmodal(false) }}>

                  <View  style={styles.City}>
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.value}</Text>

                  </View>
                </TouchableOpacity>

              }

              keyExtractor={item => item.key}
            />
          </SafeAreaView>

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
    width: "20%",
    height: "94%",
    overflow: "hidden"

  },
  partnersContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "20%",
    height: "94%",
    overflow: "hidden"

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
  domains: {
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
  },
  SinglePartner:{

    
      margin: 4,
      borderRadius: 10,
      width: 180,
      height: "92%",
      alignItems: "flex-start",
      backgroundColor: '#24A9E1',
      flexDirection:"row",
      shadowOffset:{width:3,height:3},
      shadowOpacity:0.3,
      borderRadius:8,
      shadowColor:"white",
      
    },
    PartnerImageContainer:{
      backgroundColor:"#24A9E1",
      width:"70%",
      height:"100%",
      shadowColor:"white",
      shadowOffset:{width:3,height:3},
      shadowOpacity:0.3,
      borderRadius:8
    },
    operations:{
      backgroundColor:"#219dd1",
      width:"30%",
      height:"100%",
      flexDirection:"column",
      alignItems:"flex-start",
      shadowColor:"white",
      shadowOffset:{width:3,height:3},
      shadowOpacity:0.3,
      borderRadius:8,
      zIndex:50,
      elevation:10,
      borderColor:"white",
      borderWidth:0.2


    },
    call:{
      width:"100%",
      height:"50%",
      shadowColor:"white",
      shadowOffset:{width:3,height:3},
      shadowOpacity:0.3,
      borderRadius:8,
      zIndex:50,
      elevation:10,
      borderColor:"white",
      borderWidth:0.2,
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center"
    },
    messaging:{
        width:"100%",
        height:"50%",
        backgroundColor:"#219dd1",
        shadowColor:"white",
        shadowOffset:{width:3,height:3},
        shadowOpacity:0.3,
        borderRadius:8,
        zIndex:50,
        elevation:10,
        borderColor:"white",
        borderWidth:0.2,
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        
    },
    messagingImage:{
      width:"100%",
      height:"100%",
      resizeMode:"contain",
      shadowColor:"white",
      shadowOffset:{width:2,height:2}
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