/* eslint-disable no-console */
import Entypo from '@expo/vector-icons/Entypo'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native'

import paymentApi from '../src/apis/payments.api'
import { useAuth } from '../src/context/AuthContext'
import { formatNumber } from '../src/utils/utils'

export default function CheckoutScreen() {
  const route = useRoute()
  const { profile } = useAuth()
  console.log('🚀 ~ CheckoutScreen ~ profile:', profile)
  const { products } = route.params
  const navigation = useNavigation()
  console.log(JSON.stringify(products, null, 2))

  const handleEditShippingAddress = () => {}

  const handleCheckout = async () => {
    if (!profile) {
      console.log('Chưa đăng nhập')
      return navigation.navigate('LoginScreen')
    }
    // const payload = {
    //   products: [
    //     {
    //       product_id: products[0].product_id,
    //       variation_id: products[0]._id,
    //       quantity: 1,
    //       price: products[0].price
    //     }
    //   ]
    // }
    // const response = await paymentApi.createPayment(payload)
    // console.log(response.data.result)

    const payload = {
      products: [
        {
          product_id: products[0].product_id,
          variation_id: products[0]._id,
          quantity: 1,
          price: products[0].price
        }
      ]
    }

    const response = await paymentApi.createPayment(payload)
    console.log('📤 Payment API Response:', response.data)
    Linking.openURL(response.data.result.order_url)
      .then((res) => {
        console.log(res)
        navigation.navigate('OrderConfirmationScreen', { orderId: payload.products[0].product_id })
      })
      .catch((err) => console.error('Không thể mở URL:', err))
  }

  return (
    <View>
      {}
      {/* địa chỉ giao hàng */}
      <View style={{ backgroundColor: '#FFC1B4' }}>
        <View style={{ backgroundColor: 'white', padding: 10, margin: 20, borderRadius: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Địa chỉ nhận hàng + Mặc định */}
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Text style={{ color: '#F38C79', fontWeight: '500' }}>địa chỉ nhận hàng</Text>
              <View style={{ backgroundColor: '#F38C79', padding: 5, borderRadius: 10, marginLeft: 10 }}>
                <Text style={{ color: 'white', fontSize: 12 }}>Mặc định</Text>
              </View>
            </View>

            {/* Thay đổi + Chevron */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                handleEditShippingAddress()
              }}
            >
              <Text>Thay đổi</Text>
              <Entypo name='chevron-small-right' size={24} color='black' />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* danh sách sản phẩm */}
      <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
        <Text style={{ fontWeight: '600' }}>Danh sách sản phẩm</Text>
        <Text style={{ color: 'gray' }}>Tổng: {products.length} sản phẩm</Text>
        {products.map((product) => (
          <View key={product._id} style={{ flexDirection: 'row', marginTop: 20 }}>
            <Image source={{ uri: product.images[0] }} style={{ width: 100, height: 100, borderRadius: 10 }} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontWeight: '600' }}>{product.name}</Text>
              <View>
                {Object.entries(product.attributes).map(([key, value]) => (
                  <Text key={key} style={{ color: 'gray', fontWeight: '500', fontSize: 11 }}>
                    {key}: {value}
                  </Text>
                ))}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Text style={{ color: 'gray', fontSize: 12 }}>Thành tiền: </Text>
                  <Text style={{ fontWeight: '500', fontSize: 12 }}>{formatNumber(product.price)}₫</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Text style={{ color: 'gray', fontSize: 12 }}>Số lượng: </Text>
                  <Text style={{ fontWeight: '500', fontSize: 12 }}>1</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Tổng tiền */}
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
          <Text style={{ color: 'gray' }}>Tổng tiền</Text>
          <Text style={{ fontWeight: '600' }}>{formatNumber(products.reduce((acc, cur) => acc + cur.price, 0))}₫</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
          <Text style={{ color: 'gray' }}>Phí vận chuyển</Text>
          <Text style={{ fontWeight: '600' }}>0₫</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
          <Text style={{ color: 'gray' }}>Tổng cộng</Text>
          <Text style={{ fontWeight: '600' }}>{formatNumber(products.reduce((acc, cur) => acc + cur.price, 0))}₫</Text>
        </View>
      </View>

      {/* Thanh toán */}
      <TouchableOpacity
        style={{
          backgroundColor: '#F38C79',
          padding: 10,
          margin: 10,
          borderRadius: 10,
          alignItems: 'center'
        }}
        onPress={() => handleCheckout()}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  )
}
