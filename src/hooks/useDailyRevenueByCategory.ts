import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { DailyRevenueByCategory } from '@/types'

export const KNOWN_CATEGORIES = ['Food', 'Drink', 'Spa', 'Resort Wear', 'Others'] as const

export interface CategoryRevenue {
  category: string
  category_revenue: number
}

interface Options {
  from?: string
  to?: string
  categories?: string[]
}

interface Result {
  data: DailyRevenueByCategory[]
  loading: boolean
  error: string | null
}

export async function fetchDailyRevenueByCategory(
  { from = '', to = '', categories }: Options = {}
): Promise<DailyRevenueByCategory[]> {
  let query = supabase
    .from('v_daily_revenue_by_category')
    .select('sale_date, category, category_revenue')
    .order('sale_date', { ascending: true })

  if (from) query = query.gte('sale_date', from)
  if (to)   query = query.lte('sale_date', to)
  if (categories && categories.length > 0) query = query.in('category', categories)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as DailyRevenueByCategory[]
}

export function useDailyRevenueByCategory(
  { from = '', to = '', categories }: Options = {}
): Result {
  const [data, setData] = useState<DailyRevenueByCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const categoriesKey = JSON.stringify(categories)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const rows = await fetchDailyRevenueByCategory({ from, to, categories })
        setData(rows)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
      setLoading(false)
    }
    load()
  // categoriesKey replaces the array in the dep array to avoid infinite re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, categoriesKey])

  return { data, loading, error }
}

const ZERO_CATEGORIES: CategoryRevenue[] = KNOWN_CATEGORIES.map((c) => ({
  category: c,
  category_revenue: 0,
}))

export async function fetchTodayRevenueByCategory(): Promise<CategoryRevenue[]> {
  // Step 1: get the most recent sale_date from the DB (timezone-safe — date comes from DB, not client)
  const { data: latestRows } = await supabase
    .from('v_daily_revenue_by_category')
    .select('sale_date')
    .order('sale_date', { ascending: false })
    .limit(1)

  if (!latestRows?.[0]?.sale_date) return ZERO_CATEGORIES

  const todayDate = latestRows[0].sale_date

  // Step 2: get all category rows for that date
  const { data: rows, error } = await supabase
    .from('v_daily_revenue_by_category')
    .select('category, category_revenue')
    .eq('sale_date', todayDate)

  if (error) throw new Error(error.message)

  // Fill zeros for any KNOWN_CATEGORIES not present in today's data
  const resultMap = new Map((rows ?? []).map((r) => [r.category as string, r.category_revenue as number]))
  return KNOWN_CATEGORIES.map((c) => ({
    category: c,
    category_revenue: resultMap.get(c) ?? 0,
  }))
}

interface TodayResult {
  data: CategoryRevenue[]
  loading: boolean
  error: string | null
}

export function useTodayRevenueByCategory(): TodayResult {
  const [data, setData] = useState<CategoryRevenue[]>(ZERO_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setData(await fetchTodayRevenueByCategory())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
      setLoading(false)
    }
    load()
  }, [])

  return { data, loading, error }
}
