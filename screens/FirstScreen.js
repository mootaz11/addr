import React, {useState, useEffect} from 'react';

import {
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,  
} from 'react-native';
import MainButton from '../components/MainButton';
import Colors from '../constants/Colors';
import SignUpForm from '../components/SignUpForm';
import LoginForm from '../components/LoginForm';


const FirstScreen = (props) => {

    const [signupClicked, setSignupClicked] = useState(true);
    const clickSignupHandler = (val)=>{
        setSignupClicked(val);
    };

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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



    return (
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.fullContainer}>
            <View style={styles.partOne}>
                <Image 
                source={require('../assets/images/logoBlue.png')}
                style={styles.image}
                resizeMode="contain"
                />
            </View>
            <View style={styles.partTwo}>
                <View style={styles.partTwoPartOne}>
                    <View style={styles.SharedPart}>
                        <View style={styles.buttonCon}>
                            <View style={styles.loginSingupContainer}>
                                <MainButton  onPress={() => clickSignupHandler(false)} clickSignup={!signupClicked}
                                > 
                                Log in 
                                </MainButton>
                                <MainButton  onPress={() => clickSignupHandler(true)} clickSignup={signupClicked}
                                > 
                                Sign up 
                                </MainButton>
                            </View>
                        </View>
                        
                        { signupClicked ? 
                        
                            <SignUpForm />
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
                {signupClicked ? <View style={styles.lastPart}>
                    <Text style={{marginTop: Dimensions.get('window').height * 0.04 }}>or Connect with</Text>
                    <View style={{...styles.logoApis, ...{marginTop: isKeyboardVisible ? Dimensions.get('window').height *0.02 :Dimensions.get('window').height *0.06}}}>
                        <TouchableOpacity  onPress={()=>{}} >
                            <Image style={styles.logoApi} source={require('../assets/images/google.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=>{}} >
                            <Image style={styles.logoApi} source={require('../assets/images/facebook1.png')}/>
                        </TouchableOpacity>
                    </View>
            </View>: null}
            </View>

        </View>
      </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        //alignItems: 'center',  //crossAxisAlign
        //justifyContent: 'center' //mainAxisAlign
    },
    partOne:{
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
    partTwo:{
        flex:1,
        //width: '100%',
        //backgroundColor: 'green',
        alignItems: 'center',
    },
    partTwoPartOne:{
        flex:2, // peut etre modifier 
        //backgroundColor: 'red',
        width: '100%'
    },
    SharedPart:{
        alignItems: 'center',
        //backgroundColor: 'blue',
        height: '100%',   // peut etre modifier 
        //backgroundColor:'grey'
    },
    buttonCon:{
        alignItems: "center"
    },
    loginSingupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * 0.08, //40  
        backgroundColor: 'white',
        borderRadius: 50,
        width:'52%',
        position:'absolute',
        zIndex: 1,

        //shadow
        shadowColor: '#f3f3f3',
        shadowOffset: {width:1, height:2},
        shadowOpacity: 0.36,
        shadowRadius: 6,
        elevation: 9
    },





    lastPart: {
        flex:1,
        alignItems:'center',
        justifyContent: 'center',
        //backgroundColor: 'green',
        width: '100%'
    },
    logoApis: {
         //35
        flexDirection: 'row',
        justifyContent: 'space-around',
        //backgroundColor:'yellow',
        width: '54%'
    },
    logoApi:{
        width: 60,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 50
    }



    //maxwidth 80% : make sure that our width don't exceed 80% if the device would be too small 
});

export default FirstScreen ;