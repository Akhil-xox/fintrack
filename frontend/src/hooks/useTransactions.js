import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await api.get('/transactions/')
      return data
    }
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/transactions/', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] })
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/transactions/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] })
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/transactions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] })
  })
}