import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { COLORS, styles } from '../../styles/styles'

export default function ResetPasswordScreen({ route, navigation }) {
  const { phone } = route.params
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleResetPassword = () => {
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
      Alert.alert('Thành công', 'Mật khẩu đã được đặt lại thành công.', [
        { text: 'OK', onPress: () => navigation.navigate('Account') }
      ])
    }, 1000)
  }

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name='arrow-back' size={24} color={COLORS.text.dark} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Tạo mật khẩu mới</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Ionicons name='checkmark' size={40} color={COLORS.text.light} />
          </View>
          <Text style={styles.successText}>Xác thực thành công</Text>
          <Text style={styles.successSubtext}>Vui lòng tạo mật khẩu mới cho tài khoản</Text>
        </View>

        <View style={styles.formContainer}>
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

        <TouchableOpacity style={styles.saveButton} onPress={handleResetPassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator size='small' color={COLORS.text.light} />
          ) : (
            <Text style={styles.saveButtonText}>Cập nhật mật khẩu</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  )
}
