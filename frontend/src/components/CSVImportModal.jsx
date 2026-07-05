import { useState, useRef } from 'react'
import { X, UploadCloud, CheckCircle2 } from 'lucide-react'
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
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Import Bank Statement</h2>
            <p className="text-xs text-gray-400 mt-0.5">Supports HDFC and SBI CSV formats</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">

          {stage === 'upload' && (
            <div
              onClick={() => fileRef.current.click()}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <UploadCloud size={36} className="mx-auto text-indigo-400 mb-3" />
              <p className="text-sm font-medium text-gray-700">
                {file ? file.name : 'Drop your CSV here or click to browse'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
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
                  { label: 'Found', value: preview.total, color: 'text-gray-900', bg: 'bg-gray-50' },
                  { label: 'New', value: preview.new, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Duplicates', value: preview.duplicates, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                    <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {['Date', 'Description', 'Category', 'Amount', 'Status'].map(h => (
                        <th key={h} className={`px-4 py-2.5 text-xs font-medium text-gray-400 ${h === 'Amount' ? 'text-right' : h === 'Status' ? 'text-center' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {preview.transactions.map((tx, i) => (
                      <tr key={i} className={tx.is_duplicate ? 'opacity-40' : ''}>
                        <td className="px-4 py-2.5 text-xs text-gray-400 font-mono">{tx.date}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-700 max-w-[160px] truncate">{tx.description}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{tx.category}</td>
                        <td className={`px-4 py-2.5 text-xs text-right font-mono font-medium ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {tx.is_duplicate
                            ? <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Skip</span>
                            : <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">New</span>
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
              <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
              <p className="text-lg font-semibold text-gray-900">Import complete</p>
              <p className="text-sm text-gray-500">
                <span className="text-emerald-600 font-semibold">{result.inserted} transactions imported</span>
                {result.skipped > 0 && <span className="text-gray-400"> · {result.skipped} duplicates skipped</span>}
              </p>
            </div>
          )}

        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          {stage === 'upload' && (
            <>
              <button onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl font-medium transition-colors">
                Cancel
              </button>
              <button onClick={handlePreview} disabled={!file || previewImport.isPending}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
                {previewImport.isPending ? 'Parsing...' : 'Preview Import'}
              </button>
            </>
          )}
          {stage === 'preview' && (
            <>
              <button onClick={() => setStage('upload')}
                className="px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl font-medium transition-colors">
                Back
              </button>
              <button onClick={handleConfirm} disabled={preview?.new === 0 || confirmImport.isPending}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
                {confirmImport.isPending ? 'Importing...' : `Import ${preview?.new} transactions`}
              </button>
            </>
          )}
          {stage === 'result' && (
            <button onClick={onClose}
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}