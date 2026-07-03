import { useState } from 'react'
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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
      {[1,2,3,4].map(i => <div key={i} className="h-14 bg-gray-800 rounded-xl animate-pulse" />)}
    </div>
  )

  if (isError) return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <p className="text-rose-400 text-sm">Failed to load transactions.</p>
    </div>
  )

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-100">Transactions</h2>
        <button onClick={() => { setEditingTransaction(null); setShowForm(true) }}
          className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-3.5 py-1.5 rounded-lg text-sm transition-colors">
          + Add
        </button>
      </div>

      {!transactions?.length && (
        <div className="text-center py-12">
          <p className="text-3xl mb-2">💸</p>
          <p className="text-gray-500 text-sm">No transactions yet. Add one to get started.</p>
        </div>
      )}

      <div className="space-y-1">
        {transactions?.map(tx => (
          <div key={tx.id}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-800 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="text-lg w-7 text-center">{CATEGORY_ICONS[tx.category] ?? '📝'}</span>
              <div>
                <p className="text-sm font-medium text-gray-200 leading-tight">
                  {tx.description || tx.category}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{tx.category} · {formatDate(tx.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold font-mono tabular-nums ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
              <div className="hidden group-hover:flex items-center gap-2">
                <button onClick={() => { setEditingTransaction(tx); setShowForm(true) }}
                  className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Edit</button>
                <button onClick={() => deleteTransaction.mutate(tx.id)}
                  className="text-xs text-gray-500 hover:text-rose-400 transition-colors">Delete</button>
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