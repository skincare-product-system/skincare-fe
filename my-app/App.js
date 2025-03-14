import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { AuthProvider } from './src/context/AuthContext'
import { CartProvider } from './src/context/CartContext'
import { OrderProvider } from './src/context/OrderContext'
import AppNavigator from './src/navigator/AppNavigator'
import { toastConfig } from './src/utils/toast'

export default function App() {
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
