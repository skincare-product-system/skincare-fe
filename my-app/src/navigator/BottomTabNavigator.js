import EvilIcons from '@expo/vector-icons/EvilIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { CategoryScreen, HomeScreen, ProfileScreen } from '../../screens'

const Tab = createBottomTabNavigator()
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name='Home'
        options={{
          tabBarIcon: ({ color }) => <Ionicons name='home' size={35} color={color} />,
          title: 'Trang Chủ'
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name='CategoryScreen'
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name='category' size={35} color={color} />,
          title: 'Danh Mục'
        }}
        component={CategoryScreen}
      />
      <Tab.Screen
        name='ProfileScreen'
        options={{
          tabBarIcon: ({ color }) => <EvilIcons name='user' size={35} color={color} />,
          title: 'Tài Khoản'
        }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  )
}
