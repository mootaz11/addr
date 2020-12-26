import React, {useReducer, useCallback, useContext} from 'react';
import {View, StyleSheet, ScrollView, Text, Dimensions, Keyboard, Alert, Platform} from 'react-native';
import {login} from '../rest/userApi';

import Colors from '../constants/Colors';
import Input from '../common/Input';
import SubmitButton from '../common/SubmitButton';
import AuthContext from '../navigation/AuthContext';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {

    if(action.type === FORM_INPUT_UPDATE){
        const updatedValues = {
            ...state.inputValues,
            [action.input] : action.value
        };

        const updatedValidities = {
            ...state.inputValidities,
            [action.input] : action.isValid
        };

        let updatedFormIsValid = true;

        for(const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            ...state,
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid
        };
    }
    return state;
};

const LoginForm = (props) => {
    const context = useContext(AuthContext);
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email:'',
            password: ''
        }, 
        inputValidities: {
            email: false,
            password: false
        }, 
        formIsValid: false
    });

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        });
        
    },[dispatchFormState]);

    const loginHandler = () => {
        if(!formState.formIsValid){
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [{text: 'Okay'}]);
            return ;
        }
        Keyboard.dismiss();
        login(formState.inputValues).then(res=>{
            Alert.alert('', 'Login Done!', [{text: 'Okay'}]);
            context.LoginHandler({user:res.data.user,token:{accessToken:res.data.accessToken,refreshToken:res.data.refreshToken}})
                }).catch(err=>{
                    
                    alert("failed")
                  console.log(err.message)})         
      };

    return(
    <View style={styles.formLoginContainerAll}>
    <View style={styles.formContainerLogin}>
        <ScrollView style={styles.FormLoginListContainer}>
        <View style={styles.listItem}>
            <Input 
            style={styles.input} 
            inputId="email"
            imageSrc={require("../assets/images/login.png")} 
            placeholder="email"
            keyboardType="email-address"
            autoCapitalize="none"
            required
            email
            errorText ="please enter your email address"
            onInputChange={inputChangeHandler}
            />
        </View>
        <View style={styles.listItem}>
            <Input 
            inputId="password"
            imageSrc={require("../assets/images/password.png")} 
            placeholder="password"
            style={styles.input}
            secureTextEntry
            required
            errorText ="please enter your password"
            onInputChange={inputChangeHandler}
            />
        </View>
        <View style={styles.forgetPass}>
            <Text style={styles.forgetPassText}>Forget your password</Text>
        </View>
    </ScrollView>
    </View>

    {
        Platform.OS === 'ios' ? 
        <View style={{...styles.submitLoginButtonContainer,...{bottom: '43%'}}}>
            <SubmitButton onPress={loginHandler}>Get started</SubmitButton>
         </View>
        :  
        <View style={{...styles.submitLoginButtonContainer,...{bottom:  props.isKeyboardVisible ? '17%' : '43%'}}}>
            <SubmitButton onPress={loginHandler}>Get started</SubmitButton>
        </View>
    }
    </View>
    );
};

const styles = StyleSheet.create({
    formLoginContainerAll:{
        flex: 1,
        alignItems: 'center'
    },
    formContainerLogin:{
        alignItems: "center",
        width: '87%',
        backgroundColor: 'white',
        borderRadius:20,
        paddingHorizontal: Dimensions.get('window').width * 0.03 , //10

        marginTop:Dimensions.get('window').height *0.11, //60,
    },
    FormLoginListContainer:{
        marginVertical: Dimensions.get('window').height * 0.06,
        width:'90%'
    },
    submitLoginButtonContainer:{
        alignItems:'center',
        width:'45%',
        position:'absolute',
        //backgroundColor:'pink',
    },
    listItem:{
        marginBottom: 12,
    },
    input: {
        width:'90%',
        height: 30,
    },
    forgetPass: {
        marginTop: 3,
        alignItems: 'flex-end',
    },
    forgetPassText: {
        color: Colors.placeholder
    }
});

export default LoginForm;
