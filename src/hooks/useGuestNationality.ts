import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export interface NationalityRow {
  nationality: string
  visits: number
  total_revenue: number
  avg_ticket: number
}

export function useGuestNationality() {
  const [data, setData] = useState<NationalityRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      const { data: rows, error: err } = await supabase
        .from('v_top_nationalities_by_revenue')
        .select('nationality, visits, total_revenue, avg_ticket')
      if (err) setError(err.message)
      else setData(rows ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return { data, loading, error }
}
