const fs = require('fs');
let content = fs.readFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', 'utf8');

// 1. Add import
if (!content.includes('uploadProduct')) {
  content = content.replace(
    /import \{ useState \} from 'react'/g,
    `import { useState } from 'react'\nimport { uploadProduct } from '@/app/actions/uploadProduct'`
  );
}

// 2. Add State
if (!content.includes('isUploadModalOpen')) {
  content = content.replace(
    /const \[isShareModalOpen, setIsShareModalOpen\] = useState\(false\);/g,
    `const [isShareModalOpen, setIsShareModalOpen] = useState(false);\n  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);\n  const [isUploading, setIsUploading] = useState(false);`
  );
}

// 3. Add handler function
const handlerFn = `
  const handleUploadProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    const result = await uploadProduct(formData);
    setIsUploading(false);
    if (result.success) {
      setIsUploadModalOpen(false);
      alert('¡Producto creado exitosamente!');
    } else {
      alert('Error: ' + result.error);
    }
  };
`;
if (!content.includes('handleUploadProduct')) {
  content = content.replace(
    /const closeShareModal = \(\) => \{/g,
    handlerFn + '\n  const closeShareModal = () => {'
  );
}

// 4. Replace Desktop Link
content = content.replace(
  /<Link href="\/admin" target="_blank" className="p-2 hover:bg-gray-100 rounded-full transition-colors">([\s\S]*?)<\/Link>/g,
  `<button onClick={() => setIsUploadModalOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">$1</button>`
);

// 5. Replace Mobile Link
content = content.replace(
  /<Link href="\/admin" target="_blank" className="flex flex-col items-center text-gray-600 hover:text-brand-primary transition-colors">([\s\S]*?)<\/Link>/g,
  `<button onClick={() => setIsUploadModalOpen(true)} className="flex flex-col items-center text-gray-600 hover:text-brand-primary transition-colors">$1</button>`
);

// 6. Add the Modal UI
const uploadModalUI = `
      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-accent/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Crear Nuevo Producto
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleUploadProduct} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">Nombre del Producto *</label>
                  <input required type="text" name="name" placeholder="Ej. Tenis Runner" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">Precio *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <input required type="number" step="0.01" name="price" placeholder="0.00" className="w-full text-sm border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">Categoría *</label>
                    <select required name="categoryId" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white">
                      <option value="">Seleccionar...</option>
                      {initialCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">Descripción</label>
                  <textarea name="description" rows={2} placeholder="Opcional..." className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">Fotografía (PNG) *</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input required type="file" name="image" accept="image/png, image/jpeg, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <svg className="w-8 h-8 text-brand-primary/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-sm font-medium text-brand-primary">Haz clic o arrastra una imagen</span>
                    <span className="text-xs text-gray-500 mt-1">Recomendado: PNG con fondo transparente</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" name="isNew" id="isNew" value="true" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  <label htmlFor="isNew" className="text-sm text-gray-700 font-medium">Marcar como "Nuevo!"</label>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isUploading} className="w-full bg-brand-primary text-white font-bold text-sm py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Creando producto...
                      </>
                    ) : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(
  /    <\/div>\n  \)\n\}\n$/g,
  uploadModalUI + '\n    </div>\n  )\n}\n'
);

fs.writeFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', content);
