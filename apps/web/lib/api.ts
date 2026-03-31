import axios from 'axios'

export const API_VERSION = 'v1'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends httpOnly cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api