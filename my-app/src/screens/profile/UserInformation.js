import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, Modal, ActivityIndicator } from 'react-native'

import { styles, COLORS } from '../../styles/styles'

// Màn hình chỉnh sửa thông tin cá nhân
export default function UserInformation({ route, navigation }) {
  const { user } = route.params
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    birthDate: '01/01/1990',
    gender: 'Nữ',
  })
  const [avatar, setAvatar] = useState(user.avatar)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert('Cần quyền truy cập', 'Ứng dụng cần quyền truy cập thư viện ảnh.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    })

    if (!result.canceled) {
      setAvatar(result.assets[0].uri)
    }
  }

  const handleSave = () => {
    setLoading(true)

    // Giả lập API call
    setTimeout(() => {
      setLoading(false)
      Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật.', [{ text: 'OK', onPress: () => navigation.goBack() }])
    }, 1000)
  }
  const handleChangePassword = () => {
    navigation.navigate('ChangePasswordScreen')
  }
  return (
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
          <Image source={{ uri: avatar }} style={styles.avatarLarge} />
          <TouchableOpacity style={styles.changePhotoButton} onPress={handlePickImage}>
            <Text style={styles.changePhotoText}>Thay đổi ảnh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Họ và tên</Text>
            <TextInput style={styles.formInput} value={formData.name} onChangeText={(value) => handleInputChange('name', value)} />
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
            <TextInput
              style={styles.formInput}
              value={formData.birthDate}
              onChangeText={(value) => handleInputChange('birthDate', value)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Giới tính</Text>
            <View style={styles.radioContainer}>
              {['Nam', 'Nữ', 'Khác'].map((option) => (
                <TouchableOpacity key={option} style={styles.radioOption} onPress={() => handleInputChange('gender', option)}>
                  <View style={styles.radioCircle}>{formData.gender === option && <View style={styles.radioSelected} />}</View>
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

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator size='small' color={COLORS.text.light} /> : <Text style={styles.saveButtonText}>Lưu thay đổi</Text>}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  )
}

