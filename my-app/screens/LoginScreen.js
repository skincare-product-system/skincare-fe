// /* eslint-disable no-console */
// import { useNavigation } from '@react-navigation/native'
// import { HttpStatusCode } from 'axios'
// import React, { useState } from 'react'
// import { useForm, Controller } from 'react-hook-form'
// import { View, Text, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
// import Toast from 'react-native-toast-message'

// import authApi from '../src/apis/auth.api'
// import { useAuth } from '../src/context/AuthContext'
// import { isAxiosUnprocessableEntity } from '../src/utils/utils'

// export default function LoginScreen() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const nav = useNavigation()
//   const { setIsAuthenticated, setProfile } = useAuth()
//   const {
//     control,
//     handleSubmit,
//     setError,
//     formState: { errors }
//   } = useForm()
//   const handleLogin = async () => {
//     try {
//       const response = await authApi.login(email, password)
//       if (response.status === HttpStatusCode.Ok) {
//         setIsAuthenticated(true)
//         setProfile(response.data.result.user)
//         nav.navigate('BottomTabNavigator', { screen: 'Home' })
//         // ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT)
//         Toast.show({
//           type: 'success',
//           text1: 'Đăng nhập thành công',
//           visibilityTime: 2000
//         })
//       }
//     } catch (error) {
//       if (isAxiosUnprocessableEntity(error)) {
//         const formError = error.response.data.errors
//         if (formError.email) {
//           setError('email', { type: 'server', message: formError.email })
//         }
//         if (formError.password) {
//           setError('password', { type: 'server', message: formError.password })
//         }
//       }
//     }
//   }
//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontWeight: '600', fontSize: 25, textAlign: 'center', paddingBottom: 20 }}>Đăng Nhập</Text>
//       <TextInput
//         autoCapitalize='none'
//         placeholder='Nhập Email'
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//       />
//       {errors.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email.message}</Text>}

//       <TextInput
//         autoCapitalize='none'
//         placeholder='Nhập Password'
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       {errors.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password.message}</Text>}
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//         <Text style={{ color: '#4B5563' }}>Bạn chưa có tài khoản?</Text>
//         <TouchableOpacity onPress={() => nav.navigate('RegisterScreen')}>
//           <Text style={{ color: '#4B5563' }}>Đăng ký ngay</Text>
//         </TouchableOpacity>
//       </View>
//       <TouchableOpacity
//         style={{
//           backgroundColor: '#F0A04B',
//           padding: 10,
//           borderRadius: 5,
//           justifyContent: 'center',
//           alignItems: 'center',
//           marginTop: 20
//         }}
//         onPress={() => handleLogin()}
//       >
//         <Text style={{ fontWeight: '600' }}>Đăng Nhập</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// const styles = {
//   input: {
//     padding: 10,
//     marginVertical: 5,
//     borderWidth: 1,
//     borderRadius: 5
//   }
// }

/* eslint-disable no-console */
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { HttpStatusCode } from 'axios'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Image
} from 'react-native'
import Svg, { Path } from 'react-native-svg'
import Toast from 'react-native-toast-message'

import authApi from '../src/apis/auth.api'
import { useAuth } from '../src/context/AuthContext'
import { isAxiosUnprocessableEntity } from '../src/utils/utils'

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
    light: '#FFFFFF'
  },
  background: {
    main: '#FAF5EE',
    card: '#FFFFFF'
  },
  border: '#D4B08A'
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
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.logoContainer}>
              {/* <Image source={require('../assets/splash-icon.png')} style={styles.logo} resizeMode='contain' /> */}
              <Svg width='100' height='26' viewBox='0 0 100 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <Path
                  d='M45.8649 21.7973C42.538 21.7973 40.3071 19.5579 40.3071 16.2073C40.3071 12.8567 42.538 10.6326 45.8649 10.6326C49.1918 10.6326 51.4041 12.8703 51.4041 16.2073C51.4041 19.5444 49.1731 21.7973 45.8649 21.7973ZM45.8734 6.42658C39.6787 6.42658 35.5234 10.348 35.5234 16.1938C35.5234 22.0751 39.6787 25.9966 45.8734 25.9966C52.0325 25.9966 56.186 22.0751 56.186 16.1938C56.186 10.348 52.0325 6.42658 45.8734 6.42658Z'
                  fill='#67645E'
                ></Path>
                <Path
                  d='M11.7525 6.47027C11.8789 6.46892 12.0007 6.51772 12.0912 6.60598C12.1817 6.69425 12.2335 6.81479 12.2353 6.94119V10.6424C12.2335 10.7338 12.1979 10.8213 12.1353 10.888C12.0727 10.9546 11.9876 10.9957 11.8965 11.0032C11.1037 11.049 9.08286 10.6221 7.43636 11.2912C6.88218 11.5524 6.3947 11.9363 6.01083 12.4138C5.62696 12.8913 5.35676 13.4499 5.2207 14.0472C4.99541 15.0179 5.01743 23.1098 5.02759 25.1594C5.02693 25.2219 5.01396 25.2837 4.98942 25.3412C4.96488 25.3987 4.92926 25.4508 4.88459 25.4945C4.83992 25.5383 4.78707 25.5728 4.72906 25.5961C4.67105 25.6194 4.60902 25.631 4.54651 25.6303H0.481076C0.418567 25.631 0.356538 25.6194 0.29853 25.5961C0.240523 25.5728 0.187675 25.5383 0.143002 25.4945C0.098329 25.4508 0.0627064 25.3987 0.0381701 25.3412C0.0136338 25.2837 0.000663799 25.2219 0 25.1594L0 7.3562C0.000663047 7.28621 0.0151358 7.21703 0.0425874 7.15264C0.070039 7.08825 0.10993 7.02991 0.159973 6.98097C0.210017 6.93203 0.269228 6.89344 0.334213 6.86743C0.399198 6.84142 0.468679 6.82849 0.538671 6.82939H4.32122C4.45932 6.82792 4.59261 6.88004 4.69307 6.97482C4.79352 7.06959 4.85332 7.19962 4.85989 7.33757L4.88361 8.40644C4.88611 8.46891 4.90948 8.52873 4.94999 8.57635C4.9905 8.62397 5.0458 8.65664 5.10706 8.66912C5.16832 8.68161 5.232 8.6732 5.28791 8.64523C5.34383 8.61726 5.38875 8.57136 5.4155 8.51485C5.81866 7.66788 6.43186 6.909 7.1467 6.65153C7.5131 6.52333 7.89854 6.45804 8.28672 6.45842L11.7525 6.47027Z'
                  fill='#67645E'
                ></Path>
                <Path
                  d='M33.6076 14.0068V25.1614C33.6069 25.224 33.5939 25.2859 33.5692 25.3435C33.5446 25.4011 33.5088 25.4533 33.464 25.4971C33.4191 25.5408 33.3661 25.5753 33.3079 25.5985C33.2497 25.6217 33.1874 25.6332 33.1248 25.6323H29.0594C28.9329 25.6336 28.8112 25.5848 28.7207 25.4966C28.6302 25.4083 28.5784 25.2878 28.5766 25.1614V14.803C28.5766 12.2722 26.7285 10.6088 23.9166 10.6088H21.003C20.7762 10.6061 20.5511 10.6482 20.3405 10.7325C20.1299 10.8169 19.9381 10.942 19.7759 11.1005C19.6137 11.2591 19.4843 11.4481 19.3952 11.6567C19.3061 11.8653 19.259 12.0894 19.2566 12.3163V25.1614C19.2559 25.224 19.2429 25.2859 19.2182 25.3435C19.1936 25.4011 19.1578 25.4533 19.113 25.4971C19.0681 25.5408 19.0151 25.5753 18.9569 25.5985C18.8987 25.6217 18.8364 25.6332 18.7738 25.6323H14.7084C14.582 25.6336 14.4602 25.5848 14.3697 25.4966C14.2792 25.4083 14.2274 25.2878 14.2256 25.1614L14.2256 0.616282C14.2274 0.489885 14.2792 0.369349 14.3697 0.28108C14.4602 0.192814 14.582 0.144012 14.7084 0.145369H18.7738C18.9002 0.144012 19.022 0.192814 19.1125 0.28108C19.203 0.369349 19.2548 0.489885 19.2566 0.616282V5.94201C19.2579 6.0684 19.3093 6.18912 19.3995 6.2777C19.4896 6.36628 19.6112 6.41551 19.7376 6.41461H25.6952C30.4382 6.43155 33.6076 9.46369 33.6076 14.0051'
                  fill='#67645E'
                ></Path>
                <Path
                  d='M73.5606 16.6856C73.5606 19.4908 71.2348 21.7674 68.3653 21.7674C65.4957 21.7674 63.1717 19.4942 63.1717 16.6856V15.7387C63.1717 12.9336 65.4974 10.6569 68.3653 10.6569H71.9513C72.1602 10.6545 72.3675 10.6932 72.5615 10.7708C72.7554 10.8485 72.9321 10.9636 73.0815 11.1096C73.231 11.2556 73.3502 11.4295 73.4324 11.6216C73.5146 11.8137 73.5581 12.02 73.5606 12.2289V16.6856ZM77.7259 0.146078H74.4177C74.305 0.143826 74.1931 0.164068 74.0884 0.205622C73.9836 0.247177 73.8883 0.309206 73.8078 0.388079C73.7274 0.466953 73.6635 0.561085 73.6198 0.664963C73.5762 0.768843 73.5538 0.880379 73.5538 0.993044V5.77332C73.5498 5.95559 73.4741 6.12894 73.3431 6.25578C73.2122 6.38262 73.0365 6.45272 72.8542 6.45089H67.5302C67.52 6.45089 67.5098 6.45089 67.498 6.45089C62.0977 6.45089 57.9561 10.5367 57.9561 16.6484C57.9561 22.65 62.0977 25.9819 67.498 25.9819C69.7119 25.9819 71.5126 25.3416 72.8559 24.2135C73.4115 23.7459 73.5335 24.0881 73.5606 24.803C73.5809 25.2569 73.6351 25.6194 74.5549 25.6194H77.7259C77.8386 25.6217 77.9505 25.6014 78.0553 25.5599C78.16 25.5183 78.2554 25.4563 78.3358 25.3774C78.4163 25.2986 78.4802 25.2044 78.5238 25.1005C78.5674 24.9967 78.5899 24.8851 78.5898 24.7725V0.993044C78.5899 0.880379 78.5674 0.768843 78.5238 0.664963C78.4802 0.561085 78.4163 0.466953 78.3358 0.388079C78.2554 0.309206 78.16 0.247177 78.0553 0.205622C77.9505 0.164068 77.8386 0.143826 77.7259 0.146078Z'
                  fill='#67645E'
                ></Path>
                <Path
                  d='M90.2671 10.6247C92.3506 10.6247 94.4206 11.89 94.5188 13.8652C94.5191 13.8844 94.5155 13.9034 94.5082 13.9212C94.501 13.939 94.4903 13.9551 94.4767 13.9687C94.4631 13.9822 94.447 13.993 94.4292 14.0002C94.4114 14.0074 94.3924 14.0111 94.3732 14.0108H86.0255C86.0063 14.0113 85.9872 14.0079 85.9694 14.0007C85.9516 13.9935 85.9355 13.9828 85.922 13.9691C85.9085 13.9555 85.8979 13.9392 85.891 13.9213C85.884 13.9034 85.8808 13.8843 85.8815 13.8652C85.9865 11.9307 88.1734 10.6247 90.2671 10.6247ZM99.1246 17.9086C99.3281 17.9125 99.5257 17.8406 99.6791 17.707C99.8325 17.5733 99.9307 17.3873 99.9547 17.1853C99.9852 16.8634 100 16.5342 100 16.1977C100 10.3452 96.2196 6.42202 90.2586 6.43049C84.5348 6.43896 80.3999 10.6924 80.4338 16.2892C80.4745 22.1197 84.318 26.0005 90.2722 26.0005C94.551 26.0005 97.5815 23.9678 99.0806 20.6426C99.1095 20.5713 99.1203 20.4939 99.1119 20.4175C99.1036 20.341 99.0763 20.2678 99.0326 20.2045C98.989 20.1412 98.9302 20.0897 98.8617 20.0547C98.7932 20.0197 98.7171 20.0022 98.6402 20.004H94.3325C94.1657 20.0078 94.0013 20.0453 93.8493 20.1143C93.6974 20.1833 93.5609 20.2823 93.4483 20.4054C92.5928 21.288 91.6646 21.8012 90.2688 21.8012C87.838 21.8012 85.8764 20.3072 85.8764 17.9052L99.1246 17.9086Z'
                  fill='#67645E'
                ></Path>
              </Svg>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Đăng Nhập</Text>
              <Text style={styles.subtitle}>Chào mừng bạn trở lại!</Text>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name='mail-outline' size={20} color={COLORS.text.medium} style={styles.inputIcon} />
                  <TextInput
                    autoCapitalize='none'
                    placeholder='Email của bạn'
                    placeholderTextColor={COLORS.text.medium}
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <View style={styles.inputWrapper}>
                  <Ionicons name='lock-closed-outline' size={20} color={COLORS.text.medium} style={styles.inputIcon} />
                  <TextInput
                    autoCapitalize='none'
                    placeholder='Mật khẩu'
                    placeholderTextColor={COLORS.text.medium}
                    style={[styles.input, { flex: 1 }]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={COLORS.text.medium}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
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
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20
  },
  logo: {
    width: 150,
    height: 150
  },
  formContainer: {
    backgroundColor: COLORS.background.card,
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    shadowColor: COLORS.text.dark,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.medium,
    textAlign: 'center',
    marginBottom: 30
  },
  inputContainer: {
    marginBottom: 20
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.main,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  inputIcon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: COLORS.text.dark
  },
  eyeIcon: {
    padding: 10
  },
  errorText: {
    color: '#ff3333',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden'
  },
  gradientButton: {
    padding: 15,
    alignItems: 'center'
  },
  loginButtonText: {
    color: COLORS.text.light,
    fontSize: 16,
    fontWeight: 'bold'
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  registerText: {
    color: COLORS.text.medium,
    fontSize: 14
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold'
  }
})
