import { Ionicons } from '@expo/vector-icons'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native'
import { StyleSheet } from 'react-native'
import { CheckBox } from 'react-native-elements'
import Toast from 'react-native-toast-message'

import addressApi from '../../src/apis/address.api'
import { COLORS } from '../../src/styles/styles'
import { getDistrictName, getProvinceName, getWardName } from '../../src/utils/address'

export default function MyAddressScreen() {
  const nav = useNavigation()
  const route = useRoute
  const fromCheckout = route.params?.fromCheckout || false

  const [selectedAddress, setSelectedAddress] = useState(null)

  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  console.log(fromCheckout)

  // State cho danh sách tỉnh/thành phố, quận/huyện, xã/phường
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  // State cho tên hiển thị
  const [provinceName, setProvinceName] = useState('')
  const [districtName, setDistrictName] = useState('')
  const [wardName, setWardName] = useState('')

  const [addresses, setAddresses] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  const getAllAddresses = async () => {
    try {
      setIsLoading(true)

      const response = await addressApi.getAddresses()
      const addresses = response.data.result

      // Sau khi lấy danh sách địa chỉ, cần map lại dữ liệu để hiển thị tên
      const updatedAddresses = await Promise.all(
        addresses.map(async (addr) => {
          const provinceName = await getProvinceName(addr.province_code)
          const districtName = await getDistrictName(addr.province_code, addr.district_code)
          const wardName = await getWardName(addr.district_code, addr.ward_code)

          return {
            ...addr,
            provinceName,
            districtName,
            wardName
          }
        })
      )

      setAddresses(updatedAddresses)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa chỉ:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      getAllAddresses()
    }, [])
  )

  const handleDelete = async (addressId) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa địa chỉ này?', [
      {
        text: 'Hủy',
        style: 'cancel'
      },
      {
        text: 'Xóa',
        onPress: async () => {
          try {
            await addressApi.deleteAddress(addressId)
            getAllAddresses()
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: error.response?.data.message
            })
          }
        }
      }
    ])
  }

  const handleEdit = async (address) => {
    setPhone(address.phone_number)
    setAddress(address.address)
    setName(address.receiver_name)
    setIsDefault(address.is_default)
    setProvinceName(address.provinceName)
    setDistrictName(address.districtName)
    setWardName(address.wardName)

    nav.navigate('EditAddressScreen', { updatedAddress: address })
  }

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Địa chỉ của tôi</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => nav.navigate('AddAddressScreen')}>
          <AntDesign name='plus' size={16} color={COLORS.text.light} />
          <Text style={styles.addButtonText}>Thêm địa chỉ</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size='large' color={COLORS.primary} />
      ) : addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name='location-outline' size={64} color={COLORS.text.medium} />
          <Text style={styles.emptyText}>Bạn chưa có địa chỉ nào</Text>
          <TouchableOpacity style={styles.emptyAddButton} onPress={() => nav.navigate('AddAddressScreen')}>
            <Text style={styles.emptyAddButtonText}>Thêm địa chỉ mới</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {addresses &&
            addresses.map((address) => (
              <View key={address._id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <View style={styles.nameContainer}>
                    {fromCheckout && (
                      <CheckBox
                        checked={selectedAddress === address._id}
                        onPress={() => setSelectedAddress(address._id)}
                        containerStyle={{ padding: 0, margin: 0 }}
                      />
                    )}
                    <Text style={styles.name}>{address.receiver_name}</Text>
                    {address.is_default && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Mặc định</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(address)}>
                      <MaterialIcons name='edit' size={20} color={COLORS.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(address._id)}>
                      <MaterialIcons name='delete-outline' size={20} color='#FF3B30' />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.addressDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name='call-outline' size={16} color={COLORS.text.medium} />
                    <Text style={styles.detailText}>{address.phone_number}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name='location-outline' size={16} color={COLORS.text.medium} />
                    <Text style={styles.detailText}>
                      {address.address}, {address.wardName}, {address.districtName}, {address.provinceName}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9'
  },
  placeholderText: {
    color: '#999'
  },
  valueText: {
    color: '#333'
  },
  disabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemContainer: {
    padding: 16
  },
  itemText: {
    fontSize: 16
  },
  separator: {
    height: 1,
    backgroundColor: '#eee'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.dark
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  addButtonText: {
    color: COLORS.text.light,
    fontWeight: '600',
    marginLeft: 4
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text.medium,
    marginTop: 16,
    marginBottom: 24
  },
  emptyAddButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8
  },
  emptyAddButtonText: {
    color: COLORS.text.light,
    fontWeight: '600',
    fontSize: 16
  },
  addressCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.text.dark
  },
  defaultBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8
  },
  defaultText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '500'
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  editButton: {
    marginRight: 12
  },
  deleteButton: {
    marginLeft: 8
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12
  },
  addressDetails: {
    marginTop: 8
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  detailText: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginLeft: 8
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.background.card,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 16,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 12
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.text.dark,
    marginBottom: 4
  },
  textInput: {
    backgroundColor: COLORS.background.main,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text.dark
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  switchLabel: {
    fontSize: 14,
    color: COLORS.text.dark
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: COLORS.background.main,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8
  },
  cancelButtonText: {
    color: COLORS.text.dark,
    fontWeight: '600',
    fontSize: 14
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 8
  },
  saveButtonText: {
    color: COLORS.text.light,
    fontWeight: '600',
    fontSize: 14
  },
  bottomSpacer: {
    height: 20
  }
})
