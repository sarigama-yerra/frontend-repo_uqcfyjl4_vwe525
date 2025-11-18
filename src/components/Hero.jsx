import React, { Suspense, useEffect, useState } from 'react'

// Lazy-load Spline to avoid initial hydration jank and only mount on client
const SplineLazy = React.lazy(() => import('@splinetool/react-spline'))

function Hero() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Defer mounting the heavy 3D scene until after first paint
    const id = requestAnimationFrame(() => setIsClient(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section className="relative h-[60vh] w-full overflow-hidden bg-black">
      <div
        className="absolute inset-0"
        style={{
          contain: 'layout paint size',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform, opacity',
        }}
      >
        {isClient ? (
          <Suspense
            fallback={
              <div className="w-full h-full bg-[radial-gradient(circle_at_50%_30%,#1f2937,transparent_60%)] animate-pulse" />
            }
          >
            <SplineLazy
              scene="https://prod.spline.design/44zrIZf-iQZhbQNQ/scene.splinecode"
              style={{ width: '100%', height: '100%' }}
            />
          </Suspense>
        ) : (
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_30%,#1f2937,transparent_60%)] animate-pulse" />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black pointer-events-none" />

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
