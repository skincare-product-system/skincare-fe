import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useOrder } from '../../src/context/OrderContext'

const OrderHistoryScreen = ({ navigation }) => {
  const { orders } = useOrder()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
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

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Items:</Text>
          <Text style={styles.detailValue}>{item.items.length}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={styles.detailValue}>${item.total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
        >
          <Text style={styles.trackButtonText}>Track</Text>
        </TouchableOpacity>
        {item.status !== 'cancelled' && !item.refundStatus && (
          <TouchableOpacity
            style={styles.refundButton}
            onPress={() => navigation.navigate('RequestRefund', { orderId: item.id })}
          >
            <Text style={styles.refundButtonText}>Return/Refund</Text>
          </TouchableOpacity>
        )}
        {item.refundStatus && (
          <View style={styles.refundStatusBadge}>
            <Text style={styles.refundStatusText}>Refund {item.refundStatus}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>You haven&apos;t placed any orders yet</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Products')}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  listContainer: {
    padding: 16
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  orderId: {
    fontSize: 16,
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
  orderDetails: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 60
  },
  detailValue: {
    flex: 1
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  trackButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  refundButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  refundButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  refundStatusBadge: {
    backgroundColor: '#FFC107',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  refundStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#666'
  },
  shopButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
})

export default OrderHistoryScreen
