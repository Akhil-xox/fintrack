import { useSummary } from '../hooks/useAnalytics'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function Card({ label, value, color }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 px-5 py-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

export default function SummaryCards({ month, year }) {
  const { data, isLoading } = useSummary(month, year)

  if (isLoading) return (
    <div className="grid grid-cols-3 gap-4">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-lg border border-gray-100 px-5 py-4 animate-pulse h-20" />
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card label="Income" value={formatCurrency(data?.total_income ?? 0)} color="text-green-600" />
      <Card label="Expenses" value={formatCurrency(data?.total_expenses ?? 0)} color="text-red-500" />
      <Card label="Net" value={formatCurrency(data?.net ?? 0)} color={data?.net >= 0 ? "text-blue-600" : "text-red-500"} />
    </div>
  )
}