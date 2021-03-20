import React, { useContext, useState,useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Button ,Alert, TouchableOpacity, SafeAreaView,Image} from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import AuthContext from '../../navigation/AuthContext';


export default function qrScanner (props){
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [attendeeList, setAttendeeList] = useState([]);
    const [lastScannedUrl, setLastScannedUrl] = useState("");
    const context = useContext(AuthContext)

    const [scanned, setScanned] = useState(false);
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        _requestCameraPermission();
    });
    const openDrawer = () => {
        props.navigation.openDrawer();
    }

    const _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        setHasCameraPermission("granted");
    };
    
    const _handleBarcodeScanned = ( result ) => {
        setScanned(true);
        setCount(count+1);
        Alert.alert(`Scanned! code :${result.data}`, 'press OK to continue scanning' ,[{ text: 'OK', onPress: () => { setScanned(false); }}]); 
    };
    
        return (
            <SafeAreaView style={{ flex: 1 }}>

            <View style={styles.container}>
                <View style={context.darkMode ? styles.menuDark : styles.menu}>
                    <View style={styles.leftArrowContainer}>
                        <TouchableOpacity onPress={openDrawer} style={styles.leftArrow}>
                        <Image source={context.darkMode ?  require("../../assets/menu_dark.png"):require("../../assets/menu.png")} style={{height:"100%",width:"100%",resizeMode:"cover"}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={context.darkMode ? styles.TitleDark : styles.Title}>QrScanner</Text>
                    </View>


                </View>
                <View style={styles.mapContainer}>
                    {hasCameraPermission === null
                        ? <Text>Requesting for camera permission</Text>
                        : hasCameraPermission === false
                            ? <Text>
                                Camera permission is not granted
                              </Text>
                            : <BarCodeScanner

                                  onBarCodeScanned={ scanned ? undefined :_handleBarcodeScanned}
r
                                style={{
                                    height: Dimensions.get('window').height*0.92,
                                    width: Dimensions.get('window').width,
                                    flexDirection:"column",
                                    alignItems:"center",
                                    justifyContent:"center"
                                    
                                }}
                            >
                                <View style={{width:200,height:200,flexDirection:"column",justifyContent:'space-between'}}>
                               
                              <View style={{width:"100%",height:"50%",flexDirection:"row",justifyContent:"space-between"}}>
                              <Image style={{width:50,height:50}} source={require("../../assets/corner1.png")}/>
                              <Image style={{width:50,height:50,}} source={require("../../assets/corner3.png")}/>
                              </View>
                              <View style={{width:"100%",height:"50%",flexDirection:"row",justifyContent:"space-between"}}>
                                <Image style={{width:50,height:50}} source={require("../../assets/corner4.png")}/>
                              <Image style={{width:50,height:50,}} source={require("../../assets/corner2.png")}/>
                                </View>


                                </View>
                                </BarCodeScanner>}
                   
                </View>
               
            </View>
            </SafeAreaView>
        );
    }

    const styles = StyleSheet.create({
       
       
    
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
            fontSize: Dimensions.get("window").width * 0.08
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
            fontSize: Dimensions.get("window").width * 0.08,
            color: "white"
    
        },
    
    
    })
    