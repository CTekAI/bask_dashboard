import { useEffect, useState } from 'react'
import {
  fetchTopPosSpenders,
  fetchCustomerPosItems,
  type PosCustomerSpend,
  type PosCustomerItemBreakdown,
} from '@/hooks/usePosCustomerSpend'

function fmtCurrency(n: number): string {
  return `Rp ${n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function TopPosSpendersWidget() {
  const [rows, setRows] = useState<PosCustomerSpend[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [items, setItems] = useState<PosCustomerItemBreakdown[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)

  useEffect(() => {
    fetchTopPosSpenders({ limit: 20 })
      .then(setRows)
      .finally(() => setLoading(false))
  }, [])

  async function handleRowClick(customerName: string) {
    if (selectedCustomer === customerName) {
      setSelectedCustomer(null)
      setItems([])
      return
    }
    setSelectedCustomer(customerName)
    setItems([])
    setItemsLoading(true)
    const data = await fetchCustomerPosItems({ customerName })
    setItems(data)
    setItemsLoading(false)
  }

  return (
    <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-stone/20">
        <h2 className="text-sm font-semibold text-brand-charcoal">Top POS Spenders</h2>
        <p className="text-xs text-brand-stone mt-0.5">Based on all POS checks</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-4 border-brand-stone/40 border-t-brand-charcoal rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <p className="px-5 py-8 text-sm text-brand-stone">No POS spend data yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-blanco">
                  {['Customer', 'Nationality', 'Checks', 'Total Spend', 'Avg / Check'].map((h) => (
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
                {rows.map((row) => (
                  <tr
                    key={row.customer_name}
                    onClick={() => handleRowClick(row.customer_name)}
                    className={[
                      'cursor-pointer transition-colors',
                      selectedCustomer === row.customer_name ? 'bg-brand-mist/20' : 'hover:bg-brand-blanco',
                    ].join(' ')}
                  >
                    <td className="px-4 py-3 font-medium text-brand-charcoal">{row.customer_name}</td>
                    <td className="px-4 py-3 text-brand-charcoal/70">{row.nationality ?? row.country ?? 'Unknown'}</td>
                    <td className="px-4 py-3 tabular-nums text-brand-charcoal/80">{row.num_checks.toLocaleString()}</td>
                    <td className="px-4 py-3 tabular-nums text-brand-charcoal font-medium whitespace-nowrap">
                      {fmtCurrency(row.total_spend)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-brand-charcoal/80 whitespace-nowrap">
                      {fmtCurrency(row.avg_check_value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedCustomer && (
            <div className="px-5 py-4 border-t border-brand-stone/20">
              <p className="text-xs font-semibold text-brand-charcoal/80 mb-3">
                What {selectedCustomer} buys
              </p>
              {itemsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 border-4 border-brand-stone/40 border-t-brand-charcoal rounded-full animate-spin" />
                </div>
              ) : items.length === 0 ? (
                <p className="text-sm text-brand-stone">No POS items for this customer.</p>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-brand-blanco">
                      {['Category', 'Item', 'Qty', 'Revenue'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2 text-left font-medium text-brand-stone uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-stone/20">
                    {items.slice(0, 20).map((item) => (
                      <tr key={`${item.category}-${item.product}`} className="hover:bg-brand-blanco">
                        <td className="px-4 py-2 text-brand-charcoal/70">{item.category}</td>
                        <td className="px-4 py-2 text-brand-charcoal">{item.product}</td>
                        <td className="px-4 py-2 tabular-nums text-brand-charcoal/80 text-right">{item.total_qty.toLocaleString()}</td>
                        <td className="px-4 py-2 tabular-nums text-brand-charcoal font-medium text-right whitespace-nowrap">
                          {fmtCurrency(item.total_revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
