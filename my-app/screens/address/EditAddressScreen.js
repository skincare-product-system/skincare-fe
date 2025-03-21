import { Ionicons } from '@expo/vector-icons'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  SafeAreaView,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import Toast from 'react-native-toast-message'

import addressApi from '../../src/apis/address.api'
import shipApi from '../../src/apis/ship.api'
import { COLORS } from '../../src/styles/styles'
import { getDistrictName, getProvinceName, getWardName } from '../../src/utils/address'

export default function EditAddressScreen() {
  const nav = useNavigation()
  const route = useRoute()
  const { updatedAddress } = route.params
  console.log(updatedAddress)

  const [phone, setPhone] = useState(updatedAddress.phone_number)
  const [address, setAddress] = useState(updatedAddress.address)
  const [name, setName] = useState(updatedAddress.receiver_name)
  const [isDefault, setIsDefault] = useState(updatedAddress.is_default)

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  // State cho giá trị đã chọn
  const [selectedProvince, setSelectedProvince] = useState(updatedAddress.provinceCode)
  const [selectedDistrict, setSelectedDistrict] = useState(updatedAddress.districtCode)
  const [selectedWard, setSelectedWard] = useState(updatedAddress.wardCode)
  console.log(selectedProvince, selectedDistrict, selectedWard)

  // State cho tên hiển thị
  const [provinceName, setProvinceName] = useState(updatedAddress.provinceName)
  const [districtName, setDistrictName] = useState(updatedAddress.districtName)
  const [wardName, setWardName] = useState(updatedAddress.wardName)

  // State cho modal
  const [provinceModalVisible, setProvinceModalVisible] = useState(false)
  const [districtModalVisible, setDistrictModalVisible] = useState(false)
  const [wardModalVisible, setWardModalVisible] = useState(false)

  const [addresses, setAddresses] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  // Fetch tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await shipApi.getProvinces()
        setProvinces(response.data)
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh:', error)
      }
    }

    fetchProvinces()
  }, [])

  // Fetch quận/huyện khi chọn tỉnh
  useEffect(() => {
    if (!selectedProvince) return

    const fetchDistricts = async () => {
      try {
        const response = await shipApi.getDistricts(selectedProvince)

        setDistricts(response.data)
        // Reset quận/huyện và phường/xã đã chọn
        setSelectedDistrict(null)
        setDistrictName('')
        setSelectedWard(null)
        setWardName('')
        setWards([])
      } catch (error) {
        console.error('Lỗi khi lấy danh sách quận/huyện:', error)
      }
    }

    fetchDistricts()
  }, [selectedProvince])

  // Fetch phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (!selectedDistrict) return

    const fetchWards = async () => {
      try {
        const response = await shipApi.getWards(selectedDistrict)
        setWards(response.data)
        // Reset phường/xã đã chọn
        setSelectedWard(null)
        setWardName('')
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phường/xã:', error)
      }
    }

    fetchWards()
  }, [selectedDistrict])

  // Xử lý khi chọn tỉnh/thành phố
  const handleSelectProvince = (province) => {
    setSelectedProvince(province.ProvinceID)
    setProvinceName(province.ProvinceName)
    setProvinceModalVisible(false)
  }

  // Xử lý khi chọn quận/huyện
  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district.DistrictID)
    setDistrictName(district.DistrictName)
    setDistrictModalVisible(false)
  }

  // Xử lý khi chọn phường/xã
  const handleSelectWard = (ward) => {
    setSelectedWard(ward.WardCode)
    setWardName(ward.WardName)
    setWardModalVisible(false)
  }

  // Render item cho flatlist
  const renderProvinceItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectProvince(item)}>
      <Text style={styles.itemText}>{item.ProvinceName}</Text>
    </TouchableOpacity>
  )

  const renderDistrictItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectDistrict(item)}>
      <Text style={styles.itemText}>{item.DistrictName}</Text>
    </TouchableOpacity>
  )

  const renderWardItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectWard(item)}>
      <Text style={styles.itemText}>{item.WardName}</Text>
    </TouchableOpacity>
  )

  const handleUpdateAddress = async () => {
    console.log(
      'nè: ',
      updatedAddress._id,
      phone,
      selectedWard,
      selectedDistrict,
      selectedProvince,
      name,
      address,
      isDefault
    )

    const response = await addressApi.updateAddress({
      address_id: updatedAddress._id,
      phone_number: phone,
      ward_code: selectedWard,
      district_code: selectedDistrict,
      province_code: selectedProvince,
      receiver_name: name,
      address,
      is_default: isDefault
    })
    console.log(response.data.message, response.data.result)

    if (response.status === 200) {
      Toast.show({
        type: 'success',
        text1: 'Cập nhật địa chỉ thành công'
      })
      nav.goBack()
    } else {
      Toast.show({
        type: 'error',
        text1: response.message
      })
    }
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.formContainer}>
      <View showsVerticalScrollIndicator={false}>
        <Text style={styles.formTitle}>Cập nhật địa chỉ</Text>
        <ScrollView>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 12,
              paddingHorizontal: 10,
              marginVertical: 8
            }}
          >
            <TextInput
              style={{ fontSize: 16, color: '#333' }}
              placeholder='Họ và tên'
              placeholderTextColor='#999'
              value={name}
              onChangeText={setName}
            />
          </View>

          <View
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 12,
              paddingHorizontal: 10,
              marginVertical: 8
            }}
          >
            <TextInput
              style={styles.input}
              placeholder='Nhập số điện thoại'
              keyboardType='phone-pad'
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Chọn Tỉnh/Thành phố */}
          <Text style={styles.label}>Tỉnh/Thành phố</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setProvinceModalVisible(true)}>
            <Text style={provinceName ? styles.valueText : styles.placeholderText}>
              {provinceName || 'Chọn Tỉnh/Thành phố'}
            </Text>
            <Ionicons name='chevron-down' size={20} color='#666' />
          </TouchableOpacity>

          {/* Chọn Quận/Huyện */}
          <Text style={styles.label}>Quận/Huyện</Text>
          <TouchableOpacity
            style={[styles.selector, !selectedProvince && styles.disabled]}
            disabled={!selectedProvince}
            onPress={() => setDistrictModalVisible(true)}
          >
            <Text style={districtName ? styles.valueText : styles.placeholderText}>
              {districtName || 'Chọn Quận/Huyện'}
            </Text>
            <Ionicons name='chevron-down' size={20} color='#666' />
          </TouchableOpacity>

          {/* Chọn Phường/Xã */}
          <Text style={styles.label}>Phường/Xã</Text>
          <TouchableOpacity
            style={[styles.selector, !selectedDistrict && styles.disabled]}
            disabled={!selectedDistrict}
            onPress={() => setWardModalVisible(true)}
          >
            <Text style={wardName ? styles.valueText : styles.placeholderText}>{wardName || 'Chọn Phường/Xã'}</Text>
            <Ionicons name='chevron-down' size={20} color='#666' />
          </TouchableOpacity>

          {/* Modal cho Tỉnh/Thành phố */}
          <Modal visible={provinceModalVisible} animationType='slide' transparent={false}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn Tỉnh/Thành phố</Text>
                <TouchableOpacity onPress={() => setProvinceModalVisible(false)}>
                  <Ionicons name='close' size={24} color='#000' />
                </TouchableOpacity>
              </View>
              <FlatList
                data={provinces}
                renderItem={renderProvinceItem}
                keyExtractor={(item) => item.ProvinceID.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </SafeAreaView>
          </Modal>

          {/* Modal cho Quận/Huyện */}
          <Modal visible={districtModalVisible} animationType='slide' transparent={false}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn Quận/Huyện</Text>
                <TouchableOpacity onPress={() => setDistrictModalVisible(false)}>
                  <Ionicons name='close' size={24} color='#000' />
                </TouchableOpacity>
              </View>
              <FlatList
                data={districts}
                renderItem={renderDistrictItem}
                keyExtractor={(item) => item.DistrictID.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </SafeAreaView>
          </Modal>

          {/* Modal cho Phường/Xã */}
          <Modal visible={wardModalVisible} animationType='slide' transparent={false}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn Phường/Xã</Text>
                <TouchableOpacity onPress={() => setWardModalVisible(false)}>
                  <Ionicons name='close' size={24} color='#000' />
                </TouchableOpacity>
              </View>
              <FlatList
                data={wards}
                renderItem={renderWardItem}
                keyExtractor={(item) => item.WardCode.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </SafeAreaView>
          </Modal>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 12,
              paddingHorizontal: 10,
              marginVertical: 8
            }}
          >
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder='Số nhà, tên đường'
              placeholderTextColor='#999'
            />
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}
          >
            <Text>Đặt làm địa chỉ mặc định</Text>
            <Switch value={isDefault} onValueChange={setIsDefault} />
          </View>
          <TouchableOpacity
            onPress={handleUpdateAddress}
            style={{ backgroundColor: '#f0f0f0', padding: 12, borderRadius: 20, alignItems: 'center' }}
          >
            <Text>Lưu địa chỉ</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
