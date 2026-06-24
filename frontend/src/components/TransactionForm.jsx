import { useState, useEffect } from 'react'
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions'

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Salary', 'Other']

export default function TransactionForm({ editingTransaction, onClose }) {
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: 'Food',
    transaction_date: new Date().toISOString().split('T')[0],
    description: ''
  })

  const createTransaction = useCreateTransaction()
  const updateTransaction = useUpdateTransaction()

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
        transaction_date: editingTransaction.transaction_date,
        description: editingTransaction.description || ''
      })
    }
  }, [editingTransaction])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <button type="button"
              onClick={() => setForm(p => ({ ...p, type: 'expense' }))}
              className={`flex-1 py-2 rounded text-sm font-medium border ${form.type === 'expense' ? 'bg-red-50 border-red-400 text-red-700' : 'border-gray-200 text-gray-500'}`}>
              Expense
            </button>
            <button type="button"
              onClick={() => setForm(p => ({ ...p, type: 'income' }))}
              className={`flex-1 py-2 rounded text-sm font-medium border ${form.type === 'income' ? 'bg-green-50 border-green-400 text-green-700' : 'border-gray-200 text-gray-500'}`}>
              Income
            </button>
          </div>

          <input type="number" name="amount" placeholder="Amount" value={form.amount}
            onChange={handleChange} step="0.01" min="0.01" required
            className="w-full border rounded px-3 py-2 text-sm" />

          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <input type="date" name="transaction_date" value={form.transaction_date}
            onChange={handleChange} required
            className="w-full border rounded px-3 py-2 text-sm" />

          <input type="text" name="description" placeholder="Description (optional)"
            value={form.description} onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm" />

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? 'Saving...' : editingTransaction ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}