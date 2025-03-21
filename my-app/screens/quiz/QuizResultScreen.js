/* eslint-disable no-console */
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'

import quizApi from '../../src/apis/quizzes.api'

export default function QuizResultScreen() {
  const nav = useNavigation()
  const route = useRoute()
  const { quizDetail, selectedAnswers, totalScore } = route.params
  const [quizResult, setQuizResult] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const getQuizResult = async () => {
      const response = await quizApi.getQuizScore(quizDetail._id)
      const result = response.data.result
      result.map((item) => {
        if (item.min_score <= totalScore && totalScore <= item.max_score) {
          console.log(item)

          setQuizResult(item)
        }
      })

      setIsLoading(false)
    }
    getQuizResult()
  }, [quizDetail, totalScore])

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size='large' color='#FA7070' style={{ marginTop: 20 }} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 10 }}>Số điểm của bạn là</Text>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#FDFBEE',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              >
                {totalScore}
              </Text>
            </View>

            <Text style={{ fontSize: 25, fontWeight: '500', marginTop: 10 }}>Kết quả</Text>
            <Text style={{ fontSize: 20, marginTop: 10, color: '#C14600' }}>{quizResult.result.type || 'ahihi'}</Text>
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: 'black',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 30
              }}
              onPress={() => {
                nav.navigate('BottomTabNavigator', { screen: 'Home' })
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Thoát</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  )
}
