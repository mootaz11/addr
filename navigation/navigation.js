import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../custom/Header';
import Chat from '../screens/ChatScreen';
import Home from '../screens/HomeScreen';
import Orders from '../screens/Orders';
import Conversation from '../screens/Conversation';
import Deliveries from '../screens/DeliveriesScreen'



const  chatStackNav= createStackNavigator();
const ordersStackNav = createStackNavigator();




//orders stack (commandes)
export const orderStack = () =>(
    <ordersStackNav.Navigator screenOptions={{
      headerShown: false
    }}>
    <ordersStackNav.Screen name="orders"  component={Orders}/>
    <ordersStackNav.Screen name="deliveries"  component={Deliveries}/>


  </ordersStackNav.Navigator>

)


//chat Stack Navigator
export const ChatStack=()=>(

   <chatStackNav.Navigator  screenOptions={{
    headerShown: false
  }}>
      <chatStackNav.Screen name="chat"  component={Chat}/>


    </chatStackNav.Navigator>
    )
    



//Termes de Services Stack : navigation 



//Home Stack Nav 
const HomeNavStack = createStackNavigator() ;
export const HomeStack  = ()=>(
    <HomeNavStack.Navigator  screenOptions={{
      headerShown: false
    }}>
        <HomeNavStack.Screen  name="Home"      
      
           component={Home} />
    </HomeNavStack.Navigator>
)





