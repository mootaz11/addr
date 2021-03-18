import React, { useState } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {Title,Switch,Drawer} from 'react-native-paper';
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
                                <Image style={styles.LogoApp} source={context.user ? context.user.photo ? { uri: context.user.photo }: require('../assets/user_image.png'):require('../assets/user_image.png')} />
                                <Title style={styles.title}>{context.partner ? context.partner.name :  context.user.firstName + " " + context.user.lastName}</Title>
                            </View>
                        </TouchableOpacity>
                    </View>
         {(context.user.isPartner || context.user.isVendor )&&context.partner ?
                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem icon={({ color, size }) => (
                            <Image source={require("../assets/menu/dashboard.png")} style={{width:size,height:size}}/>
                        )}
                            labelStyle={{ color: "white"}}
                            label="Dashboard"
                            onPress={() => {
                                if(context.partner.deliverers.findIndex(del=>{return del===context.user._id})>=0){
                                    props.navigation.navigate("deliveryDash")       
                                 }
                                else 
                                {
                                    props.navigation.navigate("businessDash")
                            
                                }


                                }}
                        />



                        {   context.user.isPartner && context.partner ? 
                                <DrawerItem  
                                icon={({ color, size }) => (
                                    <Image source={require("../assets/menu/next.png")} style={{marginLeft:20,width:size,height:size}}/>
        
                                )}
                                labelStyle={{ color: "white" }}
    
                                label="products"
                                onPress={() => { props.navigation.navigate("listProducts") }}
                            />
                            :null}

{   context.user.isPartner  ? 

                          <DrawerItem  
                                icon={({ color, size }) => (
                                    <Image source={require("../assets/menu/next.png")} style={{marginLeft:20,width:size,height:size}}/>
        
                                )}

labelStyle={{ color: "white" }}
                                label="follow packages"
                            onPress={() => { props.navigation.navigate("followPackages") }}
                        />
                                :null}
                                {   context.user.isPartner  ? 

<DrawerItem  
      icon={({ color, size }) => (
          <Image source={require("../assets/menu/next.png")} style={{marginLeft:20,width:size,height:size}}/>

      )}

labelStyle={{ color: "white" }}
      label="partner orders"
  onPress={() => { props.navigation.navigate("businessorders") }}
/>
      :null}
                        
                        
                    </Drawer.Section>:
                    null
    }         
                   
                   
                   
                    <Drawer.Section style={styles.drawerSection} >
                        
                            <DrawerItem  icon={({ color, size }) => (
                                <Image source={require("../assets/menu/home.png")} style={{width:size,height:size}}/>
    
                            )}
                                labelStyle={{ color: "white" }}
    
                                label="Home"
                                onPress={() => { 
                                    props.navigation.navigate("Home",{activation:"activation"}) 
                                }}
                            />
                      
                        

                    </Drawer.Section>
               
{
    !context.partner ? 
<Drawer.Section style={styles.drawerSection} >
                        <DrawerItem icon={({ color, size }) => (
                            <Image source={require("../assets/menu/chat.png")} style={{width:size,height:size}}/>

                        )}
                            labelStyle={{ color: "white" }}
                            label="Chat"
                            onPress={() => { props.navigation.navigate("chat") }}
                        />

                    </Drawer.Section>:null
}
                    

                    {
                    (context.user.isVendor && !context.partner   )&&
                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem icon={({ color, size }) => (
                            <Image source={require("../assets/menu/delivery.png")} style={{width:size,height:size}}/>

                        )} labelStyle={{ color: "white" }}

                            label="livraisons"
                            onPress={() => { props.navigation.navigate("deliveries") }}
                        />

                    </Drawer.Section>
    }
    {

        
        (!context.partner)&&
                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem icon={({ color, size }) => (
                            <Image source={require("../assets/menu/package.png")} style={{width:size,height:size}}/>

                        )} labelStyle={{ color: "white" }}
                            label={"Orders"}
                          onPress={() => {  props.navigation.navigate("orders") }} />
            
                    </Drawer.Section>}

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
                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem  labelStyle={{ color: "white" }}
                        icon={({ color, size }) => (
                            <Image source={require("../assets/menu/qr-code.png")} style={{width:size,height:size}}/>

                        )}
                            label={"Qr Scanner"}
                          onPress={() => {  props.navigation.navigate("qrscanner")  }} />
                   
                    </Drawer.Section>
                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem  labelStyle={{ color: "white" }}
                        icon={({ color, size }) => (
                            <Image source={require("../assets/menu/at.png")} style={{width:size,height:size}}/>

                        )}
                            label={"Contact us"}
                          onPress={() => {  props.navigation.navigate("contact")  }} />
                   
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
                        onPress={() => { context.logoutHandler(); props.navigation.navigate("Login")}}
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