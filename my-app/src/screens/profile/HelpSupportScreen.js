import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import { COLORS } from '../../styles/styles'

export default function HelpSupportScreen({ navigation }) {
  const [expanded, setExpanded] = useState(null)
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const toggleExpand = (index) => {
    if (expanded === index) {
      setExpanded(null)
    } else {
      setExpanded(index)
    }
  }

  const handleSearch = () => {
    if (query.trim() === '') return

    setIsLoading(true)
    // Mô phỏng tìm kiếm
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const FAQ_ITEMS = [
    {
      question: 'Làm thế nào để theo dõi đơn hàng của tôi?',
      answer:
        'Bạn có thể theo dõi đơn hàng bằng cách vào mục "Đơn hàng của tôi" trong phần "Tài khoản". Tại đây, bạn sẽ thấy trạng thái hiện tại của tất cả các đơn hàng của mình.'
    },
    {
      question: 'Chính sách đổi trả như thế nào?',
      answer:
        'Chúng tôi chấp nhận đổi trả trong vòng 14 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên vẹn, chưa qua sử dụng và còn đầy đủ bao bì. Vui lòng liên hệ với bộ phận hỗ trợ khách hàng để được hướng dẫn chi tiết.'
    },
    {
      question: 'Thời gian giao hàng là bao lâu?',
      answer:
        'Thời gian giao hàng thông thường là 2-5 ngày làm việc tùy thuộc vào khu vực của bạn. Đối với các khu vực ngoại thành hoặc vùng sâu vùng xa, thời gian giao hàng có thể kéo dài hơn 1-2 ngày.'
    },
    {
      question: 'Làm cách nào để tôi biết sản phẩm phù hợp với làn da của mình?',
      answer:
        'Bạn có thể sử dụng tính năng "Tư vấn da" trong ứng dụng của chúng tôi. Tính năng này sẽ phân tích loại da của bạn thông qua một bài kiểm tra ngắn và đề xuất các sản phẩm phù hợp.'
    },
    {
      question: 'Tôi có thể thanh toán bằng những phương thức nào?',
      answer:
        'Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ, ví điện tử (MoMo, ZaloPay, VNPay), chuyển khoản ngân hàng và thanh toán khi nhận hàng (COD).'
    }
  ]

  const CONTACT_METHODS = [
    {
      icon: 'phone',
      title: 'Hotline',
      subtitle: '1800 xxxx',
      action: () => Linking.openURL('tel:1800xxxx')
    },
    {
      icon: 'message',
      title: 'Tin nhắn',
      subtitle: 'Phản hồi trong 24h',
      action: () => navigation.navigate('ChatSupport')
    },
    {
      icon: 'mail',
      title: 'Email',
      subtitle: 'support@beautyapp.com',
      action: () => Linking.openURL('mailto:support@beautyapp.com')
    }
  ]

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Trợ giúp & Hỗ trợ</Text>
          <Text style={styles.subtitle}>Chúng tôi luôn sẵn sàng hỗ trợ bạn</Text>
        </View>

        {/* Tìm kiếm */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder='Bạn cần giúp đỡ gì?'
            placeholderTextColor={COLORS.text.medium}
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.text.light} />
            ) : (
              <Ionicons name='search' size={22} color={COLORS.text.light} />
            )}
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
          {FAQ_ITEMS.map((item, index) => (
            <TouchableOpacity key={index} style={styles.faqItem} onPress={() => toggleExpand(index)}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <MaterialIcons
                  name={expanded === index ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={24}
                  color={COLORS.text.medium}
                />
              </View>
              {expanded === index && <Text style={styles.faqAnswer}>{item.answer}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Liên hệ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên hệ với chúng tôi</Text>
          <View style={styles.contactMethods}>
            {CONTACT_METHODS.map((method, index) => (
              <TouchableOpacity key={index} style={styles.contactCard} onPress={method.action}>
                <View style={styles.iconContainer}>
                  <Ionicons name={method.icon} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Phản hồi */}
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackTitle}>Phản hồi của bạn</Text>
          <Text style={styles.feedbackSubtitle}>
            Chúng tôi luôn cố gắng cải thiện dịch vụ. Hãy chia sẻ ý kiến để giúp chúng tôi phục vụ bạn tốt hơn.
          </Text>
          <TouchableOpacity style={styles.feedbackButton} onPress={() => navigation.navigate('Feedback')}>
            <Text style={styles.feedbackButtonText}>Gửi phản hồi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  header: {
    marginBottom: 24,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.medium
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.background.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text.dark
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  section: {
    backgroundColor: COLORS.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 16
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    paddingVertical: 12
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  faqQuestion: {
    fontSize: 16,
    flex: 1,
    color: COLORS.text.dark
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.text.medium,
    lineHeight: 20
  },
  contactMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  contactCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    backgroundColor: COLORS.gradientStart
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginVertical: 4
  },
  contactSubtitle: {
    fontSize: 12,
    color: COLORS.text.medium,
    textAlign: 'center'
  },
  feedbackSection: {
    backgroundColor: COLORS.background.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 8
  },
  feedbackSubtitle: {
    fontSize: 14,
    color: COLORS.text.medium,
    textAlign: 'center',
    marginBottom: 16
  },
  feedbackButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8
  },
  feedbackButtonText: {
    color: COLORS.text.light,
    fontWeight: 'bold',
    fontSize: 16
  }
})
