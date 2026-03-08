import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Range } from '@/hooks/useDailyRevenue'

export interface PosRevenue {
  pos: string
  total_revenue: number
}

interface Result {
  data: PosRevenue[]
  loading: boolean
  error: string | null
}

function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().split('T')[0]
}

export function usePosRevenue(range: Range): Result {
  const [data, setData] = useState<PosRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('pos_sales')
        .select('pos, revenue')
        .not('pos', 'is', null)

      if (range === '7d') query = query.gte('sale_date', daysAgoIso(7))
      if (range === '30d') query = query.gte('sale_date', daysAgoIso(30))

      const { data: rows, error: err } = await query

      if (err) {
        setError(err.message)
      } else {
        const grouped = (rows ?? []).reduce<Record<string, number>>((acc, r) => {
          const key = r.pos as string
          acc[key] = (acc[key] ?? 0) + ((r.revenue as number) ?? 0)
          return acc
        }, {})

        setData(
          Object.entries(grouped)
            .map(([pos, total_revenue]) => ({ pos, total_revenue }))
            .sort((a, b) => b.total_revenue - a.total_revenue)
        )
      }
      setLoading(false)
    }
    load()
  }, [range])

  return { data, loading, error }
}
