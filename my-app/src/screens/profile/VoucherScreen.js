import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Alert, Dimensions } from 'react-native'

import { COLORS } from '../../styles/styles'

const { width } = Dimensions.get('window')

export default function VoucherScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('available')
  const [voucherList, setVoucherList] = useState([
    {
      id: '1',
      code: 'SUMMER30',
      title: 'Giảm 30% cho tất cả sản phẩm',
      description: 'Áp dụng cho tất cả sản phẩm, không giới hạn số lượng',
      discount: '30%',
      minOrder: '300.000đ',
      expireDate: '31/05/2025',
      status: 'available',
      category: 'seasonal',
      used: 0,
      maxUses: 1,
    },
    {
      id: '2',
      code: 'NEWCUSTOMER',
      title: 'Giảm 150.000đ cho khách hàng mới',
      description: 'Áp dụng cho đơn hàng đầu tiên từ 500.000đ',
      discount: '150.000đ',
      minOrder: '500.000đ',
      expireDate: '31/12/2025',
      status: 'available',
      category: 'new_customer',
      used: 0,
      maxUses: 1,
    },
    {
      id: '3',
      code: 'MAKEUP20',
      title: 'Giảm 20% cho sản phẩm trang điểm',
      description: 'Áp dụng cho các sản phẩm trang điểm',
      discount: '20%',
      minOrder: '200.000đ',
      expireDate: '15/04/2025',
      status: 'available',
      category: 'category_specific',
      used: 0,
      maxUses: 1,
    },
    {
      id: '4',
      code: 'FREESHIP',
      title: 'Miễn phí vận chuyển',
      description: 'Áp dụng cho đơn hàng từ 200.000đ',
      discount: 'Miễn phí ship',
      minOrder: '200.000đ',
      expireDate: '31/03/2025',
      status: 'available',
      category: 'shipping',
      used: 0,
      maxUses: 1,
    },
    {
      id: '5',
      code: 'BIRTHDAY10',
      title: 'Giảm 10% nhân dịp sinh nhật',
      description: 'Áp dụng cho tất cả sản phẩm trong tháng sinh nhật',
      discount: '10%',
      minOrder: '100.000đ',
      expireDate: '31/03/2025',
      status: 'available',
      category: 'birthday',
      used: 0,
      maxUses: 1,
    },
    {
      id: '6',
      code: 'SKINCARE15',
      title: 'Giảm 15% cho sản phẩm chăm sóc da',
      description: 'Áp dụng cho tất cả sản phẩm chăm sóc da',
      discount: '15%',
      minOrder: '300.000đ',
      expireDate: '01/03/2025',
      status: 'expired',
      category: 'category_specific',
      used: 0,
      maxUses: 1,
    },
    {
      id: '7',
      code: 'WELCOME50',
      title: 'Giảm 50.000đ cho đơn hàng đầu tiên',
      description: 'Áp dụng cho đơn hàng đầu tiên từ 200.000đ',
      discount: '50.000đ',
      minOrder: '200.000đ',
      expireDate: '28/02/2025',
      status: 'used',
      category: 'new_customer',
      used: 1,
      maxUses: 1,
    },
  ])

  const copyToClipboard = async (code) => {
    await Clipboard.setStringAsync(code)
    Alert.alert('Thành công', 'Đã sao chép mã giảm giá ' + code)
  }

  const getVoucherBackgroundColor = (category) => {
    switch (category) {
      case 'seasonal':
        return ['#FFD166', '#FFB347']
      case 'new_customer':
        return [COLORS.primary, COLORS.primaryDark]
      case 'category_specific':
        return ['#4ECDC4', '#2A9D8F']
      case 'shipping':
        return ['#FF9F1C', '#F77F00']
      case 'birthday':
        return ['#FF6B6B', '#EE5253']
      default:
        return [COLORS.primary, COLORS.primaryDark]
    }
  }

  const getVoucherIcon = (category) => {
    switch (category) {
      case 'seasonal':
        return 'sunny-outline'
      case 'new_customer':
        return 'person-add-outline'
      case 'category_specific':
        return 'pricetag-outline'
      case 'shipping':
        return 'car-outline'
      case 'birthday':
        return 'gift-outline'
      default:
        return 'pricetag-outline'
    }
  }

  const renderVoucher = ({ item }) => {
    if (
      (activeTab === 'available' && item.status !== 'available') ||
      (activeTab === 'used' && item.status !== 'used') ||
      (activeTab === 'expired' && item.status !== 'expired')
    ) {
      return null
    }

    const backgroundColor = getVoucherBackgroundColor(item.category)
    const iconName = getVoucherIcon(item.category)

    return (
      <View style={styles.voucherCard}>
        <LinearGradient colors={backgroundColor} style={styles.voucherLeftPart} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Ionicons name={iconName} size={30} color='#FFF' />
          <Text style={styles.discountText}>{item.discount}</Text>
          <Text style={styles.minOrderText}>Tối thiểu {item.minOrder}</Text>
        </LinearGradient>

        <View style={styles.voucherRightPart}>
          <View style={styles.voucherContentHeader}>
            <Text style={styles.voucherTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {item.status === 'available' && (
              <TouchableOpacity style={styles.useButton} onPress={() => navigation.navigate('Checkout', { voucherCode: item.code })}>
                <Text style={styles.useButtonText}>Dùng ngay</Text>
              </TouchableOpacity>
            )}
            {item.status === 'used' && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Đã sử dụng</Text>
              </View>
            )}
            {item.status === 'expired' && (
              <View style={[styles.statusBadge, styles.expiredBadge]}>
                <Text style={styles.statusText}>Hết hạn</Text>
              </View>
            )}
          </View>

          <Text style={styles.voucherDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.voucherFooter}>
            <Text style={styles.expireDate}>HSD: {item.expireDate}</Text>

            {item.status === 'available' && (
              <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(item.code)}>
                <View style={styles.codeContainer}>
                  <Text style={styles.codeText}>{item.code}</Text>
                  <Ionicons name='copy-outline' size={16} color={COLORS.primary} />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Phần đục lỗ */}
          <View style={styles.leftCircle} />
          <View style={styles.rightCircle} />
          <View style={styles.dashedLine} />
        </View>
      </View>
    )
  }

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color={COLORS.text.dark} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Mã giảm giá</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VoucherHistory')} style={styles.historyButton}>
          <Ionicons name='time-outline' size={24} color={COLORS.text.dark} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'available' && styles.activeTab]} onPress={() => setActiveTab('available')}>
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>Khả dụng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'used' && styles.activeTab]} onPress={() => setActiveTab('used')}>
          <Text style={[styles.tabText, activeTab === 'used' && styles.activeTabText]}>Đã sử dụng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'expired' && styles.activeTab]} onPress={() => setActiveTab('expired')}>
          <Text style={[styles.tabText, activeTab === 'expired' && styles.activeTabText]}>Hết hạn</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={voucherList}
        renderItem={renderVoucher}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.voucherList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='pricetag-off-outline' size={70} color={COLORS.text.medium} />
            <Text style={styles.emptyText}>Không có mã giảm giá nào</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addVoucherButton}
        onPress={() => Alert.alert('Thông báo', 'Tính năng thêm mã giảm giá đang được phát triển')}
      >
        <Ionicons name='add' size={24} color={COLORS.text.light} />
        <Text style={styles.addVoucherText}>Thêm mã giảm giá</Text>
      </TouchableOpacity>
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
  historyButton: {
    padding: 8,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text.dark,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: COLORS.background.card,
    borderRadius: 25,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.medium,
  },
  activeTabText: {
    color: COLORS.text.light,
    fontWeight: '600',
  },
  voucherList: {
    padding: 16,
    paddingBottom: 90,
  },
  voucherCard: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: COLORS.background.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
    height: 150,
  },
  voucherLeftPart: {
    width: width * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  voucherRightPart: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  discountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical: 5,
  },
  minOrderText: {
    fontSize: 10,
    color: '#FFF',
    opacity: 0.9,
  },
  voucherContentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  voucherTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.dark,
    flex: 1,
    marginRight: 8,
  },
  voucherDescription: {
    fontSize: 12,
  },
  voucherExpiry: {
    fontSize: 12,
    color: COLORS.text.medium,
    marginTop: 4,
  },
  voucherButton: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  voucherButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.light,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text.medium,
    marginTop: 10,
  },
  addVoucherButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addVoucherText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.light,
    marginLeft: 8,
  },
})
