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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
        Top 10 by Revenue
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 0, right: 16, left: 4, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v: number) => `Rp ${(v / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 11, fill: '#374151' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: number | undefined) => [
              value != null ? `Rp ${value.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '—',
              'Revenue',
            ]}
            labelStyle={{ color: '#111827', fontWeight: 600, fontSize: 12 }}
            contentStyle={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            cursor={{ fill: '#f3f4f6' }}
          />
          <Bar dataKey="revenue" fill="#2563eb" radius={[0, 4, 4, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
