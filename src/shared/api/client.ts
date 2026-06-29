import axios from 'axios'

export const apiClient = axios.create({
    baseURL: '/api/moex',
    timeout: 15_000,
})
