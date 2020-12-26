import React from 'react';
import {View,Animated, Easing} from 'react-native';


export default function Loading(props){
    const spinValue = new Animated.Value(0);

    // First set up animation 
    Animated.timing(
        spinValue,
        {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear, // Easing is an additional import from react-native
            useNativeDriver: true  // To make use of native driver for performance
        }
    ).start()
    // Next, interpolate beginning and end values (in this case 0 and 1)
    const spin = spinValue.interpolate({
        inputRange: [0, 0.5],
        outputRange: ['0deg', '1000deg']
    })
    return(
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Animated.Image
            style={{ width:90,height:90, transform: [{ rotate: spin }] }}
            source={require("../assets/images/logoBlue.png")} />
        </View>
    )
}