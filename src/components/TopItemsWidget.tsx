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
    <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-stone/20 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-brand-charcoal">Top Items</h2>
          <p className="text-xs text-brand-stone mt-0.5">Top 10 items — last 30 days</p>
        </div>

        <div className="flex gap-1">
          {(['revenue', 'qty'] as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none',
                metric === m
                  ? 'bg-brand-charcoal text-white'
                  : 'bg-white text-brand-charcoal/70 border border-brand-stone/60 hover:border-brand-stone',
              ].join(' ')}
            >
              {m === 'revenue' ? 'Revenue' : 'Qty'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-4 border-brand-stone/40 border-t-brand-charcoal rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="m-5 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          Failed to load data: {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-blanco">
                {['#', 'Item', 'Category', 'Qty', 'Revenue'].map((h) => (
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
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-brand-stone">
                    No data available
                  </td>
                </tr>
              ) : (
                sorted.map((row, i) => (
                  <tr key={row.product} className="hover:bg-brand-blanco transition-colors">
                    <td className="px-4 py-3 text-brand-stone tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-brand-charcoal max-w-[200px] truncate">
                      {row.product}
                    </td>
                    <td className="px-4 py-3 text-brand-stone max-w-[140px] truncate">
                      {row.category}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-brand-charcoal/80">
                      {row.qty_sold.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-brand-charcoal font-medium whitespace-nowrap">
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
