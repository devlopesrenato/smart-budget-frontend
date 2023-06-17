import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.response.use(
  response => response,
  error => {

    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        console.log('UNAUTHORIZED')
      } else if (status === 404) {
        console.log('Recurso não encontrado')
      } else if (status === 500) {
        console.log('Erro interno do servidor')
      } else {
        console.log(`Erro ${status}: ${data.message}`)
      }
    } else if (error.request) {
      console.log('Erro de requisição:', error.request)
    } else {
      console.log('Erro:', error.message)
    }

    return Promise.reject(error)
  }
)
