import Entypo from '@expo/vector-icons/Entypo'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import orderApi from '../../src/apis/order.api'
import { formatNumber } from '../../src/utils/utils'

const OrderHistoryScreen = ({ navigation, route }) => {
  const { status } = route.params

  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!status) return

    const getOrdersByStatus = async () => {
      setIsLoading(true)
      try {
        const response = await orderApi.getOrdersByStatus(status)
        setOrders(response.data.result)
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getOrdersByStatus()
  }, [status])

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size='large' color='black' />
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderItem}
              onPress={() => navigation.navigate('OrderDetailsScreen', { orderId: item._id })}
            >
              {/* Mã đơn hàng */}
              <Text style={styles.orderId}>Mã đơn: {item._id}</Text>

              {/* Danh sách sản phẩm */}
              {item?.orderDetail?.map((order_detail, idx) => (
                <View key={`${order_detail._id}-${idx}`} style={styles.productRow}>
                  <Image source={{ uri: order_detail.images[0] }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {order_detail.name}
                    </Text>
                    <Text style={styles.productPrice}>{formatNumber(order_detail.price)} ₫</Text>
                    <Text style={styles.productQuantity}>Số lượng: {order_detail.quantity}</Text>
                  </View>
                </View>
              ))}

              {/* Tổng tiền đơn hàng */}
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>
                  Tổng tiền ({item.total_quantity} sản phẩm):{' '}
                  <Text style={styles.totalPrice}>{formatNumber(item.end_price)} ₫</Text>
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={{
              uri: 'data:image/png;base64,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'
            }}
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('BottomTabNavigator', { screen: 'Home' })}
          >
            <Text style={styles.shopButtonText}>Bắt đầu mua sắm</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16
  },
  listContainer: {
    paddingTop: 16
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginVertical: 4
  },
  productQuantity: {
    fontSize: 12,
    color: '#666'
  },
  totalContainer: {
    marginTop: 10,
    alignItems: 'flex-end'
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f'
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
