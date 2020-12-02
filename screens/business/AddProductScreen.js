import React, { useState, useEffect, useCallback } from 'react';
import {View , StyleSheet, Text, TextInput, TouchableOpacity, Image, FlatList,Platform, ScrollView, LogBox, Modal,
TouchableHighlight, Dimensions} from 'react-native';
import { RadioButton } from 'react-native-paper';
import {Picker} from '@react-native-community/picker';
import * as ImagePicker from 'expo-image-picker';
import VariantListItem from '../../common/VariantListItem';
import OptionListItem from '../../common/OptionListItem';
import MyButton from '../../common/MyButton';
import Colors from '../../constants/Colors';

const variants = [
    {
        id:'1',
        variant:'Size',
        sousvariants:[
        {id:'11',sousvariant:'small'},
        {id:'12', sousvariant:'medium'},
        {id:'13', sousvariant:'large'}
        ]
    },
    {
    id:'2',
    variant:'Color',
    sousvariants:[
        {id:'21',sousvariant:'yellow'},
        {id:'22', sousvariant:'black'},
        {id:'23', sousvariant:'white'},
        {id:'24', sousvariant:'red1'},
        {id:'24', sousvariant:'red2'},
        {id:'24', sousvariant:'red3'},
        {id:'24', sousvariant:'red4'},
    ]
    },
    {
        id:'3',
        variant:'Size',
        sousvariants:[
        {id:'11',sousvariant:'s1'},
        {id:'12', sousvariant:'m2'},
        {id:'13', sousvariant:'l3'}
    ]
    },
];


const AddProductScreen = (props) => {
    const [modalVariantsVisible, setModalVariantsVisible] = useState(false);
    const [modalDiscountVisible, setModalDiscountVisible] = useState(false);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [productType, setProductType] = useState();
    const [selectedImages, setSelectedImages] = useState([]);
    const [price, setPrice] = useState();
    const [pourcentage, setPourcentage] = useState();
    const [newPrice, setNewPrice] = useState();
    const [weight, setWeight] = useState();
    const [variant, setVariant] = useState();
    const [sousVariants, setSousVariants]=useState();
    const[variantsInputs, setVariantsInputs] = useState([]);

    const [valueDiscount, setValueDiscount] = useState(false);
    const [weightUnit, setWeightUnit] = useState('g');
    const [allSousVariantsCombinaisons, setSousVariantsCombinaisons] = useState([]);

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


      useEffect(() => {
          //LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
      }, []);

      useEffect(() => {
        if(variantsInputs.length>0){
            let arrayOfAllSousVariantsArrays=[];
            variantsInputs.map((variant)=> {
                //variant.sousvariants.map((sousvar)=> allSousVariants.push(sousvar.sousvariant))
                let arraySousVariant = variant.sousvariants.map(sousv => sousv.sousvariant);
                arrayOfAllSousVariantsArrays.push(arraySousVariant);
              }
              );
            //arrayOfAllSousVariantsArrays.map(arr => console.log(arr));  
            let arrayCom = cartesian(arrayOfAllSousVariantsArrays); 
            //allSousVariantsCombinaisons.map(value => console.log(value));
            setSousVariantsCombinaisons(arrayCom);
          }else{
              setSousVariantsCombinaisons([]);
              return ;
          }
    }, [variantsInputs]);


      const addVariantHandler = () => {
        let arrayStringSousVariants = sousVariants.replace(/ /g,'').split(',');
        let arrayObjectSousVariants = [];
        arrayStringSousVariants.map(val => arrayObjectSousVariants.push({id:guidGenerator(),sousvariant:val}));
        setVariantsInputs((prevVariantsInputs)=>[...prevVariantsInputs, {id:guidGenerator(),variant:variant, sousvariants:[...arrayObjectSousVariants]}]);
        setVariant('');
        setSousVariants('');
        setModalVariantsVisible(!modalVariantsVisible);
      };

      const removeVariantHandler = (variantId) => {
        setVariantsInputs(currentVariants => {
            return currentVariants.filter((vari)=> vari.id !== variantId);
        });
      };

      const removeSousVariantHandler = (variantId,sousVariantId) => {

        const index = variantsInputs.findIndex(vari => vari.id === variantId);
        const updatedVariant = variantsInputs.find((vari)=> vari.id === variantId);

        const updatedSousVariants = updatedVariant.sousvariants.filter(sousvari=> sousvari.id !== sousVariantId);

        updatedVariant.sousvariants = [...updatedSousVariants];

        setVariantsInputs( (prevVariants) => {
            return [
                ...prevVariants.slice(0,index),
                {...updatedVariant},
                ...prevVariants.slice(index+1)
            ];
        }
        );
      };

      const cartesian = useCallback((args) => {
        let r = [], max = args.length-1;
        function helper(arr, i) {
            for (var j=0, l=args[i].length; j<l; j++) {
                var a = arr.slice(0); // clone arr
                a.push(args[i][j]);
                if (i==max)
                    r.push(a);
                else
                    helper(a, i+1);
            }
        }
        helper([], 0);
        return r;
    },[]);

    function guidGenerator() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }



      const renderListVariantsItem = (itemData) =>{
            return (
                <VariantListItem
                variantId={itemData.id}
                key={itemData.id} 
                variant={itemData.variant}
                sousvariants={itemData.sousvariants}
                onDeleteVariant={removeVariantHandler}
                onDeleteSousVariant={removeSousVariantHandler}
                />
            );
      };

      const renderOptionsListItem = (itemData) => {
        //console.log(itemData.join('\n'));
        return (
            <OptionListItem
            //key={itemData.item.join('')}
            name={itemData.item.join('\n')}
            />
        );
    };

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


    const discountChangeHandler = () => {
        setValueDiscount((prevState)=> !prevState);
        if(!valueDiscount){
            setModalDiscountVisible(true);
        }
        if(valueDiscount){
            setNewPrice();
        } 
    };

    const discountPourcentageHandler = () => {
        const rate = pourcentage/100;
        const remiseValue = rate * price ;
        setNewPrice((parseFloat(price)- remiseValue).toString());
        setPourcentage('');
        setModalDiscountVisible(!modalDiscountVisible);
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView>
            <View style={styles.titleContainer}>
                <Text style={styles.titreStyle}>Title</Text>
                <View style={styles.titleInputContainer}>
                    <TextInput
                    style={styles.inputTitle} 
                    placeholder="your product title"
                    placeholderTextColor={Colors.placeholder}
                    value={title}
                    onChangeText={text=> setTitle(text)}
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
                    value={description}
                    onChangeText={text => setDescription(text)}
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
                    value={productType}
                    onChangeText={text => setProductType(text)}
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
                     contentContainerStyle={{
                         paddingVertical: Dimensions.get('window').height*0.01,//8 
                         paddingRight:Dimensions.get('window').width*0.02,//8 
                         //backgroundColor:'yellow'
                        }}
                     data={selectedImages}
                     renderItem={renderImageItem} 
                     horizontal={true}
                    />
                </View>
            </View>
            <View style={styles.pricingContainer}>
                <Text style={styles.titreStyle}>Pricing</Text>
                <View style={styles.priceDiscountContainer}>
                    <View style={styles.priceContainer}>
                        <Text>Price</Text>
                        <TextInput
                        style={styles.inputPrice} 
                        placeholder="your product price"
                        placeholderTextColor={Colors.placeholder}
                        keyboardType="decimal-pad"
                        value={price}
                        onChangeText={val => setPrice(val)}
                        //onBlur={lostFocusHandler}
                        />
                    </View>
                    <View style={styles.discountContainer}>
                        <View style={styles.radioButtonItem}>
                            <RadioButton 
                            value={valueDiscount} 
                            status={valueDiscount ? 'checked' : 'unchecked'}
                            onPress={discountChangeHandler}
                            color='blue'
                            />
                            <Text> Discount </Text>
                        </View>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalDiscountVisible}
                            >
                                <View style={styles.centeredViewModal}>
                                    <View style={styles.modalContainer}>
                                        <View style={styles.variantInputTitleContainer}>
                                            <Text>percentage</Text>
                                        </View>
                                        <View style={styles.variantInputContainer}>
                                            <TextInput
                                                style={styles.inputVariant}
                                                placeholder="your discount percentage"
                                                placeholderTextColor={Colors.placeholder}
                                                keyboardType="decimal-pad"
                                                value={pourcentage}
                                                onChangeText={p => setPourcentage(p)}
                                            //onBlur={lostFocusHandler}
                                            />
                                        </View>
                                        <View style={styles.modalButtonsContainer}>

                                            <TouchableHighlight
                                                style={{ ...styles.modalButton, backgroundColor: '#2196F3' }}
                                                onPress={discountPourcentageHandler}>
                                                <Text style={styles.textStyle}>Ok</Text>
                                            </TouchableHighlight>

                                            <TouchableHighlight
                                                style={{ ...styles.openButton, backgroundColor: 'pink' }}
                                                onPress={() => {
                                                    setPourcentage();
                                                    setNewPrice();
                                                    setModalDiscountVisible(!modalDiscountVisible);
                                                    setValueDiscount(false);
                                                }}>
                                                <Text style={styles.textStyle}>Cancel</Text>
                                            </TouchableHighlight>

                                        </View>

                                    </View>
                                </View>

                            </Modal>
                    </View>
                </View>
                <View style={styles.priceDiscountContainer}>
                    <View style={styles.priceContainer}>
                        <Text>New Price</Text>
                        <TextInput
                        style={styles.inputPrice} 
                        placeholder="new price after discount"
                        placeholderTextColor={Colors.placeholder}
                        editable={false}
                        value={newPrice}
                        
                        //onChangeText={textChangeHandler}
                        //onBlur={lostFocusHandler}
                        />
                    </View>
                    <View style={styles.discountContainer}>
                    </View>
                </View>
                <Text>Charger taxes on this product </Text>
            </View>
            <View style={styles.weightContainer}>
                <Text style={styles.titreStyle}>WEIGHT</Text>
                <Text>used to calculate shipping rates at checkout and label and prices during fulfillment</Text>
                <View style={styles.inputWeightContainer}>
                    <Text>Weight</Text>
                    <View style={styles.weightInputsContainer}>
                            <TextInput
                            style={styles.inputWeight} 
                            placeholder="your weight"
                            placeholderTextColor={Colors.placeholder}
                            keyboardType="decimal-pad"
                            value={weight}
                            onChangeText={we => setWeight(we)}
                            //onBlur={lostFocusHandler}
                            />
                            <Picker
                                selectedValue={weightUnit}
                                style={styles.unitPicker}
                                onValueChange={(itemValue, itemIndex) => setWeightUnit(itemValue)}
                                mode="dropdown"
                                >
                                <Picker.Item label="g" value="g" />
                                <Picker.Item label="kg" value="kg" />
                            </Picker>
                    </View>
                </View>
            </View>
            <View style={styles.variantsContainer}>
                <View style={styles.variantsTitleContainer}>
                    <Text style={styles.titreStyle}>Variants</Text>
                </View >

                <View style={styles.listVariantsContainer}>
                    {
                        variantsInputs.map((variant)=> renderListVariantsItem(variant))
                    }
                </View>

                <Modal
                animationType="slide"
                transparent={true}
                visible={modalVariantsVisible}
                >
                    <View style={styles.centeredViewModal}>
                        <View style={styles.modalContainer}>
                          <View style={styles.variantInputTitleContainer}>
                              <Text>Variant</Text>
                          </View>
                          <View style={styles.variantInputContainer}>
                            <TextInput 
                            style={styles.inputVariant} 
                            placeholder="your variant name"
                            placeholderTextColor={Colors.placeholder}
                            value={variant}
                            onChangeText={text => setVariant(text)}
                            //onBlur={lostFocusHandler}
                            />
                            </View>

                            <View style={styles.variantInputTitleContainer}>
                              <Text>Values</Text>
                            </View>
                            <View style={styles.variantInputContainer}>
                                <TextInput 
                                style={styles.inputVariant} 
                                placeholder="your variant value(s)"
                                placeholderTextColor={Colors.placeholder}
                                value={sousVariants}
                                onChangeText={text => setSousVariants(text)}
                                //onBlur={lostFocusHandler}
                                />
                            </View>
                            <View style={styles.modalButtonsContainer}>

                                <TouchableHighlight
                                style={{...styles.modalButton, backgroundColor:'#2196F3'}}
                                onPress={addVariantHandler}>
                                <Text style={styles.textStyle}>Save</Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: 'pink' }}
                                onPress={() => {
                                    setModalVariantsVisible(!modalVariantsVisible);
                                }}>
                                <Text style={styles.textStyle}>Close</Text>
                                </TouchableHighlight>

                            </View>

                        </View>
                    </View>

                </Modal>



                <View style={styles.addOtherOptionContainer}>
                    <TouchableOpacity onPress={()=>{
                            setModalVariantsVisible(true);
                        }}>
                            <View style={styles.touchableContainer}>
                                <View style={styles.imageAddOtherOptionContainer}>
                                    <Image
                                    style={styles.imageAddOtherOption}
                                    source={require('../../assets/images/add.png')}
                                    />
                                </View>
                                <View style={styles.textAddOtherOptionContainer}>
                                    <Text style={styles.addOtherOptionTextStyle}>Add Other Option</Text>
                                </View>
                            </View>
                    </TouchableOpacity>
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

                {allSousVariantsCombinaisons.length !== 0 ?(<View style={styles.options}>
                    <View style={styles.textOptionContainer}>
                        <Text style={{fontSize:16, fontWeight:'bold'}}>Options</Text>
                    </View>
                    <View style={styles.tableTitlesContainer}>
                        <View style={styles.variantsTitleTextContainer}>
                            <Text style={{fontSize:16}}>Variants</Text>
                        </View>
                        <View style={styles.priceTitleTextContainer}>
                            <Text style={{fontSize:16}}>Price</Text>
                        </View>
                        <View style={styles.stockTitleTextContainer} >
                            <Text style={{fontSize:16}}>Stock</Text>
                        </View>
                    </View>
                    <View style={styles.listOptionsContainer}>
                        <FlatList
                        nestedScrollEnabled
                        data={allSousVariantsCombinaisons}
                        renderItem={renderOptionsListItem}
                        keyExtractor={(item, index) => item.join('')}
                        />
                    </View>

                </View> ): null
                }
                
            </View>
            <MyButton style={{...styles.buttonSubmitStyle, backgroundColor:'#C3C3C3'}}>Save as draft</MyButton>
            <MyButton style={{...styles.buttonSubmitStyle, backgroundColor:Colors.primary}}>publich</MyButton>
            
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
                flex: 1,
                backgroundColor:Colors.background,
                //backgroundColor:'red',
                marginTop:Dimensions.get('window').height*0.04, //30
                padding:Dimensions.get('window').height*0.012 //10
                 //alignItems: 'center',  //crossAxisAlign
                //justifyContent: 'center' //mainAxisAlign
    },
    titleContainer:{
        //backgroundColor:'blue',
    },
    titleInputContainer:{
        //backgroundColor:'purple',
        flex:1,
    },
    inputTitle:{
        flexDirection: 'row',
        flex:1,
        height:Dimensions.get('window').height*0.065,//60
        backgroundColor: 'white',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius:10,
        paddingHorizontal:8
    },
    titreStyle:{
        fontSize:18,
        fontWeight:'bold'
    },

    descriptionContainer:{
        //backgroundColor:'green',
        flex:1,
        marginVertical:2
    },
    descriptionInputContainer:{
        //backgroundColor:'blue',
    },
    inputDescription:{
        flex:1,
        height:Dimensions.get('window').height*0.103,//80
        backgroundColor: 'white',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal:8,
    },

    imagesContainer:{
        backgroundColor:'white',
        //backgroundColor:'pink',
        //height: 220,
        marginVertical:5
    },
    imagesInputContainer:{
        //backgroundColor:'purple',
        flex:1,
        height:Dimensions.get('window').height*0.2283,//177
        margin:10,
        flexDirection:'row-reverse',
        alignItems:'flex-end'
    },

    buttonAddContainer:{
        backgroundColor:'white',
        height:'89%',
        width:'22%',
        marginBottom:Dimensions.get('window').height*0.01, //8
        marginLeft:2,
        borderRadius:13,
        justifyContent:'center',
        alignItems:'center',
        borderColor: 'white',
        borderWidth: 5,
        elevation:10
    },
    imageChooseContainer: {
        //backgroundColor:'pink',
        width:Dimensions.get('window').width*0.206,//80
        height:Dimensions.get('window').height*0.2009,//156
        marginLeft:Dimensions.get('window').width*0.02, //8
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
        backgroundColor:'white',
        //backgroundColor:'yellow',
        //flex:2,
        marginVertical:3,
        paddingHorizontal:3
    },
    priceDiscountContainer:{
        //backgroundColor:'red',
        flex:1,
        flexDirection:'row'
    },
    priceContainer:{
        //backgroundColor:'blue',
        flex:2
    },
    inputPrice:{
        //backgroundColor:'pink',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        marginHorizontal:Dimensions.get('window').width*0.0248,//10
        paddingHorizontal:3
    },
    discountContainer:{
        //backgroundColor:'yellow',
        flex:1,
        flexDirection:'row',
        alignItems:'flex-end'
    },
    radioButtonItem:{
        //backgroundColor:'red',
        flexDirection:'row',
        flex:1,
        alignItems:'center'
    },

    weightContainer:{
        backgroundColor:'white',
        flex:1.5,
        marginTop:3,
        paddingHorizontal:3
    },
    inputWeightContainer:{
        //backgroundColor:'orange',
        flex:1,
    },
    weightInputsContainer:{
        //backgroundColor:'blue',
        flex:1,
        flexDirection:'row',
        marginBottom:3
    },
    inputWeight:{
        //backgroundColor:'yellow',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        flex:4
    },
    unitPicker:{
        height: Dimensions.get('window').height*0.0455, //35
        width: 85,//Dimensions.get('window').width*0.216,
        //backgroundColor:'brown'
    },

    variantsContainer:{
        backgroundColor:'white',
        //backgroundColor:'brown',
        flex:6,
        //height: 220,
        marginTop:8,
        marginBottom:10,
        paddingHorizontal:3
    },
    variantsTitleContainer:{
        //backgroundColor:'green',
        flex:1,
    },

    listVariantsContainer:{
        //backgroundColor:'yellow',
        flex:1
    },
    addOtherOptionContainer:{
        //backgroundColor:'purple',
        flexDirection:'row',
        justifyContent:'center',
        flex:1
    },
    touchableContainer:{
        //backgroundColor:'red',
        flexDirection:'row',
        justifyContent:'center'
    },
    imageAddOtherOptionContainer:{
            //backgroundColor:'green',
    },
    textAddOtherOptionContainer:{
        //backgroundColor:'blue',
        marginHorizontal:Dimensions.get('window').width*0.025, //10
        justifyContent:'center'
    },
    imageAddOtherOption:{
        //backgroundColor:'orange',
        height:Dimensions.get('window').height*0.058,//45
        width:Dimensions.get('window').width*0.115//45
    },
    addOtherOptionTextStyle:{
        fontSize:19,
        color:'#0862ef'
    },

    centeredViewModal:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.5)',
        justifyContent:'center'
    },
    modalContainer:{
        margin: Dimensions.get('window').height*0.0255, //20
        backgroundColor: 'white',
        borderRadius: Dimensions.get('window').height*0.0255, //20
        padding: Dimensions.get('window').height*0.0256, //20
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    variantInputTitleContainer:{
        //backgroundColor:'blue',
        //height:'10%'
    },
    variantInputContainer:{
        //backgroundColor:'yellow',
        marginBottom:5
    },
    inputVariant:{
        backgroundColor: 'white',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius: 10,
        height:Dimensions.get('window').height*0.075, //60
        paddingHorizontal:8
    },
    modalButton:{
        borderRadius: Dimensions.get('window').height*0.0255, //20
        padding: Dimensions.get('window').height*0.013, //10
        marginVertical:Dimensions.get('window').height*0.013,//10
        elevation: 2,
    },
    openButton: {
        borderRadius: Dimensions.get('window').height*0.0255,
        padding: Dimensions.get('window').height*0.013,
        elevation: 2,
      },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },


    options:{
        //backgroundColor:'pink',
        height:Dimensions.get('window').height*0.388, //300
        padding:Dimensions.get('window').height*0.013,//10
    },
    textOptionContainer:{
        //backgroundColor:'green',
        flex:1,
        marginBottom:Dimensions.get('window').height*0.0255 //20
    },
    tableTitlesContainer:{
        //backgroundColor:'green',
        flex:1,
        flexDirection:'row',
    },
    variantsTitleTextContainer:{
        //backgroundColor:'pink',
        flex:1.15,
        //alignItems:'center'
    },
    priceTitleTextContainer:{
        //backgroundColor:'brown',
        flex:1.8,
        alignItems:'center'
    },
    stockTitleTextContainer:{
        //backgroundColor:'orange',
        flex:1.8,
        paddingHorizontal:Dimensions.get('window').width*0.025, //10
    },
    listOptionsContainer:{
        //backgroundColor:'purple',
        flex:10
    },
    buttonSubmitStyle:{
        margin:8,
        borderRadius:Dimensions.get('window').height*0.0255 //20
    }


});

export default AddProductScreen;