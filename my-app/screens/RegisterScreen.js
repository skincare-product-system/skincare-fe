/* eslint-disable no-console */
import { useNavigation } from '@react-navigation/native'
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import authApi from '../src/apis/auth.api'
import Toast from 'react-native-toast-message'

const COLORS = {
  primary: '#C9A66B',
  primaryDark: '#A67C4E',
  secondary: '#F5E8DA',
  accent: '#E6B17E',
  gradientStart: '#FDF8F1',
  gradientEnd: '#EAD8C0',
  text: {
    dark: '#3D2E1E',
    medium: '#6E5B48',
    light: '#FFFFFF',
  },
  background: {
    main: '#FAF5EE',
    card: '#FFFFFF',
  },
  border: '#D4B08A',
}

export default function RegisterScreen() {
  const nav = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = async () => {
    try {
      const response = await authApi.register(email, password, username, phone)
      if (response) {
        Toast.show({
          type: 'success',
          text1: 'Đăng ký thành công',
          visibilityTime: 2000
        })
        nav.navigate('LoginScreen')
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    }
  }

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/splash-icon.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Đăng Ký</Text>
              <Text style={styles.subtitle}>Tham gia cùng chúng tôi</Text>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.text.medium} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder='Email của bạn'
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor={COLORS.text.medium}
                    autoCapitalize='none'
                    keyboardType="email-address"
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.text.medium} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder='Mật khẩu'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor={COLORS.text.medium}
                    autoCapitalize='none'
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color={COLORS.text.medium}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={COLORS.text.medium} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder='Tên người dùng'
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor={COLORS.text.medium}
                  />
                </View>
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color={COLORS.text.medium} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder='Số điện thoại'
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType='numeric'
                    placeholderTextColor={COLORS.text.medium}
                  />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryDark]}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.registerButtonText}>Đăng Ký</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Đã có tài khoản? </Text>
                <TouchableOpacity 
                  onPress={() => nav.navigate('LoginScreen')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginLink}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  formContainer: {
    backgroundColor: COLORS.background.card,
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    shadowColor: COLORS.text.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.medium,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.main,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: COLORS.text.dark,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: '#ff3333',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  registerButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    padding: 15,
    alignItems: 'center',
  },
  registerButtonText: {
    color: COLORS.text.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: COLORS.text.medium,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
