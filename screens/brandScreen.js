import React, { useContext, useState,useEffect } from 'react'
import {View,Text,StyleSheet, Dimensions,Image, TouchableOpacity} from 'react-native'
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native-gesture-handler';

const partners=[
    {name:"nike",image:require("../assets/nike.jpg"),_id:"55"},
    {name:"adidas",image:require("../assets/adidas.jpg"),_id:"56"},
    {name:"h&m",image:require("../assets/hm.png"),_id:"57"},
    {name:"exist",image:require("../assets/exist.png"),_id:"58"},
    {name:"bershka",image:require("../assets/bershkadark.jpg"),_id:"59"},
    {name:"pull & bear",image:require("../assets/pullandbear.jpg"),_id:"60"},
    {name:"lacoste",image:require("../assets/lacoste.png"),_id:"61"},
    {name:"zara",image:require("../assets/zara.png"),_id:"65"}

]


export default function Brand(props){
    const context = useContext(AuthContext)
    const [darkmode,setDarkmode] =  useState(true);
    const [magictap,setmagicTap]= useState(false)

    useEffect(()=>{
        setDarkmode(context.darkMode)
    },[context.darkMode])
    
    const goBack = ()=> {

    }
    const checkBrand=(value)=>{
        props.navigation.navigate("singleBrand",{partner:value})
    }
        
    return(
        <View style={!darkmode ? styles.container: styles.containerDark}>
                <View style={styles.categories}>
                    <View style={styles.brand}>
                        <Text style={{fontSize:20,color:"white",fontWeight:"500"}}>Brand</Text>
                    </View>
                    <View style={styles.other}>
                    <Text style={{fontSize:20,color:"black",fontWeight:"500"}}>Others</Text>
                    
                    </View>
                    
                </View>

                <View style={styles.menu}>
                    <View style={styles.leftArrowContainer}>
                    <Image style={styles.leftArrow} source={require("../assets/left-arrow.png")}/>
                    </View>
                 <View style={styles.titleContainer}>
                 <Text style={styles.Title}>Brand</Text>
                </View>   
                <View style={styles.searchContainer}>
                <FontAwesome color={"black"} style={{ padding: 0, fontSize: 24 }} name="search" onPress={goBack} />

                </View>
            
            </View>
        
            <View style={styles.partners}>
                <FlatList
                    data={partners}
                    numColumns={2}
                    renderItem={({item})=>
                    <TouchableOpacity style={{width:"45%",height:140,margin:8,}} onPress={()=>{checkBrand(item)}} onMagicTap={()=>{setmagicTap(magictap=>!magictap)}}>

                    <View style={ magictap ? styles.partnerContainerTapped : styles.partnerContainer} >
                        <Image style={styles.partnerImage} source={item.image}/>        
                        <Text style={styles.partnerName}>{item.name}</Text>
                    </View>
                    </TouchableOpacity>


                }
                keyExtractor={item => item._id}
                
                >

                </FlatList>

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
    backgroundColor:"#292929"

},
menu:{
    width:"100%",
    height:"10%",
    backgroundColor:"white",
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
    color:"back",
    fontWeight:"500"
}




})