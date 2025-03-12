import { createContext, useContext, useState } from 'react'

const OrderContext = createContext()

export const useOrder = () => useContext(OrderContext)

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [activeOrder, setActiveOrder] = useState(null)

  const createOrder = (cartItems, shippingDetails, paymentDetails) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      items: [...cartItems],
      shippingDetails,
      paymentDetails,
      status: 'processing',
      createdAt: new Date(),
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      trackingInfo: {
        carrier: 'Standard Shipping',
        trackingNumber: null,
        estimatedDelivery: null,
        status: 'processing'
      },
      refundStatus: null
    }

    setOrders([...orders, newOrder])
    setActiveOrder(newOrder)
    return newOrder
  }

  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId)
  }

  const updateOrderStatus = (orderId, status) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status } : order))
    setOrders(updatedOrders)
  }

  const requestRefund = (orderId, reason, items) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          refundStatus: 'pending',
          refundRequest: {
            reason,
            items,
            requestedAt: new Date()
          }
        }
      }
      return order
    })

    setOrders(updatedOrders)
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        createOrder,
        getOrderById,
        updateOrderStatus,
        requestRefund
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}
