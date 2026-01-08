// ============================================
// 1. REACT HOOKS FOR DATA FETCHING
// ============================================

// src/lib/hooks/useQuotes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Quote, CreateQuoteInput, UpdateQuoteInput } from '@/types/quote'

export const useQuotes = () => {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: async (): Promise<Quote[]> => {
      const response = await fetch('/api/quotes')
      if (!response.ok) throw new Error('Failed to fetch quotes')
      return response.json()
    },
  })
}

export const useQuote = (id: string) => {
  return useQuery({
    queryKey: ['quotes', id],
    queryFn: async (): Promise<Quote> => {
      const response = await fetch(`/api/quotes/${id}`)
      if (!response.ok) throw new Error('Failed to fetch quote')
      return response.json()
    },
    enabled: !!id,
  })
}

export const useCreateQuote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateQuoteInput): Promise<Quote> => {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create quote')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
  })
}

export const useUpdateQuote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateQuoteInput }): Promise<Quote> => {
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update quote')
      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      queryClient.invalidateQueries({ queryKey: ['quotes', variables.id] })
    },
  })
}

export const useDeleteQuote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete quote')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
  })
}