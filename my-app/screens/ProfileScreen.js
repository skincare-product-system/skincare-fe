/* eslint-disable no-console */

import { Feather, MaterialIcons } from '@expo/vector-icons'
import Entypo from '@expo/vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { View, Text, TouchableOpacity, Alert, ScrollView, Image, StyleSheet } from 'react-native'

import { useAuth } from '../src/context/AuthContext'

const COLORS = {
  primary: '#FF80AB', // Main pink color
  primaryDark: '#f26a8d', // Darker pink for buttons and highlights
  secondary: '#FCE4EC', // Very light pink for backgrounds
  accent: '#F06292', // Medium pink for icons and accents
  gradientStart: '#FFEBEE', // Lightest pink for gradient start
  gradientEnd: '#F8BBD0', // Light pink for gradient end
  text: {
    dark: '#424242', // Dark text
    medium: '#757575', // Medium gray text
    light: '#FFFFFF' // White text
  },
  background: {
    main: '#FFF5F7', // Main background color
    card: '#FFFFFF' // Card background
  },
  border: '#F8BBD0' // Border color
}

export default function ProfileScreen() {
  const nav = useNavigation()
  const { isAuthenticated, profile, reset } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleTrackOrder = () => {
    if (isAuthenticated) {
      // nav.navigate('TrackOrderScreen')
    } else {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để kiểm tra đơn hàng.', [
        {
          text: 'Đăng nhập',
          onPress: () => nav.navigate('StackNavigator', { screen: 'LoginScreen' })
        },
        {
          text: 'Đóng'
        }
      ])
    }
  }
  return (
    <View>
      {isAuthenticated ? (
        <ScrollView style={styles.container}>
          {/* Header với thông tin người dùng */}
          <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.headerGradient}>
            <View style={styles.profileHeader}>
              <View style={styles.profileInfo}>
                <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{profile.username}</Text>
                  <Text style={styles.userEmail}>{profile.email}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Phần theo dõi đơn hàng */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đơn hàng của tôi</Text>
            <View style={styles.orderTracking}>
              <TouchableOpacity style={styles.orderStatus}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name='receipt' size={20} color={COLORS.primaryDark} />
                </View>
                <Text style={styles.statusText}>Mới đặt</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.orderStatus}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name='local-shipping' size={20} color={COLORS.primaryDark} />
                </View>
                <Text style={styles.statusText}>Đang xử lý</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.orderStatus}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name='check-circle' size={20} color={COLORS.primaryDark} />
                </View>
                <Text style={styles.statusText}>Thành công</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.orderStatus}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name='cancel' size={20} color={COLORS.primaryDark} />
                </View>
                <Text style={styles.statusText}>Đã hủy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Các tính năng khác */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tài khoản</Text>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Feather name='heart' size={20} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.menuText}>Sản phẩm yêu thích</Text>
              <Feather name='chevron-right' size={20} color='#ccc' />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Feather name='star' size={20} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.menuText}>Đánh giá sản phẩm</Text>
              <Feather name='chevron-right' size={20} color='#ccc' />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Feather name='message-square' size={20} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.menuText}>Lịch sử đánh giá</Text>
              <Feather name='chevron-right' size={20} color='#ccc' />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Feather name='map-pin' size={20} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.menuText}>Địa chỉ của tôi</Text>
              <Feather name='chevron-right' size={20} color='#ccc' />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Feather name='gift' size={20} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.menuText}>Mã giảm giá của tôi</Text>
              <Feather name='chevron-right' size={20} color='#ccc' />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Feather name='bell' size={20} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.menuText}>Thông báo</Text>
              <Feather name='chevron-right' size={20} color='#ccc' />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Feather name='user' size={20} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.menuText}>Thông tin tài khoản</Text>
              <Feather name='chevron-right' size={20} color='#ccc' />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Feather name='help-circle' size={20} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.menuText}>Trợ giúp & Hỗ trợ</Text>
              <Feather name='chevron-right' size={20} color='#ccc' />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={() => reset()}>
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={{ gap: 5 }}>
          <View
            style={{
              backgroundColor: '#FADA7A',
              flexDirection: 'row',
              padding: 20,
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View style={{ width: '60%' }}>
              <Text style={{ fontWeight: '500', fontSize: 16, marginBottom: 10 }}>Beauty Box Xin Chào</Text>
              <Text>Đăng nhập để mua sắm và tra cứu đơn hàng của bạn.</Text>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: '#FFA725', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30 }}
              onPress={() => nav.navigate('LoginScreen')}
            >
              <Text style={{ color: 'white', fontWeight: '500' }}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20
            }}
          >
            <Text style={{ fontWeight: '500' }}>Đơn Hàng Của Bạn</Text>
            <TouchableOpacity onPress={() => handleTrackOrder()} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: '500', color: '#D98324' }}>Kiểm tra đơn</Text>
              <Entypo name='chevron-right' size={24} color='#D98324' />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.main
  },
  container: {
    backgroundColor: COLORS.background.main
  },
  // Styles cho phần đăng nhập
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  loginGradient: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center'
  },
  loginLogo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 100
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 10,
    textAlign: 'center'
  },
  loginSubtitle: {
    fontSize: 14,
    color: COLORS.text.medium,
    textAlign: 'center',
    marginBottom: 30
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15
  },
  loginButtonText: {
    color: COLORS.text.light,
    fontSize: 16,
    fontWeight: 'bold'
  },
  registerButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center'
  },
  registerButtonText: {
    color: COLORS.primaryDark,
    fontSize: 16
  },
  // Styles cho phần profile sau khi đăng nhập
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: COLORS.text.light
  },
  userInfo: {
    marginLeft: 15
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.dark
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginTop: 2
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  userLevel: {
    fontSize: 14,
    color: COLORS.primaryDark,
    marginLeft: 5,
    fontWeight: 'bold'
  },
  pointsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center'
  },
  pointsLabel: {
    fontSize: 12,
    color: COLORS.text.medium
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark
  },
  section: {
    backgroundColor: COLORS.background.card,
    borderRadius: 15,
    padding: 15,
    margin: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 15
  },
  orderTracking: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  orderStatus: {
    alignItems: 'center',
    width: '22%'
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  statusText: {
    fontSize: 12,
    color: COLORS.text.dark,
    textAlign: 'center'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary
  },
  menuIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.dark
  },
  logoutButton: {
    margin: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center'
  },
  logoutButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold'
  }
})
