import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useOrder } from '../../src/context/OrderContext'
import { formatCurrency, formatOrderDate, formatShippingAddress } from '../../src/utils/order'

const OrderConfirmationScreen = ({ navigation, route }) => {
  const { orderId } = route.params
  const { getOrderById } = useOrder()
  const order = getOrderById(orderId)

  // Prevent going back to checkout after order is placed
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Home')
      return true
    })

    return () => backHandler.remove()
  }, [navigation])

  if (!order) {
    return (
      <View style={styles.container}>
        <Ionicons name='alert-circle-outline' size={70} color='#FF6B6B' style={styles.errorIcon} />
        <Text style={styles.errorText}>Order information not found</Text>
        <TouchableOpacity
          style={styles.errorButton}
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
          <Ionicons name='checkmark' size={64} color='#fff' />
        </View>
      </View>

      <Text style={styles.title}>Order Confirmed!</Text>
      <Text style={styles.subtitle}>Your order has been placed successfully.</Text>

      <View style={styles.orderInfoContainer}>
        <Text style={styles.orderInfoTitle}>Order Information</Text>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Order ID:</Text>
          <Text style={styles.orderInfoValue}>{order.id}</Text>
        </View>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Date:</Text>
          <Text style={styles.orderInfoValue}>{formatOrderDate(order.createdAt)}</Text>
        </View>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Total Amount:</Text>
          <Text style={styles.orderInfoValue}>{formatCurrency(order.total)}</Text>
        </View>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Shipping Address:</Text>
          <Text style={styles.orderInfoValue}>{formatShippingAddress(order.shippingDetails)}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successIconContainer: {
    marginVertical: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  circleBackground: {
    backgroundColor: '#4CAF50',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2D3748',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 17,
    color: '#718096',
    marginBottom: 35,
    textAlign: 'center',
    paddingHorizontal: 20
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
  errorIcon: {
    marginBottom: 20
  },
  errorText: {
    fontSize: 19,
    textAlign: 'center',
    marginVertical: 25,
    color: '#4A5568',
    fontWeight: '500'
  },
  errorButton: {
    backgroundColor: '#3182CE',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
})

export default OrderConfirmationScreen
