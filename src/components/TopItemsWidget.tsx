import { useState } from 'react'
import type { Product } from '@/types'

type Metric = 'revenue' | 'qty'

function fmtCurrency(n: number): string {
  return `Rp ${n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

interface Props {
  data: Product[]
  loading: boolean
  error: string | null
}

export function TopItemsWidget({ data, loading, error }: Props) {
  const [metric, setMetric] = useState<Metric>('revenue')

  const sorted = [...data]
    .sort((a, b) => metric === 'qty' ? b.qty_sold - a.qty_sold : b.total_revenue - a.total_revenue)
    .slice(0, 10)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900">Top Items</h2>
          <p className="text-xs text-gray-400 mt-0.5">Top 10 items — last 30 days</p>
        </div>

        <div className="flex gap-1">
          {(['revenue', 'qty'] as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none',
                metric === m
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400',
              ].join(' ')}
            >
              {m === 'revenue' ? 'Revenue' : 'Qty'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="m-5 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          Failed to load data: {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['#', 'Item', 'Category', 'Qty', 'Revenue'].map((h) => (
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
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                    No data available
                  </td>
                </tr>
              ) : (
                sorted.map((row, i) => (
                  <tr key={row.product} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                      {row.product}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[140px] truncate">
                      {row.category}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-700">
                      {row.qty_sold.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-900 font-medium whitespace-nowrap">
                      {fmtCurrency(row.total_revenue)}
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
