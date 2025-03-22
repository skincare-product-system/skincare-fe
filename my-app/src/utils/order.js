import { ORDER_STATUS } from './constant'

export const formatOrderDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

export const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`
}

export const formatShippingAddress = (shippingDetails) => {
  return `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.country}`
}

export const getOrderStatusInfo = (status) => {
  const statusMap = {
    processing: { label: 'Processing', color: '#FF9800' },
    shipped: { label: 'Shipped', color: '#2196F3' },
    delivered: { label: 'Delivered', color: '#4CAF50' },
    cancelled: { label: 'Cancelled', color: '#F44336' }
  }

  return statusMap[status] || { label: 'Processing', color: '#FF9800' }
}

export const createOrder = (cartItems, shippingDetails, paymentDetails) => {
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

  return newOrder
}

export const updateOrderStatus = (order, status) => {
  return { ...order, status }
}

export const requestRefund = (order, reason, items) => {
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

export const getOrderTotal = (order) => {
  return order.total - order.total * 0.1 - 5
}

export const getOrderById = (orders, orderId) => {
  return orders.find((order) => order.id === orderId)
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

export const getStatusColor = (status) => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return '#FFC107'
    case ORDER_STATUS.DELIVERING:
      return '#2196F3'
    case ORDER_STATUS.DELIVERED:
      return '#4CAF50'
    case ORDER_STATUS.CANCELLED:
      return '#F44336'
    default:
      return '#9E9E9E'
  }
}
