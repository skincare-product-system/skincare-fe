/* eslint-disable no-console */
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, FlatList, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import productApi from '../../../src/apis/products.api'
import { Header } from '../../../src/components'
import { formatNumber } from '../../../src/utils/utils'

export default function ProductList() {
  const nav = useNavigation()
  const route = useRoute()
  const { subItem } = route.params
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getproductList = async () => {
      try {
        const response = await productApi.getProductsByCategoryId(subItem._id)
        setProducts(response.data.result)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    getproductList()
  }, [subItem._id])

  let adjustedProducts = []
  if (products.length > 0) {
    adjustedProducts = products.length % 2 !== 0 ? [...products, { _id: 'empty' }] : products
  }

  return (
    <View style={styles.container}>
      {/* Nút Back */}
      <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
        <Icon name='arrow-back' size={24} color='#333' />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>

      <Header />
      <Text style={styles.title}>{subItem.name}</Text>

      {isLoading ? (
        <ActivityIndicator size='large' color='#FA7070' style={styles.loading} />
      ) : products.length > 0 ? (
        <FlatList
          data={adjustedProducts}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) =>
            item._id === 'empty' ? (
              <View style={styles.emptyItem} />
            ) : (
              <TouchableOpacity
                style={styles.productItem}
                onPress={() => {
                  nav.navigate('StackNavigator', { screen: 'ProductDetailScreen', params: { productDetail: item } })
                }}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.images[0] }} style={styles.productImage} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.brandName}>{item.brandName.toUpperCase()}</Text>
                  <Text style={styles.productName} ellipsizeMode='tail' numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.productPrice}>{formatNumber(item.price)} ₫</Text>
                </View>
              </TouchableOpacity>
            )
          }
        />
      ) : (
        <Text style={styles.noProductsText}>No products found</Text>
      )}
    </View>
  )
}

// CSS (Inline Styles) đặt ở dưới
const styles = {
  container: {
    padding: 20,
    flex: 1
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333'
  },
  title: {
    fontWeight: '500',
    fontSize: 24,
    paddingLeft: 10,
    paddingVertical: 10,
    textTransform: 'capitalize'
  },
  loading: {
    marginTop: 20
  },
  columnWrapper: {
    marginBottom: 10
  },
  emptyItem: {
    flex: 1
  },
  productItem: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
    overflow: 'hidden',
    paddingBottom: 10
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: 5
  },
  productImage: {
    width: 170,
    height: 170,
    objectFit: 'contain'
  },
  productInfo: {
    padding: 5,
    gap: 4
  },
  brandName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#355F2E'
  },
  productName: {
    fontWeight: '600',
    fontSize: 12
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FA7070'
  },
  noProductsText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    marginTop: 20
  }
}
