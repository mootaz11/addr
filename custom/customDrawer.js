import React, {useState }from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title, Caption, Text, TouchableRipple, Switch, Drawer, Paragraph } from 'react-native-paper';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AuthContext from '../navigation/AuthContext';

export default function CustomDrawer(props) {
    const [isEnabled, setIsEnabled] = useState(false);
    const context = React.useContext(AuthContext);

    const toggleSwitch = () => {
        
        setIsEnabled(previousState => !previousState);
        context.modifyDarkModeHandler();

    }
    return (

        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate("Home") }}>
                        <View style={styles.logoAppSection}>
                            <Image style={styles.LogoApp} source={require("../assets/logo.png")} />
                            <Title style={styles.title}>Addresti</Title>
                        </View>
                    </TouchableOpacity>
                </View>

                <Drawer.Section style={styles.drawerSection} >
                    <DrawerItem icon={({ color, size }) => (
                        <Icon
                            name="home"
                            color={color}
                            size={size}
                        />
                    )}
                        label="Parametres"
                        onPress={() => { props.navigation.navigate("Settings") }}
                    />

                </Drawer.Section>
                <Drawer.Section style={styles.drawerSection} >
                    <DrawerItem icon={({ color, size }) => (
                        <Icon
                            name="account-circle"
                            color={color}
                            size={size}
                        />
                    )}
                        label="Chat"
                        onPress={() => { props.navigation.navigate("chat") }}
                    />

                </Drawer.Section>
                <Drawer.Section style={styles.drawerSection} >
                    <DrawerItem icon={({ color, size }) => (
                        <Icon
                            name="account-circle"
                            color={color}
                            size={size}
                        />
                    )}
                        label="livraisons"
                        onPress={() => { props.navigation.navigate("deliveries") }}
                    />

                </Drawer.Section>

                <Drawer.Section style={styles.drawerSection} >
                    <DrawerItem icon={({ color, size }) => (
                        <Icon
                            name="settings"
                            color={color}
                            size={size}
                        />
                    )}
                        label="Mes Commandes"
                        onPress={() => { props.navigation.navigate("orders") }} />
                </Drawer.Section>
                <Drawer.Section style={styles.drawerSection} >
                    <DrawerItem
                     label="Dark mode"

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
                        color={color}
                        size={size}
                    />
                )}
                    label="Logout"
                    onPress={() => { context.logoutHandler() }}
                />

            </Drawer.Section>
        </View>
    );
}
const styles = StyleSheet.create({

    drawerContent: {
        flex: 1,
    },
    logoAppSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "baseline"

    },
    LogoApp: {
        width: 30,
        height: 40,
        marginHorizontal: 10
    },

    title: {
        fontSize: 30,
        marginTop: 30,
        fontWeight: 'bold',
        color: '#24A9E1'
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
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    }




});
