# Medical Image Viewer - Complete Project

Ekta simple aur professional medical image viewer jo CT/MRI scans dekhne ke liye banaya gaya hai.

## 🎯 Features

- ✅ **Thumbnail Navigation** - Right side me thumbnails se quick navigation
- ✅ **Zoom Controls** - Zoom in/out buttons aur mouse wheel support
- ✅ **Pan/Drag** - Zoomed image ko drag kar sakte ho
- ✅ **Rotate** - 90 degree rotation
- ✅ **Keyboard Shortcuts** - Fast navigation ke liye
- ✅ **Dark Theme** - Professional medical imaging interface

## 📦 Installation

### Step 1: Dependencies Install karein

```bash
npm install
```

### Step 2: Development Server Start karein

```bash
npm run dev
```

Browser me `http://localhost:5173` open ho jayega.

### Step 3: Build for Production

```bash
npm run build
```

Production files `dist/` folder me generate hongi.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous image |
| `→` | Next image |
| `+` | Zoom in |
| `-` | Zoom out |
| `R` | Rotate |
| `0` | Reset view |

## 🎮 Controls

### Mouse Controls
- **Left Click + Drag**: Pan image (jab zoomed in ho)
- **Mouse Wheel**: Zoom in/out
- **Click Thumbnail**: Us image par jump karo

### Toolbar Buttons
- **Zoom In**: Zoom level 25% badhao
- **Zoom Out**: Zoom level 25% kam karo
- **Rotate**: Image ko 90 degree clockwise rotate karo
- **Reset**: Zoom, rotation aur pan reset karo

## 📁 Project Structure

```
medical-image-viewer/
├── index.html              # Main HTML file
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Main app component
    ├── index.css          # Global styles
    └── components/
        └── ImageViewer.jsx # Image viewer component
```

## 🔧 Customization

### Apne Images Add karein

`src/App.jsx` me ja kar images array ko modify karein:

```jsx
const sampleImages = [
  '/path/to/your/image1.jpg',
  '/path/to/your/image2.jpg',
  '/path/to/your/image3.jpg',
]
```

### API se Images Load karein

```jsx
import { useState, useEffect } from 'react'
import ImageViewer from './components/ImageViewer'

function App() {
  const [images, setImages] = useState([])

  useEffect(() => {
    // Apne API se images fetch karein
    fetch('/api/scans/123')
      .then(res => res.json())
      .then(data => setImages(data.images))
  }, [])

  return <ImageViewer images={images} />
}
```

### Colors Change karein

`src/components/ImageViewer.jsx` me Tailwind classes modify karein:

```jsx
// Cyan se blue me change karne ke liye
className="ring-cyan-500"  →  className="ring-blue-500"

// Background color change karne ke liye
className="bg-gray-900"  →  className="bg-gray-800"
```

## 🚀 Deployment

### Vercel par Deploy karein

1. GitHub par repo push karein
2. Vercel.com par jao
3. Repository import karein
4. Deploy button dabao

### Netlify par Deploy karein

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Deploy!

## 💡 Tips

1. **Better Performance**: Large images ko optimize karein
2. **Loading State**: Images load hote waqt loader dikhayein
3. **Error Handling**: Agar image load nahi hui to placeholder dikhayein

## 🐛 Troubleshooting

### Images display nahi ho rahi?
- Image URLs check karein
- Console me errors dekhein
- Network tab me requests check karein

### Zoom/Pan kaam nahi kar raha?
- Browser console me errors check karein
- Mouse events blocked to nahi hai?

### Slow performance?
- Images ka size kam karein
- Browser cache clear karein
- Different browser me try karein

## 📝 Requirements

- Node.js 16+ installed hona chahiye
- Modern browser (Chrome, Firefox, Safari, Edge)

## 🤝 Support

Koi problem hai to:
1. Browser console check karein
2. Network tab dekhein
3. Error messages padho

## 📄 License

Free to use for your projects!

---

### Quick Start Commands

```bash
# Install
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Enjoy coding! 🎉
"# image-viewer2" 
