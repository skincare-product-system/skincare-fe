import http from '../utils/http'

const quizUrl = '/api/quizzes'
const quizApi = {
  async getQuizzes() {
    return await http.get(`${quizUrl}/all`)
  }
}
export default quizApi
