import { useState } from 'react'
import { useTransactions, useDeleteTransaction } from '../hooks/useTransactions'
import TransactionForm from './TransactionForm'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-')
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export default function TransactionList() {
  const { data: transactions, isLoading, isError } = useTransactions()
  const deleteTransaction = useDeleteTransaction()
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [showForm, setShowForm] = useState(false)

  if (isLoading) return <p className="text-gray-400 text-sm">Loading transactions...</p>
  if (isError) return <p className="text-red-500 text-sm">Failed to load transactions.</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
        <button onClick={() => { setEditingTransaction(null); setShowForm(true) }}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">
          + Add
        </button>
      </div>

      {transactions?.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-8">No transactions yet. Add one to get started.</p>
      )}

      <div className="space-y-2">
        {transactions?.map(tx => (
          <div key={tx.id} className="bg-white border border-gray-100 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-green-400' : 'bg-red-400'}`} />
              <div>
                <p className="text-sm font-medium text-gray-800">{tx.description || tx.category}</p>
                <p className="text-xs text-gray-400">{tx.category} · {formatDate(tx.transaction_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
              <button onClick={() => { setEditingTransaction(tx); setShowForm(true) }}
                className="text-xs text-blue-500 hover:underline">Edit</button>
              <button onClick={() => deleteTransaction.mutate(tx.id)}
                className="text-xs text-red-400 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <TransactionForm
          editingTransaction={editingTransaction}
          onClose={() => { setShowForm(false); setEditingTransaction(null) }}
        />
      )}
    </div>
  )
}