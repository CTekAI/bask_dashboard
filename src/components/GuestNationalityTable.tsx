import type { NationalityRow } from '@/hooks/useGuestNationality'

function fmtCurrency(n: number): string {
  return `Rp ${n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function GuestNationalityTable({ rows, error }: { rows: NationalityRow[]; error?: string | null }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-900">Guest Nationality Mix</h2>
        <span className="ml-auto text-xs text-gray-400">Last 30 days · top 20</span>
      </div>
      {error ? (
        <p className="px-5 py-6 text-sm text-red-600">{error}</p>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['#', 'Nationality', 'Visits', 'Total Revenue', 'Avg Ticket'].map((h) => (
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
            {rows.map((r, i) => (
              <tr key={r.nationality} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 tabular-nums">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{r.nationality}</td>
                <td className="px-4 py-3 tabular-nums text-gray-700">{r.visits.toLocaleString()}</td>
                <td className="px-4 py-3 tabular-nums text-gray-900 font-medium whitespace-nowrap">
                  {fmtCurrency(r.total_revenue)}
                </td>
                <td className="px-4 py-3 tabular-nums text-gray-700 whitespace-nowrap">
                  {fmtCurrency(r.avg_ticket)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}
