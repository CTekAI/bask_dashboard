import type { GuestCategorySpend } from '@/types'

interface Props {
  data: GuestCategorySpend[]
  loading: boolean
}

function fmtCurrency(n: number): string {
  return `Rp ${n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-blue-500',
  Drink: 'bg-emerald-500',
  Beverage: 'bg-emerald-500',
  Spa: 'bg-purple-500',
  Room: 'bg-amber-500',
  Activity: 'bg-orange-500',
  Retail: 'bg-pink-500',
}

function barColor(category: string): string {
  const key = Object.keys(CATEGORY_COLORS).find((k) =>
    category.toLowerCase().includes(k.toLowerCase())
  )
  return key ? CATEGORY_COLORS[key] : 'bg-gray-400'
}

export function GuestCategoryBreakdown({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (data.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">No category data</p>
  }

  const max = Math.max(...data.map((r) => Number(r.category_spend)))

  return (
    <div className="space-y-3">
      {data.map((row) => {
        const spend = Number(row.category_spend)
        const pct = max > 0 ? (spend / max) * 100 : 0
        return (
          <div key={row.category}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-medium text-gray-700">{row.category}</span>
              <span className="text-sm tabular-nums text-gray-900">{fmtCurrency(spend)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-2 rounded-full ${barColor(row.category)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{Number(row.category_qty).toLocaleString()} items</p>
          </div>
        )
      })}
    </div>
  )
}
