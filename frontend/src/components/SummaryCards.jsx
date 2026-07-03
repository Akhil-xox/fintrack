import { useSummary } from '../hooks/useAnalytics'
import { formatCurrency } from '../lib/utils'

function Card({ label, value, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">{label}</p>
      <p className={`text-2xl font-bold font-mono tabular-nums ${color}`}>{value}</p>
    </div>
  )
}

export default function SummaryCards({ month, year }) {
  const { data, isLoading } = useSummary(month, year)

  if (isLoading) return (
    <div className="grid grid-cols-3 gap-4">
      {[1,2,3].map(i => <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 animate-pulse h-24" />)}
    </div>
  )

  const net = data?.net ?? 0

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card label="Income" value={formatCurrency(data?.total_income ?? 0)} color="text-emerald-400" />
      <Card label="Expenses" value={formatCurrency(data?.total_expenses ?? 0)} color="text-rose-400" />
      <Card label="Net" value={formatCurrency(net)} color={net >= 0 ? 'text-amber-400' : 'text-rose-400'} />
    </div>
  )
}