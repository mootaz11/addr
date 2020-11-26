import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
//import StarRating from 'react-native-star-rating';

const FeedbackListItem = (props) => {

    return (
            <View></View>)
        /*
        <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image} 
                    source={props.image}
                />
            </View>
            <View style={styles.paragraphContainer}>
                <View style={styles.messageContainer}>
                    <Text style={{fontSize: 11.5}}>{props.message} </Text>
                </View>
                <View style={styles.favRateContainer}>
                    <StarRating
                    containerStyle={{justifyContent:'flex-start'}}
                    disabled={true}
                    maxStars={5}
                    rating={props.rate}
                    starSize={20}
                    />
                </View>
            </View>
        </View>
    );
*/

};

const styles = StyleSheet.create({
    itemContainer:{
        //backgroundColor:'blue',
        flex:1,
        height:55,
        flexDirection:'row',
        marginBottom:5,
    },
    imageContainer:{
        //backgroundColor:'gray',
        flex:1,
    },
    image:{
        width:'60%',
        height:'100%',
        borderRadius:50,
    },
    paragraphContainer:{
        //backgroundColor:'pink',
        flex:3,
        justifyContent:'space-between'
    },
    messageContainer:{
        //backgroundColor: 'blue',
        flex:2
    },
    favRateContainer:{
        //backgroundColor:'red',
        flex:1.5
    },
});

export default FeedbackListItem;