import React, { useContext, useState,useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Dimensions, TouchableOpacity,ActivityIndicator,Modal,SafeAreaView,Alert    } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import MarkListItem from '../../common/MarkListItem';
import FeedbackListItem from '../../common/FeedbackListItem';
import AuthContext from '../../navigation/AuthContext';
import {getDelivererDashboard} from '../../rest/partnerApi';
import {ScrollView} from 'react-native-gesture-handler';


const DeliveryDashboardScreen = (props) => {
    const context = useContext(AuthContext);
    const [dashboard,setDashboard]= useState(null);
    const [modalListPartners, setModalListPartners] = useState(false)
    const [profile, setProfile] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [profileChecked, setProfileChecked] = useState(false);
  


    useEffect(() => {
        if(context.partner){
            getDelivererDashboard(context.partner._id).then(_dashboard=>{
                setDashboard(_dashboard)
            }).catch(err=>{
                alert("error has been occured")
            }) 
        }
            
        return () => {}
    }, [context.partner])
    
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
    


    const formatData = (data) => {
        const numberOfFullRows = Math.floor(data.length / 2);

        let numberOfElementsLastRow = data.length - (numberOfFullRows * 2);
        while (numberOfElementsLastRow !== 2 && numberOfElementsLastRow !== 0) {
            data.push({
                id: 'nul',
                empty: true
            });
            numberOfElementsLastRow = numberOfElementsLastRow + 1;
        };
        return data;
    };

    const openDrawer = () => { props.navigation.openDrawer() }
    const renderListMarkersItem = (itemData) => {
        if(itemData.item.partner){
        return (
            <MarkListItem
            darkMode={context.darkMode}
            index={itemData.index + 1}
                image={{uri:itemData.item.partner.profileImage}}
                name={itemData.item.partner.partnerName}
                price={itemData.item.price+"DT"}
                empty={!!itemData.item.empty}
            />
        );}
        else {
            return <View></View>
        }

    };


    const checkAccount = (item) => {
        setProfile(item);
        if (!item.firstName) {
          context.setPartner(item);
            
            if(item.delivery.cities.length>0 || item.delivery.regions.length>0){
                if(item.owner ==context.user._id){
                    props.navigation.navigate('deliveryDash');
                }
    
                if (item.managers.length > 0 && item.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
                &&item.managers[item.managers.findIndex(manager => { return manager.user == context.user._id })].access.deliveryAccess.deposit) {
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
              if(item.managers.findIndex(m=>{return m.manager==context.user._id})>=0 &&item.managers[item.managers.findIndex(m=>{return m.manager==context.user._id})].access.businessAccess.orders){
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
    



    const renderListFeedbacksItem = (itemData) => {
        return (
            <FeedbackListItem
                darkMode={context.darkMode}
                image={{uri:itemData.item.user.photo}}
                message={itemData.item.comment}
                rate={itemData.item.score}
            />
        );
    };



    
    return (
        <SafeAreaView style={{flex:1}}>

<View style={context.darkMode ? styles.mainContainerDark : styles.mainContainer}>
<View style={context.darkMode ?  styles.menuDark: styles.menu}>
            <View style={styles.leftArrowContainer} >
                     <TouchableOpacity onPress={openDrawer} style={{height:Dimensions.get("screen").width*0.04,width:Dimensions.get("screen").width*0.04}}>
                        <Image source={context.darkMode ?  require("../../assets/menu_dark.png"):require("../../assets/menu.png")} style={{height:"100%",width:"100%",resizeMode:"cover"}}/>

                        </TouchableOpacity>
                     </View>
                <View style={styles.titleContainer}>
                    <Text style={context.darkMode ? styles.TitleDark : styles.Title}>Delivery Dashboard</Text>

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
            
{dashboard?
          
          <View style={context.darkMode ? styles.mainContainerDark : styles.mainContainer}>

            <View style={styles.partOne}>
                <LinearGradient
                    colors={['#2474f1', '#8c4aac']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.part1}
                >
                    <View style={styles.paragraphContainer}>

                        <Text style={styles.textStyleTitre}>HI , {context.user.lastName.charAt(0).toUpperCase() + context.user.lastName.slice(1)}</Text>
                        <Text style={styles.textStyleTitle}>Ready to start your day with addressti</Text>

                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={require('../../assets/images/box.png')}
                        />
                    </View>
                </LinearGradient>
                <View style={styles.part2}>
                    <View style={styles.cardContainer}>
                        <Text style={context.darkMode ?{color:"white"}:{color:"black"}}>Delivery Fees</Text>
                        <LinearGradient
                            colors={['#256ced', '#564fc6']}
                            start={[0, 0]}
                            end={[1, 1]}
                            style={styles.cardValueContainer}
                        >
                            <Text style={styles.textValuesStyle}>{dashboard.addrestiFees+"DT"}</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.cardContainer}>
                    <Text style={context.darkMode ?{color:"white"}:{color:"black"}}>Business Money</Text>
                        <LinearGradient
                            colors={['#6454c3', '#9440a1']}
                            start={[0, 0]}
                            end={[1, 1]}
                            style={styles.cardValueContainer}
                        >
                            <Text style={styles.textValuesStyle}>{dashboard.earnings+"DT"}</Text>
                        </LinearGradient>
                    </View>
                </View>
                <View style={styles.part2}>
                    <View style={styles.cardContainer}>
                    <Text style={context.darkMode ?{color:"white"}:{color:"black"}}>Total</Text>
                        <LinearGradient
                            colors={['#376de5', '#654fbd']}
                            start={[0, 0]}
                            end={[1, 1]}
                            style={styles.cardValueContainer}
                        >
                            <Text style={styles.textValuesStyle}>{dashboard.totalRevenu+"DT"}</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.cardContainer}>
                    </View>
                </View>
                <View style={context.darkMode ? styles.part4Dark :styles.part4}>
                    <View style={styles.wheelImageContainer}>
                        <Image
                            style={styles.wheelImage}
                            source={require('../../assets/images/wheel.png')}
                        />
                    </View>
                    <View style={styles.drivingTotalContainer}>
                        <Text style={context.darkMode ? {fontWeight:"bold",color:"white"}:{ fontWeight: 'bold',color:"black" }}>Driving Totals</Text>
                    </View>
                    <View style={styles.completedDeliveryContainer}>
                        <Text style={context.darkMode?{color:"white"}:{color:"black"}}>{dashboard.completedOrdersCount}</Text>
                        <Text style={context.darkMode ? styles.smallTextDark:styles.smallText}>completed Delivery</Text>
                    </View>
                    {/* <View style={styles.completedDeliveryContainer}>
                        <Text>9,074.63</Text>
                        <Text style={styles.smallText}>Online Km</Text>
                    </View> */}
                </View>
            </View>
            <View
                style={{
                    borderBottomColor:context.darkMode ? "#292929": '#d8d8d8',
                    borderBottomWidth: 1,
                    marginLeft: 5,
                    marginRight: 5,
                    marginTop: 5,
                    marginBottom: 5
                }}
            />
       
            {
               dashboard && dashboard.unCompletedOrders  &&
            <View style={context.darkMode ? styles.partTwoDark: styles.partTwo}>
            
               
                <View style={styles.titreContainer}>
                    <Text style={context.darkMode ? styles.titreStyleDark:styles.titreStyle}>Money for return </Text>
                </View>
                <View style={styles.listContainer}>
                    <FlatList
                        data={formatData(dashboard.unCompletedOrders)}
                        renderItem={renderListMarkersItem}
                        numColumns={2}
                    />
                    
                </View>
    
    </View>
    
            }
    <View
                style={{
                    borderBottomColor:context.darkMode ? "#292929": '#d8d8d8',
                    borderBottomWidth: 1,
                    marginLeft: 5,
                    marginRight: 5,
                    marginTop: 5,
                    marginBottom: 5
                }}
            />
    {
     dashboard.feedbacks&& dashboard.feedbacks.length>0 &&
     <View style={context.darkMode ?styles.partThreeDark : styles.partThree}>
                <View style={styles.feedbacksTitreContainer}>
                    <Text style={context.darkMode ? styles.titreStyleDark: styles.titreStyle}>Feedbacks</Text>
                </View>
                <View style={styles.listFeedbacksContainer}>
                    <FlatList
                        data={dashboard.feedbacks}
                        renderItem={renderListFeedbacksItem}
                    />
                </View>
            </View>
    }
    </View>
    :
    <View style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
}
</View>
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

        </SafeAreaView>

    )
            
           
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    mainContainerDark:{
        backgroundColor: "#121212",
        flex:1
    },
    partOne: {
        //backgroundColor:'blue',
        flex: 3.75,
        borderRadius: 20,
        alignItems: 'center',
    },

    part1: {
        //backgroundColor:'red',
        flex: 1.5,
        width: '92%',
        marginTop: 25,
        marginBottom: 3,
        borderRadius: 20,
        flexDirection: 'row'
    },
    paragraphContainer: {
        //backgroundColor:'green',
        flex: 1.75,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    textStyleTitre: {
        color: 'white',
        fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.06,
        fontWeight: 'bold'
    },
    textStyleTitle: {
        color: 'white',
        fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03,

    },
    imageContainer: {
        //backgroundColor:'purple',
        alignItems: 'center',
        flex: 1
    },
    image: {
        //backgroundColor:'green',
        position: 'absolute',
        //bottom:'10%',
        top: '-33%',
        right: '5%',
        height: '140%',
        width: '100%',
        resizeMode: 'contain',
    },

    part2: {
        //backgroundColor:'yellow',
        flex: 1,
        flexDirection: 'row',
        width: '92%',
        //marginTop: 3
    },
    cardContainer: {
        //backgroundColor:'green',
        alignItems: 'center',
        flex: 1,
        //margin:3
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
    cardValueContainer: {
        //backgroundColor: 'gray',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 9,
        borderRadius: 15,
        width: '93%'
    },
    textValuesStyle: {
        color: 'white',
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width*0.075,
        fontWeight: 'bold'
    },

    part4: {
        backgroundColor: '#e6e6e6',
        flex: 0.7,
        width: '92%',
        flexDirection: 'row',
        marginVertical: 10,
        borderRadius:8
    },
    part4Dark:{
        backgroundColor: '#292929' ,
        flex: 0.7,
        width: '92%',
        flexDirection: 'row',
        marginVertical: 10,
        borderRadius:8

    },
    wheelImageContainer: {
        //backgroundColor:'orange',
        flex: 0.5,
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    wheelImage: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain'
    },
    drivingTotalContainer: {
        //backgroundColor:'purple',
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 5
    },
    completedDeliveryContainer: {
        //backgroundColor:'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5
    },
    smallText: {
        fontFamily:'Poppins',fontSize: 10,
        fontWeight: 'bold',
        color:"black"
    },
    smallTextDark:{
        fontFamily:'Poppins',fontSize: 10,
        fontWeight: 'bold',
        color:"white"
    },

    partTwo: {
        backgroundColor: 'white',
        flex: 1.4,
        borderRadius: 25,
    },
    partTwoDark:{
        backgroundColor: '#292929' ,
        flex: 1.4,
        borderRadius: 25,

    }
,
    titreContainer: {
        flex: 1,
        //width:'90%',
        paddingLeft: 10
    },
    titreStyle: {
        fontWeight: 'bold',
        fontFamily:'Poppins',fontSize: 16,
        marginVertical:1
        //fontStyle:'italic'
    },
    titreStyleDark:{
        marginVertical:1,
        fontWeight: 'bold',
        fontFamily:'Poppins',fontSize: 16,
        color:"white"
        //fontStyle:'italic'

    },
    listContainer: {
        //backgroundColor:'purple',
        flex: 6,
        paddingHorizontal: 5
    },



    partThree: {
        backgroundColor: 'white',
        flex: 2,
        borderRadius: 20
    },
    partThreeDark:{
        backgroundColor: '#292929',
        flex: 2,
        borderRadius: 20
    },
    feedbacksTitreContainer: {
        //backgroundColor:'green',
        flex: 1,
        paddingLeft: 10,
        marginBottom: 2
    },
    listFeedbacksContainer: {
        //backgroundColor:'orange',
        flex: 8,
        marginHorizontal: 10,
        marginBottom: 5
    }
});

export default DeliveryDashboardScreen;