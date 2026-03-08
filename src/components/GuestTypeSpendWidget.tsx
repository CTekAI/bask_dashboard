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
import { useSpendByGuestType } from '@/hooks/useSpendByGuestType'
import type { SpendByGuestType } from '@/types'

type GuestTypeFilter = 'all' | 'in_house' | 'walk_in'

const GUEST_TYPE_OPTIONS: { label: string; value: GuestTypeFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'In-house', value: 'in_house' },
  { label: 'Walk-in', value: 'walk_in' },
]

const COLOR_IN_HOUSE = '#3B82F6'
const COLOR_WALK_IN  = '#06B6D4'

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

function fmtDateLong(s: string): string {
  return new Date(s + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function pivotForChart(rows: SpendByGuestType[]) {
  const map = new Map<string, { date: string; in_house: number; walk_in: number }>()
  for (const r of rows) {
    const entry = map.get(r.sale_date) ?? { date: r.sale_date, in_house: 0, walk_in: 0 }
    if (r.guest_type === 'in_house') entry.in_house = r.total_revenue
    else entry.walk_in = r.total_revenue
    map.set(r.sale_date, entry)
  }
  return Array.from(map.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({ ...r, date: fmtDate(r.date) }))
}

function singleSeriesForChart(rows: SpendByGuestType[]) {
  return rows.map((r) => ({ date: fmtDate(r.sale_date), revenue: r.total_revenue }))
}

export function GuestTypeSpendWidget() {
  const [guestType, setGuestType] = useState<GuestTypeFilter>('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const { data, loading, error } = useSpendByGuestType({ from, to, guestType })

  const chartData =
    guestType === 'all' ? pivotForChart(data) : singleSeriesForChart(data)

  const seriesColor = guestType === 'walk_in' ? COLOR_WALK_IN : COLOR_IN_HOUSE

  return (
    <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-brand-stone/20 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-brand-charcoal">In-house vs Walk-in Spend</h2>
          <p className="text-xs text-brand-stone mt-0.5">Revenue by guest type over time</p>
        </div>

        {/* Guest type selector */}
        <div className="flex gap-1">
          {GUEST_TYPE_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setGuestType(value)}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none',
                guestType === value
                  ? 'bg-brand-charcoal text-white'
                  : 'bg-white text-brand-charcoal/70 border border-brand-stone/60 hover:border-brand-charcoal hover:text-brand-charcoal',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
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
        ) : (
          <ResponsiveContainer width="100%" height={240}>
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

              {guestType === 'all' ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="in_house"
                    name="In-house"
                    stroke={COLOR_IN_HOUSE}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="walk_in"
                    name="Walk-in"
                    stroke={COLOR_WALK_IN}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name={guestType === 'in_house' ? 'In-house' : 'Walk-in'}
                  stroke={seriesColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      {!loading && !error && (
        <div className="border-t border-brand-stone/20 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-blanco">
                {['Date', 'Guest Type', 'Total Revenue', 'Txn Count'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-xs font-medium text-brand-stone uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-stone/20">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-brand-stone">
                    No data
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={`${row.sale_date}-${row.guest_type}-${i}`} className="hover:bg-brand-blanco transition-colors">
                    <td className="px-4 py-3 text-brand-charcoal/80 whitespace-nowrap">{fmtDateLong(row.sale_date)}</td>
                    <td className="px-4 py-3 text-brand-charcoal/70 whitespace-nowrap">
                      {row.guest_type === 'in_house' ? 'In-house' : 'Walk-in'}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-brand-charcoal font-medium whitespace-nowrap">
                      {fmtRp(row.total_revenue)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-brand-charcoal/80">
                      {row.txn_count.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
