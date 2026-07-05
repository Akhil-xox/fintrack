import { LayoutDashboard, Receipt, Target } from 'lucide-react'

export default function Sidebar() {
  const navItems = [
    { href: '#overview', label: 'Overview', icon: LayoutDashboard },
    { href: '#transactions', label: 'Transactions', icon: Receipt },
    { href: '#budget', label: 'Budget', icon: Target },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 h-screen sticky top-0 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight">FinTrack</span>
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2">Menu</p>
      <nav className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <a key={href} href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Icon size={18} strokeWidth={2} />
            {label}
          </a>
        ))}
      </nav>
    </aside>
  )
}