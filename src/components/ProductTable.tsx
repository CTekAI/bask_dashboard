import type { Product } from '@/types'

interface ProductTableProps {
  title: string
  products: Product[]
  variant: 'top' | 'bottom'
}

function fmtCurrency(n: number): string {
  return `Rp ${n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function ProductTable({ title, products, variant }: ProductTableProps) {
  const badgeClass =
    variant === 'top'
      ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
      : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
          {variant === 'top' ? 'Best sellers' : 'Underperformers'}
        </span>
        <span className="ml-auto text-xs text-gray-400">Last 30 days</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['#', 'Product', 'Category', 'POS', 'Qty', 'Revenue'].map((h) => (
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
            {products.map((p, i) => (
              <tr key={`${p.product}-${i}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 tabular-nums">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900 max-w-[140px] truncate">
                  {p.product}
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.category}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.pos}</td>
                <td className="px-4 py-3 tabular-nums text-gray-700">{p.qty_sold}</td>
                <td className="px-4 py-3 tabular-nums text-gray-900 font-medium whitespace-nowrap">
                  {fmtCurrency(p.total_revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
