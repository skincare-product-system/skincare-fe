/* eslint-disable no-console */
import { useNavigation } from '@react-navigation/native'
import { HttpStatusCode } from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

import authApi from '../src/apis/auth.api'
import { useAuth } from '../src/context/AuthContext'
import { isAxiosUnprocessableEntity } from '../src/utils/utils'
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

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const nav = useNavigation()
  const { setIsAuthenticated, setProfile } = useAuth()
  const {
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm()

  const handleLogin = async () => {
    try {
      const response = await authApi.login(email, password)
      if (response.status === HttpStatusCode.Ok) {
        setIsAuthenticated(true)
        setProfile(response.data.result.user)
        nav.navigate('BottomTabNavigator', { screen: 'Home' })
        Toast.show({
          type: 'success',
          text1: 'Đăng nhập thành công',
          visibilityTime: 2000
        })
      }
    } catch (error) {
      if (isAxiosUnprocessableEntity(error)) {
        const formError = error.response.data.errors
        if (formError.email) {
          setError('email', { type: 'server', message: formError.email })
        }
        if (formError.password) {
          setError('password', { type: 'server', message: formError.password })
        }
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              <Text style={styles.title}>Đăng Nhập</Text>
              <Text style={styles.subtitle}>Chào mừng bạn trở lại!</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.text.medium} style={styles.inputIcon} />
                  <TextInput
                    autoCapitalize='none'
                    placeholder='Email của bạn'
                    placeholderTextColor={COLORS.text.medium}
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.text.medium} style={styles.inputIcon} />
                  <TextInput
                    autoCapitalize='none'
                    placeholder='Mật khẩu'
                    placeholderTextColor={COLORS.text.medium}
                    style={[styles.input, { flex: 1 }]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
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
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>

              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryDark]}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.loginButtonText}>Đăng Nhập</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
                <TouchableOpacity onPress={() => nav.navigate('RegisterScreen')}>
                  <Text style={styles.registerLink}>Đăng ký ngay</Text>
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
  loginButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    padding: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: COLORS.text.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: COLORS.text.medium,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
