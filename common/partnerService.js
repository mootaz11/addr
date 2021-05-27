

import React,{useContext} from 'react';
import {Dimensions, View,Image,Text,TouchableOpacity,StyleSheet} from 'react-native';
import { FlatList} from 'react-native-gesture-handler';


const  PartnerService = (props)=>{
    return (
      <View style={{ width: "100%", height: Dimensions.get("screen").height / 1.8, marginVertical: 2, flexDirection: "column", alignItems: "center" }}>
      <View style={{ width: "98%", height: "35%", flexDirection: "row" }}>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "flex-start", width: "25%", height: "100%" }}>
          <Image style={{
            width: Dimensions.get("screen").width * 0.2, height: Dimensions.get("screen").width * 0.2,
            borderRadius: Dimensions.get("screen").width * 0.2
          }} source={{uri:props.partnerService.profileImage}} />
        </View>
        <View style={{ flexDirection: "column", justifyContent: "flex-start", width: "75%", height: "100%" }}>
          <Text style={props.darkMode ? { fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.05, color: "white" } : { fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.05, color: "black" }}>{props.partnerService.partnerName}</Text>
          <Text style={props.darkMode ? { fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.032, color: "white" } : { fontFamily: 'Poppins', fontSize: Dimensions.get("screen").width * 0.032, color: "black" }}>{props.partnerService.description}</Text>
          <Text style={props.darkMode ? { fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.04, color: "white" } : { fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.04, color: "black" }}>Contact us: {props.partnerService.phone}</Text>
        </View>

      </View>
      <View style={{ width: "100%", height: "45%" }}>
        <FlatList
          data={props.partnerService.serviceImages}
          horizontal
          renderItem={({ item }) =>
            <View style={{ width: Dimensions.get("screen").width * 0.35, marginHorizontal: 3, height: "100%" }}>
              <Image style={{ width: Dimensions.get("screen").width * 0.35, borderRadius: 8, resizeMode: "cover", height: "100%", }} source={{uri:item}} />
            </View>

          }
          keyExtractor={(item,index )=>{ (item+index).toString()}}
        />

      </View>
      <View style={{ width: "98%", height: "20%", flexDirection: "row" }}>

        <View style={{ width: "50%", height: "100%", flexDirection: "row" }}>
          <TouchableOpacity onPress={props.openYoutube.bind(this,props.partnerService.youtube)} style={{
            height: "100%", width: '25%',marginHorizontal:2
          }}>
            <Image
              style={styles.icon}
              source={props.darkMode ? require("../assets/images/youtube_dark.png"):require("../assets/images/youtube.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={props.openInstagram.bind(this,props.partnerService.instagram)} style={{
            height: "100%", width: '25%',marginHorizontal:2
          }}>
            <Image
              style={styles.icon}
              source={props.darkMode ? require("../assets/images/instagram_dark.png") :require("../assets/images/instagram.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={props.openFacebook.bind(this,props.partnerService.facebook)} style={{
            height: "100%", width: '25%',marginHorizontal:2
          }}>
            <Image
              style={styles.icon}
              source={props.darkMode ? require("../assets/images/facebook_dark.png") : require("../assets/images/facebook.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={{ width: "50%", height: "100%", flexDirection: "column",justifyContent:"center" }}>
          <TouchableOpacity onPress={props.startConversation.bind(this,props.partnerService)} style={{ width: "98%", height: "60%"}}>
          <View style={{ width: "100%",borderRadius:12,backgroundColor:"#2474F1", height: "100%", flexDirection: "column",alignItems:"center",justifyContent:"center" }}>
                <Text style={{ fontFamily: 'PoppinsBold', fontSize: Dimensions.get("screen").width * 0.04, color: "white" }}>Send message</Text>
              </View>
          </TouchableOpacity>
          
        </View>




      </View>



    </View>
    )
}
const styles = StyleSheet.create({
  icon:{
    height:"100%",
    width:'100%',
    resizeMode:'contain',
    marginHorizontal: Dimensions.get('window').width * 0.023 //10
},
  });
  
export default PartnerService ; 