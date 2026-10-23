'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { uploadProduct } from '@/app/actions/uploadProduct'
import { updateProduct } from '@/app/actions/updateProduct'
import { deleteProduct } from '@/app/actions/deleteProduct'
import { deleteCategory } from '@/app/actions/deleteCategory'
import { createCategory } from '@/app/actions/createCategory'
import { loginUser, logoutUser } from '@/app/actions/loginUser'

function extractPlainTextDescription(desc: any): string {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  try {
    const children = desc?.root?.children || [];
    return children
      .map((node: any) => (node.children || []).map((c: any) => c.text || '').join(''))
      .filter(Boolean)
      .join('\n');
  } catch {
    return '';
  }
}

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

export default function CatalogClient({ initialProducts, initialCategories, isAdmin = false, userRole = null }: { initialProducts: any[], initialCategories: any[], isAdmin?: boolean, userRole?: string | null }) {
  const router = useRouter();
  const [categoriesList, setCategoriesList] = useState(initialCategories);
  const [productsList, setProductsList] = useState(initialProducts);

  useEffect(() => {
    setCategoriesList(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    setProductsList(initialProducts);
  }, [initialProducts]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTargetProduct, setShareTargetProduct] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Interactive Upload State
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColorInput, setCustomColorInput] = useState('');
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({
    image1: null,
    image2: null,
    image3: null,
  });

  // Category Manager State
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [newCatNameInput, setNewCatNameInput] = useState('');
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  // Team Management State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(true);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      if (isStandalone) {
        setIsInstallable(false);
      }

      const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      const handleAppInstalled = () => {
        setIsInstallable(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          setIsInstallable(false);
          setDeferredPrompt(null);
        }
      } catch (err) {
        setShowInstallModal(true);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const openUploadModal = (product: any = null) => {
    setEditingProduct(product);
    if (product) {
      const sizesArr = product.sizes ? product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
      const colorsArr = product.colors ? product.colors.split(',').map((c: string) => c.trim()).filter(Boolean) : [];
      setSelectedSizes(sizesArr);
      setSelectedColors(colorsArr);
      setImagePreviews({
        image1: product.image || null,
        image2: null,
        image3: null,
      });
    } else {
      setSelectedSizes([]);
      setSelectedColors([]);
      setImagePreviews({ image1: null, image2: null, image3: null });
    }
    setCustomSizeInput('');
    setCustomColorInput('');
    setIsUploadModalOpen(true);
  };

  const handleImageChange = (slot: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [slot]: previewUrl }));
    }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const addCustomSize = () => {
    const trimmed = customSizeInput.trim();
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

  const mappedProducts = productsList.map(p => {
    const specs = Array.isArray(p.specifications) ? p.specifications : [];
    const priceSpec = specs.find((s: any) => ['precio', 'price', 'valor'].includes((s.name || '').toLowerCase()));
    const sizeSpecs = specs
      .filter((s: any) => ['talla', 'tallas', 'tamaño'].includes((s.name || '').toLowerCase()))
      .map((s: any) => s.value)
      .filter(Boolean);
    const colorSpecs = specs
      .filter((s: any) => ['color', 'colores'].includes((s.name || '').toLowerCase()))
      .map((s: any) => s.value)
      .filter(Boolean);

    return {
      id: p.id,
      name: p.name,
      brand: p.brand?.name || 'Guapura Boutique',
      categoryId: p.category?.id || (p.category ? p.category : null),
      image: p.mockImageUrl || p.images?.[0]?.image?.url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
      isNew: p.isNew || false,
      price: priceSpec?.value || '',
      sizes: sizeSpecs.join(', '),
      colors: colorSpecs.join(', '),
      descriptionText: extractPlainTextDescription(p.description),
    };
  });

  const filteredProducts = selectedCategoryId 
    ? mappedProducts.filter(p => p.categoryId === selectedCategoryId)
    : mappedProducts;

  const openShareModal = (product: any = null) => {
    setShareTargetProduct(product);
    setCopiedLink(false);
    setIsShareModalOpen(true);
  };

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    return shareTargetProduct
      ? `${window.location.origin}/catalogo/${shareTargetProduct.id}`
      : `${window.location.origin}/catalogo`;
  };

  const handleCopyShareLink = async () => {
    const url = getShareUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Error copying link', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta prenda?')) {
      const result = await deleteProduct(productId);
      if (result.success) {
        setProductsList(prev => prev.filter(p => String(p.id) !== String(productId)));
        router.refresh();
      } else {
        alert('Error: ' + result.error);
      }
    }
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (categoriesList.length <= 1) {
      alert('Debes mantener al menos una categoría activa en el catálogo.');
      return;
    }

    const countInCat = productsList.filter(p => {
      const pCatId = typeof p.category === 'object' ? p.category?.id : p.category;
      return String(pCatId) === String(catId);
    }).length;

    const confirmMsg = countInCat > 0
      ? `¿Estás segura de que deseas eliminar la categoría "${catName}"?\n\n⚠️ Esta categoría contiene ${countInCat} prenda(s) que también se eliminarán del catálogo.`
      : `¿Estás segura de que deseas eliminar la categoría "${catName}"?`;

    if (confirm(confirmMsg)) {
      setDeletingCatId(catId);
      try {
        const res = await deleteCategory(catId);
        if (res.success) {
          setCategoriesList(prev => prev.filter(c => String(c.id) !== String(catId)));
          setProductsList(prev => prev.filter(p => {
            const pCatId = typeof p.category === 'object' ? p.category?.id : p.category;
            return String(pCatId) !== String(catId);
          }));
          if (selectedCategoryId === catId) {
            setSelectedCategoryId(null);
          }
          router.refresh();
        } else {
          alert('Error: ' + (res.error || 'No se pudo eliminar la categoría'));
        }
      } catch (err: any) {
        alert('Error inesperado: ' + (err.message || 'Error de conexión'));
      } finally {
        setDeletingCatId(null);
      }
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatNameInput.trim();
    if (!trimmed) return;
    setIsSubmittingCat(true);
    try {
      const res = await createCategory(trimmed);
      if (res.success && res.category) {
        setCategoriesList(prev => [...prev, res.category]);
        setNewCatNameInput('');
        router.refresh();
      } else {
        alert('Error: ' + (res.error || 'No se pudo crear la categoría'));
      }
    } catch (err: any) {
      alert('Error inesperado: ' + (err.message || 'Error al crear la categoría'));
    } finally {
      setIsSubmittingCat(false);
    }
  };

  const handleUploadProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, formData);
    } else {
      result = await uploadProduct(formData);
    }
    
    setIsUploading(false);
    if (result.success) {
      setIsUploadModalOpen(false);
      setEditingProduct(null);
      router.refresh();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    const result = await loginUser(formData);
    setIsUploading(false);
    
    if (result.success) {
      window.location.reload();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleUserIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setIsLoginModalOpen(true);
    } else if (userRole === 'administrador') {
      setIsTeamModalOpen(true);
    } else {
      // Si está logueado pero no es admin, preguntamos si quiere cerrar sesión
      if (confirm('¿Deseas cerrar sesión?')) {
        logoutUser().then(() => window.location.reload());
      }
    }
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setShareTargetProduct(null);
    setCopiedLink(false);
  };

  const canEdit = isAdmin && ['administrador', 'comercial', 'diseñador'].includes(userRole || '');
  const canDelete = isAdmin && ['administrador', 'comercial'].includes(userRole || '');
  const canCreate = isAdmin && ['administrador', 'comercial'].includes(userRole || '');

  return (
    <div className="bg-background min-h-screen pb-24 font-sans text-foreground w-full relative">
      {/* Top Nav */}
      <div className="bg-brand-primary text-white text-[10px] py-1.5 px-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <span>Guapura Boutique • Catálogo Virtual Exclusivo</span>
           <div className="flex gap-4">
             <a href="https://api.whatsapp.com/send?phone=573113421026&text=Hola%20Guapura%20Boutique%2C%20tengo%20una%20consulta%20sobre%20el%20cat%C3%A1logo" target="_blank" rel="noopener noreferrer" className="hover:text-brand-light-blue transition-colors font-semibold">WhatsApp Directo</a>
           </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 mb-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center gap-4">
          
          {/* Logo */}
          <Link href="/" className="block hover:opacity-85 transition-opacity cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/guapura%20logo_Mesa%20de%20trabajo%201.png"
              alt="Guapura Boutique"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-3 text-brand-primary">
            {/* Install PWA Button */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-brand-primary text-white text-xs font-bold hover:bg-brand-accent transition-all shadow-sm active:scale-95"
                title="Instalar App Guapura en tu dispositivo"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/app-icon.png" alt="Guapura App" className="w-4 h-4 rounded-full bg-white p-0.5 object-cover" />
                <span className="hidden sm:inline">Instalar App</span>
                <span className="sm:hidden">Instalar</span>
              </button>
            )}

            {/* Share Full Catalog */}
            <button
              onClick={() => openShareModal(null)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-brand-light-blue text-brand-primary text-xs font-bold hover:opacity-90 transition-opacity"
              title="Compartir Catálogo por WhatsApp"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              <span className="hidden sm:inline">Compartir Catálogo</span>
            </button>

            {/* User / Login */}
            <button onClick={handleUserIconClick} className={`p-2 rounded-full transition-colors ${isAdmin ? 'bg-brand-primary/10 text-brand-primary' : 'hover:bg-gray-100 text-gray-600 hover:text-brand-primary'}`} title={isAdmin ? "Opciones de Cuenta" : "Acceso Comercial"}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            {/* Create Product (Admin/Comercial) */}
            {canCreate && (
              <button onClick={() => openUploadModal(null)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-colors bg-brand-primary text-white text-xs font-bold hover:bg-brand-accent shadow-sm" title="Subir Prenda">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                <span>Subir Prenda</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="max-w-7xl mx-auto px-5 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-xl tracking-tight flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            Categorías <span className="font-script font-normal text-brand-primary text-xl lowercase ml-1">exclusivas</span>
          </h3>
          {canCreate && (
            <button
              type="button"
              onClick={() => setIsCategoryManagerOpen(true)}
              className="text-xs font-bold text-brand-primary hover:text-brand-accent bg-brand-light-blue px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
              title="Administrar categorías"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>Gestionar / Eliminar</span>
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-6 mt-6">
          <div 
             onClick={() => setSelectedCategoryId(null)}
             className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm transition-all ${selectedCategoryId === null ? 'bg-brand-primary text-white border-brand-primary' : 'bg-gray-50 border-gray-100 text-gray-600 group-hover:bg-brand-primary/10'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </div>
            <span className={`text-[10px] font-light ${selectedCategoryId === null ? 'text-brand-primary' : 'text-gray-600'}`}>Todos</span>
          </div>

          {categoriesList.map((cat, idx) => {
             const isActive = selectedCategoryId === cat.id;
             const rawHtml = cat.icon
               ? cat.icon
                   .replace(/className=/g, 'class=')
                   .replace(/strokeWidth=\{([^}]+)\}/g, 'stroke-width="$1"')
                   .replace(/strokeLinecap=/g, 'stroke-linecap=')
                   .replace(/strokeLinejoin=/g, 'stroke-linejoin=')
               : '';
               
             return (
               <div key={idx} onClick={() => setSelectedCategoryId(cat.id)} className="flex flex-col items-center gap-2 cursor-pointer group">
                 <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm transition-all ${isActive ? 'bg-brand-primary text-white border-brand-primary' : 'bg-gray-50 border-gray-100 text-gray-600 group-hover:bg-brand-primary/10'}`}>
                   <span className="scale-[0.9]" dangerouslySetInnerHTML={{ __html: rawHtml }} />
                 </div>
                 <span className={`text-[10px] font-light ${isActive ? 'text-brand-primary' : 'text-gray-600'}`}>{cat.name}</span>
               </div>
             );
          })}
        </div>
      </div>

      {/* Recommended / Products Grid */}
      <div className="max-w-7xl mx-auto px-5 pb-8 pt-4">
         <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-xl tracking-tight flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
            Prendas <span className="font-script font-normal text-brand-primary text-2xl lowercase ml-1">favoritas</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex flex-col group hover:-translate-y-1 transition-transform border border-brand-gray/30">
              {/* Image Container */}
              <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                {product.isNew && (
                  <span className="absolute top-2 left-2 z-10 bg-brand-accent text-white text-[9px] font-bold px-2 py-1 rounded">
                    Nuevo
                  </span>
                )}
                {canEdit && (
                  <button onClick={(e) => { e.preventDefault(); openUploadModal(product); }} className="absolute top-2 right-11 z-20 bg-white/95 shadow-sm p-1.5 rounded-full text-brand-primary hover:bg-brand-light-blue transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100" title="Editar prenda">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                )}
                {canDelete && (
                  <button onClick={(e) => { e.preventDefault(); handleDeleteProduct(product.id) }} className="absolute top-2 right-2 z-20 bg-white/95 shadow-sm p-1.5 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100" title="Eliminar prenda">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
                <Link href={`/catalogo/${product.id}`} className="block w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </Link>
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 justify-between">
                <div className="mb-2">
                  <Link href={`/catalogo/${product.id}`}>
                    <h4 className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 mb-1 hover:text-brand-primary transition-colors">{product.name}</h4>
                  </Link>
                  {product.price && (
                    <p className="text-sm font-black text-brand-primary">{product.price}</p>
                  )}
                  {product.sizes && (
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">Tallas: {product.sizes}</p>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={(e) => { e.preventDefault(); openShareModal(product); }}
                    className="w-8 h-8 flex-shrink-0 bg-brand-primary border border-brand-primary rounded-lg flex items-center justify-center text-brand-light-gray hover:opacity-90 transition-opacity shadow-sm"
                    title="Compartir enlace de esta prenda"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </button>
                  <a 
                    href={`https://api.whatsapp.com/send?phone=573113421026&text=${encodeURIComponent(
                      `Hola Guapura Boutique, me interesa la prenda "${product.name}"${product.price ? ` (${product.price})` : ''}. ¿Me das más información?`
                    )}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-brand-light-blue text-brand-primary text-[10px] font-bold rounded-lg py-2 flex items-center justify-center gap-1.5 hover:bg-brand-light-blue/80 transition-colors shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5 text-brand-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    Preguntar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOGIN MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-[420px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative bg-gradient-to-br from-white via-brand-light-blue/30 to-brand-light-blue/60">
            
            {/* Close Button */}
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="px-10 pt-12 pb-10">
              
              {/* Logo / Header Area */}
              <div className="flex flex-col items-center mb-8 relative">
                {/* Decorative Line & Dot */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-brand-primary/20"></div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-brand-primary"></div>
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/guapura%20logo_Mesa%20de%20trabajo%201.png"
                  alt="Guapura Boutique"
                  className="h-16 w-auto object-contain mb-3"
                />
                <div className="text-[10px] font-bold text-brand-accent tracking-[0.3em] uppercase">
                  Acceso Comercial
                </div>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Email Input */}
                <div className="relative">
                  <input 
                    required 
                    type="email" 
                    name="email" 
                    placeholder="Correo electrónico" 
                    className="w-full text-sm border border-gray-200/60 bg-white/80 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-gray-400" 
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input 
                    required 
                    type="password" 
                    name="password" 
                    placeholder="Contraseña" 
                    className="w-full text-sm border border-gray-200/60 bg-white/80 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-gray-400" 
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={isUploading} className="w-full bg-brand-primary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:bg-brand-accent transition-colors mt-2 disabled:opacity-70 shadow-lg shadow-brand-primary/20">
                  {isUploading ? 'Verificando...' : 'Ingresar'}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* TEAM MANAGEMENT MODAL */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Gestión de Equipo
              </h3>
              <button onClick={() => setIsTeamModalOpen(false)} className="text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="bg-brand-primary/5 text-brand-primary p-4 rounded-xl mb-6">
                <p className="text-sm">La gestión de usuarios y roles está integrada directamente en el panel administrativo principal.</p>
                <a href="/admin/collections/users" className="mt-3 w-full block text-center bg-brand-primary text-white text-sm font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                  Ir al Administrador de Usuarios
                </a>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <button onClick={() => { if(confirm('¿Seguro que deseas cerrar sesión?')) { logoutUser().then(() => window.location.reload()); } }} className="w-full border border-red-200 text-red-500 font-bold text-sm py-2.5 rounded-lg hover:bg-red-50 transition-colors">
                  Cerrar Sesión Actual
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                {shareTargetProduct ? `Compartir: ${shareTargetProduct.name}` : 'Compartir Catálogo Guapura Boutique'}
              </h3>
              <button onClick={closeShareModal} className="text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-600">
                {shareTargetProduct
                  ? 'Comparte el enlace directo de esta prenda por WhatsApp o cópialo para enviarlo a tus clientes:'
                  : 'Comparte el enlace del catálogo virtual completo de Guapura Boutique con tus clientes:'}
              </p>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2.5">
                <input
                  type="text"
                  readOnly
                  value={getShareUrl()}
                  className="flex-1 bg-transparent text-xs text-gray-700 focus:outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-accent transition-colors shrink-0"
                >
                  {copiedLink ? '¡Copiado!' : 'Copiar Link'}
                </button>
              </div>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  shareTargetProduct
                    ? `Mira esta prenda de Guapura Boutique: *${shareTargetProduct.name}*${shareTargetProduct.price ? ` (${shareTargetProduct.price})` : ''} 👉 ${getShareUrl()}`
                    : `✨ Descubre el catálogo virtual de *Guapura Boutique* aquí 👉 ${getShareUrl()}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Enviar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MANAGER MODAL */}
      {isCategoryManagerOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/70 shrink-0">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                Gestionar Categorías
              </h3>
              <button onClick={() => setIsCategoryManagerOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs text-gray-500">
                Categorías activas en Guapura Boutique. Puedes eliminar las que ya no uses o agregar nuevas.
              </p>

              {/* Lista de Categorías */}
              <div className="space-y-2">
                {categoriesList.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100/70 transition-colors border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-brand-primary">
                        <span className="scale-75" dangerouslySetInnerHTML={{ __html: cat.icon || '' }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                    </div>

                    <button
                      type="button"
                      disabled={deletingCatId === cat.id}
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-40"
                      title={`Eliminar categoría ${cat.name}`}
                    >
                      {deletingCatId === cat.id ? (
                        <svg className="w-4 h-4 animate-spin text-red-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Formulario Agregar Nueva Categoría */}
              <form onSubmit={handleCreateCategory} className="pt-4 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  required
                  value={newCatNameInput}
                  onChange={(e) => setNewCatNameInput(e.target.value)}
                  placeholder="Nueva categoría (ej. Enterizos...)"
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                />
                <button
                  type="submit"
                  disabled={isSubmittingCat || !newCatNameInput.trim()}
                  className="bg-brand-primary text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-brand-accent transition-colors disabled:opacity-50 shrink-0"
                >
                  {isSubmittingCat ? 'Creando...' : '+ Agregar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/70 shrink-0">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                {editingProduct ? 'Editar Prenda' : 'Subir Nueva Prenda'}
              </h3>
              <button onClick={() => { setIsUploadModalOpen(false); setEditingProduct(null); }} className="text-gray-400 hover:text-gray-700 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5">
              <form key={editingProduct?.id || 'new'} onSubmit={handleUploadProduct} className="space-y-5">
                
                {/* 1. SECCIÓN DE FOTOS (CÁMARA / GALERÍA) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[11px] font-bold text-brand-primary uppercase tracking-wider">
                      Fotografías de la Prenda {editingProduct ? '(Opcional cambiar)' : '*'}
                    </label>
                    <span className="text-[10px] text-gray-400">Hasta 3 fotos</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { slot: 'image1', label: 'Foto 1 *', required: !editingProduct && !imagePreviews.image1 },
                      { slot: 'image2', label: 'Foto 2', required: false },
                      { slot: 'image3', label: 'Foto 3', required: false },
                    ].map(({ slot, label, required }) => (
                      <div key={slot} className="relative aspect-square">
                        {imagePreviews[slot] ? (
                          <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-brand-primary relative group bg-gray-50 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imagePreviews[slot]!} alt={label} className="w-full h-full object-cover" />
                            <label htmlFor={`file-${slot}`} className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-center p-1">
                              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              Cambiar
                            </label>
                            <button
                              type="button"
                              onClick={() => setImagePreviews(prev => ({ ...prev, [slot]: null }))}
                              className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 shadow-sm hover:bg-white"
                              title="Eliminar foto"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor={`file-${slot}`}
                            className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:border-brand-primary hover:bg-brand-light-blue/20 transition-all bg-gray-50/50 group"
                          >
                            <div className="w-8 h-8 rounded-full bg-brand-light-blue text-brand-primary flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 leading-tight">{label}</span>
                            <span className="text-[9px] text-gray-400 mt-0.5">Tomar o subir</span>
                          </label>
                        )}
                        <input
                          id={`file-${slot}`}
                          type="file"
                          name={slot}
                          accept="image/*"
                          required={required}
                          onChange={(e) => handleImageChange(slot, e)}
                          className="hidden"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. NOMBRE Y PRECIO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">Nombre de la Prenda *</label>
                    <input required type="text" name="name" defaultValue={editingProduct?.name || ''} placeholder="Ej. Vestido Gala Satinado" className="w-full text-base sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">Precio</label>
                    <input type="text" inputMode="numeric" name="price" defaultValue={editingProduct?.price || ''} placeholder="Ej. $120.000" className="w-full text-base sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" />
                  </div>
                </div>

                {/* 3. CATEGORÍA */}
                <div className="flex gap-3 flex-col">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">Categoría *</label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryManagerOpen(true)}
                        className="text-[10px] font-bold text-brand-primary hover:text-brand-accent transition-colors"
                      >
                        ⚙️ Administrar / Eliminar
                      </button>
                    </div>
                    <select 
                      required 
                      name="categoryId" 
                      defaultValue={editingProduct?.categoryId || ''} 
                      className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white"
                      onChange={(e) => {
                        const newCatInput = document.getElementById('newCategoryContainer');
                        if (newCatInput) {
                          newCatInput.style.display = e.target.value === 'new' ? 'block' : 'none';
                        }
                      }}
                    >
                      <option value="">Seleccionar categoría...</option>
                      {categoriesList.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                      <option value="new">+ Crear otra categoría...</option>
                    </select>
                  </div>
                  
                  <div id="newCategoryContainer" style={{ display: 'none' }} className="flex-1">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">Nombre de la nueva categoría *</label>
                    <input type="text" name="newCategoryName" placeholder="Ej. Conjuntos, Faldas, Enterizos..." className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary" />
                  </div>
                </div>

                {/* 4. SELECTOR INTERACTIVO DE TALLAS */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">Tallas Disponibles</label>
                    {selectedSizes.length > 0 && (
                      <span className="text-[10px] text-brand-primary font-bold">
                        {selectedSizes.join(', ')}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {PRESET_SIZES.map(size => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            isSelected 
                              ? 'bg-brand-primary text-white scale-105' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200/60'
                          }`}
                        >
                          {isSelected ? `✓ ${size}` : size}
                        </button>
                      );
                    })}
                  </div>

                  {/* Agregar otra talla personalizada */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <input
                      type="text"
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSize(); } }}
                      placeholder="Otra talla (ej. 36, 38, 8...)"
                      className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 flex-1 focus:outline-none focus:border-brand-primary"
                    />
                    <button
                      type="button"
                      onClick={addCustomSize}
                      className="px-2.5 py-1.5 bg-gray-100 hover:bg-brand-light-blue text-brand-primary text-xs font-bold rounded-lg transition-colors shrink-0"
                    >
                      + Añadir
                    </button>
                  </div>
                  <input type="hidden" name="sizes" value={selectedSizes.join(', ')} />
                </div>

                {/* 5. SELECTOR INTERACTIVO DE COLORES */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">Colores Disponibles</label>
                    {selectedColors.length > 0 && (
                      <span className="text-[10px] text-brand-primary font-bold">
                        {selectedColors.join(', ')}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {PRESET_COLORS.map(col => {
                      const isSelected = selectedColors.includes(col.name);
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => toggleColor(col.name)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                            isSelected 
                              ? 'bg-brand-primary text-white scale-105' 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <span 
                            className="w-3 h-3 rounded-full shrink-0 border"
                            style={{ background: col.bg, borderColor: col.border }} 
                          />
                          <span>{col.name}</span>
                          {isSelected && <span className="text-[10px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Agregar otro color */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <input
                      type="text"
                      value={customColorInput}
                      onChange={(e) => setCustomColorInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomColor(); } }}
                      placeholder="Otro color (ej. Palo de rosa, Mostaza...)"
                      className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 flex-1 focus:outline-none focus:border-brand-primary"
                    />
                    <button
                      type="button"
                      onClick={addCustomColor}
                      className="px-2.5 py-1.5 bg-gray-100 hover:bg-brand-light-blue text-brand-primary text-xs font-bold rounded-lg transition-colors shrink-0"
                    >
                      + Añadir
                    </button>
                  </div>
                  <input type="hidden" name="colors" value={selectedColors.join(', ')} />
                </div>

                {/* 6. DESCRIPCIÓN */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">Descripción / Detalles de la prenda</label>
                  <textarea name="description" rows={3} defaultValue={editingProduct?.descriptionText || ''} placeholder="Ej. Tela fresca y suave al tacto, horma perfecta, ideal para ocasiones casuales o elegantes..." className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none"></textarea>
                </div>

                {/* 7. ETIQUETA NUEVO */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input type="checkbox" name="isNew" id="isNew" value="true" defaultChecked={editingProduct?.isNew || false} className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  <label htmlFor="isNew" className="text-xs text-gray-700 font-semibold cursor-pointer">
                    Destacar con etiqueta <span className="bg-brand-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">Nuevo</span>
                  </label>
                </div>

                {/* BOTÓN SUBMIT */}
                <div className="pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isUploading} className="w-full bg-brand-primary text-white font-bold text-sm py-3.5 rounded-xl hover:bg-brand-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20">
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {editingProduct ? 'Guardando cambios...' : 'Publicando en el catálogo...'}
                      </>
                    ) : (editingProduct ? 'Guardar Cambios' : 'Publicar Prenda')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE MÓVIL (FAB) PARA SUBIR PRENDAS (SOLO ADMIN / COMERCIAL) */}
      {canCreate && (
        <button
          type="button"
          onClick={() => openUploadModal(null)}
          className="fixed bottom-6 right-5 z-40 bg-brand-primary text-white shadow-2xl rounded-full pl-3 pr-5 py-2.5 flex items-center gap-2.5 font-bold text-sm active:scale-95 transition-all border-2 border-white/60 shadow-brand-primary/30"
          title="Subir Nueva Prenda"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app-icon.png" alt="Guapura" className="w-8 h-8 rounded-full object-cover bg-white p-0.5 shadow-sm" />
          <span>Subir Prenda</span>
        </button>
      )}

      {/* BOTÓN FLOTANTE FAB PARA INSTALAR LA APP */}
      {isInstallable && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`fixed z-40 shadow-2xl rounded-full flex items-center gap-2.5 font-bold active:scale-95 transition-all ${
            canCreate
              ? 'bottom-6 left-5 bg-white text-brand-primary border-2 border-brand-primary/30 pl-2.5 pr-4 py-2 text-xs hover:bg-brand-light-blue shadow-brand-primary/20'
              : 'bottom-6 right-5 bg-brand-primary text-white border-2 border-white/60 pl-3 pr-5 py-3 text-sm hover:bg-brand-accent shadow-brand-primary/30'
          }`}
          title="Instalar App Guapura en tu celular"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/app-icon.png"
            alt="Guapura App"
            className={`rounded-full object-cover shadow-sm ${
              canCreate ? 'w-7 h-7 border border-brand-primary/20' : 'w-8 h-8 bg-white p-0.5'
            }`}
          />
          <span className="tracking-tight">Instalar App</span>
        </button>
      )}

      {/* MODAL GUÍA DE INSTALACIÓN PWA */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/app-icon.png" alt="Guapura Logo" className="w-14 h-14 rounded-2xl shadow-md border border-gray-100 object-cover" />
                <div>
                  <h3 className="font-black text-gray-900 text-lg">Instalar Guapura</h3>
                  <p className="text-xs text-brand-primary font-semibold">Boutique en tu Pantalla de Inicio</p>
                </div>
              </div>
              <button onClick={() => setShowInstallModal(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Disfruta de la app oficial de Guapura Boutique directamente en la pantalla de tu celular con este ícono, accediendo al catálogo al instante.
            </p>

            <div className="space-y-3 mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-700">
              <div className="font-bold text-brand-primary flex items-center gap-1.5">
                <span>📱 En iPhone (Safari):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 pl-1 text-gray-600">
                <li>Toca el botón <strong>Compartir</strong> (ícono cuadrado con flecha ⬆️ en la barra inferior de Safari).</li>
                <li>Desliza hacia abajo y pulsa <strong>&quot;Agregar al inicio&quot;</strong> (o &quot;Añadir a pantalla de inicio&quot; ➕).</li>
                <li>Toca <strong>&quot;Agregar&quot;</strong> arriba a la derecha.</li>
              </ol>

              <div className="pt-2 border-t border-gray-200 font-bold text-brand-primary flex items-center gap-1.5">
                <span>🤖 En Android (Chrome):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 pl-1 text-gray-600">
                <li>Toca los <strong>tres puntos (⋮)</strong> en la esquina superior derecha.</li>
                <li>Selecciona <strong>&quot;Instalar aplicación&quot;</strong> o <strong>&quot;Agregar a la pantalla principal&quot;</strong>.</li>
                <li>Confirma tocando <strong>&quot;Instalar&quot;</strong>.</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={() => setShowInstallModal(false)}
              className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-accent transition-colors text-sm shadow-md"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
