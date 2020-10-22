import React, { useState } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements';

const deliveries_actif = [{
    clientName: "Amara Mootaz",
    price: 15,
    phone: "25417290",
    clientImage: require("../assets/mootaz.jpg"),        date: "11/11/2015"

},
{
    clientName: "Amara yasmine",
    price: 15,
    phone: "25417290",
    clientImage: require("../assets/mootaz.jpg"),        date: "11/11/2015"

}, {
    clientName: "Amara karima",
    price: 15,
    phone: "25417290",
    clientImage: require("../assets/mootaz.jpg"),        date: "11/11/2015"

}]

const deliveries_history = [
    {
        clientName: "Amara k",
        price: 15,
        phone: "25417290",
        clientImage: require("../assets/mootaz.jpg"),
        date: "11/11/2015"
    },
    {
        clientName: "Amara a",
        price: 15,
        phone: "25417290",
        clientImage: require("../assets/mootaz.jpg"),
        date: "11/11/2015"

    },
    {
        clientName: "Amara Mootaz",
        price: 15,
        phone: "25417290",
        clientImage: require("../assets/mootaz.jpg"),
        date: "11/11/2015"

    }
]

export default function Orders(props) {
    const [actifDeliveries, setActifDeliveries] = useState(deliveries_actif)
    const [historyDeliveries, setHistoryDeliveries] = useState(deliveries_history)
    const openDrawer = () => {
        props.navigation.openDrawer();
    }
    const detectQrCode = () => {
    }
    const closeOrder= (orderToClose)=>{
        setActifDeliveries(actifDeliveries.filter(order=>orderToClose.clientName != order.clientName));
        setHistoryDeliveries(historyDeliveries=>[...historyDeliveries,orderToClose]);
    }
    const deleteFromHistory =(orderToDelete) =>{
        setHistoryDeliveries(historyDeliveries.filter(order=>orderToDelete.clientName != order.clientName));

    }
    return (
        <View style={styles.container}>
            <View style={styles.menu}>
                <Icon color={"white"} style={{ flex: 1, padding: 0 }} name="menu" onPress={openDrawer} />
                <Text style={styles.Title}>Livraisons</Text>
            </View>
            <View style={styles.HeaderContainer}>
                <View style={styles.SearchBarContainer}>
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
            <ScrollView style={styles.deliveriesScroller}>
                <View style={styles.deliveriesContainer}>
                    {
                        actifDeliveries ?
                            actifDeliveries.map((value, index) => {
                                return(
                                    <View style={styles.delivery} key={index}>
                                        <View style={styles.clientImageContainer}>
                                            <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={require("../assets/mootaz.jpg")} />
                                        </View>
                                        <View style={styles.deliveryInfo}>
                                            <Text style={styles.info}>Nom de client: {value.clientName} </Text>
                                            <Text style={styles.info}>Prix de livraison:{value.price.toString()} </Text>
                                            <Text style={styles.info}>Numero Téléphone: {value.phone}</Text>


                                        </View>
                                        <View style={styles.actions}>
                                            <View style={styles.sendMessageContainer}>
                                                <TouchableOpacity style={{ width: "50%", height: "50%", margin: 5 }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../assets/message.png")} />

                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.crud}>
                                                <TouchableOpacity onPress={()=>{closeOrder(value)}} style={{ width: "25%", height: "25%", marginHorizontal: 5 }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../assets/closeOrder.png")} />

                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ width: "25%", height: "25%", marginHorizontal: 5 }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../assets/orderDone.png")} />

                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                            : null}
                            
                </View>
                <View style={styles.history}>
                    <Text style={styles.historyText}>Historique</Text>
                </View>
                <View style={styles.deliveriesContainer}>

                {
                        historyDeliveries ?
                        historyDeliveries.map((value, index) => {
                                return(
                                    <View style={styles.delivery} key={index}>
                                        <View style={styles.clientImageContainer}>
                                            <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={require("../assets/mootaz.jpg")} />
                                        </View>
                                        <View style={styles.deliveryInfo}>
                                            <Text style={styles.info}>Nom de client: {value.clientName} </Text>
                                            <Text style={styles.info}>Prix de livraison:{value.price} </Text>
                                            <Text style={styles.info}>Numero Téléphone: {value.phone}</Text>
                                            <Text style={styles.info}>Date: {value.date}</Text>


                                        </View>
                                        <View style={styles.actions}>
                                            <View style={styles.sendMessageContainer}>
                                                <TouchableOpacity style={{ width: "50%", height: "50%", margin: 5 }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../assets/message.png")} />

                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.crud}>
                                                <TouchableOpacity onPress={()=>{deleteFromHistory(value)}} style={{ width: "25%", height: "25%", marginHorizontal: 5 }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../assets/closeOrder.png")} />

                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ width: "25%", height: "25%", marginHorizontal: 5 }}>
                                                    <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={require("../assets/orderDone.png")} />

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
        fontSize: "140%",
        fontFamily: "Poppins",
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
    sendMessageContainer: {
        width: "40%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

    },
    info: {
        fontFamily: "Poppins",
        fontSize: "90%"
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
        backgroundColor: "white",
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

