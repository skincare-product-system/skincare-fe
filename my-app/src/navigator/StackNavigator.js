import { createStackNavigator } from '@react-navigation/stack'

import {
  CartScreen,
  CheckoutScreen,
  LoginScreen,
  OrderConfirmationScreen,
  OrderDetailsScreen,
  OrderHistoryScreen,
  OrderTrackingScreen,
  ProductDetailScreen,
  ProductListScreen,
  RegisterScreen
} from '../../screens'
import QuizDetailScreen from '../../screens/quiz/QuizDetailScreen'
import QuizResultScreen from '../../screens/quiz/QuizResultScreen'
import SearchResultScreen from '../../screens/search/SearchResultScreen'
import SearchScreen from '../../screens/search/SearchScreen'

import OrderTrackingNavigator from './OrderTrackingNavigator'

const Stack = createStackNavigator()

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='ProductList'
      screenOptions={{
        headerShown: false,
        gestureEnabled: true, // Enable swipe back gesture on iOS
        headerBackTitleVisible: false // Hide back button title on iOS
      }}
    >
      <Stack.Screen name='ProductList' component={ProductListScreen} />
      <Stack.Screen
        name='ProductDetailScreen'
        component={ProductDetailScreen}
        options={{ title: '' }} // Show back button for product detail
      />
      <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
      <Stack.Screen name='LoginScreen' component={LoginScreen} />
      <Stack.Screen name='CartScreen' component={CartScreen} options={{ headerShown: true, title: 'Cart' }} />
      <Stack.Screen name='QuizDetailScreen' component={QuizDetailScreen} />
      <Stack.Screen name='QuizResultScreen' component={QuizResultScreen} />
      <Stack.Screen name='CheckoutScreen' component={CheckoutScreen} />
      <Stack.Screen name='OrderConfirmationScreen' component={OrderConfirmationScreen} />
      <Stack.Screen name='SearchScreen' component={SearchScreen} />
      <Stack.Screen name='SearchResultScreen' component={SearchResultScreen} />
      <Stack.Screen name='OrderTrackingScreen' component={OrderTrackingScreen} />
      <Stack.Screen name='OrderTrackingNavigator' component={OrderTrackingNavigator} />
      <Stack.Screen name='OrderDetailsScreen' component={OrderDetailsScreen} />
    </Stack.Navigator>
  )
}
