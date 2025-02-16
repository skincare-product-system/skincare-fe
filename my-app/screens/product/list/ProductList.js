import { useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, FlatList, Text, Image } from 'react-native'

import productApi from '../../../src/apis/products.api'
import { Header } from '../../../src/components'

export default function ProductList() {
  const route = useRoute()
  const { name } = route.params
  const [products, setProducts] = useState()

  useEffect(() => {
    const getproductList = async () => {
      const queryParams = { product_type: name.toLowerCase() }
      const response = await productApi.getProducts(queryParams)
      setProducts(response.data)
    }
    getproductList()
  }, [name])

  let adjustedProducts = []
  if (products && products.length > 0) {
    adjustedProducts = products.length % 2 !== 0 ? [...products, { id: 'empty' }] : products
  }

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <View>
        <Header />
      </View>
      <Text style={{ fontWeight: '500', fontSize: 24, paddingLeft: 10, paddingVertical: 10 }}>{route.params.name}</Text>
      <FlatList
        data={adjustedProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-evenly', marginBottom: 10 }}
        renderItem={({ item }) =>
          item.id === 'empty' ? (
            <View style={{ flex: 1 }} />
          ) : (
            <View
              style={{
                flex: 1,
                marginHorizontal: 5,
                borderRadius: 5,
                overflow: 'hidden',
                alignItems: 'center',
                paddingBottom: 10
              }}
            >
              <View style={{ overflow: 'hidden', borderRadius: 5 }}>
                <Image source={{ uri: item.image_link }} style={{ width: 150, height: 150 }} />
              </View>
              <Text style={{ padding: 5, fontSize: 12, textAlign: 'center', textTransform: 'capitalize' }}>
                {item.brand}
              </Text>
              <Text
                style={{ fontWeight: '500', fontSize: 16, textAlign: 'center' }}
                ellipsizeMode='tail'
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '600', textAlign: 'center' }}>${item.price}</Text>
            </View>
          )
        }
      />
    </View>
  )
}
