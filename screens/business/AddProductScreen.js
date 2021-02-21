import React, { useState, useEffect, useCallback, useReducer, useContext } from 'react';

import {
    View, StyleSheet, Text, TextInput, TouchableOpacity, Image, FlatList, Platform, ScrollView, LogBox, Modal,
    TouchableHighlight, Dimensions, Alert
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import * as ImagePicker from 'expo-image-picker';
import VariantListItem from '../../common/VariantListItem';
import OptionListItem from '../../common/OptionListItem';
import MyButton from '../../common/MyButton';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthContext from '../../navigation/AuthContext'
import { getPartnerDashboard, addCategory,getPartner } from '../../rest/partnerApi'
import { addProduct } from '../../rest/productApi';

const variants_food = [
    {
        id: '1',
        variant: 'CHOIX',
        sousvariants: [

        ]
    },
    {
        id: '2',
        variant: 'SUPPEMENTS',
        sousvariants: [

        ]
    },
    {
        id: '3',
        variant: 'INGREDIENTS',
        sousvariants: []
    },
];

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        };

    }
    return state;
};


const AddProductScreen = (props) => {
    const [formState, dispachFormState] = useReducer(formReducer, {
        inputValues: {
            title: '',
            description: '',

            price: '',
            weight: '',
        },
        inputValidities: {
            title: false,
            description: false,
            price: false,
            weight: false
        },
        formIsValid: false
    });
    const context = useContext(AuthContext);

    const [modalVariantsVisible, setModalVariantsVisible] = useState(false);
    const [modalDiscountVisible, setModalDiscountVisible] = useState(false);
    const [modalCategoryVisible, setModelCategoryVisible] = useState(false);

    const [titleTouched, setTitleTouched] = useState(false);
    const [descriptionTouched, setDescriptionTouched] = useState(false);

    const [priceTouched, setPriceTouched] = useState(false);
    const [weightTouched, setWeightTouched] = useState(false);

    const [gender, setGender] = useState();
    const [category, setCategory] = useState(false);
    const [productType, setProductType] = useState("food");
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagesTouched, setImagesTouched] = useState(false);
    const [pourcentage, setPourcentage] = useState();
    const [newPrice, setNewPrice] = useState();
    const [variant, setVariant] = useState();
    const [sousVariant, setSousVariant] = useState({ id_Variant: "", sousvariant: "" });
    const [sousVariants, setSousVariants] = useState();
    const [variantsInputs, setVariantsInputs] = useState([]);
    const [variantsTouched, setVariantsTouched] = useState(false);

    const [valueDiscount, setValueDiscount] = useState(false);
    const [weightUnit, setWeightUnit] = useState('g');
    const [allSousVariantsCombinaisons, setSousVariantsCombinaisons] = useState([]);
    const [categories, setCategories] = useState([]);
    const [foodVariants, setFoodVariants] = useState(variants_food);
    const [ModalSousVariantVisible, setModalSousVariantVisible] = useState(false)
    const [nameCategory, setNameCategory] = useState("");
    const [service, setService] = useState();


    const textChangeHandler = (inputIdentifier, text) => {
        let isValid = false;
        if (text.trim().length > 0) {
            isValid = true;
        }
        dispachFormState({
            type: FORM_INPUT_UPDATE,
            value: text,
            isValid: isValid,
            input: inputIdentifier
        });
    };

    const lostFocusHandler = (inputIdentifier) => {
        switch (inputIdentifier) {
            case 'title':
                setTitleTouched(true);
                break;
            case 'description':
                setDescriptionTouched(true);
                break;

            case 'price':
                setPriceTouched(true);
                break;
            case 'weight':
                setWeightTouched(true);
                break;
            default:
                break;
        }
    };



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
        getPartner(context.partner._id).then(partner=>{

            if (partner.services.isFood) {
                setProductType("food");
            }
            if (!partner.services.isFood && !partner.services.isDelivery) {
                setProductType("regular");
            }
            setCategories(partner.categories)
        })
       .catch(err=>{alert("error while getting partner")})

    }, [])
    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []);

    useEffect(() => {
        if (productType == "regular") {
            if (variantsInputs.length > 0) {
                let arrayOfAllSousVariantsArrays = [];
                variantsInputs.map((variant) => {
                    let variantOptions = variant.sousvariants.map(sousv => { return { name: sousv.sousvariant, id: sousv.id } });

                    arrayOfAllSousVariantsArrays.push(variantOptions);
                }
                );
                //arrayOfAllSousVariantsArrays.map(arr => console.log(arr));  
                let arrayCom = cartesian(arrayOfAllSousVariantsArrays);
                let _arrayCom = arrayCom.map(pricingItem => {
                    let _idIPricingItem = "";
                    let _nameCombination = ""
                    pricingItem.map(item => {
                        _idIPricingItem += item.id;
                        _nameCombination += item.name + "\n";
                    })

                    return { variantOptions: pricingItem, price: 0, stock: 0, id: _idIPricingItem, nameCombination: _nameCombination, isActive: false }
                });

                setSousVariantsCombinaisons(_arrayCom);
            } else {
                setSousVariantsCombinaisons([]);
                return;
            }
        }
        else {
            if (foodVariants.length > 0) {
                let arrayOfAllSousVariantsArrays = [];
                foodVariants.map((variant) => {
                    let variantOptions = variant.sousvariants.map(sousv => { return { name: sousv.sousvariant, id: sousv.id } });
                    arrayOfAllSousVariantsArrays.push(variantOptions);
                }
                );
                //arrayOfAllSousVariantsArrays.map(arr => console.log(arr));  
                let filtered = arrayOfAllSousVariantsArrays.filter(arr => arr.length != 0);
                let _array_Com = [];
                filtered.map(pricingItem => {
                    pricingItem.map(item => {
                        _array_Com.push({ variantOptions: [{ ...item }], price: 0, stock: 0, id: item.id, nameCombination: item.name, isActive: false })
                    }
                    );

                }

                )


                setSousVariantsCombinaisons(_array_Com);
            } else {
                setSousVariantsCombinaisons([]);
                return;
            }
        }
    }, [variantsInputs, foodVariants]);

    const addNewCategory = () => {
        
        addCategory(context.partner._id, nameCategory).then(newCategory => {
            setCategories([...categories, newCategory]);
            setModelCategoryVisible(!modalCategoryVisible);
            setNameCategory("");
        }).catch(message => {
            alert("add category failed");
        })
    }

    const addVariantHandler = () => {
        let arrayStringSousVariants = sousVariants.replace(/ /g, '').split(',');
        let arrayObjectSousVariants = [];
        arrayStringSousVariants.map(val => arrayObjectSousVariants.push({ id: guidGenerator(), sousvariant: val }));

        setVariantsInputs((prevVariantsInputs) => [...prevVariantsInputs, { id: guidGenerator(), variant: variant, sousvariants: [...arrayObjectSousVariants] }]);
        setVariant('');
        setSousVariants('');
        setModalVariantsVisible(!modalVariantsVisible);
    };

    const removeVariantHandler = (variantId) => {
        setVariantsInputs(currentVariants => {
            return currentVariants.filter((vari) => vari.id !== variantId);
        });
    };

    const removeSousVariantHandler = (variantId, sousVariantId) => {
        if (productType == "regular") {

            const index = variantsInputs.findIndex(vari => vari.id === variantId);
            const updatedVariant = variantsInputs.find((vari) => vari.id === variantId);

            const updatedSousVariants = updatedVariant.sousvariants.filter(sousvari => sousvari.id !== sousVariantId);

            updatedVariant.sousvariants = [...updatedSousVariants];

            setVariantsInputs((prevVariants) => {
                return [
                    ...prevVariants.slice(0, index),
                    { ...updatedVariant },
                    ...prevVariants.slice(index + 1)
                ];
            }
            );

        }
        else {

            const index = foodVariants.findIndex(vari => vari.id === variantId);
            const updatedVariant = foodVariants.find((vari) => vari.id === variantId);

            const updatedSousVariants = updatedVariant.sousvariants.filter(sousvari => sousvari.id !== sousVariantId);

            updatedVariant.sousvariants = [...updatedSousVariants];

            setFoodVariants((prevVariants) => {
                return [
                    ...prevVariants.slice(0, index),
                    { ...updatedVariant },
                    ...prevVariants.slice(index + 1)
                ];
            }
            );

        }



    };

    const cartesian = useCallback((args) => {
        let r = [], max = args.length - 1;
        function helper(arr, i) {
            for (var j = 0, l = args[i].length; j < l; j++) {
                var a = arr.slice(0); // clone arr
                a.push(args[i][j]);
                if (i == max)
                    r.push(a);
                else
                    helper(a, i + 1);
            }
        }
        helper([], 0);
        return r;
    }, []);

    function guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }


    const addOptionHandler = React.useCallback((idVariant) => {


        setSousVariant({ ...sousVariant, id_Variant: idVariant })
        setModalSousVariantVisible(!ModalSousVariantVisible)

    }
    );


    const renderListVariantsItem = (itemData) => {
        return (
            <VariantListItem
                productType={productType}
                variantId={itemData.id}
                key={itemData.id}
                variant={itemData.variant}
                sousvariants={itemData.sousvariants}
                onDeleteVariant={removeVariantHandler}
                onDeleteSousVariant={removeSousVariantHandler}
                addOption={addOptionHandler}

            />
        );
    };


    const renderOptionsListItem = (itemData) => {
        return (
            <OptionListItem
                //key={itemData.item.join('')}
                handlePriceChange={_handlePriceChange}
                handleStockChange={_handleStockChange}
                handleisChecked={_handleisChecked}
                name={itemData.item.nameCombination}
                price={itemData.item.price}
                stock={itemData.item.stock}
                idCombination={itemData.item.id}

            />
        );
    };
    const _handleisChecked = (idCombination) => {
        const _indexPricingItem = allSousVariantsCombinaisons.findIndex(item => { return item.id === idCombination });
        if (_indexPricingItem >= 0) {
            const _allSousVariantsCombinaisons = [...allSousVariantsCombinaisons];
            let _pricingItem = { ...allSousVariantsCombinaisons[_indexPricingItem] }
            _pricingItem.isActive = !_pricingItem.isActive;
            _allSousVariantsCombinaisons.splice(_indexPricingItem, 1);
            _allSousVariantsCombinaisons.push(_pricingItem);
            setSousVariantsCombinaisons(_allSousVariantsCombinaisons);
        }

    }

    const _handleStockChange = (text, idCombination) => {
        const _indexPricingItem = allSousVariantsCombinaisons.findIndex(item => { return item.id === idCombination });
        if (_indexPricingItem >= 0) {
            const _allSousVariantsCombinaisons = [...allSousVariantsCombinaisons];
            let _pricingItem = { ...allSousVariantsCombinaisons[_indexPricingItem] }
            _pricingItem.stock = text;
            _allSousVariantsCombinaisons.splice(_indexPricingItem, 1);
            _allSousVariantsCombinaisons.push(_pricingItem);
            setSousVariantsCombinaisons(_allSousVariantsCombinaisons);

        }

    }
    const _handlePriceChange = (text, idCombination) => {
        const _indexPricingItem = allSousVariantsCombinaisons.findIndex(item => { return item.id === idCombination });
        if (_indexPricingItem >= 0) {
            const _allSousVariantsCombinaisons = [...allSousVariantsCombinaisons];
            let _pricingItem = { ...allSousVariantsCombinaisons[_indexPricingItem] }
            _pricingItem.price = text;
            _allSousVariantsCombinaisons.splice(_indexPricingItem, 1);
            _allSousVariantsCombinaisons.push(_pricingItem);
            setSousVariantsCombinaisons(_allSousVariantsCombinaisons);
        }

    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setSelectedImages(
                [...selectedImages, { id: (selectedImages.length + 1).toString(), uri: result.uri }]
            );
        }
        console.log(selectedImages.length);
    };
    const addSousVariantHandler = () => {
        if (productType == "food") {
            const _food_variants = [...foodVariants];
            const index_foodVariant = _food_variants.findIndex(variant => { return variant.id == sousVariant.id_Variant });
            if (index_foodVariant >= 0) {
                _food_variants[index_foodVariant].sousvariants.push({ sousvariant: sousVariant.sousvariant, id: guidGenerator() });
                setFoodVariants(_food_variants);
                setSousVariant({ ...sousVariant, sousvariant: "" })
            }

        }
        else {
            const _variants = [...variantsInputs];
            const index = _variants.findIndex(variant => { return variant.id == sousVariant.id_Variant });
            if (index >= 0) {
                _variants[index].sousvariants.push({ sousvariant: sousVariant.sousvariant, id: guidGenerator() });
                setVariantsInputs(_variants);
                setSousVariant({ ...sousVariant, sousvariant: "" })
            }
            setModalSousVariantVisible(!ModalSousVariantVisible);
        }
    }
    const renderImageItem = (itemData) => {
        return (
            <View style={styles.imageChooseContainer}>
                <Image
                    style={styles.image}
                    source={{ uri: itemData.item.uri }}
                />
            </View>
        );
    };


    const discountChangeHandler = () => {
        setValueDiscount((prevState) => !prevState);
        if (!valueDiscount) {
            setModalDiscountVisible(true);
        }
        if (valueDiscount) {
            setNewPrice();
        }
    };

    const discountPourcentageHandler = () => {
        const rate = pourcentage / 100;
        const remiseValue = rate * formState.inputValues.price;
        setNewPrice((parseFloat(formState.inputValues.price) - remiseValue).toString());
        setPourcentage('');
        setModalDiscountVisible(!modalDiscountVisible);
    };

    const submitHandler = useCallback(() => {
        if (productType == "regular") {



            if (!formState.formIsValid || selectedImages.length === 0 || variantsInputs.length === 0) {
                setImagesTouched(true);
                setVariantsTouched(true);
                Alert.alert('Wrong input!', 'Please check the errors in the form.', [{ text: 'Okay' }
                ]);
                return;
            }

            else {
                // where you find title,description, productType, price, weight values
                let _variants = []
                let pricing = []

                variantsInputs.map(v => {
                    let _variant = {
                        name: v.variant,
                        options: v.sousvariants.map(sv => { return { name: sv.sousvariant } })
                    }
                    _variants.push(_variant);
                })

                const product = {
                    basePrice: formState.inputValues.price,
                    discount: pourcentage,
                    description: formState.inputValues.description,
                    partner: context.user._id,
                    weight: formState.inputValues.weight,
                    type: productType.toLowerCase(),
                    gendre: gender ? gender.toLowerCase() : "",
                    name: formState.inputValues.title,
                    pricing: allSousVariantsCombinaisons
                }


                const fd = new FormData();

                selectedImages.forEach(image => {
                    fd.append('productImages', { type: 'image/png', uri: image.uri, name: 'upload.png' });
                })
                fd.append('product', JSON.stringify({ ...product }));
                fd.append('variants', JSON.stringify([..._variants]));
                fd.append('category', category);

                addProduct(context.partner._id, fd).then(message => {
                    Alert.alert('Operation Done', message, [{ text: 'Okay' }]);

                })

            }
        }

        else {
            if (!formState.formIsValid || selectedImages.length === 0 || foodVariants.length === 0) {
                setImagesTouched(true);
                setVariantsTouched(true);
                Alert.alert('Wrong input!', 'Please check the errors in the form.', [{ text: 'Okay' }
                ]);
                return;
            }

            else {
                // where you find title,description, productType, price, weight values
                let _variants = []
                let pricing = []

                variantsInputs.map(v => {
                    let _variant = {
                        name: v.variant,
                        options: v.sousvariants.map(sv => { return { name: sv.sousvariant } })
                    }
                    _variants.push(_variant);
                })

                const product = {
                    basePrice: formState.inputValues.price,
                    discount: valueDiscount,
                    description: formState.inputValues.description,
                    partner: context.user._id,
                    weight: formState.inputValues.weight,
                    type: productType.toLowerCase(),
                    gender: gender.toLowerCase(),
                    name: formState.inputValues.title,
                    pricing: allSousVariantsCombinaisons
                }

                const fd = new FormData();
                console.log(product);
                selectedImages.forEach(image => {
                    fd.append('productImages', { type: 'image/png', uri: image.uri, name: 'upload.png' });
                })
                fd.append('product', JSON.stringify({ ...product }));
                fd.append('variants', JSON.stringify([..._variants]));
                fd.append('category', category);

                // addProduct(context.partner._id,fd).then(message=>{
                //     console.log(message);
                // })

            }
        }



    }, [formState, selectedImages, variantsInputs]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={styles.menu}>
                    <View style={styles.leftArrowContainer}>
                        <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={styles.leftArrow}>
                            <Image style={{ width: "100%", height: "100%", marginLeft: 4 }} source={require("../../assets/left-arrow.png")} />

                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleContainerMenu}>
                        <Text style={styles.TitleMenu}>add Product</Text>
                    </View>


                </View>
                <View style={styles.mainContainer}>
                    <ScrollView>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titreStyle}>Title</Text>
                            <View style={styles.titleInputContainer}>
                                <TextInput
                                    style={styles.inputTitle}
                                    placeholder="your product title"
                                    placeholderTextColor={Colors.placeholder}
                                    value={formState.inputValues.title}
                                    onChangeText={textChangeHandler.bind(this, 'title')}
                                    onBlur={lostFocusHandler.bind(this, 'title')}
                                />
                                {!formState.inputValidities.title && titleTouched && <Text style={styles.errorMessage}>Please enter a title!</Text>}
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
                                    value={formState.inputValues.description}
                                    onChangeText={textChangeHandler.bind(this, 'description')}
                                    onBlur={lostFocusHandler.bind(this, 'description')}
                                />
                                {!formState.inputValidities.description && descriptionTouched && <Text style={styles.errorMessage}>Please enter a description!</Text>}
                            </View>
                        </View>

                        {productType != "food" && <View style={styles.genderContainer}>
                            <Text style={styles.titreStyle} >Gender</Text>
                            <View style={styles.genderPickerContainer}>
                                <Picker
                                    selectedValue={gender}
                                    onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                                    mode="dropdown"
                                >

                                    <Picker.Item label="men" value="Men" />
                                    <Picker.Item label="women" value="Women" />
                                    <Picker.Item label="kids" value="Kids" />
                                </Picker>
                            </View>

                        </View>
                        }
                        <View style={styles.CategoryContainer}>
                            <Text style={styles.titreStyle} >Category</Text>

                            <View style={styles.addCAtegoryContainer}>
                                <TouchableOpacity onPress={()=>{setModelCategoryVisible(!modalCategoryVisible)}} style={{width:10,height:10}}>
                                    <Image
                                        style={{resizeMode:'cover',width:30,height:30}}
                                        source={require('../../assets/images/add.png')}
                                    />                                
                                    </TouchableOpacity>
                            </View>
                            <View style={styles.genderPickerContainer}>
                                <Picker
                                    selectedValue={category}

                                    onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                                    mode="dropdown"
                                >
                                    {
                                        categories &&
                                        categories.map((_category, index) => (
                                            <Picker.Item key={index} label={_category.name} value={_category._id} />
                                        ))

                                    }
                                </Picker>

                            </View>

                        </View>
                        <View style={styles.imagesContainer}>
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
                                        paddingVertical: Dimensions.get('window').height * 0.01,//8 
                                        paddingRight: Dimensions.get('window').width * 0.02,//8 
                                        //backgroundColor:'yellow'
                                    }}
                                    data={selectedImages}
                                    renderItem={renderImageItem}
                                    horizontal={true}
                                />
                            </View>
                            {imagesTouched && selectedImages.length === 0 && <Text style={styles.errorMessage}>Please select minumum an image for the product</Text>}
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
                                        value={formState.inputValues.price}
                                        onChangeText={textChangeHandler.bind(this, 'price')}
                                        onBlur={lostFocusHandler.bind(this, 'price')}
                                    />
                                </View>

                                <View style={styles.discountContainer}>
                                    <View style={styles.radioButtonItem}>
                                    <TouchableOpacity onPress={() => {setModalDiscountVisible(!modalDiscountVisible)}}>
                                    <Image style={{ width: 20, height: 20, resizeMode: "cover", marginHorizontal: 6 }} source={modalDiscountVisible  ? require("../../assets/radio_checked.png"):require("../../assets/radio_unchecked.png")} />
                                </TouchableOpacity>
                               
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
                                                    //onBlur={lostFocusHandler.bind(this,)}
                                                    />
                                                </View>
                                                <View style={styles.modalButtonsContainer}>

                                                    <TouchableHighlight
                                                        style={{ ...styles.modalButton, backgroundColor: '#2196F3' }}
                                                        onPress={discountPourcentageHandler}>
                                                        <Text style={styles.textStyle}>Ok</Text>
                                                    </TouchableHighlight>

                                                    <TouchableHighlight
                                                        style={{ ...styles.openButton, backgroundColor: '#fa382a' }}
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
                            {
                                formState.inputValidities.price && newPrice && (<View style={styles.priceDiscountContainer}>
                                    <View style={styles.priceContainer}>
                                        <Text>New Price</Text>
                                        <TextInput
                                            style={styles.inputPrice}
                                            placeholder="new price after discount"
                                            placeholderTextColor={Colors.placeholder}
                                            editable={false}
                                            value={newPrice}
                                        />
                                    </View>
                                    <View style={styles.discountContainer}>
                                    </View>
                                </View>)
                            }
                            {!formState.inputValidities.price && priceTouched && <Text style={styles.errorMessage}>Please enter a price !</Text>}
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
                                        value={formState.inputValues.weight}
                                        onChangeText={textChangeHandler.bind(this, 'weight')}
                                        onBlur={lostFocusHandler.bind(this, 'weight')}
                                    />
                                    <View style={styles.unitPickerContainer}>
                                        <Picker
                                            selectedValue={weightUnit}
                                            onValueChange={(itemValue, itemIndex) => setWeightUnit(itemValue)}
                                            mode="dropdown"
                                        >
                                            <Picker.Item label="g" value="g" />
                                            <Picker.Item label="kg" value="kg" />
                                        </Picker>
                                    </View>
                                </View>
                                {!formState.inputValidities.weight && weightTouched && <Text style={styles.errorMessage}>Please enter a weight !</Text>}
                            </View>
                        </View>
                        <View style={styles.variantsContainer}>
                            <View style={styles.variantsTitleContainer}>
                                <Text style={styles.titreStyle}>Variants</Text>
                            </View >

                            <View style={styles.listVariantsContainer}>
                                {
                                    productType == "regular" ? variantsInputs.map((variant) => renderListVariantsItem(variant))
                                        : foodVariants.map((variant) => renderListVariantsItem(variant))
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
                                                style={{ ...styles.modalButton, backgroundColor: '#2196F3' }}
                                                onPress={addVariantHandler}>
                                                <Text style={styles.textStyle}>Save</Text>
                                            </TouchableHighlight>

                                            <TouchableHighlight
                                                style={{ ...styles.openButton, backgroundColor: '#fa382a' }}
                                                onPress={() => {
                                                    setModalVariantsVisible(!modalVariantsVisible);
                                                }}>
                                                <Text style={styles.textStyle}>Close</Text>
                                            </TouchableHighlight>

                                        </View>

                                    </View>
                                </View>

                            </Modal>

                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalCategoryVisible}
                            >
                                <View style={styles.centeredViewModal}>
                                    <View style={styles.modalContainer}>
                                        <View style={styles.variantInputTitleContainer}>
                                            <Text>Category</Text>
                                        </View>
                                        <View style={styles.variantInputContainer}>
                                            <TextInput
                                                style={styles.inputVariant}
                                                placeholder="your category name"
                                                placeholderTextColor={Colors.placeholder}
                                                value={nameCategory}
                                                onChangeText={text => setNameCategory(text)}
                                            //onBlur={lostFocusHandler}
                                            />
                                        </View>

                                      
                                        <View style={styles.modalButtonsContainer}>

                                            <TouchableHighlight
                                                style={{ ...styles.modalButton, backgroundColor: '#2196F3' }}
                                                onPress={addNewCategory}>
                                                <Text style={styles.textStyle}>Save</Text>
                                            </TouchableHighlight>

                                            <TouchableHighlight
                                                style={{ ...styles.openButton, backgroundColor: '#fa382a' }}
                                                onPress={() => {
                                                    setModelCategoryVisible(!modalCategoryVisible);
                                                }}>
                                                <Text style={styles.textStyle}>Close</Text>
                                            </TouchableHighlight>

                                        </View>

                                    </View>
                                </View>

                            </Modal>

                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={ModalSousVariantVisible}
                            >
                                <View style={styles.centeredViewModal}>
                                    <View style={styles.modalContainer}>
                                        <View style={styles.variantInputTitleContainer}>
                                            <Text>option</Text>
                                        </View>
                                        <View style={styles.variantInputContainer}>
                                            <TextInput
                                                style={styles.inputVariant}
                                                placeholder="option"
                                                placeholderTextColor={Colors.placeholder}
                                                value={sousVariant.sousvariant}
                                                onChangeText={(text) => { setSousVariant({ ...sousVariant, sousvariant: text }) }}
                                            //onBlur={lostFocusHandler}

                                            />
                                        </View>


                                        <View style={styles.modalButtonsContainer}>

                                            <TouchableHighlight
                                                style={{ ...styles.modalButton, backgroundColor: '#2196F3' }}
                                                onPress={addSousVariantHandler}>
                                                <Text style={styles.textStyle}>Save</Text>
                                            </TouchableHighlight>

                                            <TouchableHighlight
                                                style={{ ...styles.openButton, backgroundColor: '#fa382a' }}
                                                onPress={() => { setModalSousVariantVisible(!ModalSousVariantVisible) }}>
                                                <Text style={styles.textStyle}>Close</Text>
                                            </TouchableHighlight>

                                        </View>

                                    </View>
                                </View>

                            </Modal>



                            {productType == "regular" && <View style={styles.addOtherOptionContainer}>
                                <TouchableOpacity onPress={() => {
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
                            }
                            {variantsTouched && variantsInputs.length === 0 && <Text style={styles.errorMessage}>Please select a variant</Text>}
                            <View
                                style={{
                                    borderBottomColor: '#d8d8d8',
                                    borderBottomWidth: 1,
                                    marginLeft: 5,
                                    marginRight: 5,
                                    marginTop: 5,
                                    marginBottom: 5
                                }}
                            />

                            {allSousVariantsCombinaisons.length !== 0 ? (<View style={styles.options}>
                                <View style={styles.textOptionContainer}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Options</Text>
                                </View>
                                <View style={styles.tableTitlesContainer}>
                                    <View style={styles.variantsTitleTextContainer}>
                                        <Text style={{ fontSize: 16 }}>Variants</Text>
                                    </View>
                                    <View style={styles.priceTitleTextContainer}>
                                        <Text style={{ fontSize: 16 }}>Price</Text>
                                    </View>
                                    <View style={styles.stockTitleTextContainer} >
                                        <Text style={{ fontSize: 16 }}>Stock</Text>
                                    </View>
                                </View>
                                <View style={styles.listOptionsContainer}>
                                    <FlatList
                                        nestedScrollEnabled
                                        data={allSousVariantsCombinaisons}
                                        renderItem={renderOptionsListItem}
                                        keyExtractor={(item, index) => item.id}
                                    />
                                </View>

                            </View>) : null
                            }

                        </View>
                        <MyButton style={{ ...styles.buttonSubmitStyle, backgroundColor: '#C3C3C3' }}>Save as draft</MyButton>
                        <MyButton
                            style={{ ...styles.buttonSubmitStyle, backgroundColor: Colors.primary }}
                            onPress={submitHandler}
                        //disabled={!formState.formIsValid || selectedImages.length===0 || variantsInputs.length===0}
                        >publish</MyButton>

                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    menu: {
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        flexDirection: "row",
    },
    menuDark: {
        width: "100%",
        height: "8%",
        backgroundColor: "#121212",
        flexDirection: "row",

    },
    leftArrowContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    leftArrow: {
        width: 30,
        height: 30
    },

    titleContainerMenu: {
        width: "80%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    TitleMenu: {
        fontWeight: "700",
        fontSize: 28
    },
    searchContainer: {
        width: "10%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },

    TitleDark: {
        fontWeight: "700",
        fontSize: 28,
        color: "white"

    },

    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        //backgroundColor:'red',
        marginTop: Dimensions.get('window').height * 0.04, //30
        padding: Dimensions.get('window').height * 0.012 //10
        //alignItems: 'center',  //crossAxisAlign
        //justifyContent: 'center' //mainAxisAlign
    },
    titleContainer: {
        //backgroundColor:'blue',
    },
    titleInputContainer: {
        //backgroundColor:'purple',
        flex: 1,
    },
    inputTitle: {
        flexDirection: 'row',
        flex: 1,
        height: Dimensions.get('window').height * 0.065,//60
        backgroundColor: 'white',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8
    },
    titreStyle: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    descriptionContainer: {
        //backgroundColor:'green',
        flex: 1,
        marginVertical: 2
    },
    descriptionInputContainer: {
        //backgroundColor:'blue',
    },
    inputDescription: {
        flex: 1,
        height: Dimensions.get('window').height * 0.103,//80
        backgroundColor: 'white',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
    },

    genderContainer: {
        //backgroundColor:'#fa382a'
    },
    CategoryContainer: {
        //backgroundColor:'#fa382a'
    },
    genderPickerContainer: {
        flex: 1,
        backgroundColor: 'white'
    },

    imagesContainer: {
        backgroundColor: 'white',
        //backgroundColor:'#fa382a',
        //height: 220,
        marginVertical: 5
    },
    imagesInputContainer: {
        //backgroundColor:'purple',
        flex: 1,
        height: Dimensions.get('window').height * 0.2283,//177
        margin: 10,
        flexDirection: 'row-reverse',
        alignItems: 'flex-end'
    },

    buttonAddContainer: {
        backgroundColor: 'white',
        height: '89%',
        width: '22%',
        marginBottom: Dimensions.get('window').height * 0.01, //8
        marginLeft: 2,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 5,
        elevation: 10
    },
    imageChooseContainer: {
        //backgroundColor:'#fa382a',
        width: Dimensions.get('window').width * 0.206,//80
        height: Dimensions.get('window').height * 0.2009,//156
        marginLeft: Dimensions.get('window').width * 0.02, //8
        borderRadius: 13,
        elevation: 10
    },
    image: {
        flex: 1,
        resizeMode: 'stretch',
        borderRadius: 13,
        //backgroundColor:'green'
    },




    pricingContainer: {
        backgroundColor: 'white',
        //backgroundColor:'yellow',
        //flex:2,
        marginVertical: 3,
        paddingHorizontal: 3
    },
    priceDiscountContainer: {
        //backgroundColor:'red',
        flex: 1,
        flexDirection: 'row'
    },
    priceContainer: {
        //backgroundColor:'blue',
        flex: 2
    },
    inputPrice: {
        //backgroundColor:'#fa382a',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        marginHorizontal: Dimensions.get('window').width * 0.0248,//10
        paddingHorizontal: 3
    },
    discountContainer: {
        //backgroundColor:'yellow',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    radioButtonItem: {
        //backgroundColor:'red',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },

    weightContainer: {
        backgroundColor: 'white',
        flex: 1.5,
        marginTop: 3,
        paddingHorizontal: 3
    },
    inputWeightContainer: {
        //backgroundColor:'orange',
        flex: 1,
    },
    weightInputsContainer: {
        //backgroundColor:'blue',
        flex: 1,
        flexDirection: 'row',
        marginBottom: 3
    },
    inputWeight: {
        //backgroundColor:'yellow',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        flex: 4
    },
    unitPickerContainer: {
        //backgroundColor:'brown',
        justifyContent: 'center',
        height: Dimensions.get('window').height * 0.0455, //35
        width: Dimensions.get('window').width * 0.216
    },
    addCAtegoryContainer: {
        //backgroundColor:'brown',
        
        justifyContent: 'flex-start',
        height: Dimensions.get('window').height * 0.08, //35
        width: Dimensions.get('window').width * 0.216
    },

    variantsContainer: {
        backgroundColor: 'white',
        //backgroundColor:'brown',
        flex: 6,
        //height: 220,
        marginTop: 8,
        marginBottom: 10,
        paddingHorizontal: 3
    },
    variantsTitleContainer: {
        //backgroundColor:'green',
        flex: 1,
    },

    listVariantsContainer: {
        //backgroundColor:'yellow',
        flex: 1
    },
    addOtherOptionContainer: {
        //backgroundColor:'purple',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1
    },
    touchableContainer: {
        //backgroundColor:'red',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    imageAddOtherOptionContainer: {
        //backgroundColor:'green',
    },
    textAddOtherOptionContainer: {
        //backgroundColor:'blue',
        marginHorizontal: Dimensions.get('window').width * 0.025, //10
        justifyContent: 'center'
    },
    imageAddOtherOption: {
        //backgroundColor:'orange',
        height: Dimensions.get('window').height * 0.07,//45
        width: Dimensions.get('window').width * 0.125//45
    },
    addOtherOptionTextStyle: {
        fontSize: 19,
        color: '#0862ef'
    },

    centeredViewModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center'
    },
    modalContainer: {
        margin: Dimensions.get('window').height * 0.0255, //20
        backgroundColor: 'white',
        borderRadius: Dimensions.get('window').height * 0.0255, //20
        padding: Dimensions.get('window').height * 0.0256, //20
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    variantInputTitleContainer: {
        //backgroundColor:'blue',
        //height:'10%'
    },
    variantInputContainer: {
        //backgroundColor:'yellow',
        marginBottom: 5
    },
    inputVariant: {
        backgroundColor: 'white',
        borderColor: Colors.placeholder,
        borderWidth: 1,
        borderRadius: 10,
        height: Dimensions.get('window').height * 0.075, //60
        paddingHorizontal: 8
    },
    modalButton: {
        borderRadius: Dimensions.get('window').height * 0.0255, //20
        padding: Dimensions.get('window').height * 0.013, //10
        marginVertical: Dimensions.get('window').height * 0.013,//10
        elevation: 2,
    },
    openButton: {
        borderRadius: Dimensions.get('window').height * 0.0255,
        padding: Dimensions.get('window').height * 0.013,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },


    options: {
        //backgroundColor:'#fa382a',
        height: Dimensions.get('window').height * 0.388, //300
        padding: Dimensions.get('window').height * 0.013,//10
    },
    textOptionContainer: {
        //backgroundColor:'green',
        flex: 1,
        marginBottom: Dimensions.get('window').height * 0.0255 //20
    },
    tableTitlesContainer: {
        //backgroundColor:'green',
        flex: 1,
        flexDirection: 'row',
    },
    variantsTitleTextContainer: {
        //backgroundColor:'#fa382a',
        flex: 1.15,
        //alignItems:'center'
    },
    priceTitleTextContainer: {
        //backgroundColor:'brown',
        flex: 1.8,
        alignItems: 'center'
    },
    stockTitleTextContainer: {
        //backgroundColor:'orange',
        flex: 1.8,
        paddingHorizontal: Dimensions.get('window').width * 0.025, //10
    },
    listOptionsContainer: {
        //backgroundColor:'purple',
        flex: 10
    },
    buttonSubmitStyle: {
        margin: 8,
        height: 60,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Dimensions.get('window').height * 0.0255 //20
    },
    errorMessage: {
        color: 'red',
        fontWeight: "bold",
        fontSize: 13
    }

});

export default AddProductScreen;