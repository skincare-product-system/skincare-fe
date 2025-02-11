import { DrawerActions, useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

export default function Header() {
  const navigation = useNavigation()
  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Svg width='24' height='24' viewBox='0 0 1024 1024' fill='black'>
            <Path d='M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z' />
          </Svg>
        </TouchableOpacity>
        <Text>Beauty Box</Text>
        <View>
          <Svg width='28' height='28' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='black' viewBox='0 0 24 24'>
            <Path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
            />
          </Svg>
        </View>
      </View>

      <View style={styles.searchBarContainer}>
        <TextInput style={styles.searchBarInput} placeholder='Tìm sản phẩm...' />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginTop: 20
  },
  searchBarInput: {
    marginHorizontal: 10,
    borderWidth: 0.2,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fafafa'
  },
  searchBarContainer: {
    marginVertical: 10
  }
})
