import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

function Hero() {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(0)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#000000')
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 0.5, 3.2)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    renderer.setPixelRatio(dpr)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1)
    keyLight.position.set(2.5, 3, 2)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x88aaff, 0.6)
    rimLight.position.set(-3, 1.5, -2)
    scene.add(rimLight)

    // Coin geometry (thin cylinder)
    const coinGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.08, 128, 1, false)
    const metal = new THREE.MeshStandardMaterial({
      color: 0xb7b7b7,
      metalness: 0.95,
      roughness: 0.25,
      envMapIntensity: 1.0,
    })
    const coin = new THREE.Mesh(coinGeom, metal)
    coin.rotation.x = Math.PI * 0.2
    scene.add(coin)

    // Edge ring
    const edgeGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.082, 128, 1, true)
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0xc9c9c9,
      metalness: 0.98,
      roughness: 0.2,
      side: THREE.DoubleSide,
    })
    const edge = new THREE.Mesh(edgeGeom, edgeMat)
    scene.add(edge)

    // Dotted rim (subtle)
    const dotGeom = new THREE.RingGeometry(1.08, 1.14, 96)
    const dotMat = new THREE.PointsMaterial({ color: 0xdddddd, size: 0.01 })
    const dots = new THREE.Points(dotGeom, dotMat)
    dots.rotation.x = Math.PI / 2
    dots.position.y = 0.041
    scene.add(dots)

    // Fog for depth
    scene.fog = new THREE.Fog(0x000000, 6, 12)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    let lastT = performance.now()

    // Respect reduced motion, but keep a minimal spin so users still see motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = mediaQuery.matches
    const onRMChange = (e) => { reducedMotion = e.matches }
    // addEventListener is supported in modern browsers; fallback for older
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', onRMChange)
    else if (mediaQuery.addListener) mediaQuery.addListener(onRMChange)

    const animate = (t) => {
      const dt = Math.min((t - lastT) / 1000, 0.033)
      lastT = t

      const rotSpeed = reducedMotion ? 0.08 : 0.4
      coin.rotation.y += rotSpeed * dt
      edge.rotation.y = coin.rotation.y

      if (!reducedMotion) {
        const bob = Math.sin(t * 0.0016) * 0.03
        coin.position.y = bob
        dots.rotation.z += 0.15 * dt
      } else {
        coin.position.y = 0
      }

      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }

    // Handle resize
    const onResize = () => {
      if (!container) return
      const { clientWidth, clientHeight } = container
      renderer.setSize(clientWidth, clientHeight)
      camera.aspect = Math.max(clientWidth / Math.max(clientHeight, 1), 0.0001)
      camera.updateProjectionMatrix()
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationRef.current)
      } else {
        lastT = performance.now()
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    // Kick things off
    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', onRMChange)
      else if (mediaQuery.removeListener) mediaQuery.removeListener(onRMChange)

      coinGeom.dispose()
      edgeGeom.dispose()
      dotGeom.dispose()
      metal.dispose()
      edgeMat.dispose()
      dotMat.dispose()
      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <section className="relative h-[60vh] w-full overflow-hidden bg-black">
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{
          contain: 'layout paint size',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform, opacity',
        }}
      />

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
