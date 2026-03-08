import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Product, ProductFilters } from '@/types'

interface Result {
  data: Product[]
  loading: boolean
  error: string | null
}

export function useTopProducts(filters: ProductFilters): Result {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('v_top_products_30d')
        .select('product, category, pos, qty_sold, total_revenue, avg_price')

      if (filters.outlet) query = query.eq('pos', filters.outlet)
      if (filters.category) query = query.eq('category', filters.category)

      const { data: rows, error: err } = await query.limit(20)

      if (err) setError(err.message)
      else setData(rows ?? [])
      setLoading(false)
    }
    load()
  }, [filters.outlet, filters.category])

  return { data, loading, error }
}
