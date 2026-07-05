import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useBudgets, useUpsertBudget, useDeleteBudget } from '../hooks/useBudgets'
import { formatCurrency } from '../lib/utils'

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other']

export default function BudgetForm({ month, year }) {
  const [category, setCategory] = useState('Food')
  const [amount, setAmount] = useState('')
  const [copyTarget, setCopyTarget] = useState('next')

  const { data: budgets } = useBudgets(month, year)
  const upsertBudget = useUpsertBudget()
  const deleteBudget = useDeleteBudget()

  const inputClass = "bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"

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
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Set Budget</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <select value={category} onChange={e => setCategory(e.target.value)} className={`w-full ${inputClass}`}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="number" placeholder="Amount" value={amount}
            onChange={e => setAmount(e.target.value)} min="1" required
            className={`flex-1 ${inputClass} font-mono`} />
          <button type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            {budgets?.some(b => b.category === category) ? 'Update' : 'Set'}
          </button>
        </div>
      </form>

      {budgets?.length > 0 && (
        <>
          <div className="mt-4 space-y-1 border-t border-gray-100 pt-4">
            {budgets.map(b => (
              <div key={b.id} className="flex justify-between items-center py-1 group">
                <span className="text-sm text-gray-500">{b.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono tabular-nums text-gray-700">{formatCurrency(b.amount)}</span>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button onClick={() => handleEdit(b)}
                      className="p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deleteBudget.mutate(b.id)}
                      className="p-1 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Copy these budgets to</p>
            <div className="flex gap-2">
              <select value={copyTarget} onChange={e => setCopyTarget(e.target.value)}
                className={`flex-1 ${inputClass}`}>
                <option value="prev">Previous month</option>
                <option value="next">Next month</option>
              </select>
              <button onClick={handleCopy}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                Copy
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}