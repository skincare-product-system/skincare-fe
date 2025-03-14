/* eslint-disable no-console */
import { useNavigation } from '@react-navigation/native'
import { HttpStatusCode } from 'axios'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { View, Text, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'

import authApi from '../src/apis/auth.api'
import { useAuth } from '../src/context/AuthContext'
import { isAxiosUnprocessableEntity } from '../src/utils/utils'
import Toast from 'react-native-toast-message'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigation()
  const { setIsAuthenticated, setProfile } = useAuth()
  const {
    control,
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
        // ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT)
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
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: '600', fontSize: 25, textAlign: 'center', paddingBottom: 20 }}>Đăng Nhập</Text>
      <TextInput
        autoCapitalize='none'
        placeholder='Nhập Email'
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email.message}</Text>}

      <TextInput
        autoCapitalize='none'
        placeholder='Nhập Password'
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password.message}</Text>}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: '#4B5563' }}>Bạn chưa có tài khoản?</Text>
        <TouchableOpacity onPress={() => nav.navigate('RegisterScreen')}>
          <Text style={{ color: '#4B5563' }}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#F0A04B',
          padding: 10,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20
        }}
        onPress={() => handleLogin()}
      >
        <Text style={{ fontWeight: '600' }}>Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = {
  input: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5
  }
}
