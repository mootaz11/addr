import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Dimensions,TextInput,Modal} from 'react-native'
import { Picker } from '@react-native-community/picker';
import DatePicker from 'react-native-datepicker'
import AuthContext from '../../navigation/AuthContext';
import _ from 'lodash';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import {getArrivedOrders} from '../../rest/ordersApi'
import {getCities} from '../../rest/geoLocationApi'
import Geocoder from 'react-native-geocoding';




export default function debouItems(props) {
    const context = useContext(AuthContext);
    const [settingPressed,SetSettingPressed]=useState(false);
    const [deposit,setDeposit]=useState(null);
    const [deposit_orders,setDeposit_orders]=useState([]);
    const [settings,setSettings]=useState({_id:'',collectDeliverer:'',clientDeliverer:'',date:'',city:'',region:''})
    const [cities,setCities]=useState([]);
    const [regions,setRegions]=useState([]);
    const [showDeleteOrder, setShowDeleteOrder] = useState(false);
    const [showPopup,setShowPopup]=useState(false);
    const [order_id,setOrderId]=useState(null);
    const [livreursCollect,setLivreursCollect]=useState([])
    const [livreurLiv,setLivreursLiv]=useState([])
    const [region,setRegion]=useState(false);
    const [city,setCity]=useState(false);
    const [modalListPartners, setModalListPartners] = useState(false)
    const [profile, setProfile] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [profileChecked, setProfileChecked] = useState(false);
 
 
 

const checkBasket=()=>{props.navigation.navigate("basket")}


    useEffect(() => {
        getCities().then(cities=>{
            setCities(cities)
        })
        

        getArrivedOrders(context.user._id,context.partner._id).then(_dep_orders=>{
                Geocoder.init("AIzaSyDcbXzRxlL0q_tM54tnAWHMlGdmPByFAfE"); 
                let liv_livraisons=[];
                let liv_collection=[];
         //   console.log(context.partner.managers[context.partner.managers.findIndex(manager => { return manager.user == context.user._id })].access.deliveryAccess.deposit)
              
            
            if(_dep_orders.length>0){
                _dep_orders.map(async order=>{
                    console.log(order);
                    liv_collection.push({pseudo:order.collectDeliverer.firstName +" "+order.collectDeliverer.lastName,_id:order.collectDeliverer._id})
                    if(order.clientDeliverer){
                        liv_livraisons.push({pseudo:order.clientDeliverer.firstName +" "+order.clientDeliverer.lastName,_id:order.clientDeliverer._id})    
                    }

                      const json =await  Geocoder.from({longitude:order.client.location.location.longitude,latitude:order.client.location.location.latitude })                      
                        var region = json.results[0].address_components[1].long_name
                         var city = json.results[0].address_components[2].long_name
                          order.direction=city+","+region
                          setDeposit(_dep_orders[0].deposit)
                    })

                    setLivreursCollect(liv_collection)
                    setLivreursLiv(liv_livraisons)

                    setDeposit_orders(_dep_orders);

              }
            })
    }, [])

    const openDrawer =()=>{
        props.navigation.openDrawer();
    }
    const checkOrderArrival =()=>{
        setShowPopup(!showPopup);
        props.navigation.navigate("livraisons",{last_screen:"debou_items",order_id:order_id})

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
    
    
const applyFilter=()=>{
    let _debou_orders = [...deposit_orders]

    Object.keys(settings).forEach(k => {
        if(k=='date'){
            _debou_orders=_debou_orders.filter(order=>order.collectDate&&order.collectDate.split('T')[0] == settings[k]);
        }
        if(k=='city'&&settings[k].length>0){
            _debou_orders=_debou_orders.filter(order=>order.collectCity==settings[k]);

        }
        if(k=='region'&&settings[k].length>0){
            _debou_orders=_debou_orders.filter(order=>order.collectRegion==settings[k]);

        }
        else {
            if(settings[k].length>0){
                _debou_orders=_debou_orders.filter(order=>order[k]==settings[k]);
            }
        }
       

        
    });
    setDeposit_orders(_debou_orders);
    SetSettingPressed(!settingPressed)
    setSettings({city:'',date:'',_id:'',collectDeliverer:'',clientDeliverer:'',region:''})
}

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

    const checkCity =(itemValue)=>{
        
        setSettings({...settings,city:itemValue})
        const index = cities.findIndex(city=>{return city._id ==itemValue});
        if(index>=0){setRegions(cities[index].regions);}

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={context.darkMode ? styles.containerDark : styles.container}>
             <View style={{alignSelf:"center",flexDirection:"row",width: "95%",alignItems:"center",height: "15%"}}>
      <View style={{width:"100%",height:"20%",}}>
      <View style={styles.menu}>
        <TouchableOpacity style={{flexDirection:"column",
    justifyContent:"center",
    alignItems:"center", height: Dimensions.get("screen").height * 0.03,
    width: Dimensions.get("screen").height * 0.03,
    }} onPress={() => { openDrawer() }}>

          <Image source={context.darkMode ? require("../../assets/menu_dark.png"):require("../../assets/menu.png")} style={{ height: "80%", width: "80%", resizeMode: "contain" }} />
        </TouchableOpacity>
      </View>
      <View style={
        context.darkMode ?
        {
          position: "absolute",
          width: "84%",
          alignSelf:"center",
          height: Dimensions.get("screen").height * 0.045,
          backgroundColor: "#333333",
          marginTop: Platform.OS == 'ios' ? 10 : 10,
          flexDirection: "row",
          borderRadius: 12
        }:
        {
        position: "absolute",
        alignSelf:"center",
        width: "84%",
        height: Dimensions.get("screen").height * 0.045,
        backgroundColor: "#f7f7f7",
        marginTop: Platform.OS == 'ios' ? 10 : 10,
        flexDirection: "row",
        borderRadius: 12
      }}>
        <View style={{
          width: "10%",
          height: "100%",
          borderRadius: 12,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Image style={{ width: Dimensions.get("screen").height * 0.022 , height:Dimensions.get("screen").height * 0.022 , resizeMode: "contain" }} source={require("../../assets/searchHome.png")} />
        </View>
        <View style={{
          width: "55%",
          height: "100%",
          borderRadius: 12
        }}>
          <TextInput
            style={context.darkMode ? { width: "100%",color:"white", height: Dimensions.get("screen").height * 0.045 }:{ width: "100%",color:"black", height: Dimensions.get("screen").height * 0.045 }}
            placeholderTextColor={"#B5B5B5"}
            placeholder={"Search"}
          />
        </View>
        <View style={{
          width: "35%",
          height: "100%",
          borderRadius: 12,
          flexDirection: "row",
          justifyContent:"center"
        }}>

          <View style={{ width: "30%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
            <TouchableOpacity style={{ width: "80%", height: "80%" }} onPress={checkBasket}>
              <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={context.darkMode ? require("../../assets/homeBagDark.png") : require("../../assets/homeBag.png")} />
            </TouchableOpacity>
            <View style={{ width: Dimensions.get("screen").width * 0.035, height: Dimensions.get("screen").width * 0.035, backgroundColor: "red", borderRadius: 12, flexDirection: "column", justifyContent: "center", alignItems: "center", position: "absolute", top: "55%", right: "14%" }}>
              <Text style={{ fontFamily: 'Poppins', fontSize: 10, color: "white" }}>{context.bag }</Text>
            </View>

          </View>

          <View style={{ width: "30%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
            <TouchableOpacity style={{ width: "80%", height: "80%" }} onPress={() => { checkProfile() }}>
              <Image style={{ width: Dimensions.get("screen").height * 0.035, height: Dimensions.get("screen").height * 0.035, borderRadius: Dimensions.get("screen").height * 0.35, resizeMode: "cover" }} source={context.user.photo ? { uri: context.user.photo } :require('../../assets/user_image.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      
      
      </View>
      </View>   
<View style={{width:"100%",height:"10%",flexDirection:"column",alignItems:"center"}}>
    <View style={{flexDirection:"column",justifyContent:"center",marginHorizontal:8,alignItems:"center",width:Dimensions.get("screen").width*0.09,height:Dimensions.get("screen").width*0.09,borderRadius:40,position:"absolute",top:"0%",left:"82%",borderColor:"grey",borderWidth:1}}>
        <TouchableOpacity onPress={()=>{SetSettingPressed(!settingPressed)}}>
            <Image style={{width:Dimensions.get("screen").width*0.05,height:Dimensions.get("screen").width*0.05,resizeMode:"cover"}} source={context.darkMode ? require("../../assets/setting-linesdark.png") :require("../../assets/setting-lines.png")}/>
        </TouchableOpacity>
    </View>
<Text style={{fontWeight: "300",
        color: "#cccccc",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
}}>Items in debou</Text>


</View>


    <View style={styles.ordersContainer}>
    <Text style={{fontWeight: "300",
color: "#cccccc",
textAlign:"center",
fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.05,
}}>{deposit &&deposit.name}</Text>
      {deposit_orders.length>0 &&
        <FlatList
            data={deposit_orders}
            renderItem={({ item }) =>
                <TouchableOpacity disabled={true}>
                    <View style={context.darkMode ? styles.deliveryDark : styles.delivery}>
                        <View style={styles.clientImageContainer}>
                            <Image style={{ width: "80%", height: "80%", resizeMode: "contain" }} source={require("../../assets/images/clock.png")} />
                        </View>
                        <View style={{ width: "85%", height: "100%", flexDirection: "column" }}>
                         
                            <View style={{ width: "100%", height: "80%", flexDirection: "row" }}>
                                <View style={styles.deliveryInfo}>
                                    <View style={{ width: "100%", height: "15%", flexDirection: "row" }}>
                                        <Text style={context.darkMode?{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "white" }:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>Livreur collect:</Text>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "grey" }}>{(item.client.firstName + " " + item.client.lastName).length <= 13 ? item.client.firstName + " " + item.client.lastName : (item.client.firstName + " " + item.client.lastName).substring(0, 12) + ".."}</Text>
                                    </View>
                                  <View style={{ width: "100%", height: "15%", flexDirection: "row" }}>
                                        <Text style={context.darkMode?{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "white" }:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>Date d'entree:</Text>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "grey" }}>{item.collectDate.toLocaleString().split(':')[0].split('T')[0]}</Text>
                                    </View>
                                    <View style={{ width: "100%", height: "15%", flexDirection: "row" }}>
                                        <Text style={context.darkMode?{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "white" }:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>Ajouter Par:</Text>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "grey" }}>{item.addedBy? item.addedBy.firstName+" "+item.addedBy.lastName:"not yet"}</Text>
                                    </View>
                                    <View style={{ width: "100%", height: "15%", flexDirection: "row" }}>
                                        <Text style={context.darkMode?{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "white" }:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>Direction:</Text>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "grey" }}>{item.direction }</Text>
                                    </View>
                                    <View style={{ width: "100%", height: "15%", flexDirection: "row" }}>
                                        <Text style={context.darkMode?{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "white" }:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>Livreur delivery:</Text>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "grey" }}>{"not yet"}</Text>
                                    </View>
                                    <View style={{ width: "100%", height: "15%", flexDirection: "row" }}>
                                        <Text style={context.darkMode?{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "white" }:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>Date de livraison:</Text>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "grey" }}>{item.deliveryDate ? item.deliveryDate.toLocaleString().split(':')[0].split('T')[0]:"not yet"}</Text>
                                    </View>
                                    <View style={{ width: "100%", height: "15%", flexDirection: "row" }}>
                                        <Text style={context.darkMode?{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "white" }:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>ID:</Text>
                                        <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width * 0.04, color: "grey" }}>{item._id}</Text>
                                    </View>
                                    
                                </View>
                             
                            </View>
                    

                               
                        </View>
                    </View>

                </TouchableOpacity>
            }
            keyExtractor={item => item.id}
        >
        </FlatList>
        }
   
{     settingPressed&&   
<View style={{ width: Dimensions.get("screen").width, borderTopLeftRadius:12,borderTopRightRadius:12,height: "100%",position:"absolute",top:"0%", alignSelf: "center", backgroundColor: "#ededed" }}>
<View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
    
<ScrollView style={{width:"100%"}}>
    <View style={{flex:1,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <Text style={{fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.05,color:"grey"}}>Filters</Text>
    </View>
    <View style={{width:"95%",marginVertical:8,height:80,alignSelf:"center",flexDirection:"column",backgroundColor:"white",borderRadius:12,alignItems:"center"}}>
    <Text style={{fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.04,fontWeight:"300",color:"grey",marginVertical:4}}>ID</Text>
    <TextInput
    placeholderTextColor={"grey"}
    placeholder={"enter item id"}
    onChangeText={(text)=>{setSettings({...settings,_id})}}
    style={{
flexDirection: 'row',
flex: 1,
fontSize:Dimensions.get("screen").width*0.05,
width:"96%",
backgroundColor: 'white',
color:"grey",
paddingHorizontal:8
}}>
</TextInput>
    </View>
    <View style={{width:"95%",marginVertical:8,height:80,alignSelf:"center",flexDirection:"column",backgroundColor:"white",borderRadius:12,alignItems:"center"}}>
    <Text style={{fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.04,fontWeight:"300",color:"grey",marginVertical:4}}>Livreur de Collecte</Text>
    <View style={{flex:1,backgroundColor:"white"}}>
    <Picker
                        selectedValue={settings.collectDeliverer}
                        onValueChange={(itemValue, itemIndex) => setSettings({...settings,collectDeliverer:itemValue})}
                        mode='dropdown'>

                   {livreursCollect.length>0&& livreursCollect.map((livrereur,index)=>
                    
                    <Picker.Item key={index} color={"black"} label={livrereur.pseudo} value={livrereur._id} />
                    
                        )
                    
                    } 
                    
                    </Picker>
    </View>

    </View>
    <View style={{width:"95%",marginVertical:8,height:80,alignSelf:"center",flexDirection:"column",backgroundColor:"white",borderRadius:12,alignItems:"center"}}>
    <Text style={{fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.04,fontWeight:"300",color:"grey",marginVertical:4}}>Livreur de Livraison</Text>
    <View style={{flex:1,backgroundColor:"white"}}>
    <Picker

                        selectedValue={settings.clientDeliverer}
                        onValueChange={(itemValue, itemIndex) => setSettings({...settings,clientDeliverer:itemValue})}
                        mode='dropdown'
    >
    {livreurLiv.length>0&& livreurLiv.map((livrereur,index)=>
                    
                    <Picker.Item key={index} color={"black"} label={livrereur.pseudo} value={livrereur._id} />
                    
                        )
                    
                    }                     
                    </Picker>
    </View>

    </View>
    <View style={{width:"95%",marginVertical:8,height:80,alignSelf:"center",flexDirection:"column",backgroundColor:"white",borderRadius:12,alignItems:"center"}}>
    <Text style={{fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.04,fontWeight:"300",color:"grey",marginVertical:4}}>Date</Text>
    <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
    <DatePicker
    style={{width:"95%",alignSelf:"center",justifyContent:"center"}}
cancelBtnText={"close"}
confirmBtnText={"confirm"}
date={settings.date}
onDateChange={(date)=>{setSettings({...settings,date:date})}}
/>
    </View>
    </View>
    <View style={{width:"95%",marginVertical:8,height:160,alignSelf:"center",flexDirection:"column",backgroundColor:"white",borderRadius:12,alignItems:"center"}}>
    <Text style={{fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.04,fontWeight:"300",color:"grey",marginVertical:4}}>Direction</Text>
    <View style={{width:"100%",height:60,marginVertical:2,flexDirection:"column"}}>
    <Text style={{fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.04,fontWeight:"300",color:"grey",margin:4}}>City</Text>
    <View   style={{width:"90%",height:"60%",alignSelf:"center",borderRadius:12,borderWidth:1,borderColor:"black",flexDirection:"row",alignItems:"center"}}>
    
  { cities.length>0 && city&& <View style={{width:"88%",height:"100%"}}>
    <Picker
                        selectedValue={settings.city}
                        onValueChange={(itemValue, itemIndex) => {checkCity(itemValue)}}
                        mode='dropdown'
    >
        {
            cities&&cities.length>0 && cities.map((city,index)=>
                <Picker.Item key={index }  color={"black"} label={city.cityName} value={city._id} />
            )
        }
                   
                    
                    </Picker>

        </View>}

       <TouchableOpacity onPress={()=>{setCity(!city)}}  style={{width:"12%",height:"100%",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <View style={{width:"100%",height:"100%",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
         <Image  style={{width:"100%",height:"80%",resizeMode:"contain"}} source={require("../../assets/down_settings.png")}/>
        </View>
        </TouchableOpacity>

    </View>
    </View>
    <View style={{width:"100%",height:60,marginVertical:2}}>
    <Text style={{fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.04,fontWeight:"300",color:"grey",margin:4}}>Region</Text>
    <View   style={{width:"90%",height:"60%",alignSelf:"center",borderRadius:12,borderWidth:1,borderColor:"black",flexDirection:"row",alignItems:"center"}}>
  {region&&settings.city.length>0&&<View style={{width:"88%",height:"100%"}}>
    <Picker
                        selectedValue={settings.region}
                        onValueChange={(itemValue, itemIndex) => setSettings({...settings,region:itemValue})}
                        mode='dropdown'
    >
{
            regions&&regions.length>0 && regions.map((region,index)=>
            
                <Picker.Item key={index}  color={"black"} label={region.regionName} value={region._id} />
            
            )
        }                                
                    </Picker>
        </View>}

        <TouchableOpacity onPress={()=>{setRegion(!region)}}  style={{width:"12%",height:"100%",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <View style={{width:"100%",height:"100%",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
         <Image  style={{width:"100%",height:"80%",resizeMode:"contain"}} source={require("../../assets/down_settings.png")}/>
        </View>
        </TouchableOpacity>

    </View>

    </View>

    </View>

    <View style={{width:"60%",marginVertical:8,height:60,alignSelf:"center",borderRadius:60,backgroundColor:"white"}}>
        <TouchableOpacity style={{width:"100%",height:"100%",alignItems:"center",flexDirection:"column",justifyContent:"center"}} onPress={()=>{
            applyFilter()
        }}>
            <Text style={{fontFamily:'Poppins',fontSize:Dimensions.get("screen").height*0.03,fontWeight:"300",color:"grey"}}>Apply</Text>

        </TouchableOpacity>

   </View>

    </ScrollView>

</View>


</View>
}
    </View>

   
             
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
    );
}





const styles = StyleSheet.create({
    actions: {
        width: "24%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },

    deliveryTitle: {
        width: "100%",
        height: "20%",
        flexDirection: "row",
        justifyContent: "flex-start",
    },

    deliveryInfo: {
        width: "100%",
        height: "90%",
        flexDirection: "column",
    },
    info: {
        fontFamily:'Poppins',fontSize: 12,
        fontWeight: "600"
    },
    infoDark: {
        fontFamily:'Poppins',fontSize: 12,
        fontWeight: "600",
        color: "white"
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
        width: "100%",
        height: 170,
        backgroundColor: "white",
        shadowColor: "grey",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        borderRadius: 12,
        marginVertical: 6,


    },
    deliveryDark: {
        backgroundColor: "#292929",
        width: "100%",
        height: 170,
        shadowColor: "grey",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        borderRadius: 12,
        marginVertical: 6,

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
    step: {
        width: "45%",
        height: 40,
        borderRadius: 14,
        backgroundColor: "#fcfcfc",
        margin: 6
    },
    stepDark: {
        backgroundColor: "#292929",
        width: "45%",
        height: 40,
        borderRadius: 14,
        margin: 6
    },
    stepChecked: {
        width: "45%",
        height: 40,
        borderRadius: 14,
        backgroundColor: "#2474F1",
        margin: 6
    },

    container: {
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center"

    },

    containerDark: {
        backgroundColor: "#121212",
        width: "100%",
        height: "100%",
        flexDirection: "column",
    },
    menu: {
    height: Dimensions.get("screen").height * 0.03,
    width: Dimensions.get("screen").height * 0.03,
    marginTop:Dimensions.get("screen").height * 0.03,
    },
    menuDark: {
        height: Dimensions.get("screen").height * 0.03,
        width: Dimensions.get("screen").height * 0.03,
        marginTop:Dimensions.get("screen").height * 0.03,

    },

    leftArrowContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8
    },


    titleContainer: {
        width: "80%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    Title: {
        fontWeight: "400",
        color: "#cccccc",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
    },
    TitleDark: {
        fontWeight: "400",
        color: "#fff",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,

    },
    headerElements: {
        width: "94%",
        height: "18%",
        alignSelf: "center"
    },
    ordersContainer: {
        width: Dimensions.get("screen").width*1,
        height:  Dimensions.get("screen").height*0.72,
        alignSelf: "center"
    }
}
);