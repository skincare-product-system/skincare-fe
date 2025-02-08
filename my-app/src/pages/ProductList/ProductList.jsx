import { View, Text } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { useRoute } from '@react-navigation/native'

export default function ProductList() {
  const route = useRoute()
  const { category } = route.params

  return (
    <View>
      <Text>{route.params.name}</Text>
      {category.map((item) => {
        return (
          <View key={item.id} style={{ marginBottom: 10 }}>
            <Text>{item.name}</Text>
          </View>
        )
      })}
    </View>
  )
}
ProductList.propTypes = {
  category: PropTypes.string,
  data: PropTypes.string
}
