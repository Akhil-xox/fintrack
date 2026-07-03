import { useState } from 'react'
import { useBudgets, useUpsertBudget } from '../hooks/useBudgets'
import { formatCurrency } from '../lib/utils'

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other']

export default function BudgetForm() {
  const now = new Date()
  const [month] = useState(now.getMonth() + 1)
  const [year] = useState(now.getFullYear())
  const [category, setCategory] = useState('Food')
  const [amount, setAmount] = useState('')

  const { data: budgets } = useBudgets(month, year)
  const upsertBudget = useUpsertBudget()

  async function handleSubmit(e) {
    e.preventDefault()
    await upsertBudget.mutateAsync({ category, amount: parseFloat(amount), month, year })
    setAmount('')
  }

  const inputClass = "bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Set Budget</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <select value={category} onChange={e => setCategory(e.target.value)} className={`w-full ${inputClass}`}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="number" placeholder="Amount" value={amount}
            onChange={e => setAmount(e.target.value)} min="1" required
            className={`flex-1 ${inputClass} font-mono`} />
          <button type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Set
          </button>
        </div>
      </form>

      {budgets?.length > 0 && (
        <div className="mt-4 space-y-1 border-t border-gray-800 pt-4">
          {budgets.map(b => (
            <div key={b.id} className="flex justify-between py-1">
              <span className="text-sm text-gray-400">{b.category}</span>
              <span className="text-sm font-mono tabular-nums text-gray-300">{formatCurrency(b.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}