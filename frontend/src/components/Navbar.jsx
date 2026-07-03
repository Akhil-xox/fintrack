import { useState } from 'react'
import { supabase } from '../lib/supabase'
import CSVImportModal from './CSVImportModal'

export default function Navbar({ email }) {
  const [showImport, setShowImport] = useState(false)

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3.5 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-lg font-bold text-amber-400 tracking-tight">FinTrack</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowImport(true)}
            className="text-sm bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-3.5 py-1.5 rounded-lg transition-colors">
            Import CSV
          </button>
          <span className="text-gray-600 text-sm hidden sm:block">{email}</span>
          <button onClick={() => supabase.auth.signOut()}
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Sign out
          </button>
        </div>
      </nav>
      {showImport && <CSVImportModal onClose={() => setShowImport(false)} />}
    </>
  )
}