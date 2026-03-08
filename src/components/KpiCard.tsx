interface KpiCardProps {
  label: string
  value: string
  sub?: string
}

export function KpiCard({ label, value, sub }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-sm text-gray-400">{sub}</p>}
    </div>
  )
}
