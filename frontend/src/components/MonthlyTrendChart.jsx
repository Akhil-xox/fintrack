import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMonthlyTrend } from '../hooks/useAnalytics'
import { formatCurrency } from '../lib/utils'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 space-y-1">
        <p className="text-gray-400 text-xs font-medium">{label}</p>
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-xs text-gray-400">{p.dataKey}:</span>
            <span className="text-xs font-mono font-semibold text-gray-100">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function MonthlyTrendChart() {
  const { data, isLoading } = useMonthlyTrend()

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-800 rounded-xl" />

  if (!data?.length) return (
    <div className="h-64 flex flex-col items-center justify-center text-gray-600">
      <p className="text-3xl mb-2">📈</p>
      <p className="text-sm">Add transactions to see your trend</p>
    </div>
  )

  const chartData = data.map(d => ({
    name: MONTHS[d.month - 1],
    Income: d.income,
    Expenses: d.expenses,
  }))

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Income vs Expenses</h3>
      <div className="flex gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-gray-400">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-400" />
          <span className="text-xs text-gray-400">Expenses</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1F2937' }} />
          <Bar dataKey="Income" fill="#34D399" radius={[4,4,0,0]} maxBarSize={32} />
          <Bar dataKey="Expenses" fill="#FB7185" radius={[4,4,0,0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}