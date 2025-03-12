import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { CartProvider } from './src/context/CartContext'
import { OrderProvider } from './src/context/OrderContext'
import AppNavigator from './src/navigator/AppNavigator'

export default function App() {
  return (
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
  )
}
