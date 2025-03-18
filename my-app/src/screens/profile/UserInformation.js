/* eslint-disable no-console */
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

import authApi from '../../apis/auth.api'
import DOBPicker from '../../components/DOBPicker/DOBPicker'
import { COLORS, styles } from '../../styles/styles'

// Màn hình chỉnh sửa thông tin cá nhân
export default function UserInformation({ navigation }) {
  const [profile, setProfile] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    avatar_url: '',
    phone: '',
    birthday: '',
    gender: ''
  })
  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await authApi.getMe()
        setProfile(response.data.result)
        setFormData({
          username: response.data.result?.username || '',
          email: response.data.result?.email || '',
          avatar_url: response.data.result?.avatar_url || '',
          phone: response.data.result?.phone || '',
          birthday: response.data.result?.birthday ? new Date(response.data.result?.birthday) : null,
          gender: response.data.result?.gender || ''
        })
        setIsLoading(false)
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: error?.response?.data?.message || 'Có lỗi xảy ra',
          visibilityTime: 2000
        })
      }
    }
    getMe()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert('Cần quyền truy cập', 'Ứng dụng cần quyền truy cập thư viện ảnh.')
      return
    }

    const result = await ImagePicker.pickImageAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5
    })

    if (!result.canceled) {
      setFormData({
        ...formData,
        avatar_url: result.uri
      })
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await authApi.updateMe({ ...formData, birthday: formData.birthday.toISOString() })

      console.log('Response từ API:', response.data)

      if (!response || !response.data) {
        console.error('Lỗi: Response không hợp lệ', response)
        return
      }
      setFormData({
        username: response.data.result?.username || '',
        email: response.data.result?.email || '',
        phone: response.data.result?.phone || '',
        birthDate: response.data.result?.birthday || '',
        gender: response.data.result?.gender || ''
      })

      Toast.show({
        type: 'success',
        text1: 'Cập nhật thông tin thành công',
        visibilityTime: 2000
      })
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error.response.data)
      Toast.show({
        type: 'error',
        text1: 'Cập nhật thất bại',
        text2: error?.response?.data?.message || 'Có lỗi xảy ra',
        visibilityTime: 2000
      })
    }
  }

  const handleChangePassword = () => {
    navigation.navigate('ChangePasswordScreen')
  }
  return (
    <>
      {isLoading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name='arrow-back' size={24} color={COLORS.text.dark} />
              </TouchableOpacity>
              <Text style={styles.screenTitle}>Chỉnh sửa thông tin</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.avatarEditContainer}>
              <Image source={{ uri: formData.avatar_url }} style={styles.avatarLarge} />
              <TouchableOpacity style={styles.changePhotoButton} onPress={handlePickImage}>
                <Text style={styles.changePhotoText}>Thay đổi ảnh</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Họ và tên</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType='email-address'
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Số điện thoại</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType='phone-pad'
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ngày sinh</Text>
                <DOBPicker
                  label='Ngày sinh'
                  value={formData.birthday === null ? '' : formData.birthday}
                  onChange={(date) => setFormData({ ...formData, birthday: date })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Giới tính</Text>
                <View style={styles.radioContainer}>
                  {['Nam', 'Nữ', 'Khác'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioOption}
                      onPress={() => handleInputChange('gender', option)}
                    >
                      <View style={styles.radioCircle}>
                        {formData.gender === option && <View style={styles.radioSelected} />}
                      </View>
                      <Text style={styles.radioText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
              <Ionicons name='lock-closed-outline' size={18} color={COLORS.primaryDark} />
              <Text style={styles.changePasswordText}>Đổi mật khẩu</Text>
              <Ionicons name='chevron-forward' size={18} color={COLORS.primaryDark} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      )}
    </>
  )
}
