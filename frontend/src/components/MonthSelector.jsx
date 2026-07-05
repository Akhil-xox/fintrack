import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function MonthSelector({ month, year, onChange }) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  function prev() {
    if (month === 1) onChange(12, year - 1)
    else onChange(month - 1, year)
  }

  function next() {
    const now = new Date()
    if (year === now.getFullYear() && month === now.getMonth() + 1) return
    if (month === 12) onChange(1, year + 1)
    else onChange(month + 1, year)
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={prev}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm font-semibold text-gray-700 w-24 text-center">
        {MONTHS[month - 1]} {year}
      </span>
      <button onClick={next}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}