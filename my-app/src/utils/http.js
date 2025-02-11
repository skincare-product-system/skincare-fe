import axios from 'axios'

const ip = `192.168.1.30`
class Http {
  instance
  constructor() {
    this.instance = axios.create({
      baseURL: `http://${ip}:3000/`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
const http = new Http().instance
export default http
