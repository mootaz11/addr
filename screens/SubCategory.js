import React, { useEffect, useState,useContext } from 'react'
import { SafeAreaView } from 'react-native';
import {View,Text, StyleSheet,Dimensions,Image,TouchableOpacity} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AuthContext from '../navigation/AuthContext';

export default function subCategory(props){
    const context = useContext(AuthContext);
    const [categories,setCategories]=useState(null)
    const [gender,setGender]=useState("")
    
    useEffect(()=>{
        if(props.route.params.gender)
        {setGender(props.route.params.subCategory)}
        if(props.route.params.subCategories&&props.route.params.subCategories.length>0){
            setCategories(props.route.params.subCategories);
        }

    },[props.route.params.subCategory,props.route.params.subCategories])

    
    const goBack= ()=>{
        props.navigation.goBack()
    }
    
    const checkCategory=(_category)=>{
       props.navigation.navigate("products",{last_screen:"sub_category",products:_category.products})    
    }

    return(
        <SafeAreaView style={{flex:1}}>
        <View style={context.darkMode ?  styles.containerDark : styles.container}>
                <View style={context.darkMode ?  styles.menuDark : styles.menu}>
                    <View style={styles.leftArrowContainer}>
                        <TouchableOpacity style={{height:Dimensions.get("screen").height * 0.03,width:Dimensions.get("screen").height * 0.03}} onPress={goBack}>
                        <Image style={{width:"100%", height:"100%"}}  source={context.darkMode ?  require("../assets/left-arrow-dark.png"):require("../assets/left-arrow.png")}/>

                        </TouchableOpacity>
                    </View>
                 <View style={styles.titleContainer}>
                 <Text style={context.darkMode ?  styles.TitleDark : styles.Title}>{props.route.params.subCategory}</Text>
                </View>   
                <View style={styles.searchContainer}>
                {/* <FontAwesome color={context.darkMode ?  "white" : "black"} style={{ padding: 0, fontFamily:'Poppins',fontSize: 24 }} name="search"  /> */}

                </View>
            
            </View>
       {
           categories ? 
           <View style={styles.categoriesContainer}>
           <FlatList
               data={categories}
               renderItem={
                   ({item})=>
                   <TouchableOpacity onPress={()=>{checkCategory(item)}}>
                   <View style={styles.category}>
                       <View style={{marginLeft:8}}>
                           <Text style={context.darkMode ?  {fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.05,fontWeight:"400",color:"white"}:{fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.05,fontWeight:"400"}}>{item.name}</Text>
                       </View>
                       <View style={{width:Dimensions.get("screen").width*0.08, height:"80%",justifyContent:"center",alignItems:"center" ,marginRight:8}}>
                        <Image style={styles.arrowright} source={context.darkMode ?  require("../assets/right-arrow-dark.png"):require("../assets/right-arrow.png")}/>
                       </View>
                   </View>
                   </TouchableOpacity>
               }
               keyExtractor={item=>item._id}
           >

           </FlatList>
       </View>
    :
    <View style={{width:"100%",height:"100%",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <Text style={context.darkMode ? {fontFamily:'Poppins',fontSize:20,color:"white",textAlign:"center"}:{fontFamily:'Poppins',fontSize:20,color:"black",textAlign:"center"}}>no sub categories Found for this category</Text>
    </View>
           
       }
           

        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    categoriesContainer:{
        width:"100%",
        height:"72%",
        position:"absolute",
        top:"20%",
    },
    category:{
        width:"100%",
        height:40,
        justifyContent:"space-between",
        alignItems:"center",
        marginVertical:8,
        flexDirection:"row"
    },
    arrowright:{
        width:"80%",
        height:"80%",
        resizeMode:'contain'
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
    
    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
        marginBottom: 8,
        marginTop:10
    },
    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",
        marginBottom: 8,
        marginTop:10


    },
    leftArrowContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop:5
    },
    leftArrow: {
        width: 30,
        height: 30
    },
    
    titleContainer:{
        width:"80%",
        height:"100%",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center"
    },
    Title: {
        fontWeight: "700",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
    },
    TitleDark: {
        fontWeight: "700",
        fontFamily:'Poppins',fontSize: Dimensions.get("window").width * 0.07,
        color: "white"

    },
    searchContainer:{
        width:"10%",
        height:"100%",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center"
    },
    
})