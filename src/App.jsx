import React from 'react'
import ImageViewer from './components/ImageViewer'

function App() {
  // Sample brain scan images (using placeholder service for demo)
  const sampleImages = [
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop',
  ]

  return (
    <div className="w-full h-screen">
      <ImageViewer images={sampleImages} />
    </div>
  )
}

export default App
