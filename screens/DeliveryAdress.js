import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text, TextInput,Modal } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import AuthContext from '../navigation/AuthContext';
import {getDeliveryOptions} from '../rest/ordersApi';
import FeedbackListItem from '../common/FeedbackListItem';


export default function deliveryAdress(props) {
    const [locationChosen, setlocationChosen] = useState(true);
    const [deliveryOption, setDeliveryOption] = useState(null);
    const [deliveryOptions,setDeliveryOptions]=useState([]);
    const context = useContext(AuthContext);
    const [openModal,setOpenModal]=useState(false);
    const [location,setLocation] =useState(null)
    const [phone,setPhone]=useState('');
    
    useEffect(()=>{
            if(context.user.phone){
                setPhone(context.user.phone);
            }



        if(context.location&&context.location.location){
        setLocation({
            lat:context.location.location.latitude,
            lng:context.location.location.longitude
        })


        let _location = {lat:context.location.location.latitude,
            lng:context.location.location.longitude
}
        getDeliveryOptions(props.route.params.partner,{location:_location}).then(data=>{
            setDeliveryOption({Time:data.deliveryInfo.deliveryTime
                ,Type:data.deliveryInfo.deliveryType,
                Price:data.deliveryInfo.deliveryPrice,
               Name:data.deliveryPartner.partnerName,
                id:data.deliveryPartner._id})
        }).catch(err=>{
            
        })    
}


},[props.route.params,context.location])            
    
    const goBack = () => {
        props.navigation.goBack({ products: props.route.params.products })
     //   props.navigation.navigate("bag", { products: props.route.params.products })
    }



    const saveAdress=()=>{

    setOpenModal(!openModal);
    setlocationChosen(!locationChosen);  
       let _location = {...location}
    getDeliveryOptions(props.route.params.partner,{location:_location}).then(data=>{
        console.log(data.deliveryPartner.partnerName);
        setDeliveryOption({...deliveryOption,Time:data.deliveryInfo.deliveryTime
            ,Type:data.deliveryInfo.deliveryType,
            Price:data.deliveryInfo.deliveryPrice,
           Name:data.deliveryPartner.partnerName,
            id:data.deliveryPartner._id})
    })
    
    }

    const handleChangeAddress = async (evt)=>{
        let _location = evt.nativeEvent.coordinate;
        setLocation( {
            lat:_location.latitude,
            lng:_location.longitude})}

    

    const checkReview = () => {
        if(deliveryOptions){

       
        if(phone.length>0){
            
            props.navigation.navigate("orderReview", { order: props.route.params.order,
                phone:phone,
                orderDestination:location,
                deliveryPartner:deliveryOption,
                productVariants:props.route.params.productVariants,
                ingredients:props.route.params.ingredients
            })      
        }

        else {
            alert("please set your phone number");
        }
    }
    else {
        alert("no delivery options")
    }
    }
    return (
        <SafeAreaView >
            <View style={context.darkMode ? styles.containerDark : styles.container}>

                <View style={context.darkMode ? styles.menuDark : styles.menu}>
                    <TouchableOpacity style={styles.leftArrowContainer} onPress={goBack}>
                        <View >
                            <Image style={styles.leftArrow} source={context.darkMode ? require("../assets/left-arrow-dark.png") : require("../assets/left-arrow.png")} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={context.darkMode ? styles.TitleDark : styles.Title}>delivery address</Text>
                    </View>

                </View>


                <View style={styles.infoadressContainer}>
                    <View style={styles.getDeliveryTo}>
                        <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: 20, fontWeight: "700", color: "white" } : { fontFamily:'Poppins',fontSize: 20, fontWeight: "700" }}>Get delivery to your</Text>
                    </View>
                    <TouchableOpacity style={locationChosen ? styles.otherPosition : (context.darkMode ? styles.homeDark : styles.home)} onPress={() => { setlocationChosen(locationChosen => !locationChosen) }}>
                        <View style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <Text style={locationChosen ? { fontFamily:'Poppins',fontSize: 18, fontWeight: "400", color: "white" } : (context.darkMode ? { fontFamily:'Poppins',fontSize: 18, fontWeight: "400", color: "white" } : { fontFamily:'Poppins',fontSize: 18, fontWeight: "400", color: "black" })}>Home</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={!locationChosen ? styles.otherPosition : (context.darkMode ? styles.homeDark : styles.home)} onPress={() => {setOpenModal(openModal=>!openModal);setlocationChosen(locationChosen => !locationChosen) }}>
                        <View style={{ width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <Text style={!locationChosen ? { fontFamily:'Poppins',fontSize: 18, fontWeight: "400", color: "white" } : (context.darkMode ? { fontFamily:'Poppins',fontSize: 18, fontWeight: "400", color: "white" } : { fontFamily:'Poppins',fontSize: 18, fontWeight: "400", color: "black" })}>Other position</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={context.darkMode ? styles.phoneNumberContainerDark : styles.phoneNumberContainer}>
                        <Image style={{ width: "20%", height: "50%", resizeMode: "contain" }} source={require("../assets/phone_delivery.png")} />
                        <TextInput  placeholder={"PHONE NUMBER"} value={phone} onChangeText={(text)=>{setPhone(text)}} placeholderTextColor={context.darkMode ? "white" : "#bfbfbf"} style={context.darkMode ? { width: "80%", height: "50%", borderBottomColor: "#121212" } : { width: "80%", height: "50%", borderBottomColor: "#bfbfbf", }} />
                    </View>


                </View>

                <View style={{ width: "100%", height: "10%", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                    <View style={context.darkMode ? { borderColor: "white", borderWidth: 1, width: "94%", height: 1 } : { borderColor: "#bfbfbf", borderWidth: 1, width: "94%", height: 1 }}></View>
                </View>

                <View style={styles.deliveries}>
                                

                                            
                     
<View>
    <Text style={context.darkMode ?{color:"white",fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.04,marginTop:12,textShadowColor:"white",textShadowOffset:{width:0.5,height:0.5},textShadowRadius:1}:{color:"black",fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.04,marginTop:12,textShadowColor:"black",textShadowOffset:{width:0.5,height:0.5},textShadowRadius:1}}>{deliveryOption ? `${deliveryOption.Name} will handle your delivery with just ${deliveryOption.Price?deliveryOption.Price :"(not yet)"} Dt for delivery cost  `:"no delivery option found for your zone !!"}</Text>
    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.addButton} onPress={()=>{checkReview()}}>
                        <View style={{ height: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontFamily:'Poppins',fontSize: 18, fontWeight: "700", color: "white" }}>NEXT</Text>
                        </View>
                    </TouchableOpacity>
            </View>

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={openModal}>

                <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
                    <View style={{ backgroundColor: "#ffffff", margin: 40, flexDirection: "column", borderRadius: 10, height: Dimensions.get("window").height * 0.8, width: Dimensions.get("window").width * 0.9, alignSelf: "center" }}>
                        <View style={{ width: "100%", height: "80%" }}>
                            <MapView
                                initialRegion={{
                                    latitude:  location ? location.lat : context.location ? Number(context.location.location.latitude):0,
                                    longitude: location ? location.lng :context.location ? Number(context.location.location.longitude):0
                                    ,latitudeDelta: 0.5,
                                    longitudeDelta: 0.5 * (Dimensions.get("window").width / Dimensions.get("window").height )
                                }}

                                style={{ flex: 1, borderRadius: 10 }}
                                customMapStyle={darkStyle}
                                provider="google"
                            >
                                <Marker
                                    draggable={true}
                                    onDragEnd={(evt) => { handleChangeAddress(evt) }}
                                    coordinate={
                                        Platform.OS == 'ios' ?
                                            {
                                                latitude:  location ? location.lat : context.location ? Number(context.location.location.latitude):0,
                                                longitude: location ? location.lng :context.location ? Number(context.location.location.longitude):0
                                    
                                            } :
                                            {
                                                latitude:  location ? location.lat : context.location ? Number(context.location.location.latitude):0,
                                                longitude: location ? location.lng :context.location ? Number(context.location.location.longitude):0
                                            }            


                                    }
                                >
                                    <Image source={require('../assets/logoAddresti.png')} style={{ height: 40, width: 40 }} />

                                </Marker>
                            </MapView>

                        </View>
                        <View style={{ width: "100%", height: "20%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity style={{width: "50%", height: 50,}} onPress={()=>{saveAdress()}}>

                                <View style={{ width: "100%", height: 50, backgroundColor: "#2474F1", borderRadius: 24, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "white", fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.05 }}>save Address</Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>


        

            </View>
    
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    addButton: {
        height: "60%",
        width: "92%",
        borderRadius: 8,
        backgroundColor: "#2474F1",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonContainer: {
        width: "100%",
        height: "10%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    openDays: {
        width: "42%",
        height: "98%",

    },
    deliveryOption: {
        width: "92%",
        height: 90,
        flexDirection: "column",
        borderRadius: 12,
        marginVertical: 8,
        alignSelf: "center",
        justifyContent: "center",
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 0.2,
        borderRadius: 12,
        shadowColor: "#ededed",
        backgroundColor: "#fcfdfc",
    },
    deliveryOptionDark: {
        width: "92%",
        height: 90,
        padding: 1,
        flexDirection: "column",
        borderRadius: 12,
        marginVertical: 8,
        alignSelf: "center",
        justifyContent: "center",
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 0.2,
        borderRadius: 12,
        shadowColor: "#ededed",
        backgroundColor: "#292929"
    },
    deliveryOptionChosen: {
        width: "92%",
        height: 90,
        padding: 1,
        flexDirection: "column",
        borderRadius: 12,
        marginVertical: 8,
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "#2474F1",
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 0.2,
        borderRadius: 12,
        shadowColor: "#ededed"

    },


    deliveryOptionContainer: {
        height: "96%",
        width: "96%",
        flexDirection: "row",
        alignItems: "center",

    },
    deliveryImageContainer: {
        width: "22%",
        height: "98%",
        borderRadius: 12,
    },
    deliveryOptionInfoContainer: {
        width: "36%",
        height: "92%",
        alignItems: "center",
        flexDirection: "column"
    },
    delivererInfo: {
        width: "100%",
        height: "50%",
        marginVertical: 4
    },

    ratingsContainer: {
        width: "100%",
        height: "45%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center"

    },
    deliveries: {
        width: "100%",
        height: "42%",
        flexDirection: "column",
        justifyContent: "center",


    },
    otherPosition: {
        width: "95%",
        height: "20%",
        margin: 6,
        alignSelf: "center",
        backgroundColor: "#2474F1",
        borderRadius: 14,


    },

    home: {
        width: "95%",
        height: "20%",
        margin: 6,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        borderRadius: 14,
    },
    homeDark: {
        backgroundColor: "#292929",
        width: "95%",
        height: "20%",
        margin: 6,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        borderRadius: 14,

    },
    phoneNumberContainer: {
        width: "95%",
        height: "20%",
        margin: 6,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "#bfbfbf",
        borderLeftColor: "white",
        borderRightColor: "white",
        borderTopColor: "white",
        borderWidth: 1

    },

    phoneNumberContainerDark: {
        width: "95%",
        height: "20%",
        margin: 6,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "#292929",
        borderLeftColor: "#292929",
        borderRightColor: "#292929",
        borderTopColor: "#292929",
        borderWidth: 1,
        borderRadius: 10
    },
    getDeliveryTo: {
        width: "95%",
        height: "20%",
        margin: 4,
        alignSelf: "center"

    },
    infoadressContainer: {
        width: "80%",
        height: "25%",
    },

    container: {
        backgroundColor: "white",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,

    },
    containerDark: {
        backgroundColor: "white",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "#121212",

    },
    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
        marginBottom: 8,
        marginTop:10
    },
    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",
        marginBottom:8,
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
        width: Dimensions.get("screen").height * 0.04,
        height: Dimensions.get("screen").height * 0.04
        ,marginLeft:10
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
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
    },
    TitleDark: {
        fontWeight: "700",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
        color: "white"

    }


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

