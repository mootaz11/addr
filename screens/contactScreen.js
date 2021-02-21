import React, { useCallback, useReducer, useState,useContext } from 'react';
import { SafeAreaView } from 'react-native';
import {View , StyleSheet, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Linking,Platform, Dimensions, Alert} from 'react-native';
import ContactUsInput from '../common/ContactUsInput';
import AuthContext from '../navigation/AuthContext';
import {sendContact} from '../rest/userApi'
const FORM_INPUT_UPDATE = "FORM_INPUT_UPADATE"

const formReducer = (state, action) => {
    if(action.type === FORM_INPUT_UPDATE ){
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidites,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities){
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidites: updatedValidities
        };
    }
    return state;
};

const Contact = (props) => {
    const context = useContext(AuthContext);    
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: '',
            email:'',
            subject:'',
            message:''
        },
        inputValidites:{
            name:false,
            email:false,
            subject:false,
            message:false
        },
        formIsValid: false
    });


    
    const openFacebook =()=>
    {
        Linking.canOpenURL("fb://page/Addresti-118226009977589").then(supported => {
            if (supported) {
              return Linking.openURL("fb://page/Addresti-118226009977589");
            } else {
              return Linking.openURL("https://www.facebook.com/page/Addresti-118226009977589");
            }
          })
        
    }
    

    const openInstagram =()=>{
        Linking.canOpenURL('instagram://user?username=addresti.tn').then(supported => {
            if (supported) {
              return Linking.openURL("instagram://user?username=addresti.tn");
            } else {
              return Linking.openURL("https://www.instagram.com/addresti.tn");
            }
          })
        
    }
    
   
    
    const openYoutube =()=>{
        Linking.canOpenURL('vnd.youtube://user/channel/UC8XPr58aTMCHWieX273gyCQ').then(supported => {
            if (supported) {
              return Linking.openURL("vnd.youtube://user/channel/UC8XPr58aTMCHWieX273gyCQ");
            } else {
              return Linking.openURL("https://www.youtube.com/channel/UC8XPr58aTMCHWieX273gyCQ");
            }
          })
        
    }
    


    const inputChangeHandler = useCallback((inputIdentifier,inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue , 
            isValid: inputValidity,
            input:inputIdentifier 
        });
    },[dispatchFormState]);


    const goBack =()=>{
        props.navigation.goBack();
    }

    const submitHandler = useCallback(() => {
        if(!formState.formIsValid){
            Alert.alert('Wrong input!', 'Please check the errors in the form.',[
                {
                    text:'Okay'
                }
            ]);
            return;
        }else {
            console.log(formState.inputValues);
            sendContact(formState.inputValues).then(message=>{
                Alert.alert('',message, [{ text: "OK" }],{cancelable:false})

            })
        }

    },[formState]);

    return (
        <SafeAreaView style={{flex:1,marginTop:10}}>
        <KeyboardAvoidingView
        behavior={Platform.OS == "android" ?  "height":"height"}
        style={{flex:1}}>    
         <View style={context.darkMode  ? styles.menuDark :  styles.menu}>
                <TouchableOpacity style={styles.leftArrowContainer} onPress={goBack}>
                    <View>
                        <Image style={styles.leftArrow} source={ context.darkMode ? require("../assets/left-arrow-dark.png"):require("../assets/left-arrow.png")} />
                    </View>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={context.darkMode ?  styles.TitleDark : styles.Title}>Contact us</Text>
                </View>
            </View>
          <ScrollView style={context.darkMode ? styles.mainContainerDark:styles.mainContainer}>
            <View style={styles.imageContainer}>
                <Image
                style={styles.image} 
                source={require("../assets/images/contactus.jpg")} 
                />
            </View>
            <View style={styles.formContainer}>
                <Text style={context.darkMode ? styles.titreDark: styles.titre}>Contact us</Text>
                <View style={styles.questionContainer}>
                <Text style={context.darkMode ? styles.questionStyleDark :  styles.questionStyle}>Vous avez des questions à propos Addressti ? </Text>
                <Text style={context.darkMode ? styles.questionStyleDark :  styles.questionStyle}>Etes vous interessé par un partenariat avec nous ? </Text>
                <Text style={context.darkMode ? styles.questionStyleDark :  styles.questionStyle}>Avez vous des suggestions ou avez vous simplement envie de nous dire bonjour ? </Text>
                <Text style={styles.questionStyle}>N'hésitez pas alors à nous contacter !</Text>
                </View>
                <ContactUsInput 
                    id='name'
                    placeholder="Votre nom"
                    returnKeyType="next"
                    errorText="Svp entrer un nom!"
                    required
                    dark={context.darkMode}
                    onInputChange={inputChangeHandler}
                />
                 <ContactUsInput
                    id='email' 
                    placeholder="Votre Email"
                    keyboardType="email-address"
                    returnKeyType="next"
                    errorText="Svp entrer un email valide !"
                    required
                    dark={context.darkMode}
                    email
                    onInputChange={inputChangeHandler}
                />
                 <ContactUsInput
                    id="subject" 
                    placeholder="subject"
                    returnKeyType="next"
                    errorText="Svp entrer votre objet!"
                    required
                    dark={context.darkMode}
                    onInputChange={inputChangeHandler}
                />
                 <ContactUsInput 
                    id="message"
                    placeholder="Votre message"
                    multiline
                    numberOfLines={3}
                    errorText="Svp entrer votre message!"
                    required
                    dark={context.darkMode}
                    onInputChange={inputChangeHandler}
                />
                <View style={styles.buttonSubmitContainer}>
                    <TouchableOpacity onPress={submitHandler} style={styles.button}>
                        <Text style={styles.buttonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footerContainer}>
                <View style={styles.addressContainer}>
                    <View style={styles.emailTelContainer}>
                        <Text style={context.darkMode ?styles.questionStyleDark:  styles.questionStyle}>addresti@gmail.com</Text>
                        <Text style={context.darkMode ?styles.questionStyleDark: styles.questionStyle}>31 19 30 50</Text>
                    </View>
                    <View style={styles.verticleLine}>

                    </View>
                    <View style={styles.openTimeContainer}>
                        <Text style={context.darkMode ?styles.questionStyleDark:  styles.questionStyle}>Monday  -  Saturday</Text>
                        <Text style={context.darkMode ?styles.questionStyleDark:  styles.questionStyle}>9:00am   -  5:00pm</Text>
                    </View>
                </View>
                <View style={styles.buttonsContainer}>
<TouchableOpacity onPress={openYoutube} style={{        height:Dimensions.get('window').height*0.06, //48
        width:'13%',
}}>
                    <Image
                    style={styles.icon} 
                    source={require("../assets/images/youtube.png")} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={openInstagram} style={{        height:Dimensions.get('window').height*0.06, //48
        width:'13%',
}}>
                    <Image
                    style={styles.icon} 
                    source={require("../assets/images/instagram.png")} 
                    />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openFacebook} style={{        height:Dimensions.get('window').height*0.06, //48
        width:'13%',
}}>
                    <Image
                    style={styles.icon} 
                    source={require("../assets/images/facebook.png")} 
                    />
</TouchableOpacity>

                </View>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
    },
    menuDark:{
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",

    },
    leftArrowContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    leftArrow: {
        width: 30,
        height: 30
    },

    titleContainer: {
        width: "80%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    Title: {
        fontWeight: "700",
        fontSize: 28
    },
    TitleDark:{
        fontWeight: "700",
        fontSize: 28,
        color:"white"

    },
    searchContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    mainContainer:{
        flex:1
    },
    mainContainerDark:{
        flex:1,
        backgroundColor: "#121212",
    },  
    imageContainer:{
        //backgroundColor:'red',
        height:Dimensions.get('window').height * 0.285,//220
        alignItems:'center',
    },
    image:{
        height:'100%',
        width:'100%',
        resizeMode:'stretch'
    },
    formContainer:{
        //backgroundColor:'yellow',
        flex:3.55,
        padding:10
    },
    titre:{
        fontSize:45,
        fontWeight: 'bold',
    },
    titreDark : {
        fontSize:45,
        fontWeight:'bold',
        color:"white"
    },
    questionContainer:{
        width:'75%'
    },
    questionStyle:{
        fontSize:13
    },
    questionStyleDark:{
        fontSize:13,
        color:"white"
    },
    inputStyle:{
        height:Dimensions.get('window').height * 0.045, //35
        borderBottomColor:'black',
        borderBottomWidth: 2,
        fontWeight:'bold',
        marginBottom:Dimensions.get('window').height * 0.0285, //20
    },
    buttonSubmitContainer:{
        //backgroundColor:'orange',
        flex:0.8,
        alignItems:'flex-end'
    },
    button:{
        backgroundColor:'white',
        width:'30%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius:10,
        shadowColor: '#f3f3f3',
        shadowOffset: {width:1, height:2},
        shadowOpacity: 0.36,
        shadowRadius: 6,
        elevation: 6
    },
    buttonText:{
        fontSize: 16,
        fontWeight: '700',
        color:'black'
    },
     
    footerContainer:{
        //backgroundColor:'pink',
        flex:1,
    },
    addressContainer:{
        flexDirection: 'row',
        //backgroundColor:'brown',
        flex:0.9,
        padding:8
    },
    emailTelContainer:{
        //backgroundColor:'yellow',
        flex:1
    },
    verticleLine: {
        height: '100%',
        width: 1,
        backgroundColor: 'black',
    },
    openTimeContainer:{
        //backgroundColor:'green',
        flex:1,
        paddingLeft:10
    },
    buttonsContainer:{
        //backgroundColor:'red',
        flex:1,
        flexDirection:'row',
        //justifyContent:'center',
        paddingVertical: Dimensions.get('window').height * 0.01 ,//8 
    },
    icon:{
        height:"100%",
        width:'100%',
        resizeMode:'contain',
        marginHorizontal: Dimensions.get('window').width * 0.023 //10
    }
});

export default Contact;