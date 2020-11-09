import React, {useReducer, useCallback, useState} from 'react';
import {View, StyleSheet, ScrollView, Dimensions, Keyboard, Alert, Platform} from 'react-native';

import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';

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

const SignUpForm = (props) => {
    const[password, setPassword] = useState('');
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            username: '',
            email:'',
            password: '',
            repeatPassword: '',
            phone: '',
            address: ''
        }, 
        inputValidities: {
            username: false,
            email: false,
            password: false,
            repeatPassword: false,
            phone: false,
            address: false
        }, 
        formIsValid: false
    });

    const getPasswordHandler = (password)=>{
        setPassword(password);
    };


    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        });
        
    },[dispatchFormState]);

    const signupHandler = () =>{
        if(!formState.formIsValid){
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [{text: 'Okay'}]);
            return ;
        }
        Keyboard.dismiss();
        console.log('hello from signup');
        console.log(formState.inputValues);
      };


    return(
    <View style={styles.formSignupContainerAll}>
        <View style={styles.formContainerSignup}>
            <ScrollView style={styles.FormSignupListContainer}>
            <View style={styles.listItem}>
                <Input 
                inputId="username"
                style={styles.input}
                imageSrc={require("../assets/images/login.png")} 
                placeholder="username" 
                errorText ="please enter a valid username"
                onInputChange={inputChangeHandler}
                required
                    />
            </View>
            <View style={styles.listItem}>
                <Input 
                inputId="email"
                style={styles.input}
                imageSrc={require("../assets/images/email.png")} 
                placeholder="E_mail" 
                errorText ="please enter a valid email"
                autoCapitalize="none"
                onInputChange={inputChangeHandler}
                required
                email
                    />
            </View>
            <View style={styles.listItem}>
                <Input 
                inputId="password"
                style={styles.input}
                imageSrc={require("../assets/images/password.png")} 
                placeholder="password" 
                errorText ="please enter a valid password"
                onInputChange={inputChangeHandler}
                required
                secureTextEntry

                onLostFocus={getPasswordHandler}
                />
            </View>
            <View style={styles.listItem}>
                <Input 
                inputId="repeatPassword"
                secureTextEntry={true}
                style={styles.input}
                imageSrc={require("../assets/images/password.png")} 
                placeholder="repeat password" 
                errorText ="please repeat your password"
                onInputChange={inputChangeHandler}
                required
                repeatpw={password}
                />
            </View>
            <View style={styles.listItem}>
                <Input 
                inputId="phone"
                style={styles.input}
                imageSrc={require("../assets/images/phone.png")} 
                placeholder="phone" 
                errorText ="please enter a valid phone"
                multiline
                numberOfLines={2}
                keyboardType="number-pad"
                onInputChange={inputChangeHandler}
                required
                minLength={8}
                maxLength={8}
                />
            </View>
            <View style={styles.listItem}>
                <Input 
                inputId="address"
                style={styles.input}
                imageSrc={require("../assets/images/home.png")} 
                placeholder="Specify the address if you live in builder"
                errorText ="please enter your address"
                onInputChange={inputChangeHandler}
                required
                />
            </View>
    </ScrollView>
        </View>
        <View style={styles.submitSignUpButtonContainer}>
            <SubmitButton onPress={signupHandler}>Create account</SubmitButton>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    formSignupContainerAll:{
        flex:1,
        alignItems: 'center',
    },
    formContainerSignup:{
        //flex:1,
        alignItems: 'center',
        backgroundColor:'white',
        borderRadius:20,
        width:'87%',
        //height:'60%',
        paddingHorizontal:  Dimensions.get('window').width * 0.03,
 

        marginTop: Dimensions.get('window').height *0.11, //60


    },
    FormSignupListContainer:{
        marginVertical: Dimensions.get('window').height * 0.05, //42
        width:'90%'
    },

    listItem:{
        marginBottom: 12,
    },
    input: {
        width:'90%',
        height: 30,
    },
    submitSignUpButtonContainer:{
        alignItems:'center',
        width:'45%',
        position:'absolute',
        bottom: '-5%',
        //zIndex: 2
        //backgroundColor: 'red'
    },
});

export default SignUpForm;