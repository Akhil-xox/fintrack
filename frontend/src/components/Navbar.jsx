import { useState } from 'react'
import { Search, Upload, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import CSVImportModal from './CSVImportModal'

export default function Navbar({ email }) {
  const [showImport, setShowImport] = useState(false)
  const initials = email?.[0]?.toUpperCase() ?? '?'

  return (
    <>
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-72">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            disabled
            className="bg-transparent text-sm text-gray-500 placeholder-gray-400 outline-none w-full cursor-not-allowed"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-xl transition-colors">
            <Upload size={15} />
            Import CSV
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>
            <span className="hidden md:block text-sm text-gray-600">{email}</span>
            <button onClick={() => supabase.auth.signOut()}
              className="text-gray-400 hover:text-gray-700 transition-colors ml-1" title="Sign out">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>
      {showImport && <CSVImportModal onClose={() => setShowImport(false)} />}
    </>
  )
}