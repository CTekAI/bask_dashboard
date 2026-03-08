import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { DailyRevenue } from '@/types'
import type { DailyStay } from '@/hooks/useDailyStays'

interface RevenueStreamsChartProps {
  posData: DailyRevenue[]
  staysData: DailyStay[]
}

function shortDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function fmtRp(v: number): string {
  return `Rp ${v.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function fmtRpShort(v: number): string {
  return `Rp ${(v / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`
}

export function RevenueStreamsChart({ posData, staysData }: RevenueStreamsChartProps) {
  const map = new Map<string, { pos: number; room: number }>()

  for (const r of posData) {
    const entry = map.get(r.sale_date) ?? { pos: 0, room: 0 }
    entry.pos = r.total_revenue
    map.set(r.sale_date, entry)
  }
  for (const r of staysData) {
    const entry = map.get(r.arrival_date) ?? { pos: 0, room: 0 }
    entry.room = r.room_revenue ?? 0
    map.set(r.arrival_date, entry)
  }

  const chartData = Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { pos, room }]) => ({
      date: shortDate(date),
      pos,
      room,
      combined: pos + room,
    }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
        Revenue Streams
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={fmtRpShort}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip
            formatter={(value: number | undefined) => fmtRp(value ?? 0)}
            labelStyle={{ color: '#111827', fontWeight: 600, fontSize: 12 }}
            contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
          />
          <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          <Line type="monotone" dataKey="room" name="Room" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="pos" name="POS" stroke="#2563eb" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="combined" name="Combined" stroke="#7c3aed" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
