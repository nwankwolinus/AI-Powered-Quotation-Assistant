// src/lib/hooks/useClients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Client {
  id: string
  name: string
  address?: string
  contact_person?: string
  phone?: string
  email?: string
  created_by: string
  created_at: string
  updated_at: string
}

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async (): Promise<Client[]> => {
      const response = await fetch('/api/clients')
      if (!response.ok) throw new Error('Failed to fetch clients')
      return response.json()
    },
  })
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<Client> => {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create client')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}