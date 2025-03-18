import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, RegisterScreen } from '../../screens'
import BottomTabNavigator from './BottomTabNavigator'
import StackNavigator from './StackNavigator'

const Stack = createStackNavigator()
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='BottomTabNavigator' component={BottomTabNavigator} />
      <Stack.Screen name='StackNavigator' component={StackNavigator} />
      <Stack.Screen name='LoginScreen' component={LoginScreen} />
      <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
    </Stack.Navigator>
  )
}
