import { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const WishlistContext = createContext()

export const useWishlist = () => useContext(WishlistContext)

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])

  // Load Wishlist từ AsyncStorage khi khởi động
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const wishlistData = await AsyncStorage.getItem('wishlist')
        if (wishlistData) {
          setWishlistItems(JSON.parse(wishlistData))
        }
      } catch (error) {
        console.error('Error loading wishlist:', error)
      }
    }
    loadWishlist()
  }, [])

  // Lưu Wishlist vào AsyncStorage
  const saveWishlist = async (items) => {
    try {
      await AsyncStorage.setItem('wishlist', JSON.stringify(items))
      setWishlistItems(items)
    } catch (error) {
      console.error('Error saving wishlist:', error)
    }
  }

  // Thêm sản phẩm vào Wishlist
  const addToWishlist = (product) => {
    const isAlreadyInWishlist = wishlistItems.some((item) => item._id === product._id)
    if (!isAlreadyInWishlist) {
      const updatedWishlist = [...wishlistItems, product]
      saveWishlist(updatedWishlist)
    }
  }

  // Xóa sản phẩm khỏi Wishlist
  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter((item) => item._id !== productId)
    saveWishlist(updatedWishlist)
  }

  // Kiểm tra sản phẩm có trong Wishlist không
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
