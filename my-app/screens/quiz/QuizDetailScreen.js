/* eslint-disable no-console */
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, Dimensions, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'

import quizApi from '../../src/apis/quizzes.api'

const { width } = Dimensions.get('window')

export default function QuizDetailScreen() {
  const nav = useNavigation()
  const { quizDetail } = useRoute().params
  const [quiz, setQuiz] = useState({})
  const [isloading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])

  useEffect(() => {
    const getQuizDetail = async () => {
      const response = await quizApi.getQuizDetail(quizDetail._id)
      setQuiz(response.data.result)
      setIsLoading(false)
    }
    getQuizDetail()
  }, [quizDetail])

  const handleSaveAnswer = (questionId, answerId, answerScore) => {
    setSelectedAnswers((prev) => {
      const index = prev.findIndex((item) => item.questionId === questionId)

      if (index !== -1) {
        // Nếu đã có câu trả lời trước đó, cập nhật lại điểm
        const newAnswers = [...prev]
        newAnswers[index] = { questionId, answerId, score: answerScore }
        return newAnswers
      } else {
        // Thêm câu trả lời mới
        return [...prev, { questionId, answerId, score: answerScore }]
      }
    })
  }

  // Tính tổng điểm
  const totalScore = selectedAnswers.reduce((sum, ans) => sum + ans.score, 0)

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {isloading ? (
        <ActivityIndicator size='large' color='#FA7070' style={{ marginTop: 20 }} />
      ) : (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
            <View style={{ alignItems: 'center', paddingTop: 20 }}>
              {/* Tiêu đề */}
              <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 10 }}>
                {quiz.title}
              </Text>
              <Image source={{ uri: quiz.images[0] }} style={{ width: width - 40, height: 200, borderRadius: 10 }} />
              <Text style={{ textAlign: 'center', padding: 20, color: 'gray', fontSize: 12 }}>{quiz.description}</Text>

              {/* Danh sách câu hỏi */}
              <FlatList
                data={quiz.questions}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View
                    style={{
                      width: width - 40,
                      padding: 20,
                      marginHorizontal: 20,
                      borderRadius: 10,
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{item.question_text}</Text>
                    {item.answers.map((answer) => (
                      <TouchableOpacity
                        key={answer._id}
                        style={{ padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 }}
                        onPress={() => handleSaveAnswer(item._id, answer._id, answer.score)}
                      >
                        <Text>{answer.answer_text}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                onMomentumScrollEnd={(event) => {
                  const newIndex = Math.round(event.nativeEvent.contentOffset.x / width)
                  setCurrentIndex(newIndex)
                }}
              />
            </View>
          </ScrollView>

          <View
            style={{
              // position: 'absolute',
              bottom: 10,
              left: 0,
              right: 0,
              alignItems: 'center'
            }}
          >
            {/* Hiển thị số câu hỏi */}
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                paddingVertical: 5,
                paddingHorizontal: 15,
                borderRadius: 15
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                {currentIndex + 1} / {quiz.questions.length}
              </Text>
            </View>

            {/* btn hoàn thành */}
            <TouchableOpacity
              style={{
                backgroundColor: selectedAnswers.length === quiz.questions.length ? '#FA7070' : '#ccc', // Đổi màu khi chưa chọn đủ
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 30,
                marginTop: 10,
                alignItems: 'center',
                opacity: selectedAnswers.length === quiz.questions.length ? 1 : 0.8
              }}
              disabled={selectedAnswers.length !== quiz.questions.length}
              onPress={() => {
                nav.navigate('QuizResultScreen', { quizDetail, selectedAnswers, totalScore })
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Hoàn thành</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}
