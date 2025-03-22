/* eslint-disable no-console */
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import orderApi from '../../src/apis/order.api'
import { formatCurrency, formatOrderDate, formatOrderDateTime } from '../../src/utils/order'
import { formatNumber } from '../../src/utils/utils'

const OrderConfirmationScreen = ({ navigation, route }) => {
  const { orderId, address } = route.params
  const [order, setOrder] = useState({})

  useEffect(() => {
    const getOrderById = async () => {
      const response = await orderApi.getOrder(orderId)
      setOrder(response.data.result)
    }
    getOrderById()
  }, [orderId])

  // Prevent going back to checkout after order is placed
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('BottomTabNavigator', { screen: 'Home' })
      return true
    })

    return () => backHandler.remove()
  }, [navigation])

  if (!orderId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order information not found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BottomTabNavigator', { screen: 'Home' })}
        >
          <Text style={styles.buttonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.successIconContainer}>
        <View style={styles.circleBackground}>
          <Ionicons name='checkmark' size={60} color='#fff' />
        </View>
      </View>

      <Text style={styles.title}>Xác nhận đơn hàng!</Text>
      <Text style={styles.subtitle}>Đơn hàng của bạn đã được đặt thành công.</Text>

      <View style={styles.orderInfoContainer}>
        <Text style={styles.orderInfoTitle}>Thông tin đơn hàng</Text>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Order ID:</Text>
          <Text style={styles.orderInfoValue}>{orderId}</Text>
        </View>

        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Ngày đặt:</Text>
          <Text style={styles.orderInfoValue}>{formatOrderDate(order.createdAt)}</Text>
        </View>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Tổng tiền:</Text>
          <Text style={styles.orderInfoValue}>{formatNumber(order.end_price)}₫</Text>
        </View>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Địa chỉ:</Text>
          <Text style={styles.orderInfoValue}>
            {address.address}, {address.ward_name}, {address.district_name}, {address.province_name}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
        >
          <Text style={styles.trackButtonText}>Theo dõi đơn hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('BottomTabNavigator', { screen: 'Home' })}
        >
          <Text style={styles.continueButtonText}>Tiếp tục mua sắm</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  successIconContainer: {
    marginVertical: 30
  },
  circleBackground: {
    backgroundColor: '#4CAF50',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center'
  },
  orderInfoContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 30
  },
  orderInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333'
  },
  orderInfoRow: {
    flexDirection: 'row',
    marginBottom: 10
  },
  orderInfoLabel: {
    fontWeight: 'bold',
    width: 110,
    color: '#666'
  },
  orderInfoValue: {
    flex: 1,
    color: '#333'
  },
  buttonContainer: {
    width: '100%'
  },
  trackButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 5,
    marginBottom: 10
  },
  trackButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 5
  },
  continueButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 30,
    color: '#666'
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 5,
    width: '80%'
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
})

export default OrderConfirmationScreen
