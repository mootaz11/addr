import React, { useContext,useState ,useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Chat from '../screens/ChatScreen';
import Home from '../screens/HomeScreen';
import Orders from '../screens/Orders';
import Conversation from '../screens/Conversation';
import AuthContext from '../navigation/AuthContext';
import { NavigationContainer,DarkTheme,DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../custom/customDrawer'
import Login from '../screens/LoginScreen';
import Settings from '../screens/SettingsScreen';
import Brand from '../screens/brandScreen';
import SingleBrand from '../screens/singleBrand';
import subCategory from '../screens/SubCategory';
import Products from '../screens/productsScreen';
import SingleProduct from '../screens/SingleProduct';
import bag from '../screens/bagScreen';
import deliveryAdress from '../screens/DeliveryAdress';
import orderReview from '../screens/orderReview';
import foodProduct from '../screens/FoodProduct';
import BusinessOrders from '../screens/business/BusinessOrders';
import BusinessDashboardScreen from '../screens/business/BusinessDashboardScreen';
import ListProductsScreen from '../screens/business/ListProductsScreen';
import DeliveryDashboardScreen from '../screens/business/DeliveryDashboardScreen';
import AddProductScreen from '../screens/business/AddProductScreen';
import followPackages from '../screens/business/followPackages';
import Basket from '../screens/BasketScreen';
import Contact from '../screens/contactScreen'
import qrScanner from '../screens/business/QrScanner';
import collecting from '../screens/business/CollectingDeliveries';
import delivering from '../screens/business/DeliveringOrders';
import debouItems from '../screens/business/DebouOrders';
import Notifications from '../screens/NotificationsScreen';



const drawerStack = createDrawerNavigator();
const  chatStackNav= createStackNavigator();


//chat Stack Navigator
 const ChatStack=()=>(

   <chatStackNav.Navigator  screenOptions={{
    headerShown: false
  }}>
      <chatStackNav.Screen name="chat"  component={Chat}/>


    </chatStackNav.Navigator>
    )
    


//Home Stack Nav 
const HomeNavStack = createStackNavigator() ;
 const HomeStack  = ()=>(
    <HomeNavStack.Navigator  screenOptions={{
      headerShown: false
    }}>
        <HomeNavStack.Screen  name="Home"      
      
           component={Home} />
    </HomeNavStack.Navigator>
)
export default function NavigationScreen(){
  const context = useContext(AuthContext)
  const [dark,setDark]=useState(context.darkMode);
  useEffect(()=>{
    setDark(context.darkMode);
  },[context.darkMode])


return(
<NavigationContainer  >
          <drawerStack.Navigator   drawerContent={props => <CustomDrawer  {...props}/>}>
            <drawerStack.Screen    options={{ swipeEnabled: false }}  name="Login" component={Login} />
            <drawerStack.Screen name="orders" component={Orders}/>
            <drawerStack.Screen name="collecting" component={collecting}/>
            <drawerStack.Screen name="delivering" component={delivering}/>
            <drawerStack.Screen name="Settings" component={Settings}/>
            <drawerStack.Screen name="Home" component={Home}/>
            <drawerStack.Screen name="chat" component={ChatStack}/>
            <drawerStack.Screen name="logout"  component={Login}/>
            <drawerStack.Screen name="conversation"  component={Conversation}/>
            <drawerStack.Screen name ="brand" component={Brand}/>
            <drawerStack.Screen name ="singleBrand" component={SingleBrand}/>
            <drawerStack.Screen name="subCategory" component={subCategory}/>
            <drawerStack.Screen name="products" component={Products}/>
            <drawerStack.Screen name="singleProduct" component={SingleProduct}/>
            <drawerStack.Screen name="bag" component={bag}/>
            <drawerStack.Screen name="deliveryAdress" component={deliveryAdress}/>
            <drawerStack.Screen name="orderReview" component={orderReview}/>
            <drawerStack.Screen name="food" component={foodProduct}/>
            <drawerStack.Screen name="basket" component={Basket}/>
            <drawerStack.Screen name="businessorders" component={BusinessOrders}/>
            <drawerStack.Screen name="businessDash" component={BusinessDashboardScreen}/>
            <drawerStack.Screen name="addProduct" component={AddProductScreen}/>
            <drawerStack.Screen name="listProducts" component={ListProductsScreen}/>
            <drawerStack.Screen name="deliveryDash" component={DeliveryDashboardScreen}/>
            <drawerStack.Screen name="followPackages" component={followPackages}/>
            <drawerStack.Screen name="contact" component={Contact}/>
            <drawerStack.Screen name="livraisons" component={qrScanner}/>
            <drawerStack.Screen name="debou" component={debouItems}/>
            <drawerStack.Screen name="notifications" component={Notifications}/>


          </drawerStack.Navigator>
      </NavigationContainer>
)
}