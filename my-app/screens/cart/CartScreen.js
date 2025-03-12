import { useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { CheckBox } from 'react-native-elements'

import { loadCartItems, removeCartItem, updateItemQuantity } from '../../src/utils/cart'

export default function CartScreen() {
  const [cart, setCart] = useState([])
  const nav = useNavigation()
  const [selectedItems, setSelectedItems] = useState({})

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    const cartData = await loadCartItems()
    setCart(cartData)
  }

  const toggleCheckbox = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const updateQuantity = async (productId, newQuantity) => {
    const updatedCart = await updateItemQuantity(cart, productId, newQuantity)
    if (updatedCart) setCart(updatedCart)
  }

  const removeItem = async (productId) => {
    const updatedCart = await removeCartItem(cart, productId)
    if (updatedCart) setCart(updatedCart)
  }

  const renderItem = useCallback(
    ({ item }) => (
      <View style={{ flexDirection: 'row', marginVertical: 10, paddingHorizontal: 10 }}>
        <CheckBox
          checked={!!selectedItems[item.product._id]}
          onPress={() => toggleCheckbox(item.product._id)}
          containerStyle={{ padding: 0, margin: 0 }}
        />
        <Image source={{ uri: item.product.thumbnails[0] }} style={{ height: 70, width: 70, marginRight: 15 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ flexWrap: 'wrap', fontSize: 12 }}>{item.product.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
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

            <View style={{ alignItems: 'flex-end', flex: 1 }}>
              <Text style={{ fontWeight: '600', fontSize: 12 }}>đơn giá</Text>
              <Text style={{ color: '#F0A04B', fontWeight: '600', fontSize: 12 }}>
                {item.product.price.toLocaleString()}₫
              </Text>
            </View>
          </View>
        </View>
      </View>
    ),
    [selectedItems]
  )

  return (
    <View style={{ marginTop: 0, flex: 1 }}>
      {cart.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Giỏ hàng của bạn đang trống!!!</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.product._id}
          renderItem={renderItem}
          removeClippedSubviews={true}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}
    </View>
  )
}
