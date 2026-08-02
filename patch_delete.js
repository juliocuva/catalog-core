const fs = require('fs');
let content = fs.readFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', 'utf8');

// 1. Add import
if (!content.includes('deleteProduct')) {
  content = content.replace(
    /import \{ uploadProduct \} from '@\/app\/actions\/uploadProduct'/g,
    `import { uploadProduct } from '@/app/actions/uploadProduct'\nimport { deleteProduct } from '@/app/actions/deleteProduct'`
  );
}

// 2. Add handler
const handlerFn = `
  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const result = await deleteProduct(productId);
      if (!result.success) {
        alert('Error: ' + result.error);
      }
    }
  };
`;
if (!content.includes('handleDeleteProduct')) {
  content = content.replace(
    /const handleUploadProduct = async/g,
    handlerFn + '\n  const handleUploadProduct = async'
  );
}

// 3. Add delete button to product card
const deleteBtn = `
                <button onClick={() => handleDeleteProduct(product.id)} className="absolute top-2 right-2 z-10 bg-white/90 shadow-sm p-1.5 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100" title="Eliminar producto">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
`;
if (!content.includes('handleDeleteProduct(product.id)')) {
  content = content.replace(
    /(<span className="absolute top-2 left-2.*?<\/span>\s*\}?\s*)/g,
    `$1${deleteBtn}`
  );
}

fs.writeFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', content);
