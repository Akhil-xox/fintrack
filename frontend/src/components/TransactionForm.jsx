import { useState, useEffect } from 'react'
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions'

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Salary', 'Other']
const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors"

export default function TransactionForm({ editingTransaction, onClose }) {
  const [form, setForm] = useState({
    amount: '', type: 'expense', category: 'Food',
    transaction_date: new Date().toISOString().split('T')[0], description: ''
  })

  const createTransaction = useCreateTransaction()
  const updateTransaction = useUpdateTransaction()

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
        transaction_date: editingTransaction.date,
        description: editingTransaction.description || ''
      })
    }
  }, [editingTransaction])

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...form, amount: parseFloat(form.amount) }
    if (editingTransaction) {
      await updateTransaction.mutateAsync({ id: editingTransaction.id, data: payload })
    } else {
      await createTransaction.mutateAsync(payload)
    }
    onClose()
  }

  const isLoading = createTransaction.isPending || updateTransaction.isPending

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-base font-semibold text-gray-100 mb-5">
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-800 rounded-xl">
            <button type="button" onClick={() => setForm(p => ({ ...p, type: 'expense' }))}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                form.type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              Expense
            </button>
            <button type="button" onClick={() => setForm(p => ({ ...p, type: 'income' }))}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                form.type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              Income
            </button>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1.5">Amount</label>
            <input type="number" name="amount" placeholder="0" value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              step="0.01" min="0.01" required className={`${inputClass} font-mono`} />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1.5">Category</label>
            <select name="category" value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className={inputClass}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1.5">Date</label>
            <input type="date" name="transaction_date" value={form.transaction_date}
              onChange={e => setForm(p => ({ ...p, transaction_date: e.target.value }))}
              required className={inputClass} />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1.5">
              Description <span className="text-gray-600">(optional)</span>
            </label>
            <input type="text" placeholder="e.g. Lunch at restaurant"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className={inputClass} />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-900 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
              {isLoading ? 'Saving...' : editingTransaction ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}