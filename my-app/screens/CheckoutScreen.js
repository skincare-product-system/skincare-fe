import Entypo from '@expo/vector-icons/Entypo'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useState } from 'react'
import { ActivityIndicator, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

import paymentApi from '../src/apis/payments.api'
import { useAuth } from '../src/context/AuthContext'
import { useOrder } from '../src/context/OrderContext'
import { formatNumber } from '../src/utils/utils'

export default function CheckoutScreen() {
  const route = useRoute()
  const { profile } = useAuth()
  const { createOrder } = useOrder()
  const { products } = route.params
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)

  const handleEditShippingAddress = () => {}

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      // Early validation with better error message
      if (!Array.isArray(products) || products.length === 0) {
        throw new Error('No products in cart. Please add products before checkout.')
      }

      // Extract profile data processing to a separate function
      const shippingAddress = getShippingAddressFromProfile(profile)

      // Create a structured payload with null checks on each field
      const payload = {
        products: products.map((product) => ({
          product_id: product?.product_id || '',
          variation_id: product?._id || '',
          quantity: 1,
          price: product?.price || 0
        })),
        shipping_address: shippingAddress,
        customer_id: profile?.id || profile?._id || 'guest'
      }

      // Process payment
      const { data } = await paymentApi.createPayment(payload)

      // More specific error for debugging
      if (!data?.result?.order_url) {
        throw new Error('Payment service did not return a valid payment URL')
      }

      const paymentUrl = data.result.order_url
      const zaloPayScheme = 'zalopay://'
      const orderId = data?.result?.order_id

      // Handle ZaloPay opening
      await handleZaloPayment(zaloPayScheme, paymentUrl)

      // Process successful order
      if (data?.result?.return_code === 1 && orderId) {
        await createOrder(payload.products, shippingAddress, {}, orderId)
        navigation.navigate('OrderConfirmationScreen', { orderId })
      } else if (data?.result) {
        // Handle partial success cases
        throw new Error(`Payment process incomplete: Code ${data.result.return_code || 'unknown'}`)
      }
    } catch (error) {
      // Better error handling with logging
      console.error('Checkout Error:', error)

      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: error.message || 'An error occurred during the payment process. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions for cleaner main function
  const getShippingAddressFromProfile = (profile) => ({
    fullName: profile?.fullName || profile?.name || 'Customer',
    address: profile?.address || 'Default Address',
    city: profile?.city || 'Default City',
    phone: profile?.phone || '0123456789'
  })

  const handleZaloPayment = async (zaloPayScheme, paymentUrl) => {
    try {
      const canOpenZaloPay = await Linking.canOpenURL(zaloPayScheme)
      if (canOpenZaloPay) {
        await Linking.openURL(paymentUrl)
      } else {
        // Fallback for when app isn't installed
        await Linking.openURL(paymentUrl)
      }
      return true
    } catch (error) {
      console.error('Error opening payment app:', error)
      // Still return true to continue with order processing
      return true
    }
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
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
        onPress={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color='white' style={{ marginRight: 8 }} /> : null}
        <Text style={{ color: 'white', fontWeight: '600' }}>{isLoading ? 'Đang xử lý...' : 'Thanh toán'}</Text>
      </TouchableOpacity>
    </View>
  )
}
