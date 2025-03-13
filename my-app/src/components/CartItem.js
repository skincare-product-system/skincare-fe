import { Ionicons } from '@expo/vector-icons'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useCart } from '../context/CartContext'

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart()

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    } else {
      removeFromCart(item.id)
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} defaultSource={require('../assets/placeholder.png')} />
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => removeFromCart(item.id)}>
            <Ionicons name='trash-outline' size={20} color='#FF6B6B' />
          </TouchableOpacity>

          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
              <Ionicons name='remove' size={18} color='#333' />
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
              <Ionicons name='add' size={18} color='#333' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff'
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  infoContainer: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  price: {
    fontSize: 15,
    color: '#666',
    fontWeight: 'bold'
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4
  },
  quantityButton: {
    padding: 6
  },
  quantity: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: 'bold'
  }
})

export default CartItem
