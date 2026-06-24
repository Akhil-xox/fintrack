import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export function useSummary(month, year) {
  return useQuery({
    queryKey: ['summary', month, year],
    queryFn: async () => {
      const { data } = await api.get('/analytics/summary', { params: { month, year } })
      return data
    }
  })
}

export function useSpendByCategory(month, year) {
  return useQuery({
    queryKey: ['spendByCategory', month, year],
    queryFn: async () => {
      const { data } = await api.get('/analytics/by-category', { params: { month, year } })
      return data
    }
  })
}

export function useMonthlyTrend() {
  return useQuery({
    queryKey: ['monthlyTrend'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/monthly-trend')
      return data
    }
  })
}