import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export function useBudgets(month, year) {
  return useQuery({
    queryKey: ['budgets', month, year],
    queryFn: async () => {
      const { data } = await api.get('/budgets/', { params: { month, year } })
      return data
    }
  })
}

export function useUpsertBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/budgets/', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budgets'] })
  })
}