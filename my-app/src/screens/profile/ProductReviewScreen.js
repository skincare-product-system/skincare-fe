import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native'

import { COLORS } from '../../styles/styles'

// Component đánh giá sao
const StarRating = ({ rating, setRating, size = 24, editable = false }) => {
  const renderStars = () => {
    const stars = []
    const maxStars = 5

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <TouchableOpacity key={i} disabled={!editable} onPress={() => editable && setRating(i)} style={{ marginRight: 5 }}>
          <AntDesign name={i <= rating ? 'star' : 'staro'} size={size} color={i <= rating ? '#FFD700' : COLORS.border} />
        </TouchableOpacity>
      )
    }

    return stars
  }

  return <View style={{ flexDirection: 'row' }}>{renderStars()}</View>
}

// Component Header
const Header = ({ title, onBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name='arrow-back' size={24} color={COLORS.text.dark} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  )
}

export default function ProductReviewScreen({ route, navigation }) {
  // Nhận thông tin sản phẩm từ route.params
  const { product } = route.params || {}

  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [images, setImages] = useState([])

  const handleAddImage = () => {
    // Thêm ảnh từ thư viện
    // Cần thêm logic cho chức năng này
    console.log('Add image')
  }

  const handleSubmit = () => {
    // Gửi đánh giá
    console.log('Submit review', { rating, review, images })
    navigation.goBack()
  }

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <Header title='Đánh giá sản phẩm' onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        <View style={styles.productCard}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productBrand}>{product.brand}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
            <Text style={styles.purchaseDate}>Ngày mua: {product.purchaseDate}</Text>
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Đánh giá của bạn</Text>
          <View style={styles.starsContainer}>
            <StarRating rating={rating} setRating={setRating} size={32} editable={true} />
            <Text style={styles.ratingText}>{rating > 0 ? `${rating}/5 sao` : 'Chọn đánh giá'}</Text>
          </View>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Nhận xét</Text>
          <TextInput
            style={styles.reviewInput}
            multiline
            numberOfLines={5}
            placeholder='Chia sẻ trải nghiệm của bạn về sản phẩm này...'
            placeholderTextColor={COLORS.text.medium}
            value={review}
            onChangeText={setReview}
          />
        </View>

        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Thêm hình ảnh</Text>
          <Text style={styles.imageHint}>Thêm hình ảnh để đánh giá chi tiết hơn</Text>

          <View style={styles.imagesContainer}>
            <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
              <Feather name='plus' size={24} color={COLORS.text.medium} />
              <Text style={styles.addImageText}>Thêm ảnh</Text>
            </TouchableOpacity>

            {/* Dữ liệu mẫu cho danh sách ảnh đã thêm */}
            {/* Cần thêm logic hiển thị ảnh đã chọn */}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.dark,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  purchaseDate: {
    fontSize: 13,
    color: COLORS.text.medium,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 12,
  },
  ratingSection: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  starsContainer: {
    alignItems: 'center',
  },
  ratingText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.text.medium,
  },
  reviewSection: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text.dark,
    backgroundColor: COLORS.background.main,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  imageSection: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  imageHint: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.main,
  },
  addImageText: {
    fontSize: 12,
    color: COLORS.text.medium,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: COLORS.text.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
})
