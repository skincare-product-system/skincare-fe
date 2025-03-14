/* eslint-disable no-console */
import AntDesign from '@expo/vector-icons/AntDesign'
import { Ionicons } from '@expo/vector-icons' // Thêm Ionicons cho nút Wishlist
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRoute, useNavigation } from '@react-navigation/native'
import { ActivityIndicator, Image, Pressable, ScrollView, TextInput, TouchableOpacity, View, Text } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import Markdown from 'react-native-markdown-display'
import { useState, useEffect, useRef } from 'react'

import productApi from '../src/apis/products.api'
import { Header } from '../src/components'
import ImageSlider from '../src/components/ImageSlider'
import { formatNumber } from '../src/utils/utils'
import { useWishlist } from '../src/context/WishlistContext' // Import WishlistContext

export default function ProductDetailScreen() {
  const route = useRoute()
  const navigation = useNavigation() // Thêm navigation để quay lại
  const [product, setProduct] = useState({})
  const { productDetail } = route.params
  const [groupedAttributes, setGroupedAttributes] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [images, setImages] = useState([])
  const [products, setProducts] = useState([])
  const [similarProducts, setSimilarProducts] = useState([])
  const actionSheetRef = useRef(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState(null)

  // Sử dụng WishlistContext
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity((prev) => prev + 1)
    }
  }
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }
  const totalPrice = quantity * product.price

  useEffect(() => {
    const getProductDetail = async () => {
      try {
        const response = await productApi.getProductsByVariationId(productDetail._id)
        const variations = response.data.result

        setProducts(variations)

        if (variations.length > 0) {
          const combinedImages = variations[0].images.concat(variations[0].thumbnails)
          setImages(combinedImages)
          setProduct(variations[0])
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error)
        setIsLoading(false)
      }
    }

    if (productDetail?._id) {
      getProductDetail()
    }
  }, [productDetail])

  useEffect(() => {
    const newGroupedAttributes = {}

    products.forEach((item) => {
      Object.entries(item.attributes).forEach(([key, value]) => {
        if (!newGroupedAttributes[key]) {
          newGroupedAttributes[key] = {}
        }
        newGroupedAttributes[key][value] = true
      })
    })

    setGroupedAttributes(newGroupedAttributes)
  }, [products])

  useEffect(() => {
    const handleGetSimilarProducts = async () => {
      try {
        const response = await productApi.getProductsByCategoryId(product.category_id)
        const data = response.data.result.filter((item) => item.product_id !== product.product_id)
        setSimilarProducts(data)
      } catch (error) {
        console.log('error: ', error.response.data.errors)
      }
    }
    if (product?.category_id) {
      handleGetSimilarProducts()
    }
  }, [product])

  const handleSelectVariation = (key, value) => {
    const newProduct = products.find((item) => item.attributes[key] === value)
    setProduct(newProduct)
    setImages(newProduct.images.concat(newProduct.thumbnails))
  }

  const handleSelectProduct = async (item) => {
    try {
      const response = await productApi.getProductsByVariationId(item._id)
      const variations = response.data.result

      setProducts(variations)

      if (variations.length > 0) {
        const combinedImages = variations[0].images.concat(variations[0].thumbnails)
        setImages(combinedImages)
        setProduct(variations[0])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddToCart = async () => {
    const cartData = await AsyncStorage.getItem('cart')
    let cart = cartData ? JSON.parse(cartData) : []
    const index = cart.findIndex((item) => item.product._id === product._id)
    if (index !== -1) {
      cart[index].quantity += quantity
    } else {
      cart.push({ product, quantity })
    }
    await AsyncStorage.setItem('cart', JSON.stringify(cart))
  }

  const handleChangeBgColor = (variantId) => {
    setSelectedVariantId((prevId) => (prevId === variantId ? null : variantId))
  }

  // Hàm xử lý thêm/xóa khỏi Wishlist
  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <>
      <View>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: '#fff' }}>
          <Header />
          {/* Thêm nút Back và Wishlist vào header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
              <Ionicons name='arrow-back' size={24} color='#333' />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleWishlistToggle} style={{ padding: 5 }}>
              <Ionicons
                name={isInWishlist(product._id) ? 'heart' : 'heart-outline'}
                size={24}
                color={isInWishlist(product._id) ? '#FF6B6B' : '#333'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 150, marginTop: 80 }}>
        {isLoading ? (
          <ActivityIndicator size='large' color='#FA7070' style={{ marginTop: 20 }} />
        ) : (
          <View>
            <ImageSlider images={images} height={400} />
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <Text style={{ color: '#FA7070', fontWeight: '600', fontSize: 16 }}>{formatNumber(product.price)} ₫</Text>
              <Text style={{ fontWeight: '600' }}>{product.name}</Text>
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: '500', fontSize: 14 }}>Phân loại</Text>

                {Object.entries(groupedAttributes).map(([key, value]) => (
                  <View key={key} style={{ paddingVertical: 5 }}>
                    <Text>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 5 }}>
                      {Object.keys(value).map((item) => (
                        <Pressable
                          key={item}
                          style={{
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 15,
                            backgroundColor: selectedVariantId === item ? '#FADA7A' : '#F6F0F0'
                          }}
                          onPress={() => {
                            handleChangeBgColor(item)
                            handleSelectVariation(key, item)
                          }}
                        >
                          <Text style={{ fontWeight: '500' }}>{item}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
              <View style={{ marginTop: 20, backgroundColor: '#F7F7F7', padding: 10, gap: 5, borderRadius: 10 }}>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 15,
                    fontWeight: '500',
                    textTransform: 'capitalize',
                    color: '#41644A'
                  }}
                >
                  Thông tin sản phẩm
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ width: '50%', fontWeight: '500' }}>Xuất xứ:</Text>
                  <Text style={{ textTransform: 'capitalize' }}>{product.origin}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ width: '50%', fontWeight: '500', textTransform: 'capitalize' }}>Thương hiệu:</Text>
                  <Text style={{ textTransform: 'capitalize' }}>{product.brandName}</Text>
                </View>
              </View>
              <View style={{ marginTop: 20, backgroundColor: '#F7F7F7', padding: 10, gap: 5, borderRadius: 10 }}>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 15,
                    fontWeight: '500',
                    textTransform: 'capitalize',
                    color: '#41644A'
                  }}
                >
                  Sản phẩm tương tự
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {similarProducts && similarProducts.length > 0 ? (
                    similarProducts.map((item) => (
                      <TouchableOpacity
                        key={item._id}
                        style={{ width: 150, marginRight: 10, borderRadius: 10, overflow: 'hidden' }}
                        onPress={() => handleSelectProduct(item)}
                      >
                        <Image
                          source={{ uri: item.images[0] }}
                          style={{ width: 150, height: 150, objectFit: 'contain' }}
                        />
                        <Text style={{ fontWeight: '600', fontSize: 12, color: '#355F2E' }}>
                          {item.brandName.toUpperCase()}
                        </Text>
                        <Text style={{ fontWeight: '600', fontSize: 12 }} ellipsizeMode='tail' numberOfLines={2}>
                          {item.name}
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#FA7070' }}>
                          {formatNumber(item.price)} ₫
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text>Không có sản phẩm tương tự</Text>
                  )}
                </ScrollView>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5
        }}
      >
        <TouchableOpacity
          style={{
            margin: 5,
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: '#6E8E59',
            borderRadius: 50,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
          }}
          onPress={() => actionSheetRef.current?.show()}
        >
          <AntDesign name='shoppingcart' size={24} color='white' />
          <Text style={{ color: 'white', fontWeight: '500' }}>Thêm vào giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#FF9D3D', borderRadius: 50 }}
        >
          <Text style={{ color: 'white', fontWeight: '500' }}>Mua ngay</Text>
        </TouchableOpacity>

        {/* ActionSheet chọn số lượng & variation */}
        <ActionSheet ref={actionSheetRef} gestureEnabled>
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 10, flexWrap: 'wrap' }}>
              <Image
                source={{ uri: product.images && product.images[0] }}
                style={{ width: 100, height: 100, borderRadius: 5 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '500', fontSize: 13, textTransform: 'capitalize' }}>{product.name}</Text>
                <Text style={{ color: '#FA7070', fontWeight: '600', fontSize: 16 }}>
                  {formatNumber(product.price)} ₫
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 16, fontWeight: '500', textTransform: 'capitalize' }}>Số lượng</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                onPress={decreaseQuantity}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#F5F5F5',
                  borderRadius: 5
                }}
              >
                <Text style={{ fontSize: 20, color: '#4B5563' }}>−</Text>
              </TouchableOpacity>
              <TextInput
                value={quantity.toString()}
                keyboardType='numeric'
                onChangeText={(text) => setQuantity(Number(text) || 1)}
                style={{
                  width: 40,
                  height: 40,
                  textAlign: 'center',
                  fontSize: 13,
                  padding: 2,
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 5
                }}
              />
              <TouchableOpacity
                onPress={increaseQuantity}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#F5F5F5',
                  borderRadius: 5
                }}
              >
                <TouchableOpacity
                  onPress={increaseQuantity}
                  disabled={quantity >= 10}
                  style={{ opacity: quantity >= 10 ? 0.5 : 1 }}
                >
                  <Text style={{ fontSize: 20, color: '#4B5563' }}>+</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Text style={{ fontWeight: '500' }}>Tổng tiền:</Text>
              <Text style={{ fontWeight: '500' }}> {formatNumber(totalPrice)} ₫</Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#FF9D3D',
                padding: 10,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20
              }}
              onPress={() => handleAddToCart()}
            >
              <Text style={{ color: 'white', fontWeight: '500' }}>Thêm vào giỏ</Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>
      </View>
    </>
  )
}
