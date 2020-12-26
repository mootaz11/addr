import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Dimensions, View, Image, Platform, Text, Clipboard, Modal, Alert,Share, Linking, TouchableOpacity,Keyboard  } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import { Icon, SearchBar } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import _ from 'lodash';
import AuthContext from '../navigation/AuthContext';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapViewDirections from 'react-native-maps-directions';
import { getCities,getService } from '../rest/geoLocationApi'
import {getPartner} from '../rest/partnerApi';

const api_directions_key = "AIzaSyDcbXzRxlL0q_tM54tnAWHMlGdmPByFAfE";

const services_init = [
  {_id:1,serviceName:"taxi",icon:require("../assets/taxi-dark.png")},
  {_id:2,serviceName:"delivery",icon:require("../assets/delivery-bike-dark.png")},
  {_id:3,serviceName:"building",icon:require("../assets/builder-dark.png")},
  {_id:4,serviceName:"food",icon:require("../assets/fast-food-dark.png")},
  {_id:5,serviceName:"emergency",icon:require("../assets/ambulance-dark.png")}
]


export default function Home(props) {

  const context = useContext(AuthContext);
  const [dropDown, setdropDown] = useState(false);
  const [location, setLocation] = useState(context.location);
  const [temporaryLocation, setTemporaryLocation] = useState(false);
  const [partners, setPartners] = useState(null);
  const [seviceChosen, setServiceChosen] = useState(false);
  const [domain, setDomain] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showModal, setShowmodal] = useState(false);
  const [cities, setCities] = useState([]);
  const [services,setServices]=useState([]);
  const [regions, setRegions] = useState([]);
  const [initServices,setInitServices]=useState();

  useEffect(() => {
    setServices(services_init);
    setPartners(null);
    setServiceChosen(false)
    setCities([]);
    setInitServices(true)
    setSearchResult([]);
    getCities().then(cities =>{
    setCities(cities)
    setSearchResult(cities)
  }).catch(err=>{alert("getting cities error")})
  return ()=>{setCities([]);setServices([]);setPartners([]);setDomain(null)}  
},[props.route.params])


  useEffect(() => {    
    if(!context.user.locationState){
      Alert.alert(
        "Are you at Home",
        "press yes if you are",
        [
          {
            text: "yes",
            onPress: async () => {
              let { status } =  await Permissions.askAsync(Permissions.LOCATION);

              if (status !== 'granted') {
               Alert.alert('Permission to access location was denied');
                            }
               else {
               const _location =await Location.getCurrentPositionAsync({});

               const location= {
                       latitude:_location.coords.latitude,
                        longitude:_location.coords.longitude  
               }
               
                  context.updateUserLocation(location,true);
              }
                },
            style: "ok"
          },
          { text: "no", onPress: async () => {

             let { status } =  await Permissions.askAsync(Permissions.LOCATION);

              if (status !== 'granted') {
               Alert.alert('Permission to access location was denied');}

               else {
               const _location =await Location.getCurrentPositionAsync({});

               const location= {
                       latitude:_location.coords.latitude,
                        longitude:_location.coords.longitude  
               }
               
             context.updateUserLocation(location,false);
           }

        }

        }
        ],
        { cancelable: false }
      );

    }
   }, [context.user])


useEffect(()=>{
  if(context.location){
  if (context.location.temperarlyLocation.latitude!=null&&context.location.temperarlyLocation.longitude!=null) 
  {
    setTemporaryLocation(true);
  }
  else {
    setTemporaryLocation(false);

  }
}
},[context.location])

  const filtreList = (text) => {
    setSearch(text)
    const query = text.toLowerCase();
    const citiesResult = _.filter(cities, city => {
      return _.includes(city.cityName.toLowerCase(), query)
    })
    setSearchResult(citiesResult)
  }

  const turnTemporaryLocation = async () => {
    if (context.location.temperarlyLocation.latitude!=null&&context.location.temperarlyLocation.longitude!=null) {     
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
        , context.user._id)
    }
  }

  const checkProfile = () => {
    props.navigation.navigate("Settings")
  }

const handleServicePartners= (service)=>{
  if(!initServices){
  var partners_ids = []
  var  _partners=[];
  
   service.partnersRegions.map(partnerRegion=>{
    partnerRegion.partners.map(_partner=>{
      if(partners_ids.indexOf(_partner)>=0){}
      else {partners_ids.push(_partner)}
    })
  })
  partners_ids.map(_id=>{
      getPartner(_id).then(data=>{
         let index = _partners.findIndex(partner=>{return partner._id == data.partner._id})
         if(index==-1){
           if(_partners.length<4)
           {
          _partners.push(data.partner);
          if(_partners.length==3 || partners_ids.length<3){
            _partners.push({partnerName:"see Others",_id:55,serviceName:service.serviceName})
          }
          setPartners(_partners);
        }

        }          
        }).catch(err=>alert("no partners found"))
  })
  }




setDomain(service.serviceName); 
setServiceChosen(true);


}

const startPartnerConversation =(partner)=>{
  let users_id=[]
  partner.managers.forEach(manager=>{
    users_id.push(manager.user);
  })
  users_id.push(context.user._id);
  users_id.push(partner.owner._id);
  const conversation =  context.openConversationHandler({},{users_id},"group",partner);
  console.log(conversation);
  props.navigation.navigate("conversation",{conversation,home:true})
}





const checkService =(item)=>{
  props.navigation.navigate("brand",{serviceName:item.serviceName})
}

const shareCode=async()=>{
  try {
      const shareResponse =await Share.share({message:context.user.locationCode.toString()});

  } catch (error) {
    console.log(error)
  }
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
    props.navigation.openDrawer();
  }

  const handleItemCheck = (item) => {
    if(!regions){
      setRegions(item.regions);
      setPartners(null);
      setServices(null);
    }
    else {
      setRegions(null);
      setShowmodal(false);
    
      let _services=[];
      item.services.forEach(service_id=>{
        getService(service_id).then(_service=>{
            if(_services.findIndex(s=>{return s._id ==_service._id})==-1)
          { 
            _services.push(_service);
          }
          setInitServices(false);
          setServices(_services);
        }).catch(err=>{console.log(err)})
      })
    }
  }
const checkPartner=(value)=>{
  props.navigation.navigate("singleBrand",{partner:value,lastScreen:"Home"})
}
  return (
    <View style={styles.container}>
      <MapView
         initialRegion={{
          latitude: context.location ?context.location.location ? Number(context.location.location.latitude) : 0:0,
          longitude: context.location ? context.location.location?Number(context.location.location.longitude) : 0:0
          ,latitudeDelta: 0.5,
          longitudeDelta: 0.5// * (Dimensions.get("window").width / Dimensions.get("window").height )
          ,latitudeDelta: 0.5,
          longitudeDelta: 0.5// * (Dimensions.get("window").width / Dimensions.get("window").height )

        }}

        style={styles.container}
        customMapStyle={context.darkMode ?darkStyle : defaultStyle}
        provider="google"
        
      >
        <Marker
          coordinate={
            Platform.OS == 'ios' ?
              {
                latitude: context.location ?context.location.location ? Number(context.location.location.latitude) : 0:0,
                longitude: context.location ? context.location.location?Number(context.location.location.longitude) : 0:0
      
              } :
              {
                latitude: context.location ?context.location.location ? Number(context.location.location.latitude) : 0:0,
                longitude: context.location ? context.location.location?Number(context.location.location.longitude) : 0:0
      
              }



          }
        >
          <Image source={context.user.photo ? {uri:context.user.photo} : require('../assets/mootaz.jpg')} style={context.darkMode ? { height: 30, width: 30, borderRadius: 30, borderColor: "white", borderWidth: 2 }: { height: 30, width: 30, borderRadius: 30, borderColor: "#2474F1", borderWidth: 2 }} />

        </Marker>

        <Marker
          coordinate={{
            latitude: 35.7773,
            longitude: 10.8313

          }}

        >
          <Image source={require('../assets/mootaz.jpg')} style={context.darkMode ? { height: 30, width: 30, borderRadius: 30, borderColor: "white", borderWidth: 2 }: { height: 30, width: 30, borderRadius: 30, borderColor: "#2474F1", borderWidth: 2 }} />

        </Marker>
        <MapViewDirections
          apikey={api_directions_key}
          origin={context.location ? context.location.location ? context.location.location : context.location.temperarlyLocation:null}
          destination={{
            latitude: 35.7773,
            longitude: 10.8313

          }}
          strokeWidth={3}
          strokeColor={context.darkMode ? "#2474F1" : "#3d3d3d"}
        />

      </MapView>

      <View style={styles.Mycode}>
        <View style={styles.dropDownContainer}>
          <TouchableOpacity style={{width:"100%",height:"100%"}} onPress={() => { setdropDown(!dropDown)}}>
              <Image style={styles.dropDown} source={dropDown ? require("../assets/up.png") : require("../assets/down.png")} />
          </TouchableOpacity>
        </View>

        <Text style={styles.smartCode}>Smart Code:{context.user.locationCode}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity onPress={()=>{openDrawer()}}>
          <Image source={context.darkMode ?  require("../assets/menu_dark.png"):require("../assets/menu.png")} style={{height:30,width:30,resizeMode:"cover"}}/>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={checkProfile}>
          <Image style={styles.imageUser} source={context.user.photo ? { uri: context.user.photo } : require('../assets/user_image.png')} />
        </TouchableOpacity>

      </View>

      {dropDown ?
        <View style={styles.geoInfo}>
          <View style={styles.coordinatesSettings}>
            <Image style={styles.coordSettingsIcon} source={require("../assets/copy-dark.png")} />
            <TouchableOpacity onPress={() => { Clipboard.setString(context.user.locationCode) }}>
              <Text style={styles.codeManup}>copier mon code</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.coordinatesSettings}>

            <Image style={styles.coordSettingsIcon} source={require("../assets/share-dark.png")} />
            <TouchableOpacity onPress={(shareCode)}>

            <Text style={styles.codeManup}>partager mon code</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.coordinatesSettings}>
            <Image style={styles.coordSettingsIcon} source={require("../assets/temporary-dark.png")} />
            <TouchableOpacity onPress={()=>{turnTemporaryLocation()}}>
              <Text style={styles.codeManup}>postion temporaire({temporaryLocation ? "activé" : "desactivé"})</Text>
            </TouchableOpacity>
          </View>

        </View>
        : null
      }
      <View style={seviceChosen && partners ?  styles.searchBarAfterSetService:styles.searchBar}>
        <Icon name="search" size={Dimensions.get("window").width*0.08} color={"#2474F1"} />
        <TouchableOpacity onPress={() => { setShowmodal(true) }}>
          
        <Text   style={context.darkMode ? styles.searchInputDark : styles.searchInput} >Rechercher votre ville</Text>
        </TouchableOpacity>

      </View>



<View        style={seviceChosen&&partners&&partners.length>0 ?styles.domainswithPartners : styles.domainswithoutPartners}>
        
        <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
          data={services}
          renderItem={({item})=>(
            <View style={styles.domainsContainer}>
            <TouchableOpacity onPress={() => { handleServicePartners(item) }}>
              <View style={domain == item.serviceName ? styles.serviceChosen : styles.service} >
                <Image style={styles.imageService} source={initServices ? item.icon : {uri:item.icon}} />
              </View>

            </TouchableOpacity>
            <Text style={styles.servicetitle}>{item.serviceName}</Text>
          </View>

          )}
 
            keyExtractor={item=>item._id}
 >



        </FlatList>
 
      </View>



    { partners && seviceChosen&&partners.length>0 &&   <View style={styles.partners}>
        <FlatList
          data={partners}
          horizontal
          renderItem={({item})=>(
            <View style={styles.partnersContainer}>
            <View style={styles.SinglePartner} >
              <TouchableOpacity onPress={()=>{item.partnerName=="see Others" ? checkService(item) : checkPartner(item)}} style={item.partnerName!="see Others" ?{width: "70%",height: "100%",}:{width: "100%",height: "100%"}}>
              <View style={styles.PartnerImageContainer}>
                
                {item.partnerName!="see Others" &&<Image style={styles.partnerImage} source={{uri:item.profileImage}} />}
                <Text style={item.partnerName!="see Others" ? styles.partnerTitle:styles.showmore}>{item.partnerName}</Text>

              </View>
              </TouchableOpacity>
             { item.partnerName!="see Others" && <View style={styles.operations}>

                <View style={styles.call}>
                  <TouchableOpacity style={{ width: "100%", height: "100%" }} onPress={_pressCall}>
                    <Image style={styles.messagingImage} source={require("../assets/phone-call.png")} />
                  </TouchableOpacity>

                </View>

                <View style={styles.messaging}>
                  <TouchableOpacity onPress={()=>{startPartnerConversation(item)}} style={{ width: "100%", height: "100%" }} >
                    <Image style={styles.messagingImage} source={require("../assets/speech-bubble.png")} />

                  </TouchableOpacity>
                </View>
              </View>

            }
              </View>
          
          </View>

          )}
          keyExtractor={item=>{item._id}}
        >
        </FlatList>
</View>
}



     
        <Modal
          transparent={true}
          animationType={'slide'}
          visible={showModal}


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
    width: Dimensions.get("window").width*0.25,
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
    color: "white"
  },
  imageService: {
    width: "40%",
    height: "40%",
    resizeMode: "contain"
  },
  searchInput: {
    color: "black",
    textDecorationLine:'underline',
    fontSize:Dimensions.get("window").width*0.045

  },
  searchInputDark:{
    color: "white",
    textDecorationLine:'underline',
    fontSize:Dimensions.get("window").width*0.045
  }
  ,

  container: {
    flex: 1
  },


  imageUser: {
    flex: 1,
    width: 32,
    height: 32,
    borderRadius: 32,
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
    backgroundColor: "#2474F1",
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
    fontSize: Dimensions.get("window").width*0.07,
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
    left: "14%",
    height: "18%",
    width:"86%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
  },
  domainswithPartners: {
    position: "absolute",
    top: "55%",
    width:"86%",
    left: "14%",
    height: "18%",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    elevation: 10,
  },
  partners: {
    position: "absolute",
    top: "74%",
    left: "14%",
    width:"86%",
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
  showmore:{
    color: "white",
    fontWeight: "500",
    fontSize:Dimensions.get("window").width*0.06,
    textAlign:"center"
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
    width: "80%",
    height: "80%",
    resizeMode: "contain",
    shadowColor: "white",
    shadowOffset: { width: 2, height: 2 },
  },
  
  service: {
    margin: 4,
    borderRadius: Dimensions.get("window").width*0.2,
    width: Dimensions.get("window").width*0.2,
    height: Dimensions.get("window").width*0.2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(128,128,128,0.6)',

  },
  serviceChosen: {
    margin: 4,
    borderRadius: Dimensions.get("window").width*0.2,
    width: Dimensions.get("window").width*0.2,
    height: Dimensions.get("window").width*0.2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#2474F1',
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

