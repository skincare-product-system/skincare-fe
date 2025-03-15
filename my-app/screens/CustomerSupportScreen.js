import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import supportApi from '../src/apis/supportApi' // Import API

export default function CustomerSupportScreen() {
  const navigation = useNavigation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ họ tên, email và nội dung.')
      return
    }

    setLoading(true)

    try {
      const response = await supportApi.sendSupportRequest(formData) // Sử dụng supportApi
      setLoading(false)
      Alert.alert('Thành công', 'Yêu cầu hỗ trợ của bạn đã được gửi!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ])
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      setLoading(false)
      console.error('Lỗi khi gửi yêu cầu hỗ trợ:', error)
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu. Vui lòng thử lại sau.')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color='#333' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hỗ trợ khách hàng</Text>
      </View>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.subtitle}>
          Vui lòng điền thông tin bên dưới để gửi yêu cầu hỗ trợ. Chúng tôi sẽ liên hệ lại sớm nhất!
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ và tên *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder='Nhập họ và tên'
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder='Nhập email'
            keyboardType='email-address'
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder='Nhập số điện thoại (tuỳ chọn)'
            keyboardType='phone-pad'
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nội dung yêu cầu *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.message}
            onChangeText={(value) => handleInputChange('message', value)}
            placeholder='Mô tả vấn đề hoặc câu hỏi của bạn'
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>{loading ? 'Đang gửi...' : 'Gửi yêu cầu'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5EE'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  backButton: {
    padding: 5
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10
  },
  formContainer: {
    padding: 20
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 15
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  submitButton: {
    backgroundColor: '#C9A66B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  disabledButton: {
    opacity: 0.6
  }
})
