/* eslint-disable no-console */
import Entypo from '@expo/vector-icons/Entypo'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, FlatList, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native'

import productApi from '../../../src/apis/products.api'
import { Header } from '../../../src/components'
import { formatNumber } from '../../../src/utils/utils'

export default function ProductList() {
  const nav = useNavigation()
  const route = useRoute()
  const { subItem, brand } = route.params
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  console.log(subItem, brand)

  useEffect(() => {
    const getproductList = async () => {
      try {
        let response = []
        if (subItem) {
          response = await productApi.getProductsByCategoryId(subItem._id)
        } else if (brand) {
          console.log(brand._id)

          response = await productApi.getProductsByBrandId(brand._id)
        }

        setProducts(response.data.result)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    getproductList()
  }, [subItem, brand])

  let adjustedProducts = []
  if (products.length > 0) {
    adjustedProducts = products.length % 2 !== 0 ? [...products, { _id: 'empty' }] : products
  }

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => nav.goBack()} style={{ padding: 5 }}>
          <Entypo name='chevron-left' size={30} color='black' />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Header />
        </View>
      </View>

      <Text
        style={{ fontWeight: '500', fontSize: 24, paddingLeft: 10, paddingVertical: 10, textTransform: 'capitalize' }}
      >
        {subItem ? subItem.name : brand.name}
      </Text>
      {isLoading ? (
        <ActivityIndicator size='large' color='#FA7070' style={{ marginTop: 20 }} />
      ) : products.length > 0 ? (
        <FlatList
          data={adjustedProducts}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ marginBottom: 10 }}
          renderItem={({ item }) =>
            item._id === 'empty' ? (
              <View style={{ flex: 1 }} />
            ) : (
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginHorizontal: 5,
                  borderRadius: 5,
                  overflow: 'hidden',
                  paddingBottom: 10
                }}
                onPress={() => {
                  nav.navigate('StackNavigator', { screen: 'ProductDetailScreen', params: { productDetail: item } })
                }}
              >
                <View style={{ overflow: 'hidden', borderRadius: 5 }}>
                  <Image source={{ uri: item.images[0] }} style={{ width: 170, height: 170, objectFit: 'contain' }} />
                </View>
                <View style={{ padding: 5, gap: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#355F2E' }}>
                    {item.brandName.toUpperCase()}
                  </Text>
                  <Text style={{ fontWeight: '600', fontSize: 12 }} ellipsizeMode='tail' numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#FA7070' }}>
                    {formatNumber(item.price)} ₫
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }
        />
      ) : (
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '500', marginTop: 20 }}>No products found</Text>
      )}
    </View>
  )
}
