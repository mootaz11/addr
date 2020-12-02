import React, { useState } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title, Caption, Text, TouchableRipple, Switch, Drawer, Paragraph } from 'react-native-paper';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function CustomDrawer(props) {
    const [isEnabled, setIsEnabled] = useState(false);
    const context = React.useContext(AuthContext);


    const toggleSwitch = () => {

        setIsEnabled(previousState => !previousState);
        context.modifyDarkModeHandler();

    }
    if (context.user) {
        return (

            <View style={{ flex: 1, backgroundColor: "#2474F1" }}>
                <DrawerContentScrollView {...props}>
                    <View style={styles.drawerContent}>
                        <TouchableOpacity onPress={() => { props.navigation.navigate("Settings") }}>
                            <View style={styles.logoAppSection}>
                                <Image style={styles.LogoApp} source={context.user.photo ? { uri: context.user.photo }: require('../assets/user_image.png')} />
                                <Title style={styles.title}>{context.user.firstName + " " + context.user.lastName}</Title>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem icon={({ color, size }) => (
                            <Icon
                                name="dashboard"
                                color={"white"}
                                size={size}
                            />
                        )}
                            labelStyle={{ color: "white" }}

                            label="Dashboard"
                            onPress={() => { props.navigation.navigate("businessDash") }}
                        />
                        {   context.user.isPartner ? 
                                <DrawerItem  
                                labelStyle={{ color: "white" }}
    
                                label="products"
                                onPress={() => { props.navigation.navigate("listProducts") }}
                            />
                            :null
                        }
                        
                          <DrawerItem  
                            labelStyle={{ color: "white" }}

                            label="follow packages"
                            onPress={() => { props.navigation.navigate("followPackages") }}
                        />
                        {
                            context.user.isPartner ? 
                                  <DrawerItem  
                                  labelStyle={{ color: "white" }}
      
                                  label="add location"
                                  onPress={() => { props.navigation.navigate("addLocation") }}
                              />
                              :null
                        }
                        

                    </Drawer.Section>
                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem icon={({ color, size }) => (
                            <FontAwesome color={"white"} style={{ padding: 0, fontSize: 30, }} name="home" />

                        )}
                            labelStyle={{ color: "white" }}

                            label="Home"
                            onPress={() => { props.navigation.navigate("Home") }}
                        />

                    </Drawer.Section>
                    
                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem icon={({ color, size }) => (
                            <FontAwesome color={"white"} style={{ padding: 0, fontSize: 30, }} name="comments" />

                        )}
                            labelStyle={{ color: "white" }}
                            label="Chat"
                            onPress={() => { props.navigation.navigate("chat") }}
                        />

                    </Drawer.Section>
                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem icon={({ color, size }) => (
                            <FontAwesome color={"white"} style={{ padding: 0, fontSize: 30, }} name="truck" />

                        )} labelStyle={{ color: "white" }}

                            label="livraisons"
                            onPress={() => { props.navigation.navigate("deliveries") }}
                        />

                    </Drawer.Section>
                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem icon={({ color, size }) => (
                            <FontAwesome color={"white"} style={{ padding: 0, fontSize: 30, }} name="truck" />

                        )} labelStyle={{ color: "white" }}

                            label={"Orders"}
                          
                          onPress={() => { context.user.isPartner ? props.navigation.navigate("businessorders") : props.navigation.navigate("orders") }} />
                   
                    </Drawer.Section>
                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem
                            label="Dark mode"
                            labelStyle={{ color: "white" }}
                            icon={({ color, size }) => (
                                <Switch
                                    trackColor={{ false: "black", true: "white" }}
                                    thumbColor={isEnabled ? "black" : "white"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />)}

                        />
                    </Drawer.Section>

                </DrawerContentScrollView>
                <Drawer.Section style={styles.bottomDrawerSection} >
                    <DrawerItem icon={({ color, size }) => (
                        <Icon
                            name="exit-to-app"
                            color={"white"}
                            size={size}
                        />
                    )}

                        labelStyle={{ color: "white" }}

                        label="Logout"
                        onPress={() => { context.logoutHandler() }}
                    />

                </Drawer.Section>
            </View>
        );
    }
    else {
        return <View style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" />

        </View>
    }

}
const styles = StyleSheet.create({

    drawerContent: {
        flex: 1,
    },
    logoAppSection: {
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 20

    },
    LogoApp: {
        width: 30,
        height: 30,
        borderRadius: 30,
        marginHorizontal: 10,
        backgroundColor:"white"
    },

    title: {
        fontSize: 16,
        fontWeight: '400',
        color: 'white',
        letterSpacing: 0.2
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3
    },
    drawerSection: {
        marginTop: 5,
    },
    bottomDrawerSection: {
        marginBottom: 10,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    }




});