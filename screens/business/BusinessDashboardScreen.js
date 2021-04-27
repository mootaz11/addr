import React, { useContext, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, Image, FlatList, Dimensions, TouchableOpacity, ActivityIndicator, Alert,Modal } from 'react-native';
import Colors from '../../constants/Colors';
import ManagerListItem from '../../common/ManagerListItem';
import DeliveryListItem from '../../common/DeliveryListItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPartnerDashboard, deleteDeliverer, deleteManager } from '../../rest/partnerApi'
import AuthContext from '../../navigation/AuthContext';
import {ScrollView} from 'react-native-gesture-handler';


const BusinessDashboardScreen = (props) => {
    const context = useContext(AuthContext);
    const [dashboard, setDashboard] = useState(null)
    const [managers, setManagers] = useState([]);
    const [deliverers, setDeliverers] = useState([]);
    const [modalListPartners, setModalListPartners] = useState(false)
    const [profile, setProfile] = useState(null);

    const [profiles, setProfiles] = useState([]);
    const [profileChecked, setProfileChecked] = useState(false);
        useEffect(() => {
            if(context.partner){
                getPartnerDashboard(context.partner._id).then(dash => {
                    setDashboard(dash)
                    setManagers(dash.partner.managers);
                    setDeliverers(dash.partner.deliverers);
                })
            }
    
    }, [context.partner])

    const checkAccount = (item) => {
        setProfile(item);
        if (!item.firstName) {
          context.setPartner(item);
            
            if(item.delivery.cities.length>0 || item.delivery.regions.length>0){
                if(item.owner ==context.user._id){
                    props.navigation.navigate('deliveryDash');
                }
    
                if (item.managers.length > 0 && item.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
          && item.managers[item.managers.findIndex(manager => { return manager.user == context.user._id })].access.deliveryAccess.deposit) {
          props.navigation.navigate('debou');
        }
                if(item.deliverers.findIndex(d=>{return d.user==context.user._id})>=0){
                  if(item.deliverers[item.deliverers.findIndex(d=>{return d.user==context.user._id})].type=="delivery"){
                      props.navigation.navigate("livraisons",{last_screen:""});
                  }
                  if(item.deliverers[item.deliverers.findIndex(d=>{return d.user==context.user._id})].type=="collect"){
                    props.navigation.navigate("collecting");
                  }
        
                  if(item.deliverers[item.deliverers.findIndex(d=>{return d.user==context.user._id})].type=="both"){
                    props.navigation.navigate("collecting");
                  }
                  
        
                }
                setModalListPartners(!modalListPartners)
    
            }
    
    
            if(item.delivery.cities.length==0 && item.delivery.regions.length==0)
              {
              if(item.managers.findIndex(m=>{return m.manager==context.user._id})>=0 &&item.managers[item.managers.findIndex(m=>{return m.manager==context.user._id})].access.businessAccess.dashboard){
                props.navigation.navigate("businessDash");
              }
              if(item.managers.findIndex(m=>{return m.manager==context.user._id})>=0 &&item.managers[item.managers.findIndex(m=>{return m.manager==context.user._id})].access.businessAccess.products){
                  props.navigation.navigate("listProducts");
              }
              if(item.managers.length>0&&item.managers.findIndex(m=>{return m.manager==context.user._id})>=0 &&item.managers[item.managers.findIndex(m=>{return m.manager==context.user._id})].access.businessAccess.orders){
                props.navigation.navigate("businessorders");
              }
             if(item.owner==context.user._id){
              props.navigation.navigate("businessDash");
    
             }
              setModalListPartners(!modalListPartners)
    
            }
        
          
    
    
    
    
          
    
        
      }
    
    
        else {
          setModalListPartners(!modalListPartners)
          context.setPartner(null);
    
          props.navigation.navigate("Settings")
        }
      }
        
      const checkProfile = () => {
        let _profiles = [];
    
        if (context.user.isVendor) {
          _profiles = context.user.workPlaces;
    
          if(context.partner && context.user.workPlaces.findIndex(partner=>{return partner._id == context.partner._id})){
            setProfile(context.partner);
        }

        }
        if (context.user.isPartner) {
            _profiles = context.user.partners;
            if(context.partner && context.user.partners.findIndex(partner=>{return partner._id == context.partner._id})){
              setProfile(context.partner);
          }
          }
        if (_profiles.findIndex(p => { return p._id == context.user._id }) == -1) {
          _profiles.push(context.user);
          if(!context.partner){
              setProfile(context.user);
          }
    
        }
        setProfiles(_profiles);
    
        // setProfiles([context.user,...profiles]);
        setProfileChecked(!profileChecked);
        setModalListPartners(!modalListPartners)
      }
    

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

    const startManagerConversationHandler = (manager,image)=>{
        const conversation =  context.openConversationHandler({},{user:context.user,other:{...manager,photo:image.uri ? image.uri:image}},"personal");
         props.navigation.navigate("conversation",{conversation,orders:true})
    }

    const startDelivererConversationHandler = (deliverer,name)=>{

         const conversation =  context.openConversationHandler({},{user:context.user,other:{_id:deliverer,pseudoname:name}},"personal");
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
                name={itemData.item.pseudoname}
                time={itemData.item.phone}
                deliverer={itemData.item.user}
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
                     <TouchableOpacity onPress={openDrawer} style={{height:Dimensions.get("screen").width*0.04,width:Dimensions.get("screen").width*0.04}}>
                        <Image source={context.darkMode ?  require("../../assets/menu_dark.png"):require("../../assets/menu.png")} style={{height:"100%",width:"100%",resizeMode:"cover"}}/>
                        </TouchableOpacity>
                     </View>
                <View style={styles.titleContainer}>
                    <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Business Dashboard</Text>

                </View>
                <View style={{
                            width: "15%",
                            height: "100%",
                    
                }}>
                    <TouchableOpacity  onPress={() => { checkProfile() }} style={{width: "100%",  flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
}}>
  <Image
                    
                    style={{ height: Dimensions.get("screen").width*0.07, width:  Dimensions.get("screen").width*0.07, borderRadius:  Dimensions.get("screen").width*0.07, borderColor: "#2474F1", borderWidth: 1 }}                 
                       source={context.partner ? context.partner.profileImage ? {uri:context.partner.profileImage}:require('../../assets/user_image.png') : context.user ? context.user.photo ? { uri: context.user.photo } : require('../../assets/user_image.png') :require('../../assets/user_image.png')} />
                    </TouchableOpacity>

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
<Modal

transparent={true}
animationType={'slide'}
visible={modalListPartners}

>
<View style={{ backgroundColor: "#000000aa", flex: 1 }}>
  <View style={{ width: Dimensions.get("screen").width, height: 200, alignSelf: "center", backgroundColor: "white" }}>
    <View style={{ width: "100%", height: "95%" }}>
      <FlatList
        data={profiles}
        renderItem={({ item }) =>
        (
          <TouchableOpacity key={item._id} onPress={() => { checkAccount(item) }}>
            <View style={{ flexDirection: "row", width: "100%", height: 60 }}>
              <View style={{ width: "20%", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Image style={{ width: 50, height: 50, borderRadius: 50, resizeMode: "contain" }} source={item.photo ? { uri: item.photo } : item.profileImage ? { uri: item.profileImage } : require("../../assets/user_image.png")} />
              </View>
              <View style={{
                width: "60%", height: "100%", flexDirection: "column",
                justifyContent: "center"
              }}>

                <Text style={{ marginHorizontal: 15, fontFamily: 'Poppins', fontSize: 15 }}>{item.firstName ? item.firstName + " " + item.lastName : item.partnerName}</Text>
              </View>
              <View style={{ width: "20%", height: "100%", flexDirection: "column", justifyContent: "center" }}>
                <View style={profile === item ? { width: 30, height: 30, borderRadius: 30, borderColor: "#2474F1", borderWidth: 8, alignSelf: "center" } : { width: 30, height: 30, borderRadius: 30, borderColor: "#dbdbdb", borderWidth: 1, alignSelf: "center" }}></View>
              </View>

            </View>
          </TouchableOpacity>

        )
        }
        keyExtractor={item => item._id}
      >
      </FlatList>
      <View style={{ width: "100%", height: "5%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <ScrollView  onScroll={() => { setModalListPartners(!modalListPartners) }}>
          <View style={{ width: 50, height: 3, backgroundColor: "black", borderRadius: 5 }}></View>
        </ScrollView>
      </View>
    </View>

  </View>
</View>

</Modal>

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
                <View style={context.darkMode ? { justifyContent: "center", alignItems: "center", flexDirection: "column", flex: 1 ,backgroundColor:"black"}:{ justifyContent: "center", alignItems: "center", flexDirection: "column", flex: 1 }}>
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
        width: "75%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    Title: {
        fontWeight: "700",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07
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
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
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
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
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
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
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
        fontFamily:'Poppins',fontSize: 15,
        fontWeight: 'bold'
    },
    titlesStylesDark:{
        fontFamily:'Poppins',fontSize: 15,
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



