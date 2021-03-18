import React, { useContext, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, Image, FlatList, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Colors from '../../constants/Colors';
import ManagerListItem from '../../common/ManagerListItem';
import DeliveryListItem from '../../common/DeliveryListItem';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPartnerDashboard, deleteDeliverer, deleteManager } from '../../rest/partnerApi'
import AuthContext from '../../navigation/AuthContext';


const BusinessDashboardScreen = (props) => {
    const context = useContext(AuthContext);
    const [dashboard, setDashboard] = useState(null)
    const [managers, setManagers] = useState([]);
    const [deliverers, setDeliverers] = useState([]);

        useEffect(() => {
        getPartnerDashboard(context.partner._id).then(dash => {
            setDashboard(dash)
            setManagers(dash.partner.managers);
            setDeliverers(dash.partner.deliverers);
        })

    }, [])

    const deleteManagerHandler = (user) => {

        deleteManager(context.partner._id, user).then(message => {
            
            Alert.alert(
                "deleting manager",
                message,
                [
                    {
                        text: "ok",
                        onPress: () => {

                        },
                        style: "ok"
                    },
                ])
            setManagers(managers.filter(manager => manager.user._id != user));

        })
    }

    const startManagerConversationHandler = (manager)=>{
        const conversation =  context.openConversationHandler({},{user:context.user,other:manager},"personal");
         props.navigation.navigate("conversation",{conversation,orders:true})
    }

    const startDelivererConversationHandler = (deliverer)=>{
        const conversation =  context.openConversationHandler({},{user:context.user,other:deliverer},"personal");
        props.navigation.navigate("conversation",{conversation,orders:true})
    }

    const renderListManagersItem = (itemData) => {
        return (
            <ManagerListItem
                image={itemData.item.user.photo ? {uri:itemData.item.user.photo} :require("../../assets/images/avatar.jpg")}
                name={itemData.item.user.firstName}
                title={itemData.item.user.phone}
                user={itemData.item.user._id}
                manager={itemData.item.user}
                startConversation={startManagerConversationHandler}
                deleteManager={deleteManagerHandler}
                dark ={context.darkMode}
            />
        );
    };
    const openDrawer = () => {
        props.navigation.openDrawer();

    }
    const deleteDelivererHandler = (deliverer) => {
        deleteDeliverer(context.partner._id, deliverer).then(message => {
            Alert.alert(
                "deleting deliverer",
                message,
                [
                    {
                        text: "ok",
                        onPress: () => {

                        },
                        style: "ok"
                    },
                ])
            setDeliverers(deliverers.filter(_deliverer => _deliverer._id != deliverer));
        })
    }
    const renderListDeliverysItem = (itemData) => {
        return (
            <DeliveryListItem
                image={itemData.item.photo ? {uri:itemData.item.photo} :require("../../assets/images/avatar.jpg")}
                name={itemData.item.firstName}
                time={itemData.item.phone}
                deliverer={itemData.item}
                deleteDeliverer={deleteDelivererHandler}
                startConversation={startDelivererConversationHandler}
                dark={context.darkMode}
            />

        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={context.darkMode ?  styles.menuDark: styles.menu}>
            <View style={styles.leftArrowContainer} >
                     <TouchableOpacity onPress={openDrawer} style={{height:30,width:30}}>
                        <Image source={context.darkMode ?  require("../../assets/menu_dark.png"):require("../../assets/menu.png")} style={{height:"100%",width:"100%",resizeMode:"cover"}}/>
                        </TouchableOpacity>
                     </View>
                <View style={styles.titleContainer}>
                    <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Business Dashboard</Text>
                </View>


            </View>

            { dashboard ?
                <View style={context.darkMode ? styles.mainContainerDark : styles.mainContainer}>

                    <View style={context.darkMode ? styles.partOneDark : styles.partOne}>
                        <LinearGradient
                            colors={['#2071f1', '#f0a8f0']}
                            start={[0, 0]}
                            end={[1, 1]}
                            style={styles.part1}
                        >
                            <View style={styles.paragraphesContainer}>
                                <Text style={styles.headerText}>HI , {context.user.lastName.charAt(0).toUpperCase() + context.user.lastName.slice(1)}</Text>
                                <Text style={styles.title}>Ready to start your day with addressti</Text>
                            </View>
                            <View style={styles.imageContainer}>
                                <View style={styles.imageHead}>
                                <Image
                                        style={{ width: "100%", height: "100%", resizeMode: 'contain', }}
                                        source={require("../../assets/RoseMan.png")}
                                    />
                                </View>

                              
                                
                            </View>
                        </LinearGradient>

                        <View style={styles.part2}>

                            <View style={styles.cardContainer}>
                            <Text style={context.darkMode ? {color:"white"}:{color:"black"}}>
                                    My earnings
                        </Text>
                                <LinearGradient
                                    colors={['#2a75f1', '#888ef0']}
                                    start={[0, 0]}
                                    end={[1, 1]}
                                    style={styles.cardValueContainer}
                                >
                                    <Text style={styles.textCard}>
                                        {dashboard.statisticData.earnings}
                                    </Text>
                                </LinearGradient>
                            </View>
                            <View style={styles.cardContainer}>
                            <Text style={context.darkMode ? {color:"white"}:{color:"black"}}>
                                    Number of Orders
                        </Text>
                                <LinearGradient
                                    colors={['#948cf0', '#faabf0']}
                                    start={[0, 0]}
                                    end={[1, 1]}
                                    style={styles.cardValueContainer}
                                >
                                    <Text style={styles.textCard}>
                                        {dashboard.statisticData.ordersCount.toString()}

                                    </Text>
                                </LinearGradient>
                            </View>
                        </View>


                        <View style={styles.part2}>
                            <View style={styles.cardContainer}>
                                <Text style={context.darkMode ? {color:"white"}:{color:"black"}}>
                                    Addressti fees
      </Text>
                                <LinearGradient
                                    colors={['#2a75f1', '#888ef0']}
                                    start={[0, 0]}
                                    end={[1, 1]}
                                    style={styles.cardValueContainer}
                                >
                                    <Text style={styles.textCard}>
                                        {dashboard.statisticData.addrestiFees}
                                    </Text>
                                </LinearGradient>
                            </View>
                            <View style={styles.cardContainer}>
                            <Text style={context.darkMode ? {color:"white"}:{color:"black"}}>
                                    Number of Views
                                 </Text>
                                <LinearGradient
                                    colors={['#948cf0', '#faabf0']}
                                    start={[0, 0]}
                                    end={[1, 1]}
                                    style={styles.cardValueContainer}
                                >

                                    <Text style={styles.textCard}>
                                        {dashboard.statisticData.totalViews}
                                    </Text>
                                </LinearGradient>
                            </View>
                        </View>






                    </View>


                    {
                                                context.user.isPartner == true && dashboard.partner.owner != null && dashboard.partner.owner === context.user._id && managers.length > 0 ?

 <View
 style={{
     borderBottomColor: context.darkMode ? "#292929": '#d8d8d8',

     borderBottomWidth: 1,
     marginLeft: 5,
     marginRight: 5,
     marginTop: 5,
     marginBottom: 5
 }}
 
/>
 :null}
                   
                    {
                        context.user.isPartner == true && dashboard.partner.owner != null && dashboard.partner.owner === context.user._id && managers.length > 0 ?

                            <View style={context.darkMode ? styles.partTwoDark : styles.partTwo}>

                                <Text style={context.darkMode ? styles.titlesStylesDark : styles.titlesStyles}>Managers</Text>
                                <View style={styles.listManagersContainer}>

                                    <FlatList
                                        data={managers}
                                        renderItem={renderListManagersItem}
                                        keyExtractor={item => item._id}
                                    />
                                </View>

                            </View>
                            :
                            null
                    }
                    {
                    
                    deliverers.length>0 &&<View
                        style={{
                            borderBottomColor: context.darkMode ? "#292929": '#d8d8d8',                         
                            borderBottomWidth: 1,
                            marginLeft: 5,
                            marginRight: 5,
                            marginTop: 5,
                            marginBottom: 5
                        }}
                    />
}


                   { deliverers.length>0 &&<View style={context.darkMode ? styles.partThreeDark : styles.partThree}>
                        <Text style={context.darkMode ? styles.titlesStylesDark : styles.titlesStyles}>Delivery management</Text>
                        <View style={styles.listDeliveryContainer}>
                            <FlatList
                                data={deliverers}
                                renderItem={renderListDeliverysItem}
                                keyExtractor={item=>item._id}
                            />
                        </View>
                    </View>
                    }
                </View>
                :
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", flex: 1 }}>
                    <ActivityIndicator color={"blue"} size={"small"} />

                </View>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background
        // alignItems: 'center',
        // justifyContent: 'center'
        //alignItems: 'center',  //crossAxisAlign
        //justifyContent: 'center' //mainAxisAlign
    },
    mainContainerDark:{
        backgroundColor: "#121212",
        flex:1
    },
    partOne: {
        flex: 2.02,
        // backgroundColor: 'red',
        backgroundColor: Colors.background,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 3,

    },
    partOneDark:{
        flex: 2.02,
        // backgroundColor: 'red',
        backgroundColor:  "#121212",
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 3,
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
        width: "90%",
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
        fontSize: 28,
        color: "white"

    },
    part1: {
        flex: 1.5,
        width: '92%',
        //backgroundColor: 'pink',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
        borderRadius: 30,
    },
    paragraphesContainer: {
        //backgroundColor: 'gray',
        flex: 1.75,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: Dimensions.get("window").width * 0.07,
    },
    title: {
        color: 'white'
    },
    imageContainer: {
        flex: 1,
        //  backgroundColor: 'yellow',
        alignItems: 'center',
        justifyContent: 'center',

    },
    imageHead: {
        width: '80%',
        height: '80%',
        // backgroundColor:'orange',
        position: 'absolute',
        top: '-1%',

    },
    imageBody: {
        width: '70%',
        height: '33%',
        position:'absolute',
        top:"20%",
        resizeMode: 'contain',
        //backgroundColor:'green'
    },
    imageLegs: {
        width: '70%',
        position:'absolute',
        top:"43%",
        height: '33%',
        resizeMode: 'contain',
        //backgroundColor:'green'
    },

    part2: {
        flex: 1,
        width: '92%',
        flexDirection: 'row',
        marginVertical: 2,
        //backgroundColor: 'blue'
    },
    cardContainer: {
        //backgroundColor:'yellow',
        flex: 1,
        alignItems: 'center',
    },
    cardValueContainer: {
        flex: 1,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '93%',

    },
    textCard: {
        color: 'white',
        fontSize: Dimensions.get("window").width * 0.07,
        fontWeight: 'bold',
        textAlignVertical: "center"
    },




    partTwo: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 5,
        marginTop: 5,
        paddingHorizontal: 10,
        paddingBottom: 5
    },       //backgroundColor:'yellow',
    partTwoDark: {
        flex: 1,
        backgroundColor: '#292929' ,
        borderRadius: 15,
        marginBottom: 5,
        marginTop: 5,
        paddingHorizontal: 10,
        paddingBottom: 5
    },       //backgroundColor:'yellow',
 
    listManagersContainer: {
        flex: 1,
        justifyContent: 'center',
        //backgroundColor: 'red'
    },
    titlesStyles: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    titlesStylesDark:{
        fontSize: 15,
        fontWeight: 'bold',
        color:"white"  
    },


    partThree: {
        flex: 2,
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: 5,
        marginBottom: 5,
        paddingHorizontal: 10,
        paddingBottom: 5
    },
    partThreeDark: {
        flex: 2,
        backgroundColor: '#292929',
        borderRadius: 15,
        marginTop: 5,
        marginBottom: 5,
        paddingHorizontal: 10,
        paddingBottom: 5
    },
    listDeliveryContainer: {
        flex: 1,
        justifyContent: 'center',
        //backgroundColor:'yellow'
    },
});

export default BusinessDashboardScreen;




/*import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {View , StyleSheet, Text, Image, FlatList} from 'react-native';
import Colors from '../constants/Colors';
import ManagerListItem from '../components/ManagerListItem';
import DeliveryListItem from '../components/DeliveryListItem';


const products = [
    {
        id: '1',
        image:'../assets/images/image.jpg',
        name:'Amir',
        title:"Cheif d'entreprise en france",
    },
    {
        id: '2',
        image:'../assets/images/image.jpg',
        name:'Amira',
        title:'Responsable MKT(monastir)',
    },
    {
        id:'3',
        image:'../assets/images/image.jpg',
        name:'Amira',
        title:'Responsable MKT(monastir)',
    },
];

const deliverys = [
    {
        id: '1',
        image:'../assets/images/avatar.jpg',
        name:'Amir',
        time:'08:00pm to 01:00am',
    },
    {
        id: '2',
        image:'../assets/images/avatar.jpg',
        name:'Amira',
        time:'08:00am to 00:00am',
    },
    {
        id:'3',
        image:'../assets/images/avatar.jpg',
        name:'Salah',
        time:'08:00am to 00:00am',
    },
    {
        id:'4',
        image:'../assets/images/avatar.jpg',
        name:'Mohamed Ali',
        time:'08:00am to 00:00am',
    },
    {
        id:'5',
        image:'../assets/images/avatar.jpg',
        name:'Mohamed',
        time:'08:00am to 00:00am',
    },
    {
        id:'6',
        image:'../assets/images/avatar.jpg',
        name:'Saida',
        time:'08:00am to 00:00am',
    },
];
const BusinessDashboardScreen = (props) => {

    const renderListManagersItem = (itemData) => {
        return (
            <ManagerListItem
            image={require("../assets/images/avatar.jpg")}
            name={itemData.item.name}
            title={itemData.item.title}
            />
        );
    };

    const renderListDeliverysItem = (itemData) => {
        return (
            <DeliveryListItem
            image={require("../assets/images/avatar.jpg")}
            name={itemData.item.name}
            time={itemData.item.time}
            />
        );
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.partOne}>
                <LinearGradient
                        colors={['#2071f1', '#f0a8f0']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.part1}
                        >
                    <View style={styles.paragraphesContainer}>
                        <Text style={styles.headerText}>HI , Salem</Text>
                        <Text style={styles.title}>Ready to start your day with addressti</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                        style={styles.imageHead}
                        source={require("../assets/images/head.png")}
                        />
                        <Image
                        style={styles.image}
                        source={require("../assets/images/body.png")}
                        />
                        <Image
                        style={styles.image}
                        source={require("../assets/images/legs.png")}
                        />
                    </View>
                </LinearGradient>
                <View style={styles.part2}>
                    <View style={styles.cardContainer}>
                        <Text>
                            My earnings
                        </Text>
                        <LinearGradient
                        colors={['#2a75f1', '#888ef0']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.card}
                        >
                            <Text style={styles.textCard}>
                                9500 TND
                            </Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.cardContainer}>
                        <Text>
                            Number of Orders
                        </Text>
                        <LinearGradient
                        colors={['#948cf0', '#faabf0']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.card}
                        >
                            <Text style={styles.textCard}>
                                1100
                            </Text>
                        </LinearGradient>
                    </View>
                </View>
                <View style={styles.part2}>
                    <View style={styles.cardContainer}>
                        <Text>
                            Addressti fees
                        </Text>
                        <LinearGradient
                        colors={['#2a75f1', '#888ef0']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.card}
                        >
                            <Text style={styles.textCard}>
                                1090 TND
                            </Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.cardContainer}>
                        <Text>
                            Number of Views
                        </Text>
                        <LinearGradient
                        colors={['#948cf0', '#faabf0']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.card}
                        >
                            <Text style={styles.textCard}>
                                10,500
                            </Text>
                        </LinearGradient>
                    </View>
                </View>
            </View>
            <View
                style={{
                borderBottomColor: '#d8d8d8',
                borderBottomWidth: 1,
                marginLeft: 5,
                marginRight: 5,
                marginTop: 5,
                marginBottom:5
                }}
            />
            <View style={styles.partTwo}>
                    <Text style={styles.titlesStyles}>Managers</Text>
                    <View style={styles.listManagersContainer}>
                        <FlatList
                        data={products}
                        renderItem={renderListManagersItem}
                        />
                    </View>
            </View>
            <View
                style={{
                borderBottomColor: '#d8d8d8',
                borderBottomWidth: 1,
                marginLeft: 5,
                marginRight: 5,
                marginTop: 5,
                marginBottom:5
                }}
            />
            <View style={styles.partThree}>
                <Text style={styles.titlesStyles}>Delivery management</Text>
                <View style={styles.listDeliveryContainer}>
                    <FlatList
                        data={deliverys}
                        renderItem={renderListDeliverysItem}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background
        // alignItems: 'center',
        // justifyContent: 'center'
                 //alignItems: 'center',  //crossAxisAlign
                //justifyContent: 'center' //mainAxisAlign
        },
    partOne:{
        flex:2,
        marginTop:30,
        //backgroundColor: 'red',
        //backgroundColor: Colors.background,
        borderRadius: 20,
        marginBottom:5,
        alignItems: 'center'
    },
    part1: {
        flex: 1.5,
        width: '90%',
        backgroundColor: 'pink',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
        borderRadius: 30
    },
    paragraphesContainer: {
        //backgroundColor: 'gray',
        flex:1.75,
        justifyContent: 'center',
        paddingHorizontal:10
    },
    headerText:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 28
    },
    title:{
        color: 'white'
    },
    imageContainer: {
        flex:1,
        //backgroundColor: 'yellow',
        alignItems: 'center',
        justifyContent:'center'
    },
    imageHead:{
        width: '50%',
        height: '50%',
        resizeMode: 'contain',
        //backgroundColor:'orange',
        position:'absolute',
        top:'-30%'
    },
    image: {
        width: '70%',
        height: '33%',
        resizeMode: 'contain',
        //backgroundColor:'green'
    },

    part2:{
        flex: 1,
        width: '90%',
        flexDirection: 'row',
        backgroundColor: 'blue'
    },
    cardContainer:{
        flex:1,
        //backgroundColor: 'green',
        alignItems: 'center'
    },
    card: {
        width:'90%',
        height:'60%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:5,
        borderRadius: 15,
        backgroundColor: 'yellow'
    },
    textCard:{
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold'
    },
    partTwo: {
        flex:1,
        //backgroundColor: 'white',
        //backgroundColor:'yellow',
        borderRadius: 15,
        marginBottom:5,
        marginTop:5,
        paddingHorizontal:10,
        paddingBottom:5
    },
    listManagersContainer:{
        flex: 1,
        justifyContent: 'center',
        //backgroundColor: 'red'
    },
    titlesStyles:{
        fontSize: 15,
        fontWeight: 'bold'
    },



    partThree: {
        flex: 2,
        backgroundColor: 'white',
        //backgroundColor:'green',
        borderRadius: 15,
        marginTop:5,
        marginBottom:5,
        paddingHorizontal:10,
        paddingBottom:5
    },
    listDeliveryContainer:{
        flex:1,
        justifyContent: 'center',
        //backgroundColor:'yellow'
    },
});

export default BusinessDashboardScreen;*/