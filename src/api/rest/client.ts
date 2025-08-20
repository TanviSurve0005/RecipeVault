import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.REST_URI || 'http://localhost:3001'
})