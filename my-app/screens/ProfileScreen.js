/* eslint-disable no-console */

import { Feather, MaterialIcons } from '@expo/vector-icons'
import Entypo from '@expo/vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { View, Text, TouchableOpacity, Alert, ScrollView, Image, StyleSheet } from 'react-native'

import { useAuth } from '../src/context/AuthContext'

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

export default function ProfileScreen() {
  const nav = useNavigation()
  const { isAuthenticated, profile, reset } = useAuth()
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

  const handleAuthRequired = (screenName) => {
    if (!isAuthenticated) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để sử dụng tính năng này.', [
        {
          text: 'Đăng nhập',
          onPress: () => nav.navigate('StackNavigator', { screen: 'LoginScreen' })
        },
        {
          text: 'Đóng'
        }
      ])
      return true;
    }
    return false;
  }

  const navigateIfAuthenticated = (screenName, params = {}) => {
    if (!handleAuthRequired(screenName)) {
      nav.navigate(screenName, params);
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header section - different for logged in/out states */}
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.headerGradient}>
        <View style={styles.profileHeader}>
          {isAuthenticated ? (
            <View style={styles.profileInfo}>
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{profile.username}</Text>
                <Text style={styles.userEmail}>{profile.email}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.loginContainer}>
              <Text style={styles.welcomeText}>Beauty Box Xin Chào</Text>
              <Text style={styles.loginPrompt}>Đăng nhập để mua sắm và tra cứu đơn hàng của bạn.</Text>
              <View style={styles.authButtonsContainer}>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => nav.navigate('StackNavigator', { screen: 'LoginScreen' })}
                >
                  <Text style={styles.loginBtnText}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={() => nav.navigate('StackNavigator', { screen: 'RegisterScreen' })}
                >
                  <Text style={styles.registerBtnText}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateIfAuthenticated('FavoriteProducts')}
        >
          <View style={styles.menuIconContainer}>
            <Feather name='heart' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText}>Sản phẩm yêu thích</Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateIfAuthenticated('ProductsToReviewScreen', { profile })}
        >
          <View style={styles.menuIconContainer}>
            <Feather name='star' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText}>Đánh giá sản phẩm</Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateIfAuthenticated('ReviewHistoryScreen')}
        >
          <View style={styles.menuIconContainer}>
            <Feather name='message-square' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText}>Lịch sử đánh giá</Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateIfAuthenticated('MyAddressScreen')}
        >
          <View style={styles.menuIconContainer}>
            <Feather name='map-pin' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText}>Địa chỉ của tôi</Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateIfAuthenticated('VoucherScreen')}
        >
          <View style={styles.menuIconContainer}>
            <Feather name='gift' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText}>Mã giảm giá của tôi</Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateIfAuthenticated('NotificationScreen')}
        >
          <View style={styles.menuIconContainer}>
            <Feather name='bell' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText}>Thông báo</Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateIfAuthenticated('UserInformation')}
        >
          <View style={styles.menuIconContainer}>
            <Feather name='user' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText}>Thông tin tài khoản</Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateIfAuthenticated('HelpSupportScreen')}
        >
          <View style={styles.menuIconContainer}>
            <Feather name='help-circle' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText}>Trợ giúp & Hỗ trợ</Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>
      </View>

      {isAuthenticated && (
        <TouchableOpacity style={styles.logoutButton} onPress={() => reset()}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
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
    width: '100%',
    padding: 15,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 8,
  },
  loginPrompt: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginBottom: 15,
  },
  authButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
  },
  registerBtn: {
    backgroundColor: COLORS.background.card,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  loginBtnText: {
    color: COLORS.text.light,
    fontWeight: '500',
    fontSize: 14,
  },
  registerBtnText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 14,
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
