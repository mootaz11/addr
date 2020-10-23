import React,{useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from './navigation/authContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './custom/customDrawer'
import {ChatStack,orderStack} from './navigation/navigation';
import Login from './screens/LoginScreen';
import forgotPassword from './screens/forgotPassword';
import Home from './screens/HomeScreen';
import Settings from './screens/SettingsScreen';


export default function App() {
  const [loggedInuser,SetloggedInuser]=useState(false);
  
  const AuthStack = createStackNavigator();
  const drawerStack = createDrawerNavigator();
  
  const authContext = React.useMemo(() => {
    return {  
      userConnected:{name:"mootaz",lastname:"amara"},
      signIn: () => {
        SetloggedInuser(true)
      },
      signUp: () => {
        SetloggedInuser(false)
      },
      signOut: () => {
        SetloggedInuser(false)
      }
    };

  }
    , [])

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loggedInuser ? (
          
          <drawerStack.Navigator  drawerContent={props => <CustomDrawer {...props}/>}>
            <drawerStack.Screen name="orders" component={orderStack}/>
            <drawerStack.Screen name="Settings" component={Settings}/>
            <drawerStack.Screen name="Home" component={Home} />
            <drawerStack.Screen name="chat" component={ChatStack} />
            <drawerStack.Screen name="logout"  component={Login}/>
          </drawerStack.Navigator>

):
      <AuthStack.Navigator
      screenOptions={{
        headerShown: false
      }}
      >
        
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen  name="forgotPassword" component={forgotPassword} />
          </AuthStack.Navigator>}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
