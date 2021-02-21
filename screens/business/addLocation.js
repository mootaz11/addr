import React, { useContext, useState,useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity,TouchableHighlight, SafeAreaView, Modal,Alert, TextInput } from 'react-native'


import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { addPartnerLocalisation, deletePartnerLocation } from '../../rest/partnerApi';
import AuthContext from '../../navigation/AuthContext';



export default function addLocation(props) {
    const context = useContext(AuthContext);
    const [dark, setDark] = useState(false);
    const [openModal, setOpenModal] = useState(false)
    const [address, setAddress] = useState("")
    const [partnerLocations, setPartnerLocations] = useState([]);
    const [selectedLocation,setSelectedLocation]=useState();


    
    useEffect(() => {
         setPartnerLocations(context.partner.localisations);
        return () => {
        }
    }, [])
    const openDrawer = () => {
        props.navigation.openDrawer();

    }
    const addNewLocationHandler = async  () => {
        let { status } =  await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
         Alert.alert('Permission to access location was denied');}
         else {
         const _location =await Location.getCurrentPositionAsync({});

         const location= {
                 lat:_location.coords.latitude,
                  lng:_location.coords.longitude  
         }
         addPartnerLocalisation(context.partner._id, location).then(_localisation => {
            setPartnerLocations(partnerLocations => [...partnerLocations, _localisation]);
        })
    }
}
    const addNewLocationByMapHandler = (evt) => {
        const localisation = evt.nativeEvent.coordinate;
        addPartnerLocalisation(context.partner._id, {lng:localisation.longitude,lat:localisation.latitude}).then(_localisation => {
            setPartnerLocations(partnerLocations => [...partnerLocations, _localisation]);
        })
    }
    const getPosition = () => {}

    const deleteLocation =()=>{ 
        deletePartnerLocation(context.partner._id,selectedLocation).then(message=>{
            setOpenModal(!openModal)
            setPartnerLocations(partnerLocations.filter(location=>location._id!=selectedLocation._id))
            Alert.alert('',"localisation deleted ! ", [{ text: "OK" }],{cancelable:false})
        }).catch(err=>{
            alert("operation failed")
        })

    }
    const selectLocation=(location)=>{
        setSelectedLocation(location);
        setOpenModal(!openModal)
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={dark ? styles.containerDark : styles.container}>
                <View style={dark ? styles.menuDark : styles.menu}>
                    <View style={styles.leftArrowContainer}>
                        <View >
                            <TouchableOpacity onPress={openDrawer} style={{ height: 30, width: 30 }}>
                                <Image source={context.darkMode ? require("../../assets/menu_dark.png") : require("../../assets/menu.png")} style={{ height: "100%", width: "100%", resizeMode: "cover" }} />
                            </TouchableOpacity>
                        </View>
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
                            ,latitudeDelta: 0.5,
                            longitudeDelta: 0.5
                  


                        }}
                        
                        onPress={(evt) => { addNewLocationByMapHandler(evt) }}
                        style={{ flex: 1 }}
                        customMapStyle={darkStyle}
                        provider="google"
                    >

                        {
                            partnerLocations.length > 0
                            && partnerLocations.map((location) => (
                                <Marker
                                    key={location._id}
                                    onPress={()=>{selectLocation(location)}}
                                    draggable={true}
                                    coordinate={
                                        Platform.OS == 'ios' ?
                                            {
                                                latitude: location.lat,
                                                longitude: location.lng
                                            } :
                                            {
                                                latitude: Number(location.lat)
                                                ,
                                                longitude: Number(location.lng)

                                            }



                                    }
                                >
                                    <Image source={context.partner.profileImage ? { uri: context.partner.profileImage } : require('../../assets/logoAddresti.png')} style={{ height: 40, width: 40, borderRadius: 40, }} />

                                </Marker>

                            ))
                        }

                    </MapView>
                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={openModal}
                                    >
                                        <View style={styles.centeredViewModal}>
                                            <View style={styles.modalContainer}>
                                                <View style={styles.variantInputTitleContainer}>
                                                    <Text style={{textAlign:"center"}}>location selected : </Text>
                                                </View>
                                                <View style={{flexDirection:"column"}}>
                                                    <Text style={{textAlign:"center",marginVertical:5}}>Longitude : {selectedLocation ? selectedLocation.lng:""}</Text>
                                                    <Text style={{textAlign:"center",marginVertical:5}}>Latitude : {selectedLocation ?selectedLocation.lat:""}</Text>

                                                </View>
                                                <View style={styles.modalButtonsContainer}>

                                                    <TouchableHighlight
                                                        style={{ ...styles.modalButton, backgroundColor: '#2196F3' }}
                                                        onPress={deleteLocation}>
                                                        <Text style={{color:"white"}}>delete location</Text>
                                                    </TouchableHighlight>

                                                    <TouchableHighlight
                                                        style={{ ...styles.openButton, backgroundColor: '#fa382a' }}
                                                        onPress={() => {
                                                           setOpenModal(!openModal)
                                                        }}>
                                                        <Text style={{color:"white"}}>Cancel</Text>
                                                    </TouchableHighlight>

                                                </View>

                                            </View>
                                        </View>

                                    </Modal>
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
    centeredViewModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center'
    },
    modalButton: {
        borderRadius: Dimensions.get('window').height * 0.0255, //20
        padding: Dimensions.get('window').height * 0.013, //10
        marginVertical: Dimensions.get('window').height * 0.013,//10
        elevation: 2,
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center"
    },
    openButton: {
        borderRadius: Dimensions.get('window').height * 0.0255,
        padding: Dimensions.get('window').height * 0.013,
        elevation: 2,
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center"
    },
    modalContainer: {
        margin: Dimensions.get('window').height * 0.0255, //20
        backgroundColor: 'white',
        borderRadius: Dimensions.get('window').height * 0.0255, //20
        padding: Dimensions.get('window').height * 0.0256, //20
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addLocation: {
        width: "50%",
        height: 40,
        position: "absolute",
        marginLeft: 10,
        top: "70%",
    },
    getPosition: {
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
        justifyContent: "center",
        marginTop: 5
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
