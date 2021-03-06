import React, { useContext, useState,useEffect } from 'react'
import {View,Text,StyleSheet, Dimensions,Image, TouchableOpacity,SafeAreaView} from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native-gesture-handler';
import {getPartnersByServiceName} from '../rest/partnerApi'


export default function Brand(props){
    const context = useContext(AuthContext)
    const [partners,setPartners]=useState([]);
    const [magictap,setmagicTap]= useState(false)
    const [pageName,setPageName]=useState("");
    

    useEffect(()=>{
        setPageName(props.route.params.serviceName);
        getPartnersByServiceName(props.route.params.serviceName).then(_partners=>{
                setPartners(_partners)
        }).catch(err=>{
            alert("error while getting data")
        })
    },[props.route.params])
    
    
    
    const goBack = ()=> {
            props.navigation.navigate("Home");
    }
    const checkBrand=(value)=>{
        props.navigation.navigate("singleBrand",{partner:value})
    }
        
    return(
        <SafeAreaView style={{flex:1}}>

        <View style={!context.darkMode ? styles.container: styles.containerDark}>
                {   props.route.params.page=="Brand" &&
                    <View style={styles.categories}>
                    <View style={styles.brand}>
                        <Text style={{fontFamily:'Poppins',fontSize:20,color:"white",fontWeight:"500"}}>Brand</Text>
                    </View>
                    <View style={context.darkMode ? styles.otherDark : styles.other}>
                    <Text style={context.darkMode ? {fontFamily:'Poppins',fontSize:20,color:"white",fontWeight:"500"} :{fontFamily:'Poppins',fontSize:20,color:"black",fontWeight:"500"}}>Others</Text>
                    
                    </View>
                    
                </View>
                }
                <View style={context.darkMode ? styles.menuDark : styles.menu}>
                    <View style={styles.leftArrowContainer}>
                    <TouchableOpacity onPress={goBack}>

                    <Image style={styles.leftArrow} source={context.darkMode ? require("../assets/left-arrow-dark.png") : require("../assets/left-arrow.png")}/>
                    </TouchableOpacity>    
                    </View>
                
                 <View style={styles.titleContainer}>
                 <Text style={ context.darkMode ? styles.TitleDark : styles.Title}>{pageName}</Text>
                </View>     
               
            
            </View>
        
            <View style={styles.partners}>
               
               {partners   && <FlatList
                    data={partners}
                    numColumns={2}
                    renderItem={({item})=>
                    <TouchableOpacity style={{width:"45%",height:140,margin:8,}} onPress={()=>{checkBrand(item)}} onMagicTap={()=>{setmagicTap(magictap=>!magictap)}}>

                    <View style={ magictap ? styles.partnerContainerTapped : (context.darkMode ? styles.partnerContainerDark : styles.partnerContainer)} >
                        <Image style={styles.partnerImage} source={item.profileImage ? {uri:item.profileImage} : require("../assets/imagenotyet.jpg")}/>        
                        <Text style={context.darkMode ? styles.partnerNameDark : styles.partnerName}>{item.partnerName}</Text>
                    </View>
                    </TouchableOpacity>


                }
                keyExtractor={item => item._id}
                
                >

                </FlatList>
                }
            </View>
        
        </View>
        </SafeAreaView>

    );

}


const styles = StyleSheet.create({
    categories:{
        position:"absolute",
        top:"14%",
        width:"100%",
        height:60,
        elevation:10,
        zIndex:50,
        flexDirection:"row",

    },
    brand:{
        height:"90%",
        width:120,
        backgroundColor:"#2474F1",
        borderRadius:20,
        marginHorizontal:10,
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center"

        
    },
    other:{
        height:"90%",
        width:120,
        backgroundColor:"white",
        borderRadius:20,
        marginHorizontal:10,
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center"


        
    },
    otherDark:{
        height:"90%",
        width:120,
        backgroundColor:"#292929",
        borderRadius:20,
        marginHorizontal:10,
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center"
    },
container : {
    flex:1,
    flexDirection:"column",
    height:Dimensions.get("window").height,
    width:Dimensions.get("window").width,
    backgroundColor:"#F2F6FF",
},       

containerDark : {
    flex:1,
    flexDirection:"column",
    height:Dimensions.get("window").height,
    width:Dimensions.get("window").width,
    backgroundColor: "#121212",

},
menu:{
    width:"100%",
    height:"10%",
    backgroundColor:"white",
    flexDirection:"row",
},
menuDark:{
    width:"100%",
    height:"10%",
    backgroundColor: "#121212",
    flexDirection:"row",
},
leftArrowContainer:{
    width:"10%",
    height:"100%",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
},
leftArrow:{
    width:30,
    marginTop:8,
    height:30
},

titleContainer:{
    width:"80%",
    height:"100%",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
},
Title:{
    fontWeight:"700",
    color:"black",
    fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
},
TitleDark:{
    fontWeight:"700",
    fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
    color:"white"
},
searchContainer:{
    width:"10%",
    height:"100%",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
},
partners:{
    width:"100%",
    height:"90%"
},
partnerContainer:{
    width:"100%",
    height:"100%",
    backgroundColor:"white",
    borderRadius:8,
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
},
partnerContainerDark:{
    width:"100%",
    height:"100%",
    borderRadius:8,
    backgroundColor:"#292929",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
},
partnerContainerTapped:{
    width:"100%",
    height:"100%",
    backgroundColor:"#2474F1",
    borderRadius:8,
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
},
partnerImage:{
    width:80,
    height:80,
    borderRadius:80,
    resizeMode:"cover"
},
partnerName:{
    fontFamily:'Poppins',fontSize:18,
    color:"black",
    fontWeight:"500"
},
partnerNameDark:{
    fontFamily:'Poppins',fontSize:18,
    color:"white",
    fontWeight:"500"

}




})