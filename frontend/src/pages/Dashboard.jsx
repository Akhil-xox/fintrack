import { supabase } from '../lib/supabase'

export default function Dashboard({ session }) {
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">FinTrack</h1>
        <button onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-800">
          Sign out
        </button>
      </div>
      <p className="text-gray-600">Logged in as <strong>{session.user.email}</strong></p>
      <p className="text-gray-400 mt-2">Dashboard coming tomorrow.</p>
    </div>
  )
}