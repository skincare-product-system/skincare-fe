import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)

  const addToCart = (product, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex((item) => item.id === product.id)

    if (existingItemIndex > -1) {
      const updatedItems = [...cartItems]
      updatedItems[existingItemIndex].quantity += quantity
      setCartItems(updatedItems)
    } else {
      setCartItems([...cartItems, { ...product, quantity }])
    }

    updateCartTotal([...cartItems, { ...product, quantity }])
  }

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter((item) => item.id !== productId)
    setCartItems(updatedItems)
    updateCartTotal(updatedItems)
  }

  const updateQuantity = (productId, quantity) => {
    const updatedItems = cartItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
    setCartItems(updatedItems)
    updateCartTotal(updatedItems)
  }

  const clearCart = () => {
    setCartItems([])
    setCartTotal(0)
  }

  const updateCartTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setCartTotal(total)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
