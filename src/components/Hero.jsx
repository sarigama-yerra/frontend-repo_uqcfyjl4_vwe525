import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/44zrIZf-iQZhbQNQ/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black pointer-events-none" />

      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]">
            Coin Identifier
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
            Upload a photo of a coin. We’ll analyze it with AI and uncover its name, origin, history, and estimated value.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero
