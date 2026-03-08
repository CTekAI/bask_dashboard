import { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useNationalityMix, type NationalityMode } from '@/hooks/useNationalityMix'

const MODE_OPTIONS: { label: string; value: NationalityMode }[] = [
  { label: 'Currently in house', value: 'inhouse' },
  { label: 'Date range', value: 'range' },
]

const inputClass =
  'text-sm border border-brand-stone/60 rounded-lg px-3 py-1.5 bg-white text-brand-charcoal/80 focus:outline-none focus:ring-2 focus:ring-brand-charcoal'

function truncate(s: string, n = 16): string {
  return s.length > n ? s.slice(0, n) + '…' : s
}

export function NationalityMixWidget() {
  const [mode, setMode] = useState<NationalityMode>('inhouse')
  const [from, setFrom] = useState('')
  const [to, setTo]     = useState('')

  const { data, loading, error } = useNationalityMix(mode, from, to)

  const chartData = data
    .map((r) => ({ name: truncate(r.nationality), guests: r.totalGuests }))

  const showPlaceholder = mode === 'range' && (!from || !to)

  return (
    <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-brand-stone/20 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-brand-charcoal">Nationality Mix</h2>
          <p className="text-xs text-brand-stone mt-0.5">Guest count by nationality</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1">
          {MODE_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none',
                mode === value
                  ? 'bg-brand-charcoal text-white'
                  : 'bg-white text-brand-charcoal/70 border border-brand-stone/60 hover:border-brand-charcoal hover:text-brand-charcoal',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Date pickers — only visible in range mode */}
        {mode === 'range' && (
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
        )}
      </div>

      {/* Chart */}
      <div className="p-5">
        {showPlaceholder ? (
          <div className="flex items-center justify-center h-40 text-sm text-brand-stone">
            Select a date range to view data
          </div>
        ) : loading ? (
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
          <ResponsiveContainer width="100%" height={Math.max(280, chartData.length * 36)}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 0, right: 16, left: 4, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e2db" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: '#D1C7BB' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 11, fill: '#212121' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: number | undefined) => [(value ?? 0).toLocaleString(), 'Guests']}
                labelStyle={{ color: '#212121', fontWeight: 600, fontSize: 12 }}
                contentStyle={{ border: '1px solid #D1C7BB', borderRadius: '8px', fontSize: '12px' }}
                cursor={{ fill: '#FAF7F5' }}
              />
              <Bar dataKey="guests" fill="#3B82F6" radius={[0, 4, 4, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      {!showPlaceholder && !loading && !error && (
        <div className="border-t border-brand-stone/20 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-blanco">
                {['#', 'Nationality', 'Guests'].map((h) => (
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
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-brand-stone">
                    No data
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={row.nationality} className="hover:bg-brand-blanco transition-colors">
                    <td className="px-4 py-3 text-brand-stone tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-brand-charcoal">{row.nationality}</td>
                    <td className="px-4 py-3 tabular-nums text-brand-charcoal/80">
                      {row.totalGuests.toLocaleString()}
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
