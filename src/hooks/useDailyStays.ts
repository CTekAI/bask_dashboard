import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export interface DailyStay {
  arrival_date: string
  num_arrivals: number
  total_guests: number
  room_revenue: number
  folio_pos_revenue: number
  pos_outlet_revenue: number
  pos_rev_per_guest: number
}

export function useDailyStays() {
  const [data, setData] = useState<DailyStay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      const { data: rows, error: err } = await supabase
        .from('v_daily_stays_vs_pos')
        .select('arrival_date, num_arrivals, total_guests, room_revenue, folio_pos_revenue, pos_outlet_revenue, pos_rev_per_guest')
        .order('arrival_date', { ascending: false })
      if (err) setError(err.message)
      else setData(rows ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return { data, loading, error }
}
