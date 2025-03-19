/* eslint-disable no-console */
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View, Dimensions } from 'react-native'

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
  const [showAllCategories, setShowAllCategories] = useState(false)
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
  
  const displayedCategories = showAllCategories ? cates : cates.slice(0, 8)

  const bgColors = [
    '#FFF5F5', // light pink
    '#F0F7FF', // light blue
    '#F7F8FF', // light purple
    '#F0FFF4', // light green
    '#FFF7F0', // light orange
    '#FFF0F7', // light magenta
    '#F5F5F5', // light gray
    '#FFFFF0'  // light yellow
  ]

  const windowWidth = Dimensions.get('window').width
  const itemWidth = (windowWidth - 40) / 2 // 40 là tổng padding (15px mỗi bên + khoảng cách giữa)

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <Header />
      <View>
        <ImageSlider images={images} height={200} />
      </View>

      {/* Danh mục hot */}
      <View style={{ padding: 15, marginTop: 5 }}>
        <Text style={{ 
          textTransform: 'capitalize', 
          fontSize: 18, 
          fontWeight: '600',
          color: '#333',
          marginBottom: 12
        }}>Danh mục hot</Text>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={windowWidth - 30} // 30 là tổng padding của container
          decelerationRate="fast"
        >
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap',
            width: Math.ceil(cates.length / 4) * (windowWidth - 30)
          }}>
            {cates.map((item, index) => (
              <TouchableOpacity
                key={item._id}
                style={{ 
                  width: itemWidth,
                  marginBottom: 12,
                  alignItems: 'center',
                  backgroundColor: bgColors[index % bgColors.length],
                  borderRadius: 12,
                  padding: 10,
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  marginRight: index % 2 === 0 ? 10 : 0,
                }}
                onPress={() => {
                  nav.navigate('StackNavigator', { 
                    screen: 'ProductList', 
                    params: { subItem: item } 
                  })
                }}
              >
                <Image 
                  source={{ uri: item.image }} 
                  style={{ 
                    width: '100%', 
                    height: 120, 
                    borderRadius: 8,
                  }} 
                />
                <Text style={{ 
                  marginTop: 8,
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: '500',
                  color: '#333',
                  paddingHorizontal: 4
                }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={{ padding: 15, marginTop: 5 }}>
        <Text style={{ 
          textTransform: 'capitalize', 
          fontSize: 18, 
          fontWeight: '600',
          marginBottom: 12,
          color: '#333'
        }}>Bài Trắc nghiệm</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ marginTop: 5 }}
        >
          {quizzes.map((item, index) => (
            <TouchableOpacity
              key={item._id}
              style={{ 
                marginRight: 12,
                backgroundColor: bgColors[index % bgColors.length],
                borderRadius: 12,
                padding: 10,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                width: 180
              }}
              onPress={() => {
                nav.navigate('StackNavigator', { 
                  screen: 'QuizDetailScreen', 
                  params: { quizDetail: item } 
                })
              }}
            >
              <Image 
                source={{ uri: item.images }} 
                style={{ 
                  width: '100%', 
                  height: 90, 
                  borderRadius: 8 
                }} 
              />
              <Text style={{
                marginTop: 8,
                fontSize: 13,
                fontWeight: '500',
                color: '#333',
                paddingHorizontal: 4
              }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  )
}
