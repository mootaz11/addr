import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

import Colors from '../constants/Colors';
const MainButton = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={props.clickSignup ?styles.buttonActive:styles.buttonInActive}>
                <Text style={props.clickSignup ?styles.buttonActiveText:styles.buttonInActiveText}>{props.children}</Text>
            </View>
        </TouchableOpacity>
    );

};

const styles = StyleSheet.create({
    buttonActive:{
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 30,
        marginVertical: 2,

    },
    buttonActiveText:{
        color: 'white',
        fontSize: 16 ,
    },
    buttonInActive:{
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 30,
        marginVertical: 2,

    },
    buttonInActiveText:{
        color: Colors.primary,
        fontSize: 16,
    }
});

export default MainButton ;