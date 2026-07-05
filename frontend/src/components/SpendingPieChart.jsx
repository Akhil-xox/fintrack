import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { useSpendByCategory } from '../hooks/useAnalytics'
import { formatCurrency } from '../lib/utils'

const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#3B82F6', '#F97316']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2">
        <p className="text-gray-500 text-xs mb-0.5">{payload[0].name}</p>
        <p className="text-gray-900 text-sm font-mono font-semibold">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function SpendingPieChart({ month, year }) {
  const { data, isLoading } = useSpendByCategory(month, year)

  if (isLoading) return <div className="h-64 animate-pulse bg-gray-100 rounded-xl" />

  if (!data?.length) return (
    <div className="h-64 flex flex-col items-center justify-center text-gray-300">
      <PieIcon size={32} className="mb-2" />
      <p className="text-sm text-gray-400">No expenses this month</p>
    </div>
  )

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="category"
            cx="50%" cy="50%" outerRadius={85} innerRadius={45} paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="white" strokeWidth={2} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
        {data.map((d, i) => (
          <div key={d.category} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-xs text-gray-500">{d.category}</span>
          </div>
        ))}
      </div>
    </div>
  )
}