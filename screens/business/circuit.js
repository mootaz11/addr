import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, SafeAreaView, Modal, TextInput } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import { Icon } from 'react-native-elements';
import AuthContext from '../../navigation/AuthContext';
import MapViewDirections from 'react-native-maps-directions';
const api_directions_key = "AIzaSyDcbXzRxlL0q_tM54tnAWHMlGdmPByFAfE";
import FontAwesome from 'react-native-vector-icons/FontAwesome';



export default function circuit(props) {
    const context = useContext(AuthContext)
    
    const openDrawer = () => {
        props.navigation.openDrawer();
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={context.darkMode ? styles.containerDark : styles.container}>
                <View style={context.darkMode ? styles.menuDark : styles.menu}>
                    <View style={styles.leftArrowContainer}>
                        <TouchableOpacity onPress={openDrawer} style={styles.leftArrow}>
                        <Image source={context.darkMode ?  require("../../assets/menu_dark.png"):require("../../assets/menu.png")} style={{height:"100%",width:"100%",resizeMode:"cover"}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Follow packages</Text>
                    </View>


                </View>
                <View style={styles.mapContainer}>




                    <MapView
                        initialRegion={{
                            latitude: 35.7643,
                            longitude: 10.8113,
                            longitudeDelta:0.5,
                            latitudeDelta:0.0922

                        }}

                        style={{ flex: 1 }}
                        customMapStyle={darkStyle}
                        provider="google"
                    >
                          <Marker
                                  coordinate={{
                                    latitude: 35.7000,
                                    longitude: 10.8113
                                  }}
                                >
                             <FontAwesome color={"red"} style={{ padding: 0, fontFamily:'Poppins',fontSize: 20, }} name="close" />
                        
                                </Marker>
                            <Marker
                                  coordinate={{
                                    latitude: partner.location.latitude,
                                    longitude: partner.location.longitude
                        
                                  }}
                        
                                >
                                  <Image source={partner.image} style={{ height: 40, width: 40, borderRadius: 30,borderColor:"white" ,borderWidth:2}} />
                        
                                </Marker>
                        {
                            deliverers && deliverers.map((deliverer,index)=>
                                (
                                
                                    <Marker
                                    key={index}
                                  coordinate={{
                                    latitude: deliverer.location.latitude,
                                    longitude: deliverer.location.longitude
                        
                                  }}
                        
                                >
                                  <Image source={deliverer.image} style={{ height: 40, width: 40, borderRadius: 30,borderColor:"white" ,borderWidth:2}} />
                        
                                </Marker>
                        
                                )
                            )
                            
                        }
      {
                            deliverers && deliverers.map((deliverer,index)=>
                                (
                                
                                    <MapViewDirections
                                    key={index}
                                    apikey={api_directions_key}
                                    origin={{
                                        latitude: partner.location.latitude,
                                        longitude: partner.location.longitude
                            
                                      }}
                                    destination={{
                                        latitude:deliverer.location.latitude,
                                        longitude: deliverer.location.longitude
                            
                                      }}
                                    strokeWidth={3}
                                    strokeColor={ index %2==0 ? "#24A9E1" : "#eb4034" }
                                />
                                )
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
                        <Text style={{ color: "white", textAlignVertical: "center", marginLeft: 5, fontFamily:'Poppins',fontSize: 16 }}>Parcel location</Text>
                    </View>
                </View>


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
        marginTop:10
    },
    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",
        marginTop:10

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
        marginTop:10
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
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.08
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
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.08,
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

