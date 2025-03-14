import { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import http from '../../src/utils/http'

export default function WishlistScreen({ navigation }) {
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const response = await http.get('/wishlist')
        setWishlist(response.data)
      } catch (error) {
        console.error('Lỗi khi lấy wishlist:', error)
      }
    }
    fetchWishlist()
  }, [])

  const removeFromWishlist = async (id) => {
    try {
      await http.delete(`/wishlist/${id}`)
      setWishlist(wishlist.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Lỗi khi xóa khỏi wishlist:', error)
    }
  }

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, marginBottom: 10 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductList', { name: item.name, category: item.subCategories || [] })}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
        <Icon name='delete' size={24} color='red' />
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={{ padding: 20, flex: 1 }}>
      {/* Nút Back */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
      >
        <Icon name='arrow-back' size={24} color='black' />
        <Text style={{ marginLeft: 5, fontSize: 16 }}>Quay lại</Text>
      </TouchableOpacity>

      {/* Tiêu đề và danh sách */}
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Danh sách yêu thích</Text>
      {wishlist.length === 0 ? (
        <Text>Chưa có dịch vụ nào trong danh sách yêu thích.</Text>
      ) : (
        <FlatList data={wishlist} renderItem={renderItem} keyExtractor={(item) => item.id} />
      )}
    </View>
  )
}
