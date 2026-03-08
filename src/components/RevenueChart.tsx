import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { DailyRevenue } from '@/types'

interface RevenueChartProps {
  data: DailyRevenue[]
}

function shortDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((r) => ({
    date: shortDate(r.sale_date),
    revenue: r.total_revenue,
  }))

  return (
    <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm p-5">
      <p className="text-xs font-medium text-brand-stone uppercase tracking-wide mb-4">
        Revenue — Last 30 Days
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e2db" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#D1C7BB' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v: number) => `Rp ${(v / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`}
            tick={{ fontSize: 10, fill: '#D1C7BB' }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            formatter={(value: number | undefined) => [
              value != null ? `Rp ${value.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '—',
              'Revenue',
            ]}
            labelStyle={{ color: '#212121', fontWeight: 600, fontSize: 12 }}
            contentStyle={{
              border: '1px solid #D1C7BB',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#revGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: '#3B82F6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
