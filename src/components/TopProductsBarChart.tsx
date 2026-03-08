import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { Product } from '@/types'

interface TopProductsBarChartProps {
  products: Product[]
}

export function TopProductsBarChart({ products }: TopProductsBarChartProps) {
  const chartData = products.map((p) => ({
    name: p.product.length > 14 ? p.product.slice(0, 14) + '…' : p.product,
    revenue: p.total_revenue,
  }))

  return (
    <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm p-5">
      <p className="text-xs font-medium text-brand-stone uppercase tracking-wide mb-4">
        Top 10 by Revenue
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 0, right: 16, left: 4, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e2db" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v: number) => `Rp ${(v / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`}
            tick={{ fontSize: 10, fill: '#D1C7BB' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 11, fill: '#212121' }}
            tickLine={false}
            axisLine={false}
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
            cursor={{ fill: '#FAF7F5' }}
          />
          <Bar dataKey="revenue" fill="#10B981" radius={[0, 4, 4, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
