import React from 'react';
import { StyleSheet  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './custom/customDrawer'
import {ChatStack,orderStack} from './navigation/navigation';
import Login from './screens/LoginScreen';
import forgotPassword from './screens/forgotPassword';
import Home from './screens/HomeScreen';
import Settings from './screens/SettingsScreen';
import AppContext from './navigation/appContext'

export default function App() {
  const drawerStack = createDrawerNavigator();





    return (
      <AppContext>
      <NavigationContainer>
          <drawerStack.Navigator  drawerContent={props => <CustomDrawer {...props}/>}>
            <drawerStack.Screen name="Login" component={Login} />
            <drawerStack.Screen name="orders" component={orderStack}/>
            <drawerStack.Screen name="Settings" component={Settings}/>
            <drawerStack.Screen name="Home" component={Home} />
            <drawerStack.Screen name="chat" component={ChatStack} />
            <drawerStack.Screen name="logout"  component={Login}/>
            <drawerStack.Screen  name="forgotPassword" component={forgotPassword} />

          </drawerStack.Navigator>
        
      </NavigationContainer>
      </AppContext> 
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
