import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Result {
  outlets: string[]
  categories: string[]
  loading: boolean
  error: string | null
}

export async function fetchOutlets(): Promise<string[]> {
  const { data, error } = await supabase
    .from('pos_sales')
    .select('pos')
  if (error || !data) {
    console.error('fetchOutlets error', error)
    return []
  }
  return [...new Set(data.map((r) => r.pos as string).filter(Boolean))].sort()
}

export async function fetchCategories(outlet?: string | null): Promise<string[]> {
  let query = supabase.from('pos_sales').select('category')
  if (outlet && outlet !== 'All Outlets') {
    query = query.eq('pos', outlet)
  }
  const { data, error } = await query
  if (error || !data) {
    console.error('fetchCategories error', error)
    return []
  }
  return [...new Set(data.map((r) => r.category as string).filter(Boolean))].sort()
}

export function useFilterOptions(outlet = ''): Result {
  const [outlets, setOutlets] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load outlets once on mount
  useEffect(() => {
    fetchOutlets()
      .then(setOutlets)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Reload categories whenever the selected outlet changes
  useEffect(() => {
    fetchCategories(outlet || undefined)
      .then(setCategories)
      .catch((e: Error) => setError(e.message))
  }, [outlet])

  return { outlets, categories, loading, error }
}
