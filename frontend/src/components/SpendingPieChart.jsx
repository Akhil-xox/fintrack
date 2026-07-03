import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useSpendByCategory } from '../hooks/useAnalytics'
import { formatCurrency } from '../lib/utils'

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#EF4444']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
        <p className="text-gray-400 text-xs mb-0.5">{payload[0].name}</p>
        <p className="text-gray-100 text-sm font-mono font-semibold">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function SpendingPieChart({ month, year }) {
  const { data, isLoading } = useSpendByCategory(month, year)

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-800 rounded-xl" />

  if (!data?.length) return (
    <div className="h-64 flex flex-col items-center justify-center text-gray-600">
      <p className="text-3xl mb-2">📊</p>
      <p className="text-sm">No expenses this month</p>
    </div>
  )

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="category"
            cx="50%" cy="50%" outerRadius={85} innerRadius={45}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
        {data.map((d, i) => (
          <div key={d.category} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-xs text-gray-400">{d.category}</span>
          </div>
        ))}
      </div>
    </div>
  )
}