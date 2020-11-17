import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';

import Colors from '../constants/Colors';
const SubmitButton = (props) =>{
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={{...styles.button, ...props.style}}>
                <Text style={styles.buttonText}>{props.children}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: Dimensions.get('window').height * 0.01, //9
        paddingHorizontal: Dimensions.get('window').width * 0.04, //20
        borderRadius: 30,
        marginVertical:2,

        //shadow
        shadowColor: '#f3f3f3',
        shadowOffset: {width:1, height:2},
        shadowOpacity: 0.36,
        shadowRadius: 6,
        elevation: 9
    },
    buttonText: {
        color: Colors.accent,
        fontSize: Dimensions.get('window').width > 392 ? 19 : 17
    }
});

export default SubmitButton ;
