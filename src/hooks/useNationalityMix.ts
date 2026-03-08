import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { CurrentInhouseNationality, NationalityByStay, NationalityAggregate } from '@/types'

export type NationalityMode = 'inhouse' | 'range'

interface Result {
  data: NationalityAggregate[]
  loading: boolean
  error: string | null
}

export async function fetchCurrentInhouseNationality(): Promise<CurrentInhouseNationality[]> {
  const { data, error } = await supabase
    .from('v_current_inhouse_nationality')
    .select('nationality, num_stays, total_guests')
  if (error) throw new Error(error.message)
  return (data ?? []) as CurrentInhouseNationality[]
}

export async function fetchNationalityByStayRange(
  from: string,
  to: string
): Promise<NationalityAggregate[]> {
  const { data, error } = await supabase
    .from('v_nationality_by_stay')
    .select('nationality, arrival_date, departure_date, persons')
    .lte('arrival_date', to)
    .gte('departure_date', from)
  if (error) throw new Error(error.message)

  const grouped = ((data ?? []) as NationalityByStay[]).reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.nationality] = (acc[r.nationality] ?? 0) + (r.persons ?? 0)
      return acc
    },
    {}
  )

  return Object.entries(grouped)
    .map(([nationality, totalGuests]) => ({ nationality, totalGuests }))
    .sort((a, b) => b.totalGuests - a.totalGuests)
}

export function useNationalityMix(
  mode: NationalityMode,
  from = '',
  to = ''
): Result {
  const [data, setData] = useState<NationalityAggregate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'range' && (!from || !to)) {
      setData([])
      setLoading(false)
      setError(null)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (mode === 'inhouse') {
          const rows = await fetchCurrentInhouseNationality()
          setData(
            rows
              .map((r) => ({ nationality: r.nationality, totalGuests: r.total_guests }))
              .sort((a, b) => b.totalGuests - a.totalGuests)
          )
        } else {
          setData(await fetchNationalityByStayRange(from, to))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
      setLoading(false)
    }
    load()
  }, [mode, from, to])

  return { data, loading, error }
}
