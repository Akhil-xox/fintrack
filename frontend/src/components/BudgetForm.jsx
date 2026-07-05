import { useState } from 'react'
import { useBudgets, useUpsertBudget, useDeleteBudget } from '../hooks/useBudgets'
import { formatCurrency } from '../lib/utils'

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other']

export default function BudgetForm({ month, year }) {
  const [category, setCategory] = useState('Food')
  const [amount, setAmount] = useState('')
  const [copyTarget, setCopyTarget] = useState('next') // 'next' | 'prev'

  const { data: budgets } = useBudgets(month, year)
  const upsertBudget = useUpsertBudget()
  const deleteBudget = useDeleteBudget()

  const inputClass = "bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"

  async function handleSubmit(e) {
    e.preventDefault()
    await upsertBudget.mutateAsync({ category, amount: parseFloat(amount), month, year })
    setAmount('')
  }

  function handleEdit(b) {
    setCategory(b.category)
    setAmount(String(b.amount))
  }

  function getTargetMonthYear() {
    if (copyTarget === 'next') {
      return month === 12 ? { m: 1, y: year + 1 } : { m: month + 1, y: year }
    }
    return month === 1 ? { m: 12, y: year - 1 } : { m: month - 1, y: year }
  }

  async function handleCopy() {
    if (!budgets?.length) return
    const { m, y } = getTargetMonthYear()
    await Promise.all(
      budgets.map(b => upsertBudget.mutateAsync({ category: b.category, amount: b.amount, month: m, year: y }))
    )
  }

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
            {budgets?.some(b => b.category === category) ? 'Update' : 'Set'}
          </button>
        </div>
      </form>

      {budgets?.length > 0 && (
        <>
          <div className="mt-4 space-y-1 border-t border-gray-800 pt-4">
            {budgets.map(b => (
              <div key={b.id} className="flex justify-between items-center py-1 group">
                <span className="text-sm text-gray-400">{b.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono tabular-nums text-gray-300">{formatCurrency(b.amount)}</span>
                  <div className="hidden group-hover:flex items-center gap-2">
                    <button onClick={() => handleEdit(b)}
                      className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Edit</button>
                    <button onClick={() => deleteBudget.mutate(b.id)}
                      className="text-xs text-gray-500 hover:text-rose-400 transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Copy these budgets to</p>
            <div className="flex gap-2">
              <select value={copyTarget} onChange={e => setCopyTarget(e.target.value)}
                className={`flex-1 ${inputClass}`}>
                <option value="prev">Previous month</option>
                <option value="next">Next month</option>
              </select>
              <button onClick={handleCopy}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Copy
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}