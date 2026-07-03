import { useBudgets } from '../hooks/useBudgets'
import { useSpendByCategory } from '../hooks/useAnalytics'
import { formatCurrency } from '../lib/utils'

export default function BudgetBars({ month, year }) {
  const { data: budgets, isLoading: bl } = useBudgets(month, year)
  const { data: spending, isLoading: sl } = useSpendByCategory(month, year)

  if (bl || sl) return <div className="animate-pulse h-32 bg-gray-800 rounded-xl" />

  if (!budgets?.length) return (
    <div className="text-center py-6">
      <p className="text-gray-500 text-sm">Set budgets to track utilisation</p>
    </div>
  )

  const spendMap = Object.fromEntries((spending ?? []).map(s => [s.category, s.total]))

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Budget Utilisation</h3>
      <div className="space-y-4">
        {budgets.map(b => {
          const spent = spendMap[b.category] ?? 0
          const pct = Math.min((spent / b.amount) * 100, 100)
          const over = spent > b.amount
          return (
            <div key={b.id}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-300">{b.category}</span>
                <span className={`text-xs font-mono tabular-nums ${over ? 'text-rose-400' : 'text-gray-500'}`}>
                  {formatCurrency(spent)} / {formatCurrency(b.amount)}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    over ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}