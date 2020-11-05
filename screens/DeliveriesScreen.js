import React,{useContext,useState,useEffect} from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, TextInput, ScrollView,Alert } from 'react-native'
import { Icon } from 'react-native-elements';
import  AuthContext from '../navigation/AuthContext';
import {close_order,deleteOrder} from "../rest/ordersApi";



import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import { set } from 'react-native-reanimated';




export default function Deliveries(props)
{   const context = useContext(AuthContext);
    const [actifDeliveries, setActifDeliveries] = useState(context.actifDeliveries);
    const [historyDeliveries, setHistoryDeliveries] = useState(context.historyDeliveries);
    const [dark,setDark] = useState(true);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scan,setScan]=useState(false);


    useEffect(()=>{
        setDark(context.darkMode);

      },[context.darkMode])
    


      



    const openDrawer = () => {
        props.navigation.openDrawer();
    }

    const detectQrCode =async () => {
            setScan(true);
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');   
    }

    const handleBarCodeScanned = ({  data }) => {
        setScanned(true);
        Alert.alert(
            `code is ${data}`,
            [
              {
                text: "okey",
                onPress: () => {
                        setScan(false);
                    },
              },
              { text: "close", onPress: () =>{setScanned(false); setScan(false)}}
            ],
            { cancelable: false }
          );
      if (hasPermission === null) {
        alert("requesting for camera")
      }
      if (hasPermission === false) {
         alert("No access to camera")
         }
        };


    
        const closeDelivery= (deliveryToClose)=>{
            close_delivery(deliveryToClose._id).then(res=>{
                setHistoryDeliveries(actifDeliveries.filter(delivery=>deliveryToClose._id != delivery._id));
                setHistoryDeliveries(historyDeliveries=>[...historyDeliveries,deliveryToClose]);
                })
                .catch(err=>{alert(err.message)}) 
        }
    
    



        const deleteFromHistory =(deliveryToDelete) =>{
            deletedelivery(deliveryToDelete._id).then(res=>{
                alert(res.data.message);
                setHistoryDeliveries(historyDeliveries.filter(delivery=>deliveryToDelete._id != delivery._id));
    
            }).catch(err=>{
                alert(err.message);
            })
    
        }
        const startConversation = (order)=>{
            const conversation =  context.openConversationHandler({},{user:context.user,other:order.client});
            props.navigation.navigate("conversation",{conversation,deliveries:true})
         }
    
        const deleteFromActif = (deliveryToDelete)=>{
            deletedelivery(deliveryToDelete._id).then(res=>{
                alert(res.data.message);
                setActifDeliveries(actifDeliveries.filter(delivery=>deliveryToDelete._id != delivery._id));
            }).catch(err=>{alert(err.message)})
        }

        
    return (
        <View style={dark ? styles.containerDark : styles.container}>

        { scan &&
            <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          />


}
         


            <View style={styles.menu}>
                <Icon color={"white"} style={{ flex: 1, padding: 0 }} name="menu" onPress={openDrawer} />
                <Text style={styles.Title}>Livraisons</Text>
            </View>
            <View style={styles.HeaderContainer}>
                <View style={ dark ? styles.SearchBarContainerDark :styles.SearchBarContainer}>
                    <View style={styles.searchIconContainer}>
                        <Image source={require("../assets/search-icon-black.png")} style={styles.searchicon} />
                    </View>
                    <TextInput
                        placeholder="search here ..."
                        style={styles.searchInput}
                        underlineColor={"white"}

                    />
                </View>

                <TouchableOpacity onPress={detectQrCode} style={{ width: "24%", height: "80%" }}>

                    <View style={styles.qrCodeContainer}>
                        <Image style={styles.qrcode} source={require("../assets/qr-icon.png")} />
                    </View>

                </TouchableOpacity>

            </View>
            <ScrollView  //ios
        contentInset={{
          top: 0,
          left: 0,
          bottom:"200%",
          right: 0
        }}
        //android
        contentContainerStyle={{
          paddingRight: Platform.OS == 'android' ? 20 : 0

        }} style={styles.deliveriesScroller}>
                <View style={styles.deliveriesContainer}>
                    {
                        actifDeliveries ?
                            actifDeliveries.map((value, index) => {
                                return(
                                    <View style={dark ? styles.deliveryDark :styles.delivery} key={index}>
                                        <View style={styles.clientImageContainer}>
                                            <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={require("../assets/mootaz.jpg")} />
                                        </View>
                                        <View style={styles.deliveryInfo}>
                                            <Text style={dark ? styles.infoDark :styles.info}>Nom de client: {value.client.firstName} </Text>
                                            <Text style={dark ? styles.infoDark :styles.info}>Prix de livraison:{value.title} </Text>
                                            <Text style={dark ? styles.infoDark :styles.info}>Numero Téléphone: {value.phone}</Text>


                                        </View>
                                        <View style={styles.actions}>
                                            <View style={styles.sendMessageContainer}>
                                                <TouchableOpacity onPress= { ()=>{startConversation(value)} }  style={{ width: "50%", height: "50%", margin: 5 }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../assets/message.png")} />

                                                </TouchableOpacity>
                                            </View>
                                            <View style={dark ? styles.crudDark :  styles.crud}>
                                                <TouchableOpacity onPress={()=>{deleteFromActif(value)}} style={{ width: "25%", height: "25%", marginHorizontal: 5 }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../assets/closeOrder.png")} />

                                                </TouchableOpacity >
                                                <TouchableOpacity  onPress={()=>{closeDelivery(value)}}  style={{ width: "25%", height: "25%", marginHorizontal: 5 }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../assets/orderDone.png")} />

                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                            : null}
                            
                </View>
                <View style={dark ? styles.historyDark : styles.history}>
                    <Text style={styles.historyText}>Historique</Text>
                </View>
                <View style={styles.deliveriesContainer}>

                {
                        historyDeliveries ?
                        historyDeliveries.map((value, index) => {
                                return(
                                    <View style={dark ? styles.deliveryDark :styles.delivery} key={index}>
                                        <View style={styles.clientImageContainer}>
                                            <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={require("../assets/mootaz.jpg")} />
                                        </View>
                                        <View style={styles.deliveryInfo}>
                                            <Text style={dark ? styles.infoDark :styles.info}>Nom de client: {value.client.firstName} </Text>
                                            <Text style={dark ? styles.infoDark :styles.info}>Prix de livraison:{value.title} </Text>
                                            <Text style={dark ? styles.infoDark :styles.info}>Numero Téléphone: {value.phone}</Text>
                                            <Text style={dark ? styles.infoDark :styles.info}>Date: {value.date}</Text>


                                        </View>
                                        <View style={styles.actions}>
                                            <View style={styles.sendMessageContainer}>
                                                <TouchableOpacity style={{ width: "50%", height: "50%", margin: 5 }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../assets/message.png")} />

                                                </TouchableOpacity>
                                            </View>
                                            <View style={dark ? styles.crudDark :  styles.crud}>
                                                <TouchableOpacity onPress={()=>{deleteFromHistory(value)}} style={{ width: "25%", height: "25%", marginHorizontal: 5 }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../assets/closeOrder.png")} />

                                                </TouchableOpacity>
                                              

                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                            : null}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    historyText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white"

    },
    history: {
        width: "100%",
        height: 40,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2474F1"
    },
    historyDark: {
        width: "100%",
        height: 40,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E1E1E"
    },
    crud: {
        width: "60%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6E6E6",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12

    },
    crudDark:{
        width: "60%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#313131",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12
    },
    sendMessageContainer: {
        width: "40%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

    },
    info: {
        fontSize: 11
    },
    infoDark: {
        fontSize: 11,
        color:"white"
    },
    actions: {
        width: "25%",
        height: "100%",
        flexDirection: "row",
        borderRadius: 12


    },
    deliveryInfo: {
        width: "60%",
        height: "100%",
        flexDirection: "column",
        padding: 4,
        justifyContent: "center"
    },
    clientImageContainer: {
        width: "15%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12


    },
    delivery: {
        width: "96%",
        height:70,
        backgroundColor: "white",
        flexDirection: "row",
        borderRadius: 12,
        marginVertical: 6,
        flexWrap: 'wrap',
        justifyContent: "flex-start",


    },
    deliveryDark: {
        width: "96%",
        height:70,
        backgroundColor: "#414141",
        flexDirection: "row",
        borderRadius: 12,
        marginVertical: 6,
        flexWrap: 'wrap',
        justifyContent: "flex-start",


    },
    deliveriesContainer: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        padding: 6,
        flexWrap: 'wrap',
        justifyContent: "flex-start",

    },
    deliveriesScroller: {
        flexDirection: "column",
        position: "absolute",
        top: "25%",
        height: "75%",
        width: "100%",
    },
    container: {
        flex: 1,
        backgroundColor: "#BFC0C2"
    },
    containerDark: {
        flex: 1,
        backgroundColor: "#292929"
    },
    menu: {

        position: "absolute",
        marginTop: Platform.OS == 'ios' ? 30 : 20,
        flexDirection: "row",
        alignSelf: "flex-start",
        alignContent: "space-between",
        padding: 10,
        shadowOpacity: 0.5,
        elevation: 10,
        alignItems: "center"
    },
    Title: {
        fontSize: 18,
        color: "white",
        fontWeight: "600",
        letterSpacing: 1,
        justifyContent: "center",
        marginHorizontal: 5
    },
    HeaderContainer: {
        width: "90%",
        height: "10%",
        position: "absolute",
        top: "11%",
        left: "10%",
        elevation: 10,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    SearchBarContainer: {
        width: "74%",
        height: "80%",
        borderRadius: 25,
        backgroundColor: "white",
        flexDirection: "row",
        shadowColor: "#BFC0C2",
        shadowOpacity: 0.3,
        shadowOffset: { width: 1, height: 1 }

    },
    SearchBarContainerDark: {
        width: "74%",
        height: "80%",
        borderRadius: 25,
        backgroundColor: "#1E1E1E",
        flexDirection: "row",
        shadowColor: "#1E1E1E",
        shadowOpacity: 0.3,
        shadowOffset: { width: 1, height: 1 }

    },
    qrCodeContainer: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"

    },
    qrcode: {
        height: "100%",
        width: "80%",
        resizeMode: "contain"
    },
    searchIconContainer: {
        width: "15%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    searchInput: {
        width: "85%",
        height: "100%",
    },
    searchicon: {
        width: "80%",
        height: "80%",
        resizeMode: "contain"
    }

})



