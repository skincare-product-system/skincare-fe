import { useNavigation } from '@react-navigation/native'
import { View, Text, TouchableOpacity } from 'react-native'

export default function ProfileScreen() {
  const nav = useNavigation()
  return (
    <View>
      <TouchableOpacity onPress={() => nav.navigate('StackNavigator', { screen: 'LoginScreen' })}>
        <Text>Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  )
}
