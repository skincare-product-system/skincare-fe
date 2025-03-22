import Entypo from '@expo/vector-icons/Entypo'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useNavigation } from '@react-navigation/native'
import { Text, TouchableOpacity, View } from 'react-native'

import OrderHistoryScreen from '../../screens/order/OrderHistoryScreen'
import { ORDER_STATUS } from '../utils/constant'

const Tab = createMaterialTopTabNavigator()

export default function OrderTrackingNavigator({ route }) {
  const nav = useNavigation()
  const { status } = route.params || {}

  // nav đến đúng screen tương ứng với status
  let initialScreen = 'Đang chờ'
  if (status === ORDER_STATUS.DELIVERING) initialScreen = 'Đang giao'
  if (status === ORDER_STATUS.DELIVERED) initialScreen = 'Đã giao'
  if (status === ORDER_STATUS.CANCELLED) initialScreen = 'Đã hủy'

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 20,
          justifyContent: 'space-between'
        }}
      >
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Entypo name='chevron-left' size={26} color='black' />
        </TouchableOpacity>
        <Text style={{ fontWeight: '600', fontSize: 22, textAlign: 'center', flex: 1 }}>Đơn đã mua</Text>
        <View style={{ width: 26 }} />
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#EC5228', // Màu khi được chọn
          tabBarInactiveTintColor: '#666', // Màu khi không được chọn
          tabBarIndicatorStyle: { backgroundColor: '#EC5228', height: 3 }, // Thanh dưới tab
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' }, // Kiểu chữ
          tabBarStyle: { backgroundColor: '#fff' } // Nền header
        }}
        initialRouteName={initialScreen}
      >
        <Tab.Screen name='Đang chờ' component={OrderHistoryScreen} initialParams={{ status: ORDER_STATUS.PENDING }} />
        <Tab.Screen
          name='Đang giao'
          component={OrderHistoryScreen}
          initialParams={{ status: ORDER_STATUS.DELIVERING }}
        />
        <Tab.Screen name='Đã giao' component={OrderHistoryScreen} initialParams={{ status: ORDER_STATUS.DELIVERED }} />
        <Tab.Screen name='Đã hủy' component={OrderHistoryScreen} initialParams={{ status: ORDER_STATUS.CANCELLED }} />
      </Tab.Navigator>
    </>
  )
}
