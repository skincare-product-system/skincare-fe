import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { CartProvider } from './src/context/CartContext'
import { OrderProvider } from './src/context/OrderContext'
import { WishlistProvider } from './src/context/WishlistContext' // Thêm WishlistProvider
import AppNavigator from './src/navigator/AppNavigator'

export default function App() {
  return (
    <WishlistProvider>
      {' '}
      {/* Bọc WishlistProvider ngoài cùng */}
      <OrderProvider>
        <CartProvider>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </SafeAreaView>
          </SafeAreaProvider>
        </CartProvider>
      </OrderProvider>
    </WishlistProvider>
  )
}
