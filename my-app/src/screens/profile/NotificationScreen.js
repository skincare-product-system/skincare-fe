import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, Switch, FlatList, Modal } from 'react-native'

import { COLORS } from '../../styles/styles'

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Giảm giá lớn: Chào mùa xuân',
      message: 'Nhận ngay ưu đãi 30% cho tất cả các sản phẩm làm đẹp từ thương hiệu La Roche Posay.',
      time: '2 giờ trước',
      isRead: false,
      type: 'promo',
    },
    {
      id: '2',
      title: 'Đơn hàng #DH1234 đã được giao',
      message: 'Đơn hàng của bạn đã được giao thành công. Hãy đánh giá sản phẩm để nhận thêm điểm thưởng.',
      time: '1 ngày trước',
      isRead: true,
      type: 'order',
    },
    {
      id: '3',
      title: 'Phiếu quà tặng mới',
      message: 'Bạn vừa nhận được phiếu quà tặng trị giá 200.000đ. Hạn sử dụng 30 ngày.',
      time: '3 ngày trước',
      isRead: false,
      type: 'voucher',
    },
    {
      id: '4',
      title: 'Sản phẩm mới: Serum Vitamin C',
      message: 'Serum Vitamin C mới đã có mặt tại cửa hàng! Hiệu quả làm sáng da và chống lão hóa vượt trội.',
      time: '1 tuần trước',
      isRead: true,
      type: 'product',
    },
    {
      id: '5',
      title: 'Sinh nhật vui vẻ!',
      message: 'Chúc mừng sinh nhật! Nhân dịp này, chúng tôi tặng bạn mã giảm giá đặc biệt HPBD20 giảm 20% cho đơn hàng tiếp theo.',
      time: '2 tuần trước',
      isRead: true,
      type: 'birthday',
    },
  ])

  const [notificationSettings, setNotificationSettings] = useState({
    promotions: true,
    orders: true,
    system: true,
    newProducts: false,
  })

  const [activeTab, setActiveTab] = useState('all')
  const [showSettings, setShowSettings] = useState(false)

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'promo':
        return { name: 'pricetag-outline', color: COLORS.accent }
      case 'order':
        return { name: 'cube-outline', color: '#4ECDC4' }
      case 'voucher':
        return { name: 'gift-outline', color: COLORS.primary }
      case 'product':
        return { name: 'flask-outline', color: COLORS.primaryDark }
      case 'birthday':
        return { name: 'calendar-outline', color: '#FF9F1C' }
      default:
        return { name: 'notifications-outline', color: COLORS.primary }
    }
  }

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    setNotifications(updatedNotifications)
  }

  const deleteNotification = (id) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa thông báo này?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        onPress: () => {
          const filteredNotifications = notifications.filter((item) => item.id !== id)
          setNotifications(filteredNotifications)
        },
        style: 'destructive',
      },
    ])
  }

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.isRead ? styles.notificationRead : styles.notificationUnread]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={[styles.notificationIconContainer, { backgroundColor: `${getNotificationIcon(item.type).color}20` }]}>
        <Ionicons name={getNotificationIcon(item.type).name} size={24} color={getNotificationIcon(item.type).color} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <TouchableOpacity onPress={() => deleteNotification(item.id)} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Ionicons name='close' size={20} color={COLORS.text.medium} />
          </TouchableOpacity>
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
        {!item.isRead && <View style={styles.unreadIndicator} />}
      </View>
    </TouchableOpacity>
  )

  const filteredNotifications = activeTab === 'all' ? notifications : notifications.filter((item) => item.type === activeTab)

  const hasUnreadNotifications = notifications.some((item) => !item.isRead)

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color={COLORS.text.dark} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Thông báo</Text>
        <TouchableOpacity onPress={() => setShowSettings(!showSettings)} style={styles.settingsButton}>
          <Ionicons name={showSettings ? 'notifications-outline' : 'settings-outline'} size={24} color={COLORS.text.dark} />
        </TouchableOpacity>
      </View>

      {showSettings ? (
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Cài đặt thông báo</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Khuyến mãi và ưu đãi</Text>
              <Text style={styles.settingDescription}>Thông báo về giảm giá và ưu đãi đặc biệt</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D1D6', true: `${COLORS.primary}80` }}
              thumbColor={notificationSettings.promotions ? COLORS.primary : '#F4F3F4'}
              onValueChange={(value) => setNotificationSettings({ ...notificationSettings, promotions: value })}
              value={notificationSettings.promotions}
              ios_backgroundColor='#D1D1D6'
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Cập nhật đơn hàng</Text>
              <Text style={styles.settingDescription}>Thông báo về trạng thái và giao hàng</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D1D6', true: `${COLORS.primary}80` }}
              thumbColor={notificationSettings.orders ? COLORS.primary : '#F4F3F4'}
              onValueChange={(value) => setNotificationSettings({ ...notificationSettings, orders: value })}
              value={notificationSettings.orders}
              ios_backgroundColor='#D1D1D6'
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Thông báo hệ thống</Text>
              <Text style={styles.settingDescription}>Thông báo cập nhật tài khoản và bảo mật</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D1D6', true: `${COLORS.primary}80` }}
              thumbColor={notificationSettings.system ? COLORS.primary : '#F4F3F4'}
              onValueChange={(value) => setNotificationSettings({ ...notificationSettings, system: value })}
              value={notificationSettings.system}
              ios_backgroundColor='#D1D1D6'
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Sản phẩm mới</Text>
              <Text style={styles.settingDescription}>Thông báo về sản phẩm mới ra mắt</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D1D6', true: `${COLORS.primary}80` }}
              thumbColor={notificationSettings.newProducts ? COLORS.primary : '#F4F3F4'}
              onValueChange={(value) => setNotificationSettings({ ...notificationSettings, newProducts: value })}
              value={notificationSettings.newProducts}
              ios_backgroundColor='#D1D1D6'
            />
          </View>

          <TouchableOpacity
            style={styles.saveSettingsButton}
            onPress={() => {
              setShowSettings(false)
              Alert.alert('Thành công', 'Đã lưu cài đặt thông báo của bạn.')
            }}
          >
            <Text style={styles.saveSettingsText}>Lưu cài đặt</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
            contentContainerStyle={styles.tabsContentContainer}
          >
            <TouchableOpacity style={[styles.tab, activeTab === 'all' && styles.activeTab]} onPress={() => setActiveTab('all')}>
              <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'promo' && styles.activeTab]} onPress={() => setActiveTab('promo')}>
              <Ionicons
                name='pricetag-outline'
                size={16}
                color={activeTab === 'promo' ? COLORS.text.light : COLORS.text.medium}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabText, activeTab === 'promo' && styles.activeTabText]}>Khuyến mãi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'order' && styles.activeTab]} onPress={() => setActiveTab('order')}>
              <Ionicons
                name='cube-outline'
                size={16}
                color={activeTab === 'order' ? COLORS.text.light : COLORS.text.medium}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabText, activeTab === 'order' && styles.activeTabText]}>Đơn hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'voucher' && styles.activeTab]} onPress={() => setActiveTab('voucher')}>
              <Ionicons
                name='gift-outline'
                size={16}
                color={activeTab === 'voucher' ? COLORS.text.light : COLORS.text.medium}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabText, activeTab === 'voucher' && styles.activeTabText]}>Voucher</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'product' && styles.activeTab]} onPress={() => setActiveTab('product')}>
              <Ionicons
                name='flask-outline'
                size={16}
                color={activeTab === 'product' ? COLORS.text.light : COLORS.text.medium}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabText, activeTab === 'product' && styles.activeTabText]}>Sản phẩm</Text>
            </TouchableOpacity>
          </ScrollView>

          <FlatList
            data={filteredNotifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notificationsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name='notifications-off-outline' size={70} color={COLORS.text.medium} />
                <Text style={styles.emptyText}>Không có thông báo nào</Text>
              </View>
            }
          />

          {hasUnreadNotifications && (
            <TouchableOpacity
              style={styles.markAllReadButton}
              onPress={() => {
                const allRead = notifications.map((item) => ({ ...item, isRead: true }))
                setNotifications(allRead)
                Alert.alert('Thành công', 'Đã đánh dấu tất cả thông báo là đã đọc.')
              }}
            >
              <Text style={styles.markAllReadText}>Đánh dấu tất cả đã đọc</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text.dark,
  },
  settingsButton: {
    padding: 8,
  },
  tabsContainer: {
    flexGrow: 0,
    paddingHorizontal: 8,
  },
  tabsContentContainer: {
    paddingVertical: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: COLORS.background.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.text.medium,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.text.light,
    fontWeight: '600',
  },
  tabIcon: {
    marginRight: 4,
  },
  notificationsList: {
    padding: 16,
    paddingBottom: 100,
  },
  notificationItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORS.background.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  notificationRead: {
    opacity: 0.9,
  },
  notificationUnread: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  notificationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.dark,
    flex: 1,
    marginRight: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.text.medium,
    opacity: 0.7,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text.medium,
  },
  markAllReadButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markAllReadText: {
    color: COLORS.text.light,
    fontWeight: '600',
    fontSize: 14,
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.background.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.dark,
    marginBottom: 20,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.dark,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.text.medium,
  },
  saveSettingsButton: {
    marginTop: 32,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveSettingsText: {
    color: COLORS.text.light,
    fontWeight: '600',
    fontSize: 16,
  },
})
