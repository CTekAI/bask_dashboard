import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export interface TodayRevenueBreakdown {
  date: string
  roomRevenue: number
  posRevenue: number
  totalRevenue: number
}

export async function fetchTodayRevenueBreakdown(): Promise<TodayRevenueBreakdown | null> {
  // Fetch latest date from each source in parallel (DB dates, not browser clock)
  const [{ data: roomLatest }, { data: posLatest }] = await Promise.all([
    supabase
      .from('v_daily_stays_vs_pos')
      .select('arrival_date')
      .order('arrival_date', { ascending: false })
      .limit(1),
    supabase
      .from('v_daily_revenue')
      .select('sale_date')
      .order('sale_date', { ascending: false })
      .limit(1),
  ])

  const roomDate = roomLatest?.[0]?.arrival_date ?? null
  const posDate  = posLatest?.[0]?.sale_date     ?? null
  if (!roomDate && !posDate) return null

  // "Today" = max of the two latest dates
  const todayDate = [roomDate, posDate].filter(Boolean).sort().pop()!

  // Fetch revenue rows for todayDate from both sources in parallel
  const [{ data: roomRows }, { data: posRows }] = await Promise.all([
    supabase
      .from('v_daily_stays_vs_pos')
      .select('room_revenue')
      .eq('arrival_date', todayDate),
    supabase
      .from('v_daily_revenue')
      .select('total_revenue')
      .eq('sale_date', todayDate),
  ])

  const roomRevenue = (roomRows ?? []).reduce((s, r) => s + Number(r.room_revenue   ?? 0), 0)
  const posRevenue  = (posRows  ?? []).reduce((s, r) => s + Number(r.total_revenue  ?? 0), 0)

  return {
    date: todayDate,
    roomRevenue,
    posRevenue,
    totalRevenue: roomRevenue + posRevenue,
  }
}

interface Result {
  data: TodayRevenueBreakdown | null
  loading: boolean
  error: string | null
}

export function useTodayRevenueBreakdown(): Result {
  const [data,    setData]    = useState<TodayRevenueBreakdown | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    fetchTodayRevenueBreakdown()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
