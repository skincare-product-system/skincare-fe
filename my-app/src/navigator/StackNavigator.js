import { createStackNavigator } from '@react-navigation/stack'

import { CartScreen, LoginScreen, ProductDetailScreen, ProductListScreen, RegisterScreen } from '../../screens'

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
        options={{ headerShown: true, title: '' }} // Show back button for product detail
      />
      <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
      <Stack.Screen name='LoginScreen' component={LoginScreen} />
      <Stack.Screen name='CartScreen' component={CartScreen} options={{ headerShown: true, title: 'Cart' }} />
    </Stack.Navigator>
  )
}
