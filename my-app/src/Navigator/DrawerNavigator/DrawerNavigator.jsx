import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import CustomDrawer from '../../Components/CustomDrawer/CustomDrawer'
import ProductList from '../../pages/ProductList'
import Home from '../../pages/Home'
const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName='Home'
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        }
      }}
    >
      <Drawer.Screen name='Home' component={Home} />
      <Drawer.Screen name='ProductList' component={ProductList} />
    </Drawer.Navigator>
  )
}
