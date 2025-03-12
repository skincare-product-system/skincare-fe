import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useOrder } from '../../src/context/OrderContext'

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params
  const { getOrderById } = useOrder()
  const order = getOrderById(orderId)

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OrderHistory')}>
          <Text style={styles.buttonText}>View All Orders</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const formatDate = (date) => {
    const d = new Date(date)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return '#FFC107'
      case 'shipped':
        return '#2196F3'
      case 'delivered':
        return '#4CAF50'
      case 'cancelled':
        return '#F44336'
      default:
        return '#9E9E9E'
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.orderHeader}>
        <Text style={styles.title}>Order #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.itemImage}
              defaultSource={require('../../assets/favicon.png')}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text style={styles.addressText}>{order.shippingDetails.fullName}</Text>
        <Text style={styles.addressText}>{order.shippingDetails.address}</Text>
        <Text style={styles.addressText}>{`${order.shippingDetails.city}, ${order.shippingDetails.postalCode}`}</Text>
        <Text style={styles.addressText}>{order.shippingDetails.country}</Text>
        <Text style={styles.addressText}>{order.shippingDetails.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <Text style={styles.paymentText}>Card: **** **** **** {order.paymentDetails.cardNumber.slice(-4)}</Text>
        <Text style={styles.paymentText}>Name: {order.paymentDetails.cardName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>${(order.total - order.total * 0.1 - 5).toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Shipping</Text>
          <Text>$5.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Tax</Text>
          <Text>${(order.total * 0.1).toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>

        {order.status !== 'cancelled' && !order.refundStatus && (
          <TouchableOpacity
            style={styles.refundButton}
            onPress={() => navigation.navigate('RequestRefund', { orderId: order.id })}
          >
            <Text style={styles.refundButtonText}>Request Refund</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center'
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  addressText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333'
  },
  paymentText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    marginTop: 5,
    borderBottomWidth: 0
  },
  totalText: {
    fontWeight: 'bold'
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 18
  },
  actionsContainer: {
    marginVertical: 20
  },
  trackButton: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 5,
    marginBottom: 10
  },
  trackButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  refundButton: {
    backgroundColor: '#FF6B6B',
    padding: 14,
    borderRadius: 5
  },
  refundButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20
  }
})

export default OrderDetailsScreen
