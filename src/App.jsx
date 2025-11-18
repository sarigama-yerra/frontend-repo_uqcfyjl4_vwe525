import Hero from './components/Hero'
import UploadForm from './components/UploadForm'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <UploadForm />
      <footer className="py-10 text-center text-slate-400 text-sm">
        Built with AI image analysis • No coin is graded with absolute certainty; always verify before trading.
      </footer>
    </div>
  )
}

export default App
