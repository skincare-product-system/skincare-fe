import { createStackNavigator } from '@react-navigation/stack'

import AccountScreen from '../screens/profile/AccountScreen'
// import EditProfileScreen from '../screens/EditProfileScreen'
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen'
import HelpSupportScreen from '../screens/profile/HelpSupportScreen'
import MyAddressScreen from '../screens/profile/MyAddressScreen'
import NotificationScreen from '../screens/profile/NotificationScreen'
import ProductReviewScreen from '../screens/profile/ProductReviewScreen'
import ProductsToReviewScreen from '../screens/profile/ProductsToReviewScreen'
import ResetPasswordScreen from '../screens/profile/ResetPasswordScreen'
import ReviewHistoryScreen from '../screens/profile/ReviewHistoryScreen'
import UserInformation from '../screens/profile/UserInformation'
import VoucherScreen from '../screens/profile/VoucherScreen'

// import OrderHistoryScreen from '../screens/OrderHistoryScreen'

const Stack = createStackNavigator()

export default function AccountNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='AccountScreen' component={AccountScreen} />
      <Stack.Screen name='UserInformation' component={UserInformation} />
      {/* <Stack.Screen name='EditProfile' component={EditProfileScreen} /> */}
      <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} />
      <Stack.Screen name='ResetPasswordScreen' component={ResetPasswordScreen} />
      <Stack.Screen name='NotificationScreen' component={NotificationScreen} />
      <Stack.Screen name='VoucherScreen' component={VoucherScreen} />
      <Stack.Screen name='ProductsToReviewScreen' component={ProductsToReviewScreen} />
      <Stack.Screen name='ProductReviewScreen' component={ProductReviewScreen} />
      <Stack.Screen name='ReviewHistoryScreen' component={ReviewHistoryScreen} />
      <Stack.Screen name='MyAddressScreen' component={MyAddressScreen} />
      <Stack.Screen name='HelpSupportScreen' component={HelpSupportScreen} />

      {/* <Stack.Screen name='OrderHistory' component={OrderHistoryScreen} /> */}
    </Stack.Navigator>
  )
}
