import { useState, useRef } from 'react'
import { usePreviewImport, useConfirmImport } from '../hooks/useImport'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(amount)
}

export default function CSVImportModal({ onClose }) {
  const [stage, setStage] = useState('upload') // 'upload' | 'preview' | 'result'
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const previewImport = usePreviewImport()
  const confirmImport = useConfirmImport()

  function handleFile(f) {
    if (!f || !f.name.endsWith('.csv')) {
      alert('Please upload a CSV file')
      return
    }
    setFile(f)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  async function handlePreview() {
    if (!file) return
    const data = await previewImport.mutateAsync(file)
    setPreview(data)
    setStage('preview')
  }

  async function handleConfirm() {
    if (!file) return
    const data = await confirmImport.mutateAsync(file)
    setResult(data)
    setStage('result')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Import Bank Statement</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Upload stage */}
          {stage === 'upload' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Supports HDFC and SBI bank statement CSV exports.
              </p>

              {/* Drop zone */}
              <div
                onClick={() => fileRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <p className="text-3xl mb-2">📂</p>
                <p className="text-sm font-medium text-gray-700">
                  {file ? file.name : 'Drop your CSV here or click to browse'}
                </p>
                {file && (
                  <p className="text-xs text-gray-400 mt-1">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>

              {previewImport.isError && (
                <p className="text-red-500 text-sm">
                  {previewImport.error?.response?.data?.detail ?? 'Failed to parse file'}
                </p>
              )}
            </div>
          )}

          {/* Preview stage */}
          {stage === 'preview' && preview && (
            <div className="space-y-4">

              {/* Summary banner */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-800">{preview.total}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Total found</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{preview.new}</p>
                  <p className="text-xs text-gray-400 mt-0.5">New</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{preview.duplicates}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Duplicates (will skip)</p>
                </div>
              </div>

              {/* Transaction list */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {preview.transactions.map((tx, i) => (
                      <tr key={i} className={tx.is_duplicate ? 'opacity-40' : ''}>
                        <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{tx.date}</td>
                        <td className="px-4 py-2 text-gray-700 max-w-[180px] truncate">{tx.description}</td>
                        <td className="px-4 py-2 text-gray-500">{tx.category}</td>
                        <td className={`px-4 py-2 text-right font-medium ${
                          tx.type === 'income' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {tx.is_duplicate
                            ? <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Skip</span>
                            : <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">New</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Result stage */}
          {stage === 'result' && result && (
            <div className="text-center py-8 space-y-3">
              <p className="text-4xl">✅</p>
              <p className="text-lg font-semibold text-gray-800">Import complete</p>
              <p className="text-sm text-gray-500">
                <span className="text-green-600 font-medium">{result.inserted} transactions imported</span>
                {result.skipped > 0 && `, ${result.skipped} duplicates skipped`}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          {stage === 'upload' && (
            <>
              <button onClick={onClose}
                className="px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handlePreview}
                disabled={!file || previewImport.isPending}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {previewImport.isPending ? 'Parsing...' : 'Preview Import'}
              </button>
            </>
          )}

          {stage === 'preview' && (
            <>
              <button onClick={() => setStage('upload')}
                className="px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50">
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={preview?.new === 0 || confirmImport.isPending}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {confirmImport.isPending ? 'Importing...' : `Import ${preview?.new} transactions`}
              </button>
            </>
          )}

          {stage === 'result' && (
            <button onClick={onClose}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded font-medium hover:bg-blue-700">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}