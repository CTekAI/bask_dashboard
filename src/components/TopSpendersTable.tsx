import type { GuestSpend } from '@/types'

interface Props {
  data: GuestSpend[]
  loading: boolean
  error: string | null
  from: string
  to: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
  onSelectGuest: (name: string) => void
  selectedGuest: string | null
}

function fmtCurrency(n: number): string {
  return `Rp ${n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const inputClass =
  'text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'

export function TopSpendersTable({
  data,
  loading,
  error,
  from,
  to,
  onFromChange,
  onToChange,
  onSelectGuest,
  selectedGuest,
}: Props) {
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
        Failed to load guests: {error}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900">Top Spenders</h2>
          <p className="text-xs text-gray-400 mt-0.5">{data.length} guests</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-gray-500">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className={inputClass}
          />
          <label className="text-xs text-gray-500">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className={inputClass}
          />
          {(from || to) && (
            <button
              onClick={() => { onFromChange(''); onToChange('') }}
              className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1.5 focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Guest Name', 'First Visit', 'Last Visit', 'Txn Count', 'Total Spend'].map((h) => (
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
              {data.map((row) => (
                <tr
                  key={row.guest_name}
                  onClick={() => onSelectGuest(row.guest_name)}
                  className={[
                    'cursor-pointer transition-colors',
                    selectedGuest === row.guest_name
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{row.guest_name}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(row.first_txn_date)}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(row.last_txn_date)}</td>
                  <td className="px-4 py-3 tabular-nums text-gray-700">{row.txn_count.toLocaleString()}</td>
                  <td className="px-4 py-3 tabular-nums text-gray-900 font-medium whitespace-nowrap">
                    {fmtCurrency(Number(row.total_spend))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
