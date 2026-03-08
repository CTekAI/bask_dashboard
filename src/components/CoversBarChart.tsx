import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { DailyRevenue } from '@/types'

interface CoversBarChartProps {
  data: DailyRevenue[]
}

function shortDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function CoversBarChart({ data }: CoversBarChartProps) {
  const chartData = data.map((r) => ({
    date: shortDate(r.sale_date),
    covers: r.tickets,
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
        Covers — Last 30 Days
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip
            formatter={(value: number | undefined) => [value ?? '—', 'Covers']}
            labelStyle={{ color: '#111827', fontWeight: 600, fontSize: 12 }}
            contentStyle={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            cursor={{ fill: '#f3f4f6' }}
          />
          <Bar dataKey="covers" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
