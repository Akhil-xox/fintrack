import { useState } from 'react'
import { supabase } from '../lib/supabase'
import CSVImportModal from './CSVImportModal'

export default function Navbar({ email }) {
  const [showImport, setShowImport] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">FinTrack</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImport(true)}
            className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded font-medium"
          >
            Import CSV
          </button>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm text-gray-500">{email}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-700"
          >
            Sign out
          </button>
        </div>
      </nav>

      {showImport && <CSVImportModal onClose={() => setShowImport(false)} />}
    </>
  )
}