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

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar email={session.user.email} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        <div className="space-y-4">
          <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y) }} />
          <SummaryCards month={month} year={year} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <SpendingPieChart month={month} year={year} />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <MonthlyTrendChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <TransactionList />
          </div>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <BudgetBars month={month} year={year} />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <BudgetForm />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}