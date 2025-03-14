import React from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useWishlist } from '../../src/context/WishlistContext'
import { useNavigation } from '@react-navigation/native'

export default function WishlistScreen() {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const navigation = useNavigation()

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.thumbnails?.[0] || item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString()}₫</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromWishlist(item._id)} style={styles.removeButton}>
        <Ionicons name='trash-outline' size={20} color='#FF6B6B' />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('StackNavigator', { screen: 'ProductDetailScreen', params: { productId: item._id } })
        }
        style={styles.viewButton}
      >
        <Text style={styles.viewText}>Xem chi tiết</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color='#333' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách yêu thích</Text>
      </View>
      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Danh sách yêu thích của bạn đang trống!</Text>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5EE'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  backButton: {
    padding: 5
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10
  },
  listContainer: {
    padding: 10
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  itemPrice: {
    fontSize: 14,
    color: '#F0A04B',
    marginTop: 4
  },
  removeButton: {
    padding: 5
  },
  viewButton: {
    padding: 5
  },
  viewText: {
    color: '#C9A66B',
    fontSize: 12,
    fontWeight: '500'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#666'
  }
})
