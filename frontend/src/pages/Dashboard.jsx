import Navbar from '../components/Navbar'
import TransactionList from '../components/TransactionList'
import BudgetForm from '../components/BudgetForm'

export default function Dashboard({ session }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar email={session.user.email} />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TransactionList />
          </div>
          <div>
            <BudgetForm />
          </div>
        </div>
      </div>
    </div>
  )
}