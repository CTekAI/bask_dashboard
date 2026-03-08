import { supabase } from '@/lib/supabaseClient'

export type PosCustomerItemBreakdown = {
  category: string
  product: string
  total_qty: number
  total_revenue: number
}

export async function fetchCustomerPosItems(params: {
  customerName: string
}): Promise<PosCustomerItemBreakdown[]> {
  const { customerName } = params

  const { data, error } = await supabase
    .from('pos_sales')
    .select('category, product, qty, revenue')
    .eq('customer_name', customerName)

  if (error || !data) {
    console.error('fetchCustomerPosItems error', error)
    return []
  }

  const map = new Map<string, PosCustomerItemBreakdown>()

  for (const row of data as any[]) {
    const key = `${row.category}|||${row.product}`
    const existing = map.get(key) ?? {
      category: row.category,
      product: row.product,
      total_qty: 0,
      total_revenue: 0,
    }
    existing.total_qty += Number(row.qty ?? 0)
    existing.total_revenue += Number(row.revenue ?? 0)
    map.set(key, existing)
  }

  return Array.from(map.values()).sort((a, b) => b.total_revenue - a.total_revenue)
}


export type PosCustomerSpend = {
  customer_name: string
  nationality: string | null
  country: string | null
  num_checks: number
  total_spend: number
  avg_check_value: number
}

export async function fetchTopPosSpenders(params: {
  limit?: number
}): Promise<PosCustomerSpend[]> {
  const { limit = 20 } = params

  const { data, error } = await supabase
    .from('v_pos_spend_by_customer')
    .select('*')
    .order('total_spend', { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error('fetchTopPosSpenders error', error)
    return []
  }

  return data.map((row: any) => ({
    customer_name: row.customer_name,
    nationality: row.nationality,
    country: row.country,
    num_checks: Number(row.num_checks),
    total_spend: Number(row.total_spend),
    avg_check_value: Number(row.avg_check_value),
  }))
}
