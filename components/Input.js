import React , {useReducer, useEffect} from 'react';
import {TextInput, StyleSheet, Image, View, Text, Dimensions} from 'react-native';
import Colors from '../constants/Colors';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, action) => {
    switch(action.type){
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid
            };
        case INPUT_BLUR:
            return {
                ...state,
                touched: true
            };
        default:
            return state;
    }
};

const Input = (props) => {

    const [inputState, dispatch] = useReducer(inputReducer, {
        value: '',
        isValid: false,
        touched: false
    });

    const {onInputChange, inputId} = props;

    useEffect(()=>{
        /*if(inputState.touched){
            onInputChange(inputId,inputState.value, inputState.isValid);
        }*/
        onInputChange(inputId,inputState.value, inputState.isValid);
        
    }, [inputState, onInputChange, inputId]);

    const textChangeHandler = text =>{
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }
        if (props.maxLength != null && text.length > props.maxLength) {
            isValid = false;
        }
        if(props.repeatpw != null && text !== props.repeatpw){
            isValid = false;
        }
        dispatch({type: INPUT_CHANGE, value: text, isValid: isValid});
    };

    const lostFocusHandler = () => {
        if(props.onLostFocus){
            props.onLostFocus(inputState.value);
        }
        dispatch({type: INPUT_BLUR });

    }; 
    
    return(
        <View>
        <View style={styles.inputContainer}>
            <Image 
            style={styles.image} 
            source={props.imageSrc} 
            />
            <TextInput 
            {...props}
            style={{...styles.input, ...props.style}} 
            placeholder={props.placeholder}
            placeholderTextColor={Colors.placeholder}
            value={inputState.value}
            onChangeText={textChangeHandler}
            onBlur={lostFocusHandler}
            />
        </View>
        {!inputState.isValid && inputState.touched && ( <View style={styles.validationError}>
            <Text style={styles.errorText}>{props.errorText}</Text>
        </View>)}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius: 25,
        height: Dimensions.get('window').height*0.075 //60
    },
    image:{
        width:'12%',
        height:'60%',
        //backgroundColor:'green',
        margin: 9,
        resizeMode:'contain'
    },
    input: {
        marginVertical: 10,
    },
    validationError: {
        alignItems: 'center',

        
    },
    errorText:{
        color: 'red',
        fontWeight: "bold",
        fontSize: 12.5
        //marginLeft: Dimensions.get('window').width *0.04
    }


});

export default Input;