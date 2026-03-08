import { useDailyRevenue } from '@/hooks/useDailyRevenue'
import { usePosRevenue } from '@/hooks/usePosRevenue'
import { useDailyStays, type DailyStay } from '@/hooks/useDailyStays'
import type { DailyRevenue } from '@/types'
import { RevenueChart } from '@/components/RevenueChart'
import { CoversBarChart } from '@/components/CoversBarChart'
import { GuestTypeSpendWidget } from '@/components/GuestTypeSpendWidget'
import { RevenueByCategoryWidget } from '@/components/RevenueByCategoryWidget'
import { useTodayRevenueByCategory } from '@/hooks/useDailyRevenueByCategory'
import { useTodayRevenueBreakdown } from '@/hooks/useTodayRevenue'

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

function daysAgoIso(days: number, from?: string): string {
  const base = from ? new Date(from + 'T00:00:00').getTime() : Date.now()
  return new Date(base - days * 86_400_000).toISOString().split('T')[0]
}

function sumPos(rows: DailyRevenue[], since: string | null): number {
  return rows
    .filter((r) => !since || r.sale_date >= since)
    .reduce((acc, r) => acc + r.total_revenue, 0)
}

function sumRoom(rows: DailyStay[], since: string | null): number {
  return rows
    .filter((r) => !since || r.arrival_date >= since)
    .reduce((acc, r) => acc + (r.room_revenue ?? 0), 0)
}

export function Overview() {
  const { data, loading, error } = useDailyRevenue('30d')
  const posRevenue = usePosRevenue('30d')
  const allPos = useDailyRevenue('all')
  const stays = useDailyStays()
  const todayByCategory = useTodayRevenueByCategory()
  const todayRevenue = useTodayRevenueBreakdown()

  const latest = data.length > 0 ? data[data.length - 1] : null

  const latestPosDate = allPos.data.length > 0
    ? allPos.data[allPos.data.length - 1].sale_date
    : undefined
  const d7  = daysAgoIso(7,  latestPosDate)
  const d30 = daysAgoIso(30, latestPosDate)
  const pos7 = sumPos(allPos.data, d7)
  const pos30 = sumPos(allPos.data, d30)
  const posAll = sumPos(allPos.data, null)
  const room7 = sumRoom(stays.data, d7)
  const room30 = sumRoom(stays.data, d30)
  const roomAll = sumRoom(stays.data, null)
  const summaryLoading = allPos.loading || stays.loading

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
        <h1 className="text-lg font-bold text-brand-charcoal">Overview</h1>
        <p className="text-sm text-brand-stone">
          {latest
            ? `Latest data: ${fmtDate(latest.sale_date)}`
            : loading ? 'Loading…' : 'No data'}
        </p>
      </div>

      {/* Revenue summary cards */}
      {summaryLoading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-4 border-brand-stone/40 border-t-brand-charcoal rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([
            { label: 'Last 7 Days', room: room7, pos: pos7 },
            { label: 'Last 30 Days', room: room30, pos: pos30 },
            { label: 'All Time', room: roomAll, pos: posAll },
          ] as const).map(({ label, room, pos }) => (
            <div key={label} className="bg-white rounded-xl border border-brand-stone/40 shadow-sm p-5">
              <p className="text-xs font-medium text-brand-stone uppercase tracking-wide">{label}</p>
              <p className="mt-2 text-2xl font-bold text-brand-charcoal tracking-tight">{fmtCurrency(room + pos)}</p>
              <div className="mt-2 space-y-0.5">
                <p className="text-xs text-brand-stone">Room: <span className="tabular-nums text-brand-charcoal/70">{fmtCurrency(room)}</span></p>
                <p className="text-xs text-brand-stone">POS: <span className="tabular-nums text-brand-charcoal/70">{fmtCurrency(pos)}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-4 border-brand-stone/40 border-t-brand-charcoal rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Today's revenue — Room / POS / Combined */}
          <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm p-5">
            <p className="text-xs font-medium text-brand-stone uppercase tracking-wide mb-3">
              Today's revenue
            </p>
            {todayRevenue.loading ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-4 border-brand-stone/40 border-t-brand-charcoal rounded-full animate-spin" />
              </div>
            ) : todayRevenue.error ? (
              <p className="text-sm text-red-600">{todayRevenue.error}</p>
            ) : !todayRevenue.data ? (
              <p className="text-sm text-brand-stone">No revenue data yet for today</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-6">
                  {([
                    { label: 'Room',     value: todayRevenue.data.roomRevenue },
                    { label: 'POS',      value: todayRevenue.data.posRevenue  },
                    { label: 'Combined', value: todayRevenue.data.totalRevenue },
                  ] as const).map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-brand-stone">{label}</p>
                      <p className="mt-0.5 text-base font-semibold text-brand-charcoal tabular-nums">
                        {fmtCurrency(value)}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-brand-stone">
                  Based on data for {fmtDate(todayRevenue.data.date)}
                </p>
              </>
            )}
          </div>

          {/* Today's category breakdown */}
          <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm p-5">
            <p className="text-xs font-medium text-brand-stone uppercase tracking-wide mb-3">
              Today's revenue by category
            </p>
            {todayByCategory.error ? (
              <p className="text-sm text-red-600">{todayByCategory.error}</p>
            ) : todayByCategory.loading ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-4 border-brand-stone/40 border-t-brand-charcoal rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2">
                {todayByCategory.data.map(({ category, category_revenue }) => (
                  <div key={category} className="flex items-baseline justify-between gap-2">
                    <span className="text-sm text-brand-stone truncate">{category}</span>
                    <span className="text-sm tabular-nums font-medium text-brand-charcoal whitespace-nowrap">
                      {fmtCurrency(category_revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Revenue Summary */}
          <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-stone/20">
              <h2 className="text-sm font-semibold text-brand-charcoal">Revenue Summary</h2>
              <p className="text-xs text-brand-stone mt-0.5">Room vs POS across periods</p>
            </div>
            {summaryLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-4 border-brand-stone/40 border-t-brand-charcoal rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-blanco">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-brand-stone uppercase tracking-wide"></th>
                      {['Last 7 days', 'Last 30 days', 'All time'].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-right text-xs font-medium text-brand-stone uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-stone/20">
                    <tr className="hover:bg-brand-blanco">
                      <td className="px-4 py-3 text-brand-charcoal/70 font-medium">Room Revenue</td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal text-right whitespace-nowrap">{fmtCurrency(room7)}</td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal text-right whitespace-nowrap">{fmtCurrency(room30)}</td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal text-right whitespace-nowrap">{fmtCurrency(roomAll)}</td>
                    </tr>
                    <tr className="hover:bg-brand-blanco">
                      <td className="px-4 py-3 text-brand-charcoal/70 font-medium">POS Revenue</td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal text-right whitespace-nowrap">{fmtCurrency(pos7)}</td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal text-right whitespace-nowrap">{fmtCurrency(pos30)}</td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal text-right whitespace-nowrap">{fmtCurrency(posAll)}</td>
                    </tr>
                    <tr className="bg-brand-mist/20 font-semibold">
                      <td className="px-4 py-3 text-brand-palm">Combined</td>
                      <td className="px-4 py-3 tabular-nums text-brand-palm text-right whitespace-nowrap">{fmtCurrency(room7 + pos7)}</td>
                      <td className="px-4 py-3 tabular-nums text-brand-palm text-right whitespace-nowrap">{fmtCurrency(room30 + pos30)}</td>
                      <td className="px-4 py-3 tabular-nums text-brand-palm text-right whitespace-nowrap">{fmtCurrency(roomAll + posAll)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <RevenueChart data={data} />
            <CoversBarChart data={data} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Daily breakdown table */}
          <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-stone/20">
              <h2 className="text-sm font-semibold text-brand-charcoal">Daily Breakdown</h2>
              <p className="text-xs text-brand-stone mt-0.5">{data.length} rows</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-blanco">
                    {['Date', 'Revenue', 'Tickets', 'Items'].map((h) => (
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
                  {data.slice().reverse().map((row) => (
                    <tr key={row.sale_date} className="hover:bg-brand-blanco transition-colors">
                      <td className="px-4 py-3 text-brand-charcoal/80 whitespace-nowrap">{fmtDate(row.sale_date)}</td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal font-medium whitespace-nowrap">
                        {fmtCurrency(row.total_revenue)}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal/80">{row.tickets.toLocaleString()}</td>
                      <td className="px-4 py-3 tabular-nums text-brand-charcoal/80">{Number(row.total_items).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue by Outlet */}
          <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-stone/20">
              <h2 className="text-sm font-semibold text-brand-charcoal">Revenue by Outlet</h2>
              <p className="text-xs text-brand-stone mt-0.5">{posRevenue.data.length} outlets</p>
            </div>
            {posRevenue.loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-4 border-brand-stone/40 border-t-brand-charcoal rounded-full animate-spin" />
              </div>
            ) : posRevenue.error ? (
              <p className="px-5 py-4 text-sm text-red-600">{posRevenue.error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-blanco">
                      {['Outlet', 'Revenue'].map((h) => (
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
                    {posRevenue.data.map((row) => (
                      <tr key={row.pos} className="hover:bg-brand-blanco transition-colors">
                        <td className="px-4 py-3 font-medium text-brand-charcoal">{row.pos}</td>
                        <td className="px-4 py-3 tabular-nums text-brand-charcoal whitespace-nowrap">
                          {fmtCurrency(row.total_revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          </div>{/* end tables grid */}

          <GuestTypeSpendWidget />
          <RevenueByCategoryWidget />
        </>
      )}
    </div>
  )
}
