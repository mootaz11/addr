import React, { useState } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Title, Switch, Drawer } from 'react-native-paper';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AuthContext from '../navigation/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Alert } from 'react-native';
import partner from '../common/Partner';



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
                        <TouchableOpacity onPress={() => {
                            if (context.partner) {
                                if(context.partner.delivery.cities.length==0&&context.partner.delivery.regions.length==0){
                                    if(context.partner.owner==context.user._id){
                                        props.navigation.navigate("businessDash");
                                    }
                                    if(context.partner.managers.length>0
                                        &&context.partner.managers.findIndex(manager=>{return manager.user == context.user._id})>=0&&
                                        context.partner.managers[context.partner.managers.findIndex(manager=>{return manager.user == context.user._id})].businessAccess.dashboard
                                    )
                                    {
                                        props.navigation.navigate("businessDash");
                                    }
                                    if(context.partner.managers.length>0
                                        &&context.partner.managers.findIndex(manager=>{return manager.user == context.user._id})>=0&&
                                        context.partner.managers[context.partner.managers.findIndex(manager=>{return manager.user == context.user._id})].businessAccess.products
                                    )
                                    {
                                        props.navigation.navigate("products");
                                    }

                                    
                                }
                                else {
                                    if(context.partner.owner==context.user._id){
                                        props.navigation.navigate("deliveryDash")
                                    }
                                    if(context.partner.managers.length>0 && context.partner.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
                                    && context.partner.managers[context.partner.managers.findIndex(manager => { return manager.user == context.user._id })].access.deliveryAccess.deposit)
                                        {
                                            props.navigation.navigate("debou")

                                        }


                                    if (context.partner.deliverers.length>0&&context.partner.deliverers.findIndex(del => { return del.user == context.user._id && del.type == "both" }) >= 0) { props.navigation.navigate("collecting") }
                                    if (context.partner.deliverers.length>0&&context.partner.deliverers.findIndex(del => { return del.user == context.user._id && del.type == "collect" }) >= 0) { props.navigation.navigate("collecting") }
                                    if (context.partner.deliverers.length>0&&context.partner.deliverers.findIndex(del => { return del.user == context.user._id && del.type == "delivery" }) >= 0) {
                                        props.navigation.navigate("livraisons", { last_screen: "delivery" })
                                    }
    
                                   
                                }
                            }
                            else {
                                props.navigation.navigate("Settings")
                            }

                        }}>
                            <View style={styles.logoAppSection}>
                                <Image style={styles.LogoApp} source={context.partner ? context.partner.profileImage ? { uri: context.partner.profileImage } : require('../assets/user_image.png') : context.user ? context.user.photo ? { uri: context.user.photo } : require('../assets/user_image.png') : require('../assets/user_image.png')} />
                                <Title style={styles.title}>{context.partner ? context.partner.partnerName : context.user ? context.user.firstName + " " + context.user.lastName : ""}</Title>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {(context.partner
                        && (context.partner.owner == context.user._id ||
                            (context.partner.managers.length>0&&context.partner.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
                                && context.partner.managers[context.partner.managers.findIndex(manager => { return manager.user == context.user._id })].access.businessAccess.dashboard == true
                            )
                        ))
                        ?
                        <Drawer.Section style={styles.drawerSection}>
                            <DrawerItem icon={({ color, size }) => (
                                <Image source={require("../assets/menu/dashboard.png")} style={{ width: size, height: size }} />
                            )}
                                labelStyle={{ color: "white" }}
                                label="Dashboard"
                                onPress={() => {
                                    if(context.partner.delivery.cities.length==0&&context.partner.delivery.regions.length==0){
                                        props.navigation.navigate("businessDash")
                                    }
                                    else 
                                    {
                                        props.navigation.navigate("deliveryDash")

                                    }
                                }}
                            />

                        </Drawer.Section> :
                        null
                    }


                    {
                        (context.partner
                            && (context.partner.owner == context.user._id || 
                                (context.partner.managers.length>0&&context.partner.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0&& (context.partner.delivery.regions.length == 0 && context.partner.delivery.cities.length == 0 )&&context.partner.managers.length>0
                                    && context.partner.managers[context.partner.managers.findIndex(manager => { return manager.user == context.user._id })].access.businessAccess.products == true
                                )
                            ))
                        &&
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image source={require("../assets/menu/next.png")} style={{ marginLeft: 20, width: size, height: size }} />
                            )}
                            labelStyle={{ color: "white" }}
                            label="products"
                            onPress={() => { props.navigation.navigate("listProducts") }}
                        />
                    }


                    {
                        (context.partner
                            && (context.partner.owner == context.user._id ||
                                ((context.partner.delivery.cities.length > 0 || context.partner.delivery.regions.length > 0)&&context.partner.managers.length>0 && context.partner.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
                                    && context.partner.managers[context.partner.managers.findIndex(manager => { return manager.user == context.user._id })].access.deliveryAccess.deposit
                                )
                            )) &&
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image source={require("../assets/menu/next.png")} style={{ marginLeft: 20, width: size, height: size }} />
                            )}
                            labelStyle={{ fontFamily: 'Poppins', color: "white" }}
                            label="Items Scanner"
                            onPress={() => {

                                props.navigation.navigate("livraisons", { last_screen: "debou_items" })

                            }}
                        />
                    }


                    {

(context.partner
    && (context.partner.owner == context.user._id ||
        ((context.partner.delivery.cities.length > 0 || context.partner.delivery.regions.length > 0) &&context.partner.managers.length>0 && context.partner.managers.findIndex(manager => { return manager.user == context.user._id }) >= 0
            && context.partner.managers[context.partner.managers.findIndex(manager => { return manager.user == context.user._id })].access.deliveryAccess.followDeliveries
        )
    )) &&

                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image source={require("../assets/menu/next.png")} style={{ marginLeft: 20, width: size, height: size }} />
                            )}
                            labelStyle={{ fontFamily: 'Poppins', color: "white" }}
                            label={ "follow packages"}

                            onPress={() => {
                               props.navigation.navigate("followPackages", { user: "partner" }) 
                            }}
                        />
                    }
                    {
                        context.user.isVendor && context.partner &&context.partner.deliverers.length>0&& context.partner.deliverers.findIndex(deliv => { return deliv.user == context.user._id }) >= 0 &&
                        <DrawerItem icon={({ color, size }) => (
                            <Image source={require("../assets/menu/next.png")} style={{ marginLeft: 20, width: size, height: size }} />
                        )} labelStyle={{ fontFamily: 'Poppins', color: "white" }}
                            label="livraisons"
                            onPress={() => {
                                if (context.partner.deliverers.findIndex(del => { return del.user == context.user._id && del.type == "both" }) >= 0) { props.navigation.navigate("collecting") }
                                if (context.partner.deliverers.findIndex(del => { return del.user == context.user._id && del.type == "collect" }) >= 0) { props.navigation.navigate("collecting") }
                                if (context.partner.deliverers.findIndex(del => { return del.user == context.user._id && del.type == "delivery" }) >= 0) {
                                    props.navigation.navigate("livraisons", { last_screen: "delivery" })
                                }
                            }}
                        />
                    }



                    {
                        
                        context.partner 
                        &&( 
                            ((context.partner.delivery.regions.length == 0 && context.partner.delivery.cities.length == 0 )
                   
                        &&  context.partner.managers.length>0 && context.partner.managers.findIndex(manager=>{return manager.user==context.user._id})>=0 &&
                        context.partner.managers[ context.partner.managers.findIndex(manager=>{return manager.user==context.user._id})].access.businessAccess.orders)
                            || context.partner.owner==context.user._id
                        )
                        
                        
                        &&

                         <DrawerItem
                            icon={({ color, size }) => (
                                <Image source={require("../assets/menu/next.png")} style={{ marginLeft: 20, width: size, height: size }} />
                            )}
                            labelStyle={{ fontFamily: 'Poppins', color: "white" }}
                            label="partner orders"
                            onPress={() => { props.navigation.navigate("businessorders") }}
                        />
                      }






                    {
                        !context.partner && <Drawer.Section style={styles.drawerSection} >
                            <DrawerItem icon={({ color, size }) => (
                                <Image source={require("../assets/menu/home.png")} style={{ width: size, height: size }} />
                            )}
                                labelStyle={{ fontFamily: 'Poppins', color: "white" }}

                                label="Home"
                                onPress={() => {
                                    props.navigation.navigate("Home", { activation: "activation" })
                                }}
                            />



                        </Drawer.Section>
                    }

                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem icon={({ color, size }) => (
                            <Image source={require("../assets/menu/notifications.png")} style={{ width: size, height: size }} />
                        )}
                            labelStyle={{ fontFamily: 'Poppins', color: "white" }}

                            label="Notifications"
                            onPress={() => {
                                props.navigation.navigate("notifications", { activation: "activation" })
                            }}
                        />



                    </Drawer.Section>


                    {
                       ( !context.partner || context.user.isVendor ||  (context.partner  &&(context.partner.delivery.regions.length == 0 && context.partner.delivery.cities.length == 0 )
                        && context.partner.managers.length>0 && context.partner.managers.findIndex(manager=>{return manager.user==context.user._id})>=0 &&
                        context.partner.managers[ context.partner.managers.findIndex(manager=>{return manager.user==context.user._id})].access.businessAccess.chat   
                        ))&&


  <Drawer.Section style={styles.drawerSection} >
  <DrawerItem icon={({ color, size }) => (
      <Image source={require("../assets/menu/chat.png")} style={{ width: size, height: size }} />
  )}

      labelStyle={{ fontFamily: 'Poppins', color: "white" }}
      label="Chat"
      onPress={() => { props.navigation.navigate("chat") }}
  />
</Drawer.Section>
                    }
                  



                    {


                        (!context.partner) &&
                        <Drawer.Section style={styles.drawerSection} >
                            <DrawerItem icon={({ color, size }) => (
                                <Image source={require("../assets/menu/package.png")} style={{ width: size, height: size }} />

                            )} labelStyle={{ fontFamily: 'Poppins', color: "white" }}
                                label={"Orders"}
                                onPress={() => { props.navigation.navigate("orders") }} />

                        </Drawer.Section>}

                    <Drawer.Section style={styles.drawerSection} >
                        <DrawerItem
                            label="Dark mode"
                            labelStyle={{ fontFamily: 'Poppins', color: "white" }}
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

                        <DrawerItem labelStyle={{ fontFamily: 'Poppins', color: "white" }}
                            icon={({ color, size }) => (
                                <Image source={require("../assets/menu/at.png")} style={{ width: size, height: size }} />

                            )}
                            label={"Contact us"}
                            onPress={() => { props.navigation.navigate("contact") }} />

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

                        labelStyle={{ fontFamily: 'Poppins', color: "white" }}

                        label="Logout"
                        onPress={() => { context.logoutHandler(); props.navigation.navigate("Login") }}
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
        backgroundColor: "white"
    },

    title: {
        fontSize: 16,
        fontFamily: 'Poppins',
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