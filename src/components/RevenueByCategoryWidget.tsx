import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useDailyRevenueByCategory } from '@/hooks/useDailyRevenueByCategory'

const ALL_CATEGORIES = ['Food', 'Drink', 'Spa', 'Resort Wear', 'Others'] as const

const CATEGORY_COLORS: Record<string, string> = {
  'Food':        '#F59E0B',
  'Drink':       '#3B82F6',
  'Spa':         '#8B5CF6',
  'Resort Wear': '#EC4899',
  'Others':      '#06B6D4',
}

const inputClass =
  'text-sm border border-brand-stone/60 rounded-lg px-3 py-1.5 bg-white text-brand-charcoal/80 focus:outline-none focus:ring-2 focus:ring-brand-charcoal'

function fmtRp(n: number): string {
  return `Rp ${n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function fmtRpShort(v: number): string {
  return `Rp ${(v / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`
}

function fmtDate(s: string): string {
  return new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function RevenueByCategoryWidget() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...ALL_CATEGORIES])
  const [from, setFrom] = useState('')
  const [to, setTo]     = useState('')

  const { data, loading, error } = useDailyRevenueByCategory({
    from,
    to,
    categories: selectedCategories,
  })

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) {
        // Keep at least one selected
        if (prev.length === 1) return prev
        return prev.filter((c) => c !== cat)
      }
      return [...prev, cat]
    })
  }

  // Pivot rows into { date, Food: n, Drink: n, ... }[]
  const map = new Map<string, Record<string, number>>()
  for (const r of data) {
    const entry = map.get(r.sale_date) ?? {}
    entry[r.category] = r.category_revenue
    map.set(r.sale_date, entry)
  }
  const chartData = Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, cats]) => ({ date: fmtDate(date), ...cats }))

  return (
    <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-brand-stone/20 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-brand-charcoal">Revenue by Category</h2>
          <p className="text-xs text-brand-stone mt-0.5">Daily POS revenue per category</p>
        </div>

        {/* Category toggles */}
        <div className="flex flex-wrap gap-1">
          {ALL_CATEGORIES.map((cat) => {
            const active = selectedCategories.includes(cat)
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={[
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none',
                  active
                    ? 'text-white'
                    : 'bg-white text-brand-charcoal/70 border border-brand-stone/60 hover:border-brand-stone',
                ].join(' ')}
                style={active ? { backgroundColor: CATEGORY_COLORS[cat] } : undefined}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Date range */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-brand-stone">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={inputClass}
          />
          <label className="text-xs text-brand-stone">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={inputClass}
          />
          {(from || to) && (
            <button
              onClick={() => { setFrom(''); setTo('') }}
              className="text-sm text-brand-palm hover:text-brand-charcoal px-2 py-1.5 focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 border-4 border-brand-stone/40 border-t-brand-charcoal rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            Failed to load data: {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-brand-stone">
            No data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e2db" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#D1C7BB' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={fmtRpShort}
                tick={{ fontSize: 10, fill: '#D1C7BB' }}
                tickLine={false}
                axisLine={false}
                width={52}
              />
              <Tooltip
                formatter={(value: number | undefined) => fmtRp(value ?? 0)}
                labelStyle={{ color: '#212121', fontWeight: 600, fontSize: 12 }}
                contentStyle={{ border: '1px solid #D1C7BB', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              {selectedCategories.map((cat) => (
                <Line
                  key={cat}
                  type="monotone"
                  dataKey={cat}
                  name={cat}
                  stroke={CATEGORY_COLORS[cat] ?? '#D1C7BB'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
