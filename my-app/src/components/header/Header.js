import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { useCart } from '../../context/CartContext'

export default function Header() {
  const { cartTotal } = useCart()
  const navigation = useNavigation()

  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('StackNavigator', { screen: 'SearchScreen' })}
          style={styles.searchBarContainer}
          activeOpacity={1}
        >
          <TextInput style={styles.searchBarInput} placeholder='Tìm sản phẩm...' editable={false} />
        </TouchableOpacity>

        <Feather name='box' size={30} color='#3D3D3D' />

        <TouchableOpacity onPress={() => navigation.navigate('StackNavigator', { screen: 'CartScreen' })}>
          <View style={{ position: 'relative', width: 40, alignItems: 'center' }}>
            <AntDesign name='shoppingcart' size={30} color='#3D3D3D' />

            {/* Bubble hiển thị số lượng */}
            <View
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                backgroundColor: 'red',
                borderRadius: 10,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'white',
                zIndex: 1
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 'bold',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cartTotal}
              </Text>
            </View>
          </View>
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
