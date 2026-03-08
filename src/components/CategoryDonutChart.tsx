import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { Product } from '@/types'

interface CategoryDonutChartProps {
  products: Product[]
}

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#0891b2', '#65a30d']

export function CategoryDonutChart({ products }: CategoryDonutChartProps) {
  // Group by category and sum total_revenue
  const grouped = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + p.total_revenue
    return acc
  }, {})

  const chartData = Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
        Revenue by Category
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | undefined) => [
              value != null
                ? `Rp ${value.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                : '—',
              'Revenue',
            ]}
            contentStyle={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {chartData.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5 min-w-0">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs text-gray-600 truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
