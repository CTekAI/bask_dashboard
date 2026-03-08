import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { GuestSpend } from '@/types'

interface Options {
  from?: string
  to?: string
  limit?: number
}

interface Result {
  data: GuestSpend[]
  loading: boolean
  error: string | null
}

export function useTopGuestSpenders({ from = '', to = '', limit = 20 }: Options = {}): Result {
  const [data, setData] = useState<GuestSpend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('v_guest_spend')
        .select('guest_name, first_txn_date, last_txn_date, total_spend, txn_count')
        .order('total_spend', { ascending: false })
        .limit(limit)

      if (from) query = query.gte('first_txn_date', from)
      if (to) query = query.lte('last_txn_date', to)

      const { data: rows, error: err } = await query

      if (err) setError(err.message)
      else setData(rows ?? [])
      setLoading(false)
    }
    load()
  }, [from, to, limit])

  return { data, loading, error }
}
