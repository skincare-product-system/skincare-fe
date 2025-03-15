/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

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
  const [cates, setCates] = useState([])
  const [quizzes, setQuizzes] = useState([])
  // State cho Skin Type Test
  const [testStarted, setTestStarted] = useState(false)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  // Câu hỏi mẫu cho Skin Type Test
  const questions = [
    {
      id: 1,
      question: 'Da bạn cảm thấy như thế nào sau khi rửa mặt?',
      options: ['Căng và khô', 'Mềm mại, không khô', 'Dầu ở vùng chữ T', 'Dầu khắp mặt']
    },
    {
      id: 2,
      question: 'Lỗ chân lông của bạn trông thế nào?',
      options: ['Nhỏ, không rõ', 'Trung bình', 'To ở vùng chữ T', 'To khắp mặt']
    },
    {
      id: 3,
      question: 'Da bạn có dễ bị mụn không?',
      options: ['Hiếm khi', 'Thỉnh thoảng', 'Thường xuyên ở vùng chữ T', 'Thường xuyên khắp mặt']
    }
  ]

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
    }
    getSubCates()
  }, [])

  useEffect(() => {
    const getQuiz = async () => {
      const response = await quizApi.getQuizzes()
      const quiz = response.data.result
      setQuizzes(quiz)
    }
    getQuiz()
  }, [])

  // Xử lý chọn đáp án
  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  // Tính toán kết quả (logic đơn giản)
  const calculateSkinType = () => {
    const answersArray = Object.values(answers)
    if (answersArray.length !== questions.length) {
      alert('Vui lòng trả lời tất cả các câu hỏi!')
      return
    }

    const dryCount = answersArray.filter((ans) => ans.includes('khô') || ans.includes('Nhỏ')).length
    const oilyCount = answersArray.filter((ans) => ans.includes('Dầu khắp mặt') || ans.includes('To khắp mặt')).length
    const combinationCount = answersArray.filter((ans) => ans.includes('chữ T')).length

    if (dryCount > oilyCount && dryCount > combinationCount) {
      setResult('Da khô')
    } else if (oilyCount > dryCount && oilyCount > combinationCount) {
      setResult('Da dầu')
    } else if (combinationCount > dryCount && combinationCount > oilyCount) {
      setResult('Da hỗn hợp')
    } else {
      setResult('Da thường')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <View>
        <ImageSlider images={images} height={300} />
      </View>

      {/* Danh mục hot */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danh mục hot</Text>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {cates.map((item) => (
            <View key={item._id} style={styles.categoryItem}>
              <Image source={{ uri: item.image }} style={styles.categoryImage} />
              <Text>{item.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bài trắc nghiệm */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bài trắc nghiệm</Text>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {quizzes.map((item) => (
            <View key={item._id} style={styles.quizItem}>
              <Text>{item.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Skin Type Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kiểm tra loại da của bạn</Text>
        {!testStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={() => setTestStarted(true)}>
            <Text style={styles.buttonText}>Bắt đầu ngay</Text>
          </TouchableOpacity>
        ) : result ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Kết quả: {result}</Text>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={() => {
                setTestStarted(false)
                setAnswers({})
                setResult(null)
              }}
            >
              <Text style={styles.buttonText}>Làm lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {questions.map((q) => (
              <View key={q.id} style={styles.questionContainer}>
                <Text style={styles.questionText}>{q.question}</Text>
                {q.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionButton, answers[q.id] === option && styles.selectedOption]}
                    onPress={() => handleAnswer(q.id, option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <TouchableOpacity style={styles.submitButton} onPress={calculateSkinType}>
              <Text style={styles.buttonText}>Xem kết quả</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5EE'
  },
  section: {
    padding: 10,
    marginTop: 10
  },
  sectionTitle: {
    textTransform: 'capitalize',
    fontSize: 20,
    fontWeight: '600',
    color: '#333'
  },
  horizontalScroll: {
    marginTop: 10
  },
  categoryItem: {
    paddingHorizontal: 5,
    alignItems: 'center'
  },
  categoryImage: {
    width: 90,
    height: 90,
    borderRadius: 20
  },
  quizItem: {
    paddingHorizontal: 5
  },
  startButton: {
    backgroundColor: '#C9A66B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  submitButton: {
    backgroundColor: '#C9A66B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  restartButton: {
    backgroundColor: '#FF9D3D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  questionContainer: {
    marginTop: 15
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10
  },
  optionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginBottom: 10
  },
  selectedOption: {
    backgroundColor: '#FADA7A',
    borderColor: '#C9A66B'
  },
  optionText: {
    fontSize: 14,
    color: '#333'
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#41644A',
    marginBottom: 10
  }
})
