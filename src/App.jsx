import React, { useState } from 'react'
import Viewer from './Viewer.jsx'
import './App.css'

// Placeholder gallery images (public domain Unsplash)
const GALLERY = [
  { src: 'https://picsum.photos/seed/a1/800/600', thumb: 'https://picsum.photos/seed/a1/200/150', alt: 'Image 1' },
  { src: 'https://picsum.photos/seed/b2/900/700', thumb: 'https://picsum.photos/seed/b2/200/150', alt: 'Image 2' },
  { src: 'https://picsum.photos/seed/c3/700/900', thumb: 'https://picsum.photos/seed/c3/200/150', alt: 'Image 3' },
  { src: 'https://picsum.photos/seed/d4/1000/600', thumb: 'https://picsum.photos/seed/d4/200/150', alt: 'Image 4' },
  { src: 'https://picsum.photos/seed/e5/600/800', thumb: 'https://picsum.photos/seed/e5/200/150', alt: 'Image 5' },
  { src: 'https://picsum.photos/seed/f6/850/650', thumb: 'https://picsum.photos/seed/f6/200/150', alt: 'Image 6' },
  { src: 'https://picsum.photos/seed/g7/750/950', thumb: 'https://picsum.photos/seed/g7/200/150', alt: 'Image 7' },
  { src: 'https://picsum.photos/seed/h8/950/750', thumb: 'https://picsum.photos/seed/h8/200/150', alt: 'Image 8' },
  { src: 'https://picsum.photos/seed/i9/680/820', thumb: 'https://picsum.photos/seed/i9/200/150', alt: 'Image 9' },
]

export default function App() {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)

  const openViewer = (i) => {
    setStartIndex(i)
    setViewerOpen(true)
  }

  return (
    <div className="gallery-page">
      <h1 className="gallery-heading">Image Gallery</h1>
      <p className="gallery-sub">Click any image to open the viewer</p>
      <div className="gallery-grid">
        {GALLERY.map((img, i) => (
          <div className="gallery-item" key={i} onClick={() => openViewer(i)}>
            <img src={img.thumb} alt={img.alt} />
          </div>
        ))}
      </div>

      {viewerOpen && (
        <Viewer
          images={GALLERY}
          initialIndex={startIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  )
}
