

import React,{useContext} from 'react';
import {Dimensions, View,Image,Text,TouchableOpacity,StyleSheet} from 'react-native';
import AuthContext from '../navigation/AuthContext';
import { FlatList} from 'react-native-gesture-handler';
import Product from './singleProduct';

const  partner = (props)=>{
    const context= useContext(AuthContext);
    


    return (
        <View    style={{width: "100%",height: Dimensions.get("screen").height / 3}}>
        <View style={{ width: "100%", height: "25%",  flexDirection: "row"}}>
         
         <TouchableOpacity style={{ width: "50%", height: "100%"}} onPress={props.checkPartner.bind(this,props.partner)}>
          <View style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
            <Image style={{ width: Dimensions.get("screen").width*0.14, height: Dimensions.get("screen").width*0.14,
             borderRadius: Dimensions.get("screen").width*0.14, marginHorizontal: 10 }} source={{uri:props.profileImage}} />
            <Text style={context.darkMode ? { fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width * 0.04, color: "white" } : { fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>{props.partnerName}</Text>
          </View>
          </TouchableOpacity>
         
          <View style={{ width: "50%", height: "100%" ,flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity style={{width: "80%", height: "100%",flexDirection: "row", alignItems: "center" ,justifyContent:"flex-end"}} onPress={props.checkPartner.bind(this,props.partner)}
           >
              <Text style={{ fontFamily:'PoppinsBold',fontSize: Dimensions.get("screen").width * 0.03, color: "#2474F1" }}>voir la boutique</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ width: "100%", height: "78%"}}>
        <FlatList
            data={props.products}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={
              ({ item }) =>
                        <Product
                          mainImage={item.mainImage ? {uri:item.mainImage} : require("../assets/imagenotyet.jpg")}
                          name={item.name}
                          description={item.description}
                          basePrice={item.basePrice}
                            />   
            }

            keyExtractor={(item, index) => (index+item._id).toString()}
            >
          </FlatList>
        </View>

      </View>
    )
}
const styles = StyleSheet.create({
    price: {
      fontFamily:'Poppins',fontSize: 14,
      color: "grey",
      fontWeight: "100",
    },
    productImage: {
      height: "70%",
      width: "100%",
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      resizeMode: "cover"
    },
    productTitle: {
      fontFamily:'Poppins',fontSize: 16,
      color: "black",
      fontWeight: "400"
    },
    productTitleDark: {
      fontFamily:'Poppins',fontSize: 16,
      color: "white",
      fontWeight: "400",
  },
    product: {
      height: "100%",
      width: 140,
      marginHorizontal: 8,
      backgroundColor: "white",
      borderRadius: 8
    },
    productDark: {
      height: "100%",
      width: 140,
      marginHorizontal: 8,
      borderRadius: 8,
      backgroundColor: "black",
  
  
  },
    City: {
      marginVertical: 6,
      padding: 5,
      width: Dimensions.get("screen").width,
      height: "5%",
      flex: 1,
      shadowColor: '#fff',
      shadowOffset: { width: 1, height: 1 },
      shadowColor: '#333',
      shadowOpacity: 0.3,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  
  
    },
  
    domainsContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      marginHorizontal: 1,
      width: Dimensions.get("screen").width * 0.45,
      height:"98%",
      overflow: "hidden"
    },
  
  
  
  
  
    partnersContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      width: 180,
      marginRight: 8,
      height: "94%",
  
    },
  
  
  
    servicetitle: {
      color: "white",
      textAlign: "center"
    },
    imageService: {
      width: Dimensions.get("screen").width * 0.17,
      height: Dimensions.get("screen").width * 0.17,
      borderRadius: Dimensions.get("screen").width * 0.17,
      resizeMode: "cover",
      marginRight: 3
    },
    searchInput: {
      color: "black",
      textDecorationLine: 'underline',
      fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.045
  
    },
    searchInputDark: {
      color: "white",
      textDecorationLine: 'underline',
      fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.045
    }
    ,
  
    container: {
      flex: 1
    },
  
  
    imageContainer: {
      position: "absolute",
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      elevation: 10,
      shadowOpacity: 0.5,
      padding: 10,
      alignSelf: "flex-end",
      flexDirection: "row",
  
  
    },
    listPartners: {
      position: "absolute",
      alignSelf: 'center',
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      elevation: 10,
      top: 0,
      backgroundColor: "white",
      width: "98%",
      height: 150,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      //flex:1,
      shadowOpacity: 0.5,
    }
    ,
    searchCity: {
      position: "absolute",
      top: "9%",
      left: "81%",
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: Dimensions.get("screen").width*0.15,
      height: Dimensions.get("screen").width*0.15,
      borderRadius: Dimensions.get("screen").width*0.15,
      backgroundColor: "#2474F1",
    },
    Mycode: {
      position: "absolute",
      top: "9%",
      left: "4%",
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      flexDirection: "row",
      alignSelf: "center",
      width: "76%",
      height: Dimensions.get("screen").width*0.15,
      borderRadius: Dimensions.get("screen").width*0.15/2,
      backgroundColor: "#2474F1",
    },
    geoInfo: {
      position: "absolute",
      top: "22%",
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      flexDirection: "column",
      alignSelf: "center",
      padding: 10,
      width: "96%",
      height: "22%",
      borderRadius: 10,
    },
    coordinatesSettings: {
      margin: "2%",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
  
    },
    coordSettingsIcon: {
      width: "8%",
      height: "100%",
      margin: "1%",
      resizeMode: "contain"
    },
    codeManup: {
      color: "white",
      fontWeight: "700",
      letterSpacing: 1,
      fontFamily:'Poppins',fontSize: 15,
      textShadowColor: "black",
      textShadowOffset: { width: 0.5, height: 0.5 },
      textShadowRadius: 1
    },
    dropDown: {
      width: "80%",
      height: "80%",
      resizeMode: 'contain'
    },
    dropDownContainer: {
      width: "20%",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",
      height: "100%",
     
      marginHorizontal: 10,
  
    },
    smartCode: {
      marginTop:3,
      fontFamily:'Poppins',fontFamily:'Poppins',
      fontSize: Dimensions.get("window").width * 0.03,
      color: "white",
      fontWeight: "700",
      fontFamily:'Poppins'
    },
  
    menu: {
  
      position: "absolute",
      left:"4%",
      height: Dimensions.get("screen").height * 0.03,
      width: Dimensions.get("screen").height * 0.03,
      marginTop: Platform.OS == 'ios' ? 40 : 35, 
    },
    searchBar: {
      position: "absolute",
      top: "65%",
      alignSelf: "center",
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      flexDirection: "row",
      padding: 10,
      shadowOpacity: 0.5,
      width: "80%",
      height: "8%",
      borderRadius: 10,
    },
    searchBarAfterSetService: {
      position: "absolute",
      top: "50%",
      alignSelf: "center",
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      flexDirection: "row",
      padding: 10,
      shadowOpacity: 0.5,
      width: "80%",
      height: "8%",
      borderRadius: 10,
    },
  
    domainswithoutPartners: {
      position: "absolute",
      top: "74%",
      left: "2%",
      height: "18%",
      width: "100%",
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      elevation: 10,
    },
    domainswithPartners: {
      position: "absolute",
      top: "55%",
      width: "100%",
      left: "0%",
      height: Dimensions.get("window").width * 0.24,
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      elevation: 10,
      zIndex:50
    },
  
    domainswithPartnersDark: {
      position: "absolute",
      backgroundColor:"black",
      top: "55%",
      width: "100%",
      left: "0%",
      height: Dimensions.get("window").width * 0.24,
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      elevation: 10,
      zIndex:50
    },
  
    domainswithServices: {
      position: "absolute",
      backgroundColor:"white",
      top: "68%",
      width: "100%",
      left: "0%",
      height: Dimensions.get("window").width * 0.16,
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      elevation: 10,
    },
    domainswithServicesDark: {
      position: "absolute",
      backgroundColor:"black",
      top: "68%",
      width: "100%",
      left: "0%",
      height: Dimensions.get("window").width * 0.16,
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      elevation: 10,
    },
    partners: {
      position: "absolute",
      top: "70%",
      left: "2%",
      width: "100%",
      height: "18%",
      marginTop: Platform.OS == 'ios' ? 30 : 20,
      elevation: 10,
    },
    
   
  
  
    service: {
      marginHorizontal: 1,
      width: Dimensions.get("window").width * 0.4,
      height: "98%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      backgroundColor: "#e3e3e3",
      borderColor:"#c7c7c7",
      borderWidth:2,
      borderRadius: 8
    },
    serviceDark:{
      marginHorizontal: 1,
      width: Dimensions.get("window").width * 0.4,
      height: "98%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      backgroundColor: "#333333",
      borderRadius: 11,
    },
    serviceChosenWithDomain: {
      marginHorizontal: 1,
      alignItems: "center",
      width: Dimensions.get("window").width * 0.28,
      height: "95%",
      flexDirection: "row",
      justifyContent: "center",
      borderColor: '#2474F1',
      borderWidth: 2,
      borderRadius: 11
    },
    serviceWithDomain: {
      marginHorizontal: 1,
      width: Dimensions.get("window").width * 0.28,
      height: "95%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      backgroundColor: "#e3e3e3",
      borderRadius:11
    },
    serviceChosen: {
      marginHorizontal: 1,
      justifyContent: "space-evenly",
      alignItems: "center",
  
      width: Dimensions.get("window").width * 0.4,
      height: "98%",
      flexDirection: "row",
      borderColor: '#2474F1',
      borderWidth: 2,
      backgroundColor: "#e3e3e3",
      borderRadius: 11
    },
  
    serviceChosenDark: {
      marginHorizontal: 1,
      justifyContent: "space-evenly",
      alignItems: "center",
  
      width: Dimensions.get("screen").width * 0.4,
      height: "98%",
      flexDirection: "row",
      borderColor: '#2474F1',
      borderWidth: 2,
      backgroundColor: "#333333",
      borderRadius: 11
    }
  });
  
export default partner ; 