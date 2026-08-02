const fs = require('fs');
let content = fs.readFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', 'utf8');

// 1. Desktop Nav Update
const desktopUserAndCreate = `
            {/* User / Login */}
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-brand-primary" title="Acceso al Sistema">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </Link>
            {/* Create Product (Admin only) */}
            {isAdmin && (
              <button onClick={() => { setEditingProduct(null); setIsUploadModalOpen(true); }} className="p-2 rounded-full transition-colors bg-brand-primary text-white hover:bg-blue-700 ml-2 shadow-sm" title="Crear Producto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            )}
`;

content = content.replace(
  /\{\/\* Admin \(Desktop\) \*\/\}\s*\{isAdmin && \(\s*<button onClick=\{\(\) => \{ setEditingProduct\(null\); setIsUploadModalOpen\(true\); \}\} className="p-2 hover:bg-gray-100 rounded-full transition-colors">.*?<\/button>\s*\)\}/s,
  desktopUserAndCreate.trim()
);

// 2. Mobile Nav Update
const mobileUserAndCreate = `
        {/* User / Login */}
        <Link href="/admin" className="flex flex-col items-center text-gray-600 hover:text-brand-primary transition-colors">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[9px] font-bold">Cuenta</span>
        </Link>
        {/* Create Product (Admin only) */}
        {isAdmin && (<button onClick={() => { setEditingProduct(null); setIsUploadModalOpen(true); }} className="flex flex-col items-center text-brand-primary transition-colors">
          <div className="bg-brand-primary text-white rounded-full p-1 mb-0.5 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className="text-[9px] font-bold">Crear</span>
        </button>)}
`;

content = content.replace(
  /\{isAdmin && \(<button onClick=\{\(\) => \{ setEditingProduct\(null\); setIsUploadModalOpen\(true\); \}\} className="flex flex-col items-center text-gray-600 hover:text-brand-primary transition-colors">.*?<\/button>\)\}/s,
  mobileUserAndCreate.trim()
);

fs.writeFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', content);
