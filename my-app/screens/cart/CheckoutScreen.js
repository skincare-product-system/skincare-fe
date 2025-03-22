/* eslint-disable no-console */
import Entypo from '@expo/vector-icons/Entypo'
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Linking, ScrollView } from 'react-native'
import { View, Text, TouchableOpacity, Image } from 'react-native'

import addressApi from '../../src/apis/address.api'
import paymentApi from '../../src/apis/payments.api'
import shipApi from '../../src/apis/ship.api'
import { useCart } from '../../src/context/CartContext'
import { getDistrictName, getProvinceName, getWardName } from '../../src/utils/address'
import { loadCartItems, removeCartItem } from '../../src/utils/cart'
import { formatNumber } from '../../src/utils/utils'

export default function CheckoutScreen() {
  const route = useRoute()
  const nav = useNavigation()
  const [address, setAddress] = useState({})
  const [shippingFee, setShippingFee] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { products, quantity } = route.params
  const { setCartTotal, setCartItems } = useCart()

  const handleEditShippingAddress = () => {
    console.log(123)

    // nav.navigate('BottomTabNavigator', {
    //   screen: 'AccountNavigator',
    //   params: {
    //     screen: 'AddressNavigator',
    //     params: {
    //       screen: 'MyAddressScreen',
    //       params: { fromCheckout: true }
    //     }
    //   }
    // })

    // nav.navigate('BottomTabNavigator', {
    //   screen: 'AccountNavigator',
    //   params: {
    //     screen: 'AddressNavigator',
    //     params: {
    //       screen: 'MyAddressScreen',
    //       fromCheckout: true
    //     }
    //   }
    // })
    nav.dispatch(
      CommonActions.navigate({
        name: 'BottomTabNavigator',
        params: {
          screen: 'AccountNavigator',
          params: {
            screen: 'AddressNavigator',
            params: {
              screen: 'MyAddressScreen',
              fromCheckout: true // Cần đặt params ở đây, không lồng trong `params`
            }
          }
        }
      })
    )
    console.log(nav.getState())
  }

  useEffect(() => {
    const getShippingAddress = async () => {
      const response = await addressApi.getDefaultAddress()
      const provinceName = await getProvinceName(response.data.result.province_code)
      const districtName = await getDistrictName(response.data.result.province_code, response.data.result.district_code)
      const wardName = await getWardName(response.data.result.district_code, response.data.result.ward_code)

      const newAddress = {
        ...response.data.result,
        province_name: provinceName,
        district_name: districtName,
        ward_name: wardName
      }
      setAddress(newAddress)

      // Gọi API lấy phí vận chuyển ngay sau khi có địa chỉ
      const shippingResponse = await shipApi.getShippingFee({
        to_district_id: newAddress.district_code,
        to_ward_code: String(newAddress.ward_code)
      })
      setShippingFee(shippingResponse.data.result.total)

      setIsLoading(false)
    }
    getShippingAddress()
  }, [])

  // Thanh toán
  const handleCheckout = async () => {
    const payload = {
      to_district_id: address.district_code,
      to_ward_code: String(address.ward_code),
      products: products.map((product) => ({
        product_id: product.product_id,
        name: product.name,
        variation_id: product._id,
        quantity: quantity ? quantity : product.quantity,
        price: product.price
      })),
      receiver_name: address.receiver_name,
      phone_number: address.phone_number,
      address: address.address
    }
    console.log('payload', payload)

    const response = await paymentApi.createPayment(payload)

    Linking.openURL(response.data.result.order_url).catch((err) => console.error('Không thể mở URL:', err))
    if (response.data.result.return_code === 1) {
      // xóa cart
      console.log(123)

      const cart = await loadCartItems()
      console.log('cart', cart)
      for (const product of products) {
        await removeCartItem(cart, product.product_id)
      }

      setCartTotal(cart.length)
      nav.navigate('OrderConfirmationScreen', { orderId: response.data.result.order_id, address })
      console.log('Thanh toán thành công', response.data.result.order_id)
    }
  }

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size='large' color='#F38C79' />
      ) : (
        <ScrollView>
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
                    console.log(123)

                    handleEditShippingAddress()
                  }}
                >
                  <Text>Thay đổi</Text>
                  <Entypo name='chevron-small-right' size={24} color='black' />
                </TouchableOpacity>
              </View>
              <View>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  <Text style={{ fontWeight: '500' }}>{address.receiver_name}</Text>
                  <Text style={{ fontWeight: '500' }}>-</Text>
                  <Text style={{ fontWeight: '500' }}>{address.phone_number}</Text>
                </View>
                <Text style={{ color: 'gray', fontSize: 12 }}>
                  {address.address}, {address.ward_name}, {address.district_name}, {address.province_name}
                </Text>
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
                      <Text style={{ fontWeight: '500', fontSize: 12 }}>{quantity ? quantity : product.quantity}</Text>
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
              <Text style={{ fontWeight: '600' }}>
                {quantity
                  ? formatNumber(products.reduce((acc, cur) => acc + cur.price * quantity, 0))
                  : formatNumber(products.reduce((acc, cur) => acc + cur.price * cur.quantity, 0))}
                ₫
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
              <Text style={{ color: 'gray' }}>Phí vận chuyển</Text>
              <Text style={{ fontWeight: '600' }}>{formatNumber(shippingFee)}₫</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
              <Text style={{ color: 'gray' }}>Tổng cộng</Text>
              <Text style={{ fontWeight: '600' }}>
                {quantity
                  ? formatNumber(products.reduce((acc, cur) => acc + cur.price * quantity, 0) + shippingFee)
                  : formatNumber(products.reduce((acc, cur) => acc + cur.price * cur.quantity, 0) + shippingFee)}
                ₫
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
              <Text style={{ color: 'gray' }}>Phương thức thanh toán</Text>
              <Text style={{ fontWeight: '600' }}>zalopay</Text>
            </View>
          </View>

          {/* Btn thanh toán */}
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
        </ScrollView>
      )}
    </View>
  )
}
