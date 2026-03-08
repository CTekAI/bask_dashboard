import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { SpendByGuestType } from '@/types'

export interface SpendByGuestTypeOptions {
  from?: string
  to?: string
  guestType?: 'in_house' | 'walk_in' | 'all'
}

interface Result {
  data: SpendByGuestType[]
  loading: boolean
  error: string | null
}

export async function fetchSpendByGuestType(
  { from = '', to = '', guestType = 'all' }: SpendByGuestTypeOptions = {}
): Promise<SpendByGuestType[]> {
  let query = supabase
    .from('v_spend_by_guest_type')
    .select('sale_date, guest_type, total_revenue, txn_count')
    .order('sale_date', { ascending: true })

  if (from) query = query.gte('sale_date', from)
  if (to)   query = query.lte('sale_date', to)
  if (guestType && guestType !== 'all') query = query.eq('guest_type', guestType)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as SpendByGuestType[]
}

export function useSpendByGuestType(
  { from = '', to = '', guestType = 'all' }: SpendByGuestTypeOptions = {}
): Result {
  const [data, setData] = useState<SpendByGuestType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const rows = await fetchSpendByGuestType({ from, to, guestType })
        setData(rows)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
      setLoading(false)
    }
    load()
  }, [from, to, guestType])

  return { data, loading, error }
}
