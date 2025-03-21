import { createStackNavigator } from '@react-navigation/stack'

import AddAddressScreen from '../../screens/address/AddAddressScreen'
import EditAddressScreen from '../../screens/address/EditAddressScreen'
import MyAddressScreen from '../../screens/address/MyAddressScreen'

const Stack = createStackNavigator()

export default function AddressNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='MyAddressScreen' component={MyAddressScreen} />
      <Stack.Screen name='AddAddressScreen' component={AddAddressScreen} />
      <Stack.Screen name='EditAddressScreen' component={EditAddressScreen} />
    </Stack.Navigator>
  )
}
