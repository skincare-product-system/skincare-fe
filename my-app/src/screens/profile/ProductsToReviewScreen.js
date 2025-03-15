import { AntDesign, Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native'

import { COLORS } from '../../styles/styles'

// Component Header
// const Header = ({ title }) => {
//   return (
//     <View style={styles.header}>
//       <Text style={styles.headerTitle}>{title}</Text>
//     </View>
//   )
// }
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

// Component Rating (chỉ hiển thị)
const StarRating = ({ rating, size = 16 }) => {
  const renderStars = () => {
    const stars = []
    const maxStars = 5

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <AntDesign
          key={i}
          name={i <= rating ? 'star' : 'staro'}
          size={size}
          color={i <= rating ? '#FFD700' : COLORS.border}
          style={{ marginRight: 2 }}
        />
      )
    }

    return stars
  }

  return <View style={{ flexDirection: 'row' }}>{renderStars()}</View>
}

export default function ProductsToReviewScreen({ navigation }) {
  // Dữ liệu mẫu cho danh sách sản phẩm cần đánh giá
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Sữa Rửa Mặt Dưỡng Ẩm Natural Herbs',
      price: '289.000đ',
      image: 'https://via.placeholder.com/100',
      brand: 'Natural Beauty',
      purchaseDate: '15/03/2025',
      hasReviewed: false,
    },
    {
      id: '2',
      name: 'Serum Vitamin C Sáng Da',
      price: '450.000đ',
      image: 'https://via.placeholder.com/100',
      brand: 'Skin Bright',
      purchaseDate: '10/03/2025',
      hasReviewed: false,
    },
    {
      id: '3',
      name: 'Kem Dưỡng Ẩm Ban Đêm',
      price: '350.000đ',
      image: 'https://via.placeholder.com/100',
      brand: 'Dream Skin',
      purchaseDate: '05/03/2025',
      hasReviewed: false,
    },
    {
      id: '4',
      name: 'Mặt Nạ Dưỡng Ẩm Trà Xanh',
      price: '125.000đ',
      image: 'https://via.placeholder.com/100',
      brand: 'Natural Beauty',
      purchaseDate: '01/03/2025',
      hasReviewed: false,
    },
  ])

  const handleReviewProduct = (product) => {
    navigation.navigate('ProductReviewScreen', { product })
  }

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => handleReviewProduct(item)}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.purchaseDate}>Ngày mua: {item.purchaseDate}</Text>
      </View>
      <View style={styles.reviewStatus}>
        <TouchableOpacity style={styles.reviewButton} onPress={() => handleReviewProduct(item)}>
          <Text style={styles.reviewButtonText}>Đánh giá</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <Header title='Sản phẩm cần đánh giá' onBack={() => navigation.goBack()} />

      <StatusBar barStyle='dark-content' backgroundColor={COLORS.background.card} />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Đánh giá sản phẩm của bạn để nhận xu thưởng và giúp người dùng khác có quyết định mua sắm tốt hơn.
        </Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AntDesign name='checkcircleo' size={48} color={COLORS.primary} />
            <Text style={styles.emptyText}>Không có sản phẩm nào cần đánh giá</Text>
          </View>
        }
      />
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
    justifyContent: 'center',
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
  infoContainer: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    color: COLORS.text.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 2,
  },
  productBrand: {
    fontSize: 12,
    color: COLORS.text.medium,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 2,
  },
  purchaseDate: {
    fontSize: 11,
    color: COLORS.text.medium,
  },
  reviewStatus: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  reviewButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  reviewButtonText: {
    color: COLORS.text.light,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text.medium,
    textAlign: 'center',
  },
})
