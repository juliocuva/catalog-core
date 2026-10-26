'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { uploadProduct } from '@/app/actions/uploadProduct';
import { generateProductDescription } from '@/app/actions/generateProductDescription';

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Única'];

const PRESET_COLORS = [
  { name: 'Blanco', bg: '#FFFFFF', border: '#D1D5DB' },
  { name: 'Negro', bg: '#1F2937', border: '#111827' },
  { name: 'Beige', bg: '#E5D5C5', border: '#CBBBAA' },
  { name: 'Lila / Púrpura', bg: '#993895', border: '#7E2A7B' },
  { name: 'Rosa / Fucsia', bg: '#F472B6', border: '#DB2777' },
  { name: 'Rojo', bg: '#EF4444', border: '#DC2626' },
  { name: 'Azul', bg: '#3B82F6', border: '#2563EB' },
  { name: 'Verde', bg: '#10B981', border: '#059669' },
  { name: 'Dorado / Mostaza', bg: '#F59E0B', border: '#D97706' },
  { name: 'Estampado', bg: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)', border: '#CBD5E1' },
];

function compressFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('La foto tardó demasiado en cargarse. Por favor intenta seleccionarla de nuevo.'));
    }, 30000);

    const reader = new FileReader();
    reader.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error('No se pudo leer la foto del dispositivo.'));
    };

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        clearTimeout(timeoutId);
        return reject(new Error('Archivo de imagen vacío o no legible.'));
      }

      const img = new Image();
      img.onload = () => {
        clearTimeout(timeoutId);
        try {
          const maxDim = 1000;
          let width = img.naturalWidth || img.width || 800;
          let height = img.naturalHeight || img.height || 800;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(dataUrl);

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL('image/jpeg', 0.78);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        resolve(dataUrl);
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}

export default function UploadArticleClient({ initialCategories }: { initialCategories: any[] }) {
  const router = useRouter();
  const [categoriesList] = useState(initialCategories);
  const [selectedCategoryValue, setSelectedCategoryValue] = useState<string>(categoriesList[0]?.id ? String(categoriesList[0].id) : '');
  const [isUploading, setIsUploading] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColorInput, setCustomColorInput] = useState('');

  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({
    image1: null,
    image2: null,
    image3: null,
  });

  const [compressedImages, setCompressedImages] = useState<{ [key: string]: string | null }>({
    image1: null,
    image2: null,
    image3: null,
  });

  const [compressingSlots, setCompressingSlots] = useState<{ [key: string]: boolean }>({
    image1: false,
    image2: false,
    image3: false,
  });

  const formatPriceValue = (val: string): string => {
    const rawDigits = (val || '').replace(/\D/g, '');
    if (!rawDigits) return '';
    const formatted = rawDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$ ${formatted}`;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceInput(formatPriceValue(e.target.value));
  };

  const handleImageChange = async (slot: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCompressingSlots(prev => ({ ...prev, [slot]: true }));
      try {
        const compressedBase64 = await compressFileToDataUrl(file);
        setImagePreviews(prev => ({ ...prev, [slot]: compressedBase64 }));
        setCompressedImages(prev => ({ ...prev, [slot]: compressedBase64 }));
      } catch (err: any) {
        alert(err.message || 'Error al procesar la foto.');
      } finally {
        setCompressingSlots(prev => ({ ...prev, [slot]: false }));
      }
    }
  };

  const removeImage = (slot: string) => {
    setImagePreviews(prev => ({ ...prev, [slot]: null }));
    setCompressedImages(prev => ({ ...prev, [slot]: null }));
    setCompressingSlots(prev => ({ ...prev, [slot]: false }));
    const inputEl = document.getElementById(`file-${slot}`) as HTMLInputElement | null;
    if (inputEl) inputEl.value = '';
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const addCustomSize = () => {
    const trimmed = customSizeInput.trim().toUpperCase();
    if (trimmed && !selectedSizes.includes(trimmed)) {
      setSelectedSizes(prev => [...prev, trimmed]);
      setCustomSizeInput('');
    }
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const addCustomColor = () => {
    const trimmed = customColorInput.trim();
    if (trimmed && !selectedColors.includes(trimmed)) {
      setSelectedColors(prev => [...prev, trimmed]);
      setCustomColorInput('');
    }
  };

  const handleGenerateAiDescription = async () => {
    const nameInputEl = document.querySelector('input[name="name"]') as HTMLInputElement | null;
    const currentName = nameInputEl?.value?.trim() || '';

    if (!currentName) {
      alert('Por favor escribe primero el "Nombre del Artículo" para que la IA sepa qué prenda describir.');
      return;
    }

    const currentCat = categoriesList.find(c => String(c.id) === String(selectedCategoryValue));
    const catName = currentCat?.name || '';
    const imgToAnalyze = imagePreviews.image1 || imagePreviews.image2 || imagePreviews.image3 || null;

    setIsGeneratingAi(true);
    try {
      const res = await generateProductDescription({
        name: currentName,
        categoryName: catName,
        colors: selectedColors,
        sizes: selectedSizes,
        imageBase64: imgToAnalyze,
      });

      if (res.success && res.description) {
        setDescriptionInput(res.description);
      } else {
        alert(res.error || 'No se pudo generar la descripción');
      }
    } catch (err: any) {
      alert('Error al generar descripción: ' + (err.message || 'Error de conexión'));
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(compressingSlots).some(Boolean)) {
      alert('Las fotos aún se están procesando. Por favor espera un momento.');
      return;
    }

    setIsUploading(true);
    try {
      const formEl = e.currentTarget;
      const formData = new FormData(formEl);

      const catId = (formData.get('categoryId') as string)?.trim();
      const newCatName = (formData.get('newCategoryName') as string)?.trim();

      if (!catId) {
        alert('Por favor selecciona una categoría para el artículo.');
        setIsUploading(false);
        return;
      }

      if (catId === 'new' && !newCatName) {
        alert('Por favor escribe el nombre de la nueva categoría.');
        setIsUploading(false);
        return;
      }

      const finalSizes = [...selectedSizes];
      const pendingSize = customSizeInput.trim().toUpperCase();
      if (pendingSize && !finalSizes.includes(pendingSize)) {
        finalSizes.push(pendingSize);
      }
      formData.set('sizes', finalSizes.join(', '));

      const finalColors = [...selectedColors];
      const pendingColor = customColorInput.trim();
      if (pendingColor && !finalColors.includes(pendingColor)) {
        finalColors.push(pendingColor);
      }
      formData.set('colors', finalColors.join(', '));

      for (const slot of ['image1', 'image2', 'image3']) {
        formData.delete(slot);
        let base64 = compressedImages[slot] || imagePreviews[slot];
        if (!base64) {
          const rawInput = formEl.elements.namedItem(slot) as HTMLInputElement | null;
          const rawFile = rawInput?.files?.[0];
          if (rawFile && rawFile.size > 0) {
            base64 = await compressFileToDataUrl(rawFile);
          }
        }
        if (base64 && (base64.startsWith('data:image') || base64.startsWith('http'))) {
          formData.append(`base64_${slot}`, base64);
        }
      }

      const result = await uploadProduct(formData);

      if (result.success) {
        router.push('/catalogo');
        router.refresh();
      } else {
        alert('Error al publicar: ' + (result.error || 'Revisa los campos'));
        setIsUploading(false);
      }
    } catch (err: any) {
      alert('Error inesperado: ' + (err.message || 'Error de conexión'));
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Encabezado */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <Link
              href="/catalogo"
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
              title="Volver al catálogo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <h1 className="text-lg font-black text-gray-900">Subir Nuevo Artículo</h1>
              <p className="text-xs text-brand-primary font-semibold">Guapura Boutique</p>
            </div>
          </div>
          <Link
            href="/catalogo"
            className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* 1. SECCIÓN DE FOTOS */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-brand-primary uppercase tracking-wider">
                Fotografías del Artículo *
              </label>
              <span className="text-[11px] text-gray-400">Hasta 3 fotos</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Puedes tomar fotos con la cámara o seleccionar de tu galería.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {(['image1', 'image2', 'image3'] as const).map((slot, index) => {
                const preview = imagePreviews[slot];
                const isCompressing = compressingSlots[slot];
                return (
                  <div key={slot} className="relative aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50/70 hover:bg-gray-50 transition-all overflow-hidden group">
                    {preview ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(slot)}
                          className="absolute top-1.5 right-1.5 bg-red-500/90 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                          title="Eliminar foto"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </>
                    ) : isCompressing ? (
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <svg className="w-6 h-6 animate-spin text-brand-primary mb-1" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span className="text-[10px] font-bold text-brand-primary">Optimizando...</span>
                      </div>
                    ) : (
                      <label htmlFor={`file-${slot}`} className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-2 text-center">
                        <div className="w-8 h-8 rounded-full bg-brand-light-blue text-brand-primary flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <span className="text-[11px] font-bold text-gray-700">{index === 0 ? 'Foto Principal *' : `Foto ${index + 1}`}</span>
                        <span className="text-[9px] text-gray-400">Cámara o archivo</span>
                      </label>
                    )}
                    <input
                      id={`file-${slot}`}
                      type="file"
                      name={slot}
                      accept="image/*"
                      onChange={(e) => handleImageChange(slot, e)}
                      className="hidden"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. NOMBRE */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nombre del Artículo *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ej. Vestido Gala Esmeralda, Conjunto Seda..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>

          {/* 3. CATEGORÍA */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              name="categoryId"
              required
              value={selectedCategoryValue}
              onChange={(e) => setSelectedCategoryValue(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white cursor-pointer"
            >
              {categoriesList.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              <option value="new">+ Crear nueva categoría...</option>
            </select>

            {selectedCategoryValue === 'new' && (
              <div className="mt-3">
                <input
                  type="text"
                  name="newCategoryName"
                  required
                  placeholder="Escribe el nombre de la nueva categoría (Ej. Enterizos...)"
                  className="w-full px-4 py-3 rounded-2xl border border-brand-primary/40 bg-brand-light-blue/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            )}
          </div>

          {/* 4. PRECIO */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Precio al Público *
            </label>
            <input
              type="text"
              name="price"
              required
              inputMode="numeric"
              placeholder="$ 80.000"
              value={priceInput}
              onChange={handlePriceChange}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>

          {/* 5. TALLAS */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Tallas Disponibles
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_SIZES.map(size => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Otra talla (ej. 32, 34...)"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSize(); } }}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
              <button
                type="button"
                onClick={addCustomSize}
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                + Añadir
              </button>
            </div>
          </div>

          {/* 6. COLORES */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Colores Disponibles
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_COLORS.map(c => {
                const isSelected = selectedColors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border"
                      style={{ background: c.bg, borderColor: c.border }}
                    />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Otro color (ej. Palo de Rosa...)"
                value={customColorInput}
                onChange={(e) => setCustomColorInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomColor(); } }}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
              <button
                type="button"
                onClick={addCustomColor}
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                + Añadir
              </button>
            </div>
          </div>

          {/* 7. DESCRIPCIÓN + IA */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-gray-700">
                Descripción del Artículo
              </label>
              <button
                type="button"
                onClick={handleGenerateAiDescription}
                disabled={isGeneratingAi}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-light-blue text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Redactando...</span>
                  </>
                ) : (
                  <>
                    <span>✨ Redactar con IA</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              name="description"
              rows={4}
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              placeholder="Detalles de la tela, ocasión de uso, corte..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>

          {/* BOTÓN SUBMIT */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-4 px-6 rounded-2xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-accent transition-all shadow-lg active:scale-[0.99] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Publicando artículo...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  <span>Publicar Artículo en el Catálogo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
