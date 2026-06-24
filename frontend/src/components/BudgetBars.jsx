import { useBudgets } from '../hooks/useBudgets'
import { useSpendByCategory } from '../hooks/useAnalytics'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export default function BudgetBars({ month, year }) {
  const { data: budgets, isLoading: budgetsLoading } = useBudgets(month, year)
  const { data: spending, isLoading: spendingLoading } = useSpendByCategory(month, year)

  if (budgetsLoading || spendingLoading) return <div className="animate-pulse h-32 bg-gray-50 rounded-lg" />
  if (!budgets?.length) return (
    <p className="text-gray-400 text-sm text-center py-4">Set budgets to track utilisation</p>
  )

  const spendMap = Object.fromEntries((spending ?? []).map(s => [s.category, s.total]))

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Budget Utilisation</h3>
      <div className="space-y-4">
        {budgets.map(b => {
          const spent = spendMap[b.category] ?? 0
          const pct = Math.min((spent / b.amount) * 100, 100)
          const over = spent > b.amount
          return (
            <div key={b.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{b.category}</span>
                <span className={over ? 'text-red-500 font-semibold' : 'text-gray-500'}>
                  {formatCurrency(spent)} / {formatCurrency(b.amount)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    over ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-blue-500'
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