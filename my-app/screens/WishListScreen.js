import Entypo from '@expo/vector-icons/Entypo'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { ActivityIndicator } from 'react-native'

import wishListApi from '../src/apis/wishlist.api'
import { formatNumber } from '../src/utils/utils'

export default function WishListScreen() {
  const nav = useNavigation()
  const [isLoading, setIsLoading] = useState(true)
  const [wishList, setWishList] = useState([])

  useEffect(() => {
    const getWishList = async () => {
      const response = await wishListApi.getWishList()
      setWishList(response.data.result)
      setIsLoading(false)
    }
    getWishList()
  }, [wishList])

  const handleRemoveWishList = async (product_id, variation_id) => {
    await wishListApi.deleteFromWishList(product_id, variation_id)
    const response = await wishListApi.getWishList()
    setWishList(response.data.result)
  }

  const handleAddToCart = async () => {
    // await cartApi.addToCart(product_id, variation_id)
    // const response = await cartApi.getCart()
    // setCart(response.data.result)
  }

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size='large' color='black' />
      ) : (
        <View>
          {/* header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 20,
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity onPress={() => nav.goBack()}>
              <Entypo name='chevron-left' size={26} color='black' />
            </TouchableOpacity>
            <Text style={{ fontWeight: '600', fontSize: 22, textAlign: 'center', flex: 1 }}>Danh sách yêu thích</Text>
            <View style={{ width: 26 }} />
          </View>
          {/* danh sách sản phẩm */}
          {/* <ScrollView>
            {wishList.map((item) => (
              <View
                key={item._id}
                style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
              >
                <Image source={{ uri: item.images[0] }} style={{ width: 100, height: 100 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                  <Text style={{ fontSize: 14, color: 'gray' }}>{item.price}</Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'black',
                      padding: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 10
                    }}
                  >
                    <Text style={{ color: 'white' }}>Thêm vào giỏ hàng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView> */}
          <ScrollView>
            {wishList.length === 0 && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/2762/2762885.png'
                  }}
                  style={{ width: 200, height: 200, marginVertical: 50 }}
                />
                <Text
                  style={{
                    fontWeight: '500',
                    textAlign: 'center',
                    marginHorizontal: 30
                  }}
                >
                  Không có sản phẩm nào trong danh sách yêu thích của bạn!!!
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'black',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    borderRadius: 30,
                    margin: 20
                  }}
                  onPress={() => nav.navigate('BottomTabNavigator', { screen: 'Home' })}
                >
                  <Text style={{ color: 'white', fontWeight: '500' }}>Tiếp tục mua hàng</Text>
                </TouchableOpacity>
              </View>
            )}
            {wishList.map((item) => (
              <View
                key={item._id}
                style={{
                  padding: 20,
                  marginVertical: 10,
                  borderRadius: 10,
                  marginHorizontal: 20,
                  gap: 10,
                  backgroundColor: '#fff'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                  {/* Icon Cancel */}
                  <TouchableOpacity
                    style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}
                    onPress={() => handleRemoveWishList(item.product_id, item.variant_id)}
                  >
                    <MaterialIcons name='cancel' size={24} color='black' />
                  </TouchableOpacity>

                  {/* Hình ảnh */}
                  <Image source={{ uri: item.images[0] }} style={{ width: 120, height: 120, borderRadius: 10 }} />

                  {/* Chứa tên sản phẩm */}
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ color: '#355F2E', fontWeight: '500' }}>{item.brand_name.toUpperCase()}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '600' }}>
                      {item.name +
                        ' ' +
                        Object.entries(item.attribute)
                          .map(([key, value]) => `${key} ${value}`)
                          .join(' ')}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#FA7070' }}>
                      {formatNumber(item.price)} ₫
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#355F2E',
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 10
                      }}
                      onPress={handleAddToCart}
                    >
                      <Text style={{ color: 'white', fontWeight: '500' }}>Thêm vào giỏ hàng</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}
