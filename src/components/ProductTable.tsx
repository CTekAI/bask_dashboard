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
    <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-stone/20 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-brand-charcoal">{title}</h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
          {variant === 'top' ? 'Best sellers' : 'Underperformers'}
        </span>
        <span className="ml-auto text-xs text-brand-stone">Last 30 days</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-blanco">
              {['#', 'Product', 'Category', 'POS', 'Qty', 'Revenue'].map((h) => (
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
            {products.map((p, i) => (
              <tr key={`${p.product}-${i}`} className="hover:bg-brand-blanco transition-colors">
                <td className="px-4 py-3 text-brand-stone tabular-nums">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-brand-charcoal max-w-[140px] truncate">
                  {p.product}
                </td>
                <td className="px-4 py-3 text-brand-stone whitespace-nowrap">{p.category}</td>
                <td className="px-4 py-3 text-brand-stone whitespace-nowrap">{p.pos}</td>
                <td className="px-4 py-3 tabular-nums text-brand-charcoal/80">{p.qty_sold}</td>
                <td className="px-4 py-3 tabular-nums text-brand-charcoal font-medium whitespace-nowrap">
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
