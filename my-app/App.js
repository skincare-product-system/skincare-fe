import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { Linking } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { AuthProvider } from './src/context/AuthContext'
import { CartProvider } from './src/context/CartContext'
import { OrderProvider } from './src/context/OrderContext'
import AppNavigator from './src/navigator/AppNavigator'
import { toastConfig } from './src/utils/toast'

export default function App() {
  // const nav = useNavigation()
  // const handleDeepLink = (event) => {
  //   const url = event.url
  //   const params = new URLSearchParams(url.split('?')[1])
  //   const status = params.get('status')
  //   const orderId = params.get('order_id')

  //   if (status === 'success') {
  //     nav.navigate('OrderConfirmationScreen', { orderId })
  //   } else {
  //     nav.navigate('ProfileScreen')
  //   }
  // }

  // useEffect(() => {
  //   // Khi app mở từ Deep Link
  //   Linking.addEventListener('url', handleDeepLink)

  //   // Xử lý nếu app đang chạy và nhận link từ trạng thái ban đầu
  //   Linking.getInitialURL().then((url) => {
  //     if (url) handleDeepLink({ url })
  //   })

  //   return () => {
  //     Linking.removeEventListener('url', handleDeepLink)
  //   }
  // }, [])

  return (
    <>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <SafeAreaProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                  <AppNavigator />
                  <Toast config={toastConfig} />
                </NavigationContainer>
              </SafeAreaView>
            </SafeAreaProvider>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </>
  )
}
