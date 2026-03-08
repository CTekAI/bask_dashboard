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

const COLOR_IN_HOUSE = '#2563eb'
const COLOR_WALK_IN  = '#10b981'

const inputClass =
  'text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'

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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900">In-house vs Walk-in Spend</h2>
          <p className="text-xs text-gray-400 mt-0.5">Revenue by guest type over time</p>
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400 hover:text-blue-600',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-gray-500">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={inputClass}
          />
          <label className="text-xs text-gray-500">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={inputClass}
          />
          {(from || to) && (
            <button
              onClick={() => { setFrom(''); setTo('') }}
              className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1.5 focus:outline-none"
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
            <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            Failed to load data: {error}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={fmtRpShort}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                width={52}
              />
              <Tooltip
                formatter={(value: number) => fmtRp(value)}
                labelStyle={{ color: '#111827', fontWeight: 600, fontSize: 12 }}
                contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
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
        <div className="border-t border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Date', 'Guest Type', 'Total Revenue', 'Txn Count'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={`${row.sale_date}-${row.guest_type}-${i}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{fmtDateLong(row.sale_date)}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {row.guest_type === 'in_house' ? 'In-house' : 'Walk-in'}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-900 font-medium whitespace-nowrap">
                      {fmtRp(row.total_revenue)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-700">
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
