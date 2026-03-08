import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { DailyRevenue } from '@/types'

export type Range = '7d' | '30d' | 'all'

interface Result {
  data: DailyRevenue[]
  loading: boolean
  error: string | null
}

function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().split('T')[0]
}

export function useDailyRevenue(range: Range = '30d'): Result {
  const [data, setData] = useState<DailyRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('v_daily_revenue')
        .select('sale_date, total_revenue, tickets, total_items')
        .order('sale_date', { ascending: true })

      if (range === '7d') query = query.gte('sale_date', daysAgoIso(7))
      if (range === '30d') query = query.gte('sale_date', daysAgoIso(30))

      const { data: rows, error: err } = await query

      if (err) setError(err.message)
      else setData(rows ?? [])
      setLoading(false)
    }
    load()
  }, [range])

  return { data, loading, error }
}
