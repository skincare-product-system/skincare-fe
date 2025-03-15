import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native'

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

export default function ReviewHistoryScreen({ navigation }) {
  // Dữ liệu mẫu cho lịch sử đánh giá
  const reviewHistory = [
    {
      id: '1',
      productName: 'Sữa Rửa Mặt Dưỡng Ẩm Natural Herbs',
      productImage: 'https://via.placeholder.com/60',
      rating: 5,
      date: '10/03/2025',
      review: 'Sản phẩm rất tốt, làm sạch hiệu quả và không gây khô da. Mình sẽ mua lại.',
      images: ['https://via.placeholder.com/80', 'https://via.placeholder.com/80'],
      likes: 12,
    },
    {
      id: '2',
      productName: 'Kem Dưỡng Ẩm Chống Nắng SPF50+',
      productImage: 'https://via.placeholder.com/60',
      rating: 4,
      date: '28/02/2025',
      review: 'Thành phần lành tính, thấm nhanh không bết dính. Chỉ tiếc là giá hơi cao.',
      images: [],
      likes: 5,
    },
  ]

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.productImage }} style={styles.reviewProductImage} />
        <View style={styles.reviewHeaderInfo}>
          <Text style={styles.reviewProductName} numberOfLines={2}>
            {item.productName}
          </Text>
          <View style={styles.reviewDateContainer}>
            <Text style={styles.reviewDate}>{item.date}</Text>
            <StarRating rating={item.rating} setRating={() => {}} size={16} />
          </View>
        </View>
      </View>

      <Text style={styles.reviewText}>{item.review}</Text>

      {item.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewImagesContainer}>
          {item.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
          ))}
        </ScrollView>
      )}

      <View style={styles.reviewFooter}>
        <TouchableOpacity style={styles.likeButton}>
          <AntDesign name='like2' size={18} color={COLORS.text.medium} />
          <Text style={styles.likeCount}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('ProductReview', { review: item })}>
          <Feather name='edit-2' size={18} color={COLORS.text.medium} />
          <Text style={styles.editText}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <Header title='Lịch sử đánh giá' onBack={() => navigation.goBack()} />

      {reviewHistory.length > 0 ? (
        <FlatList
          data={reviewHistory}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id}
          style={styles.reviewList}
          contentContainerStyle={styles.reviewListContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name='star' size={60} color={COLORS.primary} />
          <Text style={styles.emptyTitle}>Chưa có đánh giá nào</Text>
          <Text style={styles.emptyText}>
            Bạn chưa đánh giá sản phẩm nào. Sau khi mua hàng, bạn có thể đánh giá sản phẩm để giúp người khác có thêm thông tin.
          </Text>
        </View>
      )}
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
  reviewList: {
    flex: 1,
    padding: 16,
  },
  reviewListContent: {
    paddingBottom: 20,
  },
  reviewItem: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewProductImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  reviewHeaderInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  reviewProductName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text.dark,
  },
  reviewDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.text.medium,
  },
  reviewText: {
    fontSize: 14,
    color: COLORS.text.dark,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewImagesContainer: {
    marginBottom: 12,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingTop: 12,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.text.medium,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.text.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.medium,
    textAlign: 'center',
    lineHeight: 20,
  },
})
