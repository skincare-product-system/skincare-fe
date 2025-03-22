import { createStackNavigator } from '@react-navigation/stack'

import { ProfileScreen } from '../../screens'
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen'
import HelpSupportScreen from '../screens/profile/HelpSupportScreen'
import NotificationScreen from '../screens/profile/NotificationScreen'
import ProductReviewScreen from '../screens/profile/ProductReviewScreen'
import ProductsToReviewScreen from '../screens/profile/ProductsToReviewScreen'
import ResetPasswordScreen from '../screens/profile/ResetPasswordScreen'
import ReviewHistoryScreen from '../screens/profile/ReviewHistoryScreen'
import UserInformation from '../screens/profile/UserInformation'
import VoucherScreen from '../screens/profile/VoucherScreen'

import AddressNavigator from './AddressNavigator'
import WishListScreen from '../../screens/WishListScreen'

// import OrderHistoryScreen from '../screens/OrderHistoryScreen'

const Stack = createStackNavigator()

export default function AccountNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='ProfileScreen' component={ProfileScreen} />
      <Stack.Screen name='UserInformation' component={UserInformation} />
      <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} />
      <Stack.Screen name='ResetPasswordScreen' component={ResetPasswordScreen} />
      <Stack.Screen name='NotificationScreen' component={NotificationScreen} />
      <Stack.Screen name='VoucherScreen' component={VoucherScreen} />
      <Stack.Screen name='ProductsToReviewScreen' component={ProductsToReviewScreen} />
      <Stack.Screen name='ProductReviewScreen' component={ProductReviewScreen} />
      <Stack.Screen name='ReviewHistoryScreen' component={ReviewHistoryScreen} />
      <Stack.Screen name='AddressNavigator' component={AddressNavigator} />
      <Stack.Screen name='HelpSupportScreen' component={HelpSupportScreen} />
      <Stack.Screen name='WishListScreen' component={WishListScreen} />
    </Stack.Navigator>
  )
}
