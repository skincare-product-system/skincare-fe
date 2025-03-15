import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { COLORS } from '../../styles/styles'

export default function AccountScreen({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({
    name: 'Dĩm Phan',
    email: 'diemphan@gmail.com',
    avatar: 'https://i.pinimg.com/736x/c0/f9/c2/c0f9c2ffe8e7ff2ee292dbf6892d3b6a.jpg',
    level: 'Kim cương',
    points: 2850
  })

  // Toggle hàm này chỉ để demo, trong app thực sẽ dùng hệ thống đăng nhập thật
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }
  // const handleLogout = () => {
  //   // eslint-disable-next-line no-console
  //   console.log('Đang đăng xuất...')
  //   // cho web
  //   if (Platform.OS === 'web') {
  //     window.alert('Đây là một test alert')
  //     toggleLogin()
  //   }

  //   // cho mobile
  //   Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
  //     { text: 'Hủy', style: 'cancel' },
  //     {
  //       text: 'Đăng xuất',
  //       style: 'destructive',
  //       onPress: () => {
  //         toggleLogin()
  //       },
  //     },
  //   ])
  // }

  // Render phần đăng nhập nếu chưa đăng nhập
  const renderLoginSection = () => (
    <View style={styles.loginContainer}>
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.loginGradient}>
        <Image
          source={{ uri: 'https://i.pinimg.com/736x/c9/08/6a/c9086a109abf341b3d52de87b213e363.jpg' }}
          style={styles.loginLogo}
          resizeMode='contain'
        />
        <Text style={styles.loginTitle}>Chào mừng bạn đến với GlamShop</Text>
        <Text style={styles.loginSubtitle}>Đăng nhập để theo dõi đơn hàng và nhận nhiều ưu đãi hấp dẫn</Text>

        <TouchableOpacity style={styles.loginButton} onPress={toggleLogin}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Đăng ký tài khoản mới</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )

  // Render phần thông tin người dùng sau khi đăng nhập
  const renderUserProfile = () => (
    <ScrollView style={styles.container}>
      {/* Header với thông tin người dùng */}
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.headerGradient}>
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.levelContainer}>
                <FontAwesome name='diamond' size={14} color={COLORS.primaryDark} />
                <Text style={styles.userLevel}>{user.level}</Text>
              </View>
            </View>
          </View>

          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Điểm tích lũy</Text>
            <Text style={styles.pointsValue}>{user.points}</Text>
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
          <Text style={styles.menuText} onPress={() => navigation.navigate('ProductsToReviewScreen', { user })}>
            Đánh giá sản phẩm
          </Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Feather name='message-square' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText} onPress={() => navigation.navigate('ReviewHistoryScreen')}>
            Lịch sử đánh giá
          </Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Feather name='map-pin' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText} onPress={() => navigation.navigate('MyAddressScreen')}>
            Địa chỉ của tôi
          </Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Feather name='gift' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText} onPress={() => navigation.navigate('VoucherScreen')}>
            Mã giảm giá của tôi
          </Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Feather name='bell' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText} onPress={() => navigation.navigate('NotificationScreen')}>
            Thông báo
          </Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Feather name='user' size={20} color={COLORS.primaryDark} />
          </View>
          <TouchableOpacity style={styles.menuText} onPress={() => navigation.navigate('UserInformation', { user })}>
            <Text style={styles.menuText}>Thông tin tài khoản</Text>
          </TouchableOpacity>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Feather name='help-circle' size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.menuText} onPress={() => navigation.navigate('HelpSupportScreen')}>
            Trợ giúp & Hỗ trợ
          </Text>
          <Feather name='chevron-right' size={20} color='#ccc' />
        </TouchableOpacity>
      </View>
      {/* Alert ko hoạt động trên web nên nào dùng mnoblie rồi call confirm logout sau */}
      {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}> */}
      <TouchableOpacity style={styles.logoutButton} onPress={toggleLogin}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.gradientEnd} barStyle='dark-content' />
      {isLoggedIn ? renderUserProfile() : renderLoginSection()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.main
  },
  container: {
    flex: 1,
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
