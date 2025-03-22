/* eslint-disable no-console */
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Alert, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { CheckBox } from 'react-native-elements'

import { useCart } from '../../src/context/CartContext'
import { loadCartItems, removeCartItem, updateItemQuantity } from '../../src/utils/cart'
import { formatNumber } from '../../src/utils/utils'

export default function CartScreen() {
  const [cart, setCart] = useState([])
  const nav = useNavigation()
  const [selectedItems, setSelectedItems] = useState({})
  const { setCartTotal } = useCart()

  useEffect(() => {
    const loadCart = async () => {
      const cartData = await loadCartItems()
      setCart(cartData)
    }
    loadCart()
  }, [])

  const handleCheckout = async () => {
    if (Object.keys(selectedItems).length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn sản phẩm để thanh toán')
      return
    }

    const selectedProducts = Object.values(selectedItems).map((item) => ({
      ...item.product,
      quantity: item.quantity
    }))

    nav.navigate('CheckoutScreen', { products: selectedProducts })
  }

  const toggleCheckbox = (item) => {
    setSelectedItems((prev) => {
      const newSelected = { ...prev }

      if (newSelected[item.product._id]) {
        delete newSelected[item.product._id]
      } else {
        newSelected[item.product._id] = item
      }

      return newSelected
    })
  }

  const updateQuantity = async (productId, newQuantity) => {
    const updatedCart = await updateItemQuantity(cart, productId, newQuantity)
    if (updatedCart) {
      setCart(updatedCart)

      // Nếu sản phẩm đang được chọn, cập nhật lại số lượng trong selectedItems
      setSelectedItems((prev) => {
        if (!prev[productId]) return prev // Nếu chưa chọn thì không làm gì cả
        return {
          ...prev,
          [productId]: { ...prev[productId], quantity: newQuantity }
        }
      })
    }
  }

  const removeItem = async (productId) => {
    const updatedCart = await removeCartItem(cart, productId)
    if (updatedCart) {
      setCart(updatedCart)
      setCartTotal(updatedCart.length)
    }
  }

  const renderItem = ({ item }) => (
    <View style={{ paddingHorizontal: 10 }}>
      <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
        <CheckBox
          checked={!!selectedItems[item.product._id]}
          onPress={() => toggleCheckbox(item)}
          containerStyle={{ padding: 0, margin: 0 }}
        />
        <Image source={{ uri: item.product.thumbnails[0] }} style={{ height: 70, width: 70, marginRight: 15 }} />
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => nav.navigate('ProductDetailScreen', { productDetail: item.product })}
        >
          <Text style={{ flexWrap: 'wrap', fontSize: 12 }}>{item.product.name}</Text>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F7F7F7',
              padding: 3,
              borderRadius: 10,
              alignSelf: 'flex-start'
            }}
          >
            <Text style={{ fontSize: 12, marginRight: 5, color: '#4A4947' }}>Đơn giá:</Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>{formatNumber(item.product.price)}₫</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, justifyContent: 'space-between' }}
      >
        {/* xóa */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?', [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Xóa', onPress: () => removeItem(item.product._id) }
            ])
          }}
        >
          <Text style={{ color: '#E50046' }}>Xóa</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            borderRadius: 5
          }}
        >
          {/* Nút Giảm */}
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#F5F5F5',
              borderRadius: 5
            }}
            onPress={() => updateQuantity(item.product._id, (item.quantity || 1) - 1)}
            disabled={(item.quantity || 1) <= 1}
          >
            <Text
              style={{
                fontSize: 13,
                color: (item.quantity || 1) <= 1 ? '#C0C0C0' : '#4B5563'
              }}
            >
              −
            </Text>
          </TouchableOpacity>

          {/* Input */}
          <TextInput
            value={String(item.quantity || 1)}
            keyboardType='numeric'
            onChangeText={(text) => {
              const num = parseInt(text) || 1
              updateQuantity(item.product._id, num)
            }}
            style={{
              width: 30,
              height: 30,
              textAlign: 'center',
              fontSize: 13,
              padding: 2,
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 5
            }}
          />

          {/* Nút Tăng */}
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#F5F5F5',
              borderRadius: 5,
              opacity: (item.quantity || 1) >= 10 ? 0.5 : 1
            }}
            onPress={() => updateQuantity(item.product._id, (item.quantity || 1) + 1)}
            disabled={(item.quantity || 1) >= 10}
          >
            <Text style={{ fontSize: 13, color: '#4B5563' }}>+</Text>
          </TouchableOpacity>
        </View>
        {/* tạm tính */}
        <View style={{ alignItems: 'flex-end' }}>
          <Text>Tạm tính</Text>
          <Text style={{ color: '#E50046', fontWeight: '600', fontSize: 12 }}>
            {formatNumber(item.product.price * (item.quantity || 1))}₫
          </Text>
        </View>
      </View>
    </View>
  )
  return (
    <View style={{ marginTop: 0, flex: 1 }}>
      {cart.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2762/2762885.png'
            }}
            style={{ width: 150, height: 150 }}
          />
          <Text>Giỏ hàng của bạn đang trống!!!</Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'black',
              paddingVertical: 10,
              paddingHorizontal: 20,
              alignItems: 'center',
              borderRadius: 30,
              margin: 10
            }}
            onPress={() => nav.navigate('BottomTabNavigator', { screen: 'Home' })}
          >
            <Text style={{ color: 'white', fontWeight: '500' }}>Tiếp tục mua hàng</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.product._id}
            renderItem={renderItem}
            removeClippedSubviews={true}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#F0A04B',
              padding: 10,
              alignItems: 'center',
              borderRadius: 30,
              margin: 10
            }}
            onPress={() => handleCheckout()}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>{'Thanh toán'.toUpperCase()}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
