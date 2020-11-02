import React,{useEffect,useState} from 'react'
import {View,Text,StyleSheet,Platform,Image,TouchableOpacity} from 'react-native'
import { Icon } from 'react-native-elements';
import { TextInput } from 'react-native-paper';
import  AuthContext from '../navigation/AuthContext';
import {updateImage,updateInfo,updatePassword} from '../rest/userApi';

export default function Settings({navigation}){

    const context = React.useContext(AuthContext);
    const [user,setUser]=useState(context.user);
    const [editEmail,setEditEmail]=useState(false);
    const [editUsername,setEditUsername]=useState(false);
    const [editPassword,setEditPassword]=useState(false);
    const [editlocation,setEditlocation]=useState(false);



    const openDrawer = ()=>{
        navigation.openDrawer();
    }    
    const changetoTextInputUsername =()=>{
        if(!editUsername)
        {setEditUsername(true);}
        else {
            updateInfo({username:user.username}).then(res=>{
                alert(res.data.message);
        }).catch(err=>{alert(err.message)})
       
        setEditEmail(false);
                setEditUsername(false)
        }
    }
    const changetoTextInputEmail =()=>{
        if(!editEmail){
            setEditEmail(true);
        }
        else {
            updateInfo({email:user.email}).then(res=>{
                    alert(res.data.message);
            }).catch(err=>{alert(err.message)})
           
            setEditEmail(false);
        

        
        }

    }
    const changetoTextInputPassword =()=>{
        if(!editPassword){
            setEditPassword(true)

        }
        else {
            //update user
            console.log(user);
            setEditPassword(false);
        }
    }
    const changetoTextInputLocation =()=>{
        if(!editlocation){
            setEditlocation(true);
        }
        else {
            //update user 
            setEditlocation(false);
        }
    }
   const  changePicture=()=>{
        console.log("change picture");
    }
    return(
        <View style={styles.container}>
            <View style={styles.menu}>
                <Icon color={"#2474F1"} style={{ flex: 1, padding: 0 }} name="menu" onPress={openDrawer} />
                <Text style={styles.Title}>My Account</Text>
             </View>
             <View style={styles.addImageContainer}>
                 <View style={styles.addImage} >
                <Image style={styles.image}  source={ user.photo ? user.photo : require("../assets/add-image.png")}/>
                 </View>
                 <TouchableOpacity onPress={changePicture}>
                     <Text style={styles.imageTitle}>{ user.photo ? "Modifier votre image" : "Ajouter une image"}</Text>
                 </TouchableOpacity>
            </View>
            <View style={styles.generalInfo}>
                <View style={styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/loginProfile.png")}/>
               


               { !editUsername &&<Text style={styles.userInfo}>{user.username}</Text>}
                 {editUsername && <TextInput  style={styles.userInfoInput} value={user.username} onChangeText={(text)=>setUser({username:text,email:user.email,password:user.password,address:user.address})} />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputUsername}>
                   { !editUsername && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editUsername && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 
                   

                </View>

                <View style={styles.info}>
                <Image style={styles.infoImage} source={require("../assets/emailProfile.png")}/>
                
                { !editEmail && <Text style={styles.userInfo}>{user.email}</Text> }
                {editEmail && <TextInput  style={styles.userInfoInput} value={user.email}  onChangeText={(text)=>setUser({...user,email:text})}  />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputEmail}>
                { !editEmail && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editEmail && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 
                </View>
                
                
                <View style={styles.info}>
                <Image style={styles.infoImage} source={require("../assets/passwordProfile.png")}/>
                {!editPassword&&<Text style={styles.userInfo}>*********</Text>}
                {editPassword && <TextInput  style={styles.userInfoInput} value={""}  onChangeText={(text)=>setUser({...user,password:text})}  />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputPassword}>
                { !editPassword && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editPassword && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 
                </View>
                

                <View style={styles.info}>
                <Image style={styles.infoImage} source={require("../assets/locationProfile.png")}/>
                {!editlocation &&<Text style={styles.userInfo}>{user.address}</Text>}
                {editlocation && <TextInput  style={styles.userInfoInput} value={user.address} onChangeText={(text)=>setUser({address:text,email:user.email,username:user.username,password:user.password})}  />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputLocation}>
                { !editlocation && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editlocation && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 

                
                </View>
                
                
                
                <View style={styles.info}>

                </View>

            </View>
    
        </View>

    );
}


const styles = StyleSheet.create({
    userInfo:{
        width:"74%",
        height:"90%",
        margin:"2%",
        fontSize:15,
        textAlign:"center",
        color:"grey",
        alignContent:"center",
        alignSelf:"center"

    },
    userInfoInput:{
        width:"72%",
        height:"90%",
        margin:"2%",
        color:"grey",
        backgroundColor:"white"
    },
    buttonEdit:{
        alignItems:"stretch",
        width:"10%",
        height:"90%",
        margin:"2%",


    },
    edit:{
        width:"100%",
        height:"90%",
        resizeMode:"contain",

    
    },
    infoImage:{
        width:"10%",
        height:"90%",
        resizeMode:"contain",
        margin:"2%",
    },
    info:{
        width:"96%",
        height:"10%",
        backgroundColor:"white",
        borderRadius:15,
        marginVertical:"5%",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        padding:"2%",
        shadowOffset:{  width: 2,  height: 2,  },
        shadowColor: "grey",
        shadowOpacity: 1.0,
        

        
        
    },

    generalInfo:{
        width:"100%",
        height:"60%",
        position:"absolute",
        top:"40%",
        elevation: 10,
        flexDirection:"column",
        alignItems:"center"
        


    },
container:{
    flex:1,
    backgroundColor:"white"
},
addImageContainer:{
    width:"100%",
    height:"30%",   
    position:"absolute",
    top:"10%",
    elevation: 10,
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",



},
addImage:{
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    width:"32%",
    height:"46%",



},
image:{
    width:"90%",
    height:"100%",
    resizeMode:"stretch",
    borderRadius:25,
    shadowOffset:{width:1,height:1},
    shadowColor:"white"


},
menu: {

    position: "absolute",
    marginTop: Platform.OS == 'ios' ? 30 : 20,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignContent:"space-between",
    padding: 10,
    shadowOpacity: 0.5,
    elevation: 10,
    alignItems:"center"

  },
  Title:{
      fontSize:22,
      color:"#2474F1",
      fontWeight:"600",
      letterSpacing:1,
      justifyContent:"center",
      marginHorizontal:5
    },
    imageTitle:{
        fontWeight:"500",
        color:"black"
    }
})