import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Platform, Dimensions } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Field from '../common/Field';
import  AuthContext  from '../navigation/AuthContext';
import * as Google from "expo-google-app-auth";
import { configGoogleSignin } from '../secretKeys/appkeys';
import { ScrollView } from 'react-native-gesture-handler';
import {signup,login} from '../rest/userApi';

const userCredentialsFields = [
    { placeholder: 'email', imageSrc: require("../assets/email.png"), name: 'email', type: 'text', secureTextEntry: false },
    { placeholder: 'password', imageSrc: require("../assets/password.png"), name: 'password', type: 'password', secureTextEntry: true },
]


const singupFields = [
    { placeholder: 'username', imageSrc: require("../assets/login.png"), name: 'username', type: 'text', secureTextEntry: false },
    { placeholder: 'email', imageSrc: require("../assets/email.png"), name: 'email', type: 'text', secureTextEntry: false },
    { placeholder: 'first name', imageSrc: require("../assets/email.png"), name: 'firstName', type: 'text', secureTextEntry: false },
    { placeholder: 'last name', imageSrc: require("../assets/email.png"), name: 'lastName', type: 'text', secureTextEntry: false },
    { placeholder: 'password', name: 'password', type: 'password', imageSrc: require("../assets/password.png"), secureTextEntry: true },
    { placeholder: 'repeat your password', name: 'password1', imageSrc: require("../assets/password.png"), type: 'password', secureTextEntry: true },
    { placeholder: 'phone', name: 'phone', type: 'text', imageSrc: require("../assets/phone.png"), secureTextEntry: false },
    { placeholder: 'Specify the address if you live in a builr', imageSrc: require("../assets/home.png"), name: 'address', type: 'text', secureTextEntry: false },
]


export default function Login({ navigation }) {
    const [pressedSignup, setPressedSignup] = useState(false);
    const [pressedLogin, setPressedLogin] = useState(true);
    const context = React.useContext(AuthContext);
    useEffect(() => {
        if(context.user){
            navigation.navigate("orders");
        }
    },[context.user])


    const signInWithGoogle = async () => {
        try {
            const result = await Google.logInAsync({
                iosClientId: configGoogleSignin.iosClientId,
                androidClientId: configGoogleSignin.androidClientId,
                scopes: ["profile", "email"]
            });

            if (result.type === "success") {
                console.log(result.user);
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            console.log(e)
            return { error: true };
        }
    };





    const SingupSchema = yup.object({
        username: yup.string().required('username is required. '),
        firstName: yup.string().required('firstName is required. '),
        lastName: yup.string().required('lastName is required. '),

        email: yup.string().email('email is invalid .').required('email is required .'),
        password: yup.string().min(6, 'password is weak').required('password is required .'),
        password1: yup.string().oneOf([yup.ref('password')], 'password not match'),
        phone: yup.string()
            .min(8, 'phone number length must be 8')
            .max(8, 'phone number length must be 8')
            .required('A phone number is required'),
        address: yup.string().required('address is required')
    })



    const LoginSchema = yup.object({
        email: yup.string().email('email is invalid .').required('email is required .'),
        password: yup.string().min(6, 'password is weak').required('password is required .'),
    })

    const checkForgotPassword = () => {
        navigation.navigate("forgotPassword")
    }

    const checkSignup = () => {
        setPressedSignup(true);
        setPressedLogin(false);
    }
    const checkLogin = () => {
        setPressedSignup(false);
        setPressedLogin(true);

    }


    const loginWithFacebook = () => {
    }

    const loginWithGoogle = () => {

    }
    const navigateToSignUp = () => {
        navigation.navigate("Signup")
    }


    return (
        <ScrollView
        //ios
        contentInset={{
          top: 0,
          left: 0,
          bottom:"200%",
          right: 0
        }}
        //android
        contentContainerStyle={{
          paddingRight: Platform.OS == 'android' ? 200 : 0

        }}

        
        >

        <View style={styles.container}>
            <View style={ pressedLogin ?styles.logoContainerLogin : styles.logoContainerSignup}>
                <Image style={styles.logoApplication} source={require("../assets/logoBlue.png")} />

            </View>
             <View style={styles.switch}>

                                        <View style={!pressedLogin ? styles.login : styles.loginPressed}>
                                            <TouchableOpacity onPress={checkLogin}>

                                                <Text style={!pressedLogin ? styles.switchTextLogin : styles.switchTextLoginPressed}>Log in</Text>
                                            </TouchableOpacity>

                                        </View>


                                        <View style={!pressedSignup ? styles.signup : styles.signupPressed}>
                                            <TouchableOpacity onPress={checkSignup}>
                                                <Text style={!pressedSignup ? styles.switchTextSignup : styles.switchTextSignupPressed}>Sign up</Text>
                                            </TouchableOpacity>

                                        </View>


                                    </View>
            <Formik
                initialValues={!pressedSignup ? { email: '', password: '' }:{email: '', username: '',firstName:'',lastName:'',password:'',phone:'',address:''}}
                validationSchema={pressedSignup ? SingupSchema :LoginSchema}
                onSubmit={(values, actions) => {
                    if(pressedLogin){
                          login(values).then(res=>{
                              alert("login done");
                              context.LoginHandler({user:res.data.user,token:res.data.token})
                          }).catch(err=>{
                            console.log(err.message)}) 
    
                    }
                    else {
                        signup(values).then(res=>{
                            console.log(res.data);
                            alert("user Created Done !");
                            actions.resetForm();
                        })
                        .catch(err=>{console.log(err)})
                    }
                }
                }
            >
                {
                    (props) =>
                        (
                            <React.Fragment>

                                <View style={!pressedSignup ? styles.FieldsContainer : styles.FieldsContainerSignup}>
                                   

                                    {pressedLogin ? userCredentialsFields.map((value, i) => {
                                        return (
                                            <Field
                                                imageSrc={value.imageSrc}
                                                placeholder={value.placeholder}
                                                onChange={props.setFieldValue}
                                                onTouch={props.setFieldTouched}
                                                name={value.name}
                                                value={props.values[value.name]}
                                                error={props.touched[value.name] && props.errors[value.name]}
                                                type={value.type}
                                                secureTextEntry={value.secureTextEntry}
                                                key={i} />
                                        )
                                    }) :
                                        singupFields.map((value, i) => {
                                            return (
                                                <Field
                                                    imageSrc={value.imageSrc}
                                                    placeholder={value.placeholder}
                                                    onChange={props.setFieldValue}
                                                    onTouch={props.setFieldTouched}
                                                    name={value.name}
                                                    value={props.values[value.name]}
                                                    error={props.touched[value.name] && props.errors[value.name]}
                                                    type={value.type}
                                                    secureTextEntry={value.secureTextEntry}
                                                    key={i} />)
                                        }

                                        )

                                    }
                                    <TouchableOpacity onPress={props.handleSubmit} style={pressedLogin ? {width:"60%" ,position: "absolute",bottom: "-7%"}:{width:"60%" ,position: "absolute",bottom: "-3%"}}>
                                    <View style={pressedLogin ?styles.submit :styles.submitSignup}>
                                        <Text style={styles.submitText}>{pressedLogin ? "GetStarted" : "Create account"}</Text>
                                    </View>

                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={checkForgotPassword}>
                                        <Text style={styles.forgotPassword}>{pressedLogin ? "forgot your password ?" : null}</Text>

                                    </TouchableOpacity>
                                </View>



                                {
                                    !pressedLogin ?

                                        <View style={styles.apiDiv}>
                                            <Text style={styles.smallTextApi}>Or connect with</Text>
                                            <View style={styles.logoApis}>
                                                <TouchableOpacity onPress={loginWithFacebook}>
                                                    <Image style={styles.logoApi} source={require("../assets/facebook.png")} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={signInWithGoogle}>
                                                    <Image style={styles.logoApi} source={require("../assets/google.png")} />

                                                </TouchableOpacity>
                                            </View>
                                          
                                          
                                          
                                          
                                        </View>
                                        : null}

                            </React.Fragment>
                        )
                }
            </Formik>

        </View>
        </ScrollView>

    )

}


const styles = StyleSheet.create({
    forgotPassword: {
        alignSelf: "flex-end",
        margin: "2%",
        color: "#a8a8a8",
        width: "100%"
    },
    switchTextSignup: {
        fontSize: 17,
        color: "#24A9E1"

    },
    switchTextSignupPressed: {
        color: "white",
        fontSize: 17
    },
    switchTextLoginPressed: {
        color: "white",
        fontSize: 17

    },
    switchTextLogin: {
        fontSize: 17,
        color: "#24A9E1"

    },

    signup: {
        width: "50%",
        backgroundColor: "white",
        borderRadius: 18,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",



    },
    login: {
        width: "50%",
        backgroundColor: "white",
        borderRadius: 18,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",



    },
    loginPressed: {
        width: "50%",
        backgroundColor: "#24A9E1",
        borderRadius: 18,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    signupPressed: {
        width: "50%",
        backgroundColor: "#24A9E1",
        borderRadius: 18,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    switch: {
        padding:"2%",
        flex: 1,
        width: "58%",
        height: "6%",
        backgroundColor: "white",
        borderRadius: 18,
        position: "absolute",
        top: "25%",
        elevation:10,
        marginTop: Platform.OS == 'ios' ? 30 : 20,
        alignSelf: "center",
        flexDirection: "row",
    },
    submit: {
        flex: 1,
        width: "100%",
        height: 35,
        backgroundColor: "#24A9E1",
        borderRadius: 18,
        position: "absolute",
        bottom: "-7%",
        marginTop: Platform.OS == 'ios' ? 30 : 20,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"

    },

    submitSignup: {
        flex: 1,
        width: "100%",
        height: 35,
        backgroundColor: "#24A9E1",
        borderRadius: 18,
        position: "absolute",
        bottom: "-3%",
        marginTop: Platform.OS == 'ios' ? 30 : 20,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"

    },



    submitText: {
        color: "white",
        fontSize: 16
    },

    container: {
        flex:1,
        alignItems: "center",
        backgroundColor: '#f5f5f5',
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        overflow:"scroll"


    },
    logoContainerLogin:{
            width:"100%",
            height:"30%",
            flexDirection:"column",
            alignItems:"center",
            justifyContent:"center"
    },
    logoContainerSignup:{
        width:"100%",
        height:"27%",
        alignContent:"center",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center"
},
    FieldsContainerSignup: {
        alignSelf:"center",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        position:"absolute",
        top:"31%",
        height: "65%",
        shadowColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        backgroundColor: "white",
        borderRadius: 18,
        padding: 20,
        alignContent: "stretch"
        

    },
    FieldsContainer: {
        alignSelf:"center",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        height: "40%",
        shadowColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        backgroundColor: "white",
        borderRadius: 18,
        padding: 10,
        alignContent: "stretch"



    },

    smallTextApi: {
        color: 'black',
        fontWeight: "500",
        letterSpacing: 2


    },
    logoApi: {
        width: 80,
        height: 40,
        margin: 30,
        borderRadius: 15,


    },
    logoApplication: {
        alignSelf: "center",
        width: 70,
        height: 70,
        margin: 30

    },
    logoApis: {
        flex: 1,
        flexDirection: "row",
        padding: 10
    },
    apiDiv: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height:"40%",
        position:"absolute",
        top:"90%",
        padding: "10%",
        margin: 30
    }

})
