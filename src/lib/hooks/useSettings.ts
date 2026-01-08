// src/lib/hooks/useSettings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Setting } from '@/lib/services/settingsService'

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<Setting[]> => {
      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('Failed to fetch settings')
      return response.json()
    },
  })
}

export const useUpdateSetting = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }): Promise<Setting> => {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      if (!response.ok) throw new Error('Failed to update setting')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}