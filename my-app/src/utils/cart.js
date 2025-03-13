import AsyncStorage from '@react-native-async-storage/async-storage'

export const loadCartItems = async () => {
  try {
    const cartData = await AsyncStorage.getItem('cart')
    return JSON.parse(cartData) || []
  } catch (error) {
    console.error('Error loading cart:', error)
    return []
  }
}

export const addItemToCart = async (product, quantity = 1) => {
  try {
    const cartData = await loadCartItems()
    const existingItemIndex = cartData.findIndex((item) => item.product._id === product._id)

    if (existingItemIndex > -1) {
      const updatedItems = [...cartData]
      updatedItems[existingItemIndex].quantity += quantity
      await saveCartItems(updatedItems)
    } else {
      await saveCartItems([...cartData, { product, quantity }])
    }
  } catch (error) {
    console.error('Error saving cart:', error)
    return null
  }
}

export const saveCartItems = async (updatedCart) => {
  try {
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart))
    return updatedCart
  } catch (error) {
    console.error('Error saving cart:', error)
    return null
  }
}

export const updateItemQuantity = async (cart, productId, newQuantity) => {
  if (newQuantity < 1 || newQuantity > 10) return cart

  const updatedCart = cart.map((item) => {
    if (item.product._id === productId) {
      return { ...item, quantity: newQuantity }
    }
    return item
  })

  return await saveCartItems(updatedCart)
}

export const removeCartItem = async (cart, productId) => {
  const updatedCart = cart.filter((item) => item.product._id !== productId)
  return await saveCartItems(updatedCart)
}

export const clearCart = async () => {
  await AsyncStorage.removeItem('cart')
}
