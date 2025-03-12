import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useOrder } from '../../src/context/OrderContext'

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
        <Text style={styles.errorText}>Order information not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
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
          <Text style={styles.orderInfoValue}>{new Date(order.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Total Amount:</Text>
          <Text style={styles.orderInfoValue}>${order.total.toFixed(2)}</Text>
        </View>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Shipping Address:</Text>
          <Text style={styles.orderInfoValue}>
            {`${order.shippingDetails.address}, ${order.shippingDetails.city}, ${order.shippingDetails.country}`}
          </Text>
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
