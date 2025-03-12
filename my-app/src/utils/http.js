import axios from 'axios'

class Http {
  instance
  constructor() {
    this.instance = axios.create({
      baseURL: `https://skincare-be-mma.onrender.com`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
const http = new Http().instance
export default http
