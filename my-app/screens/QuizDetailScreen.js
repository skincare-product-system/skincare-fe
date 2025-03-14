/* eslint-disable no-console */
import AntDesign from '@expo/vector-icons/AntDesign'
import { useEffect, useState } from 'react'
import { View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'

import quizApi from '../src/apis/quizzes.api'

export default function QuizDetailScreen(props) {
  const { quizId } = props.route.params
  const [quiz, setQuiz] = useState({})
  const [selectedId, setSelectedId] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!quizId) {
      return
    }
    const getQuizDetail = async () => {
      try {
        const response = await quizApi.getQuizDetail(quizId)
        const quizDetail = response.data.result
        setQuiz(quizDetail)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching quiz details:', error)
      }
    }
    getQuizDetail()
  }, [quizId])

  return (
    <ScrollView style={{ flex: 1, marginVertical: 20 }}>
      {loading ? (
        <ActivityIndicator size='large' color='#FA7070' style={{ marginTop: 20 }} />
      ) : (
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              textAlign: 'center'
            }}
          >
            {quiz.title}
          </Text>
          <Text
            style={{
              fontSize: 13,
              paddingHorizontal: 30,
              marginTop: 5,
              color: '#504B38',
              textAlign: 'center'
            }}
          >
            {quiz.description}
          </Text>
          <Image source={{ uri: quiz.images[0] }} style={{ width: '100%', height: 200, marginTop: 20 }} />
          <ScrollView>
            {quiz.questions.map((question, index) => (
              <View key={question._id}>
                <Text
                  style={{
                    fontWeight: '600',
                    marginVertical: 10,
                    paddingHorizontal: 10
                  }}
                >
                  {index + 1}. {question.question_text}
                </Text>
                {question.answers.map((answer) => (
                  <View key={answer._id} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                    <TouchableOpacity
                      style={{
                        borderWidth: 0.5,
                        width: '100%',
                        borderRadius: 5,
                        marginVertical: 5
                      }}
                    >
                      <Text style={{ fontSize: 14, marginLeft: 10, marginVertical: 8 }}>{answer.answer_text}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
                padding: 10,
                borderRadius: 5,
                margin: 20,
                gap: 10
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>Submit</Text>
              <AntDesign name='arrowright' size={24} color='white' />
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  )
}
