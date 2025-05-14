import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { useContext } from 'react';
import { View } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { AuthContext } from "../providers/AuthProvider";

//Auth Screens
import BannerScreen from '../screens/BannerScreen';
import LocationScreen from '../screens/LocationScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

//Main Screens
import ActiveProScreen from '../screens/ActiveProScreen';
import AddProductScreen from '../screens/AddProductScreen';
import AddressForm from '../screens/AddressForm';
import AddressScreen from '../screens/AddressScreen';
import AllProducts from '../screens/AllProductsScreen';
import AllShops from '../screens/AllShopsScreen';
import BusinessInformationScreen from '../screens/BusinessInformationScreen';
import BuyerOrderDetailsScreen from '../screens/BuyerOrderDetailsScreen';
import BuyerOrderListScreen from '../screens/BuyerOrderListScreen';
import BuyerShopDashboardScreen from '../screens/BuyerShopDashboardScreen';
import CartScreen from '../screens/CartScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import ChatScreen from '../screens/ChatScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import HomeScreen from '../screens/HomeScreen';
import InformationProfile from '../screens/InformationProfile';
import MapScreen from '../screens/MapScreen';
import OrderDetailsScreen from '../screens/OrderDetails';
import OrderListScreen from '../screens/OrderListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductScreen from '../screens/ProductScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProScreen from '../screens/ProScreen';
import SelectPaymentScreen from '../screens/SelectPaymentScreen';
import SelectProScreen from '../screens/SelectProScreen';
import SellerRegistrationSuccessScreen from '../screens/SellerRegistrationSuccessScreen';
import SetUpShopScreen from '../screens/SetUpShopScreen';
import ShopDashboardScreen from '../screens/ShopDashboardScreen';
import ShopInformationScreen from '../screens/ShopInformationScreen';
import ShopScreen from '../screens/ShopScreen';
import TermsAndPoliciesScreen from '../screens/TermsAndPoliciesScreen';
import UpdateShopProfileScreen from '../screens/UpdateShopProfileScreen';
import VerificationNumScreen from '../screens/VerificationNumScreen';
import VirtualAssistantScreen from '../screens/VirtualAssistantScreen';

//Loading Utility
import Loading from "../screens/utils/Loading";

//Custom Hooks
import useUnreadMessages from "../hooks/useUnreadMessages";

const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  const hasUnreadMessages = useUnreadMessages();
  
  return (
    <Tab.Navigator
  initialRouteName="Home"
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: '#4CAF50',     // 🟢 Green active color
    tabBarInactiveTintColor: '#888888',   // ⚪ Gray inactive color
    tabBarStyle: {
      backgroundColor: '#ffffff',         // White background
      borderTopWidth: 1,
      borderTopColor: '#dddddd'
    },
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
        return <Ionicons name={iconName} size={size} color={color} />;

      } else if (route.name === 'Chat') {
        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        return (
          <>
            <Ionicons name={iconName} size={size} color={color} />
            {useUnreadMessages() && (
              <View
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 55,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'red',
                }}
              />
            )}
          </>
        );

      } else if (route.name === 'Profile') {
        iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      }
    },
  })}
>

      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const MainStack = createStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      initialRouteName="BottomTabs"
      screenOptions={{ headerShown: false }}
    >
      {/* Main App Screens */}
      <MainStack.Screen name="BottomTabs" component={BottomTabNavigator} />
      <MainStack.Screen name="AllProducts" component={AllProducts} />
      <MainStack.Screen name="AllShops" component={AllShops} />
      <MainStack.Screen name="Favourites" component={FavouritesScreen} />
      <MainStack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <MainStack.Screen name="Cart" component={CartScreen} />
      <MainStack.Screen name="AddressForm" component={AddressForm} />
      <MainStack.Screen name="MapScreen" component={MapScreen} />
      <MainStack.Screen name="VirtualAssistantScreen" component={VirtualAssistantScreen} />

      {/* Help Center & Terms and Policies*/}
      <MainStack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <MainStack.Screen name="TermsAndPolicies" component={TermsAndPoliciesScreen} />

      {/* Shop Screens */}
      <MainStack.Screen name="Shop" component={ShopScreen} />
      <MainStack.Screen name="ShopDashboard" component={ShopDashboardScreen} />
      <MainStack.Screen name="BuyerShopDashboard" component={BuyerShopDashboardScreen} />
      <MainStack.Screen name="Product" component={ProductScreen} />
      <MainStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <MainStack.Screen name="AddProduct" component={AddProductScreen} />
      <MainStack.Screen name="ProductList" component={ProductListScreen} />
      <MainStack.Screen name="BuyerOrderDetails" component={BuyerOrderDetailsScreen} />
      <MainStack.Screen name="BuyerOrderList" component={BuyerOrderListScreen} />
      <MainStack.Screen name="OrderList" component={OrderListScreen} />
      <MainStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <MainStack.Screen name="Addresses" component={AddressScreen} />
      <MainStack.Screen name="UpdateShopProfile" component={UpdateShopProfileScreen} />

      {/* Seller Onboarding Screens */}
      <MainStack.Screen name="InfoProfile" component={InformationProfile} />
      <MainStack.Screen name="BusinessInfo" component={BusinessInformationScreen} />
      <MainStack.Screen name="SetUpShop" component={SetUpShopScreen} />
      <MainStack.Screen name="ShopInfo" component={ShopInformationScreen} />
      <MainStack.Screen name="VerificationNumber" component={VerificationNumScreen} />
      <MainStack.Screen name="RegistrationSuccess" component={SellerRegistrationSuccessScreen} />

      {/* Pro Membership Screens */}
      <MainStack.Screen name="Pro" component={ProScreen} />
      <MainStack.Screen name="SelectPro" component={SelectProScreen} />
      <MainStack.Screen name="ActivePro" component={ActiveProScreen} />

      {/* Select Payment Screen */}
      <MainStack.Screen name="SelectPayment" component={SelectPaymentScreen} />
    </MainStack.Navigator>
  );
};

const AuthStack = createStackNavigator();
const Auth = ({ isFirstLaunch }) => {
  return (
    <AuthStack.Navigator
      initialRouteName={isFirstLaunch ? "Welcome" : "Banner" } 
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Location" component={LocationScreen} />
      <AuthStack.Screen name="Banner" component={BannerScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

export default () => {
  const { user, isFirstLaunch } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {user == null && <Loading />}
      {user == false && <Auth isFirstLaunch={isFirstLaunch}/>}
      {user == true && <Main />}
    </NavigationContainer>
  );
}
