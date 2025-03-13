import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { useOrder } from '../../src/context/OrderContext'

const RequestRefundScreen = ({ route, navigation }) => {
  const { orderId } = route.params
  const { getOrderById, requestRefund } = useOrder()
  const order = getOrderById(orderId)

  const [reason, setReason] = useState('')
  const [selectedItems, setSelectedItems] = useState({})
  const [returnMethod, setReturnMethod] = useState('shipping') // 'shipping' | 'store'
  const [notes, setNotes] = useState('')

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OrderHistory')}>
          <Text style={styles.buttonText}>View All Orders</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const handleSubmitRefund = () => {
    const selectedItemIds = Object.keys(selectedItems).filter((id) => selectedItems[id])

    if (selectedItemIds.length === 0) {
      Alert.alert('Error', 'Please select at least one item to return')
      return
    }

    if (!reason) {
      Alert.alert('Error', 'Please provide a reason for your return')
      return
    }

    const itemsToReturn = order.items.filter((item) => selectedItemIds.includes(item.id.toString()))

    // Create refund request
    requestRefund(
      order.id,
      {
        reason,
        returnMethod,
        notes
      },
      itemsToReturn
    )

    Alert.alert('Refund Request Submitted', 'Your refund request has been submitted and will be reviewed shortly.', [
      { text: 'OK', onPress: () => navigation.navigate('OrderHistory') }
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Request Return & Refund</Text>
      <Text style={styles.subtitle}>Order #{order.id}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Items to Return</Text>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <Switch
              value={!!selectedItems[item.id]}
              onValueChange={() => toggleItemSelection(item.id)}
              trackColor={{ false: '#d8d8d8', true: '#4CAF50' }}
            />
            <Text style={[styles.itemName, !!selectedItems[item.id] && styles.selectedItem]}>
              {item.name} (${item.price.toFixed(2)} x {item.quantity})
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reason for Return</Text>
        <View style={styles.reasonContainer}>
          <TouchableOpacity
            style={[styles.reasonButton, reason === 'damaged' ? styles.selectedReasonButton : null]}
            onPress={() => setReason('damaged')}
          >
            <Ionicons name='warning-outline' size={20} color={reason === 'damaged' ? '#fff' : '#333'} />
            <Text style={[styles.reasonText, reason === 'damaged' ? styles.selectedReasonText : null]}>Damaged</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reasonButton, reason === 'wrong_item' ? styles.selectedReasonButton : null]}
            onPress={() => setReason('wrong_item')}
          >
            <Ionicons name='swap-horizontal-outline' size={20} color={reason === 'wrong_item' ? '#fff' : '#333'} />
            <Text style={[styles.reasonText, reason === 'wrong_item' ? styles.selectedReasonText : null]}>
              Wrong Item
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reasonButton, reason === 'not_satisfied' ? styles.selectedReasonButton : null]}
            onPress={() => setReason('not_satisfied')}
          >
            <Ionicons name='thumbs-down-outline' size={20} color={reason === 'not_satisfied' ? '#fff' : '#333'} />
            <Text style={[styles.reasonText, reason === 'not_satisfied' ? styles.selectedReasonText : null]}>
              Not Satisfied
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reasonButton, reason === 'allergic_reaction' ? styles.selectedReasonButton : null]}
            onPress={() => setReason('allergic_reaction')}
          >
            <Ionicons name='medkit-outline' size={20} color={reason === 'allergic_reaction' ? '#fff' : '#333'} />
            <Text style={[styles.reasonText, reason === 'allergic_reaction' ? styles.selectedReasonText : null]}>
              Allergic Reaction
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Return Method</Text>
        <View style={styles.returnMethodContainer}>
          <TouchableOpacity
            style={[styles.returnMethodButton, returnMethod === 'shipping' ? styles.selectedMethodButton : null]}
            onPress={() => setReturnMethod('shipping')}
          >
            <Ionicons name='mail-outline' size={20} color={returnMethod === 'shipping' ? '#fff' : '#333'} />
            <Text style={[styles.returnMethodText, returnMethod === 'shipping' ? styles.selectedMethodText : null]}>
              Ship Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.returnMethodButton, returnMethod === 'store' ? styles.selectedMethodButton : null]}
            onPress={() => setReturnMethod('store')}
          >
            <Ionicons name='home-outline' size={20} color={returnMethod === 'store' ? '#fff' : '#333'} />
            <Text style={[styles.returnMethodText, returnMethod === 'store' ? styles.selectedMethodText : null]}>
              Return in Store
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder='Please provide any additional details about the return...'
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Refund Policy</Text>
        <Text style={styles.policyText}>• Returns must be initiated within 30 days of receiving your order.</Text>
        <Text style={styles.policyText}>• Items must be unused and in original packaging.</Text>
        <Text style={styles.policyText}>
          • Refunds will be processed to the original payment method within 7-10 business days.
        </Text>
        <Text style={styles.policyText}>
          • Shipping costs for returns will be covered for damaged or incorrect items only.
        </Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRefund}>
        <Text style={styles.submitButtonText}>Submit Return Request</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea'
  },
  itemName: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1
  },
  selectedItem: {
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  reasonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  reasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 5,
    marginBottom: 10
  },
  selectedReasonButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50'
  },
  reasonText: {
    marginLeft: 5,
    fontSize: 14
  },
  selectedReasonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  returnMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  returnMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 5,
    justifyContent: 'center'
  },
  selectedMethodButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50'
  },
  returnMethodText: {
    marginLeft: 5,
    fontSize: 14
  },
  selectedMethodText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top'
  },
  policyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 5,
    marginBottom: 30
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20
  }
})

export default RequestRefundScreen
