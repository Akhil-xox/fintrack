import { useState } from 'react'
import Navbar from '../components/Navbar'
import TransactionList from '../components/TransactionList'
import BudgetForm from '../components/BudgetForm'
import SummaryCards from '../components/SummaryCards'
import SpendingPieChart from '../components/SpendingPieChart'
import MonthlyTrendChart from '../components/MonthlyTrendChart'
import BudgetBars from '../components/BudgetBars'
import MonthSelector from '../components/MonthSelector'

export default function Dashboard({ session }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  function handleMonthChange(m, y) {
    setMonth(m)
    setYear(y)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar email={session.user.email} />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Month selector + summary cards */}
        <div className="space-y-4">
          <MonthSelector month={month} year={year} onChange={handleMonthChange} />
          <SummaryCards month={month} year={year} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <SpendingPieChart month={month} year={year} />
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <MonthlyTrendChart />
          </div>
        </div>

        {/* Transactions + Budgets row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TransactionList />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-100 p-5">
              <BudgetBars month={month} year={year} />
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-5">
              <BudgetForm />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}