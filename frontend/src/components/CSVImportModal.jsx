import { useState, useRef } from 'react'
import { usePreviewImport, useConfirmImport } from '../hooks/useImport'
import { formatCurrency } from '../lib/utils'

export default function CSVImportModal({ onClose }) {
  const [stage, setStage] = useState('upload')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const previewImport = usePreviewImport()
  const confirmImport = useConfirmImport()

  function handleFile(f) {
    if (!f || !f.name.endsWith('.csv')) { alert('Please upload a CSV file'); return }
    setFile(f)
  }

  async function handlePreview() {
    const data = await previewImport.mutateAsync(file)
    setPreview(data)
    setStage('preview')
  }

  async function handleConfirm() {
    const data = await confirmImport.mutateAsync(file)
    setResult(data)
    setStage('result')
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-100">Import Bank Statement</h2>
            <p className="text-xs text-gray-500 mt-0.5">Supports HDFC and SBI CSV formats</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors text-xl">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {stage === 'upload' && (
            <div
              onClick={() => fileRef.current.click()}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-amber-500 bg-amber-500/5' : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
              }`}
            >
              <p className="text-4xl mb-3">📂</p>
              <p className="text-sm font-medium text-gray-300">
                {file ? file.name : 'Drop your CSV here or click to browse'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {file ? `${(file.size / 1024).toFixed(1)} KB — ready to preview` : 'HDFC and SBI formats supported'}
              </p>
              <input ref={fileRef} type="file" accept=".csv" className="hidden"
                onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          )}

          {stage === 'preview' && preview && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Found', value: preview.total, color: 'text-gray-100', bg: 'bg-gray-800' },
                  { label: 'New', value: preview.new, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Duplicates', value: preview.duplicates, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                    <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/60">
                      {['Date', 'Description', 'Category', 'Amount', 'Status'].map(h => (
                        <th key={h} className={`px-4 py-2.5 text-xs font-medium text-gray-500 ${h === 'Amount' ? 'text-right' : h === 'Status' ? 'text-center' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {preview.transactions.map((tx, i) => (
                      <tr key={i} className={tx.is_duplicate ? 'opacity-30' : ''}>
                        <td className="px-4 py-2.5 text-xs text-gray-400 font-mono">{tx.date}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-300 max-w-[160px] truncate">{tx.description}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-400">{tx.category}</td>
                        <td className={`px-4 py-2.5 text-xs text-right font-mono font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {tx.is_duplicate
                            ? <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">Skip</span>
                            : <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">New</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {stage === 'result' && result && (
            <div className="text-center py-12 space-y-3">
              <p className="text-5xl">✅</p>
              <p className="text-lg font-semibold text-gray-100">Import complete</p>
              <p className="text-sm text-gray-500">
                <span className="text-emerald-400 font-semibold">{result.inserted} transactions imported</span>
                {result.skipped > 0 && <span className="text-gray-600"> · {result.skipped} duplicates skipped</span>}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
          {stage === 'upload' && (
            <>
              <button onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button onClick={handlePreview} disabled={!file || previewImport.isPending}
                className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-400 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50">
                {previewImport.isPending ? 'Parsing...' : 'Preview Import'}
              </button>
            </>
          )}
          {stage === 'preview' && (
            <>
              <button onClick={() => setStage('upload')}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button onClick={handleConfirm} disabled={preview?.new === 0 || confirmImport.isPending}
                className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-400 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50">
                {confirmImport.isPending ? 'Importing...' : `Import ${preview?.new} transactions`}
              </button>
            </>
          )}
          {stage === 'result' && (
            <button onClick={onClose}
              className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-400 text-gray-900 rounded-lg font-semibold transition-colors">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}