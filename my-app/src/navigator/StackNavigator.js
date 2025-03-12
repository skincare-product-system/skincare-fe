import { createStackNavigator } from '@react-navigation/stack'

import { ProductListScreen } from '../../screens'
import CartScreen from '../../screens/CartScreen'
import LoginScreen from '../../screens/LoginScreen'
import ProductDetailScreen from '../../screens/ProductDetailScreen'
import RegisterScreen from '../../screens/RegisterScreen'

const Stack = createStackNavigator()

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name='Home' component={HomeScreen} /> */}
      <Stack.Screen name='ProductList' component={ProductListScreen} />
      <Stack.Screen name='ProductDetailScreen' component={ProductDetailScreen} />
      <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
      <Stack.Screen name='LoginScreen' component={LoginScreen} />
      <Stack.Screen name='CartScreen' component={CartScreen} />
    </Stack.Navigator>
  )
}
