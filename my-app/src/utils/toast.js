import { BaseToast } from 'react-native-toast-message'

export const toastConfig = {
  success: ({ text1, props }) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: 'green' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 13, fontWeight: 'bold', color: 'white' }}
      text1={text1}
    />
  )
}
