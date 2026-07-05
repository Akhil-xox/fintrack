import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions'

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Salary', 'Other']
const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"

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
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
            <button type="button" onClick={() => setForm(p => ({ ...p, type: 'expense' }))}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                form.type === 'expense' ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' : 'text-gray-400 hover:text-gray-600'
              }`}>
              Expense
            </button>
            <button type="button" onClick={() => setForm(p => ({ ...p, type: 'income' }))}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                form.type === 'income' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'text-gray-400 hover:text-gray-600'
              }`}>
              Income
            </button>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Amount</label>
            <input type="number" placeholder="0" value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              step="0.01" min="0.01" required className={`${inputClass} font-mono`} />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Category</label>
            <select value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className={inputClass}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Date</label>
            <input type="date" value={form.transaction_date}
              onChange={e => setForm(p => ({ ...p, transaction_date: e.target.value }))}
              required className={inputClass} />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <input type="text" placeholder="e.g. Lunch at restaurant"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className={inputClass} />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
              {isLoading ? 'Saving...' : editingTransaction ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}