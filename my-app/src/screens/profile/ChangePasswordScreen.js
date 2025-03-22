import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { COLORS, styles } from '../../styles/styles'
import authApi from '../../apis/auth.api'
import Toast from 'react-native-toast-message'

export default function ChangePasswordScreen({ navigation }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [forgotPasswordModal, setForgotPasswordModal] = useState(false)
  const [otpModal, setOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [phone, setPhone] = useState('0912345678')

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleChangePassword = async () => {
    // Validate form
    if (formData.newPassword !== formData.confirmNewPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp.')
      return
    }

    const response = await authApi.changePassword(
      formData.currentPassword,
      formData.newPassword,
      formData.confirmNewPassword
    )
    if (response.status === 200) {
      Toast.show({
        type: 'success',
        text1: response.data.message,

        visibilityTime: 2000
      })
      navigation.goBack()
    }
  }

  const handleSendOTP = () => {
    // Giả lập API call
    setTimeout(() => {
      setForgotPasswordModal(false)
      setOtpModal(true)
    }, 1000)
  }

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      Alert.alert('Lỗi', 'Mã OTP phải có 6 chữ số.')
      return
    }

    // Giả lập API call
    setTimeout(() => {
      setOtpModal(false)

      // Chuyển đến màn hình tạo mật khẩu mới
      navigation.navigate('ResetPassword', { phone })
    }, 1000)
  }

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name='arrow-back' size={24} color={COLORS.text.dark} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Đổi mật khẩu</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Mật khẩu hiện tại</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                autoCapitalize='none'
                value={formData.currentPassword}
                onChangeText={(value) => handleInputChange('currentPassword', value)}
                secureTextEntry={!showCurrentPassword}
                placeholder='Nhập mật khẩu hiện tại'
              />
              <TouchableOpacity
                style={styles.passwordVisibilityButton}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons
                  name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.text.medium}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => setForgotPasswordModal(true)}>
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Mật khẩu mới</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                autoCapitalize='none'
                style={styles.passwordInput}
                value={formData.newPassword}
                onChangeText={(value) => handleInputChange('newPassword', value)}
                secureTextEntry={!showNewPassword}
                placeholder='Nhập mật khẩu mới'
              />
              <TouchableOpacity
                style={styles.passwordVisibilityButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.text.medium}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordHint}>Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Xác nhận mật khẩu mới</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                autoCapitalize='none'
                style={styles.passwordInput}
                value={formData.confirmNewPassword}
                onChangeText={(value) => handleInputChange('confirmNewPassword', value)}
                secureTextEntry={!showConfirmPassword}
                placeholder='Nhập lại mật khẩu mới'
              />
              <TouchableOpacity
                style={styles.passwordVisibilityButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.text.medium}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
          <Text style={styles.saveButtonText}>Cập nhật mật khẩu</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  )
}
