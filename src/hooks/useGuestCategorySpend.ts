import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { GuestCategorySpend } from '@/types'

interface Result {
  data: GuestCategorySpend[]
  loading: boolean
  error: string | null
}

export function useGuestCategorySpend(guestName: string | null): Result {
  const [data, setData] = useState<GuestCategorySpend[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!guestName) {
      setData([])
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)

      const { data: rows, error: err } = await supabase
        .from('v_guest_spend_by_category')
        .select('guest_name, category, category_spend, category_qty')
        .eq('guest_name', guestName)
        .order('category_spend', { ascending: false })

      if (err) setError(err.message)
      else setData(rows ?? [])
      setLoading(false)
    }
    load()
  }, [guestName])

  return { data, loading, error }
}
