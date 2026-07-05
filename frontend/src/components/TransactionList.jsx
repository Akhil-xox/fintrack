import { useState } from 'react'
import { Plus, Pencil, Trash2, Wallet } from 'lucide-react'
import { useTransactions, useDeleteTransaction } from '../hooks/useTransactions'
import TransactionForm from './TransactionForm'
import { formatCurrency, formatDate } from '../lib/utils'

const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚗', Housing: '🏠', Utilities: '⚡',
  Entertainment: '🎬', Health: '💊', Shopping: '🛍️', Salary: '💰', Other: '📝'
}

export default function TransactionList() {
  const { data: transactions, isLoading, isError } = useTransactions()
  const deleteTransaction = useDeleteTransaction()
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [showForm, setShowForm] = useState(false)

  if (isLoading) return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
      {[1,2,3,4].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  )

  if (isError) return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <p className="text-rose-500 text-sm">Failed to load transactions.</p>
    </div>
  )

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-900">Transactions</h2>
        <button onClick={() => { setEditingTransaction(null); setShowForm(true) }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-xl text-sm transition-colors">
          <Plus size={15} /> Add
        </button>
      </div>

      {!transactions?.length && (
        <div className="text-center py-12">
          <Wallet size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">No transactions yet. Add one to get started.</p>
        </div>
      )}

      <div className="space-y-1">
        {transactions?.map(tx => (
          <div key={tx.id}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 flex-shrink-0">
                {CATEGORY_ICONS[tx.category] ?? '📝'}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-tight truncate">
                  {tx.description || tx.category}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{tx.category} · {formatDate(tx.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-sm font-semibold font-mono tabular-nums ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
              <div className="hidden group-hover:flex items-center gap-1.5">
                <button onClick={() => { setEditingTransaction(tx); setShowForm(true) }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteTransaction.mutate(tx.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
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