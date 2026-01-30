# 🚀 Complete Setup Guide - Medical Image Viewer

## Bilkul Basic Se Start Karte Hain!

### Step 0: Prerequisites (Pehle ye chahiye)

1. **Node.js Install karein**
   - https://nodejs.org se download karein
   - LTS version (recommended) download karein
   - Install ho gaya hai ya nahi check karne ke liye:
   ```bash
   node --version
   npm --version
   ```

2. **Code Editor Install karein**
   - VS Code recommended: https://code.visualstudio.com
   - Ya koi bhi editor use kar sakte ho

---

## 📥 Step 1: Project Setup

### Option A: Agar ZIP file download ki hai

1. ZIP file extract karein
2. Terminal/Command Prompt open karein
3. Project folder me jao:
   ```bash
   cd medical-image-viewer
   ```

### Option B: Scratch se banana hai

1. Folder banao:
   ```bash
   mkdir medical-image-viewer
   cd medical-image-viewer
   ```

2. Sab files create karo (jo maine provide ki hain)

---

## 📦 Step 2: Dependencies Install

Terminal me ye command run karein:

```bash
npm install
```

**Ye kya karega?**
- React install karega
- Vite install karega (fast development server)
- Tailwind CSS install karega (styling ke liye)
- Aur sab required packages

**Time lagega**: 1-3 minutes (internet speed par depend karta hai)

**Kya dikhega?**
```
added 245 packages, and audited 246 packages in 45s
```

---

## 🎯 Step 3: Development Server Start Karein

```bash
npm run dev
```

**Kya hoga?**
- Local server start ho jayega
- Browser me automatically `http://localhost:5173` khulega
- Ya manually browser me ye URL dalo

**Console me ye dikhega:**
```
  VITE v5.0.12  ready in 327 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 🎨 Step 4: Project Dekho!

Browser me ab aapka medical image viewer chal raha hoga!

**Kya dikhai dega?**
- ✅ Main image display area (center me)
- ✅ Zoom buttons (top left)
- ✅ Thumbnails (right side)
- ✅ Navigation arrows
- ✅ Report aur Comments buttons

---

## 🔧 Step 5: Customize Karein (Optional)

### Apne Images Add Karein

1. `src/App.jsx` file open karein
2. `sampleImages` array ko modify karein:

```jsx
const sampleImages = [
  '/images/scan1.jpg',    // Apne image path dalo
  '/images/scan2.jpg',
  '/images/scan3.jpg',
]
```

### Colors Change Karein

1. `src/components/ImageViewer.jsx` open karein
2. Tailwind classes modify karein:

```jsx
// Cyan se Blue
"ring-cyan-500" → "ring-blue-500"
"bg-cyan-600" → "bg-blue-600"

// Gray se Dark
"bg-gray-900" → "bg-gray-950"
```

---

## 🏗️ Step 6: Production Build (Deployment ke liye)

Jab ready ho deploy karne ke liye:

```bash
npm run build
```

**Kya hoga?**
- `dist/` folder bana jayega
- Usme optimized production files hongi
- Wo files server par upload kar sakte ho

**Build output:**
```
vite v5.0.12 building for production...
✓ 127 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-DiwrgTda.css    4.25 kB │ gzip:  1.45 kB
dist/assets/index-C5vONqsI.js   186.32 kB │ gzip: 62.51 kB
✓ built in 1.25s
```

---

## 🌐 Step 7: Deploy Karein

### Vercel par (Easiest!)

1. GitHub par account banao (agar nahi hai)
2. Project ko GitHub par push karo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. https://vercel.com par jao
4. GitHub se sign in karo
5. "Import Project" select karo
6. Repository select karo
7. Deploy button dabo!

**Done! 5 minutes me live!**

### Netlify par

1. `npm run build` run karo
2. https://netlify.com par jao
3. `dist` folder drag-drop karo
4. Done!

---

## 🎮 Keyboard Shortcuts

Project me ye shortcuts kaam karenge:

| Key | Kya Karega |
|-----|------------|
| `←` | Previous image |
| `→` | Next image |
| `+` | Zoom in |
| `-` | Zoom out |
| `R` | Rotate karo |
| `0` | Reset everything |

---

## 🐛 Common Problems & Solutions

### Problem 1: `npm: command not found`
**Solution**: Node.js install karna bhool gaye
- https://nodejs.org se download karein
- Install karke terminal restart karein

### Problem 2: Port already in use
**Solution**: Port 5173 already busy hai
```bash
# Different port use karo
npm run dev -- --port 3000
```

### Problem 3: Images nahi dikh rahi
**Solution**: Image URLs check karo
- Console me errors dekho (F12)
- Image path sahi hai?
- Internet connection check karo

### Problem 4: White/blank screen
**Solution**: Build issue hai
```bash
# Clean install karo
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problem 5: Styling nahi lag rahi
**Solution**: Tailwind properly setup nahi hai
```bash
# Tailwind config check karo
# index.css me @tailwind imports hai?
```

---

## 📱 Mobile/Tablet Support

Currently desktop ke liye optimized hai. Mobile support ke liye:

1. Touch events add karein
2. Responsive design improve karein
3. Swipe gestures add karein

---

## 🎓 Next Steps

1. **API Integration**: Backend se images load karo
2. **Authentication**: User login add karo
3. **Database**: Images database me store karo
4. **Annotations**: Images par drawing/notes add karo
5. **Export**: Reports generate karo

---

## 💡 Pro Tips

1. **Development**:
   - VS Code extensions install karo: ESLint, Prettier
   - React DevTools browser extension use karo

2. **Performance**:
   - Images ko compress karo (TinyPNG use karo)
   - WebP format use karo
   - Lazy loading implement karo

3. **Best Practices**:
   - Git use karo (version control)
   - Regular commits karo
   - README update karte raho

---

## 📞 Help Chahiye?

1. Console errors screenshot lo
2. Network tab check karo
3. Error message carefully padho
4. Google pe search karo error message

---

## 🎉 Congratulations!

Tumne successfully ek professional medical image viewer bana liya!

**Ab kya kar sakte ho?**
- ✅ Apne portfolio me add karo
- ✅ Resume me mention karo
- ✅ GitHub profile pe showcase karo
- ✅ Live demo link share karo

Happy Coding! 🚀
