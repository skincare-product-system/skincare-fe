import 'react-native-get-random-values'
import { nanoid } from 'nanoid'

export const subFacialCareCategories = [
  { id: nanoid(), name: 'Kem dưỡng' },
  { id: nanoid(), name: 'serum' },
  { id: nanoid(), name: 'toner' },
  { id: nanoid(), name: 'Sữa dưỡng' }
]
export const subCleasingCategories = [
  { id: nanoid(), name: 'Kem dưỡng' },
  { id: nanoid(), name: 'serum' },
  { id: nanoid(), name: 'toner' },
  { id: nanoid(), name: 'Sữa dưỡng' }
]
export const subFaceMakeupCategories = [
  { id: nanoid(), name: 'kem nền' },
  { id: nanoid(), name: 'phấn phủ' },
  { id: nanoid(), name: 'che khuyết điểm' },
  { id: nanoid(), name: 'kem lót' }
]
export const subLipCategories = [
  { id: nanoid(), name: 'son thỏi' },
  { id: nanoid(), name: 'son kem - tint' },
  { id: nanoid(), name: 'son dưỡng môi' }
]

export const category = [
  {
    id: nanoid(),
    name: 'chăm sóc da',
    subCategories: [
      { id: nanoid(), name: 'dưỡng da', subCategories: subFacialCareCategories },
      { id: nanoid(), name: 'làm sạch', subCategories: subCleasingCategories }
    ]
  },
  {
    id: nanoid(),
    name: 'chăm sóc cá nhân',
    subCategories: [
      { name: 'nước hoa', id: nanoid() },
      { name: 'chăm sóc răng miệng', id: nanoid() }
    ]
  },
  {
    id: nanoid(),
    name: 'trang điểm',
    subCategories: [
      { name: 'trang điểm mặt', id: nanoid(), subCategories: subFaceMakeupCategories },
      { name: 'trang điểm môi', id: nanoid(), subCategories: subLipCategories },
      { name: 'trang điểm mắt', id: nanoid() }
    ]
  }
]
