import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { useMonthlyTrend } from '../hooks/useAnalytics'
import { formatCurrency } from '../lib/utils'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2 space-y-1">
        <p className="text-gray-500 text-xs font-medium">{label}</p>
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-xs text-gray-500">{p.dataKey}:</span>
            <span className="text-xs font-mono font-semibold text-gray-900">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function MonthlyTrendChart() {
  const { data, isLoading } = useMonthlyTrend()

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-100 rounded-xl" />

  if (!data?.length) return (
    <div className="h-64 flex flex-col items-center justify-center text-gray-300">
      <TrendingUp size={32} className="mb-2" />
      <p className="text-sm text-gray-400">Add transactions to see your trend</p>
    </div>
  )

  const chartData = data.map(d => ({
    name: MONTHS[d.month - 1],
    Income: d.income,
    Expenses: d.expenses,
  }))

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Income vs Expenses</h3>
      <div className="flex gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-500">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-xs text-gray-500">Expenses</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
          <Bar dataKey="Income" fill="#10B981" radius={[4,4,0,0]} maxBarSize={32} />
          <Bar dataKey="Expenses" fill="#F43F5E" radius={[4,4,0,0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}