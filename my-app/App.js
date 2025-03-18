/* eslint-disable no-console */
import { NavigationContainer } from '@react-navigation/native'
import { useEffect, useRef } from 'react'
import { Linking } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { AuthProvider } from './src/context/AuthContext'
import { CartProvider } from './src/context/CartContext'
import { OrderProvider } from './src/context/OrderContext'
import AppNavigator from './src/navigator/AppNavigator'
import { toastConfig } from './src/utils/toast'
export default function App() {
  const navigationRef = useRef(null)

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url
      console.log('Deep Link URL:', url)

      if (url.includes('com.anonymous.myapp://payment')) {
        const regex = /[?&]([^=#]+)=([^&#]*)/g
        const params = {}
        let match
        while ((match = regex.exec(url))) {
          params[match[1]] = decodeURIComponent(match[2])
        }

        const appTransId = params.apptransid
        console.log('appTransId:', appTransId)

        // Điều hướng chỉ khi navigationRef đã có giá trị
        if (navigationRef.current) {
          navigationRef.current.navigate('OrderConfirmationScreen', {
            appTransId: appTransId,
            fromDeepLink: true
          })
        } else {
          console.log('Navigation ref chưa sẵn sàng, chờ một chút...')
          setTimeout(() => {
            if (navigationRef.current) {
              navigationRef.current.navigate('OrderConfirmationScreen', {
                appTransId: appTransId,
                fromDeepLink: true
              })
            }
          }, 1000)
        }
      }
    }

    // Lắng nghe deeplink khi app đang mở
    const linkingEventListener = Linking.addEventListener('url', handleDeepLink)

    // Kiểm tra deeplink nếu app được mở từ trạng thái bị đóng
    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) {
        handleDeepLink({ url: initialUrl })
      }
    })

    return () => {
      linkingEventListener.remove()
    }
  }, [])

  return (
    <>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <SafeAreaProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer ref={navigationRef}>
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
