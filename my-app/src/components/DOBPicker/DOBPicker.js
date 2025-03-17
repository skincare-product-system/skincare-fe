import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'

const DOBPicker = ({ label, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false)

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false)
    if (selectedDate) {
      onChange(selectedDate)
    }
  }

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ marginBottom: 5 }}>{label}</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5
          }}
          value={value ? value.toLocaleDateString('en-CA') : 'Chọn ngày'}
          editable={false} // Không cho phép nhập tay
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker value={value || new Date()} mode='date' display='default' onChange={handleDateChange} />
      )}
    </View>
  )
}

export default DOBPicker
