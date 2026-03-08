import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { TopItemByCategory } from '@/types'

export type SortBy = 'revenue' | 'qty'

interface Options {
  category: string
  limit?: number
  sortBy?: SortBy
  outlet?: string
}

interface Result {
  data: TopItemByCategory[]
  loading: boolean
  error: string | null
}

export async function fetchTopItemsByCategory(
  { category, limit = 10, sortBy = 'revenue', outlet }: Options
): Promise<TopItemByCategory[]> {
  const orderColumn = sortBy === 'qty' ? 'total_qty' : 'total_revenue'

  let query = supabase
    .from('v_top_items_by_category')
    .select('category, item_name, total_qty, total_revenue')
    .eq('category', category)
    .order(orderColumn, { ascending: false })
    .limit(limit)

  if (outlet) query = query.eq('outlet', outlet)

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return (data ?? []) as TopItemByCategory[]
}

export function useTopItemsByCategory(
  { category, limit = 10, sortBy = 'revenue', outlet }: Options
): Result {
  const [data, setData] = useState<TopItemByCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const rows = await fetchTopItemsByCategory({ category, limit, sortBy, outlet })
        setData(rows)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
      setLoading(false)
    }
    load()
  }, [category, limit, sortBy, outlet])

  return { data, loading, error }
}
