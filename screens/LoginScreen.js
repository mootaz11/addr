import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../navigation/AuthContext';
import { config } from '../secretKeys/appkeys'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Platform,
    Alert,
    Animated, Easing
} from 'react-native';
import MainButton from '../common/MainButton';
import Colors from '../constants/Colors';
import SignUpForm from '../common/SignUpForm';
import LoginForm from '../common/LoginForm';
import * as Facebook from 'expo-facebook';
import { ActivityIndicator } from 'react-native-paper';
import Loading from './Loading';
import AsyncStorageService from '../rest/AsyncStorageService';





export default function Login(props) {
    const spinValue = new Animated.Value(0);
    const [isLoading, setIsloading] = useState(true);

    // First set up animation 
    Animated.timing(
        spinValue,
        {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear, // Easing is an additional import from react-native
            useNativeDriver: true  // To make use of native driver for performance
        }
    ).start()
    // Next, interpolate beginning and end values (in this case 0 and 1)
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    })
    const [signupClicked, setSignupClicked] = useState(true);
    const clickSignupHandler = (val) => {
        setSignupClicked(val);
    };

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const context = useContext(AuthContext);

    const turntoLogin = (value)=>{
        console.log(value);
        setSignupClicked(value);
    }

    useEffect(() => {

        if (!context.isloading&&context.user) {
            props.navigation.navigate("Home");
        }

    },[context.isloading,context.user])


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {  
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const facebookLoginHandler = async () => {
        try {
            await Facebook.initializeAsync({
                appId: config.app_id_facebook,
            });
            const {
                type,
                token,
                expirationDate,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
            });
            console.log(type)
            if (type === 'success') {
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,birthday,picture.type(large)`);
                Alert.alert('Logged in!', `Hi ${(await response.json()).name}! `);
                Facebook.logOutAsync()
            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }

    };
    const checkForgotPassword = () => {
        navigation.navigate("forgotPassword")
    }
        if(!context.isloading&&!context.loggedIn){
        return (
        
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.fullContainer}>
                    <View style={styles.partOne}>
                        <Image
                            source={require('../assets/images/logoBlue.png')}
                            style={styles.image}
                            resizeMode="contain"                
                        />
                    </View>
                    <View style={styles.partTwo}>
                        <View style={{...styles.partTwoPartOne,...{flex:isKeyboardVisible ?4:2}}}>
                            <View style={styles.SharedPart}>
                                <View style={Platform.OS === 'ios' ? styles.buttonConIOS : styles.buttonConAndroid}>
                                    <View style={styles.loginSingupContainer}>
                                        <MainButton onPress={() => clickSignupHandler(false)} clickSignup={!signupClicked}
                                        >
                                            Log in
                                </MainButton>
                                        <MainButton onPress={() => clickSignupHandler(true)} clickSignup={signupClicked}
                                        >
                                            Sign up
                                </MainButton>
                                    </View>
                                </View>

                                {signupClicked ?

                                    <SignUpForm turntoSignIn ={turntoLogin} />
                                    :
                                    <LoginForm  isKeyboardVisible={isKeyboardVisible} />
                                }
                                {/* signupClicked ? 
                        <View style={styles.submitSignUpButtonContainer}>
                            <SubmitButton onPress={()=> Keyboard.dismiss()}>Create account</SubmitButton>
                        </View> :
                        <View style={{...styles.submitLoginButtonContainer,...{bottom:  isKeyboardVisible ? '20%' : '45%'}}}>
                            <SubmitButton onPress={()=> Keyboard.dismiss()}>Get started</SubmitButton>
                        </View>*/}
                            </View>
                        </View>
                        {signupClicked ? <View style={{...styles.lastPart,...{flex:isKeyboardVisible ? 0.1 : 1}}}>
                            <Text style={{ marginTop: Dimensions.get('window').height * 0.04 }}>or Connect with</Text>

                            {Platform.OS === 'ios' ?
                                <View style={styles.logoApis}>
                                    <TouchableOpacity onPress={() => { }} >
                                        <Image style={styles.logoApi} source={require('../assets/images/google.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{facebookLoginHandler()}} >
                                        <Image style={styles.logoApi} source={require('../assets/images/facebook1.png')} />
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={{ ...styles.logoApis, ...{ marginTop: isKeyboardVisible ? Dimensions.get('window').height * 0.02 : Dimensions.get('window').height * 0.06 } }}>
                                    <TouchableOpacity onPress={() => { console.log("hh")}} >
                                        <Image style={styles.logoApi} source={require('../assets/images/google.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{facebookLoginHandler()}} >
                                        <Image style={styles.logoApi} source={require('../assets/images/facebook1.png')} />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View> : null}
                    </View>

                </View>
            </TouchableWithoutFeedback>
        );}
        else {
            return <Loading/>
        }
    }
  



const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        //alignItems: 'center',  //crossAxisAlign
        //justifyContent: 'center' //mainAxisAlign
    },
    partOne: {
        width: '100%',
        height: '18%', //22  a modifier
        alignItems: 'center',
        justifyContent: 'flex-end',
        //backgroundColor:'yellow',
        paddingBottom: '3%'// 10
    },
    image: {
        width: '100%', //80%
        height: '70%', //70%  à modifier
        //backgroundColor: 'black'
    },
    partTwo: {
        flex: 1,
        //width: '100%',
        //backgroundColor: 'green',
        alignItems: 'center',
    },
    partTwoPartOne: {
        //backgroundColor: 'red',
        width: '100%'
    },
    SharedPart: {
        alignItems: 'center',
        //backgroundColor: 'blue',
        height: '100%',   // peut etre modifier 
        //backgroundColor:'grey'
    },
    buttonConIOS: {
        alignItems: "center",
        zIndex: 1,
    },
    buttonConAndroid: {
        alignItems: 'center'
    },

    loginSingupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * 0.08, //40  
        backgroundColor: 'white',
        borderRadius: 50,
        width: '52%',
        position: 'absolute',
        zIndex: 1,

        //shadow
        shadowColor: '#f3f3f3',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.36,
        shadowRadius: 6,
        elevation: 9
    },





    lastPart: {
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'green',
        width: '100%'
    },
    logoApis: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        //backgroundColor:'yellow',
        width: '54%'
    },
    logoApi: {
        width: 60,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 50
    }



    //maxwidth 80% : make sure that our width don't exceed 80% if the device would be too small 
});

