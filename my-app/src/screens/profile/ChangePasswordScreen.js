import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { COLORS, styles } from '../../styles/styles'

export default function ChangePasswordScreen({ navigation }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
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

  const handleChangePassword = () => {
    // Validate form
    if (formData.newPassword !== formData.confirmNewPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp.')
      return
    }

    if (formData.newPassword.length < 8) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 8 ký tự.')
      return
    }

    setLoading(true)

    // Giả lập API call
    setTimeout(() => {
      setLoading(false)
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi.', [{ text: 'OK', onPress: () => navigation.goBack() }])
    }, 1000)
  }

  const handleSendOTP = () => {
    setLoading(true)

    // Giả lập API call
    setTimeout(() => {
      setLoading(false)
      setForgotPasswordModal(false)
      setOtpModal(true)
    }, 1000)
  }

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      Alert.alert('Lỗi', 'Mã OTP phải có 6 chữ số.')
      return
    }

    setLoading(true)

    // Giả lập API call
    setTimeout(() => {
      setLoading(false)
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

        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator size='small' color={COLORS.text.light} />
          ) : (
            <Text style={styles.saveButtonText}>Cập nhật mật khẩu</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal quên mật khẩu */}
      <Modal visible={forgotPasswordModal} transparent={true} animationType='slide'>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quên mật khẩu</Text>
              <TouchableOpacity onPress={() => setForgotPasswordModal(false)}>
                <Ionicons name='close' size={24} color={COLORS.text.dark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalText}>Vui lòng nhập số điện thoại đã đăng ký để nhận mã OTP xác thực.</Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Số điện thoại</Text>
              <TextInput
                style={styles.formInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType='phone-pad'
                placeholder='Nhập số điện thoại'
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSendOTP} disabled={loading}>
              {loading ? (
                <ActivityIndicator size='small' color={COLORS.text.light} />
              ) : (
                <Text style={styles.saveButtonText}>Gửi mã OTP</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal nhập OTP */}
      <Modal visible={otpModal} transparent={true} animationType='slide'>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Xác thực OTP</Text>
              <TouchableOpacity onPress={() => setOtpModal(false)}>
                <Ionicons name='close' size={24} color={COLORS.text.dark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalText}>
              Mã OTP đã được gửi đến số điện thoại {phone}. Vui lòng nhập mã để tiếp tục.
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Mã OTP</Text>
              <TextInput
                style={[styles.formInput, { textAlign: 'center', letterSpacing: 8, fontSize: 18 }]}
                value={otp}
                onChangeText={setOtp}
                keyboardType='number-pad'
                maxLength={6}
                placeholder='_ _ _ _ _ _'
              />
            </View>

            <View style={styles.otpTimeContainer}>
              <Text style={styles.otpTimeText}>Mã có hiệu lực trong: 02:59</Text>
              <TouchableOpacity>
                <Text style={styles.resendText}>Gửi lại mã</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleVerifyOTP} disabled={loading}>
              {loading ? (
                <ActivityIndicator size='small' color={COLORS.text.light} />
              ) : (
                <Text style={styles.saveButtonText}>Xác nhận</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  )
}
