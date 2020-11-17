import React from 'react'
import {View,Text, StyleSheet,Dimensions,Image,TouchableOpacity} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const categories = [
    {name:"Offers",_id:"50"},
    {name:"Trending Now",_id:"51"},
    {name:"View all",_id:"53"},
    {name:"T-shirt & Vesta",_id:"54"},
    {name:"Shirts",_id:"55"},
    {name:"Hoodies & Sweatshirts",_id:"56"},
    {name:"Shoes",_id:"57"},
    {name:"Troussers",_id:"58"},
    {name:"Jeans",_id:"59"},

]


export default function genderCategory(props){
    const goBack= ()=>{
        props.navigation.navigate("singleBrand");
    }
    const checkCategory=()=>{
        props.navigation.navigate("products")
    }
    return(
        <View style={styles.container}>
                <View style={styles.menu}>
                    <View style={styles.leftArrowContainer}>
                        <TouchableOpacity style={styles.leftArrow} onPress={goBack}>
                        <Image style={{width:"100%", height:"100%"}}  source={require("../assets/left-arrow.png")}/>

                        </TouchableOpacity>
                    </View>
                 <View style={styles.titleContainer}>
                 <Text style={styles.Title}>{/*props.route.params.gender*/}hello</Text>
                </View>   
                <View style={styles.searchContainer}>
                <FontAwesome color={"black"} style={{ padding: 0, fontSize: 24 }} name="search"  />

                </View>
            
            </View>
            <View style={styles.categoriesContainer}>
                <FlatList
                    data={categories}
                    renderItem={
                        ({item})=>
                        <TouchableOpacity onPress={()=>{checkCategory(item)}}>
                        <View style={styles.category}>
                            <View style={{marginLeft:8}}>
                                <Text style={{fontSize:20,fontWeight:"400"}}>{item.name}</Text>
                            </View>
                            <View style={{width:30, height:"80%",justifyContent:"center",alignItems:"center" ,marginRight:8}}>
                             <Image style={styles.arrowright} source={require("../assets/right-arrow.png")}/>
                            </View>
                        </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={item=>item._id}
                >

                </FlatList>
            </View>
        

        </View>
    );
}

const styles = StyleSheet.create({
    categoriesContainer:{
        width:"100%",
        height:"70%",
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
    
})