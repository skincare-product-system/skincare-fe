import { createDrawerNavigator } from '@react-navigation/drawer'

import { CustomDrawer } from '../components'

import StackNavigator from './StackNavigator'
const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        }
      }}
    >
      <Drawer.Screen name='StackNavigator' component={StackNavigator} />
    </Drawer.Navigator>
  )
}
