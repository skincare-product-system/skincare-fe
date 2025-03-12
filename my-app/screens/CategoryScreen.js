/* eslint-disable no-console */
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { View, Text, ScrollView, Pressable, Image, TouchableOpacity } from 'react-native'

import categoryApi from '../src/apis/categories.api'

import { useEffect } from 'react'

const { useState, useCallback } = require('react')

export default function CategoryScreen() {
  const nav = useNavigation()
  const [selectedId, setSelectedId] = useState(null)
  const [subCate, setSubCate] = useState([])
  const [parentCate, setParentCate] = useState([])
  useFocusEffect(
    useCallback(() => {
      async function getCategories() {
        try {
          const result = await categoryApi.getCategories()

          const parentCate = result.data.result.filter((item) => item.parent_category_id === null)

          setSelectedId(parentCate[0]._id)
          setParentCate(parentCate)
          setSubCate(result.data.result[0])
        } catch (error) {
          console.error('Lỗi khi fetch categories:', error.response.data)
        }
      }
      getCategories()
    }, [])
  )

  const handleGetSubCate = async (id) => {
    try {
      const result = await categoryApi.getCategories()
      const subCate = result.data.result.find((item) => item._id === id)
      setSubCate(subCate)
    } catch (error) {
      console.error('Lỗi khi fetch sub categories:', error)
    }
  }
  useEffect(() => {
    handleGetSubCate(selectedId)
  }, [selectedId])
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <ScrollView style={{ width: '30%', borderRightWidth: 0.5 }}>
        {parentCate.map((item) => (
          <Pressable
            key={item._id}
            onPress={() => {
              if (selectedId === item._id) return
              setSelectedId(item._id)
              handleGetSubCate(item._id)
            }}
            style={({ pressed }) => ({
              backgroundColor: selectedId === item._id ? '#F7F7F7' : 'transparent',
              paddingHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',

              height: 100,
              marginTop: 0,
              opacity: pressed ? 0.7 : 1
            })}
          >
            <FontAwesome6 name='box-open' size={24} color='black' />
            <Text style={{ textAlign: 'center', textTransform: 'capitalize' }}>{item.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView style={{ width: '70%', backgroundColor: '#F7F7F7', padding: 10, marginTop: 10 }}>
        {subCate &&
          subCate.subCate &&
          subCate.subCate.length > 0 &&
          subCate.subCate.map((item) => (
            <View key={item._id} style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: '600', fontSize: 15, textTransform: 'capitalize' }}>{item.name}</Text>
              <TouchableOpacity style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                {item.subCate &&
                  item.subCate.length > 0 &&
                  item.subCate.map((subItem) => (
                    <TouchableOpacity
                      key={subItem._id}
                      style={{ marginLeft: 10 }}
                      onPress={() => {
                        nav.navigate('StackNavigator', { screen: 'ProductList', params: { subItem } })
                      }}
                    >
                      <Image
                        source={{ uri: subItem.image }}
                        style={{ width: 110, height: 110, borderRadius: 5, marginTop: 10 }}
                      />
                      <Text
                        style={{
                          fontWeight: '400',
                          fontSize: 12,
                          margin: 10,
                          textTransform: 'capitalize'
                        }}
                      >
                        {subItem.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </View>
  )
}
