import http from '../utils/http'

const quizUrl = '/api/quizzes'
const quỉzScoreUrl = '/api/quizTemplateScores'
const quizApi = {
  async getQuizzes() {
    return await http.get(`${quizUrl}/all`)
  },
  async getQuizDetail(id) {
    return await http.get(`${quizUrl}/${id}`)
  },
  async getQuizScore(quizId) {
    return await http.get(`${quỉzScoreUrl}/${quizId}`)
  }
}
export default quizApi
