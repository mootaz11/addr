import React,{useEffect,useState} from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity,Dimensions,Alert,KeyboardAvoidingView, ScrollView,Switch,Modal} from 'react-native'
import { Icon } from 'react-native-elements';
import { TextInput } from 'react-native-paper';
import  AuthContext from '../navigation/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {updateInfo,updatePassword,updateImage} from '../rest/userApi';
import  {updateLocation} from '../rest/locationApi'
import { SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';


const BUTTONS = [
    'Take Photo', 
    'Choose Photo Library', 
    'Cancel'
];
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export default function Settings({navigation}){

    const context = React.useContext(AuthContext);
    const [editUsername,setEditUsername]=useState(false);
    const [editPassword,setEditPassword]=useState(false);
    const [editlocation,setEditlocation]=useState(false);
    const [editFirstName,setEditFirstName]=useState(false);
    const [editLastName,setEditLastName]=useState(false);
    const [editPhoneNumber,setEditPhoneNumber]=useState(false);
    const [userImage,setUserImage] = useState(null);
    const [newpassword,setNewPassword]=useState("");
    const [isEnabled, setIsEnabled] = useState(false);
    const [openModal,setOpenModal]=useState(false);

    const toggleSwitch = () => {
        setOpenModal(true);
        setIsEnabled(previousState => !previousState);

    }

    const saveAdress = () => {
        setOpenModal(false);
    }

    const handleChangeAddress = async (evt) => {
        let _location = evt.nativeEvent.coordinate;
      updateLocation({location:_location}).then(message=>{
            context.setLocation({...context.location,location:_location});
        }).catch(err=>{alert("error occured during update")});

    }

    const openDrawer = ()=>{
        navigation.openDrawer();
    }    
    const changeTextInputPhone=()=>{
        if(!editPhoneNumber)
        {setEditPhoneNumber(true);}
        else {
            updateInfo({phone:context.user.phone}).then(res=>{
                Alert.alert(
                    "",
                    res.data.message,
                    [
                      
                      { text: "OK" }
                    ],
                    { cancelable: false }


                  );
                
                
            }).catch(err=>{alert("update failed")})          
       
                setEditPhoneNumber(false)
        }

    }
    const changeTextInputLastName=()=>{
        if(!editLastName)
        {setEditLastName(true);}
        else {
            updateInfo({lastName:context.user.lastName}).then(res=>{
                Alert.alert(
                    "",
                    res.data.message,
                    [
                      
                      { text: "OK" }
                    ],
                    { cancelable: false }


                  );
                
                
            }).catch(err=>{alert("update failed")})          
       
                setEditLastName(false)
        }
    }
    
    const changetoTextInputFirstName=()=>{
        if(!editFirstName)
        {setEditFirstName(true);}
        else {
            updateInfo({firstName:context.user.firstName}).then(res=>{
                Alert.alert(
                    "",
                    res.data.message,
                    [
                      
                      { text: "OK" }
                    ],
                    { cancelable: false }


                  );
                
                
            }).catch(err=>{alert("update failed")})          
       
                setEditFirstName(false)
        }
    }
    
    const changetoTextInputUsername =()=>{
        if(!editUsername)
        {setEditUsername(true);}
        else {
            updateInfo({username:context.user.username}).then(res=>{
                Alert.alert(
                    "",
                    res.data.message,
                    [
                      
                      { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }


                  );
                
                
            }).catch(err=>{alert("update failed")})          
       
                setEditUsername(false)
        }
    }
    
    
    const changetoTextInputPassword =()=>{
        if(!editPassword){
            setEditPassword(true)
        }
        else {
            if(newpassword.length>=8){
                console.log(newpassword)
                updatePassword({newPassword:newpassword}).then(res=>{
                    Alert.alert(
                        "",
                        "password updated !",
                        [
                          
                          { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                      );                    
                      setNewPassword("");

    
                }).catch(err=>{alert("update failed")})          
                setEditPassword(false);
            }
            else {
                alert("your password is weak");
                setEditPassword(false);
                setNewPassword("");

            }
           
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
        const formdata= new FormData();
        formdata.append('profileImage',{type:'image/png',uri:image.uri,name:'upload.png'});
        updateImage(formdata).then(res=>{Alert.prompt(res.data.photo)}).catch(err=>{console.log(err)});
        context.setUser({...context.user,photo:image.uri})

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
          context.setUser({...context.user,photo:image.uri})
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
                    color: '#2474F1',
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
<SafeAreaView style={{flex:1,marginTop:35}}>
        <View style={context.darkMode ? styles.containerdark : styles.Container}>
            <View style={styles.menuContainer}>
                <TouchableOpacity onPress={openDrawer} style={{height:30,width:30}}>
                        <Image source={context.darkMode ?  require("../assets/menu_dark.png"):require("../assets/menu.png")} style={{height:"100%",width:"100%",resizeMode:"cover"}}/>
                        </TouchableOpacity>

                <Text style={context.darkMode ? styles.TitleDark : styles.Title}>My Account</Text>
            </View>
            <View style={styles.imageContainer}>
                    <TouchableOpacity disabled={context.user.photo} onPress={changePicture}>
                    <Image   style={context.user.photo ? styles.addImage: {}} source={ context.user.photo ? {uri:context.user.photo} : require("../assets/add-image.png")}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{position:'absolute',bottom:"45%",left:"56%",}}  onPress={changePicture}>
                        {context.user.photo&&<Image style={styles.editImage} source={require("../assets/pencil.png")}/>}
                    </TouchableOpacity>
                    <View style={{marginTop:5}}>
                    <Text style={{fontSize:Dimensions.get("window").width*0.09,color:"#828282",textAlign:"center"}}>{context.user.lastName&&context.user.firstName ? context.user.lastName[0].toUpperCase()+context.user.lastName.slice(1) +" "+ context.user.firstName:""}</Text>
                    <Text style={{textAlign:"center",color:"#828282"}}>joined: {new Date(context.user.joined).toLocaleString().split(':')[0]+":"+new Date(context.user.joined).toLocaleString().split(':')[1]}</Text>
                    </View>
            </View>




            <ScrollView style={styles.infosContainer}>
            <Text style={context.darkMode ? {fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"white"}:{fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"#828282"}}>Username :</Text>

                <View style={context.darkMode ? styles.infoDark : styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/loginProfile.png")} />
                    {!editUsername && <Text style={context.darkMode ? styles.userInfoDark : styles.userInfo}>{context.user.username}</Text>}
                    {editUsername && <TextInput style={context.darkMode ? styles.userInfoInputDark : styles.userInfoInput} value={context.user.username} onChangeText={(text) => context.setUser({ ...context.user, username: text })} />}
                    <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputUsername}>
                        {!editUsername && <Image style={styles.edit} source={require("../assets/edit.png")} />}
                        {editUsername && <Image style={styles.edit} source={require("../assets/done.png")} />}
                    </TouchableOpacity>
                </View>
                <Text style={context.darkMode ? {fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"white"}:{fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"#828282"}}>First Name :</Text>

                <View style={context.darkMode ? styles.infoDark : styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/loginProfile.png")} />
                    {!editFirstName && <Text style={context.darkMode ? styles.userInfoDark : styles.userInfo}>{context.user.firstName}</Text>}
                    {editFirstName && <TextInput style={context.darkMode ? styles.userInfoInputDark : styles.userInfoInput} value={context.user.firstName} onChangeText={(text) => context.setUser({ ...context.user, firstName: text })} />}
                    <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputFirstName}>
                        {!editFirstName && <Image style={styles.edit} source={require("../assets/edit.png")} />}
                        {editFirstName && <Image style={styles.edit} source={require("../assets/done.png")} />}
                    </TouchableOpacity>
                </View>
                <Text style={context.darkMode ? {fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"white"}:{fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"#828282"}}>Last Name :</Text>

                <View style={context.darkMode ? styles.infoDark : styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/loginProfile.png")} />
                    {!editLastName && <Text style={context.darkMode ? styles.userInfoDark : styles.userInfo}>{context.user.lastName}</Text>}
                    {editLastName && <TextInput style={context.darkMode ? styles.userInfoInputDark : styles.userInfoInput} value={context.user.lastName} onChangeText={(text) => context.setUser({ ...context.user, lastName: text })} />}
                    <TouchableOpacity style={styles.buttonEdit} onPress={changeTextInputLastName}>
                        {!editLastName && <Image style={styles.edit} source={require("../assets/edit.png")} />}
                        {editLastName && <Image style={styles.edit} source={require("../assets/done.png")} />}
                    </TouchableOpacity>
                </View>

                <Text style={context.darkMode ? {fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"white"}:{fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"#828282"}}>Phone Number :</Text>

                <View style={context.darkMode ? styles.infoDark : styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/phone_profile.png")} />
                    {!editPhoneNumber && <Text style={context.darkMode ? styles.userInfoDark : styles.userInfo}>{context.user.phone}</Text>}
                    {editPhoneNumber && <TextInput style={context.darkMode ? styles.userInfoInputDark : styles.userInfoInput} value={context.user.phone} onChangeText={(text) => context.setUser({ ...context.user, phone: text })} />}
                    <TouchableOpacity style={styles.buttonEdit} onPress={changeTextInputPhone}>
                        {!editPhoneNumber && <Image style={styles.edit} source={require("../assets/edit.png")} />}
                        {editPhoneNumber && <Image style={styles.edit} source={require("../assets/done.png")} />}
                    </TouchableOpacity>
                </View>


                <Text style={context.darkMode ? {fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"white"}:{fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"#828282"}}>E-mail :</Text>

                <View style={context.darkMode ? styles.infoDark : styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/mail_profile.png")} />
                    <Text style={context.darkMode ? styles.userInfoDark : styles.userInfo}>{context.user.email}</Text>
                    <View style={styles.buttonEdit}></View>
                </View>
                <Text style={context.darkMode ? {fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"white"}:{fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"#828282"}}>Password :</Text>

                <View style={context.darkMode ? styles.infoDark : styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/passwordProfile.png")} />
                    {!editPassword && <Text style={context.darkMode ? styles.userInfoDark : styles.userInfo}>*********</Text>}
                    {editPassword && <TextInput secureTextEntry={true} style={context.darkMode ? styles.userInfoInputDark : styles.userInfoInput} value={newpassword} onChangeText={(text) => setNewPassword(text)} />}
                    <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputPassword}>
                        {!editPassword && <Image style={styles.edit} source={require("../assets/edit.png")} />}
                        {editPassword && <Image style={styles.edit} source={require("../assets/done.png")} />}
                    </TouchableOpacity>
                </View>

                <Text style={context.darkMode ? {fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"white"}:{fontSize:Dimensions.get("window").width*0.06,marginLeft:10,color:"#828282"}}>Refresh Location :</Text>
                <View style={context.darkMode ? styles.infoDark : styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/location_profile.png")} />
                    {!editlocation && <Text style={context.darkMode ? styles.userInfoDark : styles.userInfo}>{context.user.address}</Text>}
                    {editlocation && <TextInput style={context.darkMode ? styles.userInfoInputDark : styles.userInfoInput} value={context.user.address} onChangeText={(text) => context.setUser({ ...context.user, address: text })} />}
                    <Switch
                                    trackColor={{ false: "#2474F1", true: "#2474F1" }}
                                    thumbColor={isEnabled ? "white" : "#2474F1"}
                                    ios_backgroundColor="#2474F1"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />

                </View>
                <Modal
                animationType={"fade"}
                transparent={true}
                visible={openModal}>

                <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
                    <View style={{ backgroundColor: "#ffffff", margin: 40, flexDirection: "column", borderRadius: 10, height: Dimensions.get("window").height * 0.8, width: Dimensions.get("window").width * 0.9, alignSelf: "center" }}>
                        <View style={{ width: "100%", height: "80%" }}>
                            <MapView
                                initialRegion={{
                                    latitude: context.location?context.location.location ? Number(context.location.location.latitude) : 0:0,
                                    longitude: context.location?context.location.location ? Number(context.location.location.longitude):0:0
                                    ,latitudeDelta: 0.5,
                                    longitudeDelta: 0.5 * (Dimensions.get("window").width / Dimensions.get("window").height )
                    
                                }}

                                style={{ flex: 1, borderRadius: 10 }}
                                customMapStyle={darkStyle}
                                provider="google"
                            >
                                <Marker
                                    draggable={true}
                                    onDragEnd={(evt) => { handleChangeAddress(evt) }}
                                    coordinate={
                                        Platform.OS == 'ios' ?
                                            {
                                                latitude: context.location.location ? Number(context.location.location.latitude) : 0

                                                ,
                                                longitude: context.location.location ? Number(context.location.location.longitude) : 0

                                            } :
                                            {
                                                latitude: context.location.location ? Number(context.location.location.latitude) : 0

                                                ,
                                                longitude: context.location.location ? Number(context.location.location.longitude) : 0

                                            }



                                    }
                                >
                                    <Image source={require('../assets/logoAddresti.png')} style={{ height: 40, width: 40 }} />

                                </Marker>
                            </MapView>

                        </View>
                        <View style={{ width: "100%", height: "20%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity style={{width: "50%", height: 50,}} onPress={()=>{saveAdress()}}>

                                <View style={{ width: "100%", height: 50, backgroundColor: "#2474F1", borderRadius: 24, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "white", fontSize: Dimensions.get("window").width * 0.05 }}>save Address</Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>

               
            
              




            </ScrollView>

        </View>
        </SafeAreaView>        

    );
}


const styles = StyleSheet.create({

    Container: {
        flex:1,
        //backgroundColor:'red',
        //marginTop:30,
        backgroundColor:"white"
    },
    containerdark:{
        flex:1,
        backgroundColor:"#121212"
    
    },
    menuContainer: {
        width:"100%",
        height:"10%",
        flexDirection:'row',
        alignItems:'center',

    },
    Title:{
        fontSize:22,
        color:"black",
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
    }
,
    imageContainer:{
        width:"100%",
        height:"35%",
        alignItems:'center',
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




    addImage:{
        //backgroundColor:'red'
        width:Dimensions.get('window').width * 0.3,   //100
        height:Dimensions.get('window').width * 0.3,   //100 
        borderRadius:Dimensions.get('window').width * 0.3,
        shadowOffset:{width:1,height:1},
        shadowColor:"white",
        //elevation:4
    },
    editImage:{
        //backgroundColor:'blue',
        width:30,
        height:30,
        resizeMode:"contain",
        elevation:5,
    },
    infosContainer:{
        //backgroundColor:'yellow',
        height:480
    },

    info:{
        width:"96%",
        alignSelf:'center',
        height:50, //10%
        backgroundColor:"#fcfcfc",
        borderRadius:15,
        marginVertical:"5%",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        padding:"2%",
        borderColor:"#e3e3e3",
        borderWidth:1,
        shadowOffset:{  width: 1,  height: 1,  },
        shadowColor: "grey",
        shadowOpacity: 1.0,    
    },
    infoDark:{
        width:"96%",
        alignSelf:'center',
        height:50, //10%
        backgroundColor:"#1F1F1F",
        borderRadius:15,
        marginVertical:"5%",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        padding:"2%",
        borderColor:"#1F1F1F",
        borderWidth:1,
        shadowOffset:{  width: 1,  height: 1,  },
        shadowColor: "grey",
        shadowOpacity: 1.0, 


    },

    infoImage:{
        width:"10%",
        height:"90%", //90%
        resizeMode:"contain",
        margin:"2%",
    },

    userInfoDark:{
        width:"74%",
        height:"90%", //90%
        margin:"2%",
        fontSize:18,
        textAlign:"center",
        paddingTop:5,
        color:"white",
        alignSelf:"center",

    },
    userInfoMail:{
        width:"88%",
        height:"90%", //90%
        margin:"2%",
        fontSize:18,
        textAlign:"center",
        paddingTop:5,
        color:"grey",
        alignSelf:"center",

    },
    userInfoMailDark:{
        width:"88%",
        height:"90%", //90%
        margin:"2%",
        fontSize:18,
        textAlign:"center",
        paddingTop:5,
        color:"white",
        alignSelf:"center",
    },
    userInfo:{
        width:"74%",
        height:"90%", //90%
        margin:"2%",
        fontSize:18,
        textAlign:"center",
        paddingTop:5,
        color:"grey",
        alignSelf:"center",

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




    /*userInfo:{
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

    }*/

})



        /*<View style={context.darkMode ? styles.containerdark :styles.container}>

            <View style={context.darkMode ? styles.menu: styles.menu}>
                <Icon color={ context.darkMode ? "white": "#2474F1"} style={{ flex: 1, padding: 0 }} name="menu" onPress={openDrawer} />
                <Text style={context.darkMode ? styles.TitleDark : styles.Title}>My Account</Text>
             </View>
            
             <View style={styles.addImageContainer}>
                 <View style={styles.addImage} >
                 <Image style={context.darkMode ? styles.imageDark :styles.image}   source={ user.photo ? {uri:user.photo}  : require("../assets/add-image.png")}/>
    
                 <TouchableOpacity style={{position:"absolute",top:"84%",left:"64%"}} onPress={changePicture}>
                     <Image style={{width:20,height:20,resizeMode:"cover"}} source={require("../assets/edit_image.png")}/>
                 </TouchableOpacity>
               
                 </View>
               
            </View>
            <View style={styles.generalInfo}>
                <View style={context.darkMode ? styles.infoDark :styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/loginProfile.png")}/>
               


               { !editUsername &&<Text style={context.darkMode ? styles.userInfoDark :styles.userInfo}>{user.username}</Text>}
                 {editUsername && <TextInput  style={context.darkMode ? styles.userInfoInputDark :styles.userInfoInput} value={user.username} onChangeText={(text)=>context.setUser({...user,username:text})} />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputUsername}>
                   { !editUsername && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editUsername && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 
                   

                </View>

                <View style={context.darkMode ? styles.infoDark :styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/loginProfile.png")}/>
               


               { !editUsername &&<Text style={context.darkMode ? styles.userInfoDark :styles.userInfo}>{user.username}</Text>}
                 {editUsername && <TextInput  style={context.darkMode ? styles.userInfoInputDark :styles.userInfoInput} value={user.username} onChangeText={(text)=>context.setUser({...user,username:text})} />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputUsername}>
                   { !editUsername && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editUsername && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 
                   

                </View>

                <View style={context.darkMode ? styles.infoDark :styles.info}>
                    <Image style={styles.infoImage} source={require("../assets/loginProfile.png")}/>
               


               { !editUsername &&<Text style={context.darkMode ? styles.userInfoDark :styles.userInfo}>{user.username}</Text>}
                 {editUsername && <TextInput  style={context.darkMode ? styles.userInfoInputDark :styles.userInfoInput} value={user.username} onChangeText={(text)=>context.setUser({...user,username:text})} />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputUsername}>
                   { !editUsername && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editUsername && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 
                   

                </View>





                <View style={context.darkMode ? styles.infoDark :styles.info}>
                <Image style={styles.infoImage} source={require("../assets/emailProfile.png")}/>
                
                { !editEmail && <Text style={context.darkMode ? styles.userInfoDark :styles.userInfo}>{user.email}</Text> }
                {editEmail && <TextInput style={context.darkMode ? styles.userInfoInputDark :styles.userInfoInput} value={user.email}  onChangeText={(text)=>context.setUser({...user,email:text})}  />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputEmail}>
                { !editEmail && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editEmail && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 
                </View>



                
                
                <View style={context.darkMode ? styles.infoDark :styles.info}>
                <Image style={styles.infoImage} source={require("../assets/passwordProfile.png")}/>
                {!editPassword&&<Text style={context.darkMode ? styles.userInfoDark :styles.userInfo}>*********</Text>}
                {editPassword && <TextInput secureTextEntry={true} style={context.darkMode ? styles.userInfoInputDark :styles.userInfoInput} value={newpassword}  onChangeText={(text)=>setNewPassword(text)}  />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputPassword}>
                { !editPassword && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editPassword && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 
                </View>
                

                <View style={context.darkMode ? styles.infoDark :styles.info}>
                <Image style={styles.infoImage} source={require("../assets/locationProfile.png")}/>
                {!editlocation &&<Text style={context.darkMode ? styles.userInfoDark :styles.userInfo}>{user.address}</Text>}
                {editlocation && <TextInput  style={context.darkMode ? styles.userInfoInputDark :styles.userInfoInput} value={user.address} onChangeText={(text)=>setUser({...user,address:text})}  />} 
                <TouchableOpacity style={styles.buttonEdit} onPress={changetoTextInputLocation}>
                { !editlocation && <Image style={styles.edit}  source={require("../assets/edit.png") }/>}
                   { editlocation && <Image style={styles.edit}  source={require("../assets/done.png") }/>}
                </TouchableOpacity> 

                
                </View>
                
                
                
                <View style={context.darkMode ? styles.infoDark :styles.info}>

                </View>

            </View>
    
        </View>*/


        const darkStyle = [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#181818"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1b1b1b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2c2c2c"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8a8a8a"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#373737"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#3c3c3c"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#4e4e4e"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#3d3d3d"
                    }
                ]
            }
        ];
        
        