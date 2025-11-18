import { useState } from 'react'

function UploadForm() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null)
    setResult(null)
    setError('')
  }

  const analyze = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const form = new FormData()
      form.append('file', file)

      const res = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        body: form,
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `Request failed: ${res.status}`)
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
        <form onSubmit={analyze} className="grid gap-4 sm:grid-cols-[1fr_auto] items-center">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white text-slate-200 w-full bg-black/30 border border-white/10 rounded-md p-2"
          />
          <button
            disabled={!file || loading}
            className="inline-flex justify-center items-center h-10 px-6 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Analyzing…' : 'Analyze Coin'}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-300">{error}</p>
        )}

        {result && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 text-slate-100">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Overview</h3>
              <div className="text-sm/6 text-slate-300 space-y-1">
                <p><span className="font-medium text-slate-100">Name:</span> {result.data?.name || 'Unknown'}</p>
                <p><span className="font-medium text-slate-100">Country:</span> {result.data?.country || 'Unknown'}</p>
                <p><span className="font-medium text-slate-100">Year:</span> {result.data?.year || 'Unknown'}</p>
                <p><span className="font-medium text-slate-100">Denomination:</span> {result.data?.denomination || 'Unknown'}</p>
                <p><span className="font-medium text-slate-100">Composition:</span> {result.data?.composition || 'Unknown'}</p>
                <p><span className="font-medium text-slate-100">Mint mark:</span> {result.data?.mint_mark || 'Unknown'}</p>
                <p><span className="font-medium text-slate-100">Confidence:</span> {typeof result.data?.confidence === 'number' ? `${Math.round(result.data.confidence * 100)}%` : '—'}</p>
                <p><span className="font-medium text-slate-100">Estimated value:</span> {result.data?.estimated_value || 'Unknown'}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Details</h3>
              <div className="text-sm/6 text-slate-300 space-y-3">
                <div>
                  <p className="font-medium text-slate-100">Key features</p>
                  <p className="whitespace-pre-wrap">{result.data?.features || '—'}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-100">History</p>
                  <p className="whitespace-pre-wrap">{result.data?.history || '—'}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-100">Condition estimate</p>
                  <p className="whitespace-pre-wrap">{result.data?.condition_estimate || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default UploadForm
