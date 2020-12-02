import React, { useEffect, useState } from 'react'
import {View,Text, StyleSheet,Dimensions,Image,TouchableOpacity} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';




export default function genderCategory(props){
    const [dark,setDark] = useState(true);
    const [categories,setCategories]=useState(null)
    const [gender,setGender]=useState("")
    useEffect(()=>{
        setGender(props.route.params.gender)
        if(props.route.params.categories.length>0){
            setCategories(props.route.params.categories);

        }
    },[props.route.params])
    const goBack= ()=>{
        props.navigation.goBack()
    }
    const checkCategory=(_category)=>{
        props.navigation.navigate("products",{previous_screen:"gender",category:_category,gender:gender.toLowerCase()})
    }
    return(
        <View style={dark ? styles.containerDark : styles.container}>
                <View style={dark ? styles.menuDark : styles.menu}>
                    <View style={styles.leftArrowContainer}>
                        <TouchableOpacity style={styles.leftArrow} onPress={goBack}>
                        <Image style={{width:"100%", height:"100%"}}  source={dark ? require("../assets/left-arrow-dark.png"):require("../assets/left-arrow.png")}/>

                        </TouchableOpacity>
                    </View>
                 <View style={styles.titleContainer}>
                 <Text style={dark ? styles.TitleDark : styles.Title}>{props.route.params.gender}</Text>
                </View>   
                <View style={styles.searchContainer}>
                <FontAwesome color={dark ? "white" : "black"} style={{ padding: 0, fontSize: 24 }} name="search"  />

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
                           <Text style={dark ? {fontSize:20,fontWeight:"400",color:"white"}:{fontSize:20,fontWeight:"400"}}>{item.name}</Text>
                       </View>
                       <View style={{width:30, height:"80%",justifyContent:"center",alignItems:"center" ,marginRight:8}}>
                        <Image style={styles.arrowright} source={dark ? require("../assets/right-arrow-dark.png"):require("../assets/right-arrow.png")}/>
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
            <Text style={{fontSize:20,color:"white"}}>no Cagetories Found for this partner</Text>
    </View>
           
       }
           

        </View>
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
        width:"100%",
        height:"100%"
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
        height:"8%",
        backgroundColor:"white",
        flexDirection:"row",
    },
    menuDark :{
        width:"100%",
        height:"8%",
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
    
})