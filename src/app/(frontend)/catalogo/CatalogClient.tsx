'use client';

import Link from 'next/link'
import { useState } from 'react'
import { uploadProduct } from '@/app/actions/uploadProduct'
import { updateProduct } from '@/app/actions/updateProduct'
import { deleteProduct } from '@/app/actions/deleteProduct'
import { loginUser, logoutUser } from '@/app/actions/loginUser'

export default function CatalogClient({ initialProducts, initialCategories, isAdmin = false, userRole = null }: { initialProducts: any[], initialCategories: any[], isAdmin?: boolean, userRole?: string | null }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isLinkGenerated, setIsLinkGenerated] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Team Management State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isSubmittingTeam, setIsSubmittingTeam] = useState(false);

  const mappedProducts = initialProducts.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand?.name || 'General',
    categoryId: p.category?.id || (p.category ? p.category : null),
    image: p.mockImageUrl || p.images?.[0]?.image?.url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
    isNew: p.isNew || false
  }));

  const filteredProducts = selectedCategoryId 
    ? mappedProducts.filter(p => p.categoryId === selectedCategoryId)
    : mappedProducts;

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const clientName = (form.elements[0] as HTMLInputElement).value;
    
    try {
      const response = await fetch('/api/share-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          uniqueCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        }),
      });
      const data = await response.json();
      
      if(data.doc) {
        setGeneratedLink(`catalogo.empresa.com/s/${data.doc.uniqueCode}`);
        setIsLinkGenerated(true);
      }
    } catch(err) {
      console.error('Error generating link', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const result = await deleteProduct(productId);
      if (!result.success) {
        alert('Error: ' + result.error);
      }
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
    setTimeout(() => {
      setIsLinkGenerated(false);
      setGeneratedLink('');
    }, 300);
  };

  const canEdit = isAdmin && ['administrador', 'comercial', 'diseñador'].includes(userRole || '');
  const canDelete = isAdmin && ['administrador', 'comercial'].includes(userRole || '');
  const canCreate = isAdmin && ['administrador', 'comercial'].includes(userRole || '');

  return (
    <div className="bg-background min-h-screen pb-24 font-sans text-foreground w-full relative">
      {/* Top Nav */}
      <div className="bg-brand-primary text-white text-[10px] py-1.5 px-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <span>Envío gratis a todo el país por compras superiores a $150.000</span>
           <div className="flex gap-4">
             <a href="#" className="hover:text-brand-accent transition-colors">Seguimiento de pedido</a>
             <a href="#" className="hover:text-brand-accent transition-colors">Ayuda</a>
           </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 mb-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center gap-6">
          
          {/* Logo */}
          <Link href="/" className="text-xl font-black text-brand-primary tracking-tighter block hover:opacity-80 transition-opacity cursor-pointer">
            CATALOG<span className="text-brand-accent">CORE</span>
          </Link>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-brand-primary">
            {/* User / Login */}
            <button onClick={handleUserIconClick} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-brand-primary" title={isAdmin ? "Opciones de Cuenta" : "Iniciar Sesión"}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            {/* Create Product (Admin only) */}
            {canCreate && (
              <button onClick={() => { setEditingProduct(null); setIsUploadModalOpen(true); }} className="p-2 rounded-full transition-colors bg-brand-primary text-white hover:bg-blue-700 ml-2 shadow-sm" title="Crear Producto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
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
            Categorías
          </h3>
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

          {initialCategories.map((cat, idx) => {
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
            Recomendados
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex flex-col group hover:-translate-y-1 transition-transform border border-brand-gray/30">
              {/* Image Container */}
              <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                {product.isNew && (
                  <span className="absolute top-2 left-2 z-10 bg-brand-accent text-white text-[9px] font-bold px-2 py-1 rounded">
                    New!
                  </span>
                )}
                {canEdit && (
                  <button onClick={(e) => { e.preventDefault(); setEditingProduct(product); setIsUploadModalOpen(true); }} className="absolute top-2 right-12 z-20 bg-white shadow-sm p-1.5 rounded-full text-brand-primary hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100" title="Editar producto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                )}
                {canDelete && (
                  <button onClick={(e) => { e.preventDefault(); handleDeleteProduct(product.id) }} className="absolute top-2 right-2 z-20 bg-white shadow-sm p-1.5 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100" title="Eliminar producto">
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
                <div>
                  <h4 className="text-xs font-normal text-gray-800 leading-snug line-clamp-2 mb-1">{product.name}</h4>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={(e) => { e.preventDefault(); setIsShareModalOpen(true); }}
                    className="w-8 h-8 flex-shrink-0 bg-brand-primary border border-brand-primary rounded-lg flex items-center justify-center text-brand-light-gray hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </button>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent('Hola, me interesa el producto ' + product.name)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-brand-light-blue text-brand-primary text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-brand-light-blue/80 transition-colors shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5 text-brand-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    Asesor
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOGIN MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="px-8 pt-10 pb-8">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="font-black text-2xl text-center text-gray-900 mb-2">Acceso al Sistema</h3>
              <p className="text-sm text-gray-500 text-center mb-6">Ingresa tus credenciales para administrar el catálogo.</p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Email</label>
                  <input required type="email" name="email" placeholder="usuario@empresa.com" className="w-full text-sm border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Contraseña</label>
                  <input required type="password" name="password" placeholder="••••••••" className="w-full text-sm border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                </div>
                <button type="submit" disabled={isUploading} className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-2 disabled:opacity-50">
                  {isUploading ? 'Verificando...' : 'Iniciar Sesión'}
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
                <p className="text-sm">Para mantener el sistema seguro, la creación de usuarios debe realizarse desde el panel administrativo completo.</p>
                <a href="/admin/collections/users/create" target="_blank" className="mt-3 w-full block text-center bg-brand-primary text-white text-sm font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                  Ir al panel para crear usuario
                </a>
              </div>
              <button onClick={() => { if(confirm('¿Seguro que deseas cerrar sesión?')) { logoutUser().then(() => window.location.reload()); } }} className="w-full border border-red-200 text-red-500 font-bold text-sm py-2.5 rounded-lg hover:bg-red-50 transition-colors">
                Cerrar Sesión Actual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h3>
              <button onClick={() => { setIsUploadModalOpen(false); setEditingProduct(null); }} className="text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleUploadProduct} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">Nombre del Producto *</label>
                  <input required type="text" name="name" defaultValue={editingProduct?.name || ''} placeholder="Ej. Tenis Runner" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">Categoría *</label>
                    <select required name="categoryId" defaultValue={editingProduct?.categoryId || ''} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white">
                      <option value="">Seleccionar...</option>
                      {initialCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">Fotografías (Hasta 3) *</label>
                  <div className="space-y-2">
                    <input {...(editingProduct ? {} : {required: true})} type="file" name="image1" accept="image/png, image/jpeg, image/webp" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20" />
                    <input type="file" name="image2" accept="image/png, image/jpeg, image/webp" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20" />
                    <input type="file" name="image3" accept="image/png, image/jpeg, image/webp" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20" />
                  </div>
                  <span className="text-xs text-gray-500 mt-2 block">El sistema las optimizará automáticamente a formato WebP (máx 800x800px). En móviles podrás usar la cámara o tu galería.</span>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" name="isNew" id="isNew" value="true" defaultChecked={editingProduct?.isNew || false} className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  <label htmlFor="isNew" className="text-sm text-gray-700 font-medium">Marcar como "Nuevo!"</label>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isUploading} className="w-full bg-brand-primary text-white font-bold text-sm py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {editingProduct ? 'Actualizando...' : 'Creando producto...'}
                      </>
                    ) : (editingProduct ? 'Actualizar' : 'Crear Producto')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
