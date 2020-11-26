import React, { useState, useEffect } from 'react';

import {View , StyleSheet, Text, TextInput, TouchableOpacity, Image, FlatList,Platform} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../constants/Colors';

const images =[
    {id: 1, name: 'ahmed'},
    {id: 2, name: 'ali'},
    {id: 3, name: 'sassi'},
    {id: 4, name: 'mohamed'},
];

const AddProductScreen = (props) => {
    const [selectedImages, setSelectedImages]=useState([]);

    useEffect(() => {
        const getPermission = async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        };
        getPermission();
      }, []);

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
         setSelectedImages(
             [ ...selectedImages, {id:(selectedImages.length +1).toString(), uri: result.uri} ]
         );
        }
        console.log(selectedImages.length);
      };

    const renderImageItem = (itemData) => {
        return (
                <View style={styles.imageChooseContainer}>
                <Image
                style={styles.image}
                source={{uri: itemData.item.uri}}
                />
                </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.titreStyle}>Title</Text>
                <View style={styles.titleInputContainer}>
                    <TextInput
                    style={styles.inputTitle} 
                    placeholder="your product title"
                    placeholderTextColor={Colors.placeholder}
                    //value={inputState.value}
                    //onChangeText={textChangeHandler}
                    //onBlur={lostFocusHandler}
                    />
                </View>
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.titreStyle} >Description</Text>
                <View style={styles.descriptionInputContainer}>
                    <TextInput 
                    style={styles.inputDescription} 
                    placeholder="your product description"
                    placeholderTextColor={Colors.placeholder}
                    multiline
                    numberOfLines={10}
                    />
                </View>
            </View>
            <View style={styles.titleContainer} >
                <Text style={styles.titreStyle}>Product Type</Text>
                <View style={styles.titleInputContainer}>
                    <TextInput 
                    style={styles.inputTitle} 
                    placeholder="your product type"
                    placeholderTextColor={Colors.placeholder}
                    //value={inputState.value}
                    //onChangeText={textChangeHandler}
                    //onBlur={lostFocusHandler}
                    />
                </View>
            </View>
            <View  style={styles.imagesContainer}>
                <Text style={styles.titreStyle}>Images</Text>
                <View style={styles.imagesInputContainer}>
                    <View style={styles.buttonAddContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            <Image
                            source={require('../../assets/images/add.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                     contentContainerStyle={{paddingVertical: 8, paddingRight:8}}
                     data={selectedImages}
                     renderItem={renderImageItem} 
                     horizontal={true}
                    />
                </View>
            </View>
            <View style={styles.pricingContainer}>
                <Text style={styles.titreStyle}>Pricing</Text>
            </View>
            <View style={styles.weightContainer}>
                <Text style={styles.titreStyle}>WEIGHT</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
                flex: 1,
                //alignItems: 'center',
                //justifyContent: 'center',
                backgroundColor:Colors.background,
                marginTop:30,
                padding:10
                 //alignItems: 'center',  //crossAxisAlign
                //justifyContent: 'center' //mainAxisAlign
    },
    titleContainer:{
        //backgroundColor:'blue',
        flex:1
    },
    titleInputContainer:{
        //backgroundColor:'purple',
        flex:1,
        //justifyContent:'center'
    },
    inputTitle:{
        flexDirection: 'row',
        flex:1,
        /*alignItems: 'center',
        justifyContent:'center',*/
        backgroundColor: 'white',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal:8
    },
    titreStyle:{
        fontSize:18,
        fontWeight:'bold'
    },

    descriptionContainer:{
        //backgroundColor:'green',
        flex:1.75
    },
    descriptionInputContainer:{
        flex:1,
        //backgroundColor:'blue',
        height:56
    },
    inputDescription:{
        flexDirection: 'column',
        flex:1,
        /*alignItems: 'flex-start',
        justifyContent:'flex-start',*/
        backgroundColor: 'white',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal:8,
    },

    imagesContainer:{
        //backgroundColor:'white',
        flex:3
    },
    imagesInputContainer:{
        //backgroundColor:'purple',
        flex:1,
        margin:10,
        flexDirection:'row-reverse',
        alignItems:'flex-end'
    },

    buttonAddContainer:{
        backgroundColor:'white',
        height:'89%',
        width:'22%',
        marginBottom:8,
        marginLeft:2,
        borderRadius:13,
        justifyContent:'center',
        alignItems:'center',
        borderColor: 'white',
        borderWidth: 5,
        elevation:10
    },
    imageChooseContainer: {
        backgroundColor:'pink',
        width:80,
        height:155,
        marginLeft:8,
        borderRadius:13,
        elevation:10
    },
    image:{
        flex:1,
        resizeMode:'stretch',
        borderRadius:13,
        //backgroundColor:'green'
    },




    pricingContainer:{
        backgroundColor:'orange',
        flex:2
    },
    weightContainer:{
        backgroundColor:'yellow',
        flex:1.5
    },
});

export default AddProductScreen;