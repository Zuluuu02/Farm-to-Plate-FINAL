import React, { useContext } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from "../providers/AuthProvider";
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';

//Auth Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LocationScreen from '../screens/LocationScreen';
import BannerScreen from '../screens/BannerScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

//Main Screens
import HomeScreen from '../screens/HomeScreen';
import AllProducts from '../screens/AllProductsScreen';
import AllShops from '../screens/AllShopsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import CartScreen from '../screens/CartScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import ShopScreen from '../screens/ShopScreen';
import SetUpShopScreen from '../screens/SetUpShopScreen';
import BusinessInformationScreen from '../screens/BusinessInformationScreen'; 
import ShopInformationScreen from '../screens/ShopInformationScreen';
import SellerRegistrationSuccessScreen from '../screens/SellerRegistrationSuccessScreen';
import VerificationNumScreen from '../screens/VerificationNumScreen';
import InformationProfile from '../screens/InformationProfile';
import AddProductScreen from '../screens/AddProductScreen';
import AddressScreen from '../screens/AddressScreen';
import OrderListScreen from '../screens/OrderListScreen';
import OrderDetailsScreen from '../screens/OrderDetails';
import ProductListScreen from '../screens/ProductListScreen';
import ShopDashboardScreen from '../screens/ShopDashboardScreen';
import UpdateShopProfileScreen from '../screens/UpdateShopProfileScreen'; 
import ProScreen from '../screens/ProScreen';
import SelectProScreen from '../screens/SelectProScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import TermsAndPoliciesScreen from '../screens/TermsAndPoliciesScreen';
import SelectPaymentScreen from '../screens/SelectPaymentScreen';
import ActiveProScreen from '../screens/ActiveProScreen';
import AddressForm from '../screens/AddressForm';
import MapScreen from '../screens/MapScreen';
import BuyerShopDashboardScreen from '../screens/BuyerShopDashboardScreen';
import ProductScreen from '../screens/ProductScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import BuyerOrderDetailsScreen from '../screens/BuyerOrderDetailsScreen';
import BuyerOrderListScreen from '../screens/BuyerOrderListScreen';
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
        tabBarIcon: ({ focused, color, size }) => {
          let iconName; 

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;

          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            return (
              <React.Fragment>
                <Ionicons name={iconName} size={size} color={color} />
                {hasUnreadMessages && (
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
              </React.Fragment>
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
