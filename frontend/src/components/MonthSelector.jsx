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
    <div className="flex items-center gap-3">
      <button onClick={prev} className="text-gray-400 hover:text-gray-600 text-lg">‹</button>
      <span className="text-sm font-medium text-gray-700 w-24 text-center">
        {MONTHS[month - 1]} {year}
      </span>
      <button onClick={next} className="text-gray-400 hover:text-gray-600 text-lg">›</button>
    </div>
  )
}