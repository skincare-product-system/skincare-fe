import { Button, Text, View } from 'react-native'

function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button title='Go to Details' onPress={() => navigation.navigate('Details')} />
    </View>
  )
}

export default HomeScreen
