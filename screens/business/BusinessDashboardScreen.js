import React, { useContext, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, Image, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors';
import ManagerListItem from '../../common/ManagerListItem';
import DeliveryListItem from '../../common/DeliveryListItem';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPartnerDashboard } from '../../rest/partnerApi'
import AuthContext from '../../navigation/AuthContext';

const products = [
    {
        id: '1',
        image: '../../assets/images/image.jpg',
        name: 'Amir',
        title: "Cheif d'entreprise en france",
    },
    {
        id: '2',
        image: '../../assets/images/image.jpg',
        name: 'Amira',
        title: 'Responsable MKT(monastir)',
    },
    {
        id: '3',
        image: '../../assets/images/image.jpg',
        name: 'Amira',
        title: 'Responsable MKT(monastir)',
    },
];

const deliverys = [
    {
        id: '1',
        image: '../../assets/images/avatar.jpg',
        name: 'Amir',
        time: '08:00pm to 01:00am',
    },
    {
        id: '2',
        image: '../../assets/images/avatar.jpg',
        name: 'Amira',
        time: '08:00am to 00:00am',
    },
    {
        id: '3',
        image: '../../assets/images/avatar.jpg',
        name: 'Salah',
        time: '08:00am to 00:00am',
    },
    {
        id: '4',
        image: '../../assets/images/avatar.jpg',
        name: 'Mohamed Ali',
        time: '08:00am to 00:00am',
    },
    {
        id: '5',
        image: '../../assets/images/avatar.jpg',
        name: 'Mohamed',
        time: '08:00am to 00:00am',
    },
    {
        id: '6',
        image: '../../assets/images/avatar.jpg',
        name: 'Saida',
        time: '08:00am to 00:00am',
    },
];
const BusinessDashboardScreen = (props) => {
    const context = useContext(AuthContext);
    const [dashboard, setDashboard] = useState(null)
    useEffect(() => {
        getPartnerDashboard(context.partner._id).then(dash => {
            console.log(dash)
            console.log(context.user);
            setDashboard(dash)
        })

    }, [])
    const renderListManagersItem = (itemData) => {
        return (
            <ManagerListItem
                image={require("../../assets/images/avatar.jpg")}
                name={itemData.item.name}
                title={itemData.item.title}
            />
        );
    };
    const openDrawer = () => {
        props.navigation.openDrawer();

    }
    const renderListDeliverysItem = (itemData) => {
        return (
            <DeliveryListItem
                image={require("../../assets/images/avatar.jpg")}
                name={itemData.item.name}
                time={itemData.item.time}
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.menu}>
                <View style={styles.leftArrowContainer}>
                    <TouchableOpacity style={styles.leftArrow}>
                        <Icon color={"black"} style={{ padding: 4, alignSelf: "center", justifyContent: "center" }} name="menu" onPress={openDrawer} />

                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.Title}>Business Dashboard</Text>
                </View>


            </View>
       
       { dashboard ?    
         <View style={styles.mainContainer}>

                <View style={styles.partOne}>
                    <LinearGradient
                        colors={['#2071f1', '#f0a8f0']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.part1}
                    >
                        <View style={styles.paragraphesContainer}>
                            <Text style={styles.headerText}>HI , {context.user.lastName.charAt(0).toUpperCase()+context.user.lastName.slice(1)}</Text>
                            <Text style={styles.title}>Ready to start your day with addressti</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.imageHead}
                                source={require("../../assets/images/head.png")}
                            />
                            <Image
                                style={styles.image}
                                source={require("../../assets/images/body.png")}
                            />
                            <Image
                                style={styles.image}
                                source={require("../../assets/images/legs.png")}
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
                                        style={styles.cardValueContainer}
                                    >
                                        <Text style={styles.textCard}>
                                            {dashboard.earnings}
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
                                        style={styles.cardValueContainer}
                                    >
                                        <Text style={styles.textCard}>
                                            {dashboard.ordersCount.toString()}

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
                                    style={styles.cardValueContainer}
                                >
                                    <Text style={styles.textCard}>
                                        {dashboard.addrestiFees}
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
                                    style={styles.cardValueContainer}
                                >
                                    <Text style={styles.textCard}>
                                        {dashboard.views.length}
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
                        marginBottom: 5
                    }}
                />
                 {
                     context.user.isPartner==true &&  dashboard.owner !=null && dashboard.owner===context.user._id ? 

                <View style={styles.partTwo}>
               
                    <Text style={styles.titlesStyles}>Managers</Text>
                    <View style={styles.listManagersContainer}>
                    <FlatList
                        data={dashboard.managers}
                        renderItem={renderListManagersItem}
                    />
                </View>  
               
                </View>
                 :
                 null 
                 }  
                <View
                    style={{
                        borderBottomColor: '#d8d8d8',
                        borderBottomWidth: 1,
                        marginLeft: 5,
                        marginRight: 5,
                        marginTop: 5,
                        marginBottom: 5
                    }}
                />
                
              
                   <View style={styles.partThree}>
                   <Text style={styles.titlesStyles}>Delivery management</Text>
                   <View style={styles.listDeliveryContainer}>
                       <FlatList
                           data={dashboard.deliverers}
                           renderItem={renderListDeliverysItem}
                       />
                   </View>
               </View>  
            </View>
            :
            <View style={{justifyContent:"center",alignItems:"center",flexDirection:"column",flex:1}}>
                <ActivityIndicator  size={"small"} />

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
    partOne: {
        flex: 2.02,
        //backgroundColor: 'red',
        //backgroundColor: Colors.background,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 3

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
        width: '50%',
        height: '50%',
        resizeMode: 'contain',
        // backgroundColor:'orange',
        position: 'absolute',
        top: '-30%',


    },
    image: {
        width: '70%',
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
        //backgroundColor:'yellow',
        borderRadius: 15,
        marginBottom: 5,
        marginTop: 5,
        paddingHorizontal: 10,
        paddingBottom: 5
    },
    listManagersContainer: {
        flex: 1,
        justifyContent: 'center',
        //backgroundColor: 'red'
    },
    titlesStyles: {
        fontSize: 15,
        fontWeight: 'bold'
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