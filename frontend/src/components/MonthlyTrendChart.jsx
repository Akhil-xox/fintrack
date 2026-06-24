import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useMonthlyTrend } from '../hooks/useAnalytics'

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export default function MonthlyTrendChart() {
  const { data, isLoading } = useMonthlyTrend()

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-50 rounded-lg" />

  if (!data?.length) return (
    <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
      No data yet — add some transactions to see your trend
    </div>
  )

  const chartData = data.map(d => ({
    name: MONTH_NAMES[d.month - 1],
    Income: d.income,
    Expenses: d.expenses,
  }))

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="Income" fill="#10b981" radius={[4,4,0,0]} />
          <Bar dataKey="Expenses" fill="#ef4444" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}