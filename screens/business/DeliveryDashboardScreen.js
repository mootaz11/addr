import React from 'react';

import { StyleSheet, View, Text, Image, FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import MarkListItem from '../../common/MarkListItem';
import FeedbackListItem from '../../common/FeedbackListItem';

const markers = [
    {
        id: '1',
        image:'../../assets/images/adidas.jpg',
        name:'Amir',
        price:109.99,
    },
    {
        id: '2',
        image:'../../assets/images/adidas.jpg',
        name:'Amira',
        price:109.99,
    },
    {
        id:'3',
        image:'../../assets/images/adidas.jpg',
        name:'Salah',
        price:109.99,
    },
    {
        id:'4',
        image:'../../assets/images/adidas.jpg',
        name:'Mohamed Ali',
        price:109.99,
    },
    {
        id:'5',
        image:'../../assets/images/adidas.jpg',
        name:'Salah',
        price:109.99,
    },
    {
        id:'6',
        image:'../../assets/images/adidas.jpg',
        name:'Mohamed Ali',
        price:109.99,
    },
    {
        id:'7',
        image:'../../assets/images/adidas.jpg',
        name:'Mohamed Ali',
        price:109.99,
    },
];

const feedbacks = [
    {
        id: '1',
        image:'../../assets/images/adidas.jpg',
        message:'cest un beau produit , je lui recommende',
        rate:4.5,
    },
    {
        id: '2',
        image:'../../assets/images/adidas.jpg',
        message:'attention cest une alert, vous devez faire attentiton à cette produit si vous lait ne acheter pas ce produit .',
        rate:5,
    },
    {
        id: '3',
        image:'../../assets/images/adidas.jpg',
        message:'Amir',
        rate:3.7,
    },
    {
        id: '4',
        image:'../../assets/images/adidas.jpg',
        message:'Amir',
        rate:4,
    },
    {
        id: '5',
        image:'../../assets/images/adidas.jpg',
        message:'Amir',
        rate:2.5,
    },
    {
        id: '6',
        image:'../../assets/images/adidas.jpg',
        message:'Amir',
        rate:3,
    },
    {
        id: '7',
        image:'../../assets/images/adidas.jpg',
        message:'Amir',
        rate:4.8,
    },
];

const DeliveryDashboardScreen = () => {

    const formatData = (data) =>{
        const numberOfFullRows = Math.floor(data.length/2);

        let numberOfElementsLastRow = data.length - (numberOfFullRows * 2);
        while(numberOfElementsLastRow !== 2 && numberOfElementsLastRow !==0 ){
            data.push({ 
                id:'nul',
                empty:true
            });
            numberOfElementsLastRow = numberOfElementsLastRow + 1;
        };
        return data;
    };

    const renderListMarkersItem = (itemData) => {
            return (
                <MarkListItem 
                index={itemData.index + 1}
                image={require("../../assets/images/adidas.jpg")}
                name={itemData.item.name}
                price={itemData.item.price}
                empty={!!itemData.item.empty}
                />
            );

    };

    const renderListFeedbacksItem= (itemData)=>{
        return(
            <FeedbackListItem
            image={require("../../assets/images/avatar.jpg")}
            message={itemData.item.message}
            rate={itemData.item.rate}
            />
        );
    };



    return (
        <View style={styles.mainContainer}>
            <View style={styles.partOne}>
                <LinearGradient
                        colors={['#2474f1', '#8c4aac']}
                        start={[0, 0]} 
                        end={[1, 1]}
                        style={styles.part1}
                >
                    <View style={styles.paragraphContainer}>
                        <Text style={styles.textStyleTitre}>Hi Salem</Text>
                        <Text style={styles.textStyleTitle}>Ready to start your day with addressti</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image 
                        style={styles.image}
                        source={require('../../assets/images/box.png')}
                        />
                    </View>
                </LinearGradient>
                <View style={styles.part2}>
                    <View style={styles.cardContainer}>
                        <Text>Delivery Fees</Text>
                        <LinearGradient
                        colors={['#256ced', '#564fc6']}
                        start={[0, 0]} 
                        end={[1, 1]}
                        style={styles.cardValueContainer}
                        >
                            <Text style={styles.textValuesStyle}>1090 TDN</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.cardContainer}>
                        <Text>Business Money</Text>
                        <LinearGradient
                        colors={['#6454c3', '#9440a1']}
                        start={[0, 0]} 
                        end={[1, 1]}
                        style={styles.cardValueContainer}
                        >
                           <Text style={styles.textValuesStyle}>1100</Text>
                        </LinearGradient>
                    </View>
                </View>
                <View style={styles.part2}>
                    <View style={styles.cardContainer}>
                        <Text>Total</Text>
                        <LinearGradient
                        colors={['#376de5', '#654fbd']}
                        start={[0, 0]} 
                        end={[1, 1]}
                        style={styles.cardValueContainer}
                        >
                            <Text style={styles.textValuesStyle}>10,500</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.cardContainer}>
                    </View>
                </View>
                <View style={styles.part4}>
                    <View style={styles.wheelImageContainer}>
                        <Image
                        style={styles.wheelImage}
                        source={require('../../assets/images/wheel.png')}
                        />
                    </View>
                    <View style={styles.drivingTotalContainer}>
                        <Text style={{fontWeight:'bold'}}>Driving Totals</Text>
                    </View>
                    <View style={styles.completedDeliveryContainer}>
                        <Text>1,805</Text>
                        <Text style={styles.smallText}>completed Delivery</Text>
                    </View>
                    <View style={styles.completedDeliveryContainer}>
                        <Text>9,074.63</Text>
                        <Text style={styles.smallText}>Online Km</Text>
                    </View>
                </View>
            </View>
            <View
                style={{
                borderBottomColor: '#d8d8d8',
                borderBottomWidth: 1,
                marginLeft: 5,
                marginRight: 5,
                marginTop: 5,
                marginBottom:5
                }}
            />
            <View style={styles.partTwo}>
                <View style={styles.titreContainer}>
                    <Text style={styles.titreStyle}>Money for return </Text>
                </View>
                <View style={styles.listContainer}>
                        <FlatList 
                        data={formatData(markers)} 
                        renderItem={renderListMarkersItem}
                        numColumns={2}
                        />
                </View>
            </View>
            <View
                style={{
                borderBottomColor: '#d8d8d8',
                borderBottomWidth: 1,
                marginLeft: 5,
                marginRight: 5,
                marginTop: 5,
                marginBottom:5
                }}
            />
            <View style={styles.partThree}>
                <View style={styles.feedbacksTitreContainer}>
                    <Text style={styles.titreStyle}>Feedbacks</Text>
                </View>
                <View style={styles.listFeedbacksContainer}>
                        <FlatList 
                        data={feedbacks} 
                        renderItem={renderListFeedbacksItem}
                        />
                </View>
            </View>
        </View>
    );
}; 

const styles = StyleSheet.create({
    mainContainer:{
        backgroundColor:Colors.background,
        flex:1,
    },
    partOne:{
        //backgroundColor:'blue',
        flex:3.75,
        marginTop:33,
        borderRadius: 20,
        alignItems:'center',
    },

    part1:{
        //backgroundColor:'red',
        flex:1.5,
        width:'92%',
        marginTop:25,
        marginBottom: 3,
        borderRadius: 20,
        flexDirection: 'row'
    },
    paragraphContainer:{
        //backgroundColor:'green',
        flex:1.75,
        justifyContent:'center',
        paddingHorizontal:10
    },
    textStyleTitre:{
        color:'white',
        fontSize: 30,
        fontWeight: 'bold'
    },
    textStyleTitle:{
        color: 'white'
    },
    imageContainer:{
        //backgroundColor:'purple',
        alignItems:'center',
        flex:1
    },
    image:{
        //backgroundColor:'green',
        position:'absolute',
        //bottom:'10%',
        top:'-33%',
        right:'5%',
        height:'140%',
        width:'100%',
        resizeMode:'cover',
    },

    part2:{
        //backgroundColor:'yellow',
        flex:1,
        flexDirection:'row',
        width:'92%',
        //marginTop: 3
    },
    cardContainer:{
        //backgroundColor:'green',
        alignItems:'center',
        flex:1,
        //margin:3
    },
    cardValueContainer:{
        //backgroundColor: 'gray',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:9,
        borderRadius:15,
        width:'93%'
    },
    textValuesStyle:{
        color: 'white',
        fontSize:32,
        fontWeight: 'bold'
    },

    part4:{
        backgroundColor:'#e6e6e6',
        flex:0.5,
        width:'92%',
        flexDirection:'row',
        marginVertical: 10
    },
    wheelImageContainer:{
        //backgroundColor:'orange',
        flex:0.5,
        justifyContent:'center',
        paddingHorizontal:5
    },
    wheelImage:{
        width:'90%',
        height:'90%',
        resizeMode:'contain'
    },
    drivingTotalContainer:{
        //backgroundColor:'purple',
        flex:1,
        justifyContent:'center',
        marginHorizontal:5
    },
    completedDeliveryContainer:{
        //backgroundColor:'yellow',
        justifyContent:'center',
        alignItems:'center',
        flex:1,
        marginHorizontal:5
    },
    smallText:{
        fontSize:10,
        fontWeight:'bold'
    },



    partTwo:{
        backgroundColor:'white',
        flex:1.4,
        borderRadius: 25,
    },

    titreContainer:{
        flex:1,
        //width:'90%',
        paddingLeft: 10
    },
    titreStyle:{
        fontWeight: 'bold',
        fontSize: 16,
        //fontStyle:'italic'
    },
    listContainer:{
        //backgroundColor:'purple',
        flex:6,
        paddingHorizontal: 5
    },



    partThree:{
        backgroundColor:'white',
        flex:2,
        borderRadius: 20
    },
    feedbacksTitreContainer:{
        //backgroundColor:'green',
        flex:1,
        paddingLeft: 10,
        marginBottom:2
    },
    listFeedbacksContainer:{
        //backgroundColor:'orange',
        flex:8,
        marginHorizontal:10,
        marginBottom:5
    }
});

export default DeliveryDashboardScreen;