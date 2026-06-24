import { useState } from 'react'
import { useBudgets, useUpsertBudget } from '../hooks/useBudgets'

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

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Budgets — {now.toLocaleString('default', { month: 'long' })} {year}
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Amount" value={amount}
          onChange={e => setAmount(e.target.value)} min="1" required
          className="border rounded px-3 py-2 text-sm w-32" />
        <button type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">
          Set
        </button>
      </form>

      <div className="space-y-2">
        {budgets?.map(b => (
          <div key={b.id} className="bg-white border border-gray-100 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{b.category}</span>
            <span className="text-sm text-gray-500">
              ₹{b.amount.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
        {budgets?.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No budgets set for this month.</p>
        )}
      </div>
    </div>
  )
}