import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import { COLORS } from '../../styles/styles'

export default function MyAddressScreen({ navigation }) {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường Lê Lợi, Phường Bến Nghé',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      isDefault: true
    },
    {
      id: '2',
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '456 Đường Nguyễn Huệ, Phường Bến Nghé',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      isDefault: false
    }
  ])

  const [editMode, setEditMode] = useState(false)
  const [currentAddress, setCurrentAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [formDistrict, setFormDistrict] = useState('')
  const [formCity, setFormCity] = useState('')
  const [formIsDefault, setFormIsDefault] = useState(false)

  const resetForm = () => {
    setFormName('')
    setFormPhone('')
    setFormAddress('')
    setFormDistrict('')
    setFormCity('')
    setFormIsDefault(false)
    setCurrentAddress(null)
  }

  const handleEdit = (address) => {
    setCurrentAddress(address)
    setFormName(address.name)
    setFormPhone(address.phone)
    setFormAddress(address.address)
    setFormDistrict(address.district)
    setFormCity(address.city)
    setFormIsDefault(address.isDefault)
    setEditMode(true)
  }

  const handleAddNew = () => {
    resetForm()
    setEditMode(true)
  }

  const handleSave = () => {
    // Validation
    if (!formName.trim() || !formPhone.trim() || !formAddress.trim() || !formDistrict.trim() || !formCity.trim()) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin')
      return
    }

    setIsLoading(true)

    // Mô phỏng API call
    setTimeout(() => {
      const newAddress = {
        id: currentAddress ? currentAddress.id : (addresses.length + 1).toString(),
        name: formName,
        phone: formPhone,
        address: formAddress,
        district: formDistrict,
        city: formCity,
        isDefault: formIsDefault
      }

      let updatedAddresses

      if (currentAddress) {
        // Editing existing address
        updatedAddresses = addresses.map((addr) => (addr.id === currentAddress.id ? newAddress : addr))
      } else {
        // Adding new address
        updatedAddresses = [...addresses, newAddress]
      }

      // If this is set as default, update other addresses
      if (formIsDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === newAddress.id
        }))
      }

      setAddresses(updatedAddresses)
      setEditMode(false)
      resetForm()
      setIsLoading(false)
    }, 1000)
  }

  const handleDelete = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa địa chỉ này?', [
      {
        text: 'Hủy',
        style: 'cancel'
      },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setIsLoading(true)
          // Mô phỏng API call
          setTimeout(() => {
            const updatedAddresses = addresses.filter((addr) => addr.id !== id)

            // Nếu xóa địa chỉ mặc định và còn địa chỉ khác, đặt địa chỉ đầu tiên thành mặc định
            if (addresses.find((addr) => addr.id === id)?.isDefault && updatedAddresses.length > 0) {
              updatedAddresses[0].isDefault = true
            }

            setAddresses(updatedAddresses)
            setIsLoading(false)
          }, 1000)
        }
      }
    ])
  }

  const handleCancel = () => {
    setEditMode(false)
    resetForm()
  }

  const renderForm = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.formContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.formTitle}>{currentAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Họ tên người nhận</Text>
          <TextInput
            style={styles.textInput}
            value={formName}
            onChangeText={setFormName}
            placeholder='Nhập họ tên người nhận'
            placeholderTextColor={COLORS.text.medium}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Số điện thoại</Text>
          <TextInput
            style={styles.textInput}
            value={formPhone}
            onChangeText={setFormPhone}
            placeholder='Nhập số điện thoại'
            placeholderTextColor={COLORS.text.medium}
            keyboardType='phone-pad'
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Địa chỉ</Text>
          <TextInput
            style={styles.textInput}
            value={formAddress}
            onChangeText={setFormAddress}
            placeholder='Số nhà, tên đường, phường/xã'
            placeholderTextColor={COLORS.text.medium}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Quận/Huyện</Text>
          <TextInput
            style={styles.textInput}
            value={formDistrict}
            onChangeText={setFormDistrict}
            placeholder='Quận/Huyện'
            placeholderTextColor={COLORS.text.medium}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Tỉnh/Thành phố</Text>
          <TextInput
            style={styles.textInput}
            value={formCity}
            onChangeText={setFormCity}
            placeholder='Tỉnh/Thành phố'
            placeholderTextColor={COLORS.text.medium}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Đặt làm địa chỉ mặc định</Text>
          <Switch
            trackColor={{ false: '#D1D1D6', true: COLORS.primary }}
            thumbColor={formIsDefault ? COLORS.text.light : '#F4F3F4'}
            onValueChange={setFormIsDefault}
            value={formIsDefault}
          />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.text.light} size='small' />
            ) : (
              <Text style={styles.saveButtonText}>Lưu</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )

  const renderAddressList = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Địa chỉ của tôi</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <AntDesign name='plus' size={16} color={COLORS.text.light} />
          <Text style={styles.addButtonText}>Thêm địa chỉ</Text>
        </TouchableOpacity>
      </View>

      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name='location-outline' size={64} color={COLORS.text.medium} />
          <Text style={styles.emptyText}>Bạn chưa có địa chỉ nào</Text>
          <TouchableOpacity style={styles.emptyAddButton} onPress={handleAddNew}>
            <Text style={styles.emptyAddButtonText}>Thêm địa chỉ mới</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{address.name}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Mặc định</Text>
                    </View>
                  )}
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(address)}>
                    <MaterialIcons name='edit' size={20} color={COLORS.primary} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(address.id)}>
                    <MaterialIcons name='delete-outline' size={20} color='#FF3B30' />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.addressDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name='call-outline' size={16} color={COLORS.text.medium} />
                  <Text style={styles.detailText}>{address.phone}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name='location-outline' size={16} color={COLORS.text.medium} />
                  <Text style={styles.detailText}>
                    {address.address}, {address.district}, {address.city}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </>
  )

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      {editMode ? renderForm() : renderAddressList()}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
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
