import React, { useState, useEffect } from 'react'

const ImageViewer = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragDistance, setDragDistance] = useState(0)
  const [isImageChangeDrag, setIsImageChangeDrag] = useState(false)
  
  // View mode: 1, 2, 4, or 6 images
  const [viewMode, setViewMode] = useState(1) // 1 = single, 2 = dual, 4 = quad, 6 = six
  
  // Measurement tool
  const [measureMode, setMeasureMode] = useState(false)
  const [measurements, setMeasurements] = useState([])
  const [currentMeasurement, setCurrentMeasurement] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  
  // Window presets (CT HU values)
  const [windowPreset, setWindowPreset] = useState('default')
  
  // Cine mode (auto-play)
  const [cineMode, setcineMode] = useState(false)
  const [cineSpeed, setCineSpeed] = useState(200) // milliseconds per frame
  const [cineInterval, setCineInterval] = useState(null)
  
  // Annotation tool
  const [annotationMode, setAnnotationMode] = useState(false)
  const [annotationType, setAnnotationType] = useState('arrow') // arrow, text, rectangle, circle
  const [annotations, setAnnotations] = useState([])
  const [currentAnnotation, setCurrentAnnotation] = useState(null)
  const [annotationText, setAnnotationText] = useState('')
  
  // Pixel spacing for mm conversion (typical CT: 0.5mm/pixel)
  const [pixelSpacing, setPixelSpacing] = useState(0.5) // mm per pixel
  const [showPixelSpacingDialog, setShowPixelSpacingDialog] = useState(false)
  const [measurementUnit, setMeasurementUnit] = useState('mm') // 'mm' or 'pixels'
  
  // Image adjustment controls
  const [adjustments, setAdjustments] = useState({
    grayscale: 0,
    blur: 0,
    exposure: 100,
    contrast: 100,
    hueRotate: 0,
    opacity: 100,
    invert: 0,
    saturate: 100,
    sepia: 0
  })

  const currentImage = images[currentIndex]

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'r' || e.key === 'R') handleRotate()
      if (e.key === '+' || e.key === '=') handleZoomIn()
      if (e.key === '-') handleZoomOut()
      if (e.key === '0') resetView()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    resetView()
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    resetView()
  }

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index)
    resetView()
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 5))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.25))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const resetView = () => {
    setZoom(1)
    setRotation(0)
    setPanPosition({ x: 0, y: 0 })
  }

  const resetAdjustments = () => {
    setAdjustments({
      grayscale: 0,
      blur: 0,
      exposure: 100,
      contrast: 100,
      hueRotate: 0,
      opacity: 100,
      invert: 0,
      saturate: 100,
      sepia: 0
    })
  }

  const handleAdjustmentChange = (key, value) => {
    setAdjustments(prev => ({ ...prev, [key]: value }))
  }

  const getImageFilters = () => {
    return `
      grayscale(${adjustments.grayscale}%)
      blur(${adjustments.blur}px)
      brightness(${adjustments.exposure}%)
      contrast(${adjustments.contrast}%)
      hue-rotate(${adjustments.hueRotate}deg)
      opacity(${adjustments.opacity}%)
      invert(${adjustments.invert}%)
      saturate(${adjustments.saturate}%)
      sepia(${adjustments.sepia}%)
    `.trim()
  }

  const getDisplayImages = () => {
    const displayImages = []
    for (let i = 0; i < viewMode; i++) {
      const index = (currentIndex + i) % images.length
      displayImages.push({ index, src: images[index] })
    }
    return displayImages
  }

  const getGridClass = () => {
    switch(viewMode) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-2'
      case 4: return 'grid-cols-2'
      case 6: return 'grid-cols-3'
      default: return 'grid-cols-1'
    }
  }

  const getGridRows = () => {
    switch(viewMode) {
      case 1: return 'grid-rows-1'
      case 2: return 'grid-rows-1'
      case 4: return 'grid-rows-2'
      case 6: return 'grid-rows-2'
      default: return 'grid-rows-1'
    }
  }

  const calculateDistance = (x1, y1, x2, y2) => {
    const dx = x2 - x1
    const dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
  }

  const pixelsToMm = (pixels) => {
    return pixels * pixelSpacing
  }

  const formatMeasurement = (pixels) => {
    if (measurementUnit === 'mm') {
      const mm = pixelsToMm(pixels)
      return `${mm.toFixed(2)} mm`
    } else {
      return `${pixels.toFixed(2)} pixels`
    }
  }

  const calculateArea = (width, height) => {
    const areaPixels = width * height
    if (measurementUnit === 'mm') {
      const areaMm = areaPixels * (pixelSpacing * pixelSpacing)
      return `${areaMm.toFixed(2)} mm²`
    } else {
      return `${areaPixels.toFixed(2)} px²`
    }
  }

  const calculateCircleArea = (radius) => {
    const areaPixels = Math.PI * radius * radius
    if (measurementUnit === 'mm') {
      const areaMm = areaPixels * (pixelSpacing * pixelSpacing)
      return `${areaMm.toFixed(2)} mm²`
    } else {
      return `${areaPixels.toFixed(2)} px²`
    }
  }

  const handleMeasureMouseDown = (e) => {
    if (!measureMode || viewMode !== 1) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsDrawing(true)
    setCurrentMeasurement({
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      id: Date.now()
    })
  }

  const handleMeasureMouseMove = (e) => {
    if (!isDrawing || !currentMeasurement) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setCurrentMeasurement({
      ...currentMeasurement,
      x2: x,
      y2: y
    })
  }

  const handleMeasureMouseUp = () => {
    if (isDrawing && currentMeasurement) {
      const distance = calculateDistance(
        currentMeasurement.x1,
        currentMeasurement.y1,
        currentMeasurement.x2,
        currentMeasurement.y2
      )
      
      if (distance > 5) { // Only save if line is meaningful
        setMeasurements([...measurements, currentMeasurement])
      }
      
      setIsDrawing(false)
      setCurrentMeasurement(null)
    }
  }

  const clearMeasurements = () => {
    setMeasurements([])
    setCurrentMeasurement(null)
  }

  const deleteMeasurement = (id) => {
    setMeasurements(measurements.filter(m => m.id !== id))
  }

  // Window presets (simulated CT HU windows using brightness/contrast)
  const windowPresets = {
    default: { brightness: 100, contrast: 100, name: 'Default' },
    brain: { brightness: 110, contrast: 140, name: 'Brain (80/40)' },
    lung: { brightness: 50, contrast: 200, name: 'Lung (1500/-600)' },
    bone: { brightness: 140, contrast: 180, name: 'Bone (2000/300)' },
    softTissue: { brightness: 105, contrast: 130, name: 'Soft Tissue (350/50)' },
    mediastinum: { brightness: 108, contrast: 135, name: 'Mediastinum (350/50)' },
  }

  const applyWindowPreset = (preset) => {
    setWindowPreset(preset)
    const presetValues = windowPresets[preset]
    setAdjustments({
      ...adjustments,
      exposure: presetValues.brightness,
      contrast: presetValues.contrast
    })
  }

  // Cine mode functions
  const startCineMode = () => {
    setcineMode(true)
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length)
    }, cineSpeed)
    setCineInterval(interval)
  }

  const stopCineMode = () => {
    setcineMode(false)
    if (cineInterval) {
      clearInterval(cineInterval)
      setCineInterval(null)
    }
  }

  const toggleCineMode = () => {
    if (cineMode) {
      stopCineMode()
    } else {
      startCineMode()
    }
  }

  // Cleanup cine interval on unmount
  React.useEffect(() => {
    return () => {
      if (cineInterval) {
        clearInterval(cineInterval)
      }
    }
  }, [cineInterval])

  // Annotation functions
  const handleAnnotationMouseDown = (e) => {
    if (!annotationMode || viewMode !== 1) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsDrawing(true)
    setCurrentAnnotation({
      type: annotationType,
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      text: annotationType === 'text' ? annotationText : '',
      id: Date.now()
    })
  }

  const handleAnnotationMouseMove = (e) => {
    if (!isDrawing || !currentAnnotation) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setCurrentAnnotation({
      ...currentAnnotation,
      x2: x,
      y2: y
    })
  }

  const handleAnnotationMouseUp = () => {
    if (isDrawing && currentAnnotation) {
      if (currentAnnotation.type === 'text') {
        // For text, prompt for input
        const text = prompt('Enter annotation text:', annotationText)
        if (text) {
          setAnnotations([...annotations, { ...currentAnnotation, text }])
        }
      } else {
        setAnnotations([...annotations, currentAnnotation])
      }
      
      setIsDrawing(false)
      setCurrentAnnotation(null)
    }
  }

  const clearAnnotations = () => {
    setAnnotations([])
    setCurrentAnnotation(null)
  }

  const handleMouseDown = (e) => {
    if (measureMode) {
      handleMeasureMouseDown(e)
      return
    }
    
    if (annotationMode) {
      handleAnnotationMouseDown(e)
      return
    }
    
    setIsDragging(true)
    setDragDistance(0)
    
    if (zoom > 1) {
      // Pan mode when zoomed
      setIsImageChangeDrag(false)
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y,
      })
    } else {
      // Image change mode when not zoomed (CT scan style)
      setIsImageChangeDrag(true)
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  const handleMouseMove = (e) => {
    if (measureMode && isDrawing) {
      handleMeasureMouseMove(e)
      return
    }
    
    if (annotationMode && isDrawing) {
      handleAnnotationMouseMove(e)
      return
    }
    
    if (!isDragging) return
    
    if (zoom > 1 && !isImageChangeDrag) {
      // Pan the zoomed image
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    } else if (isImageChangeDrag) {
      // Calculate vertical drag distance for image change
      const deltaY = e.clientY - dragStart.y
      setDragDistance(deltaY)
      
      // Change image based on vertical drag (like CT scan scroll)
      const threshold = 30 // pixels to drag before changing image
      
      if (Math.abs(deltaY) > threshold) {
        if (deltaY < 0) {
          // Dragged up - next image
          handleNext()
        } else {
          // Dragged down - previous image
          handlePrev()
        }
        // Reset drag start position
        setDragStart({ x: e.clientX, y: e.clientY })
        setDragDistance(0)
      }
    }
  }

  const handleMouseUp = () => {
    if (measureMode && isDrawing) {
      handleMeasureMouseUp()
      return
    }
    
    if (annotationMode && isDrawing) {
      handleAnnotationMouseUp()
      return
    }
    
    setIsDragging(false)
    setIsImageChangeDrag(false)
    setDragDistance(0)
  }

  const handleWheel = (e) => {
    e.preventDefault()
    
    // Check if adjustment panel is open and mouse is over it
    const adjustmentPanel = e.currentTarget.querySelector('.w-80')
    if (adjustmentPanel && e.target.closest('.w-80')) {
      // Allow normal scrolling in adjustment panel
      return
    }
    
    // If zoomed in, use wheel for zoom
    if (zoom > 1) {
      if (e.deltaY < 0) {
        handleZoomIn()
      } else {
        handleZoomOut()
      }
    } else {
      // If not zoomed, use wheel to change images (CT scan style)
      if (e.deltaY < 0) {
        // Scroll up - previous image
        handlePrev()
      } else {
        // Scroll down - next image
        handleNext()
      }
    }
  }

  if (!images.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>No images to display</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      {/* Top Toolbar */}
      <div className="bg-white p-3 flex items-center justify-between border-b border-gray-300 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Zoom In Button */}
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors border border-gray-300"
            title="Zoom In (+)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
          
          {/* Zoom Out Button */}
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors border border-gray-300"
            title="Zoom Out (-)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          
          {/* Rotate Button */}
          <button
            onClick={handleRotate}
            className="p-2 hover:bg-gray-100 rounded transition-colors border border-gray-300"
            title="Rotate (R)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          {/* Reset Button */}
          <button
            onClick={resetView}
            className="px-3 py-2 hover:bg-gray-100 rounded transition-colors text-sm border border-gray-300"
            title="Reset View (0)"
          >
            Reset
          </button>
          
          <div className="mx-2 border-l border-gray-300 h-8"></div>
          
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
            <button
              onClick={() => setViewMode(1)}
              className={`p-2 rounded transition-colors text-xs font-medium ${
                viewMode === 1 ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              title="Single Image"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="3" y="3" width="14" height="14" rx="2" />
              </svg>
            </button>
            
            <button
              onClick={() => setViewMode(2)}
              className={`p-2 rounded transition-colors text-xs font-medium ${
                viewMode === 2 ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              title="2 Images"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="2" y="3" width="7" height="14" rx="1" />
                <rect x="11" y="3" width="7" height="14" rx="1" />
              </svg>
            </button>
            
            <button
              onClick={() => setViewMode(4)}
              className={`p-2 rounded transition-colors text-xs font-medium ${
                viewMode === 4 ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              title="4 Images"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="2" y="2" width="7" height="7" rx="1" />
                <rect x="11" y="2" width="7" height="7" rx="1" />
                <rect x="2" y="11" width="7" height="7" rx="1" />
                <rect x="11" y="11" width="7" height="7" rx="1" />
              </svg>
            </button>
            
            <button
              onClick={() => setViewMode(6)}
              className={`p-2 rounded transition-colors text-xs font-medium ${
                viewMode === 6 ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              title="6 Images"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="1" y="2" width="5" height="7" rx="1" />
                <rect x="7.5" y="2" width="5" height="7" rx="1" />
                <rect x="14" y="2" width="5" height="7" rx="1" />
                <rect x="1" y="11" width="5" height="7" rx="1" />
                <rect x="7.5" y="11" width="5" height="7" rx="1" />
                <rect x="14" y="11" width="5" height="7" rx="1" />
              </svg>
            </button>
          </div>
          
          <div className="mx-2 border-l border-gray-300 h-8"></div>
          
          {/* Window Presets */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Window:</label>
            <select
              value={windowPreset}
              onChange={(e) => applyWindowPreset(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50"
            >
              <option value="default">Default</option>
              <option value="brain">Brain</option>
              <option value="lung">Lung</option>
              <option value="bone">Bone</option>
              <option value="softTissue">Soft Tissue</option>
              <option value="mediastinum">Mediastinum</option>
            </select>
          </div>
          
          <div className="mx-2 border-l border-gray-300 h-8"></div>
          
          {/* Cine Mode Controls */}
          <button
            onClick={toggleCineMode}
            className={`p-2 rounded transition-colors border ${
              cineMode 
                ? 'bg-green-500 text-white border-green-600' 
                : 'bg-white hover:bg-gray-100 border-gray-300'
            }`}
            title={cineMode ? 'Stop Cine' : 'Start Cine'}
            disabled={viewMode !== 1}
          >
            {cineMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          {cineMode && (
            <div className="flex items-center gap-1">
              <label className="text-xs text-gray-600">Speed:</label>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={cineSpeed}
                onChange={(e) => {
                  setCineSpeed(parseInt(e.target.value))
                  if (cineMode) {
                    stopCineMode()
                    startCineMode()
                  }
                }}
                className="w-20 h-1"
              />
            </div>
          )}
          
          <div className="mx-2 border-l border-gray-300 h-8"></div>
          
          {/* Annotation Tools */}
          <button
            onClick={() => {
              setAnnotationMode(!annotationMode)
              if (annotationMode) {
                clearAnnotations()
              }
              setMeasureMode(false)
            }}
            className={`p-2 rounded transition-colors border ${
              annotationMode 
                ? 'bg-purple-500 text-white border-purple-600' 
                : 'bg-white hover:bg-gray-100 border-gray-300'
            }`}
            title="Annotation Tool"
            disabled={viewMode !== 1}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          
          {annotationMode && (
            <>
              <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
                <button
                  onClick={() => setAnnotationType('arrow')}
                  className={`p-1 rounded text-xs ${
                    annotationType === 'arrow' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Arrow"
                >
                  ↗️
                </button>
                <button
                  onClick={() => setAnnotationType('text')}
                  className={`p-1 rounded text-xs ${
                    annotationType === 'text' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Text"
                >
                  T
                </button>
                <button
                  onClick={() => setAnnotationType('rectangle')}
                  className={`p-1 rounded text-xs ${
                    annotationType === 'rectangle' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Rectangle"
                >
                  ▭
                </button>
                <button
                  onClick={() => setAnnotationType('circle')}
                  className={`p-1 rounded text-xs ${
                    annotationType === 'circle' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Circle"
                >
                  ○
                </button>
              </div>
              <button
                onClick={clearAnnotations}
                className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Clear
              </button>
            </>
          )}
          
          <div className="mx-2 border-l border-gray-300 h-8"></div>
          
          {/* Measurement Tool */}
          <button
            onClick={() => {
              setMeasureMode(!measureMode)
              if (measureMode) {
                clearMeasurements()
              }
              setAnnotationMode(false)
            }}
            className={`p-2 rounded transition-colors border ${
              measureMode 
                ? 'bg-blue-500 text-white border-blue-600' 
                : 'bg-white hover:bg-gray-100 border-gray-300'
            }`}
            title="Measurement Tool"
            disabled={viewMode !== 1}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h3m3 0h3m3 0h3m3 0h3" />
            </svg>
          </button>
          
          {measureMode && (
            <button
              onClick={clearMeasurements}
              className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              title="Clear All Measurements"
            >
              Clear All
            </button>
          )}
          
          <div className="mx-2 border-l border-gray-300 h-8"></div>
          
          {/* Pixel Spacing & Unit Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMeasurementUnit(measurementUnit === 'mm' ? 'pixels' : 'mm')}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              title="Toggle Unit"
            >
              {measurementUnit === 'mm' ? 'mm' : 'px'}
            </button>
            
            <button
              onClick={() => setShowPixelSpacingDialog(!showPixelSpacingDialog)}
              className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
              title="Set Pixel Spacing"
            >
              ⚙️ {pixelSpacing}mm/px
            </button>
          </div>
          
          {showPixelSpacingDialog && (
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4 z-50">
              <div className="mb-3">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Pixel Spacing Configuration
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  Set the physical size of each pixel (from DICOM metadata)
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="10"
                    value={pixelSpacing}
                    onChange={(e) => setPixelSpacing(parseFloat(e.target.value) || 0.5)}
                    className="px-3 py-2 border border-gray-300 rounded w-24 text-sm"
                  />
                  <span className="text-sm text-gray-600">mm/pixel</span>
                </div>
                <div className="mt-3 space-y-1 text-xs text-gray-600">
                  <p><strong>Common values:</strong></p>
                  <button onClick={() => setPixelSpacing(0.5)} className="block hover:text-blue-600">
                    • 0.5 mm/px (typical CT head)
                  </button>
                  <button onClick={() => setPixelSpacing(0.7)} className="block hover:text-blue-600">
                    • 0.7 mm/px (typical CT chest)
                  </button>
                  <button onClick={() => setPixelSpacing(1.0)} className="block hover:text-blue-600">
                    • 1.0 mm/px (typical CT abdomen)
                  </button>
                  <button onClick={() => setPixelSpacing(0.3)} className="block hover:text-blue-600">
                    • 0.3 mm/px (high-res CT)
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowPixelSpacingDialog(false)}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              >
                Done
              </button>
            </div>
          )}
          
          <span className="text-sm text-gray-600 ml-2">
            Zoom: {(zoom * 100).toFixed(0)}%
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {images.length}
          </span>
          <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded transition-colors text-sm border border-gray-300">
            Report Information
          </button>
          <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded transition-colors text-sm border border-gray-300">
            Write Comments
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Adjustment Controls Panel */}
        <div className="w-56 bg-white border-r border-gray-300 p-3 overflow-y-auto">
          <div className="space-y-3">
            <button
              onClick={resetAdjustments}
              className="w-full px-3 py-2 bg-white hover:bg-gray-50 rounded text-sm transition-colors border border-gray-300"
            >
              Reset All
            </button>

            {/* Grayscale */}
            <div>
              <label className="block text-xs mb-1 text-gray-700 font-medium">
                Grayscale
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.grayscale}
                onChange={(e) => handleAdjustmentChange('grayscale', e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Blur */}
            <div>
              <label className="block text-xs mb-1 text-gray-700 font-medium">
                Blur
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={adjustments.blur}
                onChange={(e) => handleAdjustmentChange('blur', e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Exposure (Brightness) */}
            <div>
              <label className="block text-xs mb-1 text-gray-700 font-medium">
                Exposure
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={adjustments.exposure}
                onChange={(e) => handleAdjustmentChange('exposure', e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Contrast */}
            <div>
              <label className="block text-xs mb-1 text-gray-700 font-medium">
                Contrast
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={adjustments.contrast}
                onChange={(e) => handleAdjustmentChange('contrast', e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Hue Rotate */}
            <div>
              <label className="block text-xs mb-1 text-gray-700 font-medium">
                Hue Rotate
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={adjustments.hueRotate}
                onChange={(e) => handleAdjustmentChange('hueRotate', e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-xs mb-1 text-gray-700 font-medium">
                Opacity
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.opacity}
                onChange={(e) => handleAdjustmentChange('opacity', e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Invert */}
            <div>
              <label className="block text-xs mb-1 text-gray-700 font-medium">
                Invert
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.invert}
                onChange={(e) => handleAdjustmentChange('invert', e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Saturate */}
            <div>
              <label className="block text-xs mb-1 text-gray-700 font-medium">
                Saturate
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={adjustments.saturate}
                onChange={(e) => handleAdjustmentChange('saturate', e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Sepia */}
            <div>
              <label className="block text-xs mb-1 text-gray-700 font-medium">
                Sepia
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.sepia}
                onChange={(e) => handleAdjustmentChange('sepia', e.target.value)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Center: Main Image Display Area */}
        <div className="flex-1 flex flex-col">
          <div
            className={`flex-1 relative overflow-hidden bg-gray-300 ${
              viewMode === 1 ? '' : 'p-2'
            }`}
            style={{ 
              cursor: measureMode ? 'crosshair' : (annotationMode ? 'crosshair' : (zoom > 1 ? 'move' : 'ns-resize'))
            }}
            onMouseDown={viewMode === 1 ? handleMouseDown : undefined}
            onMouseMove={viewMode === 1 ? handleMouseMove : undefined}
            onMouseUp={viewMode === 1 ? handleMouseUp : undefined}
            onMouseLeave={viewMode === 1 ? handleMouseUp : undefined}
            onWheel={viewMode === 1 ? handleWheel : undefined}
          >
            {viewMode === 1 ? (
              // Single image view (with zoom/pan)
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={currentImage}
                    alt={`Scan ${currentIndex + 1}`}
                    className="max-w-none select-none"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg) translate(${panPosition.x / zoom}px, ${panPosition.y / zoom}px)`,
                      transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                      filter: getImageFilters()
                    }}
                    draggable={false}
                  />
                  
                  {/* Measurement SVG Overlay */}
                  {viewMode === 1 && (
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ zIndex: 10 }}
                    >
                      {/* Existing measurements */}
                      {measurements.map((m) => {
                        const distance = calculateDistance(m.x1, m.y1, m.x2, m.y2)
                        const midX = (m.x1 + m.x2) / 2
                        const midY = (m.y1 + m.y2) / 2
                        
                        return (
                          <g key={m.id}>
                            {/* Line */}
                            <line
                              x1={m.x1}
                              y1={m.y1}
                              x2={m.x2}
                              y2={m.y2}
                              stroke="#00FF00"
                              strokeWidth="2"
                            />
                            {/* Start point */}
                            <circle cx={m.x1} cy={m.y1} r="4" fill="#00FF00" />
                            {/* End point */}
                            <circle cx={m.x2} cy={m.y2} r="4" fill="#00FF00" />
                            {/* Distance label */}
                            <text
                              x={midX}
                              y={midY - 10}
                              fill="white"
                              fontSize="14"
                              fontWeight="bold"
                              textAnchor="middle"
                              style={{
                                textShadow: '1px 1px 2px black, -1px -1px 2px black',
                              }}
                            >
                              {formatMeasurement(distance)}
                            </text>
                          </g>
                        )
                      })}
                      
                      {/* Current measurement being drawn */}
                      {isDrawing && currentMeasurement && (
                        <g>
                          <line
                            x1={currentMeasurement.x1}
                            y1={currentMeasurement.y1}
                            x2={currentMeasurement.x2}
                            y2={currentMeasurement.y2}
                            stroke="#FFFF00"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                          <circle cx={currentMeasurement.x1} cy={currentMeasurement.y1} r="4" fill="#FFFF00" />
                          <circle cx={currentMeasurement.x2} cy={currentMeasurement.y2} r="4" fill="#FFFF00" />
                          <text
                            x={(currentMeasurement.x1 + currentMeasurement.x2) / 2}
                            y={(currentMeasurement.y1 + currentMeasurement.y2) / 2 - 10}
                            fill="yellow"
                            fontSize="14"
                            fontWeight="bold"
                            textAnchor="middle"
                            style={{
                              textShadow: '1px 1px 2px black, -1px -1px 2px black',
                            }}
                          >
                            {formatMeasurement(calculateDistance(
                              currentMeasurement.x1,
                              currentMeasurement.y1,
                              currentMeasurement.x2,
                              currentMeasurement.y2
                            ))}
                          </text>
                        </g>
                      )}
                      
                      {/* Annotations */}
                      {annotations.map((ann) => {
                        if (ann.type === 'arrow') {
                          return (
                            <g key={ann.id}>
                              <defs>
                                <marker
                                  id={`arrowhead-${ann.id}`}
                                  markerWidth="10"
                                  markerHeight="10"
                                  refX="9"
                                  refY="3"
                                  orient="auto"
                                >
                                  <polygon points="0 0, 10 3, 0 6" fill="#FF6B6B" />
                                </marker>
                              </defs>
                              <line
                                x1={ann.x1}
                                y1={ann.y1}
                                x2={ann.x2}
                                y2={ann.y2}
                                stroke="#FF6B6B"
                                strokeWidth="3"
                                markerEnd={`url(#arrowhead-${ann.id})`}
                              />
                            </g>
                          )
                        } else if (ann.type === 'text') {
                          return (
                            <text
                              key={ann.id}
                              x={ann.x1}
                              y={ann.y1}
                              fill="#FFD93D"
                              fontSize="18"
                              fontWeight="bold"
                              style={{
                                textShadow: '2px 2px 4px black, -1px -1px 2px black',
                              }}
                            >
                              {ann.text}
                            </text>
                          )
                        } else if (ann.type === 'rectangle') {
                          const width = Math.abs(ann.x2 - ann.x1)
                          const height = Math.abs(ann.y2 - ann.y1)
                          const x = Math.min(ann.x1, ann.x2)
                          const y = Math.min(ann.y1, ann.y2)
                          const area = calculateArea(width, height)
                          return (
                            <g key={ann.id}>
                              <rect
                                x={x}
                                y={y}
                                width={width}
                                height={height}
                                fill="none"
                                stroke="#4ECDC4"
                                strokeWidth="3"
                              />
                              <text
                                x={x + width / 2}
                                y={y - 5}
                                fill="#4ECDC4"
                                fontSize="12"
                                fontWeight="bold"
                                textAnchor="middle"
                                style={{
                                  textShadow: '1px 1px 2px black',
                                }}
                              >
                                {formatMeasurement(width)} × {formatMeasurement(height)}
                              </text>
                              <text
                                x={x + width / 2}
                                y={y + height + 15}
                                fill="#4ECDC4"
                                fontSize="11"
                                fontWeight="bold"
                                textAnchor="middle"
                                style={{
                                  textShadow: '1px 1px 2px black',
                                }}
                              >
                                Area: {area}
                              </text>
                            </g>
                          )
                        } else if (ann.type === 'circle') {
                          const radius = calculateDistance(ann.x1, ann.y1, ann.x2, ann.y2)
                          const diameter = radius * 2
                          const area = calculateCircleArea(radius)
                          return (
                            <g key={ann.id}>
                              <circle
                                cx={ann.x1}
                                cy={ann.y1}
                                r={radius}
                                fill="none"
                                stroke="#A78BFA"
                                strokeWidth="3"
                              />
                              <text
                                x={ann.x1}
                                y={ann.y1 - radius - 5}
                                fill="#A78BFA"
                                fontSize="12"
                                fontWeight="bold"
                                textAnchor="middle"
                                style={{
                                  textShadow: '1px 1px 2px black',
                                }}
                              >
                                ⌀ {formatMeasurement(diameter)}
                              </text>
                              <text
                                x={ann.x1}
                                y={ann.y1 + radius + 15}
                                fill="#A78BFA"
                                fontSize="11"
                                fontWeight="bold"
                                textAnchor="middle"
                                style={{
                                  textShadow: '1px 1px 2px black',
                                }}
                              >
                                Area: {area}
                              </text>
                            </g>
                          )
                        }
                        return null
                      })}
                      
                      {/* Current annotation being drawn */}
                      {isDrawing && currentAnnotation && (
                        <g>
                          {currentAnnotation.type === 'arrow' && (
                            <>
                              <defs>
                                <marker
                                  id="arrowhead-current"
                                  markerWidth="10"
                                  markerHeight="10"
                                  refX="9"
                                  refY="3"
                                  orient="auto"
                                >
                                  <polygon points="0 0, 10 3, 0 6" fill="#FF6B6B" />
                                </marker>
                              </defs>
                              <line
                                x1={currentAnnotation.x1}
                                y1={currentAnnotation.y1}
                                x2={currentAnnotation.x2}
                                y2={currentAnnotation.y2}
                                stroke="#FF6B6B"
                                strokeWidth="3"
                                strokeDasharray="5,5"
                                markerEnd="url(#arrowhead-current)"
                              />
                            </>
                          )}
                          {currentAnnotation.type === 'rectangle' && (
                            <rect
                              x={Math.min(currentAnnotation.x1, currentAnnotation.x2)}
                              y={Math.min(currentAnnotation.y1, currentAnnotation.y2)}
                              width={Math.abs(currentAnnotation.x2 - currentAnnotation.x1)}
                              height={Math.abs(currentAnnotation.y2 - currentAnnotation.y1)}
                              fill="none"
                              stroke="#4ECDC4"
                              strokeWidth="3"
                              strokeDasharray="5,5"
                            />
                          )}
                          {currentAnnotation.type === 'circle' && (
                            <circle
                              cx={currentAnnotation.x1}
                              cy={currentAnnotation.y1}
                              r={calculateDistance(
                                currentAnnotation.x1,
                                currentAnnotation.y1,
                                currentAnnotation.x2,
                                currentAnnotation.y2
                              )}
                              fill="none"
                              stroke="#A78BFA"
                              strokeWidth="3"
                              strokeDasharray="5,5"
                            />
                          )}
                        </g>
                      )}
                    </svg>
                  )}
                  
                  {/* Scroll indicator */}
                  {isImageChangeDrag && Math.abs(dragDistance) > 10 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 text-gray-800 px-4 py-2 rounded-lg border border-gray-300 shadow-lg">
                      <div className="text-center">
                        {dragDistance < 0 ? (
                          <div>
                            <svg className="w-6 h-6 mx-auto animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs mt-1">Next Image</p>
                          </div>
                        ) : (
                          <div>
                            <svg className="w-6 h-6 mx-auto animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs mt-1">Previous Image</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation arrows (only in single view) */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-colors border border-gray-300 shadow-lg"
                  title="Previous (←)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-colors border border-gray-300 shadow-lg"
                  title="Next (→)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            ) : (
              // Multi-image grid view
              <div className={`grid ${getGridClass()} ${getGridRows()} gap-2 h-full`}>
                {getDisplayImages().map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentIndex(img.index)}
                    className={`relative bg-white rounded overflow-hidden cursor-pointer transition-all ${
                      img.index === currentIndex
                        ? 'ring-2 ring-blue-500 shadow-lg'
                        : 'hover:ring-2 hover:ring-gray-400'
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={`Image ${img.index + 1}`}
                      className="w-full h-full object-contain"
                      style={{ filter: getImageFilters() }}
                    />
                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                      {img.index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom: Play/Pause controls */}
          <div className="bg-white border-t border-gray-300 p-2 flex items-center justify-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded transition-colors border border-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors border border-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Thumbnail sidebar - 2 columns grid layout */}
        <div className="w-80 bg-gray-200 border-l border-gray-400 overflow-y-auto">
          <div className="p-3">
            {/* Create rows of 2 thumbnails each */}
            {Array.from({ length: Math.ceil(images.length / 2) }).map((_, rowIndex) => {
              const leftIndex = rowIndex * 2;
              const rightIndex = rowIndex * 2 + 1;
              
              return (
                <div key={rowIndex} className="grid grid-cols-2 gap-3 mb-3">
                  {/* Left thumbnail */}
                  {leftIndex < images.length && (
                    <div
                      onClick={() => handleThumbnailClick(leftIndex)}
                      className="cursor-pointer"
                    >
                      <div
                        className={`relative rounded overflow-hidden transition-all ${
                          leftIndex === currentIndex
                            ? 'ring-2 ring-blue-500 shadow-lg'
                            : 'hover:ring-2 hover:ring-gray-400'
                        }`}
                      >
                        <img
                          src={images[leftIndex]}
                          alt={`Thumbnail ${leftIndex + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div
                          className={`absolute top-1 left-1 bg-white/90 px-2 py-0.5 rounded text-xs font-semibold ${
                            leftIndex === currentIndex ? 'text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          {leftIndex + 1}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Right thumbnail */}
                  {rightIndex < images.length && (
                    <div
                      onClick={() => handleThumbnailClick(rightIndex)}
                      className="cursor-pointer"
                    >
                      <div
                        className={`relative rounded overflow-hidden transition-all ${
                          rightIndex === currentIndex
                            ? 'ring-2 ring-blue-500 shadow-lg'
                            : 'hover:ring-2 hover:ring-gray-400'
                        }`}
                      >
                        <img
                          src={images[rightIndex]}
                          alt={`Thumbnail ${rightIndex + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div
                          className={`absolute top-1 left-1 bg-white/90 px-2 py-0.5 rounded text-xs font-semibold ${
                            rightIndex === currentIndex ? 'text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          {rightIndex + 1}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageViewer
