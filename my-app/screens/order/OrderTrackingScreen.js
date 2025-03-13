import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useOrder } from '../../src/context'
import { formatDate, getOrderById, getStatusColor } from '../../src/utils/order'

const OrderTrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params || {}
  const { orders } = useOrder()
  const order = getOrderById(orders, orderId)

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.orderHeader}>
        <Text style={styles.title}>Order #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tracking Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Carrier:</Text>
          <Text>{order.trackingInfo.carrier}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tracking Number:</Text>
          <Text>{order.trackingInfo.trackingNumber || 'Not available yet'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estimated Delivery:</Text>
          <Text>
            {order.trackingInfo.estimatedDelivery ? formatDate(order.trackingInfo.estimatedDelivery) : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Timeline</Text>
        <View style={styles.timeline}>
          <View style={[styles.timelinePoint, { backgroundColor: '#4CAF50' }]} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Order Placed</Text>
            <Text>{formatDate(order.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.timelineConnector} />

        <View style={styles.timeline}>
          <View
            style={[
              styles.timelinePoint,
              {
                backgroundColor: order.status !== 'processing' ? '#4CAF50' : '#e0e0e0'
              }
            ]}
          />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Processing</Text>
            <Text>{order.status !== 'processing' ? 'Completed' : 'In progress'}</Text>
          </View>
        </View>

        <View style={styles.timelineConnector} />

        <View style={styles.timeline}>
          <View
            style={[
              styles.timelinePoint,
              {
                backgroundColor: order.status === 'shipped' || order.status === 'delivered' ? '#4CAF50' : '#e0e0e0'
              }
            ]}
          />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Shipped</Text>
            <Text>
              {order.status === 'shipped' || order.status === 'delivered' ? 'Your order is on the way' : 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.timelineConnector} />

        <View style={styles.timeline}>
          <View
            style={[
              styles.timelinePoint,
              {
                backgroundColor: order.status === 'delivered' ? '#4CAF50' : '#e0e0e0'
              }
            ]}
          />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Delivered</Text>
            <Text>{order.status === 'delivered' ? 'Completed' : 'Waiting'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
        >
          <Text style={styles.actionButtonText}>Order Details</Text>
        </TouchableOpacity>

        {order.status !== 'cancelled' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#F44336' }]}
            onPress={() => navigation.navigate('RequestRefund', { orderId: order.id })}
          >
            <Text style={styles.actionButtonText}>Request Return/Refund</Text>
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
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 140
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  timelinePoint: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    marginTop: 4
  },
  timelineConnector: {
    width: 2,
    height: 30,
    backgroundColor: '#e0e0e0',
    marginLeft: 7
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8
  },
  timelineTitle: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  actionsContainer: {
    marginVertical: 20
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 5,
    marginBottom: 10
  },
  actionButtonText: {
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

export default OrderTrackingScreen
