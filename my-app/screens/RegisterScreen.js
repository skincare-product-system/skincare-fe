/* eslint-disable no-console */
import { useNavigation } from '@react-navigation/native'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'

import authApi from '../src/apis/auth.api'

const { useState } = require('react')

export default function RegisterScreen() {
  const nav = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})

  const handleRegister = async () => {
    const response = await authApi.register(email, password, username, phone)
  }
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: '600', fontSize: 25, textAlign: 'center', paddingBottom: 20 }}>Đăng Kí</Text>
      <TextInput style={styles.input} placeholder='Nhập Email' value={email} onChangeText={setEmail} />
      {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email.message}</Text>}
      <TextInput
        style={styles.input}
        placeholder='Nhập Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password.message}</Text>}
      <TextInput style={styles.input} placeholder='Nhập username' value={username} onChangeText={setUsername} />
      {errors.username && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username.message}</Text>}
      <TextInput
        keyboardType='numeric'
        style={styles.input}
        placeholder='Nhập sđt'
        value={phone}
        onChangeText={setPhone}
      />
      {errors.phone && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.phone.message}</Text>}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: '#4B5563' }}>Bạn đã có tài khoản?</Text>
        <TouchableOpacity onPress={() => nav.navigate('LoginScreen')}>
          <Text style={{ color: '#4B5563' }}>Đăng nhập ngay</Text>
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
        onPress={() => handleRegister()}
      >
        <Text style={{ fontWeight: '600' }}>Đăng Kí</Text>
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
