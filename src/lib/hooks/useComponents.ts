// src/lib/hooks/useComponents.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Component } from '@/lib/services/componentService'

export const useComponents = (filters?: {
  vendor?: string
  category?: string
  search?: string
}) => {
  const queryParams = new URLSearchParams()
  if (filters?.vendor) queryParams.append('vendor', filters.vendor)
  if (filters?.category) queryParams.append('category', filters.category)
  if (filters?.search) queryParams.append('search', filters.search)

  return useQuery({
    queryKey: ['components', filters],
    queryFn: async (): Promise<Component[]> => {
      const response = await fetch(`/api/components?${queryParams.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch components')
      return response.json()
    },
  })
}

export const useCreateComponent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Omit<Component, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<Component> => {
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create component')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] })
    },
  })
}