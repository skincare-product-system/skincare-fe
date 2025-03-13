import { useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { useCart, useOrder } from '../../src/context'

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { createOrder } = useOrder()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  })

  const [paymentDetails, setPaymentDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  const handleShippingChange = (field, value) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field, value) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const newErrors = {}

    // Xác thực thông tin giao hàng
    if (!shippingDetails.fullName.trim()) newErrors.fullName = 'Tên là bắt buộc'
    if (!shippingDetails.address.trim()) newErrors.address = 'Địa chỉ là bắt buộc'
    if (!shippingDetails.city.trim()) newErrors.city = 'Thành phố là bắt buộc'
    if (!shippingDetails.postalCode.trim()) newErrors.postalCode = 'Mã bưu điện là bắt buộc'
    if (!shippingDetails.country.trim()) newErrors.country = 'Quốc gia là bắt buộc'

    // Xác thực số điện thoại với mẫu cơ bản
    const phonePattern = /^\d{10,}$/
    if (!shippingDetails.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc'
    } else if (!phonePattern.test(shippingDetails.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Vui lòng nhập số điện thoại hợp lệ'
    }

    // Xác thực thông tin thanh toán
    if (!paymentDetails.cardName.trim()) newErrors.cardName = 'Tên trên thẻ là bắt buộc'

    // Xác thực số thẻ
    const cardNumberClean = paymentDetails.cardNumber.replace(/\s/g, '')
    if (!cardNumberClean) {
      newErrors.cardNumber = 'Số thẻ là bắt buộc'
    } else if (!/^\d{16}$/.test(cardNumberClean)) {
      newErrors.cardNumber = 'Vui lòng nhập số thẻ 16 chữ số hợp lệ'
    }

    // Xác thực định dạng ngày hết hạn (MM/YY)
    if (!paymentDetails.expiryDate.trim()) {
      newErrors.expiryDate = 'Ngày hết hạn là bắt buộc'
    } else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
      newErrors.expiryDate = 'Sử dụng định dạng MM/YY'
    }

    // Xác thực CVV
    if (!paymentDetails.cvv.trim()) {
      newErrors.cvv = 'CVV là bắt buộc'
    } else if (!/^\d{3}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = 'Nhập CVV 3 chữ số'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      Alert.alert('Lỗi xác thực', 'Vui lòng kiểm tra lỗi trong biểu mẫu')
      return
    }

    try {
      setIsSubmitting(true)

      // Định dạng dữ liệu trước khi gửi
      const formattedShippingDetails = {
        ...shippingDetails,
        fullName: shippingDetails.fullName.trim(),
        phone: shippingDetails.phone.replace(/[^0-9]/g, '')
      }

      const formattedPaymentDetails = {
        ...paymentDetails,
        cardNumber: paymentDetails.cardNumber.replace(/\s/g, ''),
        cardName: paymentDetails.cardName.trim()
      }

      const order = await createOrder(cartItems, formattedShippingDetails, formattedPaymentDetails)
      clearCart()
      navigation.navigate('OrderConfirmation', { orderId: order.id })
    } catch (error) {
      Alert.alert('Lỗi', 'Có vấn đề xảy ra khi xử lý đơn hàng của bạn. Vui lòng thử lại.', [{ text: 'OK' }])
      console.error('Lỗi gửi đơn hàng:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderErrorMessage = (fieldName) => {
    if (errors[fieldName]) {
      return <Text style={styles.errorText}>{errors[fieldName]}</Text>
    }
    return null
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Information</Text>
        <TextInput
          style={[styles.input, errors.fullName && styles.inputError]}
          placeholder='Full Name'
          value={shippingDetails.fullName}
          onChangeText={(text) => handleShippingChange('fullName', text)}
        />
        {renderErrorMessage('fullName')}

        <TextInput
          style={[styles.input, errors.address && styles.inputError]}
          placeholder='Address'
          value={shippingDetails.address}
          onChangeText={(text) => handleShippingChange('address', text)}
        />
        {renderErrorMessage('address')}

        <TextInput
          style={[styles.input, errors.city && styles.inputError]}
          placeholder='City'
          value={shippingDetails.city}
          onChangeText={(text) => handleShippingChange('city', text)}
        />
        {renderErrorMessage('city')}

        <TextInput
          style={[styles.input, errors.postalCode && styles.inputError]}
          placeholder='Postal Code'
          value={shippingDetails.postalCode}
          onChangeText={(text) => handleShippingChange('postalCode', text)}
        />
        {renderErrorMessage('postalCode')}

        <TextInput
          style={[styles.input, errors.country && styles.inputError]}
          placeholder='Country'
          value={shippingDetails.country}
          onChangeText={(text) => handleShippingChange('country', text)}
        />
        {renderErrorMessage('country')}

        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder='Phone Number'
          value={shippingDetails.phone}
          onChangeText={(text) => handleShippingChange('phone', text)}
          keyboardType='phone-pad'
        />
        {renderErrorMessage('phone')}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <TextInput
          style={[styles.input, errors.cardName && styles.inputError]}
          placeholder='Name on Card'
          value={paymentDetails.cardName}
          onChangeText={(text) => handlePaymentChange('cardName', text)}
        />
        {renderErrorMessage('cardName')}

        <TextInput
          style={[styles.input, errors.cardNumber && styles.inputError]}
          placeholder='Card Number'
          value={paymentDetails.cardNumber}
          onChangeText={(text) => handlePaymentChange('cardNumber', text)}
          keyboardType='number-pad'
          maxLength={16}
        />
        {renderErrorMessage('cardNumber')}

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <TextInput
              style={[styles.input, errors.expiryDate && styles.inputError]}
              placeholder='MM/YY'
              value={paymentDetails.expiryDate}
              onChangeText={(text) => handlePaymentChange('expiryDate', text)}
              maxLength={5}
            />
            {renderErrorMessage('expiryDate')}
          </View>

          <View style={{ flex: 1 }}>
            <TextInput
              style={[styles.input, errors.cvv && styles.inputError]}
              placeholder='CVV'
              value={paymentDetails.cvv}
              onChangeText={(text) => handlePaymentChange('cvv', text)}
              keyboardType='number-pad'
              maxLength={3}
              secureTextEntry
            />
            {renderErrorMessage('cvv')}
          </View>
        </View>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text>Subtotal ({cartItems.length} items)</Text>
          <Text>${cartTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Shipping</Text>
          <Text>$5.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Tax</Text>
          <Text>${(cartTotal * 0.1).toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>${(cartTotal + 5 + cartTotal * 0.1).toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.placeOrderButton, isSubmitting && styles.disabledButton]}
        onPress={handlePlaceOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color='#fff' />
        ) : (
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10
  },
  row: {
    flexDirection: 'row'
  },
  summarySection: {
    marginBottom: 20
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    marginTop: 5
  },
  totalText: {
    fontWeight: 'bold'
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 18
  },
  placeOrderButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 5,
    marginBottom: 30
  },
  placeOrderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16
  },
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -5
  },
  disabledButton: {
    backgroundColor: '#a9a9a9'
  }
})

export default CheckoutScreen
