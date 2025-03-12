/* eslint-disable no-console */
import Entypo from '@expo/vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from 'react-native'
import { CheckBox } from 'react-native-elements'

export default function CartScreen() {
  const [cart, setCart] = useState([])
  const [quantity, setQuantity] = useState(1)
  const nav = useNavigation()
  const [selectedItems, setSelectedItems] = useState({})

  useEffect(() => {
    const getCart = async () => {
      const cart = await AsyncStorage.getItem('cart')
      setCart(JSON.parse(cart) || [])
    }
    getCart()
  }, [])

  const toggleCheckbox = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id] // Toggle trạng thái
    }))
  }
  return (
    <View style={{ marginTop: 10, flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
        <Entypo name='chevron-left' size={30} color='black' />
        <Text style={{ fontWeight: 500, fontSize: 18 }}>Giỏ hàng</Text>
      </View>
      {cart.length === 0 ? (
        <Text>Giỏ hàng trống</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.product._id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', marginVertical: 10, paddingHorizontal: 10 }}>
              <CheckBox
                checked={!!selectedItems[item.product._id]}
                onPress={() => toggleCheckbox(item.product._id)}
                containerStyle={{ padding: 0, margin: 0 }}
              />
              <Image source={{ uri: item.product.thumbnails[0] }} style={{ height: 70, width: 70, marginRight: 15 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ flexWrap: 'wrap', fontSize: 12 }}>{item.product.name}</Text>
                {/* <Text>đơn giá: {item.product.price.toLocaleString()}₫</Text> */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {/* Nút Giảm */}
                  <TouchableOpacity
                    style={{
                      width: 20,
                      height: 20,
                      // borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#F5F5F5',
                      borderRadius: 5
                    }}
                  >
                    <Text style={{ fontSize: 13, color: '#4B5563' }}>−</Text>
                  </TouchableOpacity>

                  {/* Input */}
                  <TextInput
                    value={quantity.toString()}
                    keyboardType='numeric'
                    onChangeText={(text) => setQuantity(Number(text) || 1)}
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
                      //borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#F5F5F5',
                      borderRadius: 5
                    }}
                  >
                    <TouchableOpacity disabled={quantity >= 10} style={{ opacity: quantity >= 10 ? 0.5 : 1 }}>
                      <Text style={{ fontSize: 13, color: '#4B5563' }}>+</Text>
                    </TouchableOpacity>
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
          )}
        />
      )}
    </View>
  )
}
