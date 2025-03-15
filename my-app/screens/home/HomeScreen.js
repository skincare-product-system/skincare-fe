/* eslint-disable no-console */
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import categoryApi from '../../src/apis/categories.api'
import quizApi from '../../src/apis/quizzes.api'
import { Header } from '../../src/components'
import ImageSlider from '../../src/components/ImageSlider'

const images = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29zbWV0aWN8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNraW5jYXJlfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1583784561105-a674080f391e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D'
]

export default function Home() {
  const nav = useNavigation()
  const [cates, setCates] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const getLeafCategories = (categories) => {
    let leafCategories = []
    const findLeaves = (subCategories) => {
      subCategories.forEach((category) => {
        if (category.subCate && Array.isArray(category.subCate) && category.subCate.length > 0) {
          findLeaves(category.subCate)
        } else {
          leafCategories.push(category)
        }
      })
    }
    findLeaves(categories)
    return leafCategories
  }

  useEffect(() => {
    const getSubCates = async () => {
      const response = await categoryApi.getCategories()
      const leafCategories = getLeafCategories(response.data.result)
      setCates(leafCategories)
      //setCates(response.data.result)
    }
    getSubCates()
  }, [])

  useEffect(() => {
    const getQuiz = async () => {
      const response = await quizApi.getQuizzes()
      const quiz = response.data.result
      // console.log(quiz)
      setQuizzes(quiz)
    }
    getQuiz()
  }, [])
  return (
    <ScrollView>
      <Header />
      <View>
        <ImageSlider images={images} height={300} />
      </View>

      {/* Danh mục hot */}
      <View style={{ padding: 10, marginTop: 10 }}>
        <Text style={{ textTransform: 'capitalize', fontSize: 20, fontWeight: '600' }}>Danh mục hot</Text>

        {/* Scroll ngang giữa các slide */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {cates.map((item) => (
            <View key={item._id} style={{ paddingHorizontal: 5, alignItems: 'center' }}>
              <Image source={{ uri: item.image }} style={{ width: 90, height: 90, borderRadius: 20 }} />
              <Text>{item.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={{ padding: 10, marginTop: 10 }}>
        <Text style={{ textTransform: 'capitalize', fontSize: 20, fontWeight: '600' }}>Bài Trắc nghiệm</Text>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {quizzes.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={{ paddingHorizontal: 5 }}
              onPress={() => {
                nav.navigate('StackNavigator', { screen: 'QuizDetailScreen', params: { quizDetail: item } })
              }}
            >
              <Image source={{ uri: item.images }} style={{ width: 200, height: 100, borderRadius: 20 }} />
              <Text>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  )
}
