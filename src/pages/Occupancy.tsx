import { useDailyStays } from '@/hooks/useDailyStays'
import { KpiCard } from '@/components/KpiCard'

function fmtCurrency(n: number | null | undefined): string {
  if (n == null) return '—'
  return `Rp ${n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function Occupancy() {
  const { data, loading, error } = useDailyStays()

  const latest = data.length > 0 ? data[0] : null

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
        Failed to load data: {error}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Occupancy</h1>
        <p className="text-sm text-gray-500">
          {latest
            ? `Latest: ${fmtDate(latest.arrival_date)}`
            : loading ? 'Loading…' : 'No data'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Arrivals"
              value={latest ? (latest.num_arrivals?.toLocaleString() ?? '—') : '—'}
              sub="Most recent day"
            />
            <KpiCard
              label="Total Guests"
              value={latest ? (latest.total_guests?.toLocaleString() ?? '—') : '—'}
              sub="Most recent day"
            />
            <KpiCard
              label="Room Revenue"
              value={latest ? fmtCurrency(latest.room_revenue) : '—'}
              sub="Most recent day"
            />
            <KpiCard
              label="POS / Guest"
              value={latest ? fmtCurrency(latest.pos_rev_per_guest) : '—'}
              sub="Most recent day"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Daily Breakdown</h2>
              <p className="text-xs text-gray-400 mt-0.5">{data.length} rows</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    {['Date', 'Arrivals', 'Guests', 'Room Rev', 'Folio POS', 'Outlet POS', 'POS/Guest'].map((h) => (
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
                    <tr key={row.arrival_date} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{fmtDate(row.arrival_date)}</td>
                      <td className="px-4 py-3 tabular-nums text-gray-700">{row.num_arrivals?.toLocaleString() ?? '—'}</td>
                      <td className="px-4 py-3 tabular-nums text-gray-700">{row.total_guests?.toLocaleString() ?? '—'}</td>
                      <td className="px-4 py-3 tabular-nums text-gray-900 font-medium whitespace-nowrap">{fmtCurrency(row.room_revenue)}</td>
                      <td className="px-4 py-3 tabular-nums text-gray-700 whitespace-nowrap">{fmtCurrency(row.folio_pos_revenue)}</td>
                      <td className="px-4 py-3 tabular-nums text-gray-700 whitespace-nowrap">{fmtCurrency(row.pos_outlet_revenue)}</td>
                      <td className="px-4 py-3 tabular-nums text-gray-700 whitespace-nowrap">{fmtCurrency(row.pos_rev_per_guest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
