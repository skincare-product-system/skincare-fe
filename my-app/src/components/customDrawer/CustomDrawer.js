import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import http from '../../utils/http'

export default function CustomDrawer({ navigation }) {
  const [expandedCategories, setExpandedCategories] = useState({})
  const [category, setCategory] = useState([])

  useEffect(() => {
    async function getCategories() {
      try {
        const result = await http.get('api/categories/all')
        setCategory(result.data.result)
      } catch (error) {
        console.error('Lỗi khi fetch categories:', error)
      }
    }
    getCategories()
  }, [])

  const toggleSubMenu = (categoryId) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId]
    }))
  }

  const renderCategory = (item) => {
    return (
      <View key={item._id} style={{ marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductList', {
              item
            })
          }
          style={{ padding: 10, borderRadius: 5 }}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>

        {Array.isArray(item.subCate) && item.subCate.length > 0 && (
          <View style={{ marginLeft: 20 }}>{item.subCate.map((subItem) => renderCategory(subItem))}</View>
        )}
      </View>
    )
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      {category.map((item, index) => {
        const isExpanded = expandedCategories[item._id] || false
        return (
          <View key={item._id + index} style={{ marginBottom: 10 }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('StackNavigator', {
                    screen: 'ProductList',
                    params: {
                      item,
                      name: item.name,
                      category: item.subCate || []
                    }
                    // name: item.name,
                    // category: item.subCategories || []
                  })
                }
                style={{ paddingVertical: 10 }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>

              {item.subCate && item.subCate.length > 0 && (
                <TouchableOpacity
                  onPress={() => toggleSubMenu(item._id)}
                  style={{
                    padding: 10,
                    flexGrow: 1
                  }}
                >
                  <Icon
                    style={{ textAlign: 'right' }}
                    name={isExpanded ? 'expand-less' : 'expand-more'}
                    size={24}
                    color='black'
                  />
                </TouchableOpacity>
              )}
            </View>

            {isExpanded && (
              <Animated.View style={{ paddingLeft: 20 }}>
                {item.subCate.map((subItem) => renderCategory(subItem))}
              </Animated.View>
            )}
          </View>
        )
      })}
    </ScrollView>
  )
}

CustomDrawer.propTypes = {
  navigation: PropTypes.object.isRequired
}
