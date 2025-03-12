import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

export default function Header() {
  const navigation = useNavigation()
  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput style={styles.searchBarInput} placeholder='Tìm sản phẩm...' />
        </View>

        <Feather name='box' size={30} color='#3D3D3D' />
        <TouchableOpacity onPress={() => navigation.navigate('StackNavigator', { screen: 'CartScreen' })}>
          <AntDesign name='shoppingcart' size={30} color='#3D3D3D' />
        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 3,
    marginTop: 10
  },
  searchBarInput: {
    marginHorizontal: 10,
    borderWidth: 0.2,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fafafa'
  },
  searchBarContainer: {
    flexGrow: 1,
    marginVertical: 10
  }
})
