import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';


const MyButton = (props) => {
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

        paddingVertical: 20,

         //shadow
         shadowColor: '#f3f3f3',
         shadowOffset: {width:1, height:2},
         shadowOpacity: 0.36,
         shadowRadius: 6,
         elevation: 9
    },
    buttonText: {
        color: Colors.accent,
        fontSize: 20,
        fontWeight: '600'
    }
});

export default MyButton;