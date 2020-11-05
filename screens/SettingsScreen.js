import React,{useEffect,useState} from 'react'
import {View,Text,StyleSheet,Platform,Image,TouchableOpacity,Dimensions,Alert,KeyboardAvoidingView} from 'react-native'
import { Icon } from 'react-native-elements';
import { TextInput } from 'react-native-paper';
import  AuthContext from '../navigation/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {updateInfo,updatePassword,updateImage} from '../rest/userApi';

const BUTTONS = [
    'Take Photo', 
    'Choose Photo Library', 
    'Cancel'
];

export default function Settings({navigation}){

    const context = React.useContext(AuthContext);
    const [user,setUser]=useState(context.user);
    const [editEmail,setEditEmail]=useState(false);
    const [editUsername,setEditUsername]=useState(false);
    const [editPassword,setEditPassword]=useState(false);
    const [editlocation,setEditlocation]=useState(false);
    const [dark,setDark]=useState(context.darkMode);
    const [userImage,setUserImage] = useState(null);
    const [enabledKeyBoard,setEnabledKeyBoard]=useState(false);
  
    useEffect(()=>{
      setDark(context.darkMode);
    },[context.darkMode])
  

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
    const { showActionSheetWithOptions } = useActionSheet();


    const chooseFromCamera=async ()=>{
        const permResult1 =  await Permissions.askAsync(Permissions.CAMERA);
       const permResult2 = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
       if(permResult1.status !=="granted" && permResult2.status !="granted"){
           Alert.alert("permission required");
       }

        let image=await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            base64: true
      
        })
        console.log(image.uri)
        setUser({...user,photo:image.uri})
        const formdata= new FormData();
        formdata.append('profileImage',{type:'image/png',uri:image.uri,name:'upload.png'});
        updateImage(formdata).then(res=>{Alert.prompt(res.data.photo)}).catch(err=>{console.log(err)});
        context.updateUser(user);
        

    }
    const chooseFromLibrary=async ()=>{
       const permResult1 =  await Permissions.askAsync(Permissions.CAMERA);
       const permResult2 = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
       if(permResult1.status !=="granted" && permResult2.status !="granted"){
           Alert.alert("permission required");
       }

        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          setUser({...user,photo:image.uri})
          const formdata= new FormData();
          formdata.append('profileImage',{type:'image/png',uri:image.uri,name:'upload.png'});
          updateImage(formdata).then(res=>{Alert.prompt(res.data.photo)}).catch(err=>{console.log(err)});
    }

        const changePicture = () => {
            showActionSheetWithOptions({
                title: 'Select Photo',
                titleTextStyle: {
                    marginHorizontal: 100
                },
                textStyle:{ 
                    marginHorizontal: 100,
                    textAlign: "center",
                    alignItems: 'center',
                    color: 'blue',
                    fontSize: 16,
                    fontWeight: 'bold',
                    fontStyle: 'italic'
                },
                options: BUTTONS,
                cancelButtonIndex: 2
            }, selectHandler);
        };
    
        const selectHandler = (index) => {
            switch(index){
                case 0:
                    chooseFromCamera();
                    break;
                case 1:
                    chooseFromLibrary();
                    break;
                default:
                    break;
            }
    
        };
    
    return(
        
        <View style={dark ? styles.containerdark :styles.container}>

            <View style={dark ? styles.menu: styles.menu}>
                <Icon color={ dark ? "white": "#2474F1"} style={{ flex: 1, padding: 0 }} name="menu" onPress={openDrawer} />
                <Text style={dark ? styles.TitleDark : styles.Title}>My Account</Text>
             </View>
             <View style={styles.addImageContainer}>
                 <View style={styles.addImage} >
                <Image style={dark ? styles.imageDark :styles.image}   source={ user.photo ? {uri:user.photo}  : require("../assets/add-image.png")}/>
                 </View>
                 <TouchableOpacity onPress={changePicture}>
                     <Text style={dark ? styles.imageTitleDark :styles.imageTitle}>{ user.photo ? "Modifier votre image" : "Ajouter une image"}</Text>
                 </TouchableOpacity>
            </View>
            <View style={styles.generalInfo}>
                <View style={dark ? styles.infoDark :styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/loginProfile.png")}/>
               


               { !editUsername &&<Text style={dark ? styles.userInfoDark :styles.userInfo}>{user.username}</Text>}
                 {editUsername && <TextInput  style={dark ? styles.userInfoInputDark :styles.userInfoInput} value={user.username} onChangeText={(text)=>setUser({username:text,email:user.email,password:user.password,address:user.address})} />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputUsername}>
                   { !editUsername && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editUsername && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 
                   

                </View>

                <View style={dark ? styles.infoDark :styles.info}>
                <Image style={styles.infoImage} source={require("../assets/emailProfile.png")}/>
                
                { !editEmail && <Text style={dark ? styles.userInfoDark :styles.userInfo}>{user.email}</Text> }
                {editEmail && <TextInput style={dark ? styles.userInfoInputDark :styles.userInfoInput} value={user.email}  onChangeText={(text)=>setUser({...user,email:text})}  />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputEmail}>
                { !editEmail && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editEmail && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 
                </View>



                
                
                <View style={dark ? styles.infoDark :styles.info}>
                <Image style={styles.infoImage} source={require("../assets/passwordProfile.png")}/>
                {!editPassword&&<Text style={dark ? styles.userInfoDark :styles.userInfo}>*********</Text>}
                {editPassword && <TextInput style={dark ? styles.userInfoInputDark :styles.userInfoInput} value={""}  onChangeText={(text)=>setUser({...user,password:text})}  />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputPassword}>
                { !editPassword && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editPassword && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 
                </View>
                

                <View style={dark ? styles.infoDark :styles.info}>
                <Image style={styles.infoImage} source={require("../assets/locationProfile.png")}/>
                {!editlocation &&<Text style={dark ? styles.userInfoDark :styles.userInfo}>{user.address}</Text>}
                {editlocation && <TextInput  style={dark ? styles.userInfoInputDark :styles.userInfoInput} value={user.address} onChangeText={(text)=>setUser({address:text,email:user.email,username:user.username,password:user.password})}  />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputLocation}>
                { !editlocation && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editlocation && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 

                
                </View>
                
                
                
                <View style={dark ? styles.infoDark :styles.info}>

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
    userInfoDark:{
        width:"74%",
        height:"90%",
        margin:"2%",
        fontSize:15,
        textAlign:"center",
        color:"white",
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
    userInfoInputDark:{
        width:"72%",
        height:"90%",
        margin:"2%",
        color:"grey",
        backgroundColor:"#1F1F1F"
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
        shadowOffset:{  width: 1,  height: 1,  },
        shadowColor: "grey",
        shadowOpacity: 1.0,    
    },
    infoDark:{
        width:"96%",
        height:"10%",
        backgroundColor:"#1F1F1F",
        borderRadius:15,
        marginVertical:"5%",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        padding:"2%",
        shadowOffset:{  width: 1,  height: 1,  },
        shadowColor: "#1F1F1F",
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
containerdark:{
    flex:1,
    backgroundColor:"#121212"

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
    width:85,
    height:85,
    resizeMode:"stretch",
    borderRadius:85,
    shadowOffset:{width:1,height:1},
    shadowColor:"white",
},
imageDark:{
    width:85,
    height:85,
    resizeMode:"stretch",
    borderRadius:85,
    shadowOffset:{width:1,height:1},
    shadowColor:"#1F1F1F",

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
    TitleDark:{
        fontSize:22,
        color:"white",
        fontWeight:"600",
        letterSpacing:1,
        justifyContent:"center",
        marginHorizontal:5
      },


    imageTitle:{
        fontWeight:"500",
        color:"black",
        margin:3
    },
    
    imageTitleDark:{
        fontWeight:"500",
        color:"white",
        margin:3

    }

})