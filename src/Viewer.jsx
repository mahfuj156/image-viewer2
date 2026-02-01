import React, { useState, useEffect, useRef, useCallback } from 'react'
import './Viewer.css'

/* ─── SVG ICON HELPERS (match viewer.js v1.11.7 SVG set) ─────────────────── */
const Icon = ({ d, viewBox = '0 0 24 24' }) => (
  <svg width="20" height="20" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const icons = {
  zoomIn:          <Icon d="M11 11m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0 M16.243 16.243L21 21 M8 11h6 M11 8v6" />,
  zoomOut:         <Icon d="M11 11m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0 M16.243 16.243L21 21 M8 11h6" />,
  oneToOne:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><text x="2" y="18" fontSize="14" fontFamily="monospace" fill="currentColor" stroke="none">1:1</text></svg>,
  reset:           <Icon d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5" />,
  prev:            <Icon d="M15 18l-6-6 6-6" />,
  play:            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21" /></svg>,
  pause:           <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  next:            <Icon d="M9 18l6-6-6-6" />,
  rotateLeft:      <Icon d="M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />,
  rotateRight:     <Icon d="M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10m-22 4 4.64 4.36A9 9 0 0 0 20.49 15" />,
  flipHorizontal:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><polyline points="7 7 2 12 7 17"/><polyline points="17 7 22 12 17 17"/></svg>,
  flipVertical:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><polyline points="7 7 12 2 17 7"/><polyline points="7 17 12 22 17 17"/></svg>,
  brightnessUp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="12" r="4"/>
      <line x1="10" y1="2" x2="10" y2="4"/><line x1="10" y1="20" x2="10" y2="22"/>
      <line x1="2.93" y1="4.93" x2="4.34" y2="6.34"/><line x1="15.66" y1="17.66" x2="17.07" y2="19.07"/>
      <line x1="2" y1="12" x2="4" y2="12"/><line x1="16" y1="12" x2="18" y2="12"/>
      <line x1="2.93" y1="19.07" x2="4.34" y2="17.66"/><line x1="15.66" y1="6.34" x2="17.07" y2="4.93"/>
      <line x1="19" y1="12" x2="23" y2="12" strokeWidth="2.5"/>
      <line x1="21" y1="10" x2="21" y2="14" strokeWidth="2.5"/>
    </svg>
  ),
  brightnessDown: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="12" r="4"/>
      <line x1="10" y1="2" x2="10" y2="4"/><line x1="10" y1="20" x2="10" y2="22"/>
      <line x1="2.93" y1="4.93" x2="4.34" y2="6.34"/><line x1="15.66" y1="17.66" x2="17.07" y2="19.07"/>
      <line x1="2" y1="12" x2="4" y2="12"/><line x1="16" y1="12" x2="18" y2="12"/>
      <line x1="2.93" y1="19.07" x2="4.34" y2="17.66"/><line x1="15.66" y1="6.34" x2="17.07" y2="4.93"/>
      <line x1="19" y1="12" x2="23" y2="12" strokeWidth="2.5"/>
    </svg>
  ),
  contrastUp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="12" r="9"/>
      <path d="M10 3a9 9 0 0 1 0 18" fill="currentColor" stroke="none"/>
      <line x1="18" y1="8" x2="22" y2="8" strokeWidth="2.5"/>
      <line x1="20" y1="6" x2="20" y2="10" strokeWidth="2.5"/>
    </svg>
  ),
  contrastDown: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="12" r="9"/>
      <path d="M10 3a9 9 0 0 1 0 18" fill="currentColor" stroke="none"/>
      <line x1="18" y1="8" x2="22" y2="8" strokeWidth="2.5"/>
    </svg>
  ),
  close:           <Icon d="M18 6L6 18 M6 6l12 12" />,
  fullscreen:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  exitFullscreen:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
}

/* ─── VIEWER COMPONENT ───────────────────────────────────────────────────── */
export default function Viewer({ images, initialIndex, onClose }) {
  // ── state ───────────────────────────────────────────────────────────────
  const [idx, setIdx]               = useState(initialIndex)
  const [loaded, setLoaded]         = useState(false)
  const [naturalW, setNaturalW]     = useState(0)
  const [naturalH, setNaturalH]     = useState(0)
  const [scale, setScale]           = useState(1)
  const [rotate, setRotate]         = useState(0)
  const [flipH, setFlipH]           = useState(false)
  const [flipV, setFlipV]           = useState(false)
  const [offsetX, setOffsetX]       = useState(0)
  const [offsetY, setOffsetY]       = useState(0)
  const [playing, setPlaying]       = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast]     = useState(100)
  const [tooltip, setTooltip]       = useState('')
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  const canvasRef   = useRef(null)   // .viewer-canvas (the image wrapper)
  const imgRef      = useRef(null)
  const navRef      = useRef(null)
  const playRef     = useRef(null)
  const containerRef= useRef(null)

  // ── compute "fit" scale whenever image loads ──────────────────────────
  const computeInitialScale = useCallback((nw, nh) => {
    if (!containerRef.current || !nw || !nh) return 1
    const rect = containerRef.current.getBoundingClientRect()
    // leave 40px top for header, 40px bottom for toolbar, 60px bottom for navbar
    const availW = rect.width - 40
    const availH = rect.height - 140
    return Math.min(availW / nw, availH / nh, 1)
  }, [])

  // ── image load handler ──────────────────────────────────────────────
  const handleImgLoad = useCallback((e) => {
    const nw = e.target.naturalWidth
    const nh = e.target.naturalHeight
    setNaturalW(nw)
    setNaturalH(nh)
    const s = computeInitialScale(nw, nh)
    setScale(s)
    setRotate(0)
    setFlipH(false)
    setFlipV(false)
    setOffsetX(0)
    setOffsetY(0)
    setLoaded(true)
  }, [computeInitialScale])

  // reset whenever idx changes
  useEffect(() => {
    setLoaded(false)
    setScale(1)
    setRotate(0)
    setFlipH(false)
    setFlipV(false)
    setOffsetX(0)
    setOffsetY(0)
    setBrightness(100)
    setContrast(100)
  }, [idx])

  // ── navigation helpers ────────────────────────────────────────────────
  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length])

  // ── play / stop ───────────────────────────────────────────────────────
  useEffect(() => {
    if (playing) {
      playRef.current = setInterval(() => setIdx(i => (i + 1) % images.length), 2000)
    } else {
      clearInterval(playRef.current)
    }
    return () => clearInterval(playRef.current)
  }, [playing, images.length])

  // ── zoom helpers ──────────────────────────────────────────────────────
  const zoomTo = useCallback((s) => setScale(Math.max(0.01, Math.min(100, s))), [])
  const zoomIn  = () => { zoomTo(scale * 1.3); showTooltip(`${Math.round(scale * 1.3 * 100)}%`) }
  const zoomOut = () => { zoomTo(scale * 0.7); showTooltip(`${Math.round(scale * 0.7 * 100)}%`) }
  const oneToOne= () => { zoomTo(1); showTooltip('100%') }
  const reset   = () => {
    const s = computeInitialScale(naturalW, naturalH)
    setScale(s); setRotate(0); setFlipH(false); setFlipV(false); setOffsetX(0); setOffsetY(0)
    setBrightness(100); setContrast(100)
  }

  // ── tooltip ───────────────────────────────────────────────────────────
  const tooltipTimer = useRef(null)
  const showTooltip = (txt) => {
    clearTimeout(tooltipTimer.current)
    setTooltip(txt)
    tooltipTimer.current = setTimeout(() => setTooltip(''), 1200)
  }

  // ── rotate / flip ─────────────────────────────────────────────────────
  const rotateLeft  = () => setRotate(r => r - 90)
  const rotateRight = () => setRotate(r => r + 90)

  // ── brightness / contrast (step ±7, clamped 0–200, tooltip on change) ─
  const STEP = 7
  const incBrightness = () => { const v = Math.min(200, brightness + STEP); setBrightness(v); showTooltip(`Brightness: ${v}%`) }
  const decBrightness = () => { const v = Math.max(0,   brightness - STEP); setBrightness(v); showTooltip(`Brightness: ${v}%`) }
  const incContrast   = () => { const v = Math.min(200, contrast   + STEP); setContrast(v);   showTooltip(`Contrast: ${v}%`)   }
  const decContrast   = () => { const v = Math.max(0,   contrast   - STEP); setContrast(v);   showTooltip(`Contrast: ${v}%`)   }

  // ── drag / pan ────────────────────────────────────────────────────────
  const drag = useRef({ active: false, startX: 0, startY: 0, ox: 0, oy: 0 })

  const onCanvasMouseDown = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, ox: offsetX, oy: offsetY }
  }
  const onMouseMove = (e) => {
    if (!drag.current.active) return
    setOffsetX(drag.current.ox + (e.clientX - drag.current.startX))
    setOffsetY(drag.current.oy + (e.clientY - drag.current.startY))
  }
  const onMouseUp = () => { drag.current.active = false }

  // ── wheel zoom (centered on cursor) ──────────────────────────────────
  const onWheel = useCallback((e) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
    const newScale = Math.max(0.01, Math.min(100, scale * factor))

    // zoom toward mouse position
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left - rect.width / 2
      const mouseY = e.clientY - rect.top  - rect.height / 2
      setOffsetX(prev => mouseX - (mouseX - prev) * (newScale / scale))
      setOffsetY(prev => mouseY - (mouseY - prev) * (newScale / scale))
    }
    zoomTo(newScale)
    showTooltip(`${Math.round(newScale * 100)}%`)
  }, [scale, zoomTo])

  // attach wheel non-passively
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // ── double-click toggle ───────────────────────────────────────────────
  const onDblClick = () => {
    const fitScale = computeInitialScale(naturalW, naturalH)
    if (Math.abs(scale - 1) > 0.01) {
      zoomTo(1); showTooltip('100%')
    } else {
      zoomTo(fitScale); showTooltip(`${Math.round(fitScale * 100)}%`)
    }
  }

  // ── fullscreen ────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  // ── keyboard ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      switch (e.key) {
        case 'Escape':  setPlaying(false); onClose(); break
        case ' ':       e.preventDefault(); setPlaying(p => !p); break
        case 'ArrowLeft':  e.preventDefault(); prev(); break
        case 'ArrowRight': e.preventDefault(); next(); break
        case 'ArrowUp':    e.preventDefault(); zoomIn(); break
        case 'ArrowDown':  e.preventDefault(); zoomOut(); break
      }
      // Ctrl+0 = reset, Ctrl+1 = 1:1
      if (e.ctrlKey && e.key === '0') { e.preventDefault(); reset() }
      if (e.ctrlKey && e.key === '1') { e.preventDefault(); oneToOne() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // ── scroll navbar active thumb into view ──────────────────────────────
  useEffect(() => {
    if (navRef.current) {
      const active = navRef.current.querySelector('.viewer-navbar-item.active')
      if (active) active.scrollIntoView({ inline: 'center', block: 'nearest' })
    }
  }, [idx])

  // ── image transform string ────────────────────────────────────────────
  const transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg) scale(${scale}) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`

  // ── title ─────────────────────────────────────────────────────────────
  const title = naturalW && naturalH
    ? `${images[idx]?.alt || ''} (${naturalW} × ${naturalH})`
    : images[idx]?.alt || ''

  // ─── RENDER ───────────────────────────────────────────────────────────
  return (
    <div className="viewer-container" ref={containerRef}
         onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
    >
      {/* backdrop */}
      <div className="viewer-backdrop" onClick={onClose} />

      {/* header: close + fullscreen */}
      <div className="viewer-header">
        <button className="viewer-btn viewer-btn-close" onClick={onClose} title="Close">
          {icons.close}
        </button>
        <button className="viewer-btn viewer-btn-fullscreen" onClick={toggleFullscreen} title="Full screen">
          {isFullscreen ? icons.exitFullscreen : icons.fullscreen}
        </button>
      </div>

      {/* canvas area – image lives here */}
      <div className="viewer-canvas" ref={canvasRef}
           onMouseDown={onCanvasMouseDown}
           onDoubleClick={onDblClick}
      >
        <img
          ref={imgRef}
          src={images[idx]?.src}
          alt={images[idx]?.alt}
          className="viewer-image"
          style={{ transform, filter: `brightness(${brightness}%) contrast(${contrast}%)`, transition: drag.current.active ? 'none' : 'transform 0.15s' }}
          onLoad={handleImgLoad}
          draggable={false}
        />
      </div>

      {/* title bar */}
      <div className="viewer-title">{title}</div>

      {/* tooltip (zoom percentage) */}
      {tooltip && <div className="viewer-tooltip">{tooltip}</div>}

      {/* toolbar */}
      <div className="viewer-toolbar">
        <ToolBtn title="Zoom in"          onClick={zoomIn}>{icons.zoomIn}</ToolBtn>
        <ToolBtn title="Zoom out"         onClick={zoomOut}>{icons.zoomOut}</ToolBtn>
        <ToolBtn title="One to one"       onClick={oneToOne}>{icons.oneToOne}</ToolBtn>
        <ToolBtn title="Reset"            onClick={reset}>{icons.reset}</ToolBtn>
        <ToolBtn title="Previous"         onClick={prev}>{icons.prev}</ToolBtn>
        <ToolBtn title={playing ? 'Stop' : 'Play'} onClick={() => setPlaying(p => !p)}>
          {playing ? icons.pause : icons.play}
        </ToolBtn>
        <ToolBtn title="Next"             onClick={next}>{icons.next}</ToolBtn>
        <ToolBtn title="Rotate left"      onClick={rotateLeft}>{icons.rotateLeft}</ToolBtn>
        <ToolBtn title="Rotate right"     onClick={rotateRight}>{icons.rotateRight}</ToolBtn>
        <ToolBtn title="Flip horizontal"  onClick={() => setFlipH(f => !f)}>{icons.flipHorizontal}</ToolBtn>
        <ToolBtn title="Flip vertical"    onClick={() => setFlipV(f => !f)}>{icons.flipVertical}</ToolBtn>
        <ToolBtn title="Increase brightness" onClick={incBrightness}>{icons.brightnessUp}</ToolBtn>
        <ToolBtn title="Decrease brightness" onClick={decBrightness}>{icons.brightnessDown}</ToolBtn>
        <ToolBtn title="Increase contrast"   onClick={incContrast}>{icons.contrastUp}</ToolBtn>
        <ToolBtn title="Decrease contrast"   onClick={decContrast}>{icons.contrastDown}</ToolBtn>
      </div>

      {/* navbar – thumbnail strip */}
      <div className="viewer-navbar" ref={navRef}>
        {images.map((img, i) => (
          <div
            key={i}
            className={`viewer-navbar-item${i === idx ? ' active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIdx(i) }}
          >
            <img src={img.thumb || img.src} alt={img.alt} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── TOOLBAR BUTTON ─────────────────────────────────────────────────────── */
function ToolBtn({ children, onClick, title }) {
  return (
    <button className="viewer-toolbar-btn" onClick={onClick} title={title}>
      {children}
    </button>
  )
}
