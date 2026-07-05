import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { Briefcase, ShoppingCart, Scale } from 'lucide-react'
import { useSummary, useMonthlyTrend } from '../hooks/useAnalytics'
import { formatCurrency } from '../lib/utils'

function Sparkline({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2}
          fill={`url(#spark-${color})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function Card({ icon: Icon, label, value, color, sparkData }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}1A` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold font-mono tabular-nums text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      {sparkData?.length > 1 && (
        <div className="mt-2 -mx-1">
          <Sparkline data={sparkData} color={color} />
        </div>
      )}
    </div>
  )
}

export default function SummaryCards({ month, year }) {
  const { data, isLoading } = useSummary(month, year)
  const { data: trend } = useMonthlyTrend()

  if (isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1,2,3].map(i => <div key={i} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 animate-pulse h-28" />)}
    </div>
  )

  const net = data?.net ?? 0
  const incomeSeries = trend?.map(t => ({ value: t.income })) ?? []
  const expenseSeries = trend?.map(t => ({ value: t.expenses })) ?? []
  const netSeries = trend?.map(t => ({ value: t.income - t.expenses })) ?? []

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card icon={Briefcase} label="Income" value={formatCurrency(data?.total_income ?? 0)} color="#10B981" sparkData={incomeSeries} />
      <Card icon={ShoppingCart} label="Expenses" value={formatCurrency(data?.total_expenses ?? 0)} color="#F43F5E" sparkData={expenseSeries} />
      <Card icon={Scale} label="Net" value={formatCurrency(net)} color={net >= 0 ? "#6366F1" : "#F43F5E"} sparkData={netSeries} />
    </div>
  )
}