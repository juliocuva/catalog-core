'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function QuickProductEntry() {
  const router = useRouter()
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch categories on mount
  useEffect(() => {
    fetch('/api/categories?limit=50')
      .then(res => res.json())
      .then(data => {
        if (data.docs) setCategories(data.docs)
      })
      .catch(console.error)
  }, [])

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photo || !name) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', photo)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('category', category)

    try {
      const res = await fetch('/api/quick-product', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        // Redirigir al producto en el catálogo
        router.push(`/catalogo/${data.product.id}`)
      } else {
        alert('Error: ' + data.error)
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-full bg-gray-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <h1 className="font-bold text-gray-900 text-lg">Ingreso Rápido</h1>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Captura de foto */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Fotografía del Producto *</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square bg-white border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative hover:border-gray-900 transition-colors shadow-sm"
            >
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 flex flex-col items-center text-gray-400">
                  <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="font-semibold text-gray-700 text-sm">Abrir Cámara</span>
                  <span className="text-xs mt-1">Toma una foto a la muestra</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef} 
              onChange={handlePhotoCapture} 
              className="hidden" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-bold text-gray-700">Nombre del Producto *</label>
            <input 
              id="name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Casco Industrial Tipo I"
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 transition shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-bold text-gray-700">Categoría</label>
            <select 
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 transition shadow-sm appearance-none"
            >
              <option value="">Selecciona una categoría...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-bold text-gray-700">Especificaciones rápidas</label>
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Material policarbonato, resistente a impactos..."
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 transition shadow-sm resize-none"
            />
          </div>

          <div className="pt-4 pb-8">
            <button 
              type="submit" 
              disabled={loading || !photo || !name}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publicando...
                </>
              ) : (
                'Publicar en el Catálogo'
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}
