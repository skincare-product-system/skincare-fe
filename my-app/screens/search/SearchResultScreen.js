import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native'

import searchApi from '../../src/apis/search.api'
import { Header } from '../../src/components'
import { formatNumber } from '../../src/utils/utils'

export default function SearchResultScreen({ route }) {
  const nav = useNavigation()
  const [isLoading, setIsLoading] = useState(true)
  const { content } = route.params
  const [result, setResult] = useState([])

  useEffect(() => {
    const search = async () => {
      try {
        const response = await searchApi.search(content)
        if (response.data?.result) {
          setResult(response.data.result)
        } else {
          setResult([])
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error)
        setResult([])
      }
      setIsLoading(false)
    }
    search()
  }, [content])

  let adjustedProducts = []
  if (result.length > 0) {
    adjustedProducts = result.length % 2 !== 0 ? [...result, { variation_id: 'empty' }] : result
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Header />
      <Text
        style={{ fontWeight: '500', fontSize: 24, paddingLeft: 10, paddingVertical: 10, textTransform: 'capitalize' }}
      >
        Kết quả tìm kiếm
      </Text>

      {isLoading ? (
        <ActivityIndicator size='large' color='#FA7070' style={{ marginTop: 20 }} />
      ) : result.length === 0 ? (
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '500', marginTop: 20 }}>
          Không tìm thấy sản phẩm nào
        </Text>
      ) : (
        <FlatList
          data={adjustedProducts}
          keyExtractor={(item) => item.variation_id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
          renderItem={({ item }) =>
            item.variation_id === 'empty' ? (
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
                onPress={() =>
                  nav.navigate('ProductDetailScreen', {
                    productDetail: {
                      ...item,
                      _id: item.variation_id
                    }
                  })
                }
              >
                <View style={{ overflow: 'hidden', borderRadius: 5 }}>
                  <Image
                    source={{ uri: item.images?.[0] }}
                    style={{ width: 170, height: 170, resizeMode: 'contain' }}
                  />
                </View>
                <View style={{ padding: 5, gap: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#355F2E' }}>
                    {item.brand_name?.toUpperCase() || 'No Brand'}
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
      )}
    </View>
  )
}
