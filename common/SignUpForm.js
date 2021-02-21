import React, { useReducer, useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Keyboard, Alert,Text,Image,Modal,TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { signup } from '../rest/userApi';
import Input from '../common/Input';
import SubmitButton from '../common/SubmitButton';
const FORM_RESET = 'FORM_RESET';

const blankForm = {
    inputValues: {
        username: '',
        email:'',
        password: '',
        repeatPassword: '',
        phone: '',
        firstName:'',
        lastName:'',
        floor:'',
        door:'',
    }, 
    inputValidities: {
        username: false,
        email: false,
        firstName:false,
        lastName:false,
        password: false,
        repeatPassword: false,
        phone: false,
    }, 
    formIsValid: false
  }


const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {

    if(action.type === FORM_INPUT_UPDATE){
        const updatedValues = {
            ...state.inputValues,
            [action.input] : action.value
        };

        const updatedValidities = {
            ...state.inputValidities,
            [action.input] : action.isValid
        };

        let updatedFormIsValid = true;

        for(const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            ...state,
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid
        };
    }
    else if (action.type === FORM_RESET) {
        return {
            ...blankForm,
            inputValues: {...blankForm.inputValues},
            inputValidities: {...blankForm.inputValidities},
        };
    }
    else {
        return state;
    }
};

const SignUpForm = (props) => {
    const [password, setPassword] = useState('');
    const [inHome, setInHome] = useState(false);
    const [inBuilding, setInbuilding] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [location, setLocation] = useState(null)
    const [formState, dispatchFormState] = useReducer(formReducer,blankForm);

    const handleUserAdress = async () => {
        setInHome(inHome => !inHome);

        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
        }
        else {
            const _location = await Location.getCurrentPositionAsync({});
            if (_location) {
                setLocation({
                    latitude: _location.coords.latitude,
                    longitude: _location.coords.longitude
                })
                setOpenModal(true);
            }

        }
    }
    const getPasswordHandler = (password) => {
        setPassword(password);
    };


    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });

    }, [dispatchFormState]);

    const saveAdress = () => {
        setOpenModal(false);
    }
    const handleChangeAddress = async (evt) => {
        let _location = evt.nativeEvent.coordinate;
        setLocation({
            latitude: _location.latitude,
            longitude: _location.longitude
        })
    }

    const signupHandler = () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
            return;
        }
        Keyboard.dismiss();
        signup({ ...formState.inputValues,location: { longitude: location ? location.longitude : null, latitude: location ? location.latitude : null }, locationState: location ? true : false }).then(
             message => {
                 Alert.alert('', "you have successfully signed up", [{ text: "OK" }],{cancelable:false})
            }).catch(err => { alert("error during signup")});
    };
    
    return (
        <View style={styles.formSignupContainerAll}>
            <View style={styles.formContainerSignup}>
                <ScrollView
                    style={styles.FormSignupListContainer}>
                    <View style={styles.listItem}>
                        <Input
                            inputId="username"
                            style={styles.input}
                            imageSrc={require("../assets/images/login.png")}
                            placeholder="username"
                            errorText="please enter a valid username"
                            onInputChange={inputChangeHandler}
                            required
                        />
                    </View>
                    <View style={styles.listItem}>
                        <Input
                            inputId="firstName"
                            style={styles.input}
                            imageSrc={require("../assets/images/login.png")}
                            placeholder="first name"
                            errorText="please enter a valid username"
                            onInputChange={inputChangeHandler}
                            required
                        />
                    </View>
                    <View style={styles.listItem}>
                        <Input
                            inputId="lastName"
                            style={styles.input}
                            imageSrc={require("../assets/images/login.png")}
                            placeholder="last name"
                            errorText="please enter a valid username"
                            onInputChange={inputChangeHandler}
                            required

                        />
                    </View>
                    <View style={styles.listItem}>
                        <Input
                            inputId="email"
                            style={styles.input}
                            imageSrc={require("../assets/images/email.png")}
                            placeholder="E_mail"
                            errorText="please enter a valid email"
                            autoCapitalize="none"
                            onInputChange={inputChangeHandler}
                            required
                            email
                        />
                    </View>
                    <View style={styles.listItem}>
                        <Input
                            inputId="password"
                            style={styles.input}
                            imageSrc={require("../assets/images/password.png")}
                            placeholder="password"
                            errorText="please enter a valid password"
                            onInputChange={inputChangeHandler}
                            required
                            secureTextEntry

                            onLostFocus={getPasswordHandler}
                        />
                    </View>
                    <View style={styles.listItem}>
                        <Input
                            inputId="repeatPassword"
                            secureTextEntry={true}
                            style={styles.input}
                            imageSrc={require("../assets/images/password.png")}
                            placeholder="repeat password"
                            errorText="please repeat your password"
                            onInputChange={inputChangeHandler}
                            required
                            repeatpw={password}
                        />
                    </View>
                    <View style={styles.listItem}>
                        <Input
                            inputId="phone"
                            style={styles.input}
                            imageSrc={require("../assets/images/phone.png")}
                            placeholder="phone"
                            errorText="please enter a valid phone"
                            multiline
                            numberOfLines={2}
                            keyboardType="number-pad"
                            onInputChange={inputChangeHandler}
                            required
                            minLength={8}
                            maxLength={8}
                        />
                    </View>
                    <View style={styles.listItem}>
                        <View style={{ width: "90%", height: 40, flexDirection:"row"}}>
                            <View style={styles.question}>
                                <Text style={{ fontSize: 15,color:"#2474f1",textAlign: "center" }}>you live in a Building ? </Text>
                            </View>
                            <View style={styles.answer}>
                                <Text style={{color:"#2474f1"}}>yes</Text>
                                <TouchableOpacity onPress={() => {setInbuilding(!inBuilding)}}>
                                    <Image style={{ width: 20, height: 20, resizeMode: "cover", marginHorizontal: 6 }} source={inBuilding ? require("../assets/radio_checked.png") : require("../assets/radio_unchecked.png")} />
                                </TouchableOpacity>
                                <Text style={{color:"#2474f1"}}>no</Text>
                                <TouchableOpacity onPress={() => { setInbuilding(!inBuilding) }}>
                                    <Image style={{ width: 20, height: 20, resizeMode: "cover", marginHorizontal: 6 }} source={inBuilding ? require("../assets/radio_unchecked.png") : require("../assets/radio_checked.png")} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.listItem}>
                    {
  inBuilding&&
  <Input
                            inputId="door"
                            style={styles.input}
                            imageSrc={require("../assets/images/home.png")}
                            placeholder="specify the door number"
                            errorText="please enter your address"
                            onInputChange={inputChangeHandler}
                            keyboardType="number-pad"

/>
}

</View>

                    <View style={styles.listItem}>
 {
inBuilding&&  
  <Input
                            inputId="floor"
                            style={styles.input}
                            imageSrc={require("../assets/images/home.png")}
                            placeholder="specify the floor number"
                            errorText="please enter your address"
                            onInputChange={inputChangeHandler}
                            keyboardType="number-pad"/>
 }
                            </View>

                    <View style={styles.listItem}>
                        <View style={styles.homeCheck}>
                            <View style={styles.question}>
                                <Text style={{ fontSize: 15,color:"#2474f1" ,textAlign: "center" }}>are you at home ? </Text>

                            </View>
                            <View style={styles.answer}>

                                <Text style={{color:"#2474f1"}}>yes</Text>
                                <TouchableOpacity onPress={handleUserAdress}>
                                    <Image style={{ width: 20, height: 20, resizeMode: "cover", marginHorizontal: 6 }} source={inHome ? require("../assets/radio_checked.png") : require("../assets/radio_unchecked.png")} />

                                </TouchableOpacity>

                                <Text style={{color:"#2474f1"}}>no</Text>
                                <TouchableOpacity onPress={() => { setInHome(inHome => !inHome) }}>
                                    <Image style={{ width: 20, height: 20, resizeMode: "cover", marginHorizontal: 6 }} source={inHome ? require("../assets/radio_unchecked.png") : require("../assets/radio_checked.png")} />

                                </TouchableOpacity>


                            </View>
                        </View>
                    </View>

                </ScrollView>
            </View>
            <View style={styles.submitSignUpButtonContainer}>
                <SubmitButton onPress={signupHandler}>Create account</SubmitButton>
            </View>


            <Modal
                animationType={"fade"}
                transparent={true}
                visible={openModal}>

                <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
                    <View style={{ backgroundColor: "#ffffff", margin: 40, flexDirection: "column", borderRadius: 10, height: Dimensions.get("window").height * 0.8, width: Dimensions.get("window").width * 0.9, alignSelf: "center" }}>
                        <View style={{ width: "100%", height: "80%" }}>
                            <MapView
                                initialRegion={{
                                    latitude: location ? Number(location.latitude) : 0,
                                    longitude: location ? Number(location.longitude) : 0
                                    ,latitudeDelta: 0.5,
                                    longitudeDelta: 0.5// * (Dimensions.get("window").width / Dimensions.get("window").height )
                          

                                }}

                                style={{ flex: 1, borderRadius: 10 }}
                                customMapStyle={darkStyle}
                                provider="google"
                            >
                                <Marker
                                    draggable={true}
                                    onDragEnd={(evt) => { handleChangeAddress(evt) }}
                                    coordinate={
                                        Platform.OS == 'ios' ?
                                            {
                                                latitude: location ? Number(location.latitude) : 0

                                                ,
                                                longitude: location ? Number(location.longitude) : 0

                                            } :
                                            {
                                                latitude: location ? Number(location.latitude) : 0

                                                ,
                                                longitude: location ? Number(location.longitude) : 0

                                            }



                                    }
                                >
                                    <Image source={require('../assets/logoAddresti.png')} style={{ height: 40, width: 40 }} />

                                </Marker>
                            </MapView>

                        </View>
                        <View style={{ width: "100%", height: "20%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity style={{ width: "50%", height: 50, }} onPress={() => { saveAdress() }}>

                                <View style={{ width: "100%", height: 50, backgroundColor: "#2474F1", borderRadius: 24, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "white", fontSize: Dimensions.get("window").width * 0.05 }}>save Address</Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    formSignupContainerAll: {
        flex: 1,
        alignItems: 'center',
    },
    formContainerSignup: {
        //flex:1,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        width: '87%',
        //height:'60%',
        paddingHorizontal: Dimensions.get('window').width * 0.03,


        marginTop: Dimensions.get('window').height * 0.11, //60


    },
    FormSignupListContainer: {
        marginVertical: Dimensions.get('window').height * 0.05, //42
        width: '90%'
    },

    listItem: {
        marginBottom: 12,
    },
    homeCheck: {
        height: "100%",
        width: "100%",
        flexDirection: "row"

    },
    BuildingCheck: {
        height: "60%",
        width: "100%",
        flexDirection: "row"

    },
    mapContainer: { flex: 1 },
    question: {
        width: "50%",
        height: "100%",

    },
    answer: {
        height: "100%",
        width: "50%",
        flexDirection: "row",
        justifyContent: "center"
    },
    input: {
        width: '90%',
        height: 30,
    },
    submitSignUpButtonContainer: {
        alignItems: 'center',
        width: '45%',
        position: 'absolute',
        bottom: '-5%',
        //zIndex: 2
        //backgroundColor: 'red'
    },
});

export default SignUpForm;
const darkStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];

