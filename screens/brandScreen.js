import React, { useContext, useState,useEffect } from 'react'
import {View,Text,StyleSheet, Dimensions,Image, TouchableOpacity} from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native-gesture-handler';
import {getPartnersByServiceName} from '../rest/partnerApi'


export default function Brand(props){
    const context = useContext(AuthContext)
    const [dark,setDark] =  useState(true);
    const [partners,setPartners]=useState([]);
    const [magictap,setmagicTap]= useState(false)

    /*

    useEffect(()=>{
        setDarkmode(context.darkMode)
    },[context.darkMode])
    */

    useEffect(()=>{
        getPartnersByServiceName('wear').then(_partners=>{
                setPartners(_partners)
        }).catch(err=>{
            alert("error while getting data")
        })
    },[])
    const goBack = ()=> {
            props.navigation.navigate("Home")
    }
    const checkBrand=(value)=>{
        props.navigation.navigate("singleBrand",{partner:value})
    }
        
    return(
        <View style={!dark ? styles.container: styles.containerDark}>
                <View style={styles.categories}>
                    <View style={styles.brand}>
                        <Text style={{fontSize:20,color:"white",fontWeight:"500"}}>Brand</Text>
                    </View>
                    <View style={dark ? styles.otherDark : styles.other}>
                    <Text style={dark ? {fontSize:20,color:"white",fontWeight:"500"} :{fontSize:20,color:"black",fontWeight:"500"}}>Others</Text>
                    
                    </View>
                    
                </View>

                <View style={dark ? styles.menuDark : styles.menu}>
                    <View style={styles.leftArrowContainer}>
                    <Image style={styles.leftArrow} source={dark ? require("../assets/left-arrow-dark.png") : require("../assets/left-arrow.png")}/>
                    </View>
                 <View style={styles.titleContainer}>
                 <Text style={ dark ? styles.TitleDark : styles.Title}>Brand</Text>
                </View>     
                <View style={styles.searchContainer}>
                <FontAwesome color={dark ? "white" : "black"} style={{ padding: 0, fontSize: 24 }} name="search" onPress={goBack} />

                </View>
            
            </View>
        
            <View style={styles.partners}>
               
               {partners   && <FlatList
                    data={partners}
                    numColumns={2}
                    renderItem={({item})=>
                    <TouchableOpacity style={{width:"45%",height:140,margin:8,}} onPress={()=>{checkBrand(item)}} onMagicTap={()=>{setmagicTap(magictap=>!magictap)}}>

                    <View style={ magictap ? styles.partnerContainerTapped : (dark ? styles.partnerContainerDark : styles.partnerContainer)} >
                        <Image style={styles.partnerImage} source={item.profileImage ? {uri:item.profileImage} : require("../assets/imagenotyet.jpg")}/>        
                        <Text style={dark ? styles.partnerNameDark : styles.partnerName}>{item.partnerName}</Text>
                    </View>
                    </TouchableOpacity>


                }
                keyExtractor={item => item._id}
                
                >

                </FlatList>
                }
            </View>
        
        </View>
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
    fontSize:28
},
TitleDark:{
    fontWeight:"700",
    fontSize:28,
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
    fontSize:18,
    color:"black",
    fontWeight:"500"
},
partnerNameDark:{
    fontSize:18,
    color:"white",
    fontWeight:"500"

}




})