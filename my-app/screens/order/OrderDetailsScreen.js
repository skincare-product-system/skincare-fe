import Entypo from '@expo/vector-icons/Entypo'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import orderApi from '../../src/apis/order.api'
import { getDistrictName, getProvinceName, getWardName } from '../../src/utils/address'
import { ORDER_STATUS } from '../../src/utils/constant'
import { formatDate, getStatusColor } from '../../src/utils/order'
import { formatNumber } from '../../src/utils/utils'

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params
  const [order, setOrder] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [shippingDetails, setShippingDetails] = useState({})

  useEffect(() => {
    const getOrderDetail = async () => {
      const response = await orderApi.getOrder(orderId)
      if (response.status === 200) {
        const provinceName = await getProvinceName(202)
        const districtName = await getDistrictName(202, response.data.result.to_district_id)
        const wardName = await getWardName(response.data.result.to_district_id, response.data.result.to_ward_code)

        setShippingDetails({
          address: response.data.result.shipping_address,
          provinceName,
          districtName,
          wardName
        })
        setOrder(response.data.result)
        setIsLoading(false)
      }
    }
    getOrderDetail()
  }, [orderId])

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
    <>
      {isLoading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <ScrollView style={styles.container}>
          {/* header & chevron */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Entypo name='chevron-left' size={35} color='black' />
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: '500' }}>Thông tin đơn hàng</Text>
          </View>
          {/* thông tin đơn hàng */}
          <View style={styles.orderHeader}>
            <Text style={styles.title}>Đơn hàng #{order._id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <MaterialIcons name='local-shipping' size={24} color='black' />
              <Text style={{ color: 'gray' }}>{formatDate(order.expected_delivery_date)}</Text>
            </View>
          </View>

          {/* <View style={styles.section}>
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
      </View> */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Text style={styles.addressText}>{order.receiver_name}</Text>
              <Text style={{ color: 'gray' }}>
                (+84){order.phone_number.startsWith('0') ? order.phone_number.slice(1) : order.phone_number}
              </Text>
            </View>
            <Text style={styles.addressText}>
              <EvilIcons name='location' size={16} color='black' />
              {shippingDetails.address}, {shippingDetails.wardName}
              {', '}
              {shippingDetails.districtName}
              {', '}
              {shippingDetails.provinceName}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>
            {order.orderDetail.map((item) => (
              <View key={item.product_id} style={styles.itemContainer}>
                <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>

                  <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
                  <Text style={styles.itemPrice}>{formatNumber(item.price)} ₫</Text>
                </View>
              </View>
            ))}

            <View style={styles.summaryRow}>
              <Text>Tổng tiền hàng</Text>
              <Text>{formatNumber(order.estimate_price)} ₫</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Phí vận chuyển</Text>
              <Text>{order.shipping_fee} ₫</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalText}>Thành tiền</Text>
              <Text style={styles.totalAmount}>{formatNumber(order.end_price)} ₫</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            {[ORDER_STATUS.PENDING, ORDER_STATUS.DELIVERING].includes(order.status) && (
              <TouchableOpacity style={styles.refundButton}>
                <Text style={styles.refundButtonText}>Hủy Đơn</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  orderHeader: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom: 20
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexShrink: 1,
    marginVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    minWidth: 'auto'
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
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  itemPrice: {
    fontSize: 14,
    color: '#FA7070',
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
