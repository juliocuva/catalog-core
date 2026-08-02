const fs = require('fs');

// 1. Update page.tsx
let pageContent = fs.readFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/page.tsx', 'utf8');

if (!pageContent.includes('headers()')) {
  pageContent = pageContent.replace(
    /import configPromise from '@payload-config'/g,
    `import configPromise from '@payload-config'\nimport { headers } from 'next/headers'`
  );
  
  pageContent = pageContent.replace(
    /const payload = await getPayload\(\{ config: await configPromise \}\)/g,
    `const payload = await getPayload({ config: await configPromise })\n  const { user } = await payload.auth({ headers: await headers() })\n  const isAdmin = !!user;`
  );

  pageContent = pageContent.replace(
    /initialCategories=\{categories\} \/>/g,
    `initialCategories={categories} isAdmin={isAdmin} />`
  );
  
  fs.writeFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/page.tsx', pageContent);
}

// 2. Update CatalogClient.tsx
let clientContent = fs.readFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', 'utf8');

if (!clientContent.includes('isAdmin?: boolean')) {
  clientContent = clientContent.replace(
    /initialCategories: any\[\] \}\)/g,
    `initialCategories: any[], isAdmin?: boolean })`
  );
  
  // Wrap Admin buttons with isAdmin check
  // Desktop Admin button
  clientContent = clientContent.replace(
    /\{\/\* Admin \(Desktop\) \*\/\}\n\s*<button onClick=\{\(\) => \{ setEditingProduct\(null\); setIsUploadModalOpen\(true\); \}\}/g,
    `{/* Admin (Desktop) */}\n            {isAdmin && (\n              <button onClick={() => { setEditingProduct(null); setIsUploadModalOpen(true); }}`
  );
  clientContent = clientContent.replace(
    /<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" \/><\/svg>\n\s*<\/button>/g,
    `<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>\n              </button>\n            )}`
  );

  // Mobile Admin button
  clientContent = clientContent.replace(
    /<button onClick=\{\(\) => \{ setEditingProduct\(null\); setIsUploadModalOpen\(true\); \}\} className="flex flex-col items-center text-gray-600 hover:text-brand-primary transition-colors">/g,
    `{isAdmin && (<button onClick={() => { setEditingProduct(null); setIsUploadModalOpen(true); }} className="flex flex-col items-center text-gray-600 hover:text-brand-primary transition-colors">`
  );
  clientContent = clientContent.replace(
    /<span className="text-\[9px\] font-bold">Admin<\/span>\n\s*<\/button>\n\s*<\/div>/g,
    `<span className="text-[9px] font-bold">Admin</span>\n        </button>)}\n      </div>`
  );

  // Product Card Edit & Delete buttons
  const replaceCardButtons = `
                {isAdmin && (
                  <>
                    <button onClick={(e) => { e.preventDefault(); setEditingProduct(product); setIsUploadModalOpen(true); }} className="absolute top-2 right-12 z-20 bg-white shadow-sm p-1.5 rounded-full text-brand-primary hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100" title="Editar producto">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={(e) => { e.preventDefault(); handleDeleteProduct(product.id) }} className="absolute top-2 right-2 z-20 bg-white shadow-sm p-1.5 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100" title="Eliminar producto">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </>
                )}
  `;

  clientContent = clientContent.replace(
    /<button onClick=\{\(e\) => \{ e\.preventDefault\(\); setEditingProduct\(product\);[\s\S]*?<path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M19 7l.*?<\/svg>\n\s*<\/button>/g,
    replaceCardButtons.trim()
  );

  fs.writeFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', clientContent);
}

