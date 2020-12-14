import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, SafeAreaView,Modal,TextInput } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


//import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Icon } from 'react-native-elements';
import { addPartnerLocalisation } from '../../rest/partnerApi';
import AuthContext from '../../navigation/AuthContext';



export default function addLocation(props) {
    return (<View></View>)}
/*    const context = useContext(AuthContext);
    const [dark, setDark] = useState(false);
    const [openModal,setOpenModal]=useState(false)
    const [address,setAddress]=useState("")
    const [partnerLocations,setPartnerLocations]=useState([]);
    const openDrawer = () => {
        props.navigation.openDrawer();

    }
    const addNewLocationHandler=()=>{
     
    }
    const addNewLocationByMapHandler=(evt)=>{
        const localisation = evt.nativeEvent.coordinate;
        addPartnerLocalisation(context.partner._id,localisation).then(_localisation=>{
            setPartnerLocations(partnerLocations=>[...partnerLocations,_localisation]);
        })
    }
    const getPosition=()=>{}
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={dark ? styles.containerDark : styles.container}>
                <View style={dark ? styles.menuDark : styles.menu}>
                    <View style={styles.leftArrowContainer}>
                        <TouchableOpacity style={styles.leftArrow}>
                            <Icon color={"black"} style={{ padding: 4, alignSelf:"center",justifyContent: "center" }} name="menu" onPress={openDrawer} />

                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.Title}>add Location</Text>
                    </View>


                </View>
                <View style={styles.mapContainer}>
                    <MapView
                        initialRegion={{
                            latitude: 35.7643,
                            longitude: 10.8113


                        }}
                        on
                        onPress={(evt)=>{addNewLocationByMapHandler(evt)}} 
                        style={{ flex: 1 }}
                        customMapStyle={darkStyle}
                        provider="google"
                    >
                                            
                      {
                      partnerLocations.length>0 
                      && partnerLocations.map((location)=>(
                        <Marker
                        key={location._id}
                        draggable={true}
                        onDragEnd={(evt)=>{handleChangeAddress(evt)}}
  coordinate={
    Platform.OS=='ios' ?
    {
    latitude:Number( location.latitude) 

    ,
    longitude:Number (location.longitude)

  } :
  {
    latitude:  Number(location.latitude) 

    ,
    longitude:Number(location.longitude) 

  }



}
>
  <Image  source={ context.partner.profileImage ? {uri:context.partner.profileImage}: require('../../assets/logoAddresti.png') } style={{ height: 40, width: 40,borderRadius:40,}} />

</Marker>

                      )) 
                      }
        
                    </MapView>
                    <TouchableOpacity style={styles.addLocation} onPress={addNewLocationHandler}>
                        <View style={{
                            flexDirection: "row", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <Image style={{ width: 30, height: 30, resizeMode: "cover" }} source={require("../../assets/addlocation.png")} />
                            <Text style={{ color: "white", textAlignVertical: "center", fontSize: 16 }}>Add new location</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.getPosition} onPress={getPosition}>
                        <View style={{
                            flexDirection: "row", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <Image style={{ width: 30, height: 30, resizeMode: "cover" }} source={require("../../assets/pin.png")} />
                            <Text style={{ color: "white", textAlignVertical: "center", fontSize: 16 }}>Get position</Text>
                        </View>
                    </TouchableOpacity>
                </View>
              


            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    addLocation: {
        width: "50%",
        height: 40,
        position: "absolute",
        marginLeft: 10,
        top: "70%",
    },
    getPosition:{
        width: "40%",
        height: 40,
        position: "absolute",
        marginLeft: 10,
        top: "80%",

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
    },
    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",

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
        fontSize: 28
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
        fontSize: 28,
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
*/
