interface KpiCardProps {
  label: string
  value: string
  sub?: string
}

export function KpiCard({ label, value, sub }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-brand-stone/40 shadow-sm p-5">
      <p className="text-xs font-medium text-brand-stone uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-3xl font-bold text-brand-charcoal tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-sm text-brand-stone">{sub}</p>}
    </div>
  )
}
