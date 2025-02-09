import { createStackNavigator } from '@react-navigation/stack'

import { HomeScreen, ProductListScreen } from '../../screens'

const Stack = createStackNavigator()

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='ProductList' component={ProductListScreen} />
    </Stack.Navigator>
  )
}
