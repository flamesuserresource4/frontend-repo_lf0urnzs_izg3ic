import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, ChevronLeft } from 'lucide-react'

const sizes = [
  { key: 'small_1_layer', title: 'Small • 1 layer' },
  { key: 'big_1_layer', title: 'Big • 1 layer' },
  { key: 'multi_layer', title: '2+ layers' },
]

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Card({ label, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(255,105,180,0.35)' }}
      whileTap={{ scale: 0.98 }}
      className="group relative h-40 rounded-2xl bg-white/70 backdrop-blur border border-pink-200 hover:border-pink-300 transition-colors overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/80 to-white/80" />
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <span className="text-pink-600 font-semibold text-lg">{label}</span>
      </div>
      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-pink-100 group-hover:scale-110 transition-transform" />
    </motion.button>
  )
}

function Uploader({ sizeKey, onBack }) {
  const [image, setImage] = useState(null)
  const [desc, setDesc] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState(null)

  const handleFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target.result)
    reader.readAsDataURL(file)
  }

  const submit = async () => {
    if (!image || !desc.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/api/cakes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          size: sizeKey,
          description: desc,
          image_base64: image,
          customer_name: name || undefined,
          contact: contact || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to save')
      setSavedId(data.id)
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sizeKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative w-full max-w-xl mx-auto"
      >
        <button onClick={onBack} className="mb-6 inline-flex items-center text-pink-600 hover:text-pink-700">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </button>

        <div className="rounded-3xl border border-pink-200 bg-white/80 backdrop-blur p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-pink-700 mb-2">
            {sizes.find(s => s.key === sizeKey)?.title}
          </h3>
          <p className="text-sm text-pink-500 mb-4">Upload a reference photo and describe your dream cake.</p>

          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm text-pink-700 font-medium">Photo</span>
              <div className="mt-2 flex items-center justify-center border-2 border-dashed border-pink-200 rounded-xl p-6 bg-pink-50/50">
                {image ? (
                  <img src={image} alt="preview" className="max-h-48 rounded-lg shadow" />
                ) : (
                  <div className="text-pink-400 flex flex-col items-center">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <span>Select or drag a file</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="mt-2"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>

            <label className="block">
              <span className="text-sm text-pink-700 font-medium">Description</span>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 p-3 outline-none"
                placeholder="Flavours, fillings, vibe, colors..."
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-pink-700 font-medium">Your name (optional)</span>
                <input value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-pink-200 p-3 focus:ring-2 focus:ring-pink-200 outline-none" />
              </div>
              <div>
                <span className="text-sm text-pink-700 font-medium">Contact (optional)</span>
                <input value={contact} onChange={e => setContact(e.target.value)} className="mt-2 w-full rounded-xl border border-pink-200 p-3 focus:ring-2 focus:ring-pink-200 outline-none" />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button onClick={submit} disabled={saving || !image || !desc.trim()} className="px-5 py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {saving ? 'Saving...' : 'Place order'}
              </button>
              {savedId && <span className="text-pink-600">Saved! #{savedId}</span>}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <header className="pt-12 pb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent"
        >
          Divine Flavours Bakery
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-3 text-pink-500"
        >
          Bespoke cakes in a pink & white dream.
        </motion.p>
      </header>

      <main className="px-5 pb-16">
        {!selected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            {sizes.map((s, i) => (
              <Card key={s.key} label={s.title} onClick={() => setSelected(s.key)} />
            ))}
          </motion.div>
        ) : (
          <Uploader sizeKey={selected} onBack={() => setSelected(null)} />
        )}
      </main>

      <footer className="pb-8 text-center text-pink-400">
        © {new Date().getFullYear()} Divine Flavours
      </footer>
    </div>
  )
}

export default App
