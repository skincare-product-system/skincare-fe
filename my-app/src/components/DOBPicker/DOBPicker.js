import { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

export default function DOBPicker() {
  const [dob, setDob] = useState('') // Lưu ngày sinh
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  // Hiển thị DatePicker
  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  // Ẩn DatePicker
  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

  // Xử lý khi chọn ngày
  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0] // YYYY-MM-DD
    setDob(formattedDate)
    hideDatePicker()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ngày sinh:</Text>
      <TouchableOpacity onPress={showDatePicker}>
        <TextInput
          style={styles.input}
          placeholder='Chọn ngày sinh'
          value={dob}
          editable={false} // Không cho nhập tay, chỉ chọn qua DatePicker
        />
      </TouchableOpacity>

      {/* Date Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode='date'
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()} // Không cho chọn ngày tương lai
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff'
  }
})
