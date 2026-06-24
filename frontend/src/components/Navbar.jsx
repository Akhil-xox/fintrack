import { supabase } from '../lib/supabase'

export default function Navbar({ email }) {
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">FinTrack</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{email}</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-700"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}