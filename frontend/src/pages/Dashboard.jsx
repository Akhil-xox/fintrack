import { useState } from 'react'
import Sidebar from '../components/Sidebar'
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Navbar email={session.user.email} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">

          <section id="overview" className="space-y-5 scroll-mt-20">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
              <p className="text-sm text-gray-500 mt-0.5">A snapshot of your financial health</p>
            </div>

            <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y) }} />
            <SummaryCards month={month} year={year} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                <SpendingPieChart month={month} year={year} />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                <MonthlyTrendChart />
              </div>
            </div>
          </section>

          <section id="transactions" className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-20">
            <div className="lg:col-span-2">
              <TransactionList />
            </div>
            <div id="budget" className="space-y-4 scroll-mt-20">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                <BudgetBars month={month} year={year} />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                <BudgetForm month={month} year={year} />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}