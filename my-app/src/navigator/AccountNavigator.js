import { createStackNavigator } from '@react-navigation/stack'

import AccountScreen from '../screens/profile/AccountScreen'
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen'
import ResetPasswordScreen from '../screens/profile/ResetPasswordScreen'
import UserInformation from '../screens/profile/UserInformation'


const Stack = createStackNavigator()

export default function AccountNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='AccountScreen' component={AccountScreen} />
      <Stack.Screen name='UserInformation' component={UserInformation} />
      <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} />
      <Stack.Screen name='ResetPasswordScreen' component={ResetPasswordScreen} />
    </Stack.Navigator>
  )
}
