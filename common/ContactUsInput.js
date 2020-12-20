import React, {useReducer, useEffect} from 'react';
import { View, Text, TextInput,StyleSheet, Dimensions} from 'react-native';


const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, action) => {
    switch(action.type){
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid,
            };
        case INPUT_BLUR:
            return{
                ...state,
                touched: true
            };

        default:
            return state;
    }
};

const ContactUsInput = (props) => {

    const [inputState, dispatch] = useReducer(inputReducer, {
        value:'',
        isValid: false,
        touched: false
    });

    const { onInputChange, id } = props;

    useEffect(()=> {
        if(inputState.touched){
            onInputChange(id,inputState.value, inputState.isValid);
        }
    },[inputState, onInputChange, id]);

    const textChangeHandler = (text) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        dispatch({type: INPUT_CHANGE, value: text, isValid:isValid });
    };

    const lostFocusHandler = () => {
        dispatch({type: INPUT_BLUR});
    };

    return (
        <View style={styles.formControle}>
             <TextInput 
                    {...props}
                    style={styles.inputStyle} 
                    placeholder={props.placeholder}
                    placeholderTextColor={'black'}
                    value={inputState.value}
                    onChangeText={textChangeHandler}
                    onBlur={lostFocusHandler}
            />
            {!inputState.isValid && inputState.touched && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorStyle}>{props.errorText}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    formControle:{
        //backgroundColor:'yellow',
        marginBottom:Dimensions.get('window').height * 0.03, //20
    },
    inputStyle:{
        height:Dimensions.get('window').height * 0.045, //35
        borderBottomColor:'black',
        borderBottomWidth: 2,
        fontWeight:'bold',
    },
    errorContainer:{
        //backgroundColor:'brown',
        //flex:1
    },
    errorStyle:{
        color:'red',
        fontSize:12,
        fontWeight:'700'
    }
});

export default ContactUsInput;